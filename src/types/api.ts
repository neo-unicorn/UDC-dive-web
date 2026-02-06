// src/types/api.ts
export interface Pagination { page: number; limit: number; total: number; pages: number; }
export interface ArticleListResponse { articles: import('./index').ArticleSummary[]; pagination: Pagination; }
export interface ArticleDetailResponse extends import('./index').ArticleDetail { }
export interface CreateArticleRequest { title: string; content: string; locale?: 'zh' | 'en'; categorySlug?: string; tagSlugs?: string[]; coverImage?: string; published?: boolean; metaTitle?: string; metaDescription?: string; }
export interface CreateArticleResponse { id: string; slug: string; message: string; }
export interface UpdateArticleRequest { title?: string; content?: string; categorySlug?: string; tagSlugs?: string[]; coverImage?: string; published?: boolean; metaTitle?: string; metaDescription?: string; linkedArticleId?: string; }
export interface SearchResponse { query: string; results: (import('./index').ArticleSummary & { highlight: string })[]; pagination: Pagination; }
export interface CategoriesResponse { categories: (import('./index').Category & { count: number })[]; }
export interface TagsResponse { tags: (import('./index').Tag & { count: number })[]; }
export interface UploadResponse { url: string; filename: string; size: number; type: string; }
export interface ErrorResponse { error: string; }
