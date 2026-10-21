import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { ProjectPhotoGallery } from "@/components/projects/ProjectPhotoGallery";
import { getProjectCategoryLabel, type Project } from "@/data/projects";

export function ProjectDetails({ project }: { project: Project }) {
  return (
    <main className="project-detail section-wrap">
      <Link className="project-detail__back" href="/#projetos">
        <ArrowLeft aria-hidden="true" size={16} /> Voltar a Projetos e Operações
      </Link>
      <header className="project-detail__header">
        <p className="eyebrow"><span className="eyebrow__line" /> {getProjectCategoryLabel(project.category)}</p>
        <h1>{project.title}</h1>
        <p className="project-detail__description">{project.description}</p>
        <div className="project-detail__meta">
          {project.location && <span>{project.location}</span>}
          {project.date && <time dateTime={project.date}>{project.date}</time>}
        </div>
      </header>
      <ProjectPhotoGallery photos={project.photos} projectTitle={project.title} />
    </main>
  );
}