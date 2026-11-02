export const locales = ['ko', 'en'] as const;
export const defaultLocale = 'ko';

export function getLocalizedResourceName(
  resource: { name: string; nameEn?: string | null },
  locale?: string | null,
): string {
  return locale === 'en'
    ? resource.nameEn?.trim() || resource.name
    : resource.name;
}

/** Prefix a path for non-default locales (matches Next.js i18n routing). */
export function withLocalePrefix(path: string, locale?: string | null): string {
  const normalized = path.startsWith('/') ? path : `/${path}`;
  if (!locale || locale === defaultLocale) return normalized;
  return `/${locale}${normalized}`;
}

/** Use when navigating outside next/link (e.g. window.location). */
export function withCurrentLocalePrefix(path: string): string {
  if (typeof window === 'undefined') return path;
  const firstSegment = window.location.pathname.split('/')[1];
  if (
    (locales as readonly string[]).includes(firstSegment) &&
    firstSegment !== defaultLocale
  ) {
    return withLocalePrefix(path, firstSegment);
  }
  return withLocalePrefix(path);
}
