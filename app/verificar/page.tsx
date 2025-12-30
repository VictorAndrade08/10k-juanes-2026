"use client";

import React, { useMemo, useState } from "react";
import { IdCard, XCircle, Loader2, X, CheckCircle2, Ticket } from "lucide-react";

// Configuración de estilos y fuentes
const brandPink = "#FF4EC4";
const brandPurple = "#9B5CFF";

// Simulamos la fuente Bebas Neue
const bebasClassName = "font-bebas"; 

const AIRTABLE_API_KEY = process.env.NEXT_PUBLIC_AIRTABLE_API_KEY!;
const AIRTABLE_BASE_ID = process.env.NEXT_PUBLIC_AIRTABLE_BASE_ID!;
const AIRTABLE_TABLE_ID = process.env.NEXT_PUBLIC_AIRTABLE_TABLE_ID!;

type VerifyData = {
  record_id?: string | null;
  nombre?: string | null;
  cedula?: string | null;
  celular?: string | null;
  email?: string | null;
  ciudad?: string | null;
  edad?: number | string | null;
  genero?: string | null;
  categorias?: string | null;
  etapa?: string | null;
  valor?: number | string | null;
};

// --- MODAL DE NO ENCONTRADO ---
function NotFoundModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  if (!open) return null;
  const hrefInscripcion = "/inscripcion#formulario";

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center px-4"
      role="dialog"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/90 backdrop-blur-md" />
      <div
        className="relative w-full max-w-lg overflow-hidden rounded-[30px] border border-white/10 bg-[#0B0E13] shadow-2xl animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="h-1.5 w-full" style={{ background: `linear-gradient(90deg, ${brandPurple}, ${brandPink})` }} />
        <div className="p-10 text-center">
          <div className="mx-auto w-24 h-24 bg-red-500/10 rounded-full flex items-center justify-center mb-6">
            <XCircle className="w-12 h-12 text-red-500" />
          </div>
          <h3 className={`text-5xl text-white uppercase ${bebasClassName} mb-4`}>
            No Encontrado
          </h3>
          <p className="text-white/80 leading-relaxed text-lg">
            No encontramos ninguna inscripción activa con ese número de cédula. <br/> Por favor verifica que esté bien escrito.
          </p>
          
          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={onClose} 
              className="px-8 py-4 rounded-2xl text-base font-semibold border border-white/20 text-white hover:bg-white/10 transition uppercase tracking-wide"
            >
              Intentar de nuevo
            </button>
            <a
              href={hrefInscripcion}
              className="px-8 py-4 rounded-2xl text-base font-bold text-[#050505] shadow-[0_0_20px_rgba(255,78,196,0.3)] hover:shadow-[0_0_30px_rgba(255,78,196,0.5)] hover:brightness-110 transition uppercase tracking-wide flex items-center justify-center"
              style={{ background: `linear-gradient(90deg, ${brandPurple}, ${brandPink})` }}
            >
              Ir a Inscribirme
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function VerificarPage() {
  const [cedula, setCedula] = useState("");
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [data, setData] = useState<VerifyData | null>(null);

  const cedulaClean = useMemo(() => cedula.replace(/\D+/g, ""), [cedula]);
  const cedulaOk = cedulaClean.length >= 6 && cedulaClean.length <= 15;

  const verify = async () => {
    // Simulación
    if (!AIRTABLE_API_KEY && cedulaOk) {
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            setData({
                record_id: "REC-12345",
                nombre: "JUAN PÉREZ ALMEIDA",
                cedula: cedulaClean,
                ciudad: "AMBATO",
                edad: 28,
                genero: "MASCULINO",
                categorias: "ÉLITE 10K",
                etapa: "APROBADO",
                valor: 25
            });
        }, 1500);
        return;
    }

    if (!cedulaOk) return;

    setLoading(true);
    setData(null);

    try {
      const formula = `{cedula}='${cedulaClean}'`;
      const url =
        `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${AIRTABLE_TABLE_ID}` +
        `?maxRecords=1&filterByFormula=${encodeURIComponent(formula)}`;

      const res = await fetch(url, {
        headers: {
          Authorization: `Bearer ${AIRTABLE_API_KEY}`,
          "Content-Type": "application/json",
        },
      });

      const json = await res.json();

      if (!json.records || json.records.length === 0) {
        setModalOpen(true);
        return;
      }

      const record = json.records[0];
      const fields = record.fields || {};

      setData({
        record_id: record.id,
        nombre: fields["nombre"] ?? "Participante",
        cedula: fields["cedula"] ?? cedulaClean,
        celular: fields["celular"] ?? null,
        email: fields["email"] ?? null,
        ciudad: fields["ciudad"] ?? "No especificada",
        edad: fields["edad"] ?? null,
        genero: fields["genero"] ?? null,
        categorias: fields["categorias"] ?? "General",
        etapa: fields["Etapa"] ?? "En Proceso",
        valor: fields["Valor"] ?? null,
      });

    } catch (err) {
      console.error(err);
      alert("Error de conexión");
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (text: string) => {
    const t = String(text).toLowerCase();
    if (t.includes("verificado") || t.includes("aprobado") || t.includes("confirmado")) return "text-[#00FF94]";
    if (t.includes("verificar") || t.includes("pendiente") || t.includes("solicitado")) return "text-[#FFD600]";
    if (t.includes("rechazado") || t.includes("finalizada")) return "text-[#FF4444]";
    return "text-white";
  };

  return (
    <>
      <style dangerouslySetInnerHTML={{__html: `
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap');
        .font-bebas { font-family: 'Bebas Neue', sans-serif; }
      `}} />
      
      <NotFoundModal open={modalOpen} onClose={() => setModalOpen(false)} />

      {/* LAYOUT PRINCIPAL */}
      <div className="w-full flex justify-center items-start pt-10 pb-20 px-4 font-sans min-h-screen">
        
        {/* CONTENEDOR "TARJETA" GRANDE */}
        <div className="w-full max-w-7xl bg-[#050505] rounded-[3rem] relative overflow-hidden shadow-2xl min-h-[800px] flex items-center justify-center p-8 lg:p-20">
            
            {/* Fondos ambientales más sutiles para mejorar contraste */}
            <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
                <div className="absolute top-[-20%] left-[-10%] w-[800px] h-[800px] bg-purple-600/15 rounded-full blur-[150px] mix-blend-screen animate-pulse opacity-50" />
                <div className="absolute bottom-[-20%] right-[-10%] w-[800px] h-[800px] bg-pink-600/10 rounded-full blur-[150px] mix-blend-screen animate-pulse delay-700 opacity-50" />
            </div>
            
            {/* Grid de Contenido */}
            <div className="relative z-10 w-full grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
                
                {/* --- COLUMNA IZQUIERDA (TEXTO/HERO) --- */}
                <div className="flex flex-col items-center lg:items-start text-center lg:text-left text-white">
                    <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full border border-white/20 bg-white/5 backdrop-blur-sm mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                        <span className="w-2.5 h-2.5 rounded-full bg-[#00FF94] animate-pulse"/>
                        <span className="text-sm font-mono uppercase tracking-widest text-white font-semibold">Sistema de Verificación 2025</span>
                    </div>
                    
                    <h1 className={`text-7xl sm:text-8xl lg:text-9xl leading-[0.9] text-white ${bebasClassName} mb-8 drop-shadow-2xl animate-in slide-in-from-bottom-4 duration-700 delay-100`}>
                      Ruta de los <br/>
                      <span className="text-transparent bg-clip-text" style={{ backgroundImage: `linear-gradient(90deg, ${brandPurple}, ${brandPink}, #fff)` }}>
                        3 Juanes
                      </span>
                    </h1>
                    
                    <p className="text-xl lg:text-2xl text-white/80 max-w-lg font-normal leading-relaxed mb-10 animate-in slide-in-from-bottom-4 duration-700 delay-200">
                       Consulta el estado de tu inscripción, descarga tu ticket digital y prepárate para la carrera más importante del año.
                    </p>

                    {/* Stats */}
                    <div className="flex flex-wrap justify-center lg:justify-start gap-12 border-t border-white/20 pt-10 mt-2 w-full animate-in slide-in-from-bottom-4 duration-700 delay-300">
                        <div>
                            <p className={`text-4xl ${bebasClassName} text-white`}>10K</p>
                            <p className="text-sm font-bold uppercase tracking-widest text-white/60">Distancia</p>
                        </div>
                        <div>
                            <p className={`text-4xl ${bebasClassName} text-white`}>Feb 07</p>
                            <p className="text-sm font-bold uppercase tracking-widest text-white/60">Fecha</p>
                        </div>
                        <div>
                            <p className={`text-4xl ${bebasClassName} text-white`}>Ambato</p>
                            <p className="text-sm font-bold uppercase tracking-widest text-white/60">Lugar</p>
                        </div>
                    </div>
                </div>

                {/* --- COLUMNA DERECHA (FORMULARIO/TICKET) --- */}
                <div className="w-full max-w-lg mx-auto lg:max-w-full flex justify-center lg:justify-end animate-in zoom-in-95 duration-700 delay-150">
                    
                    {/* WRAPPER DEL FORMULARIO/TICKET */}
                    <div className="w-full max-w-[500px] text-white"> 
                        
                        {!data && (
                            <div className="bg-[#0B0E13] border border-white/20 rounded-[40px] p-10 shadow-[0_30px_60px_-10px_rgba(0,0,0,0.6)] backdrop-blur-md relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 rounded-full blur-[50px] pointer-events-none" />

                                <div className="flex items-center gap-5 mb-10 relative z-10">
                                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-gray-800 to-black flex items-center justify-center border border-white/10 shadow-inner">
                                        <IdCard className="w-8 h-8 text-white" />
                                    </div>
                                    <div>
                                        <h2 className="text-2xl font-bold text-white mb-1">Consultar Cédula</h2>
                                        <p className="text-base text-white/60">Ingresa tus datos para validar</p>
                                    </div>
                                </div>

                                <div className="space-y-6 relative z-10">
                                    <div className="relative group">
                                        <label className="text-xs font-bold uppercase tracking-widest text-white/50 mb-2 block ml-1 group-focus-within:text-purple-400 transition-colors">Número de Identificación</label>
                                        <div className="relative">
                                            <input
                                                value={cedula}
                                                onChange={(e) => setCedula(e.target.value)}
                                                placeholder="Ej: 1801234567"
                                                inputMode="numeric"
                                                className="w-full bg-[#15181E] border border-white/20 rounded-2xl px-5 py-5 pl-5 text-xl font-medium text-white placeholder:text-white/30 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all shadow-inner"
                                            />
                                            <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none">
                                                {cedulaOk ? (
                                                    <CheckCircle2 className="w-6 h-6 text-[#00FF94]" />
                                                ) : (
                                                    <div className="w-2 h-2 rounded-full bg-white/20" />
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    <button
                                        onClick={verify}
                                        disabled={loading || !cedulaOk}
                                        className="w-full py-5 rounded-2xl font-bold text-base uppercase tracking-widest text-[#050505] hover:brightness-110 transition disabled:opacity-50 disabled:cursor-not-allowed group relative overflow-hidden shadow-lg shadow-purple-900/20 mt-4"
                                        style={{
                                            background: `linear-gradient(90deg, ${brandPurple}, ${brandPink})`,
                                        }}
                                    >
                                        <span className="relative z-10 flex items-center justify-center gap-2">
                                            {loading ? <Loader2 className="animate-spin w-6 h-6" /> : <Ticket className="w-6 h-6" />}
                                            {loading ? "Buscando..." : "Consultar Inscripción"}
                                        </span>
                                    </button>
                                </div>
                                
                                <div className="mt-10 pt-8 border-t border-white/10 text-center relative z-10">
                                    <p className="text-sm text-white/50">¿Tienes problemas? <a href="/contacto" className="text-white hover:text-white underline decoration-white/50 font-semibold">Contáctanos</a></p>
                                </div>
                            </div>
                        )}

                        {data && (
                            <div className="relative w-full animate-in fade-in zoom-in-95 duration-500">
                                <button 
                                    onClick={() => { setData(null); setCedula(""); }}
                                    className="absolute -top-12 right-0 text-sm text-black/60 hover:text-black lg:text-white/50 lg:hover:text-white flex items-center gap-2 transition-colors uppercase tracking-wider font-bold bg-white/5 px-4 py-2 rounded-full border border-white/10"
                                >
                                    <X className="w-4 h-4" /> Nueva Consulta
                                </button>

                                {/* TICKET VISUAL - MÁS GRANDE */}
                                <div className="relative w-full bg-[#11141A] rounded-[32px] overflow-hidden border border-white/20 shadow-[0_40px_100px_-20px_rgba(155,92,255,0.3)]">
                                    
                                    {/* Header del Ticket */}
                                    <div className="bg-[#181B21] p-8 relative overflow-hidden border-b border-white/10 border-dashed">
                                        <div className="absolute top-0 left-0 w-full h-1.5" style={{ background: `linear-gradient(90deg, ${brandPurple}, ${brandPink})` }} />
                                        <div className="flex justify-between items-start relative z-10 gap-4">
                                            <div>
                                                <p className="text-xs uppercase tracking-[0.25em] text-white/50 font-bold mb-2">Participante</p>
                                                <h3 className="text-3xl font-bold text-white leading-tight mb-2">{data.nombre}</h3>
                                                <p className="text-lg text-white/70 font-mono tracking-wider bg-white/5 inline-block px-2 py-0.5 rounded">{data.cedula}</p>
                                            </div>
                                            <div className="w-20 h-20 bg-white rounded-xl p-1.5 overflow-hidden shadow-lg shrink-0">
                                                 <img 
                                                    src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=CEDULA:${data.cedula}|NOMBRE:${data.nombre}`}
                                                    alt="QR"
                                                    className="w-full h-full object-cover"
                                                 />
                                            </div>
                                        </div>
                                        <div className="absolute -bottom-4 -left-4 w-8 h-8 bg-[#050505] rounded-full z-20 border-r border-t border-white/20" />
                                        <div className="absolute -bottom-4 -right-4 w-8 h-8 bg-[#050505] rounded-full z-20 border-l border-t border-white/20" />
                                    </div>

                                    {/* Body del Ticket */}
                                    <div className="p-8 pt-10 bg-[#11141A]">
                                        <div className="grid grid-cols-2 gap-y-8 gap-x-6">
                                            <div className="col-span-2">
                                                <p className="text-xs uppercase tracking-widest text-white/50 font-bold mb-2">Estado</p>
                                                <div className={`text-5xl ${bebasClassName} ${getStatusColor(data.etapa || "")} flex items-center gap-3`}>
                                                    <span className={`w-3 h-3 rounded-full ${data.etapa?.toLowerCase().includes('verificado') ? 'bg-[#00FF94]' : 'bg-yellow-400'} animate-pulse shadow-[0_0_15px_currentColor]`} />
                                                    {data.etapa}
                                                </div>
                                            </div>
                                            <div>
                                                <p className="text-xs uppercase tracking-widest text-white/50 font-bold mb-1.5">Categoría</p>
                                                <p className="text-lg font-bold text-white border-l-2 border-purple-500 pl-3">{data.categorias}</p>
                                            </div>
                                            <div>
                                                <p className="text-xs uppercase tracking-widest text-white/50 font-bold mb-1.5">Ciudad</p>
                                                <p className="text-lg font-bold text-white border-l-2 border-pink-500 pl-3">{data.ciudad}</p>
                                            </div>
                                            <div>
                                                <p className="text-xs uppercase tracking-widest text-white/50 font-bold mb-1.5">Edad</p>
                                                <p className="text-lg font-medium text-white">{data.edad ? `${data.edad} Años` : '-'}</p>
                                            </div>
                                            <div>
                                                <p className="text-xs uppercase tracking-widest text-white/50 font-bold mb-1.5">Género</p>
                                                <p className="text-lg font-medium text-white">{data.genero || '-'}</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Footer del Ticket */}
                                    <div className="bg-[#0E1116] p-6 border-t border-white/10 flex items-center justify-between">
                                        <div className="flex flex-col">
                                            <span className="text-[10px] uppercase text-white/30 tracking-widest font-bold mb-1">Ticket ID</span>
                                            <span className="text-sm font-mono text-white/70 font-semibold">{data.record_id?.slice(-8).toUpperCase() || 'PRE-ORDER'}</span>
                                        </div>
                                        <div className="h-6 opacity-30">
                                           <div className="flex gap-[3px] h-full items-end">
                                              {[...Array(18)].map((_,i) => <div key={i} className={`w-[2px] bg-white h-${Math.random() > 0.5 ? 'full' : '2/3'}`} />)}
                                           </div>
                                        </div>
                                    </div>
                                </div>
                                
                                <p className="text-center text-xs text-white/40 mt-6 max-w-sm mx-auto leading-relaxed">
                                    Presenta este comprobante digital el día de la entrega de kits. Puedes tomar una captura de pantalla.
                                </p>
                            </div>
                        )}
                    </div>
                </div>

            </div>
        </div>
      </div>
    </>
  );
}