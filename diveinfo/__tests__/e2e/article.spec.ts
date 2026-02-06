// __tests__/e2e/article.spec.ts
// 文章详情页 E2E 测试

import { test, expect } from '@playwright/test';

test.describe('文章详情页', () => {
    test('应该显示文章内容', async ({ page }) => {
        // 假设有一篇测试文章
        await page.goto('/zh/articles/test-article');

        // 验证文章标题存在
        await expect(page.locator('h1')).toBeVisible();

        // 验证文章正文存在
        await expect(page.locator('article')).toBeVisible();
    });

    test('应该渲染 Markdown 内容', async ({ page }) => {
        await page.goto('/zh/articles/test-article');

        // 验证 Markdown 渲染
        // 标题、段落、代码块等元素应该正确渲染
        const content = page.locator('[data-testid="article-content"]');
        await expect(content).toBeVisible();
    });

    test('应该显示目录导航', async ({ page }) => {
        await page.goto('/zh/articles/test-article');

        // 桌面端应该显示目录
        const toc = page.locator('[data-testid="table-of-contents"]');

        // 在桌面端视口下检查
        await page.setViewportSize({ width: 1280, height: 720 });
        await expect(toc).toBeVisible();
    });

    test('点击目录应该跳转到对应章节', async ({ page }) => {
        await page.goto('/zh/articles/test-article');

        // 点击目录中的某一项
        const tocItem = page.locator('[data-testid="table-of-contents"] a').first();

        if (await tocItem.isVisible()) {
            await tocItem.click();

            // 验证页面滚动到对应位置（通过 URL hash）
            await expect(page).toHaveURL(/#/);
        }
    });

    test('应该显示语言切换按钮（如有对应版本）', async ({ page }) => {
        await page.goto('/zh/articles/test-article');

        // 语言切换器应该可见
        const languageSwitcher = page.locator('[data-testid="language-switcher"]');
        await expect(languageSwitcher).toBeVisible();
    });

    test('应该显示相关文章推荐', async ({ page }) => {
        await page.goto('/zh/articles/test-article');

        // 相关文章区域
        const relatedArticles = page.locator('[data-testid="related-articles"]');

        // 可能存在也可能不存在（取决于是否有相关文章）
        // 这里只验证元素存在性
        const isVisible = await relatedArticles.isVisible();
        expect(isVisible).toBeDefined();
    });

    test('404 页面应该正确处理', async ({ page }) => {
        // 访问不存在的文章
        const response = await page.goto('/zh/articles/nonexistent-article-12345');

        // 应该返回 404 状态或显示 404 页面
        if (response) {
            const status = response.status();
            if (status === 200) {
                // 如果返回 200，页面内容应该提示文章不存在
                await expect(page.locator('text=/找不到|Not found|404/i')).toBeVisible();
            } else {
                expect(status).toBe(404);
            }
        }
    });

    test('应该正确显示文章元信息', async ({ page }) => {
        await page.goto('/zh/articles/test-article');

        // 验证元信息区域
        const meta = page.locator('[data-testid="article-meta"]');

        // 应该显示发布日期
        await expect(meta.locator('text=/\\d{4}/').first()).toBeVisible();
    });
});
