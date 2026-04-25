import { cookies } from 'next/headers';
import { createClient as _createClient } from '@/utils/supabase/server';

export async function createClient() {
  const cookieStore = await cookies();
  return _createClient(cookieStore);
}
