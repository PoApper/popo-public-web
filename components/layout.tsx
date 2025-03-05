import React, { ReactNode } from 'react';
import Head from 'next/head';
import styled, { ThemeProvider } from 'styled-components';
import theme from '@/styles/theme';
import Navbar from './navbar/navbar';
import Footer from './footer';

type LayoutProps = {
  children: ReactNode;
};

const Layout = ({ children }: LayoutProps) => {
  return (
    <>
      <ThemeProvider theme={theme}>
        <Head>
          <title>POPO 퍼블릭 페이지</title>
          <meta name="description" content="POPO 퍼블릭 페이지" />
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
        <img
          src="/home/siren.ico"
          alt="Siren Icon"
          style={{ width: '30px', height: '30px' }}
        />
        <span>오류 신고</span>
      </FloatingButton>
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
