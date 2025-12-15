"use client";

import { Bebas_Neue } from "next/font/google";
import { Trophy } from "lucide-react";

const bebas = Bebas_Neue({
  subsets: ["latin"],
  weight: "400",
});

export default function FeaturedStories() {
  return (
    <section className="w-full px-4 pt-4 pb-6 md:pb-8 flex justify-center">
      <div
        className="
          w-full max-w-7xl
          rounded-[48px]
          bg-gradient-to-br from-[#070D18] via-[#070D18] to-[#02040A]
          text-white
          px-10 md:px-20
          py-16 md:py-20
          shadow-[0_25px_70px_rgba(0,0,0,0.40)]
          border border-white/10
        "
      >
        {/* CABECERA */}
        <div className="flex items-center justify-between mb-14">
          <h2
            className={`
              text-[42px] sm:text-[54px] lg:text-[66px]
              leading-[1.02]
              tracking-[0.035em]
              ${bebas.className}
            `}
          >
            Noticias & Historias Destacadas
          </h2>

          <div className="hidden sm:flex items-center gap-2">
            <span className="h-3.5 w-3.5 rounded-full bg-white" />
            <span className="h-3.5 w-3.5 rounded-full bg-white/40" />
            <span className="h-3.5 w-3.5 rounded-full bg-white/40" />
          </div>
        </div>

        {/* TARJETA PRINCIPAL */}
        <div
          className="
            rounded-[40px]
            bg-white/[0.07]
            backdrop-blur-sm
            border border-white/10
            px-8 md:px-14
            py-14 md:py-18
            flex flex-col md:flex-row
            items-stretch
            gap-12
            hover:bg-white/[0.12]
            transition-all
          "
        >
          {/* TEXTO */}
          <div className="flex-1 flex flex-col justify-center">
            <p className="text-base sm:text-lg text-white/50 mb-4 tracking-wide">
              Diciembre 2025
            </p>

            <h3
              className={`
                text-[34px] sm:text-[44px]
                leading-tight
                tracking-[0.02em]
                mb-5
                ${bebas.className}
              `}
            >
              “La mejor carrera nocturna que he corrido”
            </h3>

            <p className="text-lg sm:text-xl text-white/80 leading-relaxed max-w-2xl">
              Conoce la experiencia de corredores que ya vivieron la 10K Ruta de
              los Tres Juanes: organización, ambiente y desafíos de la ruta.
            </p>
          </div>

          {/* ÍCONO */}
          <div
            className="
              w-full md:w-[360px]
              min-h-[260px]
              rounded-[28px]
              bg-white/10
              border border-white/15
              flex items-center justify-center
            "
          >
            <Trophy className="w-24 h-24 text-white/65" strokeWidth={1.6} />
          </div>
        </div>
      </div>
    </section>
  );
}
