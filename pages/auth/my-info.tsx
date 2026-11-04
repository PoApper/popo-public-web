import { Container, Form, Segment } from 'semantic-ui-react';
import Layout from '@/components/layout';
import { useEffect, useState } from 'react';
import moment from 'moment';
import { useRouter } from 'next/router';
import { GetStaticProps } from 'next';
import { useTranslation } from 'next-i18next/pages';
import { PoPoAxios } from '@/lib/axios.instance';
import { getI18nProps } from '@/lib/i18n';

interface MyInformation {
  email: string;
  name: string;
  userType: string;
  createdAt: Date;
}

const MyInfoPage = () => {
  const router = useRouter();
  const { t } = useTranslation('common');

  const [myInfo, setMyInfo] = useState<MyInformation>({
    email: '',
    name: '',
    userType: '',
    createdAt: new Date(),
  });
  const [password, setPW] = useState<string>('');
  const [passwordAgain, setPwAgain] = useState<string>('');

  const isPasswordInvalid: boolean =
    password.length > 0 && !RegExp(/^.{8,64}$/).test(password);
  const isPasswordAgainInvalid: boolean =
    passwordAgain.length > 0 && password !== passwordAgain;

  useEffect(() => {
    PoPoAxios.get('/auth/myInfo')
      .then((res) => setMyInfo(res.data))
      .catch(() => {
        alert(t('common.loginRequiredToView'));
        router.push('/auth/login');
      });
  }, [router, t]);

  async function submitNewPassword() {
    try {
      await PoPoAxios.post('/auth/password/update', {
        password: password,
      });
      alert(t('auth.myInfo.changePasswordSuccess'));
      window.location.reload();
    } catch (err: any) {
      const response = err.response;
      alert(
        t('auth.myInfo.changePasswordFailed', {
          message: response.data.message,
        }),
      );
    }
  }

  async function withdrawMembership() {
    const isConfirmed = confirm(t('auth.myInfo.withdrawConfirm'));

    if (isConfirmed) {
      try {
        await PoPoAxios.delete('/user/me');
        alert(t('auth.myInfo.withdrawSuccess'));
        router.push('/');
      } catch (err: any) {
        const response = err.response;
        alert(
          t('auth.myInfo.withdrawFailed', {
            message: response?.data?.message || t('common.errorOccurred'),
          }),
        );
      }
    }
  }

  return (
    <Layout>
      <Container
        style={{
          padding: '40px',
          margin: '2em 0 4em',
          backgroundColor: '#eeeeee',
          borderRadius: '8px',
        }}
      >
        <h2>{t('nav.myInfo')}</h2>
        <Segment.Group>
          <Segment>
            <h4>email</h4>
            <Container>{myInfo.email}</Container>
          </Segment>

          <Segment>
            <h4>{t('auth.myInfo.changePassword')}</h4>
            <Form>
              <Form.Group style={{ marginBottom: '8px' }}>
                <Form.Input
                  required
                  type="password"
                  width={8}
                  label="Password"
                  placeholder={t('auth.register.passwordPlaceholder')}
                  onChange={(e) => setPW(e.target.value)}
                  error={
                    isPasswordInvalid
                      ? t('auth.register.passwordLengthError')
                      : null
                  }
                />

                <Form.Input
                  required
                  type="password"
                  width={8}
                  label={t('auth.register.passwordConfirm')}
                  onChange={(e) => setPwAgain(e.target.value)}
                  error={
                    isPasswordAgainInvalid
                      ? t('auth.register.passwordMismatch')
                      : null
                  }
                />
              </Form.Group>
              <Form.Button primary size="mini" onClick={submitNewPassword}>
                {t('auth.myInfo.changePassword')}
              </Form.Button>
            </Form>
          </Segment>

          <Segment>
            <h4>{t('auth.register.name')}</h4>
            <Container>{myInfo.name}</Container>
          </Segment>

          <Segment>
            <h4>{t('auth.register.userType')}</h4>
            <Container>{myInfo.userType}</Container>
          </Segment>

          <Segment>
            <h4>{t('auth.myInfo.joinedAt')}</h4>
            <Container>
              {moment(myInfo.createdAt).format('YYYY.MM.DD HH:mm')}
            </Container>
          </Segment>

          <Segment>
            <h4>{t('auth.myInfo.withdraw')}</h4>
            <Container>
              <Form.Button
                negative
                size="mini"
                onClick={withdrawMembership}
                style={{ marginTop: '10px' }}
              >
                {t('auth.myInfo.withdraw')}
              </Form.Button>
            </Container>
          </Segment>
        </Segment.Group>
      </Container>
    </Layout>
  );
};

export default MyInfoPage;

export const getStaticProps: GetStaticProps = async ({ locale }) => ({
  props: { ...(await getI18nProps(locale)) },
});
