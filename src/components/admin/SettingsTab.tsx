import React, { useState } from 'react';
import { WebsiteSettings, Language } from '../../types';
import { db } from '../../data/mockDb';
import { Save, Globe, Phone, Mail, MapPin, Share2 } from 'lucide-react';

interface Props {
  currentLang: Language;
  settings: WebsiteSettings;
  onSettingsUpdate: (newSettings: WebsiteSettings) => void;
  addToast: (msg: string, type: 'success' | 'info' | 'warning') => void;
  addActivityLog: (action: string, details: string) => void;
}

export const SettingsTab: React.FC<Props> = ({
  currentLang,
  settings,
  onSettingsUpdate,
  addToast,
  addActivityLog,
}) => {
  const [formData, setFormData] = useState<WebsiteSettings>({ ...settings });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSettingsUpdate(formData);
    db.saveSettings(formData);
    addActivityLog('تحديث إعدادات الموقع الكلية', 'تعديل بيانات وهوية الاتحاد وبيانات الاتصال والخرائط');
    addToast(currentLang === 'ar' ? 'تم حفظ وتحديث إعدادات الموقع بنجاح' : 'Settings saved and published', 'success');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b gap-3">
        <div>
          <h2 className="text-xl font-bold text-[#163A4A]">
            {currentLang === 'ar' ? 'إعدادات المنصة وهوية الاتحاد والاتصال' : 'Platform Identity & Contact Setup'}
          </h2>
          <p className="text-xs text-slate-500">
            {currentLang === 'ar' ? 'التحكم بكافة بيانات الاتحاد، الهواتف، العناوين، الخرائط، وحسابات التواصل الاجتماعي' : 'Manage union branding, official email, phone, location coordinates, and social handles'}
          </p>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-6 text-xs">
        {/* Union Names */}
        <div className="bg-white p-5 rounded-xl border shadow-xs space-y-4">
          <h3 className="font-bold text-sm text-[#163A4A] flex items-center gap-2">
            <Globe className="h-4 w-4 text-[#C8B273]" />
            <span>اسم الاتحاد باللغات الثلاث</span>
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block font-semibold mb-1">الاسم بالعربي *</label>
              <input
                required
                value={formData.unionName.ar}
                onChange={e => setFormData({ ...formData, unionName: { ...formData.unionName, ar: e.target.value } })}
                className="w-full p-2 border rounded text-right font-sans"
              />
            </div>
            <div>
              <label className="block font-semibold mb-1">Türkçe İsim</label>
              <input
                value={formData.unionName.tr}
                onChange={e => setFormData({ ...formData, unionName: { ...formData.unionName, tr: e.target.value } })}
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <label className="block font-semibold mb-1">English Name</label>
              <input
                value={formData.unionName.en}
                onChange={e => setFormData({ ...formData, unionName: { ...formData.unionName, en: e.target.value } })}
                className="w-full p-2 border rounded font-sans"
              />
            </div>
          </div>
        </div>

        {/* Contact Coordinates */}
        <div className="bg-white p-5 rounded-xl border shadow-xs space-y-4">
          <h3 className="font-bold text-sm text-[#163A4A] flex items-center gap-2">
            <Phone className="h-4 w-4 text-[#C8B273]" />
            <span>بيانات الاتصال والتواصل المباشر</span>
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block font-semibold mb-1">البريد الإلكتروني الرسمي *</label>
              <input
                required
                type="email"
                value={formData.email}
                onChange={e => setFormData({ ...formData, email: e.target.value })}
                className="w-full p-2 border rounded font-mono"
              />
            </div>
            <div>
              <label className="block font-semibold mb-1">الهاتف الرسمي</label>
              <input
                value={formData.phone}
                onChange={e => setFormData({ ...formData, phone: e.target.value })}
                className="w-full p-2 border rounded font-mono"
              />
            </div>
            <div>
              <label className="block font-semibold mb-1">رقم الواتساب للمساعدة (بدون +)</label>
              <input
                value={formData.whatsapp}
                onChange={e => setFormData({ ...formData, whatsapp: e.target.value })}
                className="w-full p-2 border rounded font-mono"
              />
            </div>
          </div>
        </div>

        {/* Address and Working hours */}
        <div className="bg-white p-5 rounded-xl border shadow-xs space-y-4">
          <h3 className="font-bold text-sm text-[#163A4A] flex items-center gap-2">
            <MapPin className="h-4 w-4 text-[#C8B273]" />
            <span>العنوان الفعلي وساعات العمل ورابط الخريطة</span>
          </h3>
          <div className="space-y-3">
            <div>
              <label className="block font-semibold mb-1">عنوان المقر بالعربي</label>
              <input
                value={formData.address.ar}
                onChange={e => setFormData({ ...formData, address: { ...formData.address, ar: e.target.value } })}
                className="w-full p-2 border rounded text-right font-sans"
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold mb-1">ساعات الدوام (عربي)</label>
                <input
                  value={formData.officeHours.ar}
                  onChange={e => setFormData({ ...formData, officeHours: { ...formData.officeHours, ar: e.target.value } })}
                  className="w-full p-2 border rounded text-right"
                />
              </div>
              <div>
                <label className="block font-semibold mb-1">Working Hours (EN)</label>
                <input
                  value={formData.officeHours.en}
                  onChange={e => setFormData({ ...formData, officeHours: { ...formData.officeHours, en: e.target.value } })}
                  className="w-full p-2 border rounded"
                />
              </div>
            </div>
            <div>
              <label className="block font-semibold mb-1">Google Maps Embed URL</label>
              <input
                value={formData.googleMapUrl}
                onChange={e => setFormData({ ...formData, googleMapUrl: e.target.value })}
                className="w-full p-2 border rounded font-mono text-[11px]"
              />
            </div>
          </div>
        </div>

        {/* Social Links */}
        <div className="bg-white p-5 rounded-xl border shadow-xs space-y-4">
          <h3 className="font-bold text-sm text-[#163A4A] flex items-center gap-2">
            <Share2 className="h-4 w-4 text-[#C8B273]" />
            <span>حسابات التواصل الاجتماعي الرسمية</span>
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block font-semibold mb-1">Facebook</label>
              <input
                value={formData.socials.facebook}
                onChange={e => setFormData({ ...formData, socials: { ...formData.socials, facebook: e.target.value } })}
                className="w-full p-2 border rounded font-mono"
              />
            </div>
            <div>
              <label className="block font-semibold mb-1">Instagram</label>
              <input
                value={formData.socials.instagram}
                onChange={e => setFormData({ ...formData, socials: { ...formData.socials, instagram: e.target.value } })}
                className="w-full p-2 border rounded font-mono"
              />
            </div>
            <div>
              <label className="block font-semibold mb-1">Twitter / X</label>
              <input
                value={formData.socials.twitter}
                onChange={e => setFormData({ ...formData, socials: { ...formData.socials, twitter: e.target.value } })}
                className="w-full p-2 border rounded font-mono"
              />
            </div>
            <div>
              <label className="block font-semibold mb-1">YouTube</label>
              <input
                value={formData.socials.youtube}
                onChange={e => setFormData({ ...formData, socials: { ...formData.socials, youtube: e.target.value } })}
                className="w-full p-2 border rounded font-mono"
              />
            </div>
            <div>
              <label className="block font-semibold mb-1">Telegram</label>
              <input
                value={formData.socials.telegram}
                onChange={e => setFormData({ ...formData, socials: { ...formData.socials, telegram: e.target.value } })}
                className="w-full p-2 border rounded font-mono"
              />
            </div>
            <div>
              <label className="block font-semibold mb-1">Linktree / All Links</label>
              <input
                value={formData.socials.linktree}
                onChange={e => setFormData({ ...formData, socials: { ...formData.socials, linktree: e.target.value } })}
                className="w-full p-2 border rounded font-mono"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            className="px-6 py-2.5 bg-[#163A4A] text-[#C8B273] font-bold rounded-xl hover:bg-[#24495D] flex items-center gap-2 cursor-pointer shadow-sm text-sm"
          >
            <Save className="h-4 w-4" />
            <span>حفظ ونشر التعديلات فورياً</span>
          </button>
        </div>
      </form>
    </div>
  );
};
