import React from 'react';
import Image from 'next/image';

import Layout from '@/components/layout';
import { Table } from 'semantic-ui-react';

const TheCampusShuttleBusOperatingSchedule: React.FC = () => {
  // prettier-ignore
  const InnerSpotList = ['idx', '임시 주차장', '지곡회관', '친환경소재\n대학원', '실험동', '가속기', '실험동', '친환경소재\n대학원', '지곡회관', '임시 주차장', '환경동']

  // prettier-ignore
  const InnerSpotTable_Semester = [
    ['09:20', '09:21', '09:23', '09:29', '09:30', '09:31', '09:35', '09:37', '09:40', '-'],
    ['09:50', '09:51', '미정차', '09:54', '09:55', '09:56', '미정차', '09:58', '10:00', '-'],
    ['10:20', '10:21', '10:23', '10:29', '10:30', '10:31', '10:35', '10:37', '10:40', '-'],
    ['-', '-', '-', '-', '10:50', '10:51', '미정차', '10:53', '10:54\n(무은재)', '10:55'],
    ['10:50', '10:51', '10:53', '10:59', '11:00', '11:01', '11:05', '11:08', '11:10', '-'],
    ['11:20', '11:21', '11:23', '11:29', '11:30', '11:31', '11:35', '11:37', '11:40', '-'],
    ['-', '-', '-', '-', '월-목\n12:20', '12:21', '미정차', '12:23', '12:24\n(무은재)', '12:25'],
    ['13:20', '13:21', '13:23', '13:29', '13:30', '13:31', '13:35', '13:37', '13:40', '-'],
    ['13:50', '13:51', '미정차', '13:54', '13:55', '13:56', '미정차', '13:58', '14:00', '-'],
    ['14:20', '14:21', '14:23', '14:29', '14:30', '14:31', '14:35', '14:37', '14:40', '-'],
    ['14:50', '14:51', '14:53', '14:59', '15:00', '15:01', '15:05', '15:07', '15:10', '-'],
    ['-', '-', '-', '-', '15:20', '15:21', '미정차', '15:23', '15:24\n(무은재)', '15:25'],
    ['15:20', '15:21', '미정차', '15:24', '15:25', '15:26', '15:30', '15:33', '15:35', '-'],
    ['15:50', '15:51', '15:53', '15:59', '16:00', '16:01', '16:05', '16:07', '16:10', '-'],
    ['16:20', '16:21', '16:23', '16:29', '16:30', '16:31', '16:35', '16:37', '16:40', '-'],
    ['16:50', '16:51', '미정차', '16:54', '16:55', '16:56', '미정차', '16:58', '17:00', '-'],
    ['17:20', '17:21', '17:23', '17:29', '17:30', '17:31', '17:35', '17:37', '17:40', '-'],
  ]

  return (
    <Layout>
      <h1>🚌 교내 셔틀버스 운행시간 안내 (학기 중)</h1>

      <h2>교수 아파트(Faculty Apartment Area)</h2>
      <Table textAlign="center" compact celled>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell width={1}>오전(AM)</Table.HeaderCell>
            <Table.HeaderCell width={1}>교수 8동</Table.HeaderCell>
            <Table.HeaderCell width={1}>교수 5동</Table.HeaderCell>
            <Table.HeaderCell width={1}>임시주차장</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          <Table.Row>
            <Table.Cell></Table.Cell>
            <Table.Cell>08:45</Table.Cell>
            <Table.Cell>08:46</Table.Cell>
            <Table.Cell>08:50</Table.Cell>
          </Table.Row>
        </Table.Body>

        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>오후(PM)</Table.HeaderCell>
            <Table.HeaderCell>임시주차장</Table.HeaderCell>
            <Table.HeaderCell>교수 5동</Table.HeaderCell>
            <Table.HeaderCell>교수 8동</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          <Table.Row>
            <Table.Cell></Table.Cell>
            <Table.Cell>18:00</Table.Cell>
            <Table.Cell>18:04</Table.Cell>
            <Table.Cell>18:05</Table.Cell>
          </Table.Row>
        </Table.Body>
      </Table>

      <h2>교내 셔틀(POSTECH Campus Area)</h2>
      <Table textAlign="center" compact celled selectable>
        <Table.Header>
          <Table.Row>
            {InnerSpotList.map((spot, index) => {
              return (
                <Table.HeaderCell width={1} key={index}>
                  <pre>{spot}</pre>
                </Table.HeaderCell>
              );
            })}
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {InnerSpotTable_Semester.map((time_list, index) => {
            return (
              <Table.Row key={index}>
                <Table.Cell>
                  <b>{index + 1}</b>
                </Table.Cell>
                {time_list.map((_time, i) => {
                  return (
                    <Table.Cell
                      key={i}
                      style={{
                        whiteSpace: 'pre',
                        color: _time === '미정차' ? 'red' : 'black',
                      }}
                    >
                      {_time}
                    </Table.Cell>
                  );
                })}
              </Table.Row>
            );
          })}
        </Table.Body>
      </Table>

      <p>
        * 주중(월~금)에만 운행 (Shuttle bus operates only on weekdays)
        <br />* 휴일 및 주말에는 차량 운행 없음. (There is no campus shuttle bus
        support on holidays and weekends)
      </p>
      <p>
        - 학기중 운행 기간: 2025.02.17(월) ~ 2025.06.05(목)
        <br />
        - 시행일자: 2025.02.17(월)
        <br />
        - 문의처: 054-279-3536 (차량반)
        <br />
      </p>

      <h2>셔틀버스 정류장(Shuttle Bus Stop)</h2>
      <div>
        <Image
          src="/shuttle-bus-stop.png"
          alt="Shuttle Bus Stop"
          width={400}
          height={300}
          style={{
            maxWidth: '400px',
            height: 'auto',
          }}
        />
      </div>
    </Layout>
  );
};

export default TheCampusShuttleBusOperatingSchedule;
