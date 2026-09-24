import React, { useEffect, useState } from 'react';
import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import { Divider, Form, Message } from 'semantic-ui-react';
import moment from 'moment';
import { useTranslation } from 'next-i18next/pages';

import { IPlace } from '@/types/reservation.interface';
import Layout from '@/components/layout';
import { PoPoAxios } from '@/lib/axios.instance';
import { IUser } from '@/types/user.interface';
import { isOnOpeningHours } from '@/lib/opening_hours';
import { minuteDiff, roundUpByDuration } from '@/lib/time-date';
import ReservationDatetimePicker from '@/components/reservation/reservation.datetime.picker';
import OpeningHoursList from '@/components/reservation/opening_hours.list';
import PlaceReservationTable from '@/components/reservation/place.reservation.table';
import { isReservationLeadTimeSatisfied } from '@/lib/reservation-required-days';
import { getI18nProps } from '@/lib/i18n';

const RegionKeyMapping: { [key: string]: string } = {
  STUDENT_HALL: 'reservation.place.regions.studentHall',
  JIGOK_CENTER: 'reservation.place.regions.jigok',
  OTHERS: 'reservation.place.regions.others',
  COMMUNITY_CENTER: 'reservation.place.regions.communityCenter',
  RESIDENTIAL_COLLEGE: 'reservation.place.regions.rc',
};

