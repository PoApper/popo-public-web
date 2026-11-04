import React from 'react';
import { Image } from 'semantic-ui-react';
import { GetStaticProps } from 'next';
import { useTranslation } from 'next-i18next/pages';

import Layout from '@/components/layout';
import IconLink from '@/components/common/icon.link';
import { getI18nProps } from '@/lib/i18n';

const BenefitsIndexPage: React.FunctionComponent = () => {
  const { t } = useTranslation('common');

  return (
    <Layout>
      <div style={{ padding: '24px 16px', maxWidth: 800 }}>
        <h2 style={{ marginBottom: 16 }}>{t('benefits.title')}</h2>
        <p style={{ fontSize: 16, marginBottom: 16, lineHeight: 1.6 }}>
          {t('benefits.instagramHint')}
        </p>
        <div style={{ marginTop: 16 }}>
          <IconLink link="https://www.instagram.com/postech_stu/">
            <Image
              src="https://img.shields.io/badge/Instagram-E4405F?style=for-the-badge&logo=instagram&logoColor=white"
              alt="instagram"
            />
          </IconLink>
        </div>
      </div>
    </Layout>
  );
};

export default BenefitsIndexPage;

export const getStaticProps: GetStaticProps = async ({ locale }) => ({
  props: { ...(await getI18nProps(locale)) },
});
