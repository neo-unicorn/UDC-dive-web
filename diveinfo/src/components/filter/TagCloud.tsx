// src/components/filter/TagCloud.tsx
// 标签云组件（桩代码）

import type { Tag } from '@/types';

export interface TagCloudProps {
    tags: (Tag & { count?: number })[];
    activeSlug?: string;
    locale: 'zh' | 'en';
}

/**
 * 标签云组件
 * - 根据文章数量调整大小
 * - 高亮当前选中
 */
export function TagCloud(props: TagCloudProps): JSX.Element {
    throw new Error('Not implemented');
}

export default TagCloud;
