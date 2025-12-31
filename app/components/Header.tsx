"use client";

import { useState } from "react";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import { Bebas_Neue } from "next/font/google";

// --- CONFIGURACIÓN DE FUENTE (Optimización Core Web Vitals) ---
const bebas = Bebas_Neue({
  subsets: ["latin"],
  weight: "400",
  display: "swap",
  variable: "--font-bebas",
});

// --- SUB-COMPONENTE LOGO (Para manejar el error de imagen sin romper TS) ---
const Logo = ({ className }: { className?: string }) => {
  const [hasError, setHasError] = useState(false);

  if (hasError) {
    // Fallback SVG si la imagen falla (Renderizado seguro)
    return (
      <svg 
        xmlns="http://www.w3.org/2000/svg" 
        viewBox="0 0 24 24" 
        fill="white" 
        className={className}
        aria-hidden="true"
      >
        <path d="M11.25 4.533A9.707 9.707 0 006 3a9.735 9.735 0 00-3.25.555.75.75 0 00-.5.707v14.25a.75.75 0 001 .707A8.237 8.237 0 016 18.75c1.995 0 3.823.707 5.25 1.886V4.533zM12.75 20.636A8.214 8.214 0 0118 18.75c.966 0 1.89.166 2.75.47V4.982c-.371-.16-.763-.298-1.168-.414a9.721 9.721 0 00-4.082 0 8.234 8.234 0 00-2.75 1.868v14.2z" />
      </svg>
    );
  }

  return (
    <img
      src="/white.svg"
      alt="Logo 10K"
      width={28}
      height={28}
      className={`${className} object-contain`}
      onError={() => setHasError(true)}
      loading="eager"
    />
  );
};

