import { ClipboardCheck } from "lucide-react";
import { Reveal } from "@/components/home/Reveal";
import { ProjectGallery } from "@/components/projects/ProjectGallery";
import { getPublishedProjects } from "@/lib/supabase/projects";

export async function ProjectsSection() {
  const publishedProjects = await getPublishedProjects();

  return (
    <section className="projects" id="projetos" aria-labelledby="projects-title">
      <div className="section-wrap">
        <Reveal className="projects__heading">
          <p className="eyebrow"><span className="eyebrow__line" /> Projetos e Operações</p>
          <h2 className="section-heading" id="projects-title">Trabalho com propósito.</h2>
          <p className="body-copy">
            Conheça projetos publicados pela INTERNEGO nas suas áreas de atuação.
          </p>
        </Reveal>

        {publishedProjects.length > 0 ? (
          <ProjectGallery projects={publishedProjects} />
        ) : (
          <Reveal className="projects__empty">
            <span className="projects__mark"><ClipboardCheck aria-hidden="true" size={25} /></span>
            <div className="projects__copy">
              <p className="eyebrow">Projetos e Operações</p>
              <h3>Projetos em preparação</h3>
              <p className="body-copy">
                Esta área será atualizada quando houver projetos e imagens aprovados para divulgação.
              </p>
            </div>
          </Reveal>
        )}
      </div>
    </section>
  );
}