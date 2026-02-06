// src/components/article/ArticleList.tsx
// 文章列表组件（桩代码）

import type { ArticleSummary } from '@/types';

export interface ArticleListProps {
    articles: ArticleSummary[];
    locale: 'zh' | 'en';
}

/**
 * 文章列表组件
 * - 响应式网格布局（1/2/3 列）
 * - 空状态提示
 */
export function ArticleList(props: ArticleListProps): JSX.Element {
    throw new Error('Not implemented');
}

export default ArticleList;
