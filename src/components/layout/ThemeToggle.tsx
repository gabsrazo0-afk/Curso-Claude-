"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/lib/theme";

/** Alterna entre tema claro y oscuro; la elección se guarda en el navegador. */
export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme !== "light";
  const label = theme === null ? "Cambiar tema" : isDark ? "Activar tema claro" : "Activar tema oscuro";

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={label}
      title={label}
      className="grid size-9 place-items-center rounded-xl border border-border-strong bg-surface text-fg-muted transition-colors hover:border-primary hover:text-primary-ink"
    >
      {theme === null ? (
        <span className="size-4" aria-hidden="true" />
      ) : isDark ? (
        <Sun className="size-4" aria-hidden="true" />
      ) : (
        <Moon className="size-4" aria-hidden="true" />
      )}
    </button>
  );
}
