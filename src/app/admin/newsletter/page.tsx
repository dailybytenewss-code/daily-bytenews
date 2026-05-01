import { getSubscribers } from '@/lib/subscriber-db-server';
import NewsletterAdmin from './components/NewsletterAdmin';

export const dynamic = 'force-dynamic';

export default async function AdminNewsletterPage() {
  const subscribers = await getSubscribers();

  return <NewsletterAdmin initialSubscribers={subscribers} />;
}
