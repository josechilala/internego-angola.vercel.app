import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProjectDetails } from "@/components/projects/ProjectDetails";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { getPublishedProjectBySlug, getPublishedProjects } from "@/lib/supabase/projects";

type ProjectPageProps = {
  params: Promise<{ slug: string }>;
};

export const revalidate = 60;

export async function generateStaticParams() {
  const publishedProjects = await getPublishedProjects();
  return publishedProjects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({ params }: ProjectPageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = await getPublishedProjectBySlug(slug);

  if (!project) return { title: "Projeto não encontrado | INTERNEGO" };

  return {
    title: `${project.title} | INTERNEGO`,
    description: project.description,
  };
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { slug } = await params;
  const project = await getPublishedProjectBySlug(slug);

  if (!project) notFound();

  return (
    <>
      <SiteHeader />
      <ProjectDetails project={project} />
      <SiteFooter />
    </>
  );
}