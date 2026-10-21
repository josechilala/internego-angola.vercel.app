import type { Metadata, Viewport } from "next";
import { Manrope } from "next/font/google";
import "./globals.css";
import "@/styles/dark-premium.css";

const manrope = Manrope({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-manrope",
});

export const metadata: Metadata = {
  title: "INTERNEGO | Segurança, Resíduos e Saneamento em Angola",
  description:
    "Soluções profissionais em Segurança Privada, Gestão de Resíduos e Saneamento Urbano em Angola. Conheça a INTERNEGO e contacte a nossa equipa.",
  openGraph: {
    title: "INTERNEGO | Confiança, Proteção e Compromisso",
    description:
      "Soluções profissionais em Segurança Privada, Gestão de Resíduos e Saneamento Urbano.",
    locale: "pt_AO",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#062F40",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-AO">
      <body className={`${manrope.variable} ${manrope.className}`}>{children}</body>
    </html>
  );
}