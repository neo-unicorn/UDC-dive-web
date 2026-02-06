// src/app/api/tags/route.ts
import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const mockTags = [
    { slug: 'maldives', name: '马尔代夫', articleCount: 15 },
    { slug: 'photography', name: '水下摄影', articleCount: 12 },
    { slug: 'padi', name: 'PADI课程', articleCount: 10 },
    { slug: 'coral', name: '珊瑚礁', articleCount: 8 },
    { slug: 'turtle', name: '海龟', articleCount: 7 },
    { slug: 'wreck', name: '沉船探险', articleCount: 6 },
  ];
  
  return NextResponse.json({ tags: mockTags });
}
