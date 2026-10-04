import React from 'react';
import { Language, WebsiteSettings } from '../types';
import { Mail, Phone, MapPin, Clock, Globe, Award, ExternalLink, Lock } from 'lucide-react';

interface FooterProps {
  currentLang: Language;
  settings: WebsiteSettings;
  onNavigateAdmin?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ currentLang, settings, onNavigateAdmin }) => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#163A4A] text-white border-t-4 border-[#C8B273] pt-12 pb-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Brand Showcase & Coordinates Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8 pb-8 border-b border-slate-700">
          
          {/* Column 1: Organization Intro */}
          <div className="space-y-4">
            <h3 className="text-base font-bold text-[#C8B273] font-sans">
              {currentLang === 'ar' ? 'اتحاد الطلاب المصريين بإسكندرون' : currentLang === 'tr' ? 'Mısırlı Öğrenciler Birliği' : 'Egyptian Students\' Union'}
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              {currentLang === 'ar' 
                ? 'الهيئة الطلابية الرسمية المنظمة والراعية لشؤون الطلبة المصريين في مدينة إسكندرون التقنية بتركيا تحت رعاية الملحقية الثقافية.'
                : currentLang === 'tr'
                ? 'Türkiye\'de İskenderun Teknik bünyesinde eğitim gören Mısırlı öğrencilerin resmi temsilcisi ve koordinasyon organıdır.'
                : 'The official representative student organization looking after the affairs and needs of Egyptian students studying in Iskenderun, Türkiye.'}
            </p>
            <div className="flex space-x-3 rtl:space-x-reverse pt-2">
              <a href={settings.socials.facebook} target="_blank" rel="noopener noreferrer" className="p-1.5 bg-[#24495D] rounded hover:bg-[#C8B273] hover:text-[#163A4A] transition-colors text-slate-300">
                <span className="text-xs font-semibold">FB</span>
              </a>
              <a href={settings.socials.instagram} target="_blank" rel="noopener noreferrer" className="p-1.5 bg-[#24495D] rounded hover:bg-[#C8B273] hover:text-[#163A4A] transition-colors text-slate-300">
                <span className="text-xs font-semibold">IG</span>
              </a>
              <a href={settings.socials.linktree} target="_blank" rel="noopener noreferrer" className="p-1.5 bg-[#24495D] rounded hover:bg-[#C8B273] hover:text-[#163A4A] transition-colors text-slate-300">
                <span className="text-xs font-semibold">LT</span>
              </a>
            </div>
          </div>

          {/* Column 2: Contact Information */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-[#C8B273] tracking-wider uppercase font-sans">
              {currentLang === 'ar' ? 'قنوات الاتصال المباشر' : currentLang === 'tr' ? 'Doğrudan İletişim' : 'Contact Channels'}
            </h3>
            <ul className="space-y-2.5 text-xs text-slate-300">
              <li className="flex items-center space-x-2 rtl:space-x-reverse">
                <Mail className="h-4 w-4 text-[#C8B273] shrink-0" />
                <a href={`mailto:${settings.email}`} className="hover:text-white hover:underline">{settings.email}</a>
              </li>
              <li className="flex items-center space-x-2 rtl:space-x-reverse">
                <Phone className="h-4 w-4 text-[#C8B273] shrink-0" />
                <a href={`tel:${settings.phone}`} className="hover:text-white hover:underline">{settings.phone}</a>
              </li>
              <li className="flex items-center space-x-2 rtl:space-x-reverse">
                <Clock className="h-4 w-4 text-[#C8B273] shrink-0" />
                <span>{settings.officeHours[currentLang]}</span>
              </li>
            </ul>
          </div>

          {/* Column 3: Headquarters Address */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-[#C8B273] tracking-wider uppercase font-sans">
              {currentLang === 'ar' ? 'المقر والأمانة العامة' : currentLang === 'tr' ? 'Genel Merkez Adresi' : 'Headquarters Office'}
            </h3>
            <div className="flex items-start space-x-2 rtl:space-x-reverse text-xs text-slate-300 leading-relaxed">
              <MapPin className="h-4 w-4 text-[#C8B273] shrink-0 mt-0.5" />
              <span>{settings.address[currentLang]}</span>
            </div>
          </div>

          {/* Column 4: Partners & Quick Access */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-[#C8B273] tracking-wider uppercase font-sans">
              {currentLang === 'ar' ? 'شراكات وروابط مفيدة' : currentLang === 'tr' ? 'Yararlı Bağlantılar' : 'Partners & Links'}
            </h3>
            <ul className="space-y-2 text-xs text-slate-300">
              <li>
                <a href="https://iste.edu.tr" target="_blank" rel="noopener noreferrer" className="flex items-center space-x-1 hover:text-white hover:underline rtl:space-x-reverse">
                  <Award className="h-3.5 w-3.5 text-[#C8B273]" />
                  <span>İskenderun Teknik Üniversitesi</span>
                  <ExternalLink className="h-3 w-3 opacity-60" />
                </a>
              </li>
              <li>
                <a href="https://turkiyeburslari.gov.tr" target="_blank" rel="noopener noreferrer" className="flex items-center space-x-1 hover:text-white hover:underline rtl:space-x-reverse">
                  <Globe className="h-3.5 w-3.5 text-[#C8B273]" />
                  <span>Türkiye Bursları Portal</span>
                  <ExternalLink className="h-3 w-3 opacity-60" />
                </a>
              </li>
              <li>
                <a href={settings.socials.linktree} target="_blank" rel="noopener noreferrer" className="flex items-center space-x-1 hover:text-white hover:underline rtl:space-x-reverse">
                  <Globe className="h-3.5 w-3.5 text-[#C8B273]" />
                  <span>Official Linktree Portal</span>
                  <ExternalLink className="h-3 w-3 opacity-60" />
                </a>
              </li>
            </ul>
          </div>

        </div>

        {/* Footer Bottom Credentials and Translation compliance */}
        <div className="flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-400 font-mono gap-2">
          <p>
            © {currentYear} {settings.unionName[currentLang]}.{' '}
            {currentLang === 'ar' ? 'جميع الحقوق محفوظة للأمانة العامة.' : currentLang === 'tr' ? 'Tüm Hakları Genel Sekreterliğe Aittir.' : 'All Rights Reserved.'}
          </p>

          <div className="flex items-center gap-4">
            <p className="text-[#C8B273]/80">
              {currentLang === 'ar' ? 'اتحاد الطلاب المصريين (MÖB)' : currentLang === 'tr' ? 'Mısırlı Öğrenciler Birliği (MÖB)' : 'Egyptian Students\' Union (MÖB)'}
            </p>
            {onNavigateAdmin && (
              <button
                type="button"
                onClick={onNavigateAdmin}
                className="flex items-center gap-1 text-slate-500 hover:text-[#C8B273] transition-colors cursor-pointer text-[10px] bg-slate-800/60 px-2 py-0.5 rounded border border-slate-700/80"
                title="Yönetici Paneli Girişi: link/admin"
              >
                <Lock className="h-2.5 w-2.5" />
                <span>/admin</span>
              </button>
            )}
          </div>
        </div>

      </div>
    </footer>
  );
};
