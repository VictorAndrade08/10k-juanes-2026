"use client";

import { useEffect, useState } from "react";

const IMAGES = [
  "https://mandarinas.10kindependenciadeambato.com/wp-content/uploads/2025/12/portada.webp",
  "https://mandarinas.10kindependenciadeambato.com/wp-content/uploads/2025/12/portada2.webp",
];

export default function Publicidad() {
  const [index, setIndex] = useState(0);

  // 🔁 Auto slide
  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % IMAGES.length);
    }, 4500); // cambia cada 4.5s

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="w-full flex justify-center px-4 mt-12">
      {/* CONTENEDOR FIJO (igual al header) */}
      <div
        className="
          relative
          w-full max-w-7xl
          rounded-3xl
          overflow-hidden
          bg-black
          shadow-[0_20px_60px_rgba(0,0,0,0.45)]
        "
      >
        {/* ALTURA FIJA → nunca cambia */}
        <div className="relative w-full aspect-[16/6] bg-black">
          {IMAGES.map((src, i) => (
            <img
              key={src}
              src={src}
              alt="Publicidad oficial"
              className={`
                absolute inset-0
                w-full h-full
                object-cover
                transition-opacity duration-700 ease-in-out
                ${i === index ? "opacity-100" : "opacity-0"}
              `}
              loading="lazy"
            />
          ))}
        </div>
      </div>
    </section>
  );
}
