# 06-补充-MVP功能简化与风险应对

> **更新日期**：2026-02-06  
> **来源**：Amp Code 审查建议

---

## 一、技术风险与应对

| 风险 | 原方案 | MVP 调整 |
|------|--------|----------|
| **中文全文搜索** | pg_jieba 在托管数据库不可用 | ✅ 用 `ILIKE` + 标签筛选 |
| **图片存储成本** | Vercel Blob 免费额度有限 | ✅ 自动压缩 + WebP 格式 |
| **双语关联复杂** | linkedArticleId 双向查询 | ✅ 保持设计，API 层处理 |

---

## 二、功能调整清单

### 保留（Phase 1 MVP）

| 功能 | 说明 |
|------|------|
| ✅ 文章 CRUD API | 创建/读取/更新/删除 |
| ✅ 首页列表 | 3:2 卡片布局 + 分页 |
| ✅ 分类筛选 | Training/Travel/Photo/Marine Life/Gear/Community |
| ✅ 标签筛选 | 自由标签 + 热门标签云 |
| ✅ Markdown 渲染 | 正文渲染（代码高亮、图片）|
| ✅ 双语切换 | zh/en URL 路由 |
| ✅ 简单搜索 | ILIKE 匹配标题+正文 |

### 延后（Phase 2+）

| 功能 | 原因 | 替代方案 |
|------|------|----------|
| ⏸️ 全文搜索 | pg_jieba 不可用 | 改用 Meilisearch/Algolia |
| ⏸️ TOC 目录导航 | 增加复杂度 | Phase 2 实现 |
| ⏸️ 智能相关推荐 | 需要算法支持 | 暂用"同分类最新" |
| ⏸️ 阅读量统计 | 需要防刷机制 | Phase 2 实现 |

---

## 三、数据库 Schema 更新

### 新增字段

```prisma
model Article {
  // ... 原有字段 ...
  
  // SEO 元数据
  metaTitle        String?  @map("meta_title")
  metaDescription  String?  @map("meta_description")
  
  // 阅读时间（分钟）
  readingTime      Int      @default(0) @map("reading_time")
}
```

### 新增索引

```sql
-- slug + locale 复合索引（优化双语查询）
CREATE INDEX idx_articles_slug_locale ON articles(slug, locale);
```

### Slug 自动生成策略

```typescript
function generateSlug(title: string, locale: string): string {
  // 1. 中文: 使用 pinyin 转换
  // 2. 英文: 使用 slugify
  // 3. 添加随机后缀避免重复
  // 格式: {slug}-{locale}-{random4}
  // 示例: diving-basics-zh-a1b2
}
```

---

## 四、更新的开发计划

### MVP 周期：2-3 天

| 阶段 | 内容 | 时间 |
|------|------|------|
| Day 1 上午 | 实现 API 路由（文章 CRUD）| 3h |
| Day 1 下午 | 实现 LIKE 搜索 + 分类/标签 API | 3h |
| Day 2 上午 | 首页 + 列表组件 | 3h |
| Day 2 下午 | 文章详情页 + Markdown 渲染 | 3h |
| Day 3 | 双语切换 + 部署 + 测试 | 4h |

**总计**：约 16 小时（2-3 天）

---

## 五、分类更新

| slug | 中文名 | 英文名 |
|------|--------|--------|
| training | 培训教程 | Training |
| travel | 潜点旅行 | Travel |
| photo | 水下摄影 | Photography |
| marine-life | 海洋生物 | Marine Life |
| gear | 装备评测 | Gear |
| community | 社区动态 | Community |

---

## 六、图片优化策略

```typescript
// 上传时自动处理
async function processImage(file: File) {
  // 1. 压缩到最大 500KB
  // 2. 转换为 WebP 格式
  // 3. 生成缩略图（封面用 400x267）
  // 4. 上传到 Vercel Blob
}
```

---

## 七、后续迭代计划

### Phase 2（MVP 后 1-2 周）

- 全文搜索（Meilisearch）
- TOC 目录导航
- 阅读量统计

### Phase 3

- 智能相关推荐
- 用户评论系统
- Newsletter 订阅
