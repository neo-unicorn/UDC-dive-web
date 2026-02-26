// __tests__/unit/api.articles.test.ts
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { NextRequest } from 'next/server';

// Mock prisma
vi.mock('@/lib/prisma', () => ({
  default: {
    article: {
      findMany: vi.fn(),
      count: vi.fn(),
      create: vi.fn(),
      findFirst: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    },
  },
}));

// Mock auth
vi.mock('@/lib/auth', () => ({
  verifyApiKey: vi.fn(),
}));

function makeRequest(
  url: string,
  options: { method?: string; body?: object; authHeader?: string } = {}
): NextRequest {
  const headers: Record<string, string> = { 'content-type': 'application/json' };
  if (options.authHeader) headers['authorization'] = options.authHeader;
  return new NextRequest(url, {
    method: options.method || 'GET',
    headers,
    body: options.body ? JSON.stringify(options.body) : undefined,
  });
}

// 文章 mock 数据
const mockArticle = {
  id: 'article-id-1',
  slug: 'test-article-zh-abc1',
  locale: 'zh',
  title: '测试文章标题',
  excerpt: '这是摘要内容',
  content: '## 正文\n\n这是文章内容。',
  coverImage: null,
  metaTitle: null,
  metaDescription: null,
  published: true,
  publishedAt: new Date('2025-01-15'),
  viewCount: 100,
  wordCount: 50,
  readingTime: 1,
  sourceWorkflow: null,
  linkedArticleId: null,
  linkedArticle: null,
  categoryId: null,
  category: { slug: 'diving-tips', nameZh: '潜水技巧', nameEn: 'Diving Tips' },
  tags: [{ tag: { slug: 'beginner', nameZh: '入门', nameEn: 'Beginner' } }],
  createdAt: new Date('2025-01-15'),
  updatedAt: new Date('2025-01-15'),
};

describe('GET /api/articles', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('应该返回分页文章列表', async () => {
    const { default: prisma } = await import('@/lib/prisma');
    vi.mocked(prisma.article.findMany).mockResolvedValue([mockArticle]);
    vi.mocked(prisma.article.count).mockResolvedValue(1);

    const { GET } = await import('@/app/api/articles/route');
    const req = makeRequest('http://localhost/api/articles?locale=zh&page=1&limit=12');
    const res = await GET(req);
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data.articles).toHaveLength(1);
    expect(data.articles[0].title).toBe('测试文章标题');
    expect(data.pagination.total).toBe(1);
    expect(data.pagination.pages).toBe(1);
  });

  it('分页参数边界：page 最小值为1', async () => {
    const { default: prisma } = await import('@/lib/prisma');
    vi.mocked(prisma.article.findMany).mockResolvedValue([]);
    vi.mocked(prisma.article.count).mockResolvedValue(0);

    const { GET } = await import('@/app/api/articles/route');
    const req = makeRequest('http://localhost/api/articles?page=-1');
    const res = await GET(req);
    const data = await res.json();

    expect(data.pagination.page).toBe(1);
  });

  it('分页参数边界：limit 最大值为50', async () => {
    const { default: prisma } = await import('@/lib/prisma');
    vi.mocked(prisma.article.findMany).mockResolvedValue([]);
    vi.mocked(prisma.article.count).mockResolvedValue(0);

    const { GET } = await import('@/app/api/articles/route');
    const req = makeRequest('http://localhost/api/articles?limit=100');
    const res = await GET(req);
    const data = await res.json();

    expect(data.pagination.limit).toBe(50);
  });

  it('按分类过滤文章', async () => {
    const { default: prisma } = await import('@/lib/prisma');
    vi.mocked(prisma.article.findMany).mockResolvedValue([mockArticle]);
    vi.mocked(prisma.article.count).mockResolvedValue(1);

    const { GET } = await import('@/app/api/articles/route');
    const req = makeRequest('http://localhost/api/articles?category=diving-tips');
    await GET(req);

    expect(prisma.article.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          category: { slug: 'diving-tips' },
        }),
      })
    );
  });

  it('数据库报错返回 500', async () => {
    const { default: prisma } = await import('@/lib/prisma');
    vi.mocked(prisma.article.findMany).mockRejectedValue(new Error('DB error'));
    vi.mocked(prisma.article.count).mockRejectedValue(new Error('DB error'));

    const { GET } = await import('@/app/api/articles/route');
    const req = makeRequest('http://localhost/api/articles');
    const res = await GET(req);

    expect(res.status).toBe(500);
  });
});

