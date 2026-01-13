
import React from 'react';
import { Property, ModerationStatus } from '../types';

interface AdminPanelPageProps {
  properties: Property[];
  onUpdate: (p: Property) => void;
}

const AdminPanelPage: React.FC<AdminPanelPageProps> = ({ properties, onUpdate }) => {
  const pending = properties.filter(p => p.status === ModerationStatus.PENDING);

  const handleApprove = (p: Property) => {
    onUpdate({ ...p, status: ModerationStatus.APPROVED });
  };

  const handleReject = (p: Property) => {
    const reason = prompt('Укажите причину отклонения:');
    if (reason) {
      onUpdate({ ...p, status: ModerationStatus.REJECTED, rejectionReason: reason });
    }
  };

  return (
    <div className="p-5 space-y-8 bg-slate-950 min-h-screen">
      <div className="space-y-1">
        <h1 className="text-2xl font-black text-slate-50 tracking-tight">Модерация</h1>
        <p className="text-slate-500 text-sm font-medium">{pending.length} заявок ожидают проверки</p>
      </div>

      {pending.length === 0 ? (
        <div className="text-center py-24 flex flex-col items-center">
          <div className="w-20 h-20 bg-slate-900 rounded-full flex items-center justify-center mb-6 opacity-40">
              <svg className="w-10 h-10 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M5 13l4 4L19 7"/></svg>
          </div>
          <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Очередь пуста</p>
        </div>
      ) : (
        <div className="space-y-8 pb-20">
          {pending.map(p => (
            <div key={p.id} className="bg-slate-900 border border-slate-800 rounded-[2.5rem] overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-300">
              <div className="relative h-56">
                <img src={p.images[0]} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent"></div>
                <div className="absolute bottom-4 left-6">
                    <span className="bg-blue-600 text-white text-[10px] font-black uppercase px-3 py-1 rounded-full">{p.type}</span>
                </div>
              </div>
              <div className="p-6 space-y-6">
                <div className="space-y-1">
                  <h3 className="font-bold text-xl text-slate-50">{p.title}</h3>
                  <p className="text-sm text-slate-400">{p.city}, {p.address}</p>
                  <p className="text-xs text-blue-400 font-black mt-2">Владелец: @{p.ownerUsername}</p>
                </div>
                
                <div className="bg-slate-950/50 p-4 rounded-2xl border border-slate-800/50 text-xs text-slate-400 leading-relaxed font-medium line-clamp-3 italic">
                  "{p.description}"
                </div>

                <div className="grid grid-cols-2 gap-3 text-[10px] font-black uppercase tracking-[0.15em]">
                  <div className="p-3 bg-slate-800 text-slate-200 rounded-2xl text-center border border-slate-700/50">{p.pricePerNight} ₽ / ночь</div>
                  <div className="p-3 bg-slate-800 text-slate-200 rounded-2xl text-center border border-slate-700/50">{p.distanceToSea} м до моря</div>
                </div>

                <div className="flex space-x-3 pt-2">
                  <button
                    onClick={() => handleReject(p)}
                    className="flex-1 bg-slate-800 text-rose-500 border border-rose-500/20 font-black py-4 rounded-2xl hover:bg-rose-500/10 transition-all active:scale-95 text-xs uppercase tracking-widest"
                  >
                    Отклонить
                  </button>
                  <button
                    onClick={() => handleApprove(p)}
                    className="flex-1 bg-emerald-600 text-white font-black py-4 rounded-2xl shadow-xl shadow-emerald-600/20 hover:bg-emerald-500 transition-all active:scale-95 text-xs uppercase tracking-widest border border-emerald-400/20"
                  >
                    Одобрить
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminPanelPage;
