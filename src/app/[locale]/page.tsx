import { redirect } from 'next/navigation';
import { defaultLocale } from '@/i18n';

export default function Home({
  params: { locale }
}: {
  params: { locale: string };
}) {
  const path = locale === defaultLocale ? '/website' : `/${locale}/website`;
  redirect(path);
}