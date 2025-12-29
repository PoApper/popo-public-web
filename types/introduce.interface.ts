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
  homepageUrl?: string;
  facebookUrl?: string;
  instagramUrl?: string;
  youtubeUrl?: string;
}

export interface IAssociationCategory {
  id: number;
  name: string;
  displayName: string;
}

export interface IAssociationIntroduce {
  uuid: string;
  name: string;
  content: string;
  location: string;
  representative: string;
  contact: string;
  imageUrl?: string;
  homepageUrl?: string;
  facebookUrl?: string;
  instagramUrl?: string;
  youtubeUrl?: string;
  category: IAssociationCategory;
  categoryId: number;
}
