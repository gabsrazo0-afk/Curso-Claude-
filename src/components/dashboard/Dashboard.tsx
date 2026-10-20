"use client";

import { useProgress } from "@/lib/use-progress";
import { MentorCard } from "./MentorCard";
import { ModulePath } from "./ModulePath";
import { NextMissionCard } from "./NextMissionCard";
import { ProgressStats } from "./ProgressStats";
import { StorageNotice } from "./StorageNotice";
import { WelcomeHero } from "./WelcomeHero";

export function Dashboard() {
  const { view, reset, acknowledgeRecovery } = useProgress();

  return (
    <div className="space-y-6">
      {view.status === "ready" && <StorageNotice storage={view.storage} onDismiss={acknowledgeRecovery} />}

      <div
        className={
          "grid gap-6 [grid-template-areas:'welcome'_'next'_'stats'_'path'_'mentor'] " +
          "lg:grid-cols-[minmax(0,1fr)_20rem] lg:[grid-template-areas:'welcome_stats'_'next_stats'_'path_mentor']"
        }
      >
        <div className="[grid-area:welcome]">
          <WelcomeHero view={view} />
        </div>
        <div className="[grid-area:next]">
          <NextMissionCard view={view} />
        </div>
        <div className="[grid-area:stats] lg:self-start">
          <ProgressStats view={view} onReset={reset} />
        </div>
        <div className="[grid-area:path]">
          <ModulePath view={view} />
        </div>
        <div className="[grid-area:mentor] lg:sticky lg:top-24 lg:self-start">
          <MentorCard />
        </div>
      </div>
    </div>
  );
}
