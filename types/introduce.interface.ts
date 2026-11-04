/**
 * <Quick Rule>
 * For `React Component Props`, use `type`
 * For other object-like or class-like stuffs, use `interface`
 */

export interface IClubIntroduce {
  uuid: string;
  name: string;
  nameEn?: string | null;
  content: string;
  contentEn?: string | null;
  shortDesc: string;
  shortDescEn?: string | null;
  location: string;
  locationEn?: string | null;
  representative: string;
  representativeEn?: string | null;
  contact: string;
  contactEn?: string | null;
  imageUrl?: string;
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
  nameEn?: string | null;
  content: string;
  contentEn?: string | null;
  location: string;
  locationEn?: string | null;
  representative: string;
  representativeEn?: string | null;
  contact: string;
  contactEn?: string | null;
  imageUrl?: string;
  homepageUrl?: string;
  facebookUrl?: string;
  instagramUrl?: string;
  youtubeUrl?: string;
  associationType?: AssociationType | '' | null;
}

export interface IStudentAssociationIntroduce {
  uuid: string;
  name: string;
  nameEn?: string | null;
  shortDesc: string;
  shortDescEn?: string | null;
  content: string;
  contentEn?: string | null;
  location: string;
  locationEn?: string | null;
  representative: string;
  representativeEn?: string | null;
  office: string;
  officeEn?: string | null;
  contact: string;
  contactEn?: string | null;
  imageUrl?: string;
  homepageUrl?: string;
  facebookUrl?: string;
  instagramUrl?: string;
  youtubeUrl?: string;
}
