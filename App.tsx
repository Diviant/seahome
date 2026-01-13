
import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { Listing, PropertyType, ModerationStatus, User, Review, ListingCategory } from './types';
import { Icons } from './constants';
import WelcomePage from './pages/WelcomePage';
import RegionSelectionPage from './pages/RegionSelectionPage';
import CitySelectionPage from './pages/CitySelectionPage';
import CatalogPage from './pages/CatalogPage';
import PropertyDetailsPage from './pages/PropertyDetailsPage';
import OwnerDashboardPage from './pages/OwnerDashboardPage';
import AddPropertyPage from './pages/AddPropertyPage';
import AdminPanelPage from './pages/AdminPanelPage';

const CURRENT_USER_ID = 'user_123';
const ADMIN_PASSWORD = 'admin'; // Пароль по умолчанию

const REAL_ADS_DATA = [
  {
    title: 'Апартаменты "ORBI City" High Level',
    city: 'Батуми', region: 'Грузия', type: PropertyType.MINI_HOTEL,
    price: 4500, dist: 50, guests: 3, 
    img: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=800&q=80',
    desc: 'Первая береговая линия. 45 этаж с прямым видом на море.'
  },
  {
    title: 'Bangalow "Rawai Palms"',
    city: 'Пхукет', region: 'Таиланд', type: PropertyType.PRIVATE_HOUSE,
    price: 8200, dist: 150, guests: 2,
    img: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=800&q=80',
    desc: 'Уютное бунгало в тропическом саду.'
  }
];

const REAL_MOTO_DATA = [
  {
    title: 'Honda PCX 160 (2023)',
    city: 'Пхукет', region: 'Таиланд', type: PropertyType.SCOOTER,
    price: 1200, engine: '160cc',
    img: 'https://images.unsplash.com/photo-1558981403-c5f9199a28cd?auto=format&fit=crop&w=800&q=80',
    desc: 'Идеальный скутер для острова. Новое состояние, низкий пробег.'
  }
];

const REAL_EXCHANGE_DATA = [
  {
    title: 'Phuket Cash Exchange (P2P)',
    city: 'Пхукет', region: 'Таиланд', type: PropertyType.CASH,
    price: 0, rates: 'RUB -> THB (0.38) | USDT -> THB (34.2)', hours: '10:00 - 22:00',
    img: 'https://images.unsplash.com/photo-1580519542036-c47de6196ba5?auto=format&fit=crop&w=800&q=80',
    desc: 'Надежный обмен наличных в Раваи и Патонге. Доставка курьером.'
  }
];

const generateInitialData = (): Listing[] => {
  const stays = REAL_ADS_DATA.map((ad, i) => ({
    id: `stay-${i}`,
    category: ListingCategory.STAY,
    ownerId: i === 0 ? CURRENT_USER_ID : `owner-${i}`,
    ownerUsername: i === 0 ? 'traveler_pro' : 'sea_host_88',
    title: ad.title,
    description: ad.desc,
    type: ad.type,
    country: ad.region === 'Грузия' ? 'Грузия' : 'Таиланд',
    region: ad.region,
    city: ad.city,
    address: 'Seafront Blvd, ' + (i + 1),
    pricePerNight: ad.price,
    distanceToSea: ad.dist,
    maxGuests: ad.guests,
    amenities: ['Wi-Fi', 'Кондиционер'],
    images: [ad.img],
    status: ModerationStatus.APPROVED,
    createdAt: Date.now(),
    isVerified: true,
    isFeatured: true,
    rating: 4.8,
    reviews: []
  }));

  const motos = REAL_MOTO_DATA.map((ad, i) => ({
    id: `moto-${i}`,
    category: ListingCategory.MOTO,
    ownerId: CURRENT_USER_ID,
    ownerUsername: 'traveler_pro',
    title: ad.title,
    description: ad.desc,
    type: ad.type,
    country: 'Зарубежье',
    region: ad.region,
    city: ad.city,
    address: 'Rental Hub, Main Road',
    pricePerNight: ad.price,
    engineCapacity: ad.engine,
    amenities: ['Шлем', 'Страховка'],
    images: [ad.img],
    status: ModerationStatus.APPROVED,
    createdAt: Date.now(),
    isVerified: true,
    isFeatured: true,
    rating: 4.9,
    reviews: []
  }));

  const exchange = REAL_EXCHANGE_DATA.map((ad, i) => ({
    id: `ex-${i}`,
    category: ListingCategory.EXCHANGE,
    ownerId: i === 0 ? CURRENT_USER_ID : `ex-owner-${i}`,
    ownerUsername: i === 0 ? 'traveler_pro' : 'ex_change_ninja',
    title: ad.title,
    description: ad.desc,
    type: ad.type,
    country: 'Зарубежье',
    region: ad.region,
    city: ad.city,
    address: 'City Center / Delivery',
    pricePerNight: ad.price,
    exchangeRates: ad.rates,
    workingHours: ad.hours,
    amenities: ['Курьер', 'Безопасно', 'Лучший курс'],
    images: [ad.img],
    status: ModerationStatus.APPROVED,
    createdAt: Date.now(),
    isVerified: true,
    isFeatured: true,
    rating: 4.9,
    reviews: []
  }));

  return [...stays, ...motos, ...exchange];
};

