
import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { Property, PropertyType, ModerationStatus, User } from './types';
import { Icons, REGIONS, CITIES_BY_REGION } from './constants';
import CatalogPage from './pages/CatalogPage';
import PropertyDetailsPage from './pages/PropertyDetailsPage';
import OwnerDashboardPage from './pages/OwnerDashboardPage';
import AddPropertyPage from './pages/AddPropertyPage';
import AdminPanelPage from './pages/AdminPanelPage';

const IMAGE_POOL = [
  '1512917774080-9991f1c4c750', '1613490493576-7fde63acd811', '1566073771259-6a8506099945',
  '1522708323590-d24dbb6b0267', '1582719478250-c89cae4dc85b', '1542314831-068cd1dbfeeb',
  '1499793983690-e29da59ef1c2', '1520250497591-112f2f40a3f4', '1510798831971-661eb04b3739',
  '1571019613454-1cb2f99b2d8b', '1480074568708-e7b720bb3f09', '1502672260266-1c1ef2d93688',
  '1543967354-33415c912b60', '1600585154340-be6161a56a0c', '1600596542815-ffad4c1539a9',
  '1600607687920-4e2a09cf159d', '1600566753190-17f09a5569d6', '1600571407430-22b1b238b7ac',
  '1600210492486-724fe5c67fb0', '1600566753086-00f18fb6b3ea', '1515362778563-6a8d0e44bc0b',
  '1564013799919-ab600027ffc6', '1570129477492-45c003edd2be', '1583608205776-bfd35f0d9f83',
  '1598228723793-52759bba239c', '1580587767513-39983122c441', '1572120339574-63895136b273',
  '1568605114967-8130f3a36994', '1576013551627-0cc20b96c2a7', '1512915920307-444f6b01e40b'
];

const generateMockProperties = (count: number): Property[] => {
  const types = Object.values(PropertyType);
  const amenitiesPool = ['Wi-Fi', 'Кондиционер', 'Кухня', 'Парковка', 'Бассейн', 'Мангал', 'Трансфер', 'Детская площадка'];
  const results: Property[] = [];

  for (let i = 1; i <= count; i++) {
    const region = REGIONS[Math.floor(Math.random() * REGIONS.length)];
    const cities = CITIES_BY_REGION[region] || ['Центр'];
    const city = cities[Math.floor(Math.random() * cities.length)];
    const type = types[Math.floor(Math.random() * types.length)];
    const distance = region === 'Кавказские Минеральные Воды' ? 0 : Math.floor(Math.random() * 800) + 50;
    const price = Math.floor(Math.random() * 7000) + 1500;
    const guests = Math.floor(Math.random() * 6) + 2;
    const numAmenities = Math.floor(Math.random() * 4) + 3;
    const amenities = [...amenitiesPool].sort(() => 0.5 - Math.random()).slice(0, numAmenities);
    const shuffledImagePool = [...IMAGE_POOL].sort(() => 0.5 - Math.random());
    const propertyImages = shuffledImagePool.slice(0, 2 + Math.floor(Math.random() * 2)).map(id => 
      `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=800&q=80`
    );

    results.push({
      id: `gen-${i}`,
      ownerId: `owner-${Math.floor(i / 10)}`,
      ownerUsername: `user_host_${i}`,
      title: `${type} "${['Альбатрос', 'Уют', 'Прибой', 'Маяк', 'Берег', 'Жемчужина', 'Ривьера', 'Сказка', 'Лазурь', 'Бриз', 'Горизонт', 'Тихая Гавань'][Math.floor(Math.random() * 12)]} ${i}"`,
      description: `Превосходный ${type.toLowerCase()} в самом сердце курортного города ${city}. Здесь вас ждет уютная атмосфера, современный интерьер и всё необходимое для отдыха.`,
      type,
      country: region === 'Турция' ? 'Турция' : region === 'Грузия' ? 'Грузия' : region === 'Абхазия' ? 'Абхазия' : 'Россия',
      region,
      city,
      address: `ул. Приморская, ${Math.floor(Math.random() * 150) + 1}`,
      pricePerNight: price,
      distanceToSea: distance,
      maxGuests: guests,
      amenities,
      images: propertyImages,
      status: ModerationStatus.APPROVED,
      createdAt: Date.now() - (Math.random() * 1000000000),
      isVerified: Math.random() > 0.6,
      isFeatured: Math.random() > 0.8,
    });
  }
  return results;
};

const INITIAL_PROPERTIES: Property[] = [
  {
    id: 'h1',
    ownerId: 'owner1',
    ownerUsername: 'sochi_host',
    title: 'Вилла "Морской Бриз"',
    description: 'Роскошная вилла с панорамным видом на Черное море. Просторные террасы, зона барбекю и уединенная атмосфера для идеального отдыха.',
    type: PropertyType.PRIVATE_HOUSE,
    country: 'Россия',
    region: 'Краснодарский край',
    city: 'Сочи',
    address: 'ул. Курортный проспект, 84',
    pricePerNight: 8500,
    distanceToSea: 150,
    maxGuests: 6,
    amenities: ['Wi-Fi', 'Кондиционер', 'Кухня', 'Парковка', 'Бассейн', 'Мангал'],
    images: [
        'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80', 
        'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=800&q=80'
    ],
    status: ModerationStatus.APPROVED,
    createdAt: Date.now(),
    isVerified: true,
    isFeatured: true,
  },
  ...generateMockProperties(20)
];

