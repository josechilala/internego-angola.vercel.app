import Image from "next/image";
import { ArrowRight, Building2 } from "lucide-react";
import { Reveal } from "@/components/home/Reveal";

export function AboutSection() {
  return (
    <section className="about section-wrap" id="sobre" aria-labelledby="about-title">
      <Reveal className="about__title">
        <p className="eyebrow"><span className="eyebrow__line" /> Quem Somos</p>
        <h2 className="section-heading" id="about-title">
          Uma empresa. <span>Diferentes soluções.</span> O mesmo compromisso com a excelência.
        </h2>
      </Reveal>

      <Reveal className="about__copy">
        <p className="body-copy">
          A INTERNEGO é uma empresa angolana prestadora de serviços com atuação em Segurança
          Privada, Gestão de Resíduos e Saneamento Urbano. Trabalhamos com atenção às necessidades
          de clientes empresariais, institucionais e particulares.
        </p>
        <a className="text-link" href="#servicos">
          Conheça as nossas áreas <ArrowRight aria-hidden="true" size={16} />
        </a>
      </Reveal>

      <Reveal className="about__visual">
        <div className="about__visual-heading">
          <span className="about__visual-icon"><Building2 aria-hidden="true" size={20} /></span>
          <span>Uma estrutura, duas áreas de atuação</span>
        </div>
        <div className="about__division about__division--security">
          <span className="division-logo division-logo--security">
            <Image src="/media/8.jpeg" alt="Logótipo da INTERNEGO - Divisão de Segurança, Lda." fill sizes="200px" />
          </span>
          <span><strong>Segurança</strong><small>Proteção e vigilância</small></span>
          <span className="about__division-number">01</span>
        </div>
        <div className="about__division about__division--waste">
          <span className="division-logo division-logo--waste">
            <Image src="/media/7.jpeg" alt="Logótipo da INTERNEGO - Gestão de Resíduos e Saneamento Urbano." fill sizes="200px" />
          </span>
          <span><strong>Gestão de Resíduos</strong><small>Saneamento urbano</small></span>
          <span className="about__division-number">02</span>
        </div>
        <div className="about__visual-footnote"><span /> Compromisso com pessoas e espaços</div>
      </Reveal>
    </section>
  );
}