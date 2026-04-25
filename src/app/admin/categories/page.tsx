import Link from 'next/link';
import { articles, categories } from '@/lib/articles';
import { TagIcon } from '@heroicons/react/24/outline';

const colorStyles: Record<string, { badge: string; bar: string }> = {
  blue: { badge: 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 border border-blue-200 dark:border-blue-800', bar: 'bg-blue-500' },
  green: { badge: 'bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400 border border-green-200 dark:border-green-800', bar: 'bg-green-500' },
  amber: { badge: 'bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 border border-amber-200 dark:border-amber-800', bar: 'bg-amber-500' },
  red: { badge: 'bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-400 border border-red-200 dark:border-red-800', bar: 'bg-red-500' },
};

export default function AdminCategoriesPage() {
  const total = articles.length;

  const enriched = categories.map((cat) => {
    const catArticles = articles.filter((a) => a.categorySlug === cat.slug);
    const trending = catArticles.filter((a) => a.trending).length;
    return { ...cat, count: catArticles.length, trending };
  });

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Categories</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">{categories.length} categories · {total} total articles</p>
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
        {enriched.map((cat) => {
          const style = colorStyles[cat.color] || colorStyles.blue;
          return (
            <Link
              key={cat.slug}
              href={`/category?cat=${cat.slug}`}
              target="_blank"
              className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-4 hover:border-blue-300 dark:hover:border-blue-700 transition-colors group"
            >
              <span className={`inline-flex px-2 py-0.5 rounded text-xs font-semibold mb-3 ${style.badge}`}>
                {cat.name}
              </span>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{cat.count}</p>
              <p className="text-xs text-gray-400 mt-0.5">articles</p>
              {cat.trending > 0 && (
                <p className="text-xs text-amber-600 dark:text-amber-400 mt-1">{cat.trending} trending</p>
              )}
            </Link>
          );
        })}
      </div>

      {/* Detail table */}
      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-200 dark:border-gray-800">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Category Breakdown</h3>
        </div>
        <div className="divide-y divide-gray-100 dark:divide-gray-800">
          {enriched.map((cat) => {
            const style = colorStyles[cat.color] || colorStyles.blue;
            const pct = total > 0 ? Math.round((cat.count / total) * 100) : 0;
            return (
              <div key={cat.slug} className="px-5 py-4 flex items-center gap-4">
                <div className="flex items-center gap-3 w-44 flex-shrink-0">
                  <div className={`w-2.5 h-2.5 rounded-full ${style.bar}`} />
                  <span className="text-sm font-medium text-gray-900 dark:text-white">{cat.name}</span>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <div className="flex-1 bg-gray-100 dark:bg-gray-800 rounded-full h-1.5">
                      <div className={`${style.bar} h-1.5 rounded-full transition-all`} style={{ width: `${pct}%` }} />
                    </div>
                    <span className="text-xs text-gray-500 dark:text-gray-400 w-8 text-right">{pct}%</span>
                  </div>
                </div>
                <div className="text-right flex-shrink-0 w-24">
                  <span className="text-sm font-semibold text-gray-900 dark:text-white">{cat.count}</span>
                  <span className="text-xs text-gray-400 ml-1">articles</span>
                </div>
                <div className="flex-shrink-0">
                  <Link
                    href={`/admin/articles?cat=${cat.slug}`}
                    className="text-xs text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    View →
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Info note */}
      <div className="flex items-start gap-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl px-5 py-4">
        <TagIcon className="w-4 h-4 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
        <p className="text-sm text-blue-700 dark:text-blue-300">
          Categories are defined in <code className="font-mono text-xs bg-blue-100 dark:bg-blue-900/40 px-1 py-0.5 rounded">src/lib/articles.ts</code>. Once connected to Supabase, you will be able to add and manage categories from this panel.
        </p>
      </div>
    </div>
  );
}
