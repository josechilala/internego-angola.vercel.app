export type ProjectCategory = "seguranca-privada" | "gestao-residuos";

export type ProjectPhoto = {
  id: string;
  src: string;
  alt: string;
  caption?: string;
  sortOrder: number;
};

export type Project = {
  id: string;
  slug: string;
  title: string;
  description: string;
  category: ProjectCategory;
  status: "draft" | "published";
  location?: string;
  date?: string;
  photos: ProjectPhoto[];
};

export function getProjectCategoryLabel(category: ProjectCategory): string {
  return category === "seguranca-privada" ? "Segurança Privada" : "Gestão de Resíduos";
}