"use client";

import React, { useState, useEffect, useRef } from 'react';
import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getAuth, onAuthStateChanged, signInAnonymously, signInWithCustomToken, Auth, User as FirebaseUser } from 'firebase/auth';
import { getFirestore, collection, doc, setDoc, onSnapshot, getDoc, Firestore } from 'firebase/firestore';

import {
  ShieldCheck, RefreshCw, CheckCircle2, AlertCircle, Search, ArrowRight,
  Scan, FileText, Loader2, Eye, Settings2, AlertTriangle, Lock, History, ShieldAlert,
  Fingerprint, Zap, Info, CreditCard, Share2, XCircle, AlertOctagon, Hash, Calendar,
  Maximize2, Database, Image as ImageIcon, User, Wallet, FileWarning, Unlock, LogOut,
  Users, Accessibility, LayoutDashboard, ChevronRight, Check, Landmark, Tag, CheckCircle, File, ThumbsUp, Eraser,
  Users2, Contact, BadgeAlert, ArrowLeftRight, FileSearch, CheckCheck, Play, Zap as ZapFast, FileX
} from 'lucide-react';

// --- CONFIGURACIÓN FIREBASE ---
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
  nombreExtraido: string | null;
  tipoComprobante: string | null;
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
  status: 'found' | 'missing' | 'fraud' | 'verified' | 'reused' | 'doc_mismatch';
  matchType: 'documento' | 'nombre_only' | 'none'; // nombre_only es ahora un warning
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

// --- NORMALIZACIÓN ESTRICTA (REGLA #1) ---
const cleanDocNumber = (doc: string | number | null) => {
    if (!doc) return "";
    // Elimina letras, espacios, guiones y ceros a la izquierda
    // "REF: 00012345" -> "12345"
    return String(doc).replace(/\D/g, '').replace(/^0+/, '');
};

const areDocsStrictlyEqual = (ocrDoc: string | null, bankDoc: string) => {
    const cleanOCR = cleanDocNumber(ocrDoc);
    const cleanBank = cleanDocNumber(bankDoc);
    
    if (!cleanOCR || !cleanBank) return false;
    
    // El Banco suele tener mas ceros o digitos extra, o el OCR lee menos.
    // Match si son idénticos o si uno termina con el otro (sufijo).
    return cleanOCR === cleanBank || cleanBank.endsWith(cleanOCR) || cleanOCR.endsWith(cleanBank);
};

