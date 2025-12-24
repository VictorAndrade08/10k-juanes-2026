"use client";

import React, { useState, useCallback, ChangeEvent, useRef, useEffect } from "react";
import {
  User,
  CreditCard,
  Mail,
  Phone,
  Trash2,
  Activity,
  Banknote,
  Landmark,
  CheckCircle2,
  AlertCircle,
  UploadCloud,
  X,
  ChevronRight,
  ChevronLeft,
  Calendar,
  MapPin,
} from "lucide-react";

// Estilos dinámicos para fuente (evita errores de compilación con next/font)
const fontStyle = {
  fontFamily: '"Barlow Condensed", sans-serif',
};

// Fuente para el título del logo (Bebas Neue simulada)
const titleFontStyle = {
  fontFamily: '"Bebas Neue", sans-serif',
};

// Colores de marca
const brandPink = "#FF4EC4";
const brandPurple = "#9B5CFF";

// --- Componente Modal Personalizado ---
const CustomModal = ({
  isOpen,
  title,
  message,
  type = "error",
  onClose,
}: {
  isOpen: boolean;
  title: string;
  message: string;
  type?: "success" | "error" | "warning";
  onClose: () => void;
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[#141820] border border-white/10 w-full max-w-md rounded-2xl p-8 shadow-2xl relative animate-in zoom-in-95 duration-200">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition"
        >
          <X size={28} />
        </button>
        <div className="flex flex-col items-center text-center gap-5">
          <div
            className={`w-20 h-20 rounded-full flex items-center justify-center ${
              type === "error"
                ? "bg-red-500/20 text-red-500"
                : type === "warning"
                ? "bg-yellow-500/20 text-yellow-500"
                : "bg-green-500/20 text-green-500"
            }`}
          >
            {type === "error" && <AlertCircle size={40} />}
            {type === "warning" && <AlertCircle size={40} />}
            {type === "success" && <CheckCircle2 size={40} />}
          </div>
          <h3 className="text-3xl font-bold text-white uppercase" style={fontStyle}>
            {title}
          </h3>
          <p className="text-gray-300 text-lg leading-relaxed">{message}</p>
          <button
            onClick={onClose}
            className="w-full py-4 mt-3 bg-white text-black font-bold text-lg rounded-xl hover:bg-gray-200 transition"
          >
            Entendido
          </button>
        </div>
      </div>
    </div>
  );
};

export default function InscripcionPage() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [slow, setSlow] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [modalState, setModalState] = useState({
    isOpen: false,
    title: "",
    message: "",
    type: "error" as "error" | "warning" | "success",
  });

  const [whatsLink, setWhatsLink] = useState<string>("");
  const [uploadedFileUrl, setUploadedFileUrl] = useState<string>("");

  const componentRef = useRef<HTMLDivElement | null>(null);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const didMount = useRef(false);

  useEffect(() => {
    const link = document.createElement("link");
    link.href = "https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@400;500;600;700;800&display=swap";
    link.rel = "stylesheet";
    document.head.appendChild(link);

    const linkBebas = document.createElement("link");
    linkBebas.href = "https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap";
    linkBebas.rel = "stylesheet";
    document.head.appendChild(linkBebas);

    if (!didMount.current) {
      didMount.current = true;
      return;
    }

    if (componentRef.current) {
      componentRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  }, [step]);

  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedPrice, setSelectedPrice] = useState<number>(0);
  const [previewName, setPreviewName] = useState("");

  const [formData, setFormData] = useState({
    cedula: "",
    nombres: "",
    apellidos: "",
    ciudad: "",
    email: "",
    telefono: "",
    edad: "",
    genero: "",
    comprobante: null as File | null,
  });

  const categories = [
    { name: "Élite (Abierta)", price: 30, desc: "Categoría principal" },
    { name: "Senior 1", price: 30, desc: "20–29 años" },
    { name: "Senior 2", price: 30, desc: "30–39 años" },
    { name: "Máster", price: 30, desc: "40–49 años" },
    { name: "Súper Máster", price: 30, desc: "50–64 años" },
    { name: "Vilcabambas", price: 20, desc: "65+ años" },
    { name: "Juvenil", price: 30, desc: "14–19 años" },
    { name: "Colegial Tungurahua", price: 30, desc: "14–18 años" },
    { name: "Capacidades Especiales", price: 20, desc: "Todas las edades" },
    { name: "Interfuerzas", price: 30, desc: "Fuerzas del orden" },
  ];

  const validators = {
    cedula: (v: string) => /^[0-9]{6,15}$/.test(v),
    nombres: (v: string) => /^[A-Za-zÁÉÍÓÚÑáéíóúñ ]+$/.test(v),
    apellidos: (v: string) => /^[A-Za-zÁÉÍÓÚÑáéíóúñ ]+$/.test(v),
    ciudad: (v: string) => /^[A-Za-zÁÉÍÓÚÑáéíóúñ ]+$/.test(v),
    telefono: (v: string) => /^[0-9]{7,15}$/.test(v),
    edad: (v: string) => /^[0-9]{1,3}$/.test(v) && +v >= 1 && +v <= 120,
    email: (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v),
    genero: (v: string) => ["Masculino", "Femenino", "Otro"].includes(v),
  };

  const showAlert = (title: string, message: string, type: "error" | "warning" = "error") => {
    setModalState({ isOpen: true, title, message, type });
  };

  const handleInput = useCallback(
    (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      const { name, value, files } = e.target as any;

      if (errors[name]) {
        setErrors((prev) => ({ ...prev, [name]: "" }));
      }

      if (files && files[0]) {
        const file = files[0];
        const allowed = [
          "image/jpeg",
          "image/png",
          "image/webp",
          "image/heic",
          "image/heif",
          "application/pdf",
        ];

        if (file.type && !allowed.includes(file.type)) {
          showAlert("Formato no válido", "Por favor sube una imagen (JPG, PNG) o un PDF.");
          return;
        }

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
    const requiredFields = [
      "cedula",
      "nombres",
      "apellidos",
      "ciudad",
      "email",
      "telefono",
      "edad",
      "genero",
    ];

    const newErrors: Record<string, string> = {};
    let isValid = true;

    for (const f of requiredFields) {
      const val = (formData as any)[f];

      if (!val) {
        newErrors[f] = "Este campo es obligatorio";
        isValid = false;
      } else {
         // @ts-ignore
        if (validators[f] && !validators[f](val)) {
          newErrors[f] = "Formato inválido";
          isValid = false;
        }
      }
    }

    setErrors(newErrors);
    
    if (!isValid) {
      const firstError = Object.keys(newErrors)[0];
      const el = document.getElementsByName(firstError)[0];
      if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
    }

    return isValid;
  };

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
        const catExistente = json.datos?.categoria || "Registrada";
        
        showAlert(
          "⛔ INSCRIPCIÓN DUPLICADA",
          `La cédula ${formData.cedula} (${nombreExistente}) ya está registrada en la categoría "${catExistente}". No se permite doble inscripción.`,
          "error"
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

    if (!selectedCategory) {
      showAlert("Falta categoría", "Por favor selecciona una categoría antes de finalizar.");
      setSubmitting(false);
      return;
    }

    if (!formData.comprobante) {
      showAlert("Falta comprobante", "Debes subir la foto o PDF de tu pago.");
      setSubmitting(false);
      return;
    }

    setLoading(true);
    const slowTimer = window.setTimeout(() => setSlow(true), 2500);

    const body = new FormData();
    body.append("categoria", selectedCategory);
    body.append("precio", selectedPrice.toString());
    Object.keys(formData).forEach((key) => {
        // @ts-ignore
      if (key !== "comprobante") body.append(key, formData[key]);
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
      try {
        json = rawText ? JSON.parse(rawText) : null;
      } catch {
        json = null;
      }

      setLoading(false);
      setSlow(false);
      clearTimeout(slowTimer);

      if (!res.ok || !json || json.status !== "success") {
        console.error("WP Error:", rawText);
        showAlert("Error del servidor", "Hubo un problema guardando la inscripción. Inténtalo de nuevo.");
        setSubmitting(false);
        return;
      }

      if (json?.file_url) setUploadedFileUrl(String(json.file_url));

      setStep(4);

      const msg = `
📢 *Inscripción 10K Ruta de los Tres Juanes 2026*
👤 ${formData.nombres} ${formData.apellidos}
• Cédula: ${formData.cedula}
• Categoría: ${selectedCategory}
• Valor: $${selectedPrice}
🧾 Comprobante: ${json.file_url}
✅ Inscripción registrada. Solicito verificación.`;

      setWhatsLink(`https://wa.me/593995102378?text=${encodeURIComponent(msg)}`);

    } catch (err) {
      console.error(err);
      setLoading(false);
      setSlow(false);
      showAlert("Error de conexión", "Revisa tu conexión a internet e inténtalo de nuevo.");
    }
    setSubmitting(false);
  };

  const stepsLabels = ["Categoría", "Datos", "Pago", "Final"];

  const renderInputField = (name: string, label: string, icon: React.ReactNode, type: string = "text", onBlur?: () => void) => (
    <div className="relative group">
      <label className="text-sm font-bold text-gray-400 uppercase tracking-wide mb-2 flex items-center gap-2">
        {icon} {label}
      </label>
      <input
        name={name}
        type={type}
        // @ts-ignore
        value={formData[name] || ""}
        onChange={handleInput}
        onBlur={onBlur}
        placeholder={`Ingresa tu ${label.toLowerCase()}...`}
        className={`
          w-full bg-[#0F1218] border rounded-xl px-5 py-4 text-white text-lg placeholder-gray-600 outline-none transition-all
          ${errors[name] 
            ? "border-red-500/50 focus:border-red-500 focus:ring-1 focus:ring-red-500/50" 
            : "border-white/10 focus:border-[#9B5CFF] focus:ring-1 focus:ring-[#9B5CFF]/50 hover:border-white/20"}
        `}
      />
      {errors[name] && (
        <p className="text-red-400 text-sm mt-2 flex items-center gap-1 animate-in slide-in-from-top-1">
          <AlertCircle size={16} /> {errors[name]}
        </p>
      )}
    </div>
  );

  return (
    <main className="min-h-screen w-full bg-transparent text-white px-4 py-8 md:py-12 flex justify-center items-start" style={fontStyle}>
      
      <CustomModal 
        isOpen={modalState.isOpen} 
        title={modalState.title} 
        message={modalState.message} 
        type={modalState.type} 
        onClose={() => setModalState({ ...modalState, isOpen: false })} 
      />

      <div ref={componentRef} className="w-full max-w-7xl mx-auto bg-[#1C2029]/80 backdrop-blur-xl rounded-[32px] border border-white/5 shadow-2xl overflow-hidden flex flex-col md:flex-row">
        
        {/* SIDEBAR */}
        <div className="bg-[#11141A] p-6 md:p-12 md:w-1/3 flex flex-col justify-between border-r border-white/5 relative min-w-[300px]">
          
          <div>
            {/* LOGO */}
            <div className="mb-6 md:mb-12">
               <div className="flex items-center gap-4">
                  <div
                    className="
                      w-12 h-12 md:w-16 md:h-16
                      rounded-2xl overflow-hidden
                      bg-[#C02485]
                      shadow-[0_4px_12px_rgba(192,36,133,0.35)]
                      flex items-center justify-center
                      flex-shrink-0
                    "
                  >
                    <img
                      src="/white.svg"
                      alt="Logo"
                      className="w-8 h-8 md:w-10 md:h-10 object-contain"
                    />
                  </div>

                  <div className="leading-tight select-none">
                    <span
                      className={`
                        block
                        text-[22px] md:text-[28px]
                        uppercase tracking-[0.08em]
                        text-white
                      `}
                      style={titleFontStyle}
                    >
                      10K Ruta de los <br/> Tres Juanes
                    </span>
                  </div>
                </div>
            </div>

            {/* LISTA DE PASOS (SOLO VISIBLE EN ESCRITORIO) */}
            <div className="hidden md:block space-y-8 relative z-10">
              {stepsLabels.map((label, index) => {
                const stepNum = index + 1;
                const active = step === stepNum;
                const completed = step > stepNum;
                return (
                  <div key={index} className={`flex items-center gap-5 transition-all duration-300 ${active ? "opacity-100 translate-x-2" : "opacity-40"}`}>
                    <div 
                      className={`
                        w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg transition-all duration-300 border-2
                        ${active 
                          ? `bg-[#9B5CFF] border-[#9B5CFF] text-white shadow-[0_0_20px_#9B5CFF80]` 
                          : completed 
                            ? "bg-green-500 border-green-500 text-black" 
                            : "bg-transparent border-white/20 text-white"}
                      `}
                    >
                      {completed ? <CheckCircle2 size={24} /> : stepNum}
                    </div>
                    <div>
                      <p className={`text-lg font-bold uppercase tracking-wider ${active ? "text-white" : "text-gray-400"}`}>{label}</p>
                      {active && <p className="text-sm text-[#9B5CFF] font-medium">En progreso...</p>}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* INDICADOR DE PASOS COMPACTO (SOLO VISIBLE EN MÓVIL) */}
            <div className="md:hidden mb-2">
                <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-400 font-bold uppercase tracking-wider">Paso {step} de 4</span>
                    <span className="text-white font-bold uppercase">{stepsLabels[step-1]}</span>
                </div>
                <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                    <div 
                        className="h-full bg-[#9B5CFF] transition-all duration-500"
                        style={{ width: `${(step / 4) * 100}%` }}
                    />
                </div>
            </div>

          </div>
          
          <div className="hidden md:block mt-16 md:mt-0 text-sm text-gray-500 relative z-10 font-medium">
            © 2026 Ruta de los Tres Juanes. <br/> Ambato, Ecuador.
          </div>
        </div>

        {/* CONTENT */}
        <div className="p-6 md:p-14 md:w-2/3 bg-[#161A23] relative">
          
          {(loading || verifying) && (
            <div className="absolute inset-0 z-50 bg-[#161A23]/95 backdrop-blur-sm flex flex-col items-center justify-center gap-6 animate-in fade-in">
              <div className="w-20 h-20 border-4 border-[#9B5CFF] border-t-transparent rounded-full animate-spin" />
              <p className="text-white font-bold animate-pulse tracking-widest uppercase text-lg">
                {verifying ? "Verificando cédula..." : "Procesando..."}
              </p>
            </div>
          )}

          <div className="max-w-3xl mx-auto min-h-[500px]">
            
            {/* PASO 1 */}
            {step === 1 && (
              <div className="animate-in slide-in-from-right-8 duration-500 fade-in">
                <h1 className="text-3xl md:text-5xl font-bold mb-4">Selecciona tu Categoría</h1>
                <p className="text-gray-400 mb-8 text-lg">Elige la categoría en la que vas a competir. El precio se ajustará automáticamente.</p>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {categories.map((cat) => (
                    <button
                      key={cat.name}
                      onClick={() => {
                        setSelectedCategory(cat.name);
                        setSelectedPrice(cat.price);
                        setStep(2);
                      }}
                      className="group relative bg-[#0F1218] border border-white/10 p-6 rounded-2xl text-left hover:border-[#9B5CFF] hover:bg-[#1A1E29] transition-all duration-200 active:scale-95"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <span className="font-bold text-xl text-white group-hover:text-[#9B5CFF] transition-colors">{cat.name}</span>
                        <span className="bg-white/5 text-sm px-3 py-1 rounded-lg text-gray-300 group-hover:bg-[#9B5CFF] group-hover:text-white transition-colors font-mono">${cat.price}</span>
                      </div>
                      <p className="text-sm text-gray-500 group-hover:text-gray-400">{cat.desc}</p>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* PASO 2 */}
            {step === 2 && (
              <div className="animate-in slide-in-from-right-8 duration-500 fade-in">
                <h1 className="text-3xl md:text-5xl font-bold mb-8">Tus Datos Personales</h1>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  <div className="md:col-span-2">
                    {renderInputField("cedula", "Cédula o Pasaporte", <CreditCard size={18} />, "number", handleCedulaBlur)}
                  </div>
                  {renderInputField("nombres", "Nombres", <User size={18} />)}
                  {renderInputField("apellidos", "Apellidos", <User size={18} />)}
                  {renderInputField("ciudad", "Ciudad", <Landmark size={18} />)}
                  {renderInputField("telefono", "Teléfono", <Phone size={18} />, "tel")}
                  <div className="md:col-span-2">
                    {renderInputField("email", "Correo Electrónico", <Mail size={18} />, "email")}
                  </div>
                  
                  <div>
                    <label className="text-sm font-bold text-gray-400 uppercase tracking-wide mb-2 flex items-center gap-2"><User size={18} /> Edad</label>
                    <input name="edad" type="number" value={formData.edad} onChange={handleInput} placeholder="Ej: 25" className="w-full bg-[#0F1218] border border-white/10 rounded-xl px-5 py-4 text-white text-lg outline-none focus:border-[#9B5CFF]" />
                    {errors.edad && <p className="text-red-400 text-sm mt-2">{errors.edad}</p>}
                  </div>

                  <div>
                    <label className="text-sm font-bold text-gray-400 uppercase tracking-wide mb-2 flex items-center gap-2"><User size={18} /> Género</label>
                    <select name="genero" value={formData.genero} onChange={handleInput} className="w-full bg-[#0F1218] border border-white/10 rounded-xl px-5 py-4 text-white text-lg outline-none focus:border-[#9B5CFF] appearance-none">
                      <option value="">Seleccione...</option>
                      <option value="Masculino">Masculino</option>
                      <option value="Femenino">Femenino</option>
                      <option value="Otro">Otro</option>
                    </select>
                    {errors.genero && <p className="text-red-400 text-sm mt-2">{errors.genero}</p>}
                  </div>
                </div>

                <div className="bg-[#0F1218] p-6 rounded-2xl border border-white/5 mb-8">
                   <label className="flex items-start gap-4 text-base text-gray-300 cursor-pointer">
                    <div className="relative flex items-center pt-1">
                      <input type="checkbox" checked={acceptTerms} onChange={(e) => setAcceptTerms(e.target.checked)} className="peer h-6 w-6 cursor-pointer appearance-none rounded border border-gray-500 bg-transparent transition-all checked:border-[#9B5CFF] checked:bg-[#9B5CFF]" />
                      <CheckCircle2 size={16} className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-white opacity-0 peer-checked:opacity-100 pointer-events-none" />
                    </div>
                    <span className="leading-relaxed">
                      Acepto los <a href="/terminos" target="_blank" className="text-[#9B5CFF] underline hover:text-[#FF4EC4] font-bold">Términos y Condiciones</a> y declaro estar apto físicamente para la competencia.
                    </span>
                  </label>
                </div>

                <div className="flex gap-4">
                  <button onClick={() => setStep(1)} className="px-8 py-4 rounded-xl border border-white/10 hover:bg-white/5 transition font-bold text-gray-300 flex items-center gap-2 text-lg">
                    <ChevronLeft size={20} /> Atrás
                  </button>
                  <button onClick={async () => {
                      if (!acceptTerms) {
                        showAlert("Atención", "Debes aceptar los términos y condiciones para continuar.", "warning");
                        return;
                      }
                      if (validateStep2()) {
                        const exists = await checkUserExists();
                        if (!exists) setStep(3);
                      }
                    }} 
                    className="flex-1 bg-white text-black py-4 rounded-xl font-bold hover:bg-gray-200 transition flex items-center justify-center gap-2 text-lg shadow-[0_0_20px_rgba(255,255,255,0.2)]"
                  >
                    Siguiente <ChevronRight size={20} />
                  </button>
                </div>
              </div>
            )}

            {/* PASO 3 */}
            {step === 3 && (
              <div className="animate-in slide-in-from-right-8 duration-500 fade-in">
                <h1 className="text-3xl md:text-5xl font-bold mb-8">Realiza tu Pago</h1>
                
                <div className="bg-gradient-to-br from-[#1A1E29] to-black border border-white/10 rounded-2xl p-8 mb-10 shadow-lg">
                  <div className="flex items-center gap-4 mb-8 pb-6 border-b border-white/10">
                    <div className="bg-[#9B5CFF]/20 p-4 rounded-full text-[#9B5CFF]"><Landmark size={32} /></div>
                    <div>
                      <p className="text-base text-gray-400 uppercase tracking-wider mb-1">Institución Financiera</p>
                      <p className="font-bold text-2xl">Banco Pichincha</p>
                    </div>
                  </div>
                  
                  <div className="space-y-5 text-lg">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-500">Número de Cuenta:</span>
                      <span className="font-mono text-2xl tracking-wider select-all text-white bg-white/5 px-2 py-1 rounded">2100057760</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-500">Tipo:</span>
                      <span className="text-right text-white font-medium">Ahorros</span>
                    </div>
                    <div className="flex justify-between items-start">
                      <span className="text-gray-500">Titular:</span>
                      <span className="text-right text-white max-w-[200px] leading-tight">Asoc. Periodistas Deportivos Tungurahua</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-500">RUC:</span>
                      <span className="font-mono select-all text-white">1891715141001</span>
                    </div>
                     <div className="flex justify-between items-center pt-6 border-t border-white/10 mt-6">
                      <span className="text-gray-300 font-bold text-xl">Total a pagar:</span>
                      <span className="text-[#FF4EC4] font-black text-4xl">${selectedPrice}.00</span>
                    </div>
                  </div>
                </div>

                <div className="mb-10">
                  <label className="text-base font-bold text-gray-300 mb-3 block">Subir Comprobante (Foto o PDF)</label>
                  {!previewName ? (
                    <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-gray-600 rounded-2xl cursor-pointer hover:border-[#9B5CFF] hover:bg-[#9B5CFF]/5 transition-all group">
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <UploadCloud className="w-12 h-12 mb-4 text-gray-400 group-hover:text-[#9B5CFF] transition-colors" />
                        <p className="text-base text-gray-400 group-hover:text-white transition-colors">Click aquí para subir tu archivo</p>
                      </div>
                      <input type="file" name="comprobante" accept="image/*,application/pdf" onChange={handleInput} className="hidden" />
                    </label>
                  ) : (
                     <div className="flex items-center justify-between bg-[#0F1218] p-5 rounded-2xl border border-[#9B5CFF]/30">
                      <div className="flex items-center gap-4 overflow-hidden">
                        <CheckCircle2 className="text-green-500 shrink-0" size={24} />
                        <span className="text-lg text-gray-300 truncate font-medium">{previewName}</span>
                      </div>
                      <button onClick={clearFile} className="text-red-400 hover:text-red-300 p-2 hover:bg-red-500/10 rounded-lg transition"><Trash2 size={20} /></button>
                    </div>
                  )}
                </div>

                <div className="flex gap-4">
                  <button onClick={() => setStep(2)} className="px-8 py-4 rounded-xl border border-white/10 hover:bg-white/5 transition font-bold text-gray-300 text-lg">
                     Atrás
                  </button>
                  <button onClick={submitForm} disabled={submitting} className="flex-1 bg-[#9B5CFF] hover:bg-[#8A4DE0] text-white py-4 rounded-xl font-bold shadow-[0_0_20px_#9B5CFF50] transition disabled:opacity-50 disabled:cursor-not-allowed text-lg">
                    {submitting ? "Finalizando..." : "Confirmar Inscripción"}
                  </button>
                </div>
              </div>
            )}

            {/* PASO 4: RESUMEN FINAL */}
            {step === 4 && (
              <div className="text-center animate-in zoom-in-95 duration-500 fade-in py-10">
                <div className="w-28 h-28 bg-green-500/20 text-green-500 rounded-full flex items-center justify-center mx-auto mb-8 shadow-[0_0_40px_#22c55e40]">
                  <CheckCircle2 size={56} />
                </div>
                <h1 className="text-5xl font-bold mb-6 text-white">¡Inscripción Exitosa!</h1>
                <p className="text-gray-400 max-w-lg mx-auto mb-10 text-xl leading-relaxed">
                  Hemos recibido tus datos correctamente, <strong className="text-white">{formData.nombres}</strong>. Por favor, revisa que todo esté correcto.
                </p>

                {/* ✅ TARJETA DE RESUMEN COMPLETO DE DATOS */}
                <div className="bg-[#0F1218] border border-white/10 rounded-2xl p-8 text-left max-w-xl mx-auto mb-10 shadow-2xl relative overflow-hidden">
                   <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#FF4EC4] to-[#9B5CFF]" />
                   
                   <div className="grid grid-cols-2 gap-6 text-base mb-8">
                      <div className="col-span-2 pb-6 mb-2 border-b border-white/5">
                        <p className="text-xs text-gray-500 uppercase tracking-wider mb-2 font-bold">Nombre Completo</p>
                        <p className="text-2xl font-bold text-white capitalize">{formData.nombres} {formData.apellidos}</p>
                      </div>

                      <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wider mb-1 flex items-center gap-1 font-bold"><CreditCard size={12} /> Cédula</p>
                        <p className="font-mono text-gray-200 text-lg">{formData.cedula}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wider mb-1 flex items-center gap-1 font-bold"><User size={12} /> Categoría</p>
                        <p className="font-bold text-[#9B5CFF] text-lg">{selectedCategory}</p>
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
                        <img 
                          alt="QR" 
                          src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(formData.cedula || "")}`} 
                          className="w-20 h-20"
                        />
                     </div>
                     <div className="overflow-hidden">
                       <p className="text-sm text-gray-500 mb-1 font-bold uppercase">Comprobante de Inscripción</p>
                       <p className="text-sm text-gray-400 truncate">Estado: <span className="text-yellow-500 font-bold bg-yellow-500/10 px-2 py-1 rounded ml-1">Pendiente de Verificación</span></p>
                     </div>
                   </div>
                </div>

                <a 
                  href={whatsLink || "#"} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-3 bg-[#25D366] text-black px-10 py-5 rounded-full font-bold hover:bg-[#20bd5a] transition shadow-[0_0_25px_#25D36640] hover:scale-105 text-lg"
                >
                   Notificar por WhatsApp
                </a>
                 <p className="text-sm text-gray-600 mt-6 font-medium">Tip: Toma una captura de pantalla de tu resumen.</p>
              </div>
            )}

          </div>
        </div>
      </div>
    </main>
  );
}