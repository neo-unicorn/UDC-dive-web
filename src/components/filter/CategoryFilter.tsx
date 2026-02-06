'use client';
import Link from 'next/link';
import type { Category } from '@/types';

export function CategoryFilter({ categories, activeSlug, locale }: { categories: Category[]; activeSlug?: string; locale: 'zh' | 'en' }) {
    return (
        <nav className="flex flex-wrap gap-2 mb-6" data-testid="category-filter">
            <Link href={`/${locale}`} className={`px-4 py-2 text-sm font-medium rounded-full ${!activeSlug ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>{locale === 'zh' ? '全部' : 'All'}</Link>
            {categories.map(c => <Link key={c.slug} href={`/${locale}?category=${c.slug}`} className={`px-4 py-2 text-sm font-medium rounded-full ${activeSlug === c.slug ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>{c.name}</Link>)}
        </nav>
    );
}
export default CategoryFilter;
