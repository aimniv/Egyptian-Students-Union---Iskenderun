import React, { useState } from 'react';
import { Sponsor, Language } from '../../types';
import { db } from '../../data/mockDb';
import { Plus, Trash2, Edit, ExternalLink, Award } from 'lucide-react';
import { ImageUploadInput } from '../common/ImageUploadInput';
import { confirmDialog, alertDialog } from '../../lib/dialog';

interface Props {
  currentLang: Language;
  addToast: (msg: string, type: 'success' | 'info' | 'warning') => void;
  addActivityLog: (action: string, details: string) => void;
}

export const SponsorsTab: React.FC<Props> = ({ currentLang, addToast, addActivityLog }) => {
  const [sponsors, setSponsors] = useState<Sponsor[]>(db.getSponsors());
  const [editingSponsor, setEditingSponsor] = useState<Sponsor | null>(null);
  const [isAdding, setIsAdding] = useState(false);

  // Form states
  const [nameAr, setNameAr] = useState('');
  const [nameEn, setNameEn] = useState('');
  const [nameTr, setNameTr] = useState('');
  const [logo, setLogo] = useState('');
  const [website, setWebsite] = useState('');
  const [tier, setTier] = useState<Sponsor['tier']>('gold');

  const openAdd = () => {
    setEditingSponsor(null);
    setNameAr('');
    setNameEn('');
    setNameTr('');
    setLogo('https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?auto=format&fit=crop&q=80&w=150');
    setWebsite('');
    setTier('gold');
    setIsAdding(true);
  };

  const openEdit = (s: Sponsor) => {
    setEditingSponsor(s);
    setNameAr(s.name.ar);
    setNameEn(s.name.en);
    setNameTr(s.name.tr);
    setLogo(s.logo);
    setWebsite(s.website || '');
    setTier(s.tier);
    setIsAdding(true);
  };

  const handleDelete = async (id: string, name: string) => {
    if (!(await confirmDialog(currentLang === 'ar' ? `هل أنت متأكد من حذف الشريك "${name}"؟` : `Delete sponsor "${name}"?`))) return;
    const updated = sponsors.filter(s => s.id !== id);
    db.saveSponsors(updated);
    setSponsors(updated);
    addActivityLog('حذف جهة راعية وشريك', `تم حذف: ${name}`);
    addToast(currentLang === 'ar' ? 'تم حذف الجهة الراعية بنجاح' : 'Sponsor deleted', 'info');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nameAr || !logo) {
      alertDialog('Please fill required fields');
      return;
    }

    const sponsorData: Sponsor = {
      id: editingSponsor ? editingSponsor.id : 's_' + Date.now(),
      name: { ar: nameAr, en: nameEn || nameAr, tr: nameTr || nameAr },
      logo,
      website: website || undefined,
      tier
    };

    let updated: Sponsor[];
    if (editingSponsor) {
      updated = sponsors.map(s => s.id === editingSponsor.id ? sponsorData : s);
      addActivityLog('تعديل بيانات راعي وشريك', `تحديث: ${nameAr}`);
      addToast(currentLang === 'ar' ? 'تم تحديث بيانات الراعي بنجاح' : 'Sponsor updated', 'success');
    } else {
      updated = [...sponsors, sponsorData];
      addActivityLog('إضافة راعي وشريك جديد', `إضافة: ${nameAr}`);
      addToast(currentLang === 'ar' ? 'تمت إضافة الراعي بنجاح' : 'Sponsor added', 'success');
    }

    db.saveSponsors(updated);
    setSponsors(updated);
    setIsAdding(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b gap-3">
        <div>
          <h2 className="text-xl font-bold text-[#163A4A]">
            {currentLang === 'ar' ? 'إدارة الرعاة والشركاء الاستراتيجيين' : 'Sponsors & Corporate Partners'}
          </h2>
          <p className="text-xs text-slate-500">
            {currentLang === 'ar' ? 'إضافة وتعديل الرعاة الرسميين والملحقيات والمؤسسات الشريكة' : 'Manage corporate sponsors, tiers, and partner logos'}
          </p>
        </div>
        <button
          onClick={openAdd}
          className="px-4 py-2 bg-[#163A4A] hover:bg-[#24495D] text-[#C8B273] text-xs font-bold rounded-lg flex items-center gap-1.5 self-start cursor-pointer transition-colors"
        >
          <Plus className="h-4 w-4" />
          <span>{currentLang === 'ar' ? 'إضافة راعي / شريك' : 'Add Sponsor'}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {sponsors.map(sp => (
          <div key={sp.id} className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm flex flex-col justify-between">
            <div className="flex items-center gap-3">
              <img src={sp.logo} alt={sp.name.ar} className="w-14 h-14 rounded-lg object-contain border p-1 bg-slate-50 shrink-0" />
              <div className="min-w-0">
                <span className="text-[9px] font-bold uppercase px-2 py-0.5 rounded bg-[#C8B273]/20 text-[#163A4A] font-mono">
                  {sp.tier}
                </span>
                <h4 className="font-bold text-xs text-[#163A4A] truncate mt-1">{sp.name[currentLang] || sp.name.ar}</h4>
                {sp.website && (
                  <a href={sp.website} target="_blank" rel="noreferrer" className="text-[10px] text-slate-400 hover:underline flex items-center gap-1 mt-0.5 truncate">
                    <ExternalLink className="h-2.5 w-2.5" /> Visit site
                  </a>
                )}
              </div>
            </div>

            <div className="flex items-center justify-end gap-1 pt-3 border-t mt-3">
              <button onClick={() => openEdit(sp)} className="p-1.5 text-slate-600 hover:text-[#163A4A] rounded cursor-pointer">
                <Edit className="h-3.5 w-3.5" />
              </button>
              <button onClick={() => handleDelete(sp.id, sp.name.ar)} className="p-1.5 text-red-600 hover:bg-red-50 rounded cursor-pointer">
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {isAdding && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl p-6">
            <h3 className="text-lg font-bold text-[#163A4A] mb-4 pb-2 border-b">
              {editingSponsor
                ? (currentLang === 'ar' ? 'تعديل بيانات الشريك' : 'Edit Partner')
                : (currentLang === 'ar' ? 'إضافة شريك جديد' : 'New Partner')}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold mb-1">اسم الجهة (عربي) *</label>
                <input required value={nameAr} onChange={e => setNameAr(e.target.value)} className="w-full p-2 border rounded text-right font-sans" />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold mb-1">Name (EN)</label>
                  <input value={nameEn} onChange={e => setNameEn(e.target.value)} className="w-full p-2 border rounded" />
                </div>
                <div>
                  <label className="block font-semibold mb-1">İsim (TR)</label>
                  <input value={nameTr} onChange={e => setNameTr(e.target.value)} className="w-full p-2 border rounded" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold mb-1">Tier / فئة الرعاية</label>
                  <select value={tier} onChange={e => setTier(e.target.value as any)} className="w-full p-2 border rounded bg-white font-semibold">
                    <option value="partner">شريك استراتيجي (Partner)</option>
                    <option value="gold">ذهبي (Gold)</option>
                    <option value="silver">فضي (Silver)</option>
                    <option value="bronze">برونزي (Bronze)</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold mb-1">موقع الويب (URL)</label>
                  <input value={website} onChange={e => setWebsite(e.target.value)} placeholder="https://..." className="w-full p-2 border rounded font-mono" />
                </div>
              </div>

              <ImageUploadInput
                label="شعار الجهة أو الراعي (Sponsor Logo)"
                value={logo}
                onChange={setLogo}
                required
                helperText="Cihazınızdan logo dosyası yükleyebilir veya link girebilirsiniz."
              />

              <div className="flex gap-2 pt-4 border-t">
                <button
                  type="button"
                  onClick={() => setIsAdding(false)}
                  className="flex-1 py-2 border rounded hover:bg-slate-50 cursor-pointer font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 bg-[#163A4A] text-[#C8B273] rounded font-bold hover:bg-[#24495D] cursor-pointer"
                >
                  Save Partner
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
