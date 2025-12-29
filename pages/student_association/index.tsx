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
        {studentAssociationList.map((studentAssociationInfo) => (
          <div key={studentAssociationInfo.uuid}>
            <Image
              centered
              size="small"
              href={`/student_association/introduce/${studentAssociationInfo.name}`}
              src={
                studentAssociationInfo.imageUrl && studentAssociationInfo.imageUrl.trim() !== "" 
                ? studentAssociationInfo.imageUrl
                : 'https://react.semantic-ui.com/images/wireframe/image.png'
              }
              alt={`${studentAssociationInfo.name}_logo`}
            />
            <h3 style={{ margin: '5px 0 0' }}>{studentAssociationInfo.name}</h3>
            <p style={{ color: 'gray' }}>{studentAssociationInfo.shortDesc}</p>
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
