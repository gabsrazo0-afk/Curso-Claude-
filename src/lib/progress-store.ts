/**
 * Almacén del progreso en LocalStorage, expuesto a React mediante
 * `useSyncExternalStore`. Si el navegador bloquea el almacenamiento,
 * el progreso se mantiene en memoria durante la sesión.
 */
import { allMissions } from "@/content/curriculum";
import { createEmptyProgress, parseProgress, type ProgressState } from "./progress";

export const PROGRESS_STORAGE_KEY = "cca:progress";

/** ready: guardado normal · memory: sin almacenamiento · recovered: datos dañados reiniciados */
export type StorageStatus = "ready" | "memory" | "recovered";

export interface ProgressSnapshot {
  state: ProgressState;
  storage: StorageStatus;
}

const validIds = new Set(allMissions.map((m) => m.id));
const listeners = new Set<() => void>();
let snapshot: ProgressSnapshot | null = null;

function readFromStorage(): ProgressSnapshot {
  try {
    const raw = window.localStorage.getItem(PROGRESS_STORAGE_KEY);
    const { state, recovered } = parseProgress(raw, validIds);
    return { state, storage: recovered ? "recovered" : "ready" };
  } catch {
    return { state: createEmptyProgress(), storage: "memory" };
  }
}

function emit() {
  for (const listener of listeners) listener();
}

export function getProgressSnapshot(): ProgressSnapshot {
  if (snapshot === null) snapshot = readFromStorage();
  return snapshot;
}

/** En el servidor no hay progreso: la UI muestra su estado de carga. */
export function getServerProgressSnapshot(): ProgressSnapshot | null {
  return null;
}

export function subscribeToProgress(listener: () => void): () => void {
  listeners.add(listener);

  // Sincroniza el progreso entre pestañas abiertas.
  const onStorage = (event: StorageEvent) => {
    if (event.key === PROGRESS_STORAGE_KEY || event.key === null) {
      snapshot = readFromStorage();
      emit();
    }
  };
  window.addEventListener("storage", onStorage);

  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", onStorage);
  };
}

export function updateProgress(updater: (state: ProgressState) => ProgressState): void {
  const current = getProgressSnapshot();
  const next = updater(current.state);
  if (next === current.state) return;

  let storage: StorageStatus = current.storage === "memory" ? "memory" : "ready";
  if (storage === "ready") {
    try {
      window.localStorage.setItem(PROGRESS_STORAGE_KEY, JSON.stringify(next));
    } catch {
      storage = "memory";
    }
  }

  snapshot = { state: next, storage };
  emit();
}

export function resetProgress(): void {
  updateProgress(() => createEmptyProgress());
}

/** Oculta el aviso de datos recuperados una vez que el alumno lo ha leído. */
export function acknowledgeRecovery(): void {
  const current = getProgressSnapshot();
  if (current.storage !== "recovered") return;
  snapshot = { ...current, storage: "ready" };
  emit();
}
