import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import styled from 'styled-components';
import { GetStaticProps } from 'next';
import { useTranslation } from 'next-i18next/pages';
import Layout from '@/components/layout';
import { POPOLinks } from '@/components/common/popo-links';
import { getI18nProps } from '@/lib/i18n';

const HomePage: React.FunctionComponent = () => {
  const { t } = useTranslation('common');
  return (
    <Layout>
      <HomeLayout>
        <Hero>
          <Image
            unoptimized
            priority
            src="/home/campus-clean.webp"
            alt={t('home.heroImageAlt')}
            width={1920}
            height={823}
          />
          <HeroCopy>
            <h1>{t('home.heroTitle')}</h1>
            <p>{t('home.heroSubtitle')}</p>
          </HeroCopy>
        </Hero>

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

const Hero = styled.div`
  position: relative;
  aspect-ratio: 1920 / 823;
  overflow: hidden;

  > img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }

  &::after {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(transparent, rgba(0, 0, 0, 0.28), transparent);
  }

  @media (max-width: 780px) {
    aspect-ratio: 1260 / 891;
  }
`;

const HeroCopy = styled.div`
  position: absolute;
  inset: 0;
  z-index: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  color: white;
  text-align: center;
  text-shadow: 0 2px 6px rgba(0, 0, 0, 0.8);

  > h1 {
    margin: 0 0 0.6rem;
    font-family: 'Caveat', serif;
    font-size: clamp(2rem, 4vw, 3.2rem);
  }

  > p {
    margin: 0;
    font-size: clamp(1rem, 2vw, 1.8rem);
    font-weight: bold;
  }
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
    textKey: 'home.circles.extracurricular',
    href: '/extracurricular',
    icon: '/home/extracurricular.png',
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
