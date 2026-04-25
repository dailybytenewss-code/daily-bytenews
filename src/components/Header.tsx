'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import AppLogo from '@/components/ui/AppLogo';
import Icon from '@/components/ui/AppIcon';

const navLinks = [
  { label: 'Home', href: '/' },
  { label: 'AI & Tech', href: '/category?cat=ai-tech' },
  { label: 'Business', href: '/category?cat=business' },
  { label: 'Trending', href: '/category?cat=trending' },
];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentDate, setCurrentDate] = useState('');
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const now = new Date();
    const options: Intl.DateTimeFormatOptions = {
      weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
    };
    setCurrentDate(now.toLocaleDateString('en-IN', options));
  }, []);

  useEffect(() => {
    const savedDark = localStorage.getItem('darkMode') === 'true';
    setDarkMode(savedDark);
    if (savedDark) {
      document.documentElement.classList.add('dark');
    }
  }, []);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (searchOpen && searchRef.current) {
      searchRef.current.focus();
    }
  }, [searchOpen]);

  const toggleDarkMode = () => {
    const next = !darkMode;
    setDarkMode(next);
    localStorage.setItem('darkMode', String(next));
    if (next) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/?search=${encodeURIComponent(searchQuery.trim())}`;
      setSearchOpen(false);
      setSearchQuery('');
    }
  };

  return (
    <>
      {/* Top Bar */}
      <div className="bg-dark-navy text-white py-2 px-4 hidden md:block">
        <div className="max-w-[1200px] mx-auto flex items-center justify-between">
          <span className="text-xs text-gray-400 font-medium">{currentDate}</span>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <a href="https://twitter.com/daily_bytenews" target="_blank" rel="noopener noreferrer" aria-label="Twitter/X"
                className="w-6 h-6 flex items-center justify-center text-gray-400 hover:text-white transition-colors">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
              <a href="https://instagram.com/daily_bytenews" target="_blank" rel="noopener noreferrer" aria-label="Instagram"
                className="w-6 h-6 flex items-center justify-center text-gray-400 hover:text-white transition-colors">
                <Icon name="CameraIcon" size={14} />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <header
        className={`sticky top-0 z-50 bg-card transition-all duration-300 ${
          scrolled ? 'shadow-md py-2' : 'py-0'
        }`}
        style={{ borderBottom: '3px solid #1A6DD2' }}
      >
        <div className="max-w-[1200px] mx-auto px-4">
          <div className={`flex items-center justify-between transition-all duration-300 ${scrolled ? 'h-14' : 'h-16'}`}>
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 flex-shrink-0">
              <AppLogo size={scrolled ? 32 : 36} />
              <div className="flex flex-col">
                <span className="font-display font-800 text-lg leading-none tracking-tight" style={{ letterSpacing: '-0.03em' }}>
                  <span className="text-foreground font-bold">Daily</span>
                  <span style={{ color: '#1A6DD2' }} className="font-bold">Byte</span>
                  <span className="text-foreground font-bold">News</span>
                </span>
                {!scrolled && (
                  <span className="text-[10px] text-muted font-medium tracking-wider uppercase hidden sm:block">
                    Tech. Trends. Now.
                  </span>
                )}
              </div>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden lg:flex items-center gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="px-3 py-2 text-sm font-semibold text-muted hover:text-primary transition-colors rounded-md hover:bg-primary/5"
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* Right Actions */}
            <div className="flex items-center gap-2">
              <div className="relative flex items-center">
                {searchOpen ? (
                  <form onSubmit={handleSearchSubmit} className="flex items-center">
                    <input
                      ref={searchRef}
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search articles..."
                      className="w-48 sm:w-64 px-3 py-1.5 text-sm border border-border rounded-lg bg-background text-foreground placeholder-muted focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
                      onBlur={() => { if (!searchQuery) setSearchOpen(false); }}
                    />
                    <button type="submit" className="ml-1 p-1.5 text-muted hover:text-primary">
                      <Icon name="MagnifyingGlassIcon" size={18} />
                    </button>
                    <button type="button" onClick={() => { setSearchOpen(false); setSearchQuery(''); }} className="p-1.5 text-muted hover:text-foreground">
                      <Icon name="XMarkIcon" size={18} />
                    </button>
                  </form>
                ) : (
                  <button
                    onClick={() => setSearchOpen(true)}
                    className="p-2 text-muted hover:text-primary transition-colors rounded-md hover:bg-primary/5"
                    aria-label="Open search"
                  >
                    <Icon name="MagnifyingGlassIcon" size={20} />
                  </button>
                )}
              </div>

              <button
                onClick={toggleDarkMode}
                className="p-2 text-muted hover:text-primary transition-colors rounded-md hover:bg-primary/5"
                aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
              >
                {darkMode ? <Icon name="SunIcon" size={20} /> : <Icon name="MoonIcon" size={20} />}
              </button>

              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2 text-muted hover:text-foreground transition-colors"
                aria-label="Toggle mobile menu"
              >
                {mobileMenuOpen ? <Icon name="XMarkIcon" size={22} /> : <Icon name="Bars3Icon" size={22} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-card border-t border-border shadow-lg">
            <nav className="max-w-[1200px] mx-auto px-4 py-3 flex flex-col gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="px-3 py-3 text-sm font-semibold text-foreground hover:text-primary hover:bg-primary/5 rounded-md transition-colors min-h-[44px] flex items-center"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              <div className="pt-2 border-t border-border mt-2">
                <form onSubmit={handleSearchSubmit} className="flex gap-2">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search articles..."
                    className="flex-1 px-3 py-2 text-sm border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
                  />
                  <button type="submit" className="px-4 py-2 bg-primary text-white text-sm font-semibold rounded-lg">
                    Search
                  </button>
                </form>
              </div>
            </nav>
          </div>
        )}
      </header>

      {/* Breaking News Ticker */}
      <div className="bg-breaking-red text-white py-1.5 overflow-hidden">
        <div className="flex items-center">
          <div className="flex-shrink-0 bg-white text-breaking-red text-[10px] font-bold uppercase tracking-widest px-3 py-0.5 mx-3 rounded">
            BYTE ALERT
          </div>
          <div className="overflow-hidden flex-1">
            <div className="news-ticker flex gap-8 text-xs font-medium">
              {[
                'OpenAI hits $25B annualized revenue, eyes 2027 IPO',
                "Anthropic's MCP crosses 97 million developer installs",
                'TSMC posts record Q1 revenue on AI chip demand surge',
                'Atlassian cuts 1,600 jobs in AI-first restructuring',
                'India UPI hits 18 billion monthly transactions milestone',
                'OpenAI hits $25B annualized revenue, eyes 2027 IPO',
                "Anthropic's MCP crosses 97 million developer installs",
                'TSMC posts record Q1 revenue on AI chip demand surge',
                'Atlassian cuts 1,600 jobs in AI-first restructuring',
                'India UPI hits 18 billion monthly transactions milestone',
              ].map((item, i) => (
                <span key={i} className="flex-shrink-0 flex items-center gap-2">
                  <span className="w-1 h-1 rounded-full bg-white/60 inline-block" />
                  {item}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
