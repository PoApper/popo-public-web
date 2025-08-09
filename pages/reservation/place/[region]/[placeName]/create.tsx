import React, { useEffect, useState } from 'react';
import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import { Divider, Form, Message } from 'semantic-ui-react';
import moment from 'moment';

import { IPlace } from '@/types/reservation.interface';
import Layout from '@/components/layout';
import { PoPoAxios } from '@/lib/axios.instance';
import { IUser } from '@/types/user.interface';
import { isOnOpeningHours } from '@/lib/opening_hours';
import { minuteDiff, roundUpByDuration } from '@/lib/time-date';
import ReservationDatetimePicker from '@/components/reservation/reservation.datetime.picker';
import OpeningHoursList from '@/components/reservation/opening_hours.list';
import PlaceReservationTable from '@/components/reservation/place.reservation.table';

const RegionKorNameMapping = {
  STUDENT_HALL: '학생 회관',
  JIGOK_CENTER: '지곡 회관',
  OTHERS: '기타',
  COMMUNITY_CENTER: '커뮤니티 센터',
  RESIDENTIAL_COLLEGE: 'RC',
};

const PlaceReservationCreatePage: React.FunctionComponent<{
  placeInfo: IPlace;
  selectedDate: string;
  placeName: string;
}> = ({ placeInfo, selectedDate, placeName }) => {
  const router = useRouter();

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

  const isPossible = isOnOpeningHours(
    placeInfo.opening_hours,
    date.format('dddd'), // 월요일
    startTime.format('HH:mm'),
    endTime.format('HH:mm'),
  );

  useEffect(() => {
    // 로그인 확인
    PoPoAxios.get('/auth/verifyToken')
      .then((res) => {
        setUserInfo(res.data);
      })
      .catch(() => {
        alert('로그인 후 예약할 수 있습니다.');
        router.push('/auth/login');
      });
    // 오늘 이후의 날짜를 선택했는지 확인
    const today = moment().format('YYYYMMDD');
    if (moment(selectedDate).isBefore(today)) {
      setTimeout(() => {
        alert('오늘 이후의 날짜를 선택해주세요.');
        router.push(`/reservation/place/${placeInfo.region}/${placeName}`);
      }, 100);
    }
  }, [placeInfo.region, placeName, router, selectedDate]);

  function handleSubmit() {
    if (!isPossible) {
      alert(
        `예약이 불가능한 시간대입니다. ${placeInfo.name}의 사용 가능 시간을 확인해주세요.`,
      );
      return;
    }

    if (title.length == 1 || description.length == 1) {
      alert('예약 설명이 너무 짧습니다.');
      return;
    }

    PoPoAxios.post('/reservation-place', {
      place_id: placeInfo.uuid,
      phone: phone,
      title: title,
      description: description,
      date: date.format('YYYYMMDD'), // YYYYMMDD
      start_time: startTime.format('HHmm'), // HHmm
      end_time: endTime.format('HHmm'), // HHmm
    })
      .then(() => {
        alert('예약을 생성했습니다!');
        router.push('/auth/my-reservation');
      })
      .catch((error) => {
        alert(`예약 생성에 실패했습니다: ${error.response.data.message}`);
      });
  }

  return (
    <Layout>
      <h1>장소 예약: {placeInfo.name}</h1>

      <Form>
        <Form.Group>
          <Form.Input
            required
            readOnly
            label={'지역'}
            name="region"
            // @ts-ignore
            value={RegionKorNameMapping[placeInfo.region]}
          />
          <Form.Input
            required
            readOnly
            label={'장소'}
            name="place"
            value={placeInfo.name}
          />
        </Form.Group>

        <Form.Input
          required
          readOnly
          label={'사용자'}
          value={userInfo ? userInfo.name : ''}
        />

        <Form.Input
          required
          label={'전화번호'}
          placeholder={'010-xxxx-xxxx'}
          onChange={(e) => setPhone(e.target.value)}
        />
        <Form.Input
          required
          label={'예약 제목'}
          placeholder={'예약 제목을 작성해주세요.'}
          onChange={(e) => setTitle(e.target.value)}
        />
        <Form.TextArea
          required
          label={'설명'}
          placeholder={'사용 인원을 꼭 작성 해주세요.'}
          onChange={(e) => setDescription(e.target.value)}
        />

        <Divider />

        <div className={'field'} style={{ maxWidth: 240 }}>
          <label>사용 가능 시간</label>
          <div style={{ color: 'gray' }}>
            <OpeningHoursList
              openingHours={JSON.parse(placeInfo.opening_hours)}
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
          />
        </Form.Group>

        {isPossible ? null : (
          <Message negative>
            예약이 불가능한 시간대입니다. {placeInfo.name}의 사용 가능 시간을
            확인해주세요.
          </Message>
        )}

        <div className={'field'}>
          <label>예약 현황</label>
          <div>
            <PlaceReservationTable
              placeName={placeName}
              selectedDate={date.format('YYYYMMDD')}
            />
          </div>
        </div>

        {placeInfo.name.includes('시네마 룸') ? (
          <Message>
            RC 시네마 룸의 예약은
            <br />
            18:00 ~ 21:00 / 21:00 ~ 24:00 / 00:00 ~ 03:00
            <br />
            3가지 시간대만 가능 합니다.
          </Message>
        ) : null}

        <Message>
          <Message.Header>
            예약 장소와 예약 시간을 꼭 확인해주세요!
          </Message.Header>
          <p>
            {
              // @ts-ignore
              RegionKorNameMapping[placeInfo.region]
            }{' '}
            {placeInfo.name}, {minuteDiff(startTime, endTime)}분 예약입니다.
          </p>
        </Message>

        <Form.Button onClick={handleSubmit} disabled={!isPossible}>
          생성
        </Form.Button>
      </Form>
    </Layout>
  );
};

export default PlaceReservationCreatePage;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { placeName, selectedDate } = context.query;

  const res = await PoPoAxios.get<IPlace[]>(`place/name/${placeName}`);
  const placeInfo = res.data;

  return {
    props: { placeName, placeInfo, selectedDate },
  };
};
