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
import type { AdminCategory } from '@/lib/admin-taxonomy';

interface CategoryWithArticles extends AdminCategory {
  articles: Article[];
}

interface HomepageContentProps {
  latestArticles: Article[];
  categories: CategoryWithArticles[];
  trendingArticles: Article[];
}

export default function HomepageContent({
  latestArticles,
  categories,
  trendingArticles,
}: HomepageContentProps) {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        {/* Hero Carousel */}
        {latestArticles.length > 0 && <HeroSection articles={latestArticles} />}

        {/* Main Content + Sidebar */}
        <div className="max-w-[1200px] mx-auto px-4 py-10">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Main Content */}
            <div className="flex-1 min-w-0">
              <LatestGrid articles={latestArticles} />
              {/* Dynamic Category Strips */}
              {categories.map((category) => (
                <CategoryStrip
                  key={category.slug}
                  title={category.name}
                  categorySlug={category.slug}
                  articles={category.articles}
                />
              ))}
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
