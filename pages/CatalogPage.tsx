
import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Listing, ListingCategory, FilterState } from '../types';
import { Icons } from '../constants';

interface CatalogPageProps {
  properties: Listing[];
}

const CatalogPage: React.FC<CatalogPageProps> = ({ properties }) => {
  const navigate = useNavigate();
  const { region: urlRegion, city: urlCity } = useParams();
  
  const russianRegions = ['Крым', 'Краснодарский край', 'Кавказские Минеральные Воды'];
  const isRussia = russianRegions.includes(urlRegion || '');

  const [activeCategory, setActiveCategory] = useState<ListingCategory>(ListingCategory.STAY);
  const [filters, setFilters] = useState<FilterState>({
    search: '', type: '', minPrice: '', maxPrice: '', maxDistance: '',
    region: urlRegion || '', city: urlCity || '', category: ListingCategory.STAY
  });

  // Если регион российский — принудительно сбрасываем категорию на "Жилье"
  useEffect(() => {
    if (isRussia) {
      setActiveCategory(ListingCategory.STAY);
    }
  }, [urlRegion, isRussia]);

  const filteredProperties = useMemo(() => {
    return properties.filter(p => {
      const matchCategory = p.category === activeCategory;
      const matchRegion = p.region === urlRegion;
      const matchCity = p.city === urlCity;
      const matchSearch = p.title.toLowerCase().includes(filters.search.toLowerCase());
      
      return matchCategory && matchRegion && matchCity && matchSearch;
    });
  }, [properties, filters.search, activeCategory, urlRegion, urlCity]);

  return (
    <div className="p-5 space-y-6 animate-in slide-in-from-right-4 duration-500 pb-32">
      <div className="flex items-center space-x-4 pt-4 px-2">
        <button onClick={() => navigate(`/cities/${urlRegion}`)} className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center text-slate-400 active:scale-90 transition-all border border-white/5"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7"/></svg></button>
        <div className="flex-1 min-w-0">
          <h2 className="text-[10px] font-black text-cyan-500 uppercase tracking-[0.3em] truncate">{urlRegion}</h2>
          <h1 className="text-2xl font-extrabold text-white tracking-tight truncate">{urlCity}</h1>
        </div>
      </div>

      {!isRussia && (
        <div className="flex overflow-x-auto hide-scrollbar p-1.5 bg-slate-900/50 backdrop-blur-xl rounded-[2rem] border border-white/5 shadow-2xl space-x-2">
          {Object.values(ListingCategory).map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`flex-shrink-0 min-w-[75px] py-3 rounded-[1.5rem] flex flex-col items-center justify-center space-y-1 transition-all duration-300 ${
                activeCategory === cat ? 'bg-cyan-500 text-[#020617] shadow-lg shadow-cyan-500/20' : 'text-slate-500'
              }`}
            >
              <div className="scale-75">
                {cat === ListingCategory.STAY && <Icons.Home />}
                {cat === ListingCategory.MOTO && <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>}
                {cat === ListingCategory.SIM && <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"/></svg>}
                {cat === ListingCategory.EXCHANGE && <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 8c-1.657 0-3 1.343-3 3s1.343 3 3 3 3-1.343 3-3-1.343-3-3-3zM12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/></svg>}
              </div>
              <span className="text-[7px] font-black uppercase tracking-widest px-2">{cat}</span>
            </button>
          ))}
        </div>
      )}

      <div className="relative group">
        <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none text-slate-500 group-focus-within:text-cyan-400 transition-colors"><Icons.Search /></div>
        <input
          type="text" placeholder={`Поиск: ${activeCategory}...`}
          className="w-full pl-14 pr-5 py-5 bg-white/5 border border-white/5 rounded-[1.75rem] text-sm text-slate-100 placeholder-slate-600 focus:ring-1 focus:ring-cyan-500/50 outline-none transition-all shadow-inner"
          value={filters.search} onChange={(e) => setFilters({ ...filters, search: e.target.value })}
        />
      </div>

      <div className="grid gap-8">
          {filteredProperties.map((p) => (
          <div key={p.id} onClick={() => navigate(`/property/${p.id}`)} className="group relative bg-[#0f172a] rounded-[2.5rem] overflow-hidden border border-white/5 active:scale-[0.98] transition-all shadow-2xl">
              <div className="aspect-[4/3] relative overflow-hidden">
                  <img src={p.images[0]} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-[2s] opacity-80" alt={p.title} />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#020617] via-transparent to-transparent"></div>
                  
                  <div className="absolute top-4 left-4 flex gap-2">
                    <div className="bg-white/10 text-white text-[8px] font-black px-3 py-1.5 rounded-full uppercase tracking-widest backdrop-blur-md">{p.type}</div>
                    <div className="bg-slate-900/60 backdrop-blur-xl px-3 py-1.5 rounded-full border border-white/10 flex items-center space-x-1.5"><span className="text-amber-400 text-[10px]">★</span><span className="text-white text-[10px] font-black">{p.rating}</span></div>
                  </div>

                  <div className="absolute bottom-6 left-6 right-6">
                      <h3 className="text-white font-extrabold text-2xl tracking-tight mb-1 leading-tight">{p.title}</h3>
                      <div className="flex items-center space-x-1.5 mb-3 opacity-70">
                          <Icons.MapPin />
                          <span className="text-[10px] font-medium text-slate-300 truncate">{p.address}</span>
                      </div>
                      <div className="flex justify-between items-center">
                          <div className="flex items-center space-x-3">
                              <div className="flex flex-col">
                                  <span className="text-white/40 text-[7px] font-black uppercase tracking-widest">
                                    {p.category === ListingCategory.STAY ? 'До моря' : p.category === ListingCategory.MOTO ? 'Двигатель' : p.category === ListingCategory.SIM ? 'Трафик' : 'Курсы'}
                                  </span>
                                  <span className="text-white font-bold text-xs truncate max-w-[150px]">
                                    {p.category === ListingCategory.STAY ? `${p.distanceToSea}м` : 
                                     p.category === ListingCategory.MOTO ? p.engineCapacity : 
                                     p.category === ListingCategory.SIM ? p.dataVolume : 
                                     p.exchangeRates?.split('|')[0]}
                                  </span>
                              </div>
                              {p.category === ListingCategory.EXCHANGE && (
                                <div className="flex flex-col border-l border-white/10 pl-3">
                                  <span className="text-white/40 text-[7px] font-black uppercase tracking-widest">Работа</span>
                                  <span className="text-white font-bold text-xs">{p.workingHours}</span>
                                </div>
                              )}
                          </div>
                          {p.category !== ListingCategory.EXCHANGE && (
                            <div className="bg-cyan-500 text-[#020617] px-4 py-2 rounded-2xl font-black text-sm shadow-xl shadow-cyan-500/20">{p.pricePerNight} ₽</div>
                          )}
                          {p.category === ListingCategory.EXCHANGE && (
                            <div className="bg-white/10 text-cyan-400 px-4 py-2 rounded-2xl font-black text-[10px] border border-cyan-500/30 uppercase tracking-widest">Обмен</div>
                          )}
                      </div>
                  </div>
              </div>
          </div>
          ))}
          {filteredProperties.length === 0 && (
            <div className="py-32 text-center space-y-4 opacity-40 flex flex-col items-center px-10">
              <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-2">
                <Icons.Search />
              </div>
              <p className="text-[10px] font-black uppercase tracking-widest leading-relaxed">В этом городе пока нет таких предложений</p>
            </div>
          )}
      </div>
    </div>
  );
};

export default CatalogPage;
