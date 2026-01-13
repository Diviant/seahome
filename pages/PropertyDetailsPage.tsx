
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Listing, Review, User, ListingCategory } from '../types';
import { Icons } from '../constants';

interface PropertyDetailsPageProps {
  properties: Listing[];
  user: User;
  onAddReview: (id: string, review: Omit<Review, 'id' | 'date'>) => void;
}

const PropertyDetailsPage: React.FC<PropertyDetailsPageProps> = ({ properties, user, onAddReview }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const property = properties.find(p => p.id === id);

  const [newRating, setNewRating] = useState(5);
  const [newComment, setNewComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!property) return <div className="p-10 text-center text-slate-400">Объект не найден</div>;

  const handleContactOwner = () => window.open(`https://t.me/${property.ownerUsername}`, '_blank');

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    setIsSubmitting(true);
    
    setTimeout(() => {
      onAddReview(property.id, { 
        username: user.username, 
        rating: newRating, 
        text: newComment 
      });
      setNewComment('');
      setNewRating(5);
      setIsSubmitting(false);
    }, 800);
  };

  const isExchange = property.category === ListingCategory.EXCHANGE;
  const isFood = property.category === ListingCategory.FOOD;

  return (
    <div className="relative pb-48 bg-[#020617]">
      <div className="h-[400px] w-full overflow-x-auto flex snap-x snap-mandatory hide-scrollbar">
        {property.images.map((img, i) => (
          <div key={i} className="flex-shrink-0 w-full h-full snap-center relative">
            <img src={img} className="w-full h-full object-cover opacity-90" />
            <div className="absolute inset-0 bg-gradient-to-b from-[#020617]/60 via-transparent to-[#020617]"></div>
          </div>
        ))}
      </div>

      <button onClick={() => navigate(-1)} className="absolute top-6 left-6 w-12 h-12 bg-white/10 backdrop-blur-2xl rounded-2xl flex items-center justify-center border border-white/20 text-white active:scale-90 transition-all z-20 shadow-2xl">
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7"/>
        </svg>
      </button>

      <div className="px-8 py-10 -mt-20 bg-[#020617] rounded-t-[3.5rem] relative z-10 space-y-10">
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <span className="text-cyan-400 bg-cyan-500/10 border border-cyan-500/20 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest">{property.type}</span>
            <div className="bg-slate-900 px-3 py-1.5 rounded-full flex items-center space-x-1.5 border border-white/10">
              <span className="text-amber-400 text-xs">★</span>
              <span className="text-white text-[10px] font-black">{property.rating || '0.0'}</span>
            </div>
          </div>
          <h1 className="text-3xl font-extrabold text-white leading-tight tracking-tight">{property.title}</h1>
        </div>

        <div className="grid grid-cols-2 gap-4">
            <div className="bg-white/5 p-5 rounded-3xl border border-white/5">
                <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest mb-1">
                  {property.category === ListingCategory.STAY ? 'До моря' : 
                   property.category === ListingCategory.MOTO ? 'Двигатель' : 
                   property.category === ListingCategory.SIM ? 'Трафик' : 
                   property.category === ListingCategory.FOOD ? 'Кухня' : 'Валюты / Курсы'}
                </p>
                <p className="text-white font-bold leading-tight">
                  {property.category === ListingCategory.STAY ? `${property.distanceToSea} метров` : 
                   property.category === ListingCategory.MOTO ? property.engineCapacity : 
                   property.category === ListingCategory.SIM ? property.dataVolume : 
                   property.category === ListingCategory.FOOD ? property.cuisineType : property.exchangeRates}
                </p>
            </div>
            <div className="bg-white/5 p-5 rounded-3xl border border-white/5">
                <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest mb-1">
                  {property.category === ListingCategory.SIM ? 'Срок действия' : 
                   (property.category === ListingCategory.EXCHANGE || property.category === ListingCategory.FOOD) ? 'Время работы' : 'Регион'}
                </p>
                <p className="text-white font-bold truncate">
                  {property.category === ListingCategory.SIM ? property.validityPeriod : 
                   (property.category === ListingCategory.EXCHANGE || property.category === ListingCategory.FOOD) ? property.workingHours : property.city}
                </p>
            </div>
            <div className="bg-white/5 p-5 rounded-3xl border border-white/5 col-span-2">
                <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest mb-1">Точный адрес</p>
                <div className="flex items-center space-x-2 text-white font-bold text-sm">
                    <Icons.MapPin />
                    <span>{property.address}</span>
                </div>
            </div>
        </div>

        <div className="space-y-4">
            <h2 className="text-[10px] font-black text-cyan-500 uppercase tracking-widest">Описание</h2>
            <p className="text-slate-400 text-sm leading-relaxed whitespace-pre-line">{property.description}</p>
        </div>

        <div className="space-y-6">
            <h2 className="text-[10px] font-black text-cyan-500 uppercase tracking-widest">Особенности</h2>
            <div className="flex flex-wrap gap-2">
                {property.amenities.map(a => (
                    <span key={a} className="bg-white/5 text-slate-300 text-[10px] font-bold px-4 py-2 rounded-xl border border-white/5">{a}</span>
                ))}
            </div>
        </div>

        <div className="space-y-6 pt-6 border-t border-white/5">
            <h2 className="text-[10px] font-black text-cyan-500 uppercase tracking-widest">Оставить отзыв</h2>
            <form onSubmit={handleSubmitReview} className="space-y-4 bg-white/5 p-6 rounded-[2.5rem] border border-white/10 shadow-inner">
                <div className="flex items-center space-x-3 mb-2">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Ваша оценка:</span>
                    <div className="flex space-x-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <button
                                type="button"
                                key={star}
                                onClick={() => setNewRating(star)}
                                className={`text-xl transition-all ${star <= newRating ? 'text-amber-400 scale-110' : 'text-slate-700 hover:text-slate-500'}`}
                            >
                                ★
                            </button>
                        ))}
                    </div>
                </div>
                <textarea
                    className="w-full bg-slate-900/50 border border-white/10 rounded-2xl p-4 text-sm text-slate-200 outline-none focus:border-cyan-500/50 transition-colors resize-none h-24"
                    placeholder="Поделитесь вашим опытом..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                />
                <button
                    type="submit"
                    disabled={isSubmitting || !newComment.trim()}
                    className={`w-full py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all ${
                        isSubmitting || !newComment.trim() 
                        ? 'bg-slate-800 text-slate-500 cursor-not-allowed' 
                        : 'bg-white text-[#020617] hover:bg-cyan-400 active:scale-95'
                    }`}
                >
                    {isSubmitting ? 'Отправка...' : 'Опубликовать отзыв'}
                </button>
            </form>
        </div>

        <div className="space-y-8">
          <h2 className="text-[10px] font-black text-cyan-500 uppercase tracking-widest">Отзывы ({property.reviews.length})</h2>
          <div className="space-y-5">
            {property.reviews.length === 0 ? (
              <div className="text-center py-10 opacity-30 flex flex-col items-center">
                <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center mb-3">
                  <Icons.User />
                </div>
                <p className="text-[10px] font-black uppercase tracking-widest">Станьте первым, кто оставит отзыв!</p>
              </div>
            ) : (
              property.reviews.map((rev) => (
                <div key={rev.id} className="bg-white/5 border border-white/5 p-6 rounded-[2rem] space-y-4 animate-in fade-in slide-in-from-bottom-2">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-gradient-to-tr from-slate-800 to-slate-700 rounded-full flex items-center justify-center text-[10px] font-black text-white border border-white/10">
                            {rev.username.charAt(0).toUpperCase()}
                        </div>
                        <div className="flex flex-col">
                            <span className="text-white font-bold text-xs">@{rev.username}</span>
                            <span className="text-[8px] text-slate-600 font-black uppercase tracking-widest">
                                {new Date(rev.date).toLocaleDateString()}
                            </span>
                        </div>
                    </div>
                    <div className="flex space-x-0.5">
                        {[1, 2, 3, 4, 5].map(s => (
                            <span key={s} className={`text-[10px] ${s <= rev.rating ? 'text-amber-400' : 'text-slate-800'}`}>★</span>
                        ))}
                    </div>
                  </div>
                  <p className="text-slate-400 text-sm leading-relaxed">{rev.text}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <div className="fixed bottom-32 left-0 right-0 z-50 p-6 pointer-events-none">
        <div className="max-w-[320px] mx-auto bg-[#0f172a]/95 backdrop-blur-3xl border border-white/10 rounded-[2.5rem] p-3 flex items-center justify-between shadow-[0_40px_80px_-15px_rgba(0,0,0,0.9)] pointer-events-auto">
          <div className="pl-5">
            <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest mb-0.5">
              {isExchange ? 'Комиссия / Вход' : isFood ? 'Средний чек' : 'Стоимость'}
            </p>
            <p className="text-lg font-black text-white">
                {isFood ? `${property.averageBill} ₽` : `${property.pricePerNight} ₽`}
            </p>
          </div>
          <button onClick={handleContactOwner} className="bg-gradient-to-tr from-cyan-600 to-teal-400 text-[#020617] font-black px-8 py-3.5 rounded-[1.75rem] text-xs uppercase tracking-tight active:scale-95 transition-all">
              {isFood ? 'Забронировать' : 'Связаться в TG'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PropertyDetailsPage;
