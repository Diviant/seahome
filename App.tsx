
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

// Демо-данные для генерации
const generateInitialData = (): Listing[] => {
  // ... (логика генерации из предыдущей версии остается неизменной для краткости)
  // В реальном коде здесь были бы REAL_ADS_DATA и прочие
  return []; // Заглушка, данные будут подгружены из localStorage
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
  const [showRoleMenu, setShowRoleMenu] = useState(false);

  return (
    <header className="px-5 py-5 bg-[#020617]/80 backdrop-blur-xl border-b border-white/5 flex items-center justify-between sticky top-0 z-40">
      <div onClick={() => navigate('/')} className="flex items-center space-x-3 cursor-pointer group">
        <div className="w-10 h-10 bg-gradient-to-tr from-cyan-600 to-teal-400 rounded-xl flex items-center justify-center text-white shadow-lg shadow-cyan-900/40 group-active:scale-95 transition-transform"><Icons.Waves /></div>
        <div className="hidden xs:block">
          <h1 className="font-extrabold text-lg text-white leading-none tracking-tight">SeaHome</h1>
          <span className="text-[7px] font-black text-cyan-400 uppercase tracking-[0.2em] block mt-1 opacity-70">Coastal</span>
        </div>
      </div>

      <div className="relative">
        <button 
          onClick={() => setShowRoleMenu(!showRoleMenu)}
          className="flex items-center space-x-3 bg-white/5 hover:bg-white/10 p-1.5 pr-4 rounded-2xl border border-white/5 transition-all active:scale-95"
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
          <div className="absolute top-full right-0 mt-3 w-48 bg-slate-900 border border-white/10 rounded-3xl p-2 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
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
  const [listings, setListings] = useState<Listing[]>(() => {
    const saved = localStorage.getItem('seahome_listings_v15');
    return saved ? JSON.parse(saved) : []; // В реальности здесь генерация дефолтных
  });
  
  const [users, setUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem('seahome_users_v2');
    return saved ? JSON.parse(saved) : [];
  });

  const [currentUser, setCurrentUser] = useState<User>(() => {
    // Попытка получить данные из Telegram
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
    return { id: 'dev_user', username: 'traveler_dev', role: 'guest' };
  });

  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(() => sessionStorage.getItem('isAdminAuth') === 'true');

  useEffect(() => {
    // Инициализация Telegram WebApp
    const tg = (window as any).Telegram?.WebApp;
    if (tg) {
      tg.expand();
      tg.ready();
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('seahome_listings_v15', JSON.stringify(listings));
  }, [listings]);

  useEffect(() => {
    localStorage.setItem('seahome_users_v2', JSON.stringify(users));
  }, [users]);

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
    <div className="min-h-screen max-w-md mx-auto bg-[#020617] shadow-[0_0_80px_rgba(0,0,0,1)] relative overflow-x-hidden text-slate-100 font-sans">
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
          <Route path="/add" element={<AddPropertyPage user={currentUser} onAdd={(l) => setListings([l, ...listings])} />} />
          <Route path="/admin" element={<AdminPanelPage properties={listings} users={users} onUpdate={(l) => setListings(listings.map(item => item.id === l.id ? l : item))} onDelete={(id) => setListings(listings.filter(l => l.id !== id))} onToggleBan={() => {}} />} />
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
