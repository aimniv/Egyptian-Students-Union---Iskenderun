import React, { useState } from 'react';
import { Language } from '../types';
import { LogoCrest } from './Header';
import { adminApi, AdminSession, ApiError } from '../lib/adminApi';
import {
  ShieldCheck,
  Lock,
  Mail,
  KeyRound,
  ArrowLeft,
  ArrowRight,
  AlertCircle,
  ShieldAlert,
  CheckCircle2,
  Globe
} from 'lucide-react';

interface AdminLoginProps {
  currentLang: Language;
  onLanguageChange: (lang: Language) => void;
  onLoginSuccess: (session: AdminSession) => void;
  onBackToSite: () => void;
}

type Step = 'login' | 'otp' | 'setupRequest' | 'setupConfirm';

const TEXT = {
  ar: {
    email: 'البريد الإلكتروني', password: 'كلمة المرور', newPassword: 'كلمة المرور الجديدة (10 أحرف على الأقل)',
    code: 'رمز التحقق المرسل إلى بريدك', continue: 'متابعة الدخول', verify: 'تأكيد ودخول لوحة التحكم',
    sendCode: 'إرسال الرمز إلى بريدي', savePassword: 'حفظ كلمة المرور',
    firstTime: 'أول مرة / نسيت كلمة المرور', back: 'العودة لتسجيل الدخول',
    otpInfo: 'أرسلنا رمزاً من 6 أرقام إلى بريدك الإلكتروني. صلاحيته 10 دقائق.',
    setupInfo: 'أدخل بريدك المسجل كمشرف وسنرسل لك رمزاً لتعيين كلمة المرور.',
    setupSent: 'إن كان البريد مسجلاً كمشرف فقد أُرسل إليه رمز. أدخله مع كلمة المرور الجديدة.',
    setupDone: 'تم حفظ كلمة المرور. يمكنك تسجيل الدخول الآن.',
    errors: {
      invalid_credentials: 'البريد أو كلمة المرور غير صحيحة',
      invalid_code: 'الرمز غير صحيح أو منتهي الصلاحية',
      invalid_email: 'يرجى إدخال بريد إلكتروني صحيح',
      weak_password: 'كلمة المرور قصيرة (10 أحرف على الأقل)',
      too_many_attempts: 'محاولات كثيرة. حاول لاحقاً',
      not_configured: 'الخادم غير مهيأ بعد (قاعدة البيانات أو خدمة البريد)',
      mail_failed: 'تعذر إرسال البريد. حاول لاحقاً',
      unreachable: 'خدمة الدخول غير متاحة (الواجهة البرمجية /api لا تعمل)',
      default: 'حدث خطأ غير متوقع',
    },
  },
  tr: {
    email: 'E-posta', password: 'Şifre', newPassword: 'Yeni şifre (en az 10 karakter)',
    code: 'E-postanıza gelen doğrulama kodu', continue: 'Devam Et', verify: 'Doğrula ve Panele Gir',
    sendCode: 'Kodu e-postama gönder', savePassword: 'Şifreyi Kaydet',
    firstTime: 'İlk giriş / şifremi unuttum', back: 'Girişe dön',
    otpInfo: 'E-postanıza 6 haneli bir kod gönderdik. 10 dakika geçerlidir.',
    setupInfo: 'Yönetici olarak kayıtlı e-postanızı girin; şifre belirlemeniz için kod göndereceğiz.',
    setupSent: 'E-posta yönetici olarak kayıtlıysa bir kod gönderildi. Kodu yeni şifrenizle birlikte girin.',
    setupDone: 'Şifre kaydedildi. Şimdi giriş yapabilirsiniz.',
    errors: {
      invalid_credentials: 'E-posta veya şifre hatalı',
      invalid_code: 'Kod hatalı veya süresi dolmuş',
      invalid_email: 'Geçerli bir e-posta girin',
      weak_password: 'Şifre çok kısa (en az 10 karakter)',
      too_many_attempts: 'Çok fazla deneme. Daha sonra tekrar deneyin',
      not_configured: 'Sunucu henüz yapılandırılmadı (veritabanı veya e-posta servisi)',
      mail_failed: 'E-posta gönderilemedi. Daha sonra tekrar deneyin',
      unreachable: 'Giriş servisi ulaşılamıyor (/api çalışmıyor)',
      default: 'Beklenmeyen bir hata oluştu',
    },
  },
  en: {
    email: 'Email', password: 'Password', newPassword: 'New password (at least 10 characters)',
    code: 'Verification code from your email', continue: 'Continue', verify: 'Verify & Enter Console',
    sendCode: 'Email me a code', savePassword: 'Save Password',
    firstTime: 'First time / forgot password', back: 'Back to sign in',
    otpInfo: 'We emailed a 6-digit code to your address. It is valid for 10 minutes.',
    setupInfo: 'Enter the email registered as an administrator and we will send a code to set your password.',
    setupSent: 'If the email is registered as an administrator, a code was sent. Enter it with your new password.',
    setupDone: 'Password saved. You can sign in now.',
    errors: {
      invalid_credentials: 'Incorrect email or password',
      invalid_code: 'The code is wrong or has expired',
      invalid_email: 'Please enter a valid email',
      weak_password: 'Password is too short (at least 10 characters)',
      too_many_attempts: 'Too many attempts. Try again later',
      not_configured: 'Server is not configured yet (database or mail service)',
      mail_failed: 'Could not send the email. Try again later',
      unreachable: 'Sign-in service unreachable (/api is not running)',
      default: 'Unexpected error',
    },
  },
} as const;

