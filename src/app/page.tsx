import React from 'react';
import type { Metadata } from 'next';
import {
  getArticlesByCategory,
  getLatestArticles,
  getTodaysArticles,
  getTrendingArticles,
  getArticleCategories,
} from '@/lib/article-db';
import HomepageContent from './homepage/components/HomepageContent';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'DailyByteNews — Tech. Trends. Now.',
  description:
    'Breaking AI, technology, and business news for the modern Indian reader. Fast, trustworthy, ad-minimal.',
  alternates: { canonical: 'https://dailybytenews.in' },
  openGraph: {
    title: 'DailyByteNews — Tech. Trends. Now.',
    description: 'Breaking AI, technology, and business news for the modern Indian reader.',
    url: 'https://dailybytenews.in',
    type: 'website',
  },
};

export default async function RootPage() {
  // Fetch all active categories and today's articles in parallel
  const [todaysArticles, categories, trendingArticles] = await Promise.all([
    getTodaysArticles(),
    getArticleCategories(false),
    getTrendingArticles(4),
  ]);

  // Latest Stories = today's articles; fall back to recent articles if none published today
  const latestArticles = todaysArticles.length > 0 ? todaysArticles : await getLatestArticles(6);

  // Fetch articles for each category in parallel
  const categoryArticlesData = await Promise.all(
    categories.map(async (category) => ({
      ...category,
      articles: await getArticlesByCategory(category.slug, true), // excludeToday=true
    }))
  );

  return (
    <>
      <HomepageContent
        latestArticles={latestArticles}
        categories={categoryArticlesData}
        trendingArticles={trendingArticles}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'WebSite',
            name: 'DailyByteNews',
            url: 'https://dailybytenews.in',
            description: 'Tech, AI & Business trending news',
            potentialAction: {
              '@type': 'SearchAction',
              target: 'https://dailybytenews.in/?search={search_term_string}',
              'query-input': 'required name=search_term_string',
            },
          }),
        }}
      />
    </>
  );
}
