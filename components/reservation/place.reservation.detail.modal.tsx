import { Button, Icon, Modal, Segment } from 'semantic-ui-react';
import { useState } from 'react';
import moment from 'moment';
import DeleteConfirmModal from '../common/delete.confirm.modal';

// @ts-ignore
const PlaceReservationDetailModal = ({ reservation, trigger }) => {
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
      <Modal.Header>장소 예약</Modal.Header>
      <Modal.Content>
        <Segment.Group>
          <Segment>
            <h4>장소</h4>
            <div>{reservation.place.name}</div>
          </Segment>
          <Segment>
            <h4>전화번호</h4>
            <div>{reservation.phone}</div>
          </Segment>
          <Segment>
            <h4>예약 제목</h4>
            <div>{reservation.title}</div>
          </Segment>
          <Segment>
            <h4>설명</h4>
            <div>{reservation.description}</div>
          </Segment>
          <Segment>
            <h4>예약 기간</h4>
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
            <h4>생성일</h4>
            <div>
              {moment(reservation.createdAt).format('YYYY-MM-DD HH:mm')}
            </div>
          </Segment>
        </Segment.Group>

        <Modal.Actions style={{ marginBottom: '50px' }}>
          <Button.Group floated={'right'}>
            <DeleteConfirmModal
              target={reservation.title}
              deleteURI={`reservation-place/${reservation.uuid}`}
              trigger={
                <Button negative>
                  <Icon name={'trash'} /> 예약 삭제
                </Button>
              }
            />
          </Button.Group>
        </Modal.Actions>
      </Modal.Content>
    </Modal>
  );
};

export default PlaceReservationDetailModal;
