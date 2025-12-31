"use client";

import { useState, useEffect } from "react"; // Agregamos useEffect
import Link from "next/link";
import { Bebas_Neue } from "next/font/google";

const bebas = Bebas_Neue({
  subsets: ["latin"],
  weight: "400",
  display: "swap",
  variable: "--font-bebas",
});

export default function Hero10k() {
  const VIDEO_ID = "h5QFFj_HwIk";
  const [isVideoActive, setIsVideoActive] = useState(false);

  // --- LÓGICA DE AUTOPLAY SOLO PARA DESKTOP ---
  useEffect(() => {
    // 1. Si el video ya está activo, no hacemos nada.
    if (isVideoActive) return;

    // 2. Detectamos si es Desktop:
    // (min-width: 1024px) -> Pantalla grande (Laptop/PC)
    // (hover: hover) -> Tiene un mouse real (excluye iPads Pro y Tablets grandes)
    const isDesktop = window.matchMedia("(min-width: 1024px) and (hover: hover)").matches;

    if (!isDesktop) return; // Si es móvil o tablet, salimos y NO cargamos nada.

    const handleDesktopInteraction = () => {
      setIsVideoActive(true);
    };

    // 3. Escuchamos el movimiento del mouse UNA SOLA VEZ ({ once: true })
    // 'passive: true' asegura que el scroll no se bloquee mientras se detecta el mouse.
    window.addEventListener("mousemove", handleDesktopInteraction, { once: true, passive: true });

    return () => {
      window.removeEventListener("mousemove", handleDesktopInteraction);
    };
  }, [isVideoActive]);

  const src = `https://www.youtube-nocookie.com/embed/${VIDEO_ID}?autoplay=1&mute=0&controls=1&playsinline=1&rel=0&iv_load_policy=3&modestbranding=1`;

  return (
    <section className={`w-full px-3 py-6 md:py-8 flex justify-center bg-gray-50 font-sans ${bebas.variable}`}>
      <div
        className="
          relative w-full max-w-7xl
          rounded-[24px] sm:rounded-[40px]
          overflow-hidden
          bg-white
          border border-black/5
          px-5 py-8
          sm:px-8 sm:py-10
          md:px-12 md:py-12
          grid grid-cols-1 lg:grid-cols-[1.4fr_1fr]
          gap-8 lg:gap-12
          shadow-[0_15px_40px_-10px_rgba(0,0,0,0.08)]
          transition-all duration-500 hover:shadow-[0_25px_50px_-12px_rgba(192,36,133,0.12)]
        "
      >
        {/* 🎬 VIDEO CONTAINER */}
        <div className="relative z-10 flex items-center justify-center order-1 lg:order-none">
          <div
            className="
              w-full aspect-video
              rounded-[20px] sm:rounded-[28px]
              overflow-hidden
              bg-black
              shadow-lg
              relative
              group
              cursor-pointer
            "
            onClick={() => setIsVideoActive(true)}
            aria-label="Reproducir video promocional"
          >
            {!isVideoActive ? (
              <>
                {/* IMAGEN OPTIMIZADA (LCP - Sin CLS) */}
                <img
                  src={`https://i.ytimg.com/vi/${VIDEO_ID}/maxresdefault.jpg`}
                  alt="Video Promocional 10K Ruta de los Tres Juanes"
                  width={1280}
                  height={720}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  loading="lazy"
                />
                
                {/* Overlay Oscuro */}
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-all duration-300" />

                {/* Botón de Play */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="w-14 h-14 sm:w-20 sm:h-20 bg-white/90 rounded-full flex items-center justify-center backdrop-blur-sm shadow-xl transition-transform duration-300 group-hover:scale-110 group-hover:bg-white">
                    <svg className="w-6 h-6 sm:w-9 sm:h-9 text-[#C02485] ml-1" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </div>
                </div>
              </>
            ) : (
              <iframe
                className="absolute inset-0 w-full h-full animate-in fade-in duration-500"
                src={src}
                title="10K Ruta de los Tres Juanes – Video"
                allow="autoplay; fullscreen; encrypted-media; picture-in-picture"
                allowFullScreen
                loading="eager"
              />
            )}
          </div>
        </div>

        {/* 🏃‍♂️ CONTENIDO / TEXTO */}
        <div className="relative z-10 flex flex-col justify-center text-center lg:text-left order-2 lg:order-none">
          <p className="uppercase tracking-[0.2em] text-xs sm:text-xs text-[#C02485] font-bold mb-2 font-sans">
            Ambato, Ecuador • 2026
          </p>

          <h1 className="font-[family-name:var(--font-bebas)] text-[40px] sm:text-[50px] lg:text-[64px] xl:text-[72px] leading-[0.9] text-black mb-4 sm:mb-5">
            <span className="block tracking-wide">10K Ruta de los</span>
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-[#C02485] to-[#E5006D]">
              Tres Juanes
            </span>
          </h1>

          <p className="text-sm sm:text-base md:text-lg text-gray-600 leading-relaxed mb-6 max-w-lg mx-auto lg:mx-0 font-medium font-sans">
            Vive la magia de correr bajo las luces de la ciudad. Celebra la <span className="text-black font-semibold">Fiesta de la Fruta y de las Flores</span> en la carrera nocturna más emblemática del país.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start font-sans">
            <Link
              href="/inscripcion"
              className="
                inline-flex items-center justify-center px-6 py-3.5 
                rounded-full bg-gradient-to-r from-[#C02485] to-[#E5006D] 
                text-white text-xs sm:text-sm tracking-[0.15em] font-bold uppercase 
                shadow-md shadow-[#C02485]/30 
                hover:shadow-[#C02485]/50 hover:-translate-y-0.5 
                transition-all duration-300
              "
            >
              Inscribirse Ahora
            </Link>
            <Link
              href="/reglamento"
              className="
                inline-flex items-center justify-center px-6 py-3.5 
                rounded-full border border-gray-300 
                text-gray-700 text-xs sm:text-sm tracking-[0.15em] font-bold uppercase 
                hover:border-[#C02485] hover:text-[#C02485] hover:bg-[#C02485]/5
                transition-all duration-300
              "
            >
              Ver Reglamento
            </Link>
          </div>

          <div className="mt-6 pt-5 border-t border-gray-100 flex items-center justify-center lg:justify-start gap-3">
             <div className="h-6 w-px bg-gray-300 hidden sm:block"></div>
             <p className="text-[10px] sm:text-xs text-gray-400 font-medium uppercase tracking-wide font-sans">
                Org: Asoc. Periodistas Deportivos de Tungurahua
             </p>
          </div>
        </div>
      </div>
    </section>
  );
}