import React from 'react';
import ArticleCard from '@/components/ArticleCard';
import type { Article } from '@/lib/articles';

interface RelatedArticlesProps {
  articles: Article[];
}

export default function RelatedArticles({ articles }: RelatedArticlesProps) {
  if (!articles.length) return null;

  return (
    <section className="mt-12 pb-20 md:pb-0">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-1 h-6 rounded-full bg-primary flex-shrink-0" />
        <h2 className="font-display text-xl font-bold text-foreground" style={{ letterSpacing: '-0.025em' }}>
          Related Stories
        </h2>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {articles.slice(0, 3).map((article) => (
          <ArticleCard key={article.id} article={article} showExcerpt={false} />
        ))}
      </div>
    </section>
  );
}