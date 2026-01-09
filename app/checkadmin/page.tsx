"use client";

import React, { useState, useEffect } from 'react';
import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getAuth, onAuthStateChanged, signInAnonymously, signInWithCustomToken, Auth, User as FirebaseUser } from 'firebase/auth';
import { getFirestore, collection, doc, setDoc, onSnapshot, getDoc, Firestore } from 'firebase/firestore';

import {
  ShieldCheck, RefreshCw, CheckCircle2, AlertCircle, Search, ArrowRight,
  Scan, FileText, Loader2, Eye, Settings2, AlertTriangle, Lock, History, ShieldAlert,
  Fingerprint, Zap, Info, CreditCard, Share2, XCircle, AlertOctagon, Hash, Calendar,
  Maximize2, Database, Image as ImageIcon, User, Wallet, FileWarning, Unlock, LogOut,
  Users, Accessibility, LayoutDashboard, ChevronRight, Check, Landmark, Tag, CheckCircle, File, ThumbsUp
} from 'lucide-react';

// --- CONFIGURACIÓN FIREBASE (HÍBRIDA Y ROBUSTA) ---
let app: FirebaseApp | undefined;
let auth: Auth | undefined;
let db: Firestore | undefined;
// @ts-ignore
let appId = typeof __app_id !== 'undefined' ? __app_id : 'bunker-anti-fraude-10k';

try {
  let config = null;
  // @ts-ignore
  if (typeof __firebase_config !== 'undefined') {
    // @ts-ignore
    config = JSON.parse(__firebase_config);
  } else if (typeof process !== 'undefined' && process.env.NEXT_PUBLIC_FIREBASE_API_KEY) {
    config = {
      apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
      authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
      messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
      appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
    };
  }

  if (config) {
    app = getApps().length === 0 ? initializeApp(config) : getApp();
    auth = getAuth(app);
    db = getFirestore(app);
  }
} catch (error) {
  console.error("🔥 Error Inicializando Firebase:", error);
}

const GEMINI_KEY = typeof process !== 'undefined' ? (process.env.NEXT_PUBLIC_GEMINI_API_KEY || "") : "";
const AIRTABLE_CONFIG_KEY = 'verificador_ruta_3_juanes_config';
const ACCESS_PIN = "1026"; 
const PRICE_FULL = 30.00;
const PRICE_DISCOUNT = 20.00;

// --- TIPOS ---
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
  tipoComprobante: string | null; // Nuevo campo para tipo (FISICO/DIGITAL)
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
  confidenceScore: number; 
}

