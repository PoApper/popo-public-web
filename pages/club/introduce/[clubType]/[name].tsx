import { GetServerSideProps } from 'next';
import React from 'next/router';
import { Image } from 'semantic-ui-react';

import Layout from '@/components/layout';
import IconLink from '@/components/common/icon.link';
import { IClubIntroduce } from '@/types/introduce.interface';
import { PoPoAxios } from '@/lib/axios.instance';
import { getI18nProps } from '@/lib/i18n';
import { useTranslation } from 'next-i18next/pages';

const ClubSingleIntroducePage: React.FunctionComponent<{
  name: string;
  clubInfo: IClubIntroduce;
  recommendations: IClubIntroduce[];
}> = ({ name, clubInfo }) => {
  const { t } = useTranslation('common');

  return (
    <Layout>
      <div style={{ padding: 8 }}>
        <div style={{ marginBottom: 4 }}>
          <Image
            size="small"
            src={
              clubInfo.imageUrl ??
              'https://react.semantic-ui.com/images/wireframe/image.png'
            }
            alt={`${name}_logo`}
          />
        </div>

        <h1 style={{ margin: '0' }}>{name}</h1>
        <h2 style={{ color: 'grey', marginTop: 0 }}>{clubInfo.shortDesc}</h2>

        <div style={{ fontSize: 18 }}>
          <IconLink link={clubInfo.homepageUrl}>
            <Image
              src={
                'https://img.shields.io/badge/website-000000?style=for-the-badge'
              }
              alt={'homepage'}
            />
          </IconLink>
          <IconLink link={clubInfo.facebookUrl}>
            <Image
              src={
                'https://img.shields.io/badge/Facebook-1877F2?style=for-the-badge&logo=facebook&logoColor=white'
              }
              alt={'facebook'}
            />
          </IconLink>
          <IconLink link={clubInfo.instagramUrl}>
            <Image
              src={
                'https://img.shields.io/badge/Instagram-E4405F?style=for-the-badge&logo=instagram&logoColor=white'
              }
              alt={'instagram'}
            />
          </IconLink>
          <IconLink link={clubInfo.youtubeUrl}>
            <Image
              src={
                'https://img.shields.io/badge/Youtube-FF0000?style=for-the-badge&logo=youtube&logoColor=white'
              }
              alt={'youtube'}
            />
          </IconLink>
        </div>

        <div style={{ fontSize: 16, margin: '12px 0' }}>{clubInfo.content}</div>

        <div>
          <p>
            <b>{t('club.roomLocation')}</b>: {clubInfo.location}
          </p>
          <p>
            <b>{t('club.representative')}</b>: {clubInfo.representative}(
            {clubInfo.contact})
          </p>
        </div>
      </div>
    </Layout>
  );
};

export default ClubSingleIntroducePage;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const name = context.query['name'] as string;

  const res = await PoPoAxios.get<IClubIntroduce>(
    `introduce/club/name/${name}`,
  );
  const clubInfo = res.data;

  return {
    props: {
      name,
      clubInfo,
      ...(await getI18nProps(context.locale)),
    },
  };
};
