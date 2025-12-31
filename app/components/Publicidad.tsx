"use client";

import React from "react";

const DESKTOP_IMAGE = "https://antiquewhite-rook-228372.hostingersite.com/wp-content/uploads/2025/12/banner10K.webp";
const MOBILE_IMAGE = "https://antiquewhite-rook-228372.hostingersite.com/wp-content/uploads/2025/12/Post10k-Editable.webp";

export default function Publicidad() {
  return (
    <section className="w-full flex justify-center px-4 mt-3 md:mt-5 mb-2 md:mb-3">
      <div
        className="
          relative w-full max-w-7xl
          rounded-[20px] md:rounded-[32px]
          overflow-hidden
          shadow-[0_10px_30px_rgba(0,0,0,0.28)]
          bg-gray-200 
        "
        // bg-gray-200 ayuda a que se vea un cuadro gris sutil mientras carga, mejorando la percepción
      >
        <picture className="w-full h-auto block">
          {/* OPTIMIZACIÓN DESKTOP:
             Según tu reporte, esta imagen es de 1600x600.
             Definimos width y height aquí para que Chrome reserve el espacio correcto en PC.
          */}
          <source 
            media="(min-width: 768px)" 
            srcSet={DESKTOP_IMAGE}
            width={1600}
            height={600}
          />
          
          {/* OPTIMIZACIÓN MÓVIL:
             IMPORTANTE: He puesto 1080x1080 como ejemplo estándar de un "Post".
             Si tu imagen móvil tiene otras dimensiones (ej. 1080x1350), 
             cambia estos números para evitar saltos.
          */}
          <img
            src={MOBILE_IMAGE}
            alt="Publicidad oficial 10K Independencia de Ambato"
            width={1080} 
            height={1080}
            className="w-full h-auto object-cover"
            style={{ width: '100%', height: 'auto' }} // Esto asegura que sea responsive y anula el tamaño fijo de los atributos width/height
            loading="eager"
            fetchPriority="high"
            decoding="async"
          />
        </picture>
      </div>
    </section>
  );
}