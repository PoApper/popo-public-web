import React, { useEffect, useState } from 'react';
import { Label, Table } from 'semantic-ui-react';

import { IPlaceReservation } from '@/types/reservation.interface';
import { convertDate, convertStatus, convertTime } from '@/lib/time-date';
import { PoPoAxios } from '@/lib/axios.instance';

type PlaceReservationTableProps = {
  placeName: string;
  selectedDate: string;
};

const PlaceReservationTable = ({
  placeName,
  selectedDate,
}: PlaceReservationTableProps) => {
  const [reservations, setReservations] = useState<IPlaceReservation[]>([]);

  useEffect(() => {
    if (!placeName || !selectedDate) return;

    PoPoAxios.get(
      `/reservation-place/placeName/${placeName}/${selectedDate}`,
    ).then((res) => setReservations(res.data));
  }, [placeName, selectedDate]);

  return (
    <Table>
      <Table.Header>
        <Table.Row textAlign="center">
          <Table.HeaderCell width={2}>사용자</Table.HeaderCell>
          <Table.HeaderCell width={7}>예약 제목</Table.HeaderCell>
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
                  <Table.Cell>{reservation.title}</Table.Cell>
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
            <Table.Cell>등록된 예약이 없습니다!</Table.Cell>
            <Table.Cell />
            <Table.Cell />
          </Table.Row>
        )}
      </Table.Body>
    </Table>
  );
};

export default PlaceReservationTable;
