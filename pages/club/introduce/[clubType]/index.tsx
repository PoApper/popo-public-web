import React from 'next/router';
import { Container, Image } from 'semantic-ui-react';

import Layout from '@/components/layout';
import { PoPoAxios } from '@/lib/axios.instance';
import { GetServerSideProps } from 'next';
import { IClubIntroduce } from '@/types/introduce.interface';
import styled from 'styled-components';

const ClubTypeIndexPage: React.FunctionComponent<{
  clubType: string;
  clubList: IClubIntroduce[];
}> = ({ clubType, clubList }) => {
  return (
    <Layout>
      <IntroduceGrid>
        {clubList.map((clubInfo) => (
          <Container
            key={clubInfo.uuid}
            style={{ width: '12em', lineHeight: '12em' }}
          >
            <Image
              centered
              size="small"
              href={`/club/introduce/${clubType}/${clubInfo.name}`}
              src={
                clubInfo.imageUrl ??
                'https://react.semantic-ui.com/images/wireframe/image.png'
              }
              alt={`${clubInfo.name}_logo`}
            />
            <h3 style={{ margin: '5px 0 0' }}>{clubInfo.name}</h3>
            <p style={{ color: 'gray' }}>{clubInfo.shortDesc}</p>
          </Container>
        ))}
      </IntroduceGrid>
    </Layout>
  );
};

export default ClubTypeIndexPage;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const clubType = context.query['clubType'] as string;

  const res = await PoPoAxios.get<IClubIntroduce[]>(
    `/introduce/club/clubType/${clubType}`,
  );
  const clubList = res.data;

  return {
    props: { clubType, clubList },
  };
};

const IntroduceGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  text-align: center;
  gap: 2rem;

  // mobile screen
  @media only screen and (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }
`;
