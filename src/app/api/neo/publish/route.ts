// src/app/api/neo/publish/route.ts
// Neo 工作流发布 API
// 接收 neo-wright-review 完成后的文章数据

import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { verifyApiKey } from '@/lib/auth';
import { generateSlug, extractExcerpt, countWords, calculateReadingTime } from '@/lib/utils';
import { notifyOpenClaw } from '@/lib/openclaw';
import type { ErrorResponse } from '@/types/api';

/**
 * Neo 工作流文章提交格式
 * 基于 data-protocol.md 定义
 */
interface NeoPublishRequest {
    version: string;
    skill: string;
    timestamp: string;
    topic: string;
    title: string;
    content: string;  // Markdown 内容
    locale?: 'zh' | 'en';
    categorySlug?: string;
    tagSlugs?: string[];
    coverImage?: string;
    metaTitle?: string;
    metaDescription?: string;
    published?: boolean;
    // Neo 工作流元数据
    workflow?: {
        draftPath?: string;
        reviewScore?: number;
        revisionRound?: number;
    };
}

interface NeoPublishResponse {
    success: boolean;
    articleId: string;
    slug: string;
    message: string;
    url?: string;
}

/**
 * POST /api/neo/publish
 * 接收 Neo 工作流生成的文章并发布
 */
export async function POST(request: NextRequest): Promise<NextResponse<NeoPublishResponse | ErrorResponse>> {
    try {
        // 验证 API Key
        const authResult = await verifyApiKey(request);
        if (!authResult.valid) {
            return NextResponse.json(
                { error: authResult.error || 'Unauthorized' },
                { status: 401 }
            );
        }

        const body: NeoPublishRequest = await request.json();

        // 验证必要字段
        if (!body.title || !body.content) {
            return NextResponse.json(
                { error: 'Missing required fields: title, content' },
                { status: 400 }
            );
        }

        // 验证协议版本
        if (body.version && !body.version.startsWith('1.')) {
            return NextResponse.json(
                { error: `Unsupported protocol version: ${body.version}. Expected 1.x` },
                { status: 400 }
            );
        }

        const locale = body.locale || 'zh';
        const slug = generateSlug(body.title, locale);
        const excerpt = extractExcerpt(body.content);
        const wordCount = countWords(body.content);
        const readingTime = calculateReadingTime(body.content);
        const published = body.published !== false; // 默认发布

        // 构建文章数据
        const articleData: Record<string, unknown> = {
            slug,
            locale,
            title: body.title,
            content: body.content,
            excerpt,
            coverImage: body.coverImage,
            wordCount,
            readingTime,
            metaTitle: body.metaTitle || body.title,
            metaDescription: body.metaDescription || excerpt,
            published,
            publishedAt: published ? new Date() : null,
            sourceWorkflow: body.skill || 'neo-workflow',
        };

        // 关联分类
        if (body.categorySlug) {
            const category = await prisma.category.findUnique({
                where: { slug: body.categorySlug },
            });
            if (category) {
                articleData.category = { connect: { slug: body.categorySlug } };
            }
        }

        // 创建文章
        const article = await prisma.article.create({
            data: articleData as any,
        });

        // 关联标签
        if (body.tagSlugs && body.tagSlugs.length > 0) {
            for (const tagSlug of body.tagSlugs) {
                const tag = await prisma.tag.findUnique({ where: { slug: tagSlug } });
                if (tag) {
                    await prisma.tagsOnArticles.create({
                        data: {
                            articleId: article.id,
                            tagId: tag.id,
                        },
                    });
                }
            }
        }

        // 构建文章 URL
        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
        const articleUrl = `${baseUrl}/${locale}/articles/${slug}`;

        // Neo 工作流发布时异步推送 OpenClaw（不阻塞响应）
        if (published) {
            notifyOpenClaw({
                id: article.id,
                slug: article.slug,
                locale,
                title: body.title,
                excerpt,
                coverImage: body.coverImage,
                publishedAt: article.publishedAt?.toISOString() ?? null,
                readingTime,
                wordCount,
            }).catch(() => { });
        }

        return NextResponse.json({
            success: true,
            articleId: article.id,
            slug: article.slug,
            message: 'Article published successfully from Neo workflow',
            url: articleUrl,
        }, { status: 201 });

    } catch (error) {
        console.error('POST /api/neo/publish error:', error);
        return NextResponse.json(
            { error: 'Failed to publish article from Neo workflow' },
            { status: 500 }
        );
    }
}

/**
 * GET /api/neo/publish
 * 检查 API 状态
 */
export async function GET(): Promise<NextResponse> {
    return NextResponse.json({
        status: 'ready',
        version: '1.0',
        supportedWorkflows: ['neo-wright', 'neo-wright-review'],
        requiredFields: ['title', 'content'],
        optionalFields: ['locale', 'categorySlug', 'tagSlugs', 'coverImage', 'metaTitle', 'metaDescription', 'published'],
    });
}
