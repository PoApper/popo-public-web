import React, { useEffect, useState } from 'react';
import moment from 'moment';
import { GetServerSideProps } from 'next';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { Button, Grid } from 'semantic-ui-react';
import { useTranslation } from 'next-i18next/pages';

import Layout from '@/components/layout';
import EquipReservationTable from '@/components/reservation/equip.reservation.table';
import EquipListTable from '@/components/reservation/equip.list.table';
import { PoPoAxios } from '@/lib/axios.instance';
import { IEquipment } from '@/types/reservation.interface';
import { getI18nProps } from '@/lib/i18n';

// Due to the SSR issue, we need to use dynamic import
const ReservationCalendar = dynamic(
  () => import('@/components/reservation/reservation.calendar'),
  { ssr: false },
);

type ObjectType = {
  [key: string]: string;
};

const OWNER_NAME_KEY_MAP: ObjectType = {
  dongyeon: 'reservation.equipment.owners.dongyeon',
  dormunion: 'reservation.equipment.owners.dormunion',
  saengna: 'reservation.equipment.owners.saengna',
};

const OWNER_LOCATION_KEY_MAP: ObjectType = {
  dongyeon: 'reservation.equipment.locations.dongyeon',
  dormunion: 'reservation.equipment.locations.dormunion',
  saengna: 'reservation.equipment.locations.saengna',
};

const EquipAssociationPage: React.FunctionComponent<{
  association: string;
  equipmentList: IEquipment[];
}> = ({ association, equipmentList }) => {
  const { t } = useTranslation('common');

  const sortedEquipList = equipmentList.sort((a, b) => {
    return a.name > b.name ? 1 : -1;
  });

  const [selectedDate, setSelectedDate] = useState(moment().format('YYYYMMDD'));
  const [markedDates, setMarkedDates] = useState<Date[]>([]);
  const [dongyeonBank, setDongyeonBank] = useState('');
  const [dongyeonServiceTime, setDongyeonServiceTime] = useState('');
  const [dongyeonContact, setDongyeonContact] = useState('');
  const [dongyeonKakaoLink, setDongyeonKakaoLink] = useState('');
  const [dongyeonKakaoTitle, setDongyeonKakaoTitle] = useState('');
  const startDate = moment()
    .subtract(1, 'months')
    .startOf('month')
    .format('YYYYMMDD');

  const associationKorName = t(OWNER_NAME_KEY_MAP[association]);
  const associationLocation = t(OWNER_LOCATION_KEY_MAP[association]);

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
      setDongyeonBank(res.data.dongyeonBank);
      setDongyeonServiceTime(res.data.dongyeonServiceTime);
      setDongyeonContact(res.data.dongyeonContact);
      setDongyeonKakaoLink(res.data.dongyeonKakaoLink);
      setDongyeonKakaoTitle(res.data.dongyeonKakaoTitle);
    });
  }, [startDate, association, selectedDate]);

  return (
    <Layout>
      <h1>
        {t('reservation.equipment.reserveTitle', {
          name: associationKorName,
        })}
      </h1>
      <Grid columns={2} divided stackable>
        <Grid.Column width={6}>
          <EquipListTable equipments={sortedEquipList} />
          {association == 'dongyeon' ? (
            <ul>
              <li>
                {t('reservation.equipment.dongyeon.process')}{' '}
                <strong>
                  {t('reservation.equipment.dongyeon.processSteps')}
                </strong>
              </li>
              <li>
                {t('reservation.equipment.dongyeon.bankLabel')}
                <strong> {dongyeonBank}</strong>
                <br />
                <em>{t('reservation.equipment.dongyeon.bankNameHint')}</em>
              </li>
              <br />
              <li>
                {t('reservation.equipment.dongyeon.afterPayment')}{' '}
                <strong>
                  {t('reservation.equipment.dongyeon.kakaoMessageFields')}
                </strong>
              </li>
              {dongyeonKakaoLink && dongyeonKakaoTitle && (
                <>
                  <strong>
                    {t('reservation.equipment.dongyeon.kakaoLinkLabel')}{' '}
                  </strong>
                  <a
                    href={dongyeonKakaoLink}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {dongyeonKakaoTitle}
                  </a>
                </>
              )}
              <br />
              <em>{t('reservation.equipment.dongyeon.example')}</em>
              <br />
              {t('reservation.equipment.dongyeon.exampleName')}
              <br />
              {t('reservation.equipment.dongyeon.exampleDate')}
              <br />
              {t('reservation.equipment.dongyeon.exampleItems')}
              <br />
              <br />
              <li>
                {t('reservation.equipment.dongyeon.serviceHours')}
                <strong> {dongyeonServiceTime}</strong>
                <br />
                <em>{t('reservation.equipment.dongyeon.serviceHoursHint')}</em>
              </li>
              <li>
                {t('reservation.equipment.dongyeon.pickupLocation')}{' '}
                <strong>
                  {t('reservation.equipment.locations.dongyeon')}
                </strong>
              </li>
              <li>
                <strong style={{ color: 'red' }}>
                  {t('reservation.equipment.dongyeon.liability')}
                </strong>
              </li>
              <li>
                {t('reservation.equipment.dongyeon.contact')} {dongyeonContact}{' '}
              </li>
            </ul>
          ) : (
            <p style={{ marginTop: '10px' }}>
              {t('reservation.equipment.genericHintClick')}
              <br />
              {t('reservation.equipment.genericHintPickup', {
                location: associationLocation,
              })}
              <br />
              {t('reservation.equipment.genericHintPenalty')}
              <br />
            </p>
          )}

          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <Link
              href={`/reservation/equipment/${association}/create?selectedDate=${selectedDate}`}
              passHref
            >
              <Button primary>{t('reservation.shared.apply')}</Button>
            </Link>
            <Link href={'/auth/my-reservation'} passHref>
              <Button>{t('reservation.shared.myList')}</Button>
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
  const locale = context.locale;
  const { association } = context.query;

  const res = await PoPoAxios.get<IEquipment[]>(`equip/owner/${association}`);
  const equipmentList = res.data;

  return {
    props: {
      association,
      equipmentList,
      ...(await getI18nProps(locale)),
    },
  };
};
