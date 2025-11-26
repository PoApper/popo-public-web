import { Image, Modal, Table } from 'semantic-ui-react';

import { IEquipment } from '@/types/reservation.interface';
import OpeningHoursList from '@/components/reservation/opening_hours.list';

const EquipListTable = ({ equipments }: { equipments: IEquipment[] }) => {
  return (
    <Table>
      <Table.Header>
        <Table.Row>
          <Table.HeaderCell width={1}>#</Table.HeaderCell>
          <Table.HeaderCell width={8}>장비 이름</Table.HeaderCell>
          <Table.HeaderCell width={2}>예약비</Table.HeaderCell>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {equipments.map((equipment: any, idx: number) => (
          <Modal
            key={idx}
            size={'small'}
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
                <h4>설명</h4>
                <pre style={{ whiteSpace: 'pre-wrap' }}>
                  {equipment.description}
                </pre>
              </div>
              <div style={{ marginTop: '1rem' }}>
                <h4>사용 가능 시간</h4>
                <OpeningHoursList
                  openingHours={JSON.parse(equipment.openingHours)}
                />
              </div>
              <div style={{ marginTop: '1rem' }}>
                <h4>예약비</h4>
                <p>{equipment.fee.toLocaleString()}원</p>
              </div>
              {equipment.maxMinutes && (
                <div style={{ marginTop: '1rem' }}>
                  <h4>최대 예약 가능 시간</h4>
                  <p>{equipment.maxMinutes}분</p>
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
