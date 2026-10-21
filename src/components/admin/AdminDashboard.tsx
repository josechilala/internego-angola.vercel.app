"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import {
  Check,
  ChevronRight,
  LogOut,
  Plus,
  Save,
  Trash2,
  Upload,
  X,
} from "lucide-react";
import type { Project, ProjectCategory, ProjectPhoto } from "@/data/projects";
import { getBrowserSupabaseClient } from "@/lib/supabase/browser";

type AdminDashboardProps = {
  initialProjects: Project[];
  email: string;
};

type ProjectForm = {
  title: string;
  slug: string;
  description: string;
  category: ProjectCategory;
  location: string;
  date: string;
};

const emptyForm: ProjectForm = {
  title: "",
  slug: "",
  description: "",
  category: "seguranca-privada",
  location: "",
  date: "",
};

async function readResponse(response: Response) {
  const result = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(result.error ?? "Não foi possível concluir a operação.");
  return result;
}

function toForm(project: Project): ProjectForm {
  return {
    title: project.title,
    slug: project.slug,
    description: project.description,
    category: project.category,
    location: project.location ?? "",
    date: project.date ?? "",
  };
}

function slugify(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 80);
}

export function AdminDashboard({ initialProjects, email }: AdminDashboardProps) {
  const router = useRouter();
  const [projects, setProjects] = useState(initialProjects);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [form, setForm] = useState<ProjectForm>(emptyForm);
  const [photoAlt, setPhotoAlt] = useState("");
  const [photoCaption, setPhotoCaption] = useState("");
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [feedback, setFeedback] = useState("");
  const [error, setError] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);

  const selectedProject = projects.find((project) => project.id === selectedProjectId) ?? null;
  const sortedProjects = [...projects].sort((first, second) => first.title.localeCompare(second.title, "pt"));

  function startNewProject() {
    setSelectedProjectId(null);
    setForm(emptyForm);
    setPhotoAlt("");
    setPhotoCaption("");
    setPhotoFile(null);
    setFeedback("");
    setError("");
  }

  function editProject(project: Project) {
    setSelectedProjectId(project.id);
    setForm(toForm(project));
    setPhotoAlt("");
    setPhotoCaption("");
    setPhotoFile(null);
    setFeedback("");
    setError("");
    setDeleteTarget(null);
  }

  function updateField<Key extends keyof ProjectForm>(key: Key, value: ProjectForm[Key]) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  async function saveProject(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSaving(true);
    setError("");
    setFeedback("");

    try {
      const response = await fetch(
        selectedProjectId ? `/api/admin/projects/${selectedProjectId}` : "/api/admin/projects",
        {
          method: selectedProjectId ? "PATCH" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        },
      );
      const saved = await readResponse(response);

      if (selectedProjectId) {
        setProjects((current) => current.map((project) => (
          project.id === selectedProjectId ? { ...project, ...saved } : project
        )));
      } else {
        setProjects((current) => [{ ...saved, photos: [] }, ...current]);
        setSelectedProjectId(saved.id);
      }

      setFeedback("Projeto guardado como rascunho. Carregue pelo menos uma fotografia antes de o publicar.");
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : "Não foi possível guardar o projeto.");
    } finally {
      setIsSaving(false);
    }
  }

  async function uploadPhoto(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!selectedProjectId || !photoFile) return;

    setIsUploading(true);
    setError("");
    setFeedback("");
    const body = new FormData();
    body.set("file", photoFile);
    body.set("alt", photoAlt);
    body.set("caption", photoCaption);

    try {
      const response = await fetch(`/api/admin/projects/${selectedProjectId}/photos`, { method: "POST", body });
      const photo = await readResponse(response) as ProjectPhoto;
      setProjects((current) => current.map((project) => (
        project.id === selectedProjectId ? { ...project, photos: [...project.photos, photo] } : project
      )));
      setPhotoFile(null);
      setPhotoAlt("");
      setPhotoCaption("");
      const input = document.getElementById("project-photo-file");
      if (input instanceof HTMLInputElement) input.value = "";
      setFeedback("Fotografia carregada no armazenamento privado.");
    } catch (uploadError) {
      setError(uploadError instanceof Error ? uploadError.message : "Não foi possível carregar a fotografia.");
    } finally {
      setIsUploading(false);
    }
  }

  async function changePublicationStatus(project: Project) {
    const nextStatus = project.status === "published" ? "draft" : "published";
    setError("");
    setFeedback("");

    try {
      const response = await fetch(`/api/admin/projects/${project.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: nextStatus }),
      });
      const result = await readResponse(response);
      setProjects((current) => current.map((item) => item.id === project.id ? { ...item, ...result } : item));
      setFeedback(nextStatus === "published" ? "Projeto publicado no site." : "Projeto despublicado e oculto do site.");
    } catch (publishError) {
      setError(publishError instanceof Error ? publishError.message : "Não foi possível atualizar a publicação.");
    }
  }

  async function removePhoto(photo: ProjectPhoto) {
    if (!selectedProjectId) return;
    setError("");
    setFeedback("");

    try {
      const response = await fetch(`/api/admin/photos/${photo.id}`, { method: "DELETE" });
      await readResponse(response);
      setProjects((current) => current.map((project) => (
        project.id === selectedProjectId
          ? { ...project, photos: project.photos.filter((item) => item.id !== photo.id) }
          : project
      )));
      setFeedback("Fotografia removida.");
    } catch (removeError) {
      setError(removeError instanceof Error ? removeError.message : "Não foi possível remover a fotografia.");
    }
  }

  async function removeProject(project: Project) {
    setError("");
    setFeedback("");

    try {
      const response = await fetch(`/api/admin/projects/${project.id}`, { method: "DELETE" });
      await readResponse(response);
      setProjects((current) => current.filter((item) => item.id !== project.id));
      if (selectedProjectId === project.id) startNewProject();
      setFeedback("Projeto e fotografias removidos.");
      setDeleteTarget(null);
    } catch (removeError) {
      setError(removeError instanceof Error ? removeError.message : "Não foi possível remover o projeto.");
    }
  }

  async function signOut() {
    const supabase = getBrowserSupabaseClient();
    await supabase?.auth.signOut();
    router.replace("/admin/login");
    router.refresh();
  }

  return (
    <main className="admin-shell">
      <header className="admin-topbar">
        <Link className="admin-topbar__brand" href="/">INTERNEGO <span>Gestão de projetos</span></Link>
        <div className="admin-topbar__account">
          <span>{email}</span>
          <button type="button" onClick={signOut} aria-label="Terminar sessão">
            <LogOut aria-hidden="true" size={16} /> Sair
          </button>
        </div>
      </header>

      <div className="admin-content">
        <div className="admin-heading">
          <div>
            <p className="eyebrow"><span className="eyebrow__line" /> Gestão de conteúdo</p>
            <h1>Projetos e Operações</h1>
            <p>Crie projetos, organize as fotografias e controle o que é publicado no site.</p>
          </div>
          <button className="button button--primary" type="button" onClick={startNewProject}>
            <Plus aria-hidden="true" size={17} /> Novo projeto
          </button>
        </div>

        {feedback && <p className="admin-banner admin-banner--success" role="status">{feedback}</p>}
        {error && <p className="admin-banner admin-banner--error" role="alert">{error}</p>}

        <div className="admin-workspace">
          <section className="admin-project-list" aria-labelledby="admin-projects-title">
            <div className="admin-project-list__heading">
              <h2 id="admin-projects-title">Projetos</h2>
              <span>{projects.length}</span>
            </div>
            {sortedProjects.length > 0 ? (
              <ul>
                {sortedProjects.map((project) => (
                  <li key={project.id}>
                    <button
                      className={`admin-project-row${selectedProjectId === project.id ? " is-selected" : ""}`}
                      type="button"
                      onClick={() => editProject(project)}
                    >
                      <span className="admin-project-row__copy">
                        <strong>{project.title}</strong>
                        <small>{project.category === "seguranca-privada" ? "Segurança Privada" : "Gestão de Resíduos"}</small>
                      </span>
                      <span className={`admin-status admin-status--${project.status}`}>
                        {project.status === "published" ? "Publicado" : "Rascunho"}
                      </span>
                      <ChevronRight aria-hidden="true" size={16} />
                    </button>
                    {deleteTarget === project.id ? (
                      <div className="admin-delete-confirm">
                        <span>Remover este projeto e as fotografias?</span>
                        <button type="button" onClick={() => void removeProject(project)}>Remover</button>
                        <button type="button" onClick={() => setDeleteTarget(null)} aria-label="Cancelar remoção"><X size={15} /></button>
                      </div>
                    ) : (
                      <button className="admin-project-delete" type="button" onClick={() => setDeleteTarget(project.id)} aria-label={`Preparar remoção de ${project.title}`}>
                        <Trash2 aria-hidden="true" size={15} />
                      </button>
                    )}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="admin-project-list__empty">Ainda não existem projetos. Crie o primeiro para começar.</p>
            )}
          </section>

          <section className="admin-editor" aria-labelledby="admin-editor-title">
            <div className="admin-editor__heading">
              <div>
                <p className="eyebrow">{selectedProject ? "Editar projeto" : "Novo conteúdo"}</p>
                <h2 id="admin-editor-title">{selectedProject?.title ?? "Detalhes do projeto"}</h2>
              </div>
              {selectedProject && (
                <span className={`admin-status admin-status--${selectedProject.status}`}>
                  {selectedProject.status === "published" ? "Publicado" : "Rascunho"}
                </span>
              )}
            </div>

            <form className="admin-form admin-form--project" onSubmit={saveProject}>
              <div className="admin-form__grid">
                <div>
                  <label htmlFor="project-title">Título</label>
                  <input
                    id="project-title"
                    value={form.title}
                    onChange={(event) => {
                      const title = event.target.value;
                      setForm((current) => ({
                        ...current,
                        title,
                        ...(!selectedProjectId ? { slug: slugify(title) } : {}),
                      }));
                    }}
                    required
                    maxLength={100}
                  />
                </div>
                <div>
                  <label htmlFor="project-slug">Endereço (slug)</label>
                  <input id="project-slug" value={form.slug} onChange={(event) => updateField("slug", event.target.value)} required maxLength={80} pattern="[a-z0-9]+(?:-[a-z0-9]+)*" />
                </div>
                <div>
                  <label htmlFor="project-category">Categoria</label>
                  <select id="project-category" value={form.category} onChange={(event) => updateField("category", event.target.value as ProjectCategory)}>
                    <option value="seguranca-privada">Segurança Privada</option>
                    <option value="gestao-residuos">Gestão de Resíduos</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="project-location">Localização (opcional)</label>
                  <input id="project-location" value={form.location} onChange={(event) => updateField("location", event.target.value)} maxLength={100} />
                </div>
                <div>
                  <label htmlFor="project-date">Data (opcional)</label>
                  <input id="project-date" type="date" value={form.date} onChange={(event) => updateField("date", event.target.value)} />
                </div>
                <div className="admin-form__full">
                  <label htmlFor="project-description">Descrição</label>
                  <textarea id="project-description" value={form.description} onChange={(event) => updateField("description", event.target.value)} required minLength={20} maxLength={1200} rows={4} />
                </div>
              </div>
              <button className="button button--primary" type="submit" disabled={isSaving}>
                <Save aria-hidden="true" size={16} /> {isSaving ? "A guardar..." : "Guardar rascunho"}
              </button>
            </form>

            {selectedProject && (
              <>
                <div className="admin-photo-section">
                  <div className="admin-photo-section__heading">
                    <div>
                      <h3>Fotografias</h3>
                      <p>{selectedProject.photos.length} carregada(s) · JPEG, PNG ou WebP · até 10 MB</p>
                    </div>
                  </div>

                  {selectedProject.photos.length > 0 && (
                    <div className="admin-photo-grid">
                      {selectedProject.photos.map((photo) => (
                        <figure key={photo.id}>
                          <div className="admin-photo-grid__image">
                            <Image src={photo.src} alt={photo.alt} fill unoptimized sizes="(max-width: 760px) 45vw, 180px" />
                          </div>
                          <figcaption>{photo.alt}</figcaption>
                          <button type="button" onClick={() => void removePhoto(photo)} aria-label={`Remover fotografia: ${photo.alt}`}>
                            <Trash2 aria-hidden="true" size={14} />
                          </button>
                        </figure>
                      ))}
                    </div>
                  )}

                  <form className="admin-form admin-form--photo" onSubmit={uploadPhoto}>
                    <div className="admin-form__grid">
                      <div className="admin-form__full">
                        <label htmlFor="project-photo-file">Adicionar fotografia</label>
                        <input
                          accept="image/jpeg,image/png,image/webp"
                          id="project-photo-file"
                          onChange={(event) => setPhotoFile(event.target.files?.[0] ?? null)}
                          required
                          type="file"
                        />
                      </div>
                      <div>
                        <label htmlFor="photo-alt">Texto alternativo</label>
                        <input id="photo-alt" value={photoAlt} onChange={(event) => setPhotoAlt(event.target.value)} required minLength={3} maxLength={160} />
                      </div>
                      <div>
                        <label htmlFor="photo-caption">Legenda (opcional)</label>
                        <input id="photo-caption" value={photoCaption} onChange={(event) => setPhotoCaption(event.target.value)} maxLength={160} />
                      </div>
                    </div>
                    <button className="button button--secondary" type="submit" disabled={isUploading || !photoFile}>
                      <Upload aria-hidden="true" size={16} /> {isUploading ? "A carregar..." : "Carregar fotografia"}
                    </button>
                  </form>
                </div>

                <div className="admin-publish-bar">
                  <p>
                    {selectedProject.status === "published"
                      ? "Este projeto está visível no site."
                      : selectedProject.photos.length === 0
                        ? "Carregue pelo menos uma fotografia para publicar."
                        : "Este projeto está guardado como rascunho."}
                  </p>
                  <button
                    className={`button ${selectedProject.status === "published" ? "button--secondary" : "button--primary"}`}
                    disabled={selectedProject.status === "draft" && selectedProject.photos.length === 0}
                    type="button"
                    onClick={() => void changePublicationStatus(selectedProject)}
                  >
                    <Check aria-hidden="true" size={16} />
                    {selectedProject.status === "published" ? "Despublicar" : "Publicar no site"}
                  </button>
                </div>
              </>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}