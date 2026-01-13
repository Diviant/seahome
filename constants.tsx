
import React from 'react';

export const AMENITIES = [
  'Wi-Fi', 'Кондиционер', 'Кухня', 'Парковка', 'Бассейн', 
  'С животными', 'Детская площадка', 'Мангал', 'Трансфер'
];

export const REGIONS = [
  'Крым', 'Краснодарский край', 'Кавказские Минеральные Воды', 
  'Абхазия', 'Турция', 'Грузия', 'Индия', 
  'Таиланд', 'Малайзия', 'Индонезия', 'ОАЭ', 'Египет', 'Вьетнам'
];

export const REGION_METADATA: Record<string, { image: string, tag: string }> = {
  'Крым': { 
    image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=600&q=80',
    tag: 'Дворцы и горы'
  },
  'Краснодарский край': { 
    image: 'https://images.unsplash.com/photo-1543967354-33415c912b60?auto=format&fit=crop&w=600&q=80',
    tag: 'Центр отдыха'
  },
  'Кавказские Минеральные Воды': { 
    image: 'https://images.unsplash.com/photo-1583608205776-bfd35f0d9f83?auto=format&fit=crop&w=600&q=80',
    tag: 'Здоровье и релакс'
  },
  'Абхазия': { 
    image: 'https://images.unsplash.com/photo-1510798831971-661eb04b3739?auto=format&fit=crop&w=600&q=80',
    tag: 'Душа Кавказа'
  },
  'Турция': { 
    image: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=600&q=80',
    tag: 'Все включено'
  },
  'Грузия': { 
    image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=600&q=80',
    tag: 'Вино и гостеприимство'
  },
  'Индия': {
    image: 'https://images.unsplash.com/photo-1512100356956-c1227c331f01?auto=format&fit=crop&w=600&q=80',
    tag: 'Йога и океан'
  },
  'Таиланд': {
    image: 'https://images.unsplash.com/photo-1528181304800-259b08848526?auto=format&fit=crop&w=600&q=80',
    tag: 'Острова и Будда'
  },
  'Малайзия': {
    image: 'https://images.unsplash.com/photo-1540664861053-dac6a3a12555?auto=format&fit=crop&w=600&q=80',
    tag: 'Джунгли и небоскребы'
  },
  'Индонезия': {
    image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=600&q=80',
    tag: 'Серфинг на Бали'
  },
  'ОАЭ': {
    image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=600&q=80',
    tag: 'Роскошь будущего'
  },
  'Египет': {
    image: 'https://images.unsplash.com/photo-1539768942893-daf53e448371?auto=format&fit=crop&w=600&q=80',
    tag: 'Тайны Красного моря'
  },
  'Вьетнам': {
    image: 'https://images.unsplash.com/photo-1504457047772-27faf1c00561?auto=format&fit=crop&w=600&q=80',
    tag: 'Азиатский уют'
  }
};

export const CITIES_BY_REGION: Record<string, string[]> = {
  'Крым': ['Ялта', 'Севастополь', 'Алушта', 'Евпатория', 'Феодосия', 'Судак'],
  'Краснодарский край': ['Сочи', 'Адлер', 'Анапа', 'Геленджик', 'Новороссийск', 'Туапсе'],
  'Кавказские Минеральные Воды': ['Пятигорск', 'Кисловодск', 'Ессентуки', 'Железноводск', 'Минеральные Воды', 'Лермонтов'],
  'Абхазия': ['Гагра', 'Пицунда', 'Новый Афон', 'Сухум'],
  'Турция': ['Анталья', 'Аланья', 'Кемер', 'Мармарис', 'Бодрум', 'Фетхие'],
  'Грузия': ['Батуми', 'Кобулети', 'Сарпи'],
  'Индия': ['Гоа', 'Варкала', 'Гокарна'],
  'Таиланд': ['Пхукет', 'Самуи', 'Паттайя', 'Панган', 'Краби'],
  'Малайзия': ['Лангкави', 'Пенанг', 'Кота-Кинабалу'],
  'Индонезия': ['Чангу', 'Убуд', 'Улувату', 'Семиньяк', 'Нуса-Дуа'],
  'ОАЭ': ['Дубай', 'Абу-Даби', 'Шарджа', 'Рас-эль-Хайма'],
  'Египет': ['Шарм-эш-Шейх', 'Хургада', 'Дахаб', 'Марса-Алам'],
  'Вьетнам': ['Нячанг', 'Дананг', 'Фукуок', 'Муйне']
};

export const Icons = {
  Search: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
  ),
  Home: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
  ),
  Plus: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
  ),
  User: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
  ),
  MapPin: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
  ),
  Waves: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M2 6c.6.5 1.2 1 2.5 1C7 7 7 5 9.5 5c2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1"/><path d="M2 12c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1"/><path d="M2 18c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1"/></svg>
  ),
  Filter: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg>
  )
};
