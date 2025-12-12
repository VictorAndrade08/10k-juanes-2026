"use client";

import React, { useMemo } from "react";
import { Bebas_Neue } from "next/font/google";

const bebas = Bebas_Neue({
  subsets: ["latin"],
  weight: "400",
});

const SPONSOR_LOGOS = [
  {
    src: "https://darkgreen-monkey-141925.hostingersite.com/wp-content/uploads/2025/01/Carrera-10K-Ruta-de-los-Tres-Juanes-2025-%C2%A1Corre-y-Celebra-la-Fiesta-de-la-Fruta-y-de-las-Flores-en-Ambato-.webp",
    alt: "Corredores 10K Ruta de los Tres Juanes",
  },
  {
    src: "https://darkgreen-monkey-141925.hostingersite.com/wp-content/uploads/2025/01/Carrera-10K-Ruta-de-los-Tres-Juanes-2025-%C2%A1Corre-y-Celebra-la-Fiesta-de-la-Fruta-y-de-las-Flores-en-Ambato-34.webp",
    alt: "Ambato nocturno 10K",
  },
  {
    src: "https://darkgreen-monkey-141925.hostingersite.com/wp-content/uploads/2025/01/Carrera-10K-Ruta-de-los-Tres-Juanes-2025-%C2%A1Corre-y-Celebra-la-Fiesta-de-la-Fruta-y-de-las-Flores-en-Ambato-1-2.webp",
    alt: "Salida 10K Ruta de los Tres Juanes",
  },
  {
    src: "https://darkgreen-monkey-141925.hostingersite.com/wp-content/uploads/2024/11/Carrera-10K-Independencia-de-Amb-9.webp",
    alt: "Corredores 10K Independencia de Ambato",
  },
  {
    src: "https://darkgreen-monkey-141925.hostingersite.com/wp-content/uploads/2024/09/Carrera-10K-Independencia-de-Amb-logo-web-1-1.webp",
    alt: "Logo 10K Independencia de Ambato",
  },
  {
    src: "https://darkgreen-monkey-141925.hostingersite.com/wp-content/uploads/2024/09/Carrera-10K-Independencia-de-Amb-Aurum-1-1.webp",
    alt: "Logo Aurum patrocinador",
  },
  {
    src: "https://darkgreen-monkey-141925.hostingersite.com/wp-content/uploads/2024/12/Carrera-10K-Independencia-de-Amb-1-1.webp",
    alt: "Corredores 10K Independencia de Ambato noche",
  },
];

function shuffle<T>(arr: T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export default function SponsorsStrip() {
  const logos = useMemo(() => shuffle(SPONSOR_LOGOS), []);
  const duplicated = [...logos, ...logos];

  return (
    <section className="w-full px-4 py-12 flex justify-center">
      <div
        className="
          w-full max-w-7xl
          rounded-[48px]
          bg-white/95
          shadow-[0_18px_50px_rgba(0,0,0,0.25)]
          px-6 sm:px-8 md:px-16 
          py-12
          border border-white/10
        "
      >
        <p
          className={`
            text-center 
            text-[22px] sm:text-[26px]
            tracking-[0.20em]
            uppercase
            text-[#374151]
            ${bebas.className}
          `}
        >
          Patrocinadores Principales
        </p>

        <div
          className="
            mt-10
            rounded-[32px]
            bg-[#F4F6FB]
            px-4 sm:px-6 md:px-10
            py-8
            overflow-hidden
            relative
          "
        >
          <div className="animate-marquee flex gap-10 sm:gap-14 md:gap-16">
            {duplicated.map((logo, i) => (
              <div
                key={`${logo.src}-${i}`}
                className="
                  flex-none
                  h-20 sm:h-24 md:h-28
                  min-w-[150px]
                  px-6 sm:px-8
                  rounded-3xl
                  bg-white
                  flex items-center justify-center
                  shadow-[0_6px_18px_rgba(15,23,42,0.08)]
                  hover:-translate-y-1
                  hover:shadow-[0_14px_30px_rgba(15,23,42,0.16)]
                  transition
                "
              >
                <img
                  src={logo.src}
                  alt={logo.alt}
                  className="max-h-14 sm:max-h-16 md:max-h-20 object-contain"
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 20s linear infinite;
        }
      `}</style>
    </section>
  );
}
