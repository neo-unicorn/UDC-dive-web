import { notFound } from 'next/navigation';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';
import { formatDate } from '@/lib/utils';

async function getArticle(slug: string) {
    const base = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const res = await fetch(`${base}/api/articles/${slug}`, { next: { revalidate: 60 } });
    return res.ok ? res.json() : null;
}

export default async function ArticlePage({ params }: { params: { locale: string; slug: string } }) {
    const locale = params.locale as 'zh' | 'en';
    const article = await getArticle(params.slug);
    if (!article) notFound();
    return (
        <article className="container mx-auto px-4 py-8 max-w-4xl">
            <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
                <Link href={`/${locale}`} className="hover:text-blue-600">{locale === 'zh' ? '首页' : 'Home'}</Link>
                <span>/</span>
                <span className="text-gray-700 truncate">{article.title}</span>
            </nav>
            {article.coverImage && <img src={article.coverImage} alt={article.title} className="w-full aspect-video object-cover rounded-xl mb-8" />}
            <header className="mb-8">
                {article.category && <Link href={`/${locale}?category=${article.category.slug}`} className="inline-block px-3 py-1 text-sm text-blue-700 bg-blue-100 rounded-full mb-4">{article.category.name}</Link>}
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">{article.title}</h1>
                <div className="flex flex-wrap gap-4 text-sm text-gray-500" data-testid="article-meta">
                    <time>{article.publishedAt ? formatDate(article.publishedAt, locale) : 'Draft'}</time>
                    <span>·</span><span>{locale === 'zh' ? `${article.wordCount} 字` : `${article.wordCount} words`}</span>
                    <span>·</span><span>{locale === 'zh' ? `${article.readingTime} 分钟` : `${article.readingTime} min`}</span>
                </div>
            </header>
            <div className="prose max-w-none" data-testid="article-content"><ReactMarkdown>{article.content}</ReactMarkdown></div>
        </article>
    );
}
