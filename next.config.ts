import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 🔹 Muy importante para generar /out con `next build && next export`
  output: "export",

  // 🔹 Necesario en hosting estático (Hostinger, cPanel, S3, GitHub Pages…)
  images: {
    unoptimized: true,
  },

  // 🔥 Solución al problema de /inscripcion → genera /inscripcion/index.html
  trailingSlash: true,
};

export default nextConfig;
