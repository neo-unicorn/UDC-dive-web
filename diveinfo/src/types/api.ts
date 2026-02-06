// src/types/api.ts
// API 请求/响应类型定义（桩代码）

import { ArticleSummary, Article, Category, Tag, PaginationInfo } from './index';

// ============ 文章 API ============

/**
 * 创建文章请求
 */
export interface CreateArticleRequest {
    title: string;
    content: string;
    locale?: 'zh' | 'en';
    excerpt?: string;
    coverImage?: string;
    categorySlug?: string;
    tagSlugs?: string[];
    linkedArticleId?: string;
    published?: boolean;
}

/**
 * 更新文章请求
 */
export interface UpdateArticleRequest {
    title?: string;
    content?: string;
    excerpt?: string;
    coverImage?: string;
    categorySlug?: string;
    tagSlugs?: string[];
    linkedArticleId?: string;
    published?: boolean;
}

/**
 * 文章列表响应
 */
export interface ArticleListResponse {
    articles: ArticleSummary[];
    pagination: PaginationInfo;
}

/**
 * 文章详情响应
 */
export interface ArticleDetailResponse extends Article { }

/**
 * 创建文章响应
 */
export interface CreateArticleResponse {
    id: string;
    slug: string;
    message: string;
}

// ============ 搜索 API ============

/**
 * 搜索结果项
 */
export interface SearchResultItem {
    id: string;
    slug: string;
    title: string;
    excerpt: string;
    highlights: string[];
}

/**
 * 搜索响应
 */
export interface SearchResponse {
    results: SearchResultItem[];
    pagination: {
        page: number;
        total: number;
    };
}

// ============ 上传 API ============

/**
 * 上传响应
 */
export interface UploadResponse {
    url: string;
    size: number;
    type: string;
}

// ============ 分类/标签 API ============

/**
 * 分类列表响应
 */
export interface CategoriesResponse {
    categories: (Category & { articleCount: number })[];
}

/**
 * 标签列表响应
 */
export interface TagsResponse {
    tags: (Tag & { articleCount: number })[];
}

// ============ 错误响应 ============

/**
 * API 错误响应
 */
export interface ErrorResponse {
    error: string;
    details?: string;
}
