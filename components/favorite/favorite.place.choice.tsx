import React, { useState } from 'react';
import { PoPoAxios } from '@/lib/axios.instance';
import { Form } from 'semantic-ui-react';

import { IPlace } from '@/types/favorite.interface';

const FavoritePlaceChoice = ({
  placeList,
  userId,
}: {
  placeList: IPlace[];
  userId: string;
}) => {
  const [placeId, setPlaceId] = useState<string>('');

  function handleSubmit() {
    PoPoAxios.post(
      '/favorite-place',
      {
        place_id: placeId,
        user_id: userId,
      },
      { withCredentials: true },
    )
      .then(() => {
        alert('즐겨찾기에 추가되었습니다.');
        window.location.reload();
      })
      .catch((error) => {
        alert(`예약 생성에 실패했습니다: ${error.response.data.message}`);
      });
  }

  return (
    <div style={{ marginTop: '40px' }}>
      <Form onSubmit={handleSubmit}>
        <Form.Select
          label="즐겨찾기할 장소"
          options={placeList.map((place: IPlace) => {
            return {
              key: place.uuid,
              text: place.name,
              value: place.uuid,
            };
          })}
          placeholder="장소를 선택해주세요."
          onChange={(e, { value }) => setPlaceId(value as string)}
        />
        <Form.Button content="즐겨찾기 추가" />
      </Form>
    </div>
  );
};

export default FavoritePlaceChoice;
