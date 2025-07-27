import { Container, Tab } from 'semantic-ui-react';
import { useEffect } from 'react';
import { useRouter } from 'next/router';

import Layout from '@/components/layout';
import MyPlaceReservationTable from '@/components/auth/MyPlaceReservationTable';
import MyEquipReservationTable from '@/components/auth/MyEquipReservationTable';
import { PoPoAxios } from '@/lib/axios.instance';

const MyInfoPage = () => {
  const router = useRouter();

  useEffect(() => {
    PoPoAxios.get('/auth/verifyToken').catch(() => {
      alert('로그인 후 조회할 수 있습니다.');
      router.push('/auth/login');
    });
  }, [router]);

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
        <h2>내 예약</h2>
        <p>예약 제목을 클릭하면 자세한 예약 정보를 볼 수 있습니다.</p>

        <Tab
          panes={[
            {
              menuItem: '장소 예약',
              render: () => (
                <Tab.Pane>
                  <MyPlaceReservationTable />
                </Tab.Pane>
              ),
            },
            {
              menuItem: '장비 예약',
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
