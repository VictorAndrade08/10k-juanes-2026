import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

import Header from "./components/Header";
import Footer from "./components/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "10K Ruta de los Tres Juanes 2026",
  description: "Carrera nocturna Ambato — Sitio oficial",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body
        className={`
          ${geistSans.variable}
          ${geistMono.variable}
          antialiased
          min-h-screen
          text-white
          relative
          overflow-x-hidden
        `}
      >
        {/* 🌊 CAPA 1 — MANCHAS LÍQUIDAS (ACENTO MAGENTA) */}
        <div
          className="
            fixed inset-0 -z-30
            animate-liquidFlow
            pointer-events-none
          "
          style={{
            backgroundImage: `
              radial-gradient(circle at 18% 25%, rgba(255,120,190,0.80) 0%, transparent 55%),
              radial-gradient(circle at 75% 35%, rgba(236,0,140,0.70) 0%, transparent 55%),
              radial-gradient(circle at 55% 85%, rgba(186,0,120,0.75) 0%, transparent 55%)
            `,
            backgroundSize: "230% 230%",
            opacity: 0.65, // 🔹 menos fuerte para que el fondo oscuro mande
          }}
        />

        {/* 🌌 CAPA 2 — FONDO PRINCIPAL MÁS OSCURO (BASE) */}
        <div
          className="fixed inset-0 -z-20 pointer-events-none bg-fixed"
          style={{
            backgroundImage: `url("data:image/svg+xml;utf8,
              <svg xmlns='http://www.w3.org/2000/svg' width='100%' height='100%'>
                <defs>
                  <!-- Degradado más oscuro: casi negro-violeta -> magenta -> rosa -->
                  <linearGradient id='grad1' x1='0' y1='0' x2='1' y2='1'>
                    <stop offset='0%' stop-color='%230A0512'/>   <!-- casi negro -->
                    <stop offset='45%' stop-color='%231A0630'/>  <!-- violeta oscuro -->
                    <stop offset='75%' stop-color='%23B0007A'/>  <!-- magenta oscuro -->
                    <stop offset='100%' stop-color='%23FF4F9A'/> <!-- rosa -->
                  </linearGradient>

                  <filter id='noise'>
                    <feTurbulence type='fractalNoise' baseFrequency='0.7' numOctaves='3'/>
                    <feColorMatrix type='saturate' values='0'/>
                    <feComponentTransfer>
                      <feFuncA type='table' tableValues='0 0.14'/>
                    </feComponentTransfer>
                  </filter>
                </defs>

                <rect width='100%' height='100%' fill='url(%23grad1)' opacity='0.98'/>
                <rect width='100%' height='100%' filter='url(%23noise)' opacity='0.22'/>
              </svg>
            ")`,
          }}
        />

        {/* HEADER */}
        <Header />

        {/* CONTENIDO */}
        <main className="pt-8 relative z-10">{children}</main>

        {/* FOOTER */}
        <Footer />
      </body>
    </html>
  );
}
