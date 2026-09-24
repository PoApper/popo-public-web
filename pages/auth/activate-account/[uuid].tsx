import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { GetServerSideProps } from 'next';
import { useTranslation } from 'next-i18next/pages';
import { Button } from 'semantic-ui-react';
import { PoPoAxios } from '@/lib/axios.instance';
import { getI18nProps } from '@/lib/i18n';

const ActivateAccountPage = () => {
  const router = useRouter();
  const { t } = useTranslation('common');
  const userUuid = router.query.uuid;

  const [isLoading, setIsLoading] = useState(true);
  const [isValidAccount, setIsValidAccount] = useState(false);

  useEffect(() => {
    if (!userUuid) return;

    setIsLoading(true);
    PoPoAxios.put(`/auth/activate/${userUuid}`)
      .then(() => {
        setIsLoading(false);
        setIsValidAccount(true);
      })
      .catch((err) => {
        console.log(err);
        setIsLoading(false);
        setIsValidAccount(false);
        alert(t('auth.activate.invalidAccess'));
      });
  }, [userUuid, t]);

  return (
    <div>
      {isLoading ? (
        <div>{t('auth.activate.loading')}</div>
      ) : isValidAccount ? (
        <div>
          <h2>{t('auth.activate.successTitle')}</h2>
          <p style={{ whiteSpace: 'pre-line' }}>{t('auth.activate.successBody')}</p>
          <br />
          <Button primary href={'/auth/login'}>
            {t('auth.activate.goLogin')}
          </Button>
        </div>
      ) : (
        <div>
          <h2>{t('auth.activate.invalidAccess')}</h2>
        </div>
      )}
    </div>
  );
};

export default ActivateAccountPage;

export const getServerSideProps: GetServerSideProps = async ({ locale }) => ({
  props: { ...(await getI18nProps(locale)) },
});
