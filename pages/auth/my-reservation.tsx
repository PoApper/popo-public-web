import { Container, Tab } from 'semantic-ui-react';
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { GetStaticProps } from 'next';
import { useTranslation } from 'next-i18next/pages';

import Layout from '@/components/layout';
import MyPlaceReservationTable from '@/components/auth/MyPlaceReservationTable';
import MyEquipReservationTable from '@/components/auth/MyEquipReservationTable';
import { PoPoAxios } from '@/lib/axios.instance';
import { getI18nProps } from '@/lib/i18n';

const MyInfoPage = () => {
  const router = useRouter();
  const { t } = useTranslation('common');

  useEffect(() => {
    PoPoAxios.get('/auth/verifyToken').catch(() => {
      alert(t('common.loginRequiredToView'));
      router.push('/auth/login');
    });
  }, [router, t]);

  return (
    <Layout>
      <Container
        style={{
          padding: '40px',
          margin: '2em 0 4em',
          backgroundColor: '#eeeeee',
          borderRadius: '8px',
        }}
      >
        <h2>{t('nav.myReservation')}</h2>
        <p>{t('auth.myReservation.hint')}</p>

        <Tab
          panes={[
            {
              menuItem: t('nav.placeReservation'),
              render: () => (
                <Tab.Pane>
                  <MyPlaceReservationTable />
                </Tab.Pane>
              ),
            },
            {
              menuItem: t('nav.equipReservation'),
              render: () => (
                <Tab.Pane>
                  <MyEquipReservationTable />
                </Tab.Pane>
              ),
            },
          ]}
        />
      </Container>
    </Layout>
  );
};

export default MyInfoPage;

export const getStaticProps: GetStaticProps = async ({ locale }) => ({
  props: { ...(await getI18nProps(locale)) },
});
