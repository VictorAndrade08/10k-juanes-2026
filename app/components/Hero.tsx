"use client";

import { useEffect, useState, useRef } from "react";

// Eliminamos dependencias exclusivas de Next.js para asegurar compatibilidad
// y usamos CSS estándar para la fuente.

export default function Hero10k() {
  const VIDEO_ID = "h5QFFj_HwIk";
  const [isVideoActive, setIsVideoActive] = useState(false);
  const containerRef = useRef(null);

  // 🧠 Optimización: Listeners pasivos para no bloquear el scroll en móviles
  useEffect(() => {
    if (isVideoActive) return;

    const handleInteraction = () => setIsVideoActive(true);

    // 'passive: true' mejora el rendimiento del scroll drásticamente
    window.addEventListener("scroll", handleInteraction, { passive: true, once: true });
    window.addEventListener("touchstart", handleInteraction, { passive: true, once: true });
    window.addEventListener("mousemove", handleInteraction, { passive: true, once: true });

    return () => {
      window.removeEventListener("scroll", handleInteraction);
      window.removeEventListener("touchstart", handleInteraction);
      window.removeEventListener("mousemove", handleInteraction);
    };
  }, [isVideoActive]);

  // 🎥 URL optimizada: Agregamos 'rel=0' para que no salgan videos de la competencia al final
  const src = `https://www.youtube-nocookie.com/embed/${VIDEO_ID}?autoplay=1&mute=0&controls=1&playsinline=1&rel=0&iv_load_policy=3&modestbranding=1`;

  return (
    // Reducimos el padding vertical del section (py-6 md:py-8) para que no quede tan separado de otros componentes
    <section className="w-full px-3 py-6 md:py-8 flex justify-center bg-gray-50 font-sans">
      {/* Inyectamos la fuente Bebas Neue directamente */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap');
        .font-bebas { font-family: 'Bebas Neue', sans-serif; }
      `}</style>

      <div
        className="
          relative w-full max-w-7xl
          rounded-[24px] sm:rounded-[40px]
          overflow-hidden
          bg-white
          border border-black/5
          /* Ajustamos padding interno para optimizar espacio */
          px-5 py-8
          sm:px-8 sm:py-10
          md:px-12 md:py-12
          grid grid-cols-1 lg:grid-cols-[1.4fr_1fr]
          /* Reducimos el gap para unir visualmente video y texto */
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
          >
            {!isVideoActive ? (
              <>
                {/* 1. Imagen de alta calidad */}
                <img
                  src={`https://i.ytimg.com/vi/${VIDEO_ID}/maxresdefault.jpg`}
                  alt="Video Promocional 10K Ruta de los Tres Juanes"
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  loading="lazy"
                />
                
                {/* 2. Overlay Oscuro */}
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-all duration-300" />

                {/* 3. Botón de Play */}
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
          {/* Tagline pequeña */}
          <p className="uppercase tracking-[0.2em] text-xs sm:text-xs text-[#C02485] font-bold mb-2 font-sans">
            Ambato, Ecuador • 2026
          </p>

          {/* Título Principal - Ajustado para ser impactante pero no invasivo */}
          <h1 className="font-bebas text-[40px] sm:text-[50px] lg:text-[64px] xl:text-[72px] leading-[0.9] text-black mb-4 sm:mb-5">
            <span className="block tracking-wide">10K Ruta de los</span>
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-[#C02485] to-[#E5006D]">
              Tres Juanes
            </span>
          </h1>

          {/* Descripción */}
          <p className="text-sm sm:text-base md:text-lg text-gray-600 leading-relaxed mb-6 max-w-lg mx-auto lg:mx-0 font-medium font-sans">
            Vive la magia de correr bajo las luces de la ciudad. Celebra la <span className="text-black font-semibold">Fiesta de la Fruta y de las Flores</span> en la carrera nocturna más emblemática del país.
          </p>

          {/* Botones de Acción */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start font-sans">
            <a
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
            </a>
            <a
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
            </a>
          </div>

          {/* Pie de organizador */}
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