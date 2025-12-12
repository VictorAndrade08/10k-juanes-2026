"use client";

import { Bebas_Neue } from "next/font/google";
import { toast } from "sonner";
import { Map, Users, Package, PartyPopper } from "lucide-react";

const bebas = Bebas_Neue({
  subsets: ["latin"],
  weight: "400",
});

export default function ExperienceSection() {
  const handleCTA = () => {
    toast.info("Próximamente — Estate atento 👀");
  };

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

        {/* GRID */}
        <div className="grid gap-8 md:gap-10 md:grid-cols-2 lg:grid-cols-4">

          {/* === COMPONENTE TARJETA REUTILIZABLE === */}
          {[
            {
              icon: <Map className="w-14 h-14 text-white/70" />,
              title: "La Ruta de la Carrera",
              text: "Conoce cada tramo del recorrido nocturno por Ambato.",
              cta: "Ver ruta",
            },
            {
              icon: <Users className="w-14 h-14 text-white/70" />,
              title: "Categorías disponibles",
              text:
                "ELITE PRO, Juvenil, Senior, Master, Supermaster, Vilcabambas, Colegial y más.",
              cta: "Ver categorías",
            },
            {
              icon: <Package className="w-14 h-14 text-white/70" />,
              title: "El mejor kit deportivo",
              text:
                "Camiseta oficial, medalla, chip, medias, Sporty bag, hidratación y más.",
              cta: "Ver kit completo",
            },
            {
              icon: <PartyPopper className="w-14 h-14 text-white/70" />,
              title: "Fiesta, ciudad & ambiente",
              text:
                "La carrera se integra a la Fiesta de la Fruta y de las Flores: luces, música y tradición.",
              cta: "Ver más del evento",
            },
          ].map((card, i) => (
            <article
              key={i}
              className="
                rounded-[32px]
                overflow-hidden
                bg-white/5
                border border-white/10
                flex flex-col
                min-h-[430px]             /* 🔥 altura uniforme */
                hover:bg-white/10
                hover:shadow-[0_12px_35px_rgba(255,255,255,0.08)]
                backdrop-blur-sm
                transition duration-200
              "
            >
              {/* ICONO */}
              <div className="flex items-center justify-center h-[140px] bg-white/10">
                {card.icon}
              </div>

              {/* CONTENIDO */}
              <div className="p-8 flex flex-col flex-1 justify-between">
                <div>
                  <h3
                    className={`${bebas.className} text-[24px] sm:text-[28px] mb-2 tracking-[0.02em]`}
                  >
                    {card.title}
                  </h3>

                  <p className="text-sm sm:text-base text-white/75 leading-relaxed">
                    {card.text}
                  </p>
                </div>

                <button
                  onClick={handleCTA}
                  className="
                    mt-6 text-[11px]
                    font-semibold uppercase
                    tracking-[0.30em]
                    text-white/80 hover:text-white
                    transition
                  "
                >
                  {card.cta}
                </button>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
