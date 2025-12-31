import dynamic from "next/dynamic";

// 1. Carga Eager (Inmediata): CRÍTICO para LCP
// Estos componentes deben renderizarse instantáneamente.
import Hero from "./components/Hero";
import Publicidad from "./components/Publicidad";
import FloatingCTA from "./components/FloatingCTA";

// --- UTILIDAD DE CARGA (Para evitar CLS) ---
// Este componente reserva espacio mientras se descarga el JS del componente real.
// 'h-auto' es peligroso en lazy loading, mejor alturas fijas aproximadas.
const SectionLoader = ({ heightClass = "h-64" }) => (
  <div className={`w-full ${heightClass} bg-gray-50/50 animate-pulse`} aria-hidden="true" />
);

// 2. Carga Lazy (Diferida) con RESERVA DE ESPACIO
// Añadimos la propiedad 'loading' para mantener la estabilidad visual.

const TopGallery = dynamic(() => import("./components/TopGallery"), {
  loading: () => <SectionLoader heightClass="h-[300px] md:h-[400px]" />,
});

const SponsorsStrip = dynamic(() => import("./components/SponsorsStrip"), {
  loading: () => <SectionLoader heightClass="h-20 md:h-24" />, // Tira de logos baja
});

const CountdownStrip = dynamic(() => import("./components/CountdownStrip"), {
  loading: () => <SectionLoader heightClass="h-32 md:h-40" />,
});

const RegistrationOptions = dynamic(() => import("./components/RegistrationOptions"), {
  loading: () => <SectionLoader heightClass="min-h-[500px]" />, // Sección de precios suele ser alta
});

const InfoBeforeRace = dynamic(() => import("./components/InfoBeforeRace"), {
  loading: () => <SectionLoader heightClass="min-h-[400px]" />,
});

const ExperienceSection = dynamic(() => import("./components/ExperienceSection"), {
  loading: () => <SectionLoader heightClass="min-h-[600px]" />,
});

const FeaturedStories = dynamic(() => import("./components/FeaturedStories"), {
  loading: () => <SectionLoader heightClass="min-h-[500px]" />,
});

const ReglamentoSection = dynamic(() => import("./components/ReglamentoSection"), {
  loading: () => <SectionLoader heightClass="min-h-[400px]" />,
});

export default function Home() {
  return (
    // 'min-h-screen' asegura que el footer no suba si carga lento
    <main className="relative min-h-screen w-full overflow-x-hidden bg-white">
      
      {/* NOTA TÉCNICA:
         Mantenemos el orden visual intacto.
         Publicidad y Hero son LCP -> Se renderizan normal.
         El resto se hidrata progresivamente.
      */}

      <div className="flex flex-col">
        <Publicidad />
        <Hero />
      </div>

      {/* Secciones Lazy Loaded */}
      <TopGallery />
      
      <SponsorsStrip />
      
      <section id="countdown">
        <CountdownStrip />
      </section>

      <section id="inscripciones">
        <RegistrationOptions />
      </section>

      <section id="info">
        <InfoBeforeRace />
      </section>

      <ExperienceSection />
      
      <FeaturedStories />
      
      <section id="reglamento">
        <ReglamentoSection />
      </section>

      {/* CTA Flotante:
          Al ser 'fixed', no genera CLS, pero lo dejamos al final del DOM
          para que no bloquee la renderización del contenido principal.
      */}
      <FloatingCTA />
      
    </main>
  );
}