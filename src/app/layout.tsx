import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import { AppHeader } from "@/components/layout/AppHeader";
import { AppProviders } from "@/components/providers/AppProviders";
import { themeInitScript } from "@/lib/theme";
import "./globals.css";

const inter = Inter({ variable: "--font-inter", subsets: ["latin"], display: "swap" });
const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Claude Code Academy",
    template: "%s · Claude Code Academy",
  },
  description:
    "Academia interactiva para aprender Claude Code desde cero, con misiones cortas, progreso y un mentor guiado.",
  applicationName: "Claude Code Academy",
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#11131C" },
    { media: "(prefers-color-scheme: light)", color: "#F5F6FA" },
  ],
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="es"
      data-theme="dark"
      suppressHydrationWarning
      className={`${inter.variable} ${jetbrainsMono.variable}`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body className="min-h-dvh">
        <a
          href="#contenido"
          className="sr-only z-50 rounded-lg bg-primary-fill px-4 py-2 font-semibold text-white focus:not-sr-only focus:fixed focus:top-3 focus:left-3"
        >
          Saltar al contenido
        </a>
        <AppProviders>
          <div aria-hidden="true" className="lab-grid pointer-events-none fixed inset-x-0 top-0 -z-10 h-[32rem]" />
          <AppHeader />
          <main id="contenido" tabIndex={-1} className="mx-auto max-w-6xl px-4 pt-6 pb-16 sm:px-6 sm:pt-10 focus:outline-none">
            {children}
          </main>
        </AppProviders>
      </body>
    </html>
  );
}
