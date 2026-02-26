// __tests__/unit/api.neo.publish.test.ts
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { NextRequest } from 'next/server';

vi.mock('@/lib/prisma', () => ({
  default: {
    article: {
      create: vi.fn(),
    },
    category: {
      findUnique: vi.fn(),
    },
    tag: {
      findUnique: vi.fn(),
    },
    tagsOnArticles: {
      create: vi.fn(),
    },
  },
}));

vi.mock('@/lib/auth', () => ({
  verifyApiKey: vi.fn(),
}));

function makeRequest(body: object, authHeader = 'Bearer test-key'): NextRequest {
  return new NextRequest('http://localhost/api/neo/publish', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      authorization: authHeader,
    },
    body: JSON.stringify(body),
  });
}

const validPayload = {
  version: '1.0',
  skill: 'neo-wright-review',
  timestamp: '2025-01-15T10:00:00Z',
  topic: '潜水安全指南',
  title: '初学者潜水安全完全指南',
  content: '## 前言\n\n这是一篇关于潜水安全的文章。\n\n## 主要内容\n\n潜水前需要做好充分准备。',
  locale: 'zh' as const,
};

const mockCreatedArticle = {
  id: 'neo-article-id-1',
  slug: '初学者潜水安全完全指南-zh-abcd',
  locale: 'zh',
  title: '初学者潜水安全完全指南',
  content: validPayload.content,
  excerpt: '这是一篇关于潜水安全的文章。',
  wordCount: 30,
  readingTime: 1,
  published: true,
  publishedAt: new Date(),
  sourceWorkflow: 'neo-wright-review',
  coverImage: null,
  metaTitle: null,
  metaDescription: null,
  viewCount: 0,
  categoryId: null,
  linkedArticleId: null,
  createdAt: new Date(),
  updatedAt: new Date(),
};

describe('GET /api/neo/publish', () => {
  it('返回 API 状态信息', async () => {
    const { GET } = await import('@/app/api/neo/publish/route');
    const res = await GET();
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data.status).toBe('ready');
    expect(data.version).toBe('1.0');
    expect(data.requiredFields).toContain('title');
    expect(data.requiredFields).toContain('content');
  });
});

