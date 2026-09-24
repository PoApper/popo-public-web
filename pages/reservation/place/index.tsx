import { Card, Grid, Icon, Image } from 'semantic-ui-react';
import { GetStaticProps } from 'next';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next/pages';
import Layout from '@/components/layout';
import { getI18nProps } from '@/lib/i18n';

const PlaceIndexPage = () => {
  const { t } = useTranslation('common');
  const { locale } = useRouter();
  const showEnglishMeta = locale === 'ko';

  return (
    <Layout>
      <h2>{t('reservation.place.indexTitle')}</h2>
      <Grid stackable centered columns={3} style={{ maxWidth: 900 }}>
        <Grid.Column>
          <Card href={'/reservation/place/student-hall'} centered>
            <Image src={'/reservation/student_hall.jpg'} alt={'student_hall'} />
            <Card.Content>
              <Card.Header>
                {t('reservation.place.regions.studentHall')}
              </Card.Header>
              {showEnglishMeta ? <Card.Meta>Student Hall</Card.Meta> : null}
            </Card.Content>
          </Card>
        </Grid.Column>
        <Grid.Column>
          <Card href={'/reservation/place/jigok'} centered>
            <Image src={'/reservation/jigok.jpg'} alt={'jigok'} />
            <Card.Content>
              <Card.Header>{t('reservation.place.regions.jigok')}</Card.Header>
              {showEnglishMeta ? (
                <Card.Meta>Ji-gok Community Center</Card.Meta>
              ) : null}
            </Card.Content>
          </Card>
        </Grid.Column>
        <Grid.Column>
          <Card href={'/reservation/place/community-center'} centered>
            <Image
              src={'/reservation/community_center.jpg'}
              alt={'community_center'}
            />
            <Card.Content>
              <Card.Header>
                {t('reservation.place.regions.communityCenter')}
              </Card.Header>
              {showEnglishMeta ? <Card.Meta>Community Center</Card.Meta> : null}
            </Card.Content>
          </Card>
        </Grid.Column>
        <Grid.Column>
          <Card href={'/reservation/place/residential-college'} centered>
            <Image src={'/reservation/rc.jpg'} alt={'rc'} />
            <Card.Content>
              <Card.Header>{t('reservation.place.regions.rc')}</Card.Header>
              {showEnglishMeta ? (
                <Card.Meta>Residential College</Card.Meta>
              ) : null}
            </Card.Content>
          </Card>
        </Grid.Column>
        <Grid.Column>
          <Card href={'/reservation/place/others'} centered>
            <Image src={'/reservation/dormitory.jpg'} alt={'others'} />
            <Card.Content>
              <Card.Header>
                {t('reservation.place.regions.others')}
              </Card.Header>
              {showEnglishMeta ? <Card.Meta>etc</Card.Meta> : null}
            </Card.Content>
          </Card>
        </Grid.Column>
        <Grid.Column></Grid.Column>
      </Grid>

      <h2>{t('reservation.place.otherReservations')}</h2>
      <Grid stackable columns={3} style={{ maxWidth: 900 }}>
        <Grid.Column>
          <Card
            href={'https://zzim.postech.ac.kr'}
            target={'_blank'}
            rel={'noopener noreferrer'}
            centered
          >
            <Card.Content style={{ display: 'flex', 'align-items': 'center' }}>
              <Icon
                style={{ 'margin-right': '10px' }}
                color="black"
                name="book"
              />
              <div>
                <Card.Header style={{ color: 'black', 'font-weight': 'bold' }}>
                  {t('footer.library')}
                </Card.Header>
                {showEnglishMeta ? (
                  <Card.Meta>Tae-joon Park Digital Library</Card.Meta>
                ) : null}
              </div>
            </Card.Content>
          </Card>
        </Grid.Column>
        <Grid.Column>
          <Card
            href={'https://povis.postech.ac.kr/'}
            target={'_blank'}
            rel={'noopener noreferrer'}
            centered
          >
            <Card.Content style={{ display: 'flex', 'align-items': 'center' }}>
              <Icon
                style={{ 'margin-right': '10px' }}
                color="black"
                name="building"
              />
              <div>
                <Card.Header style={{ color: 'black', 'font-weight': 'bold' }}>
                  {t('reservation.place.classroomFacilities')}
                </Card.Header>
                <Card.Meta>{t('reservation.place.povisMeta')}</Card.Meta>
              </div>
            </Card.Content>
          </Card>
        </Grid.Column>
        <Grid.Column>
          <Card href={'tel:054-279-3860'} centered>
            <Card.Content style={{ display: 'flex', 'align-items': 'center' }}>
              <Icon
                style={{ 'margin-right': '10px' }}
                color="black"
                name="home"
              />
              <div>
                <Card.Header style={{ color: 'black', 'font-weight': 'bold' }}>
                  {t('reservation.place.logCabin')}
                </Card.Header>
                <Card.Meta>054-279-3860</Card.Meta>
              </div>
            </Card.Content>
          </Card>
        </Grid.Column>
      </Grid>
    </Layout>
  );
};

export default PlaceIndexPage;

export const getStaticProps: GetStaticProps = async ({ locale }) => ({
  props: {
    ...(await getI18nProps(locale)),
  },
});
