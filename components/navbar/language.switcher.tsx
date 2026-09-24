import { Icon, Menu } from 'semantic-ui-react';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next/pages';

const LanguageSwitcher = () => {
  const router = useRouter();
  const { t } = useTranslation('common');
  const nextLocale = router.locale === 'en' ? 'ko' : 'en';

  const handleSwitch = () => {
    const { pathname, asPath, query } = router;
    router.push({ pathname, query }, asPath, { locale: nextLocale });
  };

  return (
    <Menu.Item
      as="button"
      position="right"
      onClick={handleSwitch}
      title={t('nav.switchLanguage')}
      aria-label={t('nav.switchLanguage')}
      style={{
        border: 'none',
        background: 'none',
        cursor: 'pointer',
        padding: '0.5em',
      }}
    >
      <Icon name="globe" style={{ margin: 0 }} />
      <span style={{ marginLeft: 4, fontSize: '0.85em' }}>
        {nextLocale.toUpperCase()}
      </span>
    </Menu.Item>
  );
};

export default LanguageSwitcher;