const PlaceReservationCreatePage: React.FunctionComponent<{
  placeInfo: IPlace;
  selectedDate: string;
  placeName: string;
}> = ({ placeInfo, selectedDate, placeName }) => {
  const router = useRouter();
  const { t } = useTranslation('common');

  const [userInfo, setUserInfo] = useState<IUser | null>({
    name: '',
  });

  const [phone, setPhone] = useState<string>('');
  const [title, setTitle] = useState<string>('');
  const [description, setDescription] = useState<string>('');

  const timeIntervals = placeInfo.name.includes('시네마 룸') ? 180 : 30;

  const now: moment.Moment = roundUpByDuration(moment(), timeIntervals);

  const [date, setDate] = useState<moment.Moment>(moment(selectedDate)); // YYYY-MM-DD
  const [startTime, setStartTime] = useState<moment.Moment>(now); // HHmm
  const [endTime, setEndTime] = useState<moment.Moment>(
    moment(now).add(timeIntervals, 'minute'),
  ); // HHmm

  const isOnAvailableTime = isOnOpeningHours(
    placeInfo.openingHours,
    date.format('dddd'), // 월요일
    startTime.format('HH:mm'),
    endTime.format('HH:mm'),
  );
  const isLeadTimeSatisfied = isReservationLeadTimeSatisfied(
    date.format('YYYYMMDD'),
    placeInfo.reservationRequiredDays,
  );
  const isPossible = isOnAvailableTime && isLeadTimeSatisfied;

  const regionLabel = t(RegionKeyMapping[placeInfo.region]);

  useEffect(() => {
    // 로그인 확인
    PoPoAxios.get('/auth/verifyToken')
      .then((res) => {
        setUserInfo(res.data);
      })
      .catch(() => {
        alert(t('reservation.shared.loginRequired'));
        router.push('/auth/login');
      });
    // 오늘 이후의 날짜를 선택했는지 확인
    const today = moment().format('YYYYMMDD');
    if (moment(selectedDate).isBefore(today)) {
      setTimeout(() => {
        alert(t('reservation.shared.selectFutureDate'));
        router.push(`/reservation/place/${placeInfo.region}/${placeName}`);
      }, 100);
    }
  }, [placeInfo.region, placeName, router, selectedDate, t]);

  function handleSubmit() {
    if (!isLeadTimeSatisfied) {
      alert(
        t('reservation.shared.leadTimeRequiredNamed', {
          name: placeInfo.name,
          days: placeInfo.reservationRequiredDays,
        }),
      );
      return;
    }

    if (!isOnAvailableTime) {
      alert(
        t('reservation.shared.unavailableSlot', { name: placeInfo.name }),
      );
      return;
    }

    if (title.length == 1 || description.length == 1) {
      alert(t('reservation.shared.descriptionTooShort'));
      return;
    }

    PoPoAxios.post('/reservation-place', {
      placeId: placeInfo.uuid,
      phone: phone,
      title: title,
      description: description,
      date: date.format('YYYYMMDD'), // YYYYMMDD
      startTime: startTime.format('HHmm'), // HHmm
      endTime: endTime.format('HHmm'), // HHmm
    })
      .then(() => {
        alert(t('reservation.shared.createSuccess'));
        router.push('/auth/my-reservation');
      })
      .catch((error) => {
        alert(
          t('reservation.shared.createFailed', {
            message: error.response.data.message,
          }),
        );
      });
  }

  return (
    <Layout>
      <h1>
        {t('reservation.place.createTitle', { name: placeInfo.name })}
      </h1>

      <Form>
        <Form.Group>
          <Form.Input
            required
            readOnly
            label={t('reservation.place.regionLabel')}
            name="region"
            value={regionLabel}
          />
          <Form.Input
            required
            readOnly
            label={t('reservation.place.placeLabel')}
            name="place"
            value={placeInfo.name}
          />
        </Form.Group>

        <Form.Input
          required
          readOnly
          label={t('reservation.shared.user')}
          value={userInfo ? userInfo.name : ''}
        />

        <Form.Input
          required
          label={t('reservation.shared.phone')}
          placeholder={'010-xxxx-xxxx'}
          onChange={(e) => setPhone(e.target.value)}
        />
        <Form.Input
          required
          label={t('reservation.shared.title')}
          placeholder={t('reservation.shared.titlePlaceholder')}
          onChange={(e) => setTitle(e.target.value)}
        />
        <Form.TextArea
          required
          label={t('reservation.shared.description')}
          placeholder={t('reservation.place.descPlaceholder')}
          onChange={(e) => setDescription(e.target.value)}
        />

        <Divider />

        <div className={'field'} style={{ maxWidth: 240 }}>
          <label>{t('reservation.shared.openingHours')}</label>
          <div style={{ color: 'gray' }}>
            <OpeningHoursList
              openingHours={JSON.parse(placeInfo.openingHours)}
            />
          </div>
        </div>

        <Form.Group>
          <ReservationDatetimePicker
            date={date}
            startTime={startTime}
            endTime={endTime}
            setDate={setDate}
            setStartTime={setStartTime}
            setEndTime={setEndTime}
            timeIntervals={timeIntervals}
            isCinemaRoom={placeInfo.name.includes('시네마 룸')}
            reservationRequiredDays={placeInfo.reservationRequiredDays}
          />
        </Form.Group>

        {isLeadTimeSatisfied ? null : (
          <Message negative>
            {t('reservation.shared.leadTimeRequiredNamed', {
              name: placeInfo.name,
              days: placeInfo.reservationRequiredDays,
            })}
          </Message>
        )}

        {isOnAvailableTime ? null : (
          <Message negative>
            {t('reservation.shared.unavailableSlot', {
              name: placeInfo.name,
            })}
          </Message>
        )}

        <div className={'field'}>
          <label>{t('reservation.shared.currentReservations')}</label>
          <div>
            <PlaceReservationTable
              placeName={placeName}
              selectedDate={date.format('YYYYMMDD')}
            />
          </div>
        </div>

        {placeInfo.name.includes('시네마 룸') ? (
          <Message>
            {t('reservation.place.cinemaNotice')
              .split('\n')
              .map((line: string, idx: number) => (
                <React.Fragment key={idx}>
                  {idx > 0 ? <br /> : null}
                  {line}
                </React.Fragment>
              ))}
          </Message>
        ) : null}
        {placeInfo.name.includes('그룹스터디룸') ? (
          <Message>
            <Message.Header>
              {t('reservation.place.groupStudyHeader')}
            </Message.Header>
            <p>{t('reservation.place.groupStudyBody')}</p>
          </Message>
        ) : null}

        <Message>
          <Message.Header>
            {t('reservation.place.confirmHeader')}
          </Message.Header>
          <p>
            {t('reservation.place.confirmSummary', {
              region: regionLabel,
              name: placeInfo.name,
              minutes: minuteDiff(startTime, endTime),
            })}
          </p>
        </Message>

        <Form.Button onClick={handleSubmit} disabled={!isPossible}>
          {t('reservation.shared.create')}
        </Form.Button>
      </Form>
    </Layout>
  );
};

export default PlaceReservationCreatePage;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const locale = context.locale;
  const { placeName, selectedDate } = context.query;

  const res = await PoPoAxios.get<IPlace[]>(`place/name/${placeName}`);
  const placeInfo = res.data;

  return {
    props: {
      placeName,
      placeInfo,
      selectedDate,
      ...(await getI18nProps(locale)),
    },
  };
};
