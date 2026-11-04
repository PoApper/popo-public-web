import { useTranslation } from 'next-i18next/pages';
import { GetStaticProps } from 'next';
import { getI18nProps } from '@/lib/i18n';
import { Container, Header, List } from 'semantic-ui-react';
import Layout from '@/components/layout';

// 새 고지는 public/licenses/에 전문 파일을 추가하고 아래 목록에 등록합니다.
const openSourceLicenses = [
  {
    name: '@rhwp/core',
    descriptionKey: 'licenses.rhwpDescription',
    licenseUrl: '/licenses/rhwp.txt',
  },
];

const OpenSourceLicensesPage = () => {
  const { t } = useTranslation('common');
  return (
    <Layout>
      <Container text>
        <Header as="h1">{t('licenses.title')}</Header>
        <p>{t('licenses.intro')}</p>
        <List divided relaxed>
          {openSourceLicenses.map((license) => (
            <List.Item key={license.name}>
              <List.Header as="a" href={license.licenseUrl}>
                {t(license.descriptionKey)} ({license.name})
              </List.Header>
              <List.Description>{t('licenses.fullNotice')}</List.Description>
            </List.Item>
          ))}
        </List>
      </Container>
    </Layout>
  );
};

export default OpenSourceLicensesPage;

export const getStaticProps: GetStaticProps = async ({ locale }) => ({
  props: { ...(await getI18nProps(locale)) },
});
