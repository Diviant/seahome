
import React, { useState } from 'react';
import { Listing, ModerationStatus, User, PropertyType, ListingCategory } from '../types';
import { Icons, REGIONS } from '../constants';

interface AdminPanelPageProps {
  properties: Listing[];
  users: User[];
  onUpdate: (p: Listing) => void;
  onDelete: (id: string) => void;
  onToggleBan: (userId: string) => void;
  onReset: () => void;
}

const AdminPanelPage: React.FC<AdminPanelPageProps> = ({ properties, users, onUpdate, onDelete, onToggleBan, onReset }) => {
  const [activeTab, setActiveTab] = useState<'pending' | 'all' | 'users'>('pending');
  const [editingListing, setEditingListing] = useState<Listing | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const [newListing, setNewListing] = useState<Partial<Listing>>({
    category: ListingCategory.STAY,
    type: PropertyType.GUEST_HOUSE,
    status: ModerationStatus.APPROVED,
    amenities: [],
    images: ['https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80'],
    isVerified: true,
    isFeatured: false,
    rating: 0,
    reviews: []
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
      ownerUsername: 'SYSTEM',
      createdAt: Date.now(),
    };
    onUpdate(listing);
    setIsCreating(false);
  };

  const stats = [
    { label: 'Заявки', value: pending.length, color: 'text-amber-400' },
    { label: 'Объекты', value: properties.length, color: 'text-cyan-400' },
    { label: 'Юзеры', value: users.length, color: 'text-emerald-400' },
  ];

  return (
    <div className="p-5 space-y-8 bg-slate-950 min-h-screen pb-40">
      <header className="space-y-6">
        <div className="flex justify-between items-center">
            <h1 className="text-3xl font-black text-white tracking-tighter">Admin</h1>
            <button 
              onClick={onReset}
              className="px-4 py-2 bg-rose-500/10 text-rose-500 border border-rose-500/20 rounded-xl text-[8px] font-black uppercase tracking-widest hover:bg-rose-500 hover:text-white transition-all"
            >
              Сбросить базу
            </button>
        </div>

        <div className="grid grid-cols-3 gap-3">
          {stats.map(s => (
            <div key={s.label} className="bg-slate-900 border border-white/5 p-4 rounded-2xl text-center shadow-lg">
              <span className={`block text-xl font-black ${s.color}`}>{s.value}</span>
              <span className="text-[7px] font-bold text-slate-500 uppercase tracking-widest">{s.label}</span>
            </div>
          ))}
        </div>

        <div className="relative">
          <input 
            type="text" 
            placeholder="Поиск по базе..." 
            className="w-full bg-slate-900 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-xs text-white outline-none focus:border-cyan-500 transition-all"
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
                {tab === 'pending' ? 'Заявки' : tab === 'all' ? 'Вся база' : 'Люди'}
              </button>
            ))}
        </div>
      </header>

      <div className="space-y-6">
        {activeTab === 'pending' && (
          <div className="space-y-6">
            {pending.length === 0 && (
              <div className="text-center py-20 opacity-30 text-[10px] font-black uppercase tracking-widest border-2 border-dashed border-white/5 rounded-[3rem]">
                Новых заявок нет
              </div>
            )}
            {pending.map(p => (
              <div key={p.id} className="bg-slate-900 rounded-[2.5rem] border border-white/10 overflow-hidden shadow-2xl">
                 <div className="h-48 relative">
                    <img src={p.images[0]} className="w-full h-full object-cover" />
                    <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full text-[8px] font-black uppercase border border-white/10">{p.category}</div>
                 </div>
                 <div className="p-6 space-y-4">
                    <div className="min-w-0">
                      <h3 className="text-lg font-black text-white truncate">{p.title}</h3>
                      <p className="text-[10px] text-cyan-400 font-bold">от @{p.ownerUsername} • {p.city}</p>
                    </div>
                    <div className="flex space-x-2">
                        <button onClick={() => handleReject(p)} className="flex-1 py-4 bg-rose-500/10 text-rose-500 border border-rose-500/20 rounded-2xl text-[9px] font-black uppercase tracking-widest">Отклон.</button>
                        <button onClick={() => handleApprove(p)} className="flex-1 py-4 bg-emerald-500 text-black rounded-2xl text-[9px] font-black uppercase tracking-widest">Одобрить</button>
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
              className="w-full py-4 bg-white/5 border border-dashed border-cyan-500/30 text-cyan-400 rounded-3xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center space-x-2"
            >
              <Icons.Plus />
              <span>Добавить объект</span>
            </button>
            
            {filteredProperties.map(p => (
              <div key={p.id} className="bg-slate-900 border border-white/5 p-4 rounded-3xl flex items-center space-x-4">
                 <div className="w-16 h-16 rounded-2xl overflow-hidden shrink-0 border border-white/5">
                    <img src={p.images[0]} className="w-full h-full object-cover" />
                 </div>
                 <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-white text-sm truncate">{p.title}</h4>
                    <p className="text-[9px] text-slate-500 font-bold truncate">{p.city} • {p.category}</p>
                 </div>
                 <div className="flex space-x-2">
                    <button onClick={() => setEditingListing(p)} className="w-10 h-10 bg-cyan-500/10 text-cyan-400 rounded-xl flex items-center justify-center">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2.5 2.5 0 113.536 3.536L12 17.207l-4 1 1-4 9.414-9.414z"/></svg>
                    </button>
                    <button onClick={() => { if(confirm('Удалить?')) onDelete(p.id); }} className="w-10 h-10 bg-rose-500/10 text-rose-500 rounded-xl flex items-center justify-center">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                    </button>
                 </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'users' && (
          <div className="space-y-4">
             {filteredUsers.map(u => (
                <div key={u.id} className="bg-slate-900 border border-white/5 p-6 rounded-[2rem] flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${u.isBanned ? 'bg-rose-500/20 text-rose-500' : 'bg-emerald-500/10 text-emerald-500'}`}>
                        <Icons.User />
                      </div>
                      <div>
                        <h4 className="font-black text-white text-base">@{u.username}</h4>
                        <span className="text-[9px] font-black uppercase tracking-widest text-slate-500">{u.role}</span>
                      </div>
                    </div>
                    {u.role !== 'admin' && (
                      <button 
                        onClick={() => onToggleBan(u.id)}
                        className={`px-6 py-3 rounded-xl text-[9px] font-black uppercase tracking-widest ${
                          u.isBanned ? 'bg-emerald-500 text-black' : 'bg-rose-500/20 text-rose-500'
                        }`}
                      >
                        {u.isBanned ? 'Разбан' : 'Бан'}
                      </button>
                    )}
                </div>
             ))}
          </div>
        )}
      </div>

      {(editingListing || isCreating) && (
        <div className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-xl flex items-end justify-center">
           <div className="w-full max-w-md bg-slate-900 rounded-t-[3.5rem] p-8 space-y-6 animate-in slide-in-from-bottom-40 duration-500 max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center">
                 <h2 className="text-2xl font-black text-white">{isCreating ? 'Создание' : 'Редактирование'}</h2>
                 <button onClick={() => { setEditingListing(null); setIsCreating(false); }} className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center">✕</button>
              </div>
              
              <form onSubmit={isCreating ? handleCreateListing : handleSaveEdit} className="space-y-6">
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
                    <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Название</label>
                    <input 
                      type="text" required
                      className="w-full bg-slate-800 border border-white/5 rounded-2xl p-4 text-xs text-white outline-none" 
                      value={isCreating ? newListing.title : editingListing?.title}
                      onChange={(e) => isCreating ? setNewListing({...newListing, title: e.target.value}) : setEditingListing({...editingListing!, title: e.target.value})}
                    />
                 </div>

                 <div className="grid grid-cols-2 gap-4">
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
                    <div className="space-y-2">
                       <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Город</label>
                       <input type="text" className="w-full bg-slate-800 border border-white/5 rounded-2xl p-4 text-xs text-white" value={isCreating ? newListing.city : editingListing?.city} onChange={(e) => isCreating ? setNewListing({...newListing, city: e.target.value}) : setEditingListing({...editingListing!, city: e.target.value})} />
                    </div>
                 </div>

                 <div className="space-y-2">
                    <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Описание</label>
                    <textarea 
                      className="w-full bg-slate-800 border border-white/5 rounded-2xl p-4 text-xs text-white h-32 resize-none"
                      value={isCreating ? newListing.description : editingListing?.description}
                      onChange={(e) => isCreating ? setNewListing({...newListing, description: e.target.value}) : setEditingListing({...editingListing!, description: e.target.value})}
                    />
                 </div>

                 <div className="flex space-x-3 pt-4">
                   <button type="submit" className="flex-1 py-5 bg-cyan-500 text-black font-black uppercase text-[11px] rounded-3xl active:scale-95 transition-all">
                    {isCreating ? 'Создать' : 'Сохранить'}
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
