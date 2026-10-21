"use client";

import Link from "next/link";
import { Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import { BrandLogo } from "@/components/layout/BrandLogo";

const navigation = [
  { label: "Início", href: "#inicio" },
  { label: "Sobre Nós", href: "#sobre" },
  { label: "Serviços", href: "#servicos" },
  { label: "Projetos", href: "#projetos" },
  { label: "Contactos", href: "#contacto" },
];

export function SiteHeader() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("inicio");

  useEffect(() => {
    const updateScrollState = () => setIsScrolled(window.scrollY > 12);
    const sections = navigation
      .map(({ href }) => document.querySelector(href))
      .filter((section): section is Element => section !== null);
    const observer = new IntersectionObserver(
      (entries) => {
        const visibleSection = entries.find((entry) => entry.isIntersecting);
        if (visibleSection?.target.id) setActiveSection(visibleSection.target.id);
      },
      { rootMargin: "-25% 0px -65% 0px" },
    );

    updateScrollState();
    sections.forEach((section) => observer.observe(section));
    window.addEventListener("scroll", updateScrollState, { passive: true });
    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", updateScrollState);
    };
  }, []);

  return (
    <header className={`site-header${isScrolled ? " is-scrolled" : ""}`}>
      <div className="site-header__inner">
        <Link className="site-header__brand" href="/#inicio" aria-label="INTERNEGO, início">
          <BrandLogo priority />
        </Link>

        <nav
          id="menu-principal"
          className={`site-nav${isMenuOpen ? " is-open" : ""}`}
          aria-label="Navegação principal"
        >
          {navigation.map((item) => (
            <Link
              key={item.href}
              href={`/${item.href}`}
              aria-current={activeSection === item.href.slice(1) ? "location" : undefined}
              className={activeSection === item.href.slice(1) ? "is-active" : undefined}
              onClick={() => setIsMenuOpen(false)}
            >
              {item.label}
            </Link>
          ))}
          <Link className="site-nav__mobile-cta" href="/#contacto" onClick={() => setIsMenuOpen(false)}>
            Solicitar Orçamento
          </Link>
        </nav>

        <Link className="button button--nav" href="/#contacto">
          Solicitar Orçamento
        </Link>

        <button
          className="site-header__menu-toggle"
          type="button"
          aria-label={isMenuOpen ? "Fechar menu" : "Abrir menu"}
          aria-expanded={isMenuOpen}
          aria-controls="menu-principal"
          onClick={() => setIsMenuOpen((open) => !open)}
        >
          {isMenuOpen ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
        </button>
      </div>
    </header>
  );
}