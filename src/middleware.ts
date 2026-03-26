import createMiddleware from 'next-intl/middleware';

export default createMiddleware({
  // A list of all locales that are supported
  locales: ['en', 'zh', 'ar', 'ru', 'th', 'es', 'fr', 'de'],

  // Used when no locale matches
  defaultLocale: 'en',
  
  // Set to 'as-needed' so the default 'en' language does NOT show up in the URL (e.g. localhost:3000/ instead of /en)
  localePrefix: 'as-needed'
});

export const config = {
  // Match only internationalized pathnames
  // We exclude api routes, _next/static, _next/image, favicon.ico, images, etc.
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)']
};
