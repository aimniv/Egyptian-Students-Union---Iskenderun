import React, { useState } from 'react';
import { Event, EventRegistration, Language } from '../../types';
import { db } from '../../data/mockDb';
import { Plus, Trash2, Edit, Users, Calendar, QrCode, ArrowRight, CheckCircle2 } from 'lucide-react';
import { ImageUploadInput } from '../common/ImageUploadInput';

interface Props {
  currentLang: Language;
  addToast: (msg: string, type: 'success' | 'info' | 'warning') => void;
  addActivityLog: (action: string, details: string) => void;
}

export const EventsTab: React.FC<Props> = ({ currentLang, addToast, addActivityLog }) => {
  const [events, setEvents] = useState<Event[]>(db.getEvents());
  const [registrations, setRegistrations] = useState<EventRegistration[]>(db.getRegistrations());
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [viewingRegistrationsEvent, setViewingRegistrationsEvent] = useState<Event | null>(null);

  // Form states
  const [titleAr, setTitleAr] = useState('');
  const [titleEn, setTitleEn] = useState('');
  const [titleTr, setTitleTr] = useState('');
  const [descAr, setDescAr] = useState('');
  const [descEn, setDescEn] = useState('');
  const [descTr, setDescTr] = useState('');
  const [category, setCategory] = useState<Event['category']>('academic');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [locAr, setLocAr] = useState('');
  const [locEn, setLocEn] = useState('');
  const [locTr, setLocTr] = useState('');
  const [capacity, setCapacity] = useState(100);
  const [image, setImage] = useState('');
  const [countdownActive, setCountdownActive] = useState(false);

  const openAdd = () => {
    setEditingEvent(null);
    setTitleAr('');
    setTitleEn('');
    setTitleTr('');
    setDescAr('');
    setDescEn('');
    setDescTr('');
    setCategory('academic');
    setDate(new Date().toISOString().split('T')[0]);
    setTime('14:00');
    setLocAr('قاعة الاحتفالات، جامعة إسكندرون التقنية');
    setLocEn('Grand Hall, İSTE');
    setLocTr('İSTE Konferans Salonu');
    setCapacity(100);
    setImage('https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80&w=600');
    setCountdownActive(true);
    setIsAdding(true);
  };

  const openEdit = (ev: Event) => {
    setEditingEvent(ev);
    setTitleAr(ev.title.ar);
    setTitleEn(ev.title.en);
    setTitleTr(ev.title.tr);
    setDescAr(ev.description.ar);
    setDescEn(ev.description.en);
    setDescTr(ev.description.tr);
    setCategory(ev.category);
    setDate(ev.date);
    setTime(ev.time);
    setLocAr(ev.location.ar);
    setLocEn(ev.location.en);
    setLocTr(ev.location.tr);
    setCapacity(ev.capacity);
    setImage(ev.image);
    setCountdownActive(ev.countdownActive);
    setIsAdding(true);
  };

  const handleDelete = (id: string, title: string) => {
    if (!confirm(currentLang === 'ar' ? `هل أنت متأكد من حذف الفعالية "${title}"؟` : `Delete event "${title}"?`)) return;
    const updated = events.filter(e => e.id !== id);
    db.saveEvents(updated);
    setEvents(updated);
    addActivityLog('حذف فعالية', `تم حذف: ${title}`);
    addToast(currentLang === 'ar' ? 'تم حذف الفعالية بنجاح' : 'Event deleted', 'info');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!titleAr || !date || !time) {
      alert('Please fill required fields');
      return;
    }

    const eventData: Event = {
      id: editingEvent ? editingEvent.id : 'e_' + Date.now(),
      title: { ar: titleAr, en: titleEn || titleAr, tr: titleTr || titleAr },
      description: { ar: descAr, en: descEn || descAr, tr: descTr || descAr },
      category,
      date,
      time,
      location: { ar: locAr, en: locEn || locAr, tr: locTr || locAr },
      image: image || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80&w=600',
      capacity: Number(capacity) || 100,
      registeredCount: editingEvent ? editingEvent.registeredCount : 0,
      countdownActive,
      qrCodeValue: editingEvent ? editingEvent.qrCodeValue : 'MOB-EV-' + Math.floor(1000 + Math.random() * 9000)
    };

    let updated: Event[];
    if (editingEvent) {
      updated = events.map(ev => ev.id === editingEvent.id ? eventData : ev);
      addActivityLog('تعديل فعالية', `تحديث: ${titleAr}`);
      addToast(currentLang === 'ar' ? 'تم تحديث الفعالية بنجاح' : 'Event updated', 'success');
    } else {
      updated = [eventData, ...events];
      addActivityLog('إضافة فعالية جديدة', `إضافة: ${titleAr}`);
      addToast(currentLang === 'ar' ? 'تمت إضافة الفعالية بنجاح' : 'Event added', 'success');
    }

    db.saveEvents(updated);
    setEvents(updated);
    setIsAdding(false);
  };

  const handleToggleAttendance = (regId: string) => {
    const updated = registrations.map(r => {
      if (r.id === regId) {
        return {
          ...r,
          attended: !r.attended,
          attendanceTime: !r.attended ? new Date().toISOString() : undefined
        };
      }
      return r;
    });
    db.saveRegistrations(updated);
    setRegistrations(updated);
    addToast('Attendance check-in updated', 'success');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b gap-3">
        <div>
          <h2 className="text-xl font-bold text-[#163A4A]">
            {currentLang === 'ar' ? 'إدارة الفعاليات والمؤتمرات وحجوزات الحضور' : 'Events & Attendee Registrations'}
          </h2>
          <p className="text-xs text-slate-500">
            {currentLang === 'ar' ? 'إنشاء وتعديل الفعاليات وتوليد أكواد QR وتتبع الحضور الفعلي' : 'Schedule programs, track capacity, and check-in attendees via QR'}
          </p>
        </div>
        <button
          onClick={openAdd}
          className="px-4 py-2 bg-[#163A4A] hover:bg-[#24495D] text-[#C8B273] text-xs font-bold rounded-lg flex items-center gap-1.5 self-start cursor-pointer transition-colors"
        >
          <Plus className="h-4 w-4" />
          <span>{currentLang === 'ar' ? 'إضافة فعالية جديدة' : 'Add Event'}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {events.map(ev => (
          <div key={ev.id} className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-3 flex flex-col justify-between">
            <div>
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className="text-[10px] font-mono text-slate-400 block">{ev.date} @ {ev.time}</span>
                  <h3 className="font-bold text-sm text-[#163A4A] mt-1">{ev.title[currentLang] || ev.title.ar}</h3>
                </div>
                <span className="bg-[#C8B273]/20 text-[#163A4A] text-[9px] font-bold px-2 py-0.5 rounded font-mono uppercase">
                  {ev.category}
                </span>
              </div>
              <p className="text-xs text-slate-500 line-clamp-2 mt-2">{ev.description[currentLang] || ev.description.ar}</p>
              
              <div className="grid grid-cols-3 gap-2 p-2.5 bg-slate-50 rounded-lg border mt-3 text-center text-xs">
                <div>
                  <span className="text-[10px] text-slate-400 block font-mono">Capacity</span>
                  <span className="font-bold text-slate-800">{ev.capacity}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block font-mono">Registered</span>
                  <span className="font-bold text-green-700">{ev.registeredCount}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block font-mono">QR Token</span>
                  <span className="font-bold text-slate-600 font-mono text-[10px] truncate block">{ev.qrCodeValue}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t mt-3">
              <button
                onClick={() => setViewingRegistrationsEvent(ev)}
                className="text-xs font-bold text-[#163A4A] hover:underline flex items-center gap-1 cursor-pointer"
              >
                <Users className="h-3.5 w-3.5" />
                <span>قائمة الحضور المسجلين ({registrations.filter(r => r.eventId === ev.id).length})</span>
              </button>
              <div className="flex items-center gap-1">
                <button onClick={() => openEdit(ev)} className="p-1.5 text-slate-600 hover:text-[#163A4A] rounded cursor-pointer">
                  <Edit className="h-3.5 w-3.5" />
                </button>
                <button onClick={() => handleDelete(ev.id, ev.title.ar)} className="p-1.5 text-red-600 hover:bg-red-50 rounded cursor-pointer">
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Attendees Modal */}
      {viewingRegistrationsEvent && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[85vh] overflow-hidden shadow-2xl flex flex-col">
            <div className="bg-[#163A4A] px-6 py-4 flex items-center justify-between text-white">
              <div>
                <h3 className="font-bold text-sm">سجل المسجلين والحضور: {viewingRegistrationsEvent.title.ar}</h3>
                <span className="text-[10px] text-[#C8B273] font-mono">Check-in QR: {viewingRegistrationsEvent.qrCodeValue}</span>
              </div>
              <button onClick={() => setViewingRegistrationsEvent(null)} className="text-xl">×</button>
            </div>
            <div className="p-6 overflow-y-auto flex-1 text-xs">
              {registrations.filter(r => r.eventId === viewingRegistrationsEvent.id).length === 0 ? (
                <div className="text-center py-10 text-slate-400">
                  لا توجد تسجيلات إلكترونية مسجلة بعد لهذه الفعالية.
                </div>
              ) : (
                <div className="divide-y divide-slate-100">
                  {registrations.filter(r => r.eventId === viewingRegistrationsEvent.id).map(reg => (
                    <div key={reg.id} className="py-2.5 flex items-center justify-between">
                      <div>
                        <p className="font-bold text-slate-900">{reg.name}</p>
                        <p className="text-[11px] text-slate-400 font-mono">{reg.email} • {reg.phone}</p>
                      </div>
                      <button
                        onClick={() => handleToggleAttendance(reg.id)}
                        className={`px-3 py-1 rounded font-bold text-[11px] flex items-center gap-1 cursor-pointer ${
                          reg.attended ? 'bg-green-100 text-green-800' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                      >
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        <span>{reg.attended ? 'تم الحضور' : 'تسجيل حضور'}</span>
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Add / Edit Event Modal */}
      {isAdding && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl p-6">
            <h3 className="text-lg font-bold text-[#163A4A] mb-4 pb-2 border-b">
              {editingEvent
                ? (currentLang === 'ar' ? 'تعديل الفعالية' : 'Edit Event')
                : (currentLang === 'ar' ? 'إضافة فعالية جديدة' : 'Add Event')}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold mb-1">عنوان الفعالية (عربي) *</label>
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

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block font-semibold mb-1">التصنيف</label>
                  <select value={category} onChange={e => setCategory(e.target.value as any)} className="w-full p-2 border rounded bg-white">
                    <option value="academic">أكاديمي (Academic)</option>
                    <option value="cultural">ثقافي (Cultural)</option>
                    <option value="workshops">ورش عمل (Workshops)</option>
                    <option value="sports">رياضي (Sports)</option>
                    <option value="entertainment">ترفيهي (Entertainment)</option>
                    <option value="trips">رحلات (Trips)</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold mb-1">التاريخ *</label>
                  <input required type="date" value={date} onChange={e => setDate(e.target.value)} className="w-full p-2 border rounded font-mono" />
                </div>
                <div>
                  <label className="block font-semibold mb-1">الوقت *</label>
                  <input required type="time" value={time} onChange={e => setTime(e.target.value)} className="w-full p-2 border rounded font-mono" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold mb-1">المكان بالعربي</label>
                  <input value={locAr} onChange={e => setLocAr(e.target.value)} className="w-full p-2 border rounded text-right" />
                </div>
                <div>
                  <label className="block font-semibold mb-1">السعة القصوى (Capacity)</label>
                  <input type="number" value={capacity} onChange={e => setCapacity(Number(e.target.value))} className="w-full p-2 border rounded font-mono" />
                </div>
              </div>

              <ImageUploadInput
                label="صورة أو بوستر الفعالية (Event Banner)"
                value={image}
                onChange={setImage}
                helperText="Cihazınızdan etkinlik afişi yükleyebilir veya link girebilirsiniz."
              />

              <div>
                <label className="block font-semibold mb-1">وصف الفعالية (عربي)</label>
                <textarea rows={3} value={descAr} onChange={e => setDescAr(e.target.value)} className="w-full p-2 border rounded text-right font-sans" />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input type="checkbox" id="countdownCheck" checked={countdownActive} onChange={e => setCountdownActive(e.target.checked)} className="rounded" />
                <label htmlFor="countdownCheck" className="font-semibold cursor-pointer">تفعيل العداد التنازلي التفاعلي على الصفحة الرئيسية</label>
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
                  Save Event
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
