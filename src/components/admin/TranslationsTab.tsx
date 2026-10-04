import React, { useState } from 'react';
import { Language } from '../../types';
import { Search, Plus, Save } from 'lucide-react';

interface Props {
  currentLang: Language;
  translations: Record<string, { ar: string; tr: string; en: string }>;
  onTranslationUpdate: (newTrans: Record<string, { ar: string; tr: string; en: string }>) => void;
  addToast: (msg: string, type: 'success' | 'info' | 'warning') => void;
  addActivityLog: (action: string, details: string) => void;
}

export const TranslationsTab: React.FC<Props> = ({
  currentLang,
  translations,
  onTranslationUpdate,
  addToast,
  addActivityLog,
}) => {
  const [search, setSearch] = useState('');
  const [newKey, setNewKey] = useState('');
  const [newAr, setNewAr] = useState('');
  const [newTr, setNewTr] = useState('');
  const [newEn, setNewEn] = useState('');
  const [showAddKey, setShowAddKey] = useState(false);

  const handleEdit = (key: string, lang: Language, val: string) => {
    const updated = { ...translations };
    if (!updated[key]) updated[key] = { ar: '', tr: '', en: '' };
    updated[key][lang] = val;
    onTranslationUpdate(updated);
  };

  const handleAddNewKey = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newKey.trim()) return;
    const cleanKey = newKey.trim();
    const updated = {
      ...translations,
      [cleanKey]: {
        ar: newAr || cleanKey,
        tr: newTr || cleanKey,
        en: newEn || cleanKey
      }
    };
    onTranslationUpdate(updated);
    addActivityLog('إضافة مفتاح ترجمة جديد', `إضافة المفتاح ${cleanKey}`);
    addToast('New translation key added', 'success');
    setNewKey('');
    setNewAr('');
    setNewTr('');
    setNewEn('');
    setShowAddKey(false);
  };

  const keys = Object.keys(translations).filter(k => {
    const q = search.toLowerCase();
    return !search ||
      k.toLowerCase().includes(q) ||
      translations[k]?.ar?.toLowerCase().includes(q) ||
      translations[k]?.tr?.toLowerCase().includes(q) ||
      translations[k]?.en?.toLowerCase().includes(q);
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b gap-3">
        <div>
          <h2 className="text-xl font-bold text-[#163A4A]">
            {currentLang === 'ar' ? 'محرر النصوص والترجمات الكلي للموقع' : 'Multilingual Localization CMS'}
          </h2>
          <p className="text-xs text-slate-500">
            {currentLang === 'ar' ? 'تعديل كل عنوان، فقرة، أو زر في الموقع باللغات العربية والتركية والإنجليزية فورياً' : 'Live edit any UI string across Arabic, Turkish, and English'}
          </p>
        </div>
        <div className="flex items-center gap-2 self-start sm:self-center">
          <div className="flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-lg border w-48 sm:w-64">
            <Search className="h-4 w-4 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search dictionary..."
              className="bg-transparent border-none text-xs focus:ring-0 outline-none w-full"
            />
          </div>
          <button
            onClick={() => setShowAddKey(!showAddKey)}
            className="px-3 py-2 bg-[#163A4A] text-[#C8B273] text-xs font-bold rounded-lg flex items-center gap-1 cursor-pointer"
          >
            <Plus className="h-4 w-4" />
            <span>Add Key</span>
          </button>
        </div>
      </div>

      {showAddKey && (
        <form onSubmit={handleAddNewKey} className="bg-slate-50 border p-4 rounded-xl space-y-3 text-xs">
          <h4 className="font-bold text-[#163A4A]">إضافة مفتاح لغوي جديد للمنظومة</h4>
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-2">
            <input
              placeholder="key.name (e.g. hero.cta)"
              value={newKey}
              onChange={e => setNewKey(e.target.value)}
              className="p-2 border rounded font-mono bg-white"
              required
            />
            <input
              placeholder="Arabic translation"
              value={newAr}
              onChange={e => setNewAr(e.target.value)}
              className="p-2 border rounded bg-white text-right"
            />
            <input
              placeholder="Turkish translation"
              value={newTr}
              onChange={e => setNewTr(e.target.value)}
              className="p-2 border rounded bg-white"
            />
            <input
              placeholder="English translation"
              value={newEn}
              onChange={e => setNewEn(e.target.value)}
              className="p-2 border rounded bg-white"
            />
          </div>
          <div className="flex justify-end gap-2">
            <button type="button" onClick={() => setShowAddKey(false)} className="px-3 py-1.5 border rounded">Cancel</button>
            <button type="submit" className="px-4 py-1.5 bg-[#163A4A] text-[#C8B273] font-bold rounded">Create Key</button>
          </div>
        </form>
      )}

      <div className="bg-white p-4 rounded-xl border max-h-[65vh] overflow-y-auto space-y-4">
        {keys.map(key => (
          <div key={key} className="p-3.5 bg-slate-50/80 rounded-xl border border-slate-200/80 space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <span className="font-mono font-bold text-[#163A4A] text-[11px] bg-slate-200/60 px-2 py-0.5 rounded">
                {key}
              </span>
              <span className="text-[10px] text-green-700 font-mono">Live Saved</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-2 pt-1">
              <div>
                <label className="block text-[10px] font-bold text-slate-500 mb-0.5">العربية (AR) - من اليمين</label>
                <input
                  type="text"
                  value={translations[key]?.ar || ''}
                  onChange={e => handleEdit(key, 'ar', e.target.value)}
                  className="w-full p-2 bg-white border rounded text-right font-sans"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-500 mb-0.5">Türkçe (TR)</label>
                <input
                  type="text"
                  value={translations[key]?.tr || ''}
                  onChange={e => handleEdit(key, 'tr', e.target.value)}
                  className="w-full p-2 bg-white border rounded"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-500 mb-0.5">English (EN)</label>
                <input
                  type="text"
                  value={translations[key]?.en || ''}
                  onChange={e => handleEdit(key, 'en', e.target.value)}
                  className="w-full p-2 bg-white border rounded font-sans"
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
