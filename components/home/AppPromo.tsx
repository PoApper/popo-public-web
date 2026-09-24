import React from 'react';
import { Segment, Header, Button, Icon } from 'semantic-ui-react';
import { useTranslation } from 'next-i18next/pages';

const AppPromo: React.FC = () => {
  const { t } = useTranslation('common');

  return (
    <Segment style={{ margin: 0, maxWidth: 360 }}>
      <Header as="h3" style={{ marginBottom: 8 }}>
        {t('home.appPromo.title')}
      </Header>
      <p style={{ marginBottom: 12 }}>{t('home.appPromo.body')}</p>
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        <Button
          as="a"
          href="https://play.google.com/store/apps/details?id=com.popomobile"
          target="_blank"
          rel="noreferrer"
          color="black"
          icon
          labelPosition="left"
        >
          <Icon name="google play" />
          Google Play
        </Button>
        <Button
          as="a"
          href="https://apps.apple.com/us/app/popo-%ED%8F%AC%EC%8A%A4%ED%85%8C%ED%82%A4%EC%95%88%EC%9D%98-%ED%95%84%EC%88%98-%EC%95%B1/id6743666761"
          target="_blank"
          rel="noreferrer"
          color="black"
          icon
          labelPosition="left"
        >
          <Icon name="apple" />
          App Store
        </Button>
      </div>
    </Segment>
  );
};

export default AppPromo;
