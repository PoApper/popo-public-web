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
      <FloatingActions data-floating-actions>
        <AppInstallButton
          aria-label={t('layout.appLaunchFab')}
          onClick={() =>
            document.dispatchEvent(new CustomEvent('open-app-promo'))
          }
        >
          <span className="full-label">{t('layout.appLaunchFab')}</span>
          <span className="short-label">{t('layout.appLaunchFabShort')}</span>
        </AppInstallButton>
        <FloatingButton
          href="https://docs.google.com/forms/d/1J23um5RDRTdKC9bscZnixPhEeon6qz4DQRTJYMtFJTU/viewform?edit_requested=true"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image src="/home/siren.ico" alt="" width={24} height={24} />
          <span>{t('layout.reportBug')}</span>
        </FloatingButton>
      </FloatingActions>
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

const FloatingActions = styled.div`
  position: fixed;
  bottom: max(20px, env(safe-area-inset-bottom));
  right: max(40px, env(safe-area-inset-right));
  z-index: 1000;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 8px;
  max-width: calc(100vw - 32px);

  > a,
  > button {
    box-sizing: border-box;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    min-height: 44px;
    max-width: 100%;
    padding: 12px 16px;
    line-height: 1.4;
    font-family: inherit;
    overflow-wrap: anywhere;
    cursor: pointer;
  }

  > a > img {
    flex-shrink: 0;
  }

  > a > span,
  > button > span {
    min-width: 0;
  }

  .short-label {
    display: none;
  }

  > a:focus-visible,
  > button:focus-visible {
    outline: 2px solid #2185d0;
    outline-offset: 3px;
  }

  @media (max-width: 780px) {
    right: max(12px, env(safe-area-inset-right));
    bottom: max(12px, env(safe-area-inset-bottom));
  }

  @media (max-width: 639px) {
    flex-direction: row;
    align-items: center;

    > a,
    > button {
      padding: 10px 12px;
      font-size: 12px;
    }

    .full-label {
      display: none;
    }

    .short-label {
      display: block;
    }
  }
`;

const FloatingButton = styled.a`
  background-color: #333435;
  color: white;
  border-radius: 25px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  text-decoration: none;
  font-size: 14px;
  font-weight: bold;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: #000000;
  }
`;

export default Layout;

const AppInstallButton = styled.button`
  background-color: #333435;
  color: white;
  border-radius: 25px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  border: none;
  font-size: 13px;
  font-weight: bold;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: #111;
  }
`;
