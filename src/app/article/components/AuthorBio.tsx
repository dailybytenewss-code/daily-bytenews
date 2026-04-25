import React from 'react';
import AppLogo from '@/components/ui/AppLogo';
import type { Article } from '@/lib/articles';

interface AuthorBioProps {
  article: Article;
}

export default function AuthorBio({ article }: AuthorBioProps) {
  return (
    <div className="mt-10 p-6 bg-card rounded-xl border border-border">
      <p className="text-xs font-bold uppercase tracking-widest text-muted mb-4">About the Author</p>
      <div className="flex gap-4">
        <div className="flex-shrink-0">
          <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-border bg-dark-navy flex items-center justify-center">
            <AppLogo size={36} />
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-display font-bold text-foreground text-base mb-1" style={{ letterSpacing: '-0.02em' }}>
            {article.author}
          </h3>
          <p className="text-sm text-muted leading-relaxed">
            {article.authorBio}
          </p>
          <div className="flex items-center gap-3 mt-3">
            <a
              href="https://twitter.com/daily_bytenews"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-semibold text-primary hover:opacity-80 transition-opacity flex items-center gap-1"
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
              Follow on X
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
