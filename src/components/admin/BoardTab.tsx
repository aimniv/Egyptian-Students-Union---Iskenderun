import React, { useState } from 'react';
import { BoardMember, Language } from '../../types';
import { db } from '../../data/mockDb';
import { Plus, Trash2, Edit, User, Mail, Phone, ExternalLink } from 'lucide-react';
import { ImageUploadInput } from '../common/ImageUploadInput';
import { confirmDialog, alertDialog } from '../../lib/dialog';

interface Props {
  currentLang: Language;
  addToast: (msg: string, type: 'success' | 'info' | 'warning') => void;
  addActivityLog: (action: string, details: string) => void;
}

export const BoardTab: React.FC<Props> = ({ currentLang, addToast, addActivityLog }) => {
  const [board, setBoard] = useState<BoardMember[]>(db.getBoardMembers());
  const [editingMember, setEditingMember] = useState<BoardMember | null>(null);
  const [isAdding, setIsAdding] = useState(false);

  // Form states
  const [nameAr, setNameAr] = useState('');
  const [nameEn, setNameEn] = useState('');
  const [nameTr, setNameTr] = useState('');
  const [role, setRole] = useState<BoardMember['role']>('board_member');
  const [roleTitleAr, setRoleTitleAr] = useState('');
  const [roleTitleEn, setRoleTitleEn] = useState('');
  const [roleTitleTr, setRoleTitleTr] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [photo, setPhoto] = useState('');
  const [bioAr, setBioAr] = useState('');
  const [bioEn, setBioEn] = useState('');
  const [bioTr, setBioTr] = useState('');
  const [universityAr, setUniversityAr] = useState('جامعة إسكندرون التقنية');
  const [majorAr, setMajorAr] = useState('');
  const [year, setYear] = useState('3');

  const openAdd = () => {
    setEditingMember(null);
    setNameAr('');
    setNameEn('');
    setNameTr('');
    setRole('board_member');
    setRoleTitleAr('');
    setRoleTitleEn('');
    setRoleTitleTr('');
    setEmail('');
    setPhone('');
    setWhatsapp('');
    setPhoto('https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300');
    setBioAr('');
    setBioEn('');
    setBioTr('');
    setMajorAr('');
    setYear('3');
    setIsAdding(true);
  };

  const openEdit = (m: BoardMember) => {
    setEditingMember(m);
    setNameAr(m.name.ar);
    setNameEn(m.name.en);
    setNameTr(m.name.tr);
    setRole(m.role);
    setRoleTitleAr(m.roleTitle.ar);
    setRoleTitleEn(m.roleTitle.en);
    setRoleTitleTr(m.roleTitle.tr);
    setEmail(m.email);
    setPhone(m.phone);
    setWhatsapp(m.whatsapp || '');
    setPhoto(m.photo);
    setBioAr(m.bio.ar);
    setBioEn(m.bio.en);
    setBioTr(m.bio.tr);
    setMajorAr(m.academicInfo?.major?.ar || '');
    setYear(m.academicInfo?.year || '3');
    setIsAdding(true);
  };

  const handleDelete = async (id: string, name: string) => {
    if (!(await confirmDialog(currentLang === 'ar' ? `هل أنت متأكد من حذف العضو ${name}؟` : `Delete member ${name}?`))) return;
    const updated = board.filter(b => b.id !== id);
    db.saveBoardMembers(updated);
    setBoard(updated);
    addActivityLog('حذف عضو مجلس إدارة', `تم حذف العضو ${name}`);
    addToast(currentLang === 'ar' ? 'تم حذف عضو مجلس الإدارة بنجاح' : 'Board member deleted', 'info');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nameAr || !email) {
      alertDialog('Please fill required fields');
      return;
    }

    const memberData: BoardMember = {
      id: editingMember ? editingMember.id : 'b_' + Date.now(),
      name: { ar: nameAr, en: nameEn || nameAr, tr: nameTr || nameAr },
      role,
      roleTitle: { ar: roleTitleAr || nameAr, en: roleTitleEn || roleTitleAr, tr: roleTitleTr || roleTitleAr },
      photo: photo || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=300',
      bio: { ar: bioAr, en: bioEn || bioAr, tr: bioTr || bioAr },
      email,
      phone,
      whatsapp,
      socials: editingMember ? editingMember.socials : {},
      academicInfo: {
        university: { ar: universityAr, en: 'Iskenderun Technical University', tr: 'İskenderun Teknik Üniversitesi' },
        major: { ar: majorAr, en: majorAr, tr: majorAr },
        year
      }
    };

    let updated: BoardMember[];
    if (editingMember) {
      updated = board.map(b => b.id === editingMember.id ? memberData : b);
      addActivityLog('تعديل عضو مجلس إدارة', `تحديث بيانات ${nameAr}`);
      addToast(currentLang === 'ar' ? 'تم تحديث بيانات العضو بنجاح' : 'Member updated', 'success');
    } else {
      updated = [...board, memberData];
      addActivityLog('إضافة عضو مجلس إدارة', `إضافة عضو جديد: ${nameAr}`);
      addToast(currentLang === 'ar' ? 'تمت إضافة عضو مجلس الإدارة بنجاح' : 'Member added', 'success');
    }

    db.saveBoardMembers(updated);
    setBoard(updated);
    setIsAdding(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b gap-3">
        <div>
          <h2 className="text-xl font-bold text-[#163A4A]">
            {currentLang === 'ar' ? 'إدارة الهيئة الإدارية ومجلس الإدارة' : 'Board & Executive Leadership'}
          </h2>
          <p className="text-xs text-slate-500">
            {currentLang === 'ar' ? 'إضافة وتعديل وحذف أعضاء مجلس الإدارة ومناصبهم' : 'Manage union leadership structure, roles, and profiles'}
          </p>
        </div>
        <button
          onClick={openAdd}
          className="px-4 py-2 bg-[#163A4A] hover:bg-[#24495D] text-[#C8B273] text-xs font-bold rounded-lg flex items-center gap-1.5 self-start cursor-pointer transition-colors"
        >
          <Plus className="h-4 w-4" />
          <span>{currentLang === 'ar' ? 'إضافة عضو جديد' : 'Add Board Member'}</span>
        </button>
      </div>

      {/* Grid of Board Members */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {board.map(member => (
          <div key={member.id} className="bg-white border border-slate-200 rounded-xl p-4 flex gap-4 shadow-sm hover:shadow transition-shadow">
            <img
              src={member.photo}
              alt={member.name[currentLang] || member.name.ar}
              className="w-20 h-20 rounded-xl object-cover border border-slate-200 shrink-0"
            />
            <div className="flex-1 min-w-0 flex flex-col justify-between">
              <div>
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-bold text-sm text-slate-900 truncate">
                    {member.name[currentLang] || member.name.ar}
                  </h3>
                  <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-[#C8B273]/20 text-[#163A4A]">
                    {member.role}
                  </span>
                </div>
                <p className="text-xs text-[#C8B273] font-semibold">
                  {member.roleTitle[currentLang] || member.roleTitle.ar}
                </p>
                <div className="flex flex-col text-[11px] text-slate-500 mt-2 gap-0.5">
                  <span className="truncate flex items-center gap-1"><Mail className="h-3 w-3 shrink-0" /> {member.email}</span>
                  <span className="truncate flex items-center gap-1"><Phone className="h-3 w-3 shrink-0" /> {member.phone}</span>
                </div>
              </div>
              <div className="flex items-center justify-end gap-2 pt-2 border-t mt-2">
                <button
                  onClick={() => openEdit(member)}
                  className="p-1.5 text-slate-600 hover:text-[#163A4A] hover:bg-slate-100 rounded-lg cursor-pointer"
                  title="Edit"
                >
                  <Edit className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handleDelete(member.id, member.name.ar)}
                  className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg cursor-pointer"
                  title="Delete"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal for Add/Edit */}
      {isAdding && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl p-6">
            <h3 className="text-lg font-bold text-[#163A4A] mb-4 pb-2 border-b">
              {editingMember
                ? (currentLang === 'ar' ? 'تعديل بيانات العضو' : 'Edit Board Member')
                : (currentLang === 'ar' ? 'إضافة عضو مجلس إدارة جديد' : 'New Board Member')}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-3 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <div>
                  <label className="block font-semibold mb-1">الاسم (عربي) *</label>
                  <input required value={nameAr} onChange={e => setNameAr(e.target.value)} className="w-full p-2 border rounded text-right" />
                </div>
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
                  <label className="block font-semibold mb-1">Role Type</label>
                  <select value={role} onChange={e => setRole(e.target.value as any)} className="w-full p-2 border rounded bg-white">
                    <option value="president">President</option>
                    <option value="vice_president">Vice President</option>
                    <option value="secretary">General Secretary</option>
                    <option value="treasurer">Treasurer</option>
                    <option value="board_member">Board Member</option>
                    <option value="department_head">Department Head</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold mb-1">المسمى الوظيفي بالعربي *</label>
                  <input required value={roleTitleAr} onChange={e => setRoleTitleAr(e.target.value)} placeholder="مثال: مسؤول العلاقات العامة" className="w-full p-2 border rounded text-right" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold mb-1">Email *</label>
                  <input required type="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full p-2 border rounded font-mono" />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Phone</label>
                  <input value={phone} onChange={e => setPhone(e.target.value)} className="w-full p-2 border rounded font-mono" />
                </div>
              </div>

              <ImageUploadInput
                label="Üye Fotoğrafı / Photo"
                value={photo}
                onChange={setPhoto}
                helperText="Cihazınızdan dosya yükleyebilir veya web linki girebilirsiniz."
              />

              <div>
                <label className="block font-semibold mb-1">Bio / نبذة (عربي)</label>
                <textarea rows={2} value={bioAr} onChange={e => setBioAr(e.target.value)} className="w-full p-2 border rounded text-right" />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold mb-1">Major / التخصص</label>
                  <input value={majorAr} onChange={e => setMajorAr(e.target.value)} className="w-full p-2 border rounded" />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Year / السنة الدراسية</label>
                  <input value={year} onChange={e => setYear(e.target.value)} className="w-full p-2 border rounded" />
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
                  Save Member
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
