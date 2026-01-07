"use client";

import React, { useState, useEffect } from 'react';
// FIX: Importamos los tipos necesarios de Firebase
import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getAuth, onAuthStateChanged, signInAnonymously, Auth, User as FirebaseUser } from 'firebase/auth';
import { getFirestore, collection, doc, setDoc, onSnapshot, getDoc, Firestore } from 'firebase/firestore';
import {
  ShieldCheck,
  Upload,
  RefreshCw,
  CheckCircle2,
  CheckCircle,
  AlertCircle,
  Search,
  Database,
  ArrowRight,
  Save,
  Image as ImageIcon,
  Scan,
  FileText,
  Loader2,
  Eye,
  Settings2,
  AlertTriangle,
  Lock,
  History,
  ShieldAlert,
  Fingerprint,
  Zap,
  Info,
  CreditCard,
  Share2,
  XCircle,
  AlertOctagon,
  Hash,
  Calendar
} from 'lucide-react';

// --- CONFIGURACIÓN MAESTRA ---

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

// FIX: Definimos los tipos explícitamente. Ya no son 'any'.
let app: FirebaseApp | undefined;
let auth: Auth | undefined;
let db: Firestore | undefined;

if (typeof window !== "undefined") {
  if (CREDENTIALS.FIREBASE.apiKey) {
    try {
        app = getApps().length === 0 ? initializeApp(CREDENTIALS.FIREBASE) : getApp();
        auth = getAuth(app);
        db = getFirestore(app);
    } catch (error) {
        console.error("Error inicializando Firebase:", error);
    }
  } else {
    console.warn("Faltan credenciales de Firebase en .env.local");
  }
}

