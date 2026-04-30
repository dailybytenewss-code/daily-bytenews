import type { Article } from '@/lib/articles';

export type ArticleStatus = 'draft' | 'published' | 'scheduled';
export type ArticleCategoryColor = 'blue' | 'amber' | 'red' | 'green';

export interface ArticleRow {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  category_slug: string;
  category_color: ArticleCategoryColor;
  author: string;
  author_slug: string;
  author_avatar: string;
  author_bio: string;
  published_at: string;
  scheduled_at: string | null;
  read_time: string;
  image: string;
  image_alt: string;
  image_caption: string | null;
  tags: string[] | null;
  featured: boolean;
  trending: boolean;
  status: ArticleStatus;
  content: string;
  meta_title: string | null;
  meta_description: string | null;
  og_image: string | null;
  canonical: string | null;
  created_at?: string;
  updated_at?: string;
}

export type ArticleWrite = Omit<ArticleRow, 'id' | 'created_at' | 'updated_at'>;

export function slugify(str: string) {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

export function formatArticleDate(value?: string | null) {
  if (!value) return '';
  const parsed = new Date(`${value}T00:00:00`);
  if (Number.isNaN(parsed.getTime())) return value;

  return parsed.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
}

export function rowToArticle(row: ArticleRow): Article {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    excerpt: row.excerpt,
    category: row.category,
    categorySlug: row.category_slug,
    categoryColor: row.category_color,
    author: row.author,
    authorSlug: row.author_slug,
    authorAvatar: row.author_avatar,
    authorBio: row.author_bio,
    date: formatArticleDate(row.published_at),
    readTime: row.read_time,
    image: row.image,
    imageAlt: row.image_alt,
    imageCaption: row.image_caption ?? undefined,
    tags: row.tags ?? [],
    featured: row.featured,
    trending: row.trending,
    content: row.content,
  };
}
