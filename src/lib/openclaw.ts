// src/lib/openclaw.ts
// OpenClaw Gateway Webhook 集成模块
// 文章发布后自动推送到 OpenClaw Agent 进行摘要生成和渠道分发

export interface ArticleNotifyPayload {
  id: string;
  slug: string;
  locale: string;
  title: string;
  excerpt: string | null;
  coverImage?: string | null;
  publishedAt: string | null;
  readingTime?: number;
  wordCount?: number;
  category?: { slug: string; name: string } | null;
  tags?: { slug: string; name: string }[];
}

interface OpenClawWebhookBody {
  name: string;
  message: string;
  deliver: boolean;
  channel?: string;
  to?: string;
}

export interface NotifyResult {
  success: boolean;
  articleId: string;
  error?: string;
}

/**
 * 构建推送给 OpenClaw Agent 的消息文本
 */
function buildMessage(article: ArticleNotifyPayload): string {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
  const url = `${baseUrl}/${article.locale}/articles/${article.slug}`;
  const categoryStr = article.category?.name ? `📂 分类：${article.category.name}\n` : '';
  const tagsStr =
    article.tags && article.tags.length > 0
      ? `🏷 标签：${article.tags.map((t) => t.name).join('、')}\n`
      : '';
  const readingTimeStr = article.readingTime ? `⏱ 阅读时间：${article.readingTime} 分钟\n` : '';
  const excerptStr = article.excerpt ? `📝 摘要：${article.excerpt}\n` : '';

  return [
    `🌊 潜水新闻发布：【${article.title}】`,
    '',
    categoryStr + tagsStr + readingTimeStr + excerptStr + `🔗 链接：${url}`,
  ]
    .join('\n')
    .trim();
}

/**
 * 向 OpenClaw Gateway 推送单篇文章通知
 * 失败时静默处理（不阻塞主流程）
 */
export async function notifyOpenClaw(article: ArticleNotifyPayload): Promise<NotifyResult> {
  const gatewayUrl = process.env.OPENCLAW_GATEWAY_URL;
  const hookToken = process.env.OPENCLAW_HOOK_TOKEN;

  if (!gatewayUrl || !hookToken) {
    return { success: false, articleId: article.id, error: 'OPENCLAW_GATEWAY_URL or OPENCLAW_HOOK_TOKEN not configured' };
  }

  const body: OpenClawWebhookBody = {
    name: 'new-article',
    message: buildMessage(article),
    deliver: true,
  };

  const channel = process.env.OPENCLAW_CHANNEL;
  const to = process.env.OPENCLAW_TO;
  if (channel) body.channel = channel;
  if (to) body.to = to;

  try {
    const endpoint = gatewayUrl.replace(/\/$/, '') + '/hooks/agent';
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${hookToken}`,
      },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(8000), // 8 秒超时，不阻塞主流程
    });

    if (!response.ok) {
      const text = await response.text().catch(() => '');
      return { success: false, articleId: article.id, error: `Gateway returned ${response.status}: ${text}` };
    }

    return { success: true, articleId: article.id };
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return { success: false, articleId: article.id, error: message };
  }
}

/**
 * 批量推送文章列表到 OpenClaw（每篇间隔 500ms 避免限流）
 */
export async function batchNotifyOpenClaw(
  articles: ArticleNotifyPayload[]
): Promise<{ sent: number; failed: number; results: NotifyResult[] }> {
  const results: NotifyResult[] = [];

  for (const article of articles) {
    const result = await notifyOpenClaw(article);
    results.push(result);
    if (articles.length > 1) {
      // 间隔推送，避免 Gateway 限流
      await new Promise((resolve) => setTimeout(resolve, 500));
    }
  }

  return {
    sent: results.filter((r) => r.success).length,
    failed: results.filter((r) => !r.success).length,
    results,
  };
}

/**
 * 检查 OpenClaw Gateway 连通性
 */
export async function checkOpenClawHealth(): Promise<{ reachable: boolean; error?: string }> {
  const gatewayUrl = process.env.OPENCLAW_GATEWAY_URL;
  if (!gatewayUrl) return { reachable: false, error: 'OPENCLAW_GATEWAY_URL not configured' };

  try {
    const response = await fetch(gatewayUrl.replace(/\/$/, '') + '/health', {
      signal: AbortSignal.timeout(5000),
    });
    return { reachable: response.ok };
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return { reachable: false, error: message };
  }
}
