'use client';

import { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { articles } from '@/lib/articles';
import { ArrowLeftIcon, CheckIcon } from '@heroicons/react/24/outline';

const CATEGORIES = [
  { label: 'AI & Tech', slug: 'ai-tech', color: 'blue' },
  { label: 'Business & Markets', slug: 'business', color: 'green' },
  { label: 'Trending', slug: 'trending', color: 'amber' },
  { label: 'Explainers', slug: 'explainers', color: 'blue' },
  { label: 'Opinion', slug: 'opinion', color: 'amber' },
];

function slugify(str: string) {
  return str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

export default function EditArticlePage() {
  const router = useRouter();
  const params = useParams();
  const article = articles.find((a) => a.id === params.id);

  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const [form, setForm] = useState({
    title: article?.title || '',
    slug: article?.slug || '',
    excerpt: article?.excerpt || '',
    category: article?.category || 'AI & Tech',
    categorySlug: article?.categorySlug || 'ai-tech',
    categoryColor: article?.categoryColor || 'blue',
    author: article?.author || '',
    authorBio: article?.authorBio || '',
    authorAvatar: article?.authorAvatar || '',
    date: article?.date || '',
    readTime: article?.readTime || '',
    image: article?.image || '',
    imageAlt: article?.imageAlt || '',
    imageCaption: article?.imageCaption || '',
    tags: article?.tags?.join(', ') || '',
    featured: article?.featured || false,
    trending: article?.trending || false,
    content: article?.content || '',
  });

  if (!article) {
    return (
      <div className="text-center py-20">
        <p className="text-gray-500 dark:text-gray-400 mb-4">Article not found.</p>
        <Link href="/admin/articles" className="text-blue-600 dark:text-blue-400 hover:underline text-sm font-medium">
          ← Back to Articles
        </Link>
      </div>
    );
  }

  const set = (field: string, value: string | boolean) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const handleTitleChange = (value: string) => {
    setForm((prev) => ({
      ...prev,
      title: value,
      slug: prev.slug === slugify(prev.title) ? slugify(value) : prev.slug,
    }));
  };

  const handleCategoryChange = (label: string) => {
    const cat = CATEGORIES.find((c) => c.label === label)!;
    setForm((prev) => ({ ...prev, category: cat.label, categorySlug: cat.slug, categoryColor: cat.color as 'blue' | 'green' | 'amber' | 'red' }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    await new Promise((r) => setTimeout(r, 800));
    setSaving(false);
    setSaved(true);
    setTimeout(() => router.push('/admin/articles'), 1200);
  };

  return (
    <div className="max-w-4xl">
      <div className="flex items-center gap-4 mb-6">
        <Link href="/admin/articles" className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
          <ArrowLeftIcon className="w-4 h-4" />
        </Link>
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Edit Article</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-1">{article.title}</p>
        </div>
        <div className="ml-auto flex items-center gap-3">
          <Link href="/admin/articles" className="px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 transition-colors">Cancel</Link>
          <button
            form="edit-form"
            type="submit"
            disabled={saving || saved}
            className="inline-flex items-center gap-2 px-5 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white text-sm font-semibold rounded-lg transition-colors"
          >
            {saved ? <><CheckIcon className="w-4 h-4" />Saved!</> : saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>

      <form id="edit-form" onSubmit={handleSubmit} className="space-y-5">
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-5 space-y-4">
          <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">Basic Info</h3>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Title <span className="text-red-500">*</span></label>
            <input required type="text" value={form.title} onChange={(e) => handleTitleChange(e.target.value)}
              className="w-full px-3 py-2.5 text-sm border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Slug</label>
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-400 flex-shrink-0">/article?slug=</span>
              <input type="text" value={form.slug} onChange={(e) => set('slug', slugify(e.target.value))}
                className="flex-1 px-3 py-2.5 text-sm border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-mono focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Excerpt <span className="text-red-500">*</span></label>
            <textarea required rows={3} value={form.excerpt} onChange={(e) => set('excerpt', e.target.value)}
              className="w-full px-3 py-2.5 text-sm border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none" />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-5 space-y-4">
          <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">Classification</h3>
          <div className="grid sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Category</label>
              <select value={form.category} onChange={(e) => handleCategoryChange(e.target.value)}
                className="w-full px-3 py-2.5 text-sm border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500">
                {CATEGORIES.map((c) => <option key={c.slug}>{c.label}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Date</label>
              <input type="date" value={form.date} onChange={(e) => set('date', e.target.value)}
                className="w-full px-3 py-2.5 text-sm border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Read Time</label>
              <input type="text" value={form.readTime} onChange={(e) => set('readTime', e.target.value)}
                className="w-full px-3 py-2.5 text-sm border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Tags</label>
            <input type="text" value={form.tags} onChange={(e) => set('tags', e.target.value)} placeholder="AI, OpenAI (comma-separated)"
              className="w-full px-3 py-2.5 text-sm border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div className="flex items-center gap-6 pt-1">
            <label className="flex items-center gap-2.5 cursor-pointer">
              <input type="checkbox" checked={form.featured} onChange={(e) => set('featured', e.target.checked)}
                className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Featured</span>
            </label>
            <label className="flex items-center gap-2.5 cursor-pointer">
              <input type="checkbox" checked={form.trending} onChange={(e) => set('trending', e.target.checked)}
                className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Trending</span>
            </label>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-5 space-y-4">
          <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">Cover Image</h3>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Image URL</label>
              <input type="url" value={form.image} onChange={(e) => set('image', e.target.value)}
                className="w-full px-3 py-2.5 text-sm border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Alt Text</label>
              <input type="text" value={form.imageAlt} onChange={(e) => set('imageAlt', e.target.value)}
                className="w-full px-3 py-2.5 text-sm border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
          </div>
          {form.image && (
            <div className="rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 h-40 bg-gray-100 dark:bg-gray-800">
              <img src={form.image} alt={form.imageAlt} className="w-full h-full object-cover" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
            </div>
          )}
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-5 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">Article Content</h3>
            <span className="text-xs text-gray-400">HTML supported</span>
          </div>
          <textarea required rows={18} value={form.content} onChange={(e) => set('content', e.target.value)}
            className="w-full px-3 py-2.5 text-sm border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono resize-y" />
        </div>

        <div className="flex justify-end gap-3 pb-4">
          <Link href="/admin/articles" className="px-5 py-2.5 text-sm font-medium text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">Cancel</Link>
          <button type="submit" disabled={saving || saved}
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white text-sm font-semibold rounded-lg transition-colors">
            {saved ? <><CheckIcon className="w-4 h-4" />Saved!</> : saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  );
}
