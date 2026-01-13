
import React from 'react';
import { useNavigate } from 'react-router-dom';
// Changed 'Property' to 'Listing'
import { Listing } from '../types';
import { Icons } from '../constants';

interface WelcomePageProps {
  // Changed 'Property' to 'Listing'
  properties: Listing[];
}

const WelcomePage: React.FC<WelcomePageProps> = ({ properties }) => {
  const navigate = useNavigate();
  const featured = properties.filter(p => p.isFeatured).slice(0, 5);

  return (
    <div className="relative min-h-screen bg-[#020617] overflow-hidden">
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1000&q=80" 
          className="w-full h-full object-cover opacity-40 scale-105"
          alt="Ocean background"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#020617]/80 via-[#020617]/40 to-[#020617]"></div>
      </div>

      <div className="relative z-10 px-8 pt-20 pb-10 flex flex-col min-h-screen">
        <div className="mb-12 flex flex-col items-center">
          <div className="w-16 h-16 bg-gradient-to-tr from-cyan-600 to-teal-400 rounded-2xl flex items-center justify-center text-white shadow-2xl shadow-cyan-500/40 mb-4">
            <Icons.Waves />
          </div>
          <h1 className="text-4xl font-black text-white tracking-tighter mb-1">SeaHome</h1>
          <p className="text-cyan-400 text-[10px] font-black uppercase tracking-[0.4em]">Coastal Living</p>
        </div>

        <div className="mb-12 text-center space-y-4">
          <h2 className="text-3xl font-extrabold text-white leading-[1.1] tracking-tight">Ваш уютный дом прямо у берега</h2>
          <p className="text-slate-400 text-sm font-medium leading-relaxed">
            Находите жильё без посредников в лучших курортных регионах. Прямая связь в Telegram.
          </p>
        </div>

        <button
          onClick={() => navigate('/regions')}
          className="group relative bg-gradient-to-tr from-cyan-600 to-teal-400 text-[#020617] font-black py-5 rounded-[2rem] shadow-2xl shadow-cyan-500/30 active:scale-95 transition-all flex items-center justify-center space-x-3 mb-16 overflow-hidden"
        >
          <span className="relative z-10 uppercase tracking-widest text-xs">Начать путешествие</span>
          <svg className="w-4 h-4 relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>
        </button>

        <div className="mt-auto space-y-5">
          <div className="flex justify-between items-end">
            <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">Популярное сейчас</h3>
            <button onClick={() => navigate('/regions')} className="text-[10px] font-black text-cyan-500 uppercase tracking-widest">Все</button>
          </div>
          
          <div className="flex space-x-4 overflow-x-auto hide-scrollbar pb-10">
            {featured.map(p => (
              <div 
                key={p.id}
                onClick={() => navigate(`/property/${p.id}`)}
                className="flex-shrink-0 w-64 bg-slate-900/50 backdrop-blur-md rounded-[2rem] border border-white/5 overflow-hidden group active:scale-95 transition-all"
              >
                <div className="h-36 relative overflow-hidden">
                  <img src={p.images[0]} className="w-full h-full object-cover opacity-80 group-hover:scale-110 transition-transform duration-700" alt={p.title} />
                  <div className="absolute top-3 left-3 flex space-x-2">
                    <div className="bg-cyan-500/80 backdrop-blur-md text-[#020617] text-[8px] font-black px-3 py-1.5 rounded-full uppercase">
                      {p.pricePerNight} ₽
                    </div>
                    <div className="bg-slate-900/80 backdrop-blur-md text-amber-400 text-[8px] font-black px-3 py-1.5 rounded-full uppercase flex items-center space-x-1">
                      <span>★</span>
                      <span className="text-white">{p.rating}</span>
                    </div>
                  </div>
                </div>
                <div className="p-4 space-y-1">
                  <h4 className="text-white font-bold text-sm truncate">{p.title}</h4>
                  <p className="text-slate-500 text-[9px] uppercase font-black tracking-widest">{p.city}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WelcomePage;
