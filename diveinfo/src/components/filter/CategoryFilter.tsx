// src/components/filter/CategoryFilter.tsx
// 分类筛选组件（桩代码）

import type { Category } from '@/types';

export interface CategoryFilterProps {
    categories: Category[];
    activeSlug?: string;
    locale: 'zh' | 'en';
}

/**
 * 分类筛选组件
 * - 水平滚动列表
 * - 高亮当前选中
 * - "全部" 选项
 */
export function CategoryFilter(props: CategoryFilterProps): JSX.Element {
    throw new Error('Not implemented');
}

export default CategoryFilter;
