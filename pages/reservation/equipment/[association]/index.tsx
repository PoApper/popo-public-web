import React, { useEffect, useState } from 'react';
import moment from 'moment';
import { GetServerSideProps } from 'next';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { Button, Grid } from 'semantic-ui-react';

import Layout from '@/components/layout';
import EquipReservationTable from '@/components/reservation/equip.reservation.table';
import EquipListTable from '@/components/reservation/equip.list.table';
import { PoPoAxios } from '@/lib/axios.instance';
import { IEquipment } from '@/types/reservation.interface';

// Due to the SSR issue, we need to use dynamic import
const ReservationCalendar = dynamic(
  () => import('@/components/reservation/reservation.calendar'),
  { ssr: false },
);

type ObjectType = {
  [key: string]: string;
};

const OWNER_NAME_MAP: ObjectType = {
  dongyeon: '동아리연합회',
  dormunion: '생활관자치회',
  saengna: '생각나눔',
};

const OWNER_LOCATION_MAP: ObjectType = {
  dongyeon: '동아리연합회 사무실(학생회관 301호)',
  dormunion: '생활관자치회 사무실(생활관 4동)',
  saengna: '생각나눔 사무실(학생회관 108호)',
};

const EquipAssociationPage: React.FunctionComponent<{
  association: string;
  equipmentList: IEquipment[];
}> = ({ association, equipmentList }) => {
  const sortedEquipList = equipmentList.sort((a, b) => {
    return a.name > b.name ? 1 : -1;
  });

  const [selectedDate, setSelectedDate] = useState(moment().format('YYYYMMDD'));
  const [markedDates, setMarkedDates] = useState<Date[]>([]);
  const [dongyeonBank, setDongyeonBank] = useState('');
  const [dongyeonServiceTime, setDongyeonServiceTime] = useState('');
  const [dongyeonContact, setDongyeonContact] = useState('');
  const startDate = moment()
    .subtract(1, 'months')
    .startOf('month')
    .format('YYYYMMDD');

  const associationKorName = OWNER_NAME_MAP[association];
  const associationLocation = OWNER_LOCATION_MAP[association];

  useEffect(() => {
    if (!association) return;
    // TODO: just search for a month, and when month change search again!
    PoPoAxios.get(
      `/reservation-equip?owner=${association}&startDate=${startDate}`,
    ).then((res) => {
      const allReservations = res.data;
      const datesArr = [];
      for (const reservation of allReservations) {
        const date = reservation.date; // YYYYMMDD
        datesArr.push(moment(date).toDate());
      }
      setMarkedDates(datesArr);
    });

    PoPoAxios.get('/setting').then((res) => {
      setDongyeonBank(res.data.dongyeon_bank);
      setDongyeonServiceTime(res.data.dongyeon_service_time);
      setDongyeonContact(res.data.dongyeon_contact);
    });
  }, [startDate, association, selectedDate]);

  return (
    <Layout>
      <h1>{associationKorName} - 장비 예약하기</h1>
      <Grid columns={2} divided stackable>
        <Grid.Column width={6}>
          <EquipListTable equipments={sortedEquipList} />
          {association == 'dongyeon' ? (
            <ul>
              <li>
                물품 대여 순서 :{' '}
                <strong>
                  POPO 신청&입금 - 카카오톡 채널 입장 - 승인 - 대여&반납
                </strong>
              </li>
              <li>
                예약비 입금 계좌 :
                <strong> 부산은행 1122244813601 (안강현)</strong>
                <br />
                <em>*입금자명은 예약자명과 동일하게 해주세요.</em>
              </li>
              <br />
              <li>
                예약금 납부 후, 카카오톡 채널에 입장하여{' '}
                <strong>대여자명 / 대여일 / 대여품목 / 송금 화면 발송</strong>
              </li>
              <strong>카카오톡 채널 링크 :</strong>{' '}
              <a
                href="http://pf.kakao.com/_qASbn/chat"
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: 'blue', textDecoration: 'underline' }}
              >
                http://pf.kakao.com/_qASbn/chat
              </a>
              <br />
              <em>예시</em>
              <br />
              정종민
              <br />
              3월 10일 월요일
              <br />
              메인스피커1 / 오디오 인터페이스 / 유선 보컬 마이크 1~3
              <br />
              <br />
              <li>
                대여/반납 시간 : <strong>월~금 / 12:30~13:30</strong>
                <br />
                <em>*그 외 시간에 대여와 반납은 어렵습니다.</em>
              </li>
              <li>
                수령 장소 : <strong>동아리연합회 사무실(학생회관 301호)</strong>
              </li>
              <li>
                <strong style={{ color: 'red' }}>
                  장비 분실 및 반납 시간을 어길 시 책임을 물을 수 있습니다.
                </strong>
              </li>
              <li>문의 : (연락처)</li>
            </ul>
          ) : (
            <p style={{ marginTop: '10px' }}>
              장비를 클릭하면 장비 사진을 볼 수 있습니다! 🖼️
              <br />
              예약한 장비는 {associationLocation}에서 수령하실 수 있습니다. 🏢️
              <br />
              장비가 분실되거나 예약 시간을 초과할 경우, 차후 예약에 제한을 둘
              수 있습니다. 🚨
              <br />
            </p>
          )}

          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <Link
              href={`/reservation/equipment/${association}/create?selectedDate=${selectedDate}`}
              passHref
            >
              <Button primary>예약 신청하기</Button>
            </Link>
            <Link href={'/auth/my-reservation'} passHref>
              <Button>내 예약 목록</Button>
            </Link>
          </div>
        </Grid.Column>

        <Grid.Column>
          <Grid rows={2} divided stackable style={{ padding: '1rem' }}>
            <Grid.Column>
              <Grid.Row centered style={{ margin: '0 0 1rem' }}>
                <ReservationCalendar
                  markedDates={markedDates}
                  selectedDate={selectedDate}
                  setSelectedDate={setSelectedDate}
                />
              </Grid.Row>
              <Grid.Row>
                <EquipReservationTable
                  associationName={association}
                  selectedDate={selectedDate}
                />
              </Grid.Row>
            </Grid.Column>
          </Grid>
        </Grid.Column>
      </Grid>
    </Layout>
  );
};

export default EquipAssociationPage;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { association } = context.query;

  const res = await PoPoAxios.get<IEquipment[]>(`equip/owner/${association}`);
  const equipmentList = res.data;

  return {
    props: { association, equipmentList },
  };
};
