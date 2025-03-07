import React from 'react';
import Link from 'next/link';
import styled from 'styled-components';
import Layout from '@/components/layout';

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

const HomeLayout = styled.div`
  display: flex;
  gap: 20px;
  flex-direction: column;
  padding: 0;
  margin: 0;
`;

const circles = [
  {
    text: '장소예약',
    href: '/reservation/place',
    icon: '/home/place_reservation.png',
  },
  {
    text: '장비예약',
    href: '/reservation/equipment',
    icon: '/home/equipment_reservation.png',
  },
  { text: '자치단체', href: '/association', icon: '/home/association.png' },
  { text: '제휴업체', href: '/benefits', icon: '/home/benefits.png' },
  {
    text: '기록물관리',
    href: 'https://drive.google.com/drive/u/0/folders/1vHexwLSdD92maoKNlvw9zQ0q0J59k5FD',
    icon: '/home/record.png',
  },
  { text: '동아리소개', href: '/club', icon: '/home/club.png' },
  { text: '생활백서', href: '/whitebook', icon: '/home/whitebook.png' },
  {
    text: '배달업체',
    href: 'https://www.postechdorm.com/delivery',
    icon: '/home/delivery.png',
  },
];

const Circle = styled(Link)`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-decoration: none;
  color: #333;
  width: 120px;
  height: auto;
  gap: 8px;

  @media (max-width: 780px) {
    width: 90px;
  }
`;

const IconWrapper = styled.div`
  width: 120px;
  height: 120px;
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

const CircleSection = () => (
  <CircleContainer>
    {circles.map((circle, index) => (
      <Circle href={circle.href} key={index}>
        <IconWrapper>
          <Icon src={circle.icon} alt={`${circle.text} 아이콘`} />
        </IconWrapper>
        <Text>{circle.text}</Text>
      </Circle>
    ))}
  </CircleContainer>
);
