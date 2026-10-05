import React, { useState } from 'react';
import { Membership, Language } from '../../types';
import { db } from '../../data/mockDb';
import { Plus, Trash2, Edit, Search, FileDown, CheckCircle, XCircle, Clock, Eye } from 'lucide-react';
import { confirmDialog, alertDialog } from '../../lib/dialog';

interface Props {
  currentLang: Language;
  addToast: (msg: string, type: 'success' | 'info' | 'warning') => void;
  addActivityLog: (action: string, details: string) => void;
}

export const MembershipsTab: React.FC<Props> = ({ currentLang, addToast, addActivityLog }) => {
  const [memberships, setMemberships] = useState<Membership[]>(db.getMemberships());
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [search, setSearch] = useState('');
  const [selectedMemb, setSelectedMemb] = useState<Membership | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');

  // Form states for manual registration
  const [nameAr, setNameAr] = useState('');
  const [nameEn, setNameEn] = useState('');
  const [passportId, setPassportId] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [university, setUniversity] = useState('İskenderun Teknik Üniversitesi');
  const [faculty, setFaculty] = useState('');
  const [major, setMajor] = useState('');
  const [academicYear, setAcademicYear] = useState('1');
  const [residenceAddress, setResidenceAddress] = useState('');

  const handleApprove = (id: string) => {
    const updated = memberships.map(m => {
      if (m.id === id) {
        return {
          ...m,
          status: 'approved' as const,
          expirationDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
        };
      }
      return m;
    });
    db.saveMemberships(updated);
    setMemberships(updated);
    addActivityLog('اعتماد طلب عضوية', `تم اعتماد عضوية الطالب ذو الرمز ${id}`);
    addToast(currentLang === 'ar' ? 'تمت الموافقة وإصدار بطاقة العضوية الإلكترونية' : 'Membership approved', 'success');
    setSelectedMemb(null);
  };

  const handleReject = (id: string) => {
    if (!rejectionReason) {
      alertDialog(currentLang === 'ar' ? 'يرجى كتابة سبب الرفض' : 'Please provide rejection reason');
      return;
    }
    const updated = memberships.map(m => {
      if (m.id === id) {
        return {
          ...m,
          status: 'rejected' as const,
          rejectionReason
        };
      }
      return m;
    });
    db.saveMemberships(updated);
    setMemberships(updated);
    addActivityLog('رفض طلب عضوية', `رفض العضوية ${id}: ${rejectionReason}`);
    addToast(currentLang === 'ar' ? 'تم رفض الطلب وحفظ السبب للمراجع' : 'Membership rejected', 'info');
    setSelectedMemb(null);
    setRejectionReason('');
  };

  const handleDelete = async (id: string, name: string) => {
    if (!(await confirmDialog(currentLang === 'ar' ? `هل أنت متأكد من حذف ملف الطالب ${name}؟` : `Delete record for ${name}?`))) return;
    const updated = memberships.filter(m => m.id !== id);
    db.saveMemberships(updated);
    setMemberships(updated);
    addActivityLog('حذف سجل عضوية', `تم حذف سجل العضوية ${id}`);
    addToast(currentLang === 'ar' ? 'تم حذف السجل' : 'Record deleted', 'info');
    if (selectedMemb?.id === id) setSelectedMemb(null);
  };

  const handleManualCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nameAr || !passportId || !email || !phone) {
      alertDialog('Please fill required fields');
      return;
    }

    const uniqueId = 'MEMB-' + Math.floor(100000 + Math.random() * 900000);
    const newMemb: Membership = {
      id: uniqueId,
      studentNumber: 'MOB-ST-' + Math.floor(260000 + Math.random() * 999),
      nameAr,
      nameEn: nameEn || nameAr,
      passportOrId: passportId,
      email,
      phone,
      whatsapp: phone,
      university,
      faculty,
      major,
      academicYear,
      residenceAddress,
      status: 'approved',
      appliedDate: new Date().toISOString().split('T')[0],
      expirationDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      type: 'new'
    };

    const updated = [newMemb, ...memberships];
    db.saveMemberships(updated);
    setMemberships(updated);
    addActivityLog('تسجيل عضو يدوياً من الإدارة', `إصدار عضوية فورية للطالب: ${nameAr}`);
    addToast(currentLang === 'ar' ? 'تم تسجيل الطالب واعتماد العضوية بنجاح' : 'Member registered manually', 'success');
    setIsAdding(false);
  };

  const exportCSV = () => {
    const headers = ['ID', 'Student Number', 'Name AR', 'Name EN', 'Passport/ID', 'Email', 'Phone', 'Major', 'Status', 'Applied Date'];
    const rows = memberships.map(m => [
      m.id,
      m.studentNumber,
      `"${m.nameAr}"`,
      `"${m.nameEn}"`,
      m.passportOrId,
      m.email,
      m.phone,
      `"${m.major}"`,
      m.status,
      m.appliedDate
    ]);
    const csvContent = "data:text/csv;charset=utf-8,\uFEFF" + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `mob_memberships_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    link.remove();
    addToast('Memberships CSV exported', 'success');
  };

  const filtered = memberships.filter(m => {
    const matchesFilter = filterStatus === 'all' || m.status === filterStatus;
    const q = search.toLowerCase();
    const matchesSearch = !search ||
      m.nameAr.toLowerCase().includes(q) ||
      m.nameEn.toLowerCase().includes(q) ||
      m.studentNumber.toLowerCase().includes(q) ||
      m.email.toLowerCase().includes(q) ||
      m.phone.includes(q);
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b gap-3">
        <div>
          <h2 className="text-xl font-bold text-[#163A4A]">
            {currentLang === 'ar' ? 'إدارة وتدقيق طلبات العضوية الطلابية (CRM)' : 'Student Membership Pipeline'}
          </h2>
          <p className="text-xs text-slate-500">
            {currentLang === 'ar' ? 'مراجعة الوثائق، إصدار بطاقات العضوية الذكية، والتحكم بالسجلات' : 'Audit ID documents, approve registrations, issue credentials, and export data'}
          </p>
        </div>
        <div className="flex items-center gap-2 self-start sm:self-center">
          <button
            onClick={exportCSV}
            className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-lg flex items-center gap-1.5 cursor-pointer"
          >
            <FileDown className="h-4 w-4" />
            <span>Export CSV</span>
          </button>
          <button
            onClick={() => setIsAdding(true)}
            className="px-4 py-2 bg-[#163A4A] hover:bg-[#24495D] text-[#C8B273] text-xs font-bold rounded-lg flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="h-4 w-4" />
            <span>{currentLang === 'ar' ? 'تسجيل عضو جديد' : 'New Member'}</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between bg-white p-3 rounded-xl border">
        <div className="flex bg-slate-100 p-1 rounded-lg text-xs font-semibold w-full sm:w-auto">
          {(['all', 'pending', 'approved', 'rejected'] as const).map(st => (
            <button
              key={st}
              onClick={() => setFilterStatus(st)}
              className={`flex-1 sm:flex-initial px-3 py-1 rounded capitalize cursor-pointer transition-all ${
                filterStatus === st ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              {st} ({st === 'all' ? memberships.length : memberships.filter(m => m.status === st).length})
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-lg border w-full sm:w-72">
          <Search className="h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search name, ID, phone..."
            className="bg-transparent border-none text-xs focus:ring-0 outline-none w-full"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-xs border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left rtl:text-right text-xs">
            <thead className="bg-[#163A4A] text-[#C8B273] uppercase text-[10px] font-mono tracking-wider">
              <tr>
                <th className="p-3.5">Student / الطالب</th>
                <th className="p-3.5">ID / Student No</th>
                <th className="p-3.5">Major & Univ</th>
                <th className="p-3.5">Contact</th>
                <th className="p-3.5">Status</th>
                <th className="p-3.5 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map(memb => (
                <tr key={memb.id} className="hover:bg-slate-50 transition-colors">
                  <td className="p-3.5">
                    <p className="font-bold text-slate-900">{memb.nameAr}</p>
                    <p className="text-[10px] text-slate-400 font-mono">{memb.nameEn}</p>
                  </td>
                  <td className="p-3.5 font-mono text-[11px]">
                    <span className="font-bold text-[#163A4A] block">{memb.studentNumber}</span>
                    <span className="text-slate-400 text-[9px]">ID: {memb.passportOrId}</span>
                  </td>
                  <td className="p-3.5">
                    <p className="font-semibold text-slate-700 truncate max-w-[160px]">{memb.major}</p>
                    <p className="text-[10px] text-slate-400 truncate max-w-[160px]">{memb.university}</p>
                  </td>
                  <td className="p-3.5 font-mono text-[11px]">
                    <p>{memb.phone}</p>
                    <p className="text-slate-400 text-[10px] truncate max-w-[140px]">{memb.email}</p>
                  </td>
                  <td className="p-3.5">
                    <span className={`px-2 py-0.5 rounded font-bold text-[9px] uppercase ${
                      memb.status === 'approved' ? 'bg-green-100 text-green-800' :
                      memb.status === 'rejected' ? 'bg-red-100 text-red-800' : 'bg-amber-100 text-amber-800'
                    }`}>
                      {memb.status}
                    </span>
                  </td>
                  <td className="p-3.5 text-center">
                    <div className="flex items-center justify-center gap-1.5">
                      <button
                        onClick={() => setSelectedMemb(memb)}
                        className="px-2.5 py-1 bg-slate-800 hover:bg-slate-900 text-[#C8B273] font-bold rounded text-[10px] cursor-pointer"
                      >
                        Audit
                      </button>
                      <button
                        onClick={() => handleDelete(memb.id, memb.nameAr)}
                        className="p-1 text-slate-400 hover:text-red-600 rounded cursor-pointer"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="text-center py-10 text-slate-400">
                    No memberships found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Audit Modal */}
      {selectedMemb && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-xl w-full max-h-[90vh] overflow-y-auto shadow-2xl p-6">
            <div className="flex items-center justify-between pb-3 border-b mb-4">
              <div>
                <h3 className="font-bold text-sm text-[#163A4A]">ملف العضوية: {selectedMemb.studentNumber}</h3>
                <span className="text-[10px] text-slate-400 font-mono">Token: {selectedMemb.id}</span>
              </div>
              <button onClick={() => setSelectedMemb(null)} className="text-xl">×</button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-2 p-3 bg-slate-50 rounded-xl border">
                <div><strong className="text-slate-400">الاسم بالعربي:</strong> <p className="font-bold text-slate-900">{selectedMemb.nameAr}</p></div>
                <div><strong className="text-slate-400">Name EN:</strong> <p className="font-bold text-slate-900 font-mono">{selectedMemb.nameEn}</p></div>
                <div><strong className="text-slate-400">الرقم الوطني / جواز السفر:</strong> <p className="font-mono">{selectedMemb.passportOrId}</p></div>
                <div><strong className="text-slate-400">الهاتف:</strong> <p className="font-mono">{selectedMemb.phone}</p></div>
                <div><strong className="text-slate-400">البريد الإلكتروني:</strong> <p>{selectedMemb.email}</p></div>
                <div><strong className="text-slate-400">الجامعة والتخصص:</strong> <p>{selectedMemb.university} - {selectedMemb.major}</p></div>
                <div className="col-span-2"><strong className="text-slate-400">عنوان السكن:</strong> <p>{selectedMemb.residenceAddress}</p></div>
              </div>

              {selectedMemb.status === 'pending' && (
                <div className="border-t pt-3 space-y-2">
                  <label className="block font-semibold">سبب الرفض (في حال الرفض)</label>
                  <input
                    type="text"
                    value={rejectionReason}
                    onChange={e => setRejectionReason(e.target.value)}
                    placeholder="مثال: المستندات المرفقة غير واضحة"
                    className="w-full p-2 border rounded"
                  />
                  <div className="flex gap-2 pt-2">
                    <button
                      onClick={() => handleReject(selectedMemb.id)}
                      className="flex-1 py-2 bg-red-600 hover:bg-red-700 text-white font-bold rounded cursor-pointer"
                    >
                      Reject Application
                    </button>
                    <button
                      onClick={() => handleApprove(selectedMemb.id)}
                      className="flex-1 py-2 bg-[#163A4A] text-[#C8B273] font-bold rounded hover:bg-[#24495D] cursor-pointer"
                    >
                      Approve & Issue E-Card
                    </button>
                  </div>
                </div>
              )}

              {selectedMemb.status === 'approved' && (
                <div className="p-3 bg-green-50 border border-green-200 rounded-xl text-green-900">
                  <p className="font-bold">✓ العضوية معتمدة وسارية المفعول</p>
                  <p className="text-[11px] mt-0.5">تاريخ انتهاء الصلاحية: {selectedMemb.expirationDate || '1 Year'}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Manual Add Member Modal */}
      {isAdding && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl p-6">
            <h3 className="text-lg font-bold text-[#163A4A] mb-4 pb-2 border-b">
              تسجيل عضو جديد يدوياً في سجلات الاتحاد
            </h3>
            <form onSubmit={handleManualCreate} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold mb-1">الاسم بالعربي *</label>
                  <input required value={nameAr} onChange={e => setNameAr(e.target.value)} className="w-full p-2 border rounded text-right" />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Name (EN) *</label>
                  <input required value={nameEn} onChange={e => setNameEn(e.target.value)} className="w-full p-2 border rounded" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold mb-1">رقم الهوية أو جواز السفر *</label>
                  <input required value={passportId} onChange={e => setPassportId(e.target.value)} className="w-full p-2 border rounded font-mono" />
                </div>
                <div>
                  <label className="block font-semibold mb-1">الهاتف والواتساب *</label>
                  <input required value={phone} onChange={e => setPhone(e.target.value)} className="w-full p-2 border rounded font-mono" />
                </div>
              </div>

              <div>
                <label className="block font-semibold mb-1">البريد الإلكتروني *</label>
                <input required type="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full p-2 border rounded font-mono" />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold mb-1">الجامعة</label>
                  <input value={university} onChange={e => setUniversity(e.target.value)} className="w-full p-2 border rounded" />
                </div>
                <div>
                  <label className="block font-semibold mb-1">التخصص</label>
                  <input value={major} onChange={e => setMajor(e.target.value)} className="w-full p-2 border rounded" />
                </div>
              </div>

              <div>
                <label className="block font-semibold mb-1">عنوان الإقامة في تركيا</label>
                <input value={residenceAddress} onChange={e => setResidenceAddress(e.target.value)} className="w-full p-2 border rounded" />
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
                  Issue Membership
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
