
import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Listing, User, ListingCategory } from '../types';
import { Icons } from '../constants';

interface WelcomePageProps {
  properties: Listing[];
  currentUser: User;
}

const WelcomePage: React.FC<WelcomePageProps> = ({ properties, currentUser }) => {
  const navigate = useNavigate();

  const randomFeatured = useMemo(() => {
    return properties
      .filter(p => p.isFeatured && p.status === 'Одобрен')
      .sort(() => Math.random() - 0.5)
      .slice(0, 6);
  }, [properties]);

  return (
    <div className="relative min-h-screen bg-[#020617] overflow-hidden">
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1000&q=80" 
          className="w-full h-full object-cover opacity-30 scale-105"
          alt="Ocean background"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#020617]/90 via-[#020617]/50 to-[#020617]"></div>
      </div>

      <div className="relative z-10 px-8 pt-20 pb-10 flex flex-col min-h-screen">
        <div className="mb-12 flex flex-col items-center animate-in fade-in zoom-in duration-700">
          <div className="w-16 h-16 bg-gradient-to-tr from-cyan-600 to-teal-400 rounded-3xl flex items-center justify-center text-white shadow-2xl shadow-cyan-500/40 mb-4 transform rotate-3 hover:rotate-0 transition-transform">
            <Icons.Waves />
          </div>
          <h1 className="text-4xl font-black text-white tracking-tighter mb-1">SeaHome</h1>
          <p className="text-cyan-400 text-[10px] font-black uppercase tracking-[0.4em]">Coastal Living Hub</p>
        </div>

        <div className="mb-12 text-center space-y-5 animate-in slide-in-from-bottom-6 duration-700 delay-100">
          <div className="space-y-2">
             <p className="text-cyan-500 text-[10px] font-black uppercase tracking-widest">👋 Привет, {currentUser.firstName || currentUser.username}!</p>
             <h2 className="text-4xl font-black text-white leading-[1.05] tracking-tighter">Весь берег — <br/>в одном приложении</h2>
          </div>
          <p className="text-slate-400 text-sm font-medium leading-relaxed max-w-[300px] mx-auto">
            Жильё, транспорт и еда напрямую от местных жителей. Без комиссий и лишних звонков.
          </p>
        </div>

        <button
          onClick={() => navigate('/regions')}
          className="group relative bg-gradient-to-tr from-cyan-600 to-teal-400 text-[#020617] font-black py-5 rounded-[2.5rem] shadow-2xl shadow-cyan-500/30 active:scale-95 transition-all flex items-center justify-center space-x-3 mb-16 overflow-hidden animate-in slide-in-from-bottom-10 duration-700 delay-200"
        >
          <span className="relative z-10 uppercase tracking-widest text-[11px]">Начать поиск</span>
          <svg className="w-4 h-4 relative z-10 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>
        </button>

        <div className="mt-auto space-y-5 animate-in fade-in duration-1000 delay-500">
          <div className="flex justify-between items-end">
            <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">Рекомендуем</h3>
            <button onClick={() => navigate('/regions')} className="text-[10px] font-black text-cyan-500 uppercase tracking-widest">Все регионы</button>
          </div>
          
          <div className="flex space-x-4 overflow-x-auto hide-scrollbar pb-10">
            {randomFeatured.length > 0 ? randomFeatured.map(p => (
              <div 
                key={p.id}
                onClick={() => navigate(`/property/${p.id}`)}
                className="flex-shrink-0 w-64 bg-slate-900/40 backdrop-blur-md rounded-[2.5rem] border border-white/5 overflow-hidden group active:scale-95 transition-all"
              >
                <div className="h-36 relative overflow-hidden">
                  <img src={p.images[0]} className="w-full h-full object-cover opacity-80 group-hover:scale-110 transition-transform duration-700" alt={p.title} />
                  <div className="absolute top-3 left-3 flex space-x-2">
                    <div className="bg-cyan-500/90 backdrop-blur-md text-[#020617] text-[8px] font-black px-3 py-1.5 rounded-full uppercase shadow-lg">
                      {p.category === ListingCategory.FOOD ? `${p.averageBill} ₽` : `${p.pricePerNight} ₽`}
                    </div>
                  </div>
                </div>
                <div className="p-5 space-y-1">
                  <h4 className="text-white font-bold text-sm truncate">{p.title}</h4>
                  <div className="flex items-center justify-between">
                    <p className="text-slate-500 text-[9px] uppercase font-black tracking-widest">{p.city} • {p.category}</p>
                    <div className="flex items-center space-x-1">
                      <span className="text-amber-400 text-[10px]">★</span>
                      <span className="text-white text-[9px] font-bold">{p.rating}</span>
                    </div>
                  </div>
                </div>
              </div>
            )) : (
              <div className="w-full text-center py-10 opacity-30 text-[9px] font-black uppercase tracking-widest">
                В базе пока нет рекомендованных объектов
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WelcomePage;
