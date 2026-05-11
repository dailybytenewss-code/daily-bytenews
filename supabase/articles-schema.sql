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

-- Managed author profiles for article dropdowns
create table if not exists public.authors (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  bio text not null default '',
  avatar_url text not null default '/assets/images/app_logo.png',
  role text,
  email text,
  status text not null default 'active'
    check (status in ('active', 'inactive')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists authors_status_idx
  on public.authors (status);

drop trigger if exists set_authors_updated_at on public.authors;
create trigger set_authors_updated_at
before update on public.authors
for each row
execute function public.set_updated_at();

alter table public.authors enable row level security;

drop policy if exists "Public can read active authors" on public.authors;
create policy "Public can read active authors"
on public.authors
for select
to anon, authenticated
using (status = 'active');

drop policy if exists "Authenticated admins can manage authors" on public.authors;
create policy "Authenticated admins can manage authors"
on public.authors
for all
to authenticated
using (true)
with check (true);

insert into public.authors (name, slug, bio, avatar_url, role, status)
values (
  'DailyByteNews',
  'dailybytenews',
  'Covering the latest in AI, technology, and business - built for the modern Indian tech reader.',
  '/assets/images/app_logo.png',
  'Editorial Desk',
  'active'
) on conflict (slug) do nothing;

-- Managed categories for article dropdowns and category pages
create table if not exists public.article_categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  description text not null default '',
  color text not null default 'blue'
    check (color in ('blue', 'amber', 'red', 'green')),
  status text not null default 'active'
    check (status in ('active', 'inactive')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists article_categories_status_idx
  on public.article_categories (status);

drop trigger if exists set_article_categories_updated_at on public.article_categories;
create trigger set_article_categories_updated_at
before update on public.article_categories
for each row
execute function public.set_updated_at();

alter table public.article_categories enable row level security;

drop policy if exists "Public can read active categories" on public.article_categories;
create policy "Public can read active categories"
on public.article_categories
for select
to anon, authenticated
using (status = 'active');

drop policy if exists "Authenticated admins can manage categories" on public.article_categories;
create policy "Authenticated admins can manage categories"
on public.article_categories
for all
to authenticated
using (true)
with check (true);

insert into public.article_categories (name, slug, description, color, status) values
  (
    'AI & Tech',
    'ai-tech',
    'Artificial intelligence, machine learning, developer tools, and the technology shaping tomorrow.',
    'blue',
    'active'
  ),
  (
    'Business & Markets',
    'business',
    'Startup funding, IPOs, market moves, and the business side of the tech industry.',
    'green',
    'active'
  ),
  (
    'Trending',
    'trending',
    'The stories everyone is talking about - viral, impactful, and worth your attention.',
    'amber',
    'active'
  ),
  (
    'Explainers',
    'explainers',
    'Clear context, helpful breakdowns, and practical explainers for fast-moving stories.',
    'blue',
    'active'
  ),
  (
    'Opinion',
    'opinion',
    'Editorial analysis and informed viewpoints from the DailyByteNews team.',
    'amber',
    'active'
  )
on conflict (slug) do nothing;

-- Subscribers table for newsletter
create table if not exists public.subscribers (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  status text not null default 'active'
    check (status in ('active', 'unsubscribed', 'bounced')),
  subscribed_at timestamptz not null default now(),
  unsubscribed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists subscribers_email_idx
  on public.subscribers (email);

create index if not exists subscribers_status_idx
  on public.subscribers (status);

create or replace function public.set_subscribers_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_subscribers_updated_at on public.subscribers;
create trigger set_subscribers_updated_at
before update on public.subscribers
for each row
execute function public.set_subscribers_updated_at();

alter table public.subscribers enable row level security;

drop policy if exists "Public can subscribe" on public.subscribers;
create policy "Public can subscribe"
on public.subscribers
for insert
to anon, authenticated
with check (true);

drop policy if exists "Users can unsubscribe themselves" on public.subscribers;
create policy "Users can unsubscribe themselves"
on public.subscribers
for update
to anon, authenticated
using (true)
with check (true);

drop policy if exists "Authenticated admins can manage subscribers" on public.subscribers;
create policy "Authenticated admins can manage subscribers"
on public.subscribers
for all
to authenticated
using (true)
with check (true);

-- Newsletter campaign history
create table if not exists public.newsletter_campaigns (
  id uuid primary key default gen_random_uuid(),
  subject text not null,
  preview text,
  body text not null,
  status text not null default 'sent'
    check (status in ('sent', 'failed')),
  recipient_count integer not null default 0,
  failure_reason text,
  sent_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists newsletter_campaigns_created_at_idx
  on public.newsletter_campaigns (created_at desc);

drop trigger if exists set_newsletter_campaigns_updated_at on public.newsletter_campaigns;
create trigger set_newsletter_campaigns_updated_at
before update on public.newsletter_campaigns
for each row
execute function public.set_updated_at();

alter table public.newsletter_campaigns enable row level security;

drop policy if exists "Authenticated admins can manage campaigns" on public.newsletter_campaigns;
create policy "Authenticated admins can manage campaigns"
on public.newsletter_campaigns
for all
to authenticated
using (true)
with check (true);

-- ─────────────────────────────────────────────────────────────
-- site_settings table  (stores app-wide config, e.g. breaking news ticker)
-- ─────────────────────────────────────────────────────────────
create table if not exists public.site_settings (
  key         text primary key,
  value       jsonb not null default '[]'::jsonb,
  updated_at  timestamptz not null default now()
);

alter table public.site_settings enable row level security;

drop policy if exists "Public can read site settings" on public.site_settings;
create policy "Public can read site settings"
on public.site_settings
for select
to anon, authenticated
using (true);

drop policy if exists "Authenticated admins can manage site settings" on public.site_settings;
create policy "Authenticated admins can manage site settings"
on public.site_settings
for all
to authenticated
using (true)
with check (true);

-- Seed default breaking news ticker items
insert into public.site_settings (key, value) values (
  'breaking_news',
  '["OpenAI hits $25B annualized revenue, eyes 2027 IPO", "Anthropic''s MCP crosses 97 million developer installs", "TSMC posts record Q1 revenue on AI chip demand surge", "Atlassian cuts 1,600 jobs in AI-first restructuring", "India UPI hits 18 billion monthly transactions milestone"]'::jsonb
) on conflict (key) do nothing;
