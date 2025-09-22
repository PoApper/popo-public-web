import styled from 'styled-components';
import { Container, Icon, Popup, Image } from 'semantic-ui-react';
import Layout from '@/components/layout';

const RecruitingPage = () => {
  return (
    <Layout>
      <div style={{ background: '#eeeeee', borderRadius: '0.4em' }}>
        <Container style={{ padding: '3vh' }}>
          <h1>
            <span style={{ fontFamily: 'Caveat', marginRight: 3 }}>POPO</span>{' '}
            개발자 모집👨‍💻
          </h1>
          <p>
            총학생회가 POPO를 운영한다면, <strong>PoApper</strong>는 POPO 개발과
            유지/보수를 맡고 있습니다. 💪
          </p>
          <p>
            POPO 개발팀은 POSTECH에서 발생하는 데이터가 제대로 활용되지 못하고
            있다고 생각합니다.
          </p>
          <p>
            그리고 POSTECH의 데이터를 수집하는 플랫폼 역시 빈약하다고 느끼고
            있습니다.
          </p>
          <p>
            POPO 개발팀은 적극적으로 개발하고 아이디어를 교환하면서, &nbsp;
            <strong>플랫폼</strong>을 만들고 <strong>데이터</strong>를 축적해
            상상을 <strong>현실</strong>로 구현하는 팀입니다! 🤩
          </p>
          <p>
            그런 플랫폼을 여러분의 손으로 만들고 발전시켜 보세요! 😎 개발의 문은
            언제나 열려있습니다 🔑
          </p>
          <ol>
            <li>
              직접 홈페이지를 개발해보면서, 프론트와 백엔드를 경험해보세요!
            </li>
            <li>선임 POPO 개발자의 도움을 받으며 성장해보세요!</li>
            <li>
              POPO를 통해 축적된 POSTECH 데이터에서 가능성을 발굴해보세요!
            </li>
          </ol>
          <p>
            <strong>Contact Us</strong> : Lead Developer, 김관호(컴공 19)
            <a href={'https://github.com/khkim6040'}>
              <Icon name={'github'} />
            </a>
            <Popup
              content={'khkim6040@postech.ac.kr'}
              trigger={<Icon name={'mail'} />}
            />
          </p>
          <p>
            <strong>Previous Leads</strong> : 하석윤(컴공 18)
            <a href={'https://github.com/BlueHorn07'}>
              <Icon name={'github'} />
            </a>
            <Popup
              content={'hsy4462@postech.ac.kr'}
              trigger={<Icon name={'mail'} />}
            />
          </p>
          <h1 style={{ fontFamily: 'Caveat', textAlign: 'center' }}>
            “Talk is cheap. Show me your code.”
          </h1>
          <FrameWorkDiv>
            <p>
              <strong>Developed With</strong>
            </p>
            <div style={{ display: 'flex', gap: 12, marginBottom: 12 }}>
              <Image
                src={
                  'https://img.shields.io/badge/nestjs-%23E0234E.svg?style=for-the-badge&logo=nestjs&logoColor=white'
                }
                alt={'nestjs'}
              />
              <Image
                src={
                  'https://img.shields.io/badge/Next-black?style=for-the-badge&logo=next.js&logoColor=white'
                }
                alt={'nextjs'}
              />
              <Image
                src={
                  'https://img.shields.io/badge/Semantic%20UI%20React-%2335BDB2.svg?style=for-the-badge&logo=SemanticUIReact&logoColor=white'
                }
                alt={'semantic-ui'}
              />
            </div>
            <div style={{ display: 'flex', gap: 12 }}>
              <Image
                src={
                  'https://img.shields.io/badge/AWS-%23FF9900.svg?style=for-the-badge&logo=amazon-aws&logoColor=white'
                }
                alt={'aws'}
              />
              <Image
                src={
                  'https://img.shields.io/badge/docker-%230db7ed.svg?style=for-the-badge&logo=docker&logoColor=white'
                }
                alt={'docker'}
              />
              <Image
                src={
                  'https://img.shields.io/badge/github actions-333?style=for-the-badge&logo=github actions&logoColor=white'
                }
                alt={'githubactions'}
              />
            </div>
          </FrameWorkDiv>
        </Container>
      </div>
    </Layout>
  );
};

export default RecruitingPage;

const FrameWorkDiv = styled.div`
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
`;
