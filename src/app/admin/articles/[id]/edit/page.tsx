'use client';

import { useEffect, useRef, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeftIcon,
  CheckIcon,
  PhotoIcon,
  ChevronDownIcon,
  ChevronUpIcon,
} from '@heroicons/react/24/outline';
import { createClient } from '@/lib/supabase/client';
import { slugify, type ArticleRow, type ArticleStatus } from '@/lib/article-shared';
import MediaPicker from '@/components/admin/MediaPicker';
import RichTextToolbar from '@/components/admin/RichTextToolbar';

const CATEGORIES = [
  { label: 'AI & Tech', slug: 'ai-tech', color: 'blue' },
  { label: 'Business & Markets', slug: 'business', color: 'green' },
  { label: 'Trending', slug: 'trending', color: 'amber' },
  { label: 'Explainers', slug: 'explainers', color: 'blue' },
  { label: 'Opinion', slug: 'opinion', color: 'amber' },
];

const inputCls =
  'w-full px-3 py-2.5 text-sm border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition';
const labelCls = 'block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5';

export default function EditArticlePage() {
  const router = useRouter();
  const params = useParams();
  const articleId = Array.isArray(params.id) ? params.id[0] : params.id;
  const contentRef = useRef<HTMLTextAreaElement>(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');
  const [notFound, setNotFound] = useState(false);
  const [status, setStatus] = useState<ArticleStatus>('published');
  const [showMediaPicker, setShowMediaPicker] = useState(false);
  const [mediaTarget, setMediaTarget] = useState<'cover' | 'content' | 'author' | 'og'>('cover');
  const [seoOpen, setSeoOpen] = useState(false);

  const [form, setForm] = useState({
    title: '',
    slug: '',
    excerpt: '',
    category: 'AI & Tech',
    categorySlug: 'ai-tech',
    categoryColor: 'blue',
    author: '',
    authorBio: '',
    authorAvatar: '',
    date: '',
    scheduledAt: '',
    readTime: '5 min read',
    image: '',
    imageAlt: '',
    imageCaption: '',
    tags: '',
    featured: false,
    trending: false,
    content: '',
    metaTitle: '',
    metaDescription: '',
    ogImage: '',
    canonical: '',
  });

  useEffect(() => {
    let mounted = true;

    async function loadArticle() {
      if (!articleId) return;

      const supabase = createClient();
      const { data, error } = await supabase
        .from('articles')
        .select('*')
        .eq('id', articleId)
        .maybeSingle();

      if (!mounted) return;

      if (error) {
        setError(error.message);
        setNotFound(true);
      } else if (!data) {
        setNotFound(true);
      } else {
        const article = data as ArticleRow;
        setStatus(article.status);
        setForm({
          title: article.title,
          slug: article.slug,
          excerpt: article.excerpt,
          category: article.category,
          categorySlug: article.category_slug,
          categoryColor: article.category_color,
          author: article.author,
          authorBio: article.author_bio,
          authorAvatar: article.author_avatar,
          date: article.published_at,
          scheduledAt: article.scheduled_at ? article.scheduled_at.slice(0, 16) : '',
          readTime: article.read_time,
          image: article.image,
          imageAlt: article.image_alt,
          imageCaption: article.image_caption ?? '',
          tags: article.tags?.join(', ') ?? '',
          featured: article.featured,
          trending: article.trending,
          content: article.content,
          metaTitle: article.meta_title ?? '',
          metaDescription: article.meta_description ?? '',
          ogImage: article.og_image ?? '',
          canonical: article.canonical ?? '',
        });
      }

      setLoading(false);
    }

    loadArticle();
    return () => { mounted = false; };
  }, [articleId]);

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
    setForm((prev) => ({
      ...prev,
      category: cat.label,
      categorySlug: cat.slug,
      categoryColor: cat.color,
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
      // Insert image tag into content at cursor position
      const tag = `<img src="${url}" alt="" class="w-full rounded-lg my-4" />`;
      const el = contentRef.current;
      if (el) {
        const pos = el.selectionStart;
        const newVal = form.content.slice(0, pos) + '\n' + tag + '\n' + form.content.slice(pos);
        set('content', newVal);
      } else {
        set('content', form.content + '\n' + tag);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSaving(true);

    const supabase = createClient();
    const { error } = await supabase
      .from('articles')
      .update({
        slug: form.slug || slugify(form.title),
        title: form.title,
        excerpt: form.excerpt,
        category: form.category,
        category_slug: form.categorySlug,
        category_color: form.categoryColor,
        author: form.author || 'DailyByteNews',
        author_slug: slugify(form.author || 'dailybytenews'),
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
        tags: form.tags.split(',').map((t) => t.trim()).filter(Boolean),
        featured: form.featured,
        trending: form.trending,
        status,
        content: form.content,
        meta_title: form.metaTitle || null,
        meta_description: form.metaDescription || null,
        og_image: form.ogImage || null,
        canonical: form.canonical || null,
      })
      .eq('id', articleId);

    setSaving(false);

    if (error) {
      setError(error.message);
      return;
    }

    setSaved(true);
    router.push('/admin/articles');
    router.refresh();
  };

  if (loading) {
    return (
      <div className="py-20 text-center">
        <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p className="text-sm text-gray-500 dark:text-gray-400">Loading article...</p>
      </div>
    );
  }

  if (notFound) {
    return (
      <div className="text-center py-20">
        <p className="text-gray-500 dark:text-gray-400 mb-4">{error || 'Article not found.'}</p>
        <Link href="/admin/articles" className="text-blue-600 dark:text-blue-400 hover:underline text-sm font-medium">
          ← Back to Articles
        </Link>
      </div>
    );
  }

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
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Edit Article</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-1">{form.title}</p>
          </div>
          <div className="ml-auto flex items-center gap-3">
            {/* Status selector */}
            <div className="flex items-center rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
              {(['draft', 'published', 'scheduled'] as ArticleStatus[]).map((s) => (
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
              form="edit-form"
              type="submit"
              disabled={saving || saved}
              className="inline-flex items-center gap-2 px-5 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white text-sm font-semibold rounded-lg transition-colors"
            >
              {saved ? (
                <><CheckIcon className="w-4 h-4" />Saved!</>
              ) : saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>

        {error && (
          <div className="mb-5 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl px-4 py-3 text-sm text-red-600 dark:text-red-400">
            {error}
          </div>
        )}

        <form id="edit-form" onSubmit={handleSubmit} className="space-y-5">

          {/* Basic Info */}
          <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-5 space-y-4">
            <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">Basic Info</h3>
            <div>
              <label className={labelCls}>Title <span className="text-red-500">*</span></label>
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
              <label className={labelCls}>Slug <span className="text-red-500">*</span></label>
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
              <label className={labelCls}>Excerpt <span className="text-red-500">*</span></label>
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
            <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">Classification</h3>
            <div className="grid sm:grid-cols-3 gap-4">
              <div>
                <label className={labelCls}>Category <span className="text-red-500">*</span></label>
                <select
                  value={form.category}
                  onChange={(e) => handleCategoryChange(e.target.value)}
                  className={inputCls}
                >
                  {CATEGORIES.map((c) => (
                    <option key={c.slug}>{c.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className={labelCls}>Publish Date <span className="text-red-500">*</span></label>
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
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Featured article</span>
              </label>
              <label className="flex items-center gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.trending}
                  onChange={(e) => set('trending', e.target.checked)}
                  className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Mark as trending</span>
              </label>
            </div>
          </div>

          {/* Author */}
          <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-5 space-y-4">
            <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">Author</h3>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className={labelCls}>Author Name <span className="text-red-500">*</span></label>
                <input
                  required
                  type="text"
                  value={form.author}
                  onChange={(e) => set('author', e.target.value)}
                  className={inputCls}
                />
              </div>
              <div>
                <label className={labelCls}>Avatar URL</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={form.authorAvatar}
                    onChange={(e) => set('authorAvatar', e.target.value)}
                    placeholder="https://... or pick from library"
                    className={`${inputCls} flex-1`}
                  />
                  <button
                    type="button"
                    onClick={() => openMediaPicker('author')}
                    title="Pick from Media Library"
                    className="px-3 py-2.5 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:border-blue-400 transition-colors flex-shrink-0"
                  >
                    <PhotoIcon className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
            <div>
              <label className={labelCls}>Author Bio</label>
              <textarea
                rows={2}
                value={form.authorBio}
                onChange={(e) => set('authorBio', e.target.value)}
                className={`${inputCls} resize-none`}
              />
            </div>
          </div>

          {/* Cover Image */}
          <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">Cover Image</h3>
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
                <label className={labelCls}>Image URL <span className="text-red-500">*</span></label>
                <input
                  required
                  type="url"
                  value={form.image}
                  onChange={(e) => set('image', e.target.value)}
                  placeholder="https://... or pick from library above"
                  className={inputCls}
                />
              </div>
              <div>
                <label className={labelCls}>Alt Text <span className="text-red-500">*</span></label>
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
              <label className={labelCls}>Caption <span className="text-xs text-gray-400 font-normal">(optional)</span></label>
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
                  onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                />
                <button
                  type="button"
                  onClick={() => set('image', '')}
                  className="absolute top-2 right-2 w-7 h-7 bg-black/50 hover:bg-black/70 rounded-full flex items-center justify-center text-white transition-colors"
                >
                  <span className="text-xs">✕</span>
                </button>
              </div>
            )}
          </div>

          {/* Article Content */}
          <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden">
            <div className="px-5 pt-4 pb-2 flex items-center justify-between border-b border-gray-200 dark:border-gray-800">
              <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">Article Content</h3>
              <button
                type="button"
                onClick={() => openMediaPicker('content')}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
              >
                <PhotoIcon className="w-3.5 h-3.5" />
                Insert Image
              </button>
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
              placeholder={'<p>Start writing your article...</p>\n\n<h2>Section Heading</h2>\n<p>Your content goes here.</p>'}
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
              {seoOpen
                ? <ChevronUpIcon className="w-4 h-4 text-gray-400" />
                : <ChevronDownIcon className="w-4 h-4 text-gray-400" />
              }
            </button>
            {seoOpen && (
              <div className="px-5 pb-5 space-y-4 border-t border-gray-200 dark:border-gray-800 pt-4">
                <div>
                  <label className={labelCls}>
                    Meta Title
                    <span className="ml-2 text-xs font-normal text-gray-400">{form.metaTitle.length}/60 chars</span>
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
                    <span className="ml-2 text-xs font-normal text-gray-400">{form.metaDescription.length}/160 chars</span>
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
                {(form.metaTitle || form.title) && (
                  <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Google Preview</p>
                    <p className="text-blue-700 dark:text-blue-400 text-sm font-medium line-clamp-1">
                      {form.metaTitle || form.title}
                    </p>
                    <p className="text-green-700 dark:text-green-500 text-xs mt-0.5">dailybytenews.in › article</p>
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
              ← Back to Articles
            </Link>
            <button
              type="submit"
              disabled={saving || saved}
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white text-sm font-semibold rounded-lg transition-colors"
            >
              {saved ? (
                <><CheckIcon className="w-4 h-4" />Saved!</>
              ) : saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
