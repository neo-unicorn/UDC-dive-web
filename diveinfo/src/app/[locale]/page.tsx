'use client';

import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { useLocale } from 'next-intl';

// Hero Section
function HeroSection() {
  const t = useTranslations();
  
  return (
    <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 ocean-gradient" />
      <div 
        className="absolute inset-0 bg-cover bg-center opacity-30"
        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=1920')" }}
      />
      
      <div className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto">
        <h1 className="text-5xl md:text-7xl font-bold mb-6">
          {t('site.name')}
        </h1>
        <p className="text-xl md:text-2xl mb-8 text-sky-100">
          {t('site.slogan')}
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/articles" className="btn-primary">
            {t('home.latestArticles')}
          </Link>
          <Link href="/training" className="btn-secondary !text-white !border-white hover:!bg-white/20">
            {t('home.startLearning')}
          </Link>
        </div>
      </div>

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
  const t = useTranslations('nav');
  
  const categories = [
    { id: 'training', name: t('training'), icon: '🎓' },
    { id: 'destinations', name: t('destinations'), icon: '✈️' },
    { id: 'photography', name: t('photography'), icon: '📷' },
    { id: 'marine-life', name: t('marineLife'), icon: '🐠' },
    { id: 'gear', name: t('gear'), icon: '🤿' },
    { id: 'community', name: t('community'), icon: '👥' },
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
  const t = useTranslations();
  
  const featured = [
    {
      title: t('destinations.maldives.name'),
      excerpt: t('destinations.maldives.description'),
      image: 'https://images.unsplash.com/photo-1591025207163-942350e47db2?w=600',
      category: t('nav.destinations'),
    },
    {
      title: t('nav.photography'),
      excerpt: t('site.description'),
      image: 'https://images.unsplash.com/photo-1682687220742-aba13b6e50ba?w=600',
      category: t('nav.photography'),
    },
    {
      title: t('courses.advanced.title'),
      excerpt: t('courses.advanced.description'),
      image: 'https://images.unsplash.com/photo-1544551763-77ef2d0cfc6c?w=600',
      category: t('nav.training'),
    },
  ];

  return (
    <section className="py-16 bg-gradient-to-b from-white to-sky-50">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="section-title text-center">{t('home.featured')}</h2>
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

// Training Courses
function TrainingSection() {
  const t = useTranslations();
  
  const courses = [
    {
      key: 'openWater',
      color: 'from-sky-500 to-cyan-400',
    },
    {
      key: 'advanced',
      color: 'from-blue-600 to-sky-500',
    },
    {
      key: 'rescue',
      color: 'from-indigo-600 to-blue-500',
    },
  ];

  return (
    <section className="py-16 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="section-title text-center">{t('home.trainingCourses')}</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {courses.map((course, idx) => (
            <div key={idx} className="card overflow-hidden">
              <div className={`h-2 bg-gradient-to-r ${course.color}`} />
              <div className="p-6">
                <h3 className="text-xl font-bold text-slate-800 mb-2">
                  {t(`courses.${course.key}.title`)}
                </h3>
                <p className="text-slate-600 mb-4">
                  {t(`courses.${course.key}.description`)}
                </p>
                <ul className="space-y-2">
                  {(t.raw(`courses.${course.key}.features`) as string[]).map((feature: string, fidx: number) => (
                    <li key={fidx} className="flex items-center text-sm text-slate-600">
                      <svg className="w-5 h-5 text-sky-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      {feature}
                    </li>
                  ))}
                </ul>
                <Link href={`/training/${idx}`} className="mt-6 block text-center btn-primary">
                  {t('common.learnMore')}
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
  const t = useTranslations();
  
  const destinations = [
    { key: 'maldives', image: 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=600' },
    { key: 'rajaAmpat', image: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=600' },
    { key: 'cozumel', image: 'https://images.unsplash.com/photo-1505118380757-91f5f5632de0?w=600' },
    { key: 'redSea', image: 'https://images.unsplash.com/photo-1582967788606-a171c1080cb0?w=600' },
  ];

  return (
    <section className="py-16">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="section-title text-center">{t('home.popularDestinations')}</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {destinations.map((dest, idx) => (
            <Link href={`/destinations/${idx}`} key={idx} className="card card-hover group">
              <div className="aspect-[4/3] relative overflow-hidden">
                <img
                  src={dest.image}
                  alt={t(`destinations.${dest.key}.name`)}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-5">
                <h3 className="text-lg font-bold text-slate-800 mb-2">
                  {t(`destinations.${dest.key}.name`)}
                </h3>
                <p className="text-sm text-slate-600 line-clamp-2">
                  {t(`destinations.${dest.key}.description`)}
                </p>
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
  const t = useTranslations();
  
  const categories = [
    { key: 'reefFish', icon: '🐠' },
    { key: 'cephalopods', icon: '🐙' },
    { key: 'corals', icon: '🪸' },
    { key: 'sharks', icon: '🦈' },
    { key: 'turtles', icon: '🐢' },
    { key: 'mammals', icon: '🐬' },
  ];

  return (
    <section className="py-16 bg-sky-50">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="section-title text-center">{t('home.marineEncyclopedia')}</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((cat, idx) => (
            <Link
              href={`/marine-life/${idx}`}
              key={idx}
              className="card p-6 text-center hover:bg-sky-100 transition-colors"
            >
              <span className="text-4xl mb-3 block">{cat.icon}</span>
              <h3 className="font-bold text-slate-800 mb-1">
                {t(`marineLife.${cat.key}.name`)}
              </h3>
              <p className="text-xs text-slate-600">
                {t(`marineLife.${cat.key}.description`)}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

// Newsletter
function NewsletterSection() {
  const t = useTranslations('home');
  
  return (
    <section className="py-16 ocean-gradient text-white">
      <div className="max-w-3xl mx-auto px-4 text-center">
        <h2 className="text-3xl font-bold mb-4">{t('joinCommunity')}</h2>
        <p className="text-sky-100 mb-8">{t('newsletter')}</p>
        
        <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
          <input
            type="email"
            placeholder={t('emailPlaceholder')}
            className="flex-1 px-4 py-3 rounded-lg text-slate-800 outline-none focus:ring-2 focus:ring-sky-300"
          />
          <button type="submit" className="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-6 py-3 rounded-lg transition-colors">
            {t('subscribe')}
          </button>
        </form>
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
      <TrainingSection />
      <DestinationsSection />
      <MarineLifeSection />
      <NewsletterSection />
    </>
  );
}
