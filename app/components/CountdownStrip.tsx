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

  return (
    <section className="w-full px-4 pt-4 pb-6 md:pb-8 flex justify-center">
      <div
        className="
          w-full max-w-7xl
          rounded-[48px]
          bg-gradient-to-b from-[#070D18] via-[#070D18] to-[#02040A]
          text-white
          px-6 sm:px-8 md:px-16
          py-12 md:py-16
          shadow-[0_18px_50px_rgba(0,0,0,0.35)]
          border border-white/10
        "
      >
        {/* Encabezado */}
        <p className="text-xs sm:text-sm tracking-[0.32em] uppercase text-white/55 font-semibold">
          Presentado por APDT Ambato
        </p>

        {/* TÍTULO */}
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

        {/* Subtítulo */}
        <p className="mt-4 text-base sm:text-lg text-white/80 max-w-2xl">
          Viernes 6 de febrero de 2026 · 19h00 · Ambato, Ecuador
          <br />
          Revisa el tiempo restante y organiza tu entrenamiento.
        </p>

        {/* CONTADOR */}
        <div
          className="
            mt-10 grid gap-5 md:gap-8
            grid-cols-2 md:grid-cols-4
          "
        >
          {[
            { label: "Días", value: pad(timeLeft.days) },
            { label: "Horas", value: pad(timeLeft.hours) },
            { label: "Minutos", value: pad(timeLeft.minutes) },
            { label: "Segundos", value: pad(timeLeft.seconds) },
          ].map((item, i) => (
            <div
              key={i}
              className="
                rounded-[32px]
                bg-white/5
                border border-white/10
                flex flex-col items-center justify-center
                py-8 md:py-10
                backdrop-blur-sm
              "
            >
              <span
                className={`
                  text-[48px] sm:text-[56px] md:text-[64px]
                  font-extrabold
                  leading-none
                  ${bebas.className}
                `}
              >
                {item.value}
              </span>

              <span className="mt-3 text-xs sm:text-sm tracking-[0.30em] uppercase text-white/70">
                {item.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
