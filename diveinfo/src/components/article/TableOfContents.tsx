// src/components/article/TableOfContents.tsx
// 目录导航组件（桩代码）

export interface TocItem {
    id: string;
    text: string;
    level: number;
}

export interface TableOfContentsProps {
    content: string;
    className?: string;
}

/**
 * 文章目录导航
 * - 从 Markdown 提取标题
 * - 高亮当前阅读位置
 * - 点击跳转
 */
export function TableOfContents(props: TableOfContentsProps): JSX.Element {
    throw new Error('Not implemented');
}

export default TableOfContents;
