"use client";

import { Bebas_Neue } from "next/font/google";

const bebas = Bebas_Neue({
  subsets: ["latin"],
  weight: "400",
});

export default function RegistrationOptions() {
  return (
    <section className="w-full px-4 pt-4 pb-6 md:pb-8 flex justify-center">
      <div className="w-full max-w-7xl grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* ================================
            INSCRIPCIÓN EN LÍNEA (BLANCO)
        ================================= */}
        <article
          className="
            rounded-[48px]
            bg-white
            text-black
            px-8 sm:px-10 md:px-14
            py-12 sm:py-14
            shadow-[0_18px_50px_rgba(0,0,0,0.12)]
            border border-black/10
            flex flex-col justify-between
          "
        >
          <div>
            <p className="text-xs tracking-[0.32em] uppercase text-black/50 font-semibold">
              Inscripción en línea
            </p>

            <h2
              className={`
                mt-3
                text-[32px] sm:text-[38px] md:text-[44px]
                leading-[1.05]
                tracking-[0.04em]
                ${bebas.className}
              `}
            >
              ¡Inscríbete online
              <br />
              en menos de 3 minutos!
            </h2>

            <p className="mt-4 text-[16px] sm:text-lg text-black/75 leading-relaxed">
              Rápido y sin complicaciones: completas tus datos, subes tu comprobante
              y te confirmamos el cupo por WhatsApp.
            </p>

            <ol className="mt-6 space-y-3 text-[16px] sm:text-lg text-black/75 leading-relaxed">
              <li>1. Elige tu categoría.</li>
              <li>2. Completa el formulario con tus datos.</li>
              <li>3. Sube el comprobante de pago.</li>
              <li>4. Recibe tu confirmación por WhatsApp.</li>
            </ol>
          </div>

          <div className="mt-10">
            {/* ✅ CTA NO CAMBIA */}
            <a
              href="/inscripcion"
              className="
                inline-flex items-center justify-center
                px-10 md:px-12
                h-14 md:h-16
                rounded-full
                bg-gradient-to-r from-[#C02485] to-[#E5006D]
                text-white text-[13px] md:text-[14px]
                tracking-[0.24em]
                uppercase font-bold
                shadow-[0_12px_35px_rgba(192,36,133,0.35)]
                hover:opacity-90
                transition
              "
            >
              Ir al formulario online
            </a>

            <p className="mt-5 text-sm md:text-base text-black/65">
              Precio general: <span className="font-semibold">$30</span> ·
              Capacidades especiales &amp; tercera edad:{" "}
              <span className="font-semibold">$20</span>.
            </p>
          </div>
        </article>

        {/* ================================
            INSCRIPCIÓN POR WHATSAPP (NEGRO TRANSPARENTE + TEXTO BLANCO)
        ================================= */}
        <article
          className="
            rounded-[48px]
            bg-black/55
            text-white
            backdrop-blur-md
            px-8 sm:px-10 md:px-14
            py-12 sm:py-14
            shadow-[0_18px_50px_rgba(0,0,0,0.45)]
            border border-white/10
            flex flex-col justify-between
          "
        >
          <div>
            <p className="text-xs tracking-[0.32em] uppercase text-white/60 font-semibold">
              Inscripción por WhatsApp
            </p>

            <h2
              className={`
                mt-3
                text-[32px] sm:text-[38px] md:text-[44px]
                leading-[1.05]
                tracking-[0.04em]
                text-white
                ${bebas.className}
              `}
            >
              ¿Prefieres hablar con alguien?
              <br />
              Hazlo por WhatsApp
            </h2>

            <p className="mt-4 text-[16px] sm:text-lg text-white/75 leading-relaxed">
              Un asesor te guía paso a paso. Es rápido, cómodo y 100% asistido.
            </p>

            <ol className="mt-6 space-y-3 text-[16px] sm:text-lg text-white/75 leading-relaxed">
              <li>1. Envía tu nombre, cédula y categoría.</li>
              <li>2. Recibe los datos de pago.</li>
              <li>3. Envía tu comprobante.</li>
              <li>4. Te confirmamos tu cupo.</li>
            </ol>
          </div>

          <div className="mt-10">
            {/* ✅ CTA NO CAMBIA */}
            <a
              href="https://wa.me/593995102378"
              target="_blank"
              rel="noopener noreferrer"
              className="
                inline-flex items-center justify-center
                px-10 md:px-12
                h-14 md:h-16
                rounded-full
                border border-[#C02485]
                text-[#C02485]
                text-[13px] md:text-[14px]
                tracking-[0.24em]
                uppercase font-bold
                bg-white
                hover:bg-[#C02485]
                hover:text-white
                transition
              "
            >
              Abrir WhatsApp
            </a>

            <p className="mt-5 text-sm md:text-base text-white/70">
              WhatsApp oficial:{" "}
              <span className="font-semibold text-white">
                +593 99 510 2378
              </span>
              .
            </p>
          </div>
        </article>
      </div>
    </section>
  );
}
