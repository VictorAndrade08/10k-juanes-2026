"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";

type GalleryItem = { src: string; alt: string };

const IMAGES: GalleryItem[] = [
  { src: "https://mandarinas.10kindependenciadeambato.com/wp-content/uploads/2025/12/juanes1.jpg", alt: "Corredor 1" },
  { src: "https://mandarinas.10kindependenciadeambato.com/wp-content/uploads/2025/12/juanes2.jpg", alt: "Corredor 2" },
  { src: "https://mandarinas.10kindependenciadeambato.com/wp-content/uploads/2025/12/juanes3.jpg", alt: "Corredor 3" },
  { src: "https://mandarinas.10kindependenciadeambato.com/wp-content/uploads/2025/12/juanes4.jpg", alt: "Corredor 4" },
  { src: "https://mandarinas.10kindependenciadeambato.com/wp-content/uploads/2025/12/juanes5.jpg", alt: "Corredor 5" },
  { src: "https://mandarinas.10kindependenciadeambato.com/wp-content/uploads/2025/12/juanes6.jpg", alt: "Corredor 6" },
  { src: "https://mandarinas.10kindependenciadeambato.com/wp-content/uploads/2025/12/juanes7.jpg", alt: "Corredor 7" },
  { src: "https://mandarinas.10kindependenciadeambato.com/wp-content/uploads/2025/12/juanes8.jpg", alt: "Corredor 8" },
  { src: "https://mandarinas.10kindependenciadeambato.com/wp-content/uploads/2025/12/juanes9.jpg", alt: "Corredor 9" },
  { src: "https://mandarinas.10kindependenciadeambato.com/wp-content/uploads/2025/12/juanes10.jpg", alt: "Corredor 10" },
  { src: "https://mandarinas.10kindependenciadeambato.com/wp-content/uploads/2025/12/juanes11.jpg", alt: "Corredor 11" },
  { src: "https://mandarinas.10kindependenciadeambato.com/wp-content/uploads/2025/12/juanes12.jpg", alt: "Corredor 12" },
  { src: "https://mandarinas.10kindependenciadeambato.com/wp-content/uploads/2025/12/juanes13.jpg", alt: "Corredor 13" },
  { src: "https://mandarinas.10kindependenciadeambato.com/wp-content/uploads/2025/12/juanes14.jpg", alt: "Corredor 14" },
  { src: "https://mandarinas.10kindependenciadeambato.com/wp-content/uploads/2025/12/juanes15.jpg", alt: "Corredor 15" },
];

