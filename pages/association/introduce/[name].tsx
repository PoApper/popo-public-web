import { GetServerSideProps } from 'next';
import React from 'next/router';
import { Image } from 'semantic-ui-react';

import Layout from '@/components/layout';
import IconLink from '@/components/common/icon.link';
import MarkdownView from '@/components/common/markdown.view';
import { IAssociationIntroduce } from '@/types/introduce.interface';
import { PoPoAxios } from '@/lib/axios.instance';

const AssociationSingleIntroducePage: React.FunctionComponent<{
  name: string;
  associationInfo: IAssociationIntroduce;
}> = ({ name, associationInfo }) => {
  return (
    <Layout>
      <div style={{ padding: 8 }}>
        {associationInfo.bannerUrl?.trim() && (
          <div
            style={{
              width: '100%',
              height: '240px',
              maxHeight: '35vh',
              borderRadius: '8px',
              overflow: 'hidden',
              marginBottom: '16px',
              backgroundColor: '#f1f3f5',
            }}
          >
            <img
              src={associationInfo.bannerUrl}
              alt={`${name}_banner`}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                display: 'block',
              }}
            />
          </div>
        )}
        <div style={{ marginBottom: 4 }}>
          <Image
            size="small"
            src={
              associationInfo.imageUrl ??
              'https://react.semantic-ui.com/images/wireframe/image.png'
            }
            alt={`${name}_logo`}
          />
        </div>
        <h1 style={{ margin: '0' }}>{name}</h1>
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
        <div style={{ margin: '16px 0' }}>
          <MarkdownView content={associationInfo.content} />
        </div>
        <div>
          <p>
            <b>사무실 위치</b>: {associationInfo.location}
          </p>
          <p>
            <b>대표자</b>: {associationInfo.representative}(
            {associationInfo.contact})
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
    props: { name, associationInfo },
  };
};
