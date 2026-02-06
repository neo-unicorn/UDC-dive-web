// src/lib/utils.ts
export function generateSlug(text: string, locale: string = 'zh'): string {
    let slug = text.toLowerCase().trim()
        .replace(/[，。！？、；：""''（）【】《》]/g, '')
        .replace(/[^\w\s\u4e00-\u9fa5-]/g, '')
        .replace(/\s+/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
    if (slug.length > 50) slug = slug.substring(0, 50).replace(/-$/, '');
    return `${slug}-${locale}-${Math.random().toString(36).substring(2, 6)}`;
}

export function extractExcerpt(content: string, maxLength: number = 200): string {
    let text = content.replace(/```[\s\S]*?```/g, '').replace(/`[^`]+`/g, '')
        .replace(/^#{1,6}\s+/gm, '').replace(/\*\*([^*]+)\*\*/g, '$1').replace(/\*([^*]+)\*/g, '$1')
        .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1').replace(/!\[[^\]]*\]\([^)]+\)/g, '')
        .replace(/^>\s+/gm, '').replace(/^[-*+]\s+/gm, '').replace(/^\d+\.\s+/gm, '')
        .replace(/\n+/g, ' ').replace(/\s+/g, ' ').trim();
    return text.length <= maxLength ? text : text.substring(0, maxLength).replace(/\s+\S*$/, '') + '...';
}

export function countWords(content: string): number {
    const text = extractExcerpt(content, Infinity);
    const chineseChars = (text.match(/[\u4e00-\u9fa5]/g) || []).length;
    const englishWords = text.replace(/[\u4e00-\u9fa5]/g, ' ').split(/\s+/).filter(w => w.length > 0).length;
    return chineseChars + englishWords;
}

export function calculateReadingTime(content: string): number {
    return Math.max(1, Math.ceil(countWords(content) / 300));
}

export function formatDate(date: Date | string, locale: 'zh' | 'en'): string {
    const d = typeof date === 'string' ? new Date(date) : date;
    return d.toLocaleDateString(locale === 'zh' ? 'zh-CN' : 'en-US', { year: 'numeric', month: 'long', day: 'numeric' });
}

export function isValidSlug(slug: string): boolean {
    return /^[a-z0-9\u4e00-\u9fa5]+(?:-[a-z0-9\u4e00-\u9fa5]+)*$/.test(slug);
}
