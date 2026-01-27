"use client";

import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getAuth, onAuthStateChanged, signInAnonymously, Auth, User as FirebaseUser } from 'firebase/auth';
import { getFirestore, collection, doc, setDoc, onSnapshot, getDoc, Firestore } from 'firebase/firestore';

import {
  ShieldCheck, RefreshCw, CheckCircle2, AlertCircle, Search, ArrowRight,
  Scan, FileText, Loader2, Eye, Settings2, AlertTriangle, Lock, History, ShieldAlert,
  Fingerprint, Zap, Info, CreditCard, Share2, XCircle, AlertOctagon, Hash, Calendar,
  Maximize2, Database, Image as ImageIcon, User, Wallet, FileWarning, Unlock, LogOut,
  Users, Accessibility, LayoutDashboard, ChevronRight, Check, Landmark, Tag, CheckCircle, 
  File as FileIcon,
  ThumbsUp, Eraser, Users2, Contact, BadgeAlert, ArrowLeftRight, FileSearch, CheckCheck, Play, 
  Zap as ZapFast, FileX, Scale, HelpCircle, EyeOff, BrainCircuit, GripHorizontal, ScanEye, 
  Layers, Ghost, ListFilter, ExternalLink, Sparkles, Menu, ClipboardPaste, X, File,
  Siren // Icono para alertas de fraude visual
} from 'lucide-react';

// --- CONFIGURACIÓN FIREBASE ROBUSTA ---
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
  } 
  else if (typeof process !== 'undefined' && process.env.NEXT_PUBLIC_FIREBASE_API_KEY) {
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
  } else {
    console.warn("⚠️ Firebase no configurado (Modo Offline/Demo)");
  }
} catch (error) {
  console.error("🔥 Error Inicializando Firebase:", error);
}

// --- GESTIÓN DE API KEYS ---
const ENV_GEMINI_KEY = typeof process !== 'undefined' ? (process.env.NEXT_PUBLIC_GEMINI_API_KEY || "") : "";
const ENV_AIRTABLE_KEY = typeof process !== 'undefined' ? (process.env.NEXT_PUBLIC_AIRTABLE_API_KEY || "") : "";
const ENV_AIRTABLE_BASE = typeof process !== 'undefined' ? (process.env.NEXT_PUBLIC_AIRTABLE_BASE_ID || "appA0xfrSZyNTgiLV") : "appA0xfrSZyNTgiLV";
const ENV_AIRTABLE_TABLE = typeof process !== 'undefined' ? (process.env.NEXT_PUBLIC_AIRTABLE_TABLE_ID || "CRM 10k") : "CRM 10k";

const AIRTABLE_CONFIG_KEY = 'verificador_ruta_3_juanes_config';
const ACCESS_PIN = "1026"; 
const PRICE_FULL = 30.00;
const PRICE_DISCOUNT = 20.00;

// --- PALABRAS DE RUIDO BANCARIO (PARA LIMPIEZA PROFUNDA) ---
const BANK_NOISE_WORDS = [
  "TRANSFERENCIA", "TRASPASO", "DEP", "DEPOSITO", "CONST", "RECAUDACION", 
  "PAGO", "EFECTIVO", "CTA", "AHORRO", "CORRIENTE", "SPI", "INTERBANCARIO", 
  "INTERBANCARIA", "BANCO", "PICHINCHA", "GUAYAQUIL", "PRODUBANCO", 
  "PACIFICO", "BOLIVARIANO", "INTERNACIONAL", "AUSTRO", "LOJA", "RUMIÑAHUI", 
  "SOLIDARIO", "JEFERSON", "24ONLINE", "MOVIL", "WEB", "APP", "CASH", 
  "MANAGEMENT", "SERVICES", "DEL", "LOS", "LAS", "POR", "PARA", "ENVIADO", 
  "DESDE", "DIRECTO", "VENTANILLA", "REFERENCIA", "CONCEPTO", "BENEFICIARIO",
  "ORDENANTE", "VALOR", "FECHA", "TRANSF", "BCE", "ONLINE", "LOCAL", "RECIBIDA",
  "CTA.", "AH.", "CTE.", "PROD.", "GUAY.", "PICH.", "BOLIV."
];

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
  nombreExtraido: string | null;
  tipoComprobante: string | null;
  fechaExtraida?: string | null; 
  // Nuevos campos para detección de fraude visual
  esSospechoso?: boolean;
  razonSospecha?: string;
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
  records: Record[];
  status: 'found' | 'missing' | 'fraud' | 'verified' | 'reused' | 'doc_mismatch' | 'manual_review' | 'amount_match' | 'ocr_triangulation';
  matchType: 'documento' | 'nombre_only' | 'monto_only' | 'ocr_ghost' | 'none'; 
  claimedBy?: string;
  nameMismatch: boolean;
  isFamily: boolean;
  isGroupPayment: boolean;
  paymentStatus: 'correct' | 'underpaid' | 'overpaid';
  estimatedPeople: number;
  confidenceScore: number; 
  totalExpectedValue: number;
  isInvertedOrder: boolean;
  isStrongNameMatch: boolean;
}

// --- NORMALIZACIÓN Y UTILIDADES ---

const isFilePdf = (url: string | null) => {
    if (!url) return false;
    return url.toLowerCase().includes('.pdf') || url.toLowerCase().includes('format=pdf');
};

const cleanDocNumber = (doc: string | number | null) => {
    if (!doc) return "";
    return String(doc).replace(/\D/g, '').replace(/^0+/, '');
};

const areDocsStrictlyEqual = (ocrDoc: string | null, bankDoc: string) => {
    const cleanOCR = cleanDocNumber(ocrDoc);
    const cleanBank = cleanDocNumber(bankDoc);
    if (!cleanOCR || !cleanBank) return false;
    // Match flexible para números largos
    if (cleanOCR.length > 4 && cleanBank.length > 4) {
        return cleanOCR.includes(cleanBank) || cleanBank.includes(cleanOCR);
    }
    return cleanOCR === cleanBank;
};

const normalizeText = (text: string) => text ? text.toUpperCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^A-Z0-9]/g, " ").replace(/\s+/g, " ").trim() : "";

const levenshteinDistance = (s: string, t: string) => {
  if (!s.length) return t.length;
  if (!t.length) return s.length;
  const arr = [];
  for (let i = 0; i <= t.length; i++) {
    arr[i] = [i];
    for (let j = 1; j <= s.length; j++) {
      arr[i][j] = i === 0 ? j : Math.min(arr[i - 1][j] + 1, arr[i][j - 1] + 1, arr[i - 1][j - 1] + (s[j - 1] === t[i - 1] ? 0 : 1));
    }
  }
  return arr[t.length][s.length];
};

const getCleanTokens = (text: string) => {
    return normalizeText(text).split(' ').filter(w => w.length >= 2 && !BANK_NOISE_WORDS.includes(w) && !/^\d+$/.test(w)); 
};

const parseMontoIA = (val: any) => {
    if (typeof val === 'number') return val;
    if (!val) return 0;
    let str = String(val).replace('$', '').trim();
    if (str.includes(',') && str.includes('.')) {
        if (str.lastIndexOf(',') > str.lastIndexOf('.')) str = str.replace(/\./g, '').replace(',', '.'); 
        else str = str.replace(/,/g, '');
    } else {
        str = str.replace(',', '.');
    }
    const clean = parseFloat(str.replace(/[^\d.]/g, ''));
    return isNaN(clean) ? 0 : clean;
};

