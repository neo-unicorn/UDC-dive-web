// __tests__/e2e/homepage.spec.ts
// 首页 E2E 测试

import { test, expect } from '@playwright/test';

test.describe('首页', () => {
    test('应该加载中文首页', async ({ page }) => {
        await page.goto('/zh');

        // 验证页面标题
        await expect(page).toHaveTitle(/潜水资讯/);

        // 验证导航栏存在
        await expect(page.locator('header')).toBeVisible();

        // 验证文章列表区域存在
        await expect(page.locator('main')).toBeVisible();
    });

    test('应该加载英文首页', async ({ page }) => {
        await page.goto('/en');

        // 验证页面标题
        await expect(page).toHaveTitle(/Diving|Dive/i);
    });

    test('应该能切换语言', async ({ page }) => {
        await page.goto('/zh');

        // 找到语言切换器并点击
        const languageSwitcher = page.locator('[data-testid="language-switcher"]');
        await languageSwitcher.click();

        // 选择英文
        await page.locator('text=English').click();

        // 验证 URL 变为英文
        await expect(page).toHaveURL(/\/en/);
    });

    test('应该显示文章列表', async ({ page }) => {
        await page.goto('/zh');

        // 等待文章卡片加载
        const articleCards = page.locator('[data-testid="article-card"]');

        // 至少应该有一篇文章（或空状态提示）
        const count = await articleCards.count();
        if (count > 0) {
            await expect(articleCards.first()).toBeVisible();
        } else {
            // 显示空状态提示
            await expect(page.locator('text=/没有文章|No articles/i')).toBeVisible();
        }
    });

    test('应该能使用分类筛选', async ({ page }) => {
        await page.goto('/zh');

        // 点击分类
        const categoryFilter = page.locator('[data-testid="category-filter"]');
        await categoryFilter.locator('text=装备评测').click();

        // 验证 URL 包含分类参数
        await expect(page).toHaveURL(/category=gear/);
    });

    test('应该能搜索文章', async ({ page }) => {
        await page.goto('/zh');

        // 在搜索框输入关键词
        const searchBar = page.locator('[data-testid="search-bar"] input');
        await searchBar.fill('潜水');
        await searchBar.press('Enter');

        // 验证跳转到搜索页面
        await expect(page).toHaveURL(/\/zh\/search\?q=潜水/);
    });

    test('应该有分页功能', async ({ page }) => {
        await page.goto('/zh');

        // 如果有分页，点击下一页
        const pagination = page.locator('[data-testid="pagination"]');
        const nextButton = pagination.locator('text=/下一页|Next/i');

        if (await nextButton.isVisible()) {
            await nextButton.click();
            await expect(page).toHaveURL(/page=2/);
        }
    });
});
