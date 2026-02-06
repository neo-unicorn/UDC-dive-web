// src/app/api/neo/sync/route.ts
// Neo 工作流批量同步 API
// 从本地 .workflow 目录批量导入文章

import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { verifyApiKey } from '@/lib/auth';
import { generateSlug, extractExcerpt, countWords, calculateReadingTime } from '@/lib/utils';
import type { ErrorResponse } from '@/types/api';

interface SyncResult {
    file: string;
    status: 'success' | 'skipped' | 'error';
    articleId?: string;
    slug?: string;
    error?: string;
}

interface SyncResponse {
    success: boolean;
    synced: number;
    skipped: number;
    errors: number;
    results: SyncResult[];
}

interface WorkflowDraft {
    version: string;
    skill: string;
    timestamp: string;
    topic: string;
    title: string;
    structure: {
        total_chapters: number;
        word_count_estimate: number;
    };
    chapters: Array<{
        index: number;
        type: string;
        title: string;
        content: string;
        word_count: number;
    }>;
    mini_scores: {
        attraction: number;
        resonance: number;
        info_density: number;
        storytelling: number;
        cta: number;
        ai_taste: number;
    };
    draft_path: string;
}

/**
 * POST /api/neo/sync
 * 批量同步文章
 * 用于一次性导入多篇 Neo 工作流生成的文章
 */
export async function POST(request: NextRequest): Promise<NextResponse<SyncResponse | ErrorResponse>> {
    try {
        // 验证 API Key
        const authResult = await verifyApiKey(request);
        if (!authResult.valid) {
            return NextResponse.json(
                { error: authResult.error || 'Unauthorized' },
                { status: 401 }
            );
        }

        const body = await request.json();
        const { articles } = body as {
            articles: Array<{
                title: string;
                content: string;
                locale?: 'zh' | 'en';
                categorySlug?: string;
                tagSlugs?: string[];
                coverImage?: string;
                published?: boolean;
            }>
        };

        if (!articles || !Array.isArray(articles)) {
            return NextResponse.json(
                { error: 'Missing required field: articles (array)' },
                { status: 400 }
            );
        }

        const results: SyncResult[] = [];
        let synced = 0;
        let skipped = 0;
        let errors = 0;

        for (const item of articles) {
            try {
                if (!item.title || !item.content) {
                    results.push({
                        file: item.title || 'unknown',
                        status: 'skipped',
                        error: 'Missing title or content',
                    });
                    skipped++;
                    continue;
                }

                const locale = item.locale || 'zh';
                const slug = generateSlug(item.title, locale);

                // 检查是否已存在同名文章
                const existing = await prisma.article.findFirst({
                    where: { title: item.title, locale },
                });

                if (existing) {
                    results.push({
                        file: item.title,
                        status: 'skipped',
                        error: 'Article with same title already exists',
                    });
                    skipped++;
                    continue;
                }

                const excerpt = extractExcerpt(item.content);
                const wordCount = countWords(item.content);
                const readingTime = calculateReadingTime(item.content);
                const published = item.published !== false;

                // 创建文章
                const article = await prisma.article.create({
                    data: {
                        slug,
                        locale,
                        title: item.title,
                        content: item.content,
                        excerpt,
                        coverImage: item.coverImage,
                        wordCount,
                        readingTime,
                        metaTitle: item.title,
                        metaDescription: excerpt,
                        published,
                        publishedAt: published ? new Date() : null,
                        sourceWorkflow: 'neo-sync',
                        ...(item.categorySlug && {
                            category: { connect: { slug: item.categorySlug } },
                        }),
                    },
                });

                // 关联标签
                if (item.tagSlugs && item.tagSlugs.length > 0) {
                    for (const tagSlug of item.tagSlugs) {
                        const tag = await prisma.tag.findUnique({ where: { slug: tagSlug } });
                        if (tag) {
                            await prisma.tagsOnArticles.create({
                                data: { articleId: article.id, tagId: tag.id },
                            });
                        }
                    }
                }

                results.push({
                    file: item.title,
                    status: 'success',
                    articleId: article.id,
                    slug: article.slug,
                });
                synced++;

            } catch (err) {
                results.push({
                    file: item.title || 'unknown',
                    status: 'error',
                    error: err instanceof Error ? err.message : 'Unknown error',
                });
                errors++;
            }
        }

        return NextResponse.json({
            success: errors === 0,
            synced,
            skipped,
            errors,
            results,
        });

    } catch (error) {
        console.error('POST /api/neo/sync error:', error);
        return NextResponse.json(
            { error: 'Sync failed' },
            { status: 500 }
        );
    }
}
