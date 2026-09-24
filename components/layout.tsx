import React, { ReactNode } from 'react';
import Head from 'next/head';
import Image from 'next/image';
import styled, { ThemeProvider } from 'styled-components';
import { useTranslation } from 'next-i18next/pages';
import theme from '@/styles/theme';
import Navbar from './navbar/navbar';
import AppPromoFab from '@/components/home/AppPromoFab';
import Footer from './footer';

type LayoutProps = {
  children: ReactNode;
};

const Layout = ({ children }: LayoutProps) => {
  const { t } = useTranslation('common');

  return (
    <>
      <ThemeProvider theme={theme}>
        <Head>
          <title>{t('layout.pageTitle')}</title>
          <meta name="description" content={t('layout.metaDescription')} />
          <link rel="icon" href={'/favicon.ico'} />
        </Head>
        <main>
          <Navbar />
          <Wrapper>
            <div style={{ width: '100%' }}>{children}</div>
          </Wrapper>
          <Footer />
        </main>
      </ThemeProvider>
      <FloatingButton
        href="https://docs.google.com/forms/d/1J23um5RDRTdKC9bscZnixPhEeon6qz4DQRTJYMtFJTU/viewform?edit_requested=true"
        target="_blank"
        rel="noopener noreferrer"
      >
        <Image src="/home/siren.ico" alt="Siren Icon" width={30} height={30} />
        <span>{t('layout.reportBug')}</span>
      </FloatingButton>
      <AppInstallButton
        onClick={() =>
          document.dispatchEvent(new CustomEvent('open-app-promo'))
        }
      >
        <span>{t('layout.appLaunchFab')}</span>
      </AppInstallButton>
      <AppPromoFab />
    </>
  );
};

const Wrapper = styled.div`
  height: 100%;
  min-height: calc(100vh - ${({ theme }) => theme.footerHeight});
  max-width: ${({ theme }) => theme.contentWidth};
  padding: 8rem 1rem;
  margin: auto;
`;

const FloatingButton = styled.a`
  position: fixed;
  bottom: 20px;
  right: 40px;
  background-color: #333435;
  color: white;
  border-radius: 25px;
  width: 130px;
  height: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  text-decoration: none;
  font-size: 14px;
  font-weight: bold;
  z-index: 1000;
  transition: all 0.3s ease;

  &:hover {
    background-color: #000000;
    transform: scale(1.05);
  }

  @media (max-width: 780px) {
    right: 10px;
  }
`;

export default Layout;

const AppInstallButton = styled.button`
  position: fixed;
  bottom: 78px;
  right: 40px;
  background-color: #333435;
  color: white;
  border-radius: 25px;
  width: 110px;
  height: 44px;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  border: none;
  font-size: 13px;
  font-weight: bold;
  z-index: 1000;
  transition: all 0.3s ease;

  &:hover {
    background-color: #111;
    transform: scale(1.05);
  }

  @media (max-width: 780px) {
    right: 10px;
  }
`;
