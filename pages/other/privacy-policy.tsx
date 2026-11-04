import { useEffect, useState } from 'react';
import { GetStaticProps } from 'next';
import { useTranslation } from 'next-i18next/pages';
import Layout from '@/components/layout';
import { PoPoAxios } from '@/lib/axios.instance';
import { getI18nProps } from '@/lib/i18n';

// Render only the two supported formatting tokens; all policy text remains escaped.
const renderPolicyText = (text: string, email: string) =>
  text.split(/(<strong>[\s\S]*?<\/strong>|<email\/>)/g).map((part, index) => {
    if (part === '<email/>') {
      return (
        <a key={index} href={`mailto:${email}`}>
          {email}
        </a>
      );
    }
    if (part.startsWith('<strong>') && part.endsWith('</strong>')) {
      return <strong key={index}>{part.slice(8, -9)}</strong>;
    }
    return part;
  });

const PrivacyPolicyPage = () => {
  const { t } = useTranslation('common');
  const [STUEmail, setSTUEmail] = useState('');
  const paragraphs = t('privacyPolicy.paragraphs', {
    returnObjects: true,
  }) as string[];

  useEffect(() => {
    PoPoAxios.get('/setting').then((res) => setSTUEmail(res.data.stuEmail));
  }, []);

  const paragraph = (text: string, index: number) => (
    <p
      key={index}
      style={{
        whiteSpace: 'pre-line',
        marginTop: text.startsWith('<strong>') ? '1.5rem' : undefined,
      }}
    >
      {renderPolicyText(text, STUEmail)}
    </p>
  );

  return (
    <Layout>
      <h2>{t('common.privacyPolicyTitle')}</h2>
      {paragraphs.map((text, index) => {
        if (index === 5) {
          return (
            <ol key={index}>
              <li>{paragraph(text, index)}</li>
              <li>{paragraph(paragraphs[6], 6)}</li>
            </ol>
          );
        }
        return index === 6 ? null : paragraph(text, index);
      })}
    </Layout>
  );
};

export default PrivacyPolicyPage;

export const getStaticProps: GetStaticProps = async ({ locale }) => ({
  props: { ...(await getI18nProps(locale)) },
});
