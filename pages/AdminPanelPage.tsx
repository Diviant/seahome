
import React, { useState } from 'react';
import { Listing, ModerationStatus, User, PropertyType, ListingCategory } from '../types';
import { Icons, REGIONS } from '../constants';

interface AdminPanelPageProps {
  properties: Listing[];
  users: User[];
  onUpdate: (p: Listing) => void;
  onDelete: (id: string) => void;
  onToggleBan: (userId: string) => void;
}

const AdminPanelPage: React.FC<AdminPanelPageProps> = ({ properties, users, onUpdate, onDelete, onToggleBan }) => {
  const [activeTab, setActiveTab] = useState<'pending' | 'all' | 'users'>('pending');
  const [editingListing, setEditingListing] = useState<Listing | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Состояние для создания нового объекта админом
  const [newListing, setNewListing] = useState<Partial<Listing>>({
    category: ListingCategory.STAY,
    type: PropertyType.GUEST_HOUSE,
    status: ModerationStatus.APPROVED,
    amenities: [],
    images: ['https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80']
  });

  const pending = properties.filter(p => p.status === ModerationStatus.PENDING);
  
  const filteredProperties = properties.filter(p => 
    p.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    p.ownerUsername.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.id === searchQuery
  );

  const filteredUsers = users.filter(u => 
    u.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleApprove = (p: Listing) => {
    onUpdate({ ...p, status: ModerationStatus.APPROVED });
  };

  const handleReject = (p: Listing) => {
    const reason = prompt('Причина отклонения:');
    if (reason) {
      onUpdate({ ...p, status: ModerationStatus.REJECTED, rejectionReason: reason });
    }
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingListing) {
      onUpdate(editingListing);
      setEditingListing(null);
    }
  };

  const handleCreateListing = (e: React.FormEvent) => {
    e.preventDefault();
    const listing: Listing = {
      ...newListing as Listing,
      id: 'admin-' + Math.random().toString(36).substr(2, 9),
      ownerId: 'admin',
      ownerUsername: 'ADMIN_SYSTEM',
      createdAt: Date.now(),
      rating: 0,
      reviews: [],
      isVerified: true,
      isFeatured: false,
    };
    onUpdate(listing); // В App.tsx onUpdate работает как save (add or update)
    setIsCreating(false);
  };

  const stats = [
    { label: 'Заявок', value: pending.length, color: 'text-amber-400' },
    { label: 'Всего', value: properties.length, color: 'text-cyan-400' },
    { label: 'Юзеров', value: users.length, color: 'text-emerald-400' },
    { label: 'Баны', value: users.filter(u => u.isBanned).length, color: 'text-rose-500' },
  ];

  return (
    <div className="p-5 space-y-8 bg-slate-950 min-h-screen pb-40">
      <header className="space-y-6">
        <div className="flex justify-between items-center">
            <h1 className="text-3xl font-black text-white tracking-tighter">Admin Panel</h1>
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center text-cyan-400 border border-white/10"><Icons.Waves /></div>
            </div>
        </div>

        <div className="grid grid-cols-4 gap-3">
          {stats.map(s => (
            <div key={s.label} className="bg-slate-900/50 backdrop-blur-md border border-white/5 p-3 rounded-2xl text-center">
              <span className={`block text-lg font-black ${s.color}`}>{s.value}</span>
              <span className="text-[7px] font-bold text-slate-500 uppercase tracking-widest">{s.label}</span>
            </div>
          ))}
        </div>

        <div className="relative">
          <input 
            type="text" 
            placeholder="Поиск по базе..." 
            className="w-full bg-slate-900 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-xs text-white outline-none focus:border-cyan-500 transition-all shadow-inner"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <div className="absolute left-4 top-4 opacity-30 scale-75"><Icons.Search /></div>
        </div>

        <div className="flex p-1 bg-slate-900 rounded-2xl border border-white/5">
            {(['pending', 'all', 'users'] as const).map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 py-3 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${
                  activeTab === tab ? 'bg-cyan-500 text-black shadow-lg shadow-cyan-500/20' : 'text-slate-500'
                }`}
              >
                {tab === 'pending' ? 'Заявки' : tab === 'all' ? 'Каталог' : 'Люди'}
              </button>
            ))}
        </div>
      </header>

      <div className="space-y-6">
        {activeTab === 'pending' && (
          <div className="space-y-6">
            {pending.length === 0 && (
              <div className="text-center py-20 opacity-30 text-[10px] font-black uppercase tracking-[0.2em] border-2 border-dashed border-white/5 rounded-[3rem]">
                Все заявки обработаны
              </div>
            )}
            {pending.map(p => (
              <div key={p.id} className="bg-slate-900 rounded-[2.5rem] border border-white/10 overflow-hidden shadow-2xl">
                 <div className="h-48 relative">
                    <img src={p.images[0]} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent"></div>
                    <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full text-[8px] font-black uppercase tracking-widest border border-white/10">{p.category}</div>
                 </div>
                 <div className="p-6 space-y-4">
                    <div className="flex justify-between items-start">
                      <div className="min-w-0">
                        <h3 className="text-lg font-black text-white truncate">{p.title}</h3>
                        <p className="text-[10px] text-cyan-400 font-bold">от @{p.ownerUsername}</p>
                      </div>
                      <span className="text-xs font-black text-white shrink-0">{p.pricePerNight} ₽</span>
                    </div>
                    <p className="text-[10px] text-slate-400 line-clamp-2 italic leading-relaxed">"{p.description}"</p>
                    <div className="flex space-x-2 pt-2">
                        <button onClick={() => handleReject(p)} className="flex-1 py-4 bg-rose-500/10 text-rose-500 border border-rose-500/20 rounded-2xl text-[9px] font-black uppercase tracking-widest hover:bg-rose-500 hover:text-white transition-all">Отклонить</button>
                        <button onClick={() => handleApprove(p)} className="flex-1 py-4 bg-emerald-500 text-black rounded-2xl text-[9px] font-black uppercase tracking-widest shadow-lg shadow-emerald-500/20 active:scale-95 transition-all">Одобрить</button>
                    </div>
                 </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'all' && (
          <div className="space-y-4">
            <button 
              onClick={() => setIsCreating(true)}
              className="w-full py-4 bg-white/5 border border-dashed border-cyan-500/30 text-cyan-400 rounded-3xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center space-x-2 hover:bg-cyan-500/10 transition-all"
            >
              <Icons.Plus />
              <span>Добавить новый объект</span>
            </button>
            
            {filteredProperties.map(p => (
              <div key={p.id} className="bg-slate-900 border border-white/5 p-4 rounded-3xl flex items-center space-x-4 group animate-in fade-in slide-in-from-left-2">
                 <div className="w-16 h-16 rounded-2xl overflow-hidden shrink-0 border border-white/5">
                    <img src={p.images[0]} className="w-full h-full object-cover" />
                 </div>
                 <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2">
                      <h4 className="font-bold text-white text-sm truncate">{p.title}</h4>
                      <div className={`w-1.5 h-1.5 rounded-full ${p.status === ModerationStatus.APPROVED ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 'bg-amber-500'}`}></div>
                    </div>
                    <p className="text-[9px] text-slate-500 font-bold truncate">@{p.ownerUsername} • {p.city}</p>
                 </div>
                 <div className="flex space-x-2">
                    <button onClick={() => setEditingListing(p)} className="w-10 h-10 bg-white/5 text-slate-400 rounded-xl flex items-center justify-center hover:bg-cyan-500/20 hover:text-cyan-400 transition-all"><Icons.Filter /></button>
                    <button onClick={() => { if(confirm('Удалить навсегда?')) onDelete(p.id); }} className="w-10 h-10 bg-rose-500/10 text-rose-500 rounded-xl flex items-center justify-center hover:bg-rose-500 hover:text-white transition-all"><Icons.Search /></button>
                 </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'users' && (
          <div className="space-y-4">
             {filteredUsers.map(u => (
                <div key={u.id} className="bg-slate-900 border border-white/5 p-6 rounded-[2rem] flex items-center justify-between shadow-lg">
                    <div className="flex items-center space-x-4">
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-colors ${u.isBanned ? 'bg-rose-500/20 text-rose-500 shadow-[0_0_20px_rgba(244,63,94,0.2)]' : 'bg-emerald-500/10 text-emerald-500'}`}>
                        <Icons.User />
                      </div>
                      <div>
                        <h4 className="font-black text-white text-base">@{u.username}</h4>
                        <span className={`text-[9px] font-black uppercase tracking-widest ${u.role === 'admin' ? 'text-cyan-400' : 'text-slate-500'}`}>{u.role}</span>
                      </div>
                    </div>
                    {u.role !== 'admin' && (
                      <button 
                        onClick={() => onToggleBan(u.id)}
                        className={`px-6 py-3 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${
                          u.isBanned ? 'bg-emerald-500 text-black shadow-lg shadow-emerald-500/20' : 'bg-rose-500/20 text-rose-500 border border-rose-500/30'
                        }`}
                      >
                        {u.isBanned ? 'Разбанить' : 'Бан'}
                      </button>
                    )}
                </div>
             ))}
          </div>
        )}
      </div>

      {/* MODAL: Edit/Create Listing */}
      {(editingListing || isCreating) && (
        <div className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-xl flex items-end justify-center">
           <div className="w-full max-w-md bg-slate-900 rounded-t-[3.5rem] p-8 space-y-6 animate-in slide-in-from-bottom-40 duration-500 border-t border-white/10 max-h-[90vh] overflow-y-auto hide-scrollbar">
              <div className="flex justify-between items-center mb-4">
                 <h2 className="text-2xl font-black text-white tracking-tight">{isCreating ? 'Новый объект' : 'Редактор'}</h2>
                 <button onClick={() => { setEditingListing(null); setIsCreating(false); }} className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center text-slate-500">✕</button>
              </div>
              
              <form onSubmit={isCreating ? handleCreateListing : handleSaveEdit} className="space-y-6">
                 {/* Категория */}
                 <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-2">
                       <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Категория</label>
                       <select 
                         className="w-full bg-slate-800 border border-white/5 rounded-2xl p-4 text-xs text-white outline-none"
                         value={isCreating ? newListing.category : editingListing?.category}
                         onChange={(e) => isCreating ? setNewListing({...newListing, category: e.target.value as any}) : setEditingListing({...editingListing!, category: e.target.value as any})}
                       >
                          {Object.values(ListingCategory).map(c => <option key={c} value={c}>{c}</option>)}
                       </select>
                    </div>
                    <div className="space-y-2">
                       <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Тип</label>
                       <select 
                         className="w-full bg-slate-800 border border-white/5 rounded-2xl p-4 text-xs text-white outline-none"
                         value={isCreating ? newListing.type : editingListing?.type}
                         onChange={(e) => isCreating ? setNewListing({...newListing, type: e.target.value as any}) : setEditingListing({...editingListing!, type: e.target.value as any})}
                       >
                          {Object.values(PropertyType).map(t => <option key={t} value={t}>{t}</option>)}
                       </select>
                    </div>
                 </div>

                 <div className="space-y-2">
                    <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Заголовок</label>
                    <input 
                      type="text" required
                      className="w-full bg-slate-800 border border-white/5 rounded-2xl p-4 text-xs text-white outline-none focus:border-cyan-500/30" 
                      value={isCreating ? newListing.title : editingListing?.title}
                      onChange={(e) => isCreating ? setNewListing({...newListing, title: e.target.value}) : setEditingListing({...editingListing!, title: e.target.value})}
                    />
                 </div>

                 <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Цена (₽)</label>
                        <input 
                          type="number" required
                          className="w-full bg-slate-800 border border-white/5 rounded-2xl p-4 text-xs text-white outline-none" 
                          value={isCreating ? newListing.pricePerNight : editingListing?.pricePerNight}
                          onChange={(e) => isCreating ? setNewListing({...newListing, pricePerNight: Number(e.target.value)}) : setEditingListing({...editingListing!, pricePerNight: Number(e.target.value)})}
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Регион</label>
                        <select 
                          className="w-full bg-slate-800 border border-white/5 rounded-2xl p-4 text-xs text-white outline-none" 
                          value={isCreating ? newListing.region : editingListing?.region}
                          onChange={(e) => isCreating ? setNewListing({...newListing, region: e.target.value}) : setEditingListing({...editingListing!, region: e.target.value})}
                        >
                          {REGIONS.map(r => <option key={r} value={r}>{r}</option>)}
                        </select>
                    </div>
                 </div>

                 <div className="space-y-2">
                    <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Город</label>
                    <input 
                      type="text" required
                      className="w-full bg-slate-800 border border-white/5 rounded-2xl p-4 text-xs text-white outline-none" 
                      value={isCreating ? newListing.city : editingListing?.city}
                      onChange={(e) => isCreating ? setNewListing({...newListing, city: e.target.value}) : setEditingListing({...editingListing!, city: e.target.value})}
                    />
                 </div>

                 {/* Специфические поля в зависимости от категории */}
                 {(isCreating ? newListing.category : editingListing?.category) === ListingCategory.STAY && (
                    <div className="grid grid-cols-2 gap-4">
                       <div className="space-y-2">
                          <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest">До моря (м)</label>
                          <input type="number" className="w-full bg-slate-800 border border-white/5 rounded-2xl p-4 text-xs text-white outline-none" value={isCreating ? newListing.distanceToSea : editingListing?.distanceToSea} onChange={(e) => isCreating ? setNewListing({...newListing, distanceToSea: Number(e.target.value)}) : setEditingListing({...editingListing!, distanceToSea: Number(e.target.value)})} />
                       </div>
                       <div className="space-y-2">
                          <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Гостей</label>
                          <input type="number" className="w-full bg-slate-800 border border-white/5 rounded-2xl p-4 text-xs text-white outline-none" value={isCreating ? newListing.maxGuests : editingListing?.maxGuests} onChange={(e) => isCreating ? setNewListing({...newListing, maxGuests: Number(e.target.value)}) : setEditingListing({...editingListing!, maxGuests: Number(e.target.value)})} />
                       </div>
                    </div>
                 )}

                 {(isCreating ? newListing.category : editingListing?.category) === ListingCategory.EXCHANGE && (
                    <div className="space-y-4">
                       <div className="space-y-2">
                          <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Курсы / Условия</label>
                          <input type="text" className="w-full bg-slate-800 border border-white/5 rounded-2xl p-4 text-xs text-white outline-none" value={isCreating ? newListing.exchangeRates : editingListing?.exchangeRates} onChange={(e) => isCreating ? setNewListing({...newListing, exchangeRates: e.target.value}) : setEditingListing({...editingListing!, exchangeRates: e.target.value})} />
                       </div>
                    </div>
                 )}

                 <div className="space-y-2">
                    <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Описание</label>
                    <textarea 
                      className="w-full bg-slate-800 border border-white/5 rounded-2xl p-4 text-xs text-white h-24 resize-none outline-none focus:border-cyan-500/30"
                      value={isCreating ? newListing.description : editingListing?.description}
                      onChange={(e) => isCreating ? setNewListing({...newListing, description: e.target.value}) : setEditingListing({...editingListing!, description: e.target.value})}
                    />
                 </div>

                 <div className="flex space-x-3 pt-4">
                   <button type="submit" className="flex-1 py-5 bg-cyan-500 text-black font-black uppercase text-[11px] tracking-widest rounded-3xl shadow-xl shadow-cyan-500/30 active:scale-95 transition-all">
                    {isCreating ? 'Создать объект' : 'Сохранить изменения'}
                   </button>
                 </div>
              </form>
           </div>
        </div>
      )}
    </div>
  );
};

export default AdminPanelPage;
