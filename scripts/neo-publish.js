#!/usr/bin/env node
// scripts/neo-publish.js
// Neo 工作流发布脚本
// 用法: node scripts/neo-publish.js <final.md 路径> [选项]

const fs = require('fs');
const path = require('path');

const API_URL = process.env.DIVEINFO_API_URL || 'http://localhost:3000';
const API_KEY = process.env.DIVEINFO_API_KEY || '';

async function publishArticle(filePath, options = {}) {
    // 读取 Markdown 文件
    const content = fs.readFileSync(filePath, 'utf-8');

    // 从文件名或内容提取标题
    let title = options.title;
    if (!title) {
        // 尝试从 Markdown 第一行提取标题
        const titleMatch = content.match(/^#\s+(.+)$/m);
        if (titleMatch) {
            title = titleMatch[1];
        } else {
            title = path.basename(filePath, '.md');
        }
    }

    // 尝试读取 .workflow/draft.json 获取元数据
    const workflowDir = path.dirname(filePath);
    const draftJsonPath = path.join(workflowDir, 'draft.json');
    let workflowMeta = {};

    if (fs.existsSync(draftJsonPath)) {
        try {
            workflowMeta = JSON.parse(fs.readFileSync(draftJsonPath, 'utf-8'));
        } catch (e) {
            console.warn('Warning: Could not parse draft.json');
        }
    }

    // 构建请求数据
    const payload = {
        version: '1.0',
        skill: workflowMeta.skill || 'neo-wright-review',
        timestamp: new Date().toISOString(),
        topic: workflowMeta.topic || '',
        title,
        content,
        locale: options.locale || 'zh',
        categorySlug: options.category,
        tagSlugs: options.tags ? options.tags.split(',') : [],
        coverImage: options.cover,
        metaTitle: options.metaTitle || title,
        metaDescription: options.metaDescription,
        published: options.draft !== true,
        workflow: {
            draftPath: filePath,
            reviewScore: workflowMeta.mini_scores ?
                Object.values(workflowMeta.mini_scores).reduce((a, b) => a + b, 0) / 6 :
                undefined,
        },
    };

    // 发送请求
    console.log(`Publishing: ${title}`);
    console.log(`API: ${API_URL}/api/neo/publish`);

    try {
        const response = await fetch(`${API_URL}/api/neo/publish`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${API_KEY}`,
            },
            body: JSON.stringify(payload),
        });

        const result = await response.json();

        if (response.ok) {
            console.log('✅ Published successfully!');
            console.log(`   Article ID: ${result.articleId}`);
            console.log(`   Slug: ${result.slug}`);
            console.log(`   URL: ${result.url}`);
            return { success: true, ...result };
        } else {
            console.error('❌ Publish failed:', result.error);
            return { success: false, error: result.error };
        }
    } catch (error) {
        console.error('❌ Network error:', error.message);
        return { success: false, error: error.message };
    }
}

// 解析命令行参数
function parseArgs(args) {
    const options = {};
    let filePath = null;

    for (let i = 0; i < args.length; i++) {
        const arg = args[i];

        if (arg.startsWith('--')) {
            const key = arg.slice(2);
            const value = args[i + 1];

            if (key === 'draft') {
                options.draft = true;
            } else if (value && !value.startsWith('--')) {
                options[key] = value;
                i++;
            }
        } else if (!filePath) {
            filePath = arg;
        }
    }

    return { filePath, options };
}

// 主函数
async function main() {
    const args = process.argv.slice(2);

    if (args.length === 0 || args.includes('--help')) {
        console.log(`
Neo 工作流发布脚本

用法:
  node scripts/neo-publish.js <file.md> [选项]

选项:
  --title <标题>        文章标题（默认从 Markdown 提取）
  --locale <zh|en>      语言（默认 zh）
  --category <slug>     分类 slug
  --tags <tag1,tag2>    标签（逗号分隔）
  --cover <url>         封面图 URL
  --metaTitle <标题>    SEO 标题
  --metaDescription     SEO 描述
  --draft               保存为草稿（不发布）
  --help                显示帮助

环境变量:
  DIVEINFO_API_URL      API 地址（默认 http://localhost:3000）
  DIVEINFO_API_KEY      API Key

示例:
  node scripts/neo-publish.js .workflow/final.md --category ai --tags ai,副业
`);
        process.exit(0);
    }

    const { filePath, options } = parseArgs(args);

    if (!filePath) {
        console.error('Error: Please specify a Markdown file');
        process.exit(1);
    }

    if (!fs.existsSync(filePath)) {
        console.error(`Error: File not found: ${filePath}`);
        process.exit(1);
    }

    if (!API_KEY) {
        console.warn('Warning: DIVEINFO_API_KEY not set');
    }

    const result = await publishArticle(filePath, options);
    process.exit(result.success ? 0 : 1);
}

main().catch(console.error);
