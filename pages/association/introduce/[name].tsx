import { getLocalizedField } from '@/lib/locale';
import { GetServerSideProps } from 'next';
import React from 'next/router';
import { Image } from 'semantic-ui-react';
import { useTranslation } from 'next-i18next/pages';

import Layout from '@/components/layout';
import IconLink from '@/components/common/icon.link';
import { IAssociationIntroduce } from '@/types/introduce.interface';
import { PoPoAxios } from '@/lib/axios.instance';
import { getI18nProps } from '@/lib/i18n';

const AssociationSingleIntroducePage: React.FunctionComponent<{
  name: string;
  associationInfo: IAssociationIntroduce;
}> = ({ associationInfo }) => {
  const { t, i18n } = useTranslation('common');

  return (
    <Layout>
      <div style={{ padding: 8 }}>
        <div style={{ marginBottom: 4 }}>
          <Image
            size="small"
            src={
              associationInfo.imageUrl ??
              'https://react.semantic-ui.com/images/wireframe/image.png'
            }
            alt={`${getLocalizedField(associationInfo, 'name', i18n.language)}_logo`}
          />
        </div>
        <h1 style={{ margin: '0' }}>
          {getLocalizedField(associationInfo, 'name', i18n.language)}
        </h1>
        <div style={{ fontSize: 18 }}>
          <IconLink link={associationInfo.homepageUrl}>
            <Image
              src={
                'https://img.shields.io/badge/website-000000?style=for-the-badge'
              }
              alt={'homepage'}
            />
          </IconLink>
          <IconLink link={associationInfo.facebookUrl}>
            <Image
              src={
                'https://img.shields.io/badge/Facebook-1877F2?style=for-the-badge&logo=facebook&logoColor=white'
              }
              alt={'facebook'}
            />
          </IconLink>
          <IconLink link={associationInfo.instagramUrl}>
            <Image
              src={
                'https://img.shields.io/badge/Instagram-E4405F?style=for-the-badge&logo=instagram&logoColor=white'
              }
              alt={'instagram'}
            />
          </IconLink>
          <IconLink link={associationInfo.youtubeUrl}>
            <Image
              src={
                'https://img.shields.io/badge/Youtube-FF0000?style=for-the-badge&logo=youtube&logoColor=white'
              }
              alt={'youtube'}
            />
          </IconLink>
        </div>{' '}
        <i></i>
        <div style={{ fontSize: 16, margin: '12px 0', whiteSpace: 'pre-line' }}>
          {getLocalizedField(associationInfo, 'content', i18n.language)}
        </div>
        <div>
          <p>
            <b>{t('association.officeLocation')}</b>:{' '}
            {getLocalizedField(associationInfo, 'location', i18n.language)}
          </p>
          <p>
            <b>{t('club.representative')}</b>:{' '}
            {getLocalizedField(
              associationInfo,
              'representative',
              i18n.language,
            )}
            ({getLocalizedField(associationInfo, 'contact', i18n.language)})
          </p>
        </div>
      </div>
    </Layout>
  );
};

export default AssociationSingleIntroducePage;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const name = context.query['name'] as string;

  const res = await PoPoAxios.get<IAssociationIntroduce>(
    `introduce/association/name/${name}`,
  );
  const associationInfo = res.data;

  return {
    props: {
      name,
      associationInfo,
      ...(await getI18nProps(context.locale)),
    },
  };
};
