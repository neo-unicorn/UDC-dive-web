// src/app/api/articles/route.ts
// 文章列表 API（桩代码）

import { NextRequest, NextResponse } from 'next/server';
import type { ArticleListResponse, CreateArticleRequest, CreateArticleResponse, ErrorResponse } from '@/types/api';

/**
 * GET /api/articles
 * 获取文章列表（分页）
 * 
 * Query Parameters:
 * - page: number (default: 1)
 * - limit: number (default: 12, max: 50)
 * - locale: 'zh' | 'en' (default: 'zh')
 * - category: string (category slug)
 * - tag: string (tag slug)
 * - published: boolean (default: true)
 */
export async function GET(request: NextRequest): Promise<NextResponse<ArticleListResponse | ErrorResponse>> {
    throw new Error('Not implemented');
}

/**
 * POST /api/articles
 * 创建文章（需认证）
 * 
 * Request Body: CreateArticleRequest
 * Headers: Authorization: Bearer <API_KEY>
 */
export async function POST(request: NextRequest): Promise<NextResponse<CreateArticleResponse | ErrorResponse>> {
    throw new Error('Not implemented');
}
