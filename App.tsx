
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

const ADMIN_PASSWORD = 'admin';

const generateInitialData = (): Listing[] => {
  const data: Listing[] = [
    // ГРУЗИЯ - БАТУМИ
    {
      id: 'st-bat-1', category: ListingCategory.STAY, ownerId: 'system', ownerUsername: 'seahome_official',
      title: 'ORBI City Sea View Towers', description: 'Апартаменты на 35 этаже с прямым видом на море. Дизайнерский ремонт, полный комплект техники. Лучшее место в Батуми.',
      type: PropertyType.MINI_HOTEL, country: 'Грузия', region: 'Грузия', city: 'Батуми', address: 'Шерифа Химшиашвили, 7',
      pricePerNight: 4500, distanceToSea: 50, maxGuests: 2, amenities: ['Wi-Fi', 'Кондиционер', 'Кухня', 'Трансфер'],
      images: ['https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=800&q=80'],
      status: ModerationStatus.APPROVED, createdAt: Date.now(), isVerified: true, isFeatured: true, rating: 4.9, reviews: []
    },
    {
      id: 'fd-bat-1', category: ListingCategory.FOOD, ownerId: 'system', ownerUsername: 'batumi_gastronomy',
      title: 'Fanfan Restaurant', description: 'Аутентичный ресторан в старом городе. Лучшие хинкали и аджарский хачапури по старинным рецептам.',
      type: PropertyType.RESTAURANT, country: 'Грузия', region: 'Грузия', city: 'Батуми', address: 'ул. Ниношвили, 27',
      pricePerNight: 0, averageBill: 1200, cuisineType: 'Грузинская', workingHours: '11:00 - 23:00',
      amenities: ['Терраса', 'Винная карта', 'Wi-Fi'], images: ['https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80'],
      status: ModerationStatus.APPROVED, createdAt: Date.now(), isVerified: true, isFeatured: true, rating: 4.8, reviews: []
    },
    {
      id: 'sm-bat-1', category: ListingCategory.SIM, ownerId: 'system', ownerUsername: 'connect_ge',
      title: 'Magti Unlimited Data', description: 'Туристическая сим-карта с безлимитным интернетом по всей Грузии. Активация за 5 минут.',
      type: PropertyType.PREPAID, country: 'Грузия', region: 'Грузия', city: 'Батуми', address: 'Доставка в аэропорт или отель',
      pricePerNight: 900, dataVolume: 'Безлимит', validityPeriod: '15 дней', amenities: ['5G', 'Доставка'],
      images: ['https://images.unsplash.com/photo-1562157873-818bc0726f68?auto=format&fit=crop&w=800&q=80'],
      status: ModerationStatus.APPROVED, createdAt: Date.now(), isVerified: true, isFeatured: false, rating: 5.0, reviews: []
    },

    // ТАИЛАНД - ПХУКЕТ
    {
      id: 'st-phu-1', category: ListingCategory.STAY, ownerId: 'system', ownerUsername: 'phuket_rentals',
      title: 'Rawai Sea View Villa', description: 'Приватная вилла с бассейном в 5 минутах от пляжа Най Харн. Идеально для семьи.',
      type: PropertyType.PRIVATE_HOUSE, country: 'Зарубежье', region: 'Таиланд', city: 'Пхукет', address: 'Soi Naya, Rawai',
      pricePerNight: 12500, distanceToSea: 800, maxGuests: 6, amenities: ['Бассейн', 'Парковка', 'Мангал', 'Кухня'],
      images: ['https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80'],
      status: ModerationStatus.APPROVED, createdAt: Date.now(), isVerified: true, isFeatured: true, rating: 4.7, reviews: []
    },
    {
      id: 'mo-phu-1', category: ListingCategory.MOTO, ownerId: 'system', ownerUsername: 'bike_rent_phuket',
      title: 'Honda PCX 160 (2024)', description: 'Абсолютно новые байки. Без залога паспорта, только копия. Шлемы включены в стоимость.',
      type: PropertyType.SCOOTER, country: 'Зарубежье', region: 'Таиланд', city: 'Пхукет', address: 'Rawai Beach Road',
      pricePerNight: 1200, engineCapacity: '160cc', amenities: ['2 Шлема', 'Страховка', 'Багажник'],
      images: ['https://images.unsplash.com/photo-1558981403-c5f9199a28cd?auto=format&fit=crop&w=800&q=80'],
      status: ModerationStatus.APPROVED, createdAt: Date.now(), isVerified: true, isFeatured: true, rating: 5.0, reviews: []
    },
    {
      id: 'ex-phu-1', category: ListingCategory.EXCHANGE, ownerId: 'system', ownerUsername: 'ex_king_phuket',
      title: 'P2P Cash Exchange (RUB/USDT)', description: 'Выдача наличных бат (THB) в обмен на перевод на карту РФ или USDT. Лучший курс в Раваи.',
      type: PropertyType.CASH, country: 'Зарубежье', region: 'Таиланд', city: 'Пхукет', address: 'Доставка курьером по острову',
      pricePerNight: 0, exchangeRates: 'RUB -> THB (0.39) | USDT -> THB (35.2)', workingHours: '10:00 - 22:00',
      amenities: ['Курьер', 'Безопасно', 'Без комиссии'], images: ['https://images.unsplash.com/photo-1580519542036-c47de6196ba5?auto=format&fit=crop&w=800&q=80'],
      status: ModerationStatus.APPROVED, createdAt: Date.now(), isVerified: true, isFeatured: false, rating: 4.9, reviews: []
    },

    // РОССИЯ - СОЧИ
    {
      id: 'st-soch-1', category: ListingCategory.STAY, ownerId: 'system', ownerUsername: 'sochi_host',
      title: 'Гостевой дом "Звездный"', description: 'Уютные номера в Адлере, район Курортного городка. До пляжа 10 минут пешком. Зеленая территория.',
      type: PropertyType.GUEST_HOUSE, country: 'Россия', region: 'Краснодарский край', city: 'Сочи', address: 'ул. Просвещения, 153',
      pricePerNight: 3500, distanceToSea: 450, maxGuests: 3, amenities: ['Кондиционер', 'Парковка', 'Мангал'],
      images: ['https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80'],
      status: ModerationStatus.APPROVED, createdAt: Date.now(), isVerified: true, isFeatured: false, rating: 4.5, reviews: []
    },
    {
      id: 'fd-soch-1', category: ListingCategory.FOOD, ownerId: 'system', ownerUsername: 'sochi_foodie',
      title: 'Хмели & Сунели', description: 'Современная кавказская кухня. Авторские рецепты, камин и панорамный вид на море.',
      type: PropertyType.RESTAURANT, country: 'Россия', region: 'Краснодарский край', city: 'Сочи', address: 'ул. Роз, 57',
      pricePerNight: 0, averageBill: 2500, cuisineType: 'Кавказская', workingHours: '12:00 - 00:00',
      amenities: ['Wi-Fi', 'Детское меню', 'Терраса'], images: ['https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80'],
      status: ModerationStatus.APPROVED, createdAt: Date.now(), isVerified: true, isFeatured: true, rating: 4.6, reviews: []
    }
  ];
  return data;
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
    <div className="fixed inset-0 z-[100] bg-[#020617]/90 backdrop-blur-2xl flex items-center justify-center p-8">
      <div className={`w-full max-w-sm bg-slate-900 border border-white/10 rounded-[2.5rem] p-8 space-y-8 shadow-2xl ${error ? 'animate-shake' : ''}`}>
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
          {error && <p className="text-rose-500 text-[9px] font-black uppercase text-center">Неверный пароль</p>}
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
  const navItems = [
    { id: 'home', path: '/', label: 'Главная', icon: <Icons.Waves /> },
    { id: 'catalog', path: '/regions', label: 'Поиск', icon: <Icons.Search /> },
    { id: 'dashboard', path: '/dashboard', label: 'Кабинет', icon: <Icons.User /> },
  ];
  if (user.role === 'admin') navItems.push({ id: 'admin', path: '/admin', label: 'Админ', icon: <Icons.Plus /> });

  return (
    <div className="fixed bottom-6 left-0 right-0 z-[60] px-8 safe-bottom pointer-events-none">
      <nav className="max-w-[320px] mx-auto bg-slate-900/80 backdrop-blur-3xl border border-white/10 rounded-[2.5rem] flex justify-around items-center h-18 p-1.5 shadow-2xl pointer-events-auto">
        {navItems.map((item) => {
          const isActive = item.path === '/' ? location.pathname === '/' : location.pathname.startsWith(item.path);
          return (
            <button key={item.id} onClick={() => navigate(item.path)} className={`relative flex flex-col items-center justify-center w-full h-14 space-y-1 transition-all rounded-3xl ${isActive ? 'text-cyan-400' : 'text-slate-500'}`}>
              <div className={`transition-all transform ${isActive ? 'scale-110' : ''}`}>{item.icon}</div>
              <span className={`text-[8px] font-black uppercase tracking-[0.2em] transition-all ${isActive ? 'opacity-100' : 'opacity-40'}`}>{item.label}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
};

const Header: React.FC<{ currentUser: User, onRoleChange: (r: 'guest'|'owner'|'admin') => void }> = ({ currentUser, onRoleChange }) => {
  const navigate = useNavigate();
  const [showRoleMenu, setShowRoleMenu] = useState(false);

  return (
    <header className="px-5 py-5 bg-[#020617]/80 backdrop-blur-xl border-b border-white/5 flex items-center justify-between sticky top-0 z-40">
      <div onClick={() => navigate('/')} className="flex items-center space-x-3 cursor-pointer group">
        <div className="w-10 h-10 bg-gradient-to-tr from-cyan-600 to-teal-400 rounded-xl flex items-center justify-center text-white shadow-lg shadow-cyan-900/40 group-active:scale-95 transition-transform"><Icons.Waves /></div>
        <div className="hidden xs:block text-left">
          <h1 className="font-extrabold text-lg text-white leading-none tracking-tight">SeaHome</h1>
          <span className="text-[7px] font-black text-cyan-400 uppercase tracking-[0.2em] block mt-1 opacity-70">Coastal</span>
        </div>
      </div>

      <div className="relative">
        <button 
          onClick={() => setShowRoleMenu(!showRoleMenu)}
          className="flex items-center space-x-3 bg-white/5 p-1.5 pr-4 rounded-2xl border border-white/5 transition-all active:scale-95"
        >
          <div className="w-9 h-9 rounded-xl overflow-hidden bg-slate-800 flex items-center justify-center border border-white/10 ring-2 ring-cyan-500/20">
            {currentUser.photoUrl ? (
              <img src={currentUser.photoUrl} className="w-full h-full object-cover" alt="Profile" />
            ) : (
              <span className="text-white text-xs font-black uppercase">{currentUser.username.charAt(0)}</span>
            )}
          </div>
          <div className="text-left hidden sm:block">
            <p className="text-[10px] font-black text-white leading-none truncate max-w-[80px]">@{currentUser.username}</p>
            <span className="text-[7px] font-bold text-cyan-500 uppercase tracking-widest">{currentUser.role}</span>
          </div>
          <svg className={`w-3 h-3 text-slate-500 transition-transform ${showRoleMenu ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M19 9l-7 7-7-7"/></svg>
        </button>

        {showRoleMenu && (
          <div className="absolute top-full right-0 mt-3 w-48 bg-slate-900 border border-white/10 rounded-3xl p-2 shadow-2xl z-50">
            <div className="px-4 py-3 border-b border-white/5 mb-2">
               <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Переключить роль</p>
            </div>
            {(['guest', 'owner', 'admin'] as const).map(role => (
              <button
                key={role}
                onClick={() => { onRoleChange(role); setShowRoleMenu(false); }}
                className={`w-full text-left px-4 py-3 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all ${
                  currentUser.role === role ? 'bg-cyan-500 text-black' : 'text-slate-400 hover:bg-white/5'
                }`}
              >
                {role === 'guest' ? 'Пользователь 👋' : role === 'owner' ? 'Владелец 🔑' : 'Админ ⚡'}
              </button>
            ))}
          </div>
        )}
      </div>
    </header>
  );
};

const App: React.FC = () => {
  // Используем новую версию ключа для принудительного обновления у пользователя
  const [listings, setListings] = useState<Listing[]>(() => {
    const saved = localStorage.getItem('seahome_listings_v21');
    const parsed = saved ? JSON.parse(saved) : [];
    // Если база пуста — наполняем реальным контентом
    return parsed.length > 0 ? parsed : generateInitialData();
  });
  
  const [users, setUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem('seahome_users_v4');
    if (saved) return JSON.parse(saved);
    return [
      { id: 'admin_sys', username: 'admin', role: 'admin' },
      { id: 'dev_user', username: 'traveler_dev', role: 'guest' }
    ];
  });

  const [currentUser, setCurrentUser] = useState<User>(() => {
    const tg = (window as any).Telegram?.WebApp;
    const tgUser = tg?.initDataUnsafe?.user;

    if (tgUser) {
      return {
        id: `tg_${tgUser.id}`,
        telegramId: tgUser.id,
        username: tgUser.username || `user_${tgUser.id}`,
        firstName: tgUser.first_name,
        lastName: tgUser.last_name,
        photoUrl: tgUser.photo_url,
        role: 'guest'
      };
    }
    return users.find(u => u.username === 'traveler_dev') || users[0];
  });

  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(() => sessionStorage.getItem('isAdminAuth') === 'true');

  useEffect(() => {
    const tg = (window as any).Telegram?.WebApp;
    if (tg) {
      tg.expand();
      tg.ready();
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('seahome_listings_v21', JSON.stringify(listings));
  }, [listings]);

  useEffect(() => {
    localStorage.setItem('seahome_users_v4', JSON.stringify(users));
  }, [users]);

  const addListing = (l: Listing) => setListings(prev => [l, ...prev]);
  const updateListing = (l: Listing) => {
    setListings(prev => prev.map(item => item.id === l.id ? l : item));
  };
  const deleteListing = (id: string) => setListings(prev => prev.filter(l => l.id !== id));
  const resetDatabase = () => {
    if (confirm('Вы уверены? Это удалит все текущие данные и вернет стандартные объявления.')) {
      const fresh = generateInitialData();
      setListings(fresh);
    }
  };
  
  const toggleUserBan = (userId: string) => {
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, isBanned: !u.isBanned } : u));
  };

  const handleRoleChange = (newRole: 'guest'|'owner'|'admin') => {
    if (newRole === 'admin' && !isAdminAuthenticated) {
      setShowAdminLogin(true);
    } else {
      setCurrentUser(prev => ({...prev, role: newRole}));
    }
  };

  const confirmAdminAuth = () => {
    setIsAdminAuthenticated(true);
    sessionStorage.setItem('isAdminAuth', 'true');
    setCurrentUser(prev => ({...prev, role: 'admin'}));
    setShowAdminLogin(false);
  };

  const location = useLocation();
  const isWelcomePage = location.pathname === '/';

  return (
    <div className="min-h-screen max-w-md mx-auto bg-[#020617] shadow-2xl relative overflow-x-hidden text-slate-100 font-sans">
      {!isWelcomePage && <Header currentUser={currentUser} onRoleChange={handleRoleChange} />}
      
      {showAdminLogin && <AdminLogin onConfirm={confirmAdminAuth} onCancel={() => setShowAdminLogin(false)} />}
      
      <main className={!isWelcomePage ? "pb-36" : ""}>
        {currentUser.isBanned && (
           <div className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-xl flex flex-col items-center justify-center p-10 text-center space-y-6">
              <div className="w-20 h-20 bg-rose-500/20 text-rose-500 rounded-full flex items-center justify-center animate-pulse"><Icons.User /></div>
              <h2 className="text-2xl font-black text-white">Доступ ограничен</h2>
              <p className="text-slate-400 text-sm">Ваш аккаунт заблокирован за нарушение правил сервиса.</p>
           </div>
        )}
        <Routes>
          <Route path="/" element={<WelcomePage properties={listings} currentUser={currentUser} />} />
          <Route path="/regions" element={<RegionSelectionPage />} />
          <Route path="/cities/:region" element={<CitySelectionPage properties={listings} />} />
          <Route path="/catalog/:region/:city" element={<CatalogPage properties={listings.filter(p => p.status === ModerationStatus.APPROVED)} />} />
          <Route path="/property/:id" element={<PropertyDetailsPage properties={listings} user={currentUser} onAddReview={() => {}} />} />
          <Route path="/dashboard" element={<OwnerDashboardPage properties={listings.filter(p => p.ownerId === currentUser.id)} />} />
          <Route path="/add" element={<AddPropertyPage user={currentUser} onAdd={addListing} />} />
          <Route path="/admin" element={
            <AdminPanelPage 
              properties={listings} 
              users={users} 
              onUpdate={updateListing} 
              onDelete={deleteListing} 
              onToggleBan={toggleUserBan} 
              onReset={resetDatabase}
            />
          } />
        </Routes>
      </main>
      {!isWelcomePage && <Navigation user={currentUser} />}
    </div>
  );
};

export default () => (
  <HashRouter>
    <App />
  </HashRouter>
);
