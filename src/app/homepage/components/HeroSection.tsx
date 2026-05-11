'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import AppImage from '@/components/ui/AppImage';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import type { Article } from '@/lib/articles';

interface HeroSectionProps {
  articles: Article[];
}

export default function HeroSection({ articles }: HeroSectionProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Auto-slide every 4 seconds
  useEffect(() => {
    if (articles.length === 0) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % articles.length);
    }, 4000);

    return () => clearInterval(timer);
  }, [articles.length]);

  const goToPrevious = useCallback(() => {
    if (articles.length === 0) return;
    setCurrentIndex((prev) => (prev - 1 + articles.length) % articles.length);
  }, [articles.length]);

  const goToNext = useCallback(() => {
    if (articles.length === 0) return;
    setCurrentIndex((prev) => (prev + 1) % articles.length);
  }, [articles.length]);

  const goToSlide = useCallback((index: number) => {
    setCurrentIndex(index);
  }, []);

  if (articles.length === 0) return null;

  const article = articles[currentIndex];
  const href = `/article?slug=${article.slug}`;

  return (
    <section className="max-w-[1200px] mx-auto px-4 pt-8 pb-2">
      <div className="relative group">
        <Link href={href} className="block">
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

        {/* Navigation Buttons — Only show if multiple articles */}
        {articles.length > 1 && (
          <>
            {/* Previous Button */}
            <button
              onClick={goToPrevious}
              className="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors"
              aria-label="Previous article"
            >
              <ChevronLeftIcon className="w-5 h-5" />
            </button>

            {/* Next Button */}
            <button
              onClick={goToNext}
              className="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors"
              aria-label="Next article"
            >
              <ChevronRightIcon className="w-5 h-5" />
            </button>
          </>
        )}
      </div>

      {/* Slide Indicators — Only show if multiple articles */}
      {articles.length > 1 && (
        <div className="flex items-center justify-center gap-2 mt-4">
          {articles.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`transition-all ${
                index === currentIndex
                  ? 'bg-primary w-8 h-2 rounded-full'
                  : 'bg-border hover:bg-primary/50 w-2 h-2 rounded-full'
              }`}
              aria-label={`Go to slide ${index + 1}`}
              aria-current={index === currentIndex ? 'page' : undefined}
            />
          ))}
        </div>
      )}
    </section>
  );
}