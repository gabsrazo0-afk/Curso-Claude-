import type { NextConfig } from "next";

/*
 * La academia es contenido estático + progreso en el navegador, así que no
 * usamos Cache Components: todas las rutas se generan en el build y los ids
 * desconocidos devuelven un 404 real (dynamicParams = false).
 */
const nextConfig: NextConfig = {
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
