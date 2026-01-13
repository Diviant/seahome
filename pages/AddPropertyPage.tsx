
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Listing, PropertyType, ModerationStatus, User, ListingCategory } from '../types';
import { Icons, AMENITIES, REGIONS } from '../constants';
import { generateDescription } from '../geminiService';

interface AddPropertyPageProps {
  user: User;
  onAdd: (p: Listing) => void;
}

const AddPropertyPage: React.FC<AddPropertyPageProps> = ({ user, onAdd }) => {
  const navigate = useNavigate();
  const [step, setStep] = useState(0); 
  const [loading, setLoading] = useState(false);
  
  const russianRegions = ['Крым', 'Краснодарский край', 'Кавказские Минеральные Воды'];

  const [formData, setFormData] = useState({
    category: ListingCategory.STAY,
    title: '',
    type: PropertyType.GUEST_HOUSE,
    description: '',
    region: REGIONS[0],
    city: '',
    address: '',
    price: '',
    distance: '',
    engine: '155cc',
    data: 'Unlimited',
    validity: '30 days',
    rates: 'RUB -> THB (0.38)',
    hours: '10:00 - 20:00',
    guests: '2',
    amenities: [] as string[],
    images: ['https://picsum.photos/seed/' + Math.random() + '/800/600'],
  });

  const handleToggleAmenity = (a: string) => {
    setFormData(prev => ({
      ...prev,
      amenities: prev.amenities.includes(a) 
        ? prev.amenities.filter(item => item !== a)
        : [...prev.amenities, a]
    }));
  };

  const handleAIGenerate = async () => {
    if (!formData.title) return alert('Сначала введите название');
    setLoading(true);
    const desc = await generateDescription({
      title: formData.title,
      type: formData.type,
      amenities: formData.amenities,
      distanceToSea: Number(formData.distance)
    });
    if (desc) setFormData(prev => ({ ...prev, description: desc }));
    setLoading(false);
  };

  const handleSubmit = () => {
    const newProp: Listing = {
      id: Math.random().toString(36).substr(2, 9),
      category: formData.category,
      ownerId: user.id,
      ownerUsername: user.username,
      title: formData.title,
      description: formData.description,
      type: formData.type,
      country: russianRegions.includes(formData.region) ? 'Россия' : 'Зарубежье',
      region: formData.region,
      city: formData.city,
      address: formData.address,
      pricePerNight: Number(formData.price) || 0,
      distanceToSea: formData.category === ListingCategory.STAY ? Number(formData.distance) : undefined,
      engineCapacity: formData.category === ListingCategory.MOTO ? formData.engine : undefined,
      dataVolume: formData.category === ListingCategory.SIM ? formData.data : undefined,
      validityPeriod: formData.category === ListingCategory.SIM ? formData.validity : undefined,
      exchangeRates: formData.category === ListingCategory.EXCHANGE ? formData.rates : undefined,
      workingHours: formData.category === ListingCategory.EXCHANGE ? formData.hours : undefined,
      maxGuests: formData.category === ListingCategory.STAY ? Number(formData.guests) : undefined,
      amenities: formData.amenities,
      images: formData.images,
      status: ModerationStatus.PENDING,
      createdAt: Date.now(),
      isVerified: false,
      isFeatured: false,
      rating: 0,
      reviews: [],
    };
    onAdd(newProp);
    navigate('/dashboard');
  };

  const currentCategory = formData.category;
  
  // Для категорий Мото, Сим и Обмен исключаем регионы России из списка выбора
  const availableRegions = currentCategory === ListingCategory.STAY 
    ? REGIONS 
    : REGIONS.filter(r => !russianRegions.includes(r));

  return (
    <div className="p-6 space-y-8 bg-slate-950 min-h-screen pb-32">
      <header className="flex items-center space-x-4">
        <button onClick={() => navigate(-1)} className="text-slate-500 active:scale-75 transition-all">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7 7-7"/></svg>
        </button>
        <h1 className="text-xl font-black text-slate-50 uppercase tracking-tight">Разместить объявление</h1>
      </header>

      {step === 0 && (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
          <div className="text-center space-y-2 px-4">
            <h2 className="text-2xl font-black text-white">Что вы предлагаете?</h2>
            <p className="text-slate-500 text-sm">Выберите категорию вашего предложения</p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => { setFormData({...formData, category: ListingCategory.STAY, type: PropertyType.GUEST_HOUSE}); setStep(1); }}
              className="p-6 rounded-[2.5rem] bg-slate-900 border-2 border-slate-800 flex flex-col items-center space-y-3 hover:border-cyan-500 transition-all active:scale-95"
            >
              <div className="w-10 h-10 bg-cyan-500/10 text-cyan-400 rounded-2xl flex items-center justify-center"><Icons.Home /></div>
              <span className="font-black text-white uppercase tracking-widest text-[8px]">Жильё</span>
            </button>
            <button
              onClick={() => { setFormData({...formData, category: ListingCategory.MOTO, type: PropertyType.SCOOTER}); setStep(1); }}
              className="p-6 rounded-[2.5rem] bg-slate-900 border-2 border-slate-800 flex flex-col items-center space-y-3 hover:border-teal-500 transition-all active:scale-95"
            >
              <div className="w-10 h-10 bg-teal-500/10 text-teal-400 rounded-2xl flex items-center justify-center"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg></div>
              <span className="font-black text-white uppercase tracking-widest text-[8px]">Мото</span>
            </button>
            <button
              onClick={() => { setFormData({...formData, category: ListingCategory.SIM, type: PropertyType.PREPAID}); setStep(1); }}
              className="p-6 rounded-[2.5rem] bg-slate-900 border-2 border-slate-800 flex flex-col items-center space-y-3 hover:border-amber-500 transition-all active:scale-95"
            >
              <div className="w-10 h-10 bg-amber-500/10 text-amber-400 rounded-2xl flex items-center justify-center"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"/></svg></div>
              <span className="font-black text-white uppercase tracking-widest text-[8px]">Сим</span>
            </button>
            <button
              onClick={() => { setFormData({...formData, category: ListingCategory.EXCHANGE, type: PropertyType.CASH}); setStep(1); }}
              className="p-6 rounded-[2.5rem] bg-slate-900 border-2 border-slate-800 flex flex-col items-center space-y-3 hover:border-indigo-500 transition-all active:scale-95"
            >
              <div className="w-10 h-10 bg-indigo-500/10 text-indigo-400 rounded-2xl flex items-center justify-center"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 8c-1.657 0-3 1.343-3 3s1.343 3 3 3 3-1.343 3-3-1.343-3-3-3zM12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/></svg></div>
              <span className="font-black text-white uppercase tracking-widest text-[8px]">Обмен</span>
            </button>
          </div>
        </div>
      )}

      {step === 1 && (
        <div className="space-y-6 animate-in slide-in-from-right-4">
          <div className="space-y-4">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block">Тип услуги/объекта</label>
            <div className="grid grid-cols-2 gap-3">
              {(currentCategory === ListingCategory.STAY ? [PropertyType.GUEST_HOUSE, PropertyType.PRIVATE_HOUSE, PropertyType.MINI_HOTEL] : 
                currentCategory === ListingCategory.MOTO ? [PropertyType.SCOOTER, PropertyType.TOURING, PropertyType.CLASSIC] : 
                currentCategory === ListingCategory.SIM ? [PropertyType.PREPAID, PropertyType.DATA_ONLY, PropertyType.E_SIM] :
                [PropertyType.CASH, PropertyType.CRYPTO, PropertyType.BANK_TRANSFER]).map(t => (
                <button
                  key={t}
                  onClick={() => setFormData({ ...formData, type: t })}
                  className={`p-4 rounded-2xl border-2 text-center transition-all ${
                    formData.type === t ? 'border-cyan-500 bg-cyan-500/10 text-white' : 'border-slate-800 bg-slate-900 text-slate-500'
                  }`}
                >
                  <span className="font-bold text-[10px]">{t}</span>
                </button>
              ))}
            </div>
          </div>
          <div className="space-y-3">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block">Название (Напр. Phuket Money)</label>
            <input
              type="text"
              className="w-full p-5 bg-slate-900 border border-slate-800 rounded-2xl text-white outline-none focus:border-cyan-500"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            />
          </div>
          <div className="flex space-x-3 pt-4">
            <button onClick={() => setStep(0)} className="flex-1 bg-slate-800 text-slate-400 font-bold py-5 rounded-2xl text-xs uppercase">Назад</button>
            <button disabled={!formData.title} onClick={() => setStep(2)} className="flex-[2] bg-cyan-600 text-white font-bold py-5 rounded-2xl text-xs uppercase">Далее</button>
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-6 animate-in slide-in-from-right-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-3">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block">Регион</label>
              <select 
                className="w-full p-4 bg-slate-900 border border-slate-800 rounded-2xl text-white outline-none" 
                value={formData.region} 
                onChange={(e) => setFormData({ ...formData, region: e.target.value })}
              >
                {availableRegions.map(r => <option key={r} value={r} className="bg-slate-900">{r}</option>)}
              </select>
            </div>
            <div className="space-y-3">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block">Город</label>
              <input type="text" className="w-full p-4 bg-slate-900 border border-slate-800 rounded-2xl text-white outline-none" value={formData.city} onChange={(e) => setFormData({ ...formData, city: e.target.value })} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-3">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block">
                {currentCategory === ListingCategory.EXCHANGE ? 'Мин. сумма (₽)' : 'Цена (₽)'}
              </label>
              <input type="number" className="w-full p-4 bg-slate-900 border border-slate-800 rounded-2xl text-white" value={formData.price} onChange={(e) => setFormData({ ...formData, price: e.target.value })} />
            </div>
            <div className="space-y-3">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block text-ellipsis overflow-hidden whitespace-nowrap">
                {currentCategory === ListingCategory.STAY ? 'До моря (м)' : 
                 currentCategory === ListingCategory.MOTO ? 'Объем (сс)' : 
                 currentCategory === ListingCategory.SIM ? 'Трафик (ГБ)' : 'Валюты / Курс'}
              </label>
              <input type="text" className="w-full p-4 bg-slate-900 border border-slate-800 rounded-2xl text-white" 
                value={currentCategory === ListingCategory.STAY ? formData.distance : 
                       currentCategory === ListingCategory.MOTO ? formData.engine : 
                       currentCategory === ListingCategory.SIM ? formData.data : formData.rates} 
                onChange={(e) => setFormData({ ...formData, [currentCategory === ListingCategory.STAY ? 'distance' : 
                                                            currentCategory === ListingCategory.MOTO ? 'engine' : 
                                                            currentCategory === ListingCategory.SIM ? 'data' : 'rates']: e.target.value })} />
            </div>
          </div>
          {currentCategory === ListingCategory.EXCHANGE && (
            <div className="space-y-3">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block">Время работы</label>
              <input type="text" className="w-full p-4 bg-slate-900 border border-slate-800 rounded-2xl text-white" value={formData.hours} onChange={(e) => setFormData({ ...formData, hours: e.target.value })} />
            </div>
          )}
          <div className="flex space-x-3 pt-4">
            <button onClick={() => setStep(1)} className="flex-1 bg-slate-800 text-slate-400 font-bold py-5 rounded-2xl text-xs uppercase">Назад</button>
            <button disabled={!formData.city} onClick={() => setStep(3)} className="flex-[2] bg-cyan-600 text-white font-bold py-5 rounded-2xl text-xs uppercase">Далее</button>
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="space-y-8 animate-in slide-in-from-right-4 pb-12">
          <div className="space-y-3">
             <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block">Описание и условия</label>
             <textarea className="w-full p-5 bg-slate-900 border border-slate-800 rounded-2xl h-32 text-white outline-none resize-none" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} />
          </div>
          <div className="space-y-4">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block">Теги / Особенности</label>
            <div className="flex flex-wrap gap-2">
              {(currentCategory === ListingCategory.STAY ? AMENITIES : 
                currentCategory === ListingCategory.MOTO ? ['Шлем', 'Страховка', 'Багажник'] : 
                currentCategory === ListingCategory.SIM ? ['5G', 'Безлимит', 'Доставка'] :
                ['Курьер', 'Безопасно', 'Лучший курс', 'Без комиссии']).map(a => (
                <button key={a} onClick={() => handleToggleAmenity(a)} className={`px-4 py-2 rounded-xl text-[10px] font-bold border ${formData.amenities.includes(a) ? 'bg-cyan-600 border-cyan-500 text-white' : 'bg-slate-900 border-slate-800 text-slate-500'}`}>{a}</button>
              ))}
            </div>
          </div>
          <div className="flex space-x-3 pt-4">
            <button onClick={() => setStep(2)} className="flex-1 bg-slate-800 text-slate-400 font-bold py-5 rounded-2xl text-xs uppercase">Назад</button>
            <button onClick={handleSubmit} className="flex-[2] bg-emerald-600 text-white font-bold py-5 rounded-2xl text-xs uppercase">Опубликовать</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddPropertyPage;
