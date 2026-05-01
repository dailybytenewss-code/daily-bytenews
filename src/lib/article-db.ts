import { createClient } from '@/lib/supabase/server';
import type { Article } from '@/lib/articles';
import { rowToArticle, type ArticleRow } from '@/lib/article-shared';
import { createClient as createSupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

function createPublicReadClient() {
  return createSupabaseClient(supabaseUrl!, supabaseKey!);
}

async function fetchArticleRows(includeDrafts = false): Promise<ArticleRow[]> {
  try {
    const supabase = includeDrafts ? await createClient() : createPublicReadClient();
    let query = supabase.from('articles').select('*').order('published_at', { ascending: false });

    if (!includeDrafts) {
      query = query.eq('status', 'published');
    }

    const { data, error } = await query;
    if (error) {
      console.error('Supabase articles read failed:', error.message);
      return [];
    }

    return (data ?? []) as ArticleRow[];
  } catch (error) {
    console.error('Supabase articles read failed:', error);
    return [];
  }
}

export async function getArticles(includeDrafts = false): Promise<Article[]> {
  const rows = await fetchArticleRows(includeDrafts);
  return rows.map(rowToArticle);
}

export async function getLatestArticles(count?: number): Promise<Article[]> {
  const articles = await getArticles(false);
  return count ? articles.slice(0, count) : articles;
}

export async function getArticleBySlug(slug: string): Promise<Article | undefined> {
  try {
    const supabase = createPublicReadClient();
    const { data, error } = await supabase
      .from('articles')
      .select('*')
      .eq('slug', slug)
      .maybeSingle();

    if (!error && data) {
      const row = data as ArticleRow;
      if (row.status === 'published') return rowToArticle(row);
      if (
        row.status === 'scheduled' &&
        row.scheduled_at &&
        new Date(row.scheduled_at) <= new Date()
      ) {
        return rowToArticle(row);
      }
    }
  } catch (error) {
    console.error('Supabase article read failed:', error);
  }

  return undefined;
}

export async function getArticlesByCategory(categorySlug: string): Promise<Article[]> {
  const articles = await getArticles(false);
  return articles.filter((article) => article.categorySlug === categorySlug);
}

export async function getFeaturedArticle(): Promise<Article | null> {
  const articles = await getArticles(false);
  return articles.find((article) => article.featured) ?? articles[0] ?? null;
}

export async function getTrendingArticles(count = 5): Promise<Article[]> {
  const articles = await getArticles(false);
  return articles.filter((article) => article.trending).slice(0, count);
}
