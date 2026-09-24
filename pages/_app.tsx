import '@/styles/globals.css';
import 'semantic-ui-css/semantic.min.css';
import 'react-calendar/dist/Calendar.css';
import type { AppProps } from 'next/app';
import { appWithTranslation } from 'next-i18next/pages';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import moment from 'moment';
import 'moment/locale/ko';

function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter();

  useEffect(() => {
    moment.locale(router.locale === 'en' ? 'en' : 'ko');
  }, [router.locale]);

  return <Component {...pageProps} />;
}

export default appWithTranslation(MyApp);