export default function BunkerPage() {
  const [isLocked, setIsLocked] = useState(true);
  const [pinInput, setPinInput] = useState("");
  const [pinError, setPinError] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [user, setUser] = useState<FirebaseUser | null>(null);
  
  const [config, setConfig] = useState({
    apiKey: (typeof process !== 'undefined' ? process.env.NEXT_PUBLIC_AIRTABLE_API_KEY : '') || '',
    baseId: (typeof process !== 'undefined' ? process.env.NEXT_PUBLIC_AIRTABLE_BASE_ID : '') || 'appA0xfrSZyNTgiLV',
    tableName: (typeof process !== 'undefined' ? process.env.NEXT_PUBLIC_AIRTABLE_TABLE_ID : '') || 'CRM 10k',
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

  // --- INIT ---
  useEffect(() => {
    setIsMounted(true);
    const saved = localStorage.getItem(AIRTABLE_CONFIG_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setConfig(prev => ({ ...prev, ...parsed, apiKey: parsed.apiKey || config.apiKey }));
      } catch (e) {}
    }
  }, []);

  useEffect(() => {
    if (!auth) return;
    const initAuth = async () => {
      try {
        // @ts-ignore
        if (typeof __initial_auth_token !== 'undefined' && __initial_auth_token) {
          // @ts-ignore
          await signInWithCustomToken(auth, __initial_auth_token);
        } else {
          await signInAnonymously(auth);
        }
      } catch (err) {
        console.error("Auth Error:", err);
      }
    };
    initAuth();
    const unsubscribe = onAuthStateChanged(auth, setUser);
    return () => unsubscribe();
  }, [isMounted]);

  useEffect(() => {
    if (!user || !db) return;
    const q = collection(db, 'artifacts', appId, 'public', 'data', 'verified_receipts');
    return onSnapshot(q, (snap) => {
      const docs: any = {};
      snap.forEach(d => { docs[d.id] = d.data(); });
      setHistoricalDocs(docs);
    }, (error) => console.error("Error Seguridad Firestore:", error));
  }, [user]);

  // --- HELPERS ---
  const handleUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    if (pinInput === ACCESS_PIN) { setIsLocked(false); setPinError(false); } 
    else { setPinError(true); setPinInput(""); setTimeout(() => setPinError(false), 2000); }
  };
  const handleLock = () => { setIsLocked(true); setPinInput(""); };
  const showStatus = (type: 'success' | 'error', message: string) => { setStatus({ type, message }); setTimeout(() => setStatus({ type: '', message: '' }), 4000); };
  const saveConfig = (e: React.FormEvent) => { e.preventDefault(); localStorage.setItem(AIRTABLE_CONFIG_KEY, JSON.stringify(config)); setIsConfigOpen(false); showStatus('success', 'Configuración guardada.'); };
  
  const normalizeText = (text: string) => text.toUpperCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^A-Z0-9\s]/g, "").trim();

  // --- LOGICA DE PROCESAMIENTO ---
  const urlToBase64 = async (url: string) => {
    try {
      const response = await fetch(url, { mode: 'cors' }).catch(() => null);
      if (!response || !response.ok) return null;
      const blob = await response.blob();
      return new Promise<{ data: string; mimeType: string } | null>((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve({ data: (reader.result as string).split(',')[1], mimeType: blob.type || "image/jpeg" });
        reader.onerror = () => resolve(null);
        reader.readAsDataURL(blob);
      });
    } catch { return null; }
  };

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
          edad: r.fields['edad'] || 0,
          categoria: r.fields['categorias'] || 'N/A',
          tieneDiscapacidad: r.fields['Discapacidad'] === true,
          esTerceraEdad: (r.fields['edad'] || 0) >= 65,
          valorEsperado: (r.fields['Discapacidad'] === true || (r.fields['edad'] || 0) >= 65) ? PRICE_DISCOUNT : PRICE_FULL,
          fotoUrl: r.fields['Comprobante']?.[0]?.url || null,
          docExtraido: null, 
          montoExtraido: null,
          tipoComprobante: null,
          statusIA: 'pendiente'
        })));
        showStatus('success', `${data.records.length} atletas cargados.`);
      }
    } catch (e) { showStatus('error', 'Error Airtable.'); } finally { setLoading(false); }
  };

  const scanReceiptIA = async (record: Record) => {
    if (!record.fotoUrl) return;
    const apiKeyToUse = GEMINI_KEY || config.apiKey;
    if (!apiKeyToUse || apiKeyToUse.startsWith('pat')) { if (!GEMINI_KEY) return showStatus('error', 'Falta API Gemini'); }

    setAirtableRecords(prev => prev.map(r => r.id === record.id ? { ...r, statusIA: 'escaneando' } : r));
    setScanningId(record.id);

    try {
      const imageData = await urlToBase64(record.fotoUrl);
      if (!imageData) throw new Error("CORS");
      
      const prompt = `Analiza este comprobante.
      1. Extrae el NÚMERO DE DOCUMENTO (secuencial, referencia).
      2. Extrae el MONTO.
      3. Detecta si es "FISICO" (foto de papel, papeleta ventanilla, manuscrito) o "DIGITAL" (captura web/app).
      Responde estrictamente con este JSON: {"documento": "123456", "monto": 30.00, "tipo": "FISICO"}`;

      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${GEMINI_KEY}`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents: [{ parts: [{ text: prompt }, { inlineData: { mimeType: imageData.mimeType, data: imageData.data } }] }] })
      });
      const result = await response.json();
      const text = result.candidates?.[0]?.content?.parts?.[0]?.text.replace(/```json/g, '').replace(/```/g, '').trim();
      const json = JSON.parse(text || "{}");
      const docId = json.documento ? String(json.documento).replace(/\D/g, '') : null;
      
      setAirtableRecords(prev => prev.map(r => r.id === record.id ? { 
          ...r, 
          docExtraido: docId, 
          montoExtraido: json.monto, 
          tipoComprobante: json.tipo || 'DIGITAL', // Guardamos el tipo
          statusIA: docId ? 'listo' : 'error' 
      } : r));
    } catch (e) { setAirtableRecords(prev => prev.map(r => r.id === record.id ? { ...r, statusIA: 'error' } : r)); } finally { setScanningId(null); }
  };

  const scanAll = async () => {
    setIsScanningAll(true);
    const pendings = airtableRecords.filter(r => r.fotoUrl && r.statusIA === 'pendiente');
    for (const r of pendings) { await scanReceiptIA(r); await new Promise(x => setTimeout(x, 500)); }
    setIsScanningAll(false); showStatus('success', 'Escaneo completo.');
  };

  const processMatches = () => {
    if (!bankData.trim()) return showStatus('error', 'Faltan datos del banco.');

    const regex = /(\d{2}[\/\-]\d{2}[\/\-]\d{4})\s+(\d{4,20})\s+([A-Z0-9\s]+)/g;
    let match;
    const bankEntries = [];
    const seen = new Set();
    const normalizedData = bankData.replace(/\r\n/g, '\n');

    while ((match = regex.exec(normalizedData)) !== null) {
      const docNum = match[2];
      seen.add(docNum);
      const lineEnd = normalizedData.indexOf('\n', match.index);
      const lineStart = normalizedData.lastIndexOf('\n', match.index);
      const fullLine = normalizedData.substring(lineStart + 1, lineEnd !== -1 ? lineEnd : undefined);
      
      let depositor = fullLine.replace(/TRANSFERENC.*?DE\s+|DEP\s+CNB\s+|CONST\.\s+RECAUDACION\s+/i, '').replace(/[\d\/]/g, '').trim();
      const amountMatch = fullLine.match(/(\d{1,4}[.,]\d{2})(?!\d)/);
      let monto = 0; if (amountMatch) monto = parseFloat(amountMatch[0].replace(',', '.'));

      // Detección mejorada de Interbancarias
      const esInterbancaria = /INTERB|SPI|OTROS BANCOS|TRANSF\.|BCE|EN LINEA|ONLINE|TRANSFERENCIA/i.test(fullLine);

      if (monto > 0) bankEntries.push({ documento: docNum, monto, depositor, esInterbancaria, esDuplicadoBanco: false });
    }

    const assignedIds = new Set();
    
    const newMatches = bankEntries.map(bank => {
      // 1. MATCH DOCUMENTO
      let record = airtableRecords.find(r => r.docExtraido === bank.documento);
      let matchType: 'documento' | 'nombre' = 'documento';

      // 2. MATCH NOMBRE
      if (!record) {
         record = airtableRecords.find(r => {
            if (assignedIds.has(r.id)) return false;
            const bankNameParts = normalizeText(bank.depositor).split(/\s+/).filter(p => p.length > 2);
            if (bankNameParts.length === 0) return false;
            
            const crmNameNorm = normalizeText(r.nombre);
            const matches = bankNameParts.filter(p => crmNameNorm.includes(p));
            
            if (bank.esInterbancaria) {
                return matches.length >= 1; 
            } else {
                return matches.length >= 2 || (matches.length >= 1 && bankNameParts.length <= 2);
            }
         });
         if (record) matchType = 'nombre';
      }

      if (record) assignedIds.add(record.id);
      const historical = historicalDocs[bank.documento];

      let nameMismatch = false;
      let isFamily = false;
      let confidence = 0;

      if (record) {
         const crmName = normalizeText(record.nombre);
         const bankName = normalizeText(bank.depositor);
         const crmParts = crmName.split(/\s+/).filter(p => p.length > 2);
         const bankParts = bankName.split(/\s+/).filter(p => p.length > 2);
         const matchingWords = crmParts.filter(part => bankParts.some(b => b === part || b.includes(part) || part.includes(b)));
         const matchCount = matchingWords.length;

         const isPhysical = record.tipoComprobante === 'FISICO';

         if (matchType === 'documento') {
             // REGLA: Si documento coincide + 1 apellido = 100% MATCH
             if (matchCount >= 1) {
                 nameMismatch = false; 
                 confidence = 100;
             } 
             // REGLA FÍSICO: Si es papel, confiamos en el número aunque el nombre no cuadre (ej: "DEPOSITO")
             else if (isPhysical) {
                 nameMismatch = false; 
                 confidence = 100;
             }
             else {
                 nameMismatch = true; 
                 confidence = 20;
             }
         } else {
             // REGLA: Interbancaria con 1 apellido = 100% MATCH
             if (matchCount >= 2) {
                 nameMismatch = false; 
                 confidence = 100;
             } else if (matchCount === 1 && bank.esInterbancaria) {
                 nameMismatch = false; 
                 confidence = 100;
             } else {
                 nameMismatch = true; 
                 confidence = 20;
             }
         }
      }

      let paymentStatus: 'correct' | 'underpaid' | 'overpaid' = 'correct';
      let isGroupPayment = false;
      let estimatedPeople = 1;

      if (record) {
        if (bank.monto < record.valorEsperado - 0.5) paymentStatus = 'underpaid';
        else if (bank.monto >= record.valorEsperado * 1.8) { 
            paymentStatus = 'overpaid'; isGroupPayment = true; estimatedPeople = Math.round(bank.monto / record.valorEsperado);
        }
      } else if (bank.monto >= 40) { isGroupPayment = true; estimatedPeople = Math.round(bank.monto / PRICE_DISCOUNT); }

      let status: 'found' | 'missing' | 'fraud' | 'verified' | 'reused' = 'missing';
      if (historical) { status = isGroupPayment ? 'reused' : 'fraud'; } 
      else if (record) { status = 'found'; }

      return {
        bank, record: record || null, status, matchType, claimedBy: historical?.atleta,
        nameMismatch, isFamily, isGroupPayment, paymentStatus, estimatedPeople, confidenceScore: confidence
      };
    });

    setMatches(newMatches);
    if (newMatches.length > 0) showStatus('success', `Procesadas ${newMatches.length} filas.`);
    else showStatus('error', 'Sin datos.');
  };

  const confirmInCRM = async (match: any) => {
    if (!user || !match.record || !db) return;
    setLoading(true);
    try {
      const { id, nombre } = match.record;
      const { documento, monto } = match.bank;
      
      const docRef = doc(db, 'artifacts', appId, 'public', 'data', 'verified_receipts', documento);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists() && !match.isGroupPayment) { showStatus('error', 'FRAUDE: Doc usado.'); setLoading(false); return; }

      // LABEL AUTOMÁTICO
      const tipoLabel = match.record.tipoComprobante === 'FISICO' ? '(PAPEL FÍSICO)' : '';

      await fetch(`https://api.airtable.com/v0/${config.baseId}/${encodeURIComponent(config.tableName)}/${id}`, {
        method: 'PATCH', headers: { Authorization: `Bearer ${config.apiKey}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ fields: { 
            'Etapa': 'Inscrito', 
            'Numero Comprobante': documento, 
            'Comentarios': `✅ VALIDADO [${new Date().toLocaleDateString()}] ${tipoLabel} - ${match.isGroupPayment ? 'GRUPO' : 'INDIV'}: Doc ${documento} | $${monto}` 
        } })
      });

      const firestoreId = match.isGroupPayment ? `${documento}_${id}` : documento;
      await setDoc(doc(db, 'artifacts', appId, 'public', 'data', 'verified_receipts', firestoreId), { atleta: nombre, fecha: new Date().toISOString(), monto, uid: user.uid, isGroup: match.isGroupPayment });
      
      setMatches(prev => prev.map(m => m.record?.id === id ? { ...m, status: 'verified' as const } : m));
      showStatus('success', 'Validado.');
    } catch (e) { console.error(e); showStatus('error', 'Error al guardar.'); } finally { setLoading(false); }
  };

  if (!isMounted) return null;
  if (isLocked) return <LockScreen pin={pinInput} setPin={setPinInput} error={pinError} unlock={handleUnlock} />;

  return (
    <div className="fixed inset-0 z-[100] bg-zinc-950 text-zinc-200 flex flex-col font-sans overflow-hidden">
      <style>{`header,footer,nav{display:none!important}main{padding-top:0!important}body{overflow:hidden!important;background:#09090b}`}</style>
      
      {/* HEADER */}
      <div className="h-16 border-b border-zinc-800 bg-zinc-900/50 backdrop-blur-xl flex justify-between items-center px-6 shrink-0 z-20">
          <div className="flex items-center gap-3">
             <div className="bg-sky-500/10 p-2 rounded-lg border border-sky-500/20"><ShieldCheck size={20} className="text-sky-400"/></div>
             <div>
                <h1 className="text-sm font-black uppercase tracking-widest text-white leading-none">Búnker 10k</h1>
                <span className="text-[10px] font-medium text-zinc-500 tracking-wider">SISTEMA ANTI-FRAUDE v2.0</span>
             </div>
          </div>
          <div className="flex gap-2">
             <HeaderBtn onClick={fetchAirtableRecords} icon={RefreshCw} label={loading ? "CARGANDO..." : "RECARGAR"} spin={loading} />
             <HeaderBtn onClick={() => setIsConfigOpen(true)} icon={Settings2} />
             <HeaderBtn onClick={handleLock} icon={LogOut} variant="danger" />
          </div>
      </div>

      <div className="flex-1 flex gap-0 h-full min-h-0 relative">
        
        {/* SIDEBAR OCR */}
        <div className="w-[300px] border-r border-zinc-800 flex flex-col bg-zinc-900/30 hidden lg:flex backdrop-blur-sm">
           <div className="p-3 border-b border-zinc-800 flex justify-between items-center bg-zinc-900/50">
              <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider flex items-center gap-2"><Users size={14}/> ATLETAS ({airtableRecords.length})</span>
              <button onClick={scanAll} disabled={isScanningAll || airtableRecords.length === 0} className="text-[10px] px-2 py-1 rounded bg-sky-900/20 text-sky-400 border border-sky-800/30 hover:bg-sky-900/40 transition-all flex items-center gap-1 font-bold">{isScanningAll ? <Loader2 className="animate-spin" size={12}/> : <Scan size={12}/>} ESCANEAR</button>
           </div>
           
           <div className="flex-1 overflow-y-auto custom-scrollbar p-2 space-y-1">
              {airtableRecords.map(r => (
                <div key={r.id} className={`group p-2.5 rounded-lg border transition-all text-xs flex flex-col gap-1.5 relative overflow-hidden ${r.statusIA === 'listo' ? 'bg-sky-950/10 border-sky-500/30' : 'bg-zinc-900/40 border-zinc-800/60 hover:border-zinc-700'}`}>
                   {r.statusIA === 'listo' && <div className="absolute top-0 right-0 w-16 h-16 bg-sky-500/5 rounded-bl-full -mr-8 -mt-8 pointer-events-none"></div>}
                   <div className="flex justify-between items-start">
                      <div>
                        <span className="font-bold text-zinc-200 block text-[11px] mb-0.5">{r.nombre}</span>
                        <span className="text-[10px] text-zinc-500 font-mono flex items-center gap-1"><Hash size={10}/> {r.cedula}</span>
                      </div>
                      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        {r.fotoUrl && <button onClick={() => setSelectedImage(r.fotoUrl)} className="p-1.5 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white"><Eye size={12}/></button>}
                        <button onClick={() => scanReceiptIA(r)} disabled={scanningId === r.id} className="p-1.5 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-sky-400">{scanningId === r.id ? <Loader2 size={12} className="animate-spin"/> : <Scan size={12}/>}</button>
                      </div>
                   </div>
                   {r.docExtraido && (
                       <div className="mt-1 pt-1 border-t border-zinc-800/50 flex justify-between items-center">
                          <span className="text-[9px] text-zinc-500 uppercase font-bold">DETECTADO</span>
                          <span className="text-[10px] font-mono font-bold text-emerald-400 bg-emerald-950/30 px-1.5 rounded flex items-center gap-1">
                              {r.tipoComprobante === 'FISICO' && <File size={10} className="text-amber-400"/>}
                              {r.docExtraido}
                          </span>
                       </div>
                   )}
                </div>
              ))}
           </div>
        </div>

        {/* WORKSPACE */}
        <div className="flex-1 flex flex-col bg-zinc-950 relative">
           {/* INPUT */}
           <div className="p-4 border-b border-zinc-800 bg-zinc-900/20 flex gap-4 h-24 items-center shrink-0 z-10">
              <div className="flex-1 h-full relative group">
                  <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-zinc-600"><FileText size={16}/></div>
                  <textarea className="w-full h-full bg-zinc-950 border border-zinc-800 rounded-xl pl-10 p-3 text-xs font-mono text-zinc-300 resize-none focus:border-sky-500/50 focus:ring-1 focus:ring-sky-900/50 outline-none leading-tight transition-all shadow-inner" placeholder="Pega aquí el reporte del banco..." value={bankData} onChange={(e) => setBankData(e.target.value)}/>
              </div>
              <button onClick={processMatches} className="h-full px-8 bg-gradient-to-br from-sky-600 to-indigo-600 hover:from-sky-500 hover:to-indigo-500 text-white font-black text-xs rounded-xl uppercase tracking-wider flex flex-col justify-center items-center gap-1 shadow-xl shadow-indigo-900/20 active:scale-95 transition-all border border-sky-500/20"><ArrowRight size={18}/> <span className="text-[10px] opacity-80">EJECUTAR</span></button>
           </div>

           {/* RESULTS */}
           <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-3 bg-zinc-950">
              {matches.length === 0 && <div className="h-full flex flex-col items-center justify-center text-zinc-800 gap-4"><LayoutDashboard size={64} strokeWidth={0.5} className="opacity-20"/><span className="text-xs font-bold uppercase tracking-widest opacity-40">Esperando datos para procesar...</span></div>}
              
              {matches.map((m, i) => (
                <div key={i} className={`flex items-stretch rounded-xl border transition-all text-sm h-auto min-h-[5rem] shadow-lg relative overflow-hidden group ${
                  m.status === 'verified' ? 'bg-zinc-900/30 border-emerald-900/30 opacity-60' : 
                  m.status === 'fraud' ? 'bg-rose-950/10 border-rose-900/40' : 
                  'bg-zinc-900/80 border-zinc-800 hover:border-zinc-700'
                }`}>
                  
                  <div className={`w-1.5 shrink-0 ${
                     m.status === 'verified' ? 'bg-emerald-500' : 
                     m.status === 'fraud' ? 'bg-rose-500' : 
                     m.isGroupPayment ? 'bg-violet-500' : 
                     m.paymentStatus === 'underpaid' ? 'bg-amber-500' : 
                     m.nameMismatch ? 'bg-orange-500' : 
                     m.status === 'found' ? 'bg-sky-500' : 'bg-zinc-700'
                  }`}></div>

                  {/* BANK DATA */}
                  <div className="w-[240px] p-4 border-r border-zinc-800/50 flex flex-col justify-center shrink-0 bg-zinc-900/50">
                     <div className="flex justify-between items-baseline mb-2">
                        <span className="text-[9px] font-black text-zinc-600 uppercase tracking-wider">BANCO</span>
                        <span className={`font-mono font-bold text-sm ${m.paymentStatus === 'underpaid' ? 'text-amber-500' : 'text-emerald-400'}`}>${m.bank.monto.toFixed(2)}</span>
                     </div>
                     <span className="font-mono text-white font-bold tracking-tight text-sm mb-1">{m.bank.documento}</span>
                     <span className="text-[10px] text-zinc-400 truncate font-medium flex items-center gap-1" title={m.bank.depositor}>
                        {m.bank.esInterbancaria && <Landmark size={12} className="text-amber-500"/>}
                        {m.bank.depositor}
                     </span>
                  </div>

                  {/* CRM DATA */}
                  <div className="flex-1 p-4 flex flex-col justify-center relative">
                     {m.record ? (
                        <>
                           <div className="flex justify-between items-start mb-2">
                              <div className="flex flex-col gap-0.5">
                                  <div className="flex items-center gap-2">
                                      <span className="text-[9px] font-black text-sky-700 uppercase tracking-wider">CRM MATCH</span>
                                      {m.confidenceScore >= 90 && <span className="text-[9px] text-emerald-500 font-bold flex items-center gap-0.5 bg-emerald-950/30 px-1.5 rounded-full"><CheckCircle2 size={10}/> 100%</span>}
                                  </div>
                                  <span className="font-bold text-zinc-200 text-sm leading-tight">{m.record.nombre}</span>
                              </div>
                              <div className="flex gap-1.5 items-center">
                                 {(m.record.esTerceraEdad || m.record.tieneDiscapacidad) && <span className="text-[9px] bg-blue-500/10 text-blue-400 px-1.5 py-0.5 rounded border border-blue-500/20 flex items-center gap-1 font-bold"><Accessibility size={10}/> $20</span>}
                                 {m.record.fotoUrl && <button onClick={() => setSelectedImage(m.record!.fotoUrl)} className="text-[9px] bg-zinc-800 px-2 py-0.5 rounded text-zinc-400 border border-zinc-700 hover:text-white hover:border-zinc-500 transition-colors">VER DOC</button>}
                              </div>
                           </div>
                           
                           {/* INFO EXTRA */}
                           <div className="grid grid-cols-2 gap-4 mb-2">
                               <div className="flex items-center gap-2 text-[10px] text-zinc-400">
                                   <Hash size={12}/> <span>{m.record.cedula}</span>
                                   <span className="text-zinc-600">|</span>
                                   <User size={12}/> <span>{m.record.edad} Años</span>
                                   <span className="text-zinc-600">|</span>
                                   <Tag size={12}/> <span>{m.record.categoria}</span>
                               </div>
                               <div className="flex items-center justify-end gap-2">
                                   <span className="text-[9px] font-bold text-sky-600 uppercase">DOC. OCR:</span>
                                   <span className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded flex items-center gap-1 ${m.record.docExtraido ? 'bg-sky-900/20 text-sky-300' : 'text-zinc-600'}`}>
                                       {m.record.tipoComprobante === 'FISICO' && <File size={10} className="text-amber-400"/>}
                                       {m.record.docExtraido || 'NO ESCANEADO'}
                                   </span>
                               </div>
                           </div>

                           <div className="flex gap-2 mt-auto">
                              {m.nameMismatch && !m.status.includes('fraud') && (
                                  <Badge type={m.isFamily ? 'info' : 'warning'}>{m.isFamily ? 'POSIBLE FAMILIAR' : 'NOMBRE DIFERENTE'}</Badge>
                              )}
                              {m.isGroupPayment && <Badge type="purple">PAGO GRUPAL (~{m.estimatedPeople})</Badge>}
                              {!m.nameMismatch && m.matchType === 'documento' && <Badge type="success">DOC + APELLIDOS OK</Badge>}
                              {m.bank.esInterbancaria && <Badge type="warning">INTERBANCARIA</Badge>}
                              {m.record.tipoComprobante === 'FISICO' && <Badge type="info">PAPEL FISICO</Badge>}
                           </div>
                        </>
                     ) : (
                        <div className="flex flex-col items-center justify-center h-full text-zinc-700 gap-1 opacity-50">
                            <FileWarning size={20}/> 
                            <span className="text-[10px] font-bold">SIN COINCIDENCIA EN BASE DE DATOS</span>
                        </div>
                     )}
                     
                     {m.status === 'fraud' && (
                         <div className="absolute inset-0 bg-zinc-950/80 backdrop-blur-[1px] flex items-center justify-center z-10">
                             <div className="bg-rose-950/90 border border-rose-500/30 text-rose-200 px-4 py-2 rounded-lg font-black text-xs flex items-center gap-2 shadow-2xl">
                                 <AlertOctagon size={16} className="text-rose-500"/> 
                                 <span>ALERTA DE FRAUDE: YA USADO POR {m.claimedBy || 'DESCONOCIDO'}</span>
                             </div>
                         </div>
                     )}
                  </div>

                  <div className="w-24 p-2 flex items-center justify-center bg-zinc-950/30 border-l border-zinc-800/50">
                     {m.status === 'verified' ? (
                        <div className="flex flex-col items-center text-emerald-500 gap-1">
                            <CheckCircle2 size={24}/>
                            <span className="text-[9px] font-bold">LISTO</span>
                        </div>
                     ) : m.record ? (
                        <button onClick={() => confirmInCRM(m)} className={`w-full h-full rounded-lg text-[10px] font-black uppercase transition-all flex flex-col items-center justify-center leading-tight gap-1 shadow-lg active:scale-95 group-hover:scale-105 ${m.nameMismatch || m.paymentStatus === 'underpaid' ? 'bg-amber-600 hover:bg-amber-500 text-white shadow-amber-900/20' : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-900/20'}`}>
                           <Check size={20} strokeWidth={3}/>
                           <span>{m.nameMismatch || m.paymentStatus === 'underpaid' ? 'FORZAR' : 'OK'}</span>
                        </button>
                     ) : <div className="text-[9px] font-bold text-zinc-600 text-center flex flex-col items-center gap-1 opacity-50"><XCircle size={14}/> <span>MANUAL</span></div>}
                  </div>

                </div>
              ))}
           </div>
        </div>
      </div>

      {selectedImage && <div className="fixed inset-0 z-[99999] bg-zinc-950/95 flex flex-col items-center justify-center p-8 backdrop-blur-md cursor-zoom-out" onClick={() => setSelectedImage(null)}><img src={selectedImage} className="max-w-full max-h-full rounded-lg border border-zinc-700 shadow-2xl"/></div>}
      
      {isConfigOpen && <ConfigModal config={config} setConfig={setConfig} save={saveConfig} close={() => setIsConfigOpen(false)} />}
      {status.message && <div className={`fixed bottom-6 right-6 px-5 py-3 rounded-lg shadow-2xl font-bold flex items-center gap-3 z-[99999] border text-xs animate-in slide-in-from-bottom-5 ${status.type === 'success' ? 'bg-zinc-900 text-emerald-400 border-emerald-500/50' : 'bg-zinc-900 text-rose-400 border-rose-500/50'}`}>{status.type === 'success' ? <CheckCircle2 size={16}/> : <AlertTriangle size={16}/>}<span>{status.message}</span></div>}
    </div>
  );
}

const HeaderBtn = ({ onClick, icon: Icon, label, spin, variant }: any) => (
    <button onClick={onClick} className={`px-3 py-1.5 rounded-lg text-[10px] font-bold flex gap-2 items-center transition-all border ${variant === 'danger' ? 'bg-rose-500/10 text-rose-500 border-rose-500/20 hover:bg-rose-500/20' : 'bg-zinc-800 text-zinc-400 border-zinc-700 hover:text-white hover:bg-zinc-700'}`}>
        <Icon size={14} className={spin ? "animate-spin" : ""} /> {label}
    </button>
);

const Badge = ({ type, children }: any) => {
    const styles: any = {
        warning: 'bg-orange-500/10 text-orange-400 border-orange-500/20',
        info: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
        purple: 'bg-violet-500/10 text-violet-400 border-violet-500/20',
        success: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    };
    return <span className={`text-[9px] px-2 py-0.5 rounded border font-bold uppercase tracking-wide ${styles[type]}`}>{children}</span>
};

const LockScreen = ({ pin, setPin, error, unlock }: any) => (
    <div className="fixed inset-0 z-[9999] bg-zinc-950 flex items-center justify-center p-4">
        <style>{`header,footer,nav{display:none!important}main{padding-top:0!important}body{overflow:hidden!important}`}</style>
        <div className="bg-zinc-900/50 backdrop-blur-xl border border-zinc-800 p-12 rounded-[2rem] shadow-2xl w-full max-w-sm text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-sky-500/5 to-transparent pointer-events-none"></div>
          <div className="mb-10 flex justify-center"><div className="bg-zinc-950 p-6 rounded-3xl shadow-2xl border border-zinc-800"><Lock size={48} className="text-sky-500" strokeWidth={1.5}/></div></div>
          <h1 className="text-3xl font-black text-white uppercase tracking-tighter mb-2">Búnker 10k</h1>
          <p className="text-zinc-500 text-[10px] font-bold tracking-[0.4em] uppercase mb-10">Acceso Autorizado</p>
          <form onSubmit={unlock} className="space-y-6 relative z-10">
            <input type="password" maxLength={4} className={`w-full p-5 bg-zinc-950 border rounded-2xl text-center text-4xl text-white font-mono tracking-[0.5em] focus:outline-none transition-all placeholder:text-zinc-800 ${error ? 'border-rose-500/50 shadow-rose-900/20' : 'border-zinc-800 focus:border-sky-500/50 focus:shadow-sky-900/20'}`} placeholder="••••" value={pin} onChange={(e) => setPin(e.target.value.replace(/\D/g, ''))} autoFocus />
            <button type="submit" className="w-full py-4 bg-sky-600 hover:bg-sky-500 text-white font-black rounded-xl uppercase tracking-widest text-xs transition-all active:scale-95 shadow-lg flex items-center justify-center gap-2"><Unlock size={14}/> INGRESAR</button>
          </form>
        </div>
    </div>
);

const ConfigModal = ({ config, setConfig, save, close }: any) => (
    <div className="fixed inset-0 z-[99999] bg-zinc-950/80 flex items-center justify-center p-4 backdrop-blur-md">
        <div className="bg-zinc-900 p-8 rounded-2xl border border-zinc-800 w-full max-w-md shadow-2xl relative">
            <button onClick={close} className="absolute top-4 right-4 text-zinc-500 hover:text-white"><XCircle size={20}/></button>
            <h2 className="text-sm font-black text-center text-white uppercase tracking-widest mb-6">Configuración del Sistema</h2>
            <form onSubmit={save} className="space-y-4">
                <div>
                    <label className="text-[10px] text-zinc-500 font-bold uppercase mb-1.5 block">Airtable API Key</label>
                    <input type="password" className="w-full p-3 bg-zinc-950 border border-zinc-800 rounded-lg text-center text-white focus:border-sky-500 outline-none text-xs font-mono" value={config.apiKey} onChange={e => setConfig({...config, apiKey: e.target.value})} placeholder="pat..." required/>
                </div>
                <button className="w-full py-3 bg-white hover:bg-zinc-200 text-black font-black rounded-lg uppercase tracking-widest text-xs transition-colors">GUARDAR CAMBIOS</button>
            </form>
        </div>
    </div>
);