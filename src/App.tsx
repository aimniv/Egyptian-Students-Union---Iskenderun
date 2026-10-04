import { useState, useEffect } from 'react';
import { Language, WebsiteSettings } from './types';
import { db } from './data/mockDb';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { ClientPortal } from './components/ClientPortal';
import { AdminPanel } from './components/AdminPanel';
import { AdminLogin } from './components/AdminLogin';
import { AlertCircle, CheckCircle, Info, X } from 'lucide-react';

interface Toast {
  id: string;
  message: string;
  type: 'success' | 'info' | 'warning';
}

const checkIsAdminPath = (): boolean => {
  if (typeof window === 'undefined') return false;
  const path = window.location.pathname.toLowerCase();
  const hash = window.location.hash.toLowerCase();
  return (
    path === '/admin' || 
    path.startsWith('/admin/') || 
    hash === '#admin' || 
    hash === '#/admin' ||
    hash.startsWith('#/admin')
  );
};

export default function App() {
  // Global States
  const [currentLang, setCurrentLang] = useState<Language>('ar');
  const [activeTab, setActiveTab] = useState<string>('home');
  
  // Dedicated route state for /admin
  const [isAdminRoute, setIsAdminRoute] = useState<boolean>(() => checkIsAdminPath());
  
  // Admin authentication state (persists in sessionStorage for tab lifetime)
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    return sessionStorage.getItem('mob_admin_auth') === 'true';
  });
  
  // CMS, CRM, ERP States synced with Local Storage DB
  const [translations, setTranslations] = useState<Record<string, { ar: string; tr: string; en: string }>>({});
  const [settings, setSettings] = useState<WebsiteSettings | null>(null);
  
  // Toast notifications manager
  const [toasts, setToasts] = useState<Toast[]>([]);

  // Initialize and load database
  useEffect(() => {
    setTranslations(db.getTranslations());
    setSettings(db.getSettings());
    setCurrentLang('ar');
  }, []);

  // Listen to popstate and hashchange events for deep linking (/admin and #/admin)
  useEffect(() => {
    const handleUrlChange = () => {
      const onAdmin = checkIsAdminPath();
      setIsAdminRoute(onAdmin);
    };

    window.addEventListener('popstate', handleUrlChange);
    window.addEventListener('hashchange', handleUrlChange);
    return () => {
      window.removeEventListener('popstate', handleUrlChange);
      window.removeEventListener('hashchange', handleUrlChange);
    };
  }, []);

  // Sync HTML document direction dynamically
  useEffect(() => {
    document.documentElement.dir = 'ltr';
    document.documentElement.lang = currentLang;
  }, [currentLang]);

  const addToast = (message: string, type: 'success' | 'info' | 'warning' = 'success') => {
    const id = 'toast_' + Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 5000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const handleLanguageChange = (lang: Language) => {
    setCurrentLang(lang);
    addToast(
      lang === 'ar' 
        ? 'تم تغيير لغة الموقع إلى العربية بنجاح' 
        : lang === 'tr' 
        ? 'Dil başarıyla Türkçe olarak değiştirildi' 
        : 'Language successfully changed to English',
      'info'
    );
  };

  const handleTranslationUpdate = (newTrans: Record<string, { ar: string; tr: string; en: string }>) => {
    setTranslations(newTrans);
    db.saveTranslations(newTrans);
  };

  const handleSettingsUpdate = (newSettings: WebsiteSettings) => {
    setSettings(newSettings);
    db.saveSettings(newSettings);
  };

  // Navigation handlers between public site and /admin
  const navigateToAdmin = () => {
    window.history.pushState(null, '', '/admin');
    setIsAdminRoute(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navigateToSite = (targetTab: string = 'home') => {
    window.history.pushState(null, '', '/');
    setIsAdminRoute(false);
    setActiveTab(targetTab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAdminLoginSuccess = () => {
    setIsAdminAuthenticated(true);
    sessionStorage.setItem('mob_admin_auth', 'true');
    addToast(
      currentLang === 'ar'
        ? 'تم تسجيل الدخول بنجاح! مرحباً بكم في لوحة التحكم الإدارية.'
        : currentLang === 'tr'
        ? 'Giriş başarılı! MÖB Yönetim Paneline hoş geldiniz.'
        : 'Login successful! Welcome to MÖB Admin Console.',
      'success'
    );
  };

  const handleAdminLogout = () => {
    setIsAdminAuthenticated(false);
    sessionStorage.removeItem('mob_admin_auth');
    addToast(
      currentLang === 'ar'
        ? 'تم تسجيل الخروج بنجاح من لوحة الإدارة.'
        : currentLang === 'tr'
        ? 'Yönetici oturumu güvenli şekilde sonlandırıldı.'
        : 'Logged out successfully from administration.',
      'info'
    );
    // Optionally return to public site
    navigateToSite('home');
  };

  if (!settings || !translations) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC]">
        <div className="flex flex-col items-center space-y-4">
          <div className="h-10 w-10 border-4 border-[#C8B273] border-t-transparent rounded-full animate-spin"></div>
          <p className="text-slate-500 font-mono text-xs">MÖB SYSTEMS INITIALIZING...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800 transition-all duration-300">
      
      {/* 
        ROUTING CONDITIONAL:
        If URL is /admin or #/admin, render the dedicated Admin Module
        Otherwise, render the Public Student Union Portal
      */}
      {isAdminRoute ? (
        !isAdminAuthenticated ? (
          /* Dedicated Admin Login Screen on /admin */
          <AdminLogin
            currentLang={currentLang}
            onLanguageChange={handleLanguageChange}
            onLoginSuccess={handleAdminLoginSuccess}
            onBackToSite={() => navigateToSite('home')}
          />
        ) : (
          /* Dedicated Full Admin Panel on /admin */
          <AdminPanel 
            currentLang={currentLang}
            translations={translations}
            onTranslationUpdate={handleTranslationUpdate}
            settings={settings}
            onSettingsUpdate={handleSettingsUpdate}
            addToast={addToast}
            onNavigateToSite={() => navigateToSite('home')}
            onLogout={handleAdminLogout}
          />
        )
      ) : (
        /* Regular Public Website for Students & Visitors */
        <>
          {/* Public Header without any intrusive admin button */}
          <Header 
            currentLang={currentLang}
            onLanguageChange={handleLanguageChange}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            translations={translations}
          />

          {/* Public Portal Views */}
          <main className="flex-1 flex flex-col">
            <ClientPortal 
              currentLang={currentLang}
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              translations={translations}
              settings={settings}
              addToast={addToast}
            />
          </main>

          {/* Public Footer with discreet /admin link */}
          <Footer 
            currentLang={currentLang} 
            settings={settings} 
            onNavigateAdmin={navigateToAdmin}
          />
        </>
      )}

      {/* Toast Notification Container Overlay */}
      <div className="fixed bottom-5 right-5 left-5 md:left-auto md:right-5 z-[200] max-w-sm w-full space-y-2.5">
        {toasts.map((toast) => (
          <div 
            key={toast.id} 
            className={`p-4 rounded-xl shadow-xl border flex items-start space-x-3 rtl:space-x-reverse animate-fade-in bg-white ${
              toast.type === 'success' ? 'border-green-300' :
              toast.type === 'warning' ? 'border-amber-300' : 'border-[#C8B273]'
            }`}
          >
            <div className="shrink-0 mt-0.5">
              {toast.type === 'success' && <CheckCircle className="h-5 w-5 text-green-600" />}
              {toast.type === 'warning' && <AlertCircle className="h-5 w-5 text-amber-600" />}
              {toast.type === 'info' && <Info className="h-5 w-5 text-[#C8B273]" />}
            </div>
            <div className="flex-1">
              <p className="text-xs sm:text-sm font-semibold text-slate-800 font-sans">
                {toast.message}
              </p>
            </div>
            <button 
              onClick={() => removeToast(toast.id)} 
              className="text-slate-400 hover:text-slate-600 shrink-0 cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>

    </div>
  );
}
