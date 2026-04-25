import React from 'react';
import Link from 'next/link';
import type { Article } from '@/lib/articles';

interface ArticleBodyProps {
  article: Article;
}

export default function ArticleBody({ article }: ArticleBodyProps) {
  return (
    <div className="prose-article mb-10">
      <div dangerouslySetInnerHTML={{ __html: article.content }} />

      {/* Tags */}
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
    </div>
  );
}