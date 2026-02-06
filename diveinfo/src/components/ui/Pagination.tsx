// src/components/ui/Pagination.tsx
// 分页组件（桩代码）

export interface PaginationProps {
    page: number;
    pages: number;
    baseUrl: string;
}

/**
 * 分页组件
 * - 上一页/下一页
 * - 页码（最多显示 5 页）
 * - 首页/末页跳转
 */
export function Pagination(props: PaginationProps): JSX.Element {
    throw new Error('Not implemented');
}

export default Pagination;
