'use client';

import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import HeroSection from './HeroSection';
import LatestGrid from './LatestGrid';
import CategoryStrip from './CategoryStrip';
import NewsletterBanner from './NewsletterBanner';
import Sidebar from '@/components/Sidebar';
import type { Article } from '@/lib/articles';

interface HomepageContentProps {
  featured: Article | null;
  latest: Article[];
  aiArticles: Article[];
  businessArticles: Article[];
  trendingArticles: Article[];
}

export default function HomepageContent({
  featured,
  latest,
  aiArticles,
  businessArticles,
  trendingArticles,
}: HomepageContentProps) {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        {/* Hero */}
        {featured && <HeroSection article={featured} />}

        {/* Main Content + Sidebar */}
        <div className="max-w-[1200px] mx-auto px-4 py-10">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Main Content */}
            <div className="flex-1 min-w-0">
              <LatestGrid articles={latest} />
              <CategoryStrip title="AI & Tech" categorySlug="ai-tech" articles={aiArticles} />
              <CategoryStrip
                title="Business & Markets"
                categorySlug="business"
                articles={businessArticles}
              />
              <CategoryStrip
                title="Trending Stories"
                categorySlug="trending"
                articles={trendingArticles}
              />
            </div>

            {/* Sidebar */}
            <div className="lg:w-80 xl:w-88 flex-shrink-0">
              <div className="sticky-sidebar">
                <Sidebar trendingArticles={trendingArticles} />
              </div>
            </div>
          </div>
        </div>

        {/* Newsletter Banner */}
        <NewsletterBanner />
      </main>
      <Footer />
    </div>
  );
}
