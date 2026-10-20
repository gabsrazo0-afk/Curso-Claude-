import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MissionView } from "@/components/mission/MissionView";
import { allMissions, getMission } from "@/content/curriculum";

/** Solo existen las rutas del temario; el resto devuelve 404. */
export const dynamicParams = false;

export function generateStaticParams() {
  return allMissions.map((mission) => ({ missionId: mission.id }));
}

export async function generateMetadata({ params }: PageProps<"/misiones/[missionId]">): Promise<Metadata> {
  const { missionId } = await params;
  const found = getMission(missionId);
  return found
    ? { title: found.mission.title, description: found.mission.summary }
    : { title: "Misión no encontrada" };
}

export default async function MissionPage({ params }: PageProps<"/misiones/[missionId]">) {
  const { missionId } = await params;
  if (!getMission(missionId)) notFound();
  return <MissionView missionId={missionId} />;
}
