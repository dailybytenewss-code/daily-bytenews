import { createClient } from '@/lib/supabase/server';
import type { Article } from '@/lib/articles';
import { categories as fallbackCategories } from '@/lib/articles';
import { rowToArticle, type ArticleRow } from '@/lib/article-shared';
import type { AdminCategory, AuthorProfile } from '@/lib/admin-taxonomy';
import { DEFAULT_AUTHOR } from '@/lib/admin-taxonomy';
import { createClient as createSupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

function createPublicReadClient() {
  return createSupabaseClient(supabaseUrl!, supabaseKey!);
}

/** Returns today's date as YYYY-MM-DD (matches the published_at date column in Supabase) */
function todayString(): string {
  return new Date().toISOString().split('T')[0];
}

// ─── Raw fetch (used internally) ────────────────────────────────
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

// ─── All articles (admin / misc) ────────────────────────────────
export async function getArticles(includeDrafts = false): Promise<Article[]> {
  const rows = await fetchArticleRows(includeDrafts);
  return rows.map(rowToArticle);
}

export async function getArticleCategories(includeInactive = false): Promise<AdminCategory[]> {
  try {
    const supabase = includeInactive ? await createClient() : createPublicReadClient();
    let query = supabase.from('article_categories').select('*').order('name');

    if (!includeInactive) {
      query = query.eq('status', 'active');
    }

    const { data, error } = await query;
    if (error) {
      console.error('Supabase article_categories read failed:', error.message);
      return fallbackCategories.map((category, index) => ({
        id: `fallback-${index}`,
        ...category,
        status: 'active' as const,
      }));
    }

    return (data ?? []) as AdminCategory[];
  } catch (error) {
    console.error('Supabase article_categories read failed:', error);
    return fallbackCategories.map((category, index) => ({
      id: `fallback-${index}`,
      ...category,
      status: 'active' as const,
    }));
  }
}

export async function getAuthorProfiles(includeInactive = false): Promise<AuthorProfile[]> {
  try {
    const supabase = includeInactive ? await createClient() : createPublicReadClient();
    let query = supabase.from('authors').select('*').order('name');

    if (!includeInactive) {
      query = query.eq('status', 'active');
    }

    const { data, error } = await query;
    if (error) {
      console.error('Supabase authors read failed:', error.message);
      return [DEFAULT_AUTHOR];
    }

    const authors = (data ?? []) as AuthorProfile[];
    return authors.length > 0 ? authors : [DEFAULT_AUTHOR];
  } catch (error) {
    console.error('Supabase authors read failed:', error);
    return [DEFAULT_AUTHOR];
  }
}

// ─── TODAY'S articles — for "Latest Stories" on homepage ────────
export async function getTodaysArticles(): Promise<Article[]> {
  try {
    const today = todayString();
    const supabase = createPublicReadClient();
    const { data, error } = await supabase
      .from('articles')
      .select('*')
      .eq('status', 'published')
      .eq('published_at', today)
      .order('created_at', { ascending: false }); // newest-first within the day

    if (error || !data) return [];
    return (data as ArticleRow[]).map(rowToArticle);
  } catch {
    return [];
  }
}

// ─── Fallback recent articles (when no articles today) ──────────
export async function getLatestArticles(count = 6): Promise<Article[]> {
  const articles = await getArticles(false);
  return articles.slice(0, count);
}

// ─── Single article by slug ──────────────────────────────────────
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

// ─── Category articles — excludes today so they don't duplicate Latest Stories ──
export async function getArticlesByCategory(
  categorySlug: string,
  excludeToday = true
): Promise<Article[]> {
  try {
    const supabase = createPublicReadClient();
    let query = supabase
      .from('articles')
      .select('*')
      .eq('status', 'published')
      .eq('category_slug', categorySlug)
      .order('published_at', { ascending: false });

    if (excludeToday) {
      query = query.neq('published_at', todayString());
    }

    const { data, error } = await query;
    if (error || !data) return [];
    return (data as ArticleRow[]).map(rowToArticle);
  } catch {
    return [];
  }
}

// ─── Featured article ────────────────────────────────────────────
export async function getFeaturedArticle(): Promise<Article | null> {
  try {
    const supabase = createPublicReadClient();

    // Prefer a featured article from today
    const today = todayString();
    const { data: todayFeatured } = await supabase
      .from('articles')
      .select('*')
      .eq('status', 'published')
      .eq('featured', true)
      .eq('published_at', today)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (todayFeatured) return rowToArticle(todayFeatured as ArticleRow);

    // Fall back to any featured article
    const { data: anyFeatured } = await supabase
      .from('articles')
      .select('*')
      .eq('status', 'published')
      .eq('featured', true)
      .order('published_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (anyFeatured) return rowToArticle(anyFeatured as ArticleRow);

    // Last resort: most recent published article
    const { data: latest } = await supabase
      .from('articles')
      .select('*')
      .eq('status', 'published')
      .order('published_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    return latest ? rowToArticle(latest as ArticleRow) : null;
  } catch {
    return null;
  }
}

// ─── Trending articles ───────────────────────────────────────────
export async function getTrendingArticles(count = 5): Promise<Article[]> {
  try {
    const supabase = createPublicReadClient();
    const { data, error } = await supabase
      .from('articles')
      .select('*')
      .eq('status', 'published')
      .eq('trending', true)
      .order('published_at', { ascending: false })
      .limit(count);

    if (error || !data) return [];
    return (data as ArticleRow[]).map(rowToArticle);
  } catch {
    return [];
  }
}
