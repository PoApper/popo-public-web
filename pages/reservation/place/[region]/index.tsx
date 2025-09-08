import React from 'next/router';
import { Button, Card, Icon, Select } from 'semantic-ui-react';

import Layout from '@/components/layout';
import { IPlace } from '@/types/reservation.interface';
import { PoPoAxios } from '@/lib/axios.instance';
import { GetServerSideProps } from 'next';
import { useState } from 'react';

type ObjectType = {
  [key: string]: string;
};

const regionName: ObjectType = {
  'student-hall': '학생 회관',
  jigok: '지곡 회관',
  others: '기타',
  'community-center': '커뮤니티 센터',
  'residential-college': 'RC',
};

const regionOptions: ObjectType = {
  'student-hall': 'STUDENT_HALL',
  jigok: 'JIGOK_CENTER',
  others: 'OTHERS',
  'community-center': 'COMMUNITY_CENTER',
  'residential-college': 'RESIDENTIAL_COLLEGE',
};

const SelectClubTypeOptions = [
  { key: 'alphabetic', value: 'alphabetic', text: '가나다순' },
  { key: 'popular', value: 'popular', text: '예약 많은 순' },
];

const PlaceRegionIndexPage: React.FunctionComponent<{
  region: string;
  placeList: IPlace[];
}> = ({ region, placeList }) => {
  const [selectedSortType, setSelectedSortType] = useState('alphabetic');

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
        <h1>{regionName[region]} - 장소 예약하기</h1>
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
                      <Icon name={'calendar plus outline'} /> 예약하기
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
  const region = context.query['region'] as string;

  const res = await PoPoAxios.get<IPlace[]>(
    `place/region/${regionOptions[region]}`,
  );
  const placeList = res.data;

  return {
    props: { region, placeList },
  };
};
