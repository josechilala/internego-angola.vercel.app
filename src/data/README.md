# Gestão de Projetos

O painel fica em `/admin`. O proprietário entra com o seu utilizador Supabase, cria projetos, carrega fotografias e publica sem editar código nem fazer commits.

## Configuração inicial

1. Crie um projeto Supabase para a INTERNEGO.
2. Em **Authentication > Settings**, desative o registo público de novos utilizadores.
3. No SQL Editor, execute a migração `supabase/migrations/20261020000000_project_management.sql`.
4. Copie `.env.example` para `.env.local` e preencha `NEXT_PUBLIC_SUPABASE_URL` e `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`.
5. Crie/convide o utilizador do proprietário em **Authentication > Users**.
6. No SQL Editor, registe o UUID desse utilizador na tabela administrativa:

```sql
insert into public.project_admins (user_id)
select id from auth.users where email = 'proprietario@internego.ao';
```

7. Reinicie o site e abra `/admin` para entrar e gerir projetos.

## Publicar na Vercel

Importe o repositório como projeto Next.js na Vercel; não use GitHub Pages. Defina `NEXT_PUBLIC_SUPABASE_URL` e `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` em **Project Settings > Environment Variables** para Production, Preview e Development, conforme necessário. Aplique primeiro a migração SQL no projeto Supabase. Não configure uma chave `service_role`: o site usa a chave publishable com RLS.

As políticas RLS protegem projetos, fotografias e o bucket privado. Não existe chave `service_role` no projeto; uploads são autorizados pela sessão e pelo papel administrativo do utilizador. A chave publishable é pública por definição e só pode executar ações permitidas pelas políticas RLS.

## Publicar um projeto

No painel, preencha título, slug, categoria, descrição e, opcionalmente, localização/data. Carregue uma ou mais imagens e escreva o texto alternativo de cada uma. Projetos começam em rascunho; use **Publicar** para os tornar visíveis. A opção **Despublicar** volta a ocultá-los.