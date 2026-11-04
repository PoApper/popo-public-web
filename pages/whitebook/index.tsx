import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { GetStaticProps } from 'next';
import { useTranslation } from 'next-i18next/pages';

import Layout from '@/components/layout';
import { PoPoAxios } from '@/lib/axios.instance';
import { getI18nProps } from '@/lib/i18n';

const WhiteBookIndexPage = () => {
  const { t } = useTranslation('common');
  const [whitebookList, setWhitebookList] = useState([]);

  useEffect(() => {
    PoPoAxios.get('/auth/verifyToken')
      .then(() => {
        PoPoAxios.get('/whitebook/with-login?orderBy=clickCount')
          .then((res) => setWhitebookList(res.data))
          .catch(() => console.log('생활백서를 불러오는 데 실패했습니다.'));
      })
      .catch(() => {
        PoPoAxios.get('/whitebook?orderBy=clickCount')
          .then((res) => setWhitebookList(res.data))
          .catch(() => console.log('생활백서를 불러오는 데 실패했습니다.'));
      });
  }, []);

  function handleLinkClick(uuid: string) {
    PoPoAxios.patch(`/whitebook/click/${uuid}`).catch(() =>
      console.log('조회수 API 호출에 실패했습니다.'),
    );
  }

  return (
    <Layout>
      <h1>{t('whitebook.title')}</h1>
      <p style={{ fontSize: '18px', marginBottom: '2rem' }}>
        {t('whitebook.subtitle')} <br />
        {t('whitebook.kakaoHint')}
      </p>
      <CardDiv>
        {whitebookList.map((card: any) => {
          return (
            <Card key={card.uuid}>
              <h2>
                <a
                  target="_blank"
                  rel="noreferrer"
                  href={card.link}
                  onClick={() => handleLinkClick(card.uuid)}
                >
                  {card.title}
                </a>
              </h2>
              <p>{card.content}</p>
            </Card>
          );
        })}
      </CardDiv>
    </Layout>
  );
};

export default WhiteBookIndexPage;

export const getStaticProps: GetStaticProps = async ({ locale }) => ({
  props: { ...(await getI18nProps(locale)) },
});

const CardDiv = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-gap: 2rem;

  @media only screen and (max-width: 768px) {
    grid-template-columns: repeat(1, 1fr);
  }
`;

const Card = styled.div`
  border-radius: 14px;
  background-color: #fff;
  box-shadow: 4px 12px 30px 6px rgb(0 0 0 / 7%);
  padding: 25px 24px 25px;

  &:hover {
    transform: translateY(-5px);
  }

  p {
    font-size: 16px;
  }
`;
