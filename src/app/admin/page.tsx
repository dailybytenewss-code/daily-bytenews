import { createClient } from '@/lib/supabase/server';
import { categories } from '@/lib/articles';
import { getArticles } from '@/lib/article-db';
import Link from 'next/link';
import {
  DocumentTextIcon,
  TagIcon,
  UserGroupIcon,
  FireIcon,
  StarIcon,
  PlusIcon,
  ArrowTrendingUpIcon,
} from '@heroicons/react/24/outline';

export default async function AdminDashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const articles = await getArticles(true);

  const totalArticles = articles.length;
  const featuredCount = articles.filter((a) => a.featured).length;
  const trendingCount = articles.filter((a) => a.trending).length;
  const categoryCount = categories.length;

  const articlesByCategory = categories.map((cat) => ({
    ...cat,
    count: articles.filter((a) => a.categorySlug === cat.slug).length,
  }));

  const colorMap: Record<string, string> = {
    blue: 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-800',
    green:
      'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800',
    amber:
      'bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800',
    red: 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 border-red-200 dark:border-red-800',
  };

  return (
    <div className="space-y-6">
      {/* Welcome */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            Welcome back{user?.email ? `, ${user.email.split('@')[0]}` : ''}
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
            Here's what's happening on DailyByteNews today.
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

      {/* Stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            label: 'Total Articles',
            value: totalArticles,
            icon: DocumentTextIcon,
            color: 'text-blue-600 dark:text-blue-400',
            bg: 'bg-blue-50 dark:bg-blue-900/20',
          },
          {
            label: 'Categories',
            value: categoryCount,
            icon: TagIcon,
            color: 'text-purple-600 dark:text-purple-400',
            bg: 'bg-purple-50 dark:bg-purple-900/20',
          },
          {
            label: 'Trending',
            value: trendingCount,
            icon: ArrowTrendingUpIcon,
            color: 'text-amber-600 dark:text-amber-400',
            bg: 'bg-amber-50 dark:bg-amber-900/20',
          },
          {
            label: 'Featured',
            value: featuredCount,
            icon: StarIcon,
            color: 'text-green-600 dark:text-green-400',
            bg: 'bg-green-50 dark:bg-green-900/20',
          },
        ].map(({ label, value, icon: Icon, color, bg }) => (
          <div
            key={label}
            className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-5"
          >
            <div className={`inline-flex p-2 rounded-lg ${bg} mb-3`}>
              <Icon className={`w-5 h-5 ${color}`} />
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{value}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent articles */}
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800">
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200 dark:border-gray-800">
            <h3 className="font-semibold text-gray-900 dark:text-white text-sm">Recent Articles</h3>
            <Link
              href="/admin/articles"
              className="text-xs text-blue-600 dark:text-blue-400 hover:underline"
            >
              View all
            </Link>
          </div>
          <div className="divide-y divide-gray-100 dark:divide-gray-800">
            {articles.slice(0, 5).map((article) => (
              <div key={article.id} className="px-5 py-3 flex items-start gap-3">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                    {article.title}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                    {article.author} · {article.date}
                  </p>
                </div>
                <div className="flex items-center gap-1.5 flex-shrink-0">
                  {article.trending && (
                    <span className="inline-flex items-center gap-1 text-xs bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 px-1.5 py-0.5 rounded">
                      <FireIcon className="w-3 h-3" />
                      Hot
                    </span>
                  )}
                  {article.featured && (
                    <span className="inline-flex items-center gap-1 text-xs bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 px-1.5 py-0.5 rounded">
                      <StarIcon className="w-3 h-3" />
                      Featured
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Articles by category */}
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800">
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200 dark:border-gray-800">
            <h3 className="font-semibold text-gray-900 dark:text-white text-sm">
              Articles by Category
            </h3>
            <Link
              href="/admin/categories"
              className="text-xs text-blue-600 dark:text-blue-400 hover:underline"
            >
              Manage
            </Link>
          </div>
          <div className="p-5 space-y-3">
            {articlesByCategory.map((cat) => (
              <div key={cat.slug} className="flex items-center gap-3">
                <span
                  className={`text-xs font-medium px-2 py-0.5 rounded border ${colorMap[cat.color] || colorMap.blue}`}
                >
                  {cat.name}
                </span>
                <div className="flex-1 bg-gray-100 dark:bg-gray-800 rounded-full h-1.5">
                  <div
                    className="bg-blue-600 dark:bg-blue-500 h-1.5 rounded-full"
                    style={{
                      width: totalArticles > 0 ? `${(cat.count / totalArticles) * 100}%` : '0%',
                    }}
                  />
                </div>
                <span className="text-xs text-gray-500 dark:text-gray-400 w-4 text-right">
                  {cat.count}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick actions */}
      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-5">
        <h3 className="font-semibold text-gray-900 dark:text-white text-sm mb-4">Quick Actions</h3>
        <div className="flex flex-wrap gap-3">
          {[
            { label: 'Add Article', href: '/admin/articles/new', icon: PlusIcon },
            { label: 'Manage Articles', href: '/admin/articles', icon: DocumentTextIcon },
            { label: 'View Categories', href: '/admin/categories', icon: TagIcon },
            { label: 'Manage Authors', href: '/admin/authors', icon: UserGroupIcon },
          ].map(({ label, href, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className="inline-flex items-center gap-2 px-3 py-2 text-sm text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700 rounded-lg transition-colors"
            >
              <Icon className="w-4 h-4" />
              {label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
