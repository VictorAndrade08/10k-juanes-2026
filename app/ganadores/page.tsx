'use client';

import React from 'react';
import { Bebas_Neue, Barlow_Condensed } from "next/font/google";
import { FileDown } from 'lucide-react';

const bebas = Bebas_Neue({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-bebas",
});

const barlow = Barlow_Condensed({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-barlow",
});

interface Atleta {
  ubicacion: string;
  nombres: string;
}

interface ActaCategoria {
  titulo: string;
  atletas: Atleta[];
}

// --- COLUMNA IZQUIERDA (HOMBRES Y EXTRAS) ---
const COLUMNA_IZQUIERDA: ActaCategoria[] = [
  {
    titulo: "ÉLITE HOMBRES",
    atletas: [
      { ubicacion: "PRIMERO", nombres: "LUIS MIGUEL MASABANDA OJEDA" },
      { ubicacion: "SEGUNDO", nombres: "FABIÁN JIMMY GÓMEZ INSUASTI" },
      { ubicacion: "TERCERO", nombres: "KEVIN ALEXIS ZURITA PINANJOTA" },
      { ubicacion: "CUARTO", nombres: "GERSON DAVID MONTES DE OCA SANTAMARÍA" },
      { ubicacion: "QUINTO", nombres: "DIEGO ARÉVALO" },
    ]
  },
  {
    titulo: "JUVENIL HOMBRES",
    atletas: [
      { ubicacion: "PRIMERO", nombres: "PABLO ANTONIO ÑAUTA PEÑAFIEL" },
      { ubicacion: "SEGUNDO", nombres: "JESSIEL ALEXANDER PAEZ ANAGUANO" },
      { ubicacion: "TERCERO", nombres: "JOSE ALEXANDER CABASCANGO BARZALLO" },
    ]
  },
  {
    titulo: "SÉNIOR 1 HOMBRES",
    atletas: [
      { ubicacion: "PRIMERO", nombres: "ALEX JOEL CAIZA PUNINA" },
      { ubicacion: "SEGUNDO", nombres: "ARIEL ALEJANDRO MONTES DE OCA SANTAMARIA" },
      { ubicacion: "TERCERO", nombres: "BRYAM PATRICIO SARI PLAZA" },
    ]
  },
  {
    titulo: "SÉNIOR 2 HOMBRES",
    atletas: [
      { ubicacion: "PRIMERO", nombres: "EDISON PATRICIO ENRIQUEZ MORA" },
      { ubicacion: "SEGUNDO", nombres: "HECTOR MANUEL CAZA PULAMARIN" },
      { ubicacion: "TERCERO", nombres: "JEFFERSON SANTIAGO IMBACUAN PAUCAR" },
    ]
  },
  {
    titulo: "MÁSTER HOMBRES",
    atletas: [
      { ubicacion: "PRIMERO", nombres: "JUAN CRISTOBAL ROUILLON VINTIMILLA" },
      { ubicacion: "SEGUNDO", nombres: "PEDRO MANUEL RAMOS IMBAQUINGO" },
      { ubicacion: "TERCERO", nombres: "SEGUNDO GEOVANNY PASTUÑA ALVARADO" },
    ]
  },
  {
    titulo: "SUPERMASTER HOMBRES",
    atletas: [
      { ubicacion: "PRIMERO", nombres: "MARCO ANTONIO ALMACHI CÓNDOR" },
      { ubicacion: "SEGUNDO", nombres: "JUAN JOSÉ CAJAS" },
      { ubicacion: "TERCERO", nombres: "LEÓN GERARDO MUÑOZ ILLARES" },
    ]
  },
  {
    titulo: "VILCABAMBA HOMBRES",
    atletas: [
      { ubicacion: "PRIMERO", nombres: "MARINO COLUMBA COLUMBA" },
      { ubicacion: "SEGUNDO", nombres: "JOSÉ ANTONIO LÓPEZ VILLARREAL" },
      { ubicacion: "TERCERO", nombres: "CÉSAR GERARDO AGUILAR SALAZAR" },
    ]
  },
  {
    titulo: "COLEGIAL HOMBRES",
    atletas: [
      { ubicacion: "PRIMERO", nombres: "BRYAN ALFREDO BAUTISTA TIPÁN" },
      { ubicacion: "SEGUNDO", nombres: "DARWIN ALEXIS LÓPEZ TIBANQUIZA" },
      { ubicacion: "TERCERO", nombres: "DEREK PATRICIO QUINATOA RUMIPAMBA" },
    ]
  },
  {
    titulo: "INTERFUERZAS",
    atletas: [
      { ubicacion: "PRIMERO", nombres: "HENRY PAUL PASTE SHINGÓN" },
      { ubicacion: "SEGUNDO", nombres: "DARWIN STALIN CULQUI SAILEMA" },
      { ubicacion: "TERCERO", nombres: "RONNY FABRICIO SUNTAXI SUNTAXI" },
    ]
  },
  {
    titulo: "SILLA DE CALLE",
    atletas: [
      { ubicacion: "PRIMERO", nombres: "ÁNGEL IVÁN FARES SILVA" },
      { ubicacion: "SEGUNDO", nombres: "JONATHAN IVÁN HERRERA BEJARANO" },
      { ubicacion: "TERCERO", nombres: "LUIS PEDRO AGUAYO HARO" },
    ]
  }
];

