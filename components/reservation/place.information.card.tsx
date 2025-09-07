import { Card, Image } from 'semantic-ui-react';
import React, { FunctionComponent } from 'react';

import { IPlace } from '@/types/reservation.interface';
import OpeningHoursList from './opening_hours.list';

const PlaceInformationCard: FunctionComponent<{
  placeInfo: IPlace;
}> = ({ placeInfo }) => {
  return (
    <Card fluid>
      <Image
        wrapped
        ui={false}
        src={
          placeInfo.imageUrl ??
          'https://react.semantic-ui.com/images/wireframe/image.png'
        }
        alt={'place_image'}
      />
      <Card.Content>
        <Card.Header>{placeInfo.name}</Card.Header>
        <Card.Meta>{placeInfo.location}</Card.Meta>
        <Card.Description>{placeInfo.description}</Card.Description>
        <Card.Meta style={{ marginTop: 8 }}>
          <OpeningHoursList
            openingHours={JSON.parse(placeInfo.openingHours)}
          />
          {placeInfo.maxMinutes !== 24 * 60 ||
          placeInfo.maxConcurrentReservation > 1 ? (
            <ul style={{ paddingLeft: 16 }}>
              {placeInfo.maxMinutes !== 24 * 60 ? (
                <li>최대 예약 기간: {placeInfo.maxMinutes}분</li>
              ) : null}
              {placeInfo.maxConcurrentReservation > 1 ? (
                <li>
                  동시 예약 가능 갯수: 최대{' '}
                  {placeInfo.maxConcurrentReservation}개 예약
                </li>
              ) : null}
            </ul>
          ) : null}
        </Card.Meta>
      </Card.Content>
    </Card>
  );
};

export default PlaceInformationCard;
