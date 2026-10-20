import type { MentorFaq } from "./types";

export const mentorName = "Nova";

export const mentorFaqs: MentorFaq[] = [
  {
    id: "como-funciona",
    question: "¿Cómo funciona la academia?",
    answer:
      "El curso se divide en módulos y cada módulo en misiones cortas. Completa una misión para ganar experiencia y desbloquear la siguiente.",
  },
  {
    id: "progreso",
    question: "¿Dónde se guarda mi progreso?",
    answer:
      "En este navegador, usando el almacenamiento local. No necesitas cuenta. Si borras los datos del navegador o cambias de dispositivo, empezarás de nuevo.",
  },
  {
    id: "bloqueado",
    question: "¿Por qué hay módulos bloqueados?",
    answer:
      "Cada módulo se apoya en el anterior. Termina todas las misiones de un módulo para desbloquear el siguiente.",
  },
  {
    id: "fallo",
    question: "¿Qué pasa si fallo una pregunta?",
    answer:
      "Nada grave: verás una explicación y podrás volver a intentarlo tantas veces como quieras.",
  },
  {
    id: "teclado",
    question: "¿Puedo usar la academia solo con el teclado?",
    answer:
      "Sí. Usa Tab para moverte, Intro o Espacio para activar botones y Esc para cerrar este panel.",
  },
];
