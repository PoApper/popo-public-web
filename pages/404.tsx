import Head from 'next/head';
import React from 'react';
import { Container, Image } from 'semantic-ui-react';
import Link from 'next/link';
import { GetStaticProps } from 'next';
import { Trans, useTranslation } from 'next-i18next/pages';
import { getI18nProps } from '@/lib/i18n';

const NotFoundPage = () => {
  const { t } = useTranslation('common');

  return (
    <>
      <Head>
        <title>{t('layout.pageTitle')}</title>
        <meta name="description" content={t('layout.metaDescription')} />
        <link rel="icon" href={'/favicon.ico'} />
      </Head>
      <>
        <main>
          <Container textAlign={'center'} style={{ padding: '15vh 0' }}>
            <Link href={'/'} passHref>
              <Image centered src={'/popo.svg'} alt={'popo_logo'} />
            </Link>
            <h1>{t('notFound.title')}</h1>
            <p>
              {t('notFound.body')}
              <br />
              <Trans
                i18nKey="notFound.goHome"
                components={[<Link key="home" href="/" passHref />]}
              />
            </p>
          </Container>
        </main>
      </>
    </>
  );
};

export default NotFoundPage;

export const getStaticProps: GetStaticProps = async ({ locale }) => ({
  props: {
    ...(await getI18nProps(locale)),
  },
});
