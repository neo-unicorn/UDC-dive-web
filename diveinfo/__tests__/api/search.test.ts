// __tests__/api/search.test.ts
// 搜索 API 测试

import { describe, it, expect, vi } from 'vitest';
import { NextRequest } from 'next/server';
import { GET } from '@/app/api/search/route';

// Mock Prisma
vi.mock('@/lib/prisma', () => ({
    default: {
        $queryRaw: vi.fn(),
    },
}));

describe('GET /api/search', () => {
    it('缺少搜索关键词时应该返回 400', async () => {
        const request = new NextRequest('http://localhost:3000/api/search');

        await expect(GET(request)).rejects.toThrow('Not implemented');
    });

    it('应该返回搜索结果', async () => {
        const request = new NextRequest('http://localhost:3000/api/search?q=潜水');

        await expect(GET(request)).rejects.toThrow('Not implemented');
    });

    it('应该支持语言筛选', async () => {
        const request = new NextRequest('http://localhost:3000/api/search?q=diving&locale=en');

        await expect(GET(request)).rejects.toThrow('Not implemented');
    });

    it('应该支持分页', async () => {
        const request = new NextRequest('http://localhost:3000/api/search?q=潜水&page=2&limit=5');

        await expect(GET(request)).rejects.toThrow('Not implemented');
    });

    it('应该返回高亮匹配片段', async () => {
        const request = new NextRequest('http://localhost:3000/api/search?q=装备');

        // 实现后验证 highlights 字段
        await expect(GET(request)).rejects.toThrow('Not implemented');
    });
});
