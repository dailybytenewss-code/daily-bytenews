import React from 'react';
import Link from 'next/link';
import AppImage from '@/components/ui/AppImage';
import type { Article } from '@/lib/articles';

interface ArticleCardProps {
  article: Article;
  variant?: 'default' | 'compact' | 'horizontal';
  showExcerpt?: boolean;
}

const categoryColorMap: Record<string, string> = {
  blue: 'category-badge-blue',
  amber: 'category-badge-amber',
  red: 'category-badge-red',
  green: 'category-badge-green',
};

export default function ArticleCard({ article, variant = 'default', showExcerpt = true }: ArticleCardProps) {
  const badgeClass = categoryColorMap[article.categoryColor] || 'category-badge-blue';
  const articleHref = `/article?slug=${article.slug}`;

  if (variant === 'compact') {
    return (
      <Link href={articleHref} className="flex gap-3 group py-3 border-b border-border last:border-0">
        <div className="flex-1 min-w-0">
          <span className={`category-badge ${badgeClass} mb-1.5`}>{article.category}</span>
          <h4 className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-2 leading-snug" style={{ letterSpacing: '-0.01em' }}>
            {article.title}
          </h4>
          <p className="text-xs text-muted mt-1">{article.date}</p>
        </div>
        <div className="flex-shrink-0 w-16 h-12 card-image rounded-md overflow-hidden">
          <AppImage
            src={article.image}
            alt={article.imageAlt}
            width={64}
            height={48}
            className="w-full h-full object-cover"
          />
        </div>
      </Link>
    );
  }

  if (variant === 'horizontal') {
    return (
      <Link href={articleHref} className="article-card flex gap-4 group bg-card rounded-xl border border-border p-3">
        <div className="flex-shrink-0 w-24 h-16 sm:w-32 sm:h-20 card-image rounded-lg overflow-hidden">
          <AppImage
            src={article.image}
            alt={article.imageAlt}
            width={128}
            height={80}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="flex-1 min-w-0">
          <span className={`category-badge ${badgeClass} mb-1.5`}>{article.category}</span>
          <h4 className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-2 leading-snug card-headline">
            {article.title}
          </h4>
          <p className="text-xs text-muted mt-1">{article.date} · {article.readTime}</p>
        </div>
      </Link>
    );
  }

  return (
    <Link href={articleHref} className="article-card flex flex-col bg-card rounded-xl border border-border overflow-hidden group">
      <div className="card-image aspect-video overflow-hidden">
        <AppImage
          src={article.image}
          alt={article.imageAlt}
          width={600}
          height={338}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="p-4 flex flex-col flex-1">
        <span className={`category-badge ${badgeClass} mb-2 self-start`}>{article.category}</span>
        <h3 className="font-display text-base font-700 text-foreground card-headline group-hover:text-primary transition-colors line-clamp-2 leading-snug mb-2" style={{ letterSpacing: '-0.02em', fontWeight: 700 }}>
          {article.title}
        </h3>
        {showExcerpt && (
          <p className="text-sm text-muted line-clamp-2 leading-relaxed mb-3 flex-1">
            {article.excerpt}
          </p>
        )}
        <div className="flex items-center gap-2 text-xs text-muted mt-auto">
          <span className="font-medium">{article.author}</span>
          <span>·</span>
          <span>{article.date}</span>
          <span>·</span>
          <span>{article.readTime}</span>
        </div>
      </div>
    </Link>
  );
}