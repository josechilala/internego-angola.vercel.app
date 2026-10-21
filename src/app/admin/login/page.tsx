import type { Metadata } from "next";
import { AdminLoginForm } from "@/components/admin/AdminLoginForm";

export const metadata: Metadata = {
  title: "Acesso de gestão | INTERNEGO",
  robots: { index: false, follow: false },
};

type AdminLoginPageProps = {
  searchParams: Promise<{ error?: string }>;
};

export default async function AdminLoginPage({ searchParams }: AdminLoginPageProps) {
  const { error } = await searchParams;
  return <AdminLoginForm initialError={error === "acesso" ? "Esta conta não tem acesso de gestão." : undefined} />;
}