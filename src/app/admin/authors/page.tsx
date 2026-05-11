'use client';

import { useEffect, useMemo, useState } from 'react';
import MediaPicker from '@/components/admin/MediaPicker';
import { createClient } from '@/lib/supabase/client';
import { DEFAULT_AUTHOR, normalizeAuthor, type AuthorProfile } from '@/lib/admin-taxonomy';
import { slugify } from '@/lib/article-shared';
import {
  CheckIcon,
  PencilSquareIcon,
  PhotoIcon,
  PlusIcon,
  TrashIcon,
  UserGroupIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';

type AuthorForm = Omit<AuthorProfile, 'id' | 'created_at' | 'updated_at'> & { id?: string };

interface AuthorStats {
  count: number;
  categories: Set<string>;
  latest: string;
}

const emptyForm: AuthorForm = {
  name: '',
  slug: '',
  bio: '',
  avatar_url: '/assets/images/app_logo.png',
  role: '',
  email: '',
  status: 'active',
};

const inputCls =
  'w-full px-3 py-2.5 text-sm border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition';
const labelCls = 'block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5';

export default function AdminAuthorsPage() {
  const [authors, setAuthors] = useState<AuthorProfile[]>([]);
  const [stats, setStats] = useState<Map<string, AuthorStats>>(new Map());
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [schemaWarning, setSchemaWarning] = useState('');
  const [editing, setEditing] = useState<AuthorForm | null>(null);
  const [showMediaPicker, setShowMediaPicker] = useState(false);

  async function loadAuthors() {
    setLoading(true);
    setError('');
    setSchemaWarning('');

    const supabase = createClient();
    const [{ data: authorRows, error: authorError }, { data: articleRows }] = await Promise.all([
      supabase.from('authors').select('*').order('name'),
      supabase
        .from('articles')
        .select('author, author_slug, author_avatar, author_bio, category, published_at')
        .order('published_at', { ascending: false }),
    ]);

    const nextStats = new Map<string, AuthorStats>();
    for (const row of articleRows ?? []) {
      const slug = row.author_slug || slugify(row.author || DEFAULT_AUTHOR.name);
      const existing = nextStats.get(slug) ?? {
        count: 0,
        categories: new Set<string>(),
        latest: '',
      };
      existing.count += 1;
      if (row.category) existing.categories.add(row.category);
      if (!existing.latest || row.published_at > existing.latest)
        existing.latest = row.published_at;
      nextStats.set(slug, existing);
    }
    setStats(nextStats);

    if (authorError) {
      const derived =
        articleRows?.map((row) =>
          normalizeAuthor({
            id: row.author_slug || slugify(row.author || DEFAULT_AUTHOR.name),
            name: row.author || DEFAULT_AUTHOR.name,
            slug: row.author_slug || slugify(row.author || DEFAULT_AUTHOR.name),
            avatar_url: row.author_avatar || '/assets/images/app_logo.png',
            bio: row.author_bio || '',
            role: 'Contributor',
            status: 'active',
          })
        ) ?? [];
      const unique = Array.from(
        new Map([DEFAULT_AUTHOR, ...derived].map((a) => [a.slug, a])).values()
      );
      setAuthors(unique);
      setSchemaWarning(
        'Author profile table is not ready yet. Run the updated Supabase schema to enable create/edit/delete.'
      );
    } else {
      const rows = ((authorRows ?? []) as AuthorProfile[]).map(normalizeAuthor);
      setAuthors(rows.length > 0 ? rows : [DEFAULT_AUTHOR]);
    }

    setLoading(false);
  }

  useEffect(() => {
    loadAuthors();
  }, []);

  const sortedAuthors = useMemo(
    () =>
      [...authors].sort((a, b) => {
        const aCount = stats.get(a.slug)?.count ?? 0;
        const bCount = stats.get(b.slug)?.count ?? 0;
        return bCount - aCount || a.name.localeCompare(b.name);
      }),
    [authors, stats]
  );

  const openCreate = () => setEditing(emptyForm);

  const openEdit = (author: AuthorProfile) =>
    setEditing({
      id: author.id,
      name: author.name,
      slug: author.slug,
      bio: author.bio,
      avatar_url: author.avatar_url,
      role: author.role ?? '',
      email: author.email ?? '',
      status: author.status,
    });

  const setForm = (field: keyof AuthorForm, value: string) => {
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

  const saveAuthor = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editing) return;

    setSaving(true);
    setError('');
    const supabase = createClient();
    const normalized = normalizeAuthor({
      ...editing,
      slug: editing.slug || slugify(editing.name),
    });
    const payload = {
      name: normalized.name,
      slug: normalized.slug,
      bio: normalized.bio,
      avatar_url: normalized.avatar_url,
      role: normalized.role,
      email: normalized.email,
      status: normalized.status,
    };

    const result = editing.id
      ? await supabase.from('authors').update(payload).eq('id', editing.id)
      : await supabase.from('authors').insert(payload);

    setSaving(false);

    if (result.error) {
      setError(result.error.message);
      return;
    }

    setEditing(null);
    await loadAuthors();
  };

  const deleteAuthor = async (author: AuthorProfile) => {
    const usage = stats.get(author.slug)?.count ?? 0;
    const action = usage > 0 ? 'deactivate' : 'delete';
    if (!confirm(`${action === 'delete' ? 'Delete' : 'Deactivate'} ${author.name}?`)) return;

    setError('');
    const supabase = createClient();
    const result =
      usage > 0
        ? await supabase.from('authors').update({ status: 'inactive' }).eq('id', author.id)
        : await supabase.from('authors').delete().eq('id', author.id);

    if (result.error) {
      setError(result.error.message);
      return;
    }

    await loadAuthors();
  };

  return (
    <>
      {showMediaPicker && editing && (
        <MediaPicker
          onSelect={(url) => {
            setForm('avatar_url', url);
            setShowMediaPicker(false);
          }}
          onClose={() => setShowMediaPicker(false)}
        />
      )}

      <div className="space-y-5">
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Authors</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
              {loading ? 'Loading profiles...' : `${authors.length} profiles`}
            </p>
          </div>
          <button
            type="button"
            onClick={openCreate}
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg transition-colors"
          >
            <PlusIcon className="w-4 h-4" />
            New Author
          </button>
        </div>

        {(error || schemaWarning) && (
          <div className="rounded-xl border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-900/20 px-4 py-3 text-sm text-amber-700 dark:text-amber-300">
            {error || schemaWarning}
          </div>
        )}

        {editing && (
          <form
            onSubmit={saveAuthor}
            className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-5 space-y-4"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                {editing.id ? 'Edit Author Profile' : 'Create Author Profile'}
              </h3>
              <button
                type="button"
                onClick={() => setEditing(null)}
                className="p-1.5 text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                <XMarkIcon className="w-4 h-4" />
              </button>
            </div>

            <div className="grid lg:grid-cols-[120px_1fr] gap-5">
              <div>
                <div className="w-24 h-24 rounded-full border border-gray-200 dark:border-gray-700 overflow-hidden bg-gray-50 dark:bg-gray-800">
                  <img
                    src={editing.avatar_url || '/assets/images/app_logo.png'}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => setShowMediaPicker(true)}
                  className="mt-3 inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20"
                >
                  <PhotoIcon className="w-3.5 h-3.5" />
                  Pick Photo
                </button>
              </div>

              <div className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className={labelCls}>Name *</label>
                    <input
                      required
                      value={editing.name}
                      onChange={(e) => setForm('name', e.target.value)}
                      className={inputCls}
                      placeholder="Author name"
                    />
                  </div>
                  <div>
                    <label className={labelCls}>Slug *</label>
                    <input
                      required
                      value={editing.slug}
                      onChange={(e) => setForm('slug', e.target.value)}
                      className={`${inputCls} font-mono`}
                      placeholder="author-slug"
                    />
                  </div>
                </div>
                <div className="grid sm:grid-cols-3 gap-4">
                  <div>
                    <label className={labelCls}>Role</label>
                    <input
                      value={editing.role ?? ''}
                      onChange={(e) => setForm('role', e.target.value)}
                      className={inputCls}
                      placeholder="Editor, Reporter"
                    />
                  </div>
                  <div>
                    <label className={labelCls}>Email</label>
                    <input
                      type="email"
                      value={editing.email ?? ''}
                      onChange={(e) => setForm('email', e.target.value)}
                      className={inputCls}
                      placeholder="name@example.com"
                    />
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
                <div>
                  <label className={labelCls}>Avatar URL</label>
                  <input
                    value={editing.avatar_url}
                    onChange={(e) => setForm('avatar_url', e.target.value)}
                    className={inputCls}
                    placeholder="https://... or /assets/images/app_logo.png"
                  />
                </div>
                <div>
                  <label className={labelCls}>Bio</label>
                  <textarea
                    rows={3}
                    value={editing.bio}
                    onChange={(e) => setForm('bio', e.target.value)}
                    className={`${inputCls} resize-none`}
                    placeholder="Short profile shown with articles"
                  />
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
                    {saving ? 'Saving...' : 'Save Author'}
                  </button>
                </div>
              </div>
            </div>
          </form>
        )}

        <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {sortedAuthors.map((author) => {
            const authorStats = stats.get(author.slug);
            const categoryList = Array.from(authorStats?.categories ?? []);

            return (
              <div
                key={author.id}
                className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-5"
              >
                <div className="flex items-start gap-3 mb-3">
                  <img
                    src={author.avatar_url || '/assets/images/app_logo.png'}
                    alt={author.name}
                    className="w-12 h-12 rounded-full object-cover flex-shrink-0 border border-gray-200 dark:border-gray-700"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-semibold text-gray-900 dark:text-white text-sm truncate">
                        {author.name}
                      </p>
                      {author.status === 'inactive' && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-gray-500">
                          inactive
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-400 mt-0.5 truncate">@{author.slug}</p>
                    {author.role && (
                      <p className="text-xs text-blue-600 dark:text-blue-400 mt-0.5 truncate">
                        {author.role}
                      </p>
                    )}
                  </div>
                </div>

                {author.bio && (
                  <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed line-clamp-3 mb-3">
                    {author.bio}
                  </p>
                )}

                <div className="flex flex-wrap gap-1 mb-3 min-h-[22px]">
                  {categoryList.length > 0 ? (
                    categoryList.map((cat) => (
                      <span
                        key={cat}
                        className="text-xs bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 px-2 py-0.5 rounded"
                      >
                        {cat}
                      </span>
                    ))
                  ) : (
                    <span className="text-xs text-gray-400">No articles yet</span>
                  )}
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-gray-800">
                  <div className="flex items-center gap-2 text-xs text-gray-400">
                    <span className="font-semibold text-gray-900 dark:text-white">
                      {authorStats?.count ?? 0}
                    </span>
                    articles
                    {authorStats?.latest && <span>Last: {authorStats.latest}</span>}
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => openEdit(author)}
                      className="p-1.5 text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 rounded-md hover:bg-indigo-50 dark:hover:bg-indigo-900/20"
                      title="Edit author"
                    >
                      <PencilSquareIcon className="w-4 h-4" />
                    </button>
                    {author.id !== DEFAULT_AUTHOR.id && (
                      <button
                        type="button"
                        onClick={() => deleteAuthor(author)}
                        className="p-1.5 text-gray-400 hover:text-red-600 dark:hover:text-red-400 rounded-md hover:bg-red-50 dark:hover:bg-red-900/20"
                        title="Delete or deactivate"
                      >
                        <TrashIcon className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {!loading && sortedAuthors.length === 0 && (
          <div className="py-16 text-center bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800">
            <UserGroupIcon className="w-12 h-12 text-gray-300 dark:text-gray-700 mx-auto mb-3" />
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Create your first author profile.
            </p>
          </div>
        )}
      </div>
    </>
  );
}
