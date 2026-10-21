import Image from "next/image";
import { ArrowRight, BadgeCheck, Handshake, Recycle, ShieldCheck } from "lucide-react";

export function HeroSection() {
  return (
    <section className="hero hero--dark" id="inicio" aria-labelledby="hero-title">
      <div className="hero__copy">
        <p className="eyebrow"><span className="eyebrow__line" /> Prestação de Serviços em Angola</p>
        <h1 id="hero-title">
          <span className="hero__brand-name">INTERNEGO</span>
          <span className="hero__headline">Confiança, Proteção e <em>Compromisso</em> com o <em>Futuro.</em></span>
        </h1>
        <p className="hero__description">
          Soluções profissionais em Segurança Privada, Gestão de Resíduos e Saneamento Urbano,
          orientadas pela responsabilidade, qualidade e confiança.
        </p>
        <div className="hero__actions">
          <a className="button button--primary" href="#servicos">
            Conheça os Nossos Serviços <ArrowRight aria-hidden="true" size={17} />
          </a>
          <a className="button button--hero-secondary" href="#contacto">
            Solicitar Orçamento <span aria-hidden="true">↗</span>
          </a>
        </div>
        <div className="hero__principles" aria-label="Princípios da INTERNEGO">
          <span><BadgeCheck aria-hidden="true" size={17} /> Profissionalismo</span>
          <span><ShieldCheck aria-hidden="true" size={17} /> Responsabilidade</span>
          <span><Handshake aria-hidden="true" size={17} /> Compromisso</span>
        </div>
      </div>

      <div className="hero__visual" aria-label="Imagens ilustrativas das duas divisões da INTERNEGO">
        <a className="hero-image hero-image--security" href="#seguranca">
          <Image
            src="/imagens/seguranca-privada/equipa-seguranca.jpg"
            alt="Equipa fardada da divisão de Segurança Privada da INTERNEGO, em material ilustrativo."
            fill
            sizes="(max-width: 760px) 100vw, (max-width: 1100px) 45vw, 26vw"
            priority
            className="hero-image__photo hero-image__photo--security"
          />
          <span className="hero-image__shade" />
          <span className="hero-image__division-brand">
            <Image src="/imagens/logotipos/seguranca.jpg" alt="" fill sizes="150px" />
          </span>
          <span className="hero-image__content">
            <span className="hero-image__icon"><ShieldCheck aria-hidden="true" size={19} /></span>
            <span><strong>Segurança Privada</strong><small>Proteção de pessoas, instalações e património.</small></span>
            <span className="hero-image__link">Conhecer a Divisão <ArrowRight aria-hidden="true" size={15} /></span>
          </span>
          <span className="image-note">Imagem ilustrativa</span>
        </a>

        <a className="hero-image hero-image--waste" href="#residuos">
          <Image
            src="/imagens/gestao-residuos/recolha-residuos.jpg"
            alt="Material ilustrativo da INTERNEGO com camião e profissional de recolha de resíduos."
            fill
            priority
            sizes="(max-width: 760px) 100vw, (max-width: 1100px) 45vw, 26vw"
            className="hero-image__photo hero-image__photo--waste"
          />
          <span className="hero-image__shade" />
          <span className="hero-image__division-brand">
            <Image src="/imagens/logotipos/residuos.jpg" alt="" fill sizes="150px" />
          </span>
          <span className="hero-image__content">
            <span className="hero-image__icon hero-image__icon--green"><Recycle aria-hidden="true" size={19} /></span>
            <span><strong>Gestão de Resíduos</strong><small>Cidades mais limpas e sustentáveis.</small></span>
            <span className="hero-image__link">Conhecer a Divisão <ArrowRight aria-hidden="true" size={15} /></span>
          </span>
          <span className="image-note">Imagem ilustrativa</span>
        </a>
      </div>
    </section>
  );
}