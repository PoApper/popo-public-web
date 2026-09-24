import React, { useEffect, useState } from 'react';
import { GetServerSideProps } from 'next';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import moment from 'moment-timezone';
import { Button, Grid, Label, Message } from 'semantic-ui-react';
import { useTranslation } from 'next-i18next/pages';

import Layout from '@/components/layout';
import PlaceReservationTable from '@/components/reservation/place.reservation.table';
import PlaceInformationCard from '@/components/reservation/place.information.card';
import { PoPoAxios } from '@/lib/axios.instance';
import { IPlace } from '@/types/reservation.interface';
import { isReservationLeadTimeSatisfied } from '@/lib/reservation-required-days';
import { getI18nProps } from '@/lib/i18n';

// Due to the SSR issue, we need to use dynamic import
const ReservationCalendar = dynamic(
  () => import('@/components/reservation/reservation.calendar'),
  { ssr: false },
);

const PlaceReservationPage: React.FunctionComponent<{
  region: string;
  placeName: string;
  placeInfo: IPlace;
}> = ({ region, placeName, placeInfo }) => {
  const { t } = useTranslation('common');
  const [selectedDate, setSelectedDate] = useState(
    moment().tz('Asia/Seoul').format('YYYYMMDD'),
  );
  const [markedDates, setMarkedDates] = useState<Date[]>([]);
  const startDate = moment()
    .subtract(1, 'months')
    .startOf('month')
    .format('YYYYMMDD');
  const isSelectedDateBookable = isReservationLeadTimeSatisfied(
    selectedDate,
    placeInfo.reservationRequiredDays,
  );

  useEffect(() => {
    if (!region || !placeName) return;

    // TODO: not retrieve all reservations on that place,
    // TODO: just search for a month, and when month change search again!
    PoPoAxios.get(
      `/reservation-place/placeName/${placeName}?startDate=${startDate}`,
    ).then((res) => {
      const allReservations = res.data;
      const datesArr = [];
      for (const reservation of allReservations) {
        const date = reservation.date; // YYYYMMDD
        datesArr.push(moment(date).toDate());
      }
      setMarkedDates(datesArr);
    });
  }, [region, placeName, startDate, selectedDate]);

  return (
    <Layout>
      <Grid columns={2} divided stackable>
        <Grid.Column width={6}>
          <PlaceInformationCard placeInfo={placeInfo} />
          {!isSelectedDateBookable && placeInfo.reservationRequiredDays > 0 ? (
            <Message warning>
              {t('reservation.place.leadTimeWarning', {
                days: placeInfo.reservationRequiredDays,
              })}
            </Message>
          ) : null}
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            {isSelectedDateBookable ? (
              <Link
                href={`/reservation/place/${region}/${placeName}/create?selectedDate=${selectedDate}`}
                passHref
              >
                <Button primary>{t('reservation.shared.apply')}</Button>
              </Link>
            ) : (
              <Button primary disabled>
                {t('reservation.shared.apply')}
              </Button>
            )}
            <Link href={'/auth/my-reservation'} passHref>
              <Button>{t('reservation.shared.myList')}</Button>
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
                />
              </Grid.Row>

              <Grid.Row style={{ marginBottom: '1em' }}>
                <p>{t('reservation.place.pickDateHint')}</p>
                <div>
                  {t('reservation.place.calendarDotHint')}{' '}
                  <Label circular color={'orange'} empty />
                </div>
                <div>
                  {t('reservation.place.statusLegendPrefix')}{' '}
                  <Label circular color={'black'} empty />{' '}
                  {t('reservation.place.statusLegendMid1')}
                  &nbsp;
                  {t('reservation.place.statusLegendPassed')}{' '}
                  <Label circular color={'green'} empty />{' '}
                  {t('reservation.place.statusLegendMid2')}
                  &nbsp;
                  {t('reservation.place.statusLegendRejected')}{' '}
                  <Label circular color={'red'} empty />{' '}
                  {t('reservation.place.statusLegendSuffix')}
                </div>
              </Grid.Row>

              <Grid.Row>
                <PlaceReservationTable
                  placeName={placeName}
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

export default PlaceReservationPage;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const locale = context.locale;
  const { region, placeName } = context.query;

  const res = await PoPoAxios.get<IPlace[]>(`place/name/${placeName}`);
  const placeInfo = res.data;

  return {
    props: {
      region,
      placeName,
      placeInfo,
      ...(await getI18nProps(locale)),
    },
  };
};
