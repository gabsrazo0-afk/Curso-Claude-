import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ModuleDetail } from "@/components/module/ModuleDetail";
import { curriculum, getModule } from "@/content/curriculum";

/** Solo existen las rutas del temario; el resto devuelve 404. */
export const dynamicParams = false;

export function generateStaticParams() {
  return curriculum.map((m) => ({ moduleId: m.id }));
}

export async function generateMetadata({ params }: PageProps<"/modulos/[moduleId]">): Promise<Metadata> {
  const { moduleId } = await params;
  const courseModule = getModule(moduleId);
  return courseModule
    ? { title: courseModule.title, description: courseModule.description }
    : { title: "Módulo no encontrado" };
}

export default async function ModulePage({ params }: PageProps<"/modulos/[moduleId]">) {
  const { moduleId } = await params;
  if (!getModule(moduleId)) notFound();
  return <ModuleDetail moduleId={moduleId} />;
}
