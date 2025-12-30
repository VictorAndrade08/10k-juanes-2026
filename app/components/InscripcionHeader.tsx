"use client";

import { Bebas_Neue } from "next/font/google";

// Cargamos Bebas para el título
const bebas = Bebas_Neue({
  subsets: ["latin"],
  weight: "400",
});

export default function InscripcionHeader() {
  return (
    <div className="w-full flex justify-center px-3 md:px-4 mt-4 md:mt-8">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@400;500;600&display=swap');
        .font-barlow { font-family: 'Barlow Condensed', sans-serif; }
      `}</style>

      <div
        className="
          relative w-full max-w-7xl mx-auto
          bg-[#05071A]
          rounded-[24px] md:rounded-[32px]
          border border-white/10
          shadow-[0_10px_40px_rgba(0,0,0,0.4)]
          overflow-hidden
          
          /* Padding interno optimizado */
          px-6 py-8 md:px-16 md:py-12
          
          /* Flex para alinear contenido */
          flex flex-col md:flex-row items-center md:items-end justify-between
          gap-6 md:gap-0
        "
      >
        {/* --- EFECTO DE LUZ DE FONDO (Glow) --- */}
        {/* Un brillo sutil magenta en la parte inferior para dar elegancia */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-32 bg-[#C02485] blur-[120px] opacity-15 pointer-events-none" />

        {/* --- LADO IZQUIERDO: TÍTULO --- */}
        <div className="relative z-10 flex flex-col items-center md:items-start text-center md:text-left">
          
          {/* Subtítulo / Estado - AUMENTADO DE TAMAÑO PERO ELEGANTE */}
          <div className="flex items-center gap-3 mb-3">
            {/* Punto pulsante (Live indicator) */}
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#E5006D] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-[#E5006D]"></span>
            </span>

            <p 
              className="
                font-barlow font-semibold uppercase 
                text-white/70       /* Color suavizado para no competir */
                tracking-[0.2em]    /* Espaciado amplio para elegancia */
                text-[13px] md:text-[15px] /* TAMAÑO MUCHO MÁS LEGIBLE */
              "
            >
              Inscripción Oficial 2026
            </p>
          </div>

          {/* Título Principal */}
          <h1
            className={`
              ${bebas.className}
              text-[42px] xs:text-[48px] md:text-[80px] /* Títulos grandes */
              leading-[0.9] text-white
              tracking-wide
              drop-shadow-lg
            `}
          >
            Formulario de <span className="text-[#E5006D]">Inscripción</span>
          </h1>
        </div>

        {/* --- LADO DERECHO: INFO EXTRA (Desktop) --- */}
        {/* Se oculta en móviles muy pequeños o se adapta */}
        <div className="relative z-10 flex flex-col items-center md:items-end text-center md:text-right font-barlow opacity-60 mt-2 md:mt-0">
           <p className="text-sm md:text-lg font-semibold uppercase tracking-[0.15em] text-white">
             10K Ruta de los Tres Juanes
           </p>
           <p className="text-xs md:text-sm text-white/60 tracking-wider">
             Ambato, Ecuador
           </p>
        </div>

      </div>
    </div>
  );
}