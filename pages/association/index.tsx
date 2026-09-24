import React from 'react';
import { GetServerSideProps } from 'next';
import styled from 'styled-components';
import { Image } from 'semantic-ui-react';
import { useTranslation } from 'next-i18next/pages';

import Layout from '@/components/layout';
import { PoPoAxios } from '@/lib/axios.instance';
import { getI18nProps } from '@/lib/i18n';
import {
  AssociationType,
  IAssociationIntroduce,
} from '@/types/introduce.interface';

type AssociationTypeKey = 'executive' | 'autonomous' | 'media' | 'specialized';

interface IGroupedAssociation {
  associationType: AssociationTypeKey | 'uncategorized';
  associations: IAssociationIntroduce[];
}

const associationTypeOrder: AssociationTypeKey[] = [
  'executive',
  'autonomous',
  'media',
  'specialized',
];

const associationTypeMap: Record<AssociationType, AssociationTypeKey> = {
  executive: 'executive',
  autonomous: 'autonomous',
  media: 'media',
  specialized: 'specialized',
  집행기구: 'executive',
  자치기구: 'autonomous',
  언론기구: 'media',
  전문기구: 'specialized',
};

const getAssociationType = (
  associationType?: IAssociationIntroduce['associationType'],
): AssociationTypeKey | null => {
  if (!associationType) {
    return null;
  }

  return associationTypeMap[associationType] ?? null;
};

const AssociationIndexPage: React.FunctionComponent<{
  associationList: IAssociationIntroduce[];
}> = ({ associationList }) => {
  const { t } = useTranslation('common');

  // 자치단체 분류를 기준으로 그룹화
  const groupedData = associationList.reduce<
    Record<AssociationTypeKey | 'uncategorized', IGroupedAssociation>
  >(
    (acc, item) => {
      const associationType = getAssociationType(item.associationType);
      const key = associationType ?? 'uncategorized';

      if (!acc[key]) {
        acc[key] = {
          associationType: key,
          associations: [],
        };
      }

      acc[key].associations.push(item);
      return acc;
    },
    {} as Record<AssociationTypeKey | 'uncategorized', IGroupedAssociation>,
  );

  // 원하는 순서대로 정렬하여 배열로 변환
  const sortedCategories = associationTypeOrder
    .map((associationType) => groupedData[associationType])
    .filter((category): category is IGroupedAssociation => Boolean(category));

  if (groupedData.uncategorized && sortedCategories.length > 0) {
    sortedCategories.push(groupedData.uncategorized);
  }

  const introduceItems = (associationItems: IAssociationIntroduce[]) =>
    associationItems.map((intro) => (
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
    ));

  return (
    <Layout>
      {sortedCategories.length > 0 ? (
        <PageContainer>
          {sortedCategories.map((category) => (
            <CategorySection key={category.associationType}>
              <CategoryHeader>
                {t(`association.types.${category.associationType}`)}
              </CategoryHeader>
              <IntroduceGrid>
                {introduceItems(category.associations)}
              </IntroduceGrid>
            </CategorySection>
          ))}
        </PageContainer>
      ) : (
        <IntroduceGrid>{introduceItems(associationList)}</IntroduceGrid>
      )}
    </Layout>
  );
};

export default AssociationIndexPage;

export const getServerSideProps: GetServerSideProps = async (context) => {
  try {
    const res = await PoPoAxios.get<IAssociationIntroduce[]>(
      'introduce/association',
    );
    const associationList = res.data;

    return {
      props: {
        associationList,
        ...(await getI18nProps(context.locale)),
      },
    };
  } catch {
    return {
      props: {
        associationList: [],
        ...(await getI18nProps(context.locale)),
      },
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
