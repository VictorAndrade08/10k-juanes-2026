"use client";

import React, { useState, useEffect } from "react";
import { AlertCircle, Timer, XCircle } from "lucide-react"; 
import InscripcionHeader from "@/app/components/InscripcionHeader";
import FormInscripcion from "@/app/components/FormInscripcion";

export default function InscripcionPage() {
  const [timeLeft, setTimeLeft] = useState("");
  const [isTimeUp, setIsTimeUp] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // FECHA LÍMITE: Hoy 3 de Febrero 2026 a las 6:00 PM (18:00:00)
    const targetDate = new Date("2026-02-03T21:00:00").getTime();

    const updateTimer = () => {
      const now = new Date().getTime();
      const distance = targetDate - now;

      if (distance < 0) {
        setIsTimeUp(true);
        setTimeLeft("00m 00s"); // Poner en cero visualmente antes de bloquear
      } else {
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);
        
        if (hours > 0) {
            setTimeLeft(`${hours}h ${minutes}m ${seconds}s`);
        } else {
            setTimeLeft(`${minutes}m ${seconds}s`);
        }
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, []);

  // Evita renderizar mal en el servidor
  if (!mounted) return null;

  // --- ZONA DE BLOQUEO TOTAL ---
  // Si el tiempo terminó, mostramos ESTO y NO el formulario.
  if (isTimeUp) {
    return (
      <>
        <InscripcionHeader />
        <div className="min-h-[70vh] w-full flex items-center justify-center p-6 bg-[#0F1218]">
          <div className="bg-[#161A23] border-2 border-red-600/50 p-10 md:p-14 rounded-3xl text-center max-w-2xl shadow-[0_0_100px_rgba(220,38,38,0.3)] animate-in zoom-in-95 duration-300 relative overflow-hidden">
            {/* Fondo decorativo de error */}
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-red-600 to-orange-600" />
            
            <div className="w-24 h-24 bg-red-600/20 text-red-500 rounded-full flex items-center justify-center mx-auto mb-8 animate-pulse">
              <XCircle size={60} />
            </div>
            
            <h1 className="text-5xl md:text-7xl font-black text-white mb-6 uppercase italic tracking-tighter">
              Inscripciones<br/>
              <span className="text-red-500">Cerradas</span>
            </h1>
            
            <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-6 mb-8">
              <p className="text-red-200 text-xl md:text-2xl font-bold">
                El tiempo límite de las 6:00 PM ha finalizado.
              </p>
              <p className="text-gray-400 mt-2">Ya no se aceptan nuevos registros.</p>
            </div>

            <a 
              href="/" 
              className="inline-flex items-center gap-2 bg-white text-black px-10 py-5 rounded-xl font-black uppercase tracking-wide hover:bg-gray-200 hover:scale-105 transition shadow-xl"
            >
              Volver al Inicio
            </a>
          </div>
        </div>
      </>
    );
  }

  // --- ZONA ACTIVA (CONTAODR MUY VISIBLE) ---
  return (
    <>
      <InscripcionHeader />

      {/* BARRA DE URGENCIA MEJORADA: Rojo sólido y letras grandes */}
      <div className="bg-[#DC2626] text-white py-4 md:py-5 shadow-2xl sticky top-0 z-50 border-b-4 border-[#991B1B]">
        <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-center gap-3 md:gap-8 text-center">
            
            <div className="flex items-center gap-3 animate-pulse">
                <Timer size={32} strokeWidth={2.5} className="text-white" />
                <span className="font-black uppercase italic tracking-widest text-lg md:text-xl text-red-100">
                    Cierre inminente:
                </span>
            </div>

            {/* Números con fondo oscuro para máximo contraste */}
            <div className="bg-black/30 px-6 py-2 rounded-lg border border-white/10 backdrop-blur-sm">
                <span className="font-mono font-black text-4xl md:text-5xl text-white drop-shadow-[0_4px_4px_rgba(0,0,0,0.5)] tabular-nums">
                    {timeLeft}
                </span>
            </div>
            
        </div>
      </div>

      <FormInscripcion />
    </>
  );
}