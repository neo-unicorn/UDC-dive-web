// src/app/api/categories/route.ts
import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const mockCategories = [
    { slug: 'training', name: '培训课程', articleCount: 20 },
    { slug: 'travel', name: '旅行目的地', articleCount: 35 },
    { slug: 'photo', name: '水下摄影', articleCount: 18 },
    { slug: 'marine-life', name: '海洋生物', articleCount: 25 },
    { slug: 'gear', name: '装备指南', articleCount: 12 },
    { slug: 'community', name: '社区', articleCount: 8 },
  ];
  
  return NextResponse.json({ categories: mockCategories });
}
