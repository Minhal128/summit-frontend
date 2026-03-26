import createMiddleware from 'next-intl/middleware';
import { defaultLocale, locales } from './i18n';

export default createMiddleware({
  // A list of all locales that are supported
  locales: [...locales],

  // Used when no locale matches
  defaultLocale,
  
  // Set to 'as-needed' so the default 'en' language does NOT show up in the URL (e.g. localhost:3000/ instead of /en)
  localePrefix: 'as-needed'
});

export const config = {
  // Match only internationalized pathnames
  // We exclude api routes, _next/static, _next/image, favicon.ico, images, etc.
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)']
};
