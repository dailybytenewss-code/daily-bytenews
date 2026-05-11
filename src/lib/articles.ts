import { DEFAULT_CATEGORIES } from '@/lib/admin-taxonomy';

export interface Article {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  categorySlug: string;
  categoryColor: 'blue' | 'amber' | 'red' | 'green';
  author: string;
  authorSlug: string;
  authorAvatar: string;
  authorBio: string;
  date: string;
  readTime: string;
  image: string;
  imageAlt: string;
  imageCaption?: string;
  tags: string[];
  featured?: boolean;
  trending?: boolean;
  content: string;
}

export const categories = DEFAULT_CATEGORIES.map(({ name, slug, description, color }) => ({
  name,
  slug,
  description,
  color,
}));

// Get fallback trending articles for client-side sidebar
export function getTrendingArticles(): Article[] {
  return [];
}
