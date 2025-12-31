"use client";

import { useEffect, useState } from "react";
import Link from "next/link"; // 1. Navegación rápida
import { usePathname } from "next/navigation"; // 2. Detección reactiva de ruta
import { Barlow_Condensed } from "next/font/google"; // 3. Fuente optimizada
import { MousePointerClick } from "lucide-react";

// Configuración de la fuente Barlow Condensed
const barlow = Barlow_Condensed({
  subsets: ["latin"],
  weight: "700",
  display: "swap",
  variable: "--font-barlow",
});

export default function FloatingCTA() {
  const pathname = usePathname(); // Hook para saber en qué página estamos
  const [mounted, setMounted] = useState(false);
  const [isOverFooter, setIsOverFooter] = useState(false);

  // Lógica de montaje (Entrada suave)
  useEffect(() => {
    setMounted(true);
  }, []);

  // Lógica del Intersection Observer (Detector de Footer)
  useEffect(() => {
    // Si no estamos en el navegador, no hacemos nada
    if (typeof window === "undefined") return;

    const handleIntersect = (entries: IntersectionObserverEntry[]) => {
      const entry = entries[0];
      setIsOverFooter(entry.isIntersecting);
    };

    const observer = new IntersectionObserver(handleIntersect, {
      root: null,
      threshold: 0,
      rootMargin: "0px 0px 100px 0px", // Margen de seguridad para ocultarlo antes de tocar el footer
    });

    const footer = document.getElementById("site-footer"); // Asegúrate de que tu Footer tenga este ID
    if (footer) {
      observer.observe(footer);
    }

    return () => {
      if (footer) observer.unobserve(footer);
    };
  }, [pathname]); // Se re-ejecuta si cambiamos de página

  // Si estamos en la página de inscripción, NO renderizamos nada
  if (pathname?.startsWith("/inscripcion")) return null;

  // Visibilidad final
  const isVisible = mounted && !isOverFooter;

  return (
    // Inyectamos la variable de fuente
    <div className={barlow.variable}>
      <Link
        href="/inscripcion"
        aria-label="Ir a formulario de inscripción"
        className={`
          font-[family-name:var(--font-barlow)]
          fixed z-[9999]
          left-1/2 -translate-x-1/2
          bottom-[calc(env(safe-area-inset-bottom)+24px)]
          md:left-auto md:right-8 md:translate-x-0 md:bottom-8

          flex items-center gap-2
          rounded-full
          px-10 py-4 md:px-12 md:py-5
          text-[20px] md:text-[22px]
          uppercase tracking-[0.1em]
          font-bold text-white leading-none

          /* Gradiente Magenta */
          bg-gradient-to-r from-[#C02485] to-[#E5006D]
          border border-white/20
          backdrop-blur-md

          /* Sombras y Efectos */
          shadow-[0_10px_40px_rgba(192,36,133,0.5)]
          hover:shadow-[0_15px_60px_rgba(192,36,133,0.7)]
          hover:scale-105 hover:-translate-y-1
          active:scale-95

          transition-all duration-500 ease-out cubic-bezier(0.34, 1.56, 0.64, 1)
          
          /* Estado de visibilidad */
          ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-20 pointer-events-none"}
        `}
      >
        <span>Inscribirme</span>
        <MousePointerClick size={24} className="animate-pulse" />
      </Link>
    </div>
  );
}