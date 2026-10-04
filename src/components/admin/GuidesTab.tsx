import React, { useState } from 'react';
import { StudentGuideSection, Language } from '../../types';
import { db } from '../../data/mockDb';
import { Plus, Trash2, Edit, BookOpen, ExternalLink } from 'lucide-react';

interface Props {
  currentLang: Language;
  addToast: (msg: string, type: 'success' | 'info' | 'warning') => void;
  addActivityLog: (action: string, details: string) => void;
}

export const GuidesTab: React.FC<Props> = ({ currentLang, addToast, addActivityLog }) => {
  const [guides, setGuides] = useState<StudentGuideSection[]>(db.getGuides());
  const [editingGuide, setEditingGuide] = useState<StudentGuideSection | null>(null);
  const [isAdding, setIsAdding] = useState(false);

  // Form states
  const [category, setCategory] = useState<StudentGuideSection['category']>('residence');
  const [titleAr, setTitleAr] = useState('');
  const [titleEn, setTitleEn] = useState('');
  const [titleTr, setTitleTr] = useState('');
  const [contentAr, setContentAr] = useState('');
  const [contentEn, setContentEn] = useState('');
  const [contentTr, setContentTr] = useState('');
  const [linkTitleAr, setLinkTitleAr] = useState('');
  const [linkUrl, setLinkUrl] = useState('');

  const openAdd = () => {
    setEditingGuide(null);
    setCategory('residence');
    setTitleAr('');
    setTitleEn('');
    setTitleTr('');
    setContentAr('');
    setContentEn('');
    setContentTr('');
    setLinkTitleAr('');
    setLinkUrl('');
    setIsAdding(true);
  };

  const openEdit = (g: StudentGuideSection) => {
    setEditingGuide(g);
    setCategory(g.category);
    setTitleAr(g.title.ar);
    setTitleEn(g.title.en);
    setTitleTr(g.title.tr);
    setContentAr(g.content.ar);
    setContentEn(g.content.en);
    setContentTr(g.content.tr);
    setLinkTitleAr(g.links?.[0]?.title.ar || '');
    setLinkUrl(g.links?.[0]?.url || '');
    setIsAdding(true);
  };

  const handleDelete = (id: string, title: string) => {
    if (!confirm(currentLang === 'ar' ? `هل أنت متأكد من حذف القسم "${title}"؟` : `Delete section "${title}"?`)) return;
    const updated = guides.filter(g => g.id !== id);
    db.saveGuides(updated);
    setGuides(updated);
    addActivityLog('حذف قسم من دليل الطالب', `تم حذف قسم: ${title}`);
    addToast(currentLang === 'ar' ? 'تم حذف القسم بنجاح' : 'Guide section deleted', 'info');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!titleAr || !contentAr) {
      alert('Please fill out Title and Content in Arabic');
      return;
    }

    const links = linkUrl ? [{
      title: { ar: linkTitleAr || titleAr, en: linkTitleAr || titleAr, tr: linkTitleAr || titleAr },
      url: linkUrl
    }] : [];

    const guideData: StudentGuideSection = {
      id: editingGuide ? editingGuide.id : 'g_' + Date.now(),
      category,
      title: { ar: titleAr, en: titleEn || titleAr, tr: titleTr || titleAr },
      content: { ar: contentAr, en: contentEn || contentAr, tr: contentTr || contentAr },
      links: links.length > 0 ? links : undefined
    };

    let updated: StudentGuideSection[];
    if (editingGuide) {
      updated = guides.map(g => g.id === editingGuide.id ? guideData : g);
      addActivityLog('تعديل دليل الطالب', `تحديث قسم: ${titleAr}`);
      addToast(currentLang === 'ar' ? 'تم تحديث قسم الدليل بنجاح' : 'Guide updated', 'success');
    } else {
      updated = [...guides, guideData];
      addActivityLog('إضافة قسم جديد لدليل الطالب', `إضافة: ${titleAr}`);
      addToast(currentLang === 'ar' ? 'تمت إضافة القسم للدليل بنجاح' : 'Guide section added', 'success');
    }

    db.saveGuides(updated);
    setGuides(updated);
    setIsAdding(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b gap-3">
        <div>
          <h2 className="text-xl font-bold text-[#163A4A]">
            {currentLang === 'ar' ? 'إدارة دليل الطالب الشامل والأسئلة الشائعة' : 'Student Guides & FAQs Desk'}
          </h2>
          <p className="text-xs text-slate-500">
            {currentLang === 'ar' ? 'التحكم بمعلومات الإقامة، التأمين، المواصلات، وأرقام الطوارئ' : 'Manage student legal guidance, health insurance, and local procedures'}
          </p>
        </div>
        <button
          onClick={openAdd}
          className="px-4 py-2 bg-[#163A4A] hover:bg-[#24495D] text-[#C8B273] text-xs font-bold rounded-lg flex items-center gap-1.5 self-start cursor-pointer transition-colors"
        >
          <Plus className="h-4 w-4" />
          <span>{currentLang === 'ar' ? 'إضافة قسم جديد للدليل' : 'Add Guide Section'}</span>
        </button>
      </div>

      {/* Guide cards list */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {guides.map(item => (
          <div key={item.id} className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-3 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-blue-50 text-blue-800 font-mono">
                  {item.category}
                </span>
                <span className="text-[10px] text-slate-400 font-mono">ID: {item.id}</span>
              </div>
              <h3 className="font-bold text-sm text-[#163A4A]">
                {item.title[currentLang] || item.title.ar}
              </h3>
              <p className="text-xs text-slate-600 line-clamp-3 mt-1.5 whitespace-pre-line">
                {item.content[currentLang] || item.content.ar}
              </p>
              {item.links && item.links.length > 0 && (
                <div className="mt-2 text-[11px] text-[#C8B273] font-semibold flex items-center gap-1">
                  <ExternalLink className="h-3 w-3" />
                  <a href={item.links[0].url} target="_blank" rel="noreferrer" className="underline truncate">
                    {item.links[0].title[currentLang] || item.links[0].title.ar}
                  </a>
                </div>
              )}
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t">
              <button
                onClick={() => openEdit(item)}
                className="px-3 py-1.5 text-xs text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg flex items-center gap-1 cursor-pointer font-semibold"
              >
                <Edit className="h-3.5 w-3.5" />
                <span>{currentLang === 'ar' ? 'تعديل' : 'Edit'}</span>
              </button>
              <button
                onClick={() => handleDelete(item.id, item.title.ar)}
                className="px-3 py-1.5 text-xs text-red-600 bg-red-50 hover:bg-red-100 rounded-lg flex items-center gap-1 cursor-pointer font-semibold"
              >
                <Trash2 className="h-3.5 w-3.5" />
                <span>{currentLang === 'ar' ? 'حذف' : 'Delete'}</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal Add/Edit */}
      {isAdding && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl p-6">
            <h3 className="text-lg font-bold text-[#163A4A] mb-4 pb-2 border-b">
              {editingGuide
                ? (currentLang === 'ar' ? 'تعديل قسم بالدليل' : 'Edit Guide Section')
                : (currentLang === 'ar' ? 'إضافة قسم جديد للدليل' : 'Add Guide Section')}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold mb-1">Category / التصنيف</label>
                <select value={category} onChange={e => setCategory(e.target.value as any)} className="w-full p-2 border rounded bg-white font-semibold">
                  <option value="residence">إجراءات الإقامة (Residence Permit)</option>
                  <option value="university">الجامعة والدراسة (University)</option>
                  <option value="health">التأمين الصحي (Health Insurance)</option>
                  <option value="transport">المواصلات والبطاقات (Transportation)</option>
                  <option value="accommodation">السكن والإيجار (Accommodation)</option>
                  <option value="emergency">الطوارئ والأرقام الرسمية (Emergency)</option>
                  <option value="faq">الأسئلة الشائعة (FAQ)</option>
                  <option value="links">روابط هامة (Important Links)</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold mb-1">العنوان بالعربي *</label>
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

              <div>
                <label className="block font-semibold mb-1">المحتوى والتفاصيل بالعربي *</label>
                <textarea required rows={4} value={contentAr} onChange={e => setContentAr(e.target.value)} className="w-full p-2 border rounded text-right font-sans" />
              </div>

              <div>
                <label className="block font-semibold mb-1">Content (EN)</label>
                <textarea rows={3} value={contentEn} onChange={e => setContentEn(e.target.value)} className="w-full p-2 border rounded" />
              </div>

              <div>
                <label className="block font-semibold mb-1">İçerik (TR)</label>
                <textarea rows={3} value={contentTr} onChange={e => setContentTr(e.target.value)} className="w-full p-2 border rounded" />
              </div>

              <div className="grid grid-cols-2 gap-2 border-t pt-2">
                <div>
                  <label className="block font-semibold mb-1">عنوان الرابط الخارجي (اختياري)</label>
                  <input value={linkTitleAr} onChange={e => setLinkTitleAr(e.target.value)} placeholder="مثال: بوابة إدارة الهجرة" className="w-full p-2 border rounded text-right" />
                </div>
                <div>
                  <label className="block font-semibold mb-1">رابط الويب (URL)</label>
                  <input value={linkUrl} onChange={e => setLinkUrl(e.target.value)} placeholder="https://..." className="w-full p-2 border rounded font-mono" />
                </div>
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
                  Save Section
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
