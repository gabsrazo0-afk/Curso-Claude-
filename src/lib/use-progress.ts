"use client";

import { useCallback, useMemo, useSyncExternalStore } from "react";
import { curriculum } from "@/content/curriculum";
import {
  completeMission,
  computeStats,
  recordActivity,
  saveLastStep,
  type ProgressState,
  type ProgressStats,
} from "./progress";
import {
  acknowledgeRecovery,
  getProgressSnapshot,
  getServerProgressSnapshot,
  resetProgress,
  subscribeToProgress,
  updateProgress,
  type StorageStatus,
} from "./progress-store";

export type ProgressView =
  | { status: "loading" }
  | {
      status: "ready";
      state: ProgressState;
      stats: ProgressStats;
      storage: StorageStatus;
    };

export function useProgress() {
  const snapshot = useSyncExternalStore(
    subscribeToProgress,
    getProgressSnapshot,
    getServerProgressSnapshot,
  );

  const view = useMemo<ProgressView>(() => {
    if (!snapshot) return { status: "loading" };
    return {
      status: "ready",
      state: snapshot.state,
      stats: computeStats(curriculum, snapshot.state, new Date()),
      storage: snapshot.storage,
    };
  }, [snapshot]);

  const complete = useCallback((missionId: string) => {
    updateProgress((s) => completeMission(s, missionId, new Date()));
  }, []);

  const rememberStep = useCallback((missionId: string, step: number) => {
    updateProgress((s) => recordActivity(saveLastStep(s, missionId, step), new Date()));
  }, []);

  return {
    view,
    complete,
    rememberStep,
    reset: resetProgress,
    acknowledgeRecovery,
  };
}