export default function BunkerPage() {
  const [isMounted, setIsMounted] = useState(false);
  const [user, setUser] = useState<FirebaseUser | null>(null);
  
  const [config, setConfig] = useState({
    apiKey: process.env.NEXT_PUBLIC_AIRTABLE_API_KEY || '',
    baseId: process.env.NEXT_PUBLIC_AIRTABLE_BASE_ID || 'appA0xfrSZyNTgiLV',
    tableName: process.env.NEXT_PUBLIC_AIRTABLE_TABLE_ID || 'CRM 10k',
    filterStage: 'Inscrito Pago x Verificar'
  });

  const [isConfigOpen, setIsConfigOpen] = useState(false);
  const [airtableRecords, setAirtableRecords] = useState<any[]>([]);
  const [bankData, setBankData] = useState("");
  const [matches, setMatches] = useState<any[]>([]);
  const [historicalDocs, setHistoricalDocs] = useState<any>({});
  const [loading, setLoading] = useState(false);
  const [scanningId, setScanningId] = useState<string | null>(null);
  const [isScanningAll, setIsScanningAll] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [status, setStatus] = useState({ type: '', message: '' });

  const appId = "bunker-anti-fraude-10k";

  // 1. Control de montaje
  useEffect(() => {
    setIsMounted(true);
    const saved = localStorage.getItem(AIRTABLE_CONFIG_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      setConfig(prev => ({ 
        ...prev, 
        ...parsed,
        apiKey: parsed.apiKey || process.env.NEXT_PUBLIC_AIRTABLE_API_KEY || ''
      }));
      
      if (!parsed.apiKey && !process.env.NEXT_PUBLIC_AIRTABLE_API_KEY) {
        setIsConfigOpen(true);
      }
    } else {
      if (!process.env.NEXT_PUBLIC_AIRTABLE_API_KEY) {
        setIsConfigOpen(true);
      }
    }
  }, []);

  // 2. Seguridad: Autenticación Cloud
  useEffect(() => {
    if (!isMounted || !auth) return;
    const initAuth = async () => {
      try {
        // FIX: Usamos ! para asegurar a TS que auth existe en este punto
        await signInAnonymously(auth!); 
      } catch (err) { console.error("Auth Error:", err); }
    };
    initAuth();
    const unsubscribe = onAuthStateChanged(auth!, setUser);
    return () => unsubscribe();
  }, [isMounted]);

  // 3. Seguridad: Sincronización de Historial
  useEffect(() => {
    if (!user || !db) return;
    const q = collection(db, 'artifacts', appId, 'public', 'data', 'verified_receipts');
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const docs: any = {};
      snapshot.forEach(d => { docs[d.id] = d.data(); });
      setHistoricalDocs(docs);
    }, (error) => console.error("Firestore Error:", error));
    return () => unsubscribe();
  }, [user]);

  const showStatus = (type: string, message: string) => {
    setStatus({ type, message });
    setTimeout(() => setStatus({ type: '', message: '' }), 5000);
  };

  const saveConfig = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem(AIRTABLE_CONFIG_KEY, JSON.stringify(config));
    setIsConfigOpen(false);
    showStatus('success', 'Llave de seguridad actualizada.');
  };

  const fetchAirtableRecords = async () => {
    if (!config.apiKey) { 
        showStatus('error', 'Falta API Key de Airtable');
        setIsConfigOpen(true); 
        return; 
    }
    setLoading(true);
    try {
      const tableNameEncoded = encodeURIComponent(config.tableName || 'CRM 10k');
      const formula = encodeURIComponent(`{Etapa}='${config.filterStage}'`);
      
      const response = await fetch(`https://api.airtable.com/v0/${config.baseId}/${tableNameEncoded}?filterByFormula=${formula}`, {
        headers: { Authorization: `Bearer ${config.apiKey}` }
      });
      
      if (!response.ok) {
        throw new Error(`Airtable Error: ${response.status}`);
      }

      const data = await response.json();
      if (data.records) {
        setAirtableRecords(data.records.map((r: any) => ({
          id: r.id,
          nombre: r.fields['nombre'] || 'Sin nombre',
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
    } catch (e) { 
        console.error(e);
        showStatus('error', 'Error al sincronizar CRM. Revisa Configuración.'); 
    }
    finally { setLoading(false); }
  };

  const urlToBase64 = async (url: string) => {
    try {
      const response = await fetch(url, { mode: 'cors' });
      if (!response.ok) throw new Error("Error de red al cargar imagen");

      const blob = await response.blob();
      const mimeType = blob.type || "image/jpeg";

      return new Promise<{ data: string; mimeType: string } | null>((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          const result = reader.result as string;
          resolve({
            data: result.split(',')[1],
            mimeType: mimeType
          });
        };
        reader.readAsDataURL(blob);
      });
    } catch (e) {
      console.error("Base64 Error:", e);
      return null;
    }
  };

  const scanReceiptIA = async (record: any) => {
    if (!record.fotoUrl) return null;
    setAirtableRecords(prev => prev.map(r => r.id === record.id ? { ...r, statusIA: 'escaneando' } : r));
    setScanningId(record.id);

    const apiKey = CREDENTIALS.GEMINI_KEY;
    
    if (!apiKey) {
        showStatus('error', 'Falta GEMINI_API_KEY en configuración (.env.local).');
        setAirtableRecords(prev => prev.map(r => r.id === record.id ? { ...r, statusIA: 'error' } : r));
        setScanningId(null);
        return;
    }

    try {
      const imageData = await urlToBase64(record.fotoUrl);
      if (!imageData || !imageData.data) throw new Error("No se pudo descargar/leer la imagen");

      const prompt = `Analiza este comprobante de pago bancario. Extrae estrictamente el número de REFERENCIA/DOCUMENTO y el MONTO total.
Si no encuentras un número claro, devuelve null.
Responde SOLO este JSON: {"documento": "123456", "monto": 30.00}`;

      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{
            parts: [
              { text: prompt },
              { inlineData: { mimeType: imageData.mimeType, data: imageData.data } }
            ]
          }],
          generationConfig: { responseMimeType: "application/json" }
        })
      });

      if (!response.ok) {
        throw new Error(`Gemini API Error: ${response.status}`);
      }

      const result = await response.json();
      const extractedText = result.candidates?.[0]?.content?.parts?.[0]?.text;

      let extracted = { documento: null, monto: null };
      try {
        extracted = JSON.parse(extractedText);
      } catch (jsonErr) {
        console.warn("Error parseando JSON de IA, intentando limpieza...", extractedText);
      }

      const docId = extracted.documento ? String(extracted.documento).trim() : null;

      setAirtableRecords(prev => prev.map(r =>
        r.id === record.id ? { ...r, docExtraido: docId, montoExtraido: extracted.monto, statusIA: docId ? 'listo' : 'error' } : r
      ));
    } catch (e) {
      console.error("IA Critical Error:", e);
      setAirtableRecords(prev => prev.map(r => r.id === record.id ? { ...r, statusIA: 'error' } : r));
      showStatus('error', 'Fallo de lectura IA. Revisa consola.');
    } finally { setScanningId(null); }
  };

  const scanAll = async () => {
    setIsScanningAll(true);
    for (const record of airtableRecords.filter(r => r.fotoUrl && r.statusIA === 'pendiente')) {
      await scanReceiptIA(record);
    }
    setIsScanningAll(false);
  };

  const processMatches = () => {
    // FIX: Reemplacé el flag /s por [\s\S] para compatibilidad con versiones antiguas de JS/TS
    // Antes: /(TRANSFERENC.*?|DEPOSITO.*?)\s+(\d{2}\/\d{2}\/\d{4})\s+(\d{4,12})\s+[CD]/gs;
    const regex = /(TRANSFERENC[\s\S]*?|DEPOSITO[\s\S]*?)\s+(\d{2}\/\d{2}\/\d{4})\s+(\d{4,12})\s+[CD]/g;
    
    let match;
    const bankEntries = [];
    const seenBankDocs = new Set();
    const internalDuplicatesBank = new Set();

    while ((match = regex.exec(bankData)) !== null) {
      const fullConcept = match[1].replace(/\n/g, ' ').trim();
      const docNum = match[3];
      // FIX: Regex compatible
      const depositorName = fullConcept.replace(/(TRANSFERENC\s+IA\s+(DIRECTA|INTERBANCARI)\s+A?\s+DE\s+|DEP\s+CNB\s+)/i, '').trim();

      if (seenBankDocs.has(docNum)) internalDuplicatesBank.add(docNum);
      seenBankDocs.add(docNum);

      const amountSearchPart = bankData.substring(match.index, match.index + 250);
      const amountMatch = amountSearchPart.match(/(\d{1,4}(,\d{3})*(\.\d{2}))/);

      bankEntries.push({
        documento: docNum,
        monto: amountMatch ? parseFloat(amountMatch[0].replace(',', '')) : 0,
        depositor: depositorName,
        esDuplicadoBanco: internalDuplicatesBank.has(docNum),
        esInterbancaria: fullConcept.toLowerCase().includes('interbancari')
      });
    }

    const assignedRecordIds = new Set();

    const newMatches = bankEntries.map(bank => {
      let matchingRecord = airtableRecords.find(r => r.docExtraido === bank.documento);
      let matchType = 'documento';

      if (!matchingRecord && bank.depositor && bank.depositor.length > 5) {
        matchingRecord = airtableRecords.find(r => {
          if (assignedRecordIds.has(r.id)) return false;
          const crmParts = r.nombre.toLowerCase().split(' ').filter((p: string) => p.length > 3);
          const bankName = bank.depositor.toLowerCase();
          return crmParts.filter((part: string) => bankName.includes(part)).length >= 2;
        });
        if (matchingRecord) matchType = 'nombre';
      }

      if (matchingRecord) assignedRecordIds.add(matchingRecord.id);

      const isClaimed = historicalDocs[bank.documento];

      let nameMismatch = false;
      if (matchingRecord && matchType === 'documento' && bank.depositor) {
        const crmParts = matchingRecord.nombre.toLowerCase().split(' ').filter((p: string) => p.length > 3);
        const bankName = bank.depositor.toLowerCase();
        nameMismatch = !crmParts.some((part: string) => bankName.includes(part));
      }

      return {
        bank,
        record: matchingRecord || null,
        status: isClaimed ? 'fraud' : (matchingRecord ? 'found' : 'missing'),
        matchType,
        claimedBy: isClaimed ? isClaimed.atleta : null,
        nameMismatch
      };
    });

    setMatches(newMatches);
  };

  const confirmInCRM = async (recordId: string, bankDoc: string, athleteName: string, amount: number) => {
    if (!user || !db) return; 
    setLoading(true);
    try {
      const historyRef = doc(db, 'artifacts', appId, 'public', 'data', 'verified_receipts', bankDoc);
      const historySnap = await getDoc(historyRef);
      if (historySnap.exists()) {
        showStatus('error', '¡BLOQUEO! Documento ya registrado.');
        setLoading(false);
        return;
      }

      await fetch(`https://api.airtable.com/v0/${config.baseId}/${encodeURIComponent(config.tableName)}/${recordId}`, {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${config.apiKey}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fields: {
            'Etapa': 'Notificar',
            'Numero Comprobante': bankDoc,
            'Comentarios': `VALIDACIÓN OK: Doc ${bankDoc} | Monto $${amount} | ${new Date().toLocaleString()}`
          }
        })
      });

      await setDoc(historyRef, {
        atleta: athleteName,
        fecha: new Date().toISOString(),
        recordId: recordId,
        monto: amount,
        verificadoPor: user.uid
      });

      setMatches(prev => prev.map(m => m.record?.id === recordId ? { ...m, status: 'verified' } : m));
      showStatus('success', 'Blindado y movido a NOTIFICAR.');
    } catch (e) { showStatus('error', 'Fallo en la validación.'); }
    finally { setLoading(false); }
  };

  if (!isMounted) return null;

  return (
    <div className="min-h-screen bg-[#020617] p-4 md:p-8 font-sans text-slate-200">
      <div className="max-w-7xl mx-auto">
        <header className="bg-slate-900/80 backdrop-blur-2xl p-7 rounded-[2.8rem] border border-slate-800 mb-10 flex flex-col md:flex-row justify-between items-center gap-6 shadow-2xl relative">
          <div className="flex items-center gap-7">
            <div className="bg-yellow-400 p-5 rounded-[2rem] shadow-[0_0_50px_rgba(250,204,21,0.25)] text-slate-950">
              <ShieldCheck size={42} strokeWidth={2.5}/>
            </div>
            <div>
              <h1 className="text-3xl font-black uppercase italic tracking-tighter text-white leading-none">Búnker Anti-Fraude 10k</h1>
              <div className="flex items-center gap-3 mt-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-ping"></div>
                <p className="text-slate-500 text-[10px] font-black tracking-[0.4em] uppercase tracking-widest leading-none">CLOUD SECURITY • NOTIFICAR STAGE</p>
              </div>
            </div>
          </div>
          <div className="flex gap-3">
            <button onClick={fetchAirtableRecords} className="px-10 py-5 bg-yellow-400 text-slate-950 rounded-[1.5rem] text-xs font-black hover:bg-yellow-300 transition-all shadow-xl active:scale-95 flex items-center gap-3">
              <RefreshCw size={18} className={loading ? "animate-spin" : ""}/> 1. CARGAR CRM
            </button>
            <button onClick={() => setIsConfigOpen(true)} className="p-4 bg-slate-800 text-slate-400 rounded-2xl hover:text-white transition-all shadow-lg border border-slate-700">
              <Settings2 size={24}/>
            </button>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* LADO IZQUIERDO: SCANNER */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-slate-900/40 border border-slate-800 p-8 rounded-[3rem] shadow-2xl relative overflow-hidden">
              <div className="flex justify-between items-center mb-10">
                <h2 className="text-[11px] font-black uppercase text-slate-500 tracking-[0.2em] flex items-center gap-3">
                  <Fingerprint size={18} className="text-blue-500"/> Lector OCR
                </h2>
                <button
                  onClick={scanAll}
                  disabled={isScanningAll || airtableRecords.length === 0}
                  className="text-[10px] font-black bg-blue-600 text-white px-7 py-3 rounded-2xl hover:bg-blue-500 shadow-xl"
                >
                  {isScanningAll ? "PROCESANDO..." : "LEER TODO"}
                </button>
              </div>
              <div className="space-y-4 max-h-[550px] overflow-y-auto pr-3 custom-scrollbar">
                {airtableRecords.map(record => (
                  <div key={record.id} className={`p-5 rounded-[2rem] border-2 transition-all group ${
                    record.statusIA === 'listo' ? 'bg-blue-900/20 border-blue-500/40 shadow-[0_0_20px_rgba(59,130,246,0.05)]' : 'bg-slate-800/30 border-slate-800'
                  }`}>
                    <div className="flex justify-between items-start">
                      <div className="min-w-0 flex-1">
                        <p className="text-[13px] font-black uppercase truncate text-white tracking-tight">{record.nombre}</p>
                        <div className="flex gap-2 mt-1">
                          <span className="text-[9px] font-bold text-slate-500 uppercase">{record.categoria}</span>
                        </div>
                        {record.docExtraido && (
                          <div className="mt-4 inline-flex items-center gap-2 text-[11px] font-black text-blue-400 bg-blue-950/50 px-3 py-2 rounded-xl border border-blue-800/50 shadow-inner">
                            <CheckCircle size={14}/> ID: {record.docExtraido}
                          </div>
                        )}
                      </div>
                      <div className="flex flex-col gap-2 ml-4">
                        {record.fotoUrl && <button onClick={() => setSelectedImage(record.fotoUrl)} className="p-3 bg-slate-800 rounded-2xl text-slate-400 hover:text-white shadow-lg"><Eye size={18}/></button>}
                        <button onClick={() => scanReceiptIA(record)} disabled={scanningId === record.id} className={`p-3 rounded-2xl transition-all shadow-lg ${record.statusIA === 'listo' ? 'bg-green-600 text-white' : 'bg-slate-700 text-blue-400'}`}>
                          {scanningId === record.id ? <Loader2 size={18} className="animate-spin"/> : <Scan size={18}/>}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 p-8 rounded-[3.5rem] shadow-2xl relative overflow-hidden group">
              <div className="absolute -right-8 -top-8 text-slate-800/20 group-hover:scale-110 transition-transform duration-1000">
                <ShieldAlert size={180} />
              </div>
              <div className="relative z-10">
                <div className="flex items-center gap-4 mb-4">
                  <History className="text-yellow-400" size={28}/>
                  <h3 className="text-[11px] font-black uppercase tracking-[0.3em] text-slate-400">Escudo Global</h3>
                </div>
                <p className="text-6xl font-black text-white tracking-tighter">{Object.keys(historicalDocs).length}</p>
                <p className="text-slate-500 text-[10px] uppercase font-bold mt-3 leading-relaxed tracking-wider">Comprobantes ya detectados anteriormente</p>
              </div>
            </div>
          </div>

          {/* LADO DERECHO: CONCILIACIÓN */}
          <div className="lg:col-span-8 space-y-8">
            <div className="bg-slate-900/50 border border-slate-800 p-8 rounded-[3rem] shadow-2xl">
              <h2 className="text-[11px] font-black uppercase text-slate-500 mb-6 flex items-center gap-3 tracking-[0.3em]">
                <FileText size={20} className="text-yellow-500"/> Paso 3: Movimientos Bancarios
              </h2>
              <textarea
                className="w-full h-44 p-7 bg-slate-950 border-2 border-slate-800 rounded-[2.5rem] focus:border-yellow-400 outline-none text-xs font-mono text-slate-300 shadow-inner transition-all"
                placeholder="Pega aquí el detalle de movimientos de tu banca web..."
                value={bankData}
                onChange={(e) => setBankData(e.target.value)}
              />
              <button onClick={processMatches} className="w-full mt-8 py-7 bg-yellow-400 text-slate-950 font-black rounded-[2.2rem] hover:bg-yellow-300 shadow-[0_20px_50px_rgba(250,204,21,0.2)] active:scale-[0.98] transition-all flex items-center justify-center gap-5 uppercase italic tracking-tighter text-lg">
                VINCULAR BANCO Y BLINDAR <ArrowRight size={32}/>
              </button>
            </div>

            <div className="bg-slate-900/50 border border-slate-800 p-8 rounded-[3.5rem] shadow-2xl min-h-[600px]">
              <h2 className="text-[11px] font-black uppercase text-slate-500 mb-10 flex items-center gap-3 tracking-[0.3em]">
                <Search size={22} className="text-blue-500"/> Resultados con Datos de Atleta
              </h2>

              <div className="space-y-8">
                {matches.length === 0 ? (
                  <div className="py-40 text-center opacity-10">
                    <Search size={100} className="mx-auto mb-8" />
                    <p className="font-black uppercase text-sm tracking-[0.8em]">Seguridad en Espera</p>
                  </div>
                ) : matches.map((match, i) => (
                  <div key={i} className={`p-8 rounded-[3.5rem] border-2 transition-all relative group shadow-2xl ${
                    match.status === 'verified' ? 'bg-slate-950/50 border-slate-900 opacity-40 grayscale' :
                    match.status === 'fraud' || match.bank.esDuplicadoBanco ? 'bg-red-950/30 border-red-500 ring-8 ring-red-500/5' :
                    match.status === 'found' ? (match.matchType === 'nombre' ? 'bg-blue-950/40 border-blue-500/50 shadow-blue-500/10' : 'bg-slate-900 border-slate-700 hover:border-blue-400/50') : 'bg-slate-950/50 border-slate-900'
                  }`}>

                    {(match.status === 'fraud' || match.bank.esDuplicadoBanco) && (
                      <div className="absolute top-0 right-0 bg-red-600 text-white text-[11px] font-black px-10 py-4 rounded-bl-[2.5rem] flex items-center gap-3 shadow-2xl animate-pulse z-20 uppercase">
                        <AlertOctagon size={20}/> FRAUDE O DUPLICADO DETECTADO
                      </div>
                    )}

                    <div className="flex flex-col xl:flex-row justify-between items-center gap-10">
                      <div className="flex-1 flex flex-col md:flex-row gap-10 items-center w-full">
                        {match.record?.fotoUrl && (
                          <div className="relative shrink-0 cursor-pointer overflow-hidden rounded-[2.5rem] border-4 border-slate-800 shadow-[0_20px_40px_rgba(0,0,0,0.5)] group-hover:border-yellow-400 transition-all scale-100 hover:scale-105" onClick={() => setSelectedImage(match.record.fotoUrl)}>
                            <img src={match.record.fotoUrl} className="w-48 h-48 object-cover" alt="comprobante" />
                            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all">
                              <Eye size={32} className="text-white"/>
                            </div>
                            <div className="absolute bottom-0 inset-x-0 bg-yellow-400 py-1.5 text-slate-950 text-[9px] font-black text-center uppercase tracking-widest">Ver Foto</div>
                          </div>
                        )}

                        <div className="min-w-0 flex-1 space-y-6">
                          <div className="flex flex-wrap items-center gap-5">
                            <div className={`px-5 py-2.5 rounded-2xl text-[12px] font-black tracking-tight flex items-center gap-3 shadow-inner ${match.bank.esInterbancaria ? 'bg-blue-600 text-white shadow-blue-500/20' : 'bg-slate-100 text-slate-950 shadow-md'}`}>
                              {match.bank.esInterbancaria ? <Share2 size={18}/> : <CreditCard size={18}/>}
                              ID BANCO: {match.bank.documento}
                            </div>
                            <span className="text-4xl font-black text-green-400 tracking-tighter">${match.bank.monto.toFixed(2)}</span>
                          </div>

                          {match.record ? (
                            <div className="space-y-5">
                              <div>
                                <h3 className="text-2xl font-black uppercase text-white leading-tight mb-3 tracking-tight">{match.record.nombre}</h3>
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                  <div className="bg-slate-800 border border-slate-700 p-3 rounded-2xl flex items-center gap-3">
                                    <Hash size={16} className="text-slate-500"/>
                                    <span className="text-[11px] font-black text-slate-200 uppercase tracking-tighter">CI: {match.record.cedula}</span>
                                  </div>
                                  <div className="bg-slate-800 border border-slate-700 p-3 rounded-2xl flex items-center gap-3">
                                    <Calendar size={16} className="text-slate-500"/>
                                    <span className="text-[11px] font-black text-slate-200 uppercase tracking-tighter">EDAD: {match.record.edad} AÑOS</span>
                                  </div>
                                  <div className="bg-slate-800 border border-slate-700 p-3 rounded-2xl flex items-center gap-3">
                                    <Zap size={16} className="text-slate-500"/>
                                    <span className="text-[11px] font-black text-slate-200 uppercase tracking-tighter">{match.record.categoria}</span>
                                  </div>
                                </div>
                                {match.matchType === 'nombre' && (
                                  <div className="mt-3 text-[11px] font-black text-blue-400 bg-blue-900/40 px-4 py-2 rounded-xl border border-blue-500/50 flex items-center gap-2 w-fit">
                                    <Fingerprint size={14}/> MATCH POR NOMBRE (INTERBANCARIA)
                                  </div>
                                )}
                              </div>

                              <div className={`p-6 rounded-[2rem] border-2 flex flex-col gap-4 shadow-inner ${
                                match.status === 'fraud' ? 'bg-red-500/10 border-red-500/30' :
                                match.nameMismatch ? 'bg-yellow-500/10 border-yellow-500/30' : 'bg-green-500/10 border-green-500/30'
                              }`}>
                                <div className="flex items-center gap-4">
                                  {match.status === 'fraud' ? <XCircle size={28} className="text-red-500 shrink-0"/> :
                                   match.nameMismatch ? <AlertTriangle size={28} className="text-yellow-500 shrink-0"/> : <CheckCircle2 size={28} className="text-green-500 shrink-0"/>}
                                  <div className="min-w-0 flex-1">
                                    <p className={`text-[12px] font-black uppercase tracking-widest ${match.status === 'fraud' ? 'text-red-500' : match.nameMismatch ? 'text-yellow-500' : 'text-green-500'}`}>
                                      {match.status === 'fraud' ? `YA RECLAMADO POR ${match.claimedBy}` :
                                       match.nameMismatch ? 'DIFERENCIA DE IDENTIDAD (PAGO DE TERCERO)' : 'ATLETA VALIDADO CORRECTAMENTE'}
                                    </p>
                                    <p className="text-base text-white font-bold truncate mt-1">Titular en Banco: {match.bank.depositor || 'NO DISPONIBLE'}</p>
                                  </div>
                                </div>
                                <div className="flex items-center gap-3 pt-3 border-t border-slate-800/50">
                                  <Info size={16} className="text-slate-500"/>
                                  <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest">
                                    Lectura IA en Foto: <span className="text-blue-400">DOC {match.record.docExtraido || '---'}</span> | <span className="text-blue-400">MONTO ${match.record.montoExtraido || '0.00'}</span>
                                  </p>
                                </div>
                              </div>
                            </div>
                          ) : (
                            <div className="p-10 rounded-[2.5rem] bg-slate-950/60 border border-slate-800 flex items-center gap-6 shadow-inner">
                              <ShieldAlert size={40} className="text-slate-700"/>
                              <p className="text-xs font-bold text-slate-500 uppercase leading-relaxed tracking-widest">
                                El sistema no encontró ninguna foto procesada que coincida con este número de movimiento o nombre de atleta.
                              </p>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="shrink-0 w-full xl:w-auto">
                        {match.status === 'found' && (
                          <button
                            onClick={() => confirmInCRM(match.record.id, match.bank.documento, match.record.nombre, match.bank.monto)}
                            className={`w-full xl:w-auto px-16 py-8 text-slate-950 text-sm font-black rounded-[2.5rem] shadow-2xl active:scale-95 transition-all uppercase italic tracking-widest ${match.matchType === 'nombre' ? 'bg-blue-400 hover:bg-blue-300 shadow-blue-500/20' : 'bg-green-500 hover:bg-green-400 shadow-green-500/20'}`}
                          >
                            BLINDAR Y PASAR A NOTIFICAR
                          </button>
                        )}
                        {match.status === 'verified' && (
                          <div className="flex flex-col items-center gap-3 text-green-500">
                            <div className="bg-green-500/10 p-6 rounded-full shadow-inner border border-green-500/20">
                              <CheckCircle2 size={80} strokeWidth={3}/>
                            </div>
                            <span className="text-[11px] font-black uppercase tracking-[0.5em]">Blindado</span>
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

      {selectedImage && (
        <div className="fixed inset-0 bg-slate-950/98 backdrop-blur-3xl z-[100] flex flex-col items-center justify-center p-6 animate-in fade-in duration-300" onClick={() => setSelectedImage(null)}>
          <img src={selectedImage} className="max-w-full max-h-[82vh] rounded-[4rem] shadow-[0_0_120px_rgba(0,0,0,0.9)] border-[15px] border-slate-900 animate-in zoom-in-95 duration-500" />
          <button className="mt-12 px-24 py-7 bg-white text-slate-950 rounded-full text-xs font-black uppercase shadow-2xl tracking-[0.5em] hover:scale-110 active:scale-95 transition-all border-8 border-slate-100">
            CERRAR INSPECCIÓN
          </button>
        </div>
      )}

      {isConfigOpen && (
        <div className="fixed inset-0 bg-slate-950/98 backdrop-blur-3xl flex items-center justify-center p-4 z-[110]">
          <div className="bg-slate-900 rounded-[5.5rem] p-20 w-full max-w-2xl border border-slate-800 shadow-[0_0_100px_rgba(0,0,0,0.8)] relative">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-yellow-400 rounded-[3rem] flex items-center justify-center text-slate-950 shadow-2xl border-[10px] border-slate-900">
              <Lock size={56} strokeWidth={3}/>
            </div>
            <h2 className="text-4xl font-black uppercase italic mb-12 text-center tracking-tighter text-white">Autorización 10k</h2>
            <form onSubmit={saveConfig} className="space-y-12">
              <div>
                <label className="block text-[11px] font-black text-slate-600 uppercase tracking-[0.5em] mb-5 text-center">Llave Personal Airtable</label>
                <input
                  type="password"
                  className="w-full p-8 bg-slate-950 border-2 border-slate-800 rounded-[3rem] focus:border-yellow-400 outline-none font-mono text-center text-xl text-yellow-500 shadow-inner"
                  value={config.apiKey}
                  onChange={(e) => setConfig({...config, apiKey: e.target.value})}
                  required
                  placeholder="pat..."
                />
              </div>
              <button type="submit" className="w-full py-8 bg-yellow-400 text-slate-950 font-black rounded-[3rem] hover:bg-yellow-300 shadow-[0_20px_60px_rgba(250,204,21,0.3)] transition-all uppercase italic tracking-[0.2em] text-sm">
                ACTIVAR TERMINAL DE SEGURIDAD
              </button>
            </form>
          </div>
        </div>
      )}

      {status.message && (
        <div className={`fixed bottom-12 right-12 px-14 py-9 rounded-[4rem] shadow-[0_40px_100px_rgba(0,0,0,0.8)] font-black flex items-center gap-7 animate-in slide-in-from-right-full z-[120] border-l-[15px] ${
          status.type === 'success' ? 'bg-green-600 text-white border-green-400' : 'bg-red-600 text-white border-red-400'
        }`}>
          {status.type === 'success' ? <ShieldCheck size={48}/> : <AlertCircle size={48}/>}
          <span className="uppercase text-lg tracking-wider">{status.message}</span>
        </div>
      )}
    </div>
  );
}