// src/lib/auth.ts
// API Key 认证中间件（桩代码）

import { NextRequest } from 'next/server';

export interface AuthResult {
    valid: boolean;
    error?: string;
}

/**
 * 验证 API Key
 * @param request - Next.js 请求对象
 * @returns 验证结果
 */
export async function verifyApiKey(request: NextRequest): Promise<AuthResult> {
    throw new Error('Not implemented');
}

/**
 * 从请求头提取 Bearer Token
 * @param request - Next.js 请求对象
 * @returns API Key 或 null
 */
export function extractBearerToken(request: NextRequest): string | null {
    throw new Error('Not implemented');
}
