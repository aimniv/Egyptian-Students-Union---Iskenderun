import React, { useState } from 'react';
import { Announcement, Language } from '../../types';
import { db } from '../../data/mockDb';
import { Plus, Trash2, Edit, Pin, Megaphone } from 'lucide-react';
import { ImageUploadInput } from '../common/ImageUploadInput';
import { confirmDialog, alertDialog } from '../../lib/dialog';

interface Props {
  currentLang: Language;
  addToast: (msg: string, type: 'success' | 'info' | 'warning') => void;
  addActivityLog: (action: string, details: string) => void;
}

export const AnnouncementsTab: React.FC<Props> = ({ currentLang, addToast, addActivityLog }) => {
  const [announcements, setAnnouncements] = useState<Announcement[]>(db.getAnnouncements());
  const [editingAnn, setEditingAnn] = useState<Announcement | null>(null);
  const [isAdding, setIsAdding] = useState(false);

  // Form states
  const [titleAr, setTitleAr] = useState('');
  const [titleEn, setTitleEn] = useState('');
  const [titleTr, setTitleTr] = useState('');
  const [contentAr, setContentAr] = useState('');
  const [contentEn, setContentEn] = useState('');
  const [contentTr, setContentTr] = useState('');
  const [category, setCategory] = useState<Announcement['category']>('scholarships');
  const [publishDate, setPublishDate] = useState(new Date().toISOString().split('T')[0]);
  const [isPinned, setIsPinned] = useState(false);
  const [image, setImage] = useState('');

  const openAdd = () => {
    setEditingAnn(null);
    setTitleAr('');
    setTitleEn('');
    setTitleTr('');
    setContentAr('');
    setContentEn('');
    setContentTr('');
    setCategory('scholarships');
    setPublishDate(new Date().toISOString().split('T')[0]);
    setIsPinned(false);
    setImage('');
    setIsAdding(true);
  };

  const openEdit = (a: Announcement) => {
    setEditingAnn(a);
    setTitleAr(a.title.ar);
    setTitleEn(a.title.en);
    setTitleTr(a.title.tr);
    setContentAr(a.content.ar);
    setContentEn(a.content.en);
    setContentTr(a.content.tr);
    setCategory(a.category);
    setPublishDate(a.publishDate);
    setIsPinned(a.isPinned);
    setImage(a.image || '');
    setIsAdding(true);
  };

  const handleDelete = async (id: string, title: string) => {
    if (!(await confirmDialog(currentLang === 'ar' ? `هل أنت متأكد من حذف الإعلان "${title}"؟` : `Delete announcement "${title}"?`))) return;
    const updated = announcements.filter(a => a.id !== id);
    db.saveAnnouncements(updated);
    setAnnouncements(updated);
    addActivityLog('حذف إعلان وتعميم', `تم حذف: ${title}`);
    addToast(currentLang === 'ar' ? 'تم حذف الإعلان بنجاح' : 'Announcement deleted', 'info');
  };

  const handleTogglePin = (id: string) => {
    const updated = announcements.map(a => a.id === id ? { ...a, isPinned: !a.isPinned } : a);
    db.saveAnnouncements(updated);
    setAnnouncements(updated);
    addToast('Pin status toggled', 'success');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!titleAr || !contentAr) {
      alertDialog('Please fill required fields');
      return;
    }

    const annData: Announcement = {
      id: editingAnn ? editingAnn.id : 'a_' + Date.now(),
      title: { ar: titleAr, en: titleEn || titleAr, tr: titleTr || titleAr },
      content: { ar: contentAr, en: contentEn || contentAr, tr: contentTr || contentAr },
      category,
      publishDate,
      isPinned,
      image: image || undefined
    };

    let updated: Announcement[];
    if (editingAnn) {
      updated = announcements.map(a => a.id === editingAnn.id ? annData : a);
      addActivityLog('تعديل إعلان رسمي', `تحديث: ${titleAr}`);
      addToast(currentLang === 'ar' ? 'تم تحديث الإعلان بنجاح' : 'Announcement updated', 'success');
    } else {
      updated = [annData, ...announcements];
      addActivityLog('نشر إعلان رسمي جديد', `إضافة: ${titleAr}`);
      addToast(currentLang === 'ar' ? 'تم نشر الإعلان بنجاح' : 'Announcement published', 'success');
    }

    db.saveAnnouncements(updated);
    setAnnouncements(updated);
    setIsAdding(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b gap-3">
        <div>
          <h2 className="text-xl font-bold text-[#163A4A]">
            {currentLang === 'ar' ? 'إدارة الإعلانات وتعميمات المنح الدراسية' : 'News & Announcements Desk'}
          </h2>
          <p className="text-xs text-slate-500">
            {currentLang === 'ar' ? 'نشر التعميمات الرسمية، المنح التركية، وفرص التدريب الصيفي' : 'Manage scholarships, urgent alerts, and institutional circulars'}
          </p>
        </div>
        <button
          onClick={openAdd}
          className="px-4 py-2 bg-[#163A4A] hover:bg-[#24495D] text-[#C8B273] text-xs font-bold rounded-lg flex items-center gap-1.5 self-start cursor-pointer transition-colors"
        >
          <Plus className="h-4 w-4" />
          <span>{currentLang === 'ar' ? 'نشر إعلان جديد' : 'Compose News'}</span>
        </button>
      </div>

      <div className="space-y-3">
        {announcements.map(ann => (
          <div key={ann.id} className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              {ann.image && (
                <img src={ann.image} alt={ann.title.ar} className="w-16 h-16 rounded-lg object-cover shrink-0" />
              )}
              <div>
                <div className="flex items-center gap-2 text-[10px] text-slate-400 font-mono">
                  <span>{ann.publishDate}</span>
                  <span>•</span>
                  <span className="font-bold uppercase text-[#163A4A]">{ann.category}</span>
                  {ann.isPinned && (
                    <span className="bg-amber-100 text-amber-800 font-bold px-1.5 py-0.2 rounded">📌 مثبت</span>
                  )}
                </div>
                <h3 className="font-bold text-sm text-[#163A4A] mt-1">{ann.title[currentLang] || ann.title.ar}</h3>
                <p className="text-xs text-slate-500 line-clamp-2 mt-1">{ann.content[currentLang] || ann.content.ar}</p>
              </div>
            </div>

            <div className="flex items-center gap-1.5 shrink-0 self-end sm:self-center">
              <button
                onClick={() => handleTogglePin(ann.id)}
                className={`px-2.5 py-1 text-[11px] font-bold rounded border cursor-pointer ${
                  ann.isPinned ? 'bg-amber-100 text-amber-900 border-amber-300' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                }`}
              >
                {ann.isPinned ? 'إلغاء التثبيت' : 'تثبيت بأعلى الموقع'}
              </button>
              <button onClick={() => openEdit(ann)} className="p-1.5 text-slate-600 hover:text-[#163A4A] rounded cursor-pointer">
                <Edit className="h-3.5 w-3.5" />
              </button>
              <button onClick={() => handleDelete(ann.id, ann.title.ar)} className="p-1.5 text-red-600 hover:bg-red-50 rounded cursor-pointer">
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {isAdding && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl p-6">
            <h3 className="text-lg font-bold text-[#163A4A] mb-4 pb-2 border-b">
              {editingAnn
                ? (currentLang === 'ar' ? 'تعديل الإعلان' : 'Edit Announcement')
                : (currentLang === 'ar' ? 'نشر إعلان جديد' : 'New Announcement')}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold mb-1">Category / التصنيف</label>
                  <select value={category} onChange={e => setCategory(e.target.value as any)} className="w-full p-2 border rounded bg-white font-semibold">
                    <option value="scholarships">منح دراسية (Scholarships)</option>
                    <option value="internships">فرص تدريب (Internships)</option>
                    <option value="official">بيان رسمي (Official)</option>
                    <option value="university_news">أخبار الجامعة (University)</option>
                    <option value="emergency">عاجل وطارئ (Emergency)</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold mb-1">تاريخ النشر *</label>
                  <input required type="date" value={publishDate} onChange={e => setPublishDate(e.target.value)} className="w-full p-2 border rounded font-mono" />
                </div>
              </div>

              <div>
                <label className="block font-semibold mb-1">عنوان الإعلان (عربي) *</label>
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
                label="صورة أو بوستر توضيحي للإعلان"
                value={image}
                onChange={setImage}
                helperText="Cihazınızdan görsel yükleyebilir veya bağlantı girebilirsiniz."
              />

              <div>
                <label className="block font-semibold mb-1">تفاصيل الإعلان بالعربي *</label>
                <textarea required rows={4} value={contentAr} onChange={e => setContentAr(e.target.value)} className="w-full p-2 border rounded text-right font-sans" />
              </div>

              <div>
                <label className="block font-semibold mb-1">Content (EN)</label>
                <textarea rows={3} value={contentEn} onChange={e => setContentEn(e.target.value)} className="w-full p-2 border rounded" />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input type="checkbox" id="pinnedCheck" checked={isPinned} onChange={e => setIsPinned(e.target.checked)} className="rounded" />
                <label htmlFor="pinnedCheck" className="font-semibold cursor-pointer">تثبيت هذا الإعلان في أعلى قائمة الأخبار بالصفحة الرئيسية</label>
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
                  Publish Announcement
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
