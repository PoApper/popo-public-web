import React, { useEffect, useState } from 'react';
import moment from 'moment';
import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import { Divider, Form, Message } from 'semantic-ui-react';

import { hourDiff, roundUpByDuration } from '@/lib/time-date';
import { isOnOpeningHours } from '@/lib/opening_hours';
import Layout from '@/components/layout';
import { PoPoAxios } from '@/lib/axios.instance';
import { IEquipment } from '@/types/reservation.interface';
import { IUser } from '@/types/user.interface';
import ReservationDatetimePicker from '@/components/reservation/reservation.datetime.picker';
import EquipReservationTable from '@/components/reservation/equip.reservation.table';
import OpeningHoursList from '@/components/reservation/opening_hours.list';

type ObjectType = {
  [key: string]: string;
};

const OWNER_NAME_MAP: ObjectType = {
  dongyeon: '동아리연합회',
  dormunion: '생활관자치회',
  saengna: '생각나눔',
};

const EquipReservationCreatePage: React.FunctionComponent<{
  association: string;
  equipmentList: IEquipment[];
  selectedDate: string;
}> = ({ association, equipmentList, selectedDate }) => {
  const router = useRouter();

  const [userInfo, setUserInfo] = useState<IUser | null>({
    name: '',
  });

  const [selectedEquipments, setselectedEquipments] = useState<string[]>([]);
  const [phone, setPhone] = useState<string>('');
  const [title, setTitle] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [feeSum, setFeeSum] = useState(0);

  const now: moment.Moment = roundUpByDuration(moment(), 30);
  const nowNext30Min: moment.Moment = moment(now).add(30, 'minute');

  const [date, setDate] = useState<moment.Moment>(moment(selectedDate)); // YYYY-MM-DD
  const [startTime, setStartTime] = useState<moment.Moment>(now); // HHmm
  const [endTime, setEndTime] = useState<moment.Moment>(nowNext30Min); // HHmm

  // Check if all selected equipments are available at the selected time
  const selectedEquipmentObjects = equipmentList.filter((equip) =>
    selectedEquipments.includes(equip.uuid),
  );

  const unavailableEquipments = selectedEquipmentObjects.filter((equip) => {
    return !isOnOpeningHours(
      equip.openingHours,
      date.format('dddd'), // Monday
      startTime.format('HH:mm'),
      endTime.format('HH:mm'),
    );
  });

  const isPossible = unavailableEquipments.length === 0;

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
        router.push(`/reservation/equipment/${association}`);
      }, 100);
    }
  }, [association, router, selectedDate]);

  function handleSubmit() {
    if (title.length == 1 || description.length == 1) {
      alert('예약 설명이 너무 짧습니다.');
      return;
    }

    if (!isPossible) {
      alert('선택한 시간대에 사용 불가능한 장비가 있습니다.');
      return;
    }

    PoPoAxios.post('/reservation-equip', {
      equipments: selectedEquipments,
      owner: association,
      phone: phone,
      title: title,
      description: description,
      date: date.format('YYYYMMDD'), // YYYYMMDD
      startTime: startTime.format('HHmm'), // HHmm
      endTime: endTime.format('HHmm'), // HHmm
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
      <h2>장비 예약: {OWNER_NAME_MAP[association]}</h2>
      <Form>
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
          placeholder={'사용처를 반드시 작성해주세요.'}
          onChange={(e) => setDescription(e.target.value)}
        />

        <Divider />

        <Form.Dropdown
          required
          fluid
          multiple
          search
          selection
          label={'장비 선택'}
          placeholder={'예약할 장비들을 선택해주세요.'}
          options={equipmentList.map((equip, idx) => ({
            key: idx,
            text: equip.name,
            value: equip.uuid,
          }))}
          onKeyDown={(e: KeyboardEvent) => e.preventDefault()}
          onChange={(e, { value }) => {
            let feeSum = 0;

            // @ts-ignore
            for (const uuid of value) {
              for (const equip of equipmentList) {
                if (equip.uuid === uuid) {
                  feeSum += equip.fee;
                }
              }
            }
            setFeeSum(feeSum);

            // @ts-ignore
            setselectedEquipments(value);
          }}
        />

        {selectedEquipmentObjects.length > 0 && (
          <div className={'field'} style={{ maxWidth: 400 }}>
            <label>선택한 장비의 사용 가능 시간</label>
            {selectedEquipmentObjects.map((equip) => (
              <div key={equip.uuid} style={{ marginBottom: 12 }}>
                <div style={{ fontWeight: 'bold', marginBottom: 4 }}>
                  {equip.name}
                </div>
                <div style={{ color: 'gray', fontSize: '0.9em' }}>
                  <OpeningHoursList
                    openingHours={JSON.parse(equip.openingHours)}
                  />
                </div>
              </div>
            ))}
          </div>
        )}

        <Divider />

        <Form.Group>
          <ReservationDatetimePicker
            date={date}
            startTime={startTime}
            endTime={endTime}
            setDate={setDate}
            setStartTime={setStartTime}
            setEndTime={setEndTime}
          />
        </Form.Group>

        {!isPossible && selectedEquipments.length > 0 && (
          <Message negative>
            <Message.Header>예약이 불가능한 시간대입니다</Message.Header>
            <p>
              다음 장비들이 선택한 시간대에 사용 불가능합니다:
              <ul>
                {unavailableEquipments.map((equip) => (
                  <li key={equip.uuid}>{equip.name}</li>
                ))}
              </ul>
              각 장비의 사용 가능 시간을 확인해주세요.
            </p>
          </Message>
        )}

        <div className={'field'}>
          <label>예약 현황</label>
          <div>
            <EquipReservationTable
              associationName={association}
              selectedDate={date.format('YYYYMMDD')}
            />
          </div>
        </div>

        <Message>
          <Message.Header>
            예약한 장비의 예약비를 꼭 확인해주세요!
          </Message.Header>
          <p>
            {selectedEquipments.length}개 장비, {hourDiff(startTime, endTime)}
            시간 예약, 총 예약비는 <b>
              {Number(feeSum).toLocaleString()}원
            </b>{' '}
            입니다.
          </p>
        </Message>

        <Form.Button onClick={handleSubmit}>생성</Form.Button>
      </Form>
    </Layout>
  );
};

export default EquipReservationCreatePage;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { association, selectedDate } = context.query;

  const res = await PoPoAxios.get<IEquipment[]>(`equip/owner/${association}`);
  const equipmentList = res.data;

  return {
    props: { association, equipmentList, selectedDate },
  };
};
