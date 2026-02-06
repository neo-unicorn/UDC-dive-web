# Oracle 审查报告：潜水资讯网站需求文档

> **审查日期**：2026-02-06  
> **审查范围**：需求文档 v1.0、DDL 设计、API 规范  
> **审查重点**：技术方案风险、数据库设计优化、可简化功能

---

## 一、技术方案风险

### 1.1 高风险项 🔴

#### (1) PostgreSQL 中文全文搜索

**问题描述：**
- `pg_jieba` 扩展在 Vercel Postgres / Neon 等托管数据库上**不一定可用**
- 需要联系服务商单独开启，或自建 PostgreSQL 实例
- 中文分词质量直接影响搜索体验

**风险评估：**
```
可能性：高
影响：中（搜索功能是核心功能之一）
```

**建议方案：**

| 方案 | 优点 | 缺点 | 推荐度 |
|------|------|------|--------|
| **方案A**: 使用 Algolia/MeiliSearch | 搜索质量好，中文支持完善 | 增加外部依赖和成本 | ⭐⭐⭐⭐ |
| **方案B**: 简单 LIKE 搜索 | 实现简单，无依赖 | 性能差，无分词 | ⭐⭐ |
| **方案C**: Supabase + pg_jieba | 官方支持中文搜索 | 需切换数据库服务商 | ⭐⭐⭐ |
| **方案D**: 延迟实现 | 先上线核心功能 | 搜索功能暂缺 | ⭐⭐⭐⭐⭐ |

**Oracle 建议**：MVP 阶段采用**方案D**，先用简单 LIKE 搜索，后期根据用户量决定是否接入专业搜索服务。

---

#### (2) Vercel Blob 图片存储成本

**问题描述：**
- Vercel Blob 免费额度有限（1GB 存储 + 5GB/月流量）
- 潜水类文章图片通常较大（水下摄影 1-5MB/张）
- 100 篇文章 × 5 张图 × 2MB = 1GB，很快超额

**风险评估：**
```
可能性：高
影响：中（可能产生意外费用）
```

**建议方案：**

| 方案 | 成本 | 复杂度 |
|------|------|--------|
| **Cloudflare R2** | 免费额度更大（10GB），流量免费 | 需额外配置 |
| **图片压缩 + WebP** | 减少 60-70% 存储 | 需上传时处理 |
| **外链图片** | 零成本 | 依赖第三方稳定性 |

**Oracle 建议**：
1. 上传时自动压缩 + 转换 WebP
2. 设置图片最大尺寸限制（如 1920px 宽）
3. 监控存储用量，接近限额时切换到 R2

---

#### (3) 双语文章关联的复杂性

**问题描述：**
- `linkedArticleId` 设计为单向关联，查询另一方向需额外逻辑
- Prisma schema 中的自引用关系可能导致循环查询问题
- 当只有一种语言版本时，用户体验如何处理？

**风险评估：**
```
可能性：中
影响：中（影响双语切换功能）
```

**建议优化：**

```sql
-- 当前设计（单向）
article_zh.linkedArticleId → article_en.id

-- 建议改为双向更新
-- 方案1：触发器自动同步
CREATE TRIGGER sync_linked_article
  AFTER INSERT OR UPDATE ON articles
  FOR EACH ROW
  EXECUTE FUNCTION sync_article_link();

-- 方案2：使用中间表（更灵活）
CREATE TABLE article_translations (
  article_id_1 TEXT NOT NULL,
  article_id_2 TEXT NOT NULL,
  PRIMARY KEY (article_id_1, article_id_2)
);
```

**Oracle 建议**：MVP 阶段保持当前设计，但在 API 层处理双向查询逻辑。

---

### 1.2 中风险项 🟡

#### (4) ISR（增量静态再生成）缓存失效

**问题描述：**
- 文章更新后，ISR 缓存可能延迟生效
- 用户可能看到旧内容
- On-demand revalidation 需要额外 API 调用

