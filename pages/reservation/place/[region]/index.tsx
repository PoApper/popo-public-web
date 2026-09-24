import React from 'next/router';
import { Button, Card, Icon, Select } from 'semantic-ui-react';
import { useTranslation } from 'next-i18next/pages';

import Layout from '@/components/layout';
import { IPlace } from '@/types/reservation.interface';
import { PoPoAxios } from '@/lib/axios.instance';
import { GetServerSideProps } from 'next';
import { useState } from 'react';
import { getI18nProps } from '@/lib/i18n';

type ObjectType = {
  [key: string]: string;
};

const regionKeyMap: ObjectType = {
  'student-hall': 'reservation.place.regions.studentHall',
  jigok: 'reservation.place.regions.jigok',
  others: 'reservation.place.regions.others',
  'community-center': 'reservation.place.regions.communityCenter',
  'residential-college': 'reservation.place.regions.rc',
};

const regionOptions: ObjectType = {
  'student-hall': 'STUDENT_HALL',
  jigok: 'JIGOK_CENTER',
  others: 'OTHERS',
  'community-center': 'COMMUNITY_CENTER',
  'residential-college': 'RESIDENTIAL_COLLEGE',
};

const PlaceRegionIndexPage: React.FunctionComponent<{
  region: string;
  placeList: IPlace[];
}> = ({ region, placeList }) => {
  const { t } = useTranslation('common');
  const [selectedSortType, setSelectedSortType] = useState('alphabetic');

  const SelectClubTypeOptions = [
    {
      key: 'alphabetic',
      value: 'alphabetic',
      text: t('reservation.place.sortAlphabetic'),
    },
    {
      key: 'popular',
      value: 'popular',
      text: t('reservation.place.sortPopular'),
    },
  ];

  const sortedPlaceList = placeList.sort((a, b) => {
    if (selectedSortType === 'alphabetic') {
      return a.name > b.name ? 1 : -1;
    } else if (selectedSortType === 'popular') {
      return a.totalReservationCount < b.totalReservationCount ? 1 : -1;
    } else {
      return 0;
    }
  });

  return (
    <Layout>
      <div>
        <h1>
          {t('reservation.place.regionTitle', {
            region: t(regionKeyMap[region]),
          })}
        </h1>
        <div style={{ marginBottom: 16, textAlign: 'right' }}>
          <Select
            value={selectedSortType}
            options={SelectClubTypeOptions}
            // @ts-ignore
            onChange={(e, { value }) => setSelectedSortType(value)}
          />
        </div>

        <Card.Group>
          {sortedPlaceList.map((place) => {
            return (
              <Card fluid key={place.uuid}>
                <Card.Content>
                  <Card.Header>{place.name}</Card.Header>
                  <Card.Meta>{place.location}</Card.Meta>
                  <Card.Description>{place.description}</Card.Description>
                  <Card.Description style={{ marginTop: '0.8em' }}>
                    <Button
                      basic
                      compact
                      href={`/reservation/place/${region}/${place.name}`}
                    >
                      <Icon name={'calendar plus outline'} />{' '}
                      {t('reservation.shared.reserve')}
                    </Button>
                  </Card.Description>
                </Card.Content>
              </Card>
            );
          })}
        </Card.Group>
      </div>
    </Layout>
  );
};

export default PlaceRegionIndexPage;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const locale = context.locale;
  const region = context.query['region'] as string;

  const res = await PoPoAxios.get<IPlace[]>(
    `place/region/${regionOptions[region]}`,
  );
  const placeList = res.data;

  return {
    props: {
      region,
      placeList,
      ...(await getI18nProps(locale)),
    },
  };
};
