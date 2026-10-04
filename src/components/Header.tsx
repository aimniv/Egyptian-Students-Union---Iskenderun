import React, { useState } from 'react';
import { Language } from '../types';
import { Globe, Menu, X } from 'lucide-react';

interface HeaderProps {
  currentLang: Language;
  onLanguageChange: (lang: Language) => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  translations: Record<string, { ar: string; tr: string; en: string }>;
}

export const LogoCrest: React.FC<{ className?: string }> = ({ className = "h-12 w-12" }) => {
  return (
    <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Outer Circle Ring - Gold */}
      <circle cx="50" cy="50" r="46" stroke="#C8B273" strokeWidth="3" />
      {/* Inner Circle Fill - Deep Navy */}
      <circle cx="50" cy="50" r="42" fill="#163A4A" />
      
      {/* Abstract Eagle Wing Paths (Egyptian Silhouette) */}
      <path d="M22 45C30 40 40 48 50 48C60 48 70 40 78 45C72 65 50 78 50 78C50 78 28 65 22 45Z" fill="#C8B273" opacity="0.15" />
      
      {/* Centerpiece: Eagle of Saladin outline + Graduation Cap */}
      {/* Eagle silhouette */}
      <path d="M50 25C48 28 46 31 46 34C46 36 47 38 48 40H52C53 38 54 36 54 34C54 31 52 25 50 25Z" fill="#C8B273" />
      <path d="M41 42H59V55C59 60 55 64 50 64C45 64 41 60 41 55V42Z" fill="#C8B273" />
      {/* Shield Stripes inside Eagle (Egyptian Flag Motif) */}
      <rect x="44" y="45" width="4" height="12" fill="#E31D1D" />
      <rect x="48" y="45" width="4" height="12" fill="#FFFFFF" />
      <rect x="52" y="45" width="4" height="12" fill="#1F2937" />

      {/* Graduation Cap overlay */}
      <path d="M50 34L62 39L50 44L38 39L50 34Z" fill="#C8B273" stroke="#163A4A" strokeWidth="1" />
      <path d="M44 41.5V47C44 50 47 52 50 52C53 52 56 50 56 47V41.5" stroke="#C8B273" strokeWidth="1.5" fill="none" />
      {/* Cap tassel */}
      <path d="M59 40V46" stroke="#C8B273" strokeWidth="1" />
      <circle cx="59" cy="47" r="1.5" fill="#C8B273" />

      {/* Gears or Waves Accent for Iskenderun / İSTE Technical Motif */}
      <circle cx="50" cy="50" r="32" stroke="#C8B273" strokeWidth="0.75" strokeDasharray="4 2" />
    </svg>
  );
};

