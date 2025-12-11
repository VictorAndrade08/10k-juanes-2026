import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 🔹 Muy importante para generar /out con `next build && next export`
  output: "export",

  // Opcional, pero MUY útil si usas <Image /> y vas a hostear en cualquier hosting estático
  images: {
    unoptimized: true,
  },

  // Si más adelante quieres URLs con / al final (opcional):
  // trailingSlash: true,
};

export default nextConfig;
