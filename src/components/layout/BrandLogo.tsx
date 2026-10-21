import Image from "next/image";

type BrandLogoProps = {
  className?: string;
  priority?: boolean;
};

export function BrandLogo({ className = "", priority = false }: BrandLogoProps) {
  return (
    <span className={`brand-logo ${className}`}>
      <Image
        src="/media/9.jpeg"
        alt="INTERNEGO - Prestação de Serviço, Lda."
        fill
        priority={priority}
        sizes="(max-width: 640px) 156px, 200px"
        className="brand-logo__image"
      />
    </span>
  );
}