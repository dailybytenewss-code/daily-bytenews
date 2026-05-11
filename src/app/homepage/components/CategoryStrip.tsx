import React from 'react';
import Link from 'next/link';
import ArticleCard from '@/components/ArticleCard';
import type { Article } from '@/lib/articles';

interface CategoryStripProps {
  title: string;
  categorySlug: string;
  articles: Article[];
}

export default function CategoryStrip({ title, categorySlug, articles }: CategoryStripProps) {
  return (
    <section className="mb-12">
      {/* Section Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-1 h-6 rounded-full bg-primary flex-shrink-0" />
          <h2 className="font-display text-xl font-bold text-foreground" style={{ letterSpacing: '-0.025em' }}>
            {title}
          </h2>
        </div>
        <Link
          href={`/category?cat=${categorySlug}`}
          className="text-sm font-semibold text-primary hover:opacity-80 transition-opacity flex items-center gap-1"
        >
          View All
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </Link>
      </div>

      {/* Grid */}
      {articles.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
          {articles.slice(0, 3).map((article) => (
            <ArticleCard key={article.id} article={article} showExcerpt />
          ))}
        </div>
      ) : (
        <div className="py-12 text-center text-gray-400 dark:text-gray-500">
          <p>No articles yet in this category</p>
        </div>
      )}
    </section>
  );
}