// --- COLUMNA DERECHA (MUJERES Y EXTRAS) ---
const COLUMNA_DERECHA: ActaCategoria[] = [
  {
    titulo: "ÉLITE MUJERES",
    atletas: [
      { ubicacion: "PRIMERO", nombres: "CARMEN AMELIA TOAQUIZA IZA" },
      { ubicacion: "SEGUNDO", nombres: "MARÍA BALVINA PASTUÑA ALVARADO" },
      { ubicacion: "TERCERO", nombres: "MARY ZENEIDA GRANJA PILA" },
      { ubicacion: "CUARTO", nombres: "JESSICA MARGOTH PAGUAY GUAMÁN" },
      { ubicacion: "QUINTO", nombres: "DIANA JUDITH LANDI ANDRADE" },
    ]
  },
  {
    titulo: "JUVENIL MUJERES",
    atletas: [
      { ubicacion: "PRIMERO", nombres: "VALERIA ESTEFANÍA SANGOQUIZA VÁSQUEZ" },
      { ubicacion: "SEGUNDO", nombres: "LESLY TATIANA PAUCAR ATI" },
      { ubicacion: "TERCERO", nombres: "SCARLET ISABELA MENDOZA FLORES" },
    ]
  },
  {
    titulo: "SÉNIOR 1 MUJERES",
    atletas: [
      { ubicacion: "PRIMERO", nombres: "LEYDI CARMEN RAURA GALLO" },
      { ubicacion: "SEGUNDO", nombres: "DAMARIS DANIELA DÍAZ CALDERÓN" },
      { ubicacion: "TERCERO", nombres: "PAULA ANDREA JARA ANDRADE" },
    ]
  },
  {
    titulo: "SÉNIOR 2 MUJERES",
    atletas: [
      { ubicacion: "PRIMERO", nombres: "DENISSE CRISTINA CUASPUD PALCHUCÁN" },
      { ubicacion: "SEGUNDO", nombres: "SUSANA CONSUELO QUINTEROS ESPÍN" },
      { ubicacion: "TERCERO", nombres: "GINA MELANEA ORDÓÑEZ ILLARES" },
    ]
  },
  {
    titulo: "MÁSTER MUJERES",
    atletas: [
      { ubicacion: "PRIMERO", nombres: "ROSA ALVA CHACHA CHACHA" },
      { ubicacion: "SEGUNDO", nombres: "SILVIA ALEXANDRA PAREDES YUCAILLA" },
      { ubicacion: "TERCERO", nombres: "MÓNICA MARÍA CAJAMARCA ILLESCAS" },
    ]
  },
  {
    titulo: "SUPERMASTER MUJERES",
    atletas: [
      { ubicacion: "PRIMERO", nombres: "MARÍA NATIVIDAD CHACHIPANTA QUISHPE" },
      { ubicacion: "SEGUNDO", nombres: "MIRYAN LUCINDA JÁCOME SILVA" },
      { ubicacion: "TERCERO", nombres: "GRACIELA TARCILA MOROCHO MORA" },
    ]
  },
  {
    titulo: "VILCABAMBA MUJERES",
    atletas: [
      { ubicacion: "PRIMERO", nombres: "MARCIA SUSANA CHILIQUINGA PORRAS" },
      { ubicacion: "SEGUNDO", nombres: "LUCILA MUÑOZ HIDALGO" },
      { ubicacion: "TERCERO", nombres: "PATRICIA DE LOS ÁNGELES SORIA TRELLES" },
    ]
  },
  {
    titulo: "COLEGIAL MUJERES",
    atletas: [
      { ubicacion: "PRIMERO", nombres: "LARISSA ANABEL CHIMBO PORRAS" },
      { ubicacion: "SEGUNDO", nombres: "CANDY MACARENA LEDESMA FLORES" },
      { ubicacion: "TERCERO", nombres: "SOFÍA MAGALY YUGCHA TOAPANTA" },
    ]
  },
  {
    titulo: "INTELECTUAL Y VISUAL",
    atletas: [
      { ubicacion: "PRIMERO", nombres: "SIXTO ROMÁN MORETA CRIOLLO" },
      { ubicacion: "SEGUNDO", nombres: "MAYCOL JOEL BAÑO PACHECO" },
      { ubicacion: "TERCERO", nombres: "JIMMY FABRICIO CAICEDO CASTILLO" },
    ]
  }
];

