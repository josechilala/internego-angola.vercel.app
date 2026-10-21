import Link from "next/link";
import { ArrowUpRight, Mail, MessageCircle, Phone } from "lucide-react";
import { BrandLogo } from "@/components/layout/BrandLogo";

const email = "geral@internego.ao";
const whatsappHref = `https://wa.me/244942036369?text=${encodeURIComponent("Olá, gostaria de mais informações sobre os serviços da INTERNEGO.")}`;

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="section-wrap">
        <div className="site-footer__main">
          <div className="site-footer__identity">
            <Link href="/#inicio" aria-label="INTERNEGO, voltar ao início"><BrandLogo /></Link>
            <p>Segurança Privada, Gestão de Resíduos e Saneamento Urbano.</p>
          </div>

          <nav className="site-footer__column" aria-label="Ligações rápidas">
            <h2>Navegação</h2>
            <Link href="/#sobre">Sobre Nós</Link>
            <Link href="/#servicos">Serviços</Link>
            <Link href="/#projetos">Projetos</Link>
            <Link href="/#contacto">Contactos</Link>
          </nav>

          <div className="site-footer__column">
            <h2>Divisões</h2>
            <Link href="/#seguranca">Segurança Privada <ArrowUpRight aria-hidden="true" size={13} /></Link>
            <Link href="/#residuos">Gestão de Resíduos <ArrowUpRight aria-hidden="true" size={13} /></Link>
          </div>

          <div className="site-footer__column site-footer__contacts">
            <h2>Contactos</h2>
            <a href="tel:+244942036369"><Phone aria-hidden="true" size={14} /> +244 942 036 369</a>
            <a href="tel:+244963147527"><Phone aria-hidden="true" size={14} /> +244 963 147 527</a>
            <a href={whatsappHref} target="_blank" rel="noopener noreferrer"><MessageCircle aria-hidden="true" size={14} /> WhatsApp</a>
            <a href={`mailto:${email}`}><Mail aria-hidden="true" size={14} /> {email}</a>
          </div>
        </div>

        <div className="site-footer__bottom">
          <p>© {new Date().getFullYear()} INTERNEGO – Prestação de Serviço, Lda. Todos os direitos reservados.</p>
          <a id="politica-de-privacidade" href="#politica-de-privacidade" aria-label="Política de Privacidade, em preparação">
            Política de Privacidade <span>· Em preparação</span>
          </a>
        </div>
      </div>
    </footer>
  );
}