"use client";

import React from "react";
import { Facebook, Instagram, MessageCircle } from "lucide-react";

export default function Footer() {
  return (
    <footer className="w-full px-3 py-4 flex justify-center bg-gray-50 font-sans">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap');
        .font-bebas { font-family: 'Bebas Neue', sans-serif; }
      `}</style>

      <div
        className="
          w-full max-w-7xl
          rounded-[32px] sm:rounded-[48px]
          bg-gradient-to-br from-[#050B16] via-[#070D18] to-[#02040A]
          text-white
          px-6 sm:px-10 lg:px-16
          py-12 sm:py-16
          shadow-[0_28px_70px_rgba(0,0,0,0.45)]
          border border-white/10
          flex flex-col lg:flex-row
          gap-12 lg:gap-20
          relative
          overflow-hidden
          /* Optimización de renderizado para contenedores complejos */
          transform-gpu translate-z-0
        "
      >
        {/* Fondo Decorativo - Optimizado para GPU */}
        <div 
            className="
                absolute top-0 right-0 
                w-[500px] h-[500px] 
                bg-[#C02485]/5 
                rounded-full 
                blur-[120px] 
                pointer-events-none 
                translate-x-1/3 -translate-y-1/3
                /* Forzar aceleración de hardware para evitar lag en scroll */
                transform-gpu will-change-transform
            " 
        />

        {/* IZQUIERDA — LOGO Y TEXTO */}
        <div className="flex-1 flex flex-col sm:flex-row gap-6 md:gap-8 items-start relative z-10">
          <div
            className="
              w-16 h-16 sm:w-20 sm:h-20
              rounded-2xl
              bg-[#C02485]
              flex items-center justify-center
              shadow-[0_12px_30px_rgba(192,36,133,0.35)]
              flex-shrink-0
            "
            aria-hidden="true"
          >
            <img
              src="/white.svg"
              alt="Logo 10K"
              className="w-8 h-8 sm:w-10 sm:h-10 object-contain"
              loading="lazy"
              decoding="async"
              onError={(e) => {
                // Fallback ligero SVG inline si falla la imagen
                e.currentTarget.style.display = 'none';
                if (e.currentTarget.parentElement) {
                    e.currentTarget.parentElement.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" class="w-8 h-8"><path d="M11.25 4.533A9.707 9.707 0 006 3a9.735 9.735 0 00-3.25.555.75.75 0 00-.5.707v14.25a.75.75 0 001 .707A8.237 8.237 0 016 18.75c1.995 0 3.823.707 5.25 1.886V4.533zM12.75 20.636A8.214 8.214 0 0118 18.75c.966 0 1.89.166 2.75.47V4.982c-.371-.16-.763-.298-1.168-.414a9.721 9.721 0 00-4.082 0 8.234 8.234 0 00-2.75 1.868v14.2z" /></svg>';
                }
              }}
            />
          </div>

          <div className="flex flex-col justify-center">
            <h3 className="text-[28px] sm:text-[36px] leading-none font-bebas tracking-wide mb-2">
              Ruta de los Tres Juanes 2026
            </h3>

            <p className="text-sm text-white/60 font-medium uppercase tracking-wider mb-6">
                Ambato – Ecuador
            </p>

            <p className="text-xs sm:text-sm text-gray-400 leading-relaxed max-w-md">
              © 2026. Evento oficial organizado por la <span className="text-white">Asociación de Periodistas Deportivos de Tungurahua</span>.
              <br className="mb-2"/>
              Desarrollo web por <span className="text-[#C02485]">Prez Agencia</span>.
            </p>
          </div>
        </div>

        {/* DERECHA — ENLACES */}
        <nav
          className="flex-[1.2] grid grid-cols-1 sm:grid-cols-3 gap-10 sm:gap-6 text-sm relative z-10"
          aria-label="Enlaces del sitio"
        >
          {/* Enlaces Rápidos */}
          <div>
            <h4 className="text-lg md:text-xl mb-6 font-bebas tracking-wide text-white">
              Enlaces Rápidos
            </h4>
            <ul className="space-y-3 text-gray-400">
              <li><a href="#inscripcion" className="hover:text-[#C02485] transition-colors duration-200">Inscripción</a></li>
              <li><a href="#reglamento" className="hover:text-[#C02485] transition-colors duration-200">Reglamento</a></li>
              <li><a href="#faq" className="hover:text-[#C02485] transition-colors duration-200">Preguntas frecuentes</a></li>
            </ul>
          </div>

          {/* Patrocinadores */}
          <div>
            <h4 className="text-lg md:text-xl mb-6 font-bebas tracking-wide text-white">
              Patrocinadores
            </h4>
            <ul className="space-y-3 text-gray-400">
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#C02485]"></span> Vehicentro
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#C02485]"></span> Sinotruk Ecuador
              </li>
            </ul>
          </div>

          {/* Conéctate */}
          <div>
            <h4 className="text-lg md:text-xl mb-6 font-bebas tracking-wide text-white">
              Conéctate
            </h4>
            <ul className="space-y-3">
              <li>
                <a
                  href="https://wa.me/593995040437"
                  className="flex items-center gap-2 text-gray-400 hover:text-[#25D366] transition-colors duration-200"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Abrir WhatsApp"
                >
                  <MessageCircle size={18} /> WhatsApp
                </a>
              </li>
              <li>
                <a
                  href="https://instagram.com"
                  className="flex items-center gap-2 text-gray-400 hover:text-[#E1306C] transition-colors duration-200"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Abrir Instagram"
                >
                  <Instagram size={18} /> Instagram
                </a>
              </li>
              <li>
                <a
                  href="https://facebook.com"
                  className="flex items-center gap-2 text-gray-400 hover:text-[#1877F2] transition-colors duration-200"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Abrir Facebook"
                >
                  <Facebook size={18} /> Facebook
                </a>
              </li>
            </ul>
          </div>
        </nav>
      </div>
    </footer>
  );
}