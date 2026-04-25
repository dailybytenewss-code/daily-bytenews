'use client';

import { useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import AppLogo from '@/components/ui/AppLogo';
import {
  HomeIcon,
  DocumentTextIcon,
  TagIcon,
  UserGroupIcon,
  Cog6ToothIcon,
  ArrowLeftEndOnRectangleIcon,
  Bars3Icon,
  XMarkIcon,
  PhotoIcon,
  BoltIcon,
  EnvelopeIcon,
} from '@heroicons/react/24/outline';

const navGroups = [
  {
    label: 'Content',
    items: [
      { label: 'Dashboard', href: '/admin', icon: HomeIcon },
      { label: 'Articles', href: '/admin/articles', icon: DocumentTextIcon },
      { label: 'Categories', href: '/admin/categories', icon: TagIcon },
      { label: 'Authors', href: '/admin/authors', icon: UserGroupIcon },
    ],
  },
  {
    label: 'Media & Engagement',
    items: [
      { label: 'Media Library', href: '/admin/media', icon: PhotoIcon },
      { label: 'Breaking News', href: '/admin/breaking-news', icon: BoltIcon },
      { label: 'Newsletter', href: '/admin/newsletter', icon: EnvelopeIcon },
    ],
  },
  {
    label: 'System',
    items: [
      { label: 'Settings', href: '/admin/settings', icon: Cog6ToothIcon },
    ],
  },
];

const allNavItems = navGroups.flatMap((g) => g.items);

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [signingOut, setSigningOut] = useState(false);

  async function handleSignOut() {
    setSigningOut(true);
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push('/admin/login');
    router.refresh();
  }

  if (pathname === '/admin/login') return <>{children}</>;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-20 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-30 w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 flex flex-col transform transition-transform duration-200 lg:translate-x-0 lg:static lg:z-auto ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Sidebar header */}
        <div className="h-16 flex items-center gap-3 px-5 border-b border-gray-200 dark:border-gray-800">
          <AppLogo size={32} />
          <div>
            <p className="text-sm font-bold text-gray-900 dark:text-white leading-tight">DailyByteNews</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">Admin Panel</p>
          </div>
          <button
            className="ml-auto lg:hidden text-gray-400 hover:text-gray-600"
            onClick={() => setSidebarOpen(false)}
          >
            <XMarkIcon className="w-5 h-5" />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 py-3 px-3 overflow-y-auto space-y-4">
          {navGroups.map((group) => (
            <div key={group.label}>
              <p className="px-3 mb-1 text-[10px] font-bold uppercase tracking-widest text-gray-400 dark:text-gray-600">{group.label}</p>
              <div className="space-y-0.5">
                {group.items.map(({ label, href, icon: Icon }) => {
                  const active = pathname === href || (href !== '/admin' && pathname.startsWith(href));
                  return (
                    <Link
                      key={href}
                      href={href}
                      onClick={() => setSidebarOpen(false)}
                      className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                        active
                          ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400'
                          : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white'
                      }`}
                    >
                      <Icon className="w-5 h-5 flex-shrink-0" />
                      {label}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* Sign out */}
        <div className="p-3 border-t border-gray-200 dark:border-gray-800">
          <button
            onClick={handleSignOut}
            disabled={signingOut}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-400 transition-colors"
          >
            <ArrowLeftEndOnRectangleIcon className="w-5 h-5 flex-shrink-0" />
            {signingOut ? 'Signing out...' : 'Sign Out'}
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="h-16 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 flex items-center gap-4 px-4 lg:px-6">
          <button
            className="lg:hidden text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            onClick={() => setSidebarOpen(true)}
          >
            <Bars3Icon className="w-5 h-5" />
          </button>
          <h1 className="text-base font-semibold text-gray-900 dark:text-white">
            {allNavItems.find((n) => n.href === pathname || (n.href !== '/admin' && pathname.startsWith(n.href)))?.label ?? 'Admin'}
          </h1>
          <div className="ml-auto">
            <Link
              href="/"
              target="_blank"
              className="text-xs text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              View Site →
            </Link>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-4 lg:p-6 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
