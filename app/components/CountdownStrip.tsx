"use client";

import { useEffect, useState } from "react";
import { Bebas_Neue } from "next/font/google";

const bebas = Bebas_Neue({
  subsets: ["latin"],
  weight: "400",
});

type TimeLeft = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
};

function getTimeLeft(): TimeLeft {
  const eventDate = new Date("2026-02-06T19:00:00-05:00").getTime();
  const now = Date.now();
  const diff = eventDate - now;

  if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };

  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  };
}

const pad = (num: number) => num.toString().padStart(2, "0");

export default function CountdownStrip() {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>(getTimeLeft);

  useEffect(() => {
    const timer = setInterval(() => setTimeLeft(getTimeLeft()), 1000);
    return () => clearInterval(timer);
  }, []);

  const blocks = [
    { label: "Días", value: pad(timeLeft.days) },
    { label: "Horas", value: pad(timeLeft.hours) },
    { label: "Minutos", value: pad(timeLeft.minutes) },
    { label: "Segundos", value: pad(timeLeft.seconds) },
  ];

  return (
    <section className="w-full px-4 pt-4 pb-6 md:pb-8 flex justify-center">
      <div
        className="
          relative w-full max-w-7xl
          rounded-[48px] overflow-hidden
          bg-gradient-to-br from-white via-[#F3F3F3] to-[#E7E7E7]
          text-black
          px-6 sm:px-8 md:px-16
          py-12 md:py-16
          shadow-[0_20px_60px_rgba(0,0,0,0.12)]
          border border-black/10
        "
      >
        {/* brillo suave arriba */}
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(1200px_500px_at_20%_0%,rgba(0,0,0,0.05),transparent_55%)]" />

        <div className="relative z-10">
          {/* HEADER: texto izquierda + imagen derecha (zona marcada) */}
          <div className="grid grid-cols-1 md:grid-cols-[1.35fr_0.65fr] gap-10 md:gap-12 items-start">
            <div>
              <p className="text-xs sm:text-sm tracking-[0.32em] uppercase text-black/45 font-semibold">
                Presentado por APDT Ambato
              </p>

              <h2
                className={`
                  mt-3
                  text-[40px] sm:text-[48px] lg:text-[58px]
                  leading-[1.05]
                  tracking-[0.04em]
                  ${bebas.className}
                `}
              >
                Cuenta regresiva para la
                <br />
                10K Ruta de los Tres Juanes 2026
              </h2>

              <p className="mt-4 text-base sm:text-lg text-black/70 max-w-2xl">
                Viernes 6 de febrero de 2026 · 19h00 · Ambato, Ecuador
                <br />
                Revisa el tiempo restante y organiza tu entrenamiento.
              </p>
            </div>

            {/* IMAGEN ARRIBA DERECHA (centrada y completa, sin cortarse) */}
            <div className="relative md:pt-1">
              <div
                className="
                  relative
                  w-full
                  max-w-[440px]
                  md:ml-auto
                  mx-auto
                  rounded-[28px]
                  bg-white/55
                  border border-black/10
                  shadow-[0_14px_40px_rgba(0,0,0,0.10)]
                  px-4 sm:px-6
                  py-4 sm:py-5
                "
              >
                <img
                  src="/imagen1.webp"
                  alt="Identidad 10K Ruta de los Tres Juanes"
                  className="
                    w-full
                    h-auto
                    object-contain
                    select-none
                    pointer-events-none
                  "
                  draggable={false}
                />
              </div>
            </div>
          </div>

          {/* CONTADOR */}
          <div className="mt-10 grid gap-5 md:gap-8 grid-cols-2 md:grid-cols-4">
            {blocks.map((item, i) => (
              <div
                key={i}
                className="
                  rounded-[32px]
                  bg-white/92
                  border border-black/10
                  flex flex-col items-center justify-center
                  py-8 md:py-10
                  shadow-[0_10px_30px_rgba(0,0,0,0.08)]
                "
              >
                <span
                  className={`
                    text-[48px] sm:text-[56px] md:text-[64px]
                    leading-none
                    text-black
                    ${bebas.className}
                  `}
                >
                  {item.value}
                </span>

                <span className="mt-3 text-xs sm:text-sm tracking-[0.30em] uppercase text-black/55">
                  {item.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
