'use client';

import React from 'react';
import Link from 'next/link';

import type { Article } from '@/lib/articles';

const categoryColorMap: Record<string, string> = {
  blue: 'category-badge-blue',
  amber: 'category-badge-amber',
  red: 'category-badge-red',
  green: 'category-badge-green',
};

interface SidebarProps {
  trendingArticles?: Article[];
}

export default function Sidebar({ trendingArticles }: SidebarProps) {
  const trending = trendingArticles ?? [];

  return (
    <aside className="w-full space-y-6">
      {/* Trending Now */}
      <div className="bg-card rounded-xl border border-border p-5">
        <div className="section-header mb-4">
          <div className="section-header-accent" />
          <h2
            className="font-display text-base font-bold text-foreground"
            style={{ letterSpacing: '-0.02em' }}
          >
            Trending Now
          </h2>
          <div className="section-header-line" />
        </div>
        {trending.length > 0 ? (
          <ol className="space-y-0">
            {trending.map((article, index) => {
              const badgeClass = categoryColorMap[article.categoryColor] || 'category-badge-blue';
              return (
                <li key={article.id}>
                  <Link
                    href={`/article?slug=${article.slug}`}
                    className="flex gap-3 py-3 border-b border-border last:border-0 group"
                  >
                    <span
                      className="font-display text-2xl font-800 text-border flex-shrink-0 w-6 leading-none mt-0.5"
                      style={{ fontWeight: 800, color: 'var(--border)' }}
                    >
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <div className="flex-1 min-w-0">
                      <span className={`category-badge ${badgeClass} mb-1.5`}>
                        {article.category}
                      </span>
                      <h4
                        className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-2 leading-snug"
                        style={{ letterSpacing: '-0.01em' }}
                      >
                        {article.title}
                      </h4>
                    </div>
                  </Link>
                </li>
              );
            })}
          </ol>
        ) : (
          <p className="text-sm text-muted py-6">No trending articles yet</p>
        )}
      </div>

      {/* Follow Us */}
      <div className="bg-card rounded-xl border border-border p-5">
        <h3
          className="font-display text-base font-bold text-foreground mb-4"
          style={{ letterSpacing: '-0.02em' }}
        >
          Follow Us
        </h3>
        <div className="flex flex-col gap-2">
          {[
            {
              label: 'Twitter / X',
              sub: '@daily_bytenews',
              href: 'https://twitter.com/daily_bytenews',
              color: '#000000',
              icon: (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              ),
            },
            {
              label: 'Instagram',
              sub: '@daily_bytenews',
              href: 'https://instagram.com/daily_bytenews',
              color: '#E1306C',
              icon: (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
              ),
            },
          ].map((social) => (
            <a
              key={social.label}
              href={social.href}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-background transition-colors group min-h-[44px]"
            >
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center text-white flex-shrink-0"
                style={{ backgroundColor: social.color }}
              >
                {social.icon}
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">
                  {social.label}
                </p>
                <p className="text-xs text-muted">{social.sub}</p>
              </div>
            </a>
          ))}
        </div>
      </div>
    </aside>
  );
}
