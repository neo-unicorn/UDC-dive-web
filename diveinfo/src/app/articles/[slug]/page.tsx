import Link from 'next/link';
import { notFound } from 'next/navigation';

interface ArticlePageProps {
  params: { slug: string };
}

// 模拟文章数据（实际会从数据库获取）
async function getArticle(slug: string) {
  // TODO: 从Prisma数据库获取
  const mockArticle = {
    id: slug,
    title: '马尔代夫海龟共游指南',
    excerpt: '在印度洋最美的水域与温柔的海龟一起探索珊瑚礁',
    content: `
## 前言

马尔代夫是世界上最适合与海龟共游的目的地之一。这里的海水清澈，能见度极高，海龟数量众多且不怕人。

## 最佳观赏时间

全年都可以看到海龟，但最佳季节是11月至4月的干季。这段时间海水能见度最高，可达30米以上。

## 常见海龟种类

### 绿海龟 (Green Sea Turtle)
- 体型较大，可达1.5米
- 主要以海草为食
- 性格温顺，容易接近

### 玳瑁 (Hawksbill Turtle)
- 体型中等，约1米
- 喜欢在珊瑚礁觅食
- 嘴部呈鹰钩状

## 共游技巧

1. **保持距离**：与海龟保持至少2米距离
2. **不要追逐**：让海龟自己靠近你
3. **缓慢移动**：急促的动作会惊吓海龟
4. **不要触摸**：触摸可能伤害海龟的保护层

## 推荐潜点

- **Kuredu岛**：海龟清洁站
- **Maaya Thila**：夜潜看海龟
- **Banana Reef**：珊瑚礁与海龟

## 摄影建议

- 使用广角镜头捕捉海龟与环境
- 注意控制闪光灯使用
- 耐心等待最佳角度
    `,
    coverImage: 'https://images.unsplash.com/photo-1591025207163-942350e47db2?w=1200',
    category: { name: '旅行目的地', slug: 'travel' },
    tags: [{ name: '马尔代夫' }, { name: '海龟' }, { name: '潜水旅行' }],
    publishedAt: new Date('2024-01-15'),
    readingTime: 8,
    author: {
      name: 'UDC DIVE',
      avatar: '/avatar.jpg',
    },
  };

  return mockArticle;
}

// 相关文章
async function getRelatedArticles() {
  return [
    {
      slug: '1',
      title: '印尼四王岛潜水攻略',
      image: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=400',
      category: '旅行',
    },
    {
      slug: '2',
      title: '水下摄影入门技巧',
      image: 'https://images.unsplash.com/photo-1682687220742-aba13b6e50ba?w=400',
      category: '摄影',
    },
    {
      slug: '3',
      title: '海龟保护：我们能做什么',
      image: 'https://images.unsplash.com/photo-1546500840-ae38253aba9b?w=400',
      category: '海洋保护',
    },
  ];
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const article = await getArticle(params.slug);
  const relatedArticles = await getRelatedArticles();

  if (!article) {
    notFound();
  }

  return (
    <article className="min-h-screen">
      {/* Hero */}
      <div className="relative h-[50vh] min-h-[400px]">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${article.coverImage})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-8 max-w-4xl mx-auto">
          <Link
            href={`/categories/${article.category.slug}`}
            className="inline-block bg-sky-600 text-white text-sm font-semibold px-4 py-1 rounded-full mb-4"
          >
            {article.category.name}
          </Link>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            {article.title}
          </h1>
          <p className="text-xl text-sky-100 mb-4">{article.excerpt}</p>
          <div className="flex items-center gap-4 text-white/80 text-sm">
            <span>{article.publishedAt.toLocaleDateString('zh-CN')}</span>
            <span>·</span>
            <span>{article.readingTime} 分钟阅读</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Main Content */}
          <div className="flex-1">
            <div className="prose prose-lg prose-sky max-w-none">
              {/* 简单的Markdown渲染，实际项目中使用react-markdown */}
              {article.content.split('\n').map((line, idx) => {
                if (line.startsWith('## ')) {
                  return <h2 key={idx} className="text-2xl font-bold text-slate-800 mt-8 mb-4">{line.slice(3)}</h2>;
                }
                if (line.startsWith('### ')) {
                  return <h3 key={idx} className="text-xl font-bold text-slate-700 mt-6 mb-3">{line.slice(4)}</h3>;
                }
                if (line.startsWith('- ')) {
                  return <li key={idx} className="text-slate-600 ml-4">{line.slice(2)}</li>;
                }
                if (line.match(/^\d\./)) {
                  return <li key={idx} className="text-slate-600 ml-4 list-decimal">{line.slice(3)}</li>;
                }
                if (line.trim()) {
                  return <p key={idx} className="text-slate-600 mb-4 leading-relaxed">{line}</p>;
                }
                return null;
              })}
            </div>

            {/* Tags */}
            <div className="mt-12 pt-8 border-t">
              <h3 className="font-semibold text-slate-800 mb-4">相关标签</h3>
              <div className="flex flex-wrap gap-2">
                {article.tags.map((tag, idx) => (
                  <Link key={idx} href={`/tags/${tag.name}`} className="tag">
                    {tag.name}
                  </Link>
                ))}
              </div>
            </div>

            {/* Share */}
            <div className="mt-8 pt-8 border-t">
              <h3 className="font-semibold text-slate-800 mb-4">分享文章</h3>
              <div className="flex gap-3">
                <button className="w-10 h-10 bg-sky-100 text-sky-600 rounded-full flex items-center justify-center hover:bg-sky-200 transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                  </svg>
                </button>
                <button className="w-10 h-10 bg-sky-100 text-sky-600 rounded-full flex items-center justify-center hover:bg-sky-200 transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                </button>
                <button className="w-10 h-10 bg-sky-100 text-sky-600 rounded-full flex items-center justify-center hover:bg-sky-200 transition-colors">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <aside className="w-full lg:w-80">
            <div className="sticky top-24">
              {/* Author */}
              <div className="card p-6 mb-6">
                <h3 className="font-semibold text-slate-800 mb-4">关于作者</h3>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-sky-100 rounded-full flex items-center justify-center">
                    <span className="text-sky-600 font-bold">U</span>
                  </div>
                  <div>
                    <p className="font-medium text-slate-800">{article.author.name}</p>
                    <p className="text-sm text-slate-600">潜水资讯编辑</p>
                  </div>
                </div>
              </div>

              {/* Related Articles */}
              <div className="card p-6">
                <h3 className="font-semibold text-slate-800 mb-4">相关文章</h3>
                <div className="space-y-4">
                  {relatedArticles.map((item, idx) => (
                    <Link key={idx} href={`/articles/${item.slug}`} className="flex gap-3 group">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-20 h-16 object-cover rounded-lg"
                      />
                      <div className="flex-1">
                        <span className="text-xs text-sky-600 font-medium">{item.category}</span>
                        <h4 className="text-sm font-medium text-slate-800 group-hover:text-sky-600 transition-colors line-clamp-2">
                          {item.title}
                        </h4>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>

      {/* More Articles */}
      <section className="bg-slate-50 py-16">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-slate-800 mb-8">更多精彩文章</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {relatedArticles.map((item, idx) => (
              <Link key={idx} href={`/articles/${item.slug}`} className="card card-hover">
                <div className="aspect-video relative overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-5">
                  <span className="text-xs text-sky-600 font-medium">{item.category}</span>
                  <h3 className="font-bold text-slate-800 mt-1">{item.title}</h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </article>
  );
}
