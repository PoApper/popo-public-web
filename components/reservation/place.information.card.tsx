import { Card, Image } from 'semantic-ui-react';
import React, { FunctionComponent } from 'react';
import { useTranslation } from 'next-i18next/pages';

import { IPlace } from '@/types/reservation.interface';
import OpeningHoursList from './opening_hours.list';

const PlaceInformationCard: FunctionComponent<{
  placeInfo: IPlace;
}> = ({ placeInfo }) => {
  const { t } = useTranslation('common');

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
          <OpeningHoursList openingHours={JSON.parse(placeInfo.openingHours)} />
          {placeInfo.maxMinutes !== 24 * 60 ||
          placeInfo.maxConcurrentReservation > 1 ||
          placeInfo.reservationRequiredDays > 0 ? (
            <ul style={{ paddingLeft: 16 }}>
              {placeInfo.maxMinutes !== 24 * 60 ? (
                <li>
                  {t('reservation.place.maxDuration', {
                    minutes: placeInfo.maxMinutes,
                  })}
                </li>
              ) : null}
              {placeInfo.reservationRequiredDays > 0 ? (
                <li>
                  {t('reservation.shared.daysBeforeRequired', {
                    days: placeInfo.reservationRequiredDays,
                  })}
                </li>
              ) : null}
              {placeInfo.maxConcurrentReservation > 1 ? (
                <li>
                  {t('reservation.place.maxConcurrent', {
                    count: placeInfo.maxConcurrentReservation,
                  })}
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
