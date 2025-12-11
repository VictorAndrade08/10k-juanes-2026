"use client";

import { Bebas_Neue } from "next/font/google";

const bebas = Bebas_Neue({
  subsets: ["latin"],
  weight: "400",
});

export default function ExperienceSection() {
  return (
    <section className="w-full px-4 py-20 flex justify-center">
      <div
        className="
          w-full max-w-7xl
          rounded-[48px]
          bg-gradient-to-br from-[#070D18] via-[#070D18] to-[#02040A]
          text-white
          px-8 md:px-16
          py-14 md:py-18
          shadow-[0_20px_60px_rgba(0,0,0,0.35)]
          border border-white/10
        "
      >
        {/* TÍTULO */}
        <h2
          className={`
            mb-14
            text-[38px] sm:text-[48px] lg:text-[58px]
            leading-[1.03]
            tracking-[0.04em]
            ${bebas.className}
          `}
        >
          Explora la experiencia 10K Ruta de los Tres Juanes
        </h2>

        {/* GRID DE TARJETAS */}
        <div className="grid gap-8 md:gap-10 md:grid-cols-2 lg:grid-cols-4">

          {/* TARJETA 1 */}
          <article
            className="
              rounded-[32px]
              overflow-hidden
              bg-white/5
              border border-white/10
              flex flex-col
              min-h-[360px]
              hover:bg-white/10
              hover:shadow-[0_12px_35px_rgba(255,255,255,0.08)]
              backdrop-blur-sm
              transition duration-200
            "
          >
            <div className="flex-1 bg-white/10 text-white/60 flex items-center justify-center text-sm">
              Imagen: mapa del recorrido
            </div>

            <div className="p-8 flex flex-col justify-between">
              <div>
                <h3
                  className={`
                    text-[24px] sm:text-[28px]
                    mb-2
                    tracking-[0.02em]
                    ${bebas.className}
                  `}
                >
                  La Ruta de la Carrera
                </h3>

                <p className="text-sm sm:text-base text-white/75 leading-relaxed">
                  Conoce cada tramo del recorrido nocturno por Ambato.
                </p>
              </div>

              <a
                href="#ruta"
                className="
                  mt-5 text-[11px] font-semibold uppercase tracking-[0.30em]
                  text-white/80 hover:text-white transition
                "
              >
                Ver ruta
              </a>
            </div>
          </article>

          {/* TARJETA 2 */}
          <article
            className="
              rounded-[32px]
              overflow-hidden
              bg-white/5
              border border-white/10
              flex flex-col
              min-h-[360px]
              hover:bg-white/10
              hover:shadow-[0_12px_35px_rgba(255,255,255,0.08)]
              backdrop-blur-sm
              transition duration-200
            "
          >
            <div className="flex-1 bg-white/10 text-white/60 flex items-center justify-center text-sm">
              Imagen: salida corredores
            </div>

            <div className="p-8 flex flex-col justify-between">
              <div>
                <h3
                  className={`
                    text-[24px] sm:text-[28px]
                    mb-2
                    tracking-[0.02em]
                    ${bebas.className}
                  `}
                >
                  Categorías disponibles
                </h3>

                <p className="text-sm sm:text-base text-white/75 leading-relaxed">
                  ELITE PRO, Juvenil, Senior, Master,
                  Supermaster, Vilcabambas, Colegial y más.
                </p>
              </div>

              <a
                href="#categorias"
                className="
                  mt-5 text-[11px] font-semibold uppercase tracking-[0.30em]
                  text-white/80 hover:text-white transition
                "
              >
                Ver categorías
              </a>
            </div>
          </article>

          {/* TARJETA 3 */}
          <article
            className="
              rounded-[32px]
              overflow-hidden
              bg-white/5
              border border-white/10
              flex flex-col
              min-h-[360px]
              hover:bg-white/10
              hover:shadow-[0_12px_35px_rgba(255,255,255,0.08)]
              backdrop-blur-sm
              transition duration-200
            "
          >
            <div className="flex-1 bg-white/10 text-white/60 flex items-center justify-center text-sm">
              Imagen: kit del corredor
            </div>

            <div className="p-8 flex flex-col justify-between">
              <div>
                <h3
                  className={`
                    text-[24px] sm:text-[28px]
                    mb-2
                    tracking-[0.02em]
                    ${bebas.className}
                  `}
                >
                  El mejor kit deportivo
                </h3>

                <p className="text-sm sm:text-base text-white/75 leading-relaxed">
                  Camiseta oficial, medalla, chip, buff, medias,
                  Sporty bag, hidratación y más.
                </p>
              </div>

              <a
                href="#kit"
                className="
                  mt-5 text-[11px] font-semibold uppercase tracking-[0.30em]
                  text-white/80 hover:text-white transition
                "
              >
                Ver kit completo
              </a>
            </div>
          </article>

          {/* TARJETA 4 */}
          <article
            className="
              rounded-[32px]
              overflow-hidden
              bg-white/5
              border border-white/10
              flex flex-col
              min-h-[360px]
              hover:bg-white/10
              hover:shadow-[0_12px_35px_rgba(255,255,255,0.08)]
              backdrop-blur-sm
              transition duration-200
            "
          >
            <div className="flex-1 bg-white/10 text-white/60 flex items-center justify-center text-sm">
              Imagen: fiesta & ciudad
            </div>

            <div className="p-8 flex flex-col justify-between">
              <div>
                <h3
                  className={`
                    text-[24px] sm:text-[28px]
                    mb-2
                    tracking-[0.02em]
                    ${bebas.className}
                  `}
                >
                  Fiesta, ciudad & ambiente
                </h3>

                <p className="text-sm sm:text-base text-white/75 leading-relaxed">
                  La carrera se integra a la Fiesta de la Fruta
                  y de las Flores: luces, música y tradición.
                </p>
              </div>

              <a
                href="#evento"
                className="
                  mt-5 text-[11px] font-semibold uppercase tracking-[0.30em]
                  text-white/80 hover:text-white transition
                "
              >
                Ver más del evento
              </a>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}
