// __tests__/e2e/homepage.spec.ts
import { test, expect } from '@playwright/test';

test.describe('首页', () => {
  test('首页应该成功加载', async ({ page }) => {
    await page.goto('/zh');
    await expect(page).toHaveTitle(/DiveInfo|潜水/);
  });

  test('应该显示文章列表', async ({ page }) => {
    await page.goto('/zh');
    const articleList = page.locator('[data-testid="article-list"]');
    await expect(articleList).toBeVisible();
  });

  test('点击文章应该跳转到详情页', async ({ page }) => {
    await page.goto('/zh');
    const firstCard = page.locator('[data-testid="article-card"]').first();
    await firstCard.click();
    await expect(page).toHaveURL(/\/zh\/articles\/.+/);
  });
});
