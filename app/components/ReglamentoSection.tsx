"use client";

import React from "react";
import { Scale, FileCheck, ArrowRight, ShieldCheck } from "lucide-react";

export default function ReglamentoSection() {
  return (
    <section id="reglamento" className="w-full px-3 py-4 flex justify-center bg-[#0a0a0a] font-sans">
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
          py-12 sm:py-20
          shadow-[0_20px_70px_-10px_rgba(0,0,0,0.6)]
          border border-white/10
          overflow-hidden
          flex flex-col items-center text-center
        "
      >
        {/* Fondo Decorativo Magenta */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-[#C02485]/10 rounded-full blur-[120px] pointer-events-none" />

        <div className="relative z-10 max-w-4xl mx-auto flex flex-col items-center">
            
            {/* Icono Principal */}
            <div className="mb-6 p-4 rounded-2xl bg-white/5 border border-white/10 shadow-[0_0_30px_rgba(192,36,133,0.15)] backdrop-blur-sm">
                <Scale className="w-8 h-8 sm:w-10 sm:h-10 text-[#C02485]" />
            </div>

            {/* Etiqueta */}
            <p className="text-xs sm:text-sm uppercase tracking-[0.3em] text-gray-500 font-bold mb-4">
               Normativa Oficial
            </p>

            {/* Título */}
            <h2 className="text-[36px] sm:text-[52px] lg:text-[64px] leading-[0.95] mb-6 font-bebas text-white tracking-wide">
               Reglamento General <br className="hidden sm:block" />
               <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400">
                 10K Ruta de los Tres Juanes 2026
               </span>
            </h2>

            {/* Descripción */}
            <p className="text-base sm:text-lg text-gray-400 mb-10 leading-relaxed max-w-2xl font-medium">
               Para garantizar una competencia justa y segura, es obligatorio conocer las reglas. Aquí encontrarás detalles sobre categorías, chips de cronometraje, puntos de hidratación, descalificaciones y premiación.
            </p>

            {/* Botones de Acción */}
            <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
                <a
                    href="/reglamento"
                    className="
                    inline-flex items-center justify-center gap-2
                    px-8 py-4
                    rounded-full
                    bg-gradient-to-r from-[#C02485] to-[#E5006D]
                    text-white text-sm tracking-[0.15em]
                    font-bold uppercase
                    shadow-lg shadow-[#C02485]/30
                    hover:shadow-[#C02485]/50 hover:-translate-y-1 hover:gap-3
                    transition-all duration-300
                    "
                >
                    Leer Reglamento Completo <ArrowRight size={18} />
                </a>
                
                 <a
                    href="/faq"
                    className="
                    inline-flex items-center justify-center gap-2
                    px-8 py-4
                    rounded-full
                    bg-white/5 border border-white/10
                    text-white text-sm tracking-[0.15em]
                    font-bold uppercase
                    hover:bg-white/10 hover:border-white/20 hover:-translate-y-1
                    transition-all duration-300
                    "
                >
                    Preguntas Frecuentes
                </a>
            </div>
            
            {/* Pie de página con iconos de confianza */}
            <div className="mt-12 pt-8 border-t border-white/5 flex flex-wrap justify-center gap-6 sm:gap-12 opacity-60 w-full">
                <div className="flex items-center gap-2 text-[10px] sm:text-xs uppercase tracking-wider text-gray-400 font-semibold">
                    <ShieldCheck size={16} className="text-[#C02485]" />
                    <span>Avalado por la APDT</span>
                </div>
                 <div className="flex items-center gap-2 text-[10px] sm:text-xs uppercase tracking-wider text-gray-400 font-semibold">
                    <FileCheck size={16} className="text-[#C02485]" />
                    <span>Actualizado Enero 2026</span>
                </div>
            </div>

        </div>
      </div>
    </section>
  );
}