// src/lib/auth.ts
import { NextRequest } from 'next/server';
import prisma from './prisma';

export interface AuthResult { valid: boolean; error?: string; }

export function extractBearerToken(request: NextRequest): string | null {
    const authHeader = request.headers.get('authorization');
    if (!authHeader) return null;
    const parts = authHeader.split(' ');
    if (parts.length !== 2 || parts[0].toLowerCase() !== 'bearer') return null;
    return parts[1];
}

export async function verifyApiKey(request: NextRequest): Promise<AuthResult> {
    const token = extractBearerToken(request);
    if (!token) return { valid: false, error: 'Missing authorization header' };
    const envApiKey = process.env.API_KEY;
    if (envApiKey && token === envApiKey) return { valid: true };
    try {
        const apiKey = await prisma.apiKey.findUnique({ where: { key: token } });
        if (!apiKey || !apiKey.active) return { valid: false, error: 'Invalid or inactive API key' };
        return { valid: true };
    } catch { return { valid: false, error: 'API key verification failed' }; }
}
