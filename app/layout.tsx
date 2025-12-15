import type { Metadata } from "next";
import { Geist, Geist_Mono, Montserrat } from "next/font/google";
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
  variable: "--font-montserrat",
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
          ${montserrat.variable}
          antialiased
          min-h-screen
          text-white
          bg-[#080B22]
          relative
          overflow-x-hidden
        `}
      >
        {/* ===========================
            FONDO TIPO AFICHE (como la imagen)
            =========================== */}

        {/* CAPA 0: base oscura */}
        <div
          className="fixed inset-0 -z-40 pointer-events-none"
          style={{ background: "#080B22" }}
        />

        {/* CAPA 1: degradado magenta → morado (principal) */}
        <div
          className="fixed inset-0 -z-30 pointer-events-none"
          style={{
            backgroundImage: `
              linear-gradient(115deg,
                #FF4EC4 0%,
                #C02485 28%,
                #9B5CFF 55%,
                #2A0836 78%,
                #080B22 100%
              )
            `,
            backgroundSize: "cover",
            backgroundPosition: "center top",
            opacity: 0.92,
          }}
        />

        {/* CAPA 2: geometría suave + viñeta (da ese look “poster”) */}
        <div
          className="fixed inset-0 -z-20 pointer-events-none"
          style={{
            backgroundImage: `
              linear-gradient(180deg, rgba(0,0,0,0.08), rgba(0,0,0,0.55)),
              radial-gradient(1200px 650px at 18% 22%, rgba(255,255,255,0.12), transparent 60%),
              radial-gradient(1000px 600px at 62% 18%, rgba(0,0,0,0.22), transparent 60%),
              linear-gradient(135deg, rgba(255,255,255,0.08) 0%, transparent 35%),
              linear-gradient(225deg, rgba(0,0,0,0.12) 0%, transparent 40%)
            `,
            backgroundSize: "cover",
            backgroundPosition: "center",
            mixBlendMode: "soft-light",
            opacity: 0.9,
          }}
        />

        {/* CAPA 3: grano (grain) leve para que se sienta “impreso” */}
        <div
          className="fixed inset-0 -z-10 pointer-events-none"
          style={{
            backgroundImage: `
              repeating-linear-gradient(
                0deg,
                rgba(255,255,255,0.02) 0px,
                rgba(255,255,255,0.02) 1px,
                transparent 1px,
                transparent 3px
              )
            `,
            opacity: 0.35,
            mixBlendMode: "overlay",
          }}
        />

        {/* CAPA 4: franja blanca diagonal inferior + sombra gris (como el banner) */}
        <div
          className="fixed inset-x-0 bottom-0 -z-[5] pointer-events-none"
          style={{
            height: "38vh",
            background: "#FFFFFF",
            clipPath: "polygon(0 38%, 100% 0%, 100% 100%, 0% 100%)",
            boxShadow: "0 -18px 60px rgba(0,0,0,0.35)",
            opacity: 0.92,
          }}
        />
        <div
          className="fixed inset-x-0 bottom-0 -z-[4] pointer-events-none"
          style={{
            height: "18vh",
            background:
              "linear-gradient(90deg, rgba(0,0,0,0.10), rgba(0,0,0,0.02))",
            clipPath: "polygon(0 70%, 100% 25%, 100% 100%, 0% 100%)",
            opacity: 0.55,
            transform: "translateY(10px)",
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
