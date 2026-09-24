import { useState } from 'react';
import { Button, Modal } from 'semantic-ui-react';
import { useTranslation } from 'next-i18next/pages';
import { PoPoAxios } from '@/lib/axios.instance';

const DeleteConfirmModal = (props: any) => {
  const { t } = useTranslation('common');
  const deleteTarget = props.target;
  const deleteURI = props.deleteURI;
  const [open, setOpen] = useState(props.open);

  const handleDelete = async () => {
    PoPoAxios.delete(`/${deleteURI}`)
      .then(() => {
        window.location.reload();
      })
      .catch((err) => {
        const errMsg = err.response.data.message;
        alert(t('common.deleteFailed', { errMsg }));
      });
  };

  return (
    <Modal
      open={open}
      trigger={props.trigger}
      onClose={() => setOpen(false)}
      onOpen={() => setOpen(true)}
    >
      <Modal.Header>{t('common.deleteConfirmTitle')}</Modal.Header>
      <Modal.Content>
        {t('common.deleteConfirmBody', { target: deleteTarget })}
      </Modal.Content>
      <Modal.Actions>
        <Button content={t('common.cancel')} onClick={() => setOpen(false)} />
        <Button
          negative
          icon={'check'}
          content={t('common.delete')}
          onClick={handleDelete}
        />
      </Modal.Actions>
    </Modal>
  );
};

export default DeleteConfirmModal;
