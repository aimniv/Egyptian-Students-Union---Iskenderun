import React, { useCallback, useEffect, useState } from 'react';
import { Language } from '../../types';
import { adminApi, AdminAccount, ApiError } from '../../lib/adminApi';
import { UserPlus, Trash2, Mail } from 'lucide-react';
import { confirmDialog } from '../../lib/dialog';

interface Props {
  currentLang: Language;
  adminEmail?: string;
  addToast: (msg: string, type: 'success' | 'info' | 'warning') => void;
  addActivityLog: (action: string, details: string) => void;
}

const T = {
  ar: {
    title: 'حسابات المشرفين', desc: 'البريد الإلكتروني هو هوية الدخول. المشرف الجديد يعيّن كلمة مروره من صفحة الدخول (أول مرة / نسيت كلمة المرور).',
    email: 'البريد الإلكتروني', name: 'الاسم (اختياري)', add: 'إضافة مشرف', you: 'أنت',
    pending: 'لم يعيّن كلمة المرور', active: 'نشط', remove: 'حذف', confirm: 'حذف صلاحية هذا المشرف؟',
    added: 'تمت إضافة المشرف', removed: 'تم حذف المشرف', mailFail: 'تمت الإضافة لكن تعذر إرسال بريد الدعوة',
    errors: { already_exists: 'هذا البريد مضاف مسبقاً', invalid_email: 'بريد إلكتروني غير صالح', cannot_remove_self: 'لا يمكنك حذف حسابك', default: 'حدث خطأ' },
  },
  tr: {
    title: 'Yönetici Hesapları', desc: 'E-posta giriş kimliğidir. Yeni yönetici şifresini giriş sayfasından belirler (İlk giriş / şifremi unuttum).',
    email: 'E-posta', name: 'Ad (isteğe bağlı)', add: 'Yönetici Ekle', you: 'siz',
    pending: 'Şifre belirlemedi', active: 'Aktif', remove: 'Sil', confirm: 'Bu yöneticinin yetkisi kaldırılsın mı?',
    added: 'Yönetici eklendi', removed: 'Yönetici silindi', mailFail: 'Eklendi ancak davet e-postası gönderilemedi',
    errors: { already_exists: 'Bu e-posta zaten ekli', invalid_email: 'Geçersiz e-posta', cannot_remove_self: 'Kendi hesabınızı silemezsiniz', default: 'Bir hata oluştu' },
  },
  en: {
    title: 'Administrator Accounts', desc: 'Email is the sign-in identity. A new admin sets their own password from the sign-in page (First time / forgot password).',
    email: 'Email', name: 'Name (optional)', add: 'Add Administrator', you: 'you',
    pending: 'Password not set', active: 'Active', remove: 'Remove', confirm: 'Remove this administrator?',
    added: 'Administrator added', removed: 'Administrator removed', mailFail: 'Added, but the invitation email could not be sent',
    errors: { already_exists: 'This email is already an administrator', invalid_email: 'Invalid email', cannot_remove_self: 'You cannot remove your own account', default: 'Something went wrong' },
  },
} as const;

export const AdminAccounts: React.FC<Props> = ({ currentLang, adminEmail, addToast, addActivityLog }) => {
  const t = T[currentLang];
  const [admins, setAdmins] = useState<AdminAccount[]>([]);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [busy, setBusy] = useState(false);

  const errText = (err: unknown) =>
    (t.errors as Record<string, string>)[err instanceof ApiError ? err.code : 'default'] || t.errors.default;

  const load = useCallback(async () => {
    try {
      setAdmins((await adminApi.listAdmins()).admins);
    } catch (err) {
      addToast(errText(err), 'warning');
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    try {
      const res = await adminApi.addAdmin(email, name);
      addActivityLog('Admin added', email);
      addToast(res.invited ? t.added : t.mailFail, res.invited ? 'success' : 'warning');
      setEmail('');
      setName('');
      await load();
    } catch (err) {
      addToast(errText(err), 'warning');
    } finally {
      setBusy(false);
    }
  };

  const handleRemove = async (target: string) => {
    if (!(await confirmDialog(t.confirm))) return;
    try {
      await adminApi.removeAdmin(target);
      addActivityLog('Admin removed', target);
      addToast(t.removed, 'info');
      await load();
    } catch (err) {
      addToast(errText(err), 'warning');
    }
  };

  return (
    <div className="bg-white p-5 rounded-xl border shadow-xs space-y-4">
      <div>
        <h3 className="font-bold text-sm text-[#163A4A] flex items-center gap-2">
          <Mail className="h-4 w-4 text-[#C8B273]" />
          <span>{t.title}</span>
        </h3>
        <p className="text-slate-500 mt-1">{t.desc}</p>
      </div>

      <div className="divide-y divide-slate-100 border rounded-lg">
        {admins.map((a) => (
          <div key={a.email} className="flex items-center justify-between gap-3 p-2.5">
            <div className="min-w-0">
              <p className="font-bold text-slate-800 truncate">
                {a.name !== a.email ? a.name : a.email}
                {a.email === adminEmail && <span className="ml-2 text-[10px] text-slate-400">({t.you})</span>}
              </p>
              {a.name !== a.email && <p className="text-[11px] text-slate-500 truncate">{a.email}</p>}
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${a.hasPassword ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'}`}>
                {a.hasPassword ? t.active : t.pending}
              </span>
              {a.email !== adminEmail && (
                <button
                  onClick={() => handleRemove(a.email)}
                  title={t.remove}
                  className="p-1.5 rounded hover:bg-red-50 text-red-600 cursor-pointer"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      <form onSubmit={handleAdd} className="grid grid-cols-1 sm:grid-cols-[1fr_1fr_auto] gap-2">
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={t.email}
          className="p-2 border rounded-lg"
        />
        <input value={name} onChange={(e) => setName(e.target.value)} placeholder={t.name} className="p-2 border rounded-lg" />
        <button
          type="submit"
          disabled={busy}
          className="px-4 py-2 bg-[#163A4A] text-[#C8B273] rounded-lg font-bold hover:bg-[#24495D] disabled:opacity-70 flex items-center justify-center gap-2 cursor-pointer"
        >
          <UserPlus className="h-4 w-4" />
          <span>{t.add}</span>
        </button>
      </form>
    </div>
  );
};
