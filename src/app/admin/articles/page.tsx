'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import type { Article } from '@/lib/articles';
import { rowToArticle, type ArticleRow } from '@/lib/article-shared';
import { createClient } from '@/lib/supabase/client';
import {
  PlusIcon,
  MagnifyingGlassIcon,
  PencilSquareIcon,
  TrashIcon,
  FireIcon,
  StarIcon,
  EyeIcon,
} from '@heroicons/react/24/outline';

const categoryColors: Record<string, string> = {
  'AI & Tech': 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  'Business & Markets': 'bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  Trending: 'bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
  Explainers: 'bg-purple-50 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
  Opinion: 'bg-rose-50 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400',
};

export default function AdminArticlesPage() {
  const [articleList, setArticleList] = useState<Article[]>([]);
  const [search, setSearch] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');

  useEffect(() => {
    let mounted = true;

    async function loadArticles() {
      const supabase = createClient();
      const { data, error } = await supabase
        .from('articles')
        .select('*')
        .order('published_at', { ascending: false });

      if (!mounted) return;

      if (error) {
        setLoadError(error.message);
      } else {
        setArticleList((data ?? []).map((row) => rowToArticle(row as ArticleRow)));
        setLoadError('');
      }

      setLoading(false);
    }

    loadArticles();

    return () => {
      mounted = false;
    };
  }, []);

  const categories = ['all', ...Array.from(new Set(articleList.map((a) => a.category)))];

  const filtered = articleList.filter((a) => {
    const matchSearch =
      a.title.toLowerCase().includes(search.toLowerCase()) ||
      a.author.toLowerCase().includes(search.toLowerCase());
    const matchCat = filterCategory === 'all' || a.category === filterCategory;
    return matchSearch && matchCat;
  });

  const handleDelete = async (id: string, title: string) => {
    if (confirm(`Delete "${title}"? This cannot be undone.`)) {
      setDeletingId(id);
      const supabase = createClient();
      const { error } = await supabase.from('articles').delete().eq('id', id);

      if (error) {
        setLoadError(error.message);
      } else {
        setArticleList((prev) => prev.filter((article) => article.id !== id));
      }

      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Articles</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
            {loading ? 'Loading articles...' : `${articleList.length} total articles`}
          </p>
        </div>
        <Link
          href="/admin/articles/new"
          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg transition-colors"
        >
          <PlusIcon className="w-4 h-4" />
          New Article
        </Link>
      </div>

      {loadError && (
        <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl px-4 py-3 text-sm text-amber-700 dark:text-amber-300">
          Supabase articles table is not ready yet: {loadError}
        </div>
      )}

      {/* Filters */}
      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-4 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search articles or authors..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          className="px-3 py-2 text-sm border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat === 'all' ? 'All Categories' : cat}
            </option>
          ))}
        </select>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden">
        {filtered.length === 0 ? (
          <div className="py-16 text-center text-sm text-gray-500 dark:text-gray-400">
            No articles match your search.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50">
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Title
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider hidden md:table-cell">
                    Category
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider hidden lg:table-cell">
                    Author
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider hidden lg:table-cell">
                    Date
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="text-right px-5 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                {filtered.map((article) => (
                  <tr
                    key={article.id}
                    className={`hover:bg-gray-50 dark:hover:bg-gray-800/40 transition-colors ${deletingId === article.id ? 'opacity-40' : ''}`}
                  >
                    <td className="px-5 py-4 max-w-xs">
                      <p className="font-medium text-gray-900 dark:text-white line-clamp-2 leading-snug">
                        {article.title}
                      </p>
                      <p className="text-xs text-gray-400 mt-0.5 hidden sm:block">
                        {article.readTime}
                      </p>
                    </td>
                    <td className="px-4 py-4 hidden md:table-cell">
                      <span
                        className={`inline-flex px-2 py-0.5 rounded text-xs font-medium ${categoryColors[article.category] || 'bg-gray-100 text-gray-600'}`}
                      >
                        {article.category}
                      </span>
                    </td>
                    <td className="px-4 py-4 hidden lg:table-cell">
                      <span className="text-gray-600 dark:text-gray-400 text-sm">
                        {article.author}
                      </span>
                    </td>
                    <td className="px-4 py-4 hidden lg:table-cell">
                      <span className="text-gray-500 dark:text-gray-400 text-xs">
                        {article.date}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-1.5">
                        {article.trending && (
                          <span className="inline-flex items-center gap-1 text-xs bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 px-1.5 py-0.5 rounded font-medium">
                            <FireIcon className="w-3 h-3" />
                            Hot
                          </span>
                        )}
                        {article.featured && (
                          <span className="inline-flex items-center gap-1 text-xs bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 px-1.5 py-0.5 rounded font-medium">
                            <StarIcon className="w-3 h-3" />
                            Featured
                          </span>
                        )}
                        {!article.trending && !article.featured && (
                          <span className="text-xs text-gray-400">Published</span>
                        )}
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center justify-end gap-1">
                        <a
                          href={`/article?slug=${article.slug}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1.5 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 rounded-md hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
                          title="View article"
                        >
                          <EyeIcon className="w-4 h-4" />
                        </a>
                        <Link
                          href={`/admin/articles/${article.id}/edit`}
                          className="p-1.5 text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 rounded-md hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-colors"
                          title="Edit article"
                        >
                          <PencilSquareIcon className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => handleDelete(article.id, article.title)}
                          className="p-1.5 text-gray-400 hover:text-red-600 dark:hover:text-red-400 rounded-md hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                          title="Delete article"
                        >
                          <TrashIcon className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
