import Layout from '@/components/layout';
import { Card, Image } from 'semantic-ui-react';
import styled from 'styled-components';
import { GetStaticProps } from 'next';
import { useTranslation } from 'next-i18next/pages';
import { getI18nProps } from '@/lib/i18n';

const ClubIndexPage = () => {
  const { t } = useTranslation('common');

  const clubTypes = [
    { slug: 'performance1' },
    { slug: 'performance2' },
    { slug: 'sports' },
    { slug: 'hobbyAndExhibition' },
    { slug: 'study' },
    { slug: 'societyAndReligion' },
  ];

  return (
    <Layout>
      <ClubTypesGrid>
        {clubTypes.map(({ slug }) => (
          <Card
            key={slug}
            href={`/club/introduce/${slug}`}
            style={{ margin: '0 auto' }}
          >
            <Card.Content style={{ height: '12em' }}>
              <Image
                src={`club/${slug}.svg`}
                alt={slug}
                style={{
                  height: '100%',
                  width: '100%',
                  verticalAlign: 'middle',
                }}
              />
            </Card.Content>
            <Card.Content>
              <Card.Header>{t(`club.types.${slug}`)}</Card.Header>
            </Card.Content>
          </Card>
        ))}
      </ClubTypesGrid>
    </Layout>
  );
};

export default ClubIndexPage;

export const getStaticProps: GetStaticProps = async ({ locale }) => ({
  props: { ...(await getI18nProps(locale)) },
});

const ClubTypesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  text-align: center;
  gap: 2rem;

  // mobile screen
  @media only screen and (max-width: 768px) {
    grid-template-columns: repeat(1, 1fr);
  }
`;
