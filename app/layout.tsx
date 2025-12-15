import type { Metadata } from "next";
import { Geist, Geist_Mono, Montserrat } from "next/font/google";  // Agregar Montserrat
import "./globals.css";

import Header from "./components/Header";
import Footer from "./components/Footer";

import { readFileSync, existsSync } from "fs";
import { resolve } from "path";
import crypto from "crypto";

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

const montserrat = Montserrat({
  variable: "--font-montserrat", // Nueva fuente para los encabezados
  subsets: ["latin"],
  weight: ["700", "800", "900"],
});

// ==============================
// Manifest opcional
// ==============================
function readManifest() {
  try {
    const p = resolve(process.cwd(), "assets-manifest.json");
    if (existsSync(p)) return JSON.parse(readFileSync(p, "utf8"));
  } catch {}
  return null;
}

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
    <html
      lang="es"
      className="dark"
      style={{ colorScheme: "dark" }}
      suppressHydrationWarning
    >
      <head>
        {/* Anti-blanco */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                var html = document.documentElement;
                html.classList.add('dark');
                html.style.colorScheme = 'dark';
              } catch (e) {}
            `,
          }}
        />

        <meta name="theme-color" content="#080B22" />
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
          ${montserrat.variable}  // Aplicar la nueva fuente
          antialiased
          min-h-screen
          text-white
          bg-[#080B22]   /* ✅ Fondo oscuro */
          relative
          overflow-x-hidden
        `}
      >
        {/* 🌊 CAPA 1 — MANCHAS LÍQUIDAS */}
        <div
          className="fixed inset-0 -z-30 animate-liquidFlow pointer-events-none"
          style={{
            backgroundImage: `
              radial-gradient(circle at 18% 25%, rgba(255,120,190,0.8) 0%, transparent 55%),
              radial-gradient(circle at 75% 35%, rgba(236,0,140,0.7) 0%, transparent 55%),
              radial-gradient(circle at 55% 85%, rgba(186,0,120,0.75) 0%, transparent 55%)
            `,
            backgroundSize: "230% 230%",
            backgroundRepeat: "no-repeat",
            backgroundPosition: "center",
            opacity: 0.65,
          }}
        />

        {/* 🌌 CAPA 2 — FONDO BASE (SIN FRANJA) */}
        <div
          className="fixed inset-0 -z-20 pointer-events-none"
          style={{
            backgroundImage:
              "linear-gradient(180deg, #080B22 0%, #0A0512 18%, #1A0630 45%, #B0007A 75%, #FF4F9A 100%)",
            backgroundRepeat: "no-repeat",
            backgroundSize: "cover",
            backgroundPosition: "center top",
            backgroundColor: "#080B22",
          }}
        />

        {/* HEADER */}
        <Header />

        {/* TOASTER */}
        <Toaster position="top-center" richColors closeButton duration={2400} />

        {/* CONTENIDO */}
        <main className="pt-8 relative z-10">{children}</main>

        {/* FOOTER */}
        <Footer />
      </body>
    </html>
  );
}
