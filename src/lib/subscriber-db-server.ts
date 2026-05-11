'use server';

import { createClient } from '@/lib/supabase/server';

export interface Subscriber {
  id: string;
  email: string;
  status: 'active' | 'unsubscribed' | 'bounced';
  subscribed_at: string;
  unsubscribed_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface NewsletterSendInput {
  subject: string;
  preview?: string;
  body: string;
}

export async function getSubscribers(status: 'all' | 'active' = 'all'): Promise<Subscriber[]> {
  try {
    const supabase = await createClient();
    let query = supabase.from('subscribers').select('*');

    if (status === 'active') {
      query = query.eq('status', 'active');
    }

    const { data, error } = await query.order('subscribed_at', { ascending: false });

    if (error) {
      console.error('Failed to fetch subscribers:', error.message);
      return [];
    }

    return (data ?? []) as Subscriber[];
  } catch (error) {
    console.error('Failed to fetch subscribers:', error);
    return [];
  }
}

export async function deleteSubscriber(id: string): Promise<{ success: boolean; message: string }> {
  try {
    const supabase = await createClient();
    const { error } = await supabase.from('subscribers').delete().eq('id', id);

    if (error) {
      return { success: false, message: error.message };
    }

    return { success: true, message: 'Subscriber deleted' };
  } catch {
    return { success: false, message: 'Failed to delete subscriber' };
  }
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function bodyToHtml(body: string) {
  const hasHtml = /<\/?[a-z][\s\S]*>/i.test(body);
  return hasHtml
    ? body
    : escapeHtml(body)
        .split(/\n{2,}/)
        .map((paragraph) => `<p>${paragraph.replace(/\n/g, '<br />')}</p>`)
        .join('\n');
}

async function recordCampaign(
  input: NewsletterSendInput,
  status: 'sent' | 'failed',
  recipientCount: number,
  failureReason?: string
) {
  try {
    const supabase = await createClient();
    await supabase.from('newsletter_campaigns').insert({
      subject: input.subject,
      preview: input.preview || null,
      body: input.body,
      status,
      recipient_count: recipientCount,
      failure_reason: failureReason || null,
      sent_at: status === 'sent' ? new Date().toISOString() : null,
    });
  } catch {
    // The send result matters more than optional campaign history.
  }
}

export async function sendNewsletterCampaign(
  input: NewsletterSendInput
): Promise<{ success: boolean; message: string; sentCount: number; failedCount: number }> {
  const subject = input.subject.trim();
  const body = input.body.trim();
  const preview = input.preview?.trim() || '';

  if (!subject || !body) {
    return {
      success: false,
      message: 'Subject and body are required.',
      sentCount: 0,
      failedCount: 0,
    };
  }

  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.NEWSLETTER_FROM_EMAIL || process.env.RESEND_FROM_EMAIL;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://dailybytenews.in';

  if (!apiKey || !from) {
    await recordCampaign(input, 'failed', 0, 'Missing RESEND_API_KEY or NEWSLETTER_FROM_EMAIL');
    return {
      success: false,
      message: 'Newsletter sender is not configured. Add RESEND_API_KEY and NEWSLETTER_FROM_EMAIL.',
      sentCount: 0,
      failedCount: 0,
    };
  }

  const subscribers = await getSubscribers('active');
  if (subscribers.length === 0) {
    return {
      success: false,
      message: 'There are no active subscribers to send to.',
      sentCount: 0,
      failedCount: 0,
    };
  }

  const htmlBody = bodyToHtml(body);
  let sentCount = 0;
  let failedCount = 0;
  let firstFailure = '';

  for (const subscriber of subscribers) {
    const unsubscribeUrl = `${siteUrl}/api/newsletter/unsubscribe?email=${encodeURIComponent(
      subscriber.email
    )}`;
    const html = `
      <div style="display:none;max-height:0;overflow:hidden">${escapeHtml(preview)}</div>
      <main style="font-family:Arial,sans-serif;line-height:1.6;color:#111827;max-width:640px;margin:0 auto;padding:24px">
        ${htmlBody}
        <hr style="border:0;border-top:1px solid #e5e7eb;margin:32px 0" />
        <p style="font-size:12px;color:#6b7280">
          You are receiving this because you subscribed to DailyByteNews.
          <a href="${unsubscribeUrl}" style="color:#2563eb">Unsubscribe</a>
        </p>
      </main>
    `;

    try {
      const response = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from,
          to: [subscriber.email],
          subject,
          html,
          text: `${preview ? `${preview}\n\n` : ''}${body}\n\nUnsubscribe: ${unsubscribeUrl}`,
          reply_to: process.env.NEWSLETTER_REPLY_TO || undefined,
        }),
      });

      if (!response.ok) {
        failedCount += 1;
        if (!firstFailure) firstFailure = await response.text();
      } else {
        sentCount += 1;
      }
    } catch (error) {
      failedCount += 1;
      if (!firstFailure) {
        firstFailure = error instanceof Error ? error.message : 'Unknown send failure';
      }
    }
  }

  const success = sentCount > 0 && failedCount === 0;
  await recordCampaign(input, success ? 'sent' : 'failed', sentCount, firstFailure || undefined);

  return {
    success,
    message: success
      ? `Newsletter sent to ${sentCount} subscribers.`
      : `Sent ${sentCount}, failed ${failedCount}. ${firstFailure || 'Please check your sender configuration.'}`,
    sentCount,
    failedCount,
  };
}
