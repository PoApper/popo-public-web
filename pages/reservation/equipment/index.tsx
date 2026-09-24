import { Card, Grid, Image } from 'semantic-ui-react';
import styled from 'styled-components';
import { GetStaticProps } from 'next';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next/pages';
import Layout from '@/components/layout';
import { getI18nProps } from '@/lib/i18n';

const EquipmentIndexPage = () => {
  const { t } = useTranslation('common');
  const { locale } = useRouter();
  const showEnglishMeta = locale === 'ko';

  return (
    <Layout>
      <h2>{t('reservation.equipment.indexTitle')}</h2>
      <Grid stackable columns={3} centered>
        <Grid.Column>
          <Card href={'/reservation/equipment/dongyeon'} centered>
            <LogoImage src={'/reservation/dongyeon.png'} alt={'dongyeon'} />
            <Card.Content>
              <Card.Header>
                {t('reservation.equipment.owners.dongyeon')}
              </Card.Header>
              {showEnglishMeta ? (
                <Card.Meta>Student Club Union</Card.Meta>
              ) : null}
              <Card.Description>
                {t('reservation.equipment.dongyeonDesc')}
              </Card.Description>
            </Card.Content>
          </Card>
        </Grid.Column>
        <Grid.Column>
          <Card href={'/reservation/equipment/dormunion'} centered>
            <LogoImage src={'/reservation/dormUnion.png'} alt={'dormUnion'} />
            <Card.Content>
              <Card.Header>
                {t('reservation.equipment.owners.dormunion')}
              </Card.Header>
              {showEnglishMeta ? <Card.Meta>Dormitory Union</Card.Meta> : null}
              <Card.Description>
                {t('reservation.equipment.dormunionDesc')}
              </Card.Description>
            </Card.Content>
          </Card>
        </Grid.Column>
      </Grid>
    </Layout>
  );
};

export default EquipmentIndexPage;

export const getStaticProps: GetStaticProps = async ({ locale }) => ({
  props: {
    ...(await getI18nProps(locale)),
  },
});

const LogoImage = styled(Image)`
  background-color: white !important;
`;
