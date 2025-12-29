import React from 'react';
import { GetServerSideProps } from 'next';
import styled from 'styled-components';
import { Image } from 'semantic-ui-react';

import Layout from '@/components/layout';
import { PoPoAxios } from '@/lib/axios.instance';
import { IStudentAssociationIntroduce } from '@/types/introduce.interface';

const StudentAssociationIndexPage: React.FunctionComponent<{
  studentAssociationList: IStudentAssociationIntroduce[];
}> = ({ studentAssociationList }) => {
  return (
    <Layout>
      <IntroduceGrid>
        {studentAssociationList.map((intro) => (
          <div key={intro.uuid}>
            <Image
              centered
              size="small"
              href={`/student_association/introduce/${intro.name}`}
              src={
                intro.imageUrl ??
                'https://react.semantic-ui.com/images/wireframe/image.png'
              }
              alt={`${intro.name}_logo`}
            />
            <StudentAssociationName>{intro.name}</StudentAssociationName>
          </div>
        ))}
      </IntroduceGrid>
    </Layout>
  );
};

export default StudentAssociationIndexPage;

export const getServerSideProps: GetServerSideProps = async () => {
  const res = await PoPoAxios.get<IStudentAssociationIntroduce[]>(
    'introduce/student_association',
  );
  const studentAssociationList = res.data;

  return {
    props: { studentAssociationList },
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

const StudentAssociationName = styled.h3`
  word-break: keep-all;
`;
