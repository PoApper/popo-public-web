/**
 * <Quick Rule>
 * For `React Component Props`, use `type`
 * For other object-like or class-like stuffs, use `interface`
 */

export interface IClubIntroduce {
  uuid: string;
  name: string;
  content: string;
  shortDesc: string;
  location: string;
  representative: string;
  contact: string;
  imageUrl?: string;
  bannerUrl?: string;
  homepageUrl?: string;
  facebookUrl?: string;
  instagramUrl?: string;
  youtubeUrl?: string;
}

export type AssociationType =
  | 'executive'
  | 'autonomous'
  | 'media'
  | 'specialized'
  | '집행기구'
  | '자치기구'
  | '언론기구'
  | '전문기구';

export interface IAssociationIntroduce {
  uuid: string;
  name: string;
  content: string;
  location: string;
  representative: string;
  contact: string;
  imageUrl?: string;
  bannerUrl?: string;
  homepageUrl?: string;
  facebookUrl?: string;
  instagramUrl?: string;
  youtubeUrl?: string;
  associationType?: AssociationType | '' | null;
}

export interface IStudentAssociationIntroduce {
  uuid: string;
  name: string;
  shortDesc: string;
  content: string;
  location: string;
  representative: string;
  office: string;
  contact: string;
  imageUrl?: string;
  bannerUrl?: string;
  homepageUrl?: string;
  facebookUrl?: string;
  instagramUrl?: string;
  youtubeUrl?: string;
}
