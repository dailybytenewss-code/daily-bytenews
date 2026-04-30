import Link from 'next/link';
import { getArticles } from '@/lib/article-db';
import { PencilSquareIcon, UserGroupIcon } from '@heroicons/react/24/outline';

export const dynamic = 'force-dynamic';

export default async function AdminAuthorsPage() {
  const articles = await getArticles(true);
  const authorMap = new Map<
    string,
    {
      slug: string;
      avatar: string;
      bio: string;
      count: number;
      categories: Set<string>;
      latest: string;
    }
  >();

  for (const article of articles) {
    const existing = authorMap.get(article.author);
    if (existing) {
      existing.count++;
      existing.categories.add(article.category);
      if (article.date > existing.latest) existing.latest = article.date;
    } else {
      authorMap.set(article.author, {
        slug: article.authorSlug,
        avatar: article.authorAvatar,
        bio: article.authorBio,
        count: 1,
        categories: new Set([article.category]),
        latest: article.date,
      });
    }
  }

  const authors = Array.from(authorMap.entries())
    .map(([name, data]) => ({ name, ...data, categories: Array.from(data.categories) }))
    .sort((a, b) => b.count - a.count);

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Authors</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
            {authors.length} contributors
          </p>
        </div>
      </div>

      {/* Author cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {authors.map((author) => (
          <div
            key={author.slug}
            className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-5"
          >
            <div className="flex items-start gap-3 mb-3">
              {author.avatar ? (
                <img
                  src={author.avatar}
                  alt={author.name}
                  className="w-11 h-11 rounded-full object-cover flex-shrink-0 border border-gray-200 dark:border-gray-700"
                />
              ) : (
                <div className="w-11 h-11 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center flex-shrink-0">
                  <span className="text-blue-700 dark:text-blue-400 font-bold text-base">
                    {author.name.charAt(0)}
                  </span>
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-gray-900 dark:text-white text-sm">{author.name}</p>
                <p className="text-xs text-gray-400 mt-0.5 truncate">@{author.slug}</p>
              </div>
            </div>

            {author.bio && (
              <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed line-clamp-2 mb-3">
                {author.bio}
              </p>
            )}

            <div className="flex flex-wrap gap-1 mb-3">
              {author.categories.map((cat) => (
                <span
                  key={cat}
                  className="text-xs bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 px-2 py-0.5 rounded"
                >
                  {cat}
                </span>
              ))}
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-gray-800">
              <div className="flex items-center gap-3 text-xs text-gray-400">
                <span className="font-semibold text-gray-900 dark:text-white">{author.count}</span>{' '}
                articles
                <span>·</span>
                <span>Last: {author.latest}</span>
              </div>
              <Link
                href={`/admin/articles`}
                className="p-1.5 text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 rounded-md hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-colors"
                title="View articles"
              >
                <PencilSquareIcon className="w-4 h-4" />
              </Link>
            </div>
          </div>
        ))}
      </div>

      <div className="flex items-start gap-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl px-5 py-4">
        <UserGroupIcon className="w-4 h-4 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
        <p className="text-sm text-blue-700 dark:text-blue-300">
          Authors are derived from article data stored in Supabase. A dedicated author profile table
          can be added later if you need separate author CRUD.
        </p>
      </div>
    </div>
  );
}
