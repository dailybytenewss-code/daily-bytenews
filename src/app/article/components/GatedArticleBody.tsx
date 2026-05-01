'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import type { Article } from '@/lib/articles';
import { subscribeEmail } from '@/lib/subscriber-db';
import { EnvelopeIcon, LockClosedIcon, CheckCircleIcon } from '@heroicons/react/24/outline';

interface GatedArticleBodyProps {
  article: Article;
}

const ACCESS_KEY = 'dbn_reader_access';
const GATE_THRESHOLD = 0.28; // Show gate at 28% of article height

export default function GatedArticleBody({ article }: GatedArticleBodyProps) {
  const [hasAccess, setHasAccess] = useState(false);
  const [gateVisible, setGateVisible] = useState(false);
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const contentRef = useRef<HTMLDivElement>(null);

  // Check localStorage — returning subscribers skip the gate
  useEffect(() => {
    if (typeof window !== 'undefined' && localStorage.getItem(ACCESS_KEY) === 'true') {
      setHasAccess(true);
    }
  }, []);

  // Scroll listener — trigger gate when user reaches threshold
  useEffect(() => {
    if (hasAccess) return;

    const handleScroll = () => {
      const el = contentRef.current;
      if (!el) return;

      const rect = el.getBoundingClientRect();
      const articleTop = el.offsetTop;
      const articleHeight = el.offsetHeight;
      const scrolled = window.scrollY + window.innerHeight * 0.5 - articleTop;
      const progress = scrolled / articleHeight;

      if (progress >= GATE_THRESHOLD) {
        setGateVisible(true);
        window.removeEventListener('scroll', handleScroll);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    // Check on mount too (in case article is short)
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, [hasAccess]);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setLoading(true);
    setError('');

    const result = await subscribeEmail(email.trim());

    setLoading(false);

    if (
      result.success ||
      result.message === 'Already subscribed' ||
      result.message === 'Resubscribed successfully'
    ) {
      setSuccess(true);
      localStorage.setItem(ACCESS_KEY, 'true');
      setTimeout(() => {
        setHasAccess(true);
        setGateVisible(false);
      }, 1200);
    } else {
      setError(result.message || 'Something went wrong. Please try again.');
    }
  };

  return (
    <div className="prose-article mb-10">

      {/* ── Article Content ──────────────────────────── */}
      <div className="relative">
        <div
          ref={contentRef}
          className={
            gateVisible && !hasAccess
              ? 'max-h-[420px] overflow-hidden'
              : ''
          }
        >
          <div dangerouslySetInnerHTML={{ __html: article.content }} />
        </div>

        {/* Gradient fade overlay — only when gated */}
        {gateVisible && !hasAccess && (
          <div
            className="absolute bottom-0 left-0 right-0 h-56 pointer-events-none"
            style={{
              background:
                'linear-gradient(to bottom, transparent 0%, var(--color-background, white) 90%)',
            }}
          />
        )}
      </div>

      {/* ── Subscribe Gate ───────────────────────────── */}
      {gateVisible && !hasAccess && (
        <div className="relative my-8 rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-700 shadow-2xl shadow-black/10 dark:shadow-black/40">

          {/* Top gradient bar */}
          <div className="h-1 w-full bg-gradient-to-r from-blue-500 via-violet-500 to-indigo-600" />

          <div className="bg-white dark:bg-gray-900 px-6 py-10 sm:px-10 text-center">

            {/* Lock icon */}
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-blue-50 dark:bg-blue-900/30 mb-5">
              <LockClosedIcon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>

            {/* Headline */}
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2 tracking-tight">
              Continue Reading — Free
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-1 max-w-md mx-auto">
              You've read <strong className="text-gray-700 dark:text-gray-300">25% of this article</strong>. Subscribe free to unlock the full story and get the best AI & tech news in your inbox every morning.
            </p>

            {/* Social proof */}
            <div className="flex items-center justify-center gap-1.5 mb-6 mt-3">
              <div className="flex -space-x-2">
                {['bg-blue-400', 'bg-violet-400', 'bg-indigo-400', 'bg-sky-400'].map((c, i) => (
                  <div key={i} className={`w-6 h-6 rounded-full ${c} border-2 border-white dark:border-gray-900 flex items-center justify-center text-[8px] font-bold text-white`}>
                    {String.fromCharCode(65 + i)}
                  </div>
                ))}
              </div>
              <span className="text-xs text-gray-500 dark:text-gray-400 ml-1">
                Join <strong className="text-gray-700 dark:text-gray-300">12,000+</strong> readers
              </span>
            </div>

            {/* Success state */}
            {success ? (
              <div className="flex items-center justify-center gap-2 text-green-600 dark:text-green-400 font-semibold py-3">
                <CheckCircleIcon className="w-5 h-5" />
                <span>Subscribed! Unlocking the full article...</span>
              </div>
            ) : (
              <>
                {/* Subscribe form */}
                <form
                  onSubmit={handleSubscribe}
                  className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto"
                >
                  <div className="relative flex-1">
                    <EnvelopeIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email to unlock"
                      className="w-full pl-9 pr-3 py-3 text-sm border border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={loading || !email.trim()}
                    className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white text-sm font-bold rounded-xl transition-colors flex-shrink-0 shadow-lg shadow-blue-500/25"
                  >
                    {loading ? (
                      <span className="flex items-center gap-2">
                        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Unlocking...
                      </span>
                    ) : (
                      'Unlock Article →'
                    )}
                  </button>
                </form>

                {error && (
                  <p className="mt-3 text-xs text-red-500 dark:text-red-400">{error}</p>
                )}

                {/* Fine print — no bypass, email required */}
                <p className="mt-4 text-xs text-gray-400 dark:text-gray-500">
                  No spam. Unsubscribe anytime.{' '}
                  Already a subscriber? Enter your email above — it unlocks instantly.
                </p>
              </>
            )}
          </div>

          {/* Perks strip */}
          <div className="bg-gray-50 dark:bg-gray-800/60 border-t border-gray-100 dark:border-gray-700/60 px-6 py-4">
            <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-1 text-xs text-gray-500 dark:text-gray-400 font-medium">
              {[
                '✦ 5 stories every morning',
                '✦ No paywalls on site',
                '✦ No spam ever',
                '✦ Cancel anytime',
              ].map((perk) => (
                <span key={perk}>{perk}</span>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── Tags (always visible) ─────────────────────── */}
      {(hasAccess || !gateVisible) && (
        <div className="mt-10 pt-6 border-t border-border">
          <p className="text-xs font-bold uppercase tracking-widest text-muted mb-3">Tags</p>
          <div className="flex flex-wrap gap-2">
            {article.tags.map((tag) => (
              <Link
                key={tag}
                href={`/homepage?search=${encodeURIComponent(tag)}`}
                className="px-3 py-1.5 text-xs font-semibold rounded-md border border-border text-muted hover:border-primary hover:text-primary transition-colors min-h-[32px] flex items-center"
              >
                #{tag}
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
