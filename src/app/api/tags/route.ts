// src/app/api/tags/route.ts
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: NextRequest) {
    try {
        const locale = new URL(request.url).searchParams.get('locale') || 'zh';
        const limit = Math.min(50, parseInt(new URL(request.url).searchParams.get('limit') || '20'));
        const tags = await prisma.tag.findMany({ include: { _count: { select: { articles: { where: { article: { published: true, locale } } } } } }, orderBy: { articles: { _count: 'desc' } }, take: limit });
        return NextResponse.json({ tags: tags.filter(t => t._count.articles > 0).map(t => ({ slug: t.slug, name: locale === 'zh' ? t.nameZh : t.nameEn, count: t._count.articles })) });
    } catch { return NextResponse.json({ error: 'Failed' }, { status: 500 }); }
}
