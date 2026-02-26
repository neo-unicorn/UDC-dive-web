// src/app/api/openclaw/push/route.ts
// 批量推送端点：供定时任务 / 手动触发调用，将最近 N 小时发布的文章推送到 OpenClaw

import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { verifyApiKey } from '@/lib/auth';
import { batchNotifyOpenClaw, checkOpenClawHealth } from '@/lib/openclaw';

/**
 * GET /api/openclaw/push
 * 返回可推送文章数量 + Gateway 状态（不需要 API Key）
 */
export async function GET(request: NextRequest): Promise<NextResponse> {
  const { searchParams } = new URL(request.url);
  const hours = Math.min(168, Math.max(1, parseInt(searchParams.get('hours') || '24')));
  const since = new Date(Date.now() - hours * 60 * 60 * 1000);

  const [articleCount, health] = await Promise.all([
    prisma.article.count({ where: { published: true, publishedAt: { gte: since } } }),
    checkOpenClawHealth(),
  ]);

  return NextResponse.json({
    gateway: {
      configured: !!process.env.OPENCLAW_GATEWAY_URL,
      reachable: health.reachable,
      error: health.error,
    },
    pending: {
      count: articleCount,
      since: since.toISOString(),
      hours,
    },
  });
}

/**
 * POST /api/openclaw/push
 * 将最近发布的文章批量推送到 OpenClaw Gateway
 *
 * Body 参数（均可选）：
 * - hours: number  查询最近几小时内发布的文章，默认 24，最大 168（7天）
 * - limit: number  单次最多推送数量，默认 20，最大 50
 * - locale: string 过滤语言（zh/en），默认不过滤
 * - dryRun: boolean 预演模式，只返回待推送列表，不实际发送
 */
export async function POST(request: NextRequest): Promise<NextResponse> {
  const auth = await verifyApiKey(request);
  if (!auth.valid) {
    return NextResponse.json({ error: auth.error || 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json().catch(() => ({}));
  const hours = Math.min(168, Math.max(1, parseInt(body.hours ?? '24')));
  const limit = Math.min(50, Math.max(1, parseInt(body.limit ?? '20')));
  const locale: string | undefined = body.locale;
  const dryRun: boolean = body.dryRun === true;

  const since = new Date(Date.now() - hours * 60 * 60 * 1000);

  const where = {
    published: true,
    publishedAt: { gte: since },
    ...(locale ? { locale } : {}),
  };

  const articles = await prisma.article.findMany({
    where,
    include: { category: true, tags: { include: { tag: true } } },
    orderBy: { publishedAt: 'asc' }, // 从旧到新，保证时间顺序
    take: limit,
  });

  const payloads = articles.map(
    (a: {
      id: string;
      slug: string;
      locale: string;
      title: string;
      excerpt: string | null;
      coverImage: string | null;
      publishedAt: Date | null;
      readingTime: number;
      wordCount: number;
      category: { slug: string; nameZh: string; nameEn: string } | null;
      tags: { tag: { slug: string; nameZh: string; nameEn: string } }[];
    }) => ({
      id: a.id,
      slug: a.slug,
      locale: a.locale,
      title: a.title,
      excerpt: a.excerpt,
      coverImage: a.coverImage,
      publishedAt: a.publishedAt?.toISOString() ?? null,
      readingTime: a.readingTime,
      wordCount: a.wordCount,
      category: a.category
        ? { slug: a.category.slug, name: a.locale === 'zh' ? a.category.nameZh : a.category.nameEn }
        : null,
      tags: a.tags.map((t: { tag: { slug: string; nameZh: string; nameEn: string } }) => ({
        slug: t.tag.slug,
        name: a.locale === 'zh' ? t.tag.nameZh : t.tag.nameEn,
      })),
    })
  );

  if (dryRun) {
    return NextResponse.json({
      dryRun: true,
      total: payloads.length,
      articles: payloads.map((p: { id: string; title: string; publishedAt: string | null }) => ({
        id: p.id,
        title: p.title,
        publishedAt: p.publishedAt,
      })),
    });
  }

  if (payloads.length === 0) {
    return NextResponse.json({ sent: 0, failed: 0, message: `最近 ${hours} 小时内没有新发布文章` });
  }

  const result = await batchNotifyOpenClaw(payloads);

  return NextResponse.json({
    sent: result.sent,
    failed: result.failed,
    total: payloads.length,
    since: since.toISOString(),
    results: result.results.map((r: { success: boolean; articleId: string; error?: string }) => ({
      articleId: r.articleId,
      success: r.success,
      ...(r.error ? { error: r.error } : {}),
    })),
  });
}
