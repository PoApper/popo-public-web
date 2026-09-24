import React, { useEffect, useState } from 'react';
import moment from 'moment';
import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import { Divider, Form, Message } from 'semantic-ui-react';
import { useTranslation } from 'next-i18next/pages';

import { hourDiff, roundUpByDuration } from '@/lib/time-date';
import { isOnOpeningHours } from '@/lib/opening_hours';
import Layout from '@/components/layout';
import { PoPoAxios } from '@/lib/axios.instance';
import { IEquipment } from '@/types/reservation.interface';
import { IUser } from '@/types/user.interface';
import ReservationDatetimePicker from '@/components/reservation/reservation.datetime.picker';
import EquipReservationTable from '@/components/reservation/equip.reservation.table';
import OpeningHoursList from '@/components/reservation/opening_hours.list';
import { isReservationLeadTimeSatisfied } from '@/lib/reservation-required-days';
import { getI18nProps } from '@/lib/i18n';

type ObjectType = {
  [key: string]: string;
};

const OWNER_NAME_KEY_MAP: ObjectType = {
  dongyeon: 'reservation.equipment.owners.dongyeon',
  dormunion: 'reservation.equipment.owners.dormunion',
  saengna: 'reservation.equipment.owners.saengna',
};

const EquipReservationCreatePage: React.FunctionComponent<{
  association: string;
  equipmentList: IEquipment[];
  selectedDate: string;
}> = ({ association, equipmentList, selectedDate }) => {
  const router = useRouter();
  const { t } = useTranslation('common');

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

  const unavailableOpeningHourEquipments = selectedEquipmentObjects.filter(
    (equip) => {
      return !isOnOpeningHours(
        equip.openingHours,
        date.format('dddd'), // Monday
        startTime.format('HH:mm'),
        endTime.format('HH:mm'),
      );
    },
  );
  const unavailableLeadTimeEquipments = selectedEquipmentObjects.filter(
    (equip) =>
      !isReservationLeadTimeSatisfied(
        date.format('YYYYMMDD'),
        equip.reservationRequiredDays,
      ),
  );
  const reservationRequiredDays = Math.max(
    0,
    ...selectedEquipmentObjects.map(
      (equip) => Number(equip.reservationRequiredDays) || 0,
    ),
  );

  const isPossible =
    unavailableOpeningHourEquipments.length === 0 &&
    unavailableLeadTimeEquipments.length === 0;

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
        router.push(`/reservation/equipment/${association}`);
      }, 100);
    }
  }, [association, router, selectedDate, t]);

  function handleSubmit() {
    if (title.length == 1 || description.length == 1) {
      alert(t('reservation.shared.descriptionTooShort'));
      return;
    }

    if (!isPossible) {
      if (unavailableLeadTimeEquipments.length > 0) {
        alert(t('reservation.equipment.leadTimeAlert'));
        return;
      }

      alert(t('reservation.equipment.unavailableAlert'));
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
      <h2>
        {t('reservation.equipment.createTitle', {
          name: t(OWNER_NAME_KEY_MAP[association]),
        })}
      </h2>
      <Form>
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
          placeholder={t('reservation.equipment.descPlaceholder')}
          onChange={(e) => setDescription(e.target.value)}
        />

        <Divider />

        <Form.Dropdown
          required
          fluid
          multiple
          search
          selection
          label={t('reservation.equipment.selectEquip')}
          placeholder={t('reservation.equipment.selectEquipPlaceholder')}
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
            <label>{t('reservation.equipment.selectedOpeningHours')}</label>
            {selectedEquipmentObjects.map((equip) => (
              <div key={equip.uuid} style={{ marginBottom: 12 }}>
                <div style={{ fontWeight: 'bold', marginBottom: 4 }}>
                  {equip.name}
                </div>
                <div style={{ color: 'gray', fontSize: '0.9em' }}>
                  <OpeningHoursList
                    openingHours={JSON.parse(equip.openingHours)}
                  />
                  {equip.reservationRequiredDays > 0 ? (
                    <div>
                      {t('reservation.shared.daysBeforeRequired', {
                        days: equip.reservationRequiredDays,
                      })}
                    </div>
                  ) : null}
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
            reservationRequiredDays={reservationRequiredDays}
          />
        </Form.Group>

        {unavailableLeadTimeEquipments.length > 0 && (
          <Message negative>
            <Message.Header>
              {t('reservation.equipment.leadTimeHeader')}
            </Message.Header>
            <p>
              {t('reservation.equipment.leadTimeListIntro')}
              <ul>
                {unavailableLeadTimeEquipments.map((equip) => (
                  <li key={equip.uuid}>
                    {equip.name} (
                    {t('reservation.shared.daysBeforeRequired', {
                      days: equip.reservationRequiredDays,
                    })}
                    )
                  </li>
                ))}
              </ul>
            </p>
          </Message>
        )}

        {unavailableOpeningHourEquipments.length > 0 && (
          <Message negative>
            <Message.Header>
              {t('reservation.equipment.unavailableHeader')}
            </Message.Header>
            <p>
              {t('reservation.equipment.unavailableListIntro')}
              <ul>
                {unavailableOpeningHourEquipments.map((equip) => (
                  <li key={equip.uuid}>{equip.name}</li>
                ))}
              </ul>
              {t('reservation.equipment.checkOpeningHours')}
            </p>
          </Message>
        )}

        <div className={'field'}>
          <label>{t('reservation.shared.currentReservations')}</label>
          <div>
            <EquipReservationTable
              associationName={association}
              selectedDate={date.format('YYYYMMDD')}
            />
          </div>
        </div>

        <Message>
          <Message.Header>
            {t('reservation.equipment.feeConfirmHeader')}
          </Message.Header>
          <p>
            {t('reservation.equipment.feeSummary', {
              count: selectedEquipments.length,
              hours: hourDiff(startTime, endTime),
              fee: Number(feeSum).toLocaleString(),
            })}
          </p>
        </Message>

        <Form.Button onClick={handleSubmit}>
          {t('reservation.shared.create')}
        </Form.Button>
      </Form>
    </Layout>
  );
};

export default EquipReservationCreatePage;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const locale = context.locale;
  const { association, selectedDate } = context.query;

  const res = await PoPoAxios.get<IEquipment[]>(`equip/owner/${association}`);
  const equipmentList = res.data;

  return {
    props: {
      association,
      equipmentList,
      selectedDate,
      ...(await getI18nProps(locale)),
    },
  };
};
