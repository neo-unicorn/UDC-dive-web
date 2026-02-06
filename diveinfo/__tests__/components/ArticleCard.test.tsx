// __tests__/components/ArticleCard.test.tsx
// 文章卡片组件测试

import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ArticleCard } from '@/components/article/ArticleCard';
import type { ArticleSummary } from '@/types';

const mockArticle: ArticleSummary = {
    id: 'test-id',
    slug: 'test-article',
    locale: 'zh',
    title: '测试文章标题',
    excerpt: '这是一篇测试文章的摘要内容',
    coverImage: 'https://example.com/image.jpg',
    publishedAt: '2026-02-06T10:00:00Z',
    viewCount: 100,
    category: { slug: 'gear', name: '装备评测' },
    tags: [
        { slug: 'diving', name: '潜水' },
        { slug: 'bcd', name: 'BCD' },
    ],
};

describe('ArticleCard', () => {
    it('应该在实现后渲染文章标题', () => {
        expect(() => {
            render(<ArticleCard article={mockArticle} locale="zh" />);
        }).toThrow('Not implemented');
    });

    it('应该显示文章摘要', () => {
        expect(() => {
            render(<ArticleCard article={mockArticle} locale="zh" />);
        }).toThrow('Not implemented');
    });

    it('应该显示分类标签', () => {
        expect(() => {
            render(<ArticleCard article={mockArticle} locale="zh" />);
        }).toThrow('Not implemented');
    });

    it('应该显示封面图', () => {
        expect(() => {
            render(<ArticleCard article={mockArticle} locale="zh" />);
        }).toThrow('Not implemented');
    });

    it('应该显示发布日期', () => {
        expect(() => {
            render(<ArticleCard article={mockArticle} locale="zh" />);
        }).toThrow('Not implemented');
    });

    it('应该显示阅读量', () => {
        expect(() => {
            render(<ArticleCard article={mockArticle} locale="zh" />);
        }).toThrow('Not implemented');
    });
});
