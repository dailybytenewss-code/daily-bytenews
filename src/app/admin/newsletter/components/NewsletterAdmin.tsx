'use client';

import { useState } from 'react';
import {
  EnvelopeIcon,
  PaperAirplaneIcon,
  UserGroupIcon,
  TrashIcon,
  MagnifyingGlassIcon,
  CheckIcon,
} from '@heroicons/react/24/outline';
import { createClient } from '@/lib/supabase/client';
import { deleteSubscriber } from '@/lib/subscriber-db-server';
import type { Subscriber } from '@/lib/subscriber-db-server';

interface NewsletterAdminProps {
  initialSubscribers: Subscriber[];
}

export default function NewsletterAdmin({ initialSubscribers }: NewsletterAdminProps) {
  const [search, setSearch] = useState('');
  const [tab, setTab] = useState<'subscribers' | 'compose'>('subscribers');
  const [subscribers, setSubscribers] = useState<Subscriber[]>(initialSubscribers);
  const [error, setError] = useState('');
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const [compose, setCompose] = useState({ subject: '', preview: '', body: '' });
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const active = subscribers.filter((s) => s.status === 'active').length;
  const filtered = subscribers.filter((s) =>
    s.email.toLowerCase().includes(search.toLowerCase())
  );

  const handleDelete = async (id: string, email: string) => {
    if (confirm(`Remove ${email}? This cannot be undone.`)) {
      setDeletingId(id);
      const result = await deleteSubscriber(id);

      if (result.success) {
        setSubscribers((prev) => prev.filter((sub) => sub.id !== id));
      } else {
        setError(result.message);
      }
      setDeletingId(null);
    }
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);

    // In production, you'd send emails via a service like SendGrid, Resend, or Mailgun
    // For now, this is just a placeholder
    await new Promise((r) => setTimeout(r, 1200));

    setSending(false);
    setSent(true);
    setTimeout(() => setSent(false), 3000);
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Newsletter</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
            Manage subscribers and send campaigns
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          {
            label: 'Total Subscribers',
            value: subscribers.length,
            icon: UserGroupIcon,
            color: 'text-blue-600 dark:text-blue-400',
            bg: 'bg-blue-50 dark:bg-blue-900/20',
          },
          {
            label: 'Active',
            value: active,
            icon: CheckIcon,
            color: 'text-green-600 dark:text-green-400',
            bg: 'bg-green-50 dark:bg-green-900/20',
          },
          {
            label: 'Unsubscribed',
            value: subscribers.length - active,
            icon: TrashIcon,
            color: 'text-gray-500 dark:text-gray-400',
            bg: 'bg-gray-50 dark:bg-gray-800',
          },
        ].map(({ label, value, icon: Icon, color, bg }) => (
          <div
            key={label}
            className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-5"
          >
            <div className={`inline-flex p-2 rounded-lg ${bg} mb-3`}>
              <Icon className={`w-5 h-5 ${color}`} />
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{value}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-100 dark:bg-gray-800 p-1 rounded-xl w-fit">
        {(['subscribers', 'compose'] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2 text-sm font-semibold rounded-lg capitalize transition-colors ${
              tab === t
                ? 'bg-white dark:bg-gray-900 text-gray-900 dark:text-white shadow-sm'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
          >
            {t === 'subscribers' ? 'Subscribers' : 'Send Campaign'}
          </button>
        ))}
      </div>

      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl px-4 py-3 text-sm text-red-600 dark:text-red-400">
          {error}
        </div>
      )}

      {tab === 'subscribers' ? (
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden">
          <div className="p-4 border-b border-gray-200 dark:border-gray-800">
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search subscribers..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {filtered.length === 0 ? (
            <div className="py-12 text-center">
              <UserGroupIcon className="w-12 h-12 text-gray-300 dark:text-gray-700 mx-auto mb-3" />
              <p className="text-gray-500 dark:text-gray-400">No subscribers yet</p>
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50">
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider hidden sm:table-cell">
                    Subscribed
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-5 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                {filtered.map((sub) => (
                  <tr
                    key={sub.id}
                    className={`hover:bg-gray-50 dark:hover:bg-gray-800/40 transition-colors group ${
                      deletingId === sub.id ? 'opacity-40' : ''
                    }`}
                  >
                    <td className="px-5 py-3 font-medium text-gray-900 dark:text-white">
                      {sub.email}
                    </td>
                    <td className="px-4 py-3 text-gray-500 dark:text-gray-400 hidden sm:table-cell text-sm">
                      {new Date(sub.subscribed_at).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold ${
                          sub.status === 'active'
                            ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400'
                            : 'bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400'
                        }`}
                      >
                        {sub.status}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-right">
                      <button
                        onClick={() => handleDelete(sub.id, sub.email)}
                        className="p-1.5 text-gray-300 hover:text-red-500 dark:hover:text-red-400 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors opacity-0 group-hover:opacity-100"
                      >
                        <TrashIcon className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          <div className="px-5 py-3 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between text-sm">
            <p className="text-xs text-gray-400">
              Showing {filtered.length} of {subscribers.length} subscribers
            </p>
            <p className="text-xs text-blue-600 dark:text-blue-400">
              {active} active subscribers
            </p>
          </div>
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-5">
          {sent ? (
            <div className="py-12 text-center">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-3">
                <PaperAirplaneIcon className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
              <p className="font-bold text-gray-900 dark:text-white">Campaign sent!</p>
              <p className="text-sm text-gray-400 mt-1">
                Delivered to {active} active subscribers.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSend} className="space-y-4">
              <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                Compose Newsletter
              </h3>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                  Subject Line <span className="text-red-500">*</span>
                </label>
                <input
                  required
                  type="text"
                  value={compose.subject}
                  onChange={(e) => setCompose({ ...compose, subject: e.target.value })}
                  placeholder="This week in AI: 5 stories you can't miss"
                  className="w-full px-3 py-2.5 text-sm border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                  Preview Text
                </label>
                <input
                  type="text"
                  value={compose.preview}
                  onChange={(e) => setCompose({ ...compose, preview: e.target.value })}
                  placeholder="Short preview shown in inbox..."
                  className="w-full px-3 py-2.5 text-sm border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                  Body <span className="text-red-500">*</span>
                </label>
                <textarea
                  required
                  rows={10}
                  value={compose.body}
                  onChange={(e) => setCompose({ ...compose, body: e.target.value })}
                  placeholder="Write your newsletter content here. HTML supported."
                  className="w-full px-3 py-2.5 text-sm border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-y font-mono"
                />
              </div>
              <div className="flex items-center justify-between pt-2">
                <p className="text-xs text-gray-400">
                  Will be sent to <strong className="text-gray-700 dark:text-gray-300">{active} active subscribers</strong>
                </p>
                <button
                  type="submit"
                  disabled={sending}
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white text-sm font-semibold rounded-lg transition-colors"
                >
                  <PaperAirplaneIcon className="w-4 h-4" />
                  {sending ? 'Sending...' : 'Send Newsletter'}
                </button>
              </div>
            </form>
          )}
        </div>
      )}
    </div>
  );
}
