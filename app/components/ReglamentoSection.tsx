import { Bebas_Neue } from "next/font/google";

const bebas = Bebas_Neue({
  subsets: ["latin"],
  weight: "400",
});

export default function ReglamentoSection() {
  return (
    <section
      id="reglamento"
      className="w-full px-4 pt-4 pb-6 md:pb-8 flex justify-center"
    >
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
        {/* LABEL */}
        <p className="text-xs sm:text-sm uppercase tracking-[0.32em] text-white/55 mb-4 font-semibold">
          Reglamento oficial
        </p>

        {/* TÍTULO */}
        <h2
          className={`
            text-[36px] sm:text-[46px] lg:text-[56px]
            leading-[1.03]
            mb-8
            ${bebas.className}
          `}
        >
          Reglamento General – 10K Ruta de los Tres Juanes 2026
        </h2>

        {/* DESCRIPCIÓN */}
        <p className="text-base sm:text-lg text-white/80 mb-6 max-w-4xl leading-relaxed">
          Aquí va el contenido completo del reglamento: denominación del evento,
          fecha, horarios, requisitos de participación, categorías oficiales,
          seguridad, logística, recorrido, responsabilidades y todos los
          artículos necesarios para la carrera.
        </p>

        {/* CTA */}
        <div className="flex flex-wrap items-center gap-3">
          <a
            href="/reglamento"
            className="
              inline-flex items-center justify-center
              px-10 py-4
              rounded-full
              bg-gradient-to-r from-[#C02485] to-[#E5006D]
              text-white text-[13px] tracking-[0.22em]
              font-semibold uppercase
              hover:opacity-90
              transition
              shadow-lg shadow-[#C02485]/35
            "
          >
            Ver reglamento completo
          </a>
        </div>
      </div>
    </section>
  );
}
