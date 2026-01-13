
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Property, PropertyType, ModerationStatus, User } from '../types';
import { Icons, AMENITIES, REGIONS } from '../constants';
import { generateDescription } from '../geminiService';

interface AddPropertyPageProps {
  user: User;
  onAdd: (p: Property) => void;
}

const AddPropertyPage: React.FC<AddPropertyPageProps> = ({ user, onAdd }) => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    type: PropertyType.GUEST_HOUSE,
    description: '',
    region: REGIONS[0],
    city: '',
    address: '',
    price: '',
    distance: '',
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
    const newProp: Property = {
      id: Math.random().toString(36).substr(2, 9),
      ownerId: user.id,
      ownerUsername: user.username,
      title: formData.title,
      description: formData.description,
      type: formData.type,
      country: 'Россия',
      region: formData.region,
      city: formData.city,
      address: formData.address,
      pricePerNight: Number(formData.price),
      distanceToSea: Number(formData.distance),
      maxGuests: Number(formData.guests),
      amenities: formData.amenities,
      images: formData.images,
      status: ModerationStatus.PENDING,
      createdAt: Date.now(),
      isVerified: false,
      isFeatured: false,
    };
    onAdd(newProp);
    navigate('/dashboard');
  };

  const Progress = () => (
    <div className="flex space-x-2 mb-8">
      {[1, 2, 3].map(i => (
        <div key={i} className={`h-1.5 flex-1 rounded-full transition-all duration-500 ${i <= step ? 'bg-blue-600' : 'bg-slate-800'}`} />
      ))}
    </div>
  );

  return (
    <div className="p-6 space-y-8 bg-slate-950 min-h-screen">
      <header className="flex items-center space-x-4">
        <button onClick={() => navigate(-1)} className="text-slate-500 hover:text-slate-300 active:scale-75 transition-all">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7 7-7"/></svg>
        </button>
        <h1 className="text-2xl font-bold text-slate-50">Новое объявление</h1>
      </header>

      <Progress />

      {step === 1 && (
        <div className="space-y-6 animate-in slide-in-from-right-4">
          <div className="space-y-4">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block">Тип жилья</label>
            <div className="grid grid-cols-1 gap-3">
              {Object.values(PropertyType).map(t => (
                <button
                  key={t}
                  onClick={() => setFormData({ ...formData, type: t })}
                  className={`p-5 rounded-[2rem] border-2 text-left transition-all active:scale-[0.98] ${
                    formData.type === t ? 'border-blue-600 bg-blue-600/10 text-slate-50 shadow-lg shadow-blue-600/5' : 'border-slate-800 bg-slate-900 text-slate-500'
                  }`}
                >
                  <span className="font-bold text-base">{t}</span>
                </button>
              ))}
            </div>
          </div>
          <div className="space-y-3">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block ml-1">Название объекта</label>
            <input
              type="text"
              placeholder="Напр. Домик у Марии"
              className="w-full p-5 bg-slate-900 border border-slate-800 rounded-[2rem] text-slate-100 placeholder-slate-600 focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            />
          </div>
          <button
            disabled={!formData.title}
            onClick={() => setStep(2)}
            className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-5 rounded-[2rem] disabled:opacity-30 shadow-2xl shadow-blue-600/20 active:scale-95 transition-all mt-4"
          >
            Продолжить
          </button>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-6 animate-in slide-in-from-right-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-3">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block ml-1">Регион</label>
              <select
                className="w-full p-4 bg-slate-900 border border-slate-800 rounded-2xl text-slate-200 text-sm focus:ring-blue-600"
                value={formData.region}
                onChange={(e) => setFormData({ ...formData, region: e.target.value })}
              >
                {REGIONS.map(r => <option key={r} value={r} className="bg-slate-900">{r}</option>)}
              </select>
            </div>
            <div className="space-y-3">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block ml-1">Город</label>
              <input
                type="text"
                className="w-full p-4 bg-slate-900 border border-slate-800 rounded-2xl text-slate-200 text-sm focus:ring-blue-600"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
              />
            </div>
          </div>
          <div className="space-y-3">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block ml-1">Адрес объекта</label>
            <input
              type="text"
              className="w-full p-4 bg-slate-900 border border-slate-800 rounded-2xl text-slate-200 text-sm focus:ring-blue-600"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-3">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block ml-1">Цена (₽/ночь)</label>
              <input
                type="number"
                className="w-full p-4 bg-slate-900 border border-slate-800 rounded-2xl text-slate-200 text-sm focus:ring-blue-600"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              />
            </div>
            <div className="space-y-3">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block ml-1">До моря (м)</label>
              <input
                type="number"
                className="w-full p-4 bg-slate-900 border border-slate-800 rounded-2xl text-slate-200 text-sm focus:ring-blue-600"
                value={formData.distance}
                onChange={(e) => setFormData({ ...formData, distance: e.target.value })}
              />
            </div>
          </div>
          <div className="flex space-x-3 pt-4">
            <button onClick={() => setStep(1)} className="flex-1 bg-slate-900 border border-slate-800 text-slate-400 font-bold py-5 rounded-[2rem] active:scale-95 transition-all">Назад</button>
            <button
              disabled={!formData.city || !formData.address || !formData.price || !formData.distance}
              onClick={() => setStep(3)}
              className="flex-[2] bg-blue-600 hover:bg-blue-500 text-white font-bold py-5 rounded-[2rem] disabled:opacity-30 shadow-xl shadow-blue-600/20 active:scale-95 transition-all"
            >
              Далее
            </button>
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="space-y-8 animate-in slide-in-from-right-4 pb-12">
          <div className="space-y-3">
            <div className="flex justify-between items-center ml-1">
               <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Описание</label>
               <button 
                onClick={handleAIGenerate}
                className="text-blue-400 text-[10px] font-black uppercase tracking-widest hover:text-blue-300 disabled:opacity-40 transition-colors"
                disabled={loading}
              >
                {loading ? 'Создаем...' : '✨ AI-генерация'}
              </button>
            </div>
            <textarea
              className="w-full p-5 bg-slate-900 border border-slate-800 rounded-[2rem] h-36 text-sm text-slate-200 focus:ring-blue-600 resize-none"
              placeholder="Расскажите о преимуществах вашего жилья..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>

          <div className="space-y-4">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1 block">Удобства</label>
            <div className="flex flex-wrap gap-2.5">
              {AMENITIES.map(a => (
                <button
                  key={a}
                  onClick={() => handleToggleAmenity(a)}
                  className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all border ${
                    formData.amenities.includes(a) 
                      ? 'bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-600/20 scale-105' 
                      : 'bg-slate-900 border-slate-800 text-slate-500'
                  }`}
                >
                  {a}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1 block">Галерея</label>
            <div className="flex space-x-3 overflow-x-auto pb-4 hide-scrollbar">
              {formData.images.map((img, i) => (
                <div key={i} className="w-28 h-28 rounded-3xl overflow-hidden flex-shrink-0 border border-slate-800 shadow-lg relative group">
                  <img src={img} className="w-full h-full object-cover opacity-80" />
                  <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                </div>
              ))}
              <button className="w-28 h-28 rounded-3xl bg-slate-900 flex items-center justify-center text-slate-600 border-2 border-dashed border-slate-800 hover:border-slate-600 hover:text-slate-400 transition-all active:scale-95">
                <Icons.Plus />
              </button>
            </div>
          </div>

          <div className="flex space-x-3 pt-4">
            <button onClick={() => setStep(2)} className="flex-1 bg-slate-900 border border-slate-800 text-slate-400 font-bold py-5 rounded-[2rem] active:scale-95 transition-all">Назад</button>
            <button
              onClick={handleSubmit}
              className="flex-[2] bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-5 rounded-[2rem] shadow-2xl shadow-emerald-600/20 active:scale-95 transition-all border border-emerald-500/20"
            >
              Опубликовать
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddPropertyPage;
