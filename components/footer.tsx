import { useEffect, useState } from 'react';
import {
  Container,
  Divider,
  Grid,
  Header,
  Image,
  List,
  Segment,
} from 'semantic-ui-react';
import { PoPoAxios } from '@/lib/axios.instance';

const Footer = () => {
  const [popoCRMEmail, setPOPOCRMEmail] = useState('');
  const [STUEmail, setSTUEmail] = useState('');

  useEffect(() => {
    PoPoAxios.get('/setting').then((res) => {
      setPOPOCRMEmail(res.data.popo_crm_email);
      setSTUEmail(res.data.stu_email);
    });
  }, []);

  return (
    <footer>
      <Segment
        vertical
        style={{
          margin: '0em 0em',
          padding: '2em 0em',
          backgroundColor: 'none',
        }}
      >
        <Container textAlign="center">
          <Grid divided stackable style={{ fontSize: 'small' }}>
            <Grid.Column textAlign="left" width={7}>
              <Header as="h3" content="POSTECH 총학생회" />
              <small>
                <p>77 Cheongam-Ro. Nam-Gu. Pohang. Gyeongbuk. Korea 790-784</p>
                <p>
                  TEL +82-54-279-2621, 2637
                  <br />
                  FAX +82-54-279-2626
                </p>
                <p>
                  E-mail: {STUEmail}
                  <br />
                  POPO 관련 문의: {popoCRMEmail}
                </p>
              </small>
            </Grid.Column>
            <Grid.Column width={4}>
              <Header as="h4" content="Developed by" />
              <Image
                centered
                size={'small'}
                src={'/PoApper_logo.svg'}
                alt={'poapper-logo'}
                href={'https://poapper.club/'}
                target="_blank"
              />
              <List link>
                <List.Item as="a" href="/other/recruiting">
                  개발자 모집
                </List.Item>
              </List>
            </Grid.Column>
            <Grid.Column width={4}>
              <Header as="h4" content="POSTECH" />
              <List link>
                <List.Item
                  as="a"
                  href="https://www.postech.ac.kr/"
                  target="_blank"
                >
                  포항공대 홈페이지
                </List.Item>
                <List.Item
                  as="a"
                  href="https://povis.postech.ac.kr/"
                  target="_blank"
                >
                  POVIS
                </List.Item>
                <List.Item
                  as="a"
                  href="https://hemos.postech.ac.kr/"
                  target="_blank"
                >
                  HEMOS
                </List.Item>
                <List.Item
                  as="a"
                  href="https://library.postech.ac.kr/"
                  target="_blank"
                >
                  박태준 학술정보관
                </List.Item>
              </List>
            </Grid.Column>
          </Grid>

          <Divider section style={{ marginBottom: '1vh' }} />
          <List horizontal divided link size="small">
            <List.Item as="a" href="/other/privacy-policy">
              개인정보처리방침
            </List.Item>
            <List.Item>
              <a
                href={`https://github.com/PoApper/popo-public-web/releases/tag/${process.env.NEXT_PUBLIC_POPO_VERSION}`}
                target="_blank"
                rel="noreferrer"
              >
                popo-{process.env.NEXT_PUBLIC_POPO_VERSION}
              </a>
            </List.Item>
          </List>
        </Container>
      </Segment>
    </footer>
  );
};

export default Footer;
