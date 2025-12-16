"use client";

import { useEffect, useMemo, useState } from "react";
import { usePathname } from "next/navigation";
import { HiXMark } from "react-icons/hi2";

const brandPink = "#FF4EC4";
const brandPurple = "#9B5CFF";

export default function PagoNotice() {
  const pathname = usePathname() || "";
  const isInscripcion = pathname.startsWith("/inscripcion");
  const isVerificar = pathname.startsWith("/verificar");

  // ✅ SOLO en estas 2 rutas
  if (!isInscripcion && !isVerificar) return null;

  const storageKey = useMemo(
    () => (isVerificar ? "juanes_notice_verificar" : "juanes_notice_inscripcion"),
    [isVerificar, isInscripcion]
  );

  const [hide, setHide] = useState(true);

  useEffect(() => {
    try {
      setHide(localStorage.getItem(storageKey) === "1");
    } catch {
      setHide(false);
    }
  }, [storageKey]);

  const close = () => {
    setHide(true);
    try {
      localStorage.setItem(storageKey, "1");
    } catch {}
  };

  if (hide) return null;

  const title = isVerificar ? "¿Pagaste pero no llenaste el formulario?" : "Importante antes de terminar";
  const message = isVerificar ? (
    <>
      Puede que <b>ya hayas pagado</b>, pero si <b>no llenaste la inscripción</b>, tu registro{" "}
      <b>no aparecerá</b> al verificar. Entra a <b>/inscripcion/</b> y completa tus datos + comprobante.
    </>
  ) : (
    <>
      Si <b>ya hiciste el pago</b>, igual debes <b>llenar este formulario</b> para que tu inscripción se
      active y aparezca en el sistema.
    </>
  );

  const ctaHref = "/inscripcion";
  const ctaText = "Ir a inscripción";

  return (
    <div className="w-full flex justify-center px-4 mt-3">
      <div
        className="
          w-full max-w-7xl
          rounded-[22px]
          overflow-hidden
          border border-white/10
          shadow-[0_18px_55px_rgba(0,0,0,0.25)]
        "
        style={{ background: `linear-gradient(90deg, ${brandPink}, ${brandPurple})` }}
      >
        <div className="px-5 py-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="text-black/90">
            <p className="text-[12px] sm:text-[13px] font-extrabold uppercase tracking-[0.18em]">
              {title}
            </p>
            <p className="mt-1 text-[12px] sm:text-[13px] font-semibold leading-snug">
              {message}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <a
              href={ctaHref}
              className="
                inline-flex items-center justify-center
                rounded-full
                px-4 py-2
                bg-black/90 text-white
                text-[11px] uppercase tracking-[0.22em]
                font-semibold
                hover:bg-black transition
                whitespace-nowrap
              "
            >
              {ctaText}
            </a>

            <button
              onClick={close}
              className="p-2 rounded-full bg-black/15 hover:bg-black/25 transition"
              aria-label="Cerrar aviso"
              title="Cerrar"
            >
              <HiXMark className="w-5 h-5 text-black/90" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
