import React, { useState } from 'react';
import { Card, Modal, Grid, Header } from 'semantic-ui-react';

import { IAffiliate } from '@/types/benefit.interface';

const AffiliateCards = ({ affiliates }: { affiliates: IAffiliate[] }) => {
  const initialFlags = Array.from({ length: affiliates.length }, () => false);
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
      {affiliates.map((affiliate, id) => (
        <Grid.Column key={id}>
          <Modal
            closeIcon
            open={flags[id]}
            trigger={
              <Card color="pink" style={{ minHeight: '160px' }}>
                <Card.Content>
                  <Card.Header>{affiliate.title}</Card.Header>
                  <Card.Description>{affiliate.contentShort}</Card.Description>
                </Card.Content>
              </Card>
            }
            onClose={() => toggleFlag(id)}
            onOpen={() => toggleFlag(id)}
          >
            <Header icon="paperclip" content={affiliate.title} />
            <Modal.Content>
              <p style={{ whiteSpace: 'pre-line' }}>{affiliate.content}</p>
            </Modal.Content>
          </Modal>
        </Grid.Column>
      ))}
    </Grid>
  );
};

export default AffiliateCards;
