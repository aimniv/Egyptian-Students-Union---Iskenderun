import React, { useState } from 'react';
import { MediaItem, Language } from '../../types';
import { db } from '../../data/mockDb';
import { Plus, Trash2, Edit, Image, Video, FileText, ExternalLink } from 'lucide-react';
import { ImageUploadInput } from '../common/ImageUploadInput';

interface Props {
  currentLang: Language;
  addToast: (msg: string, type: 'success' | 'info' | 'warning') => void;
  addActivityLog: (action: string, details: string) => void;
}

export const MediaTab: React.FC<Props> = ({ currentLang, addToast, addActivityLog }) => {
  const [media, setMedia] = useState<MediaItem[]>(db.getMediaItems());
  const [editingItem, setEditingItem] = useState<MediaItem | null>(null);
  const [isAdding, setIsAdding] = useState(false);

  // Form states
  const [type, setType] = useState<MediaItem['type']>('photo');
  const [titleAr, setTitleAr] = useState('');
  const [titleEn, setTitleEn] = useState('');
  const [titleTr, setTitleTr] = useState('');
  const [url, setUrl] = useState('');
  const [thumbnail, setThumbnail] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  const openAdd = () => {
    setEditingItem(null);
    setType('photo');
    setTitleAr('');
    setTitleEn('');
    setTitleTr('');
    setUrl('https://images.unsplash.com/photo-1528605248644-14dd04022da1?auto=format&fit=crop&q=80&w=800');
    setThumbnail('');
    setDate(new Date().toISOString().split('T')[0]);
    setIsAdding(true);
  };

  const openEdit = (m: MediaItem) => {
    setEditingItem(m);
    setType(m.type);
    setTitleAr(m.title.ar);
    setTitleEn(m.title.en);
    setTitleTr(m.title.tr);
    setUrl(m.url);
    setThumbnail(m.thumbnail || '');
    setDate(m.date);
    setIsAdding(true);
  };

  const handleDelete = (id: string, title: string) => {
    if (!confirm(currentLang === 'ar' ? `هل أنت متأكد من حذف العنصر "${title}"؟` : `Delete media item "${title}"?`)) return;
    const updated = media.filter(m => m.id !== id);
    db.saveMediaItems(updated);
    setMedia(updated);
    addActivityLog('حذف عنصر وسائط', `تم حذف: ${title}`);
    addToast(currentLang === 'ar' ? 'تم حذف العنصر بنجاح' : 'Media item deleted', 'info');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!titleAr || !url) {
      alert('Please fill required fields');
      return;
    }

    const itemData: MediaItem = {
      id: editingItem ? editingItem.id : 'm_' + Date.now(),
      type,
      title: { ar: titleAr, en: titleEn || titleAr, tr: titleTr || titleAr },
      url,
      thumbnail: thumbnail || (type === 'photo' ? url : undefined),
      date
    };

    let updated: MediaItem[];
    if (editingItem) {
      updated = media.map(m => m.id === editingItem.id ? itemData : m);
      addActivityLog('تعديل عنصر بالمركز الإعلامي', `تحديث: ${titleAr}`);
      addToast(currentLang === 'ar' ? 'تم تحديث العنصر بنجاح' : 'Media item updated', 'success');
    } else {
      updated = [itemData, ...media];
      addActivityLog('إضافة عنصر للمركز الإعلامي', `إضافة: ${titleAr}`);
      addToast(currentLang === 'ar' ? 'تمت إضافة العنصر للمركز الإعلامي بنجاح' : 'Media item added', 'success');
    }

    db.saveMediaItems(updated);
    setMedia(updated);
    setIsAdding(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b gap-3">
        <div>
          <h2 className="text-xl font-bold text-[#163A4A]">
            {currentLang === 'ar' ? 'إدارة المركز الإعلامي وأرشيف الصور والفيديو' : 'Media Center & Digital Assets'}
          </h2>
          <p className="text-xs text-slate-500">
            {currentLang === 'ar' ? 'إضافة وتعديل ألبومات الصور، مقاطع الفيديو، المجلات الإلكترونية، والتقارير السنوية' : 'Manage official photo albums, documentaries, press releases, and magazines'}
          </p>
        </div>
        <button
          onClick={openAdd}
          className="px-4 py-2 bg-[#163A4A] hover:bg-[#24495D] text-[#C8B273] text-xs font-bold rounded-lg flex items-center gap-1.5 self-start cursor-pointer transition-colors"
        >
          <Plus className="h-4 w-4" />
          <span>{currentLang === 'ar' ? 'إضافة ملف إعلامي' : 'Add Media Item'}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {media.map(item => (
          <div key={item.id} className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm flex flex-col justify-between">
            <div className="relative h-36 bg-slate-100 overflow-hidden">
              {item.type === 'photo' || item.thumbnail ? (
                <img src={item.thumbnail || item.url} alt={item.title.ar} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-slate-800 text-[#C8B273]">
                  {item.type === 'video' ? <Video className="h-8 w-8" /> : <FileText className="h-8 w-8" />}
                </div>
              )}
              <span className="absolute top-2 right-2 bg-slate-900/80 text-[#C8B273] text-[9px] font-bold px-2 py-0.5 rounded font-mono uppercase">
                {item.type}
              </span>
            </div>
            <div className="p-3 flex-1 flex flex-col justify-between">
              <div>
                <span className="text-[10px] text-slate-400 font-mono block mb-1">{item.date}</span>
                <h4 className="font-bold text-xs text-[#163A4A] line-clamp-2">{item.title[currentLang] || item.title.ar}</h4>
              </div>
              <div className="flex items-center justify-between pt-2 border-t mt-2">
                <a href={item.url} target="_blank" rel="noreferrer" className="text-[11px] text-[#C8B273] hover:underline flex items-center gap-1 font-semibold">
                  <ExternalLink className="h-3 w-3" /> View
                </a>
                <div className="flex items-center gap-1">
                  <button onClick={() => openEdit(item)} className="p-1 text-slate-600 hover:text-[#163A4A] rounded cursor-pointer">
                    <Edit className="h-3.5 w-3.5" />
                  </button>
                  <button onClick={() => handleDelete(item.id, item.title.ar)} className="p-1 text-red-600 hover:bg-red-50 rounded cursor-pointer">
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {isAdding && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl p-6">
            <h3 className="text-lg font-bold text-[#163A4A] mb-4 pb-2 border-b">
              {editingItem
                ? (currentLang === 'ar' ? 'تعديل الملف الإعلامي' : 'Edit Media')
                : (currentLang === 'ar' ? 'إضافة ملف إعلامي جديد' : 'New Media')}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold mb-1">النوع / Type</label>
                  <select value={type} onChange={e => setType(e.target.value as any)} className="w-full p-2 border rounded bg-white font-semibold">
                    <option value="photo">صورة / ألبوم (Photo)</option>
                    <option value="video">فيديو (Video)</option>
                    <option value="magazine">مجلة إلكترونية (Magazine)</option>
                    <option value="press">خبر صحفي (Press)</option>
                    <option value="annual_report">تقرير سنوي (Report)</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold mb-1">التاريخ</label>
                  <input required type="date" value={date} onChange={e => setDate(e.target.value)} className="w-full p-2 border rounded font-mono" />
                </div>
              </div>

              <div>
                <label className="block font-semibold mb-1">العنوان بالعربي *</label>
                <input required value={titleAr} onChange={e => setTitleAr(e.target.value)} className="w-full p-2 border rounded text-right font-sans" />
              </div>

              <div>
                <label className="block font-semibold mb-1">Title (EN)</label>
                <input value={titleEn} onChange={e => setTitleEn(e.target.value)} className="w-full p-2 border rounded" />
              </div>

              {type === 'photo' ? (
                <ImageUploadInput
                  label="الصورة / Photo"
                  value={url}
                  onChange={setUrl}
                  required
                  helperText="Cihazınızdan fotoğraf yükleyebilir veya bağlantı girebilirsiniz."
                />
              ) : (
                <>
                  <div>
                    <label className="block font-semibold mb-1">رابط الفيديو أو الوثيقة (URL) *</label>
                    <input required value={url} onChange={e => setUrl(e.target.value)} placeholder="https://..." className="w-full p-2 border rounded font-mono" />
                  </div>
                  <ImageUploadInput
                    label="صورة مصغرة للغلاف (Thumbnail)"
                    value={thumbnail}
                    onChange={setThumbnail}
                    helperText="Video veya dergi kapağı görseli yükleyebilirsiniz."
                  />
                </>
              )}

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
                  Save Item
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
