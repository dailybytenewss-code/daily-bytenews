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

// Categories are static and managed here
export const categories = [
  {
    name: 'AI & Tech',
    slug: 'ai-tech',
    description:
      'Artificial intelligence, machine learning, developer tools, and the technology shaping tomorrow.',
    color: 'blue' as const,
  },
  {
    name: 'Business & Markets',
    slug: 'business',
    description:
      'Startup funding, IPOs, market moves, and the business side of the tech industry.',
    color: 'green' as const,
  },
  {
    name: 'Trending',
    slug: 'trending',
    description: 'The stories everyone is talking about — viral, impactful, and worth your attention.',
    color: 'amber' as const,
  },
];

// Get fallback trending articles for client-side sidebar
export function getTrendingArticles(): Article[] {
  return [];
}
