'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import AppLogo from '@/components/ui/AppLogo';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail('');
    }
  };

  return (
    <footer className="bg-dark-navy text-white">
      <div className="max-w-[1200px] mx-auto px-4 pt-16 pb-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-white/10">
          {/* About */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <AppLogo size={32} />
              <span className="font-display font-bold text-lg tracking-tight">
                <span className="text-white">Daily</span>
                <span style={{ color: '#1A6DD2' }}>Byte</span>
                <span className="text-white">News</span>
              </span>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed mb-4">
              DailyByteNews delivers fast, trustworthy coverage of AI, technology, and business — built for the modern Indian tech reader.
            </p>
            <div className="flex items-center gap-3">
              <a href="https://twitter.com/daily_bytenews" target="_blank" rel="noopener noreferrer"
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-primary flex items-center justify-center transition-colors" aria-label="Twitter">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
              <a href="https://instagram.com/daily_bytenews" target="_blank" rel="noopener noreferrer"
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-primary flex items-center justify-center transition-colors" aria-label="Instagram">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Categories */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-widest text-gray-400 mb-5">Categories</h4>
            <ul className="space-y-3">
              {[
                { label: 'AI & Tech', href: '/category?cat=ai-tech' },
                { label: 'Business & Markets', href: '/category?cat=business' },
                { label: 'Trending', href: '/category?cat=trending' },
              ].map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="text-sm text-gray-400 hover:text-white transition-colors min-h-[44px] flex items-center">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-widest text-gray-400 mb-5">Quick Links</h4>
            <ul className="space-y-3">
              {[
                { label: 'About Us', href: '/about' },
                { label: 'Contact', href: '/contact' },
                { label: 'Privacy Policy', href: '/privacy-policy' },
                { label: 'Disclaimer', href: '/disclaimer' },
                { label: 'Advertise', href: '/contact#advertise' },
              ].map((item) => (
                <li key={item.label}>
                  <Link href={item.href} className="text-sm text-gray-400 hover:text-white transition-colors min-h-[44px] flex items-center">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-widest text-gray-400 mb-5">Daily Newsletter</h4>
            <p className="text-sm text-gray-400 mb-4 leading-relaxed">
              Get the top 5 tech stories delivered to your inbox every morning.
            </p>
            {subscribed ? (
              <div className="text-sm font-semibold text-green-400 py-2">✓ You're subscribed!</div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex flex-col gap-2">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="your@email.com"
                  className="px-3 py-2.5 text-sm rounded-lg bg-white/10 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:border-primary transition-all"
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
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-gray-500">
            © 2026 DailyByteNews. All rights reserved. dailybytenews.in
          </p>
          <div className="flex items-center gap-4">
            <Link href="/privacy-policy" className="text-xs text-gray-500 hover:text-gray-300 transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="text-xs text-gray-500 hover:text-gray-300 transition-colors">Terms of Service</Link>
            <Link href="/sitemap.xml" className="text-xs text-gray-500 hover:text-gray-300 transition-colors">Sitemap</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
