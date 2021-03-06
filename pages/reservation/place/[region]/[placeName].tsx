import React, { useEffect, useState } from 'react'
import { Grid, Label } from 'semantic-ui-react'
import { useRouter } from 'next/router'
import axios from 'axios'
import moment from 'moment'

import Layout from '../../../../components/layout'
import PlaceReservationTable
  from '../../../../components/reservation/place.reservation.table'
import ReservationCalendar
  from '../../../../components/reservation/reservation.calendar'
import PlaceInformationCard from '../../../../components/reservation/place.information.card'
import PlaceReservationCreateModal
  from '../../../../components/reservation/place.reservation.create.modal'

const RegionPlace: React.FunctionComponent = () => {
  const router = useRouter()
  const placeName = router.query.placeName as string

  const [selectedDate, setSelectedDate] = useState(moment().format('YYYYMMDD'))
  const [markedDates, setMarkedDates] = useState<Date[]>([])

  useEffect(() => {
    if (!placeName) return;

    // TODO: not retrieve all reservations on that place,
    // TODO: just search for a month, and when month change search again!
    axios.get(
      `${process.env.NEXT_PUBLIC_API}/reservation-place/placeName/${placeName}`,
    ).then(res => {
      const allReservations = res.data
      const datesArr = []
      for (const reservation of allReservations) {
        const date = reservation.date; // YYYYMMDD
        datesArr.push(moment(date).toDate());
      }
      setMarkedDates(datesArr)
    })
  }, [placeName, selectedDate])

  function handleDateChange(e: React.SyntheticEvent<HTMLElement>, data: any): void {
    e.preventDefault();
    const date: string = data.value; // YYYYMMDD
    setSelectedDate(date);
  }

  return (
    <Layout>
      <Grid columns={2} divided stackable>

        <Grid.Column width={6}>
          <PlaceInformationCard placeName={placeName}/>
          <PlaceReservationCreateModal placeName={placeName}/>
        </Grid.Column>

        <Grid.Column>
          <Grid rows={2} divided stackable>
            <Grid.Column>

              <Grid.Row centered style={{ marginBottom: '1em' }}>
                <ReservationCalendar
                  selectedDate={selectedDate}
                  markedDates={markedDates}
                  handleDateChange={handleDateChange}/>
              </Grid.Row>

              <Grid.Row style={{ marginBottom: '1em' }}>
                <p>
                  ????????? ?????????, ?????? ????????? ????????? ??? ????????????! ????
                </p>
                <p>
                  ?????? ????????? ????????? ???????????? ????????????,
                  ????????? <Label circular color={'orange'} empty/>??? ???????????????.
                </p>
                <p>
                  <b>?????????</b>??? <Label circular color={'black'} empty/> ???, &nbsp;
                  <b>??????</b>??? <Label circular color={'green'} empty/> ???, &nbsp;
                  <b>??????</b>??? <Label circular color={'red'} empty/> ??? ???????????????.
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

export default RegionPlace