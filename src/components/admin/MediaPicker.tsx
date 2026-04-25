'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';
import {
  XMarkIcon,
  CloudArrowUpIcon,
  MagnifyingGlassIcon,
  CheckIcon,
  PhotoIcon,
} from '@heroicons/react/24/outline';

interface MediaFile {
  name: string;
  url: string;
  size: number;
  id: string;
}

interface MediaPickerProps {
  onSelect: (url: string) => void;
  onClose: () => void;
}

function formatSize(bytes: number) {
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function MediaPicker({ onSelect, onClose }: MediaPickerProps) {
  const [files, setFiles] = useState<MediaFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const supabase = createClient();
  const BUCKET = 'media';

  const fetchFiles = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase.storage.from(BUCKET).list('articles', {
      limit: 200,
      sortBy: { column: 'created_at', order: 'desc' },
    });
    if (data) {
      setFiles(
        data
          .filter((f) => f.name !== '.emptyFolderPlaceholder')
          .map((f) => ({
            id: f.id ?? f.name,
            name: f.name,
            size: f.metadata?.size ?? 0,
            url: supabase.storage.from(BUCKET).getPublicUrl(`articles/${f.name}`).data.publicUrl,
          }))
      );
    }
    setLoading(false);
  }, []);

  useEffect(() => { fetchFiles(); }, [fetchFiles]);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const filesToUpload = Array.from(e.target.files || []).filter((f) => f.type.startsWith('image/'));
    if (!filesToUpload.length) return;
    setUploading(true);
    for (const file of filesToUpload) {
      const ext = file.name.split('.').pop();
      const safeName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
      await supabase.storage.from(BUCKET).upload(`articles/${safeName}`, file, { cacheControl: '31536000' });
    }
    setUploading(false);
    fetchFiles();
  };

  const filtered = files.filter((f) => f.name.toLowerCase().includes(search.toLowerCase()));
  const selectedFile = files.find((f) => f.url === selected);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-4xl max-h-[85vh] flex flex-col border border-gray-200 dark:border-gray-800">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200 dark:border-gray-800 flex-shrink-0">
          <h2 className="text-base font-bold text-gray-900 dark:text-white">Media Library</h2>
          <div className="flex items-center gap-2">
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white text-xs font-semibold rounded-lg transition-colors"
            >
              <CloudArrowUpIcon className="w-3.5 h-3.5" />
              {uploading ? 'Uploading...' : 'Upload'}
            </button>
            <input ref={fileInputRef} type="file" accept="image/*" multiple className="hidden" onChange={handleUpload} />
            <button onClick={onClose} className="p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
              <XMarkIcon className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="flex flex-1 min-h-0">
          {/* Grid */}
          <div className="flex-1 flex flex-col min-w-0 p-4">
            <div className="relative mb-3">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search images..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {loading ? (
              <div className="grid grid-cols-4 sm:grid-cols-5 gap-2 overflow-y-auto">
                {Array.from({ length: 15 }).map((_, i) => (
                  <div key={i} className="aspect-square rounded-lg bg-gray-100 dark:bg-gray-800 animate-pulse" />
                ))}
              </div>
            ) : filtered.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center text-center py-12">
                <PhotoIcon className="w-12 h-12 text-gray-300 dark:text-gray-700 mb-3" />
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {files.length === 0 ? 'No images yet. Upload some above.' : 'No results.'}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-4 sm:grid-cols-5 gap-2 overflow-y-auto pr-1">
                {filtered.map((file) => (
                  <button
                    key={file.id}
                    onClick={() => setSelected(selected === file.url ? null : file.url)}
                    className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                      selected === file.url
                        ? 'border-blue-500 shadow-md shadow-blue-500/20'
                        : 'border-transparent hover:border-gray-300 dark:hover:border-gray-600'
                    }`}
                  >
                    <img src={file.url} alt={file.name} className="w-full h-full object-cover" />
                    {selected === file.url && (
                      <div className="absolute top-1 right-1 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                        <CheckIcon className="w-3 h-3 text-white" />
                      </div>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Detail panel */}
          {selectedFile && (
            <div className="w-56 flex-shrink-0 border-l border-gray-200 dark:border-gray-800 p-4 flex flex-col gap-3">
              <img src={selectedFile.url} alt={selectedFile.name} className="w-full aspect-square object-cover rounded-lg border border-gray-200 dark:border-gray-700" />
              <div>
                <p className="text-xs font-semibold text-gray-900 dark:text-white break-all">{selectedFile.name}</p>
                <p className="text-xs text-gray-400 mt-0.5">{formatSize(selectedFile.size)}</p>
              </div>
              <input
                readOnly
                value={selectedFile.url}
                className="w-full px-2 py-1.5 text-xs border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-500 dark:text-gray-400 font-mono break-all"
              />
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-gray-200 dark:border-gray-800 flex items-center justify-between flex-shrink-0">
          <p className="text-xs text-gray-400">{filtered.length} image{filtered.length !== 1 ? 's' : ''}</p>
          <div className="flex items-center gap-2">
            <button onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">
              Cancel
            </button>
            <button
              onClick={() => { if (selected) { onSelect(selected); onClose(); } }}
              disabled={!selected}
              className="px-5 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-200 dark:disabled:bg-gray-700 disabled:text-gray-400 text-white text-sm font-semibold rounded-lg transition-colors"
            >
              Insert Image
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
