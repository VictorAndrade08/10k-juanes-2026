"use client";

import { useEffect, useState } from "react";

const IMAGES = [
  "https://mandarinas.10kindependenciadeambato.com/wp-content/uploads/2025/12/portada.webp",
  "https://mandarinas.10kindependenciadeambato.com/wp-content/uploads/2025/12/portada2.webp",
];

export default function Publicidad() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % IMAGES.length);
    }, 4500);
    return () => clearInterval(interval);
  }, []);

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
        {/* un poco más “bajita” para que no se sienta tan larga */}
        <div className="relative w-full aspect-[16/6.2] sm:aspect-[16/6] md:aspect-[16/5.6] bg-black">
          {IMAGES.map((src, i) => (
            <img
              key={src}
              src={src}
              alt="Publicidad oficial"
              className={`
                absolute inset-0 w-full h-full object-cover
                transition-opacity duration-700 ease-in-out
                ${i === index ? "opacity-100" : "opacity-0"}
              `}
              loading="lazy"
              decoding="async"
            />
          ))}
        </div>
      </div>
    </section>
  );
}
