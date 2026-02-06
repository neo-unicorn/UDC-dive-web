// src/app/api/articles/route.ts
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { verifyApiKey } from '@/lib/auth';
import { generateSlug, extractExcerpt, countWords, calculateReadingTime } from '@/lib/utils';
import type { ArticleListResponse, CreateArticleResponse, ErrorResponse } from '@/types/api';

export async function GET(request: NextRequest): Promise<NextResponse<ArticleListResponse | ErrorResponse>> {
    try {
        const { searchParams } = new URL(request.url);
        const page = Math.max(1, parseInt(searchParams.get('page') || '1'));
        const limit = Math.min(50, Math.max(1, parseInt(searchParams.get('limit') || '12')));
        const locale = searchParams.get('locale') || 'zh';
        const category = searchParams.get('category');
        const where: Record<string, unknown> = { locale, published: true, ...(category && { category: { slug: category } }) };
        const [articles, total] = await Promise.all([
            prisma.article.findMany({ where, include: { category: true, tags: { include: { tag: true } } }, orderBy: { publishedAt: 'desc' }, skip: (page - 1) * limit, take: limit }),
            prisma.article.count({ where }),
        ]);
        return NextResponse.json({ articles: articles.map(a => ({ id: a.id, slug: a.slug, locale: a.locale, title: a.title, excerpt: a.excerpt, coverImage: a.coverImage, publishedAt: a.publishedAt?.toISOString() || null, viewCount: a.viewCount, category: a.category ? { slug: a.category.slug, name: a.locale === 'zh' ? a.category.nameZh : a.category.nameEn } : null, tags: a.tags.map(t => ({ slug: t.tag.slug, name: a.locale === 'zh' ? t.tag.nameZh : t.tag.nameEn })) })), pagination: { page, limit, total, pages: Math.ceil(total / limit) } });
    } catch { return NextResponse.json({ error: 'Failed to fetch articles' }, { status: 500 }); }
}

export async function POST(request: NextRequest): Promise<NextResponse<CreateArticleResponse | ErrorResponse>> {
    try {
        const auth = await verifyApiKey(request);
        if (!auth.valid) return NextResponse.json({ error: auth.error || 'Unauthorized' }, { status: 401 });
        const body = await request.json();
        if (!body.title || !body.content) return NextResponse.json({ error: 'Title and content required' }, { status: 400 });
        const locale = body.locale || 'zh';
        const article = await prisma.article.create({ data: { slug: generateSlug(body.title, locale), locale, title: body.title, content: body.content, excerpt: extractExcerpt(body.content), wordCount: countWords(body.content), readingTime: calculateReadingTime(body.content), published: body.published || false, publishedAt: body.published ? new Date() : null, ...(body.categorySlug && { category: { connect: { slug: body.categorySlug } } }) } });
        return NextResponse.json({ id: article.id, slug: article.slug, message: 'Created' }, { status: 201 });
    } catch { return NextResponse.json({ error: 'Failed to create article' }, { status: 500 }); }
}
