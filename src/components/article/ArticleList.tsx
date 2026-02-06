import type { ArticleSummary } from '@/types';
import { ArticleCard } from './ArticleCard';

export function ArticleList({ articles, locale }: { articles: ArticleSummary[]; locale: 'zh' | 'en' }) {
    if (articles.length === 0) return <div className="py-16 text-center" data-testid="empty-state"><p className="text-lg text-gray-600">{locale === 'zh' ? '暂无文章' : 'No articles yet'}</p></div>;
    return <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" data-testid="article-list">{articles.map(a => <ArticleCard key={a.id} article={a} locale={locale} />)}</div>;
}
export default ArticleList;
