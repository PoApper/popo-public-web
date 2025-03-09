import { Container } from 'semantic-ui-react';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { PoPoAxios } from '@/lib/axios.instance';

import Layout from '@/components/layout';
import FavoritePlaceBoxes from '@/components/favorite/favorite.place.boxes';
import FavoritePlaceChoice from '@/components/favorite/favorite.place.choice';

import { IPlace, IFavoritePlace } from '@/types/favorite.interface';

interface MyInformation {
  email: string;
  name: string;
  userType: string;
  createdAt: Date;
}

const MyInfoPage = () => {
  const router = useRouter();

  const [myInfo, setMyInfo] = useState<MyInformation>({
    email: '',
    name: '',
    userType: '',
    createdAt: new Date(),
  });
  const [totalPlaceList, setTotalPlaceList] = useState([] as IPlace[]);
  const [placeList, setPlaceList] = useState([] as IPlace[]);

  useEffect(() => {
    PoPoAxios.get('/auth/myInfo', { withCredentials: true })
      .then((res) => setMyInfo(res.data))
      .catch(() => {
        alert('로그인 후 조회할 수 있습니다.');
        router.push('/auth/login');
      });

    const fetchTotalPlaces = async () => {
      try {
        const totalPlacesRes = await PoPoAxios.get<IPlace[]>('/place');
        setTotalPlaceList(totalPlacesRes.data);
      } catch (error) {
        console.error('Error fetching total places:', error);
      }
    };
    fetchTotalPlaces();

    const fetchFavoritePlaces = async (userId: string) => {
      try {
        const favoritePlacesRes = await PoPoAxios.get<IFavoritePlace[]>(
          `/favorite-place/user_id/${userId}`,
        );
        const favoritePlaces = favoritePlacesRes.data;
        console.log('favoritePlaces:', favoritePlaces);

        if (favoritePlaces.length > 0) {
          favoritePlaces.map((favoritePlace) => {
            PoPoAxios.get<IPlace>(`/place/${favoritePlace.place_id}`)
              .then((res) => {
                const cur = res.data;
                cur.favorite_id = favoritePlace.uuid;
                setPlaceList((prev) => [...prev, cur]);
              })
              .catch((error) => {
                console.error('Error fetching place information:', error);
              });
          });
        }
      } catch (error) {
        console.error('Error fetching favorite places:', error);
      }
    };
    if (myInfo.email) {
      fetchFavoritePlaces(myInfo.email.replace('@postech.ac.kr', ''));
    }
  }, [router, myInfo.email]);

  return (
    <Layout>
      <Container
        style={{
          padding: '40px',
          margin: '2em 0 4em',
          backgroundColor: '#eeeeee',
          borderRadius: '8px',
        }}
      >
        <h2>내 즐겨찾기</h2>
        <FavoritePlaceBoxes placeList={placeList} />
        {placeList.length < 3 && (
          <FavoritePlaceChoice
            placeList={totalPlaceList}
            userId={myInfo.email.replace('@postech.ac.kr', '')}
          />
        )}
      </Container>
    </Layout>
  );
};

export default MyInfoPage;
