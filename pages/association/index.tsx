import React from 'react';
import { GetServerSideProps } from 'next';
import styled from 'styled-components';
import { Image } from 'semantic-ui-react';

import Layout from '@/components/layout';
import { PoPoAxios } from '@/lib/axios.instance';
import { IAssociationIntroduce } from '@/types/introduce.interface';

const AssociationIndexPage: React.FunctionComponent<{
  associationList: IAssociationIntroduce[];
}> = ({ associationList }) => {
  return (
    <Layout>
      <IntroduceGrid>
        {associationList.map((intro) => (
          <div key={intro.uuid}>
            <Image
              centered
              size="small"
              href={`/association/introduce/${intro.name}`}
              src={
                intro.imageUrl ??
                'https://react.semantic-ui.com/images/wireframe/image.png'
              }
              alt={`${intro.name}_logo`}
            />
            <AssociationName>{intro.name}</AssociationName>
          </div>
        ))}
      </IntroduceGrid>
    </Layout>
  );
};

export default AssociationIndexPage;

export const getServerSideProps: GetServerSideProps = async () => {
  const res = await PoPoAxios.get<IAssociationIntroduce[]>(
    'introduce/association',
  );
  const associationList = res.data;

  return {
    props: { associationList },
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

const AssociationName = styled.h3`
  word-break: keep-all;
`;
