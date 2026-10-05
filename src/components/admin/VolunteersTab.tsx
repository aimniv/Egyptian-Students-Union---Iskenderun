import React, { useState } from 'react';
import { Volunteer, Language } from '../../types';
import { db } from '../../data/mockDb';
import { Check, X, Trash2, HeartHandshake, Phone, Mail } from 'lucide-react';
import { confirmDialog } from '../../lib/dialog';

interface Props {
  currentLang: Language;
  addToast: (msg: string, type: 'success' | 'info' | 'warning') => void;
  addActivityLog: (action: string, details: string) => void;
}

export const VolunteersTab: React.FC<Props> = ({ currentLang, addToast, addActivityLog }) => {
  const [volunteers, setVolunteers] = useState<Volunteer[]>(db.getVolunteers());
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');

  const handleUpdateStatus = (id: string, status: 'approved' | 'rejected', name: string) => {
    const updated = volunteers.map(v => v.id === id ? { ...v, status } : v);
    db.saveVolunteers(updated);
    setVolunteers(updated);
    addActivityLog('تحديث حالة متطوع', `تم تغيير حالة المتطوع ${name} إلى ${status}`);
    addToast(currentLang === 'ar' ? `تم تحديث حالة طلب التطوع إلى ${status}` : `Volunteer status updated to ${status}`, 'success');
  };

  const handleDelete = async (id: string, name: string) => {
    if (!(await confirmDialog(currentLang === 'ar' ? `هل أنت متأكد من حذف طلب ${name}؟` : `Delete ${name}?`))) return;
    const updated = volunteers.filter(v => v.id !== id);
    db.saveVolunteers(updated);
    setVolunteers(updated);
    addActivityLog('حذف طلب تطوع', `تم حذف طلب التطوع للمستخدم ${name}`);
    addToast(currentLang === 'ar' ? 'تم حذف الطلب' : 'Volunteer deleted', 'info');
  };

  const filtered = volunteers.filter(v => filterStatus === 'all' || v.status === filterStatus);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b gap-3">
        <div>
          <h2 className="text-xl font-bold text-[#163A4A]">
            {currentLang === 'ar' ? 'إدارة المتطوعين ولجان العمل الطلابي' : 'Volunteer Management & Committees'}
          </h2>
          <p className="text-xs text-slate-500">
            {currentLang === 'ar' ? 'مراجعة وقبول طلبات انضمام الطلاب لفرق التطوع واللجان' : 'Audit and approve student volunteer applications'}
          </p>
        </div>
        <div className="flex bg-slate-100 p-1 rounded-lg text-xs font-semibold">
          {(['all', 'pending', 'approved', 'rejected'] as const).map(st => (
            <button
              key={st}
              onClick={() => setFilterStatus(st)}
              className={`px-3 py-1 rounded capitalize cursor-pointer transition-all ${
                filterStatus === st ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map(vol => (
          <div key={vol.id} className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="font-bold text-sm text-slate-900">{vol.name}</span>
                <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${
                  vol.status === 'approved' ? 'bg-green-100 text-green-800' :
                  vol.status === 'rejected' ? 'bg-red-100 text-red-800' : 'bg-amber-100 text-amber-800'
                }`}>
                  {vol.status}
                </span>
              </div>
              <div className="space-y-1 text-xs text-slate-500">
                <p className="flex items-center gap-1.5"><Mail className="h-3.5 w-3.5" /> {vol.email}</p>
                <p className="flex items-center gap-1.5"><Phone className="h-3.5 w-3.5" /> {vol.phone}</p>
              </div>
              <div className="mt-3 flex flex-wrap gap-1">
                {vol.interests.map((int, i) => (
                  <span key={i} className="text-[10px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-medium">
                    {int}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t mt-3 text-xs">
              <span className="text-[10px] text-slate-400 font-mono">{vol.appliedDate}</span>
              <div className="flex items-center gap-1.5">
                {vol.status === 'pending' && (
                  <>
                    <button
                      onClick={() => handleUpdateStatus(vol.id, 'approved', vol.name)}
                      className="px-2.5 py-1 bg-green-600 hover:bg-green-700 text-white rounded font-bold flex items-center gap-1 cursor-pointer"
                    >
                      <Check className="h-3.5 w-3.5" /> Approve
                    </button>
                    <button
                      onClick={() => handleUpdateStatus(vol.id, 'rejected', vol.name)}
                      className="px-2.5 py-1 bg-red-600 hover:bg-red-700 text-white rounded font-bold flex items-center gap-1 cursor-pointer"
                    >
                      <X className="h-3.5 w-3.5" /> Reject
                    </button>
                  </>
                )}
                <button
                  onClick={() => handleDelete(vol.id, vol.name)}
                  className="p-1 text-slate-400 hover:text-red-600 rounded cursor-pointer"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="col-span-2 text-center py-12 text-slate-400 text-sm">
            No volunteer records match this filter.
          </div>
        )}
      </div>
    </div>
  );
};
