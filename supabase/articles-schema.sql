create extension if not exists pgcrypto;

create table if not exists public.articles (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  excerpt text not null,
  category text not null,
  category_slug text not null,
  category_color text not null default 'blue'
    check (category_color in ('blue', 'amber', 'red', 'green')),
  author text not null default 'DailyByteNews',
  author_slug text not null default 'dailybytenews',
  author_avatar text not null default '/assets/images/app_logo.png',
  author_bio text not null default 'Covering the latest in AI, technology, and business.',
  published_at date not null default current_date,
  scheduled_at timestamptz,
  read_time text not null default '5 min read',
  image text not null,
  image_alt text not null,
  image_caption text,
  tags text[] not null default '{}',
  featured boolean not null default false,
  trending boolean not null default false,
  status text not null default 'published'
    check (status in ('draft', 'published', 'scheduled')),
  content text not null,
  meta_title text,
  meta_description text,
  og_image text,
  canonical text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists articles_status_published_at_idx
  on public.articles (status, published_at desc);

create index if not exists articles_category_slug_idx
  on public.articles (category_slug);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_articles_updated_at on public.articles;
create trigger set_articles_updated_at
before update on public.articles
for each row
execute function public.set_updated_at();

alter table public.articles enable row level security;

drop policy if exists "Public can read published articles" on public.articles;
create policy "Public can read published articles"
on public.articles
for select
to anon, authenticated
using (
  status = 'published'
  or (
    status = 'scheduled'
    and scheduled_at is not null
    and scheduled_at <= now()
  )
);

drop policy if exists "Authenticated admins can manage articles" on public.articles;
create policy "Authenticated admins can manage articles"
on public.articles
for all
to authenticated
using (true)
with check (true);
