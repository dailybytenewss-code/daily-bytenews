import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const email = searchParams.get('email')?.trim();

  if (!email) {
    return new NextResponse('Missing email address.', { status: 400 });
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from('subscribers')
    .update({ status: 'unsubscribed', unsubscribed_at: new Date().toISOString() })
    .eq('email', email);
  const success = !error;
  const title = success ? 'Unsubscribed' : 'Unable to unsubscribe';
  const message = success
    ? 'You have been removed from the DailyByteNews newsletter.'
    : 'We could not update your subscription. Please try again later.';

  return new NextResponse(
    `<!doctype html>
    <html>
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>${title} - DailyByteNews</title>
      </head>
      <body style="font-family:Arial,sans-serif;background:#f8fafc;color:#111827;margin:0;padding:40px">
        <main style="max-width:520px;margin:0 auto;background:white;border:1px solid #e5e7eb;border-radius:12px;padding:28px">
          <h1 style="font-size:24px;margin:0 0 12px">${title}</h1>
          <p style="font-size:15px;line-height:1.6;color:#4b5563">${message}</p>
          <a href="/" style="color:#2563eb;font-weight:700;text-decoration:none">Back to DailyByteNews</a>
        </main>
      </body>
    </html>`,
    {
      status: success ? 200 : 500,
      headers: { 'Content-Type': 'text/html; charset=utf-8' },
    }
  );
}
