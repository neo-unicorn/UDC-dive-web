// src/types/index.ts
export interface Category { slug: string; name: string; }
export interface Tag { slug: string; name: string; }
export interface ArticleSummary {
    id: string; slug: string; locale: string; title: string; excerpt: string | null;
    coverImage: string | null; publishedAt: string | null; viewCount: number;
    category: Category | null; tags: { slug: string; name: string }[];
}
export interface ArticleDetail extends ArticleSummary {
    content: string; metaTitle: string | null; metaDescription: string | null;
    published: boolean; wordCount: number; readingTime: number;
    linkedArticle: { id: string; slug: string; locale: string; title: string } | null;
    createdAt: string; updatedAt: string;
}
