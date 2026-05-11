'use client';

import { useState } from 'react';
import { sendArticleNotification } from '@/lib/subscriber-db-server';
import { CheckCircleIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';

interface NotifySubscribersFormProps {
  articleTitle: string;
  articleSlug: string;
  onNotified?: () => void;
}

export default function NotifySubscribersForm({
  articleTitle,
  articleSlug,
  onNotified,
}: NotifySubscribersFormProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [customMessage, setCustomMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const defaultMessage = `${articleTitle} - Check it out now: https://www.dailybytenews.in/article?slug=${articleSlug}`;
  const finalMessage = customMessage.trim() || defaultMessage;

  const handleSend = async () => {
    setLoading(true);
    setError('');

    const result = await sendArticleNotification({
      title: articleTitle,
      slug: articleSlug,
      customMessage: customMessage.trim() || undefined,
    });

    setLoading(false);

    if (result.success) {
      setSuccess(true);
      setCustomMessage('');
      setTimeout(() => {
        setSuccess(false);
        setIsOpen(false);
        onNotified?.();
      }, 3000);
    } else {
      setError(result.message);
    }
  };

  if (success) {
    return (
      <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4 flex items-start gap-3">
        <CheckCircleIcon className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
        <div>
          <p className="font-semibold text-green-900 dark:text-green-200">Newsletter sent!</p>
          <p className="text-sm text-green-700 dark:text-green-300 mt-1">
            Sent to {result.sentCount} subscribers.
          </p>
        </div>
      </div>
    );
  }

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="w-full px-4 py-2.5 border-2 border-primary text-primary font-semibold rounded-lg hover:bg-primary/5 transition-colors text-sm"
      >
        ✉️ Notify Subscribers
      </button>
    );
  }

  return (
    <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 space-y-3">
      <div>
        <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
          Notification Message
        </p>
        <p className="text-xs text-gray-500 dark:text-gray-400 mb-2 leading-relaxed">
          <strong>Default:</strong> {defaultMessage}
        </p>
        <textarea
          value={customMessage}
          onChange={(e) => setCustomMessage(e.target.value)}
          placeholder="Leave empty to use default message..."
          className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary"
          rows={2}
        />
        {customMessage.trim() && (
          <p className="text-xs text-blue-600 dark:text-blue-400 mt-2">
            <strong>Will send:</strong> {finalMessage}
          </p>
        )}
      </div>

      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded p-3 flex items-start gap-2">
          <ExclamationTriangleIcon className="w-4 h-4 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
        </div>
      )}

      <div className="flex gap-2">
        <button
          onClick={handleSend}
          disabled={loading}
          className="flex-1 px-4 py-2 bg-primary hover:bg-primary/90 disabled:bg-gray-400 text-white font-semibold rounded-lg transition-colors text-sm flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Sending...
            </>
          ) : (
            '✓ Send Now'
          )}
        </button>
        <button
          onClick={() => {
            setIsOpen(false);
            setCustomMessage('');
            setError('');
          }}
          className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-semibold rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-sm"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
