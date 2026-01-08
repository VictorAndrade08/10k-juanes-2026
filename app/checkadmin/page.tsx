"use client";

import React, { useState, useEffect } from 'react';
import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getAuth, onAuthStateChanged, signInAnonymously, Auth, User as FirebaseUser } from 'firebase/auth';
import { getFirestore, collection, doc, setDoc, onSnapshot, getDoc, Firestore } from 'firebase/firestore';

// --- IMPORTACIONES COMPLETAS ---
import {
  ShieldCheck, RefreshCw, CheckCircle2, CheckCircle, AlertCircle, Search, ArrowRight,
  Scan, FileText, Loader2, Eye, Settings2, AlertTriangle, Lock, History, ShieldAlert,
  Fingerprint, Zap, Info, CreditCard, Share2, XCircle, AlertOctagon, Hash, Calendar,
  Maximize2, Database, Image as ImageIcon, User, Wallet, FileWarning, Unlock, LogOut
} from 'lucide-react';

// --- CONFIGURACIÓN ---
const CREDENTIALS = {
  FIREBASE: {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "",
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "bunker-10k.firebaseapp.com",
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "bunker-10k",
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "bunker-10k.firebasestorage.app",
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "277389285704",
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:277389285704:web:c31cbf51e2a49e26a17b7d",
  },
  GEMINI_KEY: process.env.NEXT_PUBLIC_GEMINI_API_KEY || ""
};

const AIRTABLE_CONFIG_KEY = 'verificador_ruta_3_juanes_config';
const ACCESS_PIN = "1026"; // <--- CAMBIA TU CONTRASEÑA AQUÍ

let app: FirebaseApp | undefined;
let auth: Auth | undefined;
let db: Firestore | undefined;

if (typeof window !== "undefined" && CREDENTIALS.FIREBASE.apiKey) {
  try {
    app = getApps().length === 0 ? initializeApp(CREDENTIALS.FIREBASE) : getApp();
    auth = getAuth(app);
    db = getFirestore(app);
  } catch (error) {
    console.error("🔥 Error Firebase:", error);
  }
}

interface Record {
  id: string;
  nombre: string;
  cedula: string;
  edad: string | number;
  categoria: string;
  valorEsperado: number;
  fotoUrl: string | null;
  docExtraido: string | null;
  montoExtraido: number | null;
  statusIA: 'pendiente' | 'escaneando' | 'listo' | 'error';
}

interface MatchResult {
  bank: {
    documento: string;
    monto: number;
    depositor: string;
    esDuplicadoBanco: boolean;
    esInterbancaria: boolean;
  };
  record: Record | null;
  status: 'found' | 'missing' | 'fraud' | 'verified';
  matchType: 'documento' | 'nombre';
  claimedBy?: string;
  nameMismatch: boolean;
}

