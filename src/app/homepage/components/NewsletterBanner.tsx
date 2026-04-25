'use client';

import React, { useState } from 'react';

export default function NewsletterBanner() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubmitted(true);
      setEmail('');
    }
  };

  return (
    <section style={{ backgroundColor: '#1A6DD2' }} className="py-16 px-4">
      <div className="max-w-[720px] mx-auto text-center">
        <span className="inline-block bg-white/20 text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded mb-4">
          Newsletter
        </span>
        <h2 className="font-display text-white font-bold mb-3" style={{ fontSize: 'clamp(1.5rem, 4vw, 2rem)', letterSpacing: '-0.025em' }}>
          The Daily Byte — In Your Inbox
        </h2>
        <p className="text-white/80 text-base mb-8 leading-relaxed">
          5 must-read AI and tech stories every morning. Curated by our editors. No spam, ever. Join 12,000+ readers.
        </p>
        {submitted ? (
          <div className="bg-white/20 text-white font-semibold px-6 py-4 rounded-xl inline-block">
            ✓ You're in! Check your inbox for a welcome note.
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email address"
              required
              className="flex-1 px-4 py-3 rounded-lg text-sm text-foreground bg-white border-0 focus:outline-none focus:ring-2 focus:ring-white/40 placeholder-muted"
            />
            <button
              type="submit"
              className="px-6 py-3 rounded-lg bg-dark-navy text-white text-sm font-bold hover:opacity-90 transition-opacity min-h-[44px] flex-shrink-0"
            >
              Subscribe Free
            </button>
          </form>
        )}
        <p className="text-white/50 text-xs mt-4">No spam. Unsubscribe with one click.</p>
      </div>
    </section>
  );
}