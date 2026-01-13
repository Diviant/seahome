
export enum PropertyType {
  GUEST_HOUSE = 'Гостевой дом',
  PRIVATE_HOUSE = 'Частный дом',
  MINI_HOTEL = 'Мини-отель',
}

export enum ModerationStatus {
  PENDING = 'На модерации',
  APPROVED = 'Одобрен',
  REJECTED = 'Отклонён',
  EXPIRED = 'Срок истёк',
}

export interface Property {
  id: string;
  ownerId: string;
  ownerUsername: string;
  title: string;
  description: string;
  type: PropertyType;
  country: string;
  region: string;
  city: string;
  address: string;
  pricePerNight: number;
  distanceToSea: number; // in meters
  maxGuests: number;
  amenities: string[];
  images: string[];
  status: ModerationStatus;
  rejectionReason?: string;
  createdAt: number;
  isVerified: boolean;
  isFeatured: boolean;
}

export interface User {
  id: string;
  username: string;
  role: 'guest' | 'owner' | 'admin';
}

export interface FilterState {
  search: string;
  type: string;
  minPrice: string;
  maxPrice: string;
  maxDistance: string;
  region: string;
  city: string;
}