export const AdminLogin: React.FC<AdminLoginProps> = ({
  currentLang,
  onLanguageChange,
  onLoginSuccess,
  onBackToSite,
}) => {
  const t = TEXT[currentLang];
  const [step, setStep] = useState<Step>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [code, setCode] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [notice, setNotice] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const goTo = (next: Step, info = '') => {
    setStep(next);
    setErrorMsg('');
    setNotice(info);
    setCode('');
    setPassword('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setIsLoading(true);
    try {
      if (step === 'login') {
        await adminApi.login(email, password);
        goTo('otp', t.otpInfo);
      } else if (step === 'otp') {
        onLoginSuccess(await adminApi.verify(email, code));
      } else if (step === 'setupRequest') {
        await adminApi.setupRequest(email);
        goTo('setupConfirm', t.setupSent);
      } else {
        await adminApi.setupConfirm(email, code, password);
        goTo('login', t.setupDone);
      }
    } catch (err) {
      const key = err instanceof ApiError ? err.code : 'default';
      setErrorMsg((t.errors as Record<string, string>)[key] || t.errors.default);
    } finally {
      setIsLoading(false);
    }
  };

  const submitLabel = {
    login: t.continue,
    otp: t.verify,
    setupRequest: t.sendCode,
    setupConfirm: t.savePassword,
  }[step];

  const inputClass =
    'w-full pl-10 pr-3 py-2.5 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#C8B273] focus:border-transparent font-medium';

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0c222c] via-[#163A4A] to-[#1c475d] text-white flex flex-col justify-between p-4 sm:p-6 font-sans">
      {/* Top Bar with Back to Site & Language */}
      <div className="max-w-6xl w-full mx-auto flex items-center justify-between">
        <button
          onClick={onBackToSite}
          className="flex items-center gap-2 text-xs sm:text-sm text-slate-300 hover:text-[#C8B273] transition-colors bg-white/10 hover:bg-white/15 px-3.5 py-2 rounded-xl border border-white/10 cursor-pointer"
        >
          {currentLang === 'ar' ? (
            <>
              <ArrowRight className="h-4 w-4 text-[#C8B273]" />
              <span>العودة للموقع الرئيسي</span>
            </>
          ) : (
            <>
              <ArrowLeft className="h-4 w-4 text-[#C8B273]" />
              <span>{currentLang === 'tr' ? 'Ana Siteye Dön' : 'Return to Website'}</span>
            </>
          )}
        </button>

        {/* Language selector */}
        <div className="flex items-center gap-1.5 bg-black/20 p-1 rounded-xl border border-white/10">
          <Globe className="h-3.5 w-3.5 text-[#C8B273] ml-1.5" />
          <button
            onClick={() => onLanguageChange('ar')}
            className={`px-2 py-1 rounded-lg text-xs font-semibold cursor-pointer ${
              currentLang === 'ar' ? 'bg-[#C8B273] text-[#163A4A]' : 'text-slate-300 hover:text-white'
            }`}
          >
            AR
          </button>
          <button
            onClick={() => onLanguageChange('tr')}
            className={`px-2 py-1 rounded-lg text-xs font-semibold cursor-pointer ${
              currentLang === 'tr' ? 'bg-[#C8B273] text-[#163A4A]' : 'text-slate-300 hover:text-white'
            }`}
          >
            TR
          </button>
          <button
            onClick={() => onLanguageChange('en')}
            className={`px-2 py-1 rounded-lg text-xs font-semibold cursor-pointer ${
              currentLang === 'en' ? 'bg-[#C8B273] text-[#163A4A]' : 'text-slate-300 hover:text-white'
            }`}
          >
            EN
          </button>
        </div>
      </div>

      {/* Main Login Box */}
      <div className="max-w-md w-full mx-auto my-8">
        <div className="bg-white text-slate-800 rounded-3xl shadow-2xl border border-[#C8B273]/40 overflow-hidden">
          
          {/* Header of Modal */}
          <div className="bg-[#163A4A] p-6 text-white text-center relative border-b-2 border-[#C8B273]">
            {/* Dedicated Route pill */}
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/30 border border-[#C8B273]/30 text-[11px] font-mono text-[#C8B273] mb-4">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>GATEWAY: /admin</span>
            </div>

            <div className="flex justify-center mb-3">
              <LogoCrest className="h-16 w-16" />
            </div>

            <h1 className="text-xl font-bold text-white tracking-wide">
              {currentLang === 'ar' 
                ? 'بوابة الإدارة المركزية والتحكم' 
                : currentLang === 'tr' 
                ? 'MÖB Yönetici Giriş Paneli' 
                : 'MÖB Administrator Portal'}
            </h1>
            <p className="text-xs text-slate-300 mt-1">
              {currentLang === 'ar'
                ? 'تسجيل الدخول المخصص للهيئة الإدارية لاتحاد الطلاب'
                : currentLang === 'tr'
                ? 'Bu alan yalnızca yetkili yönetim kurulu içindir (/admin)'
                : 'Restricted administrative suite for board executives'}
            </p>
          </div>

          {/* Form Area */}
          <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-5">
            {errorMsg && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-start gap-2 animate-shake">
                <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                <span>{errorMsg}</span>
              </div>
            )}

            {notice && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl flex items-start gap-2">
                <ShieldAlert className="h-4 w-4 shrink-0 mt-0.5" />
                <span>{notice}</span>
              </div>
            )}

            {(step === 'login' || step === 'setupRequest' || step === 'setupConfirm') && (
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">{t.email}</label>
                <div className="relative">
                  <Mail className="h-4 w-4 text-slate-400 absolute left-3 top-3.5 pointer-events-none" />
                  <input
                    type="email"
                    required
                    autoComplete="username"
                    value={email}
                    readOnly={step === 'setupConfirm'}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    className={inputClass}
                  />
                </div>
              </div>
            )}

            {step === 'setupRequest' && (
              <p className="text-[11px] text-slate-500">{t.setupInfo}</p>
            )}

            {(step === 'otp' || step === 'setupConfirm') && (
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">{t.code}</label>
                <input
                  type="text"
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  maxLength={6}
                  required
                  value={code}
                  onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
                  placeholder="••••••"
                  className="w-full py-3 border-2 border-[#C8B273] rounded-xl text-center text-xl font-mono tracking-widest font-bold focus:outline-none focus:ring-2 focus:ring-[#163A4A]"
                  autoFocus
                />
              </div>
            )}

            {(step === 'login' || step === 'setupConfirm') && (
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  {step === 'login' ? t.password : t.newPassword}
                </label>
                <div className="relative">
                  <KeyRound className="h-4 w-4 text-slate-400 absolute left-3 top-3.5 pointer-events-none" />
                  <input
                    type="password"
                    required
                    minLength={step === 'setupConfirm' ? 10 : undefined}
                    autoComplete={step === 'login' ? 'current-password' : 'new-password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••"
                    className={inputClass}
                  />
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-[#163A4A] hover:bg-[#24495D] disabled:opacity-70 text-[#C8B273] font-bold rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer text-sm"
            >
              {isLoading ? (
                <div className="h-5 w-5 border-2 border-[#C8B273] border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>
                  <Lock className="h-4 w-4" />
                  <span>{submitLabel}</span>
                </>
              )}
            </button>

            <div className="text-center">
              {step === 'login' ? (
                <button
                  type="button"
                  onClick={() => goTo('setupRequest')}
                  className="text-xs text-slate-500 hover:text-slate-800 underline cursor-pointer"
                >
                  {t.firstTime}
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => goTo('login')}
                  className="text-xs text-slate-500 hover:text-slate-800 underline cursor-pointer"
                >
                  {t.back}
                </button>
              )}
            </div>
          </form>

          {/* Footer Security Badges */}
          <div className="bg-slate-100 p-4 border-t border-slate-200 text-center flex items-center justify-center gap-4 text-[10px] text-slate-500 font-mono">
            <span className="flex items-center gap-1">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
              <span>256-Bit SSL</span>
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <CheckCircle2 className="h-3.5 w-3.5 text-blue-600" />
              <span>Email 2FA</span>
            </span>
            <span>•</span>
            <span>Route: /admin</span>
          </div>

        </div>
      </div>

      {/* Bottom Copyright */}
      <div className="text-center text-xs text-slate-400">
        <p>© {new Date().getFullYear()} Egyptian Students' Union - Iskenderun • Administrative Gateway</p>
      </div>
    </div>
  );
};
