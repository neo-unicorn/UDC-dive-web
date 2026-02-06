// src/components/ui/LanguageSwitcher.tsx
// 语言切换组件（桩代码）

export interface LanguageSwitcherProps {
    currentLocale: 'zh' | 'en';
    linkedArticleSlug?: string;
}

/**
 * 语言切换器
 * - 显示当前语言
 * - 下拉选择
 * - 保持当前位置（或跳转到对应语言文章）
 */
export function LanguageSwitcher(props: LanguageSwitcherProps): JSX.Element {
    throw new Error('Not implemented');
}

export default LanguageSwitcher;
