import dynamic from "next/dynamic";

// 1. Carga Eager (Inmediata): Estos son críticos para el LCP (Largest Contentful Paint)
import Hero from "./components/Hero";
import Publicidad from "./components/Publicidad"; // Asumo que es un banner superior
import FloatingCTA from "./components/FloatingCTA";

// 2. Carga Lazy (Diferida): Se cargan mientras el usuario hace scroll.
// Esto reduce el peso inicial del JS y acelera la carga en móviles.
const TopGallery = dynamic(() => import("./components/TopGallery"));
const SponsorsStrip = dynamic(() => import("./components/SponsorsStrip"));
const CountdownStrip = dynamic(() => import("./components/CountdownStrip"));
const RegistrationOptions = dynamic(() => import("./components/RegistrationOptions"));
const InfoBeforeRace = dynamic(() => import("./components/InfoBeforeRace"));
const ExperienceSection = dynamic(() => import("./components/ExperienceSection"));
const FeaturedStories = dynamic(() => import("./components/FeaturedStories"));
const ReglamentoSection = dynamic(() => import("./components/ReglamentoSection"));

export default function Home() {
  return (
    // Usamos <main> para semántica SEO
    <main className="relative min-h-screen w-full overflow-x-hidden">
      
      {/* NOTA DE DISEÑO:
         He quitado el 'gap' global del contenedor padre. 
         ¿Por qué? Porque en tu diseño tienes secciones oscuras seguidas de claras.
         Si usas gap, verás una línea blanca (o del color del body) entre ellas.
         Es mejor que cada componente tenga su propio 'py-16' o 'py-20'.
      */}

      {/* Bloque Superior Crítico */}
      <div className="flex flex-col">
        <Publicidad />
        <Hero />
      </div>

      {/* Secciones de Contenido */}
      <TopGallery />
      
      <SponsorsStrip />
      
      {/* Este ID permite navegar aquí desde el menú */}
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

      {/* CTA Flotante (Fixed) */}
      <FloatingCTA />
      
    </main>
  );
}