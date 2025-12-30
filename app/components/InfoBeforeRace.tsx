"use client";

import React from "react";
import { 
  Users, 
  GraduationCap, 
  HeartHandshake, 
  Megaphone, 
  ArrowRight 
} from "lucide-react";

const ITEMS = [
  {
    title: "Atletas generales",
    desc: "Requisitos, horarios, puntos de partida y llegada para participantes de todas las categorías.",
    cta: "Ver info atletas",
    icon: Users,
  },
  {
    title: "Colegiales & juveniles",
    desc: "Información especial para estudiantes de colegios y jóvenes que participan en categorías formativas.",
    cta: "Info colegial",
    icon: GraduationCap,
  },
  {
    title: "Capacidades especiales",
    desc: "Detalles para participantes con discapacidad intelectual, visual y silla de calle, incluyendo acompañantes.",
    cta: "Ver categorías especiales",
    icon: HeartHandshake,
  },
  {
    title: "Sponsors & medios",
    desc: "Oportunidades de visibilidad, activaciones y cobertura para marcas y medios de comunicación.",
    cta: "Ver dossier",
    icon: Megaphone,
  },
];

export default function InfoBeforeRace() {
  const comingSoon = () => {
    alert("🚀 ¡Próximamente disponible! Estamos ultimando detalles.");
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
          w-full max-w-7xl mx-auto
          rounded-[32px] sm:rounded-[56px]
          bg-[#05071A]
          border border-white/10
          shadow-[0_20px_70px_-10px_rgba(192,36,133,0.15)]
          px-6 sm:px-10 lg:px-14
          py-10 sm:py-14
          overflow-hidden
        "
      >
        {/* Decoración de fondo */}
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-[#C02485]/10 rounded-full blur-[120px] pointer-events-none" />
        
        <div className="relative z-10">
            {/* Header */}
            <div className="mb-10 sm:mb-12 text-center md:text-left">
                <div className="flex items-center justify-center md:justify-start gap-3 mb-4">
                    <span className="h-px w-8 bg-[#C02485]"></span>
                    <p className="text-[#C02485] uppercase tracking-[0.4em] text-xs sm:text-sm font-bold font-sans">
                        Información Clave
                    </p>
                </div>

                <h2 className="text-white text-[38px] sm:text-[52px] md:text-[64px] leading-[0.9] font-bebas uppercase tracking-wide">
                    Todo lo que necesitas <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-500">
                        saber antes de correr
                    </span>
                </h2>
            </div>

            {/* Grid de Tarjetas */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5 sm:gap-6">
            {ITEMS.map((it) => (
                <button
                key={it.title}
                type="button"
                onClick={comingSoon}
                className="
                    group relative text-left
                    rounded-[24px]
                    bg-white/5 backdrop-blur-md
                    border border-white/5
                    p-6 sm:p-8
                    transition-all duration-300
                    hover:bg-[#C02485]/10 hover:border-[#C02485]/30 hover:-translate-y-2
                    flex flex-col
                    min-h-[280px]
                "
                >
                {/* Icono */}
                <div className="
                    w-12 h-12 rounded-2xl 
                    bg-white/5 border border-white/10 
                    flex items-center justify-center 
                    text-white mb-6
                    group-hover:bg-[#C02485] group-hover:border-[#C02485] group-hover:shadow-[0_0_20px_rgba(192,36,133,0.4)]
                    transition-all duration-300
                ">
                    <it.icon size={24} />
                </div>

                <h3 className="text-white text-[28px] leading-[1] font-bebas tracking-wide mb-3">
                    {it.title}
                </h3>

                <p className="text-gray-400 text-sm sm:text-base leading-relaxed font-medium mb-8">
                    {it.desc}
                </p>

                <div className="mt-auto flex items-center gap-2 text-white/60 group-hover:text-[#C02485] transition-colors uppercase tracking-[0.15em] text-xs font-bold">
                    {it.cta}
                    <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </div>
                </button>
            ))}
            </div>
        </div>
      </div>
    </section>
  );
}