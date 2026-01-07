"use client";

import React from "react";

export default function ReglamentoSection() {
  return (
    <section
      id="reglamento"
      className="w-full px-4 py-10 md:py-14 flex justify-center"
    >
      {/* Cargar fuente Bebas Neue via Google Fonts */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap');
        .font-bebas {
          font-family: 'Bebas Neue', sans-serif;
        }
      `}</style>

      {/* ✅ MISMO ANCHO QUE EL HEADER */}
      <div
        className="
          w-full max-w-7xl mx-auto
          bg-white
          rounded-[48px]
          border border-black/10
          shadow-[0_20px_60px_rgba(0,0,0,0.12)]
          px-6 sm:px-10 md:px-16
          py-12 md:py-16
          text-black
        "
      >
        {/* HEADER */}
        <div className="text-center">
          <p className="uppercase tracking-[0.32em] text-xs sm:text-sm text-black/60 font-semibold">
            Información oficial — lectura clara y accesible
          </p>

          <h2
            className={`
              mt-4
              text-[40px] sm:text-[54px] lg:text-[66px]
              leading-[1.02]
              uppercase tracking-[0.08em]
              font-bebas
            `}
          >
            Reglamento General
          </h2>

          <p className="mt-3 text-black/70 max-w-3xl mx-auto text-[15px] sm:text-[16px] leading-relaxed">
            Carrera 10K Ruta de los Tres Juanes 2026 — “10K RUTA DE LOS TRES
            JUANES”
          </p>
        </div>

        {/* BODY */}
        <div className="mt-12 space-y-6 text-[17px] sm:text-[18px] leading-[1.9] text-black/85">
          <ArticleCard id="art-1" title="Artículo 1. Denominación">
            <p>
              La competencia atlética 10K Ruta de los Tres Juanes está organizada
              por la Asociación de Periodistas Deportivos de Tungurahua, con la
              colaboración del Gobierno Autónomo Descentralizado de Ambato. Para
              la realización de esta edición el nombre de la competencia será:
              10K RUTA DE LOS TRES JUANES.
            </p>
          </ArticleCard>

          <ArticleCard id="art-2" title="Artículo 2. Horario">
            <p>
              La edición de la 10K Ruta de los Tres Juanes se realizará el{" "}
              <strong>viernes 6 de febrero de 2026 a las 19h00</strong>. El
              tiempo máximo para completar esta prueba es de{" "}
              <strong>1 hora 30 minutos</strong>.
            </p>
          </ArticleCard>

          <ArticleCard id="art-3" title="Artículo 3. Participación">
            <div className="space-y-3">
              <p>
                Podrán formar parte de esta prueba atlética todas las personas
                que acrediten buena salud y que estén correctamente inscritas,
                tanto en tiempo como en forma.
              </p>
              <p>
                Los atletas extranjeros que deseen participar en este evento{" "}
                <strong>no</strong> cobrarán los premios establecidos para los
                ganadores. Deberán ponerse en contacto con la organización para
                acordar el valor del premio a recibir, de acuerdo con su
                ubicación.
              </p>
              <p>
                En la categoría <strong>Colegial – Tungurahua</strong>, podrán
                participar los atletas que estudien en cualquiera de los colegios
                de la provincia de Tungurahua, de acuerdo con la edad
                establecida, y que presenten su carné estudiantil vigente.
              </p>
              <p>
                Los atletas con discapacidad deben presentar su carné emitido
                por el <strong>CONADIS</strong> que acredite su grado de
                discapacidad.
              </p>
              <p>
                La categoría <strong>Interfuerzas</strong> deberá presentar el
                carné de FFAA o de la entidad afín a la que representan.
              </p>
            </div>
          </ArticleCard>

          <ArticleCard id="art-4" title="Artículo 4. Distancia y recorrido">
            <p>
              10 kilómetros comprendidos en el siguiente recorrido: Partida
              desde el sector La Victoria, Rodrigo Pachano, Av. Circunvalación,
              Jardín Botánico La Liria, Quinta de Juan León Mera, Colegio
              Rumiñahui, IESS, Fybeca, Av. Los Guaytambos, Centro Comercial
              Caracol, Ficoa, Parque Los Quindes, Las Palmas, Quinta Juan
              Montalvo, Club Tungurahua, Miraflores, Las Dalias, Olmedo,
              Francisco Flor, Av. Cevallos, Mera, Urdaneta y llegada en el
              Estadio Universidad Indoamérica <strong>BELLAVISTA</strong>.
            </p>
          </ArticleCard>

          <ArticleCard id="art-5" title="Artículo 5. Categorías">
            <div className="space-y-4">
              <p>
                La carrera está abierta a la participación de cualquier atleta
                que lo desee, sin distinción de sexo o nacionalidad, siempre que
                se haya inscrito correctamente.
              </p>

              <div className="grid sm:grid-cols-2 gap-2 text-black/85">
                <div>ELITE — DAMAS Y VARONES</div>
                <div>JUVENIL — DAMAS Y VARONES (Hasta 19 años 11 meses)</div>
                <div>SENIOR 1 — DAMAS Y VARONES (De 20 a 29 años 11 meses)</div>
                <div>SENIOR 2 — DAMAS Y VARONES (De 30 a 39 años 11 meses)</div>
                <div>MASTER — DAMAS Y VARONES (De 40 a 49 años 11 meses)</div>
                <div>SUPERMASTER — DAMAS Y VARONES (De 50 a 59 años 11 meses)</div>
                <div>VILCABAMBAS — DAMAS Y VARONES (De 60 años en adelante)</div>
                <div>COLEGIAL — DAMAS Y VARONES (De 14 a 18 años 11 meses)</div>
                <div className="sm:col-span-2">
                  CAPACIDADES ESPECIALES — Discapacidad intelectual y visual /
                  Silla de calle
                </div>
                <div className="sm:col-span-2">INTERFUERZAS</div>
              </div>

              <p className="text-black/70">
                Los límites de edad para cada categoría se toman en cuenta de
                acuerdo con el año de nacimiento.
              </p>
            </div>
          </ArticleCard>

          <ArticleCard id="art-6" title="Artículo 6. Inscripciones">
            <div className="space-y-3">
              <p>
                <strong>Precio de inscripción:</strong> $30,00 USD (todas las
                categorías).
              </p>
              <p>
                Para las personas de la tercera edad y personas con discapacidad,
                el precio es de <strong>$20,00 USD</strong>.
              </p>
              <p>
                Las inscripciones se receptarán desde el{" "}
                <strong>lunes 20 de enero</strong> hasta el{" "}
                <strong>30 de enero de 2026</strong> o hasta agotar cupos,
                determinados por la organización. No se admitirán inscripciones
                el día de la carrera atlética.
              </p>
              <p>
                <strong>Importante:</strong> Indispensable presentar copia a
                color de cédula de ciudadanía.
              </p>
            </div>
          </ArticleCard>

          <ArticleCard id="art-7" title="Artículo 7. Puntos de inscripción">
            <p>
              Las inscripciones se realizarán de manera digital a través de
              WhatsApp:{" "}
              <WhatsAppLink
                phoneE164="593995102378"
                label="+593 99 510 2378"
                message="Hola, quiero inscribirme en la 10K Ruta de los Tres Juanes 2026. ¿Me ayudan con el proceso?"
              />
            </p>
          </ArticleCard>

          <ArticleCard id="art-8" title="Artículo 8. Modificaciones">
            <p>
              La organización se reserva el derecho a realizar las
              modificaciones en el itinerario que considere necesarias en
              función de los diferentes condicionantes, así como la suspensión
              de la carrera si las condiciones epidemiológicas u otras fuerzas
              de causa mayor así lo aconsejan, posponiéndose en este caso para
              otra fecha, sin que esto signifique la devolución de los valores
              recaudados por concepto de inscripción.
            </p>
          </ArticleCard>

          <ArticleCard id="art-9" title="Artículo 9. Atención médica">
            <p>
              Además de contar con la asistencia médica de la Cruz Roja de
              Tungurahua, los atletas contarán con un seguro de vida y
              accidentes en horario de 19:00 a 21:00, proporcionado por Sweaden
              Compañía de Seguros.
            </p>
          </ArticleCard>

          <ArticleCard id="art-10" title="Artículo 10. Clasificaciones">
            <p>
              La clasificación general de los participantes se publicará en la
              página oficial de la carrera{" "}
              <strong>www.10krutadelostresjuanes.com.ec</strong>.
            </p>
          </ArticleCard>

          <ArticleCard
            id="art-11"
            title="Artículo 11. Descalificaciones e infracciones"
          >
            <div className="space-y-4">
              <p>
                En caso de detectarse suplantación de identidad u otra forma que
                altere la identidad del participante, causando o intentando
                perjudicar a la organización, la sanción será de{" "}
                <strong>5 años</strong> sin inscripción en nuestra competencia.
              </p>
              <p>
                La organización se reserva el derecho de admisión de
                inscripciones, con atletas que hayan calumniado, difamado,
                injuriado, insultado o tenido un mal comportamiento con
                cualquiera de sus miembros, vía oral, escrita o medios
                digitales.
              </p>

              <div className="rounded-2xl border border-black/10 bg-black/[0.03] p-5">
                <p className="font-semibold mb-2">
                  El servicio médico de la competencia y los jueces están
                  facultados para retirar durante la prueba:
                </p>
                <ul className="list-disc pl-6 space-y-1 text-black/85">
                  <li>A cualquier atleta que manifieste mal estado físico.</li>
                  <li>
                    No realizar la totalidad del recorrido a pie por el lugar
                    marcado por la organización.
                  </li>
                  <li>
                    No pasar por el control de salida y por los controles que se
                    marquen durante el recorrido.
                  </li>
                  <li>Invertir más de 1 hora 30 minutos.</li>
                  <li>
                    No seguir las indicaciones de los jueces, la organización o
                    personal de seguridad.
                  </li>
                  <li>
                    No llevar el dorsal en la parte delantera de la camiseta y
                    en un lugar bien visible.
                  </li>
                  <li>Recibir ayuda externa.</li>
                  <li>
                    No llevar el chip (o sistema equivalente) en el lugar
                    indicado.
                  </li>
                  <li>
                    Estar sancionado por el Comité Olímpico o la Ecuatoriana de
                    Atletismo por el uso de dopaje en cualquier evento nacional
                    o internacional, mientras dure la sanción.
                  </li>
                  <li>Participar con el dorsal de otro corredor.</li>
                  <li>
                    Participar con un dorsal no autorizado por la organización.
                  </li>
                  <li>No manifestar un comportamiento deportivo.</li>
                </ul>
              </div>

              <p>
                Los participantes no están autorizados para correr acompañados
                de mascotas, ni otras personas ajenas a la competición, en
                especial menores de edad, por cuestiones de seguridad, pudiendo
                ser descalificados por este motivo. En ese caso no figurarán en
                la clasificación final ni podrán acceder a premios u obsequios.
              </p>
            </div>
          </ArticleCard>

          <ArticleCard id="art-12" title="Artículo 12. Vehículos">
            <div className="space-y-3">
              <p>
                Los únicos vehículos autorizados para seguir la prueba son los
                designados e identificados por la organización. Queda totalmente
                prohibido seguir a los atletas en moto, auto o bicicleta, por el
                peligro que esto traería a los corredores.
              </p>
              <p>
                El control del tráfico y el cierre de vías estarán a cargo de la
                Dirección de Tránsito, Transporte Terrestre y Seguridad Vial.
              </p>
            </div>
          </ArticleCard>

          {/* ✅ ARTÍCULO 13 CORREGIDO + WHATSAPP */}
          <ArticleCard id="art-13" title="Artículo 13. Premios">
            <div className="space-y-3">
              <p>
                Los cuadros preliminares de los ganadores se exhibirán en la
                página web de la carrera{" "}
                <strong>www.10krutadelostresjuanes.com.ec</strong> una vez
                terminada la competencia en el Estadio Universidad Indoamérica{" "}
                <strong>BELLAVISTA</strong>.
              </p>

              <p>
                Los atletas que deban realizar un reclamo respecto a su ubicación
                deberán enviarlo <strong>por escrito</strong> en{" "}
                <strong>archivo PDF</strong> vía WhatsApp al{" "}
                <WhatsAppLink
                  phoneE164="593997241804"
                  label="099 724 1804"
                  message="Hola, quiero presentar un reclamo por mi ubicación en la 10K Ruta de los Tres Juanes 2026. Adjunto mi reclamo en PDF."
                />{" "}
                hasta el{" "}
                <strong>viernes 13 de febrero de 2026</strong>.
              </p>

              <p>
                Luego de ello se realizarán, de ser el caso, los cambios
                respectivos y se dará a conocer el cuadro oficial de ganadores
                de la carrera. Se tendrá un plazo máximo de una semana para
                presentar los documentos solicitados por el GAD Ambato para su
                correspondiente pago. Una vez transcurrido este tiempo, la APDT
                organizadora del evento deslinda su responsabilidad sobre el
                pago, siendo responsabilidad del atleta el cumplimiento para el
                cobro. Luego de este plazo se estima aproximadamente{" "}
                <strong>90 días laborables</strong> para la cancelación directa a
                los atletas por el GAD Ambato.
              </p>

              <p>
                Una vez que el GAD Ambato lo autorice, se procederá al pago de
                los premios económicos para las diferentes categorías de damas y
                varones. Se solicitará certificado bancario y cédula de
                ciudadanía, o cualquier otro documento que soliciten los
                organizadores.
              </p>

              <p>
                En la categoría de personas con discapacidad es necesario el
                carné del <strong>CONADIS</strong> para cobrar el premio.
              </p>

              <p>
                En la categoría Interfuerzas se solicitará el carné vigente de
                FFAA o institución afín.
              </p>

              <p>
                En la categoría Colegial de Tungurahua es necesario el carné
                estudiantil vigente de cualquier colegio de la provincia para
                cobrar el premio. En caso de ser menor de edad, se solicitará la
                documentación al representante legal.
              </p>

              <div className="rounded-2xl border border-black/10 bg-black/[0.03] p-5">
                <p className="font-semibold mb-1">Reclamos (PDF) por WhatsApp</p>
                <p className="text-black/75">
                  Envíalo aquí:{" "}
                  <WhatsAppLink
                    phoneE164="593997241804"
                    label="099 724 1804"
                    message="Hola, envío mi reclamo en PDF por mi ubicación en la 10K Ruta de los Tres Juanes 2026."
                  />
                </p>
              </div>
            </div>
          </ArticleCard>

          <ArticleCard id="art-14" title="Artículo 14. Sorteo del vehículo">
            <p>
              Al finalizar la carrera se sorteará un vehículo. Para participar,
              los atletas deberán cumplir estos requisitos: estar inscritos
              legalmente, haber cumplido todo el recorrido y encontrarse
              presentes en el Estadio Universidad Indoamérica{" "}
              <strong>BELLAVISTA</strong> al momento del sorteo. No participarán
              atletas invitados ni gratuidades. No se aceptarán reclamos
              posteriores por incumplir cualquiera de estos requisitos.
            </p>
          </ArticleCard>

          <ArticleCard id="art-15" title="Artículo 15. Responsabilidad">
            <div className="space-y-3">
              <p>
                Pese al seguro de vida y contra accidentes, la organización no se
                responsabiliza de los daños que pudieran ocasionar las
                imprudencias o negligencias de los atletas. El seguro será
                entregado siempre y cuando se confirme la seriedad del
                accidente.
              </p>
              <p>
                De igual manera, el atleta declara estar en condiciones físicas,
                médicas y psicológicas para realizar esta carrera y lo hace bajo
                su responsabilidad.
              </p>
            </div>
          </ArticleCard>

          <ArticleCard id="art-16" title="Artículo 16. Aceptación">
            <p>
              Todos los participantes, por el hecho de inscribirse, aceptan el
              presente reglamento. En caso de duda o de situaciones no previstas,
              se sujetarán a lo que disponga el Comité Organizador.
            </p>
          </ArticleCard>

          <ArticleCard id="art-17" title="Artículo 17. Autorización">
            <div className="space-y-3">
              <p>
                Autorizo a los organizadores del evento a la grabación total o
                parcial de mi participación mediante fotografías, películas,
                televisión, radio, video y cualquier otro medio conocido o por
                conocer, y cedo los derechos relativos a su explotación comercial
                y publicitaria, sin derecho a compensación económica.
              </p>
              <p>
                El atleta que utilice la marca 10K Ruta de los Tres Juanes
                necesitará autorización de la organización para cualquier tipo
                de publicación o difusión. En caso de infringir, se someterá a un
                proceso legal.
              </p>
            </div>
          </ArticleCard>

          <ArticleCard id="art-18" title="Artículo 18. Abandonos">
            <p>
              La organización espera y desea que todos los participantes
              concluyan la carrera; sin embargo, el atleta que abandone deberá
              entregar el chip de la competencia a un responsable de la
              organización.
            </p>
          </ArticleCard>

          <ArticleCard id="art-19" title="Artículo 19. Entrega de chips">
            <p>
              La entrega de los chips y kits se realizará en la{" "}
              <strong>Universidad Indoamérica (Av. Manuela Sáenz y Agramonte)</strong>.
              {" "}
              <strong>Jueves 5 de febrero</strong> de 10h00 a 17h00 y{" "}
              <strong>viernes 6 de febrero</strong> de 09h00 a 12h00.
            </p>
          </ArticleCard>

          <ArticleCard id="art-20" title="Artículo 20. Premios y categorías">
            <PremiosTables />
          </ArticleCard>

          <ArticleCard
            id="anexo"
            title="Anexo. Reglamento de aplicación a la ordenanza municipal"
          >
            <AnexoOrdenanza />
          </ArticleCard>
        </div>
      </div>
    </section>
  );
}

function ArticleCard({
  id,
  title,
  children,
}: {
  id: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <article
      id={id}
      className="
        rounded-[28px]
        border border-black/10
        bg-white
        shadow-[0_10px_30px_rgba(0,0,0,0.06)]
        overflow-hidden
        scroll-mt-28
      "
    >
      <div className="px-5 sm:px-7 py-4 sm:py-5 bg-black/[0.03] border-b border-black/10">
        <h3 className="font-extrabold text-black/90 text-[16px] sm:text-[18px]">
          {title}
        </h3>
      </div>
      <div className="px-5 sm:px-7 py-6">{children}</div>
    </article>
  );
}

function PremiosTables() {
  const tables = [
    {
      title: "ELITE — ABIERTO",
      headers: ["UBICACIÓN", "HOMBRE", "MUJER"],
      rows: [
        ["PRIMERO", "5", "5"],
        ["SEGUNDO", "4", "4"],
        ["TERCERO", "3", "3"],
        ["CUARTO", "2", "2"],
        ["QUINTO", "2", "2"],
      ],
    },
    {
      title: "JUVENIL — HASTA 19 AÑOS",
      headers: ["UBICACIÓN", "HOMBRE", "MUJER"],
      rows: [
        ["PRIMERO", "2", "2"],
        ["SEGUNDO", "1", "1"],
        ["TERCERO", "1", "1"],
      ],
    },
    {
      title: "SENIOR 1 — DE 20 A 29 AÑOS",
      headers: ["UBICACIÓN", "HOMBRE", "MUJER"],
      rows: [
        ["PRIMERO", "2", "2"],
        ["SEGUNDO", "1", "1"],
        ["TERCERO", "1", "1"],
      ],
    },
    {
      title: "SENIOR 2 — DE 30 A 39 AÑOS",
      headers: ["UBICACIÓN", "HOMBRE", "MUJER"],
      rows: [
        ["PRIMERO", "2", "2"],
        ["SEGUNDO", "1", "1"],
        ["TERCERO", "1", "1"],
      ],
    },
    {
      title: "MASTER — DE 40 A 49 AÑOS",
      headers: ["UBICACIÓN", "HOMBRE", "MUJER"],
      rows: [
        ["PRIMERO", "2", "2"],
        ["SEGUNDO", "1", "1"],
        ["TERCERO", "1", "1"],
      ],
    },
    {
      title: "SUPERMASTER — DE 50 A 59 AÑOS",
      headers: ["UBICACIÓN", "HOMBRE", "MUJER"],
      rows: [
        ["PRIMERO", "2", "2"],
        ["SEGUNDO", "1", "1"],
        ["TERCERO", "1", "1"],
      ],
    },
    {
      title: "VILCABAMBA — DE 60 EN ADELANTE",
      headers: ["UBICACIÓN", "HOMBRE", "MUJER"],
      rows: [
        ["PRIMERO", "2", "2"],
        ["SEGUNDO", "1", "1"],
        ["TERCERO", "1", "1"],
      ],
    },
    {
      title: "COLEGIAL — DE 14 A 18 AÑOS",
      headers: ["UBICACIÓN", "HOMBRE", "MUJER"],
      rows: [
        ["PRIMERO", "2", "2"],
        ["SEGUNDO", "1", "1"],
        ["TERCERO", "1", "1"],
      ],
    },
  ];

  return (
    <div className="space-y-5">
      <p className="text-black/70">
        (Los valores se presentan tal como constan en el documento de
        incentivos.)
      </p>

      {/* CTA opcional por WhatsApp sobre premios */}
      <div className="rounded-2xl border border-black/10 bg-black/[0.03] p-5">
        <p className="font-semibold mb-1">Dudas sobre premios</p>
        <p className="text-black/75">
          Escríbenos por WhatsApp:{" "}
          <WhatsAppLink
            phoneE164="593997241804"
            label="099 724 1804"
            message="Hola, tengo una consulta sobre premios y categorías de la 10K Ruta de los Tres Juanes 2026."
          />
        </p>
      </div>

      {tables.map((t) => (
        <div
          key={t.title}
          className="rounded-2xl border border-black/10 overflow-hidden"
        >
          <div className="px-4 py-3 bg-black/[0.03] border-b border-black/10">
            <p className="font-bold uppercase tracking-[0.18em] text-[12px] text-black/70">
              {t.title}
            </p>
          </div>
          <div className="overflow-auto">
            <table className="w-full min-w-[560px] text-[15px] sm:text-[16px]">
              <thead>
                <tr className="text-left">
                  {t.headers.map((h) => (
                    <th
                      key={h}
                      className="px-4 py-3 font-extrabold text-black/70 border-b border-black/10"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {t.rows.map((r) => (
                  <tr
                    key={r[0]}
                    className="border-b border-black/5 last:border-0"
                  >
                    <td className="px-4 py-3 font-bold text-black/80">{r[0]}</td>
                    <td className="px-4 py-3">{r[1]}</td>
                    <td className="px-4 py-3">{r[2]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ))}

      <div className="rounded-2xl border border-black/10 overflow-hidden">
        <div className="px-4 py-3 bg-black/[0.03] border-b border-black/10">
          <p className="font-bold uppercase tracking-[0.18em] text-[12px] text-black/70">
            CAPACIDADES ESPECIALES / SILLA DE CALLE / INTERFUERZAS
          </p>
        </div>
        <div className="overflow-auto">
          <table className="w-full min-w-[780px] text-[15px] sm:text-[16px]">
            <thead>
              <tr className="text-left">
                <th className="px-4 py-3 font-extrabold text-black/70 border-b border-black/10">
                  UBICACIÓN
                </th>
                <th className="px-4 py-3 font-extrabold text-black/70 border-b border-black/10">
                  Discapacidad Intelectual y Visual
                </th>
                <th className="px-4 py-3 font-extrabold text-black/70 border-b border-black/10">
                  SILLA DE CALLE
                </th>
                <th className="px-4 py-3 font-extrabold text-black/70 border-b border-black/10">
                  INTERFUERZAS
                </th>
              </tr>
            </thead>
            <tbody>
              {[
                ["PRIMERO", "2", "2", "2"],
                ["SEGUNDO", "1", "1", "1"],
                ["TERCERO", "1", "1", "1"],
              ].map((r) => (
                <tr
                  key={r[0]}
                  className="border-b border-black/5 last:border-0"
                >
                  <td className="px-4 py-3 font-bold text-black/80">{r[0]}</td>
                  <td className="px-4 py-3">{r[1]}</td>
                  <td className="px-4 py-3">{r[2]}</td>
                  <td className="px-4 py-3">{r[3]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function AnexoOrdenanza() {
  return (
    <div className="space-y-6">
      <p>
        Reglamento de aplicación al artículo 6 de la ORDENANZA MUNICIPAL que
        establece los incentivos para la Carrera Atlética 10K Ruta de los Tres
        Juanes.
      </p>

      <div>
        <p className="font-extrabold">Artículo 1.- Objeto.–</p>
        <p className="mt-2">
          La ordenanza que establece los incentivos para la Carrera Atlética 10K
          Ruta de los Tres Juanes asigna recursos que se utilizarán para premiar
          a los ganadores, conforme lo determinado en el presente reglamento.
        </p>
      </div>

      <div>
        <p className="font-extrabold">Artículo 2.- Categorías.–</p>
        <p className="mt-2">
          Se constituyen las siguientes categorías, en base a las cuales se
          realizará la distribución de los recursos fijados en la ordenanza que
          establece los incentivos para la Carrera Atlética 10K Ruta de los Tres
          Juanes:
        </p>
        <div className="mt-3 grid sm:grid-cols-2 gap-2 text-black/85">
          <div>ELITE — DAMAS Y VARONES</div>
          <div>JUVENIL — DAMAS Y VARONES (Hasta 19 años 11 meses)</div>
          <div>SENIOR 1 — DAMAS Y VARONES (De 20 a 29 años 11 meses)</div>
          <div>SENIOR 2 — DAMAS Y VARONES (De 30 a 39 años 11 meses)</div>
          <div>MASTER — DAMAS Y VARONES (De 40 a 49 años 11 meses)</div>
          <div>SUPERMASTER — DAMAS Y VARONES (De 50 a 59 años 11 meses)</div>
          <div>VILCABAMBAS — DAMAS Y VARONES (De 60 años en adelante)</div>
          <div>COLEGIAL — DAMAS Y VARONES (De 14 a 18 años 11 meses)</div>
          <div className="sm:col-span-2">
            CAPACIDADES ESPECIALES — Discapacidad intelectual y visual / Silla de
            calle / Interfuerzas
          </div>
        </div>
        <p className="mt-3 text-black/70">
          Los límites de edad para cada categoría se toman en cuenta a la fecha
          de realización de la competencia atlética 10K Ruta de los Tres Juanes.
        </p>
      </div>

      <div>
        <p className="font-extrabold">Artículo 3.- Distribución.–</p>
        <p className="mt-2">
          La entrega de los recursos fijados en la ordenanza que establece los
          incentivos para la Carrera Atlética 10K Ruta de los Tres Juanes se
          realizará según el detalle descrito en las tablas de “Premios y
          categorías”.
        </p>
      </div>

      <div>
        <p className="font-extrabold">Artículo 4.- Requisitos para el pago.–</p>
        <p className="mt-2">
          Los requisitos para proceder con los pagos serán los siguientes:
        </p>
        <ol className="mt-3 list-decimal pl-6 space-y-1 text-black/85">
          <li>
            Resolución de Concejo Municipal donde se da por conocido el informe
            técnico y económico.
          </li>
          <li>
            Oficio de solicitud de pago formulado por el Director de Cultura,
            Turismo, Deportes y Recreación, en el que se incluye el listado de
            beneficiarios.
          </li>
          <li>Copia de cédula de ciudadanía.</li>
          <li>Copia del certificado bancario o de la cuenta bancaria.</li>
          <li>
            En caso de que el ganador sea menor de edad, se deberá adjuntar copia
            de cédula del representante legal.
          </li>
        </ol>
      </div>

      <div>
        <p className="font-extrabold">Artículo 5.-</p>
        <p className="mt-2">
          Una vez efectuados los pagos, de existir valores no cobrados se
          procederá a liquidar la certificación presupuestaria con el propósito
          de liberar esos fondos para que sean utilizados por el GAD
          Municipalidad de Ambato.
        </p>
      </div>

      <div>
        <p className="font-extrabold">Artículo 6.-</p>
        <p className="mt-2">
          Encárguese de la administración de estos recursos a la Dirección de
          Cultura, Turismo, Deportes y Recreación.
        </p>
      </div>
    </div>
  );
}

/**
 * Link reutilizable a WhatsApp con mensaje prellenado (wa.me)
 * - phoneE164: SOLO números sin "+"
 * - label: texto visible
 */
function WhatsAppLink({
  phoneE164,
  label,
  message,
}: {
  phoneE164: string;
  label: string;
  message: string;
}) {
  const href = `https://wa.me/${phoneE164}?text=${encodeURIComponent(message)}`;

  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="font-extrabold underline underline-offset-4 hover:opacity-80"
      aria-label={`Abrir WhatsApp al ${label}`}
    >
      {label}
    </a>
  );
}
