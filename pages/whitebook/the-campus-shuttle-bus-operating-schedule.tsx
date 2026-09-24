import React from 'react';
import Image from 'next/image';
import { GetStaticProps } from 'next';
import { useTranslation } from 'next-i18next/pages';
import { Table } from 'semantic-ui-react';

import Layout from '@/components/layout';
import { getI18nProps } from '@/lib/i18n';

const NO_STOP = '__NO_STOP__';
const MON_THU = '__MON_THU__';
const MUEUNJAE_SUFFIX = '__MUEUNJAE__';

const TheCampusShuttleBusOperatingSchedule: React.FC = () => {
  const { t } = useTranslation('common');

  // prettier-ignore
  const InnerSpotList = [
    'idx',
    t('shuttle.tempParking'),
    t('shuttle.stops.jigok'),
    t('shuttle.stops.greenMaterials'),
    t('shuttle.stops.lab'),
    t('shuttle.stops.accelerator'),
    t('shuttle.stops.lab'),
    t('shuttle.stops.greenMaterials'),
    t('shuttle.stops.jigok'),
    t('shuttle.tempParking'),
    t('shuttle.stops.envBldg'),
  ];

  // prettier-ignore
  const InnerSpotTable_Semester = [
    ['09:20', '09:21', '09:23', '09:29', '09:30', '09:31', '09:35', '09:37', '09:40', '-'],
    ['09:50', '09:51', NO_STOP, '09:54', '09:55', '09:56', NO_STOP, '09:58', '10:00', '-'],
    ['10:20', '10:21', '10:23', '10:29', '10:30', '10:31', '10:35', '10:37', '10:40', '-'],
    ['-', '-', '-', '-', '10:50', '10:51', NO_STOP, '10:53', `10:54\n${MUEUNJAE_SUFFIX}`, '10:55'],
    ['10:50', '10:51', '10:53', '10:59', '11:00', '11:01', '11:05', '11:08', '11:10', '-'],
    ['11:20', '11:21', '11:23', '11:29', '11:30', '11:31', '11:35', '11:37', '11:40', '-'],
    ['-', '-', '-', '-', MON_THU, '12:21', NO_STOP, '12:23', `12:24\n${MUEUNJAE_SUFFIX}`, '12:25'],
    ['13:20', '13:21', '13:23', '13:29', '13:30', '13:31', '13:35', '13:37', '13:40', '-'],
    ['13:50', '13:51', NO_STOP, '13:54', '13:55', '13:56', NO_STOP, '13:58', '14:00', '-'],
    ['14:20', '14:21', '14:23', '14:29', '14:30', '14:31', '14:35', '14:37', '14:40', '-'],
    ['14:50', '14:51', '14:53', '14:59', '15:00', '15:01', '15:05', '15:07', '15:10', '-'],
    ['-', '-', '-', '-', '15:20', '15:21', NO_STOP, '15:23', `15:24\n${MUEUNJAE_SUFFIX}`, '15:25'],
    ['15:20', '15:21', NO_STOP, '15:24', '15:25', '15:26', '15:30', '15:33', '15:35', '-'],
    ['15:50', '15:51', '15:53', '15:59', '16:00', '16:01', '16:05', '16:07', '16:10', '-'],
    ['16:20', '16:21', '16:23', '16:29', '16:30', '16:31', '16:35', '16:37', '16:40', '-'],
    ['16:50', '16:51', NO_STOP, '16:54', '16:55', '16:56', NO_STOP, '16:58', '17:00', '-'],
    ['17:20', '17:21', '17:23', '17:29', '17:30', '17:31', '17:35', '17:37', '17:40', '-'],
  ];

  const formatCell = (time: string) => {
    if (time === NO_STOP) return t('shuttle.noStop');
    if (time === MON_THU) return t('shuttle.monThu');
    if (time.includes(MUEUNJAE_SUFFIX)) {
      return time.replace(MUEUNJAE_SUFFIX, t('shuttle.mueunjae'));
    }
    return time;
  };

  return (
    <Layout>
      <h1>{t('shuttle.title')}</h1>

      <h2>{t('shuttle.facultySection')}</h2>
      <Table textAlign="center" compact celled>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell width={1}>{t('shuttle.am')}</Table.HeaderCell>
            <Table.HeaderCell width={1}>
              {t('shuttle.facultyBldg8')}
            </Table.HeaderCell>
            <Table.HeaderCell width={1}>
              {t('shuttle.facultyBldg5')}
            </Table.HeaderCell>
            <Table.HeaderCell width={1}>
              {t('shuttle.tempParking')}
            </Table.HeaderCell>
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
            <Table.HeaderCell>{t('shuttle.pm')}</Table.HeaderCell>
            <Table.HeaderCell>{t('shuttle.tempParking')}</Table.HeaderCell>
            <Table.HeaderCell>{t('shuttle.facultyBldg5')}</Table.HeaderCell>
            <Table.HeaderCell>{t('shuttle.facultyBldg8')}</Table.HeaderCell>
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

      <h2>{t('shuttle.campusSection')}</h2>
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
                        color: _time === NO_STOP ? 'red' : 'black',
                      }}
                    >
                      {formatCell(_time)}
                    </Table.Cell>
                  );
                })}
              </Table.Row>
            );
          })}
        </Table.Body>
      </Table>

      <p>
        {t('shuttle.weekdayOnly')}
        <br />
        {t('shuttle.noWeekend')}
      </p>
      <p>
        {t('shuttle.semesterPeriod')}
        <br />
        {t('shuttle.effectiveDate')}
        <br />
        {t('shuttle.contact')}
        <br />
      </p>

      <h2>{t('shuttle.stopsMap')}</h2>
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

export const getStaticProps: GetStaticProps = async ({ locale }) => ({
  props: { ...(await getI18nProps(locale)) },
});
