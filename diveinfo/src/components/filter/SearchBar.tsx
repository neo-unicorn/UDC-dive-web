// src/components/filter/SearchBar.tsx
// 搜索框组件（桩代码）

export interface SearchBarProps {
    locale: 'zh' | 'en';
    defaultValue?: string;
    onSearch?: (query: string) => void;
}

/**
 * 搜索框组件
 * - 输入防抖 (300ms)
 * - 搜索图标
 * - 清除按钮
 * - 回车提交
 */
export function SearchBar(props: SearchBarProps): JSX.Element {
    throw new Error('Not implemented');
}

export default SearchBar;
