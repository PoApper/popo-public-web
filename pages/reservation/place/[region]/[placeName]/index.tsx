import React, { useEffect, useState } from 'react'
import { GetServerSideProps } from 'next'
import Link from 'next/link'
import moment from 'moment-timezone'
import { Button, Grid, Label } from 'semantic-ui-react'

import Layout from '@/components/layout'
import PlaceReservationTable
  from '@/components/reservation/place.reservation.table'
import ReservationCalendar
  from '@/components/reservation/reservation.calendar'
import PlaceInformationCard from '@/components/reservation/place.information.card'
import { PoPoAxios } from '@/lib/axios.instance'
import { IPlace } from '@/types/reservation.interface'

const PlaceReservationPage: React.FunctionComponent<{
  region: string,
  placeName: string,
  placeInfo: IPlace,
}> = ({ region, placeName, placeInfo }) => {
  const [selectedDate, setSelectedDate] = useState(moment().tz("Asia/Seoul").format('YYYYMMDD'))
  const [markedDates, setMarkedDates] = useState<Date[]>([])
  const startDate = moment().subtract(1, 'months').startOf('month').format('YYYYMMDD')

  useEffect(() => {
    if (!region || !placeName) return;

    // TODO: not retrieve all reservations on that place,
    // TODO: just search for a month, and when month change search again!
    PoPoAxios.get(
      `/reservation-place/placeName/${placeName}?startDate=${startDate}`,
    ).then(res => {
      const allReservations = res.data
      const datesArr = []
      for (const reservation of allReservations) {
        const date = reservation.date; // YYYYMMDD
        datesArr.push(moment(date).toDate());
      }
      setMarkedDates(datesArr)
    })
  }, [region, placeName, startDate, selectedDate])

  return (
    <Layout>
      <Grid columns={2} divided stackable>
        <Grid.Column width={6}>
          <PlaceInformationCard placeInfo={placeInfo}/>
          <div style={{display: 'flex', justifyContent: 'space-between'}}>
            <Link href={`/reservation/place/${region}/${placeName}/create?selectedDate=${selectedDate}`} passHref>
              <Button primary>예약 신청하기</Button>
            </Link>
            <Link href={'/auth/my-reservation'} passHref>
              <Button>내 예약 목록</Button>
            </Link>
          </div>
        </Grid.Column>

        <Grid.Column width={10}>
          <Grid rows={2} divided stackable style={{ padding: '1rem' }}>
            <Grid.Column>

              <Grid.Row centered style={{ margin: '0 0 1rem', width: '100%' }}>
                <ReservationCalendar
                  markedDates={markedDates}
                  selectedDate={selectedDate}
                  setSelectedDate={setSelectedDate}
                  placeName={placeName}/>
              </Grid.Row>

              <Grid.Row style={{ marginBottom: '1em' }}>
                <p>
                  날짜를 고르면, 예약 현황을 확인할 수 있습니다! 😎
                </p>
                <p>
                  해당 날짜에 예약이 하나라도 존재하면,
                  달력에 <Label circular color={'orange'} empty/>로 표시됩니다.
                </p>
                <p>
                  <b>심사중</b>은 <Label circular color={'black'} empty/> 로, &nbsp;
                  <b>통과</b>는 <Label circular color={'green'} empty/> 로, &nbsp;
                  <b>거절</b>은 <Label circular color={'red'} empty/> 로 표시됩니다.
                </p>
              </Grid.Row>

              <Grid.Row>
                <PlaceReservationTable
                  placeName={placeName}
                  selectedDate={selectedDate}/>
              </Grid.Row>

            </Grid.Column>
          </Grid>
        </Grid.Column>

      </Grid>
    </Layout>
  )
}

export default PlaceReservationPage;

export const getServerSideProps: GetServerSideProps  = async (context) => {
  const { region, placeName } = context.query;

  const res = await PoPoAxios.get<IPlace[]>(`place/name/${placeName}`);
  const placeInfo = res.data;

  return {
    props: { region, placeName, placeInfo }
  };
};
