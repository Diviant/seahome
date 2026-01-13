
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { REGIONS, REGION_METADATA, Icons } from '../constants';

const RegionSelectionPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="p-5 space-y-8 animate-in fade-in duration-500">
      <div className="space-y-2 pt-4 px-2">
        <h2 className="text-[10px] font-black text-cyan-500 uppercase tracking-[0.3em]">Куда поедем?</h2>
        <h1 className="text-3xl font-extrabold text-white tracking-tight">Выберите регион</h1>
      </div>

      <div className="grid gap-5">
        {REGIONS.map((region) => {
          const meta = REGION_METADATA[region];
          return (
            <div
              key={region}
              onClick={() => navigate(`/cities/${region}`)}
              className="group relative h-40 rounded-[2.5rem] overflow-hidden cursor-pointer active:scale-[0.98] transition-all border border-white/5"
            >
              <img 
                src={meta.image} 
                className="w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-[1.5s]" 
                alt={region} 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#020617] via-transparent to-transparent"></div>
              
              <div className="absolute bottom-6 left-6 right-6 flex justify-between items-end">
                <div className="space-y-1">
                  <span className="text-cyan-400 text-[9px] font-black uppercase tracking-widest opacity-80">{meta.tag}</span>
                  <h3 className="text-white text-xl font-extrabold tracking-tight">{region}</h3>
                </div>
                <div className="w-10 h-10 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center text-white border border-white/10 group-hover:bg-cyan-500 group-hover:text-[#020617] transition-colors shadow-lg">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7"/></svg>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default RegionSelectionPage;
