'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import {
  DEFAULT_CATEGORIES,
  categoryColorStyles,
  normalizeCategory,
  type AdminCategory,
  type AdminCategoryColor,
} from '@/lib/admin-taxonomy';
import { slugify } from '@/lib/article-shared';
import {
  CheckIcon,
  PencilSquareIcon,
  PlusIcon,
  TagIcon,
  TrashIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';

type CategoryForm = Omit<AdminCategory, 'id' | 'created_at' | 'updated_at'> & { id?: string };

const emptyForm: CategoryForm = {
  name: '',
  slug: '',
  description: '',
  color: 'blue',
  status: 'active',
};

const inputCls =
  'w-full px-3 py-2.5 text-sm border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition';
const labelCls = 'block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5';
const colors: AdminCategoryColor[] = ['blue', 'green', 'amber', 'red'];

interface CategoryStats {
  count: number;
  trending: number;
}

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<AdminCategory[]>([]);
  const [stats, setStats] = useState<Map<string, CategoryStats>>(new Map());
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [schemaWarning, setSchemaWarning] = useState('');
  const [editing, setEditing] = useState<CategoryForm | null>(null);

  async function loadCategories() {
    setLoading(true);
    setError('');
    setSchemaWarning('');

    const supabase = createClient();
    const [{ data: categoryRows, error: categoryError }, { data: articleRows }] = await Promise.all(
      [
        supabase.from('article_categories').select('*').order('name'),
        supabase.from('articles').select('category_slug, trending'),
      ]
    );

    const nextStats = new Map<string, CategoryStats>();
    for (const article of articleRows ?? []) {
      const slug = article.category_slug;
      const existing = nextStats.get(slug) ?? { count: 0, trending: 0 };
      existing.count += 1;
      if (article.trending) existing.trending += 1;
      nextStats.set(slug, existing);
    }
    setStats(nextStats);

    if (categoryError) {
      setCategories(DEFAULT_CATEGORIES);
      setSchemaWarning(
        'Category table is not ready yet. Run the updated Supabase schema to enable create/edit/delete.'
      );
    } else {
      const rows = ((categoryRows ?? []) as AdminCategory[]).map(normalizeCategory);
      setCategories(rows.length > 0 ? rows : DEFAULT_CATEGORIES);
    }

    setLoading(false);
  }

  useEffect(() => {
    loadCategories();
  }, []);

  const total = useMemo(
    () => Array.from(stats.values()).reduce((sum, item) => sum + item.count, 0),
    [stats]
  );

  const sorted = useMemo(
    () =>
      [...categories].sort((a, b) => {
        const aCount = stats.get(a.slug)?.count ?? 0;
        const bCount = stats.get(b.slug)?.count ?? 0;
        return bCount - aCount || a.name.localeCompare(b.name);
      }),
    [categories, stats]
  );

  const openEdit = (category: AdminCategory) =>
    setEditing({
      id: category.id,
      name: category.name,
      slug: category.slug,
      description: category.description,
      color: category.color,
      status: category.status,
    });

  const setForm = (field: keyof CategoryForm, value: string) => {
    setEditing((prev) => {
      if (!prev) return prev;
      const next = { ...prev, [field]: value };
      if (field === 'name' && (!prev.slug || prev.slug === slugify(prev.name))) {
        next.slug = slugify(value);
      }
      if (field === 'slug') next.slug = slugify(value);
      return next;
    });
  };

  const saveCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editing) return;

    setSaving(true);
    setError('');
    const supabase = createClient();
    const normalized = normalizeCategory({
      ...editing,
      slug: editing.slug || slugify(editing.name),
    });
    const payload = {
      name: normalized.name,
      slug: normalized.slug,
      description: normalized.description,
      color: normalized.color,
      status: normalized.status,
    };

    const result = editing.id
      ? await supabase.from('article_categories').update(payload).eq('id', editing.id)
      : await supabase.from('article_categories').insert(payload);

    setSaving(false);

    if (result.error) {
      setError(result.error.message);
      return;
    }

    setEditing(null);
    await loadCategories();
  };

  const deleteCategory = async (category: AdminCategory) => {
    const usage = stats.get(category.slug)?.count ?? 0;
    const action = usage > 0 ? 'deactivate' : 'delete';
    if (!confirm(`${action === 'delete' ? 'Delete' : 'Deactivate'} ${category.name}?`)) return;

    setError('');
    const supabase = createClient();
    const result =
      usage > 0
        ? await supabase
            .from('article_categories')
            .update({ status: 'inactive' })
            .eq('id', category.id)
        : await supabase.from('article_categories').delete().eq('id', category.id);

    if (result.error) {
      setError(result.error.message);
      return;
    }

    await loadCategories();
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Categories</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
            {loading
              ? 'Loading categories...'
              : `${categories.length} categories - ${total} total articles`}
          </p>
        </div>
        <button
          type="button"
          onClick={() => setEditing(emptyForm)}
          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg transition-colors"
        >
          <PlusIcon className="w-4 h-4" />
          New Category
        </button>
      </div>

      {(error || schemaWarning) && (
        <div className="rounded-xl border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-900/20 px-4 py-3 text-sm text-amber-700 dark:text-amber-300">
          {error || schemaWarning}
        </div>
      )}

      {editing && (
        <form
          onSubmit={saveCategory}
          className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-5 space-y-4"
        >
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
              {editing.id ? 'Edit Category' : 'Create Category'}
            </h3>
            <button
              type="button"
              onClick={() => setEditing(null)}
              className="p-1.5 text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              <XMarkIcon className="w-4 h-4" />
            </button>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>Name *</label>
              <input
                required
                value={editing.name}
                onChange={(e) => setForm('name', e.target.value)}
                className={inputCls}
                placeholder="Category name"
              />
            </div>
            <div>
              <label className={labelCls}>Slug *</label>
              <input
                required
                value={editing.slug}
                onChange={(e) => setForm('slug', e.target.value)}
                className={`${inputCls} font-mono`}
                placeholder="category-slug"
              />
            </div>
          </div>

          <div>
            <label className={labelCls}>Description</label>
            <textarea
              rows={3}
              value={editing.description}
              onChange={(e) => setForm('description', e.target.value)}
              className={`${inputCls} resize-none`}
              placeholder="Shown on the public category page"
            />
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>Color</label>
              <div className="flex flex-wrap gap-2">
                {colors.map((color) => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => setForm('color', color)}
                    className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg border text-sm font-medium capitalize transition-colors ${
                      editing.color === color
                        ? 'border-blue-500 bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300'
                        : 'border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800'
                    }`}
                  >
                    <span
                      className={`w-2.5 h-2.5 rounded-full ${categoryColorStyles[color].dot}`}
                    />
                    {color}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className={labelCls}>Status</label>
              <select
                value={editing.status}
                onChange={(e) => setForm('status', e.target.value)}
                className={inputCls}
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={() => setEditing(null)}
              className="px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center gap-2 px-5 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white text-sm font-semibold rounded-lg"
            >
              <CheckIcon className="w-4 h-4" />
              {saving ? 'Saving...' : 'Save Category'}
            </button>
          </div>
        </form>
      )}

      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
        {sorted.map((cat) => {
          const style = categoryColorStyles[cat.color] || categoryColorStyles.blue;
          const stat = stats.get(cat.slug) ?? { count: 0, trending: 0 };
          return (
            <Link
              key={cat.id}
              href={`/category?cat=${cat.slug}`}
              target="_blank"
              className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-4 hover:border-blue-300 dark:hover:border-blue-700 transition-colors group"
            >
              <span
                className={`inline-flex px-2 py-0.5 rounded text-xs font-semibold mb-3 ${style.badge}`}
              >
                {cat.name}
              </span>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stat.count}</p>
              <p className="text-xs text-gray-400 mt-0.5">articles</p>
              {cat.status === 'inactive' && (
                <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">inactive</p>
              )}
              {stat.trending > 0 && (
                <p className="text-xs text-amber-600 dark:text-amber-400 mt-1">
                  {stat.trending} trending
                </p>
              )}
            </Link>
          );
        })}
      </div>

      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
            Category Breakdown
          </h3>
          <span className="text-xs text-gray-400">{total} articles</span>
        </div>
        <div className="divide-y divide-gray-100 dark:divide-gray-800">
          {sorted.map((cat) => {
            const style = categoryColorStyles[cat.color] || categoryColorStyles.blue;
            const stat = stats.get(cat.slug) ?? { count: 0, trending: 0 };
            const pct = total > 0 ? Math.round((stat.count / total) * 100) : 0;
            return (
              <div key={cat.id} className="px-5 py-4 flex items-center gap-4">
                <div className="flex items-center gap-3 w-52 flex-shrink-0 min-w-0">
                  <div className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${style.bar}`} />
                  <div className="min-w-0">
                    <span className="text-sm font-medium text-gray-900 dark:text-white truncate block">
                      {cat.name}
                    </span>
                    <span className="text-xs text-gray-400 font-mono">@{cat.slug}</span>
                  </div>
                </div>
                <div className="flex-1 min-w-[120px] hidden sm:block">
                  <div className="flex items-center gap-3">
                    <div className="flex-1 bg-gray-100 dark:bg-gray-800 rounded-full h-1.5">
                      <div
                        className={`${style.bar} h-1.5 rounded-full transition-all`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <span className="text-xs text-gray-500 dark:text-gray-400 w-8 text-right">
                      {pct}%
                    </span>
                  </div>
                </div>
                <div className="text-right flex-shrink-0 w-24">
                  <span className="text-sm font-semibold text-gray-900 dark:text-white">
                    {stat.count}
                  </span>
                  <span className="text-xs text-gray-400 ml-1">articles</span>
                </div>
                <div className="flex items-center gap-1 flex-shrink-0">
                  <button
                    type="button"
                    onClick={() => openEdit(cat)}
                    className="p-1.5 text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 rounded-md hover:bg-indigo-50 dark:hover:bg-indigo-900/20"
                    title="Edit category"
                  >
                    <PencilSquareIcon className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => deleteCategory(cat)}
                    className="p-1.5 text-gray-400 hover:text-red-600 dark:hover:text-red-400 rounded-md hover:bg-red-50 dark:hover:bg-red-900/20"
                    title="Delete or deactivate"
                  >
                    <TrashIcon className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {!loading && sorted.length === 0 && (
        <div className="py-16 text-center bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800">
          <TagIcon className="w-12 h-12 text-gray-300 dark:text-gray-700 mx-auto mb-3" />
          <p className="text-sm text-gray-500 dark:text-gray-400">Create your first category.</p>
        </div>
      )}
    </div>
  );
}
