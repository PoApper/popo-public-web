import { getLocalizedField } from '@/lib/locale';
import { useTranslation } from 'next-i18next/pages';
import React from 'react';
import { GetServerSideProps } from 'next';
import Link from 'next/link';
import styled from 'styled-components';
import { Image } from 'semantic-ui-react';

import Layout from '@/components/layout';
import { PoPoAxios } from '@/lib/axios.instance';
import { getI18nProps } from '@/lib/i18n';
import { IStudentAssociationIntroduce } from '@/types/introduce.interface';

const StudentAssociationIndexPage: React.FunctionComponent<{
  studentAssociationList: IStudentAssociationIntroduce[];
}> = ({ studentAssociationList }) => {
  const { i18n } = useTranslation('common');
  return (
    <Layout>
      <IntroduceGrid>
        {studentAssociationList.map((studentAssociationInfo) => (
          <div key={studentAssociationInfo.uuid}>
            <Link
              href={`/student_association/introduce/${encodeURIComponent(studentAssociationInfo.name)}`}
            >
              <Image
                centered
                size="small"
                src={
                  studentAssociationInfo.imageUrl &&
                  studentAssociationInfo.imageUrl.trim() !== ''
                    ? studentAssociationInfo.imageUrl
                    : 'https://react.semantic-ui.com/images/wireframe/image.png'
                }
                alt={`${getLocalizedField(studentAssociationInfo, 'name', i18n.language)}_logo`}
              />
            </Link>
            <h3 style={{ margin: '5px 0 0' }}>
              {getLocalizedField(studentAssociationInfo, 'name', i18n.language)}
            </h3>
            <p style={{ color: 'gray' }}>
              {getLocalizedField(
                studentAssociationInfo,
                'shortDesc',
                i18n.language,
              )}
            </p>
          </div>
        ))}
      </IntroduceGrid>
    </Layout>
  );
};

export default StudentAssociationIndexPage;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const res = await PoPoAxios.get<IStudentAssociationIntroduce[]>(
    'introduce/student_association',
  );
  const studentAssociationList = res.data;

  return {
    props: {
      studentAssociationList,
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
