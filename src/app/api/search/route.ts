// src/app/api/search/route.ts
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const query = searchParams.get('q');
        const locale = searchParams.get('locale') || 'zh';
        const page = Math.max(1, parseInt(searchParams.get('page') || '1'));
        const limit = Math.min(50, parseInt(searchParams.get('limit') || '10'));
        if (!query) return NextResponse.json({ error: 'Query required' }, { status: 400 });
        const where = { locale, published: true, OR: [{ title: { contains: query, mode: 'insensitive' as const } }, { content: { contains: query, mode: 'insensitive' as const } }] };
        const [articles, total] = await Promise.all([prisma.article.findMany({ where, include: { category: true }, orderBy: { publishedAt: 'desc' }, skip: (page - 1) * limit, take: limit }), prisma.article.count({ where })]);
        return NextResponse.json({ query, results: articles.map((a: { id: string; slug: string; locale: string; title: string; excerpt: string | null; coverImage: string | null; publishedAt: Date | null; category: { slug: string; nameZh: string; nameEn: string } | null }) => ({ id: a.id, slug: a.slug, locale: a.locale, title: a.title, excerpt: a.excerpt, coverImage: a.coverImage, publishedAt: a.publishedAt?.toISOString(), category: a.category ? { slug: a.category.slug, name: a.locale === 'zh' ? a.category.nameZh : a.category.nameEn } : null, highlight: a.excerpt || '' })), pagination: { page, limit, total, pages: Math.ceil(total / limit) } });
    } catch { return NextResponse.json({ error: 'Search failed' }, { status: 500 }); }
}
