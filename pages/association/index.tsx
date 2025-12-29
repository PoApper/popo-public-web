import React from 'react';
import { GetServerSideProps } from 'next';
import styled from 'styled-components';
import { Image } from 'semantic-ui-react';

import Layout from '@/components/layout';
import { PoPoAxios } from '@/lib/axios.instance';
import {
  IAssociationIntroduce,
  IAssociationCategory,
} from '@/types/introduce.interface';

interface IGroupedAssociation {
  category: IAssociationCategory;
  associations: IAssociationIntroduce[];
}

const AssociationIndexPage: React.FunctionComponent<{
  associationList: IAssociationIntroduce[];
}> = ({ associationList }) => {
  // 카테고리 ID를 기준으로 그룹화
  const groupedData = associationList.reduce(
    (acc, item) => {
      const catId = item.categoryId;
      if (!acc[catId]) {
        acc[catId] = {
          category: item.category,
          associations: [],
        };
      }
      acc[catId].associations.push(item);
      return acc;
    },
    {} as Record<number, IGroupedAssociation>,
  );

  // 카테고리 ID 순서대로 정렬하여 배열로 변환
  const sortedCategories = Object.values(groupedData).sort(
    (a, b) => a.category.id - b.category.id,
  );

  return (
    <Layout>
      <PageContainer>
        {sortedCategories.map((group) => (
          <CategorySection key={group.category.id}>
            <CategoryHeader>{group.category.displayName}</CategoryHeader>
            <IntroduceGrid>
              {group.associations.map((intro) => (
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
                    style={{
                      width: '150px',
                      height: '150px',
                      objectFit: 'cover',
                      objectPosition: 'center',
                    }}
                  />
                  <AssociationName>{intro.name}</AssociationName>
                </div>
              ))}
            </IntroduceGrid>
          </CategorySection>
        ))}
      </PageContainer>
    </Layout>
  );
};

export default AssociationIndexPage;

export const getServerSideProps: GetServerSideProps = async () => {
  try {
    const res = await PoPoAxios.get<IAssociationIntroduce[]>(
      'introduce/association',
    );
    const associationList = res.data;

    return {
      props: { associationList },
    };
  } catch (e) {
    return {
      props: { associationList: [] },
    };
  }
};

const PageContainer = styled.div`
  padding: 2rem 0;
`;

const CategorySection = styled.section`
  margin-bottom: 4rem;

  &:last-child {
    margin-bottom: 0;
  }
`;

const CategoryHeader = styled.h2`
  font-size: 2rem;
  font-weight: bold;
  margin-bottom: 2rem;
  padding-bottom: 0.5rem;
  border-bottom: 2px solid #eee;
  color: #333;
`;

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
