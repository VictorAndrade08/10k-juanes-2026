"use client";

import React, { useState, useCallback, ChangeEvent, useRef, useEffect } from "react";
import {
  User,
  CreditCard,
  Mail,
  Phone,
  Trash2,
  Landmark,
  CheckCircle2,
  AlertCircle,
  UploadCloud,
  X,
  ChevronRight,
  ChevronLeft,
  Calendar,
  MapPin,
  Info,
  Trophy,
  HelpCircle,
  RefreshCcw,
  Search,
  ArrowRight
} from "lucide-react";

// --- Interfaces ---
interface FormDataState {
  cedula: string;
  nombres: string;
  apellidos: string;
  ciudad: string;
  email: string;
  telefono: string;
  edad: string;
  genero: string;
  comprobante: File | null;
}

interface Category {
  name: string;
  price: number;
  desc: string;
}

// --- Componente: Modal de Alertas (MEJORADO CON REDIRECCIÓN) ---
const CustomModal = ({
  isOpen,
  title,
  message,
  type = "error",
  actionLabel,
  onAction,
  onClose,
}: {
  isOpen: boolean;
  title: string;
  message: string;
  type?: "success" | "error" | "warning";
  actionLabel?: string;
  onAction?: () => void;
  onClose: () => void;
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-[#141820] border border-white/10 w-full max-w-md rounded-2xl p-6 md:p-8 shadow-2xl relative animate-in zoom-in-95">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition p-2"
        >
          <X size={28} />
        </button>
        <div className="flex flex-col items-center text-center gap-6">
          <div
            className={`w-16 h-16 md:w-20 md:h-20 rounded-full flex items-center justify-center ${
              type === "error"
                ? "bg-red-500/20 text-red-500"
                : type === "warning"
                ? "bg-yellow-500/20 text-yellow-500"
                : "bg-green-500/20 text-green-500"
            }`}
          >
            {type === "error" && <AlertCircle size={36} />}
            {type === "warning" && <AlertCircle size={36} />}
            {type === "success" && <CheckCircle2 size={36} />}
          </div>
          <h3 className="text-3xl md:text-4xl font-bold text-white uppercase font-bebas">
            {title}
          </h3>
          <p className="text-gray-300 text-lg leading-relaxed font-barlow">{message}</p>
          
          <div className="flex flex-col w-full gap-3 mt-2">
            {actionLabel && onAction && (
              <button
                onClick={onAction}
                className="w-full py-4 bg-[#9B5CFF] hover:bg-[#8344e3] text-white font-bold text-lg md:text-xl rounded-xl transition font-barlow flex items-center justify-center gap-2 shadow-lg shadow-[#9B5CFF]/20"
              >
                {actionLabel} <ArrowRight size={20}/>
              </button>
            )}
            <button
              onClick={onClose}
              className={`w-full py-4 font-bold text-lg md:text-xl rounded-xl transition font-barlow ${actionLabel ? 'bg-[#1A1E29] text-gray-400 hover:text-white hover:bg-[#252A36]' : 'bg-white text-black hover:bg-gray-200'}`}
            >
              {actionLabel ? 'Cerrar' : 'Entendido'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- Componente: Modal de Descuento (3ra Edad) ---
const DiscountModal = ({
  isOpen,
  onConfirm,
  onCancel,
}: {
  isOpen: boolean;
  onConfirm: (isSenior: boolean) => void;
  onCancel: () => void;
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/95 backdrop-blur-md animate-in fade-in duration-300">
      <div className="bg-[#1C2029] border border-[#9B5CFF]/30 w-full max-w-lg rounded-3xl p-6 md:p-8 shadow-[0_0_50px_rgba(155,92,255,0.15)] relative animate-in zoom-in-95">
        <button
          onClick={onCancel}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition p-2"
        >
          <X size={28} />
        </button>
        
        <div className="flex flex-col items-center text-center gap-6">
          <div className="w-20 h-20 bg-[#9B5CFF]/10 text-[#9B5CFF] rounded-full flex items-center justify-center animate-bounce">
            <HelpCircle size={44} />
          </div>
          
          <div>
            <h3 className="text-3xl md:text-4xl font-bold text-white uppercase mb-3 font-barlow">
              ¿Aplica descuento?
            </h3>
            <p className="text-gray-300 text-lg md:text-xl leading-relaxed font-barlow">
              ¿Eres una persona de la <strong className="text-white">Tercera Edad</strong> (65 años o más)?
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full mt-2 font-barlow">
            <button
              onClick={() => onConfirm(true)}
              className="py-5 px-6 bg-white text-black font-bold text-lg rounded-xl hover:bg-gray-200 transition flex flex-col items-center justify-center gap-1 shadow-lg"
            >
              <span>SÍ, tengo 65+</span>
              <span className="text-sm md:text-base text-green-700 font-bold">Pagas $20</span>
            </button>
            
            <button
              onClick={() => onConfirm(false)}
              className="py-5 px-6 bg-[#0F1218] border border-white/10 text-white font-bold text-lg rounded-xl hover:bg-[#1A1E29] hover:border-white/30 transition flex flex-col items-center justify-center gap-1"
            >
              <span>NO, soy menor</span>
              <span className="text-sm md:text-base text-gray-400 font-medium">Pagas $30</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- COMPONENTE PRINCIPAL ---
export default function InscripcionPage() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  // Modals & Links
  const [modalState, setModalState] = useState({ 
    isOpen: false, 
    title: "", 
    message: "", 
    type: "error" as "error" | "success" | "warning",
    actionLabel: undefined as string | undefined,
    onAction: undefined as (() => void) | undefined
  });
  const [discountModalOpen, setDiscountModalOpen] = useState(false);
  
  // Selección
  const [pendingCategory, setPendingCategory] = useState<Category | null>(null);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedPrice, setSelectedPrice] = useState<number>(0);
  
  // Archivo
  const [previewName, setPreviewName] = useState("");
  const [uploadedFileUrl, setUploadedFileUrl] = useState<string>("");

  // Refs
  const componentRef = useRef<HTMLDivElement | null>(null);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const didMount = useRef(false);

  // Form Data Inicial
  const initialFormData: FormDataState = {
    cedula: "",
    nombres: "",
    apellidos: "",
    ciudad: "",
    email: "",
    telefono: "",
    edad: "",
    genero: "",
    comprobante: null,
  };

  const [formData, setFormData] = useState<FormDataState>(initialFormData);

  // Función para reiniciar el formulario
  const handleReset = () => {
    setStep(1);
    setFormData(initialFormData);
    setSelectedCategory("");
    setSelectedPrice(0);
    setPreviewName("");
    setUploadedFileUrl("");
    setAcceptTerms(false);
    setErrors({});
    
    // Scroll al inicio
    if (componentRef.current) {
        componentRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  // Categorías
  const categories: Category[] = [
    { name: "Élite (Abierta)", price: 30, desc: "Categoría principal" },
    { name: "Senior 1", price: 30, desc: "20–29 años" },
    { name: "Senior 2", price: 30, desc: "30–39 años" },
    { name: "Máster", price: 30, desc: "40–49 años" },
    { name: "Súper Máster", price: 30, desc: "50–59 años" },
    { name: "Vilcabambas", price: 30, desc: "60 años en adelante" },
    { name: "Juvenil", price: 30, desc: "14–19 años" },
    { name: "Colegial Tungurahua", price: 30, desc: "14–18 años" },
    { name: "Capacidades Especiales", price: 20, desc: "Todas las edades" },
    { name: "Interfuerzas", price: 30, desc: "Fuerzas del orden" },
  ];

  // --- Efectos ---
  useEffect(() => {
    if (!didMount.current) {
      didMount.current = true;
      return;
    }

    if (componentRef.current) {
      const topOffset = 80;
      const elementPosition = componentRef.current.getBoundingClientRect().top + window.scrollY;
      window.scrollTo({
        top: elementPosition - topOffset,
        behavior: "smooth",
      });
    }
  }, [step]);

  // --- Lógica del Formulario ---

  const showAlert = (title: string, message: string, type: "error" | "warning" | "success" = "error", actionLabel?: string, onAction?: () => void) => {
    setModalState({ isOpen: true, title, message, type, actionLabel, onAction });
  };

  const handleCategoryClick = (cat: Category) => {
    if (cat.name === "Vilcabambas") {
      setPendingCategory(cat);
      setDiscountModalOpen(true);
    } else {
      setSelectedCategory(cat.name);
      setSelectedPrice(cat.price);
      setStep(2);
    }
  };

  const handleDiscountConfirm = (isSenior: boolean) => {
    if (pendingCategory) {
      setSelectedCategory(pendingCategory.name);
      setSelectedPrice(isSenior ? 20 : pendingCategory.price);
      setStep(2);
    }
    setDiscountModalOpen(false);
  };

  const handleInput = useCallback(
    (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      const { name, value } = e.target;
      const files = (e.target as HTMLInputElement).files;

      if (errors[name]) {
        setErrors((prev) => ({ ...prev, [name]: "" }));
      }

      if (files && files[0]) {
        const file = files[0];
        if (file.size > 10_000_000) {
          showAlert("Archivo muy pesado", "El archivo no debe superar los 10MB.");
          return;
        }
        setFormData((f) => ({ ...f, [name]: file }));
        setPreviewName(file.name);
        return;
      }
      setFormData((f) => ({ ...f, [name]: value }));
    },
    [errors]
  );

  const clearFile = useCallback(() => {
    setFormData((f) => ({ ...f, comprobante: null }));
    setPreviewName("");
  }, []);

  const validateStep2 = () => {
    const requiredFields: (keyof FormDataState)[] = [
      "cedula", "nombres", "apellidos", "ciudad", "email", "telefono", "edad", "genero",
    ];
    const newErrors: Record<string, string> = {};
    let isValid = true;

    for (const f of requiredFields) {
      if (!formData[f]) {
        newErrors[f] = "Este campo es obligatorio";
        isValid = false;
      }
    }
    setErrors(newErrors);
    return isValid;
  };

  // --- BLOQUEO INTELIGENTE (LA LÓGICA DE REDDIT) ---
  const checkUserExists = async () => {
    if (!formData.cedula || formData.cedula.length < 6) return false;
    setVerifying(true);
    try {
      const res = await fetch(
        `https://mandarinas.10kindependenciadeambato.com/wp-json/mandarinas/v1/verificar-cedula?cedula=${formData.cedula}`,
        { cache: "no-store" }
      );
      const json = await res.json();
      setVerifying(false);
      
      if (json && json.exists) {
        const nombreExistente = json.datos?.nombre || "Usuario";
        // AQUÍ ESTA LA LÓGICA CLAVE:
        // No solo bloqueamos, ofrecemos la solución inmediata.
        showAlert(
          "⛔ YA REGISTRADO",
          `La cédula ${formData.cedula} (${nombreExistente}) ya tiene una inscripción activa. Si tuviste un problema con tu pago o necesitas corregirlo, no te inscribas de nuevo.`,
          "error",
          "Corregir mi Pago", // Texto del Botón
          () => window.location.href = '/verificar' // Acción: Llevar a la página de auto-reparación
        );
        return true; 
      }
      return false; 
    } catch (e) {
      console.error("Error verificando:", e);
      setVerifying(false);
      return false; 
    }
  };

  const handleCedulaBlur = () => {
    if (formData.cedula.length >= 10) {
      checkUserExists();
    }
  };

  const submitForm = async () => {
    if (submitting) return;
    setSubmitting(true);

    if (!selectedCategory || !formData.comprobante) {
      showAlert("Datos incompletos", "Falta categoría o comprobante.");
      setSubmitting(false);
      return;
    }

    setLoading(true);

    const body = new FormData();
    body.append("categoria", selectedCategory);
    body.append("precio", selectedPrice.toString());
    
    (Object.keys(formData) as Array<keyof FormDataState>).forEach((key) => {
      if (key !== "comprobante") {
        const value = formData[key];
        if (value !== null) body.append(key, String(value));
      }
    });

    if (formData.comprobante instanceof File) {
      body.append("comprobante", formData.comprobante, formData.comprobante.name);
    }

    try {
      const res = await fetch(
        "https://mandarinas.10kindependenciadeambato.com/wp-json/mandarinas/v1/inscribir",
        { method: "POST", body, cache: "no-store" }
      );
      const rawText = await res.text();
      let json: any = null;
      try { json = rawText ? JSON.parse(rawText) : null; } catch { json = null; }

      setLoading(false);

      if (!res.ok || !json || json.status !== "success") {
        showAlert("Error", json?.message || "No se pudo guardar la inscripción. Intenta de nuevo.");
        setSubmitting(false);
        return;
      }

      if (json?.file_url) setUploadedFileUrl(String(json.file_url));
      setStep(4);

    } catch (err) {
      setLoading(false);
      showAlert("Error de conexión", "Revisa tu internet e inténtalo de nuevo.");
    }
    setSubmitting(false);
  };

  const stepsLabels = ["Categoría", "Datos", "Pago", "Final"];

  const renderInputField = (name: keyof FormDataState, label: string, icon: React.ReactNode, type: string = "text", onBlur?: () => void) => (
    <div className="relative group">
      <label className="text-sm md:text-base font-bold text-gray-300 uppercase tracking-wide mb-2 flex items-center gap-2 font-barlow">
        {icon} {label}
      </label>
      <input
        name={name}
        type={type}
        value={formData[name] ? String(formData[name]) : ""}
        onChange={handleInput}
        onBlur={onBlur}
        placeholder={`Ingresa tu ${label.toLowerCase()}...`}
        className={`
          w-full bg-[#0F1218] border rounded-xl 
          px-5 py-4 
          text-white text-lg md:text-xl placeholder-gray-600 
          outline-none transition-all font-barlow
          ${errors[name] 
            ? "border-red-500/50 focus:border-red-500" 
            : "border-white/10 focus:border-[#9B5CFF] hover:border-white/20"}
        `}
      />
      {errors[name] && (
        <p className="text-red-400 text-sm mt-2 flex items-center gap-1 font-medium font-barlow">
          <AlertCircle size={16} /> {errors[name]}
        </p>
      )}
    </div>
  );

  return (
    <main className="min-h-screen w-full bg-transparent text-white px-3 py-6 md:px-4 md:py-12 flex justify-center items-start">
      
      {/* INYECCIÓN DE FUENTES */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@400;500;600;700&family=Bebas+Neue&display=swap');
        .font-barlow { font-family: 'Barlow Condensed', sans-serif; }
        .font-bebas { font-family: 'Bebas Neue', sans-serif; }
      `}</style>
      
      {/* Modales */}
      <CustomModal 
        isOpen={modalState.isOpen} 
        title={modalState.title} 
        message={modalState.message} 
        type={modalState.type} 
        actionLabel={modalState.actionLabel}
        onAction={modalState.onAction}
        onClose={() => setModalState({ ...modalState, isOpen: false })} 
      />
      <DiscountModal 
        isOpen={discountModalOpen}
        onCancel={() => setDiscountModalOpen(false)}
        onConfirm={handleDiscountConfirm}
      />

      {/* Contenedor Principal */}
      <div ref={componentRef} className="w-full max-w-7xl mx-auto bg-[#1C2029]/80 backdrop-blur-xl rounded-[24px] md:rounded-[32px] border border-white/5 shadow-2xl overflow-hidden flex flex-col md:flex-row">
        
        {/* --- SIDEBAR / HEADER (Responsivo) --- */}
        <div className="bg-[#11141A] p-6 md:p-12 md:w-1/3 flex flex-col justify-between border-b md:border-b-0 md:border-r border-white/5 relative min-w-[300px]">
          <div>
            {/* LOGO */}
            <div className="flex items-center gap-4 mb-6 md:mb-12">
               <div className="w-14 h-14 md:w-16 md:h-16 rounded-xl md:rounded-2xl bg-[#C02485] shadow-lg flex items-center justify-center shrink-0">
                 <img src="/white.svg" alt="Logo" className="w-8 h-8 md:w-10 md:h-10 object-contain" />
               </div>
               <span className="text-2xl md:text-[32px] uppercase tracking-tight text-white leading-none font-bebas">
                 10K Ruta de los <br className="hidden md:block"/> Tres Juanes
               </span>
            </div>

            {/* BARRA DE PROGRESO (Móvil) */}
            <div className="md:hidden mb-2">
                <div className="flex items-center justify-between mb-2 font-barlow">
                    <span className="text-xs text-gray-300 font-bold uppercase tracking-wider">Paso {step} de 4</span>
                    <span className="text-white font-bold uppercase text-xs">{stepsLabels[step-1]}</span>
                </div>
                <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full bg-[#9B5CFF] transition-all duration-500" style={{ width: `${(step / 4) * 100}%` }} />
                </div>
            </div>

            {/* LISTA DE PASOS (Desktop) */}
            <div className="hidden md:block space-y-8 relative z-10 font-barlow">
              {stepsLabels.map((label, index) => {
                const stepNum = index + 1;
                const active = step === stepNum;
                const completed = step > stepNum;
                return (
                  <div key={index} className={`flex items-center gap-5 transition-all duration-300 ${active ? "opacity-100 translate-x-2" : "opacity-40"}`}>
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg transition-all border-2 ${active ? `bg-[#9B5CFF] border-[#9B5CFF] text-white` : completed ? "bg-green-500 border-green-500 text-black" : "bg-transparent border-white/20 text-white"}`}>
                      {completed ? <CheckCircle2 size={24} /> : stepNum}
                    </div>
                    <div>
                      <p className={`text-xl font-bold uppercase tracking-wider ${active ? "text-white" : "text-gray-400"}`}>{label}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          
          <div className="hidden md:block mt-16 md:mt-0 text-base text-gray-400 relative z-10 font-medium font-barlow">
            © 2026 Ruta de los Tres Juanes. <br/> Ambato, Ecuador.
          </div>
        </div>

        {/* --- ÁREA DE CONTENIDO --- */}
        <div className="p-5 md:p-14 md:w-2/3 bg-[#161A23] relative min-h-[500px]">
          
          {/* Overlay de Carga */}
          {(loading || verifying) && (
            <div className="absolute inset-0 z-50 bg-[#161A23]/95 backdrop-blur-sm flex flex-col items-center justify-center gap-6 animate-in fade-in">
              <div className="w-16 h-16 border-4 border-[#9B5CFF] border-t-transparent rounded-full animate-spin" />
              <p className="text-white font-bold animate-pulse tracking-widest uppercase text-lg md:text-xl font-barlow">
                {verifying ? "Verificando cédula..." : "Procesando inscripción..."}
              </p>
            </div>
          )}

          <div className="max-w-3xl mx-auto">
            
            {/* --- PASO 1: CATEGORÍA --- */}
            {step === 1 && (
              <div className="animate-in slide-in-from-bottom-4 duration-500 fade-in">
                <h1 className="text-4xl md:text-6xl font-bold mb-4 font-bebas">Selecciona tu Categoría</h1>
                <p className="text-gray-300 mb-6 md:mb-8 text-lg md:text-xl leading-relaxed font-barlow">
                  Elige la categoría en la que vas a competir. El precio se ajustará automáticamente.
                </p>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-5 font-barlow">
                  {categories.map((cat) => (
                    <button
                      key={cat.name}
                      onClick={() => handleCategoryClick(cat)}
                      className="group relative bg-[#0F1218] border border-white/10 p-6 md:p-7 rounded-2xl text-left hover:border-[#9B5CFF] hover:bg-[#1A1E29] transition-all duration-200 active:scale-[0.98] h-full flex flex-col justify-between shadow-md"
                    >
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex items-center gap-3">
                           <div className="p-2 rounded-lg bg-white/5 group-hover:bg-[#9B5CFF]/20 text-gray-400 group-hover:text-[#9B5CFF] transition-colors">
                             <Trophy size={24} />
                           </div>
                           <span className="font-bold text-xl md:text-2xl text-white group-hover:text-[#9B5CFF] transition-colors leading-tight">{cat.name}</span>
                        </div>
                        <div className="text-right">
                          <span className="bg-white/5 text-sm md:text-base px-3 py-1 rounded-lg text-gray-200 font-mono font-bold block border border-white/5">
                            ${cat.price}
                          </span>
                        </div>
                      </div>
                      <p className="text-base md:text-lg text-gray-400 group-hover:text-gray-300 pl-11">{cat.desc}</p>
                      {cat.name === "Vilcabambas" && (
                         <span className="text-sm md:text-base text-green-400 font-bold mt-2 block pl-11 uppercase tracking-wider">
                           O $20 para Tercera Edad
                         </span>
                      )}
                    </button>
                  ))}
                </div>

                <div className="mt-8 bg-yellow-500/5 border border-yellow-500/20 rounded-2xl p-6 flex items-start gap-4">
                  <div className="p-2 bg-yellow-500/10 rounded-full text-yellow-500 shrink-0"><Info size={28} /></div>
                  <div className="font-barlow">
                    <h4 className="text-yellow-500 font-bold uppercase text-sm md:text-base mb-2 tracking-wide">Nota Importante</h4>
                    <p className="text-gray-200 leading-relaxed text-base md:text-lg">
                      Solo participas en la categoría que escojas. El premio económico aplica únicamente para la categoría seleccionada.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* --- PASO 2: DATOS --- */}
            {step === 2 && (
              <div className="animate-in slide-in-from-bottom-4 duration-500 fade-in">
                <h1 className="text-4xl md:text-6xl font-bold mb-8 font-bebas">Tus Datos Personales</h1>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-8 mb-8">
                  <div className="md:col-span-2">
                    {renderInputField("cedula", "Cédula o Pasaporte", <CreditCard size={20} />, "number", handleCedulaBlur)}
                  </div>
                  {renderInputField("nombres", "Nombres", <User size={20} />)}
                  {renderInputField("apellidos", "Apellidos", <User size={20} />)}
                  {renderInputField("ciudad", "Ciudad", <Landmark size={20} />)}
                  {renderInputField("telefono", "Teléfono", <Phone size={20} />, "tel")}
                  <div className="md:col-span-2">
                    {renderInputField("email", "Correo Electrónico", <Mail size={20} />, "email")}
                  </div>
                  
                  <div>
                    <label className="text-sm md:text-base font-bold text-gray-300 uppercase tracking-wide mb-2 flex items-center gap-2 font-barlow"><User size={20} /> Edad</label>
                    <input name="edad" type="number" value={formData.edad} onChange={handleInput} placeholder="Ej: 25" className="w-full bg-[#0F1218] border border-white/10 rounded-xl px-5 py-4 text-white text-lg md:text-xl outline-none focus:border-[#9B5CFF] font-barlow" />
                  </div>

                  <div>
                    <label className="text-sm md:text-base font-bold text-gray-300 uppercase tracking-wide mb-2 flex items-center gap-2 font-barlow"><User size={20} /> Género</label>
                    <select name="genero" value={formData.genero} onChange={handleInput} className="w-full bg-[#0F1218] border border-white/10 rounded-xl px-5 py-4 text-white text-lg md:text-xl outline-none focus:border-[#9B5CFF] appearance-none font-barlow">
                      <option value="">Seleccione...</option>
                      <option value="Masculino">Masculino</option>
                      <option value="Femenino">Femenino</option>
                      <option value="Otro">Otro</option>
                    </select>
                  </div>
                </div>

                <div className="bg-[#0F1218] p-5 md:p-6 rounded-2xl border border-white/5 mb-8">
                   <label className="flex items-start gap-4 cursor-pointer">
                    <input type="checkbox" checked={acceptTerms} onChange={(e) => setAcceptTerms(e.target.checked)} className="mt-1 w-6 h-6 accent-[#9B5CFF]" />
                    <span className="text-base md:text-lg text-gray-300 leading-relaxed font-barlow">
                      Acepto los <a href="/terminos" target="_blank" className="text-[#9B5CFF] underline font-bold hover:text-[#FF4EC4]">Términos y Condiciones</a> y declaro estar apto físicamente para la competencia.
                    </span>
                  </label>
                </div>

                <div className="flex gap-4 font-barlow">
                  <button onClick={() => setStep(1)} className="px-6 md:px-10 py-5 rounded-xl border border-white/10 hover:bg-white/5 transition font-bold text-gray-300 flex items-center gap-2 text-lg md:text-xl">
                    <ChevronLeft size={24} /> Atrás
                  </button>
                  <button onClick={async () => {
                      if (!acceptTerms) {
                        showAlert("Atención", "Debes aceptar los términos y condiciones.", "warning");
                        return;
                      }
                      if (validateStep2()) {
                        // VERIFICACIÓN ESTRICTA:
                        // Si "exists" es TRUE, el modal se muestra en checkUserExists y NO avanzamos.
                        const exists = await checkUserExists();
                        if (!exists) setStep(3);
                      }
                    }} 
                    className="flex-1 bg-white text-black py-5 rounded-xl font-bold hover:bg-gray-200 transition flex items-center justify-center gap-2 text-lg md:text-xl shadow-lg"
                  >
                    Siguiente <ChevronRight size={24} />
                  </button>
                </div>
              </div>
            )}

            {/* --- PASO 3: PAGO --- */}
            {step === 3 && (
              <div className="animate-in slide-in-from-right-8 duration-500 fade-in">
                <h1 className="text-4xl md:text-6xl font-bold mb-8 font-bebas">Realiza tu Pago</h1>
                
                <div className="bg-gradient-to-br from-[#1A1E29] to-black border border-white/10 rounded-2xl p-6 md:p-10 mb-8 shadow-lg font-barlow">
                  <div className="flex items-center gap-5 mb-8 pb-6 border-b border-white/10">
                    <div className="bg-[#9B5CFF]/20 p-4 rounded-full text-[#9B5CFF]"><Landmark size={32} /></div>
                    <div>
                      <p className="text-sm md:text-base text-gray-400 uppercase tracking-wider mb-1">Institución Financiera</p>
                      <p className="font-bold text-2xl md:text-3xl">Banco Pichincha</p>
                    </div>
                  </div>
                  
                  <div className="space-y-6 text-lg md:text-xl">
                    <div className="flex justify-between items-center">
                        <span className="text-gray-500">Cuenta Corriente:</span>
                        <span className="font-mono text-white bg-white/5 px-3 py-1 rounded border border-white/10">2100057760</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-gray-500">Tipo:</span>
                        <span className="text-right text-white font-medium">Corriente</span>
                    </div>
                    <div className="flex justify-between items-start">
                      <span className="text-gray-500">Titular:</span>
                      <span className="text-right text-white max-w-[200px] leading-tight">Asoc. Periodistas Deportivos Tungurahua</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-gray-500">RUC:</span>
                        <span className="font-mono text-white">1891715141001</span>
                    </div>
                     <div className="flex justify-between items-center pt-6 border-t border-white/10 mt-6">
                      <span className="text-gray-300 font-bold text-2xl md:text-3xl">Total a pagar:</span>
                      <span className="text-[#FF4EC4] font-black text-4xl md:text-5xl">${selectedPrice}.00</span>
                    </div>
                  </div>
                </div>

                <div className="mb-10">
                  <label className="text-base md:text-lg font-bold text-gray-300 mb-3 block uppercase tracking-wide font-barlow">Subir Comprobante (Foto/PDF)</label>
                  {!previewName ? (
                    <label className="flex flex-col items-center justify-center w-full h-32 md:h-48 border-2 border-dashed border-gray-600 rounded-2xl cursor-pointer hover:border-[#9B5CFF] hover:bg-[#9B5CFF]/5 transition-all bg-[#0F1218]">
                      <UploadCloud className="w-12 h-12 md:w-16 md:h-16 mb-2 text-gray-400" />
                      <p className="text-sm md:text-lg text-gray-400 font-barlow">Toca aquí para subir tu archivo</p>
                      <input type="file" name="comprobante" accept="image/*,application/pdf" onChange={handleInput} className="hidden" />
                    </label>
                  ) : (
                     <div className="flex items-center justify-between bg-[#9B5CFF]/10 p-5 rounded-2xl border border-[#9B5CFF]/30">
                      <div className="flex items-center gap-4 overflow-hidden">
                        <CheckCircle2 className="text-green-500 shrink-0" size={28} />
                        <span className="text-base md:text-xl text-gray-200 truncate font-bold">{previewName}</span>
                      </div>
                      <button onClick={clearFile} className="text-red-400 p-3 hover:bg-red-500/10 rounded-xl transition"><Trash2 size={24} /></button>
                    </div>
                  )}
                </div>

                <div className="flex gap-4 font-barlow">
                  <button onClick={() => setStep(2)} className="px-6 md:px-10 py-5 rounded-xl border border-white/10 hover:bg-white/5 transition font-bold text-gray-300 flex items-center gap-2 text-lg md:text-xl">
                     Atrás
                  </button>
                  <button onClick={submitForm} disabled={submitting} className="flex-1 bg-[#9B5CFF] hover:bg-[#8A4DE0] text-white py-5 rounded-xl font-bold shadow-[0_0_20px_#9B5CFF50] transition disabled:opacity-50 disabled:cursor-not-allowed text-lg md:text-xl">
                    {submitting ? "Finalizando..." : "Confirmar Inscripción"}
                  </button>
                </div>
              </div>
            )}

            {/* --- PASO 4: RESUMEN FINAL --- */}
            {step === 4 && (
              <div className="text-center animate-in zoom-in-95 duration-500 fade-in py-10">
                <div className="w-24 h-24 md:w-32 md:h-32 bg-green-500/20 text-green-500 rounded-full flex items-center justify-center mx-auto mb-8 shadow-[0_0_50px_#22c55e40]">
                  <CheckCircle2 size={64} />
                </div>
                <h1 className="text-4xl md:text-6xl font-bold mb-6 text-white font-bebas">¡Inscripción Exitosa!</h1>
                <p className="text-gray-300 mb-10 px-4 text-lg md:text-2xl leading-relaxed max-w-2xl mx-auto font-barlow">
                  Hemos recibido tus datos correctamente. Tu pago será validado en los siguientes <strong className="text-white">2 a 3 días laborales.</strong> Revisala en la pestaña de verificación.
                </p>

                {/* Resumen Completo */}
                <div className="bg-[#0F1218] border border-white/10 rounded-2xl p-8 text-left max-w-2xl mx-auto mb-10 relative overflow-hidden shadow-2xl font-barlow">
                   <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#FF4EC4] to-[#9B5CFF]" />
                   
                   <div className="grid grid-cols-2 gap-6 text-base md:text-lg mb-8">
                      <div className="col-span-2 pb-6 mb-2 border-b border-white/5">
                        <p className="text-xs text-gray-500 uppercase tracking-wider mb-2 font-bold">Nombre Completo</p>
                        <p className="text-2xl md:text-3xl font-bold text-white capitalize">{formData.nombres} {formData.apellidos}</p>
                      </div>

                      <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wider mb-1 flex items-center gap-1 font-bold"><CreditCard size={12} /> Cédula</p>
                        <p className="font-mono text-gray-200 text-lg md:text-xl">{formData.cedula}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wider mb-1 flex items-center gap-1 font-bold"><User size={12} /> Categoría</p>
                        <p className="font-bold text-[#9B5CFF] text-lg md:text-xl">{selectedCategory}</p>
                      </div>

                      <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wider mb-1 flex items-center gap-1 font-bold"><MapPin size={12} /> Ciudad</p>
                        <p className="text-gray-200 text-lg">{formData.ciudad}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wider mb-1 flex items-center gap-1 font-bold"><Phone size={12} /> Teléfono</p>
                        <p className="text-gray-200 text-lg">{formData.telefono}</p>
                      </div>

                      <div className="col-span-2">
                        <p className="text-xs text-gray-500 uppercase tracking-wider mb-1 flex items-center gap-1 font-bold"><Mail size={12} /> Email</p>
                        <p className="text-gray-200 truncate text-lg" title={formData.email}>{formData.email}</p>
                      </div>
                      
                      <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wider mb-1 flex items-center gap-1 font-bold"><Calendar size={12} /> Edad</p>
                        <p className="text-gray-200 text-lg">{formData.edad} años</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wider mb-1 flex items-center gap-1 font-bold"><User size={12} /> Género</p>
                        <p className="text-gray-200 text-lg">{formData.genero}</p>
                      </div>
                   </div>

                   <div className="flex items-center gap-5 bg-[#1A1E29] p-5 rounded-xl border border-white/5">
                     <div className="bg-white p-2 rounded-lg shrink-0">
                        {/* Generador de QR real */}
                        <img 
                          alt="QR" 
                          src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(formData.cedula || "10K")}`} 
                          className="w-20 h-20"
                        />
                     </div>
                     <div className="overflow-hidden">
                       <p className="text-sm text-gray-500 mb-1 font-bold uppercase">Comprobante de Inscripción</p>
                       <p className="text-sm text-gray-400 truncate">Estado: <span className="text-yellow-500 font-bold bg-yellow-500/10 px-2 py-1 rounded ml-1">Pendiente de Verificación</span></p>
                     </div>
                   </div>
                </div>

                <div className="flex flex-col items-center gap-4">
                    <a 
                      href="/verificar" 
                      className="inline-flex items-center gap-3 bg-[#9B5CFF] text-white px-10 py-5 rounded-full font-bold hover:bg-[#8A4DE0] transition shadow-[0_0_30px_#9B5CFF50] hover:scale-105 text-lg md:text-xl font-barlow"
                    >
                       <Search size={24}/> Ir a Pestaña de Verificación
                    </a>

                    <button 
                        onClick={handleReset}
                        className="flex items-center gap-2 text-gray-500 hover:text-white transition-colors underline decoration-white/20 hover:decoration-white underline-offset-4 font-barlow text-base md:text-lg mt-2"
                    >
                        <RefreshCcw size={16} /> Registrar a otra persona
                    </button>
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </main>
  );
}