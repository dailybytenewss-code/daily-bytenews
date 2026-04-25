import React from 'react';
import Link from 'next/link';
import AppImage from '@/components/ui/AppImage';
import type { Article } from '@/lib/articles';

interface ArticleHeroProps {
  article: Article;
}

const categoryColorMap: Record<string, string> = {
  blue: 'category-badge-blue',
  amber: 'category-badge-amber',
  red: 'category-badge-red',
  green: 'category-badge-green',
};

export default function ArticleHero({ article }: ArticleHeroProps) {
  const badgeClass = categoryColorMap[article.categoryColor] || 'category-badge-blue';

  return (
    <header className="mb-8">
      {/* Category */}
      <Link href={`/category?cat=${article.categorySlug}`}>
        <span className={`category-badge ${badgeClass} mb-4 cursor-pointer hover:opacity-80 transition-opacity`}>
          {article.category}
        </span>
      </Link>

      {/* Headline */}
      <h1
        className="font-display font-bold text-foreground leading-tight mt-3 mb-4 text-balance"
        style={{
          fontSize: 'clamp(1.6rem, 4vw, 2.25rem)',
          letterSpacing: '-0.025em',
          lineHeight: 1.2,
        }}
      >
        {article.title}
      </h1>

      {/* Excerpt */}
      <p className="text-muted text-lg leading-relaxed mb-6 border-l-4 border-primary pl-4">
        {article.excerpt}
      </p>

      {/* Meta Row */}
      <div className="flex flex-wrap items-center gap-4 pb-6 border-b border-border">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-full overflow-hidden border-2 border-border flex-shrink-0">
            <AppImage
              src={article.authorAvatar}
              alt={`${article.author} profile photo`}
              width={36}
              height={36}
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <p className="text-sm font-semibold text-foreground leading-none">{article.author}</p>
            <p className="text-xs text-muted mt-0.5">Staff Writer</p>
          </div>
        </div>
        <div className="flex items-center gap-3 text-sm text-muted ml-auto flex-wrap">
          <span>{article.date}</span>
          <span className="w-1 h-1 rounded-full bg-muted" />
          <span>{article.readTime}</span>
        </div>
      </div>

      {/* Featured Image */}
      <div className="mt-6 rounded-xl overflow-hidden">
        <div className="aspect-video relative">
          <AppImage
            src={article.image}
            alt={article.imageAlt}
            fill
            priority
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 720px"
          />
        </div>
        {article.imageCaption && (
          <p className="text-xs text-muted mt-2 leading-relaxed italic px-1">
            {article.imageCaption}
          </p>
        )}
      </div>
    </header>
  );
}