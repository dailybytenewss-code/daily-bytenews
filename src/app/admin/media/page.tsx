'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import {
  CloudArrowUpIcon,
  TrashIcon,
  ClipboardDocumentIcon,
  CheckIcon,
  PhotoIcon,
  MagnifyingGlassIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';

interface MediaFile {
  name: string;
  url: string;
  size: number;
  created_at: string;
  id: string;
}

interface UploadItem {
  file: File;
  progress: number;
  status: 'uploading' | 'done' | 'error';
  url?: string;
  error?: string;
}

function formatSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function AdminMediaPage() {
  const [files, setFiles] = useState<MediaFile[]>([]);
  const [uploads, setUploads] = useState<UploadItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [dragging, setDragging] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);
  const [selected, setSelected] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const supabase = createClient();

  const BUCKET = 'media';

  const fetchFiles = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase.storage.from(BUCKET).list('articles', {
      limit: 200,
      sortBy: { column: 'created_at', order: 'desc' },
    });
    if (!error && data) {
      const enriched: MediaFile[] = data
        .filter((f) => f.name !== '.emptyFolderPlaceholder')
        .map((f) => ({
          id: f.id ?? f.name,
          name: f.name,
          size: f.metadata?.size ?? 0,
          created_at: f.created_at ?? '',
          url: supabase.storage.from(BUCKET).getPublicUrl(`articles/${f.name}`).data.publicUrl,
        }));
      setFiles(enriched);
    }
    setLoading(false);
  }, []);

  useEffect(() => { fetchFiles(); }, [fetchFiles]);

  const uploadFiles = async (filesToUpload: File[]) => {
    const items: UploadItem[] = filesToUpload.map((f) => ({ file: f, progress: 0, status: 'uploading' }));
    setUploads((prev) => [...items, ...prev]);

    for (let i = 0; i < filesToUpload.length; i++) {
      const file = filesToUpload[i];
      const ext = file.name.split('.').pop();
      const safeName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

      const { data, error } = await supabase.storage
        .from(BUCKET)
        .upload(`articles/${safeName}`, file, { cacheControl: '31536000', upsert: false });

      setUploads((prev) =>
        prev.map((u, idx) =>
          idx === i
            ? error
              ? { ...u, status: 'error', progress: 0, error: error.message }
              : {
                  ...u,
                  status: 'done',
                  progress: 100,
                  url: supabase.storage.from(BUCKET).getPublicUrl(data!.path).data.publicUrl,
                }
            : u
        )
      );
    }
    fetchFiles();
    setTimeout(() => setUploads([]), 3000);
  };

  const handleFiles = (incoming: FileList | null) => {
    if (!incoming) return;
    const valid = Array.from(incoming).filter((f) => f.type.startsWith('image/'));
    if (valid.length) uploadFiles(valid);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    handleFiles(e.dataTransfer.files);
  };

  const handleDelete = async (file: MediaFile) => {
    if (!confirm(`Delete "${file.name}"?`)) return;
    setDeleting(file.id);
    await supabase.storage.from(BUCKET).remove([`articles/${file.name}`]);
    setDeleting(null);
    setSelected(null);
    fetchFiles();
  };

  const copyUrl = (url: string) => {
    navigator.clipboard.writeText(url);
    setCopied(url);
    setTimeout(() => setCopied(null), 2000);
  };

  const filtered = files.filter((f) => f.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Media Library</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">{files.length} files uploaded</p>
        </div>
        <button
          onClick={() => fileInputRef.current?.click()}
          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg transition-colors"
        >
          <CloudArrowUpIcon className="w-4 h-4" />
          Upload Images
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(e) => handleFiles(e.target.files)}
        />
      </div>

      {/* Upload zone */}
      <div
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors ${
          dragging
            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
            : 'border-gray-300 dark:border-gray-700 hover:border-blue-400 dark:hover:border-blue-600 hover:bg-gray-50 dark:hover:bg-gray-800/50'
        }`}
      >
        <CloudArrowUpIcon className="w-10 h-10 mx-auto text-gray-400 mb-3" />
        <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Drag & drop images here, or <span className="text-blue-600 dark:text-blue-400">click to browse</span>
        </p>
        <p className="text-xs text-gray-400 mt-1">Supports JPG, PNG, WebP, GIF · Multiple files allowed</p>
      </div>

      {/* Upload progress */}
      {uploads.length > 0 && (
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-4 space-y-2">
          <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">Uploading</p>
          {uploads.map((u, i) => (
            <div key={i} className="flex items-center gap-3">
              <div className="w-8 h-8 rounded bg-gray-100 dark:bg-gray-800 flex items-center justify-center flex-shrink-0">
                {u.status === 'done' ? (
                  <CheckIcon className="w-4 h-4 text-green-500" />
                ) : u.status === 'error' ? (
                  <XMarkIcon className="w-4 h-4 text-red-500" />
                ) : (
                  <PhotoIcon className="w-4 h-4 text-gray-400" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-gray-700 dark:text-gray-300 truncate">{u.file.name}</p>
                <div className="mt-1 h-1.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${u.status === 'error' ? 'bg-red-500' : 'bg-blue-500'}`}
                    style={{ width: u.status === 'uploading' ? '60%' : '100%' }}
                  />
                </div>
              </div>
              <span className={`text-xs flex-shrink-0 font-medium ${u.status === 'done' ? 'text-green-500' : u.status === 'error' ? 'text-red-500' : 'text-gray-400'}`}>
                {u.status === 'done' ? 'Done' : u.status === 'error' ? 'Failed' : 'Uploading...'}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Search */}
      <div className="relative">
        <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          placeholder="Search files..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
          {Array.from({ length: 10 }).map((_, i) => (
            <div key={i} className="aspect-square rounded-lg bg-gray-100 dark:bg-gray-800 animate-pulse" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="py-20 text-center">
          <PhotoIcon className="w-12 h-12 text-gray-300 dark:text-gray-700 mx-auto mb-3" />
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {files.length === 0
              ? 'No images yet. Upload your first image above.'
              : 'No files match your search.'}
          </p>
          {files.length === 0 && (
            <p className="text-xs text-gray-400 mt-2">
              Make sure you've created a <code className="bg-gray-100 dark:bg-gray-800 px-1 rounded">media</code> bucket in Supabase Storage with public access.
            </p>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
          {filtered.map((file) => (
            <div
              key={file.id}
              onClick={() => setSelected(selected === file.id ? null : file.id)}
              className={`group relative aspect-square rounded-lg overflow-hidden border-2 cursor-pointer transition-all ${
                selected === file.id
                  ? 'border-blue-500 shadow-lg shadow-blue-500/20'
                  : 'border-transparent hover:border-gray-300 dark:hover:border-gray-600'
              }`}
            >
              <img
                src={file.url}
                alt={file.name}
                className="w-full h-full object-cover"
              />
              {/* Overlay on hover/select */}
              <div className={`absolute inset-0 bg-black/50 flex flex-col items-center justify-center gap-2 transition-opacity ${selected === file.id ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
                <button
                  onClick={(e) => { e.stopPropagation(); copyUrl(file.url); }}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white text-gray-900 text-xs font-semibold rounded-lg hover:bg-gray-100 transition-colors"
                >
                  {copied === file.url ? <><CheckIcon className="w-3 h-3 text-green-600" />Copied!</> : <><ClipboardDocumentIcon className="w-3 h-3" />Copy URL</>}
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); handleDelete(file); }}
                  disabled={deleting === file.id}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-red-500 text-white text-xs font-semibold rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50"
                >
                  <TrashIcon className="w-3 h-3" />
                  {deleting === file.id ? 'Deleting...' : 'Delete'}
                </button>
              </div>
              {/* File info */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <p className="text-white text-xs truncate font-medium">{file.name}</p>
                <p className="text-white/70 text-[10px]">{formatSize(file.size)}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Selected file detail */}
      {selected && (() => {
        const file = files.find((f) => f.id === selected);
        if (!file) return null;
        return (
          <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-4 flex items-start gap-4">
            <img src={file.url} alt={file.name} className="w-20 h-20 rounded-lg object-cover flex-shrink-0 border border-gray-200 dark:border-gray-700" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">{file.name}</p>
              <p className="text-xs text-gray-400 mt-0.5">{formatSize(file.size)}</p>
              <div className="mt-2 flex items-center gap-2">
                <input
                  readOnly
                  value={file.url}
                  className="flex-1 px-2 py-1.5 text-xs border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-400 font-mono min-w-0"
                />
                <button
                  onClick={() => copyUrl(file.url)}
                  className="flex-shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg transition-colors"
                >
                  {copied === file.url ? <><CheckIcon className="w-3 h-3" />Copied!</> : <><ClipboardDocumentIcon className="w-3 h-3" />Copy</>}
                </button>
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
}
