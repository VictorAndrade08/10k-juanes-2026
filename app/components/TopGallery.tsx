"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";

type GalleryItem = { src: string; alt: string };

const IMAGES: GalleryItem[] = [
  { src: "https://mandarinas.10kindependenciadeambato.com/wp-content/uploads/2025/12/juanes1.jpg", alt: "Foto 1" },
  { src: "https://mandarinas.10kindependenciadeambato.com/wp-content/uploads/2025/12/juanes2.jpg", alt: "Foto 2" },
  { src: "https://mandarinas.10kindependenciadeambato.com/wp-content/uploads/2025/12/juanes3.jpg", alt: "Foto 3" },
  { src: "https://mandarinas.10kindependenciadeambato.com/wp-content/uploads/2025/12/juanes4.jpg", alt: "Foto 4" },
  { src: "https://mandarinas.10kindependenciadeambato.com/wp-content/uploads/2025/12/juanes5.jpg", alt: "Foto 5" },
  { src: "https://mandarinas.10kindependenciadeambato.com/wp-content/uploads/2025/12/juanes6.jpg", alt: "Foto 6" },
  { src: "https://mandarinas.10kindependenciadeambato.com/wp-content/uploads/2025/12/juanes7.jpg", alt: "Foto 7" },
  { src: "https://mandarinas.10kindependenciadeambato.com/wp-content/uploads/2025/12/juanes8.jpg", alt: "Foto 8" },
  { src: "https://mandarinas.10kindependenciadeambato.com/wp-content/uploads/2025/12/juanes9.jpg", alt: "Foto 9" },
  { src: "https://mandarinas.10kindependenciadeambato.com/wp-content/uploads/2025/12/juanes10.jpg", alt: "Foto 10" },
  { src: "https://mandarinas.10kindependenciadeambato.com/wp-content/uploads/2025/12/juanes11.jpg", alt: "Foto 11" },
  { src: "https://mandarinas.10kindependenciadeambato.com/wp-content/uploads/2025/12/juanes12.jpg", alt: "Foto 12" },
  { src: "https://mandarinas.10kindependenciadeambato.com/wp-content/uploads/2025/12/juanes13.jpg", alt: "Foto 13" },
  { src: "https://mandarinas.10kindependenciadeambato.com/wp-content/uploads/2025/12/juanes14.jpg", alt: "Foto 14" },
  { src: "https://mandarinas.10kindependenciadeambato.com/wp-content/uploads/2025/12/juanes15.jpg", alt: "Foto 15" },
  { src: "https://mandarinas.10kindependenciadeambato.com/wp-content/uploads/2025/12/juanes16.jpg", alt: "Foto 16" },
  { src: "https://mandarinas.10kindependenciadeambato.com/wp-content/uploads/2025/12/juanes17.jpg", alt: "Foto 17" },
  { src: "https://mandarinas.10kindependenciadeambato.com/wp-content/uploads/2025/12/juanes18.jpg", alt: "Foto 18" },
  { src: "https://mandarinas.10kindependenciadeambato.com/wp-content/uploads/2025/12/juanes19.jpg", alt: "Foto 19" }
];

