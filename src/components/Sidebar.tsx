'use client';

import React, { useState } from 'react';
import Link from 'next/link';

import { getTrendingArticles } from '@/lib/articles';

const categoryColorMap: Record<string, string> = {
  blue: 'category-badge-blue',
  amber: 'category-badge-amber',
  red: 'category-badge-red',
  green: 'category-badge-green',
};

export default function Sidebar() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const trending = getTrendingArticles();

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail('');
    }
  };

  return (
    <aside className="w-full space-y-6">
      {/* Trending Now */}
      <div className="bg-card rounded-xl border border-border p-5">
        <div className="section-header mb-4">
          <div className="section-header-accent" />
          <h2 className="font-display text-base font-bold text-foreground" style={{ letterSpacing: '-0.02em' }}>
            Trending Now
          </h2>
          <div className="section-header-line" />
        </div>
        <ol className="space-y-0">
          {trending.map((article, index) => {
            const badgeClass = categoryColorMap[article.categoryColor] || 'category-badge-blue';
            return (
              <li key={article.id}>
                <Link
                  href={`/article?slug=${article.slug}`}
                  className="flex gap-3 py-3 border-b border-border last:border-0 group"
                >
                  <span className="font-display text-2xl font-800 text-border flex-shrink-0 w-6 leading-none mt-0.5" style={{ fontWeight: 800, color: 'var(--border)' }}>
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <div className="flex-1 min-w-0">
                    <span className={`category-badge ${badgeClass} mb-1.5`}>{article.category}</span>
                    <h4 className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-2 leading-snug" style={{ letterSpacing: '-0.01em' }}>
                      {article.title}
                    </h4>
                  </div>
                </Link>
              </li>
            );
          })}
        </ol>
      </div>

      {/* Newsletter Signup */}
      <div className="bg-card rounded-xl border border-border p-5">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#1A6DD2' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
              <polyline points="22,6 12,13 2,6" />
            </svg>
          </div>
          <h3 className="font-display text-base font-bold text-foreground" style={{ letterSpacing: '-0.02em' }}>
            Get the Daily Byte
          </h3>
        </div>
        <p className="text-sm text-muted mb-4 leading-relaxed">
          Top 5 tech stories every morning. No spam. Unsubscribe anytime.
        </p>
        {subscribed ? (
          <div className="text-sm font-semibold text-market-green text-center py-2">
            ✓ You're subscribed!
          </div>
        ) : (
          <form onSubmit={handleSubscribe} className="flex flex-col gap-2">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              required
              className="px-3 py-2.5 text-sm rounded-lg border border-border bg-background text-foreground placeholder-muted focus:outline-none focus:ring-2 focus:border-primary transition-all"
              style={{ '--tw-ring-color': '#1A6DD2' } as React.CSSProperties}
            />
            <button
              type="submit"
              className="px-4 py-2.5 text-sm font-bold rounded-lg text-white transition-all hover:opacity-90 min-h-[44px]"
              style={{ backgroundColor: '#1A6DD2' }}
            >
              Subscribe Free
            </button>
          </form>
        )}
      </div>

      {/* Follow Us */}
      <div className="bg-card rounded-xl border border-border p-5">
        <h3 className="font-display text-base font-bold text-foreground mb-4" style={{ letterSpacing: '-0.02em' }}>
          Follow Us
        </h3>
        <div className="flex flex-col gap-2">
          {[
            { label: 'Twitter / X', sub: '@dailybytenews', color: '#000000', icon: (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            )},
            { label: 'Instagram', sub: '@dailybytenews', color: '#E1306C', icon: (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
              </svg>
            )},
            { label: 'Telegram', sub: 't.me/dailybytenews', color: '#0088CC', icon: (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.447 1.394c-.16.16-.295.295-.605.295l.213-3.053 5.56-5.023c.242-.213-.054-.333-.373-.12l-6.871 4.326-2.962-.924c-.643-.204-.657-.643.136-.953l11.57-4.461c.537-.194 1.006.131.833.941z" />
              </svg>
            )},
          ].map((social) => (
            <a
              key={social.label}
              href="#"
              className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-background transition-colors group min-h-[44px]"
            >
              <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white flex-shrink-0" style={{ backgroundColor: social.color }}>
                {social.icon}
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">{social.label}</p>
                <p className="text-xs text-muted">{social.sub}</p>
              </div>
            </a>
          ))}
        </div>
      </div>

      {/* Ad Slot */}
      <div className="rounded-xl border border-dashed border-border p-6 text-center">
        <p className="text-xs text-muted uppercase tracking-widest font-semibold">Advertisement</p>
        <div className="mt-2 h-32 bg-background rounded-lg flex items-center justify-center">
          <p className="text-xs text-muted">300 × 250 Ad Slot</p>
        </div>
      </div>
    </aside>
  );
}