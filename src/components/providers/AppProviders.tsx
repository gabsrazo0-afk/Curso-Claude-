"use client";

import { MotionConfig } from "motion/react";
import type { ReactNode } from "react";
import { MentorPanel } from "@/components/mentor/MentorPanel";

/**
 * Proveedores de cliente. `reducedMotion="user"` desactiva las animaciones de
 * movimiento si el sistema pide reducir el movimiento.
 */
export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <MotionConfig reducedMotion="user">
      {children}
      <MentorPanel />
    </MotionConfig>
  );
}
