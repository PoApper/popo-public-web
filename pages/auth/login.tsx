import { Button, Container, Form, List, Message } from 'semantic-ui-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { GetStaticProps } from 'next';
import { useTranslation } from 'next-i18next/pages';

import Layout from '@/components/layout';
import { PoPoAxios } from '@/lib/axios.instance';
import { getI18nProps } from '@/lib/i18n';

const LoginPage = () => {
  const router = useRouter();
  const { t } = useTranslation('common');

  const [email, setEmail] = useState<string>('');
  const [password, setPW] = useState<string>('');

  useEffect(() => {
    PoPoAxios.get('/auth/verifyToken')
      .then(() => {
        alert(t('common.alreadyLoggedIn'));
        router.push('/');
      })
      .catch(() => {});
  }, [router, t]);

  async function handleLogin() {
    const body = {
      email: email,
      password: password,
    };

    PoPoAxios.post('/auth/login', body)
      .then(() => {
        router.push('/');
      })
      .catch((err) => {
        const response = err.response;
        alert(
          t('auth.login.invalidCredentials', {
            message: response.data.message,
          }),
        );
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
        <Message>{t('auth.login.hint')}</Message>

        <Form>
          <Form.Input
            label={'Email'}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Form.Input
            label={t('auth.login.password')}
            type={'password'}
            onChange={(e) => setPW(e.target.value)}
          />
          <Button primary onClick={handleLogin}>
            {t('nav.login')}
          </Button>
        </Form>

        <List horizontal divided link size="small">
          <List.Item>
            <Link href={'/auth/password/reset'} passHref>
              {t('auth.login.findPassword')}
            </Link>
          </List.Item>
          <List.Item>
            <Link href={'/auth/register'} passHref>
              {t('auth.login.register')}
            </Link>
          </List.Item>
        </List>
      </Container>
    </Layout>
  );
};

export default LoginPage;

export const getStaticProps: GetStaticProps = async ({ locale }) => ({
  props: { ...(await getI18nProps(locale)) },
});
