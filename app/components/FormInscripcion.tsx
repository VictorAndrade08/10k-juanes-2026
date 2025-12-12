"use client";

import { useState, useCallback, ChangeEvent, useRef, useEffect } from "react";
import { Barlow_Condensed } from "next/font/google";

import {
  HiUserCircle,
  HiIdentification,
  HiEnvelope,
  HiPhone,
  HiTrash,
} from "react-icons/hi2";
import { FaRunning, FaMoneyCheckAlt, FaUniversity } from "react-icons/fa";

const display = Barlow_Condensed({
  subsets: ["latin"],
  weight: ["500", "700", "800"],
});

// Colores gráficos
const brandPink = "#FF4EC4";
const brandPurple = "#9B5CFF";

export default function InscripcionPage() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [slow, setSlow] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const componentRef = useRef<HTMLDivElement | null>(null);

  // ⭐ Evitar scroll en la primera carga
  const didMount = useRef(false);

  useEffect(() => {
    if (!didMount.current) {
      didMount.current = true;
      return; // ❌ Primera carga: NO scrollear
    }

    // ✔ Cambios de paso: scrollear al inicio del contenedor
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

  // CATEGORÍAS
  const categories = [
    { name: "Élite (Categoría principal – abierta)", price: 30 },
    { name: "Senior 1 (20–29 años)", price: 30 },
    { name: "Senior 2 (30–39 años)", price: 30 },
    { name: "Máster (40–49 años)", price: 30 },
    { name: "Súper Máster (50–59 años)", price: 30 },
    { name: "Vilcabambas (60+ años)", price: 20 },
    { name: "Juvenil (14–19 años)", price: 30 },
    { name: "Colegial (14–18 Tungurahua)", price: 30 },
    { name: "Capacidades Especiales", price: 20 },
    { name: "Interfuerzas", price: 30 },
  ];

  // VALIDADORES TIPADOS
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

  // INPUT HANDLER
  const handleInput = useCallback((e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, files } = e.target as any;

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

      if (!allowed.includes(file.type)) {
        alert("Formato no permitido.");
        return;
      }

      if (file.size > 10_000_000) {
        alert("Archivo máximo 10MB.");
        return;
      }

      setFormData((f) => ({ ...f, [name]: file }));
      setPreviewName(file.name);
      return;
    }

    setFormData((f) => ({ ...f, [name]: value }));
  }, []);

  const clearFile = useCallback(() => {
    setFormData((f) => ({ ...f, comprobante: null }));
    setPreviewName("");
  }, []);

  // VALIDACIÓN PASO 2
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

    for (const f of requiredFields) {
      const val = (formData as any)[f];

      if (!val) {
        alert(`Debes completar: ${f}`);
        return false;
      }

      if (f in validators && !validators[f as keyof typeof validators](val)) {
        alert(`Dato incorrecto en: ${f}`);
        return false;
      }
    }

    return true;
  };

  // SUBMIT FINAL — FIX TOTAL DE ENVÍO CON ARCHIVO
  const submitForm = async () => {
    if (submitting) return;
    setSubmitting(true);

    const required = [
      "cedula",
      "nombres",
      "apellidos",
      "ciudad",
      "email",
      "telefono",
      "edad",
      "genero",
      "comprobante",
    ];

    for (let field of required) {
      const value = (formData as any)[field];

      if (!value) {
        alert("Todos los campos son obligatorios.");
        setSubmitting(false);
        return;
      }

      if (field in validators && !validators[field as keyof typeof validators](value)) {
        alert(`Campo inválido: ${field}`);
        setSubmitting(false);
        return;
      }
    }

    if (!selectedCategory) {
      alert("Debes seleccionar una categoría.");
      setSubmitting(false);
      return;
    }

    setLoading(true);
    setTimeout(() => setSlow(true), 2500);

    requestAnimationFrame(async () => {
      const body = new FormData();
      body.append("categoria", selectedCategory);
      body.append("precio", selectedPrice.toString());

      body.append("cedula", formData.cedula);
      body.append("nombres", formData.nombres);
      body.append("apellidos", formData.apellidos);
      body.append("ciudad", formData.ciudad);
      body.append("email", formData.email);
      body.append("telefono", formData.telefono);
      body.append("edad", formData.edad);
      body.append("genero", formData.genero);

      // FIX → enviar el archivo real
      if (formData.comprobante instanceof File) {
        body.append("comprobante", formData.comprobante);
      }

      try {
        // Primer paso: Enviar a WordPress
        const res = await fetch(
          "https://mandarinas.10kindependenciadeambato.com/wp-json/mandarinas/v1/inscribir",
          { method: "POST", body }
        );

        const json = await res.json();
        setLoading(false);
        setSlow(false);

        if (!json || json.status !== "success") {
          console.error("ERROR JSON:", json);
          alert("Error al enviar la inscripción.");
          setSubmitting(false);
          return;
        }

        // Paso 2: Enviar a Airtable
        const airtablePayload = {
          records: [
            {
              fields: {
                Cedula: formData.cedula,
                Nombres: formData.nombres,
                Apellidos: formData.apellidos,
                Ciudad: formData.ciudad,
                Email: formData.email,
                Telefono: formData.telefono,
                Edad: formData.edad,
                Genero: formData.genero,
                Categoria: selectedCategory,
                Precio: selectedPrice,
                Comprobante_URL: json.file_url,
              },
            },
          ],
        };

        const airtableRes = await fetch(
          `https://api.airtable.com/v0/${process.env.AIRTABLE_BASE_ID}/${process.env.AIRTABLE_TABLE_ID}`,
          {
            method: "POST",
            headers: {
              "Authorization": `Bearer ${process.env.AIRTABLE_API_KEY}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify(airtablePayload),
          }
        );

        const airtableJson = await airtableRes.json();
        console.log("Airtable response:", airtableJson);

        setStep(4);

        const msg = `
📢 *Inscripción 10K Ruta de los Tres Juanes 2026*
👤 ${formData.nombres} ${formData.apellidos}
• Cédula/Documento: ${formData.cedula}
• Edad: ${formData.edad}
• Género: ${formData.genero}
• Ciudad: ${formData.ciudad}
• Email: ${formData.email}
• Teléfono: ${formData.telefono}

🏃 Categoría: ${selectedCategory}
💵 Valor pagado: $${selectedPrice}

🧾 Comprobante:
${json.file_url}

⚠️ Favor confirmar mi inscripción.
`;

        setTimeout(() => {
          window.location.href = `https://wa.me/593995102378?text=${encodeURIComponent(msg)}`;
        }, 600);
      } catch (err) {
        console.error(err);
        setLoading(false);
        alert("Error de conexión");
      }

      setSubmitting(false);
    });
  };

  // BARRA PROGRESO
  const stepsLabels = ["Categoría", "Datos", "Pago", "Final"];

  const StepsIndicator = () => (
    <>
      <div className="flex justify-between mb-6 max-w-lg mx-auto">
        {stepsLabels.map((label, index) => {
          const active = step === index + 1;
          const completed = step > index + 1;

          return (
            <div key={index} className="flex-1 text-center">
              <div
                className={`
                  mx-auto w-12 h-12 rounded-full flex items-center justify-center text-sm font-bold transition
                  ${active ? "scale-110 shadow-lg" : completed ? "" : "opacity-40"}
                `}
                style={{
                  background: active ? brandPink : completed ? brandPurple : "#333",
                  color: "#fff",
                }}
              >
                {index + 1}
              </div>
              <p className="text-xs mt-1 text-gray-400">{label}</p>
            </div>
          );
        })}
      </div>

      <div className="w-full max-w-lg mx-auto mb-10">
        <div className="h-2 w-full bg-[#222] rounded-full overflow-hidden">
          <div
            className="h-2 transition-all duration-500"
            style={{
              width: `${(step - 1) * 33.33}%`,
              background: `linear-gradient(90deg, ${brandPurple}, ${brandPink})`,
            }}
          />
        </div>
      </div>
    </>
  );

  // UI
  return (
    <main className="min-h-screen bg-transparent text-white px-4 py-10 flex justify-center">
      <div
        ref={componentRef}
        className="
          w-full max-w-7xl mx-auto
          bg-[#0B0E13]
          rounded-[40px]
          border border-white/10
          shadow-[0_8px_28px_rgba(0,0,0,0.25)]
          px-6 md:px-16 py-12
        "
      >
        <div className="max-w-2xl mx-auto">
          <StepsIndicator />

          {/* loading */}
          {loading && (
            <div className="fixed inset-0 bg-black/70 z-50 flex flex-col items-center justify-center gap-4">
              <div className="animate-spin w-16 h-16 border-4 border-gray-600 border-t-white rounded-full"></div>
              {slow && <p className="text-sm text-gray-300 animate-pulse">Procesando comprobante…</p>}
            </div>
          )}

          {/* STEP 1 */}
          {step === 1 && (
            <div>
              <h1 className={`${display.className} text-3xl mb-6 flex items-center gap-2`}>
                <FaRunning className="text-white" /> Elige tu categoría
              </h1>

              <div className="flex flex-col gap-3">
                {categories.map((cat) => (
                  <button
                    key={cat.name}
                    onClick={() => {
                      setSelectedCategory(cat.name);
                      setSelectedPrice(cat.price);
                      setStep(2);
                    }}
                    className="bg-[#141820] hover:bg-[#1C212B] border border-white/10 px-4 py-4 rounded-lg transition text-left"
                  >
                    <p className={`${display.className} text-xl`}>{cat.name}</p>
                    <p className="text-gray-400 text-sm flex items-center gap-1">
                      <FaMoneyCheckAlt className="text-white" /> ${cat.price}
                    </p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* STEP 2 */}
          {step === 2 && (
            <div>
              <h1 className={`${display.className} text-3xl mb-6 flex items-center gap-2`}>
                <HiUserCircle className="text-white" /> Tus datos
              </h1>

              <div className="flex flex-col gap-4">
                {(
                  [
                    ["cedula", "Cédula o Pasaporte", <HiIdentification key="i1" />, "number"],
                    ["nombres", "Nombres", <HiUserCircle key="i2" />, "text"],
                    ["apellidos", "Apellidos", <HiUserCircle key="i3" />, "text"],
                    ["ciudad", "Ciudad", <HiUserCircle key="i4" />, "text"],
                    ["email", "Correo", <HiEnvelope key="i5" />, "email"],
                    ["telefono", "Teléfono", <HiPhone key="i6" />, "tel"],
                  ] as Array<[string, string, React.ReactNode, string]>
                ).map(([name, label, icon, type]) => (
                  <div key={name}>
                    <label className="text-sm text-gray-400 flex items-center gap-2">
                      {icon} {label} *
                    </label>

                    <input
                      name={name}
                      type={type}
                      inputMode={type === "number" || name === "telefono" ? "numeric" : undefined}
                      pattern={type === "number" ? "[0-9]*" : undefined}
                      onChange={handleInput}
                      value={(formData as any)[name] || ""}
                      className="w-full bg-[#141820] border border-white/10 px-4 py-3 rounded-lg text-white"
                    />
                  </div>
                ))}

                {/* edad */}
                <div>
                  <label className="text-sm text-gray-400 flex items-center gap-2">🧍 Edad *</label>
                  <input
                    name="edad"
                    type="number"
                    min="1"
                    max="120"
                    onChange={handleInput}
                    value={formData.edad}
                    className="w-full bg-[#141820] border border-white/10 px-4 py-3 rounded-lg text-white"
                  />
                </div>

                {/* genero */}
                <div>
                  <label className="text-sm text-gray-400 flex items-center gap-2">⚧ Género *</label>
                  <select
                    name="genero"
                    onChange={handleInput}
                    value={formData.genero}
                    className="w-full bg-[#141820] border border-white/10 px-4 py-3 rounded-lg text-white"
                  >
                    <option value="">Seleccione…</option>
                    <option value="Masculino">Masculino</option>
                    <option value="Femenino">Femenino</option>
                    <option value="Otro">Otro</option>
                  </select>
                </div>

                {/* botones */}
                <div className="flex justify-between mt-4">
                  <button onClick={() => setStep(1)} className="px-4 py-2 bg-white/10 rounded-md">
                    Volver
                  </button>

                  <button
                    onClick={() => {
                      if (validateStep2()) setStep(3);
                    }}
                    className="px-6 py-2 bg-white text-black rounded-md font-semibold"
                  >
                    Continuar
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* STEP 3 */}
          {step === 3 && (
            <div>
              <h1 className={`${display.className} text-3xl mb-6`}>Datos para el pago</h1>

              <div
                className="p-6 rounded-xl mb-10 space-y-6"
                style={{ background: "#11141A", border: `1px solid ${brandPink}40` }}
              >
                <div>
                  <p className="text-gray-200 text-base leading-relaxed">
                    <span className="flex items-center gap-2 text-lg font-semibold mb-2">
                      <FaUniversity className="text-white" /> Banco Pichincha
                    </span>
                    <strong>Titular:</strong> La Asociación de Periodistas Deportivos de Tungurahua<br />
                    <strong>Cta:</strong> 2100057760<br />
                    <strong>RUC:</strong> 1891715141001<br />
                    <strong>WhatsApp:</strong> 099 504 0437<br /><br />
                    <strong>Monto a pagar:</strong> ${selectedPrice}<br />
                    <strong>Categoría:</strong> {selectedCategory}
                  </p>
                </div>

                {/* subir archivo */}
                <div className="space-y-2">
                  <label className="text-sm text-gray-400 block">Sube tu comprobante *</label>

                  {!previewName ? (
                    <label className="w-full bg-[#1C212B] border border-white/10 px-4 py-6 rounded-lg text-center cursor-pointer hover:bg-[#222935] transition block">
                      📁 Toca aquí para subir tu archivo
                      <input
                        type="file"
                        name="comprobante"
                        accept="image/*,application/pdf"
                        onChange={handleInput}
                        className="hidden"
                      />
                    </label>
                  ) : (
                    <div className="bg-[#141820] border border-white/10 px-4 py-3 rounded-lg flex justify-between items-center">
                      <span className="truncate text-gray-200">{previewName}</span>
                      <button onClick={clearFile} className="text-red-400 text-xl">
                        <HiTrash />
                      </button>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex justify-between mt-6">
                <button onClick={() => setStep(2)} className="px-4 py-2 bg-white/10 rounded-md">
                  Volver
                </button>

                <button
                  onClick={submitForm}
                  disabled={submitting}
                  className={`px-6 py-2 rounded-md font-semibold ${
                    submitting ? "bg-gray-500 cursor-not-allowed" : "bg-white text-black"
                  }`}
                >
                  {submitting ? "Enviando..." : "Finalizar inscripción"}
                </button>
              </div>
            </div>
          )}

          {/* STEP 4 */}
          {step === 4 && (
            <div className="text-center py-20">
              <h2 className={`${display.className} text-4xl mb-4`}>🎉 Inscripción enviada</h2>
              <p className="text-gray-400">
                Gracias <strong>{formData.nombres}</strong>
                <br />
                Serás redirigido a WhatsApp…
              </p>
            </div>
          )}

        </div>
      </div>
    </main>
  );
}
