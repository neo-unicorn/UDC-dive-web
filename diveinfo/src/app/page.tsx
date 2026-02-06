import Image from 'next/image';
import Link from 'next/link';

// Hero Section
function HeroSection() {
  return (
    <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 ocean-gradient" />
      <div 
        className="absolute inset-0 bg-cover bg-center opacity-30"
        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=1920')" }}
      />
      
      {/* Content */}
      <div className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto">
        <h1 className="text-5xl md:text-7xl font-bold mb-6 animate-fade-in">
          UDC DIVE
        </h1>
        <p className="text-xl md:text-2xl mb-8 text-sky-100">
          探索海洋世界的无限可能
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/articles" className="btn-primary">
            最新文章
          </Link>
          <Link href="/training" className="btn-secondary !text-white !border-white hover:!bg-white/20">
            开始学习
          </Link>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <svg className="w-6 h-6 text-white/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </div>
    </section>
  );
}

// Category Navigation
function CategoryNav() {
  const categories = [
    { id: 'training', name: '培训课程', icon: '🎓' },
    { id: 'travel', name: '旅行目的地', icon: '✈️' },
    { id: 'photo', name: '水下摄影', icon: '📷' },
    { id: 'marine-life', name: '海洋生物', icon: '🐠' },
    { id: 'gear', name: '装备指南', icon: '🤿' },
    { id: 'community', name: '社区', icon: '👥' },
  ];

  return (
    <section className="py-8 bg-white border-b">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-wrap justify-center gap-4 md:gap-8">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/categories/${cat.id}`}
              className="flex items-center gap-2 px-4 py-2 rounded-full hover:bg-sky-50 transition-colors"
            >
              <span className="text-xl">{cat.icon}</span>
              <span className="font-medium text-slate-700">{cat.name}</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

// Featured Articles
function FeaturedSection() {
  const featured = [
    {
      title: '马尔代夫海龟共游指南',
      excerpt: '在印度洋最美的水域与温柔的海龟一起探索珊瑚礁',
      image: 'https://images.unsplash.com/photo-1591025207163-942350e47db2?w=600',
      category: '旅行',
    },
    {
      title: '水下摄影进阶技巧',
      excerpt: '掌握微距摄影，捕捉海洋生物的精彩瞬间',
      image: 'https://images.unsplash.com/photo-1682687220742-aba13b6e50ba?w=600',
      category: '摄影',
    },
    {
      title: 'PADI 进阶开放水域课程',
      excerpt: '提升你的潜水技能，探索更深的海底世界',
      image: 'https://images.unsplash.com/photo-1544551763-77ef2d0cfc6c?w=600',
      category: '培训',
    },
  ];

  return (
    <section className="py-16 bg-gradient-to-b from-white to-sky-50">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="section-title text-center">精选推荐</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {featured.map((item, idx) => (
            <Link href={`/articles/${idx}`} key={idx} className="card card-hover group">
              <div className="aspect-video relative overflow-hidden">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <span className="absolute top-4 left-4 bg-sky-600 text-white text-xs font-semibold px-3 py-1 rounded-full">
                  {item.category}
                </span>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-slate-800 mb-2 group-hover:text-sky-600 transition-colors">
                  {item.title}
                </h3>
                <p className="text-slate-600">{item.excerpt}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

// Latest Articles
function LatestArticles() {
  const articles = [
    { title: '深潜技巧：如何安全下潜至30米', image: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400' },
    { title: '印尼科莫多岛潜水攻略', image: 'https://images.unsplash.com/photo-1583212292454-1fe6229603b7?w=400' },
    { title: '夜潜入门：发现海洋的另一面', image: 'https://images.unsplash.com/photo-1546026423-cc4642628d2b?w=400' },
    { title: '潜水相机选购指南2024', image: 'https://images.unsplash.com/photo-1621570275079-ce0ed82da711?w=400' },
    { title: '珊瑚礁保护：我们能做什么', image: 'https://images.unsplash.com/photo-1546500840-ae38253aba9b?w=400' },
    { title: '自由潜水与水肺潜水的区别', image: 'https://images.unsplash.com/photo-1571145541179-1a4e677e4c51?w=400' },
  ];

  return (
    <section className="py-16">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="section-title text-center">最新文章</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {articles.map((article, idx) => (
            <Link href={`/articles/${idx}`} key={idx} className="group">
              <div className="aspect-square relative rounded-xl overflow-hidden">
                <img
                  src={article.image}
                  alt={article.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                <h3 className="absolute bottom-3 left-3 right-3 text-white text-sm font-medium line-clamp-2">
                  {article.title}
                </h3>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

// Training Courses
function TrainingSection() {
  const courses = [
    {
      title: '开放水域潜水员',
      description: '开启你的潜水之旅，获得全球认可的潜水证书',
      features: ['理论课程与泳池训练', '4次开放水域潜水', '终身有效认证'],
      color: 'from-sky-500 to-cyan-400',
    },
    {
      title: '进阶开放水域',
      description: '提升技能，探索专业潜水领域',
      features: ['深潜与导航专长', '5次专业训练潜水', '选修多种专业课程'],
      color: 'from-blue-600 to-sky-500',
    },
    {
      title: '救援潜水员',
      description: '成为一名有责任心的潜水员',
      features: ['应急处理与救援技能', '情景模拟训练', '自救与救人能力'],
      color: 'from-indigo-600 to-blue-500',
    },
  ];

  return (
    <section className="py-16 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="section-title text-center">培训课程</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {courses.map((course, idx) => (
            <div key={idx} className="card overflow-hidden">
              <div className={`h-2 bg-gradient-to-r ${course.color}`} />
              <div className="p-6">
                <h3 className="text-xl font-bold text-slate-800 mb-2">{course.title}</h3>
                <p className="text-slate-600 mb-4">{course.description}</p>
                <ul className="space-y-2">
                  {course.features.map((feature, fidx) => (
                    <li key={fidx} className="flex items-center text-sm text-slate-600">
                      <svg className="w-5 h-5 text-sky-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      {feature}
                    </li>
                  ))}
                </ul>
                <Link href={`/training/${idx}`} className="mt-6 block text-center btn-primary">
                  了解更多
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// Popular Destinations
function DestinationsSection() {
  const destinations = [
    {
      name: '马尔代夫',
      description: '世界顶级潜水度假胜地，拥有丰富的海洋生物和清澈的海水',
      image: 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=600',
    },
    {
      name: '印尼四王岛',
      description: '地球上海洋生物多样性最高的区域，潜水员的终极梦想',
      image: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=600',
    },
    {
      name: '墨西哥科苏梅尔',
      description: '加勒比海明珠，清澈的海水和壮观的水下地形',
      image: 'https://images.unsplash.com/photo-1505118380757-91f5f5632de0?w=600',
    },
    {
      name: '埃及红海',
      description: '历史悠久的潜水圣地，沉船探险与珊瑚礁的完美结合',
      image: 'https://images.unsplash.com/photo-1582967788606-a171c1080cb0?w=600',
    },
  ];

  return (
    <section className="py-16">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="section-title text-center">热门旅行目的地</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {destinations.map((dest, idx) => (
            <Link href={`/destinations/${idx}`} key={idx} className="card card-hover group">
              <div className="aspect-[4/3] relative overflow-hidden">
                <img
                  src={dest.image}
                  alt={dest.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-5">
                <h3 className="text-lg font-bold text-slate-800 mb-2">{dest.name}</h3>
                <p className="text-sm text-slate-600 line-clamp-2">{dest.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

// Photography Gallery
function PhotographySection() {
  const photos = [
    { title: '海洋微距摄影', subtitle: '发现海底世界的微小奇迹', image: 'https://images.unsplash.com/photo-1596414086775-3e321b1be97d?w=800' },
    { title: '广角构图技巧', subtitle: '捕捉壮阔的海底景观', image: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800' },
    { title: '大型生物摄影', subtitle: '与鲨鱼、鳐鱼的亲密接触', image: 'https://images.unsplash.com/photo-1560275619-4662e36fa65c?w=800' },
    { title: '夜潜摄影挑战', subtitle: '探索夜间海洋的神秘魅力', image: 'https://images.unsplash.com/photo-1571752726703-5e7d1f6a986d?w=800' },
  ];

  return (
    <section className="py-16 bg-slate-900 text-white">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="section-title text-center text-white">水下摄影精选</h2>
        <div className="grid md:grid-cols-2 gap-6">
          {photos.map((photo, idx) => (
            <Link href={`/photography/${idx}`} key={idx} className="group relative aspect-video rounded-xl overflow-hidden">
              <img
                src={photo.image}
                alt={photo.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <div className="absolute bottom-6 left-6">
                <h3 className="text-xl font-bold mb-1">{photo.title}</h3>
                <p className="text-sky-300">{photo.subtitle}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

// Marine Life Encyclopedia
function MarineLifeSection() {
  const categories = [
    { name: '珊瑚礁鱼类', description: '认识五彩缤纷的热带鱼类', icon: '🐠' },
    { name: '头足类动物', description: '章鱼、乌贼的智慧世界', icon: '🐙' },
    { name: '珊瑚与无脊椎', description: '珊瑚礁生态系统的建设者', icon: '🪸' },
    { name: '鲨鱼与鳐鱼', description: '海洋顶级掠食者的真实面貌', icon: '🦈' },
    { name: '海龟保护', description: '关注濒危海龟的生存现状', icon: '🐢' },
    { name: '海洋哺乳动物', description: '海豚、鲸鱼的精彩生活', icon: '🐬' },
  ];

  return (
    <section className="py-16 bg-sky-50">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="section-title text-center">海洋生物百科</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((cat, idx) => (
            <Link
              href={`/marine-life/${idx}`}
              key={idx}
              className="card p-6 text-center hover:bg-sky-100 transition-colors"
            >
              <span className="text-4xl mb-3 block">{cat.icon}</span>
              <h3 className="font-bold text-slate-800 mb-1">{cat.name}</h3>
              <p className="text-xs text-slate-600">{cat.description}</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

// Gear Guide
function GearSection() {
  const gear = [
    { name: '面镜与呼吸管', description: '选择合适的面镜，确保舒适密封', icon: '🤿' },
    { name: '潜水服', description: '干衣、湿衣的选择与保养技巧', icon: '🩱' },
    { name: '调节器系统', description: '了解呼吸系统的工作原理', icon: '⚙️' },
    { name: '潜水电脑', description: '现代潜水必备的安全装备', icon: '⌚' },
  ];

  return (
    <section className="py-16">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="section-title text-center">潜水装备指南</h2>
        <div className="grid md:grid-cols-4 gap-6">
          {gear.map((item, idx) => (
            <Link href={`/gear/${idx}`} key={idx} className="card p-6 text-center card-hover">
              <span className="text-5xl mb-4 block">{item.icon}</span>
              <h3 className="font-bold text-slate-800 mb-2">{item.name}</h3>
              <p className="text-sm text-slate-600">{item.description}</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

// Popular Tags
function TagsSection() {
  const tags = [
    '马尔代夫', '水下摄影', 'PADI课程', '珊瑚礁', '海龟', '沉船探险',
    '潜水装备', '海洋保护', '自由潜水', '夜潜', '微距摄影', '鲨鱼',
    '潜水度假', '洞穴潜水', '技术潜水',
  ];

  return (
    <section className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-xl font-bold text-slate-800 mb-6 text-center">热门标签</h2>
        <div className="flex flex-wrap justify-center gap-3">
          {tags.map((tag, idx) => (
            <Link href={`/tags/${tag}`} key={idx} className="tag">
              {tag}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

// Newsletter
function NewsletterSection() {
  return (
    <section className="py-16 ocean-gradient text-white">
      <div className="max-w-3xl mx-auto px-4 text-center">
        <h2 className="text-3xl font-bold mb-4">加入我们的社区</h2>
        <p className="text-sky-100 mb-8">
          订阅 Newsletter，获取最新的潜水资讯、课程优惠和旅行攻略
        </p>
        
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 mb-8">
          <p className="font-semibold mb-4">每周精选内容直达邮箱</p>
          <ul className="text-left text-sm space-y-2 mb-6 max-w-md mx-auto">
            <li className="flex items-center gap-2">
              <svg className="w-5 h-5 text-sky-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              潜水技巧与安全知识
            </li>
            <li className="flex items-center gap-2">
              <svg className="w-5 h-5 text-sky-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              全球潜点推荐
            </li>
            <li className="flex items-center gap-2">
              <svg className="w-5 h-5 text-sky-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              装备评测与选购建议
            </li>
            <li className="flex items-center gap-2">
              <svg className="w-5 h-5 text-sky-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              水下摄影教程
            </li>
          </ul>
          
          <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
              type="email"
              placeholder="输入您的邮箱"
              className="flex-1 px-4 py-3 rounded-lg text-slate-800 outline-none focus:ring-2 focus:ring-sky-300"
            />
            <button type="submit" className="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-6 py-3 rounded-lg transition-colors">
              立即订阅
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}

// Main Page Component
export default function HomePage() {
  return (
    <>
      <HeroSection />
      <CategoryNav />
      <FeaturedSection />
      <LatestArticles />
      <TrainingSection />
      <DestinationsSection />
      <PhotographySection />
      <MarineLifeSection />
      <GearSection />
      <TagsSection />
      <NewsletterSection />
    </>
  );
}
