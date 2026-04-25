import React from 'react';
import Link from 'next/link';
import AppImage from '@/components/ui/AppImage';
import type { Article } from '@/lib/articles';

interface HeroSectionProps {
  article: Article;
}

export default function HeroSection({ article }: HeroSectionProps) {
  const href = `/article?slug=${article.slug}`;

  return (
    <section className="max-w-[1200px] mx-auto px-4 pt-8 pb-2">
      <Link href={href} className="group block">
        <div className="relative rounded-2xl overflow-hidden bg-dark-navy" style={{ minHeight: 420 }}>
          {/* Background Image */}
          <div className="absolute inset-0">
            <AppImage
              src={article.image}
              alt={article.imageAlt}
              fill
              priority
              className="object-cover transition-transform duration-700 group-hover:scale-[1.02]"
              sizes="(max-width: 768px) 100vw, 1200px"
            />
            {/* Scrim — dark gradient from bottom-left for white text legibility */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/10" />
            <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-transparent to-transparent" />
          </div>

          {/* Content */}
          <div className="relative z-10 flex flex-col justify-end h-full p-6 md:p-10" style={{ minHeight: 420 }}>
            {/* Featured Label */}
            <div className="flex items-center gap-2 mb-4">
              <span className="bg-primary text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded">
                Featured
              </span>
              <span className="category-badge bg-white/15 text-white border border-white/20">
                {article.category}
              </span>
            </div>

            {/* Headline */}
            <h1 className="font-display text-white font-bold leading-tight mb-3 text-balance" style={{
              fontSize: 'clamp(1.4rem, 3.5vw, 2.25rem)',
              letterSpacing: '-0.025em',
              maxWidth: '720px',
              textShadow: '0 2px 8px rgba(0,0,0,0.3)',
            }}>
              {article.title}
            </h1>

            {/* Excerpt */}
            <p className="text-white/80 text-base leading-relaxed mb-5 line-clamp-2" style={{ maxWidth: '600px' }}>
              {article.excerpt}
            </p>

            {/* Meta */}
            <div className="flex flex-wrap items-center gap-3 text-white/70 text-sm">
              <span className="font-semibold text-white">{article.author}</span>
              <span className="w-1 h-1 rounded-full bg-white/40" />
              <span>{article.date}</span>
              <span className="w-1 h-1 rounded-full bg-white/40" />
              <span>{article.readTime}</span>
              <span className="ml-auto flex items-center gap-1.5 text-white font-semibold text-sm group-hover:gap-2.5 transition-all">
                Read story
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </span>
            </div>
          </div>
        </div>
      </Link>
    </section>
  );
}