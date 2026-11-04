import { Container, Form, Message } from 'semantic-ui-react';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { GetStaticProps } from 'next';
import { Trans, useTranslation } from 'next-i18next/pages';

import Layout from '@/components/layout';
import { PoPoAxios } from '@/lib/axios.instance';
import { getI18nProps } from '@/lib/i18n';

const RegisterPage = () => {
  const router = useRouter();
  const { t } = useTranslation('common');

  const [email, setEmail] = useState<string>('');
  const [password, setPW] = useState<string>('');
  const [passwordAgain, setPwAgain] = useState<string>('');
  const [name, setName] = useState<string>('');
  const [userType, setUserType] = useState<string>('');

  const userTypeOptions = [
    {
      key: 'STUDENT',
      text: t('auth.register.userTypeStudent'),
      value: 'STUDENT',
    },
    { key: 'STAFF', text: t('auth.register.userTypeStaff'), value: 'FACULTY' },
    { key: 'OTHERS', text: 'OTHERS', value: 'OTHERS' },
  ];

  useEffect(() => {
    PoPoAxios.get('/auth/verifyToken')
      .then(() => {
        alert(t('common.alreadyLoggedIn'));
        router.push('/');
      })
      .catch(() => {});
  }, [router, t]);

  const isNotValidEmail: boolean =
    email.length == 0 ||
    !RegExp(/^(?=.*[a-zA-z])[a-zA-Z0-9]{4,20}@postech.ac.kr$/).test(email);
  const isNotValidPassword: boolean =
    password.length == 0 || !RegExp(/^.{8,64}$/).test(password);
  const isNotValidPasswordAgain: boolean =
    passwordAgain.length == 0 || password !== passwordAgain;

  async function handleRegister() {
    if (isNotValidEmail || isNotValidPassword || isNotValidPasswordAgain) {
      alert(t('auth.register.invalidValues'));
      console.log(isNotValidEmail, isNotValidPassword, isNotValidPasswordAgain);
      return;
    }

    const body = {
      email: email,
      password: password,
      name: name,
      userType: userType,
    };

    PoPoAxios.post('/auth/signIn', body)
      .then(() => {
        alert(t('auth.register.success'));
        router.push('/auth/login');
      })
      .catch((err) => {
        const response = err.response;
        alert(t('auth.register.failed', { message: response.data.message }));
      });
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
        <Form autoComplete="off">
          <Form.Input
            required
            label={'email'}
            placeholder={t('auth.register.emailPlaceholder')}
            onChange={(e) => setEmail(e.target.value)}
            error={isNotValidEmail ? t('auth.register.invalidEmail') : null}
          />
          <p>{t('auth.register.emailVerifyHint')}</p>

          <Form.Group widths={'equal'}>
            <Form.Input
              required
              type={'password'}
              label={'Password'}
              placeholder={t('auth.register.passwordPlaceholder')}
              onChange={(e) => setPW(e.target.value)}
              error={
                isNotValidPassword
                  ? t('auth.register.passwordLengthError')
                  : null
              }
            />
            <Form.Input
              required
              type={'password'}
              label={t('auth.register.passwordConfirm')}
              placeholder={t('auth.register.passwordPlaceholder')}
              onChange={(e) => setPwAgain(e.target.value)}
              error={
                isNotValidPasswordAgain
                  ? t('auth.register.passwordMismatch')
                  : null
              }
            />
          </Form.Group>

          <Form.Input
            required
            label={t('auth.register.name')}
            placeholder={t('auth.register.namePlaceholder')}
            onChange={(e) => setName(e.target.value)}
          />

          <Form.Select
            required
            label={t('auth.register.userType')}
            placeholder={t('auth.register.userTypePlaceholder')}
            options={userTypeOptions}
            onChange={(_, { value }) => {
              // @ts-ignore
              setUserType(value);
            }}
          />

          {userType && userType !== 'STUDENT' ? (
            <Message color="yellow">
              <Message.Header>
                {t('auth.register.userTypeWarningHeader')}
              </Message.Header>
              <p>{t('auth.register.userTypeWarningBody')}</p>
            </Message>
          ) : null}

          <Form.Checkbox
            label={
              <label>
                <Trans
                  i18nKey="auth.register.privacyAgree"
                  components={[
                    <Link
                      key="privacy"
                      href="/other/privacy-policy"
                      passHref
                    />,
                  ]}
                />
              </label>
            }
          />

          <Form.Button primary onClick={handleRegister}>
            {t('auth.register.submit')}
          </Form.Button>
        </Form>
      </Container>
    </Layout>
  );
};

export default RegisterPage;

export const getStaticProps: GetStaticProps = async ({ locale }) => ({
  props: { ...(await getI18nProps(locale)) },
});
