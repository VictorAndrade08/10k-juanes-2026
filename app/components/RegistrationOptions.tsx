"use client";

import React from "react";
import Link from "next/link"; // MEJORA: Navegación SPA instantánea
import { Bebas_Neue } from "next/font/google"; // MEJORA: Carga de fuentes
import { 
  Globe, 
  MessageCircle, 
  CheckCircle2, 
  ArrowRight, 
  Smartphone,
  CreditCard,
  UserCheck
} from "lucide-react";

// Configuración de la fuente optimizada
const bebas = Bebas_Neue({
  subsets: ["latin"],
  weight: "400",
  display: "swap",
  variable: "--font-bebas",
});

export default function RegistrationOptions() {
  return (
    // Inyectamos la variable de fuente en el contenedor principal
    <section className={`w-full px-3 py-4 flex justify-center bg-gray-50 font-sans ${bebas.variable}`}>
      <div className="w-full max-w-7xl grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
        
        {/* ================================
            INSCRIPCIÓN EN LÍNEA (BLANCO)
        ================================= */}
        <article className="
            relative overflow-hidden
            rounded-[32px] 
            bg-white text-gray-900 
            px-6 sm:px-10 py-10 sm:py-12 
            shadow-[0_10px_40px_-10px_rgba(0,0,0,0.08)] 
            border border-gray-100 
            flex flex-col justify-between
            group hover:shadow-[0_20px_60px_-15px_rgba(192,36,133,0.15)]
            transition-all duration-300
        ">
          {/* Fondo decorativo */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-[#C02485]/5 to-transparent rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />

          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-4">
               <div className="p-2 bg-gray-100 rounded-full text-[#C02485]">
                 <Globe size={20} />
               </div>
               <p className="text-xs tracking-[0.2em] uppercase text-gray-500 font-bold">
                 Recomendado
               </p>
            </div>

            <h2 className="text-[32px] sm:text-[42px] leading-[1] text-gray-900 font-[family-name:var(--font-bebas)] mb-4">
              ¡Inscríbete online <br/>
              <span className="text-[#C02485]">en menos de 3 minutos!</span>
            </h2>

            <p className="text-base text-gray-600 leading-relaxed mb-8">
              Rápido y sin complicaciones. Asegura tu cupo inmediatamente desde tu computadora o celular.
            </p>

            <ul className="space-y-4">
              <ListItem icon={UserCheck} text="Elige tu categoría." />
              <ListItem icon={CreditCard} text="Completa tus datos y paga." />
              <ListItem icon={CheckCircle2} text="Recibe confirmación instantánea." />
            </ul>
          </div>

          <div className="mt-10 relative z-10">
            {/* MEJORA: Usamos Link para navegación interna rápida */}
            <Link
              href="/inscripcion"
              className="
                flex items-center justify-center gap-2 w-full
                h-14 rounded-full 
                bg-gradient-to-r from-[#C02485] to-[#E5006D] 
                text-white text-sm tracking-[0.15em] uppercase font-bold 
                shadow-lg shadow-[#C02485]/30 
                hover:shadow-[#C02485]/50 hover:-translate-y-1 hover:gap-4
                transition-all duration-300
              "
            >
              Ir al formulario online <ArrowRight size={18} />
            </Link>

            <p className="mt-5 text-sm text-center text-gray-500">
              Precio general: <strong className="text-gray-900">$30</strong> ·
              Tercera edad/Discapacidad: <strong className="text-gray-900">$20</strong>
            </p>
          </div>
        </article>

        {/* ================================
            INSCRIPCIÓN POR WHATSAPP (OSCURO)
        ================================= */}
        <article className="
            relative overflow-hidden
            rounded-[32px] 
            bg-[#111] text-white 
            px-6 sm:px-10 py-10 sm:py-12 
            shadow-[0_15px_50px_-10px_rgba(0,0,0,0.3)] 
            border border-gray-800
            flex flex-col justify-between
            group
        ">
          {/* Fondo decorativo */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-[#25D366]/10 to-transparent rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />

          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-4">
               <div className="p-2 bg-white/10 rounded-full text-[#25D366]">
                 <MessageCircle size={20} />
               </div>
               <p className="text-xs tracking-[0.2em] uppercase text-white/50 font-bold">
                 Asistido
               </p>
            </div>

            <h2 className="text-[32px] sm:text-[42px] leading-[1] text-white font-[family-name:var(--font-bebas)] mb-4">
              ¿Prefieres ayuda? <br/>
              <span className="text-[#25D366]">Hazlo por WhatsApp</span>
            </h2>

            <p className="text-base text-white/70 leading-relaxed mb-8">
              Un asesor te guiará paso a paso. Ideal si necesitas realizar consultas específicas antes de pagar.
            </p>

            <ul className="space-y-4">
              <ListItemDark icon={Smartphone} text="Envía tus datos por chat." />
              <ListItemDark icon={CreditCard} text="Recibe los datos para transferencia." />
              <ListItemDark icon={CheckCircle2} text="Envía comprobante y confirma." />
            </ul>
          </div>

          <div className="mt-10 relative z-10">
            {/* NOTA: WhatsApp es externo, así que mantenemos <a> con rel="noopener" */}
            <a
              href="https://wa.me/593995102378"
              target="_blank"
              rel="noopener noreferrer"
              className="
                flex items-center justify-center gap-2 w-full
                h-14 rounded-full 
                bg-white text-gray-900
                border-2 border-transparent
                text-sm tracking-[0.15em] uppercase font-bold 
                shadow-lg
                hover:bg-[#25D366] hover:text-white hover:border-[#25D366]
                hover:-translate-y-1
                transition-all duration-300
              "
            >
              Abrir WhatsApp <MessageCircle size={18} />
            </a>

            <p className="mt-5 text-sm text-center text-white/50">
              WhatsApp oficial: <span className="text-white font-semibold">+593 99 510 2378</span>
            </p>
          </div>
        </article>

      </div>
    </section>
  );
}

// Componentes auxiliares para listas limpias
const ListItem = ({ icon: Icon, text }: { icon: any, text: string }) => (
  <li className="flex items-start gap-3 text-gray-700">
    <Icon size={20} className="text-[#C02485] mt-0.5 shrink-0" />
    <span className="text-sm sm:text-base font-medium">{text}</span>
  </li>
);

const ListItemDark = ({ icon: Icon, text }: { icon: any, text: string }) => (
  <li className="flex items-start gap-3 text-white/90">
    <Icon size={20} className="text-[#25D366] mt-0.5 shrink-0" />
    <span className="text-sm sm:text-base font-medium">{text}</span>
  </li>
);