"use client";

import { Bebas_Neue } from "next/font/google";

const bebas = Bebas_Neue({
  subsets: ["latin"],
  weight: "400",
});

export default function InscripcionHeader() {
  return (
    <div className="w-full flex justify-center px-4 mt-4">
      <div
        className="
          w-full max-w-7xl mx-auto
          bg-[#05071A]
          rounded-[40px]
          border border-white/10
          shadow-[0_8px_28px_rgba(0,0,0,0.25)]
          px-8 md:px-14 py-10
        "
      >
        {/* Subtítulo */}
        <p className="text-[11px] uppercase tracking-[0.28em] text-white/55">
          Inscripción oficial · 10K Ruta de los Tres Juanes
        </p>

        {/* Título */}
        <h1
          className={`
            ${bebas.className}
            text-[42px] md:text-[56px]
            leading-none mt-2
          `}
        >
          Formulario de inscripción
        </h1>
      </div>
    </div>
  );
}
