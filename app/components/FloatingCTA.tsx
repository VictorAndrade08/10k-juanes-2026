"use client";

import { useEffect, useState } from "react";
import { MousePointerClick } from "lucide-react";

export default function FloatingCTA() {
  const [visible, setVisible] = useState(false);
  const [isHiddenRoute, setIsHiddenRoute] = useState(false);

  useEffect(() => {
    // Verificación de ruta segura para el cliente
    // (En Next.js real usarías usePathname, aquí usamos window.location para compatibilidad)
    if (typeof window !== "undefined") {
      const isRegistration = window.location.pathname.startsWith("/inscripcion");
      setIsHiddenRoute(isRegistration);

      if (!isRegistration) {
        // Retraso para que la animación de entrada sea suave después de cargar la página
        const timer = window.setTimeout(() => setVisible(true), 1000);
        return () => window.clearTimeout(timer);
      }
    }
  }, []);

  if (isHiddenRoute) return null;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@700&display=swap');
        .font-barlow { font-family: 'Barlow Condensed', sans-serif; }
      `}</style>

      <a
        href="/inscripcion"
        aria-label="Ir a inscripción"
        className={`
          font-barlow
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

          /* Gradiente ajustado a la marca (Magenta) */
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
          ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-20 pointer-events-none"}
        `}
      >
        <span>Inscribirme</span>
        <MousePointerClick size={24} className="animate-pulse" />
      </a>
    </>
  );
}