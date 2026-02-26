// __tests__/unit/openclaw.test.ts
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { notifyOpenClaw, batchNotifyOpenClaw, checkOpenClawHealth } from '@/lib/openclaw';

const mockArticle = {
  id: 'article-1',
  slug: 'test-article-zh-abcd',
  locale: 'zh',
  title: '测试潜水文章',
  excerpt: '这是文章摘要，介绍潜水技巧。',
  coverImage: null,
  publishedAt: '2025-01-15T10:00:00Z',
  readingTime: 3,
  wordCount: 800,
  category: { slug: 'tips', name: '潜水技巧' },
  tags: [{ slug: 'beginner', name: '入门' }],
};

describe('notifyOpenClaw', () => {
  beforeEach(() => {
    vi.resetAllMocks();
    process.env.OPENCLAW_GATEWAY_URL = 'http://localhost:18789';
    process.env.OPENCLAW_HOOK_TOKEN = 'test-hook-token-64chars';
    process.env.OPENCLAW_CHANNEL = 'telegram';
    process.env.OPENCLAW_TO = 'chat_123456';
    process.env.NEXT_PUBLIC_BASE_URL = 'https://diveinfo.example.com';
  });

  afterEach(() => {
    delete process.env.OPENCLAW_GATEWAY_URL;
    delete process.env.OPENCLAW_HOOK_TOKEN;
    delete process.env.OPENCLAW_CHANNEL;
    delete process.env.OPENCLAW_TO;
    delete process.env.NEXT_PUBLIC_BASE_URL;
  });

  it('成功发送返回 success: true', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({ ok: true, status: 200, text: async () => 'ok' })
    );

    const result = await notifyOpenClaw(mockArticle);

    expect(result.success).toBe(true);
    expect(result.articleId).toBe('article-1');
  });

  it('发送到正确的 Gateway 端点', async () => {
    const mockFetch = vi.fn().mockResolvedValue({ ok: true, text: async () => '' });
    vi.stubGlobal('fetch', mockFetch);

    await notifyOpenClaw(mockArticle);

    expect(mockFetch).toHaveBeenCalledWith(
      'http://localhost:18789/hooks/agent',
      expect.objectContaining({ method: 'POST' })
    );
  });

  it('携带正确的 Authorization 头', async () => {
    const mockFetch = vi.fn().mockResolvedValue({ ok: true, text: async () => '' });
    vi.stubGlobal('fetch', mockFetch);

    await notifyOpenClaw(mockArticle);

    const [, options] = mockFetch.mock.calls[0];
    expect(options.headers['Authorization']).toBe('Bearer test-hook-token-64chars');
  });

  it('消息包含文章标题', async () => {
    const mockFetch = vi.fn().mockResolvedValue({ ok: true, text: async () => '' });
    vi.stubGlobal('fetch', mockFetch);

    await notifyOpenClaw(mockArticle);

    const [, options] = mockFetch.mock.calls[0];
    const body = JSON.parse(options.body);
    expect(body.message).toContain('测试潜水文章');
  });

  it('消息包含文章 URL', async () => {
    const mockFetch = vi.fn().mockResolvedValue({ ok: true, text: async () => '' });
    vi.stubGlobal('fetch', mockFetch);

    await notifyOpenClaw(mockArticle);

    const [, options] = mockFetch.mock.calls[0];
    const body = JSON.parse(options.body);
    expect(body.message).toContain('https://diveinfo.example.com/zh/articles/test-article-zh-abcd');
  });

  it('消息包含分类信息', async () => {
    const mockFetch = vi.fn().mockResolvedValue({ ok: true, text: async () => '' });
    vi.stubGlobal('fetch', mockFetch);

    await notifyOpenClaw(mockArticle);

    const [, options] = mockFetch.mock.calls[0];
    const body = JSON.parse(options.body);
    expect(body.message).toContain('潜水技巧');
  });

  it('消息包含标签信息', async () => {
    const mockFetch = vi.fn().mockResolvedValue({ ok: true, text: async () => '' });
    vi.stubGlobal('fetch', mockFetch);

    await notifyOpenClaw(mockArticle);

    const [, options] = mockFetch.mock.calls[0];
    const body = JSON.parse(options.body);
    expect(body.message).toContain('入门');
  });

  it('配置了 channel 和 to 时传入请求体', async () => {
    const mockFetch = vi.fn().mockResolvedValue({ ok: true, text: async () => '' });
    vi.stubGlobal('fetch', mockFetch);

    await notifyOpenClaw(mockArticle);

    const [, options] = mockFetch.mock.calls[0];
    const body = JSON.parse(options.body);
    expect(body.channel).toBe('telegram');
    expect(body.to).toBe('chat_123456');
    expect(body.deliver).toBe(true);
  });

  it('未配置 OPENCLAW_GATEWAY_URL 时返回失败（不抛出）', async () => {
    delete process.env.OPENCLAW_GATEWAY_URL;

    const result = await notifyOpenClaw(mockArticle);

    expect(result.success).toBe(false);
    expect(result.error).toContain('OPENCLAW_GATEWAY_URL');
  });

  it('未配置 OPENCLAW_HOOK_TOKEN 时返回失败（不抛出）', async () => {
    delete process.env.OPENCLAW_HOOK_TOKEN;

    const result = await notifyOpenClaw(mockArticle);

    expect(result.success).toBe(false);
    expect(result.error).toContain('OPENCLAW_HOOK_TOKEN');
  });

  it('Gateway 返回 4xx 时返回失败', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({ ok: false, status: 401, text: async () => 'Unauthorized' })
    );

    const result = await notifyOpenClaw(mockArticle);

    expect(result.success).toBe(false);
    expect(result.error).toContain('401');
  });

  it('网络超时时返回失败（不抛出）', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('The operation was aborted')));

    const result = await notifyOpenClaw(mockArticle);

    expect(result.success).toBe(false);
    expect(result.error).toBeDefined();
  });

  it('Gateway URL 末尾有斜杠时正确拼接端点', async () => {
    process.env.OPENCLAW_GATEWAY_URL = 'http://localhost:18789/';
    const mockFetch = vi.fn().mockResolvedValue({ ok: true, text: async () => '' });
    vi.stubGlobal('fetch', mockFetch);

    await notifyOpenClaw(mockArticle);

    expect(mockFetch).toHaveBeenCalledWith(
      'http://localhost:18789/hooks/agent',
      expect.anything()
    );
  });

  it('没有分类的文章消息中不包含分类行', async () => {
    const articleWithoutCategory = { ...mockArticle, category: null, tags: [] };
    const mockFetch = vi.fn().mockResolvedValue({ ok: true, text: async () => '' });
    vi.stubGlobal('fetch', mockFetch);

    await notifyOpenClaw(articleWithoutCategory);

    const [, options] = mockFetch.mock.calls[0];
    const body = JSON.parse(options.body);
    expect(body.message).not.toContain('📂');
  });
});

