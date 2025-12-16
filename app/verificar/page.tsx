"use client";

import Link from "next/link";
import { Bebas_Neue } from "next/font/google";
import { useMemo, useState } from "react";
import { HiIdentification, HiCheckCircle, HiXCircle, HiXMark } from "react-icons/hi2";

const brandPink = "#FF4EC4";
const brandPurple = "#9B5CFF";

const bebas = Bebas_Neue({
  subsets: ["latin"],
  weight: "400",
  display: "swap",
});

const AIRTABLE_API_KEY = process.env.NEXT_PUBLIC_AIRTABLE_API_KEY!;
const AIRTABLE_BASE_ID = process.env.NEXT_PUBLIC_AIRTABLE_BASE_ID!;
const AIRTABLE_TABLE_ID = process.env.NEXT_PUBLIC_AIRTABLE_TABLE_ID!;

type VerifyData = {
  record_id?: string | null;
  nombre?: string | null;
  cedula?: string | null;
  celular?: string | null;
  email?: string | null;
  ciudad?: string | null;
  edad?: number | string | null;
  genero?: string | null;
  categorias?: string | null;
  etapa?: string | null;
  valor?: number | string | null;
};

type ModalType = "not_registered" | "pending_payment" | null;

function NoticeModal({
  open,
  type,
  onClose,
}: {
  open: boolean;
  type: ModalType;
  onClose: () => void;
}) {
  if (!open || !type) return null;

  const isPending = type === "pending_payment";
  const hrefInscripcion = "/inscripcion#formulario"; // 👈 cambia el id si tu form usa otro

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center px-4"
      role="dialog"
      aria-modal="true"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />

      <div
        className="
          relative w-full max-w-xl overflow-hidden
          rounded-[34px]
          border border-white/10
          bg-[#0B0E13]
          shadow-[0_40px_140px_rgba(0,0,0,.75)]
        "
        onClick={(e) => e.stopPropagation()}
        style={{
          boxShadow:
            "0 40px 140px rgba(0,0,0,.75), 0 0 0 1px rgba(255,255,255,.06) inset",
        }}
      >
        {/* ribbon */}
        <div
          className="h-[10px] w-full"
          style={{ background: `linear-gradient(90deg, ${brandPurple}, ${brandPink})` }}
        />

        <div className="p-7 sm:p-8 text-white">
          <div className="flex items-start justify-between gap-4">
            <div className="max-w-[520px]">
              <h3
                className={`
                  text-[28px] sm:text-[34px]
                  uppercase tracking-[0.06em]
                  ${bebas.className}
                `}
              >
                {isPending ? "Pago pendiente" : "No aparece tu inscripción"}
              </h3>

              <p className="mt-3 text-[14px] sm:text-[15px] text-white/80 leading-relaxed">
                {isPending ? (
                  <>
                    Encontramos tu registro, pero <b className="text-white">no consta como pagado</b>.
                    Si no realizaste tu pago, <b className="text-white">no se ve tu inscripción</b>.
                    Completa el formulario y sube tu comprobante en{" "}
                    <span className="font-bold text-white">/inscripcion/</span>.
                  </>
                ) : (
                  <>
                    No encontramos inscripción con esa cédula. Ojo: puede que{" "}
                    <b className="text-white">ya hayas pagado</b> pero{" "}
                    <b className="text-white">no llenaste el formulario</b>. Para que se active,
                    entra a <span className="font-bold text-white">/inscripcion/</span> y sube tu
                    comprobante.
                  </>
                )}
              </p>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-white/10 transition"
              aria-label="Cerrar"
              title="Cerrar"
            >
              <HiXMark className="w-7 h-7 text-white/85" />
            </button>
          </div>

          <div className="mt-7 flex flex-col sm:flex-row gap-3">
            <Link
              href={hrefInscripcion}
              className={`
                flex-1 rounded-[22px]
                px-5 py-4
                text-center
                uppercase tracking-[0.14em]
                ${bebas.className}
              `}
              style={{
                background: `linear-gradient(90deg, ${brandPurple}, ${brandPink})`,
                color: "#0B0E13",
                boxShadow: "0 18px 60px rgba(255,78,196,.22)",
                fontSize: 18,
              }}
            >
              Ir a inscripción
            </Link>

            <button
              onClick={onClose}
              className="
                rounded-[22px]
                border border-white/14
                px-5 py-4
                text-center
                font-bold
                text-white/85
                hover:bg-white/5 transition
              "
            >
              Cerrar
            </button>
          </div>

          <div className="mt-4 text-xs text-white/45">
            Tip: si ya pagaste, igual debes llenar el formulario para que tu inscripción se refleje.
          </div>
        </div>
      </div>
    </div>
  );
}

