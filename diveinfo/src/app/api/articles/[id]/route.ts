// src/app/api/articles/[id]/route.ts
// 单篇文章 API（桩代码）

import { NextRequest, NextResponse } from 'next/server';
import type { ArticleDetailResponse, UpdateArticleRequest, ErrorResponse } from '@/types/api';

interface RouteParams {
    params: { id: string };
}

/**
 * GET /api/articles/[id]
 * 获取单篇文章
 * 
 * Path Parameters:
 * - id: 文章 ID 或 slug
 */
export async function GET(
    request: NextRequest,
    { params }: RouteParams
): Promise<NextResponse<ArticleDetailResponse | ErrorResponse>> {
    throw new Error('Not implemented');
}

/**
 * PUT /api/articles/[id]
 * 更新文章（需认证）
 * 
 * Request Body: UpdateArticleRequest
 * Headers: Authorization: Bearer <API_KEY>
 */
export async function PUT(
    request: NextRequest,
    { params }: RouteParams
): Promise<NextResponse<{ message: string } | ErrorResponse>> {
    throw new Error('Not implemented');
}

/**
 * DELETE /api/articles/[id]
 * 删除文章（需认证）
 * 
 * Headers: Authorization: Bearer <API_KEY>
 */
export async function DELETE(
    request: NextRequest,
    { params }: RouteParams
): Promise<NextResponse<{ message: string } | ErrorResponse>> {
    throw new Error('Not implemented');
}
