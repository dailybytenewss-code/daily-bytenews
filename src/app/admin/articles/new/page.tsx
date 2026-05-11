'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import MediaPicker from '@/components/admin/MediaPicker';
import RichTextToolbar from '@/components/admin/RichTextToolbar';
import NotifySubscribersForm from '../components/NotifySubscribersForm';
import { createClient } from '@/lib/supabase/client';
import {
  DEFAULT_AUTHOR,
  DEFAULT_CATEGORIES,
  type AdminCategory,
  type AuthorProfile,
} from '@/lib/admin-taxonomy';
import {
  ArrowLeftIcon,
  CheckIcon,
  PhotoIcon,
  ChevronDownIcon,
  ChevronUpIcon,
} from '@heroicons/react/24/outline';

type Status = 'draft' | 'published' | 'scheduled';

function slugify(str: string) {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

export default function NewArticlePage() {
  const router = useRouter();
  const contentRef = useRef<HTMLTextAreaElement>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [publishedArticle, setPublishedArticle] = useState<{ title: string; slug: string } | null>(
    null
  );
  const [showMediaPicker, setShowMediaPicker] = useState(false);
  const [mediaTarget, setMediaTarget] = useState<'cover' | 'content' | 'author' | 'og'>('cover');
  const [seoOpen, setSeoOpen] = useState(false);
  const [status, setStatus] = useState<Status>('published');
  const [error, setError] = useState('');
  const [directoryWarning, setDirectoryWarning] = useState('');
  const [authors, setAuthors] = useState<AuthorProfile[]>([DEFAULT_AUTHOR]);
  const [categories, setCategories] = useState<AdminCategory[]>(DEFAULT_CATEGORIES);

  const [form, setForm] = useState({
    title: '',
    slug: '',
    excerpt: '',
    category: 'AI & Tech',
    categorySlug: 'ai-tech',
    categoryColor: 'blue',
    author: DEFAULT_AUTHOR.name,
    authorSlug: DEFAULT_AUTHOR.slug,
    authorBio: DEFAULT_AUTHOR.bio,
    authorAvatar: DEFAULT_AUTHOR.avatar_url,
    date: new Date().toISOString().split('T')[0],
    scheduledAt: '',
    readTime: '5 min read',
    image: '',
    imageAlt: '',
    imageCaption: '',
    tags: '',
    featured: false,
    trending: false,
    content: '',
    // SEO
    metaTitle: '',
    metaDescription: '',
    ogImage: '',
    canonical: '',
  });

  const set = (field: string, value: string | boolean) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  useEffect(() => {
    let mounted = true;

    async function loadDirectory() {
      const supabase = createClient();
      const [
        { data: authorRows, error: authorError },
        { data: categoryRows, error: categoryError },
      ] = await Promise.all([
        supabase.from('authors').select('*').eq('status', 'active').order('name'),
        supabase.from('article_categories').select('*').eq('status', 'active').order('name'),
      ]);

      if (!mounted) return;

      if (!authorError && authorRows && authorRows.length > 0) {
        const nextAuthors = authorRows as AuthorProfile[];
        setAuthors(nextAuthors);
        const first = nextAuthors[0];
        setForm((prev) =>
          prev.author === DEFAULT_AUTHOR.name
            ? {
                ...prev,
                author: first.name,
                authorSlug: first.slug,
                authorBio: first.bio,
                authorAvatar: first.avatar_url,
              }
            : prev
        );
      }

      if (!categoryError && categoryRows && categoryRows.length > 0) {
        const nextCategories = categoryRows as AdminCategory[];
        setCategories(nextCategories);
        const first = nextCategories[0];
        setForm((prev) =>
          prev.categorySlug === 'ai-tech'
            ? {
                ...prev,
                category: first.name,
                categorySlug: first.slug,
                categoryColor: first.color,
              }
            : prev
        );
      }

      if (authorError || categoryError) {
        setDirectoryWarning(
          'Using default author/category choices. Run the updated Supabase schema to enable managed dropdowns.'
        );
      }
    }

    loadDirectory();
    return () => {
      mounted = false;
    };
  }, []);

  const handleTitleChange = (value: string) => {
    setForm((prev) => ({
      ...prev,
      title: value,
      slug: prev.slug === slugify(prev.title) || prev.slug === '' ? slugify(value) : prev.slug,
      metaTitle: prev.metaTitle === '' ? value : prev.metaTitle,
    }));
  };

  const handleCategoryChange = (label: string) => {
    const cat = categories.find((c) => c.name === label)!;
    setForm((prev) => ({
      ...prev,
      category: cat.name,
      categorySlug: cat.slug,
      categoryColor: cat.color,
    }));
  };

  const handleAuthorChange = (slug: string) => {
    const author = authors.find((a) => a.slug === slug) || DEFAULT_AUTHOR;
    setForm((prev) => ({
      ...prev,
      author: author.name,
      authorSlug: author.slug,
      authorBio: author.bio,
      authorAvatar: author.avatar_url,
    }));
  };

  const openMediaPicker = (target: 'cover' | 'content' | 'author' | 'og') => {
    setMediaTarget(target);
    setShowMediaPicker(true);
  };

  const handleMediaSelect = (url: string) => {
    if (mediaTarget === 'cover') {
      set('image', url);
    } else if (mediaTarget === 'author') {
      set('authorAvatar', url);
    } else if (mediaTarget === 'og') {
      set('ogImage', url);
    } else {
      const tag = `<img src="${url}" alt="" class="w-full rounded-lg my-4" />`;
      const el = contentRef.current;
      if (el) {
        const pos = el.selectionStart;
        const newVal = form.content.slice(0, pos) + '\n' + tag + '\n' + form.content.slice(pos);
        set('content', newVal);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSaving(true);

    const supabase = createClient();
    const payload = {
      slug: form.slug || slugify(form.title),
      title: form.title,
      excerpt: form.excerpt,
      category: form.category,
      category_slug: form.categorySlug,
      category_color: form.categoryColor,
      author: form.author || 'DailyByteNews',
      author_slug: form.authorSlug || slugify(form.author || 'dailybytenews'),
      author_avatar: form.authorAvatar || '/assets/images/app_logo.png',
      author_bio: form.authorBio,
      published_at: form.date,
      scheduled_at:
        status === 'scheduled' && form.scheduledAt
          ? new Date(form.scheduledAt).toISOString()
          : null,
      read_time: form.readTime || '5 min read',
      image: form.image,
      image_alt: form.imageAlt,
      image_caption: form.imageCaption || null,
      tags: form.tags
        .split(',')
        .map((tag) => tag.trim())
        .filter(Boolean),
      featured: form.featured,
      trending: form.trending,
      status,
      content: form.content,
      meta_title: form.metaTitle || null,
      meta_description: form.metaDescription || null,
      og_image: form.ogImage || null,
      canonical: form.canonical || null,
    };

    const { error } = await supabase.from('articles').insert(payload);

    setSaving(false);

    if (error) {
      setError(error.message);
      return;
    }

    setSaved(true);
    // Show the notify subscribers form instead of redirecting immediately
    setPublishedArticle({
      title: form.title,
      slug: form.slug || slugify(form.title),
    });
  };

  const inputCls =
    'w-full px-3 py-2.5 text-sm border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition';
  const labelCls = 'block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5';

  return (
    <>
      {showMediaPicker && (
        <MediaPicker onSelect={handleMediaSelect} onClose={() => setShowMediaPicker(false)} />
      )}

      <div className="max-w-4xl">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6 flex-wrap">
          <Link
            href="/admin/articles"
            className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <ArrowLeftIcon className="w-4 h-4" />
          </Link>
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">New Article</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Fill in all fields and publish
            </p>
          </div>
          <div className="ml-auto flex items-center gap-3">
            {/* Status selector */}
            <div className="flex items-center rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
              {(['draft', 'published', 'scheduled'] as Status[]).map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setStatus(s)}
                  className={`px-3 py-1.5 text-xs font-semibold capitalize transition-colors ${
                    status === s
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
            <button
              form="article-form"
              type="submit"
              disabled={saving || saved}
              className="inline-flex items-center gap-2 px-5 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white text-sm font-semibold rounded-lg transition-colors"
            >
              {saved ? (
                <>
                  <CheckIcon className="w-4 h-4" />
                  Saved!
                </>
              ) : saving ? (
                'Saving...'
              ) : status === 'draft' ? (
                'Save Draft'
              ) : status === 'scheduled' ? (
                'Schedule'
              ) : (
                'Publish'
              )}
            </button>
          </div>
        </div>

        {error && (
          <div className="mb-5 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl px-4 py-3 text-sm text-red-600 dark:text-red-400">
            {error}
          </div>
        )}

        {directoryWarning && (
          <div className="mb-5 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl px-4 py-3 text-sm text-amber-700 dark:text-amber-300">
            {directoryWarning}
          </div>
        )}

        <form id="article-form" onSubmit={handleSubmit} className="space-y-5">
          {/* Title & Slug */}
          <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-5 space-y-4">
            <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">Basic Info</h3>
            <div>
              <label className={labelCls}>
                Title <span className="text-red-500">*</span>
              </label>
              <input
                required
                type="text"
                value={form.title}
                onChange={(e) => handleTitleChange(e.target.value)}
                placeholder="Enter article headline..."
                className={inputCls}
              />
            </div>
            <div>
              <label className={labelCls}>
                Slug <span className="text-red-500">*</span>
              </label>
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-400 flex-shrink-0">/article?slug=</span>
                <input
                  required
                  type="text"
                  value={form.slug}
                  onChange={(e) => set('slug', slugify(e.target.value))}
                  className={`${inputCls} font-mono`}
                />
              </div>
            </div>
            <div>
              <label className={labelCls}>
                Excerpt <span className="text-red-500">*</span>
              </label>
              <textarea
                required
                rows={3}
                value={form.excerpt}
                onChange={(e) => set('excerpt', e.target.value)}
                placeholder="A brief summary shown on cards and search results..."
                className={`${inputCls} resize-none`}
              />
            </div>
          </div>

          {/* Classification */}
          <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-5 space-y-4">
            <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
              Classification
            </h3>
            <div className="grid sm:grid-cols-3 gap-4">
              <div>
                <label className={labelCls}>
                  Category <span className="text-red-500">*</span>
                </label>
                <select
                  value={form.category}
                  onChange={(e) => handleCategoryChange(e.target.value)}
                  className={inputCls}
                >
                  {categories.map((c) => (
                    <option key={c.slug}>{c.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className={labelCls}>
                  Publish Date <span className="text-red-500">*</span>
                </label>
                <input
                  required
                  type="date"
                  value={form.date}
                  onChange={(e) => set('date', e.target.value)}
                  className={inputCls}
                />
              </div>
              <div>
                <label className={labelCls}>Read Time</label>
                <input
                  type="text"
                  value={form.readTime}
                  onChange={(e) => set('readTime', e.target.value)}
                  placeholder="5 min read"
                  className={inputCls}
                />
              </div>
            </div>
            {status === 'scheduled' && (
              <div>
                <label className={labelCls}>Schedule Date & Time</label>
                <input
                  type="datetime-local"
                  value={form.scheduledAt}
                  onChange={(e) => set('scheduledAt', e.target.value)}
                  className={inputCls}
                />
              </div>
            )}
            <div>
              <label className={labelCls}>Tags</label>
              <input
                type="text"
                value={form.tags}
                onChange={(e) => set('tags', e.target.value)}
                placeholder="AI, OpenAI, ChatGPT (comma-separated)"
                className={inputCls}
              />
            </div>
            <div className="flex items-center gap-6 pt-1">
              <label className="flex items-center gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.featured}
                  onChange={(e) => set('featured', e.target.checked)}
                  className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Featured article
                </span>
              </label>
              <label className="flex items-center gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.trending}
                  onChange={(e) => set('trending', e.target.checked)}
                  className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Mark as trending
                </span>
              </label>
            </div>
          </div>

          {/* Author */}
          <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-5 space-y-4">
            <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">Author</h3>
            <div className="grid lg:grid-cols-[1fr_280px] gap-4">
              <div>
                <label className={labelCls}>
                  Select Author <span className="text-red-500">*</span>
                </label>
                <select
                  required
                  value={form.authorSlug}
                  onChange={(e) => handleAuthorChange(e.target.value)}
                  className={inputCls}
                >
                  {authors.map((author) => (
                    <option key={author.slug} value={author.slug}>
                      {author.name}
                    </option>
                  ))}
                </select>
                <p className="mt-2 text-xs text-gray-400">
                  Manage names, bios, and profile photos from the Authors screen.
                </p>
                <Link
                  href="/admin/authors"
                  className="mt-2 inline-flex text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline"
                >
                  Manage authors
                </Link>
              </div>
              <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/60 p-3 flex gap-3">
                <img
                  src={form.authorAvatar || '/assets/images/app_logo.png'}
                  alt={form.author}
                  className="w-12 h-12 rounded-full object-cover border border-gray-200 dark:border-gray-700 flex-shrink-0"
                />
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                    {form.author}
                  </p>
                  <p className="text-xs text-gray-400 font-mono truncate">@{form.authorSlug}</p>
                  {form.authorBio && (
                    <p className="mt-1 text-xs text-gray-500 dark:text-gray-400 line-clamp-2">
                      {form.authorBio}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Cover Image */}
          <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                Cover Image
              </h3>
              <button
                type="button"
                onClick={() => openMediaPicker('cover')}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
              >
                <PhotoIcon className="w-3.5 h-3.5" />
                Pick from Media Library
              </button>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className={labelCls}>
                  Image URL <span className="text-red-500">*</span>
                </label>
                <input
                  required
                  type="url"
                  value={form.image}
                  onChange={(e) => set('image', e.target.value)}
                  placeholder="https://..."
                  className={inputCls}
                />
              </div>
              <div>
                <label className={labelCls}>
                  Alt Text <span className="text-red-500">*</span>
                </label>
                <input
                  required
                  type="text"
                  value={form.imageAlt}
                  onChange={(e) => set('imageAlt', e.target.value)}
                  placeholder="Descriptive text for accessibility"
                  className={inputCls}
                />
              </div>
            </div>
            <div>
              <label className={labelCls}>
                Caption <span className="text-xs text-gray-400 font-normal">(optional)</span>
              </label>
              <input
                type="text"
                value={form.imageCaption}
                onChange={(e) => set('imageCaption', e.target.value)}
                placeholder="Image caption shown below photo"
                className={inputCls}
              />
            </div>
            {form.image && (
              <div className="relative rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 h-44 bg-gray-100 dark:bg-gray-800">
                <img
                  src={form.image}
                  alt={form.imageAlt}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                  }}
                />
                <button
                  type="button"
                  onClick={() => set('image', '')}
                  className="absolute top-2 right-2 w-7 h-7 bg-black/50 hover:bg-black/70 rounded-full flex items-center justify-center text-white transition-colors"
                >
                  <span className="text-xs">âœ•</span>
                </button>
              </div>
            )}
          </div>

          {/* Content */}
          <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden">
            <div className="px-5 pt-4 pb-2 flex items-center justify-between border-b border-gray-200 dark:border-gray-800">
              <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                Article Content
              </h3>
            </div>
            <RichTextToolbar
              textareaRef={contentRef}
              value={form.content}
              onChange={(v) => set('content', v)}
              onOpenMedia={() => openMediaPicker('content')}
            />
            <textarea
              ref={contentRef}
              required
              rows={20}
              value={form.content}
              onChange={(e) => set('content', e.target.value)}
              placeholder={
                '<p>Start writing your article...</p>\n\n<h2>Section Heading</h2>\n<p>Your content goes here.</p>'
              }
              className="w-full px-4 py-3 text-sm bg-white dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none font-mono resize-y border-0 rounded-b-xl"
            />
          </div>

          {/* SEO Panel */}
          <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800">
            <button
              type="button"
              onClick={() => setSeoOpen(!seoOpen)}
              className="w-full flex items-center justify-between px-5 py-4 text-sm font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors rounded-xl"
            >
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-green-500" />
                SEO & Social
              </div>
              {seoOpen ? (
                <ChevronUpIcon className="w-4 h-4 text-gray-400" />
              ) : (
                <ChevronDownIcon className="w-4 h-4 text-gray-400" />
              )}
            </button>
            {seoOpen && (
              <div className="px-5 pb-5 space-y-4 border-t border-gray-200 dark:border-gray-800 pt-4">
                <div>
                  <label className={labelCls}>
                    Meta Title
                    <span className="ml-2 text-xs font-normal text-gray-400">
                      {form.metaTitle.length}/60 chars
                    </span>
                  </label>
                  <input
                    type="text"
                    value={form.metaTitle}
                    onChange={(e) => set('metaTitle', e.target.value)}
                    maxLength={60}
                    placeholder="SEO title (defaults to article title)"
                    className={inputCls}
                  />
                </div>
                <div>
                  <label className={labelCls}>
                    Meta Description
                    <span className="ml-2 text-xs font-normal text-gray-400">
                      {form.metaDescription.length}/160 chars
                    </span>
                  </label>
                  <textarea
                    rows={3}
                    value={form.metaDescription}
                    onChange={(e) => set('metaDescription', e.target.value)}
                    maxLength={160}
                    placeholder="Short description for search engines (defaults to excerpt)"
                    className={`${inputCls} resize-none`}
                  />
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className={labelCls}>OG / Social Image URL</label>
                    <div className="flex gap-2">
                      <input
                        type="url"
                        value={form.ogImage}
                        onChange={(e) => set('ogImage', e.target.value)}
                        placeholder="https://... (defaults to cover image)"
                        className={`${inputCls} flex-1`}
                      />
                      <button
                        type="button"
                        onClick={() => openMediaPicker('og')}
                        className="px-3 py-2.5 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:border-blue-400 transition-colors flex-shrink-0"
                      >
                        <PhotoIcon className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className={labelCls}>Canonical URL</label>
                    <input
                      type="url"
                      value={form.canonical}
                      onChange={(e) => set('canonical', e.target.value)}
                      placeholder="https://dailybytenews.in/article?slug=..."
                      className={inputCls}
                    />
                  </div>
                </div>
                {/* Preview */}
                {(form.metaTitle || form.title) && (
                  <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                      Google Preview
                    </p>
                    <p className="text-blue-700 dark:text-blue-400 text-sm font-medium line-clamp-1">
                      {form.metaTitle || form.title || 'Article Title'}
                    </p>
                    <p className="text-green-700 dark:text-green-500 text-xs mt-0.5">
                      dailybytenews.in â€º article
                    </p>
                    <p className="text-gray-600 dark:text-gray-400 text-xs mt-1 line-clamp-2">
                      {form.metaDescription || form.excerpt || 'Meta description will appear here.'}
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Bottom actions */}
          <div className="flex justify-between items-center pb-4">
            <Link
              href="/admin/articles"
              className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              â† Back to Articles
            </Link>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => {
                  setStatus('draft');
                }}
                className="px-5 py-2.5 text-sm font-medium text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                Save as Draft
              </button>
              <button
                type="submit"
                disabled={saving || saved}
                className="inline-flex items-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white text-sm font-semibold rounded-lg transition-colors"
              >
                {saved ? (
                  <>
                    <CheckIcon className="w-4 h-4" />
                    Saved!
                  </>
                ) : saving ? (
                  'Publishing...'
                ) : status === 'draft' ? (
                  'Save Draft'
                ) : status === 'scheduled' ? (
                  'Schedule Article'
                ) : (
                  'Publish Article'
                )}
              </button>
            </div>
          </div>
        </form>

        {/* Notify Subscribers Section */}
        {publishedArticle && (
          <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-800">
            <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl p-5 mb-5">
              <div className="flex items-start gap-3">
                <CheckIcon className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-green-900 dark:text-green-200">
                    Article published successfully!
                  </h3>
                  <p className="text-sm text-green-700 dark:text-green-300 mt-1">
                    Now notify your subscribers about this new article.
                  </p>
                </div>
              </div>
            </div>

            <NotifySubscribersForm
              articleTitle={publishedArticle.title}
              articleSlug={publishedArticle.slug}
              onNotified={() => {
                setTimeout(() => {
                  router.push('/admin/articles');
                  router.refresh();
                }, 1000);
              }}
            />
          </div>
        )}
      </div>
    </>
  );
}