export default function VerificarPage() {
  const [cedula, setCedula] = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "not_found" | "error">("idle");
  const [msg, setMsg] = useState("");
  const [data, setData] = useState<VerifyData | null>(null);

  // ✅ solo mostrar datos si pagado
  const [isPaid, setIsPaid] = useState(false);

  // ✅ modal
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState<ModalType>(null);

  const cedulaClean = useMemo(() => cedula.replace(/\D+/g, ""), [cedula]);
  const cedulaOk = cedulaClean.length >= 6 && cedulaClean.length <= 15;

  const openModal = (type: ModalType) => {
    setModalType(type);
    setModalOpen(true);
  };

  const verify = async () => {
    if (!cedulaOk) {
      setStatus("error");
      setMsg("Cédula inválida. Revisa el número.");
      setData(null);
      setIsPaid(false);
      return;
    }

    setLoading(true);
    setStatus("idle");
    setMsg("");
    setData(null);
    setIsPaid(false);

    try {
      const formula = `{cedula}='${cedulaClean}'`;
      const url =
        `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${AIRTABLE_TABLE_ID}` +
        `?maxRecords=1&filterByFormula=${encodeURIComponent(formula)}`;

      const res = await fetch(url, {
        headers: {
          Authorization: `Bearer ${AIRTABLE_API_KEY}`,
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) {
        const text = await res.text();
        console.error("Airtable error:", res.status, text);
        setStatus("error");
        setMsg(`Error conectando con Airtable (${res.status})`);
        return;
      }

      const json = await res.json();

      if (!json.records || json.records.length === 0) {
        setStatus("not_found");
        setMsg("No existe inscripción con esa cédula.");
        openModal("not_registered");
        return;
      }

      const record = json.records[0];
      const fields = record.fields || {};

      const parsed: VerifyData = {
        record_id: record.id,
        nombre: fields["nombre"] ?? null,
        cedula: fields["cedula"] ?? cedulaClean,
        celular: fields["celular"] ?? null,
        email: fields["email"] ?? null,
        ciudad: fields["ciudad"] ?? null,
        edad: fields["edad"] ?? null,
        genero: fields["genero"] ?? null,
        categorias: fields["categorias"] ?? null,
        etapa: fields["Etapa"] ?? null,
        valor: fields["Valor"] ?? null,
      };

      // ✅ Detectar pagado según Etapa
      const etapaNorm = String(parsed.etapa ?? "").trim().toLowerCase();
      const paid =
        etapaNorm.includes("pagado") ||
        etapaNorm.includes("confirmado") ||
        etapaNorm.includes("aprobado");

      setData(parsed);
      setIsPaid(paid);

      if (!paid) {
        setStatus("success");
        setMsg("Registro encontrado, pero el pago está pendiente.");
        openModal("pending_payment");
        return;
      }

      setStatus("success");
      setMsg("Inscripción encontrada.");
    } catch (err) {
      console.error(err);
      setStatus("error");
      setMsg("Error de conexión.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <NoticeModal open={modalOpen} type={modalType} onClose={() => setModalOpen(false)} />

      <main className="min-h-screen px-4 py-12 text-white flex justify-center">
        <div className="w-full max-w-3xl">
          <div className="rounded-[28px] border border-white/10 bg-[#0B0E13] p-6 md:p-10 shadow-xl">
            <h1 className="text-3xl font-extrabold">Verificar inscripción</h1>
            <p className="text-gray-400 mt-1">
              Ingresa tu cédula y revisa si ya estás registrado.
            </p>

            <div className="mt-8 grid gap-3">
              <label className="flex items-center gap-2 text-sm text-gray-300">
                <HiIdentification /> Cédula / Documento
              </label>

              <div className="flex gap-3 flex-col sm:flex-row">
                <input
                  value={cedula}
                  onChange={(e) => setCedula(e.target.value)}
                  placeholder="Ej: 1850777077"
                  inputMode="numeric"
                  className="flex-1 bg-[#141820] border border-white/10 rounded-xl px-4 py-3"
                />

                <button
                  onClick={verify}
                  disabled={loading}
                  className="rounded-xl px-6 py-3 font-bold text-black"
                  style={{
                    background: `linear-gradient(90deg, ${brandPurple}, ${brandPink})`,
                  }}
                >
                  {loading ? "Verificando..." : "Verificar"}
                </button>
              </div>
            </div>

            {status !== "idle" && (
              <div className="mt-6 flex gap-3 items-start p-4 rounded-xl bg-[#11141A] border border-white/10">
                {status === "success" ? (
                  <HiCheckCircle className="text-2xl text-green-400" />
                ) : (
                  <HiXCircle className="text-2xl text-red-400" />
                )}
                <p className="font-semibold">{msg}</p>
              </div>
            )}

            {/* ✅ SOLO si está pagado muestro el detalle */}
            {status === "success" && data && isPaid && (
              <div className="mt-6 text-white/85">
                <div className="text-sm text-white/50">Registro:</div>
                <pre className="mt-2 rounded-xl border border-white/10 bg-[#11141A] p-4 text-xs overflow-auto">
                  {JSON.stringify(data, null, 2)}
                </pre>
              </div>
            )}
          </div>
        </div>
      </main>
    </>
  );
}
