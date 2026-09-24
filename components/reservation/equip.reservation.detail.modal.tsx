import { Button, Icon, Label, Modal, Segment } from 'semantic-ui-react';
import { useState } from 'react';
import moment from 'moment';
import { useTranslation } from 'next-i18next/pages';
import DeleteConfirmModal from '../common/delete.confirm.modal';

// @ts-ignore
const EquipReservationDetailModal = ({ reservation, trigger }) => {
  const { t } = useTranslation('common');
  const [open, setOpen] = useState(false);

  return (
    <Modal
      closeIcon
      size={'small'}
      open={open}
      trigger={trigger}
      onOpen={() => setOpen(true)}
      onClose={() => setOpen(false)}
    >
      <Modal.Header>
        {t('reservation.equipment.detailModalTitle')}
      </Modal.Header>
      <Modal.Content>
        <Segment.Group>
          <Segment>
            <h4>{t('reservation.equipment.equipListCol')}</h4>
            <div>
              {reservation.equipments.map((equipment: any) => {
                return (
                  <Label key={equipment.uuid} style={{ margin: '4px' }}>
                    {equipment.name}
                  </Label>
                );
              })}
            </div>
          </Segment>
          <Segment>
            <h4>{t('reservation.shared.phone')}</h4>
            <div>{reservation.phone}</div>
          </Segment>
          <Segment>
            <h4>{t('reservation.shared.title')}</h4>
            <div>{reservation.title}</div>
          </Segment>
          <Segment>
            <h4>{t('reservation.shared.description')}</h4>
            <div>{reservation.description}</div>
          </Segment>
          <Segment>
            <h4>{t('auth.myReservation.colPeriod')}</h4>
            <div>
              <b>
                {moment(reservation.date, 'YYYYMMDD').format('YYYY-MM-DD')}
                &nbsp;
                {moment(reservation.startTime, 'HHmm').format('HH:mm')}
                &nbsp;~&nbsp;
                {moment(reservation.endTime, 'HHmm').format('HH:mm')}
              </b>
            </div>
          </Segment>
          <Segment>
            <h4>{t('reservation.shared.createdAt')}</h4>
            <div>
              {moment(reservation.createdAt).format('YYYY-MM-DD HH:mm')}
            </div>
          </Segment>
        </Segment.Group>

        <Modal.Actions style={{ marginBottom: '50px' }}>
          <Button.Group floated={'right'}>
            <DeleteConfirmModal
              target={reservation.title}
              deleteURI={`reservation-equip/${reservation.uuid}`}
              trigger={
                <Button negative>
                  <Icon name={'trash'} />{' '}
                  {t('reservation.shared.deleteReservation')}
                </Button>
              }
            />
          </Button.Group>
        </Modal.Actions>
      </Modal.Content>
    </Modal>
  );
};

export default EquipReservationDetailModal;
