'use client';

import React, { useState } from 'react';
import ArticleCard from '@/components/ArticleCard';
import type { Article } from '@/lib/articles';

interface LatestGridProps {
  articles: Article[];
}

function todayLabel(): string {
  return new Date().toLocaleDateString('en-IN', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

export default function LatestGrid({ articles }: LatestGridProps) {
  const [visibleCount, setVisibleCount] = useState(6);

  return (
    <section className="mb-12">
      {/* Section Header */}
      <div className="flex items-center gap-3 mb-2">
        <div className="w-1 h-6 rounded-full bg-primary flex-shrink-0" />
        <h2 className="font-display text-xl font-bold text-foreground" style={{ letterSpacing: '-0.025em' }}>
          Latest Stories
        </h2>
        <div className="flex-1 h-px bg-border" />
      </div>

      {/* Today's date badge */}
      <p className="text-xs font-semibold text-muted uppercase tracking-widest mb-6 pl-4">
        {todayLabel()}
      </p>

      {/* Empty state — no articles today yet */}
      {articles.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border px-8 py-12 text-center">
          <p className="text-sm font-semibold text-foreground mb-1">No stories yet today</p>
          <p className="text-xs text-muted">Check back soon — fresh articles drop every morning.</p>
        </div>
      ) : (
        <>
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
        </>
      )}
    </section>
  );
}