const AdminLogin: React.FC<{ onConfirm: (pass: string) => void, onCancel: () => void }> = ({ onConfirm, onCancel }) => {
  const [pass, setPass] = useState('');
  const [error, setError] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pass === ADMIN_PASSWORD) {
      onConfirm(pass);
    } else {
      setError(true);
      setTimeout(() => setError(false), 500);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] bg-[#020617]/90 backdrop-blur-2xl flex items-center justify-center p-8 animate-in fade-in duration-300">
      <div className={`w-full max-w-sm bg-slate-900 border border-white/10 rounded-[2.5rem] p-8 space-y-8 shadow-2xl transition-transform ${error ? 'animate-shake' : ''}`}>
        <div className="text-center space-y-2">
           <div className="w-16 h-16 bg-cyan-500/10 text-cyan-400 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-cyan-500/20 shadow-inner"><Icons.Filter /></div>
           <h2 className="text-xl font-black text-white uppercase tracking-tighter">Вход в систему</h2>
           <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Требуется подтверждение доступа</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input 
            autoFocus
            type="password" 
            placeholder="Введите код доступа"
            className="w-full bg-slate-950 border border-white/5 rounded-2xl p-5 text-center text-white outline-none focus:border-cyan-500/50 transition-all font-mono tracking-widest shadow-inner"
            value={pass}
            onChange={(e) => setPass(e.target.value)}
          />
          {error && <p className="text-rose-500 text-[9px] font-black uppercase text-center animate-pulse">Неверный пароль</p>}
          <div className="flex space-x-3">
            <button type="button" onClick={onCancel} className="flex-1 py-4 bg-white/5 text-slate-400 rounded-2xl font-black uppercase text-[10px] tracking-widest">Отмена</button>
            <button type="submit" className="flex-1 py-4 bg-cyan-500 text-black rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-lg shadow-cyan-500/30">Войти</button>
          </div>
        </form>
      </div>
    </div>
  );
};

