// app/components/FloatingCTA.tsx
"use client";

import { useEffect, useState } from "react";

export default function FloatingCTA() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const onScroll = () => {
      const scrolled = window.scrollY > 400;
      setVisible(scrolled);
    };

    window.addEventListener("scroll", onScroll);
    onScroll();

    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (!visible) return null;

  return (
    <button
      onClick={() => {
        window.location.href = "/inscripcion";
      }}
      className="
        fixed z-[9999]
        right-5 bottom-5
        md:right-8 md:bottom-8

        px-8 py-4
        rounded-full

        text-white font-bold uppercase tracking-[0.20em]
        text-[13px] md:text-[14px]

        bg-gradient-to-r from-[#FF0080] to-[#E5006D]
        shadow-[0_0_25px_rgba(255,0,128,0.55)]
        hover:shadow-[0_0_35px_rgba(255,0,128,0.75)]

        animate-cta-glow
        animate-cta-bounce
        transition-all duration-300 cursor-pointer

        md:w-auto
        w-[90%] left-1/2 md:left-auto -translate-x-1/2 md:translate-x-0
      "
    >
      Inscribirme ahora
    </button>
  );
}
