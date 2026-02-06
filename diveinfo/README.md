# 潜水资讯 (DiveInfo)

双语潜水资讯网站，支持中文和英文内容。

## 技术栈

- **框架**: Next.js 14 (App Router)
- **语言**: TypeScript
- **样式**: Tailwind CSS
- **数据库**: PostgreSQL (Neon) + Prisma ORM
- **搜索**: PostgreSQL 全文搜索 + pg_jieba 中文分词
- **图片存储**: Vercel Blob
- **国际化**: next-intl
- **测试**: Vitest + React Testing Library + Playwright

## 开发

```bash
# 安装依赖
npm install

# 生成 Prisma Client
npm run db:generate

# 启动开发服务器
npm run dev

# 运行测试
npm test

# 运行 E2E 测试
npm run test:e2e
```

## 项目结构

```
diveinfo/
├── docs/                    # 📄 技术文档
├── __tests__/               # 🧪 测试代码
├── prisma/                  # 数据库模型
├── src/
│   ├── app/                 # Next.js 页面和 API
│   ├── components/          # React 组件
│   ├── lib/                 # 工具函数
│   ├── types/               # TypeScript 类型
│   └── i18n/                # 国际化配置
└── scripts/                 # 工具脚本
```

## 环境变量

复制 `.env.example` 到 `.env` 并填写：

```env
DATABASE_URL="postgresql://..."
BLOB_READ_WRITE_TOKEN="..."
API_KEY="your-secret-api-key"
NEXT_PUBLIC_BASE_URL="http://localhost:3000"
```
