import {
  BadgeCheck,
  Handshake,
  HeartHandshake,
  ShieldCheck,
  Sparkles,
  UsersRound,
} from "lucide-react";
import { Reveal } from "@/components/home/Reveal";

const principles = [
  { label: "Profissionalismo", Icon: BadgeCheck },
  { label: "Responsabilidade", Icon: ShieldCheck },
  { label: "Compromisso", Icon: Handshake },
  { label: "Confiança", Icon: HeartHandshake },
  { label: "Qualidade", Icon: Sparkles },
  { label: "Atenção ao Cliente", Icon: UsersRound },
];

export function PrinciplesSection() {
  return (
    <section className="principles" aria-labelledby="principles-title">
      <div className="section-wrap">
        <Reveal className="principles__heading">
          <p className="eyebrow"><span className="eyebrow__line" /> Os Nossos Princípios</p>
          <h2 className="section-heading" id="principles-title">O compromisso que orienta a nossa atuação.</h2>
        </Reveal>
        <div className="principles__grid">
          {principles.map(({ label, Icon }, index) => (
            <Reveal key={label} className="principle">
              <span className="principle__icon"><Icon aria-hidden="true" size={21} strokeWidth={1.7} /></span>
              <span className="principle__label">{label}</span>
              <span className="principle__number">0{index + 1}</span>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}