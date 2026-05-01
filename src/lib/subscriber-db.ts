'use client';

import { createClient as createSupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

function createPublicClient() {
  return createSupabaseClient(supabaseUrl!, supabaseKey!);
}

export interface Subscriber {
  id: string;
  email: string;
  status: 'active' | 'unsubscribed' | 'bounced';
  subscribed_at: string;
  unsubscribed_at: string | null;
  created_at: string;
  updated_at: string;
}

export async function subscribeEmail(email: string): Promise<{ success: boolean; message: string }> {
  try {
    const supabase = createPublicClient();

    // Check if already subscribed
    const { data: existing } = await supabase
      .from('subscribers')
      .select('id, status')
      .eq('email', email)
      .maybeSingle();

    if (existing) {
      if (existing.status === 'active') {
        return { success: false, message: 'Already subscribed' };
      }
      // Reactivate unsubscribed email
      const { error } = await supabase
        .from('subscribers')
        .update({ status: 'active', unsubscribed_at: null })
        .eq('id', existing.id);

      if (error) {
        return { success: false, message: 'Failed to resubscribe' };
      }
      return { success: true, message: 'Resubscribed successfully' };
    }

    // Insert new subscriber
    const { error } = await supabase
      .from('subscribers')
      .insert([{ email, status: 'active' }]);

    if (error) {
      return { success: false, message: error.message };
    }

    return { success: true, message: 'Subscribed successfully' };
  } catch (error) {
    return { success: false, message: 'Subscription failed' };
  }
}

export async function unsubscribeEmail(email: string): Promise<{ success: boolean }> {
  try {
    const supabase = createPublicClient();

    const { error } = await supabase
      .from('subscribers')
      .update({ status: 'unsubscribed', unsubscribed_at: new Date().toISOString() })
      .eq('email', email);

    return { success: !error };
  } catch (error) {
    return { success: false };
  }
}
