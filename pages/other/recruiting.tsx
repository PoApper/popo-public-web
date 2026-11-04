import styled from 'styled-components';
import { Container, Icon, Popup, Image } from 'semantic-ui-react';
import { GetStaticProps } from 'next';
import { Trans, useTranslation } from 'next-i18next/pages';
import Layout from '@/components/layout';
import { getI18nProps } from '@/lib/i18n';

const RecruitingPage = () => {
  const { t } = useTranslation('common');

  return (
    <Layout>
      <div style={{ background: '#eeeeee', borderRadius: '0.4em' }}>
        <Container style={{ padding: '3vh' }}>
          <h1>
            <span style={{ fontFamily: 'Caveat', marginRight: 3 }}>POPO</span>{' '}
            {t('recruiting.title')}
          </h1>
          <p>{t('recruiting.p1')}</p>
          <p>{t('recruiting.p2')}</p>
          <p>{t('recruiting.p3')}</p>
          <p>
            <Trans
              i18nKey="recruiting.p4"
              components={{ strong: <strong /> }}
            />
          </p>
          <p>{t('recruiting.p5')}</p>
          <ol>
            <li>{t('recruiting.li1')}</li>
            <li>{t('recruiting.li2')}</li>
            <li>{t('recruiting.li3')}</li>
          </ol>
          <p>
            {t('recruiting.contactLead')}
            <a href={'https://github.com/hegelty'}>
              <Icon name={'github'} />
            </a>
            <Popup
              content={'iamsun@postech.ac.kr'}
              trigger={<Icon name={'mail'} />}
            />
          </p>
          <p>
            {t('recruiting.prevLead1')}
            <a href={'https://github.com/khkim6040'}>
              <Icon name={'github'} />
            </a>
            <Popup
              content={'khkim6040@postech.ac.kr'}
              trigger={<Icon name={'mail'} />}
            />
          </p>
          <p>
            {t('recruiting.prevLead2')}
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
            <div
              style={{
                display: 'flex',
                gap: 12,
                marginBottom: 12,
                flexWrap: 'wrap',
                justifyContent: 'center',
              }}
            >
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
            <div
              style={{
                display: 'flex',
                gap: 12,
                flexWrap: 'wrap',
                justifyContent: 'center',
              }}
            >
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

export const getStaticProps: GetStaticProps = async ({ locale }) => ({
  props: { ...(await getI18nProps(locale)) },
});

const FrameWorkDiv = styled.div`
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
`;
