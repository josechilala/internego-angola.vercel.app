create extension if not exists pgcrypto with schema extensions;

create table if not exists public.project_admins (
  user_id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

alter table public.project_admins enable row level security;
revoke all on public.project_admins from anon, authenticated;

create or replace function public.is_project_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.project_admins as admins
    where admins.user_id = (select auth.uid())
  );
$$;

revoke all on function public.is_project_admin() from public, anon;
grant execute on function public.is_project_admin() to authenticated;

create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique check (char_length(slug) between 2 and 80),
  title text not null check (char_length(title) between 2 and 100),
  description text not null check (char_length(description) between 20 and 1200),
  category text not null check (category in ('seguranca-privada', 'gestao-residuos')),
  location text check (location is null or char_length(location) <= 100),
  project_date date,
  status text not null default 'draft' check (status in ('draft', 'published')),
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create or replace function public.set_project_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = pg_catalog.now();
  return new;
end;
$$;

drop trigger if exists projects_set_updated_at on public.projects;
create trigger projects_set_updated_at
  before update on public.projects
  for each row execute function public.set_project_updated_at();

create table if not exists public.project_photos (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  storage_path text not null unique,
  alt text not null check (char_length(alt) between 3 and 160),
  caption text check (caption is null or char_length(caption) <= 160),
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create index if not exists projects_status_date_idx on public.projects(status, project_date desc);
create index if not exists project_photos_project_order_idx on public.project_photos(project_id, sort_order);

alter table public.projects enable row level security;
alter table public.project_photos enable row level security;

grant select on public.projects, public.project_photos to anon, authenticated;
grant insert, update, delete on public.projects, public.project_photos to authenticated;

drop policy if exists "Published projects are readable" on public.projects;
create policy "Published projects are readable"
  on public.projects for select to anon, authenticated
  using (status = 'published');

drop policy if exists "Project admins manage projects" on public.projects;
create policy "Project admins manage projects"
  on public.projects for all to authenticated
  using (public.is_project_admin())
  with check (public.is_project_admin());

drop policy if exists "Published project photos are readable" on public.project_photos;
create policy "Published project photos are readable"
  on public.project_photos for select to anon, authenticated
  using (exists (
    select 1 from public.projects as projects
    where projects.id = project_photos.project_id and projects.status = 'published'
  ));

drop policy if exists "Project admins manage project photos" on public.project_photos;
create policy "Project admins manage project photos"
  on public.project_photos for all to authenticated
  using (public.is_project_admin())
  with check (public.is_project_admin());

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'project-images',
  'project-images',
  false,
  10485760,
  array['image/jpeg', 'image/png', 'image/webp']
)
on conflict (id) do update set
  public = false,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "Published project images are readable" on storage.objects;
create policy "Published project images are readable"
  on storage.objects for select to anon, authenticated
  using (
    bucket_id = 'project-images'
    and exists (
      select 1
      from public.project_photos as photos
      join public.projects as projects on projects.id = photos.project_id
      where photos.storage_path = storage.objects.name
        and projects.status = 'published'
    )
  );

drop policy if exists "Project admins read all images" on storage.objects;
create policy "Project admins read all images"
  on storage.objects for select to authenticated
  using (bucket_id = 'project-images' and public.is_project_admin());

drop policy if exists "Project admins upload images" on storage.objects;
create policy "Project admins upload images"
  on storage.objects for insert to authenticated
  with check (bucket_id = 'project-images' and public.is_project_admin());

drop policy if exists "Project admins update images" on storage.objects;
create policy "Project admins update images"
  on storage.objects for update to authenticated
  using (bucket_id = 'project-images' and public.is_project_admin())
  with check (bucket_id = 'project-images' and public.is_project_admin());

drop policy if exists "Project admins delete images" on storage.objects;
create policy "Project admins delete images"
  on storage.objects for delete to authenticated
  using (bucket_id = 'project-images' and public.is_project_admin());