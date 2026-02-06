import type { ReactNode } from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import '../globals.css';

export function generateStaticParams() { return [{ locale: 'zh' }, { locale: 'en' }]; }

export default function LocaleLayout({ children, params }: { children: ReactNode; params: { locale: string } }) {
    const locale = params.locale as 'zh' | 'en';
    return (
        <html lang={locale}>
            <body className="min-h-screen bg-gray-50 flex flex-col">
                <Header locale={locale} />
                <main className="flex-1">{children}</main>
                <Footer locale={locale} />
            </body>
        </html>
    );
}
