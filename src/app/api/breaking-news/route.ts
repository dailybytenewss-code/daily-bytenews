import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

// Use public client for reading — no auth needed
function getPublicClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!
  );
}

export async function GET() {
  try {
    const supabase = getPublicClient();
    const { data, error } = await supabase
      .from('site_settings')
      .select('value')
      .eq('key', 'breaking_news')
      .maybeSingle();

    if (error || !data || !Array.isArray(data.value) || data.value.length === 0) {
      return NextResponse.json([]);
    }

    return NextResponse.json(data.value);
  } catch {
    return NextResponse.json([]);
  }
}
