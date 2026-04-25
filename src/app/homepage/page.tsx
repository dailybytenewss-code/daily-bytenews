import React from 'react';
import type { Metadata } from 'next';
import { articles, getFeaturedArticle, getLatestArticles, getArticlesByCategory } from '@/lib/articles';
import HomepageContent from './components/HomepageContent';

export const metadata: Metadata = {
  title: 'DailyByteNews — Tech. Trends. Now.',
  description: 'Breaking AI, technology, and business news for the modern Indian reader. Fast, trustworthy, ad-minimal.',
  alternates: { canonical: 'https://dailybytenews.in/homepage' },
  openGraph: {
    title: 'DailyByteNews — Tech. Trends. Now.',
    description: 'Breaking AI, technology, and business news for the modern Indian reader.',
    url: 'https://dailybytenews.in/homepage',
    type: 'website',
  },
};

export default function Homepage() {
  const featured = getFeaturedArticle();
  const latest = getLatestArticles(6);
  const aiArticles = getArticlesByCategory('ai-tech');
  const businessArticles = getArticlesByCategory('business');
  const trendingArticles = articles.filter((a) => a.trending).slice(0, 4);

  return (
    <>
      <HomepageContent
        featured={featured}
        latest={latest}
        aiArticles={aiArticles}
        businessArticles={businessArticles}
        trendingArticles={trendingArticles}
      />
      {/* JSON-LD */}
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
              target: 'https://dailybytenews.in/homepage?search={search_term_string}',
              'query-input': 'required name=search_term_string',
            },
          }),
        }}
      />
    </>
  );
}