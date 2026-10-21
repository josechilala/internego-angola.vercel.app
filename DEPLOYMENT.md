# Publicação INTERNEGO

## Vercel

Este é um projeto Next.js com middleware e rotas server-side; publique-o como aplicação Next.js na Vercel. Não use GitHub Pages, que não executa estas funções de servidor.

1. Crie um repositório GitHub privado na organização/conta autorizada e envie o código.
2. Importe esse repositório na Vercel com o preset **Next.js** e a raiz do projeto.
3. Configure em **Project Settings > Environment Variables**, para Production, Preview e Development conforme necessário:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
4. Aplique `supabase/migrations/20261020000000_project_management.sql` ao projeto Supabase antes do primeiro deploy.
5. Configure o domínio no Supabase Auth (`Site URL` e `Redirect URLs`) para o domínio Vercel e o domínio final.
6. Faça deploy e teste `/admin/login`, criação de rascunho, upload, publicação e visualização pública.

Não configure `SUPABASE_SERVICE_ROLE_KEY`: a aplicação não precisa dela. As operações usam a chave publishable com sessão e RLS. `.env.local` está coberto por `.gitignore`; apenas `.env.example`, sem segredos, deve ser versionado.

Vercel deteta Next.js automaticamente; não é necessário gerar saída estática nem configurar GitHub Pages.
## Contactos e valida??o

O WhatsApp oficial ? https://wa.me/244942036369; +244 942 036 864 ? apenas telefone. O pedido de or?amento abre uma mensagem pr?-preenchida no WhatsApp. A alternativa por e-mail abre o cliente de correio. Em ambos os casos, o utilizador confirma o envio; n?o h? envio autom?tico.

Antes de publicar, execute `npm run lint`, `npm run typecheck`, `npm run build` e `npm audit --omit=dev`. O build precisa de acesso ao Google Fonts e ao Supabase para preparar as p?ginas de projetos.
