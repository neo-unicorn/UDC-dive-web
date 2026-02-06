import Link from 'next/link';

interface CategoryPageProps {
  params: { slug: string };
}

const categoryData: Record<string, { name: string; description: string; icon: string }> = {
  training: { name: '培训课程', description: '从入门到专业，全面的潜水培训课程', icon: '🎓' },
  travel: { name: '旅行目的地', description: '探索全球最美的潜水圣地', icon: '✈️' },
  photo: { name: '水下摄影', description: '记录海底世界的精彩瞬间', icon: '📷' },
  'marine-life': { name: '海洋生物', description: '认识奇妙的海洋生物', icon: '🐠' },
  gear: { name: '装备指南', description: '选择适合你的潜水装备', icon: '🤿' },
  community: { name: '社区', description: '与潜水爱好者交流分享', icon: '👥' },
};

async function getCategoryArticles(slug: string) {
  // 模拟数据，实际从数据库获取
  return [
    {
      slug: '1',
      title: '马尔代夫海龟共游指南',
      excerpt: '在印度洋最美的水域与温柔的海龟一起探索珊瑚礁',
      image: 'https://images.unsplash.com/photo-1591025207163-942350e47db2?w=600',
      publishedAt: '2024-01-15',
      readingTime: 8,
    },
    {
      slug: '2',
      title: '印尼四王岛潜水攻略',
      excerpt: '地球上海洋生物多样性最高的区域，潜水员的终极梦想',
      image: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=600',
      publishedAt: '2024-01-12',
      readingTime: 10,
    },
    {
      slug: '3',
      title: '红海沉船探险之旅',
      excerpt: '探索历史悠久的沉船遗迹，感受独特的水下世界',
      image: 'https://images.unsplash.com/photo-1582967788606-a171c1080cb0?w=600',
      publishedAt: '2024-01-10',
      readingTime: 7,
    },
    {
      slug: '4',
      title: '帕劳蓝洞深潜体验',
      excerpt: '挑战世界著名的蓝洞潜点，体验极致深潜',
      image: 'https://images.unsplash.com/photo-1544551763-77ef2d0cfc6c?w=600',
      publishedAt: '2024-01-08',
      readingTime: 6,
    },
    {
      slug: '5',
      title: '菲律宾薄荷岛鲸鲨行',
      excerpt: '与世界上最大的鱼类面对面，感受大自然的震撼',
      image: 'https://images.unsplash.com/photo-1560275619-4662e36fa65c?w=600',
      publishedAt: '2024-01-05',
      readingTime: 9,
    },
    {
      slug: '6',
      title: '加拉帕戈斯群岛探索',
      excerpt: '在达尔文的灵感之地，邂逅独特的海洋生物',
      image: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=600',
      publishedAt: '2024-01-03',
      readingTime: 11,
    },
  ];
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const category = categoryData[params.slug] || {
    name: '分类',
    description: '浏览该分类下的所有文章',
    icon: '📚',
  };
  const articles = await getCategoryArticles(params.slug);

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="ocean-gradient py-16 text-white">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <span className="text-6xl mb-4 block">{category.icon}</span>
          <h1 className="text-4xl font-bold mb-4">{category.name}</h1>
          <p className="text-xl text-sky-100 max-w-2xl mx-auto">{category.description}</p>
        </div>
      </section>

      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <nav className="flex items-center gap-2 text-sm">
            <Link href="/" className="text-slate-600 hover:text-sky-600">首页</Link>
            <span className="text-slate-400">/</span>
            <span className="text-slate-800 font-medium">{category.name}</span>
          </nav>
        </div>
      </div>

      {/* Articles Grid */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <p className="text-slate-600">共 {articles.length} 篇文章</p>
            <select className="px-4 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-sky-500 outline-none">
              <option>最新发布</option>
              <option>最多阅读</option>
              <option>最多评论</option>
            </select>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {articles.map((article) => (
              <Link
                key={article.slug}
                href={`/articles/${article.slug}`}
                className="card card-hover group"
              >
                <div className="aspect-video relative overflow-hidden">
                  <img
                    src={article.image}
                    alt={article.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-6">
                  <h2 className="text-xl font-bold text-slate-800 mb-2 group-hover:text-sky-600 transition-colors">
                    {article.title}
                  </h2>
                  <p className="text-slate-600 mb-4 line-clamp-2">{article.excerpt}</p>
                  <div className="flex items-center justify-between text-sm text-slate-500">
                    <span>{article.publishedAt}</span>
                    <span>{article.readingTime} 分钟阅读</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Pagination */}
          <div className="flex justify-center mt-12">
            <nav className="flex items-center gap-2">
              <button className="w-10 h-10 flex items-center justify-center rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button className="w-10 h-10 flex items-center justify-center rounded-lg bg-sky-600 text-white font-medium">1</button>
              <button className="w-10 h-10 flex items-center justify-center rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50">2</button>
              <button className="w-10 h-10 flex items-center justify-center rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50">3</button>
              <span className="px-2 text-slate-400">...</span>
              <button className="w-10 h-10 flex items-center justify-center rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50">10</button>
              <button className="w-10 h-10 flex items-center justify-center rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </nav>
          </div>
        </div>
      </section>
    </div>
  );
}
