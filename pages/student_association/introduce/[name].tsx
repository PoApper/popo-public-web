import { GetServerSideProps } from 'next';
import React from 'next/router';
import { Image } from 'semantic-ui-react';

import Layout from '@/components/layout';
import IconLink from '@/components/common/icon.link';
import { IStudentAssociationIntroduce } from '@/types/introduce.interface';
import { PoPoAxios } from '@/lib/axios.instance';

const StudentAssociationSingleIntroducePage: React.FunctionComponent<{
  name: string;
  studentAssociationInfo: IStudentAssociationIntroduce;
}> = ({ name, studentAssociationInfo }) => {
  return (
    <Layout>
      <div style={{ padding: 8 }}>
        <div style={{ marginBottom: 4 }}>
          <Image
            size="small"
            src={
              studentAssociationInfo.imageUrl && studentAssociationInfo.imageUrl.trim() !== ""
                ? studentAssociationInfo.imageUrl
                : "https://react.semantic-ui.com/images/wireframe/image.png"
            }
            alt={`${name}_logo`}
          />
        </div>

        <h1 style={{ margin: '0' }}>{name}</h1>
        <h2 style={{ color: 'grey', marginTop: 0 }}>{studentAssociationInfo.shortDesc}</h2>
        
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
        <div style={{ fontSize: 16, margin: '12px 0' }}>
          {studentAssociationInfo.content}
        </div>
        <div>
          {studentAssociationInfo.location?.trim() && (
            <p>
              <b>사무실 위치</b>: {studentAssociationInfo.location}
            </p>
          )}
          {studentAssociationInfo.office?.trim() && (
            <p>
              <b>협력 행정팀</b>: {studentAssociationInfo.office}
            </p>
          )}
          <p>
            <b>대표자</b>: {studentAssociationInfo.representative} (
            {studentAssociationInfo.contact})
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
    props: { name, studentAssociationInfo },
  };
};
