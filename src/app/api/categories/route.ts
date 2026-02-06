// src/app/api/categories/route.ts
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: NextRequest) {
    try {
        const locale = new URL(request.url).searchParams.get('locale') || 'zh';
        const categories = await prisma.category.findMany({ include: { _count: { select: { articles: { where: { published: true, locale } } } } } });
        return NextResponse.json({ categories: categories.map(c => ({ slug: c.slug, name: locale === 'zh' ? c.nameZh : c.nameEn, count: c._count.articles })) });
    } catch { return NextResponse.json({ error: 'Failed' }, { status: 500 }); }
}
