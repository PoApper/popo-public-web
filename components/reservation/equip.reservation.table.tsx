import React, { useEffect, useState } from 'react';
import { Label, Table } from 'semantic-ui-react';

import { convertDate, convertStatus, convertTime } from '@/lib/time-date';
import { IEquipReservation } from '@/types/reservation.interface';
import { PoPoAxios } from '@/lib/axios.instance';

type EquipReservationTableProps = {
  associationName: string;
  selectedDate: string;
};

const EquipReservationTable = ({
  associationName,
  selectedDate,
}: EquipReservationTableProps) => {
  const [reservations, setReservations] = useState<IEquipReservation[]>([]);

  useEffect(() => {
    if (!associationName || !selectedDate) return;

    PoPoAxios.get(
      `/reservation-equip?owner=${associationName}&date=${selectedDate}`,
    ).then((res) => setReservations(res.data));
  }, [associationName, selectedDate]);

  return (
    <>
      <Table compact>
        <Table.Header>
          <Table.Row textAlign={'center'}>
            <Table.HeaderCell width={2}>사용자</Table.HeaderCell>
            <Table.HeaderCell width={7}>장비 목록</Table.HeaderCell>
            <Table.HeaderCell width={5}>예약 기간</Table.HeaderCell>
            <Table.HeaderCell width={2}>상태</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {reservations.length ? (
            reservations
              .sort((a, b) => Number(a.startTime) - Number(b.startTime))
              .map((reservation) => {
                return (
                  <Table.Row key={reservation.uuid} textAlign="center">
                    <Table.Cell>{reservation.booker.name}</Table.Cell>
                    <Table.Cell>
                      {reservation.equipments
                        ? reservation.equipments.map((equip) => {
                            return (
                              <Label key={equip.uuid} style={{ margin: 2 }}>
                                {equip.name}
                              </Label>
                            );
                          })
                        : null}
                    </Table.Cell>
                    <Table.Cell>
                      {convertDate(reservation.date)}
                      <br />
                      {convertTime(reservation.startTime)} ~
                      {convertTime(reservation.endTime)}
                    </Table.Cell>
                    <Table.Cell>
                      <Label
                        circular
                        empty
                        color={convertStatus(reservation.status)}
                      />
                    </Table.Cell>
                  </Table.Row>
                );
              })
          ) : (
            <Table.Row>
              <Table.Cell />
              <Table.Cell textAlign={'center'}>
                등록된 예약이 없습니다!
              </Table.Cell>
              <Table.Cell />
              <Table.Cell />
            </Table.Row>
          )}
        </Table.Body>
      </Table>
    </>
  );
};

export default EquipReservationTable;
