
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Property } from '../types';
import { Icons } from '../constants';

interface PropertyDetailsPageProps {
  properties: Property[];
}

const PropertyDetailsPage: React.FC<PropertyDetailsPageProps> = ({ properties }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const property = properties.find(p => p.id === id);

  if (!property) {
    return <div className="p-10 text-center text-slate-400">Объект не найден</div>;
  }

  const ownerPropertiesCount = properties.filter(p => p.ownerId === property.ownerId).length;

  const handleContactOwner = () => {
    window.open(`https://t.me/${property.ownerUsername}`, '_blank');
  };

  return (
    <div className="relative pb-40 bg-[#020617]">
      {/* Photo Gallery */}
      <div className="h-[450px] w-full overflow-x-auto flex snap-x snap-mandatory hide-scrollbar">
        {property.images.map((img, i) => (
          <div key={i} className="flex-shrink-0 w-full h-full snap-center relative">
            <img src={img} className="w-full h-full object-cover opacity-90" />
            <div className="absolute inset-0 bg-gradient-to-b from-[#020617]/60 via-transparent to-[#020617]"></div>
          </div>
        ))}
      </div>

      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="absolute top-6 left-6 w-12 h-12 bg-white/10 backdrop-blur-2xl rounded-2xl flex items-center justify-center border border-white/20 text-white active:scale-90 transition-all z-20"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7"/></svg>
      </button>

      {/* Info Container */}
      <div className="px-8 py-10 -mt-20 bg-[#020617] rounded-t-[3.5rem] relative z-10 space-y-10 border-t border-white/5">
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <span className="text-cyan-400 bg-cyan-500/10 border border-cyan-500/20 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest">{property.type}</span>
            {property.isVerified && <span className="text-amber-950 bg-[#f0d38e] px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg">Premium Verified</span>}
          </div>
          <h1 className="text-4xl font-extrabold text-white leading-[1.1] tracking-tight">{property.title}</h1>
          <div className="flex items-center text-slate-400 text-sm font-semibold">
            <span className="text-cyan-500 opacity-80"><Icons.MapPin /></span>
            <span className="ml-2">{property.city}, {property.address}</span>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-3 p-1 bg-white/5 rounded-[2.5rem] border border-white/5">
          <div className="text-center py-5 space-y-1">
            <span className="block text-cyan-400 font-extrabold text-xl">{property.distanceToSea}м</span>
            <span className="block text-[9px] text-slate-500 uppercase font-black tracking-[0.25em]">К морю</span>
          </div>
          <div className="text-center py-5 space-y-1 border-x border-white/5">
            <span className="block text-cyan-400 font-extrabold text-xl">{property.maxGuests}</span>
            <span className="block text-[9px] text-slate-500 uppercase font-black tracking-[0.25em]">Гостей</span>
          </div>
          <div className="text-center py-5 space-y-1">
            <span className="block text-cyan-400 font-extrabold text-xl">{property.pricePerNight} ₽</span>
            <span className="block text-[9px] text-slate-500 uppercase font-black tracking-[0.25em]">Ночь</span>
          </div>
        </div>

        {/* Owner Info Block */}
        <div className="bg-gradient-to-br from-[#0f172a] to-[#020617] border border-white/5 rounded-[3rem] p-8 space-y-6 shadow-2xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-5">
              <div className="w-16 h-16 bg-gradient-to-tr from-cyan-600 to-teal-400 rounded-3xl flex items-center justify-center text-white shadow-xl border border-white/20">
                <Icons.User />
              </div>
              <div>
                <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-cyan-500/60 mb-1">Host Profile</h3>
                <p className="text-white text-xl font-black">@{property.ownerUsername}</p>
              </div>
            </div>
          </div>
          <div className="pt-5 border-t border-white/5 flex items-center justify-between">
            <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">
              <span className="text-cyan-400 text-lg mr-1">{ownerPropertiesCount}</span> {ownerPropertiesCount === 1 ? 'Объект' : 'Объекта'}
            </p>
            <div className="flex items-center text-[#f0d38e] space-x-2 bg-amber-500/5 px-4 py-2 rounded-2xl border border-amber-500/10">
                <span className="text-[10px] font-black uppercase tracking-widest">Top Host</span>
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="space-y-4">
          <h2 className="font-black text-white text-xl tracking-tight uppercase tracking-widest text-cyan-500/80 text-[11px]">О доме</h2>
          <p className="text-slate-300 text-base leading-relaxed whitespace-pre-wrap font-medium">
            {property.description}
          </p>
        </div>

        {/* Amenities */}
        <div className="space-y-5">
          <h2 className="font-black text-white text-xl tracking-tight uppercase tracking-widest text-cyan-500/80 text-[11px]">Удобства</h2>
          <div className="flex flex-wrap gap-3">
            {property.amenities.map(a => (
              <span key={a} className="bg-white/5 border border-white/10 text-slate-300 text-[11px] px-6 py-3 rounded-2xl font-black uppercase tracking-widest">
                {a}
              </span>
            ))}
          </div>
        </div>

        {/* Disclaimer */}
        <div className="bg-cyan-500/5 border border-cyan-500/10 rounded-[2rem] p-6 text-[10px] text-slate-500 leading-relaxed font-bold uppercase tracking-widest">
           SeaHome — это информационный каталог. Прямой контакт без посредников. Мы не являемся сервисом бронирования.
        </div>
      </div>

      {/* Premium Sticky Action Bar - RAISED UP */}
      <div className="fixed bottom-28 left-0 right-0 z-50 p-6 pointer-events-none">
        <div className="max-w-xs mx-auto bg-[#0f172a]/90 backdrop-blur-3xl border border-white/10 rounded-[2.5rem] p-3.5 flex items-center justify-between shadow-[0_30px_60px_-15px_rgba(0,0,0,0.8)] pointer-events-auto">
          <div className="pl-4">
            <p className="text-[9px] font-black text-slate-500 uppercase tracking-[0.2em] mb-0.5">Ночь</p>
            <p className="text-lg font-black text-white">{property.pricePerNight} ₽</p>
          </div>
          
          <button
            onClick={handleContactOwner}
            className="group relative bg-gradient-to-tr from-cyan-600 to-teal-400 hover:from-cyan-500 hover:to-teal-300 text-[#020617] font-black px-6 py-3.5 rounded-[1.75rem] shadow-xl shadow-cyan-500/20 active:scale-95 transition-all flex items-center space-x-2.5 overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-t from-white/10 to-transparent opacity-50"></div>
            <svg className="w-5 h-5 relative z-10" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12c0 1.54.36 2.98.97 4.29L1 23l6.89-1.92A9.957 9.957 0 0012 22c5.52 0 10-4.48 10-10S17.52 2 12 2zm4.19 13.59c-.23.65-1.17 1.27-1.6 1.34-.4.07-.9.12-2.73-.62-2.31-.95-3.8-3.29-3.92-3.45-.12-.17-1.01-1.34-1.01-2.55s.62-1.81.84-2.06c.22-.25.48-.31.64-.31s.31.01.44.02c.15.01.35-.06.55.41.2.49.69 1.69.75 1.82.06.13.1.28.01.45-.09.17-.13.28-.27.44s-.27.32-.38.44c-.13.13-.27.27-.12.53.15.26.65 1.07 1.4 1.73.97.86 1.79 1.12 2.05 1.25.26.13.41.11.56-.05.15-.17.65-.75.82-.95.17-.2.35-.17.59-.08.23.09 1.48.7 1.73.83.25.13.41.19.47.3.06.11.06.64-.17 1.29z"/>
            </svg>
            <span className="text-xs font-black uppercase tracking-tighter relative z-10">Написать</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default PropertyDetailsPage;
