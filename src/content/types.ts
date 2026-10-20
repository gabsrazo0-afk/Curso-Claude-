/**
 * Tipos del contenido del curso.
 * Las lecciones viven en archivos estructurados dentro de `src/content`
 * para poder migrarlas más adelante a MDX, JSON o un CMS sin tocar la UI.
 */

export type ModuleIcon =
  | "rocket"
  | "code"
  | "brain"
  | "git"
  | "workflow";

export type MissionStatus = "available" | "coming-soon";

export interface CodeSnippet {
  /** Lenguaje para etiquetar el bloque (bash, text, md…). */
  language: string;
  content: string;
  /** Texto breve que explica el fragmento. */
  caption?: string;
}

export interface MissionStep {
  id: string;
  title: string;
  /** Párrafos. Admite `código en línea` entre comillas invertidas. */
  body: string[];
  code?: CodeSnippet;
  /** Pista que el mentor muestra mientras el alumno está en este paso. */
  mentorTip: string;
}

export interface QuizOption {
  id: string;
  label: string;
}

export interface QuizQuestion {
  id: string;
  prompt: string;
  options: QuizOption[];
  correctOptionId: string;
  /** Se muestra tras responder, acierte o no. */
  explanation: string;
}

export interface Mission {
  id: string;
  title: string;
  summary: string;
  durationMinutes: number;
  xp: number;
  status: MissionStatus;
  objectives: string[];
  steps: MissionStep[];
  quiz: QuizQuestion[];
}

export interface CourseModule {
  id: string;
  title: string;
  description: string;
  icon: ModuleIcon;
  missions: Mission[];
}

export interface MentorFaq {
  id: string;
  question: string;
  answer: string;
}
