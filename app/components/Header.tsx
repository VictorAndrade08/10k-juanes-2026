"use client";

import { useState } from "react";
import { Bebas_Neue } from "next/font/google";
import { HiBars3, HiXMark } from "react-icons/hi2";

const bebas = Bebas_Neue({
  subsets: ["latin"],
  weight: "400",
});

export default function Header() {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* ================= HEADER ================= */}
      {/* ✅ NUNCA sticky en ningún dispositivo */}
      <header className="relative mt-4 sm:mt-5 z-50 w-full flex justify-center px-4">
        <div
          className="
            w-full max-w-7xl mx-auto
            bg-white rounded-full
            shadow-[0_8px_28px_rgba(0,0,0,0.10)]
            px-6 lg:px-10 py-3 sm:py-4
            flex items-center justify-between
            border border-[#EFEFF3]
          "
        >
          {/* IZQUIERDA → HOME */}
          <a
            href="/"
            aria-label="Volver al inicio"
            className="flex items-center gap-3 sm:gap-4 cursor-pointer"
          >
            <div
              className="
                w-12 h-12 sm:w-14 sm:h-14
                rounded-2xl overflow-hidden
                bg-[#C02485]
                shadow-[0_4px_12px_rgba(192,36,133,0.35)]
                flex items-center justify-center
                flex-shrink-0
              "
            >
              <img
                src="/white.svg"
                alt="10K Ruta de los Tres Juanes"
                className="w-8 h-8 sm:w-9 sm:h-9 object-contain"
                loading="eager"
              />
            </div>

            <div className="leading-tight select-none">
              <span
                className={`
                  block
                  text-[18px] sm:text-[22px] md:text-[24px]
                  uppercase tracking-[0.08em]
                  text-[#111]
                  ${bebas.className}
                `}
              >
                10K Ruta de los Tres Juanes
              </span>

              {/* ❌ Oculto en mobile */}
              <p className="hidden sm:block text-[12px] sm:text-[13px] md:text-[14px] text-[#444]/80 font-medium mt-0.5">
                Ambato · Ecuador · Carrera nocturna 2026
              </p>
            </div>
          </a>

          {/* ================= DESKTOP (LG+) ================= */}
          <div className="hidden lg:flex items-center gap-2 xl:gap-3">
            <span
              className="
                hidden xl:inline-flex
                px-4 py-2 text-[11px]
                bg-[#E5006D] text-white
                rounded-full uppercase tracking-[0.22em]
                font-semibold shadow-sm
              "
            >
              6 Feb 2026 · 19h00
            </span>

            <a
              href="#reglamento"
              className="
                px-4 py-2 text-[11px]
                rounded-full border border-[#C02485]
                text-[#C02485]
                uppercase tracking-[0.22em] font-semibold
                hover:bg-[#C02485]/10 transition
              "
            >
              Reglamento
            </a>

            <a
              href="/verificar"
              className="
                px-4 py-2 text-[11px]
                rounded-full border border-[#E5006D]
                text-[#E5006D]
                uppercase tracking-[0.22em] font-semibold
                hover:bg-[#E5006D]/10 transition
              "
            >
              Verificar inscripción
            </a>

            <a
              href="/inscripcion"
              className="
                px-5 py-2 text-[11px]
                bg-[#C02485] text-white
                rounded-full uppercase tracking-[0.22em] font-semibold
                hover:bg-[#A81D72]
                shadow-sm transition
              "
            >
              Inscribirse
            </a>
          </div>

          {/* ================= BURGER (LG-) ================= */}
          <button
            onClick={() => setOpen(true)}
            className="lg:hidden p-2 rounded-full hover:bg-black/5 transition"
            aria-label="Abrir menú"
          >
            <HiBars3 className="w-7 h-7 text-[#111]" />
          </button>
        </div>
      </header>

      {/* ================= MOBILE MENU OSCURO ================= */}
      {open && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm">
          <div
            className="
              absolute top-4 left-4 right-4
              bg-[#0B0B0B]
              rounded-3xl
              shadow-[0_30px_80px_rgba(0,0,0,0.85)]
              p-6
              text-white
            "
          >
            <div className="flex items-center justify-between mb-8">
              <span
                className={`text-sm uppercase tracking-[0.35em] text-white/60 ${bebas.className}`}
              >
                Menú
              </span>
              <button
                onClick={() => setOpen(false)}
                className="p-2 rounded-full hover:bg-white/10 transition"
                aria-label="Cerrar menú"
              >
                <HiXMark className="w-7 h-7 text-white" />
              </button>
            </div>

            <nav className="flex flex-col gap-6">
              <a href="/" className="text-xl font-semibold">
                Inicio
              </a>
              <a href="#reglamento" className="text-xl font-semibold">
                Reglamento
              </a>
              <a
                href="/verificar"
                className="text-xl font-semibold text-[#C02485]"
              >
                Verificar inscripción
              </a>
              <a
                href="/inscripcion"
                className="
                  mt-6
                  inline-flex justify-center
                  px-6 py-4
                  bg-[#C02485]
                  rounded-full
                  uppercase tracking-[0.35em]
                  font-semibold
                "
              >
                Inscribirse
              </a>
            </nav>
          </div>
        </div>
      )}
    </>
  );
}
