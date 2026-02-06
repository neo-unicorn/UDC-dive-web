import { defineConfig, devices } from '@playwright/test';

/**
 * Playwright E2E 测试配置
 * @see https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
    testDir: './__tests__/e2e',
    /* 并行运行测试 */
    fullyParallel: true,
    /* 在 CI 上禁止 test.only */
    forbidOnly: !!process.env.CI,
    /* 重试次数 */
    retries: process.env.CI ? 2 : 0,
    /* 并行工作进程数 */
    workers: process.env.CI ? 1 : undefined,
    /* 报告器 */
    reporter: 'html',
    /* 所有项目共享的配置 */
    use: {
        /* 基础 URL */
        baseURL: 'http://localhost:3000',
        /* 失败时收集追踪信息 */
        trace: 'on-first-retry',
    },

    /* 配置多个浏览器项目 */
    projects: [
        {
            name: 'chromium',
            use: { ...devices['Desktop Chrome'] },
        },
        {
            name: 'firefox',
            use: { ...devices['Desktop Firefox'] },
        },
        {
            name: 'webkit',
            use: { ...devices['Desktop Safari'] },
        },
        /* 移动端测试 */
        {
            name: 'Mobile Chrome',
            use: { ...devices['Pixel 5'] },
        },
    ],

    /* 运行测试前启动开发服务器 */
    webServer: {
        command: 'npm run dev',
        url: 'http://localhost:3000',
        reuseExistingServer: !process.env.CI,
    },
});
