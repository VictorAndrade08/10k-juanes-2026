"use client";

import React, { useMemo, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

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
  // Nuevos logos agregados
  {
    src: "https://antiquewhite-rook-228372.hostingersite.com/wp-content/uploads/2025/12/Carrera-10K-Independencia-de-Amb-9-1-copia.webp",
    alt: "Logo Patrocinador Adicional 1",
  },
  {
    src: "https://antiquewhite-rook-228372.hostingersite.com/wp-content/uploads/2025/12/1Carrera-10K-Independencia-de-Amb-9-1-copia.webp",
    alt: "Logo Patrocinador Adicional 2",
  },
  {
    src: "https://antiquewhite-rook-228372.hostingersite.com/wp-content/uploads/2025/12/12323.webp",
    alt: "Logo Patrocinador Adicional 3",
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
  const duplicated = useMemo(() => [...logos, ...logos, ...logos, ...logos], [logos]);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const positionRef = useRef(0);
  const animationRef = useRef<number>(0);
  
  // Referencia para la velocidad actual (permite cambiarla sin re-renderizar)
  const speedRef = useRef(0.4); 
  
  const [direction, setDirection] = useState<1 | -1>(1);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const animate = () => {
      // Solo nos movemos si NO está pausado (hover en logos)
      if (!isPaused && container) {
        positionRef.current -= speedRef.current * direction;
        
        const totalWidth = container.scrollWidth;
        const singleSetWidth = totalWidth / 4;

        // Loop Infinito
        if (direction === 1) {
           if (positionRef.current <= -singleSetWidth) {
             positionRef.current += singleSetWidth;
           }
        } else {
           if (positionRef.current >= 0) {
             positionRef.current -= singleSetWidth;
           }
        }

        container.style.transform = `translate3d(${positionRef.current}px, 0, 0)`;
      }
      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(animationRef.current);
  }, [direction, isPaused]);

  // Manejadores para acelerar al pasar por las flechas
  const handleArrowEnter = (newDirection: 1 | -1) => {
    setDirection(newDirection);
    speedRef.current = 2.5; // VELOCIDAD RÁPIDA
    setIsPaused(false); // Aseguramos que no esté pausado
  };

  const handleArrowLeave = () => {
    speedRef.current = 0.4; // VELOCIDAD NORMAL
  };

  return (
    <section className="w-full px-3 py-4 flex justify-center bg-gray-50 font-sans">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap');
        .font-bebas { font-family: 'Bebas Neue', sans-serif; }
      `}</style>

      <div
        className="
          w-full max-w-7xl
          rounded-[24px] sm:rounded-[32px]
          bg-white
          shadow-[0_10px_30px_-10px_rgba(0,0,0,0.08)]
          border border-gray-100
          px-4 sm:px-6 md:px-10 
          py-6 sm:py-8
          relative
          overflow-hidden
        "
      >
        {/* Título */}
        <div className="flex items-center justify-center gap-4 mb-6 sm:mb-8">
            <div className="h-px w-8 sm:w-16 bg-gradient-to-r from-transparent to-[#C02485]/50"></div>
            <p className="text-center text-[24px] sm:text-[32px] tracking-[0.1em] uppercase text-gray-800 font-bebas">
              Nuestros <span className="text-[#C02485]">Patrocinadores</span>
            </p>
            <div className="h-px w-8 sm:w-16 bg-gradient-to-l from-transparent to-[#C02485]/50"></div>
        </div>

        {/* Contenedor Principal */}
        <div className="relative w-full flex items-center">
          
          {/* Flecha Izquierda (Acelera hacia la derecha) */}
          <div className="absolute left-0 z-20 h-full flex items-center bg-gradient-to-r from-white via-white/80 to-transparent pr-8 pl-2">
            <button 
              onMouseEnter={() => handleArrowEnter(-1)}
              onMouseLeave={handleArrowLeave}
              onClick={() => setDirection(-1)}
              className={`
                h-10 w-10 rounded-full border shadow-md flex items-center justify-center transition-all active:scale-95
                ${direction === -1 
                  ? 'bg-[#C02485] text-white border-[#C02485]' 
                  : 'bg-white text-gray-500 border-gray-200 hover:text-[#C02485] hover:border-[#C02485]'
                }
              `}
              aria-label="Mover a la derecha rápido"
            >
              <ChevronLeft size={24} />
            </button>
          </div>

          {/* Área Visible (Viewport) - Solo AQUÍ pausamos al hover */}
          <div 
            className="w-full overflow-hidden mx-8 sm:mx-12 cursor-grab active:cursor-grabbing"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
          >
            <div 
              ref={containerRef}
              className="flex gap-6 sm:gap-10 items-center w-max will-change-transform"
            >
              {duplicated.map((logo, i) => (
                <div
                  key={`${logo.src}-${i}`}
                  className="
                    flex-none
                    h-16 sm:h-20 md:h-24
                    min-w-[120px] sm:min-w-[160px]
                    px-4 sm:px-6
                    rounded-2xl
                    bg-gray-50
                    border border-gray-100
                    flex items-center justify-center
                    group
                    transition-all duration-300
                    hover:bg-white hover:shadow-lg hover:border-[#C02485]/20 hover:-translate-y-1
                  "
                >
                  <img
                    src={logo.src}
                    alt={logo.alt}
                    loading="lazy"
                    draggable={false}
                    className="
                      max-h-12 sm:max-h-14 md:max-h-16 w-auto 
                      object-contain 
                      grayscale opacity-70 
                      transition-all duration-500 
                      group-hover:grayscale-0 group-hover:opacity-100 group-hover:scale-110
                    "
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Flecha Derecha (Acelera hacia la izquierda) */}
          <div className="absolute right-0 z-20 h-full flex items-center bg-gradient-to-l from-white via-white/80 to-transparent pl-8 pr-2">
             <button 
               onMouseEnter={() => handleArrowEnter(1)}
               onMouseLeave={handleArrowLeave}
               onClick={() => setDirection(1)}
               className={`
                 h-10 w-10 rounded-full border shadow-md flex items-center justify-center transition-all active:scale-95
                 ${direction === 1 
                   ? 'bg-[#C02485] text-white border-[#C02485]' 
                   : 'bg-white text-gray-500 border-gray-200 hover:text-[#C02485] hover:border-[#C02485]'
                 }
               `}
               aria-label="Mover a la izquierda rápido"
             >
              <ChevronRight size={24} />
            </button>
          </div>

        </div>
      </div>
    </section>
  );
}