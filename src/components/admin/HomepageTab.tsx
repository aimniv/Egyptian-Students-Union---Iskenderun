import React, { useState } from 'react';
import { WebsiteSettings, HomepageConfig, Language } from '../../types';
import { db } from '../../data/mockDb';
import { ImageUploadInput } from '../common/ImageUploadInput';
import { 
  Layout, 
  MessageSquareQuote, 
  BarChart3, 
  Save, 
  Sparkles, 
  Eye, 
  RotateCcw,
  CheckCircle2
} from 'lucide-react';

interface Props {
  currentLang: Language;
  settings: WebsiteSettings;
  onSettingsUpdate: (newSettings: WebsiteSettings) => void;
  addToast: (msg: string, type: 'success' | 'info' | 'warning') => void;
  addActivityLog: (action: string, details: string) => void;
}

export const HomepageTab: React.FC<Props> = ({
  currentLang,
  settings,
  onSettingsUpdate,
  addToast,
  addActivityLog,
}) => {
  // Ensure homepage structure exists
  const defaultHomepage = db.getSettings().homepage!;
  const [homepage, setHomepage] = useState<HomepageConfig>(settings.homepage || defaultHomepage);
  const [activeSection, setActiveSection] = useState<'president' | 'stats' | 'hero'>('president');

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const updatedSettings: WebsiteSettings = {
      ...settings,
      homepage
    };
    onSettingsUpdate(updatedSettings);
    db.saveSettings(updatedSettings);
    addActivityLog('تعديل محتوى الصفحة الرئيسية', 'تحديث كلمة رئيس الاتحاد، الإحصائيات، ونصوص البانر الرئيسي');
    addToast(currentLang === 'ar' ? 'تم حفظ وتحديث الصفحة الرئيسية بنجاح!' : 'Homepage updated and published successfully!', 'success');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b gap-3">
        <div>
          <h2 className="text-xl font-bold text-[#163A4A] flex items-center gap-2">
            <Layout className="h-5 w-5 text-[#C8B273]" />
            <span>{currentLang === 'ar' ? 'إدارة وتخصيص محتوى الصفحة الرئيسية بالكامل' : 'Homepage Master Content Editor'}</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            {currentLang === 'ar' ? 'تعديل كلمة رئيس الاتحاد وصورته، إحصائيات الأرقام، ونصوص البانر باللغات الثلاث' : 'Edit President speech, photo, union live statistics counters, and hero banner in 3 languages'}
          </p>
        </div>

        {/* Section Navigation Tabs */}
        <div className="flex bg-slate-100 p-1 rounded-xl text-xs font-semibold">
          <button
            type="button"
            onClick={() => setActiveSection('president')}
            className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 cursor-pointer transition-all ${
              activeSection === 'president' ? 'bg-white text-slate-900 shadow-xs font-bold' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <MessageSquareQuote className="h-3.5 w-3.5 text-[#C8B273]" />
            <span>كلمة رئيس الاتحاد</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveSection('stats')}
            className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 cursor-pointer transition-all ${
              activeSection === 'stats' ? 'bg-white text-slate-900 shadow-xs font-bold' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <BarChart3 className="h-3.5 w-3.5 text-[#C8B273]" />
            <span>الاتحاد في أرقام</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveSection('hero')}
            className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 cursor-pointer transition-all ${
              activeSection === 'hero' ? 'bg-white text-slate-900 shadow-xs font-bold' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Sparkles className="h-3.5 w-3.5 text-[#C8B273]" />
            <span>البانر والترحيب</span>
          </button>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-6 text-xs">
        
        {/* 1. PRESIDENT'S MESSAGE SECTION (كلمة رئيس الاتحاد) */}
        {activeSection === 'president' && (
          <div className="space-y-6">
            <div className="bg-white p-5 rounded-2xl border shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b">
                <h3 className="font-bold text-sm text-[#163A4A] flex items-center gap-2">
                  <MessageSquareQuote className="h-4 w-4 text-[#C8B273]" />
                  <span>تعديل قسم كلمة رئيس الاتحاد (President's Address)</span>
                </h3>
                <span className="text-[10px] bg-amber-50 text-amber-900 font-bold px-2 py-0.5 rounded border border-amber-200">
                  الصفحة الرئيسية • القسم العلوي
                </span>
              </div>

              {/* Photo Upload with ImageUploadInput */}
              <ImageUploadInput
                label="صورة رئيس الاتحاد (President Photo)"
                value={homepage.presidentMessage.photo}
                onChange={(val) => setHomepage({
                  ...homepage,
                  presidentMessage: { ...homepage.presidentMessage, photo: val }
                })}
                helperText="Cihazınızdan dosya yükleyin veya fotoğraf linki girin."
              />

              {/* Section Title in 3 Languages */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                <div>
                  <label className="block font-semibold mb-1">عنوان القسم (عربي) *</label>
                  <input
                    required
                    value={homepage.presidentMessage.sectionTitle.ar}
                    onChange={(e) => setHomepage({
                      ...homepage,
                      presidentMessage: {
                        ...homepage.presidentMessage,
                        sectionTitle: { ...homepage.presidentMessage.sectionTitle, ar: e.target.value }
                      }
                    })}
                    className="w-full p-2 border rounded-xl text-right font-sans"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Başlık (TR)</label>
                  <input
                    value={homepage.presidentMessage.sectionTitle.tr}
                    onChange={(e) => setHomepage({
                      ...homepage,
                      presidentMessage: {
                        ...homepage.presidentMessage,
                        sectionTitle: { ...homepage.presidentMessage.sectionTitle, tr: e.target.value }
                      }
                    })}
                    className="w-full p-2 border rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Title (EN)</label>
                  <input
                    value={homepage.presidentMessage.sectionTitle.en}
                    onChange={(e) => setHomepage({
                      ...homepage,
                      presidentMessage: {
                        ...homepage.presidentMessage,
                        sectionTitle: { ...homepage.presidentMessage.sectionTitle, en: e.target.value }
                      }
                    })}
                    className="w-full p-2 border rounded-xl font-sans"
                  />
                </div>
              </div>

              {/* President Name in 3 Languages */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold mb-1">اسم رئيس الاتحاد (عربي) *</label>
                  <input
                    required
                    value={homepage.presidentMessage.name.ar}
                    onChange={(e) => setHomepage({
                      ...homepage,
                      presidentMessage: {
                        ...homepage.presidentMessage,
                        name: { ...homepage.presidentMessage.name, ar: e.target.value }
                      }
                    })}
                    className="w-full p-2 border rounded-xl text-right font-sans"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Başkanın Adı (TR)</label>
                  <input
                    value={homepage.presidentMessage.name.tr}
                    onChange={(e) => setHomepage({
                      ...homepage,
                      presidentMessage: {
                        ...homepage.presidentMessage,
                        name: { ...homepage.presidentMessage.name, tr: e.target.value }
                      }
                    })}
                    className="w-full p-2 border rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">President Name (EN)</label>
                  <input
                    value={homepage.presidentMessage.name.en}
                    onChange={(e) => setHomepage({
                      ...homepage,
                      presidentMessage: {
                        ...homepage.presidentMessage,
                        name: { ...homepage.presidentMessage.name, en: e.target.value }
                      }
                    })}
                    className="w-full p-2 border rounded-xl font-sans"
                  />
                </div>
              </div>

              {/* President Title in 3 Languages */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold mb-1">المسمى والمنصب (عربي) *</label>
                  <input
                    required
                    value={homepage.presidentMessage.title.ar}
                    onChange={(e) => setHomepage({
                      ...homepage,
                      presidentMessage: {
                        ...homepage.presidentMessage,
                        title: { ...homepage.presidentMessage.title, ar: e.target.value }
                      }
                    })}
                    className="w-full p-2 border rounded-xl text-right font-sans"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Görev / Unvan (TR)</label>
                  <input
                    value={homepage.presidentMessage.title.tr}
                    onChange={(e) => setHomepage({
                      ...homepage,
                      presidentMessage: {
                        ...homepage.presidentMessage,
                        title: { ...homepage.presidentMessage.title, tr: e.target.value }
                      }
                    })}
                    className="w-full p-2 border rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Official Role (EN)</label>
                  <input
                    value={homepage.presidentMessage.title.en}
                    onChange={(e) => setHomepage({
                      ...homepage,
                      presidentMessage: {
                        ...homepage.presidentMessage,
                        title: { ...homepage.presidentMessage.title, en: e.target.value }
                      }
                    })}
                    className="w-full p-2 border rounded-xl font-sans"
                  />
                </div>
              </div>

              {/* Speech Text in 3 Languages */}
              <div className="space-y-3 pt-2">
                <div>
                  <label className="block font-semibold mb-1">نص الكلمة والرسالة (عربي) *</label>
                  <textarea
                    required
                    rows={4}
                    value={homepage.presidentMessage.messageText.ar}
                    onChange={(e) => setHomepage({
                      ...homepage,
                      presidentMessage: {
                        ...homepage.presidentMessage,
                        messageText: { ...homepage.presidentMessage.messageText, ar: e.target.value }
                      }
                    })}
                    className="w-full p-2.5 border rounded-xl text-right font-sans leading-relaxed"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold mb-1">Mesaj Metni (TR)</label>
                    <textarea
                      rows={3}
                      value={homepage.presidentMessage.messageText.tr}
                      onChange={(e) => setHomepage({
                        ...homepage,
                        presidentMessage: {
                          ...homepage.presidentMessage,
                          messageText: { ...homepage.presidentMessage.messageText, tr: e.target.value }
                        }
                      })}
                      className="w-full p-2 border rounded-xl"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold mb-1">Message Text (EN)</label>
                    <textarea
                      rows={3}
                      value={homepage.presidentMessage.messageText.en}
                      onChange={(e) => setHomepage({
                        ...homepage,
                        presidentMessage: {
                          ...homepage.presidentMessage,
                          messageText: { ...homepage.presidentMessage.messageText, en: e.target.value }
                        }
                      })}
                      className="w-full p-2 border rounded-xl font-sans"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Live Visual Preview of President Box */}
            <div className="bg-slate-50 p-5 rounded-2xl border space-y-2">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1 font-mono">
                <Eye className="h-3.5 w-3.5 text-[#C8B273]" /> Canlı Önizleme (Live Preview)
              </span>
              <div className="bg-white rounded-xl shadow-md border border-slate-100 overflow-hidden grid grid-cols-1 md:grid-cols-3">
                <div className="bg-[#163A4A] text-white p-6 flex flex-col justify-center items-center text-center">
                  <img
                    src={homepage.presidentMessage.photo}
                    alt={homepage.presidentMessage.name.ar}
                    className="h-24 w-24 rounded-full border-4 border-[#C8B273] object-cover shadow-md mb-2"
                  />
                  <h4 className="font-bold text-sm text-[#C8B273]">
                    {homepage.presidentMessage.name[currentLang] || homepage.presidentMessage.name.ar}
                  </h4>
                  <p className="text-[11px] text-slate-300">
                    {homepage.presidentMessage.title[currentLang] || homepage.presidentMessage.title.ar}
                  </p>
                </div>
                <div className="md:col-span-2 p-6 flex flex-col justify-center space-y-2">
                  <h3 className="text-base font-bold text-[#163A4A] flex items-center gap-1.5">
                    <span className="text-[#C8B273]">■</span>
                    <span>{homepage.presidentMessage.sectionTitle[currentLang] || homepage.presidentMessage.sectionTitle.ar}</span>
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed italic">
                    "{homepage.presidentMessage.messageText[currentLang] || homepage.presidentMessage.messageText.ar}"
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 2. STATS SECTION (الاتحاد في أرقام) */}
        {activeSection === 'stats' && (
          <div className="space-y-6">
            <div className="bg-white p-5 rounded-2xl border shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b">
                <h3 className="font-bold text-sm text-[#163A4A] flex items-center gap-2">
                  <BarChart3 className="h-4 w-4 text-[#C8B273]" />
                  <span>تعديل قسم الاتحاد في أرقام (Union in Numbers Statistics)</span>
                </h3>
                <span className="text-[10px] bg-blue-50 text-blue-900 font-bold px-2 py-0.5 rounded border border-blue-200">
                  عدادات رقمية تفاعلية
                </span>
              </div>

              {/* Section Title */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold mb-1">عنوان القسم (عربي) *</label>
                  <input
                    required
                    value={homepage.stats.sectionTitle.ar}
                    onChange={(e) => setHomepage({
                      ...homepage,
                      stats: { ...homepage.stats, sectionTitle: { ...homepage.stats.sectionTitle, ar: e.target.value } }
                    })}
                    className="w-full p-2 border rounded-xl text-right font-sans"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Başlık (TR)</label>
                  <input
                    value={homepage.stats.sectionTitle.tr}
                    onChange={(e) => setHomepage({
                      ...homepage,
                      stats: { ...homepage.stats, sectionTitle: { ...homepage.stats.sectionTitle, tr: e.target.value } }
                    })}
                    className="w-full p-2 border rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Title (EN)</label>
                  <input
                    value={homepage.stats.sectionTitle.en}
                    onChange={(e) => setHomepage({
                      ...homepage,
                      stats: { ...homepage.stats, sectionTitle: { ...homepage.stats.sectionTitle, en: e.target.value } }
                    })}
                    className="w-full p-2 border rounded-xl font-sans"
                  />
                </div>
              </div>

              {/* 4 Stats Cards Editors */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                {/* Stat 1 */}
                <div className="p-3.5 bg-slate-50 rounded-xl border space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-800">المؤشر الأول (Stat 1)</span>
                    <input
                      value={homepage.stats.stat1.number}
                      onChange={(e) => setHomepage({
                        ...homepage,
                        stats: {
                          ...homepage.stats,
                          stat1: { ...homepage.stats.stat1, number: e.target.value }
                        }
                      })}
                      placeholder="e.g. 450+"
                      className="w-24 p-1.5 border rounded-lg bg-white font-mono font-bold text-center text-[#163A4A]"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-slate-500 mb-0.5">الوصف بالعربي *</label>
                    <input
                      value={homepage.stats.stat1.label.ar}
                      onChange={(e) => setHomepage({
                        ...homepage,
                        stats: {
                          ...homepage.stats,
                          stat1: {
                            ...homepage.stats.stat1,
                            label: { ...homepage.stats.stat1.label, ar: e.target.value }
                          }
                        }
                      })}
                      className="w-full p-1.5 border rounded-lg bg-white text-right"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      placeholder="TR Label"
                      value={homepage.stats.stat1.label.tr}
                      onChange={(e) => setHomepage({
                        ...homepage,
                        stats: {
                          ...homepage.stats,
                          stat1: {
                            ...homepage.stats.stat1,
                            label: { ...homepage.stats.stat1.label, tr: e.target.value }
                          }
                        }
                      })}
                      className="w-full p-1.5 border rounded-lg bg-white text-[11px]"
                    />
                    <input
                      placeholder="EN Label"
                      value={homepage.stats.stat1.label.en}
                      onChange={(e) => setHomepage({
                        ...homepage,
                        stats: {
                          ...homepage.stats,
                          stat1: {
                            ...homepage.stats.stat1,
                            label: { ...homepage.stats.stat1.label, en: e.target.value }
                          }
                        }
                      })}
                      className="w-full p-1.5 border rounded-lg bg-white text-[11px]"
                    />
                  </div>
                </div>

                {/* Stat 2 */}
                <div className="p-3.5 bg-slate-50 rounded-xl border space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-800">المؤشر الثاني (Stat 2)</span>
                    <input
                      value={homepage.stats.stat2.number}
                      onChange={(e) => setHomepage({
                        ...homepage,
                        stats: {
                          ...homepage.stats,
                          stat2: { ...homepage.stats.stat2, number: e.target.value }
                        }
                      })}
                      placeholder="e.g. 24+"
                      className="w-24 p-1.5 border rounded-lg bg-white font-mono font-bold text-center text-[#163A4A]"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-slate-500 mb-0.5">الوصف بالعربي *</label>
                    <input
                      value={homepage.stats.stat2.label.ar}
                      onChange={(e) => setHomepage({
                        ...homepage,
                        stats: {
                          ...homepage.stats,
                          stat2: {
                            ...homepage.stats.stat2,
                            label: { ...homepage.stats.stat2.label, ar: e.target.value }
                          }
                        }
                      })}
                      className="w-full p-1.5 border rounded-lg bg-white text-right"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      placeholder="TR Label"
                      value={homepage.stats.stat2.label.tr}
                      onChange={(e) => setHomepage({
                        ...homepage,
                        stats: {
                          ...homepage.stats,
                          stat2: {
                            ...homepage.stats.stat2,
                            label: { ...homepage.stats.stat2.label, tr: e.target.value }
                          }
                        }
                      })}
                      className="w-full p-1.5 border rounded-lg bg-white text-[11px]"
                    />
                    <input
                      placeholder="EN Label"
                      value={homepage.stats.stat2.label.en}
                      onChange={(e) => setHomepage({
                        ...homepage,
                        stats: {
                          ...homepage.stats,
                          stat2: {
                            ...homepage.stats.stat2,
                            label: { ...homepage.stats.stat2.label, en: e.target.value }
                          }
                        }
                      })}
                      className="w-full p-1.5 border rounded-lg bg-white text-[11px]"
                    />
                  </div>
                </div>

                {/* Stat 3 */}
                <div className="p-3.5 bg-slate-50 rounded-xl border space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-800">المؤشر الثالث (Stat 3)</span>
                    <input
                      value={homepage.stats.stat3.number}
                      onChange={(e) => setHomepage({
                        ...homepage,
                        stats: {
                          ...homepage.stats,
                          stat3: { ...homepage.stats.stat3, number: e.target.value }
                        }
                      })}
                      placeholder="e.g. 6+"
                      className="w-24 p-1.5 border rounded-lg bg-white font-mono font-bold text-center text-[#163A4A]"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-slate-500 mb-0.5">الوصف بالعربي *</label>
                    <input
                      value={homepage.stats.stat3.label.ar}
                      onChange={(e) => setHomepage({
                        ...homepage,
                        stats: {
                          ...homepage.stats,
                          stat3: {
                            ...homepage.stats.stat3,
                            label: { ...homepage.stats.stat3.label, ar: e.target.value }
                          }
                        }
                      })}
                      className="w-full p-1.5 border rounded-lg bg-white text-right"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      placeholder="TR Label"
                      value={homepage.stats.stat3.label.tr}
                      onChange={(e) => setHomepage({
                        ...homepage,
                        stats: {
                          ...homepage.stats,
                          stat3: {
                            ...homepage.stats.stat3,
                            label: { ...homepage.stats.stat3.label, tr: e.target.value }
                          }
                        }
                      })}
                      className="w-full p-1.5 border rounded-lg bg-white text-[11px]"
                    />
                    <input
                      placeholder="EN Label"
                      value={homepage.stats.stat3.label.en}
                      onChange={(e) => setHomepage({
                        ...homepage,
                        stats: {
                          ...homepage.stats,
                          stat3: {
                            ...homepage.stats.stat3,
                            label: { ...homepage.stats.stat3.label, en: e.target.value }
                          }
                        }
                      })}
                      className="w-full p-1.5 border rounded-lg bg-white text-[11px]"
                    />
                  </div>
                </div>

                {/* Stat 4 */}
                <div className="p-3.5 bg-slate-50 rounded-xl border space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-800">المؤشر الرابع (Stat 4)</span>
                    <input
                      value={homepage.stats.stat4.number}
                      onChange={(e) => setHomepage({
                        ...homepage,
                        stats: {
                          ...homepage.stats,
                          stat4: { ...homepage.stats.stat4, number: e.target.value }
                        }
                      })}
                      placeholder="e.g. 5+"
                      className="w-24 p-1.5 border rounded-lg bg-white font-mono font-bold text-center text-[#163A4A]"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-slate-500 mb-0.5">الوصف بالعربي *</label>
                    <input
                      value={homepage.stats.stat4.label.ar}
                      onChange={(e) => setHomepage({
                        ...homepage,
                        stats: {
                          ...homepage.stats,
                          stat4: {
                            ...homepage.stats.stat4,
                            label: { ...homepage.stats.stat4.label, ar: e.target.value }
                          }
                        }
                      })}
                      className="w-full p-1.5 border rounded-lg bg-white text-right"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      placeholder="TR Label"
                      value={homepage.stats.stat4.label.tr}
                      onChange={(e) => setHomepage({
                        ...homepage,
                        stats: {
                          ...homepage.stats,
                          stat4: {
                            ...homepage.stats.stat4,
                            label: { ...homepage.stats.stat4.label, tr: e.target.value }
                          }
                        }
                      })}
                      className="w-full p-1.5 border rounded-lg bg-white text-[11px]"
                    />
                    <input
                      placeholder="EN Label"
                      value={homepage.stats.stat4.label.en}
                      onChange={(e) => setHomepage({
                        ...homepage,
                        stats: {
                          ...homepage.stats,
                          stat4: {
                            ...homepage.stats.stat4,
                            label: { ...homepage.stats.stat4.label, en: e.target.value }
                          }
                        }
                      })}
                      className="w-full p-1.5 border rounded-lg bg-white text-[11px]"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Live Visual Preview of Stats Section */}
            <div className="bg-[#163A4A] text-white p-6 rounded-2xl border border-[#C8B273]/30 space-y-4">
              <span className="text-[11px] font-bold text-[#C8B273] uppercase tracking-wider flex items-center gap-1 font-mono">
                <Eye className="h-3.5 w-3.5" /> Canlı Önizleme (Live Stats Preview)
              </span>
              <h3 className="text-center text-lg font-bold text-[#C8B273]">
                {homepage.stats.sectionTitle[currentLang] || homepage.stats.sectionTitle.ar}
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                <div className="p-3 bg-[#24495D] rounded-xl border border-[#C8B273]/20">
                  <p className="text-2xl font-extrabold text-[#C8B273] font-mono">{homepage.stats.stat1.number}</p>
                  <p className="text-xs text-slate-300 mt-1">{homepage.stats.stat1.label[currentLang] || homepage.stats.stat1.label.ar}</p>
                </div>
                <div className="p-3 bg-[#24495D] rounded-xl border border-[#C8B273]/20">
                  <p className="text-2xl font-extrabold text-[#C8B273] font-mono">{homepage.stats.stat2.number}</p>
                  <p className="text-xs text-slate-300 mt-1">{homepage.stats.stat2.label[currentLang] || homepage.stats.stat2.label.ar}</p>
                </div>
                <div className="p-3 bg-[#24495D] rounded-xl border border-[#C8B273]/20">
                  <p className="text-2xl font-extrabold text-[#C8B273] font-mono">{homepage.stats.stat3.number}</p>
                  <p className="text-xs text-slate-300 mt-1">{homepage.stats.stat3.label[currentLang] || homepage.stats.stat3.label.ar}</p>
                </div>
                <div className="p-3 bg-[#24495D] rounded-xl border border-[#C8B273]/20">
                  <p className="text-2xl font-extrabold text-[#C8B273] font-mono">{homepage.stats.stat4.number}</p>
                  <p className="text-xs text-slate-300 mt-1">{homepage.stats.stat4.label[currentLang] || homepage.stats.stat4.label.ar}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 3. HERO BANNER SECTION */}
        {activeSection === 'hero' && (
          <div className="bg-white p-5 rounded-2xl border shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b">
              <h3 className="font-bold text-sm text-[#163A4A] flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-[#C8B273]" />
                <span>تعديل البانر الرئيسي وأزرار الترحيب (Hero Section)</span>
              </h3>
            </div>

            {/* Badge */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block font-semibold mb-1">شارة البانر (عربي)</label>
                <input
                  value={homepage.hero.badge.ar}
                  onChange={(e) => setHomepage({
                    ...homepage,
                    hero: { ...homepage.hero, badge: { ...homepage.hero.badge, ar: e.target.value } }
                  })}
                  className="w-full p-2 border rounded-xl text-right font-sans"
                />
              </div>
              <div>
                <label className="block font-semibold mb-1">Badge (TR)</label>
                <input
                  value={homepage.hero.badge.tr}
                  onChange={(e) => setHomepage({
                    ...homepage,
                    hero: { ...homepage.hero, badge: { ...homepage.hero.badge, tr: e.target.value } }
                  })}
                  className="w-full p-2 border rounded-xl"
                />
              </div>
              <div>
                <label className="block font-semibold mb-1">Badge (EN)</label>
                <input
                  value={homepage.hero.badge.en}
                  onChange={(e) => setHomepage({
                    ...homepage,
                    hero: { ...homepage.hero, badge: { ...homepage.hero.badge, en: e.target.value } }
                  })}
                  className="w-full p-2 border rounded-xl font-sans"
                />
              </div>
            </div>

            {/* Welcome Title */}
            <div className="space-y-3">
              <div>
                <label className="block font-semibold mb-1">عنوان الترحيب الرئيسي (عربي) *</label>
                <input
                  required
                  value={homepage.hero.title.ar}
                  onChange={(e) => setHomepage({
                    ...homepage,
                    hero: { ...homepage.hero, title: { ...homepage.hero.title, ar: e.target.value } }
                  })}
                  className="w-full p-2.5 border rounded-xl text-right font-bold text-slate-900 font-sans"
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1">Hoş Geldiniz Başlığı (TR)</label>
                  <input
                    value={homepage.hero.title.tr}
                    onChange={(e) => setHomepage({
                      ...homepage,
                      hero: { ...homepage.hero, title: { ...homepage.hero.title, tr: e.target.value } }
                    })}
                    className="w-full p-2 border rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Welcome Title (EN)</label>
                  <input
                    value={homepage.hero.title.en}
                    onChange={(e) => setHomepage({
                      ...homepage,
                      hero: { ...homepage.hero, title: { ...homepage.hero.title, en: e.target.value } }
                    })}
                    className="w-full p-2 border rounded-xl font-sans"
                  />
                </div>
              </div>
            </div>

            {/* Subtitle */}
            <div className="space-y-3">
              <div>
                <label className="block font-semibold mb-1">النص التعريفي الترحيبي (عربي) *</label>
                <textarea
                  required
                  rows={3}
                  value={homepage.hero.subtitle.ar}
                  onChange={(e) => setHomepage({
                    ...homepage,
                    hero: { ...homepage.hero, subtitle: { ...homepage.hero.subtitle, ar: e.target.value } }
                  })}
                  className="w-full p-2.5 border rounded-xl text-right font-sans"
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1">Alt Açıklama (TR)</label>
                  <textarea
                    rows={2}
                    value={homepage.hero.subtitle.tr}
                    onChange={(e) => setHomepage({
                      ...homepage,
                      hero: { ...homepage.hero, subtitle: { ...homepage.hero.subtitle, tr: e.target.value } }
                    })}
                    className="w-full p-2 border rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Hero Subtitle (EN)</label>
                  <textarea
                    rows={2}
                    value={homepage.hero.subtitle.en}
                    onChange={(e) => setHomepage({
                      ...homepage,
                      hero: { ...homepage.hero, subtitle: { ...homepage.hero.subtitle, en: e.target.value } }
                    })}
                    className="w-full p-2 border rounded-xl font-sans"
                  />
                </div>
              </div>
            </div>

            {/* Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="p-3 bg-slate-50 rounded-xl border space-y-1.5">
                <label className="block font-bold text-slate-800">نص الزر الأول (طلب العضوية)</label>
                <input
                  value={homepage.hero.primaryBtnText.ar}
                  onChange={(e) => setHomepage({
                    ...homepage,
                    hero: { ...homepage.hero, primaryBtnText: { ...homepage.hero.primaryBtnText, ar: e.target.value } }
                  })}
                  className="w-full p-2 border rounded-lg bg-white text-right"
                />
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border space-y-1.5">
                <label className="block font-bold text-slate-800">نص الزر الثاني (دليل الطالب)</label>
                <input
                  value={homepage.hero.secondaryBtnText.ar}
                  onChange={(e) => setHomepage({
                    ...homepage,
                    hero: { ...homepage.hero, secondaryBtnText: { ...homepage.hero.secondaryBtnText, ar: e.target.value } }
                  })}
                  className="w-full p-2 border rounded-lg bg-white text-right"
                />
              </div>
            </div>
          </div>
        )}

        {/* Global Action Bar */}
        <div className="flex items-center justify-between pt-4 border-t">
          <button
            type="button"
            onClick={() => {
              if (confirm('Anasayfa içeriklerini başlangıç ayarlarına döndürmek istiyor musunuz?')) {
                setHomepage(defaultHomepage);
                addToast('Varsayılan anasayfa şablonu yüklendi', 'info');
              }
            }}
            className="px-4 py-2 border rounded-xl text-slate-600 hover:bg-slate-50 flex items-center gap-1.5 cursor-pointer font-semibold"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>Varsayılana Sıfırla</span>
          </button>

          <button
            type="submit"
            className="px-6 py-2.5 bg-[#163A4A] text-[#C8B273] font-bold rounded-xl hover:bg-[#24495D] flex items-center gap-2 cursor-pointer shadow-sm text-sm"
          >
            <Save className="h-4 w-4" />
            <span>{currentLang === 'ar' ? 'حفظ ونشر تعديلات الصفحة الرئيسية' : 'Save & Publish Homepage'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
