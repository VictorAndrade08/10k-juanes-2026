"use client";

import { useEffect, useState } from "react";
import Image from "next/image"; // Optimización de imágenes
import { Bebas_Neue } from "next/font/google"; // Optimización de fuentes

// Configuración de fuente
const bebas = Bebas_Neue({
  subsets: ["latin"],
  weight: "400",
  display: "swap",
  variable: "--font-bebas",
});

type TimeLeft = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
};

// Estado inicial en ceros para evitar diferencias entre Servidor y Cliente (Hydration Mismatch)
const INITIAL_TIME: TimeLeft = { days: 0, hours: 0, minutes: 0, seconds: 0 };

function calculateTimeLeft(): TimeLeft {
  const eventDate = new Date("2026-02-06T19:00:00-05:00").getTime();
  const now = Date.now();
  const diff = eventDate - now;

  if (diff <= 0) {
    return INITIAL_TIME;
  }

  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  };
}

const pad = (num: number) => num.toString().padStart(2, "0");

export default function CountdownStrip() {
  // Inicializamos con 0 para que el HTML del servidor coincida con el inicial del cliente
  const [timeLeft, setTimeLeft] = useState<TimeLeft>(INITIAL_TIME);

  useEffect(() => {
    // Calcular inmediatamente al montar
    setTimeLeft(calculateTimeLeft());

    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const blocks = [
    { label: "Días", value: pad(timeLeft.days) },
    { label: "Horas", value: pad(timeLeft.hours) },
    { label: "Minutos", value: pad(timeLeft.minutes) },
    { label: "Segundos", value: pad(timeLeft.seconds) },
  ];

  return (
    // Inyectamos la variable de fuente aquí
    <section className={`w-full px-3 py-4 flex justify-center bg-gray-50 font-sans ${bebas.variable}`}>
      <div className="
        relative w-full max-w-7xl 
        rounded-[24px] sm:rounded-[32px] 
        overflow-hidden 
        bg-gradient-to-br from-white via-[#F3F3F3] to-[#E7E7E7]
        border border-gray-200 
        shadow-[0_15px_50px_-10px_rgba(0,0,0,0.1)]
        px-6 sm:px-8 md:px-12 
        py-8 md:py-12
      ">
        {/* Fondo decorativo sutil */}
        <div className="pointer-events-none absolute top-0 right-0 w-[600px] h-[600px] bg-[radial-gradient(circle_at_center,rgba(192,36,133,0.08),transparent_70%)] rounded-full blur-3xl opacity-60 -translate-y-1/2 translate-x-1/4" />

        <div className="relative z-10">
          
          {/* HEADER CON GRID */}
          <div className="grid grid-cols-1 lg:grid-cols-[1.4fr_0.8fr] gap-8 lg:gap-12 items-center mb-10">
            
            {/* Columna Texto */}
            <div>
              <div className="flex items-center gap-3 mb-3">
                 <span className="h-px w-8 bg-[#C02485]"></span>
                 <p className="text-xs sm:text-sm tracking-[0.2em] uppercase text-gray-500 font-bold">
                    Presentado por APDT Ambato
                 </p>
              </div>

              <h2 className="text-[36px] sm:text-[48px] lg:text-[60px] leading-[1] text-gray-900 font-[family-name:var(--font-bebas)] mb-4 tracking-tight">
                Cuenta regresiva para la <br className="hidden sm:block"/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#C02485] to-[#E5006D]">
                  10K Ruta de los Tres Juanes 2026
                </span>
              </h2>

              <p className="text-sm sm:text-lg text-gray-600 leading-relaxed max-w-xl">
                <strong className="text-gray-900">Viernes 6 de febrero de 2026 · 19h00</strong> <br/>
                Ambato, Ecuador. Revisa el tiempo restante y organiza tu entrenamiento.
              </p>
            </div>

            {/* Columna Imagen OPTIMIZADA */}
            <div className="relative flex justify-center lg:justify-end">
              <div className="
                relative w-full max-w-[400px] 
                rounded-[24px] 
                bg-white/60 backdrop-blur-sm 
                border border-white/50 
                shadow-[0_10px_30px_rgba(0,0,0,0.06)] 
                p-4
                transform transition-transform hover:scale-[1.02] duration-500
              ">
                {/* CRÍTICO: Definimos width/height explícitos basados en el aspecto original (aprox 3.5:1).
                   Next.js redimensionará la imagen de 11,000px a 400px, ahorrando MBs de datos.
                */}
                <Image
                  src="/imagen1.webp"
                  alt="Identidad 10K Ruta de los Tres Juanes"
                  width={400} 
                  height={115}
                  className="w-full h-auto object-contain select-none pointer-events-none drop-shadow-sm"
                  loading="lazy"
                />
              </div>
            </div>
          </div>

          {/* CONTADOR */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {blocks.map((item) => (
              <div
                key={item.label}
                className="
                    flex flex-col items-center justify-center 
                    bg-white/80 border border-white 
                    rounded-[24px] 
                    py-6 md:py-8
                    shadow-[0_8px_20px_-5px_rgba(0,0,0,0.05)]
                    hover:shadow-[0_15px_30px_-5px_rgba(192,36,133,0.1)]
                    hover:-translate-y-1
                    transition-all duration-300
                    group
                "
              >
                {/* suppressHydrationWarning evita errores si hay milisegundos de diferencia entre server/client */}
                <span 
                    className="text-[48px] sm:text-[64px] leading-[0.9] text-[#C02485] font-[family-name:var(--font-bebas)] group-hover:scale-110 transition-transform duration-300"
                    suppressHydrationWarning
                >
                  {item.value}
                </span>
                <span className="mt-2 text-[10px] sm:text-xs tracking-[0.2em] uppercase text-gray-500 font-bold">
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