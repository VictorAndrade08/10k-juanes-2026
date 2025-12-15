"use client";

import { useMemo, useState } from "react";
import { HiIdentification, HiCheckCircle, HiXCircle } from "react-icons/hi2";

const brandPink = "#FF4EC4";
const brandPurple = "#9B5CFF";

// 🔒 Variables desde entorno (.env.local o Vercel)
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

export default function VerificarPage() {
  const [cedula, setCedula] = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] =
    useState<"idle" | "success" | "not_found" | "error">("idle");
  const [msg, setMsg] = useState("");
  const [data, setData] = useState<VerifyData | null>(null);

  const cedulaClean = useMemo(() => cedula.replace(/\D+/g, ""), [cedula]);
  const cedulaOk = cedulaClean.length >= 6 && cedulaClean.length <= 15;

  const verify = async () => {
    if (!cedulaOk) {
      setStatus("error");
      setMsg("Cédula inválida. Revisa el número.");
      setData(null);
      return;
    }

    setLoading(true);
    setStatus("idle");
    setMsg("");
    setData(null);

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

      setData(parsed);
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

          {status === "success" && data && (
            <>
              {/* ✅ QR SOLO CON EL NÚMERO DE CÉDULA (NO JSON, NO TEXTO EXTRA) */}
              <div className="mt-6 flex flex-col items-center gap-2">
                <div className="text-sm text-gray-400">Código QR (tu cédula):</div>
                <div className="bg-white p-3 rounded-xl">
                  <img
                    alt="QR de cédula"
                    className="w-[180px] h-[180px]"
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(
                      String(data.cedula ?? cedulaClean ?? "")
                    )}`}
                  />
                </div>
                <div className="text-xs text-gray-500">
                  {String(data.cedula ?? cedulaClean ?? "")}
                </div>
              </div>

              <div className="mt-6 grid sm:grid-cols-2 gap-3">
                <Item label="Nombre" value={data.nombre} />
                <Item label="Cédula" value={data.cedula} />
                <Item label="Ciudad" value={data.ciudad} />
                <Item label="Teléfono" value={data.celular} />
                <Item label="Email" value={data.email} />
                <Item label="Edad" value={data.edad} />
                <Item label="Género" value={data.genero} />
                <Item label="Categorías" value={data.categorias} />
                <Item
                  label="Valor"
                  value={data.valor != null ? `$${data.valor}` : null}
                />
                <Item label="Etapa" value={data.etapa} />
              </div>
            </>
          )}
        </div>
      </div>
    </main>
  );
}

function Item({ label, value }: { label: string; value: any }) {
  return (
    <div className="rounded-xl border border-white/10 bg-[#11141A] p-3">
      <p className="text-xs text-gray-400">{label}</p>
      <p className="font-semibold">{value ?? "—"}</p>
    </div>
  );
}
