'use client';

import Link from 'next/link';
import { useState } from 'react';

export interface HeaderProps {
  locale: 'zh' | 'en';
}

const navItems = [
  { href: '/training', label: '培训课程', labelEn: 'Training' },
  { href: '/destinations', label: '旅行目的地', labelEn: 'Travel' },
  { href: '/photography', label: '水下摄影', labelEn: 'Photo' },
  { href: '/marine-life', label: '海洋生物', labelEn: 'Marine Life' },
  { href: '/gear', label: '装备指南', labelEn: 'Gear' },
  { href: '/community', label: '社区', labelEn: 'Community' },
];

export function Header({ locale }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 ocean-gradient rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
            </div>
            <span className="text-xl font-bold gradient-text">UDC DIVE</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="nav-link text-sm"
              >
                {locale === 'zh' ? item.label : item.labelEn}
              </Link>
            ))}
          </nav>

          {/* Search & Actions */}
          <div className="flex items-center space-x-4">
            {/* Search */}
            <div className="hidden sm:block relative">
              <input
                type="text"
                placeholder={locale === 'zh' ? '搜索...' : 'Search...'}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-48 px-4 py-2 text-sm border border-slate-200 rounded-full focus:ring-2 focus:ring-sky-500 focus:border-transparent outline-none"
              />
              <svg
                className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>

            {/* Language Switcher */}
            <button className="text-sm text-slate-600 hover:text-sky-600 font-medium">
              {locale === 'zh' ? 'EN' : '中文'}
            </button>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-slate-100">
            <nav className="flex flex-col space-y-3">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="nav-link px-2 py-1"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {locale === 'zh' ? item.label : item.labelEn}
                </Link>
              ))}
            </nav>
            {/* Mobile Search */}
            <div className="mt-4 px-2">
              <input
                type="text"
                placeholder={locale === 'zh' ? '搜索...' : 'Search...'}
                className="w-full px-4 py-2 text-sm border border-slate-200 rounded-full focus:ring-2 focus:ring-sky-500 focus:border-transparent outline-none"
              />
            </div>
          </div>
        )}
      </div>
    </header>
  );
}

export default Header;
