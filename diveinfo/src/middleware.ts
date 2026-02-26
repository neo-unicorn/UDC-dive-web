import createMiddleware from 'next-intl/middleware';
import { locales, defaultLocale } from './i18n/config';

export default createMiddleware({
  locales,
  defaultLocale,
  localePrefix: 'as-needed', // 默认语言不显示前缀
});

export const config = {
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)'],
};
