"use client";

import React from "react";

const DESKTOP_IMAGE = "https://antiquewhite-rook-228372.hostingersite.com/wp-content/uploads/2025/12/banner10K.webp";
const MOBILE_IMAGE = "https://antiquewhite-rook-228372.hostingersite.com/wp-content/uploads/2025/12/598400494_18382025047148628_138312333499106242_n.webp";

export default function Publicidad() {
  return (
    <section className="w-full flex justify-center px-4 mt-3 md:mt-5 mb-2 md:mb-3">
      <div
        className="
          relative w-full max-w-7xl
          rounded-[20px] md:rounded-[32px]
          overflow-hidden
          shadow-[0_10px_30px_rgba(0,0,0,0.28)]
        "
      >
        {/* Usamos la etiqueta <picture> para cambio nativo y eficiente de imágenes.
           Esto asegura que el navegador descargue solo la imagen necesaria para el dispositivo,
           mejorando el LCP (Largest Contentful Paint).
        */}
        <picture className="w-full h-auto block">
          {/* Pantallas medianas y grandes (Desktop) */}
          <source 
            media="(min-width: 768px)" 
            srcSet={DESKTOP_IMAGE} 
          />
          
          {/* Imagen por defecto (Móvil) y fallback */}
          <img
            src={MOBILE_IMAGE}
            alt="Publicidad oficial 10K Independencia de Ambato"
            className="w-full h-auto object-cover"
            loading="eager"      // Carga inmediata para banners principales
            fetchPriority="high" // Prioridad alta para el navegador
            decoding="async"
          />
        </picture>
      </div>
    </section>
  );
}