import React from 'react';
import type { Metadata, Viewport } from 'next';
import { Plus_Jakarta_Sans, DM_Sans } from 'next/font/google';
import '../styles/tailwind.css';
import { AuthProvider } from '@/contexts/AuthContext';

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-plus-jakarta',
  display: 'swap',
});

const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-dm-sans',
  display: 'swap',
});

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://dailybytenews.in'),
  title: 'DailyByteNews — Tech. Trends. Now.',
  description: 'DailyByteNews covers the latest in AI, technology, and business — fast, trustworthy, and built for the modern reader.',
  icons: {
    icon: [{ url: '/favicon.ico', type: 'image/x-icon' }],
  },
  openGraph: {
    title: 'DailyByteNews — Tech. Trends. Now.',
    description: 'DailyByteNews covers the latest in AI, technology, and business — fast, trustworthy, and built for the modern reader.',
    url: 'https://dailybytenews.in',
    siteName: 'DailyByteNews',
    images: [{ url: '/assets/images/app_logo.png', width: 1200, height: 630 }],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'DailyByteNews — Tech. Trends. Now.',
    description: 'DailyByteNews covers the latest in AI, technology, and business.',
    images: ['/assets/images/app_logo.png'],
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${plusJakartaSans.variable} ${dmSans.variable}`} suppressHydrationWarning>
      <body className={dmSans.className}>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}