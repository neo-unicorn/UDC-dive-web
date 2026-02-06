import Link from 'next/link';

export function Footer({ locale }: { locale: 'zh' | 'en' }) {
    return (
        <footer className="bg-gray-900 text-gray-400 mt-16">
            <div className="container mx-auto px-4 py-12">
                <div className="flex items-center justify-between">
                    <Link href={`/${locale}`} className="text-xl font-bold text-white">🌊 {locale === 'zh' ? '潜水资讯' : 'DiveInfo'}</Link>
                    <p className="text-sm">© {new Date().getFullYear()} {locale === 'zh' ? '保留所有权利' : 'All rights reserved'}</p>
                </div>
            </div>
        </footer>
    );
}
export default Footer;
