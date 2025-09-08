import React, { useState } from 'react';
import { Card, Modal, Grid, Header, Divider, Icon } from 'semantic-ui-react';

import { IDiscount } from '@/types/benefit.interface';

const DiscountOfferCards = ({
  discountOffers,
}: {
  discountOffers: IDiscount[];
}) => {
  const initialFlags = Array.from(
    { length: discountOffers.length },
    () => false,
  );
  const [flags, setFlags] = useState(initialFlags);
  const toggleFlag = (id: number) => {
    setFlags((prevFlags) => {
      const newFlags = [...prevFlags];
      newFlags[id] = !newFlags[id];
      return newFlags;
    });
  };

  return (
    <Grid stackable columns={4}>
      {discountOffers.map((discountOffer, idx) => (
        <Grid.Column key={idx}>
          <Modal
            closeIcon
            open={flags[idx]}
            trigger={
              <Card color="pink" style={{ minHeight: '160px' }}>
                <Card.Content>
                  <Card.Header>{discountOffer.title}</Card.Header>
                  <Card.Description>{discountOffer.content}</Card.Description>
                </Card.Content>
              </Card>
            }
            onClose={() => toggleFlag(idx)}
            onOpen={() => toggleFlag(idx)}
          >
            <Header icon="pin" content={discountOffer.title} />
            <Modal.Content>
              <p>
                <Icon name="clock outline" />
                영업 시간: {discountOffer.openHour}
              </p>
              <p>
                <Icon name="phone" />
                가게 번호: {discountOffer.phone}
              </p>
              <Divider />
              <p>
                <Icon name="star" />
                할인 내용
              </p>
              <p style={{ whiteSpace: 'pre-line' }}>{discountOffer.content}</p>
            </Modal.Content>
          </Modal>
        </Grid.Column>
      ))}
    </Grid>
  );
};

export default DiscountOfferCards;