export default function BunkerPage() {
  // --- ESTADOS DE SEGURIDAD ---
  const [isLocked, setIsLocked] = useState(true);
  const [pinInput, setPinInput] = useState("");
  const [pinError, setPinError] = useState(false);

  // --- ESTADOS DE LA APP ---
  const [isMounted, setIsMounted] = useState(false);
  const [user, setUser] = useState<FirebaseUser | null>(null);
  
  const [config, setConfig] = useState({
    apiKey: process.env.NEXT_PUBLIC_AIRTABLE_API_KEY || '',
    baseId: process.env.NEXT_PUBLIC_AIRTABLE_BASE_ID || 'appA0xfrSZyNTgiLV',
    tableName: process.env.NEXT_PUBLIC_AIRTABLE_TABLE_ID || 'CRM 10k',
    filterStage: 'Inscrito Pago x Verificar'
  });

  const [isConfigOpen, setIsConfigOpen] = useState(false);
  const [airtableRecords, setAirtableRecords] = useState<Record[]>([]);
  const [bankData, setBankData] = useState("");
  const [matches, setMatches] = useState<MatchResult[]>([]);
  const [historicalDocs, setHistoricalDocs] = useState<any>({});
  const [loading, setLoading] = useState(false);
  const [scanningId, setScanningId] = useState<string | null>(null);
  const [isScanningAll, setIsScanningAll] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [status, setStatus] = useState({ type: '', message: '' });

  const appId = "bunker-anti-fraude-10k";

  // --- EFECTOS ---
  useEffect(() => {
    setIsMounted(true);
    const saved = localStorage.getItem(AIRTABLE_CONFIG_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      setConfig(prev => ({ ...prev, ...parsed, apiKey: parsed.apiKey || process.env.NEXT_PUBLIC_AIRTABLE_API_KEY || '' }));
    }
  }, []);

  useEffect(() => {
    if (!isMounted || !auth) return;
    const initAuth = async () => { try { await signInAnonymously(auth!); } catch (err) { console.error(err); } };
    initAuth();
    return onAuthStateChanged(auth!, setUser);
  }, [isMounted]);

  useEffect(() => {
    if (!user || !db) return;
    return onSnapshot(collection(db, 'artifacts', appId, 'public', 'data', 'verified_receipts'), (snap) => {
      const docs: any = {};
      snap.forEach(d => { docs[d.id] = d.data(); });
      setHistoricalDocs(docs);
    });
  }, [user]);

  // --- FUNCIONES DE SEGURIDAD ---
  const handleUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    if (pinInput === ACCESS_PIN) {
      setIsLocked(false);
      setPinError(false);
    } else {
      setPinError(true);
      setPinInput("");
      setTimeout(() => setPinError(false), 2000);
    }
  };

  const handleLock = () => {
    setIsLocked(true);
    setPinInput("");
  };

  // --- FUNCIONES AUXILIARES ---
  const showStatus = (type: 'success' | 'error', message: string) => {
    setStatus({ type, message });
    setTimeout(() => setStatus({ type: '', message: '' }), 5000);
  };

  const saveConfig = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem(AIRTABLE_CONFIG_KEY, JSON.stringify(config));
    setIsConfigOpen(false);
    showStatus('success', 'Configuración guardada.');
  };

  const urlToBase64 = async (url: string) => {
    try {
      const response = await fetch(url, { mode: 'cors' });
      if (!response.ok) await fetch(url);
      const blob = await response.blob();
      return new Promise<{ data: string; mimeType: string } | null>((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve({ data: (reader.result as string).split(',')[1], mimeType: blob.type || "image/jpeg" });
        reader.readAsDataURL(blob);
      });
    } catch (e) { return null; }
  };

  // --- LÓGICA DE NEGOCIO ---
  const fetchAirtableRecords = async () => {
    if (!config.apiKey) return setIsConfigOpen(true);
    setLoading(true);
    try {
      const url = `https://api.airtable.com/v0/${config.baseId}/${encodeURIComponent(config.tableName)}?filterByFormula=${encodeURIComponent(`{Etapa}='${config.filterStage}'`)}`;
      const response = await fetch(url, { headers: { Authorization: `Bearer ${config.apiKey}` } });
      const data = await response.json();
      if (data.records) {
        setAirtableRecords(data.records.map((r: any) => ({
          id: r.id,
          nombre: r.fields['nombre'] || 'DESCONOCIDO',
          cedula: r.fields['cedula'] || 'S/N',
          edad: r.fields['edad'] || 'N/A',
          categoria: r.fields['categorias'] || 'N/A',
          valorEsperado: r.fields['Valor'] || 0,
          fotoUrl: r.fields['Comprobante']?.[0]?.url || null,
          docExtraido: null,
          montoExtraido: null,
          statusIA: 'pendiente'
        })));
        showStatus('success', `${data.records.length} atletas cargados.`);
      }
    } catch (e) { showStatus('error', 'Error Airtable.'); } finally { setLoading(false); }
  };

  const scanReceiptIA = async (record: Record) => {
    if (!record.fotoUrl) return;
    setAirtableRecords(prev => prev.map(r => r.id === record.id ? { ...r, statusIA: 'escaneando' } : r));
    setScanningId(record.id);

    try {
      const imageData: any = await urlToBase64(record.fotoUrl);
      if (!imageData) throw new Error("CORS Block");

      const prompt = `Analiza este comprobante de transferencia bancaria de Ecuador. Extrae el NÚMERO DE DOCUMENTO (comprobante, referencia o secuencial) y el MONTO. Responde SOLO este JSON: {"documento": "12345678", "monto": 20.00}`;
      
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${CREDENTIALS.GEMINI_KEY}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }, { inlineData: { mimeType: imageData.mimeType, data: imageData.data } }] }]
        })
      });

      const result = await response.json();
      const text = result.candidates?.[0]?.content?.parts?.[0]?.text.replace(/```json/g, '').replace(/```/g, '').trim();
      const json = JSON.parse(text || "{}");
      const docId = json.documento ? String(json.documento).replace(/\D/g, '') : null;

      setAirtableRecords(prev => prev.map(r => r.id === record.id ? { ...r, docExtraido: docId, montoExtraido: json.monto, statusIA: docId ? 'listo' : 'error' } : r));
    } catch (e) {
      setAirtableRecords(prev => prev.map(r => r.id === record.id ? { ...r, statusIA: 'error' } : r));
    } finally { setScanningId(null); }
  };

  const scanAll = async () => {
    setIsScanningAll(true);
    const pendings = airtableRecords.filter(r => r.fotoUrl && r.statusIA === 'pendiente');
    for (const record of pendings) { await scanReceiptIA(record); await new Promise(r => setTimeout(r, 200)); }
    setIsScanningAll(false);
    showStatus('success', 'Escaneo completado.');
  };

  const processMatches = () => {
    if (!bankData.trim()) return showStatus('error', 'Faltan datos del banco.');

    const regex = /(\d{2}\/\d{2}\/\d{4})\s+(\d{4,12})\s+([CD])/g;
    let match;
    const bankEntries = [];
    const seen = new Set();
    const internalDupes = new Set();

    while ((match = regex.exec(bankData)) !== null) {
      const docNum = match[2];
      const context = bankData.substring(match.index, match.index + 250);
      
      if (seen.has(docNum)) internalDupes.add(docNum);
      seen.add(docNum);

      const lineEnd = bankData.indexOf('\n', match.index);
      const fullLine = bankData.substring(match.index, lineEnd !== -1 ? lineEnd : undefined);
      let depositor = fullLine.replace(/TRANSFERENC.*?DE\s+|DEP\s+CNB\s+|CONST\.\s+RECAUDACION\s+/i, '').replace(/[\d\/]/g, '').trim();
      
      const amountMatch = context.match(/(\d{1,4}[.,]\d{2})(?!\d)/);
      let monto = 0;
      if (amountMatch) monto = parseFloat(amountMatch[0].replace(',', '.'));

      const esInterbancaria = fullLine.toLowerCase().includes('interbancari');

      bankEntries.push({ documento: docNum, monto, depositor, esInterbancaria, esDuplicadoBanco: internalDupes.has(docNum) });
    }

    const assignedIds = new Set();
    const newMatches = bankEntries.map(bank => {
      let record = airtableRecords.find(r => r.docExtraido === bank.documento);
      let matchType = 'documento';

      if (!record && bank.esInterbancaria) {
         record = airtableRecords.find(r => {
            if (assignedIds.has(r.id)) return false;
            const bankNameParts = bank.depositor.split(' ').filter((p: string) => p.length > 3);
            return bankNameParts.some((p: string) => r.nombre.toUpperCase().includes(p.toUpperCase()));
         });
         if (record) matchType = 'nombre';
      }

      if (record) assignedIds.add(record.id);
      const historical = historicalDocs[bank.documento];

      let nameMismatch = false;
      if (record && !matchType.includes('nombre')) {
         const crmName = record.nombre.toUpperCase();
         const bankName = bank.depositor.toUpperCase();
         if (bankName.length > 5 && !crmName.includes(bankName) && !bankName.includes(crmName)) {
            nameMismatch = true;
         }
      }

      return {
        bank,
        record: record || null,
        status: historical ? 'fraud' : (record ? 'found' : 'missing'),
        matchType,
        claimedBy: historical?.atleta,
        nameMismatch
      };
    });

    setMatches(newMatches);
    if (newMatches.length > 0) showStatus('success', 'Conciliación ejecutada.');
    else showStatus('error', 'No se encontraron datos válidos.');
  };

  const confirmInCRM = async (match: any) => {
    if (!user || !match.record) return;
    setLoading(true);
    try {
      const { id, nombre } = match.record;
      const { documento, monto } = match.bank;

      const docRef = doc(db!, 'artifacts', appId, 'public', 'data', 'verified_receipts', documento);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        showStatus('error', 'FRAUDE: Documento ya usado.');
        setLoading(false);
        return;
      }

      await fetch(`https://api.airtable.com/v0/${config.baseId}/${encodeURIComponent(config.tableName)}/${id}`, {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${config.apiKey}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fields: {
            'Etapa': 'Notificar', 
            'Numero Comprobante': documento,
            'Comentarios': `✅ VALIDADO: Doc ${documento} | $${monto} | IA`
          }
        })
      });

      await setDoc(docRef, { atleta: nombre, fecha: new Date().toISOString(), monto, uid: user.uid });
      setMatches(prev => prev.map(m => m.bank.documento === documento ? { ...m, status: 'verified' } : m));
      showStatus('success', 'Blindado exitosamente.');
    } catch (e) { showStatus('error', 'Error al guardar.'); } finally { setLoading(false); }
  };

  if (!isMounted) return null;

  // --- VISTA DE BLOQUEO DE SEGURIDAD ---
  if (isLocked) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-4">
        <div className="bg-zinc-900 border-2 border-zinc-800 p-10 rounded-[2.5rem] shadow-2xl w-full max-w-sm text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-sky-500 via-indigo-500 to-purple-500"></div>
          
          <div className="mb-8 flex justify-center">
            <div className="bg-zinc-800 p-5 rounded-2xl shadow-lg shadow-sky-500/10 border border-zinc-700">
              <Lock size={40} className="text-sky-500" strokeWidth={2}/>
            </div>
          </div>
          
          <h1 className="text-2xl font-black text-white uppercase tracking-tighter mb-2">Búnker 10k</h1>
          <p className="text-zinc-500 text-[10px] font-bold tracking-[0.4em] uppercase mb-8">Acceso Restringido</p>
          
          <form onSubmit={handleUnlock} className="space-y-6">
            <div className="relative">
              <input 
                type="password" 
                maxLength={4}
                className={`w-full p-4 bg-zinc-950 border-2 rounded-xl text-center text-3xl text-white font-mono tracking-[1em] focus:outline-none transition-all ${pinError ? 'border-rose-500 animate-pulse' : 'border-zinc-800 focus:border-sky-500'}`}
                placeholder="••••"
                value={pinInput}
                onChange={(e) => setPinInput(e.target.value.replace(/\D/g, ''))}
                autoFocus
              />
            </div>
            
            <button type="submit" className="w-full py-4 bg-sky-600 hover:bg-sky-500 text-white font-black rounded-xl uppercase tracking-widest text-xs transition-all active:scale-95 shadow-lg flex items-center justify-center gap-2">
              <Unlock size={14}/> Desbloquear Terminal
            </button>
          </form>
          
          {pinError && (
             <p className="mt-4 text-rose-500 text-[10px] font-black uppercase tracking-widest animate-bounce">Código Incorrecto</p>
          )}

          <div className="mt-8 pt-6 border-t border-zinc-800/50">
            <p className="text-[9px] text-zinc-600 font-mono">ID DISPOSITIVO: {typeof window !== 'undefined' ? window.navigator.userAgent.substring(0, 15) : 'UNK'}...</p>
          </div>
        </div>
      </div>
    );
  }

  // --- VISTA DEL DASHBOARD (SI NO ESTÁ BLOQUEADO) ---
  return (
    <div className="min-h-screen bg-zinc-950 p-4 md:p-6 font-sans text-zinc-200">
      <div className="max-w-[1920px] mx-auto space-y-6">
        
        {/* HEADER */}
        <header className="bg-zinc-900/80 p-4 md:p-6 rounded-3xl border border-zinc-800 flex flex-col md:flex-row justify-between items-center gap-4 shadow-xl backdrop-blur-sm">
          <div className="flex items-center gap-4">
            <div className="bg-sky-500/20 p-3 rounded-2xl text-sky-400 shadow-[0_0_20px_rgba(14,165,233,0.15)] border border-sky-500/30">
              <ShieldCheck size={32} strokeWidth={2}/>
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-black uppercase tracking-tighter text-white">Búnker 10k <span className="text-sky-400">Pro</span></h1>
              <p className="text-zinc-400 text-xs font-bold tracking-[0.2em] uppercase">Centro de Verificación de Pagos</p>
            </div>
          </div>
          <div className="flex gap-3 w-full md:w-auto items-center">
            <button onClick={fetchAirtableRecords} disabled={loading} className="flex-1 md:flex-none px-6 py-3 bg-sky-500 hover:bg-sky-400 text-white rounded-xl text-sm font-bold flex justify-center items-center gap-2 transition-all active:scale-95 disabled:opacity-50 shadow-lg shadow-sky-500/20">
              <RefreshCw size={18} className={loading ? "animate-spin" : ""} /> <span>Sincronizar CRM</span>
            </button>
            <button onClick={() => setIsConfigOpen(true)} className="p-3 bg-zinc-800 hover:bg-zinc-700 rounded-xl border border-zinc-700 text-zinc-400 hover:text-white transition-all">
              <Settings2 size={20}/>
            </button>
            <button onClick={handleLock} className="p-3 bg-rose-900/20 hover:bg-rose-900/40 rounded-xl border border-rose-900/30 text-rose-500 transition-all ml-2" title="Bloquear Pantalla">
              <LogOut size={20}/>
            </button>
          </div>
        </header>

        {/* LAYOUT PRINCIPAL RESPONSIVE */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* COLUMNA IZQUIERDA: SCANNER (3 cols en desktop) */}
          <div className="lg:col-span-3 flex flex-col gap-4 h-[500px] lg:h-[calc(100vh-180px)] min-h-[500px]">
            <div className="bg-zinc-900 border border-zinc-800 p-4 rounded-3xl flex-1 flex flex-col overflow-hidden relative shadow-2xl">
              
              <div className="flex justify-between items-center mb-4 pb-4 border-b border-zinc-800">
                <h2 className="text-sm font-black uppercase text-zinc-500 tracking-widest flex gap-2 items-center">
                  <Fingerprint size={16} className="text-sky-500"/> OCR ({airtableRecords.length})
                </h2>
                <button 
                  onClick={scanAll} 
                  disabled={isScanningAll || airtableRecords.length === 0} 
                  className="text-[10px] font-bold bg-sky-600/20 text-sky-400 hover:bg-sky-600/40 border border-sky-500/30 px-3 py-1.5 rounded-lg flex gap-2 items-center transition-all disabled:opacity-30"
                >
                  {isScanningAll ? <Loader2 className="animate-spin" size={12}/> : <Scan size={12}/>} 
                  {isScanningAll ? "..." : "LEER"}
                </button>
              </div>
              
              <div className="flex-1 overflow-y-auto pr-2 space-y-3 custom-scrollbar">
                {airtableRecords.length === 0 && (
                  <div className="h-full flex flex-col items-center justify-center text-zinc-700 gap-3 opacity-60">
                    <Database size={40} strokeWidth={1.5}/>
                    <p className="text-xs font-bold uppercase tracking-widest">Sin datos</p>
                  </div>
                )}
                {airtableRecords.map(r => (
                  <div key={r.id} className={`p-3 rounded-xl border transition-all group ${
                    r.statusIA === 'listo' ? 'bg-sky-950/30 border-sky-500/30' : 
                    r.statusIA === 'error' ? 'bg-rose-950/20 border-rose-500/30' : 
                    'bg-zinc-800/30 border-zinc-800 hover:border-zinc-700'
                  }`}>
                    <div className="flex justify-between items-start gap-2">
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-bold text-white truncate group-hover:text-sky-300 transition-colors">{r.nombre}</p>
                        <div className="flex flex-wrap items-center gap-1 mt-1">
                           <span className="text-[9px] text-zinc-500 font-mono">{r.cedula}</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-1 shrink-0">
                         {r.fotoUrl && (
                          <button onClick={() => setSelectedImage(r.fotoUrl)} className="p-1.5 bg-zinc-800/50 rounded-md hover:bg-sky-500/20 text-zinc-400 hover:text-sky-300 transition-all">
                            <Eye size={14}/>
                          </button>
                        )}
                        <button onClick={() => scanReceiptIA(r)} disabled={scanningId === r.id} className="p-1.5 bg-zinc-800/50 rounded-md hover:bg-sky-500/20 text-zinc-400 hover:text-sky-300 transition-all disabled:opacity-50">
                          {scanningId === r.id ? <Loader2 size={14} className="animate-spin text-sky-400"/> : <Scan size={14}/>}
                        </button>
                      </div>
                    </div>

                    {r.docExtraido && (
                      <div className="mt-2 pt-2 border-t border-zinc-800/50 flex items-center justify-between text-[10px] font-mono">
                        <div className="flex items-center gap-1 text-sky-400 font-bold truncate"><Hash size={10}/> {r.docExtraido}</div>
                        <div className="text-emerald-400 font-bold">${r.montoExtraido?.toFixed(2)}</div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* COLUMNA DERECHA: MATCHER (9 cols) */}
          <div className="lg:col-span-9 flex flex-col gap-6 h-auto lg:h-[calc(100vh-180px)]">
            
            {/* ÁREA DE INPUT */}
            <div className="bg-zinc-900 border border-zinc-800 p-4 rounded-3xl shadow-xl flex flex-col md:flex-row gap-4 shrink-0">
              <div className="flex-1">
                <div className="relative">
                  <textarea 
                    className="w-full h-24 p-4 bg-zinc-950/50 border-2 border-zinc-800 rounded-2xl text-sm font-mono text-zinc-300 resize-none focus:border-sky-500 focus:ring-4 focus:ring-sky-500/10 outline-none transition-all placeholder:text-zinc-600" 
                    placeholder="Pega aquí el texto del banco..." 
                    value={bankData} 
                    onChange={(e) => setBankData(e.target.value)}
                  />
                  <div className="absolute bottom-4 right-4 text-zinc-600 pointer-events-none"><Wallet size={16}/></div>
                </div>
              </div>
              <button 
                onClick={processMatches} 
                className="w-full md:w-40 bg-gradient-to-br from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white rounded-2xl border-0 flex flex-col items-center justify-center gap-1 transition-all active:scale-95 group shadow-lg shadow-sky-500/25 py-4 md:py-0"
              >
                <ArrowRight size={24} className="group-hover:translate-x-1 transition-transform"/>
                <span className="text-[10px] font-black uppercase text-center leading-tight tracking-wider">EJECUTAR<br/>CRUCE</span>
              </button>
            </div>

            {/* ÁREA DE RESULTADOS */}
            <div className="bg-zinc-900/80 border border-zinc-800 p-4 md:p-6 rounded-3xl flex-1 overflow-y-auto custom-scrollbar relative shadow-inner backdrop-blur-md">
              <h2 className="text-sm font-black uppercase text-zinc-500 mb-6 sticky top-0 bg-zinc-900/95 py-3 z-10 flex gap-2 items-center border-b border-zinc-800">
                <Search size={18} className="text-sky-500"/> Resultados del Cruce
              </h2>
              
              <div className="grid gap-6 pb-6">
                {matches.length === 0 && (
                  <div className="text-center py-20 text-zinc-600 flex flex-col items-center gap-4 opacity-50">
                    <div className="p-6 bg-zinc-800/50 rounded-full"><Search size={40} strokeWidth={1.5}/></div>
                    <p className="text-sm uppercase font-bold tracking-widest">Esperando datos para procesar...</p>
                  </div>
                )}
                
                {matches.map((m, i) => (
                  <div key={i} className={`rounded-2xl border-2 transition-all relative overflow-hidden shadow-md ${
                    m.status === 'verified' ? 'bg-emerald-950/10 border-emerald-500/30 opacity-70 grayscale-[50%]' :
                    m.status === 'fraud' || m.bank.esDuplicadoBanco ? 'bg-rose-950/20 border-rose-500/50' :
                    m.status === 'found' ? 'bg-zinc-800/50 border-emerald-500/40 shadow-emerald-500/5' : 'bg-zinc-900 border-zinc-800'
                  }`}>
                    
                    {/* --- BANNERS DE ALERTA --- */}
                    <div className="flex flex-col">
                      {m.status === 'fraud' && (
                        <div className="w-full bg-rose-500 text-white p-2 flex items-center justify-center gap-2 animate-pulse font-black uppercase text-xs tracking-widest">
                          <AlertOctagon size={16}/> ¡POSIBLE ESTAFA! Documento ya usado por: {m.claimedBy}
                        </div>
                      )}
                      {m.bank.esDuplicadoBanco && !m.status.includes('fraud') && (
                         <div className="w-full bg-rose-500/80 text-white p-1.5 flex items-center justify-center gap-2 font-bold uppercase text-[10px] tracking-widest">
                          <AlertTriangle size={14}/> Duplicado en esta lista
                        </div>
                      )}
                      {m.record && m.nameMismatch && m.status !== 'fraud' && (
                        <div className="w-full bg-amber-500 text-zinc-900 p-1.5 flex items-center justify-center gap-2 font-black uppercase text-[10px] tracking-widest">
                          <AlertTriangle size={14}/> Nombre no coincide (Posible Pago de Tercero)
                        </div>
                      )}
                      {m.bank.esInterbancaria && (
                        <div className="w-full bg-blue-600 text-white p-1 flex items-center justify-center gap-2 font-bold uppercase text-[9px] tracking-widest">
                          <Info size={12}/> Interbancaria
                        </div>
                      )}
                    </div>

                    <div className="p-4 md:p-5 flex flex-col md:flex-row gap-6 items-stretch">
                      
                      {/* --- COMPARACIÓN LADO A LADO --- */}
                      <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4">
                        
                        {/* DATO BANCO */}
                        <div className="bg-zinc-950/50 p-4 rounded-xl border border-zinc-800 flex flex-col justify-center relative overflow-hidden">
                           <div className="absolute top-0 right-0 p-2 opacity-5"><CreditCard size={64}/></div>
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest bg-zinc-900 px-2 py-1 rounded">BANCO</span>
                          </div>
                          <div className="text-3xl font-black text-white tracking-tighter tabular-nums">{m.bank.documento}</div>
                          <div className="text-2xl font-bold text-emerald-400 tabular-nums mt-0.5">${m.bank.monto.toFixed(2)}</div>
                          <div className="text-[10px] font-mono text-zinc-400 mt-2 uppercase truncate border-t border-zinc-800 pt-2" title={m.bank.depositor}>
                            {m.bank.depositor || 'NO DISPONIBLE'}
                          </div>
                        </div>

                        {/* DATO FOTO / CRM */}
                        <div className={`p-4 rounded-xl border flex flex-col relative overflow-hidden ${m.record ? 'bg-sky-950/10 border-sky-500/20' : 'bg-rose-950/10 border-rose-500/20'}`}>
                           <div className="absolute top-0 right-0 p-2 opacity-5"><ImageIcon size={64}/></div>
                          {m.record ? (
                            <>
                              <div className="flex items-center justify-between gap-2 mb-2">
                                <span className="text-[10px] font-bold text-sky-500 uppercase tracking-widest bg-sky-950/30 px-2 py-1 rounded border border-sky-500/20">FOTO IA</span>
                                {m.record.fotoUrl && (
                                  <button onClick={() => setSelectedImage(m.record!.fotoUrl)} className="text-[9px] bg-zinc-800 px-3 py-1 rounded-full text-zinc-300 hover:text-white border border-zinc-700 hover:border-zinc-500 transition-all uppercase font-bold flex items-center gap-1 z-10">
                                    <Eye size={10}/> Ver
                                  </button>
                                )}
                              </div>
                              
                              <div className="text-2xl font-black text-white tracking-tight tabular-nums truncate">
                                {m.record.docExtraido || '---'}
                              </div>
                               <div className="text-lg font-bold text-sky-400 tabular-nums mb-auto">
                                {m.record.montoExtraido ? `$${m.record.montoExtraido.toFixed(2)}` : '---'}
                              </div>

                              <div className="mt-3 pt-3 border-t border-sky-500/20 relative z-10">
                                <div className="flex justify-between items-end">
                                  <div className="min-w-0">
                                    <div className="text-[9px] text-sky-300/60 uppercase font-black tracking-widest mb-0.5">ATLETA</div>
                                    <div className="text-sm font-black text-white uppercase truncate leading-tight w-full">{m.record.nombre}</div>
                                  </div>
                                </div>
                                <div className="flex flex-wrap gap-2 mt-2 text-[9px] text-zinc-400 font-medium">
                                  <span className="bg-zinc-800 px-2 py-1 rounded border border-zinc-700">{m.record.cedula}</span>
                                  <span className="bg-zinc-800 px-2 py-1 rounded border border-zinc-700">{m.record.edad} Años</span>
                                  <span className="bg-zinc-800 px-2 py-1 rounded border border-zinc-700">{m.record.categoria}</span>
                                </div>
                              </div>
                            </>
                          ) : (
                            <div className="h-full flex flex-col items-center justify-center text-rose-400/60 gap-3">
                              <FileWarning size={32} strokeWidth={1.5}/>
                              <span className="text-[10px] font-black uppercase text-center tracking-widest">Sin Coincidencia</span>
                            </div>
                          )}
                        </div>

                      </div>

                      {/* --- BOTÓN DE ACCIÓN --- */}
                      <div className="w-full md:w-48 shrink-0 flex flex-col justify-center">
                        {m.status === 'verified' ? (
                          <div className="h-full w-full bg-emerald-900/20 rounded-xl border border-emerald-500/30 flex flex-col items-center justify-center gap-2 p-4">
                            <CheckCircle2 size={40} className="text-emerald-500"/>
                            <span className="text-xs font-black uppercase text-emerald-400 tracking-[0.2em]">BLINDADO</span>
                          </div>
                        ) : m.record && m.status !== 'fraud' && !m.bank.esDuplicadoBanco ? (
                          <button 
                            onClick={() => confirmInCRM(m)} 
                            className={`h-full w-full rounded-xl text-xs font-black uppercase shadow-lg active:scale-95 transition-all flex flex-col items-center justify-center gap-2 p-4 ${
                              m.nameMismatch ? 'bg-gradient-to-br from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-white shadow-amber-500/30' : 'bg-gradient-to-br from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white shadow-emerald-500/30'
                            }`}
                          >
                            <ShieldCheck size={28}/>
                            <span className="text-center leading-tight tracking-wider">
                              {m.nameMismatch ? 'APROBAR\nTERCERO' : 'BLINDAR\nY APROBAR'}
                            </span>
                          </button>
                        ) : (
                          <div className="h-full w-full bg-zinc-800/50 rounded-xl text-[10px] font-bold text-zinc-500 uppercase flex items-center justify-center text-center border border-zinc-800 p-4 tracking-wider">
                            Requiere<br/>Revisión Manual
                          </div>
                        )}
                      </div>

                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* --- MODALES Y TOASTS --- */}
      {selectedImage && (
        <div className="fixed inset-0 bg-zinc-950/95 z-[100] flex flex-col items-center justify-center p-4 backdrop-blur-sm animate-in fade-in duration-200" onClick={() => setSelectedImage(null)}>
          <img src={selectedImage} className="max-w-full max-h-[85vh] rounded-2xl shadow-2xl border border-zinc-800 animate-in zoom-in-95 duration-200" />
          <button className="mt-6 flex items-center gap-2 px-6 py-3 bg-zinc-800 hover:bg-zinc-700 rounded-full text-white text-xs font-bold uppercase tracking-widest transition-all">
            <XCircle size={16}/> Cerrar Vista Previa
          </button>
        </div>
      )}
      
      {isConfigOpen && (
        <div className="fixed inset-0 bg-zinc-950/80 z-[110] flex items-center justify-center p-4 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-zinc-900 p-8 rounded-3xl border border-zinc-800 w-full max-w-md shadow-2xl relative animate-in slide-in-from-bottom-4 duration-200">
            <button onClick={() => setIsConfigOpen(false)} className="absolute top-4 right-4 text-zinc-500 hover:text-white"><XCircle size={24}/></button>
            <div className="text-center mb-8">
                <div className="bg-zinc-800 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-inner"><Settings2 size={32} className="text-sky-500"/></div>
                <h2 className="text-xl font-black text-white uppercase tracking-widest">Configuración API</h2>
            </div>
            <form onSubmit={saveConfig} className="space-y-6">
              <div>
                <label className="text-[10px] font-bold text-zinc-400 uppercase mb-2 block ml-1">Personal Access Token (PAT)</label>
                <div className="relative">
                    <Lock size={16} className="absolute top-1/2 left-4 -translate-y-1/2 text-zinc-500"/>
                    <input type="password" className="w-full p-4 pl-12 bg-zinc-950 border-2 border-zinc-800 rounded-xl text-white focus:border-sky-500 focus:ring-4 focus:ring-sky-500/10 outline-none transition-all font-mono text-sm" value={config.apiKey} onChange={e => setConfig({...config, apiKey: e.target.value})} placeholder="pat..." required/>
                </div>
              </div>
              <button className="w-full py-4 bg-sky-500 hover:bg-sky-400 text-white font-black rounded-xl transition-all uppercase text-sm tracking-widest shadow-lg shadow-sky-500/20 active:scale-95">GUARDAR CREDENCIALES</button>
            </form>
          </div>
        </div>
      )}

      {status.message && (
        <div className={`fixed bottom-6 md:bottom-8 right-4 md:right-8 px-6 py-4 rounded-2xl shadow-2xl font-bold flex items-center gap-4 z-[120] animate-in slide-in-from-right duration-300 border-l-4 backdrop-blur-md ${status.type === 'success' ? 'bg-emerald-500/90 text-white border-emerald-300' : 'bg-rose-500/90 text-white border-rose-300'}`}>
          <div className={`p-2 rounded-full ${status.type === 'success' ? 'bg-emerald-400/30' : 'bg-rose-400/30'}`}>
            {status.type === 'success' ? <CheckCircle2 size={20}/> : <AlertTriangle size={20}/>}
          </div>
          <span className="text-xs uppercase tracking-wide">{status.message}</span>
        </div>
      )}
    </div>
  );
}