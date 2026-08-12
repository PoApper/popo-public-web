import React from 'react';
import { Image } from 'semantic-ui-react';

import Layout from '@/components/layout';
import IconLink from '@/components/common/icon.link';

const BenefitsIndexPage: React.FunctionComponent = () => {
  return (
    <Layout>
      <div style={{ padding: '24px 16px', maxWidth: 800 }}>
        <h2 style={{ marginBottom: 16 }}>총학생회 제휴 업체 소개</h2>
        <p style={{ fontSize: 16, marginBottom: 16, lineHeight: 1.6 }}>
          총학생회 제휴업체는 postech_stu 인스타그램을 참고해주세요.
        </p>
        <div style={{ marginTop: 16 }}>
          <IconLink link="https://www.instagram.com/postech_stu/">
            <Image
              src="https://img.shields.io/badge/Instagram-E4405F?style=for-the-badge&logo=instagram&logoColor=white"
              alt="instagram"
            />
          </IconLink>
        </div>
      </div>
    </Layout>
  );
};

export default BenefitsIndexPage;
