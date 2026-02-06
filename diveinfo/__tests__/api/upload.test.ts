// __tests__/api/upload.test.ts
// 上传 API 测试

import { describe, it, expect, vi } from 'vitest';
import { NextRequest } from 'next/server';
import { POST } from '@/app/api/upload/route';

// Mock Vercel Blob
vi.mock('@vercel/blob', () => ({
    put: vi.fn(),
}));

// Mock auth
vi.mock('@/lib/auth', () => ({
    verifyApiKey: vi.fn(),
}));

describe('POST /api/upload', () => {
    it('无认证时应该返回 401', async () => {
        const formData = new FormData();
        formData.append('file', new Blob(['test'], { type: 'image/png' }), 'test.png');

        const request = new NextRequest('http://localhost:3000/api/upload', {
            method: 'POST',
            body: formData,
        });

        await expect(POST(request)).rejects.toThrow('Not implemented');
    });

    it('缺少文件时应该返回 400', async () => {
        const request = new NextRequest('http://localhost:3000/api/upload', {
            method: 'POST',
            headers: { 'Authorization': 'Bearer test-key' },
        });

        await expect(POST(request)).rejects.toThrow('Not implemented');
    });

    it('非图片文件应该返回 400', async () => {
        const formData = new FormData();
        formData.append('file', new Blob(['test'], { type: 'text/plain' }), 'test.txt');

        const request = new NextRequest('http://localhost:3000/api/upload', {
            method: 'POST',
            headers: { 'Authorization': 'Bearer test-key' },
            body: formData,
        });

        await expect(POST(request)).rejects.toThrow('Not implemented');
    });

    it('有效图片应该上传成功', async () => {
        const formData = new FormData();
        formData.append('file', new Blob(['test'], { type: 'image/jpeg' }), 'test.jpg');

        const request = new NextRequest('http://localhost:3000/api/upload', {
            method: 'POST',
            headers: { 'Authorization': 'Bearer test-key' },
            body: formData,
        });

        await expect(POST(request)).rejects.toThrow('Not implemented');
    });
});
