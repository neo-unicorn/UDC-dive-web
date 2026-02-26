// __tests__/unit/auth.test.ts
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { NextRequest } from 'next/server';
import { extractBearerToken, verifyApiKey } from '@/lib/auth';

// Mock prisma
vi.mock('@/lib/prisma', () => ({
  default: {
    apiKey: {
      findUnique: vi.fn(),
    },
  },
}));

function makeRequest(authHeader?: string): NextRequest {
  const headers: Record<string, string> = {};
  if (authHeader) headers['authorization'] = authHeader;
  return new NextRequest('http://localhost/api/test', { headers });
}

describe('extractBearerToken', () => {
  it('从 Authorization 头提取 Bearer token', () => {
    const req = makeRequest('Bearer my-secret-token');
    const token = extractBearerToken(req);
    expect(token).toBe('my-secret-token');
  });

  it('没有 Authorization 头返回 null', () => {
    const req = makeRequest();
    expect(extractBearerToken(req)).toBeNull();
  });

  it('非 Bearer 格式返回 null', () => {
    const req = makeRequest('Basic dXNlcjpwYXNz');
    expect(extractBearerToken(req)).toBeNull();
  });

  it('格式错误（缺少 token 部分）返回 null', () => {
    const req = makeRequest('Bearer');
    expect(extractBearerToken(req)).toBeNull();
  });

  it('大小写不敏感识别 bearer', () => {
    const req = makeRequest('BEARER my-token');
    const token = extractBearerToken(req);
    expect(token).toBe('my-token');
  });
});

describe('verifyApiKey', () => {
  beforeEach(() => {
    vi.resetAllMocks();
    delete process.env.API_KEY;
  });

  it('没有 token 时返回 invalid', async () => {
    const req = makeRequest();
    const result = await verifyApiKey(req);
    expect(result.valid).toBe(false);
    expect(result.error).toContain('Missing authorization header');
  });

  it('匹配环境变量 API_KEY 时验证通过', async () => {
    process.env.API_KEY = 'env-secret-key';
    const req = makeRequest('Bearer env-secret-key');
    const result = await verifyApiKey(req);
    expect(result.valid).toBe(true);
  });

  it('环境变量 API_KEY 不匹配时走数据库验证', async () => {
    process.env.API_KEY = 'different-key';
    const { default: prisma } = await import('@/lib/prisma');
    vi.mocked(prisma.apiKey.findUnique).mockResolvedValue({
      id: '1',
      key: 'db-key',
      name: 'test',
      active: true,
      createdAt: new Date(),
    });
    const req = makeRequest('Bearer db-key');
    const result = await verifyApiKey(req);
    expect(result.valid).toBe(true);
  });

  it('数据库中不存在的 key 返回 invalid', async () => {
    const { default: prisma } = await import('@/lib/prisma');
    vi.mocked(prisma.apiKey.findUnique).mockResolvedValue(null);
    const req = makeRequest('Bearer bad-key');
    const result = await verifyApiKey(req);
    expect(result.valid).toBe(false);
    expect(result.error).toContain('Invalid or inactive API key');
  });

  it('inactive 的 key 返回 invalid', async () => {
    const { default: prisma } = await import('@/lib/prisma');
    vi.mocked(prisma.apiKey.findUnique).mockResolvedValue({
      id: '1',
      key: 'inactive-key',
      name: 'test',
      active: false,
      createdAt: new Date(),
    });
    const req = makeRequest('Bearer inactive-key');
    const result = await verifyApiKey(req);
    expect(result.valid).toBe(false);
  });

  it('数据库查询报错时返回 invalid', async () => {
    const { default: prisma } = await import('@/lib/prisma');
    vi.mocked(prisma.apiKey.findUnique).mockRejectedValue(new Error('DB error'));
    const req = makeRequest('Bearer some-key');
    const result = await verifyApiKey(req);
    expect(result.valid).toBe(false);
    expect(result.error).toContain('API key verification failed');
  });
});
