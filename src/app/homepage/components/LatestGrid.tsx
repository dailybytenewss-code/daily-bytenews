'use client';

import React, { useState } from 'react';
import ArticleCard from '@/components/ArticleCard';
import type { Article } from '@/lib/articles';

interface LatestGridProps {
  articles: Article[];
}

export default function LatestGrid({ articles }: LatestGridProps) {
  const [visibleCount, setVisibleCount] = useState(6);

  return (
    <section className="mb-12">
      {/* Section Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-1 h-6 rounded-full bg-primary flex-shrink-0" />
        <h2 className="font-display text-xl font-bold text-foreground" style={{ letterSpacing: '-0.025em' }}>
          Latest Stories
        </h2>
        <div className="flex-1 h-px bg-border" />
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
        {articles.slice(0, visibleCount).map((article) => (
          <ArticleCard key={article.id} article={article} showExcerpt />
        ))}
      </div>

      {/* Load More */}
      {visibleCount < articles.length && (
        <div className="mt-8 text-center">
          <button
            onClick={() => setVisibleCount((c) => c + 3)}
            className="px-8 py-3 border-2 border-border rounded-lg text-sm font-semibold text-foreground hover:border-primary hover:text-primary transition-all"
          >
            Load More Stories
          </button>
        </div>
      )}
    </section>
  );
}