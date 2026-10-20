import type { MetadataRoute } from "next";

/**
 * Manifiesto web: primer paso hacia una PWA instalable.
 * Aún no hay service worker; se añadirá cuando haga falta el modo sin conexión.
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Claude Code Academy",
    short_name: "CC Academy",
    description: "Aprende Claude Code desde cero, misión a misión.",
    lang: "es",
    start_url: "/",
    display: "standalone",
    background_color: "#11131C",
    theme_color: "#7867FF",
    icons: [{ src: "/icon.svg", sizes: "any", type: "image/svg+xml" }],
  };
}
