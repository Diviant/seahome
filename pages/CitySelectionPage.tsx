
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { CITIES_BY_REGION, Icons } from '../constants';
// Changed 'Property' to 'Listing'
import { Listing } from '../types';

interface CitySelectionPageProps {
  // Changed 'Property' to 'Listing'
  properties: Listing[];
}

const CitySelectionPage: React.FC<CitySelectionPageProps> = ({ properties }) => {
  const { region } = useParams();
  const navigate = useNavigate();
  
  const cities = region ? CITIES_BY_REGION[region] || [] : [];

  return (
    <div className="p-5 space-y-8 animate-in slide-in-from-right-4 duration-500">
      <div className="flex items-center space-x-4 pt-4 px-2">
        <button 
          onClick={() => navigate('/regions')} 
          className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center text-slate-400 active:scale-90 transition-all border border-white/5"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7"/></svg>
        </button>
        <div>
          <h2 className="text-[10px] font-black text-cyan-500 uppercase tracking-[0.3em]">{region}</h2>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">Выберите город</h1>
        </div>
      </div>

      <div className="grid gap-4">
        {cities.map((city) => {
          const count = properties.filter(p => p.city === city).length;
          return (
            <div
              key={city}
              onClick={() => navigate(`/catalog/${region}/${city}`)}
              className="bg-slate-900/50 backdrop-blur-md border border-white/5 p-6 rounded-[2rem] flex justify-between items-center group cursor-pointer active:scale-[0.98] transition-all hover:bg-slate-800/80"
            >
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center text-cyan-400 border border-white/5 group-hover:scale-110 transition-transform">
                  <Icons.MapPin />
                </div>
                <div>
                  <h3 className="text-white text-lg font-bold tracking-tight">{city}</h3>
                  <p className="text-slate-500 text-[9px] font-black uppercase tracking-widest">{count} {count === 1 ? 'объект' : (count > 1 && count < 5 ? 'объекта' : 'объектов')}</p>
                </div>
              </div>
              <div className="text-slate-600 group-hover:text-cyan-400 transition-colors">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"/></svg>
              </div>
            </div>
          );
        })}
      </div>

      {cities.length === 0 && (
        <div className="text-center py-20 opacity-40">
            <p className="text-xs uppercase font-black tracking-widest text-cyan-500">Городов пока нет</p>
        </div>
      )}
    </div>
  );
};

export default CitySelectionPage;