describe('POST /api/neo/publish', () => {
  beforeEach(() => {
    vi.resetAllMocks();
    delete process.env.NEXT_PUBLIC_BASE_URL;
  });

  it('成功发布 Neo 工作流文章返回 201', async () => {
    const { verifyApiKey } = await import('@/lib/auth');
    vi.mocked(verifyApiKey).mockResolvedValue({ valid: true });

    const { default: prisma } = await import('@/lib/prisma');
    vi.mocked(prisma.article.create).mockResolvedValue(mockCreatedArticle);

    const { POST } = await import('@/app/api/neo/publish/route');
    const req = makeRequest(validPayload);
    const res = await POST(req);
    const data = await res.json();

    expect(res.status).toBe(201);
    expect(data.success).toBe(true);
    expect(data.articleId).toBe('neo-article-id-1');
    expect(data.slug).toBeDefined();
    expect(data.message).toContain('Neo workflow');
    expect(data.url).toContain('/zh/articles/');
  });

  it('未授权请求返回 401', async () => {
    const { verifyApiKey } = await import('@/lib/auth');
    vi.mocked(verifyApiKey).mockResolvedValue({ valid: false, error: 'Missing authorization header' });

    const { POST } = await import('@/app/api/neo/publish/route');
    const req = makeRequest(validPayload, '');
    const res = await POST(req);

    expect(res.status).toBe(401);
  });

  it('缺少 title 返回 400', async () => {
    const { verifyApiKey } = await import('@/lib/auth');
    vi.mocked(verifyApiKey).mockResolvedValue({ valid: true });

    const { POST } = await import('@/app/api/neo/publish/route');
    const req = makeRequest({ ...validPayload, title: undefined });
    const res = await POST(req);

    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.error).toContain('Missing required fields');
  });

  it('缺少 content 返回 400', async () => {
    const { verifyApiKey } = await import('@/lib/auth');
    vi.mocked(verifyApiKey).mockResolvedValue({ valid: true });

    const { POST } = await import('@/app/api/neo/publish/route');
    const req = makeRequest({ ...validPayload, content: undefined });
    const res = await POST(req);

    expect(res.status).toBe(400);
  });

  it('不支持的协议版本返回 400', async () => {
    const { verifyApiKey } = await import('@/lib/auth');
    vi.mocked(verifyApiKey).mockResolvedValue({ valid: true });

    const { POST } = await import('@/app/api/neo/publish/route');
    const req = makeRequest({ ...validPayload, version: '2.0' });
    const res = await POST(req);

    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.error).toContain('Unsupported protocol version');
  });

  it('1.x 版本的协议格式均有效', async () => {
    const { verifyApiKey } = await import('@/lib/auth');
    vi.mocked(verifyApiKey).mockResolvedValue({ valid: true });

    const { default: prisma } = await import('@/lib/prisma');
    vi.mocked(prisma.article.create).mockResolvedValue(mockCreatedArticle);

    const { POST } = await import('@/app/api/neo/publish/route');
    const req = makeRequest({ ...validPayload, version: '1.5' });
    const res = await POST(req);

    expect(res.status).toBe(201);
  });

  it('默认 published 为 true（立即发布）', async () => {
    const { verifyApiKey } = await import('@/lib/auth');
    vi.mocked(verifyApiKey).mockResolvedValue({ valid: true });

    const { default: prisma } = await import('@/lib/prisma');
    vi.mocked(prisma.article.create).mockResolvedValue(mockCreatedArticle);

    const { POST } = await import('@/app/api/neo/publish/route');
    // 不传 published 字段
    const req = makeRequest({ ...validPayload });
    await POST(req);

    expect(prisma.article.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          published: true,
        }),
      })
    );
  });

  it('显式设置 published: false 创建草稿', async () => {
    const { verifyApiKey } = await import('@/lib/auth');
    vi.mocked(verifyApiKey).mockResolvedValue({ valid: true });

    const { default: prisma } = await import('@/lib/prisma');
    vi.mocked(prisma.article.create).mockResolvedValue({ ...mockCreatedArticle, published: false });

    const { POST } = await import('@/app/api/neo/publish/route');
    const req = makeRequest({ ...validPayload, published: false });
    const res = await POST(req);

    expect(prisma.article.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          published: false,
          publishedAt: null,
        }),
      })
    );
  });

  it('关联存在的分类', async () => {
    const { verifyApiKey } = await import('@/lib/auth');
    vi.mocked(verifyApiKey).mockResolvedValue({ valid: true });

    const { default: prisma } = await import('@/lib/prisma');
    vi.mocked(prisma.category.findUnique).mockResolvedValue({
      id: 'cat-1',
      slug: 'safety',
      nameZh: '安全',
      nameEn: 'Safety',
      createdAt: new Date(),
    });
    vi.mocked(prisma.article.create).mockResolvedValue(mockCreatedArticle);

    const { POST } = await import('@/app/api/neo/publish/route');
    const req = makeRequest({ ...validPayload, categorySlug: 'safety' });
    await POST(req);

    expect(prisma.category.findUnique).toHaveBeenCalledWith({ where: { slug: 'safety' } });
    expect(prisma.article.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          category: { connect: { slug: 'safety' } },
        }),
      })
    );
  });

  it('分类不存在时跳过关联（不报错）', async () => {
    const { verifyApiKey } = await import('@/lib/auth');
    vi.mocked(verifyApiKey).mockResolvedValue({ valid: true });

    const { default: prisma } = await import('@/lib/prisma');
    vi.mocked(prisma.category.findUnique).mockResolvedValue(null);
    vi.mocked(prisma.article.create).mockResolvedValue(mockCreatedArticle);

    const { POST } = await import('@/app/api/neo/publish/route');
    const req = makeRequest({ ...validPayload, categorySlug: 'nonexistent-category' });
    const res = await POST(req);

    expect(res.status).toBe(201);
    expect(prisma.article.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.not.objectContaining({
          category: expect.anything(),
        }),
      })
    );
  });

  it('关联存在的标签', async () => {
    const { verifyApiKey } = await import('@/lib/auth');
    vi.mocked(verifyApiKey).mockResolvedValue({ valid: true });

    const { default: prisma } = await import('@/lib/prisma');
    vi.mocked(prisma.article.create).mockResolvedValue(mockCreatedArticle);
    vi.mocked(prisma.tag.findUnique).mockResolvedValue({
      id: 'tag-1',
      slug: 'beginner',
      nameZh: '入门',
      nameEn: 'Beginner',
      createdAt: new Date(),
    });
    vi.mocked(prisma.tagsOnArticles.create).mockResolvedValue({
      articleId: 'neo-article-id-1',
      tagId: 'tag-1',
    });

    const { POST } = await import('@/app/api/neo/publish/route');
    const req = makeRequest({ ...validPayload, tagSlugs: ['beginner'] });
    await POST(req);

    expect(prisma.tagsOnArticles.create).toHaveBeenCalledWith({
      data: { articleId: 'neo-article-id-1', tagId: 'tag-1' },
    });
  });

  it('使用 NEXT_PUBLIC_BASE_URL 构建文章 URL', async () => {
    process.env.NEXT_PUBLIC_BASE_URL = 'https://diveinfo.example.com';
    const { verifyApiKey } = await import('@/lib/auth');
    vi.mocked(verifyApiKey).mockResolvedValue({ valid: true });

    const { default: prisma } = await import('@/lib/prisma');
    vi.mocked(prisma.article.create).mockResolvedValue(mockCreatedArticle);

    const { POST } = await import('@/app/api/neo/publish/route');
    const req = makeRequest(validPayload);
    const res = await POST(req);
    const data = await res.json();

    expect(data.url).toContain('https://diveinfo.example.com');
  });
});
