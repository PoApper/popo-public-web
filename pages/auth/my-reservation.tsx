import { Container, Tab } from 'semantic-ui-react';
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { GetStaticProps } from 'next';
import { useTranslation } from 'next-i18next/pages';
import styled from 'styled-components';

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

        <ReservationTabs
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

const ReservationTabs = styled(Tab)`
  > .ui.tabular.menu {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  > .ui.tabular.menu > .item {
    min-width: 0;
    justify-content: center;
    padding: 0.85em 0.65em;
    text-align: center;
    white-space: normal;
    overflow-wrap: anywhere;
  }
`;

export default MyInfoPage;

export const getStaticProps: GetStaticProps = async ({ locale }) => ({
  props: { ...(await getI18nProps(locale)) },
});
