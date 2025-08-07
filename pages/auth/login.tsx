import { Button, Container, Form, List, Message } from 'semantic-ui-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

import Layout from '@/components/layout';
import { PoPoAxios } from '@/lib/axios.instance';

const LoginPage = () => {
  const router = useRouter();

  const [email, setEmail] = useState<string>('');
  const [password, setPW] = useState<string>('');

  useEffect(() => {
    PoPoAxios.get('/auth/verifyToken')
      .then(() => {
        alert('이미 로그인되었습니다.');
        router.push('/');
      })
      .catch(() => {});
  }, [router]);

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
          `⚠ 등록되지 않은 Email/PW 입니다. ⚠\n"${response.data.message}"`,
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
        <Message>POPO 가입 때 사용한 email을 통해 로그인해주세요.</Message>

        <Form>
          <Form.Input
            label={'Email'}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Form.Input
            label={'비밀번호'}
            type={'password'}
            onChange={(e) => setPW(e.target.value)}
          />
          <Button primary onClick={handleLogin}>
            로그인
          </Button>
        </Form>

        <List horizontal divided link size="small">
          <List.Item>
            <Link href={'/auth/password/reset'} passHref>
              비밀번호 찾기
            </Link>
          </List.Item>
          <List.Item>
            <Link href={'/auth/register'} passHref>
              회원가입
            </Link>
          </List.Item>
        </List>
      </Container>
    </Layout>
  );
};

export default LoginPage;
