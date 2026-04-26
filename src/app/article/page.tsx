import React from 'react';
import type { Metadata } from 'next';
import { getArticleBySlug, getLatestArticles } from '@/lib/articles';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ArticleBody from './components/ArticleBody';
import ArticleHero from './components/ArticleHero';
import RelatedArticles from './components/RelatedArticles';
import ArticleShareBar from './components/ArticleShareBar';
import AuthorBio from './components/AuthorBio';
import Sidebar from '@/components/Sidebar';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Article — DailyByteNews',
  description: 'Read the latest tech and AI news on DailyByteNews.',
  alternates: { canonical: 'https://dailybytenews.in/article' },
};

interface ArticlePageProps {
  searchParams: Promise<{ slug?: string }>;
}

export default async function ArticlePage({ searchParams }: ArticlePageProps) {
  const { slug: slugParam } = await searchParams;
  const slug = slugParam || 'only-20-percent-companies-winning-ai-race-pwc-study';
  const article = getArticleBySlug(slug);
  const related = getLatestArticles(3).filter((a) => a.slug !== slug);

  if (!article) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="max-w-[720px] mx-auto px-4 py-24 text-center">
          <h1 className="font-display text-3xl font-bold text-foreground mb-4">Article not found</h1>
          <Link href="/" className="text-primary font-semibold hover:underline">← Back to homepage</Link>
        </div>
        <Footer />
      </div>
    );
  }

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    headline: article.title,
    description: article.excerpt,
    image: article.image,
    author: { '@type': 'Person', name: article.author },
    publisher: {
      '@type': 'Organization',
      name: 'DailyByteNews',
      logo: { '@type': 'ImageObject', url: 'https://dailybytenews.in/assets/images/app_logo.png' },
    },
    datePublished: article.date,
    dateModified: article.date,
    mainEntityOfPage: { '@type': 'WebPage', '@id': `https://dailybytenews.in/article?slug=${article.slug}` },
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <div className="max-w-[1200px] mx-auto px-4 pt-8 pb-16">
          <div className="flex flex-col lg:flex-row gap-10">
            {/* Article Content */}
            <article className="flex-1 min-w-0 max-w-[720px]">
              <ArticleHero article={article} />
              <ArticleBody article={article} />
              <AuthorBio article={article} />
              <RelatedArticles articles={related} />
            </article>

            {/* Sidebar */}
            <div className="lg:w-80 flex-shrink-0">
              <div className="sticky-sidebar">
                <Sidebar />
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Mobile Share Bar */}
      <ArticleShareBar article={article} />

      <Footer />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </div>
  );
}