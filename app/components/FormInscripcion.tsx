"use client";

import { useState, useCallback, ChangeEvent } from "react";
import { Barlow_Condensed } from "next/font/google";

import {
  HiUserCircle,
  HiIdentification,
  HiEnvelope,
  HiPhone,
  HiTrash,
} from "react-icons/hi2";

import { FaRunning, FaMoneyCheckAlt, FaUniversity } from "react-icons/fa";

// Tipografía oficial del evento
const display = Barlow_Condensed({
  subsets: ["latin"],
  weight: ["500", "700", "800"],
});

// Colores de la línea gráfica 10K Ruta de los Tres Juanes 2026
const brandPink = "#FF4EC4";
const brandPurple = "#9B5CFF";

export default function InscripcionPage() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [slow, setSlow] = useState(false); // mejora percepción
  const [submitting, setSubmitting] = useState(false);

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
    comprobante: null as File | null,
  });

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

  // ===============================
  // MANEJO DE CAMPOS (OPTIMIZADO)
  // ===============================
  const handleInput = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    const { name, value, files } = e.target;

    if (files && files[0]) {
      const file = files[0];

      // Limitar peso → mejora MUCHO la velocidad
      if (file.size > 5_000_000) {
        alert("El archivo máximo permitido es 5MB.");
        return;
      }

      setFormData((f) => ({ ...f, [name]: file }));
      setPreviewName(file.name);
      return;
    }

    setFormData((f) => ({ ...f, [name]: value }));
  }, []);

  // ===============================
  // ELIMINAR ARCHIVO
  // ===============================
  const clearFile = useCallback(() => {
    setFormData((f) => ({ ...f, comprobante: null }));
    setPreviewName("");
  }, []);

  // ===============================
  // ENVIAR FORMULARIO (OPTIMIZADO)
  // ===============================
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
      "comprobante",
    ];

    for (let field of required) {
      if (!(formData as any)[field]) {
        alert("Completa todos los campos obligatorios.");
        setSubmitting(false);
        return;
      }
    }

    setLoading(true);
    setTimeout(() => setSlow(true), 2500); // si demora → muestra "procesando"

    // requestAnimationFrame → evita lag en UI
    requestAnimationFrame(async () => {
      const body = new FormData();

      body.append("categoria", selectedCategory);
      body.append("precio", selectedPrice.toString());
      Object.entries(formData).forEach(([k, v]) => v && body.append(k, v as any));

      try {
        const res = await fetch(
          "https://mandarinas.10kindependenciadeambato.com/wp-json/mandarinas/v1/inscribir",
          { method: "POST", body }
        );

        const json = await res.json();

        setLoading(false);
        setSlow(false);

        if (!json || json.status !== "success") {
          alert("Error al enviar la inscripción.");
          setSubmitting(false);
          return;
        }

        setStep(4);

        const msg = `
📢 *Inscripción 10K Ruta de los Tres Juanes 2026*
👤 ${formData.nombres} ${formData.apellidos}
• Cédula/Documento: ${formData.cedula}
• Ciudad: ${formData.ciudad}
• Email: ${formData.email}
• Teléfono: ${formData.telefono}

🏃 Categoría:
• ${selectedCategory}
• Valor cancelado: $${selectedPrice}

🧾 Comprobante:
${json.file_url}

⚠️ Favor confirmar mi inscripción.
        `;

        setTimeout(() => {
          window.location.href = `https://wa.me/593995040437?text=${encodeURIComponent(
            msg
          )}`;
        }, 600);
      } catch (err) {
        setLoading(false);
        alert("Error de conexión");
      }
    });
  };

  const stepsLabels = ["Categoría", "Datos", "Pago", "Final"];

  // ===============================
  // INDICADOR DE PASOS
  // ===============================
  const StepsIndicator = () => (
    <>
      <div className="flex justify-between mb-6 max-w-lg mx-auto">
        {stepsLabels.map((label, index) => {
          const active = step === index + 1;
          const completed = step > index + 1;
          return (
            <div key={index} className="flex-1 text-center">
              <div
                className={`mx-auto w-12 h-12 rounded-full flex items-center justify-center text-sm font-bold transition
                  ${
                    active ? "scale-110 shadow-lg" :
                    completed ? "" :
                    "opacity-40"
                  }`}
                style={{
                  background: active
                    ? brandPink
                    : completed
                    ? brandPurple
                    : "#333",
                  color: active || completed ? "#fff" : "#bbb",
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

  // ===============================
  // UI PRINCIPAL
  // ===============================
  return (
    <main className="min-h-screen bg-[#0B0E13] text-white px-4 py-10">
      <div className="max-w-2xl mx-auto">
        <StepsIndicator />

        {/* LOADER OPTIMIZADO */}
        {loading && (
          <div className="fixed inset-0 bg-black/70 z-50 flex flex-col items-center justify-center gap-4">
            <div className="animate-spin w-16 h-16 border-4 border-gray-600 border-t-white rounded-full"></div>
            {slow && (
              <p className="text-sm text-gray-300 animate-pulse">
                Procesando comprobante…
              </p>
            )}
          </div>
        )}

        {/* ====================== */}
        {/* ======= STEP 1 ======= */}
        {/* ====================== */}
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

        {/* ====================== */}
        {/* ======= STEP 2 ======= */}
        {/* ====================== */}
        {step === 2 && (
          <div>
            <h1 className={`${display.className} text-3xl mb-6 flex items-center gap-2`}>
              <HiUserCircle className="text-white" /> Tus datos
            </h1>

            <div className="flex flex-col gap-4">
              {([
                ["cedula", "Cédula o Pasaporte", <HiIdentification />],
                ["nombres", "Nombres", <HiUserCircle />],
                ["apellidos", "Apellidos", <HiUserCircle />],
                ["ciudad", "Ciudad", <HiUserCircle />],
                ["email", "Correo", <HiEnvelope />],
                ["telefono", "Teléfono", <HiPhone />],
              ] as const).map(([name, label, icon]) => (
                <div key={name}>
                  <label className="text-sm text-gray-400 flex items-center gap-2">
                    {icon} {label} *
                  </label>
                  <input
                    name={name}
                    onChange={handleInput}
                    className="w-full bg-[#141820] border border-white/10 px-4 py-3 rounded-lg text-white"
                  />
                </div>
              ))}

              <div className="flex justify-between mt-4">
                <button
                  onClick={() => setStep(1)}
                  className="px-4 py-2 bg-white/10 rounded-md"
                >
                  Volver
                </button>
                <button
                  onClick={() => setStep(3)}
                  className="px-6 py-2 bg-white text-black rounded-md font-semibold"
                >
                  Continuar
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ====================== */}
        {/* ======= STEP 3 ======= */}
        {/* ====================== */}
        {step === 3 && (
          <div>
            <h1 className={`${display.className} text-3xl mb-6`}>Datos para el pago</h1>

            <div
              className="p-6 rounded-xl mb-10 space-y-6"
              style={{
                background: "#11141A",
                border: `1px solid ${brandPink}40`,
              }}
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

              {/* SUBIDA DE ARCHIVO */}
              <div className="space-y-2">
                <label className="text-sm text-gray-400 block">Sube tu comprobante *</label>

                {!previewName ? (
                  <label className="w-full bg-[#1C212B] border border-white/10 px-4 py-6 rounded-lg text-center cursor-pointer hover:bg-[#222935] transition block">
                    📁 Toca aquí para subir tu archivo
                    <input
                      type="file"
                      name="comprobante"
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

        {/* ====================== */}
        {/* ======= STEP 4 ======= */}
        {/* ====================== */}
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
    </main>
  );
}
