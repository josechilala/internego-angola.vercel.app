import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { AdminDashboard } from "@/components/admin/AdminDashboard";
import { getAdminProjects } from "@/lib/supabase/projects";
import { getProjectAdminContext } from "@/lib/supabase/admin";
import { hasSupabaseConfig } from "@/lib/supabase/env";

export const metadata: Metadata = {
  title: "Projetos e fotografias | INTERNEGO",
  robots: { index: false, follow: false },
};

export default async function AdminPage() {
  if (!hasSupabaseConfig) {
    return (
      <main className="studio-setup">
        <div>
          <p className="eyebrow">INTERNEGO | Gestão de conteúdo</p>
          <h1>O painel ainda não está configurado.</h1>
          <p>Configure o projeto Supabase e execute a migração para ativar projetos, login e armazenamento de fotografias.</p>
        </div>
      </main>
    );
  }

  const { user, isAdmin } = await getProjectAdminContext();
  if (!user) redirect("/admin/login");
  if (!isAdmin) redirect("/admin/login?error=acesso");

  const projects = await getAdminProjects();
  return <AdminDashboard initialProjects={projects} email={user.email ?? ""} />;
}