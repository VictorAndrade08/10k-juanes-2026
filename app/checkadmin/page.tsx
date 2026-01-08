"use client";

import React, { useState, useEffect } from 'react';
import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getAuth, onAuthStateChanged, signInAnonymously, Auth, User as FirebaseUser } from 'firebase/auth';
import { getFirestore, collection, doc, setDoc, onSnapshot, getDoc, Firestore } from 'firebase/firestore';

import {
  ShieldCheck, RefreshCw, CheckCircle2, CheckCircle, AlertCircle, Search, ArrowRight,
  Scan, FileText, Loader2, Eye, Settings2, AlertTriangle, Lock, History, ShieldAlert,
  Fingerprint, Zap, Info, CreditCard, Share2, XCircle, AlertOctagon, Hash, Calendar,
  Maximize2, Database, Image as ImageIcon, User, Wallet, FileWarning, Unlock, LogOut,
  Users, Accessibility, LayoutDashboard
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
const ACCESS_PIN = "1026"; 
const PRICE_FULL = 30.00;
const PRICE_DISCOUNT = 20.00;

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
  edad: number;
  categoria: string;
  tieneDiscapacidad: boolean;
  esTerceraEdad: boolean;
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
  status: 'found' | 'missing' | 'fraud' | 'verified' | 'reused';
  matchType: 'documento' | 'nombre';
  claimedBy?: string;
  nameMismatch: boolean;
  isFamily: boolean;
  isGroupPayment: boolean;
  paymentStatus: 'correct' | 'underpaid' | 'overpaid';
  estimatedPeople: number;
}

