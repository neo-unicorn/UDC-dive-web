// src/app/api/search/route.ts
import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get('q') || '';
  
  // 临时返回空结果
  return NextResponse.json({
    articles: [],
    total: 0,
    page: 1,
    limit: 10,
    query: q,
  });
}
