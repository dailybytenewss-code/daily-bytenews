'use client';

import { PhotoIcon } from '@heroicons/react/24/outline';

interface RichTextToolbarProps {
  textareaRef: React.RefObject<HTMLTextAreaElement | null>;
  value: string;
  onChange: (value: string) => void;
  onOpenMedia?: () => void;
}

function insertAround(
  ref: React.RefObject<HTMLTextAreaElement | null>,
  before: string,
  after: string,
  onChange: (v: string) => void
) {
  const el = ref.current;
  if (!el) return;
  const start = el.selectionStart;
  const end = el.selectionEnd;
  const selected = el.value.slice(start, end);
  const newVal = el.value.slice(0, start) + before + selected + after + el.value.slice(end);
  onChange(newVal);
  setTimeout(() => {
    el.focus();
    el.setSelectionRange(start + before.length, end + before.length);
  }, 0);
}

function insertBlock(
  ref: React.RefObject<HTMLTextAreaElement | null>,
  template: string,
  onChange: (v: string) => void
) {
  const el = ref.current;
  if (!el) return;
  const pos = el.selectionStart;
  const newVal = el.value.slice(0, pos) + '\n' + template + '\n' + el.value.slice(pos);
  onChange(newVal);
  setTimeout(() => {
    el.focus();
    el.setSelectionRange(pos + template.length + 2, pos + template.length + 2);
  }, 0);
}

const TOOLS = [
  { label: 'B', title: 'Bold', action: (r: React.RefObject<HTMLTextAreaElement | null>, _: string, cb: (v: string) => void) => insertAround(r, '<strong>', '</strong>', cb) },
  { label: 'I', title: 'Italic', action: (r: React.RefObject<HTMLTextAreaElement | null>, _: string, cb: (v: string) => void) => insertAround(r, '<em>', '</em>', cb) },
  { label: 'U', title: 'Underline', action: (r: React.RefObject<HTMLTextAreaElement | null>, _: string, cb: (v: string) => void) => insertAround(r, '<u>', '</u>', cb) },
  null,
  { label: 'H2', title: 'Heading 2', action: (r: React.RefObject<HTMLTextAreaElement | null>, _: string, cb: (v: string) => void) => insertBlock(r, '<h2>Heading</h2>', cb) },
  { label: 'H3', title: 'Heading 3', action: (r: React.RefObject<HTMLTextAreaElement | null>, _: string, cb: (v: string) => void) => insertBlock(r, '<h3>Heading</h3>', cb) },
  null,
  { label: 'P', title: 'Paragraph', action: (r: React.RefObject<HTMLTextAreaElement | null>, _: string, cb: (v: string) => void) => insertBlock(r, '<p>Your text here.</p>', cb) },
  { label: 'UL', title: 'Bullet list', action: (r: React.RefObject<HTMLTextAreaElement | null>, _: string, cb: (v: string) => void) => insertBlock(r, '<ul>\n  <li>Item 1</li>\n  <li>Item 2</li>\n</ul>', cb) },
  { label: 'OL', title: 'Numbered list', action: (r: React.RefObject<HTMLTextAreaElement | null>, _: string, cb: (v: string) => void) => insertBlock(r, '<ol>\n  <li>Item 1</li>\n  <li>Item 2</li>\n</ol>', cb) },
  { label: '❝', title: 'Blockquote', action: (r: React.RefObject<HTMLTextAreaElement | null>, _: string, cb: (v: string) => void) => insertBlock(r, '<blockquote>Quote text here.</blockquote>', cb) },
  null,
  { label: 'A', title: 'Link', action: (r: React.RefObject<HTMLTextAreaElement | null>, _: string, cb: (v: string) => void) => insertAround(r, '<a href="URL">', '</a>', cb) },
  { label: '—', title: 'Divider', action: (r: React.RefObject<HTMLTextAreaElement | null>, _: string, cb: (v: string) => void) => insertBlock(r, '<hr />', cb) },
];

export default function RichTextToolbar({ textareaRef, value, onChange, onOpenMedia }: RichTextToolbarProps) {
  return (
    <div className="flex flex-wrap items-center gap-0.5 p-2 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/60 rounded-t-lg">
      {TOOLS.map((tool, i) =>
        tool === null ? (
          <div key={i} className="w-px h-5 bg-gray-300 dark:bg-gray-600 mx-1" />
        ) : (
          <button
            key={tool.label}
            type="button"
            title={tool.title}
            onClick={() => tool.action(textareaRef, value, onChange)}
            className="px-2.5 py-1 text-xs font-semibold text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-colors min-w-[28px] text-center"
          >
            {tool.label}
          </button>
        )
      )}
      {onOpenMedia && (
        <>
          <div className="w-px h-5 bg-gray-300 dark:bg-gray-600 mx-1" />
          <button
            type="button"
            title="Insert image from Media Library"
            onClick={onOpenMedia}
            className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded transition-colors"
          >
            <PhotoIcon className="w-3.5 h-3.5" />
            Media
          </button>
        </>
      )}
    </div>
  );
}
