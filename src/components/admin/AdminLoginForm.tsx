"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, LockKeyhole } from "lucide-react";
import { hasSupabaseConfig } from "@/lib/supabase/env";
import { getBrowserSupabaseClient } from "@/lib/supabase/browser";

export function AdminLoginForm({ initialError }: { initialError?: string }) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(initialError ?? "");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    const supabase = getBrowserSupabaseClient();
    if (!supabase) {
      setError("O acesso ainda não está configurado. Contacte o administrador do site.");
      return;
    }

    setIsSubmitting(true);
    const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });

    if (signInError) {
      setError("Não foi possível iniciar sessão. Confirme as credenciais e tente novamente.");
      setIsSubmitting(false);
      return;
    }

    const requestedPath = new URLSearchParams(window.location.search).get("next");
    const nextPath = requestedPath?.startsWith("/") && !requestedPath.startsWith("//")
      ? requestedPath
      : "/admin";
    router.replace(nextPath);
    router.refresh();
  }

  return (
    <main className="admin-login">
      <section className="admin-login__panel" aria-labelledby="admin-login-title">
        <Link className="admin-login__brand" href="/" aria-label="INTERNEGO, voltar ao site">INTERNEGO</Link>
        <p className="eyebrow"><span className="eyebrow__line" /> Gestão de conteúdo</p>
        <h1 id="admin-login-title">Acesso do proprietário</h1>
        <p className="admin-login__intro">Entre para gerir projetos e fotografias da INTERNEGO.</p>

        {!hasSupabaseConfig ? (
          <p className="admin-feedback" role="status">O painel ainda não está ligado a um projeto Supabase.</p>
        ) : (
          <form className="admin-form" onSubmit={handleSubmit}>
            <label htmlFor="admin-email">E-mail</label>
            <input
              autoComplete="username"
              id="admin-email"
              name="email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
            <label htmlFor="admin-password">Palavra-passe</label>
            <input
              autoComplete="current-password"
              id="admin-password"
              name="password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
            />
            {error && <p className="admin-feedback" role="alert">{error}</p>}
            <button className="button button--primary" type="submit" disabled={isSubmitting}>
              <LockKeyhole aria-hidden="true" size={16} />
              {isSubmitting ? "A autenticar..." : "Iniciar sessão"}
              {!isSubmitting && <ArrowRight aria-hidden="true" size={16} />}
            </button>
          </form>
        )}
        <Link className="admin-login__back" href="/">Voltar ao site</Link>
      </section>
    </main>
  );
}