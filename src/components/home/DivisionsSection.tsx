import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { Reveal } from "@/components/home/Reveal";

export function DivisionsSection() {
  return (
    <section className="divisions" id="servicos" aria-labelledby="divisions-title">
      <div className="section-wrap divisions__intro">
        <Reveal>
          <p className="eyebrow"><span className="eyebrow__line" /> As Nossas Áreas de Atuação</p>
          <h2 className="section-heading" id="divisions-title">Serviços que cuidam do que mais importa.</h2>
        </Reveal>
        <p className="divisions__intro-note">Duas áreas distintas, orientadas por um compromisso comum com qualidade e confiança.</p>
      </div>

      <article className="division-row section-wrap" id="seguranca" aria-labelledby="security-title">
        <Reveal className="division-row__media division-row__media--security">
          <Image
            src="/imagens/seguranca-privada/videovigilancia.jpg"
            alt="Câmara de videovigilância no material ilustrativo da divisão de Segurança da INTERNEGO."
            fill
            sizes="(max-width: 760px) 100vw, 50vw"
            className="division-row__photo division-row__photo--security"
          />
          <span className="image-note">Imagem ilustrativa</span>
          <span className="division-row__media-label">01 / Segurança</span>
        </Reveal>
        <Reveal className="division-row__copy division-row__copy--security">
          <p className="eyebrow eyebrow--security">INTERNEGO <span>·</span> Divisão de Segurança</p>
          <h3 id="security-title">Proteção que inspira confiança.</h3>
          <p className="body-copy">
            Soluções de segurança e vigilância orientadas para a proteção de pessoas, instalações
            e património.
          </p>
          <a className="button button--outline" href="#contacto">
            Conhecer a Divisão de Segurança <ArrowRight aria-hidden="true" size={16} />
          </a>
          <span className="division-row__index" aria-hidden="true">01</span>
        </Reveal>
      </article>

      <article className="division-row division-row--reverse section-wrap" id="residuos" aria-labelledby="waste-title">
        <Reveal className="division-row__media division-row__media--waste">
          <Image
            src="/imagens/gestao-residuos/equipa-recolha.jpg"
            alt="Equipa de recolha de resíduos junto de contentores e camião da INTERNEGO."
            fill
            sizes="(max-width: 760px) 100vw, 50vw"
            className="division-row__photo division-row__photo--waste"
          />
          <span className="image-note">Imagem ilustrativa</span>
          <span className="division-row__media-label">02 / Gestão de Resíduos</span>
        </Reveal>
        <Reveal className="division-row__copy division-row__copy--waste">
          <p className="eyebrow eyebrow--waste">INTERNEGO <span>·</span> Gestão de Resíduos</p>
          <h3 id="waste-title">Cidades mais limpas. Futuro mais sustentável.</h3>
          <p className="body-copy">
            Soluções de gestão de resíduos e saneamento urbano que contribuem para ambientes mais
            limpos e organizados.
          </p>
          <a className="button button--outline button--outline-green" href="#contacto">
            Conhecer a Gestão de Resíduos <ArrowRight aria-hidden="true" size={16} />
          </a>
          <span className="division-row__index" aria-hidden="true">02</span>
        </Reveal>
      </article>
    </section>
  );
}