import React, { useState } from 'react';
import { Activity, Language } from '../../types';
import { db } from '../../data/mockDb';
import { Plus, Trash2, Edit, Calendar, ExternalLink } from 'lucide-react';
import { ImageUploadInput } from '../common/ImageUploadInput';

interface Props {
  currentLang: Language;
  addToast: (msg: string, type: 'success' | 'info' | 'warning') => void;
  addActivityLog: (action: string, details: string) => void;
}

export const ActivitiesTab: React.FC<Props> = ({ currentLang, addToast, addActivityLog }) => {
  const [activities, setActivities] = useState<Activity[]>(db.getActivities());
  const [editingActivity, setEditingActivity] = useState<Activity | null>(null);
  const [isAdding, setIsAdding] = useState(false);

  // Form states
  const [titleAr, setTitleAr] = useState('');
  const [titleEn, setTitleEn] = useState('');
  const [titleTr, setTitleTr] = useState('');
  const [descAr, setDescAr] = useState('');
  const [descEn, setDescEn] = useState('');
  const [descTr, setDescTr] = useState('');
  const [category, setCategory] = useState<Activity['category']>('community');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [image, setImage] = useState('');
  const [mediaCoverageUrl, setMediaCoverageUrl] = useState('');

  const openAdd = () => {
    setEditingActivity(null);
    setTitleAr('');
    setTitleEn('');
    setTitleTr('');
    setDescAr('');
    setDescEn('');
    setDescTr('');
    setCategory('community');
    setDate(new Date().toISOString().split('T')[0]);
    setImage('https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&q=80&w=600');
    setMediaCoverageUrl('');
    setIsAdding(true);
  };

  const openEdit = (act: Activity) => {
    setEditingActivity(act);
    setTitleAr(act.title.ar);
    setTitleEn(act.title.en);
    setTitleTr(act.title.tr);
    setDescAr(act.description.ar);
    setDescEn(act.description.en);
    setDescTr(act.description.tr);
    setCategory(act.category);
    setDate(act.date);
    setImage(act.image);
    setMediaCoverageUrl(act.mediaCoverageUrl || '');
    setIsAdding(true);
  };

  const handleDelete = (id: string, title: string) => {
    if (!confirm(currentLang === 'ar' ? `هل أنت متأكد من حذف النشاط "${title}"؟` : `Delete activity "${title}"?`)) return;
    const updated = activities.filter(a => a.id !== id);
    db.saveActivities(updated);
    setActivities(updated);
    addActivityLog('حذف نشاط ومبادرة', `تم حذف النشاط: ${title}`);
    addToast(currentLang === 'ar' ? 'تم حذف النشاط بنجاح' : 'Activity deleted', 'info');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!titleAr || !date) {
      alert('Please fill required fields');
      return;
    }

    const activityData: Activity = {
      id: editingActivity ? editingActivity.id : 'ac_' + Date.now(),
      title: { ar: titleAr, en: titleEn || titleAr, tr: titleTr || titleAr },
      description: { ar: descAr, en: descEn || descAr, tr: descTr || descAr },
      category,
      date,
      image: image || 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&q=80&w=600',
      mediaCoverageUrl: mediaCoverageUrl || undefined
    };

    let updated: Activity[];
    if (editingActivity) {
      updated = activities.map(a => a.id === editingActivity.id ? activityData : a);
      addActivityLog('تعديل نشاط ومبادرة', `تحديث النشاط: ${titleAr}`);
      addToast(currentLang === 'ar' ? 'تم تحديث النشاط بنجاح' : 'Activity updated', 'success');
    } else {
      updated = [activityData, ...activities];
      addActivityLog('إضافة نشاط ومبادرة جديدة', `إضافة: ${titleAr}`);
      addToast(currentLang === 'ar' ? 'تمت إضافة النشاط بنجاح' : 'Activity added', 'success');
    }

    db.saveActivities(updated);
    setActivities(updated);
    setIsAdding(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b gap-3">
        <div>
          <h2 className="text-xl font-bold text-[#163A4A]">
            {currentLang === 'ar' ? 'إدارة الأنشطة والمشاريع والمبادرات' : 'Activities & Initiatives Desk'}
          </h2>
          <p className="text-xs text-slate-500">
            {currentLang === 'ar' ? 'توثيق أنشطة الاتحاد التطوعية، المجتمعية، الثقافية، والرياضية' : 'Manage community drives, volunteer campaigns, and student projects'}
          </p>
        </div>
        <button
          onClick={openAdd}
          className="px-4 py-2 bg-[#163A4A] hover:bg-[#24495D] text-[#C8B273] text-xs font-bold rounded-lg flex items-center gap-1.5 self-start cursor-pointer transition-colors"
        >
          <Plus className="h-4 w-4" />
          <span>{currentLang === 'ar' ? 'إضافة نشاط جديد' : 'Add Activity'}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {activities.map(act => (
          <div key={act.id} className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm flex flex-col justify-between">
            <div className="relative h-40 overflow-hidden bg-slate-100">
              <img src={act.image} alt={act.title.ar} className="w-full h-full object-cover" />
              <span className="absolute top-2 right-2 bg-slate-900/80 text-[#C8B273] text-[10px] font-bold px-2 py-0.5 rounded font-mono uppercase">
                {act.category}
              </span>
            </div>
            <div className="p-4 flex-1 flex flex-col justify-between">
              <div>
                <span className="text-[10px] text-slate-400 font-mono block mb-1">{act.date}</span>
                <h3 className="font-bold text-sm text-[#163A4A]">{act.title[currentLang] || act.title.ar}</h3>
                <p className="text-xs text-slate-600 line-clamp-2 mt-1">{act.description[currentLang] || act.description.ar}</p>
                {act.mediaCoverageUrl && (
                  <a href={act.mediaCoverageUrl} target="_blank" rel="noreferrer" className="text-[11px] text-[#C8B273] underline flex items-center gap-1 mt-2">
                    <ExternalLink className="h-3 w-3" />
                    <span>تغطية صحفية / Media Coverage</span>
                  </a>
                )}
              </div>
              <div className="flex items-center justify-end gap-2 pt-3 border-t mt-3">
                <button
                  onClick={() => openEdit(act)}
                  className="px-3 py-1.5 text-xs text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg flex items-center gap-1 cursor-pointer font-semibold"
                >
                  <Edit className="h-3.5 w-3.5" />
                  <span>{currentLang === 'ar' ? 'تعديل' : 'Edit'}</span>
                </button>
                <button
                  onClick={() => handleDelete(act.id, act.title.ar)}
                  className="px-3 py-1.5 text-xs text-red-600 bg-red-50 hover:bg-red-100 rounded-lg flex items-center gap-1 cursor-pointer font-semibold"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  <span>{currentLang === 'ar' ? 'حذف' : 'Delete'}</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {isAdding && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl p-6">
            <h3 className="text-lg font-bold text-[#163A4A] mb-4 pb-2 border-b">
              {editingActivity
                ? (currentLang === 'ar' ? 'تعديل النشاط والمبادرة' : 'Edit Activity')
                : (currentLang === 'ar' ? 'إضافة نشاط جديد' : 'New Activity')}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold mb-1">Category / التصنيف</label>
                  <select value={category} onChange={e => setCategory(e.target.value as any)} className="w-full p-2 border rounded bg-white font-semibold">
                    <option value="community">خدمة المجتمع (Community)</option>
                    <option value="volunteer">عمل تطوعي (Volunteer)</option>
                    <option value="cultural">ثقافي (Cultural)</option>
                    <option value="sports">رياضي (Sports)</option>
                    <option value="educational">تعليمي (Educational)</option>
                    <option value="projects">مشاريع تقنية (Projects)</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold mb-1">التاريخ *</label>
                  <input required type="date" value={date} onChange={e => setDate(e.target.value)} className="w-full p-2 border rounded font-mono" />
                </div>
              </div>

              <div>
                <label className="block font-semibold mb-1">عنوان النشاط (عربي) *</label>
                <input required value={titleAr} onChange={e => setTitleAr(e.target.value)} className="w-full p-2 border rounded text-right font-sans" />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold mb-1">Title (EN)</label>
                  <input value={titleEn} onChange={e => setTitleEn(e.target.value)} className="w-full p-2 border rounded" />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Başlık (TR)</label>
                  <input value={titleTr} onChange={e => setTitleTr(e.target.value)} className="w-full p-2 border rounded" />
                </div>
              </div>

              <ImageUploadInput
                label="صورة غلاف النشاط (Activity Cover Image)"
                value={image}
                onChange={setImage}
                helperText="Cihazınızdan fotoğraf yükleyebilir veya bağlantı yapıştırabilirsiniz."
              />

              <div>
                <label className="block font-semibold mb-1">وصف النشاط بالعربي *</label>
                <textarea required rows={3} value={descAr} onChange={e => setDescAr(e.target.value)} className="w-full p-2 border rounded text-right font-sans" />
              </div>

              <div>
                <label className="block font-semibold mb-1">Description (EN)</label>
                <textarea rows={2} value={descEn} onChange={e => setDescEn(e.target.value)} className="w-full p-2 border rounded" />
              </div>

              <div>
                <label className="block font-semibold mb-1">رابط تغطية إعلامية أو صحفية (اختياري)</label>
                <input value={mediaCoverageUrl} onChange={e => setMediaCoverageUrl(e.target.value)} placeholder="https://..." className="w-full p-2 border rounded font-mono" />
              </div>

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
                  Save Activity
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
