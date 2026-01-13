
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Property, ModerationStatus } from '../types';
import { Icons } from '../constants';

interface OwnerDashboardPageProps {
  properties: Property[];
}

const OwnerDashboardPage: React.FC<OwnerDashboardPageProps> = ({ properties }) => {
  const navigate = useNavigate();

  const getStatusBadge = (status: ModerationStatus) => {
    switch (status) {
      case ModerationStatus.APPROVED:
        return <span className="bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 px-3 py-1 rounded-xl text-[9px] font-black uppercase tracking-widest">Опубликовано</span>;
      case ModerationStatus.PENDING:
        return <span className="bg-amber-500/10 text-amber-400 border border-amber-500/20 px-3 py-1 rounded-xl text-[9px] font-black uppercase tracking-widest">Проверка</span>;
      case ModerationStatus.REJECTED:
        return <span className="bg-rose-500/10 text-rose-400 border border-rose-500/20 px-3 py-1 rounded-xl text-[9px] font-black uppercase tracking-widest">Отклонено</span>;
      default:
        return null;
    }
  };

  return (
    <div className="p-6 space-y-10 bg-[#020617] min-h-screen pb-32">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-black text-white tracking-tight">Мой SeaHome</h1>
        <button
          onClick={() => navigate('/add')}
          className="w-12 h-12 bg-cyan-500 text-[#020617] rounded-2xl flex items-center justify-center shadow-lg shadow-cyan-500/30 active:scale-90 transition-all"
        >
          <Icons.Plus />
        </button>
      </div>

      <div className="bg-gradient-to-br from-cyan-600 to-indigo-700 rounded-[3rem] p-10 text-white shadow-2xl relative overflow-hidden group">
        <div className="absolute -right-20 -bottom-20 w-60 h-60 bg-white/10 rounded-full blur-[80px] group-hover:scale-125 transition-transform duration-1000"></div>
        <div className="absolute top-0 right-0 p-8 opacity-10"><Icons.Waves /></div>
        
        <p className="text-cyan-100 text-[10px] font-black uppercase tracking-[0.4em] mb-4 opacity-70">Статус аккаунта</p>
        <h2 className="text-3xl font-black mb-10 tracking-tight">Coastal Pro</h2>
        
        <div className="flex justify-between items-end relative z-10">
          <div className="space-y-1">
            <span className="block text-[10px] text-cyan-100 font-black tracking-widest uppercase opacity-60">Ваших объектов</span>
            <span className="block text-5xl font-black tracking-tighter leading-none">{properties.length}</span>
          </div>
          <button className="bg-white/15 backdrop-blur-3xl border border-white/20 px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-white/25 transition-all shadow-xl">
            Upgrade
          </button>
        </div>
      </div>

      <div className="space-y-6">
        <div className="flex items-center justify-between px-2">
            <h3 className="font-black text-white text-lg uppercase tracking-widest text-cyan-500/60 text-[11px]">Мои объявления</h3>
            <span className="text-[10px] text-slate-500 font-black uppercase tracking-widest">{properties.length} total</span>
        </div>
        
        {properties.length === 0 ? (
          <div className="text-center py-20 bg-white/5 rounded-[3.5rem] border-2 border-dashed border-white/5">
            <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px]">У вас пока нет объектов</p>
            <button onClick={() => navigate('/add')} className="mt-4 text-cyan-400 text-[11px] font-black uppercase tracking-widest">Разместить бесплатно</button>
          </div>
        ) : (
          <div className="grid gap-5">
            {properties.map(p => (
              <div key={p.id} className="bg-white/5 border border-white/5 rounded-[2.5rem] p-5 flex space-x-5 items-center shadow-xl group hover:bg-white/10 transition-all">
                <div className="relative w-24 h-24 rounded-3xl overflow-hidden shadow-2xl shrink-0">
                   <img src={p.images[0]} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 opacity-80" />
                </div>
                <div className="flex-1 min-w-0 py-1 space-y-2">
                  <h4 className="font-extrabold text-white text-lg truncate tracking-tight">{p.title}</h4>
                  <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest truncate">{p.city}</p>
                  <div className="flex items-center">{getStatusBadge(p.status)}</div>
                </div>
                <button className="w-12 h-12 bg-white/5 rounded-2xl text-slate-400 hover:text-cyan-400 hover:bg-cyan-500/10 transition-all flex items-center justify-center">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"/></svg>
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="bg-[#f0d38e]/5 rounded-[2.5rem] p-8 border border-[#f0d38e]/10 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-5 scale-150 rotate-12"><Icons.Plus /></div>
        <h4 className="text-[10px] font-black text-[#f0d38e] mb-5 uppercase tracking-[0.25em] flex items-center">
            Совет по модерации
        </h4>
        <ul className="text-[11px] text-slate-400 space-y-4 font-bold uppercase tracking-wider">
          <li className="flex items-start"><span className="text-[#f0d38e] mr-3">✔</span> Только качественные фото пляжа</li>
          <li className="flex items-start"><span className="text-[#f0d38e] mr-3">✔</span> Точное расстояние до воды</li>
          <li className="flex items-start"><span className="text-[#f0d38e] mr-3">✔</span> Подробное описание удобств</li>
        </ul>
      </div>
    </div>
  );
};

export default OwnerDashboardPage;