import React from 'react';
import type { Metadata } from 'next';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CategoryPageContent from './components/CategoryPageContent';
import { categories } from '@/lib/articles';
import { getArticles, getTrendingArticles } from '@/lib/article-db';

export const metadata: Metadata = {
  title: 'Category — DailyByteNews',
  description: 'Browse articles by category on DailyByteNews.',
  alternates: { canonical: 'https://dailybytenews.in/category' },
};

interface CategoryPageProps {
  searchParams: Promise<{ cat?: string }>;
}

export default async function CategoryPage({ searchParams }: CategoryPageProps) {
  const { cat } = await searchParams;
  const catSlug = cat || 'ai-tech';
  const category = categories.find((c) => c.slug === catSlug) || categories[0];
  const [articles, trendingArticles] = await Promise.all([
    getArticles(false),
    getTrendingArticles(),
  ]);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <CategoryPageContent
          articles={articles}
          categories={categories}
          category={category}
          trendingArticles={trendingArticles}
        />
      </main>
      <Footer />
    </div>
  );
}