const TablaActa = ({ categoria }: { categoria: ActaCategoria }) => (
  <div className="w-full mb-6 break-inside-avoid print:mb-4">
    <div className="bg-[#5C2B46] py-2 px-2 print:bg-[#5C2B46] print:text-white">
      <h3 className="font-[family-name:var(--font-bebas)] text-[22px] text-white text-center uppercase tracking-wider print:text-white">
        {categoria.titulo}
      </h3>
    </div>
    <div className="bg-white border-b-2 border-transparent">
      <div className="grid grid-cols-[100px_1fr] border-b border-neutral-300 py-1 px-4 font-[family-name:var(--font-barlow)] font-bold text-[12px] text-[#5C2B46] uppercase tracking-wider">
        <span>UBICACIÓN</span>
        <span className="text-center">NOMBRES</span>
      </div>
      {categoria.atletas.map((atleta, index) => (
        <div key={index} className="grid grid-cols-[100px_1fr] px-4 py-1.5 items-center border-b border-neutral-200 last:border-0">
          <span className="font-[family-name:var(--font-barlow)] font-bold text-[13px] text-[#5C2B46]">
            {atleta.ubicacion}
          </span>
          <span className="font-[family-name:var(--font-barlow)] text-[14px] text-neutral-800 uppercase font-medium text-center">
            {atleta.nombres}
          </span>
        </div>
      ))}
    </div>
  </div>
);

