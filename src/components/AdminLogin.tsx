import React, { useState } from 'react';
import { Language } from '../types';
import { LogoCrest } from './Header';
import { 
  ShieldCheck, 
  Lock, 
  User, 
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
  onLoginSuccess: () => void;
  onBackToSite: () => void;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({
  currentLang,
  onLanguageChange,
  onLoginSuccess,
  onBackToSite,
}) => {
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('admin');
  const [otpStep, setOtpStep] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!username.trim() || !password.trim()) {
      setErrorMsg(
        currentLang === 'ar'
          ? 'يرجى إدخال اسم المستخدم وكلمة المرور'
          : currentLang === 'tr'
          ? 'Lütfen kullanıcı adı ve şifrenizi girin'
          : 'Please enter username and password'
      );
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      if (!otpStep) {
        // Step 1: Verify username and password
        if (username.toLowerCase() === 'admin' && password === 'admin') {
          setOtpStep(true);
          setOtpCode('123456'); // auto-fill demo OTP code for smooth testing
        } else {
          setErrorMsg(
            currentLang === 'ar'
              ? 'بيانات الدخول غير صحيحة! (استخدم: admin / admin)'
              : currentLang === 'tr'
              ? 'Hatalı kullanıcı adı veya şifre! (Demo için: admin / admin)'
              : 'Invalid credentials! (Use demo: admin / admin)'
          );
        }
      } else {
        // Step 2: Verify 2FA OTP
        if (otpCode.trim() === '123456') {
          onLoginSuccess();
        } else {
          setErrorMsg(
            currentLang === 'ar'
              ? 'رمز التحقق الثنائي (2FA) غير صحيح! (الكود الافتراضي: 123456)'
              : currentLang === 'tr'
              ? '2FA Doğrulama kodu geçersiz! (Geçerli kod: 123456)'
              : 'Invalid 2FA code! (Valid code: 123456)'
          );
        }
      }
    }, 400);
  };

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

            {!otpStep ? (
              <>
                {/* Username */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center justify-between">
                    <span>{currentLang === 'ar' ? 'اسم المستخدم' : currentLang === 'tr' ? 'Kullanıcı Adı' : 'Username'}</span>
                    <span className="text-[10px] text-slate-400 font-mono">admin</span>
                  </label>
                  <div className="relative">
                    <User className="h-4 w-4 text-slate-400 absolute left-3 top-3.5 pointer-events-none" />
                    <input
                      type="text"
                      required
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="admin"
                      className="w-full pl-10 pr-3 py-2.5 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#C8B273] focus:border-transparent font-medium"
                    />
                  </div>
                </div>

                {/* Password */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center justify-between">
                    <span>{currentLang === 'ar' ? 'كلمة المرور السرية' : currentLang === 'tr' ? 'Yönetici Şifresi' : 'Password'}</span>
                    <span className="text-[10px] text-slate-400 font-mono">admin</span>
                  </label>
                  <div className="relative">
                    <KeyRound className="h-4 w-4 text-slate-400 absolute left-3 top-3.5 pointer-events-none" />
                    <input
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-10 pr-3 py-2.5 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#C8B273] focus:border-transparent font-medium"
                    />
                  </div>
                </div>
              </>
            ) : (
              /* Step 2: 2FA OTP */
              <div className="space-y-4 animate-fade-in">
                <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-900 flex items-start gap-2">
                  <ShieldAlert className="h-5 w-5 text-amber-700 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold">
                      {currentLang === 'ar' ? 'التحقق بخطوتين (2FA)' : currentLang === 'tr' ? '2 Adımlı Güvenlik Doğrulaması' : 'Two-Factor Authentication'}
                    </p>
                    <p className="text-[11px] mt-0.5 text-amber-800">
                      {currentLang === 'ar' 
                        ? 'كود التحقق الخاص بك هو: 123456' 
                        : currentLang === 'tr' 
                        ? 'Demo için güvenlik kodunuz: 123456' 
                        : 'Your verification OTP is: 123456'}
                    </p>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    {currentLang === 'ar' ? 'أدخل رمز التحقق (OTP)' : currentLang === 'tr' ? '6 Haneli Doğrulama Kodu' : '6-Digit OTP Code'}
                  </label>
                  <input
                    type="text"
                    maxLength={6}
                    required
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value)}
                    placeholder="123456"
                    className="w-full py-3 border-2 border-[#C8B273] rounded-xl text-center text-xl font-mono tracking-widest font-bold focus:outline-none focus:ring-2 focus:ring-[#163A4A]"
                    autoFocus
                  />
                </div>

                <button
                  type="button"
                  onClick={() => setOtpStep(false)}
                  className="text-xs text-slate-500 hover:text-slate-800 underline block text-center cursor-pointer"
                >
                  {currentLang === 'ar' ? '← العودة لتعديل اسم المستخدم' : currentLang === 'tr' ? '← Kullanıcı adı ve şifreye geri dön' : '← Back to credentials'}
                </button>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-[#163A4A] hover:bg-[#24495D] text-[#C8B273] font-bold rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer text-sm"
            >
              {isLoading ? (
                <div className="h-5 w-5 border-2 border-[#C8B273] border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>
                  <Lock className="h-4 w-4" />
                  <span>
                    {!otpStep
                      ? currentLang === 'ar' ? 'متابعة الدخول' : currentLang === 'tr' ? 'Devam Et (Giriş)' : 'Continue to Verify'
                      : currentLang === 'ar' ? 'تأكيد ودخول لوحة التحكم' : currentLang === 'tr' ? 'Doğrula ve Panele Gir' : 'Verify & Enter Console'}
                  </span>
                </>
              )}
            </button>

            {/* Quick Demo Credentials Box */}
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-[11px] text-slate-600 space-y-1">
              <span className="font-bold text-slate-800 block">
                {currentLang === 'ar' ? 'معلومات الدخول التجريبية (Demo):' : currentLang === 'tr' ? 'Hızlı Test Giriş Bilgileri:' : 'Demo Test Credentials:'}
              </span>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 font-mono text-[10px] text-slate-700">
                <span>User: <strong>admin</strong></span>
                <span>Pass: <strong>admin</strong></span>
                <span>2FA: <strong>123456</strong></span>
              </div>
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
              <span>2FA Verified</span>
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