describe('POST /api/articles', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('应该成功创建文章并返回 201', async () => {
    const { verifyApiKey } = await import('@/lib/auth');
    vi.mocked(verifyApiKey).mockResolvedValue({ valid: true });

    const { default: prisma } = await import('@/lib/prisma');
    vi.mocked(prisma.article.create).mockResolvedValue(mockArticle);

    const { POST } = await import('@/app/api/articles/route');
    const req = makeRequest('http://localhost/api/articles', {
      method: 'POST',
      authHeader: 'Bearer test-key',
      body: { title: '测试文章', content: '## 正文\n\n内容', locale: 'zh' },
    });
    const res = await POST(req);
    const data = await res.json();

    expect(res.status).toBe(201);
    expect(data.slug).toBeDefined();
    expect(data.message).toBe('Created');
  });

  it('缺少 title 应该返回 400', async () => {
    const { verifyApiKey } = await import('@/lib/auth');
    vi.mocked(verifyApiKey).mockResolvedValue({ valid: true });

    const { POST } = await import('@/app/api/articles/route');
    const req = makeRequest('http://localhost/api/articles', {
      method: 'POST',
      authHeader: 'Bearer test-key',
      body: { content: '内容' },
    });
    const res = await POST(req);

    expect(res.status).toBe(400);
  });

  it('缺少 content 应该返回 400', async () => {
    const { verifyApiKey } = await import('@/lib/auth');
    vi.mocked(verifyApiKey).mockResolvedValue({ valid: true });

    const { POST } = await import('@/app/api/articles/route');
    const req = makeRequest('http://localhost/api/articles', {
      method: 'POST',
      authHeader: 'Bearer test-key',
      body: { title: '标题' },
    });
    const res = await POST(req);

    expect(res.status).toBe(400);
  });

  it('未授权请求返回 401', async () => {
    const { verifyApiKey } = await import('@/lib/auth');
    vi.mocked(verifyApiKey).mockResolvedValue({ valid: false, error: 'Missing authorization header' });

    const { POST } = await import('@/app/api/articles/route');
    const req = makeRequest('http://localhost/api/articles', {
      method: 'POST',
      body: { title: '标题', content: '内容' },
    });
    const res = await POST(req);

    expect(res.status).toBe(401);
  });
});

describe('GET /api/articles/[id]', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('存在的文章应该返回 200', async () => {
    const { default: prisma } = await import('@/lib/prisma');
    vi.mocked(prisma.article.findFirst).mockResolvedValue(mockArticle);
    vi.mocked(prisma.article.update).mockResolvedValue(mockArticle);

    const { GET } = await import('@/app/api/articles/[id]/route');
    const req = makeRequest('http://localhost/api/articles/article-id-1');
    const res = await GET(req, { params: { id: 'article-id-1' } });
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data.title).toBe('测试文章标题');
    expect(data.content).toBeDefined();
  });

  it('不存在的文章应该返回 404', async () => {
    const { default: prisma } = await import('@/lib/prisma');
    vi.mocked(prisma.article.findFirst).mockResolvedValue(null);

    const { GET } = await import('@/app/api/articles/[id]/route');
    const req = makeRequest('http://localhost/api/articles/nonexistent');
    const res = await GET(req, { params: { id: 'nonexistent' } });

    expect(res.status).toBe(404);
  });

  it('支持通过 slug 查找文章', async () => {
    const { default: prisma } = await import('@/lib/prisma');
    vi.mocked(prisma.article.findFirst).mockResolvedValue(mockArticle);
    vi.mocked(prisma.article.update).mockResolvedValue(mockArticle);

    const { GET } = await import('@/app/api/articles/[id]/route');
    const req = makeRequest('http://localhost/api/articles/test-article-zh-abc1');
    await GET(req, { params: { id: 'test-article-zh-abc1' } });

    expect(prisma.article.findFirst).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { OR: [{ id: 'test-article-zh-abc1' }, { slug: 'test-article-zh-abc1' }] },
      })
    );
  });
});

