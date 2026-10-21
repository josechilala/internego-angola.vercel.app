import { AboutSection } from "@/components/home/AboutSection";
import { ContactSection } from "@/components/home/ContactSection";
import { DivisionsSection } from "@/components/home/DivisionsSection";
import { HeroSection } from "@/components/home/HeroSection";
import { PrinciplesSection } from "@/components/home/PrinciplesSection";
import { ProjectsSection } from "@/components/home/ProjectsSection";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";

export const revalidate = 60;

export default function HomePage() {
  return (
    <>
      <a className="skip-link" href="#conteudo-principal">
        Saltar para o conteúdo principal
      </a>
      <SiteHeader />
      <main id="conteudo-principal">
        <HeroSection />
        <AboutSection />
        <DivisionsSection />
        <ProjectsSection />
        <PrinciplesSection />
        <ContactSection />
      </main>
      <SiteFooter />
    </>
  );
}