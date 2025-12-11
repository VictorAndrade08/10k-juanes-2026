"use client";

import { Bebas_Neue } from "next/font/google";

const bebas = Bebas_Neue({
  subsets: ["latin"],
  weight: "400",
});

export default function Hero() {
  return (
    <section className="w-full px-4 pt-6 pb-10 flex justify-center">
      <div
        className="
          w-full max-w-7xl 
          rounded-[48px] 
          overflow-hidden
          bg-gradient-to-br from-[#070D18] via-[#070D18] to-[#02040A]
          text-white
          px-6 sm:px-8 md:px-16 
          py-10 md:py-16
          grid grid-cols-1 md:grid-cols-[1.6fr_1fr]
          gap-10
          shadow-[0_18px_50px_rgba(0,0,0,0.35)]
        "
      >
        {/* VIDEO */}
        <div className="flex items-center justify-center">
          <div
            className="
              w-full 
              h-[300px] sm:h-[360px] md:h-[440px] lg:h-[500px]
              rounded-[32px]
              border border-white/10
              overflow-hidden
              bg-black/40
              relative
            "
          >
            <iframe
              className="absolute inset-0 w-full h-full"
              src="https://www.youtube.com/embed/N56oXCS3lhY?autoplay=1&mute=1&controls=1&loop=1&playlist=N56oXCS3lhY&modestbranding=1&showinfo=0&rel=0"
              title="10K Ruta de los Tres Juanes – Video"
              allow="autoplay; encrypted-media; picture-in-picture"
              allowFullScreen
            />
          </div>
        </div>

        {/* TEXTO */}
        <div className="flex flex-col justify-center">
          <p className="uppercase tracking-[0.32em] text-xs sm:text-sm text-white/60 font-semibold">
            Vive la magia de correr bajo las luces de Ambato
          </p>

          <h1
            className={`
              mt-4
              text-[40px] sm:text-[52px] lg:text-[66px]
              leading-[1.02]
              ${bebas.className}
            `}
          >
            <span className="block tracking-[0.08em]">10K Ruta de los</span>
            <span className="block tracking-[0.08em]">Tres Juanes 2026</span>
          </h1>

          <p className="mt-5 text-base sm:text-lg text-white/80 max-w-xl">
            ¡Corre bajo las luces de Ambato y celebra la Fiesta de la Fruta y de
            las Flores en una carrera nocturna única en Ecuador!
          </p>

          {/* BOTONES */}
          <div className="mt-8 flex flex-wrap gap-4">
            <a
              href="/inscripcion"
              className="
                inline-flex items-center justify-center
                px-8 py-3
                rounded-full 
                bg-gradient-to-r from-[#C02485] to-[#E5006D]
                text-white text-[13px] tracking-[0.20em]
                font-bold uppercase 
                shadow-lg shadow-[#C02485]/35
                hover:opacity-90 
                transition
                whitespace-nowrap
              "
            >
              ¡Inscríbete aquí ahora!
            </a>

            <a
              href="#reglamento"
              className="
                inline-flex items-center justify-center
                px-8 py-3
                rounded-full 
                border border-white/30
                text-white text-[13px] tracking-[0.20em]
                font-semibold uppercase
                hover:bg-white/5 
                transition
                whitespace-nowrap
              "
            >
              Ver reglas & premios
            </a>
          </div>

          <p className="mt-6 text-xs sm:text-sm text-white/55">
            Organiza: Asociación de Periodistas Deportivos de Tungurahua · Ambato – Ecuador
          </p>
        </div>
      </div>
    </section>
  );
}
