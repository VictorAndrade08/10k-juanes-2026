"use client";

import React from "react";
import { Bebas_Neue } from "next/font/google"; // 1. Fuente optimizada
import { Trophy, ArrowRight, Calendar } from "lucide-react";

// 2. Configuración de fuente (Sin bloqueo)
const bebas = Bebas_Neue({
  subsets: ["latin"],
  weight: "400",
  display: "swap",
  variable: "--font-bebas",
});

export default function FeaturedStories() {
  return (
    // 3. Inyección de variable de fuente
    <section className={`w-full px-3 py-4 flex justify-center bg-[#0a0a0a] font-sans ${bebas.variable}`}>
      
      {/* <style> Eliminado para evitar bloqueo de renderizado */}

      <div
        className="
          relative
          w-full max-w-7xl
          rounded-[32px] sm:rounded-[48px]
          bg-[#070D18]
          text-white
          px-6 sm:px-10 lg:px-16
          py-10 sm:py-14
          shadow-[0_20px_60px_-10px_rgba(0,0,0,0.6)]
          border border-white/10
          overflow-hidden
        "
      >
        {/* Fondo decorativo */}
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-[#C02485]/5 rounded-full blur-[100px] pointer-events-none translate-y-1/3 translate-x-1/3" />

        <div className="relative z-10">
          
          {/* CABECERA */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-10 gap-6">
            <h2
              className="
                text-[32px] sm:text-[48px] lg:text-[58px]
                leading-[0.95]
                tracking-wide
                font-[family-name:var(--font-bebas)]
                text-white
              "
            >
              Noticias &amp; <br className="sm:hidden" /> 
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400">
                Historias Destacadas
              </span>
            </h2>

            {/* Paginación Visual OPTIMIZADA */}
            {/* CORRECCIÓN A11Y: Cambiamos <button> por <div> porque están dentro de aria-hidden="true".
                Esto evita que el teclado haga foco en elementos invisibles para el lector de pantalla. */}
            <div className="hidden sm:flex items-center gap-3 bg-white/5 px-4 py-2 rounded-full border border-white/10" aria-hidden="true">
              <div className="h-2.5 w-2.5 rounded-full bg-[#C02485] shadow-[0_0_10px_#C02485]" />
              <div className="h-2.5 w-2.5 rounded-full bg-white/20 hover:bg-white/50 transition-colors" />
              <div className="h-2.5 w-2.5 rounded-full bg-white/20 hover:bg-white/50 transition-colors" />
            </div>
          </div>

          {/* TARJETA PRINCIPAL */}
          <article
            className="
              group
              rounded-[24px] sm:rounded-[40px]
              bg-white/5
              backdrop-blur-md
              border border-white/5
              p-6 sm:p-10 md:p-12
              flex flex-col md:flex-row
              items-stretch
              gap-8 md:gap-12
              transition-all duration-300
              hover:bg-[#C02485]/5 hover:border-[#C02485]/20 hover:shadow-[0_20px_50px_-20px_rgba(192,36,133,0.15)]
            "
          >
            {/* TEXTO */}
            <div className="flex-1 flex flex-col justify-center order-2 md:order-1">
              <div className="flex items-center gap-2 text-[#C02485] mb-4 text-xs font-bold uppercase tracking-widest">
                <Calendar size={14} />
                <span>Diciembre 2025</span>
              </div>

              <h3
                className="
                  text-[28px] sm:text-[42px]
                  leading-[1]
                  tracking-wide
                  mb-5
                  font-[family-name:var(--font-bebas)]
                  text-white group-hover:text-white transition-colors
                "
              >
                “La mejor carrera nocturna <br className="hidden lg:block"/> que he corrido”
              </h3>

              <p className="text-base sm:text-lg text-gray-400 leading-relaxed max-w-xl mb-8 font-medium">
                Conoce la experiencia de corredores que ya vivieron la 10K Ruta de
                los Tres Juanes: organización, ambiente y los desafíos únicos de correr bajo las luces de Ambato.
              </p>

              <div>
                <button 
                    className="
                        inline-flex items-center gap-2 
                        text-white text-sm font-bold uppercase tracking-[0.2em] 
                        group/btn hover:text-[#C02485] transition-colors
                    "
                    aria-label="Leer historia completa sobre la experiencia de los corredores"
                >
                    Leer historia completa 
                    <ArrowRight size={16} className="group-hover/btn:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>

            {/* ÍCONO / IMAGEN */}
            <div
              className="
                order-1 md:order-2
                w-full md:w-[320px]
                min-h-[220px] md:min-h-auto
                rounded-[20px]
                bg-gradient-to-br from-white/5 to-transparent
                border border-white/10
                flex items-center justify-center
                relative
                overflow-hidden
                group-hover:border-[#C02485]/30 transition-colors
              "
              aria-hidden="true"
            >
              {/* Brillo interior al hover */}
              <div className="absolute inset-0 bg-[#C02485]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl" />
              
              <Trophy 
                className="w-20 h-20 sm:w-24 sm:h-24 text-white/50 group-hover:text-[#C02485] group-hover:scale-110 transition-all duration-300 relative z-10" 
                strokeWidth={1.5} 
              />
            </div>
          </article>

        </div>
      </div>
    </section>
  );
}