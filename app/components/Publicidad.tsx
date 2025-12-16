"use client";

import { useEffect, useMemo, useState } from "react";

const IMAGES = [
  "https://mandarinas.10kindependenciadeambato.com/wp-content/uploads/2025/12/portada.webp",
  "https://mandarinas.10kindependenciadeambato.com/wp-content/uploads/2025/12/portada2.webp",
];

export default function Publicidad() {
  const [index, setIndex] = useState(0);

  // ✅ siempre renderiza SOLO 1 imagen (la actual)
  const current = useMemo(() => IMAGES[index], [index]);

  useEffect(() => {
    // ✅ precarga la siguiente (pero SOLO cuando ya estás en cliente)
    const next = IMAGES[(index + 1) % IMAGES.length];
    const img = new Image();
    img.decoding = "async";
    img.src = next;

    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % IMAGES.length);
    }, 4500);

    return () => clearInterval(interval);
  }, [index]);

  return (
    <section className="w-full flex justify-center px-4 mt-3 md:mt-5 mb-2 md:mb-3">
      <div
        className="
          relative w-full max-w-7xl
          rounded-[32px]
          overflow-hidden
          bg-black
          shadow-[0_10px_30px_rgba(0,0,0,0.28)]
        "
      >
        <div className="relative w-full aspect-[16/6.2] sm:aspect-[16/6] md:aspect-[16/5.6] bg-black">
          <img
            key={current} // ✅ fuerza swap limpio en transición
            src={current}
            alt="Publicidad oficial"
            className="absolute inset-0 w-full h-full object-cover"
            // ✅ ESTA ES LA CLAVE PARA LCP
            loading="eager"
            fetchPriority="high"
            decoding="async"
            referrerPolicy="no-referrer"
          />
        </div>
      </div>
    </section>
  );
}
