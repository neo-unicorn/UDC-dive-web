// __tests__/components/ArticleList.test.tsx
// 文章列表组件测试

import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ArticleList } from '@/components/article/ArticleList';
import type { ArticleSummary } from '@/types';

const mockArticles: ArticleSummary[] = [
    {
        id: 'article-1',
        slug: 'article-one',
        locale: 'zh',
        title: '文章一',
        excerpt: '文章一的摘要',
        coverImage: null,
        publishedAt: '2026-02-06T10:00:00Z',
        viewCount: 50,
        category: null,
        tags: [],
    },
    {
        id: 'article-2',
        slug: 'article-two',
        locale: 'zh',
        title: '文章二',
        excerpt: '文章二的摘要',
        coverImage: null,
        publishedAt: '2026-02-05T10:00:00Z',
        viewCount: 30,
        category: null,
        tags: [],
    },
];

describe('ArticleList', () => {
    it('应该渲染文章列表', () => {
        expect(() => {
            render(<ArticleList articles={mockArticles} locale="zh" />);
        }).toThrow('Not implemented');
    });

    it('空列表应该显示提示', () => {
        expect(() => {
            render(<ArticleList articles={[]} locale="zh" />);
        }).toThrow('Not implemented');
    });

    it('应该使用网格布局', () => {
        expect(() => {
            render(<ArticleList articles={mockArticles} locale="zh" />);
        }).toThrow('Not implemented');
    });
});
