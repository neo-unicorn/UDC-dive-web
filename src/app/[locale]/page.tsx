import { ArticleList } from '@/components/article/ArticleList';
import { CategoryFilter } from '@/components/filter/CategoryFilter';
import { Pagination } from '@/components/ui/Pagination';

async function getData(locale: string, page: number, category?: string) {
    const base = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const params = new URLSearchParams({ locale, page: String(page), limit: '12', ...(category && { category }) });
    const [articles, categories] = await Promise.all([
        fetch(`${base}/api/articles?${params}`, { next: { revalidate: 60 } }).then(r => r.ok ? r.json() : { articles: [], pagination: { page: 1, limit: 12, total: 0, pages: 0 } }),
        fetch(`${base}/api/categories?locale=${locale}`, { next: { revalidate: 300 } }).then(r => r.ok ? r.json() : { categories: [] })
    ]);
    return { articles: articles.articles, pagination: articles.pagination, categories: categories.categories };
}

export default async function HomePage({ params, searchParams }: { params: { locale: string }; searchParams: { page?: string; category?: string } }) {
    const locale = params.locale as 'zh' | 'en';
    const page = parseInt(searchParams.page || '1');
    const { articles, pagination, categories } = await getData(locale, page, searchParams.category);
    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-6">{locale === 'zh' ? '最新潜水资讯' : 'Latest Diving News'}</h1>
            <CategoryFilter categories={categories} activeSlug={searchParams.category} locale={locale} />
            <ArticleList articles={articles} locale={locale} />
            <Pagination page={pagination.page} pages={pagination.pages} baseUrl={`/${locale}${searchParams.category ? `?category=${searchParams.category}` : ''}`} />
        </div>
    );
}
