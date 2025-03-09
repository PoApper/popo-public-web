import React from 'react';
import Link from 'next/link';
import { PoPoAxios } from '@/lib/axios.instance';
import {
  Card,
  Grid,
  Image,
  Button,
  Icon,
  ButtonGroup,
} from 'semantic-ui-react';

import { IPlace } from '@/types/favorite.interface';

const FavoritePlaceBoxes = ({ placeList }: { placeList: IPlace[] }) => {
  const handleDelete = async (deleteURI: string) => {
    PoPoAxios.delete(`/${deleteURI}`, { withCredentials: true })
      .then(() => {
        window.location.reload();
      })
      .catch((err) => {
        const errMsg = err.response.data.message;
        alert(`삭제에 실패했습니다.\n${errMsg}`);
      });
  };

  return (
    <Grid stackable centered columns={3} style={{ maxWidth: 1000 }}>
      {placeList.map((place: IPlace) => (
        <Grid.Column key={place.uuid}>
          <Card centered>
            <Image src={place.image_url} alt={place.name} />
            <Card.Content>
              <Card.Header>{place.name}</Card.Header>
            </Card.Content>
          </Card>
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              marginTop: '10px',
            }}
          >
            <ButtonGroup fluid>
              <Button
                icon
                labelPosition="left"
                onClick={() =>
                  handleDelete(`favorite-place/${place.favorite_id}`)
                }
              >
                <Icon name="cancel" />
                삭제하기
              </Button>
              <Link href={`/reservation/place/${place.region}/${place.name}`}>
                <Button icon labelPosition="right">
                  예약하기
                  <Icon name="arrow right" />
                </Button>
              </Link>
            </ButtonGroup>
          </div>
        </Grid.Column>
      ))}
    </Grid>
  );
};

export default FavoritePlaceBoxes;
