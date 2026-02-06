// src/components/article/MarkdownRenderer.tsx
// Markdown 渲染组件（桩代码）

export interface MarkdownRendererProps {
    content: string;
    className?: string;
}

/**
 * Markdown 渲染器
 * - 支持 GFM (GitHub Flavored Markdown)
 * - 代码高亮 (Prism)
 * - 图片懒加载
 * - 链接新窗口打开
 */
export function MarkdownRenderer(props: MarkdownRendererProps): JSX.Element {
    throw new Error('Not implemented');
}

export default MarkdownRenderer;
