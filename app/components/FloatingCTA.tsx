"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Barlow_Condensed } from "next/font/google";

const barlow = Barlow_Condensed({
  subsets: ["latin"],
  weight: ["700"],
  display: "swap",
});

export default function FloatingCTA() {
  const pathname = usePathname();
  const router = useRouter();

  const [visible, setVisible] = useState(false);

  const hiddenOnThisRoute = pathname?.startsWith("/inscripcion") ?? false;

  useEffect(() => {
    // si estamos en /inscripcion, asegura oculto y no programes nada
    if (hiddenOnThisRoute) {
      setVisible(false);
      return;
    }

    const timer = window.setTimeout(() => setVisible(true), 1000);
    return () => window.clearTimeout(timer);
  }, [hiddenOnThisRoute]);

  // ✅ el return null va DESPUÉS de los hooks (ya no rompe reglas)
  if (hiddenOnThisRoute) return null;

  return (
    <button
      type="button"
      onClick={() => router.push("/inscripcion")}
      aria-label="Ir a inscripción"
      className={`
        ${barlow.className}
        fixed z-[9999]
        left-1/2 -translate-x-1/2
        bottom-[calc(env(safe-area-inset-bottom)+22px)]
        md:left-auto md:right-10 md:translate-x-0

        rounded-full
        px-12 py-5 md:px-10 md:py-4
        text-[20px] md:text-[18px]
        uppercase tracking-[0.15em]
        font-bold text-white

        bg-gradient-to-r from-[#FF0080] to-[#E5006D]
        border border-white/10
        backdrop-blur

        shadow-[0_0_35px_rgba(255,0,128,0.45)]
        hover:shadow-[0_0_50px_rgba(255,0,128,0.65)]
        active:scale-95

        transition-[opacity,transform,box-shadow] duration-500 ease-out
        ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"}
      `}
    >
      Inscribirme
    </button>
  );
}