// 🔄 Mezclar imágenes aleatoriamente
function shuffleFast<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function TopGallery() {
  const [subset, setSubset] = useState<GalleryItem[]>(() => IMAGES.slice(0, 10));
  const didShuffle = useRef(false);

  useEffect(() => {
    if (!didShuffle.current) {
      didShuffle.current = true;
      setSubset(shuffleFast(IMAGES).slice(0, 12)); // Mostramos un poco más para pantallas anchas
    }
  }, []);

  const belt = useMemo(() => [...subset, ...subset], [subset]);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const active = activeIndex === null ? null : subset[activeIndex];
  const closeBtnRef = useRef<HTMLButtonElement | null>(null);

  // Navegación con teclado
  useEffect(() => {
    if (!active) return;
    const t = setTimeout(() => closeBtnRef.current?.focus(), 20);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setActiveIndex(null);
      if (e.key === "ArrowRight") setActiveIndex(v => (v === null ? 0 : (v + 1) % subset.length));
      if (e.key === "ArrowLeft") setActiveIndex(v => (v === null ? 0 : (v - 1 + subset.length) % subset.length));
    };
    window.addEventListener("keydown", onKey);
    return () => {
      clearTimeout(t);
      window.removeEventListener("keydown", onKey);
    };
  }, [active, subset.length]);

  // Pausar animación si no está visible (Performance)
  const marqueeRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    const el = marqueeRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      entries => {
        for (const entry of entries) {
          if (entry.target instanceof HTMLElement) {
            entry.target.style.animationPlayState = entry.isIntersecting ? "running" : "paused";
          }
        }
      },
      { threshold: 0.05 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <>
      {/* Ajuste: Padding vertical reducido (py-4 md:py-6) para integración compacta */}
      <section className="w-full px-3 py-4 md:py-6 flex justify-center bg-gray-50">
        <div className="w-full max-w-7xl">
          {/* Contenedor Principal: Fondo oscuro elegante con borde sutil magenta */}
          <div className="
            relative overflow-hidden 
            rounded-[20px] sm:rounded-[32px] 
            border border-black/5
            bg-[#1a1a1a] 
            shadow-lg
          ">
            {/* Gradientes laterales para suavizar la entrada/salida de fotos */}
            <div className="pointer-events-none absolute inset-y-0 left-0 w-12 sm:w-20 bg-gradient-to-r from-[#1a1a1a] to-transparent z-10" />
            <div className="pointer-events-none absolute inset-y-0 right-0 w-12 sm:w-20 bg-gradient-to-l from-[#1a1a1a] to-transparent z-10" />

            {/* Carrusel */}
            <div className="py-5 sm:py-6 overflow-hidden">
              <div
                ref={marqueeRef}
                className="flex gap-4 sm:gap-6 tg-marquee"
                style={
                  {
                    "--tgDuration": "25s",
                    "--tgDurationMobile": "18s"
                  } as React.CSSProperties
                }
              >
                {belt.map((img, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setActiveIndex(i % subset.length)}
                    className="
                      group relative 
                      w-[200px] sm:w-[260px] md:w-[320px] 
                      h-[130px] sm:h-[170px] md:h-[210px] 
                      flex-shrink-0 
                      overflow-hidden rounded-[16px] 
                      border border-white/10 
                      bg-black 
                      transition-transform active:scale-95 hover:scale-[1.02]
                      focus:outline-none focus:ring-2 focus:ring-[#C02485]
                    "
                    aria-label={`Ver foto ${img.alt}`}
                  >
                    <img
                      src={img.src}
                      alt={img.alt}
                      className="absolute inset-0 w-full h-full object-cover opacity-80 transition-all duration-500 group-hover:opacity-100 group-hover:scale-110"
                      loading="lazy"
                      draggable={false}
                    />
                    
                    {/* Overlay gradiente marca al hacer hover */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#C02485]/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    
                    {/* Icono de zoom al hover */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="bg-black/30 backdrop-blur-sm p-2 rounded-full">
                           <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                           </svg>
                        </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Animación CSS en línea */}
            <style>{`
              @keyframes tgMarquee {
                0% { transform: translate3d(0, 0, 0); }
                100% { transform: translate3d(-50%, 0, 0); }
              }
              .tg-marquee {
                animation: tgMarquee var(--tgDuration, 25s) linear infinite;
                will-change: transform;
              }
              @media (hover: hover) {
                .tg-marquee:hover { animation-play-state: paused; }
              }
              @media (max-width: 640px) {
                .tg-marquee { animation-duration: var(--tgDurationMobile, 18s); }
              }
              @media (prefers-reduced-motion: reduce) {
                .tg-marquee { animation: none; transform: none; }
              }
            `}</style>
          </div>
        </div>
      </section>

      {/* Modal - Fullscreen */}
      {active && (
        <div
          className="fixed inset-0 z-[9999] bg-black/90 backdrop-blur-md flex items-center justify-center p-2 sm:p-4"
          onClick={() => setActiveIndex(null)}
          role="dialog"
          aria-modal="true"
        >
          <div
            className="relative w-full max-w-5xl h-full max-h-[90vh] flex flex-col items-center justify-center"
            onClick={e => e.stopPropagation()}
          >
            {/* Controles Superiores */}
            <div className="absolute top-0 right-0 z-20 flex gap-3 p-4">
              <button
                ref={closeBtnRef}
                onClick={() => setActiveIndex(null)}
                className="
                    flex items-center gap-2 px-4 py-2 
                    rounded-full bg-white/10 hover:bg-[#C02485] 
                    backdrop-blur-sm border border-white/20 
                    text-white text-sm font-bold uppercase tracking-wider 
                    transition-all active:scale-95
                "
              >
                <span>Cerrar</span>
                <span className="text-lg leading-none">×</span>
              </button>
            </div>

            {/* Navegación Lateral (Solo visible en Desktop para no tapar foto en móvil) */}
            <button
                onClick={(e) => { e.stopPropagation(); setActiveIndex(v => (v === null ? 0 : (v - 1 + subset.length) % subset.length)); }}
                className="hidden md:flex absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 items-center justify-center rounded-full bg-white/10 hover:bg-[#C02485] text-white border border-white/20 transition-all z-20"
            >
                ‹
            </button>
            <button
                onClick={(e) => { e.stopPropagation(); setActiveIndex(v => (v === null ? 0 : (v + 1) % subset.length)); }}
                className="hidden md:flex absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 items-center justify-center rounded-full bg-white/10 hover:bg-[#C02485] text-white border border-white/20 transition-all z-20"
            >
                ›
            </button>

            {/* Imagen Principal */}
            <div className="relative w-full h-full rounded-[20px] overflow-hidden shadow-2xl bg-black border border-white/10">
              <img
                src={active.src}
                alt={active.alt}
                className="absolute inset-0 w-full h-full object-contain"
                loading="eager"
                draggable={false}
              />
              
              {/* Controles Táctiles Invisibles (Zonas de toque para móvil) */}
              <div className="md:hidden absolute inset-0 flex">
                  <div className="w-1/3 h-full" onClick={(e) => { e.stopPropagation(); setActiveIndex(v => (v === null ? 0 : (v - 1 + subset.length) % subset.length)); }}></div>
                  <div className="w-1/3 h-full" onClick={() => setActiveIndex(null)}></div> {/* Centro cierra */}
                  <div className="w-1/3 h-full" onClick={(e) => { e.stopPropagation(); setActiveIndex(v => (v === null ? 0 : (v + 1) % subset.length)); }}></div>
              </div>
            </div>

            {/* Indicador de posición */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-black/50 backdrop-blur text-white/70 text-xs font-medium border border-white/10">
                {activeIndex !== null ? activeIndex + 1 : 0} / {subset.length}
            </div>
          </div>
        </div>
      )}
    </>
  );
}