// src/components/article/ArticleCard.tsx
// 文章卡片组件（桩代码）

import type { ArticleSummary } from '@/types';

export interface ArticleCardProps {
    article: ArticleSummary;
    locale: 'zh' | 'en';
}

/**
 * 文章卡片组件
 * - 封面图（16:9 比例）
 * - 分类标签
 * - 标题（最多 2 行）
 * - 摘要（最多 3 行）
 * - 发布日期 + 阅读量
 */
export function ArticleCard(props: ArticleCardProps): JSX.Element {
    throw new Error('Not implemented');
}

export default ArticleCard;