describe('batchNotifyOpenClaw', () => {
  beforeEach(() => {
    process.env.OPENCLAW_GATEWAY_URL = 'http://localhost:18789';
    process.env.OPENCLAW_HOOK_TOKEN = 'test-token';
    vi.useFakeTimers();
  });

  afterEach(() => {
    delete process.env.OPENCLAW_GATEWAY_URL;
    delete process.env.OPENCLAW_HOOK_TOKEN;
    vi.useRealTimers();
  });

  it('空数组返回 sent:0 failed:0', async () => {
    const result = await batchNotifyOpenClaw([]);
    expect(result.sent).toBe(0);
    expect(result.failed).toBe(0);
    expect(result.results).toHaveLength(0);
  });

  it('统计成功和失败数量', async () => {
    let callCount = 0;
    vi.stubGlobal(
      'fetch',
      vi.fn().mockImplementation(() => {
        callCount++;
        // 第一篇成功，第二篇失败
        return callCount === 1
          ? Promise.resolve({ ok: true, text: async () => '' })
          : Promise.resolve({ ok: false, status: 500, text: async () => 'error' });
      })
    );

    const promise = batchNotifyOpenClaw([mockArticle, { ...mockArticle, id: 'article-2' }]);
    // 推进所有定时器
    await vi.runAllTimersAsync();
    const result = await promise;

    expect(result.sent).toBe(1);
    expect(result.failed).toBe(1);
    expect(result.results).toHaveLength(2);
  });
});

describe('checkOpenClawHealth', () => {
  beforeEach(() => {
    process.env.OPENCLAW_GATEWAY_URL = 'http://localhost:18789';
  });

  afterEach(() => {
    delete process.env.OPENCLAW_GATEWAY_URL;
  });

  it('Gateway 可达时返回 reachable: true', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: true }));

    const result = await checkOpenClawHealth();

    expect(result.reachable).toBe(true);
  });

  it('Gateway 不可达时返回 reachable: false', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('Connection refused')));

    const result = await checkOpenClawHealth();

    expect(result.reachable).toBe(false);
    expect(result.error).toContain('Connection refused');
  });

  it('未配置 URL 时返回 reachable: false', async () => {
    delete process.env.OPENCLAW_GATEWAY_URL;

    const result = await checkOpenClawHealth();

    expect(result.reachable).toBe(false);
    expect(result.error).toContain('OPENCLAW_GATEWAY_URL');
  });
});