const Navigation: React.FC<{ user: User }> = ({ user }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const handleSearchClick = () => navigate('/regions');
  const navItems = [
    { id: 'catalog', path: '/regions', label: 'Поиск', icon: <Icons.Search />, onClick: handleSearchClick },
    { id: 'dashboard', path: '/dashboard', label: 'Кабинет', icon: <Icons.User /> },
  ];
  if (user.role === 'admin') navItems.push({ id: 'admin', path: '/admin', label: 'Админ', icon: <Icons.Plus /> });

  return (
    <div className="fixed bottom-6 left-0 right-0 z-[60] px-8 safe-bottom pointer-events-none">
      <nav className="max-w-[280px] mx-auto bg-slate-900/80 backdrop-blur-3xl border border-white/10 rounded-[2.5rem] flex justify-around items-center h-18 p-1.5 shadow-[0_20px_40px_rgba(0,0,0,0.6)] pointer-events-auto">
        {navItems.map((item) => {
          const isActive = location.pathname.startsWith(item.path) || (item.id === 'catalog' && (location.pathname === '/' || location.pathname.startsWith('/cities') || location.pathname.startsWith('/catalog')));
          return (
            <button key={item.id} onClick={item.onClick || (() => navigate(item.path))} className={`relative flex flex-col items-center justify-center w-full h-14 space-y-1 transition-all duration-500 rounded-3xl ${isActive ? 'text-cyan-400' : 'text-slate-500'}`}>
              <div className={`transition-all duration-500 transform ${isActive ? 'scale-110 -translate-y-0.5' : ''}`}>{item.icon}</div>
              <span className={`text-[8px] font-black uppercase tracking-[0.2em] transition-all duration-500 ${isActive ? 'opacity-100' : 'opacity-40'}`}>{item.label}</span>
              {isActive && <div className="absolute -bottom-1 w-1 h-1 bg-cyan-400 rounded-full shadow-[0_0_12px_rgba(34,211,238,1)] animate-pulse"></div>}
            </button>
          );
        })}
      </nav>
    </div>
  );
};

const Header: React.FC<{ currentUser: User, onRoleChange: (r: 'guest'|'owner'|'admin') => void }> = ({ currentUser, onRoleChange }) => {
  const navigate = useNavigate();
  return (
    <header className="px-5 py-5 bg-[#020617]/80 backdrop-blur-xl border-b border-white/5 flex items-start justify-between sticky top-0 z-40">
      <div onClick={() => navigate('/')} className="flex flex-col cursor-pointer group">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-tr from-cyan-600 to-teal-400 rounded-xl flex items-center justify-center text-white shadow-lg shadow-cyan-900/40 group-active:scale-95 transition-transform"><Icons.Waves /></div>
          <div>
            <h1 className="font-extrabold text-lg text-white leading-none">SeaHome</h1>
            <span className="text-[8px] font-black text-cyan-400 uppercase tracking-widest block mt-1">Coastal</span>
          </div>
        </div>
      </div>
      <div className="flex flex-col items-end space-y-1">
        <span className="text-[7px] font-black text-slate-500 uppercase tracking-widest">Ваша роль:</span>
        <select 
          className="text-[10px] font-black uppercase tracking-wider bg-slate-900 text-cyan-400 px-4 py-2 rounded-xl border border-cyan-500/20 outline-none shadow-2xl appearance-none cursor-pointer active:scale-95 transition-all" 
          value={currentUser.role} 
          onChange={(e) => onRoleChange(e.target.value as any)}
        >
          <option value="guest">Гость 👋</option>
          <option value="owner">Владелец 🔑</option>
          <option value="admin">Админ ⚡</option>
        </select>
      </div>
    </header>
  );
};

