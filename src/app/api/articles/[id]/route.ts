// src/app/api/articles/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { verifyApiKey } from '@/lib/auth';
import { extractExcerpt, countWords, calculateReadingTime } from '@/lib/utils';

export async function GET(_: NextRequest, { params }: { params: { id: string } }) {
    try {
        const article = await prisma.article.findFirst({ where: { OR: [{ id: params.id }, { slug: params.id }] }, include: { category: true, tags: { include: { tag: true } }, linkedArticle: { select: { id: true, slug: true, locale: true, title: true } } } });
        if (!article) return NextResponse.json({ error: 'Not found' }, { status: 404 });
        prisma.article.update({ where: { id: article.id }, data: { viewCount: { increment: 1 } } }).catch(() => { });
        return NextResponse.json({ id: article.id, slug: article.slug, locale: article.locale, title: article.title, excerpt: article.excerpt, content: article.content, coverImage: article.coverImage, metaTitle: article.metaTitle, metaDescription: article.metaDescription, published: article.published, publishedAt: article.publishedAt?.toISOString() || null, viewCount: article.viewCount, wordCount: article.wordCount, readingTime: article.readingTime, category: article.category ? { slug: article.category.slug, name: article.locale === 'zh' ? article.category.nameZh : article.category.nameEn } : null, tags: article.tags.map((t: { tag: { slug: string; nameZh: string; nameEn: string } }) => ({ slug: t.tag.slug, name: article.locale === 'zh' ? t.tag.nameZh : t.tag.nameEn })), linkedArticle: article.linkedArticle, createdAt: article.createdAt.toISOString(), updatedAt: article.updatedAt.toISOString() });
    } catch { return NextResponse.json({ error: 'Failed' }, { status: 500 }); }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
    try {
        const auth = await verifyApiKey(request);
        if (!auth.valid) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        const existing = await prisma.article.findFirst({ where: { OR: [{ id: params.id }, { slug: params.id }] } });
        if (!existing) return NextResponse.json({ error: 'Not found' }, { status: 404 });
        const body = await request.json();
        const data: Record<string, unknown> = {};
        if (body.title) data.title = body.title;
        if (body.content) { data.content = body.content; data.excerpt = extractExcerpt(body.content); data.wordCount = countWords(body.content); data.readingTime = calculateReadingTime(body.content); }
        if (body.published !== undefined) { data.published = body.published; if (body.published && !existing.publishedAt) data.publishedAt = new Date(); }
        await prisma.article.update({ where: { id: existing.id }, data });
        return NextResponse.json({ message: 'Updated' });
    } catch { return NextResponse.json({ error: 'Failed' }, { status: 500 }); }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
    try {
        const auth = await verifyApiKey(request);
        if (!auth.valid) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        const existing = await prisma.article.findFirst({ where: { OR: [{ id: params.id }, { slug: params.id }] } });
        if (!existing) return NextResponse.json({ error: 'Not found' }, { status: 404 });
        await prisma.article.delete({ where: { id: existing.id } });
        return NextResponse.json({ message: 'Deleted' });
    } catch { return NextResponse.json({ error: 'Failed' }, { status: 500 }); }
}
