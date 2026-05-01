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
  } catch (error) {
    return { success: false, message: 'Failed to delete subscriber' };
  }
}
