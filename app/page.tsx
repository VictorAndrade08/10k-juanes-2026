import Hero from "./components/Hero";
import Publicidad from "./components/Publicidad";
import TopGallery from "./components/TopGallery";
import SponsorsStrip from "./components/SponsorsStrip";
import CountdownStrip from "./components/CountdownStrip";
import RegistrationOptions from "./components/RegistrationOptions";
import InfoBeforeRace from "./components/InfoBeforeRace";
import ExperienceSection from "./components/ExperienceSection";
import FeaturedStories from "./components/FeaturedStories";
import ReglamentoSection from "./components/ReglamentoSection";
import FloatingCTA from "./components/FloatingCTA";

export default function Home() {
  return (
    <>
      {/* 🔥 Wrapper global que controla el espaciado entre secciones */}
      <div className="flex flex-col gap-10 md:gap-14">
        

        {/* 🎯 Publicidad estratégica */}
        <Publicidad />
        <Hero />

        <TopGallery />
        <SponsorsStrip />
        <CountdownStrip />
        <RegistrationOptions />
        <InfoBeforeRace />
        <ExperienceSection />
        <FeaturedStories />
        <ReglamentoSection />
      </div>

      {/* CTA flotante */}
      <FloatingCTA />
    </>
  );
}
