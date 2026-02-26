// __tests__/unit/api.openclaw.push.test.ts
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { NextRequest } from 'next/server';

vi.mock('@/lib/prisma', () => ({
  default: {
    article: {
      findMany: vi.fn(),
      count: vi.fn(),
    },
  },
}));

vi.mock('@/lib/auth', () => ({
  verifyApiKey: vi.fn(),
}));

vi.mock('@/lib/openclaw', () => ({
  batchNotifyOpenClaw: vi.fn(),
  checkOpenClawHealth: vi.fn(),
}));

function makeRequest(options: { method?: string; body?: object; authHeader?: string; url?: string } = {}): NextRequest {
  const url = options.url || 'http://localhost/api/openclaw/push';
  const headers: Record<string, string> = { 'content-type': 'application/json' };
  if (options.authHeader) headers['authorization'] = options.authHeader;
  return new NextRequest(url, {
    method: options.method || 'GET',
    headers,
    body: options.body ? JSON.stringify(options.body) : undefined,
  });
}

const mockArticles = [
  {
    id: 'a1',
    slug: 'article-1-zh-abcd',
    locale: 'zh',
    title: '潜水安全指南',
    excerpt: '这是摘要',
    coverImage: null,
    publishedAt: new Date('2025-01-15'),
    readingTime: 3,
    wordCount: 800,
    category: { slug: 'safety', nameZh: '安全', nameEn: 'Safety' },
    tags: [{ tag: { slug: 'beginner', nameZh: '入门', nameEn: 'Beginner' } }],
  },
];

describe('GET /api/openclaw/push', () => {
  beforeEach(() => {
    vi.resetAllMocks();
    process.env.OPENCLAW_GATEWAY_URL = 'http://localhost:18789';
  });

  it('返回 Gateway 状态和待推送文章数', async () => {
    const { default: prisma } = await import('@/lib/prisma');
    vi.mocked(prisma.article.count).mockResolvedValue(5);

    const { checkOpenClawHealth } = await import('@/lib/openclaw');
    vi.mocked(checkOpenClawHealth).mockResolvedValue({ reachable: true });

    const { GET } = await import('@/app/api/openclaw/push/route');
    const req = makeRequest({ url: 'http://localhost/api/openclaw/push?hours=24' });
    const res = await GET(req);
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data.gateway.configured).toBe(true);
    expect(data.gateway.reachable).toBe(true);
    expect(data.pending.count).toBe(5);
    expect(data.pending.hours).toBe(24);
  });

  it('hours 参数最大限制 168 小时', async () => {
    const { default: prisma } = await import('@/lib/prisma');
    vi.mocked(prisma.article.count).mockResolvedValue(0);

    const { checkOpenClawHealth } = await import('@/lib/openclaw');
    vi.mocked(checkOpenClawHealth).mockResolvedValue({ reachable: false, error: 'refused' });

    const { GET } = await import('@/app/api/openclaw/push/route');
    const req = makeRequest({ url: 'http://localhost/api/openclaw/push?hours=999' });
    const res = await GET(req);
    const data = await res.json();

    expect(data.pending.hours).toBe(168);
  });
});

describe('POST /api/openclaw/push', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('未授权返回 401', async () => {
    const { verifyApiKey } = await import('@/lib/auth');
    vi.mocked(verifyApiKey).mockResolvedValue({ valid: false, error: 'Unauthorized' });

    const { POST } = await import('@/app/api/openclaw/push/route');
    const req = makeRequest({ method: 'POST', body: {} });
    const res = await POST(req);

    expect(res.status).toBe(401);
  });

  it('无新文章时返回 sent:0', async () => {
    const { verifyApiKey } = await import('@/lib/auth');
    vi.mocked(verifyApiKey).mockResolvedValue({ valid: true });

    const { default: prisma } = await import('@/lib/prisma');
    vi.mocked(prisma.article.findMany).mockResolvedValue([]);

    const { POST } = await import('@/app/api/openclaw/push/route');
    const req = makeRequest({ method: 'POST', authHeader: 'Bearer key', body: { hours: 24 } });
    const res = await POST(req);
    const data = await res.json();

    expect(data.sent).toBe(0);
    expect(data.message).toContain('没有新发布文章');
  });

  it('dryRun 模式只返回文章列表不实际推送', async () => {
    const { verifyApiKey } = await import('@/lib/auth');
    vi.mocked(verifyApiKey).mockResolvedValue({ valid: true });

    const { default: prisma } = await import('@/lib/prisma');
    vi.mocked(prisma.article.findMany).mockResolvedValue(mockArticles);

    const { batchNotifyOpenClaw } = await import('@/lib/openclaw');

    const { POST } = await import('@/app/api/openclaw/push/route');
    const req = makeRequest({ method: 'POST', authHeader: 'Bearer key', body: { dryRun: true } });
    const res = await POST(req);
    const data = await res.json();

    expect(data.dryRun).toBe(true);
    expect(data.total).toBe(1);
    expect(data.articles[0].title).toBe('潜水安全指南');
    expect(batchNotifyOpenClaw).not.toHaveBeenCalled();
  });

  it('正常推送调用 batchNotifyOpenClaw', async () => {
    const { verifyApiKey } = await import('@/lib/auth');
    vi.mocked(verifyApiKey).mockResolvedValue({ valid: true });

    const { default: prisma } = await import('@/lib/prisma');
    vi.mocked(prisma.article.findMany).mockResolvedValue(mockArticles);

    const { batchNotifyOpenClaw } = await import('@/lib/openclaw');
    vi.mocked(batchNotifyOpenClaw).mockResolvedValue({
      sent: 1,
      failed: 0,
      results: [{ success: true, articleId: 'a1' }],
    });

    const { POST } = await import('@/app/api/openclaw/push/route');
    const req = makeRequest({ method: 'POST', authHeader: 'Bearer key', body: { hours: 24 } });
    const res = await POST(req);
    const data = await res.json();

    expect(batchNotifyOpenClaw).toHaveBeenCalledOnce();
    expect(data.sent).toBe(1);
    expect(data.failed).toBe(0);
    expect(data.total).toBe(1);
  });

  it('按 locale 过滤文章', async () => {
    const { verifyApiKey } = await import('@/lib/auth');
    vi.mocked(verifyApiKey).mockResolvedValue({ valid: true });

    const { default: prisma } = await import('@/lib/prisma');
    vi.mocked(prisma.article.findMany).mockResolvedValue([]);

    const { POST } = await import('@/app/api/openclaw/push/route');
    const req = makeRequest({ method: 'POST', authHeader: 'Bearer key', body: { locale: 'en' } });
    await POST(req);

    expect(prisma.article.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({ locale: 'en' }),
      })
    );
  });

  it('limit 参数最大限制 50', async () => {
    const { verifyApiKey } = await import('@/lib/auth');
    vi.mocked(verifyApiKey).mockResolvedValue({ valid: true });

    const { default: prisma } = await import('@/lib/prisma');
    vi.mocked(prisma.article.findMany).mockResolvedValue([]);

    const { POST } = await import('@/app/api/openclaw/push/route');
    const req = makeRequest({ method: 'POST', authHeader: 'Bearer key', body: { limit: 200 } });
    await POST(req);

    expect(prisma.article.findMany).toHaveBeenCalledWith(
      expect.objectContaining({ take: 50 })
    );
  });
});
