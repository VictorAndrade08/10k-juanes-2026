// app/inscripcion/page.tsx
"use client";

import { Bebas_Neue } from "next/font/google";
import FormInscripcion from "@/app/components/FormInscripcion";
const bebas = Bebas_Neue({
  subsets: ["latin"],
  weight: "400",
});

export default function InscripcionPage() {
  return (
    <main className="min-h-screen bg-[#05071A] text-white">
      
      {/* HEADER / BREADCRUMB */}
      <section className="w-full border-b border-white/10 bg-[#05071A]/80 backdrop-blur">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <p className="text-[11px] uppercase tracking-[0.28em] text-white/55">
              Inscripción oficial · 10K Ruta de los Tres Juanes
            </p>

            <h1
              className={`${bebas.className} text-[24px] md:text-[30px] mt-1`}
            >
              Formulario de inscripción
            </h1>
          </div>
        </div>
      </section>

      {/* AQUÍ RENDERIZAMOS EL FORMULARIO */}
      <div className="max-w-4xl mx-auto px-4 pb-16 pt-8">
        <FormInscripcion />
      </div>

    </main>
  );
}
