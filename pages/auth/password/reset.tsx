import { Button, Container, Form, List, Message } from 'semantic-ui-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { GetStaticProps } from 'next';
import { useTranslation } from 'next-i18next/pages';

import Layout from '@/components/layout';
import { PoPoAxios } from '@/lib/axios.instance';
import { getI18nProps } from '@/lib/i18n';

const PasswordResetPage = () => {
  const router = useRouter();
  const { t } = useTranslation('common');

  const [email, setEmail] = useState<string>('');

  useEffect(() => {
    PoPoAxios.get('/auth/verifyToken')
      .then(() => {
        alert(t('common.alreadyLoggedIn'));
        router.push('/');
      })
      .catch(() => {});
  }, [router, t]);

  async function handlePasswordReset() {
    const body = {
      email: email,
    };

    PoPoAxios.post('/auth/password/reset', body)
      .then(() => {
        alert(t('auth.passwordReset.success'));
        router.push('/');
      })
      .catch((err) => {
        const response = err.response;
        alert(`${response.data.message}`);
      });
  }

  return (
    <Layout>
      <Container
        style={{
          width: 640,
          padding: 24,
          margin: '2em 0 0',
          backgroundColor: '#eeeeee',
          borderRadius: 8,
        }}
      >
        <Message>{t('auth.passwordReset.hint')}</Message>
        <Form>
          <Form.Input
            label={'Email'}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Button primary onClick={handlePasswordReset}>
            {t('auth.passwordReset.submit')}
          </Button>
        </Form>

        <List horizontal divided link size="small">
          <List.Item>
            <Link href={'/auth/register'} passHref>
              {t('auth.passwordReset.newMember')}
            </Link>
          </List.Item>
        </List>
      </Container>
    </Layout>
  );
};

export default PasswordResetPage;

export const getStaticProps: GetStaticProps = async ({ locale }) => ({
  props: { ...(await getI18nProps(locale)) },
});
