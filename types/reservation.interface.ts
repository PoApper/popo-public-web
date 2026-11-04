/**
 * <Quick Rule>
 * For `React Component Props`, use `type`
 * For other object-like or class-like stuffs, use `interface`
 */
import { IUser } from './user.interface';

export interface IPlace {
  uuid: string;
  name: string;
  nameEn?: string | null;
  region: string;
  location: string;
  locationEn?: string | null;
  description: string;
  descriptionEn?: string | null;
  imageUrl?: string;
  maxMinutes: number;
  maxConcurrentReservation: number;
  reservationRequiredDays: number;
  openingHours: string;
  totalReservationCount: number;
}

export interface IEquipment {
  uuid: string;
  name: string;
  nameEn?: string | null;
  description: string;
  descriptionEn?: string | null;
  fee: number;
  imageUrl?: string;
  maxMinutes: number;
  reservationRequiredDays: number;
  openingHours: string;
}

export interface IPlaceReservation {
  uuid: string;
  booker: IUser;
  place: IPlace;
  date: string;
  description: string;
  startTime: string;
  endTime: string;
  phone: string;
  status: string;
  title: string;
  createdAt: Date;
}

export interface IEquipReservation {
  uuid: string;
  booker: IUser;
  equipments: IEquipment[];
  date: string;
  description: string;
  startTime: string;
  endTime: string;
  phone: string;
  status: string;
  title: string;
  createdAt: Date;
}
