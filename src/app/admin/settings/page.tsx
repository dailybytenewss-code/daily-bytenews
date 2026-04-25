'use client';

import { useState } from 'react';
import { CheckIcon, Cog6ToothIcon } from '@heroicons/react/24/outline';

export default function AdminSettingsPage() {
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);

  const [site, setSite] = useState({
    name: 'DailyByteNews',
    tagline: 'Tech. Trends. Now.',
    description: 'DailyByteNews covers the latest in AI, technology, and business — fast, trustworthy, and built for the modern Indian tech reader.',
    url: 'https://dailybytenews.in',
    email: 'hello@dailybytenews.in',
  });

  const [social, setSocial] = useState({
    twitter: 'https://twitter.com/dailybytenews',
    instagram: 'https://instagram.com/dailybytenews',
    telegram: 'https://t.me/dailybytenews',
  });

  const [analytics, setAnalytics] = useState({
    gaId: '',
    adsenseId: '',
  });

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    await new Promise((r) => setTimeout(r, 800));
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const inputCls = "w-full px-3 py-2.5 text-sm border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition";
  const labelCls = "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5";

  return (
    <div className="max-w-2xl space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Settings</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">Manage your site configuration</p>
        </div>
        <button
          form="settings-form"
          type="submit"
          disabled={saving || saved}
          className="inline-flex items-center gap-2 px-5 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white text-sm font-semibold rounded-lg transition-colors"
        >
          {saved ? <><CheckIcon className="w-4 h-4" />Saved!</> : saving ? 'Saving...' : 'Save Settings'}
        </button>
      </div>

      <form id="settings-form" onSubmit={handleSave} className="space-y-5">
        {/* Site Info */}
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-5 space-y-4">
          <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">Site Information</h3>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>Site Name</label>
              <input type="text" value={site.name} onChange={(e) => setSite({ ...site, name: e.target.value })} className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Tagline</label>
              <input type="text" value={site.tagline} onChange={(e) => setSite({ ...site, tagline: e.target.value })} className={inputCls} />
            </div>
          </div>
          <div>
            <label className={labelCls}>Description</label>
            <textarea rows={3} value={site.description} onChange={(e) => setSite({ ...site, description: e.target.value })} className={`${inputCls} resize-none`} />
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>Site URL</label>
              <input type="url" value={site.url} onChange={(e) => setSite({ ...site, url: e.target.value })} className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Contact Email</label>
              <input type="email" value={site.email} onChange={(e) => setSite({ ...site, email: e.target.value })} className={inputCls} />
            </div>
          </div>
        </div>

        {/* Social */}
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-5 space-y-4">
          <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">Social Media</h3>
          {[
            { key: 'twitter', label: 'Twitter / X URL' },
            { key: 'instagram', label: 'Instagram URL' },
            { key: 'telegram', label: 'Telegram URL' },
          ].map(({ key, label }) => (
            <div key={key}>
              <label className={labelCls}>{label}</label>
              <input
                type="url"
                value={social[key as keyof typeof social]}
                onChange={(e) => setSocial({ ...social, [key]: e.target.value })}
                className={inputCls}
              />
            </div>
          ))}
        </div>

        {/* Analytics */}
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-5 space-y-4">
          <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">Analytics & Ads</h3>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>Google Analytics ID</label>
              <input type="text" placeholder="G-XXXXXXXXXX" value={analytics.gaId} onChange={(e) => setAnalytics({ ...analytics, gaId: e.target.value })} className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>AdSense ID</label>
              <input type="text" placeholder="ca-pub-XXXXXXXXXX" value={analytics.adsenseId} onChange={(e) => setAnalytics({ ...analytics, adsenseId: e.target.value })} className={inputCls} />
            </div>
          </div>
          <p className="text-xs text-gray-400">Update <code className="font-mono bg-gray-100 dark:bg-gray-800 px-1 py-0.5 rounded">.env.local</code> with these values to activate tracking.</p>
        </div>

        {/* Danger zone */}
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-red-200 dark:border-red-900/50 p-5 space-y-3">
          <h3 className="text-sm font-semibold text-red-600 dark:text-red-400">Danger Zone</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">These actions are irreversible. Proceed with caution.</p>
          <div className="flex flex-wrap gap-3 pt-1">
            <button type="button" onClick={() => alert('This will be wired to Supabase once the database is connected.')}
              className="px-4 py-2 text-sm font-medium text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
              Clear all articles
            </button>
            <button type="button" onClick={() => alert('Cache cleared.')}
              className="px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
              Clear site cache
            </button>
          </div>
        </div>

        <div className="flex justify-end pb-4">
          <button type="submit" disabled={saving || saved}
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white text-sm font-semibold rounded-lg transition-colors">
            {saved ? <><CheckIcon className="w-4 h-4" />Saved!</> : saving ? 'Saving...' : 'Save Settings'}
          </button>
        </div>
      </form>
    </div>
  );
}