// 🔄 Mezclar imágenes (evita repetir siempre igual)
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
      setSubset(shuffleFast(IMAGES).slice(0, 10));
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

  // Pausar animación si no está visible
  const marqueeRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    const el = marqueeRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      entries => {
        for (const entry of entries) {
          entry.target instanceof HTMLElement &&
            (entry.target.style.animationPlayState = entry.isIntersecting ? "running" : "paused");
        }
      },
      { threshold: 0.05 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <>
      <section className="w-full px-4 flex justify-center">
        <div className="w-full max-w-7xl">
          <div className="relative overflow-hidden rounded-[26px] border border-white/10 bg-gradient-to-br from-[#070D18] via-[#070D18] to-[#02040A] shadow-[0_18px_50px_rgba(0,0,0,0.35)]">
            {/* Gradientes laterales */}
            <div className="pointer-events-none absolute inset-y-0 left-0 w-10 sm:w-14 bg-gradient-to-r from-[#070D18] to-transparent z-10" />
            <div className="pointer-events-none absolute inset-y-0 right-0 w-10 sm:w-14 bg-gradient-to-l from-[#070D18] to-transparent z-10" />

            {/* Carrusel */}
            <div className="py-4 sm:py-5 overflow-hidden px-3 sm:px-5 md:px-8">
              <div
                ref={marqueeRef}
                className="flex gap-3 sm:gap-4 tg-marquee"
                style={
                  {
                    "--tgDuration": "18s",
                    "--tgDurationMobile": "14s"
                  } as React.CSSProperties
                }
              >
                {belt.map((img, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setActiveIndex(i % subset.length)}
                    className="relative w-[185px] sm:w-[240px] md:w-[300px] h-[120px] sm:h-[155px] md:h-[190px] flex-shrink-0 overflow-hidden rounded-[18px] border border-white/10 bg-black/25 active:scale-[0.98]"
                    aria-label={`Abrir ${img.alt}`}
                  >
                    <img
                      src={img.src}
                      alt={img.alt}
                      className="absolute inset-0 w-full h-full object-contain"
                      loading="lazy"
                      decoding="async"
                      draggable={false}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/5 to-transparent opacity-90" />
                  </button>
                ))}
              </div>
            </div>

            {/* Animación */}
            <style jsx>{`
              @keyframes tgMarquee {
                0% { transform: translate3d(0, 0, 0); }
                100% { transform: translate3d(-50%, 0, 0); }
              }
              .tg-marquee {
                animation: tgMarquee var(--tgDuration, 18s) linear infinite;
                will-change: transform;
              }
              @media (hover: hover) {
                .tg-marquee:hover { animation-play-state: paused; }
              }
              @media (max-width: 640px) {
                .tg-marquee { animation-duration: var(--tgDurationMobile, 14s); }
              }
              @media (prefers-reduced-motion: reduce) {
                .tg-marquee { animation: none; transform: none; }
              }
            `}</style>
          </div>
        </div>
      </section>

      {/* Modal */}
      {active && (
        <div
          className="fixed inset-0 z-[9999] bg-black/75 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4"
          onClick={() => setActiveIndex(null)}
          role="dialog"
          aria-modal="true"
        >
          <div
            className="relative w-full max-w-[980px] rounded-[24px] overflow-hidden border border-white/15 bg-[#070D18] shadow-[0_30px_120px_rgba(0,0,0,0.65)]"
            onClick={e => e.stopPropagation()}
          >
            {/* Botones */}
            <div className="absolute top-0 left-0 right-0 z-10 flex items-center justify-end gap-2 px-4 py-3 bg-gradient-to-b from-black/60 to-transparent">
              <button
                onClick={() => setActiveIndex(v => (v === null ? 0 : (v - 1 + subset.length) % subset.length))}
                className="h-10 w-10 rounded-full bg-white/10 border border-white/15 text-white text-lg active:scale-[0.98]"
              >
                ‹
              </button>
              <button
                onClick={() => setActiveIndex(v => (v === null ? 0 : (v + 1) % subset.length))}
                className="h-10 w-10 rounded-full bg-white/10 border border-white/15 text-white text-lg active:scale-[0.98]"
              >
                ›
              </button>
              <button
                ref={closeBtnRef}
                onClick={() => setActiveIndex(null)}
                className="h-10 px-4 rounded-full bg-white text-black text-xs font-bold uppercase tracking-[0.18em] active:scale-[0.98]"
              >
                Cerrar ✕
              </button>
            </div>

            {/* Imagen sin recorte */}
            <div className="relative w-full h-[78vh] sm:h-[80vh] bg-black">
              <img
                src={active.src}
                alt={active.alt}
                className="absolute inset-0 w-full h-full object-contain"
                loading="eager"
                decoding="async"
                draggable={false}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
