'use client';

import { useState } from 'react';
import { PlusIcon, TrashIcon, ArrowUpIcon, ArrowDownIcon, BoltIcon } from '@heroicons/react/24/outline';

const DEFAULT_ITEMS = [
  'OpenAI hits $25B annualized revenue, eyes 2027 IPO',
  "Anthropic's MCP crosses 97 million developer installs",
  'TSMC posts record Q1 revenue on AI chip demand surge',
  'Atlassian cuts 1,600 jobs in AI-first restructuring',
  'India UPI hits 18 billion monthly transactions milestone',
];

export default function BreakingNewsPage() {
  const [items, setItems] = useState<string[]>(DEFAULT_ITEMS);
  const [newItem, setNewItem] = useState('');
  const [saved, setSaved] = useState(false);

  const add = () => {
    if (!newItem.trim()) return;
    setItems((prev) => [newItem.trim(), ...prev]);
    setNewItem('');
  };

  const remove = (i: number) => setItems((prev) => prev.filter((_, idx) => idx !== i));

  const moveUp = (i: number) => {
    if (i === 0) return;
    setItems((prev) => {
      const next = [...prev];
      [next[i - 1], next[i]] = [next[i], next[i - 1]];
      return next;
    });
  };

  const moveDown = (i: number) => {
    if (i === items.length - 1) return;
    setItems((prev) => {
      const next = [...prev];
      [next[i], next[i + 1]] = [next[i + 1], next[i]];
      return next;
    });
  };

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="max-w-2xl space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Breaking News Ticker</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">Manage the scrolling news ticker shown at the top of every page</p>
        </div>
        <button
          onClick={handleSave}
          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg transition-colors"
        >
          {saved ? '✓ Saved!' : 'Save Changes'}
        </button>
      </div>

      {/* Live preview */}
      <div className="bg-red-500 text-white rounded-xl px-4 py-3 overflow-hidden">
        <p className="text-xs font-bold uppercase tracking-widest mb-1 text-red-200">Live Preview</p>
        <div className="flex items-center gap-2">
          <span className="flex-shrink-0 bg-white text-red-500 text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded">
            BYTE ALERT
          </span>
          <p className="text-xs font-medium truncate">{items[0] || 'No items yet...'}</p>
        </div>
      </div>

      {/* Add new */}
      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-5">
        <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Add Breaking News Item</h3>
        <div className="flex gap-2">
          <input
            type="text"
            value={newItem}
            onChange={(e) => setNewItem(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), add())}
            placeholder="Enter breaking news headline..."
            maxLength={120}
            className="flex-1 px-3 py-2.5 text-sm border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          />
          <button
            onClick={add}
            disabled={!newItem.trim()}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-200 dark:disabled:bg-gray-700 disabled:text-gray-400 text-white text-sm font-semibold rounded-lg transition-colors flex-shrink-0"
          >
            <PlusIcon className="w-4 h-4" />
            Add
          </button>
        </div>
        <p className="text-xs text-gray-400 mt-2">{newItem.length}/120 characters · Press Enter to add</p>
      </div>

      {/* Items list */}
      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden">
        <div className="px-5 py-3 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">Current Items ({items.length})</h3>
          <p className="text-xs text-gray-400">Drag to reorder · Items scroll in order</p>
        </div>
        {items.length === 0 ? (
          <div className="py-12 text-center">
            <BoltIcon className="w-8 h-8 text-gray-300 dark:text-gray-700 mx-auto mb-2" />
            <p className="text-sm text-gray-400">No ticker items. Add one above.</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100 dark:divide-gray-800">
            {items.map((item, i) => (
              <div key={i} className="flex items-center gap-3 px-5 py-3 hover:bg-gray-50 dark:hover:bg-gray-800/40 transition-colors group">
                <div className="flex flex-col gap-0.5 flex-shrink-0">
                  <button onClick={() => moveUp(i)} disabled={i === 0}
                    className="p-0.5 text-gray-300 dark:text-gray-600 hover:text-gray-500 dark:hover:text-gray-400 disabled:opacity-30 transition-colors">
                    <ArrowUpIcon className="w-3 h-3" />
                  </button>
                  <button onClick={() => moveDown(i)} disabled={i === items.length - 1}
                    className="p-0.5 text-gray-300 dark:text-gray-600 hover:text-gray-500 dark:hover:text-gray-400 disabled:opacity-30 transition-colors">
                    <ArrowDownIcon className="w-3 h-3" />
                  </button>
                </div>
                <span className="text-xs font-bold text-gray-400 w-5 flex-shrink-0 text-center">{i + 1}</span>
                <p className="flex-1 text-sm text-gray-700 dark:text-gray-300">{item}</p>
                <button onClick={() => remove(i)}
                  className="p-1.5 text-gray-300 dark:text-gray-600 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors opacity-0 group-hover:opacity-100">
                  <TrashIcon className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <p className="text-xs text-gray-400 text-center">
        Changes apply after saving. Connect to Supabase to persist ticker items across deployments.
      </p>
    </div>
  );
}
