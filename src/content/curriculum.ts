import type { CourseModule, Mission } from "./types";

/** Misión anunciada en la ruta pero cuyo contenido aún no está publicado. */
function comingSoon(
  id: string,
  title: string,
  summary: string,
  durationMinutes: number,
  xp: number,
): Mission {
  return {
    id,
    title,
    summary,
    durationMinutes,
    xp,
    status: "coming-soon",
    objectives: [],
    steps: [],
    quiz: [],
  };
}

export const curriculum: CourseModule[] = [
  {
    id: "primeros-pasos",
    title: "Primeros pasos",
    description:
      "Descubre qué es Claude Code, instálalo y mantén tu primera conversación con él.",
    icon: "rocket",
    missions: [
      {
        id: "conoce-claude-code",
        title: "Conoce a Claude Code",
        summary:
          "Qué es, cómo trabaja contigo y qué tipo de tareas puedes pedirle.",
        durationMinutes: 5,
        xp: 50,
        status: "available",
        objectives: [
          "Entender qué es un asistente de programación agéntico.",
          "Saber quién toma las decisiones en cada paso.",
          "Reconocer tareas que puedes delegar.",
        ],
        steps: [
          {
            id: "que-es",
            title: "Un asistente que trabaja en tu proyecto",
            body: [
              "Claude Code es una herramienta de programación agéntica creada por Anthropic. Funciona en la terminal y también se integra con editores como VS Code y JetBrains.",
              "A diferencia de un chat normal, Claude Code puede leer los archivos de tu proyecto, buscar en el código, proponer cambios y ejecutar comandos para comprobar que todo funciona.",
            ],
            mentorTip:
              "Piensa en Claude Code como un compañero de equipo que se sienta a tu lado: conoce tu código porque puede leerlo, no porque lo adivine.",
          },
          {
            id: "tu-diriges",
            title: "Tú diriges, Claude ejecuta",
            body: [
              "Describes en lenguaje natural lo que necesitas. Claude explora el proyecto, plantea un plan y propone acciones concretas.",
              "Antes de editar archivos o ejecutar comandos, Claude Code te pide permiso. Puedes aprobar, rechazar o explicarle qué prefieres. Siempre tienes la última palabra.",
            ],
            mentorTip:
              "Los permisos son tu red de seguridad. Al principio, revisa cada propuesta con calma: así aprendes cómo razona Claude.",
          },
          {
            id: "que-pedir",
            title: "Qué puedes pedirle",
            body: [
              "Sirve para tareas pequeñas y grandes: entender un proyecto que no conoces, corregir un error, añadir una función, escribir pruebas o preparar un commit.",
              "Cuanto más claro seas sobre el objetivo y el contexto, mejores serán los resultados.",
            ],
            code: {
              language: "text",
              caption: "Ejemplos de peticiones",
              content: [
                "> Explícame qué hace este proyecto y cómo está organizado",
                "> El formulario de registro no valida el email. Corrígelo",
                "> Escribe pruebas para la función calcularTotal",
              ].join("\n"),
            },
            mentorTip:
              "Una buena petición responde a tres preguntas: qué quieres, dónde está el problema y cómo sabrás que está resuelto.",
          },
        ],
        quiz: [
          {
            id: "permiso",
            prompt:
              "¿Qué hace Claude Code antes de modificar un archivo de tu proyecto?",
            options: [
              { id: "a", label: "Lo modifica directamente sin avisar." },
              { id: "b", label: "Te pide permiso para aplicar el cambio." },
              { id: "c", label: "Envía el archivo a otra persona para revisarlo." },
            ],
            correctOptionId: "b",
            explanation:
              "Claude Code solicita tu aprobación antes de editar archivos o ejecutar comandos, salvo que tú cambies esa configuración.",
          },
        ],
      },
      {
        id: "instala-claude-code",
        title: "Instala Claude Code",
        summary: "Prepara tu equipo, instala la herramienta y ábrela por primera vez.",
        durationMinutes: 8,
        xp: 75,
        status: "available",
        objectives: [
          "Instalar Claude Code en tu sistema.",
          "Comprobar que la instalación funciona.",
          "Iniciar una sesión dentro de un proyecto.",
        ],
        steps: [
          {
            id: "requisitos",
            title: "Lo que necesitas",
            body: [
              "Necesitas una terminal (macOS, Linux o Windows) y una cuenta de Claude o de la Consola de Anthropic para iniciar sesión.",
              "No hace falta configurar nada más: el primer arranque te guía para conectar tu cuenta.",
            ],
            mentorTip:
              "Si nunca has usado la terminal, no pasa nada. Solo necesitarás copiar, pegar y pulsar Intro.",
          },
          {
            id: "instalar",
            title: "Instala la herramienta",
            body: [
              "En macOS, Linux o WSL puedes usar el instalador oficial. En Windows existe un instalador equivalente para PowerShell.",
              "Si ya usas Node.js 18 o superior, también puedes instalarlo con `npm`.",
            ],
            code: {
              language: "bash",
              caption: "Instalador oficial (macOS, Linux, WSL)",
              content: "curl -fsSL https://claude.ai/install.sh | bash",
            },
            mentorTip:
              "Alternativa con npm: `npm install -g @anthropic-ai/claude-code`. Consulta siempre la documentación oficial si algo cambia.",
          },
          {
            id: "iniciar",
            title: "Comprueba e inicia",
            body: [
              "Verifica la instalación consultando la versión. Después entra en la carpeta de tu proyecto y ejecuta `claude`.",
              "La primera vez te pedirá iniciar sesión. A partir de ahí, Claude Code trabajará con los archivos de esa carpeta.",
            ],
            code: {
              language: "bash",
              caption: "Verificar e iniciar",
              content: ["claude --version", "cd mi-proyecto", "claude"].join("\n"),
            },
            mentorTip:
              "Inicia siempre Claude Code desde la carpeta raíz del proyecto: así tendrá acceso a todo el contexto que necesita.",
          },
        ],
        quiz: [
          {
            id: "carpeta",
            prompt: "¿Desde dónde conviene iniciar Claude Code?",
            options: [
              { id: "a", label: "Desde cualquier carpeta del sistema." },
              { id: "b", label: "Desde la carpeta raíz de tu proyecto." },
              { id: "c", label: "Solo desde la carpeta de descargas." },
            ],
            correctOptionId: "b",
            explanation:
              "Claude Code trabaja con los archivos de la carpeta donde lo inicias. Desde la raíz del proyecto puede ver todo el código.",
          },
        ],
      },
      {
        id: "primera-conversacion",
        title: "Tu primera conversación",
        summary:
          "Haz preguntas sobre tu proyecto, usa los primeros comandos y revisa un cambio.",
        durationMinutes: 10,
        xp: 100,
        status: "available",
        objectives: [
          "Hacer preguntas útiles sobre un proyecto.",
          "Conocer los comandos esenciales.",
          "Revisar y aprobar un primer cambio.",
        ],
        steps: [
          {
            id: "preguntar",
            title: "Empieza preguntando",
            body: [
              "La mejor forma de empezar es pedirle a Claude que te explique el proyecto. Leerá los archivos necesarios para responder.",
              "Puedes hacer preguntas generales o muy concretas. No necesitas saber dónde está cada cosa.",
            ],
            code: {
              language: "text",
              caption: "Preguntas para tu primera sesión",
              content: [
                "> ¿Qué hace este proyecto?",
                "> ¿Dónde se gestiona el inicio de sesión?",
                "> ¿Qué tecnologías usa?",
              ].join("\n"),
            },
            mentorTip:
              "Preguntar antes de cambiar nada te ayuda a ti a entender el proyecto y le da a Claude el contexto adecuado.",
          },
          {
            id: "comandos",
            title: "Comandos esenciales",
            body: [
              "Los comandos que empiezan por `/` controlan la sesión. `/help` muestra la ayuda y `/clear` empieza una conversación nueva.",
              "`/init` analiza el proyecto y crea un archivo `CLAUDE.md` con instrucciones y contexto que Claude leerá en cada sesión.",
            ],
            code: {
              language: "text",
              caption: "Comandos de barra",
              content: [
                "/help    Muestra la ayuda",
                "/init    Crea CLAUDE.md con el contexto del proyecto",
                "/clear   Empieza una conversación limpia",
              ].join("\n"),
            },
            mentorTip:
              "Ejecuta `/init` en cada proyecto nuevo. Un buen `CLAUDE.md` ahorra muchas explicaciones repetidas.",
          },
          {
            id: "primer-cambio",
            title: "Tu primer cambio",
            body: [
              "Pide algo pequeño, como añadir un comentario o renombrar una variable. Claude te mostrará la diferencia propuesta antes de aplicarla.",
              "Lee el cambio con atención. Si no es lo que querías, recházalo y explica qué esperas. Puedes pulsar `Esc` para interrumpir a Claude en cualquier momento.",
            ],
            mentorTip:
              "Rechazar una propuesta no es un fracaso: es la forma de guiar a Claude hacia lo que realmente necesitas.",
          },
        ],
        quiz: [
          {
            id: "init",
            prompt: "¿Qué comando crea el archivo CLAUDE.md?",
            options: [
              { id: "a", label: "/help" },
              { id: "b", label: "/clear" },
              { id: "c", label: "/init" },
            ],
            correctOptionId: "c",
            explanation:
              "`/init` analiza tu proyecto y genera un `CLAUDE.md` con el contexto que Claude leerá en cada sesión.",
          },
          {
            id: "rechazar",
            prompt: "Claude propone un cambio que no te convence. ¿Qué haces?",
            options: [
              { id: "a", label: "Lo acepto igualmente y lo arreglo después a mano." },
              { id: "b", label: "Lo rechazo y le explico qué quiero en su lugar." },
              { id: "c", label: "Cierro la terminal y empiezo de cero." },
            ],
            correctOptionId: "b",
            explanation:
              "Rechazar y dar contexto es la forma más rápida de llegar al resultado correcto. Claude ajusta su propuesta con tu respuesta.",
          },
        ],
      },
    ],
  },
  {
    id: "trabajar-con-codigo",
    title: "Trabajar con tu código",
    description:
      "Explora proyectos reales, edita con confianza y elige el modo de permisos adecuado.",
    icon: "code",
    missions: [
      comingSoon(
        "leer-un-proyecto",
        "Entiende un proyecto desconocido",
        "Usa Claude Code para orientarte en un repositorio nuevo.",
        10,
        100,
      ),
      comingSoon(
        "editar-con-confianza",
        "Edita con confianza",
        "Pide cambios precisos y revisa cada diferencia.",
        12,
        100,
      ),
      comingSoon(
        "modos-de-permisos",
        "Modos de permisos",
        "Decide cuánto puede hacer Claude sin preguntarte.",
        8,
        75,
      ),
    ],
  },
  {
    id: "contexto-y-memoria",
    title: "Contexto y memoria",
    description:
      "Aprende a darle a Claude el contexto justo con CLAUDE.md y a gestionar conversaciones largas.",
    icon: "brain",
    missions: [
      comingSoon(
        "claude-md-a-fondo",
        "CLAUDE.md a fondo",
        "Escribe instrucciones de proyecto que de verdad ayudan.",
        10,
        100,
      ),
      comingSoon(
        "gestionar-contexto",
        "Gestiona el contexto",
        "Cuándo limpiar o resumir la conversación.",
        8,
        75,
      ),
    ],
  },
  {
    id: "git-y-colaboracion",
    title: "Git y colaboración",
    description: "Crea commits claros, trabaja con ramas y prepara pull requests.",
    icon: "git",
    missions: [
      comingSoon(
        "commits-con-claude",
        "Commits con Claude",
        "Mensajes de commit claros a partir de tus cambios.",
        10,
        100,
      ),
      comingSoon(
        "ramas-y-pull-requests",
        "Ramas y pull requests",
        "Organiza tu trabajo y prepáralo para revisión.",
        12,
        125,
      ),
    ],
  },
  {
    id: "automatiza-tu-flujo",
    title: "Automatiza tu flujo",
    description:
      "Comandos personalizados, hooks y servidores MCP para trabajar a otro nivel.",
    icon: "workflow",
    missions: [
      comingSoon(
        "comandos-personalizados",
        "Comandos personalizados",
        "Convierte tus tareas repetidas en comandos.",
        10,
        100,
      ),
      comingSoon(
        "hooks",
        "Hooks",
        "Ejecuta acciones automáticas en momentos clave.",
        12,
        125,
      ),
      comingSoon(
        "servidores-mcp",
        "Servidores MCP",
        "Conecta Claude Code con otras herramientas.",
        12,
        125,
      ),
    ],
  },
];

export function getModule(moduleId: string): CourseModule | undefined {
  return curriculum.find((m) => m.id === moduleId);
}

export function getMission(
  missionId: string,
): { mission: Mission; module: CourseModule } | undefined {
  for (const courseModule of curriculum) {
    const mission = courseModule.missions.find((m) => m.id === missionId);
    if (mission) return { mission, module: courseModule };
  }
  return undefined;
}

export const allMissions: Mission[] = curriculum.flatMap((m) => m.missions);
