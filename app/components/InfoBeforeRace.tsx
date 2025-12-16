"use client";

import { useCallback } from "react";
import { Bebas_Neue } from "next/font/google";

const bebas = Bebas_Neue({
  subsets: ["latin"],
  weight: "400",
  display: "swap",
  preload: true,
});

const ITEMS = [
  {
    title: "Atletas generales",
    desc: "Requisitos, horarios, puntos de partida y llegada para participantes de todas las categorías.",
    cta: "Ver info atletas",
  },
  {
    title: "Colegiales & juveniles",
    desc: "Información especial para estudiantes de colegios y jóvenes que participan en categorías formativas.",
    cta: "Info colegial",
  },
  {
    title: "Capacidades especiales",
    desc: "Detalles para participantes con discapacidad intelectual, visual y silla de calle, incluyendo acompañantes.",
    cta: "Ver categorías especiales",
  },
  {
    title: "Sponsors & medios",
    desc: "Oportunidades de visibilidad, activaciones y cobertura para marcas y medios de comunicación.",
    cta: "Ver dossier",
  },
] as const;

export default function InfoBeforeRace() {
  // ✅ No importamos sonner arriba → baja JS inicial
  const comingSoon = useCallback(async () => {
    const mod = await import("sonner");
    mod.toast.info("Próximamente — Estate atento 👀");
  }, []);

  return (
    <section className="w-full flex justify-center px-4 mt-4 md:mt-6">
      <div
        className="
          w-full max-w-7xl mx-auto
          rounded-[56px]
          bg-[#05071A]/55
          border border-white/10
          shadow-[0_20px_70px_rgba(0,0,0,0.45)]
          backdrop-blur-md
          px-7 sm:px-10 lg:px-14
          py-10 sm:py-12
        "
      >
        {/* Header */}
        <div className="mb-7 sm:mb-8">
          <p
            className={`
              ${bebas.className}
              text-white/60
              uppercase tracking-[0.55em]
              text-[14px] sm:text-[16px]
            `}
          >
            Información para
          </p>

          <h2
            className={`
              ${bebas.className}
              mt-2
              text-white
              uppercase tracking-[0.06em]
              text-[34px] sm:text-[46px] md:text-[56px]
              leading-[0.92]
            `}
          >
            Todo lo que necesitas saber antes de correr
          </h2>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5 sm:gap-6 items-stretch">
          {ITEMS.map((it) => (
            <button
              key={it.title}
              type="button"
              onClick={comingSoon}
              className="
                group text-left
                rounded-[28px]
                bg-white/6
                border border-white/10
                px-7 py-8
                hover:bg-white/8 hover:border-white/15
                transition-all duration-200
                focus:outline-none focus-visible:ring-2 focus-visible:ring-white/35
                flex flex-col
                min-h-[300px] sm:min-h-[320px]
                will-change-transform
              "
            >
              <h3
                className={`
                  ${bebas.className}
                  text-white
                  uppercase tracking-[0.05em]
                  text-[24px] sm:text-[26px]
                  leading-[1.05]
                `}
              >
                {it.title}
              </h3>

              <p className="mt-5 text-white/78 text-[16px] sm:text-[17px] leading-relaxed font-medium">
                {it.desc}
              </p>

              <span
                className={`
                  ${bebas.className}
                  mt-auto pt-9 inline-flex
                  uppercase tracking-[0.52em]
                  text-[15px] sm:text-[16px]
                  text-white/85
                  group-hover:text-white
                  transition
                `}
              >
                {it.cta}
              </span>
            </button>
          ))}
        </div>

        {/* ✅ Reduce motion (mejor Lighthouse) */}
        <style>{`
          @media (prefers-reduced-motion: reduce) {
            .group { transition: none !important; }
          }
        `}</style>
      </div>
    </section>
  );
}
