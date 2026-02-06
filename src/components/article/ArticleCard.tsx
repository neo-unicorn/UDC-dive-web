'use client';
import Link from 'next/link';
import type { ArticleSummary } from '@/types';
import { formatDate } from '@/lib/utils';

export function ArticleCard({ article, locale }: { article: ArticleSummary; locale: 'zh' | 'en' }) {
    return (
        <article className="group bg-white rounded-xl shadow-sm hover:shadow-lg transition-all overflow-hidden" data-testid="article-card">
            <Link href={`/${locale}/articles/${article.slug}`} className="block">
                <div className="relative aspect-[3/2] bg-gray-100">
                    {article.coverImage ? <img src={article.coverImage} alt={article.title} className="object-cover w-full h-full group-hover:scale-105 transition-transform" /> : <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-400 to-blue-600"><span className="text-4xl">🌊</span></div>}
                    {article.category && <span className="absolute top-3 left-3 px-2.5 py-1 text-xs font-medium text-white bg-blue-500/90 rounded-full">{article.category.name}</span>}
                </div>
            </Link>
            <div className="p-4">
                <Link href={`/${locale}/articles/${article.slug}`}><h3 className="text-lg font-semibold text-gray-900 line-clamp-2 group-hover:text-blue-600">{article.title}</h3></Link>
                {article.excerpt && <p className="mt-2 text-sm text-gray-600 line-clamp-3">{article.excerpt}</p>}
                <div className="mt-4 flex items-center justify-between text-xs text-gray-500">
                    <time>{article.publishedAt ? formatDate(article.publishedAt, locale) : (locale === 'zh' ? '草稿' : 'Draft')}</time>
                    <span>{locale === 'zh' ? `${article.viewCount} 次阅读` : `${article.viewCount} views`}</span>
                </div>
            </div>
        </article>
    );
}
export default ArticleCard;
