import React, { useState } from 'react';
import { ContactMessage, Language } from '../../types';
import { db } from '../../data/mockDb';
import { Mail, Trash2, Archive, Send, Search, CheckCircle } from 'lucide-react';
import { confirmDialog } from '../../lib/dialog';

interface Props {
  currentLang: Language;
  addToast: (msg: string, type: 'success' | 'info' | 'warning') => void;
  addActivityLog: (action: string, details: string) => void;
}

export const InboxTab: React.FC<Props> = ({ currentLang, addToast, addActivityLog }) => {
  const [messages, setMessages] = useState<ContactMessage[]>(db.getContactMessages());
  const [selectedMsg, setSelectedMsg] = useState<ContactMessage | null>(null);
  const [replyText, setReplyText] = useState('');
  const [search, setSearch] = useState('');

  const handleReply = (id: string) => {
    if (!replyText) return;
    const updated = messages.map(m => {
      if (m.id === id) {
        const currentReplies = m.replies || [];
        return {
          ...m,
          status: 'replied' as const,
          replies: [...currentReplies, {
            id: 'REP-' + Date.now(),
            adminName: 'أحمد محمود الرفاعي (رئيس الاتحاد)',
            message: replyText,
            date: new Date().toISOString()
          }]
        };
      }
      return m;
    });
    db.saveContactMessages(updated);
    setMessages(updated);
    addActivityLog('الرد على استفسار طالب', `رد على رسالة: ${id}`);
    addToast('Reply sent successfully and recorded in CRM', 'success');
    setReplyText('');
    const fresh = updated.find(m => m.id === id);
    if (fresh) setSelectedMsg(fresh);
  };

  const handleArchive = (id: string) => {
    const updated = messages.map(m => m.id === id ? { ...m, status: 'archived' as const } : m);
    db.saveContactMessages(updated);
    setMessages(updated);
    addActivityLog('أرشفة رسالة', `أرشفة ${id}`);
    addToast('Message archived', 'info');
    if (selectedMsg?.id === id) setSelectedMsg(null);
  };

  const handleDelete = async (id: string) => {
    if (!(await confirmDialog('Delete message?'))) return;
    const updated = messages.filter(m => m.id !== id);
    db.saveContactMessages(updated);
    setMessages(updated);
    addActivityLog('حذف رسالة واردة', `حذف ${id}`);
    addToast('Message deleted', 'info');
    if (selectedMsg?.id === id) setSelectedMsg(null);
  };

  const filtered = messages.filter(m => {
    const q = search.toLowerCase();
    return !search || m.name.toLowerCase().includes(q) || m.email.toLowerCase().includes(q) || m.subject.toLowerCase().includes(q);
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b gap-3">
        <div>
          <h2 className="text-xl font-bold text-[#163A4A]">
            {currentLang === 'ar' ? 'صندوق رسائل واستفسارات الطلاب (CRM Inbox)' : 'Student Inquiries & CRM Inbox'}
          </h2>
          <p className="text-xs text-slate-500">
            {currentLang === 'ar' ? 'متابعة الرسائل الواردة، الرد عليها رسمياً، وأرشفتها' : 'Respond to incoming messages and archive student queries'}
          </p>
        </div>
        <div className="flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-lg border w-full sm:w-64">
          <Search className="h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search inquiries..."
            className="bg-transparent border-none text-xs focus:ring-0 outline-none w-full"
          />
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-xs border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left rtl:text-right text-xs">
            <thead className="bg-[#163A4A] text-[#C8B273] uppercase text-[10px] font-mono tracking-wider">
              <tr>
                <th className="p-3.5">Applicant</th>
                <th className="p-3.5">Subject & Preview</th>
                <th className="p-3.5">Date & Lang</th>
                <th className="p-3.5">Status</th>
                <th className="p-3.5 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map(msg => (
                <tr key={msg.id} className="hover:bg-slate-50">
                  <td className="p-3.5">
                    <p className="font-bold text-slate-900">{msg.name}</p>
                    <p className="text-[10px] text-slate-400 font-mono">{msg.email}</p>
                  </td>
                  <td className="p-3.5">
                    <p className="font-semibold text-slate-800">{msg.subject}</p>
                    <p className="text-[10px] text-slate-500 truncate max-w-xs">{msg.message}</p>
                  </td>
                  <td className="p-3.5 text-[10px] font-mono text-slate-400">
                    <p>{msg.date.substring(0, 10)}</p>
                    <span className="uppercase text-[9px] font-bold text-[#163A4A]">{msg.language}</span>
                  </td>
                  <td className="p-3.5">
                    <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase ${
                      msg.status === 'replied' ? 'bg-green-100 text-green-800' :
                      msg.status === 'archived' ? 'bg-slate-100 text-slate-800' : 'bg-blue-100 text-blue-800'
                    }`}>
                      {msg.status}
                    </span>
                  </td>
                  <td className="p-3.5 text-center">
                    <div className="flex items-center justify-center gap-1.5">
                      <button
                        onClick={() => setSelectedMsg(msg)}
                        className="px-2.5 py-1 bg-slate-800 hover:bg-slate-900 text-[#C8B273] font-bold rounded text-[10px] cursor-pointer"
                      >
                        Open
                      </button>
                      <button
                        onClick={() => handleDelete(msg.id)}
                        className="p-1 text-slate-400 hover:text-red-600 rounded cursor-pointer"
                      >
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

      {selectedMsg && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-xl w-full max-h-[90vh] overflow-y-auto shadow-2xl p-6">
            <div className="flex items-center justify-between pb-3 border-b mb-4">
              <div>
                <h3 className="font-bold text-sm text-[#163A4A]">{selectedMsg.subject}</h3>
                <span className="text-[10px] text-slate-400 font-mono">From: {selectedMsg.name} ({selectedMsg.email})</span>
              </div>
              <button onClick={() => setSelectedMsg(null)} className="text-xl">×</button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="p-4 bg-slate-50 rounded-xl border space-y-1">
                <p><strong>Phone:</strong> {selectedMsg.phone || 'N/A'}</p>
                <p><strong>Message:</strong></p>
                <p className="p-3 bg-white rounded border whitespace-pre-line text-slate-700">{selectedMsg.message}</p>
              </div>

              {selectedMsg.replies && selectedMsg.replies.length > 0 && (
                <div className="space-y-2">
                  <span className="font-bold text-slate-400 uppercase font-mono block">Responses History</span>
                  {selectedMsg.replies.map(r => (
                    <div key={r.id} className="p-3 bg-[#F7F5EC] border rounded-lg">
                      <p className="font-bold text-[#163A4A]">{r.adminName}</p>
                      <p className="mt-1 text-slate-700">{r.message}</p>
                      <span className="text-[9px] text-slate-400 font-mono block mt-1">{r.date.substring(0, 16)}</span>
                    </div>
                  ))}
                </div>
              )}

              <div className="space-y-2">
                <label className="block font-semibold">Draft Official Reply</label>
                <textarea
                  rows={3}
                  value={replyText}
                  onChange={e => setReplyText(e.target.value)}
                  placeholder="Write your official response..."
                  className="w-full p-2 border rounded"
                />
              </div>

              <div className="flex gap-2 pt-2 border-t">
                <button
                  onClick={() => handleArchive(selectedMsg.id)}
                  className="px-4 py-2 border rounded hover:bg-slate-50 font-bold"
                >
                  Archive
                </button>
                <button
                  onClick={() => handleReply(selectedMsg.id)}
                  className="flex-1 py-2 bg-[#163A4A] text-white rounded font-bold hover:bg-[#24495D] flex items-center justify-center gap-1.5"
                >
                  <Send className="h-3.5 w-3.5" />
                  <span>Send Response</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
