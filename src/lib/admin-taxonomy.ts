import { slugify } from '@/lib/article-shared';

export type AdminCategoryColor = 'blue' | 'amber' | 'red' | 'green';

export interface AuthorProfile {
  id: string;
  name: string;
  slug: string;
  bio: string;
  avatar_url: string;
  role: string | null;
  email: string | null;
  status: 'active' | 'inactive';
  created_at?: string;
  updated_at?: string;
}

export interface AdminCategory {
  id: string;
  name: string;
  slug: string;
  description: string;
  color: AdminCategoryColor;
  status: 'active' | 'inactive';
  created_at?: string;
  updated_at?: string;
}

export const DEFAULT_AUTHOR: AuthorProfile = {
  id: 'default-dailybytenews',
  name: 'DailyByteNews',
  slug: 'dailybytenews',
  bio: 'Covering the latest in AI, technology, and business - built for the modern Indian tech reader.',
  avatar_url: '/assets/images/app_logo.png',
  role: 'Editorial Desk',
  email: null,
  status: 'active',
};

export const DEFAULT_CATEGORIES: AdminCategory[] = [
  {
    id: 'default-ai-tech',
    name: 'AI & Tech',
    slug: 'ai-tech',
    description:
      'Artificial intelligence, machine learning, developer tools, and the technology shaping tomorrow.',
    color: 'blue',
    status: 'active',
  },
  {
    id: 'default-business',
    name: 'Business & Markets',
    slug: 'business',
    description: 'Startup funding, IPOs, market moves, and the business side of the tech industry.',
    color: 'green',
    status: 'active',
  },
  {
    id: 'default-trending',
    name: 'Trending',
    slug: 'trending',
    description:
      'The stories everyone is talking about - viral, impactful, and worth your attention.',
    color: 'amber',
    status: 'active',
  },
  {
    id: 'default-explainers',
    name: 'Explainers',
    slug: 'explainers',
    description:
      'Clear context, helpful breakdowns, and practical explainers for fast-moving stories.',
    color: 'blue',
    status: 'active',
  },
  {
    id: 'default-opinion',
    name: 'Opinion',
    slug: 'opinion',
    description: 'Editorial analysis and informed viewpoints from the DailyByteNews team.',
    color: 'amber',
    status: 'active',
  },
];

export const categoryColorStyles: Record<
  AdminCategoryColor,
  { badge: string; dot: string; bar: string }
> = {
  blue: {
    badge:
      'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 border border-blue-200 dark:border-blue-800',
    dot: 'bg-blue-500',
    bar: 'bg-blue-500',
  },
  green: {
    badge:
      'bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400 border border-green-200 dark:border-green-800',
    dot: 'bg-green-500',
    bar: 'bg-green-500',
  },
  amber: {
    badge:
      'bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 border border-amber-200 dark:border-amber-800',
    dot: 'bg-amber-500',
    bar: 'bg-amber-500',
  },
  red: {
    badge:
      'bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-400 border border-red-200 dark:border-red-800',
    dot: 'bg-red-500',
    bar: 'bg-red-500',
  },
};

export function normalizeAuthor(profile: Partial<AuthorProfile>): AuthorProfile {
  const name = profile.name?.trim() || DEFAULT_AUTHOR.name;

  return {
    ...DEFAULT_AUTHOR,
    ...profile,
    name,
    slug: profile.slug?.trim() || slugify(name),
    bio: profile.bio?.trim() || '',
    avatar_url: profile.avatar_url?.trim() || '/assets/images/app_logo.png',
    role: profile.role?.trim() || null,
    email: profile.email?.trim() || null,
    status: profile.status || 'active',
  };
}

export function normalizeCategory(category: Partial<AdminCategory>): AdminCategory {
  const name = category.name?.trim() || 'Untitled Category';

  return {
    id: category.id || `category-${slugify(name)}`,
    name,
    slug: category.slug?.trim() || slugify(name),
    description: category.description?.trim() || '',
    color: category.color || 'blue',
    status: category.status || 'active',
  };
}