export default function App() {
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

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
        if ((e.ctrlKey || e.metaKey) && e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            runBtnRef.current?.click();
        }
        if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'Enter') {
            e.preventDefault();
            bulkBtnRef.current?.click();
        }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    if (pinInput === ACCESS_PIN) { setIsLocked(false); setPinError(false); } 
    else { setPinError(true); setPinInput(""); setTimeout(() => setPinError(false), 2000); }
  };
  const handleLock = () => { setIsLocked(true); setPinInput(""); };
  const showStatus = (type: 'success' | 'error', message: string) => { setStatus({ type, message }); setTimeout(() => setStatus({ type: '', message: '' }), 4000); };
  const saveConfig = (e: React.FormEvent) => { e.preventDefault(); localStorage.setItem(AIRTABLE_CONFIG_KEY, JSON.stringify(config)); setIsConfigOpen(false); showStatus('success', 'Configuración guardada.'); };
  
  const normalizeText = (text: string) => text.toUpperCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^A-Z0-9]/g, " ").replace(/\s+/g, " ").trim();

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
          nombreExtraido: null, 
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
    if (!apiKeyToUse || (apiKeyToUse.startsWith('pat') && !GEMINI_KEY)) return; 

    setAirtableRecords(prev => prev.map(r => r.id === record.id ? { ...r, statusIA: 'escaneando' } : r));

    try {
      const imageData = await urlToBase64(record.fotoUrl);
      if (!imageData) throw new Error("CORS");
      
      const prompt = `Extrae datos de este comprobante bancario.
      IMPORTANTE: El Número de Documento es lo más crítico.
      
      1. DOCUMENTO: Busca "Ref:", "Secuencial", "Documento", "Control". Extrae SOLO NÚMEROS.
      2. MONTO: Valor total.
      3. NOMBRE: Quién transfiere.
      
      Output JSON: {"documento": "12345", "monto": 30.00, "nombre": "JUAN"}`;

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
          nombreExtraido: json.nombre ? String(json.nombre).toUpperCase() : null, 
          tipoComprobante: json.tipo || 'DIGITAL', 
          statusIA: docId ? 'listo' : 'error' 
      } : r));
    } catch (e) { 
        setAirtableRecords(prev => prev.map(r => r.id === record.id ? { ...r, statusIA: 'error' } : r)); 
    }
  };

  const scanAll = async () => {
    setIsScanningAll(true);
    const pendings = airtableRecords.filter(r => r.fotoUrl && r.statusIA === 'pendiente');
    setScanProgress({ current: 0, total: pendings.length });
    const BATCH_SIZE = 5; 
    
    for (let i = 0; i < pendings.length; i += BATCH_SIZE) {
        const batch = pendings.slice(i, i + BATCH_SIZE);
        await Promise.all(batch.map(r => scanReceiptIA(r)));
        setScanProgress(prev => ({ ...prev, current: Math.min(prev.current + batch.length, prev.total) }));
    }
    
    setIsScanningAll(false); 
    setScanProgress({ current: 0, total: 0 });
    showStatus('success', 'Escaneo Turbo completado.');
  };

  const processMatches = () => {
    if (!bankData.trim()) return showStatus('error', 'Faltan datos del banco.');

    const regex = /(\d{2}[\/\-]\d{2}[\/\-]\d{4})\s+(\d{4,20})\s+([A-Z0-9\s]+)/g;
    let match;
    const bankEntries = [];
    const normalizedData = bankData.replace(/\r\n/g, '\n');

    while ((match = regex.exec(normalizedData)) !== null) {
      const docNum = match[2];
      const lineEnd = normalizedData.indexOf('\n', match.index);
      const lineStart = normalizedData.lastIndexOf('\n', match.index);
      const fullLine = normalizedData.substring(lineStart + 1, lineEnd !== -1 ? lineEnd : undefined);
      
      let depositor = fullLine.replace(/TRANSFERENC.*?DE\s+|DEP\s+CNB\s+|CONST\.\s+RECAUDACION\s+/i, '').replace(/[\d\/]/g, '').trim();
      const amountMatch = fullLine.match(/(\d{1,4}[.,]\d{2})(?!\d)/);
      let monto = 0; if (amountMatch) monto = parseFloat(amountMatch[0].replace(',', '.'));
      const esInterbancaria = /INTERB|SPI|OTROS BANCOS|TRANSF\.|BCE|EN LINEA|ONLINE|TRANSFERENCIA/i.test(fullLine);

      if (monto > 0) bankEntries.push({ documento: docNum, monto, depositor, esInterbancaria, esDuplicadoBanco: false });
    }

    const assignedIds = new Set();
    
    const newMatches = bankEntries.map(bank => {
      // ----------------------------------------------------
      // REGLA 1: BUSQUEDA POR DOCUMENTO (ESTRICTA NORMALIZADA)
      // ----------------------------------------------------
      const matchedRecords = airtableRecords.filter(r => {
          if(!r.docExtraido) return false;
          return areDocsStrictlyEqual(r.docExtraido, bank.documento);
      });
      
      let matchType: 'documento' | 'nombre_only' | 'none' = 'none';
      let status: MatchResult['status'] = 'missing';

      // SI HAY MATCH DE DOCUMENTO -> ES UN "FOUND"
      if (matchedRecords.length > 0) {
          matchType = 'documento';
          status = 'found';
          matchedRecords.forEach(r => assignedIds.add(r.id));
      } 
      else {
          // ----------------------------------------------------
          // REGLA 2: FALLBACK POR NOMBRE PERO SIN VALIDAR (SOLO AVISO)
          // ----------------------------------------------------
          const foundByName = airtableRecords.find(r => {
             if (assignedIds.has(r.id)) return false;
             const bankNameParts = normalizeText(bank.depositor).split(/\s+/).filter(p => p.length > 1);
             if (bankNameParts.length === 0) return false;
             const crmNameNorm = normalizeText(r.nombre);
             const crmNameParts = crmNameNorm.split(/\s+/).filter(p => p.length > 1);
             
             let matchCount = 0;
             bankNameParts.forEach(bPart => {
                 if (crmNameParts.some(cPart => cPart === bPart || cPart.includes(bPart) || bPart.includes(cPart))) matchCount++;
             });
             return matchCount >= 2; // Match fuerte de nombre
          });
          
          if (foundByName) {
              // ENCONTRAMOS LA PERSONA, PERO EL DOC NO COINCIDE
              matchedRecords.push(foundByName);
              matchType = 'nombre_only';
              status = 'doc_mismatch'; // ESTADO ESPECIAL: NO COINCIDE DOC
          }
      }

      // ----------------------------------------------------
      // REGLA 3: VERIFICACIÓN DE FRAUDE (HISTÓRICO)
      // ----------------------------------------------------
      const cleanBankDoc = cleanDocNumber(bank.documento);
      const historical = historicalDocs[cleanBankDoc];

      if (historical) {
          status = 'fraud';
          // Excepción: Pagos grupales reales permitidos si el monto del banco cubre a todos
          if (matchType === 'documento' && matchedRecords.length > 1) {
             const totalExpected = matchedRecords.reduce((s, r) => s + r.valorEsperado, 0);
             if (bank.monto >= totalExpected - 1) status = 'reused'; // Es un reuso válido (grupo)
          }
      }

      // CALCULOS DE SEGURIDAD
      let nameMismatch = false;
      let isFamily = false;
      let confidence = 0;
      let paymentStatus: 'correct' | 'underpaid' | 'overpaid' = 'correct';
      let isGroupPayment = false;
      let estimatedPeople = 1;
      let totalExpectedValue = 0;

      if (matchedRecords.length > 0) {
         // Validar nombre aunque sea match por documento (para detectar familias)
         const record = matchedRecords[0]; 
         const crmName = normalizeText(record.nombre);
         const bankName = normalizeText(bank.depositor);
         
         const isNameSimilar = crmName.split(' ').filter(p => p.length>2).some(p => bankName.includes(p));
         
         if (matchType === 'documento') {
             confidence = 100;
             if (!isNameSimilar) {
                 nameMismatch = true;
                 isFamily = true; // Doc coincide, nombre no -> Familiar
             }
         } else {
             // Es nombre_only
             confidence = 0; // Confianza 0 para auto-match
             nameMismatch = true; // Forzamos flag
         }

         // Validar Montos
         totalExpectedValue = matchedRecords.reduce((sum, r) => sum + r.valorEsperado, 0);
         if (matchedRecords.length > 1 || bank.monto >= matchedRecords[0].valorEsperado * 1.8) {
            isGroupPayment = true;
            estimatedPeople = Math.max(matchedRecords.length, Math.round(bank.monto / PRICE_DISCOUNT));
         }

         if (bank.monto < totalExpectedValue - 0.5) paymentStatus = 'underpaid';
         else if (bank.monto > totalExpectedValue + 5 && !isGroupPayment) paymentStatus = 'overpaid';
      }

      return {
        bank, records: matchedRecords, status, matchType, claimedBy: historical?.atleta,
        nameMismatch, isFamily, isGroupPayment, paymentStatus, estimatedPeople, confidenceScore: confidence,
        totalExpectedValue, isInvertedOrder: false, isStrongNameMatch: !nameMismatch
      };
    });

    setMatches(newMatches);
    if (newMatches.length > 0) showStatus('success', `Procesadas ${newMatches.length} filas.`);
    else showStatus('error', 'Sin datos.');
  };

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
          const tipoLabel = record.tipoComprobante === 'FISICO' ? '(PAPEL FÍSICO)' : '';
          await fetch(`https://api.airtable.com/v0/${config.baseId}/${encodeURIComponent(config.tableName)}/${record.id}`, {
            method: 'PATCH', headers: { Authorization: `Bearer ${config.apiKey}`, 'Content-Type': 'application/json' },
            body: JSON.stringify({ fields: { 
                'Etapa': 'Inscrito', 
                'Numero Comprobante': documento, 
                'Comentarios': `✅ VALIDADO [${new Date().toLocaleDateString()}] ${tipoLabel} - OCR MATCH: ${documento} | Banco: $${monto}` 
            } })
          });
      }

      const atletasNames = match.records.map((r: any) => r.nombre).join(', ');
      const firestoreId = match.records.length > 1 ? `${docIdClean}_GRUPO` : docIdClean;
      await setDoc(doc(db, 'artifacts', appId, 'public', 'data', 'verified_receipts', firestoreId), { 
          atleta: atletasNames, fecha: new Date().toISOString(), monto, uid: user.uid, isGroup: true, groupSize: match.records.length, originalDoc: documento
      });
      
      const verifiedIds = match.records.map((r: any) => r.id);
      setMatches(prev => prev.map(m => {
          const hasVerifiedRecord = m.records.some(r => verifiedIds.includes(r.id));
          return hasVerifiedRecord ? { ...m, status: 'verified' as const } : m;
      }));
      showStatus('success', `Validado: ${documento}`);
    } catch (e) { console.error(e); showStatus('error', 'Error al guardar.'); } finally { setLoading(false); }
  };

  // BOTON "VALIDAR TODO": AHORA ES SÚPER SEGURO
  const handleBulkConfirm = async () => {
      // SOLO valida si status es 'found' (match de documento) Y no hay problemas de dinero
      const perfectMatches = matches.filter(m => 
          m.status === 'found' && 
          m.matchType === 'documento' &&
          m.paymentStatus !== 'underpaid'
      );

      if(perfectMatches.length === 0) return showStatus('error', 'No hay coincidencias 100% seguras.');
      if(!confirm(`¿Procesar ${perfectMatches.length} pagos SEGUROS? (Los dudosos se ignorarán)`)) return;

      setLoading(true);
      let processed = 0;
      const CHUNK_SIZE = 3;
      for (let i = 0; i < perfectMatches.length; i += CHUNK_SIZE) {
          const chunk = perfectMatches.slice(i, i + CHUNK_SIZE);
          await Promise.all(chunk.map(match => confirmInCRM(match)));
          processed += chunk.length;
      }
      setLoading(false);
      showStatus('success', `Se validaron ${processed} pagos automáticamente.`);
  };

  const openManualVerify = (record: Record) => {
    setActiveVerifyRecords([record]);
    setManualDocId(record.docExtraido || "");
    setManualAmount(record.montoExtraido?.toString() || record.valorEsperado.toString());
    setVerifyModalOpen(true);
  };

  const executeManualVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !db || activeVerifyRecords.length === 0) return;
    const docIdOriginal = manualDocId.trim() || `MANUAL-${Date.now().toString().slice(-6)}`;
    const docIdClean = cleanDocNumber(docIdOriginal);
    const monto = parseFloat(manualAmount) || 0;
    setLoading(true);
    try {
      for (const record of activeVerifyRecords) {
          await fetch(`https://api.airtable.com/v0/${config.baseId}/${encodeURIComponent(config.tableName)}/${record.id}`, {
            method: 'PATCH', headers: { Authorization: `Bearer ${config.apiKey}`, 'Content-Type': 'application/json' },
            body: JSON.stringify({ fields: { 'Etapa': 'Inscrito', 'Numero Comprobante': docIdOriginal, 'Comentarios': `✅ VALIDADO MANUAL [${new Date().toLocaleDateString()}] - $${monto} - Ref: ${docIdOriginal}` } })
          });
      }
      await setDoc(doc(db, 'artifacts', appId, 'public', 'data', 'verified_receipts', docIdClean), { 
        atleta: activeVerifyRecords.map(r => r.nombre).join(', '), fecha: new Date().toISOString(), monto: monto, uid: user.uid, isGroup: false, manual: true
      });
      const verifiedIds = activeVerifyRecords.map(r => r.id);
      setAirtableRecords(prev => prev.filter(r => !verifiedIds.includes(r.id)));
      showStatus('success', 'Pago validado correctamente.');
      setVerifyModalOpen(false);
      setActiveVerifyRecords([]);
    } catch (e) { console.error(e); showStatus('error', 'Error al validar manual.'); } finally { setLoading(false); }
  };

  const filteredRecords = airtableRecords.filter(r => r.nombre.toLowerCase().includes(searchTerm.toLowerCase()) || r.cedula.includes(searchTerm));

  const perfectMatchesCount = matches.filter(m => 
    m.status === 'found' && 
    m.matchType === 'documento' &&
    m.paymentStatus !== 'underpaid'
  ).length;

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
                <span className="text-[10px] font-medium text-zinc-500 tracking-wider">SISTEMA ANTI-FRAUDE STRICT</span>
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
        <div className="w-[320px] border-r border-zinc-800 flex flex-col bg-zinc-900/30 hidden lg:flex backdrop-blur-sm">
           <div className="p-3 border-b border-zinc-800 flex flex-col gap-3 bg-zinc-900/50">
              <div className="flex justify-between items-center">
                 <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider flex items-center gap-2"><Users size={14}/> ATLETAS ({airtableRecords.length})</span>
                 <button onClick={scanAll} disabled={isScanningAll || airtableRecords.length === 0} className="text-[10px] px-2 py-1.5 rounded bg-sky-600 hover:bg-sky-500 text-white shadow-lg shadow-sky-900/20 transition-all flex items-center gap-1 font-black tracking-wide border border-sky-500">{isScanningAll ? <Loader2 className="animate-spin" size={12}/> : <ZapFast size={12}/>} ESCANEAR TURBO</button>
              </div>
              
              {isScanningAll && (
                  <div className="w-full h-1.5 bg-zinc-800 rounded-full overflow-hidden relative">
                      <div className="h-full bg-emerald-500 transition-all duration-300" style={{ width: `${(scanProgress.current / scanProgress.total) * 100}%` }}></div>
                  </div>
              )}
              {isScanningAll && <div className="text-[9px] text-right text-emerald-500 font-mono font-bold">{scanProgress.current} / {scanProgress.total}</div>}

              <div className="relative group">
                  <div className="absolute inset-y-0 left-2.5 flex items-center pointer-events-none text-zinc-500"><Search size={12}/></div>
                  <input type="text" className="w-full bg-zinc-950 border border-zinc-800 rounded-lg pl-8 pr-3 py-1.5 text-xs text-zinc-300 focus:border-sky-500/50 focus:ring-1 focus:ring-sky-500/20 outline-none transition-all placeholder:text-zinc-600 font-medium" placeholder="Buscar por nombre o cédula..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}/>
                  {searchTerm && <button onClick={() => setSearchTerm("")} className="absolute inset-y-0 right-2 flex items-center text-zinc-500 hover:text-white"><XCircle size={12}/></button>}
              </div>
           </div>
           
           <div className="flex-1 overflow-y-auto custom-scrollbar p-2 space-y-2">
              {filteredRecords.length === 0 && airtableRecords.length > 0 && <div className="text-center p-4 text-xs text-zinc-500 font-medium">No se encontraron atletas.</div>}
              {filteredRecords.map(r => (
                <div key={r.id} className={`group p-2.5 rounded-lg border transition-all text-xs flex flex-col gap-1.5 relative overflow-hidden ${r.statusIA === 'listo' ? 'bg-sky-950/10 border-sky-500/30' : 'bg-zinc-900/40 border-zinc-800/60 hover:border-zinc-700'}`}>
                   {r.statusIA === 'listo' && <div className="absolute top-0 right-0 w-2 h-2 bg-sky-500 rounded-bl shadow-[0_0_10px_rgba(14,165,233,0.5)]"></div>}
                   <div className="flex justify-between items-start gap-2">
                      <div className="flex-1 min-w-0">
                        <span className="font-bold text-zinc-200 block text-[11px] mb-0.5 truncate uppercase" title={r.nombre}>{r.nombre}</span>
                        <span className="text-[10px] text-zinc-500 font-mono flex items-center gap-1"><Hash size={10}/> {r.cedula}</span>
                      </div>
                      <div className="flex items-center gap-1">
                          {r.fotoUrl && <button onClick={() => setSelectedImage(r.fotoUrl)} className="w-7 h-7 flex items-center justify-center rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white border border-zinc-700" title="Ver comprobante original"><ImageIcon size={12}/></button>}
                          <button onClick={() => scanReceiptIA(r)} disabled={scanningId === r.id} className="w-7 h-7 flex items-center justify-center rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-sky-400 border border-zinc-700" title="Re-escanear">{scanningId === r.id ? <Loader2 size={12} className="animate-spin"/> : <Scan size={12}/>}</button>
                          <button onClick={() => openManualVerify(r)} className="w-7 h-7 flex items-center justify-center rounded bg-zinc-800 hover:bg-emerald-600 text-zinc-400 hover:text-white transition-colors border border-transparent hover:border-emerald-500/50" title="Validación Manual"><Check size={12}/></button>
                      </div>
                   </div>
                   {r.docExtraido && (
                       <div className="mt-1 pt-1.5 border-t border-zinc-800/50 flex flex-col gap-0.5">
                          <div className="flex justify-between items-center">
                              <span className="text-[9px] text-zinc-500 uppercase font-bold tracking-wider">DOC DETECTADO</span>
                              <span className="text-[10px] font-mono font-bold text-emerald-400 bg-emerald-950/30 px-1.5 rounded">{r.docExtraido}</span>
                          </div>
                          {r.tipoComprobante === 'FISICO' && <span className="text-[8px] text-amber-500 font-bold bg-amber-950/20 px-1 rounded w-fit mt-0.5">COMPROBANTE FÍSICO</span>}
                       </div>
                   )}
                </div>
              ))}
           </div>
        </div>

        {/* WORKSPACE */}
        <div className="flex-1 flex flex-col bg-zinc-950 relative">
           <div className="p-4 border-b border-zinc-800 bg-zinc-900/20 flex gap-4 h-24 items-center shrink-0 z-10">
              <div className="flex-1 h-full relative group">
                  <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-zinc-600"><FileText size={16}/></div>
                  <textarea className="w-full h-full bg-zinc-950 border border-zinc-800 rounded-xl pl-10 pr-10 p-3 text-xs font-mono text-zinc-300 resize-none focus:border-sky-500/50 focus:ring-1 focus:ring-sky-900/50 outline-none leading-tight transition-all shadow-inner" placeholder="Pega aquí el reporte del banco..." value={bankData} onChange={(e) => setBankData(e.target.value)}/>
                  {bankData && <button onClick={() => setBankData("")} className="absolute top-3 right-3 text-zinc-600 hover:text-white bg-zinc-900 hover:bg-rose-500/20 rounded p-1 transition-all"><Eraser size={14}/></button>}
              </div>
              <div className="flex flex-col gap-2 h-full justify-center">
                  <button ref={runBtnRef} onClick={processMatches} className="flex-1 px-8 bg-gradient-to-br from-sky-600 to-indigo-600 hover:from-sky-500 hover:to-indigo-500 text-white font-black text-xs rounded-lg uppercase tracking-wider flex flex-col justify-center items-center gap-1 shadow-xl shadow-indigo-900/20 active:scale-95 transition-all border border-sky-500/20" title="Ctrl + Enter"><ArrowRight size={18}/> <span className="text-[10px] opacity-80">EJECUTAR</span></button>
                  {perfectMatchesCount > 0 && (
                      <button ref={bulkBtnRef} onClick={handleBulkConfirm} className="flex-1 px-4 bg-emerald-600/10 hover:bg-emerald-600/20 border border-emerald-500/30 text-emerald-400 hover:text-emerald-300 font-bold text-[10px] rounded-lg uppercase tracking-wide flex items-center justify-center gap-2 transition-all" title="Ctrl + Shift + Enter">
                          <CheckCheck size={14}/> VALIDAR {perfectMatchesCount} PERFECTOS
                      </button>
                  )}
              </div>
           </div>

           {/* RESULTS */}
           <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-3 bg-zinc-950">
              {matches.length === 0 && <div className="h-full flex flex-col items-center justify-center text-zinc-800 gap-4"><LayoutDashboard size={64} strokeWidth={0.5} className="opacity-20"/><span className="text-xs font-bold uppercase tracking-widest opacity-40">Esperando datos para procesar...</span></div>}
              {matches.map((m, i) => (
                <div key={i} className={`flex items-stretch rounded-xl border transition-all text-sm h-auto min-h-[5rem] shadow-lg relative overflow-hidden group 
                    ${m.status === 'verified' ? 'bg-zinc-900/30 border-emerald-900/30 opacity-60' 
                    : m.status === 'fraud' ? 'bg-rose-950/10 border-rose-900/40' 
                    : m.status === 'doc_mismatch' ? 'bg-orange-950/10 border-orange-900/40'
                    : 'bg-zinc-900/80 border-zinc-800 hover:border-zinc-700'}`}>
                  
                  <div className={`w-1.5 shrink-0 
                      ${m.status === 'verified' ? 'bg-emerald-500' 
                      : m.status === 'fraud' ? 'bg-rose-500' 
                      : m.status === 'doc_mismatch' ? 'bg-orange-500'
                      : m.isGroupPayment ? 'bg-violet-500' 
                      : m.paymentStatus === 'underpaid' ? 'bg-amber-500' 
                      : m.status === 'found' ? 'bg-sky-500' 
                      : 'bg-zinc-700'}`}></div>

                  <div className="w-[240px] p-4 border-r border-zinc-800/50 flex flex-col justify-center shrink-0 bg-zinc-900/50">
                     <div className="flex justify-between items-baseline mb-2">
                        <span className="text-[9px] font-black text-zinc-600 uppercase tracking-wider">BANCO</span>
                        <span className={`font-mono font-bold text-sm ${m.paymentStatus === 'underpaid' ? 'text-amber-500' : 'text-emerald-400'}`}>${m.bank.monto.toFixed(2)}</span>
                     </div>
                     <span className="font-mono text-white font-bold tracking-tight text-sm mb-1">{m.bank.documento}</span>
                     <span className="text-[10px] text-zinc-400 truncate font-medium flex items-center gap-1" title={m.bank.depositor}>{m.bank.esInterbancaria && <Landmark size={12} className="text-amber-500"/>}{m.bank.depositor}</span>
                     
                     {/* WARNING SPECIFIC FOR DOC MISMATCH */}
                     {m.status === 'doc_mismatch' && (
                        <div className="mt-2 p-2 bg-orange-900/20 border border-orange-500/30 rounded text-[9px] text-orange-400 font-bold leading-tight flex items-center gap-2">
                            <FileX size={12} className="shrink-0"/>
                            <span>DOC NO COINCIDE CON OCR</span>
                        </div>
                     )}
                  </div>
                  <div className="flex-1 p-4 flex flex-col justify-center relative">
                     {m.records.length > 0 ? (
                        <>
                           <div className="flex justify-between items-start mb-2">
                              <div className="flex flex-col gap-0.5 w-full">
                                  <div className="flex items-center gap-2">
                                      <span className="text-[9px] font-black text-sky-700 uppercase tracking-wider">CRM MATCH</span>
                                      {m.matchType === 'documento' && <span className="text-[9px] text-emerald-500 font-bold flex items-center gap-0.5 bg-emerald-950/30 px-1.5 rounded-full"><CheckCircle2 size={10}/> DOC OK</span>}
                                      {m.records.length > 1 && <span className="text-[9px] text-violet-400 font-bold flex items-center gap-0.5 bg-violet-950/30 px-1.5 rounded-full border border-violet-500/20"><Users2 size={10}/> GRUPO DE {m.records.length}</span>}
                                  </div>
                                  <div className="flex flex-col gap-2 mt-2 w-full">
                                      {m.records.map((r, idx) => (
                                          <div key={idx} className="bg-zinc-950/40 p-2 rounded-lg border border-zinc-800/50 flex flex-col gap-1.5 relative overflow-hidden">
                                              <div className="flex justify-between items-center pr-4">
                                                  <div className="flex flex-col">
                                                      <span className="block text-[8px] font-bold text-zinc-600 uppercase mb-0.5">NOMBRE ATLETA</span>
                                                      <span className="font-bold text-zinc-200 text-sm leading-tight flex items-center gap-2">{r.nombre}</span>
                                                  </div>
                                                  {r.fotoUrl && <button onClick={() => setSelectedImage(r.fotoUrl)} className="text-[9px] bg-zinc-800 px-2 py-1 rounded text-zinc-400 hover:text-white border border-transparent hover:border-zinc-600 flex items-center gap-1 uppercase font-bold tracking-wider"><Eye size={10}/> Ver Doc</button>}
                                              </div>
                                              <div className="grid grid-cols-4 gap-2 text-[10px] text-zinc-500 bg-zinc-900/50 p-1.5 rounded border border-zinc-800/30">
                                                  <div><span className="block font-bold text-zinc-600 text-[8px] uppercase tracking-wider">Cédula</span><span className="font-mono text-zinc-300">{r.cedula}</span></div>
                                                  <div><span className="block font-bold text-zinc-600 text-[8px] uppercase tracking-wider">Edad</span><span className="font-mono text-zinc-300">{r.edad} años</span></div>
                                                  <div><span className="block font-bold text-zinc-600 text-[8px] uppercase tracking-wider">Valor Esp.</span><span className={`font-mono font-bold ${r.valorEsperado < 30 ? 'text-emerald-400' : 'text-zinc-300'}`}>${r.valorEsperado.toFixed(2)}</span></div>
                                                  {r.docExtraido && <div><span className={`block font-bold text-[8px] uppercase tracking-wider ${m.matchType === 'documento' ? 'text-emerald-500' : 'text-rose-500'}`}>OCR DETECTADO</span><span className={`font-mono font-bold ${m.matchType === 'documento' ? 'text-emerald-200' : 'text-rose-300 line-through'}`}>{r.docExtraido}</span></div>}
                                              </div>
                                          </div>
                                      ))}
                                  </div>
                              </div>
                           </div>
                        </>
                     ) : (
                        <div className="flex flex-col items-center justify-center h-full text-zinc-700 gap-1 opacity-50"><FileWarning size={20}/> <span className="text-[10px] font-bold">SIN COINCIDENCIA</span></div>
                     )}
                     {m.status === 'fraud' && <div className="absolute inset-0 bg-zinc-950/80 backdrop-blur-[1px] flex items-center justify-center z-10"><div className="bg-rose-950/90 border border-rose-500/30 text-rose-200 px-4 py-2 rounded-lg font-black text-xs flex items-center gap-2 shadow-2xl"><AlertOctagon size={16} className="text-rose-500"/> <span>ALERTA DE FRAUDE: YA USADO</span></div></div>}
                  </div>
                  <div className="w-24 p-2 flex items-center justify-center bg-zinc-950/30 border-l border-zinc-800/50">
                     {m.status === 'verified' ? (
                        <div className="flex flex-col items-center text-emerald-500 gap-1"><CheckCircle2 size={24}/><span className="text-[9px] font-bold">LISTO</span></div>
                     ) : m.records.length > 0 ? (
                        <button onClick={() => confirmInCRM(m)} className={`w-full h-full rounded-lg text-[10px] font-black uppercase transition-all flex flex-col items-center justify-center leading-tight gap-1 shadow-lg active:scale-95 group-hover:scale-105 
                            ${m.matchType !== 'documento' || m.paymentStatus === 'underpaid' 
                                ? 'bg-zinc-800 text-zinc-400 hover:bg-amber-600 hover:text-white border border-zinc-700' // Botón gris/ámbar si hay dudas
                                : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-900/20'}`}>
                           <Check size={20} strokeWidth={3}/><span>{m.matchType !== 'documento' || m.paymentStatus === 'underpaid' ? 'MANUAL' : 'OK'}</span>
                        </button>
                     ) : <div className="text-[9px] font-bold text-zinc-600 text-center flex flex-col items-center gap-1 opacity-50"><XCircle size={14}/> <span>MANUAL</span></div>}
                  </div>
                </div>
              ))}
           </div>
        </div>

        {selectedImage && <div className="fixed inset-0 z-[99999] bg-zinc-950/95 flex flex-col items-center justify-center p-8 backdrop-blur-md cursor-zoom-out" onClick={() => setSelectedImage(null)}><img src={selectedImage} className="max-w-full max-h-full rounded-lg border border-zinc-700 shadow-2xl"/></div>}
        
        {verifyModalOpen && activeVerifyRecords.length > 0 && (
            <div className="fixed inset-0 z-[99999] bg-zinc-950/80 flex items-center justify-center p-4 backdrop-blur-md">
                <div className="bg-zinc-900 p-6 rounded-2xl border border-zinc-800 w-full max-w-sm shadow-2xl relative">
                    <button onClick={() => setVerifyModalOpen(false)} className="absolute top-4 right-4 text-zinc-500 hover:text-white"><XCircle size={20}/></button>
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-3 rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/20"><CheckCircle2 size={24}/></div>
                        <div><h2 className="text-sm font-black text-white uppercase tracking-wider">Validación Manual</h2><p className="text-[10px] text-zinc-400 font-medium">Confirma los datos del pago.</p></div>
                    </div>
                    <div className="mb-4 bg-zinc-950/50 p-3 rounded-lg border border-zinc-800/50"><span className="block text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-1">ATLETA(S)</span><div className="space-y-1">{activeVerifyRecords.map((r, i) => (<div key={i} className="border-b border-zinc-800/50 last:border-0 pb-1 last:pb-0"><span className="block text-sm font-bold text-white">{r.nombre}</span><span className="block text-[10px] text-zinc-500 font-mono mt-0.5">{r.cedula}</span></div>))}</div></div>
                    <form onSubmit={executeManualVerify} className="space-y-4">
                        <div><label className="text-[10px] text-zinc-500 font-bold uppercase mb-1.5 block">Nro. Documento / Referencia</label><input type="text" className="w-full p-3 bg-zinc-950 border border-zinc-800 rounded-lg text-white focus:border-emerald-500 outline-none text-sm font-mono placeholder:text-zinc-700" value={manualDocId} onChange={e => setManualDocId(e.target.value)} placeholder="Ej: 123456" autoFocus/></div>
                        <div><label className="text-[10px] text-zinc-500 font-bold uppercase mb-1.5 block">Monto ($)</label><input type="number" step="0.01" className="w-full p-3 bg-zinc-950 border border-zinc-800 rounded-lg text-white focus:border-emerald-500 outline-none text-sm font-mono placeholder:text-zinc-700" value={manualAmount} onChange={e => setManualAmount(e.target.value)} placeholder="0.00"/></div>
                        <button className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-black rounded-lg uppercase tracking-widest text-xs transition-all shadow-lg shadow-emerald-900/20 active:scale-95 flex items-center justify-center gap-2"><Check size={16}/> CONFIRMAR PAGO</button>
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

const Badge = ({ type, children }: any) => {
    const styles: any = { warning: 'bg-orange-500/10 text-orange-400 border-orange-500/20', info: 'bg-blue-500/10 text-blue-400 border-blue-500/20', purple: 'bg-violet-500/10 text-violet-400 border-violet-500/20', success: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' };
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
                <div><label className="text-[10px] text-zinc-500 font-bold uppercase mb-1.5 block">Airtable API Key</label><input type="password" className="w-full p-3 bg-zinc-950 border border-zinc-800 rounded-lg text-center text-white focus:border-sky-500 outline-none text-xs font-mono" value={config.apiKey} onChange={e => setConfig({...config, apiKey: e.target.value})} placeholder="pat..." required/></div>
                <button className="w-full py-3 bg-white hover:bg-zinc-200 text-black font-black rounded-lg uppercase tracking-widest text-xs transition-colors">GUARDAR CAMBIOS</button>
            </form>
        </div>
    </div>
);