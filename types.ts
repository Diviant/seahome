
export enum ListingCategory {
  STAY = 'Жилье',
  MOTO = 'Мото',
  SIM = 'Сим-карты',
  EXCHANGE = 'Обмен',
}

export enum PropertyType {
  GUEST_HOUSE = 'Гостевой дом',
  PRIVATE_HOUSE = 'Частный дом',
  MINI_HOTEL = 'Мини-отель',
  SCOOTER = 'Скутер',
  TOURING = 'Туристический',
  CLASSIC = 'Классика',
  PREPAID = 'Prepaid SIM',
  DATA_ONLY = 'Data Only',
  E_SIM = 'eSIM',
  CASH = 'Наличные',
  CRYPTO = 'Крипто-обмен',
  BANK_TRANSFER = 'Перевод',
}

export enum ModerationStatus {
  PENDING = 'На модерации',
  APPROVED = 'Одобрен',
  REJECTED = 'Отклонён',
  EXPIRED = 'Срок истёк',
}

export interface Review {
  id: string;
  username: string;
  rating: number;
  text: string;
  date: number;
}

export interface Listing {
  id: string;
  category: ListingCategory;
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
  distanceToSea?: number;
  engineCapacity?: string;
  dataVolume?: string;
  validityPeriod?: string;
  exchangeRates?: string;
  workingHours?: string;
  maxGuests?: number;
  amenities: string[];
  images: string[];
  status: ModerationStatus;
  rejectionReason?: string;
  createdAt: number;
  isVerified: boolean;
  isFeatured: boolean;
  rating: number;
  reviews: Review[];
}

export interface User {
  id: string;
  username: string;
  role: 'guest' | 'owner' | 'admin';
  isBanned?: boolean; // New field for admin control
}

export interface FilterState {
  search: string;
  type: string;
  minPrice: string;
  maxPrice: string;
  maxDistance: string;
  region: string;
  city: string;
  category: ListingCategory;
}
