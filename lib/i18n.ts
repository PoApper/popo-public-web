import { serverSideTranslations } from 'next-i18next/pages/serverSideTranslations';
import { defaultLocale } from './locale';

const DEFAULT_NS = ['common'];

export async function getI18nProps(
  locale: string | undefined,
  namespaces: string[] = DEFAULT_NS,
) {
  return serverSideTranslations(locale ?? defaultLocale, namespaces);
}
