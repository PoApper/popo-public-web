import { Container, Header, List } from 'semantic-ui-react';
import Layout from '@/components/layout';

// 새 고지는 public/licenses/에 전문 파일을 추가하고 아래 목록에 등록합니다.
const openSourceLicenses = [
  {
    name: '@rhwp/core',
    description: '한글 문서 뷰어',
    licenseUrl: '/licenses/rhwp.txt',
  },
];

const OpenSourceLicensesPage = () => {
  return (
    <Layout>
      <Container text>
        <Header as="h1">오픈소스 라이선스</Header>
        <p>
          POPO에서 사용하는 오픈소스의 라이선스 및 저작권 고지를 확인할 수
          있습니다.
        </p>
        <List divided relaxed>
          {openSourceLicenses.map((license) => (
            <List.Item key={license.name}>
              <List.Header as="a" href={license.licenseUrl}>
                {license.description} ({license.name})
              </List.Header>
              <List.Description>라이선스 및 저작권 고지 전문</List.Description>
            </List.Item>
          ))}
        </List>
      </Container>
    </Layout>
  );
};

export default OpenSourceLicensesPage;
