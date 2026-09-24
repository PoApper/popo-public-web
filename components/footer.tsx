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
import { useTranslation } from 'next-i18next/pages';
import { PoPoAxios } from '@/lib/axios.instance';

const Footer = () => {
  const { t } = useTranslation('common');
  const [popoCRMEmail, setPOPOCRMEmail] = useState('');
  const [STUEmail, setSTUEmail] = useState('');
  const [STUPresidentName, setSTUPresidentName] = useState('');
  const [STUPresidentContact, setSTUPresidentContact] = useState('');
  const [STUTel, setSTUTel] = useState('');
  const [STUFax, setSTUFax] = useState('');

  useEffect(() => {
    PoPoAxios.get('/setting').then((res) => {
      setPOPOCRMEmail(res.data.popoCRMEmail);
      setSTUEmail(res.data.stuEmail);
      setSTUPresidentName(res.data.stuPresidentName);
      setSTUPresidentContact(res.data.stuPresidentContact);
      setSTUTel(res.data.stuTel);
      setSTUFax(res.data.stuFax);
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
              <Header as="h3" content={t('footer.stuCouncil')} />
              <small>
                <p>77 Cheongam-Ro. Nam-Gu. Pohang. Gyeongbuk. Korea 790-784</p>
                <p>
                  {STUPresidentContact && STUPresidentName && (
                    <>
                      {t('footer.presidentTel', {
                        contact: STUPresidentContact,
                        name: STUPresidentName,
                      })}
                      <br />
                    </>
                  )}
                  {STUTel && (
                    <>
                      TEL {STUTel}
                      <br />
                    </>
                  )}
                  {STUFax && <>FAX {STUFax}</>}
                </p>
                <p>
                  {STUEmail && (
                    <>
                      E-mail: {STUEmail}
                      <br />
                    </>
                  )}
                  {popoCRMEmail && (
                    <>{t('footer.popoInquiry', { email: popoCRMEmail })}</>
                  )}
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
                  {t('footer.recruiting')}
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
                  {t('footer.postechHomepage')}
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
                  {t('footer.library')}
                </List.Item>
              </List>
            </Grid.Column>
          </Grid>

          <Divider section style={{ marginBottom: '1vh' }} />
          <List horizontal divided link size="small">
            <List.Item as="a" href="/other/privacy-policy">
              {t('footer.privacyPolicy')}
            </List.Item>
            <List.Item>
              <a
                href={`https://github.com/PoApper/popo-public-web/commits/${process.env.NEXT_PUBLIC_POPO_VERSION}`}
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
