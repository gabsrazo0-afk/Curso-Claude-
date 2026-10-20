import { Brain, Code, GitBranch, Rocket, Workflow, type LucideProps } from "lucide-react";
import type { ModuleIcon as ModuleIconName } from "@/content/types";

const icons = {
  rocket: Rocket,
  code: Code,
  brain: Brain,
  git: GitBranch,
  workflow: Workflow,
} satisfies Record<ModuleIconName, unknown>;

export function ModuleIcon({ name, ...props }: { name: ModuleIconName } & LucideProps) {
  const Icon = icons[name];
  return <Icon aria-hidden="true" {...props} />;
}
