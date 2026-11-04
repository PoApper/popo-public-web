import { getLocalizedField } from '@/lib/locale';
import { useTranslation } from 'next-i18next/pages';
import React from 'next/router';
import Link from 'next/link';
import { Image } from 'semantic-ui-react';

import Layout from '@/components/layout';
import { PoPoAxios } from '@/lib/axios.instance';
import { getI18nProps } from '@/lib/i18n';
import { GetServerSideProps } from 'next';
import { IClubIntroduce } from '@/types/introduce.interface';
import styled from 'styled-components';

const ClubTypeIndexPage: React.FunctionComponent<{
  clubType: string;
  clubList: IClubIntroduce[];
}> = ({ clubType, clubList }) => {
  const { i18n } = useTranslation('common');
  return (
    <Layout>
      <IntroduceGrid>
        {clubList.map((clubInfo) => (
          <div key={clubInfo.uuid}>
            <Link
              href={`/club/introduce/${clubType}/${encodeURIComponent(clubInfo.name)}`}
            >
              <Image
                centered
                size="small"
                src={
                  clubInfo.imageUrl ??
                  'https://react.semantic-ui.com/images/wireframe/image.png'
                }
                alt={`${getLocalizedField(clubInfo, 'name', i18n.language)}_logo`}
              />
            </Link>
            <h3 style={{ margin: '5px 0 0' }}>
              {getLocalizedField(clubInfo, 'name', i18n.language)}
            </h3>
            <p style={{ color: 'gray' }}>
              {getLocalizedField(clubInfo, 'shortDesc', i18n.language)}
            </p>
          </div>
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
    props: {
      clubType,
      clubList,
      ...(await getI18nProps(context.locale)),
    },
  };
};

const IntroduceGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  text-align: center;
  gap: 2rem;

  > div {
    min-width: 0;
    overflow-wrap: anywhere;
  }

  img {
    width: 150px;
    height: 150px;
    object-fit: contain;
    max-width: 100%;
  }

  // mobile screen
  @media only screen and (max-width: 768px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
`;
