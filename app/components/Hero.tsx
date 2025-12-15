"use client";

import { useMemo } from "react";
import { Bebas_Neue } from "next/font/google";

const bebas = Bebas_Neue({
  subsets: ["latin"],
  weight: "400",
});

export default function Hero() {
  const VIDEO_ID = "h5QFFj_HwIk";

  const src = useMemo(() => {
    const params = new URLSearchParams({
      autoplay: "1",
      mute: "1",
      playsinline: "1",
      controls: "1",
      loop: "1",
      playlist: VIDEO_ID,
      modestbranding: "1",
      rel: "0",
      iv_load_policy: "3",
      fs: "1",
    });

    return `https://www.youtube-nocookie.com/embed/${VIDEO_ID}?${params.toString()}`;
  }, []);

  return (
    <section className="w-full px-4 pt-4 pb-6 md:pb-8 flex justify-center">
      <div
        className="
          relative w-full max-w-7xl
          rounded-[48px] overflow-hidden
          bg-white/5 backdrop-blur-2xl
          border border-white/10
          px-6 sm:px-8 md:px-16
          py-10 md:py-16
          grid grid-cols-1 md:grid-cols-[1.6fr_1fr]
          gap-10
          shadow-[0_30px_80px_rgba(0,0,0,0.45)]
        "
      >
        {/* 🌈 Gradiente decorativo */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#C02485]/25 via-transparent to-[#5B2DFF]/25 pointer-events-none" />

        {/* VIDEO → TEXTO BLANCO */}
        <div className="relative z-10 flex items-center justify-center">
          <div
            className="
              w-full h-[300px] sm:h-[360px] md:h-[440px] lg:h-[500px]
              rounded-[32px] overflow-hidden
              bg-black/60 border border-white/10
              relative
            "
          >
            <iframe
              className="absolute inset-0 w-full h-full"
              src={src}
              title="10K Ruta de los Tres Juanes – Video"
              allow="autoplay; encrypted-media; picture-in-picture"
              allowFullScreen
              loading="eager"
            />
          </div>
        </div>

        {/* TEXTO → FONDO CLARO → TEXTO NEGRO */}
        <div className="relative z-10 flex flex-col justify-center">
          {/* Eyebrow */}
          <p className="uppercase tracking-[0.32em] text-xs sm:text-sm text-black/60 font-semibold">
            Vive la magia de correr bajo las luces de Ambato
          </p>

          {/* Título principal */}
          <h1
            className={`
              mt-4
              text-[40px] sm:text-[52px] lg:text-[66px]
              leading-[1.02]
              text-black
              ${bebas.className}
            `}
          >
            <span className="block tracking-[0.08em]">
              10K Ruta de los
            </span>
            <span className="block tracking-[0.08em]">
              Tres Juanes 2026
            </span>
          </h1>

          {/* Descripción */}
          <p className="mt-5 text-base sm:text-lg text-black/75 max-w-xl">
            ¡Corre bajo las luces de Ambato y celebra la Fiesta de la Fruta y de
            las Flores en una carrera nocturna única en Ecuador!
          </p>

          {/* CTAs */}
          <div className="mt-8 flex flex-wrap gap-4">
            {/* CTA principal */}
            <a
              href="/inscripcion"
              className="
                inline-flex items-center justify-center
                px-8 py-3 rounded-full
                bg-gradient-to-r from-[#C02485] to-[#E5006D]
                text-white text-[13px] tracking-[0.20em]
                font-bold uppercase
                shadow-lg shadow-[#C02485]/40
                hover:opacity-90 transition
              "
            >
              ¡Inscríbete aquí ahora!
            </a>

            {/* CTA secundario */}
            <a
              href="#reglamento"
              className="
                inline-flex items-center justify-center
                px-8 py-3 rounded-full
                border border-black/25
                text-black text-[13px] tracking-[0.20em]
                font-semibold uppercase
                hover:bg-black/5 transition
              "
            >
              Ver reglas &amp; premios
            </a>
          </div>

          {/* Legal / organizador */}
          <p className="mt-6 text-xs sm:text-sm text-black/55">
            Organiza: Asociación de Periodistas Deportivos de Tungurahua · Ambato – Ecuador
          </p>
        </div>
      </div>
    </section>
  );
}