describe('PUT /api/articles/[id]', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('应该成功更新文章', async () => {
    const { verifyApiKey } = await import('@/lib/auth');
    vi.mocked(verifyApiKey).mockResolvedValue({ valid: true });

    const { default: prisma } = await import('@/lib/prisma');
    vi.mocked(prisma.article.findFirst).mockResolvedValue(mockArticle);
    vi.mocked(prisma.article.update).mockResolvedValue({ ...mockArticle, title: '新标题' });

    const { PUT } = await import('@/app/api/articles/[id]/route');
    const req = makeRequest('http://localhost/api/articles/article-id-1', {
      method: 'PUT',
      authHeader: 'Bearer test-key',
      body: { title: '新标题' },
    });
    const res = await PUT(req, { params: { id: 'article-id-1' } });
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data.message).toBe('Updated');
  });

  it('更新不存在的文章返回 404', async () => {
    const { verifyApiKey } = await import('@/lib/auth');
    vi.mocked(verifyApiKey).mockResolvedValue({ valid: true });

    const { default: prisma } = await import('@/lib/prisma');
    vi.mocked(prisma.article.findFirst).mockResolvedValue(null);

    const { PUT } = await import('@/app/api/articles/[id]/route');
    const req = makeRequest('http://localhost/api/articles/nonexistent', {
      method: 'PUT',
      authHeader: 'Bearer test-key',
      body: { title: '新标题' },
    });
    const res = await PUT(req, { params: { id: 'nonexistent' } });

    expect(res.status).toBe(404);
  });

  it('发布文章时自动设置 publishedAt', async () => {
    const { verifyApiKey } = await import('@/lib/auth');
    vi.mocked(verifyApiKey).mockResolvedValue({ valid: true });

    const { default: prisma } = await import('@/lib/prisma');
    const unpublishedArticle = { ...mockArticle, published: false, publishedAt: null };
    vi.mocked(prisma.article.findFirst).mockResolvedValue(unpublishedArticle);
    vi.mocked(prisma.article.update).mockResolvedValue({ ...mockArticle, published: true });

    const { PUT } = await import('@/app/api/articles/[id]/route');
    const req = makeRequest('http://localhost/api/articles/article-id-1', {
      method: 'PUT',
      authHeader: 'Bearer test-key',
      body: { published: true },
    });
    await PUT(req, { params: { id: 'article-id-1' } });

    expect(prisma.article.update).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          published: true,
          publishedAt: expect.any(Date),
        }),
      })
    );
  });
});

describe('DELETE /api/articles/[id]', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('应该成功删除文章', async () => {
    const { verifyApiKey } = await import('@/lib/auth');
    vi.mocked(verifyApiKey).mockResolvedValue({ valid: true });

    const { default: prisma } = await import('@/lib/prisma');
    vi.mocked(prisma.article.findFirst).mockResolvedValue(mockArticle);
    vi.mocked(prisma.article.delete).mockResolvedValue(mockArticle);

    const { DELETE } = await import('@/app/api/articles/[id]/route');
    const req = makeRequest('http://localhost/api/articles/article-id-1', {
      method: 'DELETE',
      authHeader: 'Bearer test-key',
    });
    const res = await DELETE(req, { params: { id: 'article-id-1' } });
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data.message).toBe('Deleted');
  });

  it('删除不存在的文章返回 404', async () => {
    const { verifyApiKey } = await import('@/lib/auth');
    vi.mocked(verifyApiKey).mockResolvedValue({ valid: true });

    const { default: prisma } = await import('@/lib/prisma');
    vi.mocked(prisma.article.findFirst).mockResolvedValue(null);

    const { DELETE } = await import('@/app/api/articles/[id]/route');
    const req = makeRequest('http://localhost/api/articles/nonexistent', {
      method: 'DELETE',
      authHeader: 'Bearer test-key',
    });
    const res = await DELETE(req, { params: { id: 'nonexistent' } });

    expect(res.status).toBe(404);
  });

  it('未授权删除返回 401', async () => {
    const { verifyApiKey } = await import('@/lib/auth');
    vi.mocked(verifyApiKey).mockResolvedValue({ valid: false, error: 'Unauthorized' });

    const { DELETE } = await import('@/app/api/articles/[id]/route');
    const req = makeRequest('http://localhost/api/articles/article-id-1', {
      method: 'DELETE',
    });
    const res = await DELETE(req, { params: { id: 'article-id-1' } });

    expect(res.status).toBe(401);
  });
});
