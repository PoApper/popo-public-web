import { Container, Form, Message } from 'semantic-ui-react';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';

import Layout from '@/components/layout';
import { PoPoAxios } from '@/lib/axios.instance';

const userTypeOptions = [
  { key: 'STUDENT', text: '학생 (학부/대학원)', value: 'STUDENT' },
  { key: 'STAFF', text: '교직원', value: 'FACULTY' },
  { key: 'OTHERS', text: 'OTHERS', value: 'OTHERS' },
];

const RegisterPage = () => {
  const router = useRouter();

  const [email, setEmail] = useState<string>('');
  const [password, setPW] = useState<string>('');
  const [passwordAgain, setPwAgain] = useState<string>('');
  const [name, setName] = useState<string>('');
  const [userType, setUserType] = useState<string>('');

  useEffect(() => {
    PoPoAxios.get('/auth/verifyToken')
      .then(() => {
        alert('이미 로그인되었습니다.');
        router.push('/');
      })
      .catch(() => {});
  }, [router]);

  const isNotValidEmail: boolean =
    email.length == 0 ||
    !RegExp(/^(?=.*[a-zA-z])[a-zA-Z0-9]{4,20}@postech.ac.kr$/).test(email);
  const isNotValidPassword: boolean =
    password.length == 0 || !RegExp(/^.{8,64}$/).test(password);
  const isNotValidPasswordAgain: boolean =
    passwordAgain.length == 0 || password !== passwordAgain;

  async function handleRegister() {
    if (isNotValidEmail || isNotValidPassword || isNotValidPasswordAgain) {
      alert('유효한 값을 입력해주세요! 😱');
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
        alert(
          '회원가입에 성공했습니다! 😁\nPOPO 가입 메일을 확인해주세요! 📧\n(1분 정도 지연될 수 있습니다.)',
        );
        router.push('/auth/login');
      })
      .catch((err) => {
        const response = err.response;
        alert(`회원가입에 실패했습니다. 😢\n"${response.data.message}"`);
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
            placeholder={'POSTECH Mail만 가입 가능합니다.'}
            onChange={(e) => setEmail(e.target.value)}
            error={isNotValidEmail ? '유효하지 않은 이메일입니다.' : null}
          />
          <p>이 이메일로 인증 메일이 발송됩니다!</p>

          <Form.Group widths={'equal'}>
            <Form.Input
              required
              type={'password'}
              label={'Password'}
              placeholder={'8자리 이상 64자리 이하 (특수문자 허용)'}
              onChange={(e) => setPW(e.target.value)}
              error={
                isNotValidPassword ? '비밀번호는 8~64자 사이여야 합니다.' : null
              }
            />
            <Form.Input
              required
              type={'password'}
              label={'Password 확인'}
              placeholder={'8자리 이상 64자리 이하 (특수문자 허용)'}
              onChange={(e) => setPwAgain(e.target.value)}
              error={
                isNotValidPasswordAgain ? '비밀번호가 일치하지 않습니다.' : null
              }
            />
          </Form.Group>

          <Form.Input
            required
            label={'이름'}
            placeholder={'예약에 표시될 한글 실명'}
            onChange={(e) => setName(e.target.value)}
          />

          <Form.Select
            required
            label={'유저 타입'}
            placeholder={'유저 타입을 선택하세요.'}
            options={userTypeOptions}
            onChange={(_, { value }) => {
              // @ts-ignore
              setUserType(value);
            }}
          />

          {userType && userType !== 'STUDENT' ? (
            <Message color="yellow">
              <Message.Header>적절한 유저 타입을 선택했나요?</Message.Header>
              <p>
                유저 정보가 올바르지 않으면 서비스 이용에 불이익이 있을 수
                있습니다.
              </p>
            </Message>
          ) : null}

          <Form.Checkbox
            label={
              <label>
                <Link href={'/other/privacy-policy'}>개인정보처리방침</Link>에
                동의합니다.
              </label>
            }
          />

          <Form.Button primary onClick={handleRegister}>
            가입하기
          </Form.Button>
        </Form>
      </Container>
    </Layout>
  );
};

export default RegisterPage;
