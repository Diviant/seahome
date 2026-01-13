
import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Property, FilterState } from '../types';
import { Icons, REGIONS, CITIES_BY_REGION } from '../constants';

interface CatalogPageProps {
  properties: Property[];
}

const CatalogPage: React.FC<CatalogPageProps> = ({ properties }) => {
  const navigate = useNavigate();
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filters, setFilters] = useState<FilterState>({
    search: '',
    type: '',
    minPrice: '',
    maxPrice: '',
    maxDistance: '',
    region: '',
    city: '',
  });

  const filteredProperties = useMemo(() => {
    return properties.filter(p => {
      const matchSearch = p.title.toLowerCase().includes(filters.search.toLowerCase()) || 
                          p.city.toLowerCase().includes(filters.search.toLowerCase());
      const matchType = !filters.type || p.type === filters.type;
      const matchRegion = !filters.region || p.region === filters.region;
      const matchCity = !filters.city || p.city === filters.city;
      const matchPrice = (!filters.minPrice || p.pricePerNight >= Number(filters.minPrice)) &&
                         (!filters.maxPrice || p.pricePerNight <= Number(filters.maxPrice));
      const matchDistance = !filters.maxDistance || p.distanceToSea <= Number(filters.maxDistance);
      
      return matchSearch && matchType && matchRegion && matchCity && matchPrice && matchDistance;
    });
  }, [properties, filters]);

  const handleRegionChange = (region: string) => {
    setFilters({ ...filters, region, city: '' });
  };

  const availableCities = filters.region ? CITIES_BY_REGION[filters.region] || [] : [];

  return (
    <div className="p-5 space-y-8">
      {/* Search & Filter Bar */}
      <div className="flex space-x-3">
        <div className="relative flex-1 group">
          <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none text-slate-500 group-focus-within:text-cyan-400 transition-colors">
            <Icons.Search />
          </div>
          <input
            type="text"
            placeholder="Куда отправимся?"
            className="w-full pl-14 pr-5 py-5 bg-white/5 border border-white/5 rounded-3xl text-sm text-slate-100 placeholder-slate-600 focus:ring-2 focus:ring-cyan-500/40 focus:bg-white/10 transition-all outline-none shadow-inner"
            value={filters.search}
            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
          />
        </div>
        <button
          onClick={() => setIsFilterOpen(!isFilterOpen)}
          className={`p-5 rounded-3xl border transition-all active:scale-90 ${isFilterOpen ? 'bg-cyan-500 border-cyan-400 text-white shadow-lg shadow-cyan-500/30' : 'bg-white/5 border-white/10 text-slate-400 hover:text-cyan-400'}`}
        >
          <Icons.Filter />
        </button>
      </div>

      {/* Expanded Filters */}
      {isFilterOpen && (
        <div className="bg-slate-900/90 backdrop-blur-3xl p-7 rounded-[2.5rem] border border-white/10 space-y-6 animate-in slide-in-from-top-4 duration-500 shadow-2xl overflow-hidden relative">
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-cyan-500/10 blur-3xl pointer-events-none"></div>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-[10px] uppercase font-black text-cyan-500/60 mb-1 ml-4 tracking-[0.25em] block">Направление</label>
              <div className="relative">
                <select 
                  className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-sm text-slate-100 focus:ring-2 focus:ring-cyan-500/50 outline-none appearance-none cursor-pointer"
                  value={filters.region}
                  onChange={(e) => handleRegionChange(e.target.value)}
                >
                  <option value="">Любой регион</option>
                  {REGIONS.map(r => <option key={r} value={r}>{r}</option>)}
                </select>
              </div>
            </div>

            {filters.region && (
              <div className="space-y-2 animate-in fade-in slide-in-from-left-4">
                <label className="text-[10px] uppercase font-black text-cyan-500/60 mb-1 ml-4 tracking-[0.25em] block">Город</label>
                <select 
                  className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-sm text-slate-100 outline-none appearance-none"
                  value={filters.city}
                  onChange={(e) => setFilters({ ...filters, city: e.target.value })}
                >
                  <option value="">Все города</option>
                  {availableCities.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[10px] uppercase font-black text-cyan-500/60 mb-1 ml-4 tracking-[0.25em] block">Бюджет до</label>
              <input
                type="number"
                placeholder="Цена"
                className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-sm text-slate-100 placeholder-slate-700 outline-none"
                value={filters.maxPrice}
                onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] uppercase font-black text-cyan-500/60 mb-1 ml-4 tracking-[0.25em] block">Расстояние (м)</label>
              <input
                type="number"
                placeholder="Море"
                className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-sm text-slate-100 placeholder-slate-700 outline-none"
                value={filters.maxDistance}
                onChange={(e) => setFilters({ ...filters, maxDistance: e.target.value })}
              />
            </div>
          </div>
          
          <button 
            onClick={() => setFilters({ search: '', type: '', minPrice: '', maxPrice: '', maxDistance: '', region: '', city: '' })}
            className="w-full py-4 text-[10px] font-black uppercase tracking-[0.35em] text-slate-500 hover:text-cyan-400 transition-colors border-t border-white/5"
          >
            Сбросить параметры
          </button>
        </div>
      )}

      {/* Results */}
      <div className="space-y-8 pb-10">
        <div className="flex justify-between items-center px-2">
          <h2 className="text-[10px] font-black text-cyan-500/50 uppercase tracking-[0.3em]">
            Найдено вариантов: {filteredProperties.length}
          </h2>
        </div>

        <div className="grid gap-10">
            {filteredProperties.map((p) => (
            <div
                key={p.id}
                onClick={() => navigate(`/property/${p.id}`)}
                className="group relative bg-[#0f172a] rounded-[3.5rem] overflow-hidden shadow-[0_30px_60px_-15px_rgba(0,0,0,0.5)] border border-white/5 cursor-pointer active:scale-[0.97] transition-all duration-700"
            >
                <div className="aspect-[4/5] relative overflow-hidden">
                    <img src={p.images[0]} alt={p.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-[2s] opacity-80" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#020617] via-transparent to-transparent"></div>
                    
                    <div className="absolute top-6 left-6 right-6 flex justify-between items-start">
                        <div className="flex gap-2">
                            {p.isFeatured && (
                                <div className="bg-amber-400/90 text-amber-950 text-[9px] font-black px-4 py-2 rounded-2xl uppercase tracking-widest backdrop-blur-md shadow-lg">
                                    Top
                                </div>
                            )}
                            <div className="bg-white/10 text-white text-[9px] font-black px-4 py-2 rounded-2xl uppercase tracking-widest backdrop-blur-md border border-white/10">
                                {p.type}
                            </div>
                        </div>
                        {p.isVerified && (
                            <div className="bg-[#f0d38e] text-amber-950 p-2.5 rounded-2xl shadow-lg">
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                            </div>
                        )}
                    </div>

                    <div className="absolute bottom-8 left-8 right-8 space-y-4">
                        <div className="space-y-1.5">
                            <h3 className="text-white font-extrabold text-3xl tracking-tight leading-none drop-shadow-2xl">{p.title}</h3>
                            <div className="flex items-center text-cyan-400 text-xs font-bold uppercase tracking-wider opacity-90">
                                <span className="mr-2"><Icons.MapPin /></span>
                                {p.city}
                            </div>
                        </div>
                        
                        <div className="flex justify-between items-center pt-2">
                            <div className="flex items-center space-x-4">
                                <div className="flex flex-col">
                                    <span className="text-white/60 text-[9px] font-black uppercase tracking-widest">Море</span>
                                    <span className="text-white font-bold text-sm">{p.distanceToSea}м</span>
                                </div>
                                <div className="w-[1px] h-6 bg-white/10"></div>
                                <div className="flex flex-col">
                                    <span className="text-white/60 text-[9px] font-black uppercase tracking-widest">Мест</span>
                                    <span className="text-white font-bold text-sm">{p.maxGuests}</span>
                                </div>
                            </div>
                            <div className="bg-cyan-500 text-white px-5 py-3 rounded-[1.75rem] font-black shadow-xl shadow-cyan-500/20 text-lg">
                                {p.pricePerNight} ₽
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            ))}
        </div>

        {filteredProperties.length === 0 && (
          <div className="text-center py-40 opacity-40">
            <p className="font-black uppercase tracking-widest text-xs text-cyan-500">Ничего не найдено</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CatalogPage;