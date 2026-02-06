import Link from 'next/link';

export function Header({ locale }: { locale: 'zh' | 'en' }) {
    const title = locale === 'zh' ? '潜水资讯' : 'DiveInfo';
    return (
        <header className="sticky top-0 z-50 bg-white/80 backdrop-blur border-b">
            <div className="container mx-auto px-4 flex items-center justify-between h-16">
                <Link href={`/${locale}`} className="flex items-center gap-2 text-xl font-bold text-blue-600">🌊 {title}</Link>
                <nav className="hidden md:flex items-center gap-6">
                    <Link href={`/${locale}`} className="text-sm text-gray-700 hover:text-blue-600">{locale === 'zh' ? '首页' : 'Home'}</Link>
                    <Link href={`/${locale}?category=training`} className="text-sm text-gray-700 hover:text-blue-600">{locale === 'zh' ? '培训' : 'Training'}</Link>
                </nav>
                <Link href={locale === 'zh' ? '/en' : '/zh'} className="px-3 py-1.5 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg">{locale === 'zh' ? 'EN' : '中'}</Link>
            </div>
        </header>
    );
}
export default Header;
