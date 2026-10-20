# Claude Code Academy

Academia interactiva para aprender **Claude Code** desde cero: misiones cortas, progreso gamificado y una mentora guiada (Nova) que da pistas según la pantalla en la que estás.

Este repositorio contiene el **MVP**: el panel principal, la ruta de módulos y el primer módulo completo y jugable.

## Requisitos

- Node.js 20.9 o superior (probado con Node 22)
- npm 10 o superior

## Ejecutar en local

```bash
npm install
npm run dev
```

Abre <http://localhost:3000>.

Versión de producción:

```bash
npm run build
npm start
```

## Comprobaciones

| Comando             | Qué hace                                             |
| ------------------- | ---------------------------------------------------- |
| `npm run lint`      | ESLint con las reglas de Next.js                     |
| `npm run typecheck` | Genera los tipos de rutas y ejecuta TypeScript       |
| `npm test`          | Pruebas unitarias (Vitest) de la lógica de progreso  |
| `npm run check`     | Las tres anteriores seguidas                         |

## Qué incluye el MVP

- **Panel**: bienvenida, siguiente misión, ruta de 5 módulos, indicadores (porcentaje, XP, racha de días, módulos) y acceso a la mentora.
- **Tema claro y oscuro**: sigue al sistema hasta que eliges uno; la elección se guarda y se aplica antes de pintar (sin destellos).
- **Módulo 1 «Primeros pasos»** con 3 misiones completas: pasos con código copiable, comprobación final con explicación y celebración al terminar.
- **Desbloqueo progresivo**: cada misión abre la siguiente y cada módulo el siguiente. Los módulos 2–5 muestran su temario como «en preparación».
- **Progreso en LocalStorage**: se retoma el paso donde lo dejaste, se sincroniza entre pestañas y se puede reiniciar con confirmación.
- **Estados**: carga (esqueletos), vacío, bloqueado, en preparación, éxito, error (`error.tsx`), 404 real para rutas desconocidas, aviso si el navegador bloquea el almacenamiento y recuperación si los datos guardados están dañados.
- **Accesibilidad**: navegación completa por teclado, enlace «Saltar al contenido», diálogos nativos (`<dialog>`) con Esc y foco atrapado, foco al encabezado al cambiar de paso, etiquetas ARIA en barras de progreso y contraste AA en ambos temas.
- **Animaciones con Motion** solo donde aportan: transición entre páginas y pasos, progreso animado y celebración breve. Todo respeta `prefers-reduced-motion`. Sin fondos animados.
- **Preparado para PWA**: manifiesto web e icono. El service worker se añadirá cuando haga falta el modo sin conexión.

## Estructura

```
src/
├── app/                      Rutas (App Router)
│   ├── page.tsx              Panel principal
│   ├── modulos/[moduleId]/   Detalle de un módulo
│   ├── misiones/[missionId]/ Reproductor de misiones
│   ├── template.tsx          Transición entre páginas
│   ├── manifest.ts           Manifiesto web (PWA)
│   └── globals.css           Tokens de diseño y temas
├── content/                  Contenido del curso (archivos estructurados)
│   ├── types.ts              Tipos de módulos, misiones, pasos y preguntas
│   ├── curriculum.ts         Temario y lecciones
│   └── mentor.ts             Preguntas frecuentes de la mentora
├── lib/
│   ├── progress.ts           Lógica pura de progreso (probada en progress.test.ts)
│   ├── progress-store.ts     Persistencia en LocalStorage
│   ├── use-progress.ts       Hook de React para el progreso
│   ├── theme.ts              Tema claro/oscuro
│   └── mentor-store.ts       Estado del panel de la mentora
└── components/
    ├── ui/                   Botones, tarjetas, barras, diálogo, estados vacíos…
    ├── layout/               Cabecera, logotipo y selector de tema
    ├── dashboard/            Piezas del panel
    ├── module/               Página de módulo
    ├── mission/              Reproductor, test, bloque de código y celebración
    └── mentor/               Panel y botón de ayuda
```

## Añadir contenido

Las lecciones viven en `src/content/curriculum.ts`. Para publicar una misión que ahora está «en preparación», sustituye su llamada a `comingSoon(...)` por un objeto `Mission` con `status: "available"`, sus `objectives`, `steps` (cada paso con su `mentorTip`) y `quiz`. Las pruebas comprueban que los ids no se repiten y que cada respuesta correcta existe.

## Diseño

| Token          | Oscuro     | Claro      |
| -------------- | ---------- | ---------- |
| Fondo          | `#11131C`  | `#F5F6FA`  |
| Violeta marca  | `#7867FF`  | `#7867FF`  |
| Menta progreso | `#35D6C3`  | `#0B8577`* |

\* En tema claro la menta se oscurece para que las barras y textos tengan contraste suficiente. Los botones principales usan `#5A48F0` para que el texto blanco cumpla AA.

Tipografías: Inter (interfaz) y JetBrains Mono (código), servidas localmente con `next/font`. Iconos: Lucide.

## Fuera del alcance del MVP

Sin autenticación, pagos, base de datos remota ni API de IA de pago. La mentora usa contenido escrito en `src/content`.