const App: React.FC = () => {
  const [listings, setListings] = useState<Listing[]>(() => {
    const saved = localStorage.getItem('seahome_listings_v13');
    return saved ? JSON.parse(saved) : generateInitialData();
  });
  
  const [users, setUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem('seahome_users_v1');
    if (saved) return JSON.parse(saved);
    return [
      { id: CURRENT_USER_ID, username: 'traveler_pro', role: 'guest' },
      { id: 'owner-1', username: 'sea_host_88', role: 'owner' },
      { id: 'ex-owner-0', username: 'ex_change_ninja', role: 'owner' }
    ];
  });

  const [currentUser, setCurrentUser] = useState<User>(() => users.find(u => u.id === CURRENT_USER_ID) || users[0]);
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(() => sessionStorage.getItem('isAdminAuth') === 'true');

  useEffect(() => {
    localStorage.setItem('seahome_listings_v13', JSON.stringify(listings));
  }, [listings]);

  useEffect(() => {
    localStorage.setItem('seahome_users_v1', JSON.stringify(users));
  }, [users]);

  const addListing = (l: Listing) => setListings(prev => [l, ...prev]);
  const updateListing = (l: Listing) => setListings(prev => prev.map(item => item.id === l.id ? l : item));
  const deleteListing = (id: string) => setListings(prev => prev.filter(l => l.id !== id));
  
  const toggleUserBan = (userId: string) => {
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, isBanned: !u.isBanned } : u));
  };

  const handleRoleChange = (newRole: 'guest'|'owner'|'admin') => {
    if (newRole === 'admin' && !isAdminAuthenticated) {
      setShowAdminLogin(true);
    } else {
      setCurrentUser({...currentUser, role: newRole});
    }
  };

  const confirmAdminAuth = () => {
    setIsAdminAuthenticated(true);
    sessionStorage.setItem('isAdminAuth', 'true');
    setCurrentUser({...currentUser, role: 'admin'});
    setShowAdminLogin(false);
  };

  const handleAddReview = (listingId: string, review: Omit<Review, 'id' | 'date'>) => {
    setListings(prev => prev.map(l => {
      if (l.id === listingId) {
        const newReview: Review = { ...review, id: Math.random().toString(36).substr(2, 9), date: Date.now() };
        const updatedReviews = [newReview, ...l.reviews];
        const newAvg = updatedReviews.reduce((acc, curr) => acc + curr.rating, 0) / updatedReviews.length;
        return { ...l, reviews: updatedReviews, rating: Number(newAvg.toFixed(1)) };
      }
      return l;
    }));
  };

  const location = useLocation();
  const isWelcomePage = location.pathname === '/';

  return (
    <div className="min-h-screen max-w-md mx-auto bg-[#020617] shadow-[0_0_80px_rgba(0,0,0,1)] relative overflow-x-hidden text-slate-100 font-sans">
      {!isWelcomePage && <Header currentUser={currentUser} onRoleChange={handleRoleChange} />}
      
      {showAdminLogin && <AdminLogin onConfirm={confirmAdminAuth} onCancel={() => setShowAdminLogin(false)} />}
      
      <main className={!isWelcomePage ? "pb-36" : ""}>
        {currentUser.isBanned && (
           <div className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-xl flex flex-col items-center justify-center p-10 text-center space-y-6">
              <div className="w-20 h-20 bg-rose-500/20 text-rose-500 rounded-full flex items-center justify-center animate-pulse"><Icons.User /></div>
              <h2 className="text-2xl font-black text-white">Ваш аккаунт заблокирован</h2>
              <p className="text-slate-400 text-sm">Вы были заблокированы администратором за нарушение правил платформы.</p>
              <button onClick={() => window.location.reload()} className="bg-white text-black px-10 py-4 rounded-2xl font-bold uppercase text-xs">Обновить</button>
           </div>
        )}
        <Routes>
          <Route path="/" element={<WelcomePage properties={listings} />} />
          <Route path="/regions" element={<RegionSelectionPage />} />
          <Route path="/cities/:region" element={<CitySelectionPage properties={listings} />} />
          <Route path="/catalog/:region/:city" element={<CatalogPage properties={listings.filter(p => p.status === ModerationStatus.APPROVED)} />} />
          <Route path="/property/:id" element={<PropertyDetailsPage properties={listings} user={currentUser} onAddReview={handleAddReview} />} />
          <Route path="/dashboard" element={<OwnerDashboardPage properties={listings.filter(p => p.ownerId === currentUser.id)} />} />
          <Route path="/add" element={<AddPropertyPage user={currentUser} onAdd={addListing} />} />
          <Route path="/admin" element={
            currentUser.role === 'admin' && isAdminAuthenticated 
            ? <AdminPanelPage properties={listings} users={users} onUpdate={updateListing} onDelete={deleteListing} onToggleBan={toggleUserBan} />
            : <div className="p-20 text-center opacity-30 text-xs font-black uppercase tracking-widest">Доступ запрещен</div>
          } />
        </Routes>
      </main>
      {!isWelcomePage && <Navigation user={currentUser} />}
      
      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-10px); }
          75% { transform: translateX(10px); }
        }
        .animate-shake { animation: shake 0.2s ease-in-out 0s 2; }
      `}</style>
    </div>
  );
};

export default () => (
  <HashRouter>
    <App />
  </HashRouter>
);
