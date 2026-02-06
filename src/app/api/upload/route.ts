// src/app/api/upload/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { put } from '@vercel/blob';
import { verifyApiKey } from '@/lib/auth';

const ALLOWED = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

export async function POST(request: NextRequest) {
    try {
        const auth = await verifyApiKey(request);
        if (!auth.valid) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        const formData = await request.formData();
        const file = formData.get('file') as File | null;
        if (!file) return NextResponse.json({ error: 'No file' }, { status: 400 });
        if (!ALLOWED.includes(file.type)) return NextResponse.json({ error: 'Invalid type' }, { status: 400 });
        if (file.size > 5 * 1024 * 1024) return NextResponse.json({ error: 'Too large' }, { status: 400 });
        const filename = `content/${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${file.name.split('.').pop()}`;
        const blob = await put(filename, file, { access: 'public' });
        return NextResponse.json({ url: blob.url, filename: blob.pathname, size: file.size, type: file.type });
    } catch { return NextResponse.json({ error: 'Upload failed' }, { status: 500 }); }
}
