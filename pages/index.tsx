import React from 'react';
import Link from 'next/link';
import styled from 'styled-components';
import { GetStaticProps } from 'next';
import { useTranslation } from 'next-i18next/pages';
import Layout from '@/components/layout';
import { POPOLinks } from '@/components/common/popo-links';
import { getI18nProps } from '@/lib/i18n';

const HomePage: React.FunctionComponent = () => {
  return (
    <Layout>
      <HomeLayout>
        <picture>
          <source
            media="(max-width: 780px)"
            srcSet="/home/background_mobile.png"
          />
          <source
            media="(min-width: 781px)"
            srcSet="/home/background_web.png"
          />
          <img
            src="/home/background_web.png"
            alt="Hero Background"
            style={{ width: '100%', height: 'auto' }}
          />
        </picture>

        <CircleSection />
      </HomeLayout>
    </Layout>
  );
};

export default HomePage;

export const getStaticProps: GetStaticProps = async ({ locale }) => ({
  props: {
    ...(await getI18nProps(locale)),
  },
});

const HomeLayout = styled.div`
  display: flex;
  gap: 20px;
  flex-direction: column;
  padding: 0;
  margin: 0;
`;

const circleDefs = [
  {
    textKey: 'home.circles.placeReservation',
    href: '/reservation/place',
    icon: '/home/place_reservation.png',
  },
  {
    textKey: 'home.circles.equipReservation',
    href: '/reservation/equipment',
    icon: '/home/equipment_reservation.png',
  },
  {
    textKey: 'home.circles.clubIntro',
    href: '/club',
    icon: '/home/club.png',
  },
  {
    textKey: 'home.circles.association',
    href: '/association',
    icon: '/home/association.png',
  },
  {
    textKey: 'home.circles.studentAssociation',
    href: '/student_association',
    icon: '/home/student_association.png',
  },
  {
    textKey: 'home.circles.whitebook',
    href: '/whitebook',
    icon: '/home/whitebook.png',
  },
  {
    textKey: 'home.circles.benefits',
    href: '/benefits',
    icon: '/home/benefits.png',
  },
  {
    textKey: 'home.circles.delivery',
    href: POPOLinks.PostechDeliveryLink,
    icon: '/home/delivery.png',
  },
  {
    textKey: 'home.circles.archive',
    href: POPOLinks.StudentCouncilArchiveLink,
    icon: '/home/record.png',
  },
] as const;

const Circle = styled(Link)`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-decoration: none;
  color: #333;
  width: 100px;
  height: auto;
  gap: 8px;

  @media (max-width: 780px) {
    width: 90px;
  }
`;

const IconWrapper = styled.div`
  width: 100px;
  height: 100px;
  border-radius: 50%;
  background-color: #eeeff1;
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #dadbdd;
  }

  @media (max-width: 780px) {
    width: 100px;
    height: 100px;
  }
`;

const CircleContainer = styled.div`
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  flex-wrap: wrap;
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px 0;
  gap: 8px;

  @media (max-width: 780px) {
    justify-content: center;
    gap: 20px 25px;
  }
`;

const Icon = styled.img`
  width: 60px;
`;

const Text = styled.span`
  text-align: center;
  color: #333;
  font-size: 14px;
  font-weight: bold;
  margin-top: 4px;
`;

const CircleSection = () => {
  const { t } = useTranslation('common');

  return (
    <CircleContainer>
      {circleDefs.map((circle, index) => {
        const text = t(circle.textKey);
        return (
          <Circle href={circle.href} key={index}>
            <IconWrapper>
              <Icon src={circle.icon} alt={t('home.iconAlt', { text })} />
            </IconWrapper>
            <Text>{text}</Text>
          </Circle>
        );
      })}
    </CircleContainer>
  );
};