**建议：**
- 文章更新 API 中增加 `revalidatePath()` 调用
- 设置合理的 `revalidate` 时间（如 3600 秒）

---

#### (5) API Key 安全性

**问题描述：**
- 单一 API Key 无法区分不同来源
- 无 Key 轮换机制
- 无请求日志审计

**建议增加：**
```typescript
model ApiKey {
  // ... 现有字段
  lastUsedAt DateTime?      // 最后使用时间
  expiresAt  DateTime?      // 过期时间
  scope      String[]       // 权限范围 ["articles:write", "upload"]
}
```

---

### 1.3 低风险项 🟢

| 项目 | 说明 | 建议 |
|------|------|------|
| Rate Limiting | 需求中提及但无具体实现 | 使用 Vercel Edge Middleware 或 upstash/ratelimit |
| SEO sitemap | 需动态生成 | 使用 next-sitemap 库 |
| 阅读量统计 | 可能被刷 | 考虑 IP 去重或延迟统计 |

---

## 二、数据库设计优化

### 2.1 索引优化建议

**当前索引：**
```sql
idx_articles_locale_published  -- 复合索引 ✓
idx_articles_category          -- 单列索引 ✓
idx_articles_published_at      -- 时间索引 ✓
idx_articles_search            -- GIN 索引 ✓
```

**建议增加：**
```sql
-- 1. slug 查询优化（详情页常用）
CREATE INDEX idx_articles_slug_locale ON articles(slug, locale);

-- 2. 热门文章查询
CREATE INDEX idx_articles_view_count ON articles(view_count DESC) 
  WHERE published = true;

-- 3. 标签文章数统计优化
CREATE INDEX idx_tags_on_articles_tag_id ON tags_on_articles(tag_id);
-- （已有，确认）
```

---

### 2.2 表结构优化

#### (1) 建议增加 `reading_time` 字段

```sql
ALTER TABLE articles ADD COLUMN reading_time INTEGER;
-- 存储预计阅读分钟数（基于 word_count 计算）
-- 中文：400字/分钟，英文：200词/分钟
```

**理由**：避免前端重复计算，提升列表页渲染效率。

---

#### (2) 建议增加 `meta_title` 和 `meta_description`

```sql
ALTER TABLE articles ADD COLUMN meta_title TEXT;
ALTER TABLE articles ADD COLUMN meta_description TEXT;
```

**理由**：SEO 优化，允许自定义搜索引擎显示的标题和描述。

---

#### (3) 考虑 slug 生成策略

**当前问题：**
- slug 来源不明确（手动？自动生成？）
- 中文标题生成 slug 需要转换

**建议：**
```typescript
// 自动生成 slug 策略
function generateSlug(title: string, locale: string): string {
  if (locale === 'zh') {
    // 中文：使用 pinyin 转换 + 截断
    return pinyin(title, { style: 'normal' })
      .flat()
      .join('-')
      .slice(0, 50);
  } else {
    // 英文：直接 slugify
    return slugify(title, { lower: true, strict: true });
  }
}
```

---

### 2.3 数据一致性

**问题：双语文章的分类/标签不一致**

```
中文文章 A：category=gear, tags=[BCD, 浮力]
英文文章 B：category=training, tags=[buoyancy]  // 关联但分类不同？
```

**建议：**
- 要么强制双语文章共享同一 category
- 要么接受不一致（更灵活）

**Oracle 建议**：接受不一致，但在管理界面给出警告提示。

---

## 三、可简化功能

### 3.1 建议 MVP 移除的功能

| 功能 | 原因 | 影响 | 替代方案 |
|------|------|------|----------|
| **全文搜索** | 中文分词依赖复杂 | 中 | 先用 LIKE + 标签筛选 |
| **TOC 目录导航** | 非核心功能 | 低 | 可后期添加 |
| **社交分享按钮** | 第三方依赖多 | 低 | 用浏览器原生 Share API |
| **相关文章推荐** | 需要算法实现 | 低 | 先用"同分类最新" |
| **阅读量统计** | 可能被刷，需防护 | 低 | 延后或使用 Vercel Analytics |

