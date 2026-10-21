"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useState } from "react";
import { getProjectCategoryLabel, type Project, type ProjectCategory } from "@/data/projects";
import { ProjectPhotoGallery } from "@/components/projects/ProjectPhotoGallery";

type ProjectGalleryProps = {
  projects: Project[];
};

const filters: { label: string; value: ProjectCategory | "all" }[] = [
  { label: "Todos", value: "all" },
  { label: "Segurança Privada", value: "seguranca-privada" },
  { label: "Gestão de Resíduos", value: "gestao-residuos" },
];

export function ProjectGallery({ projects }: ProjectGalleryProps) {
  const [activeCategory, setActiveCategory] = useState<ProjectCategory | "all">("all");
  const visibleProjects = activeCategory === "all"
    ? projects
    : projects.filter((project) => project.category === activeCategory);

  return (
    <div className="project-gallery">
      <div className="project-filters" role="group" aria-label="Filtrar projetos por categoria">
        {filters.map((filter) => (
          <button
            className={`project-filter${activeCategory === filter.value ? " is-active" : ""}`}
            key={filter.value}
            type="button"
            aria-pressed={activeCategory === filter.value}
            onClick={() => setActiveCategory(filter.value)}
          >
            {filter.label}
          </button>
        ))}
      </div>

      {visibleProjects.length > 0 ? (
        <div className="project-grid">
          {visibleProjects.map((project) => (
            <article className="project-card" key={project.slug}>
              <ProjectPhotoGallery photos={project.photos} preview projectTitle={project.title} />
              <div className="project-card__body">
                <p className="project-card__category">{getProjectCategoryLabel(project.category)}</p>
                <h3><Link href={`/projetos/${project.slug}`}>{project.title}</Link></h3>
                <p className="project-card__description">{project.description}</p>
                <Link className="project-card__link" href={`/projetos/${project.slug}`}>
                  Ver projeto <ArrowRight aria-hidden="true" size={16} />
                </Link>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <p className="project-gallery__empty" role="status">
          Não existem projetos publicados nesta categoria.
        </p>
      )}
    </div>
  );
}