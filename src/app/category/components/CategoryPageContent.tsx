'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import ArticleCard from '@/components/ArticleCard';
import Sidebar from '@/components/Sidebar';
import { getArticlesByCategory, getLatestArticles, categories } from '@/lib/articles';

interface Category {
  name: string;
  slug: string;
  description: string;
  color: 'blue' | 'amber' | 'red' | 'green';
}

interface CategoryPageContentProps {
  category: Category;
}

const colorMap: Record<string, string> = {
  blue: '#1A6DD2',
  amber: '#F59E0B',
  red: '#EF4444',
  green: '#10B981',
};

export default function CategoryPageContent({ category }: CategoryPageContentProps) {
  const [sortBy, setSortBy] = useState<'latest' | 'popular'>('latest');
  const [visibleCount, setVisibleCount] = useState(6);

  const categoryArticles = getArticlesByCategory(category.slug);
  const allArticles = categoryArticles.length > 0 ? categoryArticles : getLatestArticles(6);

  const sorted = [...allArticles].sort((a, b) => {
    if (sortBy === 'popular') {
      return (b.trending ? 1 : 0) - (a.trending ? 1 : 0);
    }
    return b.id.localeCompare(a.id);
  });

  const accentColor = colorMap[category.color] || '#1A6DD2';

  return (
    <div>
      {/* Category Header */}
      <div className="bg-card border-b border-border">
        <div className="max-w-[1200px] mx-auto px-4 py-10">
          <div className="flex items-start gap-4">
            <div className="w-1.5 h-12 rounded-full flex-shrink-0 mt-1" style={{ backgroundColor: accentColor }} />
            <div>
              <h1
                className="font-display font-bold text-foreground leading-tight mb-2"
                style={{ fontSize: 'clamp(1.75rem, 4vw, 2.5rem)', letterSpacing: '-0.025em' }}
              >
                {category.name}
              </h1>
              <p className="text-muted text-base leading-relaxed max-w-xl">
                {category.description}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Category Nav Tabs */}
      <div className="bg-card border-b border-border sticky top-[calc(3.5rem+3px)] z-30">
        <div className="max-w-[1200px] mx-auto px-4">
          <div className="flex items-center gap-0 overflow-x-auto scrollbar-hide">
            {categories.map((cat) => (
              <Link
                key={cat.slug}
                href={`/category?cat=${cat.slug}`}
                className={`flex-shrink-0 px-4 py-3.5 text-sm font-semibold border-b-2 transition-colors ${
                  cat.slug === category.slug
                    ? 'border-primary text-primary' :'border-transparent text-muted hover:text-foreground'
                }`}
              >
                {cat.name}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-[1200px] mx-auto px-4 py-10">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Articles */}
          <div className="flex-1 min-w-0">
            {/* Sort Controls */}
            <div className="flex items-center justify-between mb-6">
              <p className="text-sm text-muted">
                <span className="font-semibold text-foreground">{sorted.length}</span> articles in {category.name}
              </p>
              <div className="flex items-center gap-1 bg-background border border-border rounded-lg p-1">
                {(['latest', 'popular'] as const).map((option) => (
                  <button
                    key={option}
                    onClick={() => setSortBy(option)}
                    className={`px-3 py-1.5 text-xs font-semibold rounded-md capitalize transition-all min-h-[32px] ${
                      sortBy === option
                        ? 'bg-primary text-white' :'text-muted hover:text-foreground'
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>

            {/* Article Grid */}
            {sorted.length > 0 ? (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                  {sorted.slice(0, visibleCount).map((article) => (
                    <ArticleCard key={article.id} article={article} showExcerpt />
                  ))}
                </div>

                {/* Pagination / Load More */}
                {visibleCount < sorted.length ? (
                  <div className="mt-8 text-center">
                    <button
                      onClick={() => setVisibleCount((c) => c + 6)}
                      className="px-8 py-3 border-2 border-border rounded-lg text-sm font-semibold text-foreground hover:border-primary hover:text-primary transition-all"
                    >
                      Load More
                    </button>
                  </div>
                ) : (
                  <div className="mt-8 text-center py-6 border-t border-border">
                    <p className="text-sm text-muted">You've reached the end of {category.name} articles.</p>
                    <Link href="/" className="text-sm font-semibold text-primary mt-2 inline-block hover:opacity-80">
                      ← Back to Homepage
                    </Link>
                  </div>
                )}
              </>
            ) : (
              /* Empty State */
              <div className="text-center py-20">
                <div className="w-16 h-16 rounded-2xl bg-background border border-border flex items-center justify-center mx-auto mb-4">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-muted">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                  </svg>
                </div>
                <h3 className="font-display text-lg font-bold text-foreground mb-2">No articles yet</h3>
                <p className="text-sm text-muted mb-6">We're working on stories in this category. Check back soon.</p>
                <Link href="/" className="px-6 py-2.5 rounded-lg text-sm font-bold text-white" style={{ backgroundColor: '#1A6DD2' }}>
                  Browse All Stories
                </Link>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:w-80 flex-shrink-0">
            <div className="sticky-sidebar">
              <Sidebar />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}