### 3.2 建议简化的功能

#### (1) 标签系统简化

**当前设计**：标签有独立的 `nameZh` 和 `nameEn`

**简化方案**：
```sql
-- 直接使用 slug 作为显示名（适合技术类标签）
-- 如：BCD, PADI, SSI, Nitrox 不需要翻译

-- 或者只保留一个 name 字段
ALTER TABLE tags DROP COLUMN name_zh;
ALTER TABLE tags DROP COLUMN name_en;
ALTER TABLE tags ADD COLUMN name TEXT NOT NULL;
```

**Oracle 建议**：保留当前设计，但标签翻译可以延后填充。

---

#### (2) 分类列表页简化

**当前设计**：`/[locale]/categories` 独立页面

**简化方案**：
- 分类筛选整合到首页侧边栏
- 移除独立的分类列表页
- 减少一个路由和页面开发

---

#### (3) API 认证简化

**当前设计**：`ApiKey` 表 + Bearer Token

**简化方案（MVP）**：
```typescript
// 直接使用环境变量
const isAuthorized = request.headers.get('Authorization') === `Bearer ${process.env.API_KEY}`;
```

**后期再迁移到数据库管理的多 Key 模式。**

---

## 四、优化后的 MVP 范围

### 4.1 核心功能（必做）

| 功能 | 优先级 | 预估工时 |
|------|--------|----------|
| 文章 CRUD API | P0 | 4h |
| 首页文章列表 | P0 | 4h |
| 文章详情页（Markdown 渲染）| P0 | 4h |
| 分类筛选 | P0 | 2h |
| 双语切换 | P0 | 3h |
| 图片上传 API | P0 | 2h |

**MVP 工时**：约 19 小时（2-3 天）

### 4.2 增强功能（后做）

| 功能 | 优先级 | 触发条件 |
|------|--------|----------|
| 全文搜索 | P1 | 文章数 > 50 |
| 相关推荐 | P1 | 用户反馈需要 |
| 阅读量统计 | P2 | 需要数据分析时 |
| TOC 目录 | P2 | 长文章增多时 |
| RSS Feed | P2 | SEO 需求 |

---

## 五、修改建议汇总

### 5.1 需求文档修改

```markdown
## 修改清单

1. [ ] 搜索功能降级为"简单搜索"，移除 pg_jieba 依赖
2. [ ] 图片存储增加压缩策略说明
3. [ ] 阅读量统计标记为"可选功能"
4. [ ] TOC 目录标记为"Phase 2"
5. [ ] 相关推荐标记为"Phase 2"
```

### 5.2 DDL 修改

```sql
-- 增加字段
ALTER TABLE articles ADD COLUMN reading_time INTEGER;
ALTER TABLE articles ADD COLUMN meta_title TEXT;
ALTER TABLE articles ADD COLUMN meta_description TEXT;

-- 增加索引
CREATE INDEX idx_articles_slug_locale ON articles(slug, locale);
```

### 5.3 API 修改

```typescript
// CreateArticleRequest 增加可选字段
interface CreateArticleRequest {
  // ... 现有字段
  metaTitle?: string;
  metaDescription?: string;
}
```

---

## 六、风险矩阵总览

```
影响 ↑
  高 │         [搜索功能]
     │  
  中 │ [图片成本]  [双语关联]  [ISR缓存]
     │
  低 │ [Rate Limit] [阅读量刷量]
     └────────────────────────────→ 可能性
           低        中        高
```

---

## 七、结论

**总体评估**：需求文档设计合理，技术选型主流，但存在以下需要关注的点：

1. **最大风险**：中文全文搜索的实现，建议 MVP 降级
2. **成本风险**：图片存储需要监控和优化策略
3. **复杂度风险**：双语关联逻辑需要在 API 层仔细处理

**建议优先级**：
1. 先完成无搜索版本的 MVP
2. 图片上传时自动压缩
3. 监控运行数据后再优化

---

*Oracle 审查完成 - 2026-02-06*
