
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Listing, ModerationStatus, ListingCategory } from '../types';
import { Icons } from '../constants';

interface OwnerDashboardPageProps {
  properties: Listing[];
}

const OwnerDashboardPage: React.FC<OwnerDashboardPageProps> = ({ properties }) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<ListingCategory>(ListingCategory.STAY);

  const filteredProperties = properties.filter(p => p.category === activeTab);

  const getStatusBadge = (status: ModerationStatus) => {
    switch (status) {
      case ModerationStatus.APPROVED:
        return <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-3 py-1 rounded-xl text-[9px] font-black uppercase tracking-widest">Активно</span>;
      case ModerationStatus.PENDING:
        return <span className="bg-amber-500/10 text-amber-400 border border-amber-500/20 px-3 py-1 rounded-xl text-[9px] font-black uppercase tracking-widest">Проверка</span>;
      case ModerationStatus.REJECTED:
        return <span className="bg-rose-500/10 text-rose-400 border border-rose-500/20 px-3 py-1 rounded-xl text-[9px] font-black uppercase tracking-widest">Отклонено</span>;
      default:
        return null;
    }
  };

  const getTipsForCategory = (cat: ListingCategory) => {
    switch (cat) {
      case ListingCategory.STAY:
        return [
          'Точное расстояние до воды — ключ к доверию',
          'Качественные фото террасы увеличивают охват',
          'Указывайте наличие кондиционера в заголовке'
        ];
      case ListingCategory.MOTO:
        return [
          'Укажите год выпуска и состояние шлемов',
          'Сфотографируйте байк с нескольких ракурсов',
          'Опишите условия страховки и залога'
        ];
      case ListingCategory.SIM:
        return [
          'Указывайте реальную скорость (4G/5G)',
          'Предложите бесплатную доставку в отель',
          'Укажите время активации сим-карты'
        ];
      case ListingCategory.EXCHANGE:
        return [
          'Обновляйте курсы валют ежедневно',
          'Укажите минимальную сумму для доставки',
          'Фото офиса или курьера повышает доверие'
        ];
      default:
        return [];
    }
  };

  return (
    <div className="p-6 space-y-8 bg-[#020617] min-h-screen pb-32">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-black text-white tracking-tight leading-none">Личный кабинет</h1>
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
        
        <p className="text-cyan-100 text-[10px] font-black uppercase tracking-[0.4em] mb-4 opacity-70">Профиль владельца</p>
        <h2 className="text-3xl font-black mb-10 tracking-tight">Sea Partner Pro</h2>
        
        <div className="flex justify-between items-end relative z-10">
          <div className="space-y-1">
            <span className="block text-[10px] text-cyan-100 font-black tracking-widest uppercase opacity-60">Всего объявлений</span>
            <span className="block text-5xl font-black tracking-tighter leading-none">{properties.length}</span>
          </div>
          <div className="flex flex-col items-end space-y-2">
             <div className="flex -space-x-2">
                {[...new Set(properties.map(p => p.category))].map(cat => (
                  <div key={cat} className="w-8 h-8 rounded-full border-2 border-indigo-700 bg-slate-900 flex items-center justify-center text-[10px] shadow-lg">
                    {cat === ListingCategory.STAY ? '🏠' : cat === ListingCategory.MOTO ? '🛵' : cat === ListingCategory.SIM ? '📶' : '💰'}
                  </div>
                ))}
             </div>
             <span className="text-[8px] font-black uppercase tracking-widest text-cyan-200">Активные категории</span>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <div className="flex overflow-x-auto hide-scrollbar p-1.5 bg-white/5 rounded-[2rem] border border-white/5 space-x-2">
          {Object.values(ListingCategory).map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveTab(cat)}
              className={`flex-shrink-0 px-6 py-3 rounded-[1.5rem] flex items-center space-x-2 transition-all duration-300 ${
                activeTab === cat ? 'bg-white/10 text-cyan-400 border border-cyan-500/20' : 'text-slate-500 border border-transparent'
              }`}
            >
              <span className="text-[10px] font-black uppercase tracking-widest">{cat}</span>
              <span className="text-[9px] font-bold bg-white/5 px-2 py-0.5 rounded-full">
                {properties.filter(p => p.category === cat).length}
              </span>
            </button>
          ))}
        </div>

        <div className="space-y-4">
          {filteredProperties.length === 0 ? (
            <div className="text-center py-20 bg-white/5 rounded-[3.5rem] border-2 border-dashed border-white/5">
              <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px]">В категории "{activeTab}" пока пусто</p>
              <button onClick={() => navigate('/add')} className="mt-4 text-cyan-400 text-[11px] font-black uppercase tracking-widest border-b border-cyan-400/30">Создать объявление</button>
            </div>
          ) : (
            <div className="grid gap-4">
              {filteredProperties.map(p => (
                <div key={p.id} className="bg-white/5 border border-white/5 rounded-[2.5rem] p-4 flex space-x-4 items-center group active:scale-[0.98] transition-all">
                  <div className="relative w-20 h-20 rounded-2xl overflow-hidden shrink-0 border border-white/5">
                     <img src={p.images[0]} className="w-full h-full object-cover opacity-80" />
                     <div className="absolute top-1 left-1 bg-black/60 backdrop-blur-md p-1 rounded-lg text-[8px]">
                        {activeTab === ListingCategory.STAY ? '🏠' : activeTab === ListingCategory.MOTO ? '🛵' : activeTab === ListingCategory.SIM ? '📶' : '💰'}
                     </div>
                  </div>
                  <div className="flex-1 min-w-0 space-y-1">
                    <h4 className="font-extrabold text-white text-base truncate tracking-tight">{p.title}</h4>
                    <div className="flex items-center space-x-2">
                        <span className="text-[9px] text-slate-500 font-black uppercase tracking-widest truncate">{p.city}</span>
                        <span className="text-slate-700">•</span>
                        <span className="text-[9px] text-cyan-500 font-bold">
                          {p.category === ListingCategory.STAY ? `${p.pricePerNight} ₽/сут` : 
                           p.category === ListingCategory.MOTO ? `${p.pricePerNight} ₽/сут` : 
                           p.category === ListingCategory.SIM ? `${p.pricePerNight} ₽` : 'Курс обновлен'}
                        </span>
                    </div>
                    <div className="flex items-center pt-1">{getStatusBadge(p.status)}</div>
                  </div>
                  <button className="w-10 h-10 bg-white/5 rounded-xl text-slate-500 flex items-center justify-center">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"/></svg>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="bg-[#f0d38e]/5 rounded-[2.5rem] p-8 border border-[#f0d38e]/10 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-10 scale-150 rotate-12 text-[#f0d38e]"><Icons.Waves /></div>
        <h4 className="text-[10px] font-black text-[#f0d38e] mb-6 uppercase tracking-[0.25em] flex items-center">
            <span className="mr-2">💡</span> Советы для: {activeTab}
        </h4>
        <ul className="text-[11px] text-slate-400 space-y-4 font-bold uppercase tracking-wider">
          {getTipsForCategory(activeTab).map((tip, i) => (
            <li key={i} className="flex items-start">
              <span className="text-[#f0d38e] mr-3 opacity-60">●</span>
              {tip}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default OwnerDashboardPage;
