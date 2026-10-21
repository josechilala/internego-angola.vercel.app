import { ArrowRight, Mail, MessageCircle, Phone } from "lucide-react";
import { Reveal } from "@/components/home/Reveal";

const email = "geral@internego.ao";
const emailHref = `mailto:${email}?subject=${encodeURIComponent("Pedido de orçamento | INTERNEGO")}`;
const whatsappHref = `https://wa.me/244942036369?text=${encodeURIComponent("Olá, gostaria de obter um orçamento para os serviços da INTERNEGO.")}`;

export function ContactSection() {
  return (
    <section className="contact-band" id="contacto" aria-labelledby="contact-title">
      <div className="contact-band__pattern" aria-hidden="true" />
      <Reveal className="contact-band__inner section-wrap">
        <div className="contact-band__copy">
          <p className="eyebrow eyebrow--light"><span className="eyebrow__line" /> Vamos Conversar</p>
          <h2 id="contact-title">A solução certa para a segurança e organização do seu espaço.</h2>
          <p>Entre em contacto com a INTERNEGO e descubra como podemos responder às suas necessidades.</p>
          <div className="contact-band__actions">
            <a className="button button--light" href={whatsappHref} target="_blank" rel="noopener noreferrer">
              Solicitar Orçamento <ArrowRight aria-hidden="true" size={17} />
            </a>
            <a className="contact-band__secondary" href={emailHref}>
              <Mail aria-hidden="true" size={16} /> Enviar por e-mail <span aria-hidden="true">↗</span>
            </a>
          </div>
        </div>
        <div className="contact-band__details" aria-label="Contactos da INTERNEGO">
          <a href="tel:+244942036369"><Phone aria-hidden="true" size={17} /><span>+244 942 036 369</span></a>
          <a href="tel:+244963147527"><Phone aria-hidden="true" size={17} /><span>+244 963 147 527</span></a>
          <a href={`mailto:${email}`}><Mail aria-hidden="true" size={17} /><span>{email}</span></a>
          <a href={whatsappHref} target="_blank" rel="noopener noreferrer"><MessageCircle aria-hidden="true" size={17} /><span>WhatsApp: +244 942 036 369</span></a>
        </div>
      </Reveal>
    </section>
  );
}