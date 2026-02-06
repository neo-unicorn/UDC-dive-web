# Vercel 部署环境变量清单

## 必需变量

### 1. 数据库
DATABASE_URL=postgresql://username:password@host:port/database
# 示例：使用 Vercel Postgres 或 Neon

### 2. 存储
BLOB_READ_WRITE_TOKEN=vercel_blob_token_here
# Vercel Blob 存储令牌

### 3. API 认证
API_KEY=your-secret-api-key-min-32-chars
# 用于 Neo 工作流发布文章的 API 密钥

### 4. 应用配置
NEXT_PUBLIC_BASE_URL=https://your-domain.vercel.app
NEXT_PUBLIC_DEFAULT_LOCALE=zh

## 可选变量

### 5. 分析（可选）
# NEXT_PUBLIC_ANALYTICS_ID=

### 6. 其他（可选）
# NODE_ENV=production

## 获取方式

1. Vercel Postgres：
   - Vercel Dashboard → Storage → Create Database
   - 复制 Connection String

2. Vercel Blob：
   - Vercel Dashboard → Storage → Blob
   - 创建 Token

3. API_KEY：
   - 自定义随机字符串（32位以上）
   - 用于 Neo 工作流认证

## 部署后检查清单

- [ ] 首页可访问
- [ ] API /api/articles 返回数据
- [ ] 文章详情页正常显示
- [ ] 双语切换工作
- [ ] Neo 发布接口可用（POST /api/neo/publish）
