import { Container, Form, Segment } from 'semantic-ui-react';
import Layout from '@/components/layout';
import { useEffect, useState } from 'react';
import moment from 'moment';
import { useRouter } from 'next/router';
import { PoPoAxios } from '@/lib/axios.instance';

interface MyInformation {
  email: string;
  name: string;
  userType: string;
  createdAt: Date;
}

const MyInfoPage = () => {
  const router = useRouter();

  const [myInfo, setMyInfo] = useState<MyInformation>({
    email: '',
    name: '',
    userType: '',
    createdAt: new Date(),
  });
  const [password, setPW] = useState<string>('');
  const [passwordAgain, setPwAgain] = useState<string>('');

  const isValidPassword: boolean =
    password.length > 0 && !RegExp(/^.{8,64}$/).test(password);
  const isValidPasswordAgain: boolean =
    passwordAgain.length > 0 && password !== passwordAgain;

  useEffect(() => {
    PoPoAxios.get('/auth/myInfo')
      .then((res) => setMyInfo(res.data))
      .catch(() => {
        alert('로그인 후 조회할 수 있습니다.');
        router.push('/auth/login');
      });
  }, [router]);

  async function submitNewPassword() {
    try {
      await PoPoAxios.post('/auth/password/update', {
        password: password,
      });
      alert('비밀번호 변경에 성공했습니다!');
      window.location.reload();
    } catch (err: any) {
      const response = err.response;
      alert(`비밀번호 업데이트에 실패했습니다. 😢\n"${response.data.message}"`);
    }
  }

  async function withdrawMembership() {
    const isConfirmed = confirm(
      '회원 탈퇴 시 모든 정보가 삭제되며 복구되지 않습니다.',
    );

    if (isConfirmed) {
      try {
        await PoPoAxios.delete('/user/me');
        alert('회원 탈퇴가 완료되었습니다.');
        router.push('/');
      } catch (err: any) {
        const response = err.response;
        alert(
          `회원 탈퇴에 실패했습니다. 😢\n"${response?.data?.message || '오류가 발생했습니다.'}"`,
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
        <h2>내 정보</h2>
        <Segment.Group>
          <Segment>
            <h4>email</h4>
            <Container>{myInfo.email}</Container>
          </Segment>

          <Segment>
            <h4>비밀번호 변경</h4>
            <Form>
              <Form.Group style={{ marginBottom: '8px' }}>
                <Form.Input
                  required
                  type="password"
                  width={8}
                  label="Password"
                  placeholder="8자리 이상 64자리 이하"
                  onChange={(e) => setPW(e.target.value)}
                  error={isValidPassword ? '비밀번호는 8~64자 사이여야 합니다.' : null}
                />

                <Form.Input
                  required
                  type="password"
                  width={8}
                  label="Password 확인"
                  onChange={(e) => setPwAgain(e.target.value)}
                  error={
                    isValidPasswordAgain
                      ? '비밀번호가 일치하지 않습니다.'
                      : null
                  }
                />
              </Form.Group>
              <Form.Button primary size="mini" onClick={submitNewPassword}>
                비밀번호 변경
              </Form.Button>
            </Form>
          </Segment>

          <Segment>
            <h4>이름</h4>
            <Container>{myInfo.name}</Container>
          </Segment>

          <Segment>
            <h4>유저 타입</h4>
            <Container>{myInfo.userType}</Container>
          </Segment>

          <Segment>
            <h4>가입일</h4>
            <Container>
              {moment(myInfo.createdAt).format('YYYY.MM.DD HH:mm')}
            </Container>
          </Segment>

          <Segment>
            <h4>회원 탈퇴</h4>
            <Container>
              <Form.Button
                negative
                size="mini"
                onClick={withdrawMembership}
                style={{ marginTop: '10px' }}
              >
                회원 탈퇴
              </Form.Button>
            </Container>
          </Segment>
        </Segment.Group>
      </Container>
    </Layout>
  );
};

export default MyInfoPage;