export default function BunkerPage() {
  const [isLocked, setIsLocked] = useState(true);
  const [pinInput, setPinInput] = useState("");
  const [pinError, setPinError] = useState(false);
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

  const handleLock = () => { setIsLocked(true); setPinInput(""); };

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

  const fetchAirtableRecords = async () => {
    if (!config.apiKey) return setIsConfigOpen(true);
    setLoading(true);
    try {
      const url = `https://api.airtable.com/v0/${config.baseId}/${encodeURIComponent(config.tableName)}?filterByFormula=${encodeURIComponent(`{Etapa}='${config.filterStage}'`)}`;
      const response = await fetch(url, { headers: { Authorization: `Bearer ${config.apiKey}` } });
      const data = await response.json();
      if (data.records) {
        setAirtableRecords(data.records.map((r: any) => {
          const edad = r.fields['edad'] || 0;
          const discapacidad = r.fields['Discapacidad'] === true; 
          const terceraEdad = edad >= 65;
          const precio = (discapacidad || terceraEdad) ? PRICE_DISCOUNT : PRICE_FULL;

          return {
            id: r.id,
            nombre: r.fields['nombre'] || 'DESCONOCIDO',
            cedula: r.fields['cedula'] || 'S/N',
            edad,
            categoria: r.fields['categorias'] || 'N/A',
            tieneDiscapacidad: discapacidad,
            esTerceraEdad: terceraEdad,
            valorEsperado: precio,
            fotoUrl: r.fields['Comprobante']?.[0]?.url || null,
            docExtraido: null,
            montoExtraido: null,
            statusIA: 'pendiente'
          };
        }));
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

      const prompt = `Analiza este comprobante. Extrae NÚMERO DOCUMENTO y MONTO. JSON: {"documento": "123456", "monto": 30.00}`;
      
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
      let matchType: 'documento' | 'nombre' = 'documento';

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

      // --- LÓGICA DE VALIDACIÓN DE NOMBRES ---
      let nameMismatch = false;
      let isFamily = false;
      if (record && !matchType.includes('nombre')) {
         const crmName = record.nombre.toUpperCase();
         const bankName = bank.depositor.toUpperCase();
         
         if (!crmName.includes(bankName) && !bankName.includes(crmName)) {
            const crmParts = crmName.split(' ').filter(p => p.length > 3);
            const hasCommonName = crmParts.some(part => bankName.includes(part));
            if (hasCommonName) isFamily = true; 
            nameMismatch = true; 
         }
      }

      // --- LÓGICA DE PRECIOS Y GRUPOS ---
      let paymentStatus: 'correct' | 'underpaid' | 'overpaid' = 'correct';
      let isGroupPayment = false;
      let estimatedPeople = 1;

      if (record) {
        if (bank.monto < record.valorEsperado) paymentStatus = 'underpaid'; // Pagó menos
        else if (bank.monto > record.valorEsperado + 5) { // Tolerancia $5
            paymentStatus = 'overpaid'; 
            isGroupPayment = true; 
            estimatedPeople = Math.round(bank.monto / record.valorEsperado);
        }
      } else {
        // Si no hay record, inferimos grupo si es >= 40 (2 seniors)
        if (bank.monto >= 40) {
            isGroupPayment = true;
            estimatedPeople = Math.round(bank.monto / PRICE_DISCOUNT); // Estimación conservadora
        }
      }

      // --- ESTADO FINAL ---
      let status: 'found' | 'missing' | 'fraud' | 'verified' | 'reused' = 'missing';
      
      if (historical) {
        if (isGroupPayment) status = 'reused'; 
        else status = 'fraud';
      } else if (record) {
        status = 'found';
      }

      return {
        bank, record: record || null, status, matchType, claimedBy: historical?.atleta,
        nameMismatch, isFamily, isGroupPayment, paymentStatus, estimatedPeople
      };
    });

    setMatches(newMatches);
    if (newMatches.length > 0) showStatus('success', 'Conciliación ejecutada.');
    else showStatus('error', 'No se encontraron datos.');
  };

  const confirmInCRM = async (match: any) => {
    if (!user || !match.record) return;
    setLoading(true);
    try {
      const { id, nombre } = match.record;
      const { documento, monto } = match.bank;
      const docRef = doc(db!, 'artifacts', appId, 'public', 'data', 'verified_receipts', documento);
      
      const docSnap = await getDoc(docRef);
      if (docSnap.exists() && !match.isGroupPayment) {
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
            'Comentarios': `✅ VALIDADO (${match.isGroupPayment ? 'GRUPO' : 'INDIV'}): Doc ${documento} | $${monto}`
          }
        })
      });

      const firestoreId = match.isGroupPayment ? `${documento}_${id}` : documento;
      await setDoc(doc(db!, 'artifacts', appId, 'public', 'data', 'verified_receipts', firestoreId), { 
        atleta: nombre, fecha: new Date().toISOString(), monto, uid: user.uid, isGroup: match.isGroupPayment
      });
      
      setMatches(prev => prev.map(m => m.record?.id === id ? { ...m, status: 'verified' as const } : m));
      showStatus('success', 'Blindado exitosamente.');
    } catch (e) { showStatus('error', 'Error al guardar.'); } finally { setLoading(false); }
  };

  if (!isMounted) return null;

  if (isLocked) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-4">
        <div className="bg-zinc-900 border-2 border-zinc-800 p-10 rounded-[2.5rem] shadow-2xl w-full max-w-sm text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-sky-500 via-indigo-500 to-purple-500"></div>
          <div className="mb-8 flex justify-center"><div className="bg-zinc-800 p-5 rounded-2xl shadow-lg shadow-sky-500/10 border border-zinc-700"><Lock size={40} className="text-sky-500" strokeWidth={2}/></div></div>
          <h1 className="text-2xl font-black text-white uppercase tracking-tighter mb-2">Búnker 10k</h1>
          <p className="text-zinc-500 text-[10px] font-bold tracking-[0.4em] uppercase mb-8">Acceso Restringido</p>
          <form onSubmit={handleUnlock} className="space-y-6">
            <input type="password" maxLength={4} className={`w-full p-4 bg-zinc-950 border-2 rounded-xl text-center text-3xl text-white font-mono tracking-[1em] focus:outline-none transition-all ${pinError ? 'border-rose-500 animate-pulse' : 'border-zinc-800 focus:border-sky-500'}`} placeholder="••••" value={pinInput} onChange={(e) => setPinInput(e.target.value.replace(/\D/g, ''))} autoFocus />
            <button type="submit" className="w-full py-4 bg-sky-600 hover:bg-sky-500 text-white font-black rounded-xl uppercase tracking-widest text-xs transition-all active:scale-95 shadow-lg flex items-center justify-center gap-2"><Unlock size={14}/> Desbloquear Terminal</button>
          </form>
          {pinError && <p className="mt-4 text-rose-500 text-[10px] font-black uppercase tracking-widest animate-bounce">Código Incorrecto</p>}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 p-3 font-sans text-zinc-200 flex flex-col gap-4 overflow-hidden">
      
      {/* GRID PRINCIPAL SIN HEADER */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-4 h-full">
        
        {/* COLUMNA IZQUIERDA: SCANNER (Compacta - 3 cols) */}
        <div className="lg:col-span-3 flex flex-col gap-3 h-full overflow-hidden">
          <div className="bg-zinc-900 border border-zinc-800 p-3 rounded-2xl flex-1 flex flex-col overflow-hidden relative shadow-2xl">
             <div className="flex justify-between items-center mb-3 pb-3 border-b border-zinc-800">
                <span className="text-[10px] font-black uppercase text-zinc-400 flex gap-2 items-center tracking-widest">
                  <Fingerprint size={14} className="text-sky-500"/> BÚNKER 10K <span className="text-zinc-600">|</span> OCR ({airtableRecords.length})
                </span>
                <button onClick={scanAll} disabled={isScanningAll || airtableRecords.length === 0} className="text-[9px] font-bold bg-sky-600/20 text-sky-400 px-3 py-1 rounded hover:bg-sky-600/40 disabled:opacity-30 flex items-center gap-1">
                  {isScanningAll ? <Loader2 className="animate-spin" size={10}/> : <Scan size={10}/>} {isScanningAll ? "..." : "LEER TODO"}
                </button>
             </div>
             <div className="flex-1 overflow-y-auto pr-1 space-y-2 custom-scrollbar">
                {airtableRecords.length === 0 && <div className="h-full flex items-center justify-center text-zinc-700 opacity-50 flex-col gap-2"><Database size={32}/><span className="text-[10px] font-bold">Sin Datos</span></div>}
                {airtableRecords.map(r => (
                  <div key={r.id} className={`p-2.5 rounded-lg border transition-all ${r.statusIA === 'listo' ? 'bg-sky-950/30 border-sky-500/30' : r.statusIA === 'error' ? 'bg-rose-950/20 border-rose-500/30' : 'bg-zinc-800/30 border-zinc-800'}`}>
                    <div className="flex justify-between items-start">
                      <div className="min-w-0 w-full">
                        <div className="flex justify-between w-full">
                           <p className="text-[11px] font-bold text-white truncate max-w-[120px]">{r.nombre}</p>
                           <div className="flex items-center gap-1">
                             {r.fotoUrl && <button onClick={() => setSelectedImage(r.fotoUrl)} className="text-zinc-400 hover:text-white"><Eye size={12}/></button>}
                             <button onClick={() => scanReceiptIA(r)} disabled={scanningId === r.id} className="text-sky-500 hover:text-white">{scanningId === r.id ? <Loader2 size={12} className="animate-spin"/> : <Scan size={12}/>}</button>
                           </div>
                        </div>
                        <div className="flex gap-2 mt-1 items-center">
                            <span className="text-[9px] text-zinc-500 font-mono">{r.cedula}</span>
                             {(r.esTerceraEdad || r.tieneDiscapacidad) && <span className="text-[8px] bg-blue-600 text-white px-1 rounded flex items-center gap-0.5"><Accessibility size={8}/> DESC</span>}
                        </div>
                      </div>
                    </div>
                    {r.docExtraido && <div className="mt-1 pt-1 border-t border-zinc-800/50 flex justify-between text-[9px] font-mono"><span className="text-sky-400">{r.docExtraido}</span><span className="text-emerald-400">${r.montoExtraido}</span></div>}
                  </div>
                ))}
             </div>
          </div>
        </div>

        {/* COLUMNA DERECHA: MATCHER (Expandida - 9 cols) */}
        <div className="flex-1 flex flex-col gap-3 h-full overflow-hidden lg:col-span-9">
          
          {/* BARRA DE HERRAMIENTAS INTEGRADA */}
          <div className="bg-zinc-900 border border-zinc-800 p-3 rounded-2xl shrink-0 flex gap-3 shadow-lg items-center">
             <div className="flex-1 relative">
                <textarea className="w-full h-12 p-2 pl-3 bg-zinc-950/50 border border-zinc-800 rounded-xl text-xs font-mono text-zinc-300 resize-none focus:border-sky-500 outline-none leading-tight pt-3" placeholder="Pegar movimientos del banco aquí..." value={bankData} onChange={(e) => setBankData(e.target.value)}/>
             </div>
             
             {/* BOTONES DE ACCIÓN */}
             <div className="flex gap-2 h-12">
               <button onClick={processMatches} className="px-4 bg-sky-600 hover:bg-sky-500 text-white rounded-xl text-[10px] font-black uppercase flex flex-col justify-center items-center leading-none gap-1 w-20 shadow-lg active:scale-95 transition-all">
                  <ArrowRight size={16}/> VERIFICAR
               </button>
               
               <div className="w-[1px] bg-zinc-800 h-full mx-1"></div>

               <button onClick={fetchAirtableRecords} disabled={loading} className="px-3 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white rounded-xl text-[10px] font-bold flex flex-col justify-center items-center gap-1 w-16 transition-all">
                  <RefreshCw size={14} className={loading ? "animate-spin" : ""} /> RECARGAR
               </button>
               <button onClick={() => setIsConfigOpen(true)} className="px-3 bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white rounded-xl flex justify-center items-center w-12 transition-all">
                  <Settings2 size={16}/>
               </button>
               <button onClick={handleLock} className="px-3 bg-rose-950/30 hover:bg-rose-900/50 text-rose-500 rounded-xl flex justify-center items-center w-12 transition-all">
                  <LogOut size={16}/>
               </button>
             </div>
          </div>

          <div className="bg-zinc-900/80 border border-zinc-800 p-4 rounded-2xl flex-1 overflow-y-auto custom-scrollbar relative shadow-inner">
             <div className="grid gap-3 pb-4">
                {matches.length === 0 && <div className="text-center py-32 text-zinc-700 flex flex-col items-center gap-4 opacity-50"><LayoutDashboard size={64} strokeWidth={1}/></div>}
                {matches.map((m, i) => (
                  <div key={i} className={`rounded-xl border-2 transition-all relative overflow-hidden shadow-lg ${m.status === 'verified' ? 'bg-emerald-950/10 border-emerald-500/30 opacity-60' : m.status === 'fraud' ? 'bg-rose-950/20 border-rose-500/50' : 'bg-zinc-900 border-zinc-800'}`}>
                    {/* ALERTA STRIPS */}
                    <div className="flex flex-col">
                        {m.status === 'fraud' && <div className="w-full bg-rose-500 text-white p-1 flex justify-center gap-2 font-black text-[10px] tracking-widest"><AlertOctagon size={12}/> ¡ESTAFA! USADO POR: {m.claimedBy}</div>}
                        
                        {(m.isGroupPayment || m.status === 'reused') && (
                             <div className="w-full bg-violet-600 text-white p-1 flex justify-center gap-2 font-black text-[10px] tracking-widest shadow-lg">
                                <Users size={12}/> GRUPO DETECTADO (~{m.estimatedPeople} CUPOS) {m.status === 'reused' ? '- DOC REUTILIZADO (OK)' : ''}
                             </div>
                        )}

                        {m.paymentStatus === 'underpaid' && <div className="w-full bg-rose-600 text-white p-1 flex justify-center gap-2 font-black text-[10px] tracking-widest"><AlertTriangle size={12}/> PAGO INCOMPLETO (FALTAN ${(m.record?.valorEsperado || 30) - m.bank.monto})</div>}
                        
                        {m.bank.esDuplicadoBanco && !m.status.includes('fraud') && !m.isGroupPayment && <div className="w-full bg-rose-500/80 text-white p-1 flex justify-center gap-2 font-bold uppercase text-[10px] tracking-widest"><AlertTriangle size={12}/> Duplicado en lista</div>}
                        
                        {m.record && m.nameMismatch && m.status !== 'fraud' && (
                            <div className={`w-full p-1 flex justify-center gap-2 font-black text-[10px] tracking-widest ${m.isFamily ? 'bg-blue-600 text-white' : 'bg-amber-500 text-zinc-900'}`}>
                                {m.isFamily ? <Users size={12}/> : <AlertTriangle size={12}/>} 
                                {m.isFamily ? 'FAMILIAR DETECTADO (APELLIDO OK)' : 'NOMBRE NO COINCIDE (TERCERO)'}
                            </div>
                        )}
                        
                        {m.bank.esInterbancaria && <div className="w-full bg-sky-600/50 text-white p-0.5 flex justify-center gap-2 font-bold uppercase text-[9px] tracking-widest"><Info size={10}/> Interbancaria</div>}
                    </div>

                    <div className="p-3 flex flex-col md:flex-row gap-4 items-stretch">
                       {/* BANCO */}
                       <div className="flex-1 bg-zinc-950/50 p-3 rounded-lg border border-zinc-700 flex flex-col justify-center">
                          <div className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest mb-1 flex justify-between">
                             <span>BANCO</span>
                             <span className="font-mono text-zinc-600">{m.bank.documento}</span>
                          </div>
                          <div className="flex justify-between items-end">
                             <div className="text-[10px] font-mono text-zinc-400 uppercase truncate w-32" title={m.bank.depositor}>{m.bank.depositor || 'DESCONOCIDO'}</div>
                             <div className={`text-xl font-bold tabular-nums ${m.isGroupPayment ? 'text-violet-400' : (m.paymentStatus === 'underpaid' ? 'text-rose-400' : 'text-emerald-400')}`}>${m.bank.monto.toFixed(2)}</div>
                          </div>
                       </div>

                       {/* CRM */}
                       <div className={`flex-1 p-3 rounded-lg border flex flex-col justify-center ${m.record ? 'bg-sky-950/10 border-sky-500/20' : 'bg-rose-950/10 border-rose-500/20'}`}>
                          {m.record ? (
                            <>
                               <div className="flex justify-between mb-1 items-center">
                                  <span className="text-[9px] font-bold text-sky-500 uppercase tracking-widest">FOTO / CRM</span>
                                  {m.record.fotoUrl && <button onClick={() => setSelectedImage(m.record!.fotoUrl)} className="text-[8px] bg-zinc-800 px-2 py-0.5 rounded text-zinc-300 hover:text-white border border-zinc-700">VER</button>}
                               </div>
                               <div className="flex justify-between items-end">
                                  <div className="min-w-0">
                                     <div className="text-[11px] font-black text-white uppercase truncate w-32">{m.record.nombre}</div>
                                     <div className="text-[9px] text-zinc-500 font-mono">{m.record.cedula}</div>
                                  </div>
                                  <div className="text-right">
                                     <div className="text-[10px] font-mono text-sky-400">{m.record.docExtraido || '---'}</div>
                                  </div>
                               </div>
                            </>
                          ) : <div className="text-center text-rose-400/50 flex items-center justify-center gap-2"><FileWarning size={16}/><span className="text-[10px] font-bold">SIN DATOS</span></div>}
                       </div>

                       {/* ACCION */}
                       <div className="w-full md:w-32 shrink-0 flex flex-col justify-center">
                          {m.status === 'verified' ? (
                             <div className="text-center text-emerald-500"><CheckCircle2 size={24} className="mx-auto"/><span className="text-[9px] font-black tracking-widest">LISTO</span></div>
                          ) : m.record && (m.status !== 'fraud' || m.isGroupPayment) && !m.bank.esDuplicadoBanco && m.paymentStatus !== 'underpaid' ? (
                             <button onClick={() => confirmInCRM(m)} className={`h-full w-full rounded-lg text-[9px] font-black uppercase shadow-lg active:scale-95 transition-all flex flex-col items-center justify-center gap-1 p-2 ${m.isGroupPayment ? 'bg-violet-600 hover:bg-violet-500 text-white' : m.nameMismatch ? 'bg-amber-500 hover:bg-amber-400 text-zinc-900' : 'bg-emerald-500 hover:bg-emerald-400 text-zinc-900'}`}>
                                <ShieldCheck size={18}/>
                                <span className="text-center leading-tight">{m.isGroupPayment ? 'APROBAR\nGRUPO' : m.nameMismatch ? 'APROBAR\nTERCERO' : 'BLINDAR'}</span>
                             </button>
                          ) : <div className="h-full w-full bg-zinc-800/50 rounded-lg text-[9px] font-bold text-zinc-500 flex items-center justify-center text-center border border-zinc-800">MANUAL</div>}
                       </div>
                    </div>
                  </div>
                ))}
             </div>
          </div>
        </div>
      </div>

      {selectedImage && <div className="fixed inset-0 bg-zinc-950/95 z-[100] flex flex-col items-center justify-center p-4 backdrop-blur-sm animate-in fade-in" onClick={() => setSelectedImage(null)}><img src={selectedImage} className="max-w-full max-h-[85vh] rounded-2xl shadow-2xl border-4 border-zinc-800"/><p className="mt-6 text-slate-400 text-xs font-mono uppercase tracking-[0.2em]">[Click cerrar]</p></div>}
      
      {isConfigOpen && <div className="fixed inset-0 bg-zinc-950/80 z-[110] flex items-center justify-center p-4 backdrop-blur-md"><div className="bg-zinc-900 p-8 rounded-3xl border border-zinc-800 w-full max-w-md shadow-2xl relative"><button onClick={() => setIsConfigOpen(false)} className="absolute top-4 right-4 text-zinc-500 hover:text-white"><XCircle size={24}/></button><h2 className="text-xl font-black text-center text-white uppercase tracking-widest mb-8">Configuración API</h2><form onSubmit={saveConfig} className="space-y-6"><input type="password" className="w-full p-4 bg-zinc-950 border-2 border-zinc-800 rounded-xl text-center text-white focus:border-sky-500 outline-none" value={config.apiKey} onChange={e => setConfig({...config, apiKey: e.target.value})} placeholder="pat..." required/><button className="w-full py-4 bg-sky-500 hover:bg-sky-400 text-white font-black rounded-xl uppercase tracking-widest shadow-lg">GUARDAR</button></form></div></div>}

      {status.message && <div className={`fixed bottom-8 right-8 px-6 py-4 rounded-2xl shadow-2xl font-bold flex items-center gap-4 z-[120] border-l-4 ${status.type === 'success' ? 'bg-emerald-500/90 text-white border-emerald-300' : 'bg-rose-500/90 text-white border-rose-300'}`}>{status.type === 'success' ? <CheckCircle2 size={20}/> : <AlertTriangle size={20}/>}<span className="text-xs uppercase tracking-wide">{status.message}</span></div>}
    </div>
  );
}