// --- OPTIMIZACIÓN DE IMAGEN ---
const optimizeImageForOCR = async (blob: Blob): Promise<string> => {
    return new Promise((resolve, reject) => {
        const img = new Image();
        const url = URL.createObjectURL(blob);
        img.onload = () => {
            URL.revokeObjectURL(url);
            const canvas = document.createElement('canvas');
            const MAX_WIDTH = 1024; 
            let width = img.width;
            let height = img.height;

            if (width > MAX_WIDTH) {
                height = Math.round((height * MAX_WIDTH) / width);
                width = MAX_WIDTH;
            }

            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext('2d');
            if(ctx) {
                ctx.drawImage(img, 0, 0, width, height);
                const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
                resolve(dataUrl.split(',')[1]);
            } else {
                reject(new Error("Canvas context failed"));
            }
        };
        img.onerror = reject;
        img.src = url;
    });
};

const blobToBase64 = (blob: Blob): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result as string;
      const base64 = result.split(',')[1];
      resolve(base64);
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
};

export default function App() {
  const [isLocked, setIsLocked] = useState(true);
  const [pinInput, setPinInput] = useState("");
  const [pinError, setPinError] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [user, setUser] = useState<FirebaseUser | null>(null);
  
  // PESTAÑAS: standard, ghost, unmatched (nueva)
  const [activeTab, setActiveTab] = useState<'standard' | 'ghost' | 'unmatched'>('standard');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const [config, setConfig] = useState({
    apiKey: '',
    baseId: ENV_AIRTABLE_BASE,
    tableName: ENV_AIRTABLE_TABLE,
    filterStage: 'Inscrito Pago x Verificar',
    geminiKey: '' 
  });

  const [isConfigOpen, setIsConfigOpen] = useState(false);
  const [airtableRecords, setAirtableRecords] = useState<Record[]>([]);
  const [bankData, setBankData] = useState("");
  const [matches, setMatches] = useState<MatchResult[]>([]);
  const [matchedRecordIds, setMatchedRecordIds] = useState<Set<string>>(new Set()); // Para saber cuáles YA tienen match
  const [historicalDocs, setHistoricalDocs] = useState<any>({});
  const [loading, setLoading] = useState(false);
  const [scanningId, setScanningId] = useState<string | null>(null);
  const [isScanningAll, setIsScanningAll] = useState(false);
  
  const [scanProgress, setScanProgress] = useState({ current: 0, total: 0 });
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [status, setStatus] = useState({ type: '', message: '' });
  const [searchTerm, setSearchTerm] = useState("");
  
  const [verifyModalOpen, setVerifyModalOpen] = useState(false);
  const [activeVerifyRecords, setActiveVerifyRecords] = useState<Record[]>([]);
  const [manualDocId, setManualDocId] = useState("");
  const [manualAmount, setManualAmount] = useState("");

  const runBtnRef = useRef<HTMLButtonElement>(null);
  const bulkBtnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    setIsMounted(true);
    const saved = localStorage.getItem(AIRTABLE_CONFIG_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setConfig(prev => ({ 
            ...prev, 
            ...parsed, 
            apiKey: parsed.apiKey || ENV_AIRTABLE_KEY,
            geminiKey: parsed.geminiKey || ENV_GEMINI_KEY
        }));
      } catch (e) {
          setConfig(prev => ({ ...prev, apiKey: ENV_AIRTABLE_KEY, geminiKey: ENV_GEMINI_KEY }));
      }
    } else {
        setConfig(prev => ({ ...prev, apiKey: ENV_AIRTABLE_KEY, geminiKey: ENV_GEMINI_KEY }));
    }
  }, []);

  useEffect(() => {
    if (!auth) return;
    const initAuth = async () => {
      try { await signInAnonymously(auth); } catch (err) { console.error("Auth Error:", err); }
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

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
        if ((e.ctrlKey || e.metaKey) && e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); runBtnRef.current?.click(); }
        if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'Enter') { e.preventDefault(); bulkBtnRef.current?.click(); }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleUnlock = (e: React.FormEvent) => { e.preventDefault(); if (pinInput === ACCESS_PIN) { setIsLocked(false); setPinError(false); } else { setPinError(true); setPinInput(""); setTimeout(() => setPinError(false), 2000); } };
  const handleLock = () => { setIsLocked(true); setPinInput(""); };
  const showStatus = (type: 'success' | 'error', message: string) => { setStatus({ type, message }); setTimeout(() => setStatus({ type: '', message: '' }), 4000); };
  
  const saveConfig = (e: React.FormEvent) => { 
      e.preventDefault(); 
      localStorage.setItem(AIRTABLE_CONFIG_KEY, JSON.stringify(config)); 
      setIsConfigOpen(false); 
      showStatus('success', 'Configuración guardada.'); 
  };

  const handlePaste = async () => {
      try {
          const text = await navigator.clipboard.readText();
          setBankData(prev => prev ? prev + '\n' + text : text);
          showStatus('success', 'Datos pegados del portapapeles.');
      } catch (err) {
          showStatus('error', 'Permiso de portapapeles denegado.');
      }
  };
  
  const fetchAirtableRecords = useCallback(async () => {
    if (!config.apiKey) return setIsConfigOpen(true);
    setLoading(true);
    try {
      let allRecords: any[] = [];
      let offset = null;
      do {
         const offsetParam: string = offset ? `&offset=${offset}` : '';
         const url = `https://api.airtable.com/v0/${config.baseId}/${encodeURIComponent(config.tableName)}?filterByFormula=${encodeURIComponent(`{Etapa}='${config.filterStage}'`)}${offsetParam}`;
         const response = await fetch(url, { headers: { Authorization: `Bearer ${config.apiKey}` } });
         if (!response.ok) throw new Error(`Airtable Error`);
         const data = await response.json();
         if (data.records) allRecords = [...allRecords, ...data.records];
         offset = data.offset;
      } while (offset);

      if (allRecords.length > 0) {
        setAirtableRecords(allRecords.map((r: any) => ({
          id: r.id,
          nombre: r.fields['nombre'] || 'DESCONOCIDO',
          cedula: r.fields['cedula'] || 'S/N',
          edad: r.fields['edad'] || 0,
          categoria: r.fields['categorias'] || 'N/A',
          tieneDiscapacidad: r.fields['Discapacidad'] === true,
          esTerceraEdad: (r.fields['edad'] || 0) >= 65,
          valorEsperado: (r.fields['Discapacidad'] === true || (r.fields['edad'] || 0) >= 65) ? PRICE_DISCOUNT : PRICE_FULL,
          fotoUrl: r.fields['Comprobante']?.[0]?.url || null,
          docExtraido: null, montoExtraido: null, nombreExtraido: null, tipoComprobante: null, statusIA: 'pendiente'
        })));
        showStatus('success', `${allRecords.length} atletas cargados.`);
      }
    } catch (e) { showStatus('error', 'Error Airtable.'); } finally { setLoading(false); }
  }, [config]);

  const scanReceiptIA = useCallback(async (record: Record) => {
    if (!record.fotoUrl) return;
    const activeGeminiKey = config.geminiKey || ENV_GEMINI_KEY;
    
    setAirtableRecords(prev => prev.map(r => r.id === record.id ? { ...r, statusIA: 'escaneando' } : r));

    try {
        const response = await fetch(record.fotoUrl, { method: 'GET', mode: 'cors', credentials: 'omit', referrerPolicy: 'no-referrer' });
        if (!response.ok) throw new Error("Fetch failed");
        const blob = await response.blob();
        
        const isPdf = blob.type === 'application/pdf';
        let base64Data = "";
        let mimeType = "";

        if (isPdf) {
            base64Data = await blobToBase64(blob);
            mimeType = "application/pdf";
        } else {
            base64Data = await optimizeImageForOCR(blob);
            mimeType = "image/jpeg";
        }

        // PROMPT FORENSE ACTUALIZADO ("Jose de Reddit Edition")
        const prompt = `Analiza este comprobante de pago con mentalidad de EXPERTO FORENSE.
        
        TAREA 1: EXTRACCIÓN (Prioridad Alta)
        - documento: Busca 'Documento', 'Referencia', 'Seq', 'Nro'. Solo dígitos.
        - monto: Valor exacto.
        - nombre: Ordenante.
        - fecha: Fecha de la transacción.

        TAREA 2: DETECCIÓN DE MONTAJE (Nivel 'Jose de Reddit')
        Busca estas señales sutiles de Photoshop/Generadores:
        1. "Efecto Parche": ¿El fondo detrás del monto/fecha es de un color sólido perfecto mientras el resto tiene ruido/gradiente?
        2. "Tipografía Alienígena": ¿El monto usa una fuente distinta (ej: Arial) a las etiquetas del banco? ¿El kerning (espaciado) es irregular?
        3. "Bordes Sucios": ¿Hay 'halos' o pixelación extraña alrededor solo de los números clave?
        4. "Incoherencia Temporal": Si es captura de celular, ¿la hora de la barra de estado (arriba) contradice la hora de la transferencia?
        5. "Alineación": ¿El texto sigue la perspectiva o parece "pegado" encima plano?

        OUTPUT JSON:
        {
            "documento": "string",
            "monto": number,
            "nombre": "string",
            "fecha": "string",
            "sospecha_fraude": boolean,
            "razon_sospecha": "string (Breve y directa: 'Fuente distinta en monto', 'Hora celular no cuadra', etc. null si es legítimo)"
        }`;

        const geminiResponse = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${activeGeminiKey}`, {
            method: 'POST', headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                contents: [{ parts: [{ text: prompt }, { inlineData: { mimeType: mimeType, data: base64Data } }] }], 
                generationConfig: { temperature: 0.1, responseMimeType: "application/json" } 
            })
        });
        
        if (!geminiResponse.ok) throw new Error("Gemini Error");
        const result = await geminiResponse.json();
        
        let json;
        try {
            const rawText = result.candidates?.[0]?.content?.parts?.[0]?.text;
            json = JSON.parse(rawText || "{}");
        } catch (e) {
            const rawText = result.candidates?.[0]?.content?.parts?.[0]?.text;
            const cleanText = rawText.replace(/```json/g, '').replace(/```/g, '').trim();
            json = JSON.parse(cleanText || "{}");
        }
        
        const docId = json.documento ? String(json.documento).replace(/\D/g, '') : null;
        const montoClean = parseMontoIA(json.monto);
        
        setAirtableRecords(prev => prev.map(r => r.id === record.id ? { 
            ...r, 
            docExtraido: docId, 
            montoExtraido: montoClean, 
            nombreExtraido: json.nombre ? String(json.nombre).toUpperCase() : null, 
            fechaExtraida: json.fecha || null,
            // Guardamos el análisis de fraude
            esSospechoso: json.sospecha_fraude === true,
            razonSospecha: json.razon_sospecha,
            tipoComprobante: isPdf ? 'PDF' : 'IMG', 
            statusIA: docId ? 'listo' : 'error' 
        } : r));
    } catch (e) { 
        console.error("Scan Error", e);
        setAirtableRecords(prev => prev.map(r => r.id === record.id ? { ...r, statusIA: 'error' } : r)); 
    }
  }, [config.geminiKey]);

  const scanAll = async () => {
    setIsScanningAll(true);
    const pendings = airtableRecords.filter(r => r.fotoUrl && r.statusIA === 'pendiente'); 
    
    if (pendings.length === 0) { setIsScanningAll(false); return showStatus('error', 'No hay pendientes.'); }
    setScanProgress({ current: 0, total: pendings.length });
    const BATCH_SIZE = 4;
    
    for (let i = 0; i < pendings.length; i += BATCH_SIZE) {
        const batch = pendings.slice(i, i + BATCH_SIZE);
        await Promise.all(batch.map(r => scanReceiptIA(r)));
        setScanProgress(prev => ({ ...prev, current: Math.min(prev.current + batch.length, prev.total) }));
    }
    setIsScanningAll(false); setScanProgress({ current: 0, total: 0 });
    showStatus('success', 'Escaneo Turbo completado.');
  };

  const processMatches = useCallback(() => {
    if (!bankData.trim()) return showStatus('error', 'Faltan datos del banco.');
    const bankEntries: any[] = [];
    const rawData = bankData;
    const regex = /(AG\.|OFICINA|CNB|BANCO)[\s\S]+?(\d{6,})\s+([\s\S]+?)\s+C\s+(\d{1,5}[.,]\d{2})/g;
    let match;
    let foundRegex = false;
    while ((match = regex.exec(rawData)) !== null) {
      foundRegex = true;
      const docNum = match[2];
      const rawDesc = match[3].replace(/\n/g, ' ').replace(/\s+/g, ' ').trim();
      const depositor = rawDesc.replace(/TRANSFERENC.*?DE\s+|DEP\s+CNB\s+|CONST\.\s+RECAUDACION\s+/i, '').trim();
      const monto = parseFloat(match[4].replace(',', '.'));
      // CORRECCIÓN INTERBANCARIA: Solo si dice SPI, BCE, OTROS
      const esInterbancaria = /SPI|OTROS BANCOS|BCE|INTERB/i.test(rawDesc);
      if (monto > 0) bankEntries.push({ documento: docNum, monto, depositor, esInterbancaria, esDuplicadoBanco: false });
    }
    if (!foundRegex || bankEntries.length === 0) {
        const lines = rawData.split(/\n/);
        lines.forEach(line => {
            if (line.trim().length < 5) return;
            const docMatch = line.match(/(\d{6,})/);
            const montoMatch = line.match(/(\d+[.,]\d{2})(?!\d)/);
            if (docMatch && montoMatch) {
                const docNum = docMatch[1];
                const montoVal = parseFloat(montoMatch[1].replace(',', '.'));
                const looksLikeDate = docNum.startsWith('202') && docNum.length === 8;
                if (!looksLikeDate && montoVal > 0) {
                     let desc = line.replace(docNum, '').replace(montoMatch[1], '').trim();
                     desc = desc.replace(/^[\s\t\d-]+/, '').substring(0, 100); 
                     const isInter = /SPI|BCE|OTROS|INTERB/i.test(line);
                     bankEntries.push({ documento: docNum, monto: montoVal, depositor: desc || "SIN DESCRIPCION", esInterbancaria: isInter, esDuplicadoBanco: false });
                }
            }
        });
    }
    if (bankEntries.length === 0) return showStatus('error', 'No se pudieron detectar transacciones.');

    const newMatchedIds = new Set<string>(); // Para tracking de los NO encontrados
    const assignedIds = new Set();
    
    const newMatches = bankEntries.map(bank => {
      let matchedRecords = airtableRecords.filter(r => {
          if(!r.docExtraido) return false;
          return areDocsStrictlyEqual(r.docExtraido, bank.documento);
      });
      let matchType: MatchResult['matchType'] = 'none';
      let status: MatchResult['status'] = 'missing';

      // PRIORIDAD 1: DOCUMENTO EXACTO
      if (matchedRecords.length > 0) {
          matchType = 'documento'; 
          status = 'found'; 
          matchedRecords.forEach(r => { assignedIds.add(r.id); newMatchedIds.add(r.id); });
      } else {
          // PRIORIDAD 2: OCR TRIANGULACIÓN
          const foundByOCR = airtableRecords.find(r => {
              if (assignedIds.has(r.id)) return false;
              if (r.statusIA !== 'listo' || !r.montoExtraido || !r.nombreExtraido) return false;
              
              const amountMatch = Math.abs(r.montoExtraido - bank.monto) < 0.1;
              const ocrName = normalizeText(r.nombreExtraido);
              const nameHit = normalizeText(r.nombre).split(/\s+/).some(part => part.length > 2 && ocrName.includes(part));
              return amountMatch && nameHit;
          });
          if (foundByOCR) {
              matchedRecords = [foundByOCR]; matchType = 'ocr_ghost'; status = 'ocr_triangulation'; 
              assignedIds.add(foundByOCR.id); newMatchedIds.add(foundByOCR.id);
          } else {
             // PRIORIDAD 3: MANUAL REVIEW / LEVENSHTEIN
             const foundByName = airtableRecords.find(r => {
                 if (assignedIds.has(r.id)) return false;
                 const cleanBankTokens = getCleanTokens(bank.depositor);
                 const crmTokens = getCleanTokens(r.nombre);
                 if(cleanBankTokens.length === 0 || crmTokens.length === 0) return false;
                 let matches = 0;
                 let strongMatches = 0;
                 cleanBankTokens.forEach(bt => {
                     crmTokens.forEach(ct => {
                         if (ct === bt) { matches++; if (ct.length > 3) strongMatches++; } 
                         else if (ct.includes(bt) && bt.length > 4) { matches++; }
                         else if (bt.length > 3 && ct.length > 3 && levenshteinDistance(bt, ct) <= 1) { matches++; strongMatches++; }
                     });
                 });
                 const amountMatch = Math.abs(r.valorEsperado - bank.monto) < 0.1;
                 if (amountMatch && matches >= 1) return true;
                 if (strongMatches >= 2) return true; 
                 return false; 
             });
             if(foundByName) { 
                 matchedRecords = [foundByName]; 
                 matchType = 'nombre_only'; 
                 status = Math.abs(foundByName.valorEsperado - bank.monto) < 0.1 ? 'amount_match' : 'manual_review';
                 newMatchedIds.add(foundByName.id); 
             }
          }
      }

      // Verificación Fraude
      const cleanBankDoc = cleanDocNumber(bank.documento);
      const historical = historicalDocs[cleanBankDoc];
      if (historical) {
          status = 'fraud';
          if (matchType === 'documento' && matchedRecords.length > 1) {
             const totalExpected = matchedRecords.reduce((s, r) => s + r.valorEsperado, 0);
             if (bank.monto >= totalExpected - 1) status = 'reused'; 
          }
      }
      let paymentStatus: 'correct' | 'underpaid' | 'overpaid' = 'correct';
      let isGroupPayment = false;
      let totalExpectedValue = 0;
      if (matchedRecords.length > 0) {
         totalExpectedValue = matchedRecords.reduce((sum, r) => sum + r.valorEsperado, 0);
         if (matchedRecords.length > 1 || bank.monto >= matchedRecords[0].valorEsperado * 1.8) isGroupPayment = true;
         if (bank.monto < totalExpectedValue - 0.5) paymentStatus = 'underpaid';
         else if (bank.monto > totalExpectedValue + 5 && !isGroupPayment) paymentStatus = 'overpaid';
      }
      return { bank, records: matchedRecords, status, matchType, claimedBy: historical?.atleta, nameMismatch: false, isFamily: false, isGroupPayment, paymentStatus, estimatedPeople: 1, confidenceScore: 0, totalExpectedValue, isInvertedOrder: false, isStrongNameMatch: false };
    });
    
    setMatchedRecordIds(newMatchedIds);
    setMatches(newMatches as any);
    if (newMatches.length > 0) showStatus('success', `Procesadas ${newMatches.length} filas.`);
  }, [bankData, airtableRecords, historicalDocs]);

  const confirmInCRM = async (match: any) => {
    if (!user || match.records.length === 0 || !db) return;
    setLoading(true);
    try {
      const { documento, monto } = match.bank;
      const docIdClean = cleanDocNumber(documento);
      const docRef = doc(db, 'artifacts', appId, 'public', 'data', 'verified_receipts', docIdClean);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists() && !match.isGroupPayment) { showStatus('error', 'FRAUDE: Doc usado.'); setLoading(false); return; }
      for (const record of match.records) {
          let label = 'MATCH';
          if (match.status === 'ocr_triangulation') label = 'INTERBANCARIA (FOTO)';
          else if (match.matchType === 'documento') label = 'OCR DOC EXACTO';
          else if (match.status === 'amount_match') label = 'VALIDADO X MONTO Y NOMBRE';
          await fetch(`https://api.airtable.com/v0/${config.baseId}/${encodeURIComponent(config.tableName)}/${record.id}`, {
            method: 'PATCH', headers: { Authorization: `Bearer ${config.apiKey}`, 'Content-Type': 'application/json' },
            body: JSON.stringify({ fields: { 'Etapa': 'Inscrito', 'Numero Comprobante': documento, 'Comentarios': `✅ VALIDADO [${new Date().toLocaleDateString()}] ${label} - Ref: ${documento} | $${monto}` } })
          });
      }
      await setDoc(doc(db, 'artifacts', appId, 'public', 'data', 'verified_receipts', docIdClean), { atleta: match.records.map((r:any)=>r.nombre).join(', '), fecha: new Date().toISOString(), monto, uid: user.uid });
      setMatches(prev => prev.map(m => m.bank.documento === documento ? { ...m, status: 'verified' } : m));
      const processedIds = match.records.map((r: any) => r.id);
      setAirtableRecords(prev => prev.filter(r => !processedIds.includes(r.id)));
      showStatus('success', `Validado: ${documento}`);
    } catch (e) { showStatus('error', 'Error al guardar.'); } finally { setLoading(false); }
  };

  const handleBulkConfirm = async () => {
      const perfectMatches = matches.filter(m => m.status === 'found' && m.paymentStatus !== 'underpaid');
      if(perfectMatches.length === 0) return showStatus('error', 'No hay seguros.');
      if(!confirm(`¿Procesar ${perfectMatches.length} pagos?`)) return;
      setLoading(true);
      for (const match of perfectMatches) { await confirmInCRM(match); }
      setLoading(false);
      showStatus('success', `Validados ${perfectMatches.length}.`);
  };

  const openManualVerify = (record: Record) => { setActiveVerifyRecords([record]); setManualDocId(record.docExtraido || ""); setManualAmount(record.montoExtraido?.toString() || record.valorEsperado.toString()); setVerifyModalOpen(true); };
  const executeManualVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !db || activeVerifyRecords.length === 0) return;
    const docIdOriginal = manualDocId.trim() || `MANUAL-${Date.now()}`;
    // Usamos el docID limpio para la key de firebase, pero el original para el comentario
    const docIdClean = cleanDocNumber(docIdOriginal);
    const monto = parseFloat(manualAmount) || 0;
    setLoading(true);
    try {
      for (const record of activeVerifyRecords) {
          await fetch(`https://api.airtable.com/v0/${config.baseId}/${encodeURIComponent(config.tableName)}/${record.id}`, { method: 'PATCH', headers: { Authorization: `Bearer ${config.apiKey}`, 'Content-Type': 'application/json' }, body: JSON.stringify({ fields: { 'Etapa': 'Inscrito', 'Numero Comprobante': docIdOriginal, 'Comentarios': `✅ MANUAL [${new Date().toLocaleDateString()}] - $${monto}` } }) });
      }
      await setDoc(doc(db, 'artifacts', appId, 'public', 'data', 'verified_receipts', docIdClean), { atleta: activeVerifyRecords[0].nombre, fecha: new Date().toISOString(), monto, manual: true });
      setAirtableRecords(prev => prev.filter(r => !activeVerifyRecords.includes(r)));
      showStatus('success', 'Pago validado.'); setVerifyModalOpen(false);
    } catch (e) { showStatus('error', 'Error manual.'); } finally { setLoading(false); }
  };

  const filteredRecords = useMemo(() => airtableRecords.filter(r => r.nombre.toLowerCase().includes(searchTerm.toLowerCase()) || r.cedula.includes(searchTerm)), [airtableRecords, searchTerm]);
  const perfectMatchesCount = matches.filter(m => m.status === 'found' && m.paymentStatus !== 'underpaid').length;

  // Filtros de las pestañas
  const regularMatches = matches.filter(m => m.status !== 'manual_review');
  const ghostMatches = matches.filter(m => m.status === 'manual_review');
  
  // LOGICA PARA "UNMATCHED" (NO EN BANCO)
  const unmatchedRecords = airtableRecords.filter(r => r.statusIA === 'listo' && !matchedRecordIds.has(r.id));

  let displayedMatches = activeTab === 'standard' ? regularMatches : ghostMatches;

  if (!isMounted) return null;
  if (isLocked) return <LockScreen pin={pinInput} setPin={setPinInput} error={pinError} unlock={handleUnlock} />;

  return (
    <div className="fixed inset-0 z-[100] bg-zinc-950 text-zinc-200 flex flex-col font-sans overflow-hidden">
      <style>{`header,footer,nav{display:none!important}main{padding-top:0!important}body{overflow:hidden!important;background:#09090b}`}</style>
      
      {/* HEADER */}
      <div className="h-16 border-b border-zinc-800 bg-zinc-900/50 backdrop-blur-xl flex justify-between items-center px-4 md:px-6 shrink-0 z-20">
          <div className="flex items-center gap-3">
             <button onClick={() => setMobileMenuOpen(true)} className="lg:hidden text-zinc-400 hover:text-white"><Menu size={20}/></button>
             <div className="bg-sky-500/10 p-2 rounded-lg border border-sky-500/20 hidden md:block"><ShieldCheck size={20} className="text-sky-400"/></div>
             <div><h1 className="text-sm font-black uppercase tracking-widest text-white leading-none">Búnker 10k</h1><span className="text-[10px] font-medium text-zinc-500 tracking-wider hidden sm:inline-block">SISTEMA ANTI-FRAUDE STRICT</span></div>
          </div>
          <div className="flex gap-2">
             <HeaderBtn onClick={fetchAirtableRecords} icon={RefreshCw} label={loading ? "CARGANDO..." : "RECARGAR"} spin={loading} />
             <HeaderBtn onClick={() => setIsConfigOpen(true)} icon={Settings2} />
             <HeaderBtn onClick={handleLock} icon={LogOut} variant="danger" />
          </div>
      </div>

      <div className="flex-1 flex gap-0 h-full min-h-0 relative">
        {/* SIDEBAR */}
        <div className={`fixed inset-y-0 left-0 z-50 w-72 bg-zinc-950 border-r border-zinc-800 transform transition-transform duration-300 lg:relative lg:translate-x-0 lg:flex lg:flex-col lg:bg-zinc-900/30 lg:backdrop-blur-sm ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
           <div className="p-3 border-b border-zinc-800 flex flex-col gap-3 bg-zinc-900/50 relative">
              <button onClick={() => setMobileMenuOpen(false)} className="absolute top-2 right-2 lg:hidden text-zinc-500"><X size={16}/></button>
              <div className="flex justify-between items-center pt-2 lg:pt-0"><span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider flex items-center gap-2"><Users size={14}/> ATLETAS ({airtableRecords.length})</span><button onClick={scanAll} disabled={isScanningAll || airtableRecords.length === 0} className="text-[10px] px-2 py-1.5 rounded bg-sky-600 hover:bg-sky-500 text-white shadow-lg shadow-sky-900/20 transition-all flex items-center gap-1 font-black tracking-wide border border-sky-500">{isScanningAll ? <Loader2 className="animate-spin" size={12}/> : <ZapFast size={12}/>} ESCANEAR TURBO</button></div>
              {isScanningAll && ( <div className="w-full h-1.5 bg-zinc-800 rounded-full overflow-hidden relative mt-2"><div className="h-full bg-emerald-500 transition-all duration-300" style={{ width: `${(scanProgress.current / scanProgress.total) * 100}%` }}></div></div> )}
              {isScanningAll && <div className="text-[9px] text-right text-emerald-500 font-mono font-bold mt-1">{scanProgress.current} / {scanProgress.total}</div>}
              <div className="relative group mt-2"><div className="absolute inset-y-0 left-2.5 flex items-center pointer-events-none text-zinc-500"><Search size={12}/></div><input type="text" className="w-full bg-zinc-950 border border-zinc-800 rounded-lg pl-8 pr-3 py-1.5 text-xs text-zinc-300 focus:border-sky-500/50 focus:ring-1 focus:ring-sky-500/20 outline-none transition-all placeholder:text-zinc-600 font-medium" placeholder="Buscar..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}/></div>
           </div>
           <div className="flex-1 overflow-y-auto custom-scrollbar p-2 space-y-2">
              {filteredRecords.map(r => (
                <div key={r.id} className={`group p-2.5 rounded-lg border transition-all text-xs flex flex-col gap-1.5 relative overflow-hidden ${r.statusIA === 'listo' ? 'bg-sky-950/10 border-sky-500/30' : 'bg-zinc-900/40 border-zinc-800/60 hover:border-zinc-700'}`}>
                   {r.statusIA === 'listo' && <div className="absolute top-0 right-0 w-2 h-2 bg-sky-500 rounded-bl shadow-[0_0_10px_rgba(14,165,233,0.5)]"></div>}
                   <div className="flex justify-between items-start gap-2">
                      <div className="flex-1 min-w-0"><span className="font-bold text-zinc-200 block text-[11px] mb-0.5 truncate uppercase" title={r.nombre}>{r.nombre}</span><span className="text-[10px] text-zinc-500 font-mono flex items-center gap-1"><Hash size={10}/> {r.cedula}</span></div>
                      <div className="flex items-center gap-1">
                          {r.fotoUrl && <button onClick={() => setSelectedImage(r.fotoUrl)} className={`w-7 h-7 flex items-center justify-center rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white border border-zinc-700 ${isFilePdf(r.fotoUrl) ? 'text-rose-400' : ''}`}>{isFilePdf(r.fotoUrl) ? <FileIcon size={12}/> : <ImageIcon size={12}/>}</button>}
                          <button onClick={() => scanReceiptIA(r)} disabled={scanningId === r.id} className="w-7 h-7 flex items-center justify-center rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-sky-400 border border-zinc-700">{scanningId === r.id ? <Loader2 size={12} className="animate-spin"/> : <Sparkles size={12}/>}</button>
                          <button onClick={() => openManualVerify(r)} className="w-7 h-7 flex items-center justify-center rounded bg-zinc-800 hover:bg-emerald-600 text-zinc-400 hover:text-white border border-transparent hover:border-emerald-500/50"><Check size={12}/></button>
                      </div>
                   </div>
                   {r.docExtraido && <div className="mt-1 pt-1.5 border-t border-zinc-800/50 flex flex-col gap-0.5"><div className="flex justify-between items-center"><span className="text-[9px] text-zinc-500 uppercase font-bold tracking-wider">DOC DETECTADO</span><span className="text-[10px] font-mono font-bold text-emerald-400 bg-emerald-950/30 px-1.5 rounded">{r.docExtraido}</span></div></div>}
                   {r.esSospechoso && <div className="mt-1 pt-1 border-t border-rose-500/30 flex items-center gap-1 text-[9px] text-rose-400 font-bold"><Siren size={10}/> ALERTA DE FRAUDE VISUAL</div>}
                </div>
              ))}
           </div>
        </div>
        {mobileMenuOpen && <div className="fixed inset-0 z-40 bg-black/50 lg:hidden backdrop-blur-sm" onClick={() => setMobileMenuOpen(false)}></div>}

        <div className="flex-1 flex flex-col bg-zinc-950 relative">
           <div className="p-4 border-b border-zinc-800 bg-zinc-900/20 flex gap-4 h-24 items-center shrink-0 z-10">
              <div className="flex-1 h-full relative group">
                  <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-zinc-600"><FileText size={16}/></div>
                  <textarea className="w-full h-full bg-zinc-950 border border-zinc-800 rounded-xl pl-10 pr-16 p-3 text-xs font-mono text-zinc-300 resize-none focus:border-sky-500/50 focus:ring-1 focus:ring-sky-900/50 outline-none leading-tight transition-all shadow-inner placeholder:text-zinc-700" placeholder="Pegar reporte bancario aquí..." value={bankData} onChange={(e) => setBankData(e.target.value)}/>
                  <div className="absolute top-2 right-2 flex gap-1">
                      <button onClick={handlePaste} className="text-zinc-500 hover:text-sky-400 bg-zinc-900/80 p-1.5 rounded-md hover:bg-zinc-800 border border-zinc-800 transition-all" title="Pegar del portapapeles"><ClipboardPaste size={14}/></button>
                      {bankData && <button onClick={() => setBankData("")} className="text-zinc-500 hover:text-rose-400 bg-zinc-900/80 p-1.5 rounded-md hover:bg-zinc-800 border border-zinc-800 transition-all"><Eraser size={14}/></button>}
                  </div>
              </div>
              <div className="flex flex-col gap-2 h-full justify-center">
                  <button ref={runBtnRef} onClick={processMatches} className="flex-1 px-6 bg-gradient-to-br from-sky-600 to-indigo-600 hover:from-sky-500 hover:to-indigo-500 text-white font-black text-xs rounded-lg uppercase tracking-wider flex flex-col justify-center items-center gap-1 shadow-xl shadow-indigo-900/20 active:scale-95 transition-all border border-sky-500/20"><ArrowRight size={18}/> <span className="text-[10px] opacity-80 hidden md:block">EJECUTAR</span></button>
                  {perfectMatchesCount > 0 && <button ref={bulkBtnRef} onClick={handleBulkConfirm} className="flex-1 px-4 bg-emerald-600/10 hover:bg-emerald-600/20 border border-emerald-500/30 text-emerald-400 hover:text-emerald-300 font-bold text-[10px] rounded-lg uppercase tracking-wide flex items-center justify-center gap-2 transition-all"><CheckCheck size={14}/> <span className="hidden md:inline">VALIDAR</span> {perfectMatchesCount}</button>}
              </div>
           </div>

           <div className="flex border-b border-zinc-800 bg-zinc-950 px-4 pt-4 gap-6 overflow-x-auto no-scrollbar">
              <button onClick={() => setActiveTab('standard')} className={`pb-3 text-[11px] font-black uppercase tracking-widest border-b-2 transition-all flex items-center gap-2 whitespace-nowrap ${activeTab === 'standard' ? 'border-sky-500 text-white' : 'border-transparent text-zinc-500 hover:text-zinc-400'}`}><Layers size={14}/> COINCIDENCIAS <span className="bg-zinc-800 px-1.5 rounded text-[9px] text-zinc-400">{regularMatches.length}</span></button>
              <button onClick={() => setActiveTab('ghost')} className={`pb-3 text-[11px] font-black uppercase tracking-widest border-b-2 transition-all flex items-center gap-2 whitespace-nowrap ${activeTab === 'ghost' ? 'border-violet-500 text-violet-300' : 'border-transparent text-zinc-500 hover:text-violet-400'}`}><BrainCircuit size={14}/> REVISIÓN MANUAL <span className={`px-1.5 rounded text-[9px] font-bold ${ghostMatches.length > 0 ? 'bg-violet-500 text-white animate-pulse' : 'bg-zinc-800 text-zinc-400'}`}>{ghostMatches.length}</span></button>
              <button onClick={() => setActiveTab('unmatched')} className={`pb-3 text-[11px] font-black uppercase tracking-widest border-b-2 transition-all flex items-center gap-2 whitespace-nowrap ${activeTab === 'unmatched' ? 'border-amber-500 text-amber-300' : 'border-transparent text-zinc-500 hover:text-amber-400'}`}><FileSearch size={14}/> SOLO FOTO (NO EN BANCO) <span className={`px-1.5 rounded text-[9px] font-bold ${unmatchedRecords.length > 0 ? 'bg-amber-500 text-black animate-pulse' : 'bg-zinc-800 text-zinc-400'}`}>{unmatchedRecords.length}</span></button>
           </div>

           <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-3 bg-zinc-950">
              {activeTab === 'unmatched' ? (
                  /* VISTA DE NO ENCONTRADOS */
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                      {unmatchedRecords.length === 0 && <div className="col-span-full flex flex-col items-center justify-center py-10 text-zinc-700 opacity-50"><FileSearch size={32}/><span className="mt-2 text-xs font-bold uppercase">Todo cruzado correctamente</span></div>}
                      {unmatchedRecords.map(r => (
                          <div key={r.id} className="bg-zinc-900/50 border border-zinc-800 p-4 rounded-xl flex flex-col gap-3 relative overflow-hidden">
                              {r.esSospechoso && <div className="absolute top-0 right-0 bg-rose-500 text-white text-[9px] font-black px-2 py-0.5 rounded-bl-lg uppercase tracking-wider flex items-center gap-1"><Siren size={10}/> POSIBLE FAKE</div>}
                              <div className="flex justify-between items-start">
                                  <div>
                                      <span className="text-xs font-bold text-white block mb-0.5">{r.nombre}</span>
                                      <span className="text-[10px] text-zinc-500 font-mono">{r.cedula}</span>
                                  </div>
                                  <button onClick={() => setSelectedImage(r.fotoUrl)} className="text-zinc-400 hover:text-white bg-zinc-800 p-1.5 rounded"><Eye size={14}/></button>
                              </div>
                              <div className="bg-black/30 p-2 rounded border border-zinc-800/50 grid grid-cols-2 gap-2 text-[10px]">
                                  <div><span className="block text-zinc-600 font-bold uppercase text-[8px]">Monto IA</span><span className="text-emerald-400 font-mono font-bold">${r.montoExtraido?.toFixed(2)}</span></div>
                                  <div><span className="block text-zinc-600 font-bold uppercase text-[8px]">Doc IA</span><span className="text-zinc-300 font-mono">{r.docExtraido || '---'}</span></div>
                              </div>
                              {r.esSospechoso && <div className="text-[9px] text-rose-400 font-medium bg-rose-950/20 p-2 rounded border border-rose-900/30">⚠️ {r.razonSospecha}</div>}
                              <button onClick={() => openManualVerify(r)} className="w-full py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white text-[10px] font-bold uppercase rounded border border-zinc-700 transition-all flex items-center justify-center gap-2"><Check size={12}/> Validar Manualmente</button>
                          </div>
                      ))}
                  </div>
              ) : (
                /* VISTA NORMAL DE MATCHES */
                displayedMatches.map((m, i) => (
                    <div key={i} className={`flex items-stretch rounded-xl border transition-all text-sm h-auto min-h-[5rem] shadow-lg relative overflow-hidden group 
                        ${m.status === 'verified' ? 'bg-zinc-900/30 border-emerald-900/30 opacity-60' 
                        : m.status === 'fraud' ? 'bg-rose-950/10 border-rose-900/40' 
                        : m.status === 'ocr_triangulation' ? 'bg-violet-950/10 border-violet-500/30' 
                        : m.status === 'amount_match' ? 'bg-blue-950/10 border-blue-500/30' 
                        : m.status === 'manual_review' ? 'bg-yellow-950/10 border-yellow-600/40'
                        : 'bg-zinc-900/80 border-zinc-800 hover:border-zinc-700'}`}>
                    
                    <div className={`w-1.5 shrink-0 
                        ${m.status === 'verified' ? 'bg-emerald-500' 
                        : m.status === 'fraud' ? 'bg-rose-500' 
                        : m.status === 'ocr_triangulation' ? 'bg-violet-500 animate-pulse' 
                        : m.status === 'amount_match' ? 'bg-blue-500' 
                        : m.status === 'manual_review' ? 'bg-yellow-500'
                        : m.isGroupPayment ? 'bg-violet-500' 
                        : m.paymentStatus === 'underpaid' ? 'bg-amber-500' 
                        : m.status === 'found' ? 'bg-sky-500' 
                        : 'bg-zinc-700'}`}></div>

                    <div className="w-[180px] md:w-[240px] p-3 md:p-4 border-r border-zinc-800/50 flex flex-col justify-center shrink-0 bg-zinc-900/50">
                        <div className="flex justify-between items-baseline mb-2">
                            <span className="text-[9px] font-black text-zinc-600 uppercase tracking-wider">BANCO</span>
                            <span className={`font-mono font-bold text-sm ${m.paymentStatus === 'underpaid' ? 'text-amber-500' : 'text-emerald-400'}`}>${m.bank.monto.toFixed(2)}</span>
                        </div>
                        <span className="font-mono text-white font-bold tracking-tight text-xs md:text-sm mb-1 truncate">{m.bank.documento}</span>
                        <span className="text-[10px] text-zinc-400 truncate font-medium flex items-center gap-1" title={m.bank.depositor}>{m.bank.esInterbancaria && <Landmark size={12} className="text-amber-500"/>}{m.bank.depositor}</span>
                        
                        {(m.status === 'fraud' || m.status === 'reused') && <div className="mt-2 p-1.5 md:p-2 bg-rose-900/30 border border-rose-500/50 rounded text-[9px] text-rose-200 font-black flex items-center gap-2"><AlertOctagon size={14}/> FRAUDE</div>}
                        {m.status === 'ocr_triangulation' && <div className="mt-2 p-1.5 md:p-2 bg-violet-900/20 border border-violet-500/30 rounded text-[9px] text-violet-300 font-bold leading-tight flex items-center gap-2 shadow-sm"><ScanEye size={12} className="shrink-0"/><span>MATCH FOTO</span></div>}
                        {m.status === 'manual_review' && <div className="mt-2 p-1.5 md:p-2 bg-yellow-900/20 border border-yellow-500/30 rounded text-[9px] text-yellow-400 font-bold leading-tight flex items-center gap-2"><Scale size={12} className="shrink-0"/><span>POSIBLE (NOMBRE)</span></div>}
                        {m.status === 'amount_match' && <div className="mt-2 p-1.5 md:p-2 bg-blue-900/20 border border-blue-500/30 rounded text-[9px] text-blue-400 font-bold leading-tight flex items-center gap-2"><HelpCircle size={12} className="shrink-0"/><span>POSIBLE</span></div>}
                    </div>
                    <div className="flex-1 p-2 md:p-4 flex flex-col justify-center relative">
                        {m.records.length > 0 ? (
                            <div className="flex flex-col gap-2 w-full">
                                {m.records.map((r, idx) => (
                                    <div key={idx} className={`p-2 rounded-lg border flex flex-col gap-1.5 relative overflow-hidden ${m.status === 'ocr_triangulation' ? 'bg-zinc-950/60 border-violet-500/30' : 'bg-zinc-950/40 border-zinc-800/50'}`}>
                                        <div className="flex justify-between items-center pr-4">
                                            <div className="flex flex-col">
                                                <span className="block text-[8px] font-bold text-zinc-600 uppercase mb-0.5">ATLETA</span>
                                                <span className="font-bold text-zinc-200 text-xs md:text-sm leading-tight flex items-center gap-2">{r.nombre}</span>
                                            </div>
                                            {r.fotoUrl && <button onClick={() => setSelectedImage(r.fotoUrl)} className={`text-[9px] px-2 py-1 rounded border flex items-center gap-1 uppercase font-bold tracking-wider ${isFilePdf(r.fotoUrl) ? 'bg-rose-900/20 text-rose-400 border-rose-500/20' : 'bg-zinc-800 text-zinc-400 border-zinc-700'}`}>{isFilePdf(r.fotoUrl) ? <FileIcon size={10}/> : <Eye size={10}/>} {isFilePdf(r.fotoUrl) ? 'PDF' : 'VER'}</button>}
                                        </div>
                                        {m.status === 'ocr_triangulation' && <div className="grid grid-cols-2 gap-2 text-[9px] bg-zinc-950/50 p-1.5 rounded border border-violet-500/20 mt-1"><div className="text-zinc-400">OCR Nombre: <span className="text-violet-300 font-bold">{r.nombreExtraido}</span></div><div className="text-zinc-400">OCR Monto: <span className="text-violet-300 font-bold">${r.montoExtraido}</span></div></div>}
                                        {m.status !== 'ocr_triangulation' && <div className="grid grid-cols-4 gap-2 text-[9px] md:text-[10px] text-zinc-500 bg-zinc-900/50 p-1.5 rounded border border-zinc-800/30"><div><span className="block font-bold text-zinc-600 text-[8px] uppercase tracking-wider">Cédula</span><span className="font-mono text-zinc-300">{r.cedula}</span></div><div><span className="block font-bold text-zinc-600 text-[8px] uppercase tracking-wider">Edad</span><span className="font-mono text-zinc-300">{r.edad}</span></div><div><span className="block font-bold text-zinc-600 text-[8px] uppercase tracking-wider">Valor</span><span className={`font-mono font-bold ${r.valorEsperado < 30 ? 'text-emerald-400' : 'text-zinc-300'}`}>${r.valorEsperado.toFixed(2)}</span></div>{r.docExtraido && <div><span className={`block font-bold text-[8px] uppercase tracking-wider ${m.matchType === 'documento' ? 'text-emerald-500' : 'text-rose-500'}`}>OCR</span><span className={`font-mono font-bold ${m.matchType === 'documento' ? 'text-emerald-200' : 'text-rose-300 line-through'}`}>{r.docExtraido}</span></div>}</div>}
                                    </div>
                                ))}
                            </div>
                        ) : <div className="flex flex-col items-center justify-center h-full text-zinc-700 gap-1 opacity-50"><FileWarning size={20}/> <span className="text-[10px] font-bold">SIN COINCIDENCIA</span></div>}
                        {m.status === 'fraud' && <div className="absolute inset-0 bg-rose-950/80 backdrop-blur-[1px] flex items-center justify-center z-10"><div className="bg-rose-950/90 border border-rose-500/30 text-rose-200 px-4 py-2 rounded-lg font-black text-xs flex items-center gap-2 shadow-2xl"><AlertOctagon size={16} className="text-rose-500"/> <span>ALERTA DE FRAUDE</span></div></div>}
                    </div>
                    <div className="w-24 p-2 flex items-center justify-center bg-zinc-950/30 border-l border-zinc-800/50">
                        {m.status === 'verified' ? ( <div className="flex flex-col items-center text-emerald-500 gap-1"><CheckCircle2 size={24}/><span className="text-[9px] font-bold">LISTO</span></div> ) : m.records.length > 0 && m.status !== 'fraud' && m.status !== 'reused' ? ( <button onClick={() => confirmInCRM(m)} className={`w-full h-full rounded-lg text-[10px] font-black uppercase transition-all flex flex-col items-center justify-center leading-tight gap-1 shadow-lg active:scale-95 group-hover:scale-105 active:rotate-1 ${m.status === 'ocr_triangulation' ? 'bg-violet-600 hover:bg-violet-500 text-white shadow-violet-900/20' : m.status === 'amount_match' ? 'bg-blue-600 hover:bg-blue-500' : m.paymentStatus === 'underpaid' ? 'bg-amber-600 hover:bg-amber-500' : 'bg-emerald-600 hover:bg-emerald-500'} text-white shadow-emerald-900/20`}>{m.status === 'ocr_triangulation' ? <GripHorizontal size={20}/> : <Check size={20} strokeWidth={3}/>}<span>{m.status === 'ocr_triangulation' ? 'CONFIRMAR' : (m.paymentStatus === 'underpaid' ? 'MANUAL' : 'OK')}</span></button> ) : <div className="text-[9px] font-bold text-zinc-600 text-center flex flex-col items-center gap-1 opacity-50"><XCircle size={14}/> <span>MANUAL</span></div>}
                    </div>
                    </div>
                ))
              )}
           </div>
        </div>

        {selectedImage && (
            <div className="fixed inset-0 z-[99999] bg-zinc-950/95 flex flex-col items-center justify-center p-8 backdrop-blur-md" onClick={() => setSelectedImage(null)}>
                <div className="relative w-full h-full max-w-5xl max-h-[90vh] flex flex-col bg-zinc-900 border border-zinc-700 rounded-lg overflow-hidden shadow-2xl" onClick={e => e.stopPropagation()}>
                    <div className="h-10 bg-zinc-800 flex justify-between items-center px-4 border-b border-zinc-700 shrink-0">
                        <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider flex items-center gap-2">
                           {isFilePdf(selectedImage) ? <FileIcon size={14}/> : <ImageIcon size={14}/>} 
                           {isFilePdf(selectedImage) ? 'VISOR PDF' : 'VISOR IMAGEN'}
                        </span>
                        <div className="flex gap-2">
                            <button onClick={() => window.open(selectedImage, '_blank')} className="text-xs bg-sky-600 hover:bg-sky-500 text-white px-3 py-1 rounded flex items-center gap-1 font-bold"><ExternalLink size={12}/> ABRIR ORIGINAL</button>
                            <button onClick={() => setSelectedImage(null)} className="text-zinc-400 hover:text-white"><XCircle size={18}/></button>
                        </div>
                    </div>
                    <div className="flex-1 bg-zinc-950 relative overflow-hidden flex items-center justify-center">
                        {isFilePdf(selectedImage) ? (
                            <iframe src={selectedImage} className="w-full h-full border-0" title="PDF Viewer"></iframe>
                        ) : (
                            <img src={selectedImage} className="max-w-full max-h-full object-contain" referrerPolicy="no-referrer" alt="Comprobante" />
                        )}
                    </div>
                </div>
            </div>
        )}
        
        {verifyModalOpen && activeVerifyRecords.length > 0 && (
            <div className="fixed inset-0 z-[99999] bg-zinc-950/80 flex items-center justify-center p-4 backdrop-blur-md">
                <div className="bg-zinc-900 p-6 rounded-2xl border border-zinc-800 w-full max-w-sm shadow-2xl relative">
                    <button onClick={() => setVerifyModalOpen(false)} className="absolute top-4 right-4 text-zinc-500 hover:text-white"><XCircle size={20}/></button>
                    <div className="flex items-center gap-3 mb-6"><div className="p-3 rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/20"><CheckCircle2 size={24}/></div><div><h2 className="text-sm font-black text-white uppercase tracking-wider">Validación Manual</h2><p className="text-[10px] text-zinc-400 font-medium">Confirma los datos del pago.</p></div></div>
                    <div className="mb-4 bg-zinc-950/50 p-3 rounded-lg border border-zinc-800/50"><span className="block text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-1">ATLETA(S)</span><div className="space-y-1">{activeVerifyRecords.map((r, i) => (<div key={i} className="border-b border-zinc-800/50 last:border-0 pb-1 last:pb-0"><span className="block text-sm font-bold text-white">{r.nombre}</span><span className="block text-[10px] text-zinc-500 font-mono mt-0.5">{r.cedula}</span></div>))}</div></div>
                    <form onSubmit={executeManualVerify} className="space-y-4">
                        <div><label className="text-[10px] text-zinc-500 font-bold uppercase mb-1.5 block">Nro. Documento</label><input type="text" className="w-full p-3 bg-zinc-950 border border-zinc-800 rounded-lg text-white focus:border-emerald-500 outline-none text-sm font-mono" value={manualDocId} onChange={e => setManualDocId(e.target.value)} autoFocus/></div>
                        <div><label className="text-[10px] text-zinc-500 font-bold uppercase mb-1.5 block">Monto ($)</label><input type="number" step="0.01" className="w-full p-3 bg-zinc-950 border border-zinc-800 rounded-lg text-white focus:border-emerald-500 outline-none text-sm font-mono" value={manualAmount} onChange={e => setManualAmount(e.target.value)}/></div>
                        <button className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-black rounded-lg uppercase tracking-widest text-xs transition-all shadow-lg active:scale-95 flex items-center justify-center gap-2"><Check size={16}/> CONFIRMAR PAGO</button>
                    </form>
                </div>
            </div>
        )}
      </div> 
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

const ConfigModal = ({ config, setConfig, save, close }: any) => (
    <div className="fixed inset-0 z-[99999] bg-zinc-950/80 flex items-center justify-center p-4 backdrop-blur-md">
        <div className="bg-zinc-900 p-8 rounded-2xl border border-zinc-800 w-full max-w-md shadow-2xl relative">
            <button onClick={close} className="absolute top-4 right-4 text-zinc-500 hover:text-white"><XCircle size={20}/></button>
            <h2 className="text-sm font-black text-center text-white uppercase tracking-widest mb-6">Configuración del Sistema</h2>
            <form onSubmit={save} className="space-y-4">
                <div><label className="text-[10px] text-zinc-500 font-bold uppercase mb-1.5 block">Airtable API Key</label><input type="password" className="w-full p-3 bg-zinc-950 border border-zinc-800 rounded-lg text-center text-white focus:border-sky-500 outline-none text-xs font-mono" value={config.apiKey} onChange={e => setConfig({...config, apiKey: e.target.value})} placeholder="pat..." required/></div>
                <div><label className="text-[10px] text-zinc-500 font-bold uppercase mb-1.5 block">Gemini API Key (Opcional)</label><input type="password" className="w-full p-3 bg-zinc-950 border border-zinc-800 rounded-lg text-center text-white focus:border-sky-500 outline-none text-xs font-mono" value={config.geminiKey} onChange={e => setConfig({...config, geminiKey: e.target.value})} placeholder="Si está vacío usa el global"/></div>
                <button className="w-full py-3 bg-white hover:bg-zinc-200 text-black font-black rounded-lg uppercase tracking-widest text-xs transition-colors">GUARDAR CAMBIOS</button>
            </form>
        </div>
    </div>
);

const LockScreen = ({ pin, setPin, error, unlock }: any) => (
    <div className="fixed inset-0 z-[9999] bg-zinc-950 flex items-center justify-center p-4">
        <style>{`header,footer,nav{display:none!important}main{padding-top:0!important}body{overflow:hidden!important}`}</style>
        <div className="bg-zinc-900/50 backdrop-blur-xl border border-zinc-800 p-12 rounded-[2rem] shadow-2xl w-full max-w-sm text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-sky-500/5 to-transparent pointer-events-none"></div>
          <div className="mb-10 flex justify-center"><div className="bg-zinc-900 p-6 rounded-3xl shadow-2xl border border-zinc-800"><Lock size={48} className="text-sky-500" strokeWidth={1.5}/></div></div>
          <h1 className="text-3xl font-black text-white uppercase tracking-tighter mb-2">Búnker 10k</h1>
          <p className="text-zinc-500 text-[10px] font-bold tracking-[0.4em] uppercase mb-10">Acceso Autorizado</p>
          <form onSubmit={unlock} className="space-y-6 relative z-10">
            <input type="password" maxLength={4} className={`w-full p-5 bg-zinc-950 border rounded-2xl text-center text-4xl text-white font-mono tracking-[0.5em] focus:outline-none transition-all placeholder:text-zinc-800 ${error ? 'border-rose-500/50 shadow-rose-900/20' : 'border-zinc-800 focus:border-sky-500/50 focus:shadow-sky-900/20'}`} placeholder="••••" value={pin} onChange={(e) => setPin(e.target.value.replace(/\D/g, ''))} autoFocus />
            <button type="submit" className="w-full py-4 bg-sky-600 hover:bg-sky-500 text-white font-black rounded-xl uppercase tracking-widest text-xs transition-all active:scale-95 shadow-lg flex items-center justify-center gap-2"><Unlock size={14}/> INGRESAR</button>
          </form>
        </div>
    </div>
);