// --- COMPONENTE PRINCIPAL ---
export default function Header() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <header className={`relative mt-4 sm:mt-5 z-50 w-full flex justify-center px-4 font-sans ${bebas.variable}`}>
        <div
          className="
            w-full max-w-7xl mx-auto
            bg-white/95 backdrop-blur-sm
            rounded-full
            shadow-[0_8px_28px_rgba(0,0,0,0.10)]
            hover:shadow-[0_15px_40px_-10px_rgba(192,36,133,0.15)]
            transition-all duration-300
            px-4 sm:px-6 lg:px-8 py-3
            flex items-center justify-between
            border border-[#EFEFF3]
          "
        >
          {/* IZQUIERDA → HOME */}
          <Link
            href="/"
            aria-label="Volver al inicio"
            className="flex items-center gap-2 sm:gap-3 lg:gap-4 cursor-pointer group flex-shrink-0"
          >
            <div
              className="
                w-10 h-10 sm:w-12 sm:h-12
                rounded-2xl overflow-hidden
                bg-[#C02485]
                shadow-[0_4px_12px_rgba(192,36,133,0.35)]
                flex items-center justify-center
                flex-shrink-0
                group-hover:scale-105 transition-transform duration-300
              "
            >
              {/* Usamos el componente seguro Logo */}
              <Logo className="w-6 h-6 sm:w-7 sm:h-7" />
            </div>

            <div className="leading-tight select-none flex flex-col justify-center">
              <span
                className="
                  block
                  text-[18px] lg:text-[22px] xl:text-[26px]
                  uppercase tracking-[0.05em]
                  text-[#111]
                  font-[family-name:var(--font-bebas)]
                  group-hover:text-[#C02485] transition-colors
                  whitespace-nowrap
                "
              >
                10K Ruta de los Tres Juanes
              </span>

              <p className="hidden xl:block text-[13px] text-[#444]/80 font-medium mt-0.5 tracking-wide whitespace-nowrap">
                Ambato · Ecuador · Carrera nocturna 2026
              </p>
            </div>
          </Link>

          {/* ================= DESKTOP (LG+) ================= */}
          <div className="hidden lg:flex items-center gap-2 xl:gap-4 flex-shrink-0">
            
            <span
              className="
                hidden xl:inline-flex
                px-4 py-2 text-xs font-bold
                bg-[#E5006D] text-white
                rounded-full uppercase tracking-[0.15em]
                shadow-sm
                whitespace-nowrap
              "
            >
              6 Feb 2026
            </span>

            <Link
              href="/reglamento"
              className="
                px-4 py-2 lg:text-[11px] xl:text-xs font-bold
                rounded-full border border-[#C02485]
                text-[#C02485]
                uppercase tracking-[0.1em]
                hover:bg-[#C02485] hover:text-white transition-all duration-300
                whitespace-nowrap
              "
            >
              Reglamento
            </Link>

            <Link
              href="/verificar"
              className="
                px-4 py-2 lg:text-[11px] xl:text-xs font-bold
                rounded-full border border-[#E5006D]
                text-[#E5006D]
                uppercase tracking-[0.1em]
                hover:bg-[#E5006D] hover:text-white transition-all duration-300
                whitespace-nowrap
              "
            >
              Verificar
            </Link>

            <Link
              href="/inscripcion"
              className="
                px-5 py-2.5 lg:text-[11px] xl:text-xs font-bold
                bg-[#C02485] text-white
                rounded-full uppercase tracking-[0.1em]
                hover:bg-[#A81D72] hover:-translate-y-0.5
                shadow-md hover:shadow-lg transition-all duration-300
                whitespace-nowrap
              "
            >
              Inscribirse
            </Link>
          </div>

          {/* ================= BURGER (LG-) ================= */}
          <button
            onClick={() => setOpen(true)}
            className="lg:hidden p-2 rounded-full hover:bg-black/5 transition"
            aria-label="Abrir menú"
          >
            <Menu className="w-7 h-7 text-[#111]" />
          </button>
        </div>
      </header>

      {/* ================= MOBILE MENU OSCURO ================= */}
      {open && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
          <div
            className="
              absolute top-4 left-4 right-4
              bg-[#0B0B0B]
              rounded-[32px]
              shadow-[0_30px_80px_rgba(0,0,0,0.85)]
              p-6 sm:p-8
              text-white
              animate-in slide-in-from-top-10 duration-300
            "
          >
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                 <div className="w-10 h-10 rounded-xl bg-[#C02485] flex items-center justify-center">
                    {/* Reutilizamos el componente Logo seguro */}
                    <Logo className="w-6 h-6" />
                 </div>
                 <span className="text-sm uppercase tracking-[0.2em] text-white/80 font-bold font-[family-name:var(--font-bebas)]">
                    Menú
                 </span>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="p-3 rounded-full hover:bg-white/10 transition"
                aria-label="Cerrar menú"
              >
                <X className="w-7 h-7 text-white" />
              </button>
            </div>

            <nav className="flex flex-col gap-4">
              <Link href="/" className="text-xl font-bold py-3 border-b border-white/10 text-white/90" onClick={() => setOpen(false)}>
                Inicio
              </Link>

              <Link href="/reglamento" className="text-xl font-bold py-3 border-b border-white/10 text-white/90" onClick={() => setOpen(false)}>
                Reglamento
              </Link>

              <Link
                href="/verificar"
                className="text-xl font-bold py-3 border-b border-white/10 text-[#E5006D]"
                onClick={() => setOpen(false)}
              >
                Verificar inscripción
              </Link>
              
              <Link
                href="/inscripcion"
                className="
                  mt-6
                  inline-flex justify-center w-full
                  px-6 py-5
                  bg-[#C02485]
                  rounded-2xl
                  uppercase tracking-[0.25em]
                  font-bold text-base
                  shadow-lg
                  active:scale-95 transition-transform
                "
                onClick={() => setOpen(false)}
              >
                Inscribirse Ahora
              </Link>
            </nav>
          </div>
        </div>
      )}
    </>
  );
}