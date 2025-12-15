"use client";

import Image from "next/image";
import { Bebas_Neue } from "next/font/google";

const bebas = Bebas_Neue({
  subsets: ["latin"],
  weight: "400",
});

export default function Header() {
  return (
    <header className="sticky top-3 z-50 w-full flex justify-center px-4">
      <div
        className="
          w-full max-w-7xl mx-auto
          bg-white rounded-full
          shadow-[0_8px_28px_rgba(0,0,0,0.10)]
          px-6 md:px-10 py-3 sm:py-4
          flex items-center justify-between
          border border-[#EFEFF3]
        "
      >
        {/* IZQUIERDA */}
        <div className="flex items-center gap-3 sm:gap-4">
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
            <Image
              src="https://mandarinas.10kindependenciadeambato.com/wp-content/uploads/2025/12/white.svg"
              alt="10K Ruta de los Tres Juanes"
              width={32}
              height={32}
              sizes="(max-width: 640px) 32px, 40px"
              className="object-contain"
              unoptimized
              priority
            />
          </div>

          <div className="leading-tight">
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

            <p className="text-[12px] sm:text-[13px] md:text-[14px] text-[#444]/80 font-medium mt-0.5">
              Ambato · Ecuador · Carrera nocturna 2026
            </p>
          </div>
        </div>

        {/* DERECHA */}
        <div className="hidden md:flex items-center gap-2 sm:gap-3">
          <span
            className="
              hidden xl:inline-flex
              px-4 sm:px-5 py-2 text-[11px] sm:text-[12px]
              bg-[#E5006D] text-white
              rounded-full uppercase tracking-[0.22em]
              font-semibold shadow-sm
              whitespace-nowrap
            "
          >
            6 Feb 2026 · 19h00
          </span>

          <a
            href="#reglamento"
            className="
              hidden lg:inline-flex
              px-4 sm:px-5 py-2 text-[11px] sm:text-[12px]
              rounded-full border border-[#C02485]
              text-[#C02485]
              uppercase tracking-[0.22em] font-semibold
              bg-white hover:bg-[#C02485]/10 transition
              whitespace-nowrap
            "
          >
            Reglamento
          </a>

          <a
            href="/inscripcion"
            className="
              inline-flex
              px-5 sm:px-6 py-2 text-[11px] sm:text-[12px]
              bg-[#C02485] text-white
              rounded-full uppercase tracking-[0.22em] font-semibold
              hover:bg-[#A81D72]
              shadow-sm transition
              whitespace-nowrap
            "
          >
            Inscribirse
          </a>
        </div>
      </div>
    </header>
  );
}