const Navigation: React.FC<{ user: User }> = ({ user }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { id: 'catalog', path: '/', label: 'Поиск', icon: <Icons.Search /> },
    { id: 'dashboard', path: '/dashboard', label: 'Кабинет', icon: <Icons.User /> },
  ];

  if (user.role === 'admin') {
    navItems.push({ id: 'admin', path: '/admin', label: 'Админ', icon: <Icons.Plus /> });
  }

  return (
    <div className="fixed bottom-6 left-0 right-0 z-[60] px-8 safe-bottom pointer-events-none">
      <nav className="max-w-[280px] mx-auto bg-slate-900/80 backdrop-blur-3xl border border-white/10 rounded-[2.5rem] flex justify-around items-center h-18 p-1.5 shadow-[0_20px_40px_rgba(0,0,0,0.6)] pointer-events-auto">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <button
              key={item.id}
              onClick={() => navigate(item.path)}
              className={`relative flex flex-col items-center justify-center w-full h-14 space-y-1 transition-all duration-500 rounded-3xl ${
                isActive ? 'text-cyan-400' : 'text-slate-500'
              }`}
            >
              <div className={`transition-all duration-500 transform ${isActive ? 'scale-110 -translate-y-0.5' : ''}`}>
                  {item.icon}
              </div>
              <span className={`text-[8px] font-black uppercase tracking-[0.2em] transition-all duration-500 ${isActive ? 'opacity-100' : 'opacity-40'}`}>
                {item.label}
              </span>
              {isActive && (
                <div className="absolute -bottom-1 w-1 h-1 bg-cyan-400 rounded-full shadow-[0_0_12px_rgba(34,211,238,1)] animate-pulse"></div>
              )}
            </button>
          );
        })}
      </nav>
    </div>
  );
};

const Header: React.FC<{ currentUser: User, setCurrentUser: (u: User) => void }> = ({ currentUser, setCurrentUser }) => {
  const navigate = useNavigate();
  return (
    <header className="px-5 py-5 bg-[#020617]/80 backdrop-blur-xl border-b border-white/5 flex items-center justify-between sticky top-0 z-40">
      <div onClick={() => navigate('/')} className="flex items-center space-x-3 cursor-pointer">
        <div className="w-10 h-10 bg-gradient-to-tr from-cyan-600 to-teal-400 rounded-xl flex items-center justify-center text-white shadow-lg shadow-cyan-900/40">
          <Icons.Waves />
        </div>
        <div>
          <h1 className="font-extrabold text-lg text-white leading-none">SeaHome</h1>
          <span className="text-[8px] font-black text-cyan-400 uppercase tracking-widest block mt-1">Coastal</span>
        </div>
      </div>
      <select 
        className="text-[10px] font-black uppercase tracking-wider bg-white/5 text-cyan-100 px-3 py-2 rounded-xl border border-white/10 outline-none"
        value={currentUser.role}
        onChange={(e) => setCurrentUser({...currentUser, role: e.target.value as any})}
      >
        <option value="guest">Гость</option>
        <option value="owner">Хозяин</option>
        <option value="admin">Админ</option>
      </select>
    </header>
  );
};

const App: React.FC = () => {
  const [properties, setProperties] = useState<Property[]>(() => {
    try {
      const saved = localStorage.getItem('seahome_properties_v2');
      return saved ? JSON.parse(saved) : INITIAL_PROPERTIES;
    } catch (e) {
      console.error("Storage error:", e);
      return INITIAL_PROPERTIES;
    }
  });

  const [currentUser, setCurrentUser] = useState<User>({
    id: 'user_123',
    username: 'traveler_pro',
    role: 'guest', 
  });

  useEffect(() => {
    localStorage.setItem('seahome_properties_v2', JSON.stringify(properties));
  }, [properties]);

  const addProperty = (newProp: Property) => {
    setProperties((prev) => [newProp, ...prev]);
  };

  const updateProperty = (updatedProp: Property) => {
    setProperties((prev) => prev.map(p => p.id === updatedProp.id ? updatedProp : p));
  };

  return (
    <HashRouter>
      <div className="min-h-screen max-w-md mx-auto bg-[#020617] shadow-[0_0_80px_rgba(0,0,0,1)] relative overflow-x-hidden text-slate-100 font-sans">
        <Header currentUser={currentUser} setCurrentUser={setCurrentUser} />

        <main className="pb-36">
          <Routes>
            <Route path="/" element={<CatalogPage properties={properties.filter(p => p.status === ModerationStatus.APPROVED)} />} />
            <Route path="/property/:id" element={<PropertyDetailsPage properties={properties} />} />
            <Route path="/dashboard" element={<OwnerDashboardPage properties={properties.filter(p => p.ownerId === currentUser.id)} />} />
            <Route path="/add" element={<AddPropertyPage user={currentUser} onAdd={addProperty} />} />
            <Route path="/admin" element={<AdminPanelPage properties={properties} onUpdate={updateProperty} />} />
          </Routes>
        </main>

        <Navigation user={currentUser} />
      </div>
    </HashRouter>
  );
};

export default App;
