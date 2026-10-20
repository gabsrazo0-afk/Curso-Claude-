"use client";

import { useCallback, useSyncExternalStore } from "react";

export type Theme = "light" | "dark";

export const THEME_STORAGE_KEY = "cca:theme";

/**
 * Script que se ejecuta antes de pintar la página para aplicar el tema
 * guardado (o el del sistema) y evitar un destello del tema incorrecto.
 */
export const themeInitScript = `(function(){try{var t=localStorage.getItem("${THEME_STORAGE_KEY}");if(t!=="light"&&t!=="dark"){t=window.matchMedia("(prefers-color-scheme: light)").matches?"light":"dark"}var r=document.documentElement;r.dataset.theme=t;r.style.colorScheme=t}catch(e){}})();`;

const listeners = new Set<() => void>();

function readTheme(): Theme {
  return document.documentElement.dataset.theme === "light" ? "light" : "dark";
}

function applyTheme(theme: Theme) {
  const root = document.documentElement;
  root.dataset.theme = theme;
  root.style.colorScheme = theme;
  for (const listener of listeners) listener();
}

function hasStoredPreference(): boolean {
  try {
    const value = window.localStorage.getItem(THEME_STORAGE_KEY);
    return value === "light" || value === "dark";
  } catch {
    return false;
  }
}

function subscribe(listener: () => void) {
  listeners.add(listener);

  // Mientras el alumno no elija un tema, seguimos el del sistema.
  const media = window.matchMedia("(prefers-color-scheme: light)");
  const onSystemChange = (event: MediaQueryListEvent) => {
    if (!hasStoredPreference()) applyTheme(event.matches ? "light" : "dark");
  };
  media.addEventListener("change", onSystemChange);

  return () => {
    listeners.delete(listener);
    media.removeEventListener("change", onSystemChange);
  };
}

export function useTheme() {
  const theme = useSyncExternalStore<Theme | null>(subscribe, readTheme, () => null);

  const setTheme = useCallback((next: Theme) => {
    try {
      window.localStorage.setItem(THEME_STORAGE_KEY, next);
    } catch {
      // Sin almacenamiento el tema se aplica solo durante esta visita.
    }
    applyTheme(next);
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme(readTheme() === "dark" ? "light" : "dark");
  }, [setTheme]);

  return { theme, setTheme, toggleTheme };
}
