import React, { useState } from 'react';
import { Modal } from 'semantic-ui-react';
import AppPromo from '@/components/home/AppPromo';

type Props = {};

const AppPromoFab: React.FC<Props> = () => {
  const [open, setOpen] = useState(false);

  React.useEffect(() => {
    const handler = () => setOpen(true);
    document.addEventListener('open-app-promo', handler as any);
    return () => document.removeEventListener('open-app-promo', handler as any);
  }, []);

  return (
    <>
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        size="tiny"
        dimmer={false}
        style={{ width: 'min(92vw, 360px)' }}
      >
        <Modal.Content style={{ padding: 0 }}>
          <AppPromo />
        </Modal.Content>
      </Modal>
    </>
  );
};

export default AppPromoFab;
