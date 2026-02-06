// src/components/layout/Sidebar.tsx
// 侧边栏组件（桩代码）

import type { Category, Tag } from '@/types';

export interface SidebarProps {
    locale: 'zh' | 'en';
    categories: Category[];
    popularTags: Tag[];
}

/**
 * 侧边栏
 * - 分类列表
 * - 热门标签云
 */
export function Sidebar(props: SidebarProps): JSX.Element {
    throw new Error('Not implemented');
}

export default Sidebar;
