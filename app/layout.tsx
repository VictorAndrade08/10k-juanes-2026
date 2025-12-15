import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

import Header from "./components/Header";
import Footer from "./components/Footer";

// ---------- Server-only (solo se ejecuta en el build/render del servidor) ----------
import { readFileSync, existsSync } from "fs";
import { resolve } from "path";
import crypto from "crypto";

// ⭐ Import Sonner
import { Toaster } from "sonner";

// ==============================
// Fuentes
// ==============================
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// ==============================
// Manifest opcional (no rompe si no existe)
// ==============================
function readManifest() {
  try {
    const p = resolve(process.cwd(), "assets-manifest.json");
    if (existsSync(p)) return JSON.parse(readFileSync(p, "utf8"));
  } catch {}
  return null;
}

// ==============================
// Hash del contenido como fallback (para ?v=HASH)
// ==============================
function fileHash(absPath: string) {
  try {
    const buf = readFileSync(absPath);
    return crypto.createHash("md5").update(buf).digest("hex").slice(0, 10);
  } catch {
    return String(Math.floor(Date.now() / 1000));
  }
}

const manifest = readManifest();

function cssHref(basename: string) {
  if (manifest && manifest[basename]) return "/" + manifest[basename];

  const abs = resolve(process.cwd(), "public/assets/css/" + basename);
  const v = fileHash(abs);
  return `/assets/css/${basename}?v=${v}`;
}

const styleHref = cssHref("style.css");
const mainHref = cssHref("main.css");

// ==============================
// Metadata
// ==============================
export const metadata: Metadata = {
  title: "10K Ruta de los Tres Juanes 2026",
  description: "Carrera nocturna Ambato — Sitio oficial",
};

// ==============================
// Layout principal
// ==============================
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className="dark" style={{ colorScheme: "dark" }}>
      <head>
        <meta name="theme-color" content="#0b0b12" />
        <meta name="color-scheme" content="dark" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="preload" as="style" href={styleHref} />
        <link rel="stylesheet" href={styleHref} />
        <link rel="preload" as="style" href={mainHref} />
        <link rel="stylesheet" href={mainHref} />
      </head>

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
        {/* 🌊 CAPA 1 — MANCHAS LÍQUIDAS */}
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
            opacity: 0.65,
          }}
        />

        {/* 🌌 CAPA 2 — FONDO BASE */}
        <div
          className="fixed inset-0 -z-20 pointer-events-none bg-fixed"
          style={{
            backgroundImage: `url("data:image/svg+xml;utf8,
              <svg xmlns='http://www.w3.org/2000/svg' width='100%' height='100%'>
                <defs>
                  <linearGradient id='grad1' x1='0' y1='0' x2='1' y2='1'>
                    <stop offset='0%' stop-color='%230A0512'/>
                    <stop offset='45%' stop-color='%231A0630'/>
                    <stop offset='75%' stop-color='%23B0007A'/>
                    <stop offset='100%' stop-color='%23FF4F9A'/>
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

        {/* ⭐ SONNER — Toaster Global */}
        <Toaster
          position="top-center"
          richColors
          closeButton
          duration={2400}
        />

        {/* CONTENIDO */}
        <main className="pt-8 relative z-10">{children}</main>

        {/* FOOTER */}
        <Footer />
      </body>
    </html>
  );
}
