import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

const FALLBACK_ITEMS = [
  'OpenAI hits $25B annualized revenue, eyes 2027 IPO',
  "Anthropic's MCP crosses 97 million developer installs",
  'TSMC posts record Q1 revenue on AI chip demand surge',
  'Atlassian cuts 1,600 jobs in AI-first restructuring',
  'India UPI hits 18 billion monthly transactions milestone',
];

export async function GET() {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('site_settings')
      .select('value')
      .eq('key', 'breaking_news')
      .maybeSingle();

    if (error || !data) {
      return NextResponse.json(FALLBACK_ITEMS);
    }

    const items = Array.isArray(data.value) ? data.value : FALLBACK_ITEMS;
    return NextResponse.json(items);
  } catch {
    return NextResponse.json(FALLBACK_ITEMS);
  }
}

export async function POST(req: Request) {
  try {
    const { items } = await req.json();

    if (!Array.isArray(items)) {
      return NextResponse.json({ error: 'items must be an array' }, { status: 400 });
    }

    const supabase = await createClient();

    // Verify authenticated user
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { error } = await supabase
      .from('site_settings')
      .upsert({ key: 'breaking_news', value: items, updated_at: new Date().toISOString() });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
