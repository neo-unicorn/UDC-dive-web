// src/types/index.ts
// 核心类型定义（桩代码）

/**
 * 文章完整信息
 */
export interface Article {
  id: string;
  slug: string;
  locale: 'zh' | 'en';
  title: string;
  excerpt: string | null;
  content: string;
  coverImage: string | null;
  published: boolean;
  publishedAt: string | null;
  viewCount: number;
  wordCount: number;
  category: Category | null;
  tags: Tag[];
  linkedArticle: LinkedArticle | null;
  createdAt: string;
  updatedAt: string;
}

/**
 * 文章摘要（列表用）
 */
export interface ArticleSummary {
  id: string;
  slug: string;
  locale: 'zh' | 'en';
  title: string;
  excerpt: string | null;
  coverImage: string | null;
  publishedAt: string | null;
  viewCount: number;
  category: Category | null;
  tags: Tag[];
}

/**
 * 分类
 */
export interface Category {
  slug: string;
  name: string;
}

/**
 * 标签
 */
export interface Tag {
  slug: string;
  name: string;
}

/**
 * 关联文章（另一语言版本）
 */
export interface LinkedArticle {
  id: string;
  slug: string;
  locale: 'zh' | 'en';
  title: string;
}

/**
 * 分页信息
 */
export interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

/**
 * 支持的语言
 */
export type Locale = 'zh' | 'en';
