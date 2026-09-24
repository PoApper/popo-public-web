import { Image, Modal, Table } from 'semantic-ui-react';
import { useTranslation } from 'next-i18next/pages';

import { IEquipment } from '@/types/reservation.interface';
import OpeningHoursList from '@/components/reservation/opening_hours.list';

const EquipListTable = ({ equipments }: { equipments: IEquipment[] }) => {
  const { t } = useTranslation('common');

  return (
    <Table>
      <Table.Header>
        <Table.Row>
          <Table.HeaderCell width={1}>#</Table.HeaderCell>
          <Table.HeaderCell width={8}>
            {t('reservation.equipment.equipNameCol')}
          </Table.HeaderCell>
          <Table.HeaderCell width={2}>
            {t('reservation.equipment.feeCol')}
          </Table.HeaderCell>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {equipments.map((equipment: any, idx: number) => (
          <Modal
            key={idx}
            size={'mini'}
            trigger={
              <Table.Row>
                <Table.Cell>{idx + 1}</Table.Cell>
                <Table.Cell>{equipment.name}</Table.Cell>
                <Table.Cell>{equipment.fee.toLocaleString()}</Table.Cell>
              </Table.Row>
            }
          >
            <Modal.Header>{equipment.name}</Modal.Header>
            <Modal.Content>
              <Image
                src={
                  equipment.imageUrl ??
                  'https://via.placeholder.com/200?text=NoImage'
                }
                alt={`${equipment.name}_logo`}
              />
              <div style={{ marginTop: '1rem' }}>
                <h4>{t('reservation.shared.description')}</h4>
                <pre style={{ whiteSpace: 'pre-wrap' }}>
                  {equipment.description}
                </pre>
              </div>
              <div style={{ marginTop: '1rem' }}>
                <h4>{t('reservation.shared.openingHours')}</h4>
                <OpeningHoursList
                  openingHours={JSON.parse(equipment.openingHours)}
                />
              </div>
              <div style={{ marginTop: '1rem' }}>
                <h4>{t('reservation.equipment.feeCol')}</h4>
                <p>
                  {t('reservation.equipment.feeWon', {
                    fee: equipment.fee.toLocaleString(),
                  })}
                </p>
              </div>
              {equipment.maxMinutes && (
                <div style={{ marginTop: '1rem' }}>
                  <h4>{t('reservation.equipment.maxMinutes')}</h4>
                  <p>
                    {t('reservation.equipment.maxMinutesValue', {
                      minutes: equipment.maxMinutes,
                    })}
                  </p>
                </div>
              )}
              {equipment.reservationRequiredDays > 0 && (
                <div style={{ marginTop: '1rem' }}>
                  <h4>{t('reservation.equipment.advanceRule')}</h4>
                  <p>
                    {t('reservation.shared.daysBeforeRequired', {
                      days: equipment.reservationRequiredDays,
                    })}
                  </p>
                </div>
              )}
            </Modal.Content>
          </Modal>
        ))}
      </Table.Body>
    </Table>
  );
};

export default EquipListTable;
