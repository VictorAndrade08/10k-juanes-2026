"use client";

import React from "react";
import { Map, Users, Package, PartyPopper, ArrowRight } from "lucide-react";

const CARDS = [
  {
    Icon: Map,
    title: "La Ruta de la Carrera",
    text: "Conoce cada tramo del recorrido nocturno por Ambato.",
    cta: "Ver mapa 3D",
  },
  {
    Icon: Users,
    title: "Categorías disponibles",
    text: "ELITE PRO, Juvenil, Senior, Master, Supermaster, Vilcabambas y Colegial.",
    cta: "Ver categorías",
  },
  {
    Icon: Package,
    title: "El mejor kit deportivo",
    text: "Camiseta oficial, medalla, chip, medias, Sporty bag e hidratación.",
    cta: "Ver kit completo",
  },
  {
    Icon: PartyPopper,
    title: "Fiesta, ciudad & ambiente",
    text: "La carrera se integra a la Fiesta de la Fruta y de las Flores: luces y música.",
    cta: "Ver galería",
  },
];

export default function ExperienceSection() {
  const handleCTA = () => {
    alert("🚀 ¡Próximamente disponible! Estamos preparando esta sección.");
  };

  return (
    <section className="w-full px-3 py-4 flex justify-center bg-[#0a0a0a] font-sans">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap');
        .font-bebas { font-family: 'Bebas Neue', sans-serif; }
      `}</style>

      <div
        className="
          relative
          w-full max-w-7xl
          rounded-[32px] sm:rounded-[48px]
          bg-[#070D18]
          text-white
          px-6 sm:px-10 lg:px-16
          py-10 sm:py-14
          shadow-[0_20px_60px_-10px_rgba(0,0,0,0.5)]
          border border-white/10
          overflow-hidden
        "
      >
        {/* Luces de fondo decorativas */}
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-[#C02485]/10 rounded-full blur-[100px] pointer-events-none -translate-y-1/2 translate-x-1/3" />
        <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-blue-500/5 rounded-full blur-[80px] pointer-events-none translate-y-1/3 -translate-x-1/3" />

        <div className="relative z-10">
            {/* Título de Sección */}
            <h2
            className="
                mb-10 sm:mb-14
                text-[32px] sm:text-[48px] lg:text-[58px]
                leading-[0.95]
                font-bebas
                text-center md:text-left
            "
            >
            Explora la experiencia <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400">
                10K Ruta de los Tres Juanes
            </span>
            </h2>

            {/* Grid de Tarjetas */}
            <div className="grid gap-6 md:gap-8 md:grid-cols-2 lg:grid-cols-4">
            {CARDS.map(({ Icon, title, text, cta }) => (
                <button
                key={title}
                onClick={handleCTA}
                className="
                    group relative
                    flex flex-col
                    rounded-[24px]
                    overflow-hidden
                    bg-white/5 backdrop-blur-sm
                    border border-white/5
                    min-h-[380px]
                    text-left
                    transition-all duration-300
                    hover:bg-[#C02485]/10 hover:border-[#C02485]/30 hover:-translate-y-2
                "
                >
                {/* Cabecera Icono */}
                <div className="
                    flex items-center justify-center 
                    h-[120px] 
                    bg-gradient-to-b from-white/5 to-transparent
                    border-b border-white/5
                    group-hover:from-[#C02485]/20 group-hover:to-transparent
                    transition-colors duration-300
                ">
                    <Icon className="w-12 h-12 text-white/70 group-hover:text-white group-hover:scale-110 transition-all duration-300" />
                </div>

                {/* Contenido */}
                <div className="p-6 sm:p-7 flex flex-col flex-1 justify-between">
                    <div>
                    <h3 className="font-bebas text-[24px] sm:text-[28px] mb-3 tracking-wide text-white group-hover:text-[#C02485] transition-colors">
                        {title}
                    </h3>

                    <p className="text-sm text-gray-400 leading-relaxed font-medium">
                        {text}
                    </p>
                    </div>

                    <div
                    className="
                        mt-6 text-[11px]
                        font-bold uppercase
                        tracking-[0.2em]
                        text-white/60 group-hover:text-white
                        flex items-center gap-2
                        transition-colors
                    "
                    >
                    {cta}
                    <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                    </div>
                </div>
                </button>
            ))}
            </div>
        </div>
      </div>
    </section>
  );
}