export default function GanadoresPage() {
  const handleDownloadPDF = () => {
    window.print();
  };

  return (
    <main className={`min-h-screen bg-[#f8f8f8] text-neutral-900 font-sans ${bebas.variable} ${barlow.variable} print:bg-white`}>
      <style>{`
        @media print {
          /* Configuración estricta de hoja y color */
          @page { size: A4; margin: 10mm; }
          body { 
            background: white !important; 
            -webkit-print-color-adjust: exact !important; 
            print-color-adjust: exact !important; 
          }
          
          /* Oculta elementos que no se deben imprimir */
          .no-print { display: none !important; }
          header, footer, nav { display: none !important; }

          /* Asegura que el contenedor ocupe el 100% en el PDF */
          #pdf-content { width: 100%; max-width: 100%; margin: 0; padding: 0; }
          
          /* Control exacto del salto de página */
          .page-break { page-break-before: always; break-before: page; }
        }
      `}</style>

      <div id="pdf-content" className="py-8 md:py-12 max-w-[1000px] mx-auto print:py-0">

        {/* ================= HOJA 1 ================= */}
        <div className="container mx-auto px-4 md:px-8 print:px-0">

          <div className="flex flex-col items-center gap-2 mb-8 text-center justify-center">
            <h1 className="font-[family-name:var(--font-bebas)] text-4xl md:text-5xl text-[#E5006D] uppercase leading-tight">
              CUADRO FINAL <br /> <span className="text-neutral-950">DE GANADORES</span>
            </h1>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8">
            <div className="flex flex-col">
              {COLUMNA_IZQUIERDA.slice(0, 5).map((acta, index) => (
                <TablaActa key={`izq-p1-${index}`} categoria={acta} />
              ))}
            </div>
            <div className="flex flex-col">
              {COLUMNA_DERECHA.slice(0, 5).map((acta, index) => (
                <TablaActa key={`der-p1-${index}`} categoria={acta} />
              ))}
            </div>
          </div>
        </div>

        {/* ================= HOJA 2 ================= */}
        <div className="container mx-auto px-4 md:px-8 mt-12 print:mt-0 print:px-0 page-break">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8">
            <div className="flex flex-col">
              {COLUMNA_IZQUIERDA.slice(5).map((acta, index) => (
                <TablaActa key={`izq-p2-${index}`} categoria={acta} />
              ))}
            </div>

            <div className="flex flex-col">
              {COLUMNA_DERECHA.slice(5).map((acta, index) => (
                <TablaActa key={`der-p2-${index}`} categoria={acta} />
              ))}

              <div className="mt-4 mb-6 break-inside-avoid">
                <div className="bg-[#E5006D] text-white font-[family-name:var(--font-barlow)] font-bold italic text-xl inline-block px-3 py-1 mb-2">
                  COMUNICADO
                </div>
                <p className="font-[family-name:var(--font-barlow)] text-[15px] leading-snug text-neutral-800">
                  <span className="font-bold">RECUERDA:</span> La documentación deberá enviarse en formato PDF legible para impresión al WhatsApp <span className="font-bold">0997241804</span> hasta el día 23 de febrero de 2026, hasta las 17 horas.
                </p>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-[#E5006D] font-bold text-2xl font-[family-name:var(--font-bebas)] tracking-wider">0997241804</span>
                </div>
              </div>
            </div>
          </div>

          {/* Requisitos Finales */}
          <div className="mt-4 border-t border-neutral-300 pt-6 break-inside-avoid">
            <h4 className="font-[family-name:var(--font-barlow)] font-bold text-neutral-800 text-[16px] mb-3">
              Se deberán enviar los siguientes requisitos:
            </h4>
            <p className="font-[family-name:var(--font-barlow)] text-[14px] leading-relaxed text-neutral-700 mb-3">
              Cédula de identidad legible, información de categoría, ubicación, dirección, teléfono y correo electrónico (Primer PDF, documento transcrito en computadora). Certificado bancario de entidad avalada por el GAD AMBATO (Segundo PDF).
            </p>
            <p className="font-[family-name:var(--font-barlow)] text-[14px] leading-relaxed text-neutral-700 mb-3">
              En el caso de ser menores de edad, adicionar los documentos del representante legal, padre o madre, y cuenta bancaria (Tercer PDF).
            </p>
            <p className="font-[family-name:var(--font-barlow)] text-[14px] leading-relaxed text-neutral-700">
              Toda la documentación no deberá exceder los 3 PDF.
            </p>
          </div>

          {/* NUEVO BLOQUE: Nota y Plazo de acreditación idéntico a la foto */}
          <div className="mt-6 p-4 md:p-6 bg-gradient-to-r from-[#C02485] to-[#E5006D] break-inside-avoid">
            <p className="font-[family-name:var(--font-barlow)] text-white text-[13px] leading-relaxed mb-4">
              <span className="font-bold">Nota:</span> Para las categorías Discapacidad visual e intelectual, Silla de calle, Interfuerzas y Colegial, se deberá adjuntar la cédula actualizada, FF.AA. y el certificado del colegio de la provincia que avalen dichas categorías en el tercer PDF.
            </p>
            <p className="font-[family-name:var(--font-barlow)] text-white font-bold text-[14px] uppercase tracking-wide">
              EL PLAZO ESTIMADO PARA LA ACREDITACIÓN BANCARIA A LA CUENTA DE LOS GANADORES ES DE 90 DÍAS LABORABLES A
            </p>
          </div>
        </div>

        {/* Botón de impresión */}
        <div className="mt-12 no-print flex justify-center border-t border-neutral-200 pt-8 pb-8">
          <button
            onClick={handleDownloadPDF}
            className="
              flex items-center gap-3 px-8 py-4 
              bg-[#E5006D] hover:bg-[#C02485]
              text-white font-[family-name:var(--font-barlow)] font-bold text-xl
              rounded-xl shadow-lg transition-all duration-300
              uppercase tracking-widest
            "
          >
            <FileDown className="w-6 h-6" />
            Descargar PDF Oficial
          </button>
        </div>

      </div>
    </main>
  );
}