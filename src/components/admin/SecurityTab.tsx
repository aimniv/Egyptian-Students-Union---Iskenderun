import React, { useState } from 'react';
import { LoginAttempt, ActivityLog, Language } from '../../types';
import { db } from '../../data/mockDb';
import { AdminAccounts } from './AdminAccounts';
import { ShieldCheck, HardDrive, RefreshCw, FileDown, Upload, AlertOctagon, Lock } from 'lucide-react';

interface Props {
  currentLang: Language;
  addToast: (msg: string, type: 'success' | 'info' | 'warning') => void;
  addActivityLog: (action: string, details: string) => void;
  adminEmail?: string;
}

export const SecurityTab: React.FC<Props> = ({ currentLang, addToast, addActivityLog, adminEmail }) => {
  const [loginHistory] = useState<LoginAttempt[]>(db.getLoginHistory());
  const [activityLogs] = useState<ActivityLog[]>(db.getActivityLogs());
  const [restoreJson, setRestoreJson] = useState('');
  const [showRestoreModal, setShowRestoreModal] = useState(false);

  const handleDownloadBackup = () => {
    const backupObj = db.getFullBackupObject();
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(backupObj, null, 2));
    const filename = `mob_backup_${new Date().toISOString().replace(/[:.]/g, '_')}.json`;
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", filename);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    addActivityLog('تصدير نسخة احتياطية كاملة', 'تنزيل ملف JSON شامل لكافة بيانات الموقع');
    addToast(currentLang === 'ar' ? 'تم تنزيل النسخة الاحتياطية بنجاح' : 'Backup downloaded', 'success');
  };

  const handleRestoreSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!restoreJson.trim()) return;
    const ok = db.restoreBackup(restoreJson.trim());
    if (ok) {
      addActivityLog('استعادة نسخة احتياطية', 'استرجاع قاعدة البيانات من ملف JSON خارجي');
      addToast(currentLang === 'ar' ? 'تم استرجاع قاعدة البيانات بنجاح! سيتم تحديث الصفحة.' : 'Database restored successfully!', 'success');
      setTimeout(() => {
        window.location.reload();
      }, 1200);
    } else {
      alert('Invalid JSON format or corrupted backup file');
    }
  };

  const handleFactoryReset = () => {
    if (confirm(currentLang === 'ar' ? 'تحذير: هل أنت متأكد من إعادة ضبط المنصة بالكامل إلى الإعدادات الأولية؟' : 'Warning: Reset entire system to initial seed data?')) {
      db.resetToDefault();
      addToast('System reset to default state', 'info');
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    }
  };

  return (
    <div className="space-y-6 text-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b gap-3">
        <div>
          <h2 className="text-xl font-bold text-[#163A4A]">
            {currentLang === 'ar' ? 'أمن المنظومة، النسخ الاحتياطي، وسجلات التدقيق' : 'Security, Backups & Audit Logs'}
          </h2>
          <p className="text-xs text-slate-500">
            {currentLang === 'ar' ? 'تأمين الحسابات، تصدير واسترجاع قواعد البيانات، ومراقبة نشاط المسؤولين' : 'Configure 2FA, create full system dumps, restore backups, and track access logs'}
          </p>
        </div>
      </div>

      <AdminAccounts currentLang={currentLang} adminEmail={adminEmail} addToast={addToast} addActivityLog={addActivityLog} />

      {/* Backup and Restore Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white p-5 rounded-xl border shadow-xs space-y-3">
          <h3 className="font-bold text-sm text-[#163A4A] flex items-center gap-2">
            <HardDrive className="h-4 w-4 text-[#C8B273]" />
            <span>النسخ الاحتياطي وتصدير قاعدة البيانات</span>
          </h3>
          <p className="text-slate-500">
            احفظ كامل بيانات المنصة (الأعضاء، الفعاليات، الهيئة الإدارية، الأدلة، والشكاوى) في ملف JSON موثق يمكنك استعادته في أي لحظة.
          </p>
          <div className="flex gap-2 pt-2">
            <button
              onClick={handleDownloadBackup}
              className="px-4 py-2 bg-[#163A4A] text-[#C8B273] rounded-lg font-bold hover:bg-[#24495D] flex items-center gap-2 cursor-pointer"
            >
              <FileDown className="h-4 w-4" />
              <span>تنزيل نسخة احتياطية كاملة (JSON)</span>
            </button>
            <button
              onClick={() => setShowRestoreModal(true)}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-bold flex items-center gap-2 cursor-pointer"
            >
              <Upload className="h-4 w-4" />
              <span>استعادة نسخة (Restore)</span>
            </button>
          </div>
        </div>

        {/* Security Controls */}
        <div className="bg-white p-5 rounded-xl border shadow-xs space-y-3">
          <h3 className="font-bold text-sm text-[#163A4A] flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-[#C8B273]" />
            <span>حماية المنظومة وجدار النار الإداري</span>
          </h3>
          <div className="space-y-2">
            <div className="flex items-center justify-between p-2 bg-slate-50 rounded-lg border">
              <span>المصادقة الثنائية عبر البريد (Email 2FA)</span>
              <span className="font-mono text-green-700 font-bold">ALWAYS ON</span>
            </div>
            <div className="flex items-center justify-between p-2 bg-slate-50 rounded-lg border">
              <span>حماية هجمات CSRF & Injection Shield</span>
              <span className="font-mono text-green-700 font-bold">ACTIVE</span>
            </div>
            <div className="flex items-center justify-between p-2 bg-slate-50 rounded-lg border">
              <span>فحص مدخلات XSS ومطابقة النماذج</span>
              <span className="font-mono text-green-700 font-bold">ACTIVE</span>
            </div>
          </div>
        </div>
      </div>

      {/* Activity Logs & Login Patrol */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Activity Logs */}
        <div className="bg-white p-5 rounded-xl border shadow-xs space-y-3">
          <h4 className="font-bold text-sm text-[#163A4A]">سجل نشاطات المسؤولين (Audit Log)</h4>
          <div className="divide-y divide-slate-100 max-h-56 overflow-y-auto pr-1">
            {activityLogs.map(log => (
              <div key={log.id} className="py-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-800">{log.action}</span>
                  <span className="text-[10px] text-slate-400 font-mono">{log.timestamp.substring(11, 19)}</span>
                </div>
                <p className="text-slate-500 text-[11px] mt-0.5">{log.details}</p>
                <span className="text-[9px] text-slate-400 font-mono">{log.adminUser} • IP: {log.ip}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Login History */}
        <div className="bg-white p-5 rounded-xl border shadow-xs space-y-3">
          <h4 className="font-bold text-sm text-[#163A4A]">سجل محاولات الدخول وحراسة الجلسات</h4>
          <div className="divide-y divide-slate-100 max-h-56 overflow-y-auto pr-1">
            {loginHistory.map(lh => (
              <div key={lh.id} className="py-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-800">{lh.username}</span>
                  <span className={`px-2 py-0.5 rounded text-[8px] font-bold ${lh.status === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {lh.status}
                  </span>
                </div>
                <p className="text-[10px] text-slate-500 mt-0.5">{lh.device}</p>
                <span className="text-[9px] text-slate-400 font-mono">{lh.timestamp} • {lh.location}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Danger Zone: Factory Reset */}
      <div className="bg-red-50/50 border border-red-200 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3 text-red-900">
          <AlertOctagon className="h-6 w-6 text-red-600 shrink-0" />
          <div>
            <h4 className="font-bold text-sm">منطقة الطوارئ: استعادة الإعدادات المصنعية الأولية</h4>
            <p className="text-[11px] text-red-700">إعادة تعيين كافة السجلات إلى البيانات النموذجية الأساسية للاتحاد</p>
          </div>
        </div>
        <button
          onClick={handleFactoryReset}
          className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg cursor-pointer shrink-0"
        >
          Reset to Factory Defaults
        </button>
      </div>

      {/* Restore Modal */}
      {showRestoreModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl p-6">
            <h3 className="text-lg font-bold text-[#163A4A] mb-2">استعادة قاعدة البيانات من ملف JSON</h3>
            <p className="text-xs text-slate-500 mb-4">الصق محتوى ملف النسخة الاحتياطية (JSON) في الحقل أدناه لاسترجاع كافة الأقسام.</p>
            <form onSubmit={handleRestoreSubmit} className="space-y-3">
              <textarea
                rows={8}
                value={restoreJson}
                onChange={e => setRestoreJson(e.target.value)}
                placeholder='{"board": [...], "events": [...], ...}'
                className="w-full p-2 border rounded font-mono text-[11px]"
                required
              />
              <div className="flex gap-2">
                <button type="button" onClick={() => setShowRestoreModal(false)} className="flex-1 py-2 border rounded font-bold">
                  Cancel
                </button>
                <button type="submit" className="flex-1 py-2 bg-[#163A4A] text-[#C8B273] rounded font-bold hover:bg-[#24495D]">
                  Restore Database
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