export const Header: React.FC<HeaderProps> = ({
  currentLang,
  onLanguageChange,
  activeTab,
  setActiveTab,
  translations,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const t = (key: string): string => {
    return translations[key]?.[currentLang] || key;
  };

  const navItems = [
    { id: 'home', label: t('nav.home') },
    { id: 'about', label: t('nav.about') },
    { id: 'board', label: t('nav.board') },
    { id: 'membership', label: t('nav.membership') },
    { id: 'guide', label: t('nav.guide') },
    { id: 'events', label: t('nav.events') },
    { id: 'activities', label: t('nav.activities') },
    { id: 'announcements', label: t('nav.announcements') },
    { id: 'media', label: t('nav.media') },
    { id: 'contact', label: t('nav.contact') },
  ];

  const handleLangChange = (lang: Language) => {
    onLanguageChange(lang);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-[#163A4A] text-white shadow-lg border-b border-[#C8B273]/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo & Brand Identity */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveTab('home')}>
            <LogoCrest className="h-14 w-14 transform hover:rotate-6 transition-transform duration-300" />
            <div className="hidden sm:block">
              <span className="block font-bold text-sm tracking-wide text-white">
                {currentLang === 'ar' ? 'اتحاد الطلاب المصريين' : currentLang === 'tr' ? 'Mısırlı Öğrenciler Birliği' : 'Egyptian Students\' Union'}
              </span>
              <span className="block text-[10px] text-[#C8B273] font-mono tracking-wider">
                İSKENDERUN / TÜRKİYE
              </span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-1 xl:space-x-2 rtl:space-x-reverse text-sm font-medium">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`px-3 py-2 rounded-md transition-all duration-200 cursor-pointer ${
                  activeTab === item.id
                    ? 'text-[#C8B273] bg-[#24495D] border-b-2 border-[#C8B273]'
                    : 'text-slate-100 hover:text-[#C8B273] hover:bg-[#24495D]/50'
                }`}
                id={`nav-item-${item.id}`}
              >
                {item.label}
              </button>
            ))}
          </nav>

          {/* Action Area: Language Switcher */}
          <div className="hidden lg:flex items-center space-x-4 rtl:space-x-reverse">
            {/* Language Selector */}
            <div className="relative group">
              <button className="flex items-center space-x-1.5 px-3 py-1.5 rounded-md bg-[#24495D] text-sm text-slate-100 hover:bg-[#24495D]/80 border border-[#C8B273]/20 cursor-pointer">
                <Globe className="h-4 w-4 text-[#C8B273]" />
                <span className="uppercase font-mono">{currentLang}</span>
              </button>
              <div className="absolute right-0 mt-1 w-32 bg-white rounded-md shadow-xl border border-slate-200 hidden group-hover:block overflow-hidden z-50 text-slate-800">
                <button onClick={() => handleLangChange('ar')} className="w-full text-left px-4 py-2 text-sm hover:bg-[#F7F5EC] hover:text-[#163A4A] block transition-colors cursor-pointer font-sans">
                  العربية (العربية)
                </button>
                <button onClick={() => handleLangChange('tr')} className="w-full text-left px-4 py-2 text-sm hover:bg-[#F7F5EC] hover:text-[#163A4A] block transition-colors cursor-pointer font-sans">
                  Türkçe (Türkçe)
                </button>
                <button onClick={() => handleLangChange('en')} className="w-full text-left px-4 py-2 text-sm hover:bg-[#F7F5EC] hover:text-[#163A4A] block transition-colors cursor-pointer font-sans">
                  English (English)
                </button>
              </div>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center lg:hidden space-x-2 rtl:space-x-reverse">
            {/* Lang switcher direct indicator */}
            <button 
              onClick={() => handleLangChange(currentLang === 'ar' ? 'tr' : currentLang === 'tr' ? 'en' : 'ar')}
              className="px-2 py-1 bg-[#24495D] text-xs font-mono rounded border border-[#C8B273]/20 flex items-center space-x-1 text-[#C8B273]"
            >
              <Globe className="h-3.5 w-3.5" />
              <span className="uppercase">{currentLang}</span>
            </button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-md text-slate-100 hover:text-white hover:bg-[#24495D] focus:outline-none"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Menu Navigation Panel */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#24495D] border-t border-[#C8B273]/20 px-2 pt-2 pb-4 space-y-1">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setActiveTab(item.id);
                setMobileMenuOpen(false);
              }}
              className={`w-full text-left block px-4 py-2.5 rounded-md text-base font-medium ${
                activeTab === item.id
                  ? 'bg-[#163A4A] text-[#C8B273]'
                  : 'text-slate-100 hover:bg-[#163A4A]/50 hover:text-[#C8B273]'
              }`}
            >
              {item.label}
            </button>
          ))}
          <div className="pt-4 pb-2 border-t border-slate-600 flex flex-col space-y-2 px-4">
            <div className="flex items-center justify-between text-xs text-slate-300">
              <span>{currentLang === 'ar' ? 'تغيير اللغة:' : currentLang === 'tr' ? 'Dil Değiştir:' : 'Change Language:'}</span>
              <div className="flex space-x-2 rtl:space-x-reverse">
                <button onClick={() => handleLangChange('ar')} className={`px-2 py-1 rounded ${currentLang === 'ar' ? 'bg-[#C8B273] text-[#163A4A]' : 'bg-slate-700 text-slate-200'}`}>AR</button>
                <button onClick={() => handleLangChange('tr')} className={`px-2 py-1 rounded ${currentLang === 'tr' ? 'bg-[#C8B273] text-[#163A4A]' : 'bg-slate-700 text-slate-200'}`}>TR</button>
                <button onClick={() => handleLangChange('en')} className={`px-2 py-1 rounded ${currentLang === 'en' ? 'bg-[#C8B273] text-[#163A4A]' : 'bg-slate-700 text-slate-200'}`}>EN</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
