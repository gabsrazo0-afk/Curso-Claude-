import { Logo } from "./Logo";
import { ThemeToggle } from "./ThemeToggle";
import { MentorButton } from "@/components/mentor/MentorButton";

export function AppHeader() {
  return (
    <header className="sticky top-0 z-30 border-b border-border bg-[color-mix(in_srgb,var(--bg)_82%,transparent)] backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <Logo />
        <div className="flex items-center gap-2">
          <MentorButton compact />
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
