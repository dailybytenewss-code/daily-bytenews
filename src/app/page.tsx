import React from 'react';
import type { Metadata } from 'next';
import {
  getArticlesByCategory,
  getFeaturedArticle,
  getLatestArticles,
  getTrendingArticles,
} from '@/lib/article-db';
import HomepageContent from './homepage/components/HomepageContent';

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
  const [featured, latest, aiArticles, businessArticles, trendingArticles] = await Promise.all([
    getFeaturedArticle(),
    getLatestArticles(6),
    getArticlesByCategory('ai-tech'),
    getArticlesByCategory('business'),
    getTrendingArticles(4),
  ]);

  return (
    <>
      <HomepageContent
        featured={featured}
        latest={latest}
        aiArticles={aiArticles}
        businessArticles={businessArticles}
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
