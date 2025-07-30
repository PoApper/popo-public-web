import { Button, Container, Form, List, Message } from 'semantic-ui-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

import Layout from '@/components/layout';
import { PoPoAxios } from '@/lib/axios.instance';

const PasswordResetPage = () => {
  const router = useRouter();

  const [email, setEmail] = useState<string>('');

  useEffect(() => {
    PoPoAxios.get('/auth/verifyToken')
      .then(() => {
        alert('이미 로그인 되었습니다.');
        router.push('/');
      })
      .catch(() => {});
  }, [router]);

  async function handlePasswordReset() {
    const body = {
      email: email,
    };

    PoPoAxios.post('/auth/password/reset', body)
      .then(() => {
        alert(
          '비빌번호가 초기화 되었습니다. 이메일을 통해 신규 비빌먼호를 확인해주세요.',
        );
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
        <Message>POPO 가입 때 사용한 email을 이용해주세요.</Message>
        <Form>
          <Form.Input
            label={'Email'}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Button primary onClick={handlePasswordReset}>
            비밀번호 초기화
          </Button>
        </Form>

        <List horizontal divided link size="small">
          <List.Item>
            <Link href={'/auth/register'} passHref>
              신규 회원이신가요?
            </Link>
          </List.Item>
        </List>
      </Container>
    </Layout>
  );
};

export default PasswordResetPage;
