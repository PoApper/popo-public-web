import React, { useEffect, useState } from 'react'
import moment from 'moment'
import { GetServerSideProps } from 'next'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { Button, Grid } from 'semantic-ui-react'

import Layout from '@/components/layout'
import ReservationCalendar
  from '@/components/reservation/reservation.calendar'
import EquipReservationTable
  from '@/components/reservation/equip.reservation.table'
import EquipListTable from '@/components/reservation/equip.list.table'
import { PoPoAxios } from '@/lib/axios.instance'
import { IEquipment } from '@/types/reservation.interface'

type ObjectType = {
  [key: string]: string
}

const OWNER_NAME_MAP: ObjectType = {
  'dongyeon': '동아리연합회',
  'dormunion': '생활관자치회',
  'saengna': '생각나눔',
}

const OWNER_LOCATION_MAP: ObjectType = {
  'dongyeon': '동아리연합회 사무실(학생회관 301호)',
  'dormunion': '생활관자치회 사무실(생활관 4동)',
  'saengna': '생각나눔 사무실(학생회관 108호)',
}

const EquipAssociationPage: React.FunctionComponent<{
  association: string,
  equipmentList: IEquipment[]
}> = ({ association, equipmentList }) => {
  const router = useRouter();

  const [selectedDate, setSelectedDate] = useState(moment().format('YYYYMMDD'))
  const [markedDates, setMarkedDates] = useState<Date[]>([])
  const [dongyeonBank, setDongyeonBank] = useState('')
  const [dongyeonServiceTime, setDongyeonServiceTime] = useState('');
  const [dongyeonContact, setDongyeonContact] = useState('');
  const startDate = moment().subtract(1, 'months').startOf('month').format('YYYYMMDD')

  const associationKorName = OWNER_NAME_MAP[association];
  const associationLocation = OWNER_LOCATION_MAP[association];

  useEffect(() => {
    if (!association) return
    // TODO: just search for a month, and when month change search again!
    PoPoAxios.get(
      `/reservation-equip?owner=${association}&startDate=${startDate}`,
    ).then(res => {
      const allReservations = res.data
      const datesArr = []
      for (const reservation of allReservations) {
        const date = reservation.date; // YYYYMMDD
        datesArr.push(moment(date).toDate());
      }
      setMarkedDates(datesArr)
    })

    PoPoAxios
      .get('/setting')
      .then((res) => {
        setDongyeonBank(res.data.dongyeon_bank);
        setDongyeonServiceTime(res.data.dongyeon_service_time);
        setDongyeonContact(res.data.dongyeon_contact);
      })
  }, [startDate, association, selectedDate])

  return (
    <Layout>
      <h1>{associationKorName} - 장비 예약하기</h1>
      <Grid columns={2} divided stackable>

        <Grid.Column width={6}>
          <EquipListTable equipments={equipmentList}/>
          {
            association == "dongyeon"
              ? <p>
                  1. 물품 대여는 예약 신청 - 입금 - 입금 확인 후 가능합니다. <br/>
                  2. 예약금은 최소한 대여일 전날 입금 바랍니다. <br/>
                  3. 예약비는 {dongyeonBank} 계좌로 입금 바랍니다. <br/>
                  4. 입금자명은 예약자명과 같게 해주세요. <br/>
                  5. 장비 분실 및 예약 시간을 어길시 책임을 물을 수 있습니다. <br/>
                  6. 대여시간은 {dongyeonServiceTime} 입니다. 그 외 시간의 대여와 반납은 어렵습니다. <br/>
                  7. 예약한 장비는 동아리 연합회 사무실(학생회관 301호)에서 수령할 수 있습니다. <br/>
                  8. 기타 문의는 {dongyeonContact} 연락주세요. <br/>
                </p>
                : <p style={{ marginTop: '10px' }}>
                  장비를 클릭하면 장비 사진을 볼 수 있습니다! 🖼️<br/>
                  예약한 장비는 {associationLocation}에서 수령하실 수 있습니다. 🏢️<br/>
                  장비가 분실되거나 예약 시간을 초과할 경우, 차후 예약에 제한을 둘 수 있습니다. 🚨<br/>
                </p>
          }

          <div style={{display: 'flex', justifyContent: 'space-between'}}>
            <Link href={`/reservation/equipment/${association}/create?selectedDate=${selectedDate}`} passHref>
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
                  placeName={"equip"}/>
              </Grid.Row>
              <Grid.Row>
                <EquipReservationTable
                  associationName={association}
                  selectedDate={selectedDate}/>
              </Grid.Row>
            </Grid.Column>
          </Grid>
        </Grid.Column>

      </Grid>
    </Layout>
  )
}

export default EquipAssociationPage;

export const getServerSideProps : GetServerSideProps  = async (context) => {
  const { association } = context.query;

  const res = await PoPoAxios.get<IEquipment[]>(`equip/owner/${association}`);
  const equipmentList = res.data;

  return {
    props: { association, equipmentList }
  };
}
