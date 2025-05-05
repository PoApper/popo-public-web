export interface IFavoritePlace {
  uuid: string;
  user_id: string;
  place_id: string;
  created_at: string;
}

export interface IPlace {
  favorite_id: string;
  uuid: string;
  name: string;
  location: string;
  region: string;
  image_url: string;
}
