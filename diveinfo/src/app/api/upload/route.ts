// src/app/api/upload/route.ts
// 图片上传 API（桩代码）

import { NextRequest, NextResponse } from 'next/server';
import type { UploadResponse, ErrorResponse } from '@/types/api';

/**
 * POST /api/upload
 * 上传图片到 Vercel Blob（需认证）
 * 
 * Request: multipart/form-data
 * - file: File (图片文件)
 * - type: 'cover' | 'content' (可选)
 * 
 * Headers: Authorization: Bearer <API_KEY>
 */
export async function POST(request: NextRequest): Promise<NextResponse<UploadResponse | ErrorResponse>> {
    throw new Error('Not implemented');
}
