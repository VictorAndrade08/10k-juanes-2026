"use client";

import { Bebas_Neue } from "next/font/google";

const bebas = Bebas_Neue({
  subsets: ["latin"],
  weight: "400",
});

export default function Footer() {
  return (
    <footer className="w-full px-4 pb-16 pt-10 flex justify-center">
      <div
        className="
          w-full 
          max-w-7xl
          rounded-[48px]
          bg-gradient-to-br from-[#050B16] via-[#070D18] to-[#02040A]
          text-white
          px-8 md:px-16
          py-14 md:py-18
          shadow-[0_28px_70px_rgba(0,0,0,0.45)]
          border border-white/10
          flex flex-col md:flex-row
          gap-14
        "
      >
        {/* IZQUIERDA — LOGO Y TEXTO */}
        <div className="flex-1 flex gap-6 md:gap-8">
          <div
            className="
              w-20 h-20
              rounded-3xl
              bg-[#C02485]
              flex items-center justify-center
              shadow-[0_12px_30px_rgba(192,36,133,0.35)]
            "
          >
            <img
              src="/white.svg"
              alt="10K Ruta de los Tres Juanes"
              className="w-10 h-10 object-contain"
              loading="eager"
            />
          </div>

          <div className="flex flex-col justify-center">
            <h3
              className={`
                text-[28px] sm:text-[32px] md:text-[36px]
                leading-none
                ${bebas.className}
              `}
            >
              Ruta de los Tres Juanes 2026
            </h3>

            <p className="text-sm text-white/70 mt-1">Ambato – Ecuador</p>

            <p className="mt-5 text-xs sm:text-sm text-white/55 leading-relaxed max-w-md">
              © 2026. Evento oficial organizado por la Asociación de Periodistas
              Deportivos de Tungurahua. Desarrollo web por Prez Agencia.
            </p>
          </div>
        </div>

        {/* DERECHA — ENLACES */}
        <div className="flex-[1.2] grid grid-cols-1 sm:grid-cols-3 gap-8 text-sm">
          {/* Enlaces */}
          <div>
            <h4
              className={`
                text-lg md:text-xl mb-4 font-semibold tracking-wide
                ${bebas.className}
              `}
            >
              Enlaces
            </h4>

            <ul className="space-y-2 text-white/75">
              <li>
                <a href="#inscripcion" className="hover:text-white transition">
                  Inscripción
                </a>
              </li>
              <li>
                <a href="#reglamento" className="hover:text-white transition">
                  Reglamento
                </a>
              </li>
              <li>
                <a href="#faq" className="hover:text-white transition">
                  Preguntas frecuentes
                </a>
              </li>
            </ul>
          </div>

          {/* Patrocinadores */}
          <div>
            <h4
              className={`
                text-lg md:text-xl mb-4 font-semibold tracking-wide
                ${bebas.className}
              `}
            >
              Patrocinadores
            </h4>

            <ul className="space-y-2 text-white/75">
              <li>Vehicentro</li>
              <li>Sinotruk Ecuador</li>
            </ul>
          </div>

          {/* Conéctate */}
          <div>
            <h4
              className={`
                text-lg md:text-xl mb-4 font-semibold tracking-wide
                ${bebas.className}
              `}
            >
              Conéctate
            </h4>

            <ul className="space-y-2 text-white/75">
              <li>
                <a
                  href="https://wa.me/593995040437"
                  className="hover:text-white transition"
                  target="_blank"
                >
                  WhatsApp
                </a>
              </li>
              <li>
                <a
                  href="https://instagram.com"
                  className="hover:text-white transition"
                  target="_blank"
                >
                  Instagram
                </a>
              </li>
              <li>
                <a
                  href="https://facebook.com"
                  className="hover:text-white transition"
                  target="_blank"
                >
                  Facebook
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}
