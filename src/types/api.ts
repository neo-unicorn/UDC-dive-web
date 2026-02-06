// src/types/api.ts
import type { ArticleSummary, ArticleDetail, Category, Tag } from './index';
export interface Pagination { page: number; limit: number; total: number; pages: number; }
export interface ArticleListResponse { articles: ArticleSummary[]; pagination: Pagination; }
export interface ArticleDetailResponse extends ArticleDetail { }
export interface CreateArticleRequest { title: string; content: string; locale?: 'zh' | 'en'; categorySlug?: string; tagSlugs?: string[]; coverImage?: string; published?: boolean; metaTitle?: string; metaDescription?: string; }
export interface CreateArticleResponse { id: string; slug: string; message: string; }
export interface UpdateArticleRequest { title?: string; content?: string; categorySlug?: string; tagSlugs?: string[]; coverImage?: string; published?: boolean; metaTitle?: string; metaDescription?: string; linkedArticleId?: string; }
export interface SearchResponse { query: string; results: (ArticleSummary & { highlight: string })[]; pagination: Pagination; }
export interface CategoriesResponse { categories: (Category & { count: number })[]; }
export interface TagsResponse { tags: (Tag & { count: number })[]; }
export interface UploadResponse { url: string; filename: string; size: number; type: string; }
export interface ErrorResponse { error: string; }
