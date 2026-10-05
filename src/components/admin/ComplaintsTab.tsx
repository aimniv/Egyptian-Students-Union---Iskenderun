import React, { useState } from 'react';
import { Complaint, Language } from '../../types';
import { db } from '../../data/mockDb';
import { AlertTriangle, Trash2, Edit, CheckCircle, MessageSquare } from 'lucide-react';
import { confirmDialog } from '../../lib/dialog';

interface Props {
  currentLang: Language;
  addToast: (msg: string, type: 'success' | 'info' | 'warning') => void;
  addActivityLog: (action: string, details: string) => void;
}

export const ComplaintsTab: React.FC<Props> = ({ currentLang, addToast, addActivityLog }) => {
  const [complaints, setComplaints] = useState<Complaint[]>(db.getComplaints());
  const [selectedComp, setSelectedComp] = useState<Complaint | null>(null);
  const [replyText, setReplyText] = useState('');
  const [internalNote, setInternalNote] = useState('');

  const handleUpdateStatus = (id: string, status: Complaint['status']) => {
    const updated = complaints.map(c => c.id === id ? { ...c, status } : c);
    db.saveComplaints(updated);
    setComplaints(updated);
    addActivityLog('تحديث حالة شكوى', `تحديث تذكرة ${id} إلى ${status}`);
    addToast(`Ticket status updated to ${status}`, 'success');
    if (selectedComp) setSelectedComp({ ...selectedComp, status });
  };

  const handleAddResponse = (id: string) => {
    if (!replyText) return;
    const updated = complaints.map(c => {
      if (c.id === id) {
        const responses = c.responses || [];
        return {
          ...c,
          responses: [...responses, {
            id: 'RESP-' + Date.now(),
            author: 'admin' as const,
            authorName: 'مصطفى كريم الغزاوي (الأمين العام)',
            message: replyText,
            date: new Date().toISOString()
          }]
        };
      }
      return c;
    });
    db.saveComplaints(updated);
    setComplaints(updated);
    addActivityLog('رد إداري على شكوى', `رد على تذكرة ${id}`);
    addToast('Response published to student portal', 'success');
    setReplyText('');
    const fresh = updated.find(c => c.id === id);
    if (fresh) setSelectedComp(fresh);
  };

  const handleSaveNotes = (id: string) => {
    const updated = complaints.map(c => c.id === id ? { ...c, internalNotes: internalNote } : c);
    db.saveComplaints(updated);
    setComplaints(updated);
    addToast('Internal audit notes saved', 'success');
  };

  const handleDelete = async (id: string) => {
    if (!(await confirmDialog('Delete ticket?'))) return;
    const updated = complaints.filter(c => c.id !== id);
    db.saveComplaints(updated);
    setComplaints(updated);
    addActivityLog('حذف تذكرة شكوى', `حذف ${id}`);
    addToast('Complaint ticket deleted', 'info');
    if (selectedComp?.id === id) setSelectedComp(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b gap-3">
        <div>
          <h2 className="text-xl font-bold text-[#163A4A]">
            {currentLang === 'ar' ? 'إدارة الشكاوى والتظلمات الطلابية (Helpdesk)' : 'Grievance & Complaints Helpdesk'}
          </h2>
          <p className="text-xs text-slate-500">
            {currentLang === 'ar' ? 'معالجة الشكاوى الأكاديمية والخدمية وتوثيق مسار الحل والتواصل مع الطالب' : 'Track student complaints, assign priorities, record investigation notes, and resolve cases'}
          </p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-xs border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left rtl:text-right text-xs">
            <thead className="bg-[#163A4A] text-[#C8B273] uppercase text-[10px] font-mono tracking-wider">
              <tr>
                <th className="p-3.5">Ticket</th>
                <th className="p-3.5">Subject & Student</th>
                <th className="p-3.5">Category</th>
                <th className="p-3.5">Priority</th>
                <th className="p-3.5">Status</th>
                <th className="p-3.5 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {complaints.map(comp => (
                <tr key={comp.id} className="hover:bg-slate-50">
                  <td className="p-3.5 font-mono font-bold text-slate-800">{comp.ticketNumber}</td>
                  <td className="p-3.5">
                    <p className="font-semibold text-slate-900">{comp.subject}</p>
                    <p className="text-[10px] text-slate-400">{comp.name} • {comp.phone}</p>
                  </td>
                  <td className="p-3.5 font-bold uppercase text-[10px] text-[#163A4A]">{comp.category}</td>
                  <td className="p-3.5">
                    <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase ${
                      comp.priority === 'urgent' || comp.priority === 'high' ? 'bg-red-100 text-red-800' : 'bg-slate-100 text-slate-700'
                    }`}>
                      {comp.priority}
                    </span>
                  </td>
                  <td className="p-3.5">
                    <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase ${
                      comp.status === 'resolved' ? 'bg-green-100 text-green-800' :
                      comp.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
                      comp.status === 'under_review' ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-800'
                    }`}>
                      {comp.status}
                    </span>
                  </td>
                  <td className="p-3.5 text-center">
                    <div className="flex items-center justify-center gap-1.5">
                      <button
                        onClick={() => {
                          setSelectedComp(comp);
                          setInternalNote(comp.internalNotes || '');
                        }}
                        className="px-2.5 py-1 bg-slate-800 hover:bg-slate-900 text-[#C8B273] font-bold rounded text-[10px] cursor-pointer"
                      >
                        Manage
                      </button>
                      <button onClick={() => handleDelete(comp.id)} className="p-1 text-slate-400 hover:text-red-600 rounded cursor-pointer">
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {selectedComp && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-xl w-full max-h-[90vh] overflow-y-auto shadow-2xl p-6">
            <div className="flex items-center justify-between pb-3 border-b mb-4">
              <div>
                <h3 className="font-bold text-sm text-[#163A4A]">Ticket: {selectedComp.ticketNumber}</h3>
                <span className="text-[10px] text-slate-400">From: {selectedComp.name} ({selectedComp.email})</span>
              </div>
              <button onClick={() => setSelectedComp(null)} className="text-xl">×</button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl border space-y-1">
                <p><strong>Subject:</strong> {selectedComp.subject}</p>
                <p className="p-3 bg-white rounded border whitespace-pre-line text-slate-700">{selectedComp.details}</p>
              </div>

              <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border">
                <label className="font-bold text-slate-700">Ticket Status:</label>
                <select
                  value={selectedComp.status}
                  onChange={e => handleUpdateStatus(selectedComp.id, e.target.value as any)}
                  className="p-1.5 border rounded bg-white font-bold"
                >
                  <option value="new">New</option>
                  <option value="under_review">Under Review</option>
                  <option value="in_progress">In Progress</option>
                  <option value="resolved">Resolved</option>
                  <option value="closed">Closed</option>
                </select>
              </div>

              {selectedComp.responses && selectedComp.responses.length > 0 && (
                <div className="space-y-2">
                  <span className="font-bold text-slate-400 uppercase font-mono block">Published Responses</span>
                  {selectedComp.responses.map(r => (
                    <div key={r.id} className="p-3 bg-[#F7F5EC] border rounded-lg">
                      <p className="font-bold text-[#163A4A]">{r.authorName}</p>
                      <p className="mt-1 text-slate-700">{r.message}</p>
                      <span className="text-[9px] text-slate-400 font-mono block mt-1">{r.date.substring(0, 16)}</span>
                    </div>
                  ))}
                </div>
              )}

              <div className="space-y-2">
                <label className="block font-semibold">Post Official Public Reply</label>
                <textarea
                  rows={2}
                  value={replyText}
                  onChange={e => setReplyText(e.target.value)}
                  placeholder="Student can see this in their tracking portal..."
                  className="w-full p-2 border rounded"
                />
                <button
                  onClick={() => handleAddResponse(selectedComp.id)}
                  className="px-4 py-1.5 bg-[#163A4A] text-white rounded font-bold hover:bg-[#24495D] cursor-pointer"
                >
                  Publish Reply
                </button>
              </div>

              <div className="border-t pt-3 space-y-2">
                <label className="block font-semibold text-red-700">🔒 Confidential Internal Notes (Secretariat only)</label>
                <textarea
                  rows={2}
                  value={internalNote}
                  onChange={e => setInternalNote(e.target.value)}
                  className="w-full p-2 border border-red-200 bg-red-50/30 rounded"
                />
                <button
                  onClick={() => handleSaveNotes(selectedComp.id)}
                  className="px-4 py-1.5 bg-slate-800 text-[#C8B273] rounded font-bold cursor-pointer"
                >
                  Save Internal Notes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
