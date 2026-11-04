import { getLocalizedField } from '@/lib/locale';
import { GetServerSideProps } from 'next';
import React from 'next/router';
import { Image } from 'semantic-ui-react';
import { useTranslation } from 'next-i18next/pages';

import Layout from '@/components/layout';
import IconLink from '@/components/common/icon.link';
import { IStudentAssociationIntroduce } from '@/types/introduce.interface';
import { PoPoAxios } from '@/lib/axios.instance';
import { getI18nProps } from '@/lib/i18n';

const StudentAssociationSingleIntroducePage: React.FunctionComponent<{
  name: string;
  studentAssociationInfo: IStudentAssociationIntroduce;
}> = ({ studentAssociationInfo }) => {
  const { t, i18n } = useTranslation('common');

  return (
    <Layout>
      <div style={{ padding: 8 }}>
        <div style={{ marginBottom: 4 }}>
          <Image
            size="small"
            src={
              studentAssociationInfo.imageUrl &&
              studentAssociationInfo.imageUrl.trim() !== ''
                ? studentAssociationInfo.imageUrl
                : 'https://react.semantic-ui.com/images/wireframe/image.png'
            }
            alt={`${getLocalizedField(studentAssociationInfo, 'name', i18n.language)}_logo`}
          />
        </div>
        <h1 style={{ margin: '0' }}>
          {getLocalizedField(studentAssociationInfo, 'name', i18n.language)}
        </h1>
        <h2 style={{ color: 'grey', marginTop: 0 }}>
          {getLocalizedField(
            studentAssociationInfo,
            'shortDesc',
            i18n.language,
          )}
        </h2>
        <div style={{ fontSize: 18 }}>
          <IconLink link={studentAssociationInfo.homepageUrl}>
            <Image
              src={
                'https://img.shields.io/badge/website-000000?style=for-the-badge'
              }
              alt={'homepage'}
            />
          </IconLink>
          <IconLink link={studentAssociationInfo.facebookUrl}>
            <Image
              src={
                'https://img.shields.io/badge/Facebook-1877F2?style=for-the-badge&logo=facebook&logoColor=white'
              }
              alt={'facebook'}
            />
          </IconLink>
          <IconLink link={studentAssociationInfo.instagramUrl}>
            <Image
              src={
                'https://img.shields.io/badge/Instagram-E4405F?style=for-the-badge&logo=instagram&logoColor=white'
              }
              alt={'instagram'}
            />
          </IconLink>
          <IconLink link={studentAssociationInfo.youtubeUrl}>
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
          {getLocalizedField(studentAssociationInfo, 'content', i18n.language)}
        </div>
        <div>
          {getLocalizedField(
            studentAssociationInfo,
            'location',
            i18n.language,
          ).trim() && (
            <p>
              <b>{t('association.officeLocation')}</b>:{' '}
              {getLocalizedField(
                studentAssociationInfo,
                'location',
                i18n.language,
              )}
            </p>
          )}
          {getLocalizedField(
            studentAssociationInfo,
            'office',
            i18n.language,
          ).trim() && (
            <p>
              <b>{t('association.adminTeam')}</b>:{' '}
              {getLocalizedField(
                studentAssociationInfo,
                'office',
                i18n.language,
              )}
            </p>
          )}
          <p>
            <b>{t('club.representative')}</b>:{' '}
            {getLocalizedField(
              studentAssociationInfo,
              'representative',
              i18n.language,
            )}{' '}
            (
            {getLocalizedField(
              studentAssociationInfo,
              'contact',
              i18n.language,
            )}
            )
          </p>
        </div>
      </div>
    </Layout>
  );
};

export default StudentAssociationSingleIntroducePage;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const name = context.query['name'] as string;

  const res = await PoPoAxios.get<IStudentAssociationIntroduce>(
    `introduce/student_association/name/${name}`,
  );
  const studentAssociationInfo = res.data;

  return {
    props: {
      name,
      studentAssociationInfo,
      ...(await getI18nProps(context.locale)),
    },
  };
};
