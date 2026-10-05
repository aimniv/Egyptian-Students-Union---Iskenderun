import React, { useState, useEffect, useRef } from 'react';
import { 
  Language, 
  WebsiteSettings,
  ActivityLog,
} from '../types';
import { db } from '../data/mockDb';
import { LogoCrest } from './Header';
import { 
  BarChart, Users, Calendar, Megaphone, Inbox, AlertTriangle, Languages, 
  ShieldCheck, Settings, Award, BookOpen, Activity as ActivityIcon, 
  Image as ImageIcon, HeartHandshake, LogOut, CheckCircle2, TrendingUp, Layout,
  ExternalLink, Globe, ArrowLeft, ArrowRight
} from 'lucide-react';

import { HomepageTab } from './admin/HomepageTab';
import { BoardTab } from './admin/BoardTab';
import { GuidesTab } from './admin/GuidesTab';
import { ActivitiesTab } from './admin/ActivitiesTab';
import { MediaTab } from './admin/MediaTab';
import { VolunteersTab } from './admin/VolunteersTab';
import { SponsorsTab } from './admin/SponsorsTab';
import { EventsTab } from './admin/EventsTab';
import { AnnouncementsTab } from './admin/AnnouncementsTab';
import { MembershipsTab } from './admin/MembershipsTab';
import { InboxTab } from './admin/InboxTab';
import { ComplaintsTab } from './admin/ComplaintsTab';
import { TranslationsTab } from './admin/TranslationsTab';
import { SettingsTab } from './admin/SettingsTab';
import { SecurityTab } from './admin/SecurityTab';

interface AdminPanelProps {
  currentLang: Language;
  translations: Record<string, { ar: string; tr: string; en: string }>;
  onTranslationUpdate: (newTrans: Record<string, { ar: string; tr: string; en: string }>) => void;
  settings: WebsiteSettings;
  onSettingsUpdate: (newSettings: WebsiteSettings) => void;
  addToast: (message: string, type: 'success' | 'info' | 'warning') => void;
  onNavigateToSite?: () => void;
  onLogout?: () => void;
  adminEmail?: string;
  onDataRefreshed?: () => void;
}

type AdminTab = 
  | 'dashboard' 
  | 'homepage'
  | 'memberships' 
  | 'events' 
  | 'announcements' 
  | 'board' 
  | 'guides' 
  | 'activities' 
  | 'media' 
  | 'volunteers' 
  | 'sponsors' 
  | 'inbox' 
  | 'complaints' 
  | 'translations' 
  | 'settings' 
  | 'security';

export const AdminPanel: React.FC<AdminPanelProps> = ({
  currentLang,
  translations,
  onTranslationUpdate,
  settings,
  onSettingsUpdate,
  addToast,
  onNavigateToSite,
  onLogout,
  adminEmail,
  onDataRefreshed,
}) => {
  const [activeTab, setActiveTab] = useState<AdminTab>('dashboard');
  
  // Real-time badge counts
  const [pendingMemberships, setPendingMemberships] = useState(0);
  const [newMessages, setNewMessages] = useState(0);
  const [activeComplaints, setActiveComplaints] = useState(0);
  const [pendingVolunteers, setPendingVolunteers] = useState(0);

  const refreshBadges = () => {
    setPendingMemberships(db.getMemberships().filter(m => m.status === 'pending').length);
    setNewMessages(db.getContactMessages().filter(m => m.status === 'new').length);
    setActiveComplaints(db.getComplaints().filter(c => c.status === 'new' || c.status === 'under_review').length);
    setPendingVolunteers(db.getVolunteers().filter(v => v.status === 'pending').length);
  };

  // Bumped when the server has newer data, so the open tab re-reads it
  const [dataVersion, setDataVersion] = useState(0);
  const firstTab = useRef(true);

  useEffect(() => {
    refreshBadges();
    if (firstTab.current) {
      firstTab.current = false;
      return;
    }
    let alive = true;
    db.refreshAdminData().then((changed) => {
      if (!alive || !changed) return;
      refreshBadges();
      onDataRefreshed?.();
      setDataVersion((v) => v + 1);
    });
    return () => {
      alive = false;
    };
  }, [activeTab]);

  const addActivityLog = (action: string, details: string) => {
    const newLog: ActivityLog = {
      id: 'ACTL-' + Date.now(),
      adminUser: adminEmail || 'admin',
      action,
      details,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      ip: '192.168.1.54'
    };
    const currentLogs = db.getActivityLogs();
    currentLogs.unshift(newLog);
    db.saveActivityLogs(currentLogs);
    refreshBadges();
  };

  const menuItems = [
    { id: 'dashboard', label: currentLang === 'ar' ? 'لوحة القيادة والتحليلات' : 'Executive Overview', icon: BarChart },
    { id: 'homepage', label: currentLang === 'ar' ? 'إدارة وتخصيص الصفحة الرئيسية' : 'Homepage Content & Stats', icon: Layout },
    { id: 'memberships', label: currentLang === 'ar' ? 'طلبات العضوية والبطاقات' : 'Memberships CRM', icon: Users, badge: pendingMemberships },
    { id: 'events', label: currentLang === 'ar' ? 'الفعاليات والمؤتمرات' : 'Events & Check-ins', icon: Calendar },
    { id: 'announcements', label: currentLang === 'ar' ? 'الإعلانات والمنح الدراسية' : 'News & Circulars', icon: Megaphone },
    { id: 'board', label: currentLang === 'ar' ? 'الهيئة الإدارية والقيادة' : 'Board & Leadership', icon: Award },
    { id: 'guides', label: currentLang === 'ar' ? 'دليل الطالب الشامل' : 'Student Guides & FAQs', icon: BookOpen },
    { id: 'activities', label: currentLang === 'ar' ? 'الأنشطة والمشاريع' : 'Activities & Drives', icon: ActivityIcon },
    { id: 'media', label: currentLang === 'ar' ? 'المركز الإعلامي والأرشيف' : 'Media & Press Desk', icon: ImageIcon },
    { id: 'volunteers', label: currentLang === 'ar' ? 'إدارة المتطوعين واللجان' : 'Volunteers Roster', icon: HeartHandshake, badge: pendingVolunteers },
    { id: 'sponsors', label: currentLang === 'ar' ? 'الرعاة والشركاء' : 'Sponsors & Partners', icon: Award },
    { id: 'inbox', label: currentLang === 'ar' ? 'صندوق رسائل الطلاب' : 'CRM Student Inbox', icon: Inbox, badge: newMessages },
    { id: 'complaints', label: currentLang === 'ar' ? 'تذاكر الشكاوى والحلول' : 'Grievance Tickets', icon: AlertTriangle, badge: activeComplaints },
    { id: 'translations', label: currentLang === 'ar' ? 'محرر الترجمات الكلي' : 'Localization Editor', icon: Languages },
    { id: 'settings', label: currentLang === 'ar' ? 'إعدادات وهوية المنصة' : 'Platform Settings', icon: Settings },
    { id: 'security', label: currentLang === 'ar' ? 'الأمان والنسخ الاحتياطي' : 'Security & Backups', icon: ShieldCheck },
  ];

  return (
    <div className="min-h-screen bg-slate-100/70 pb-16">
      {/* Dedicated Executive Top Header for Admin Panel */}
      <header className="sticky top-0 z-40 bg-[#163A4A] text-white shadow-lg border-b border-[#C8B273]/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          
          {/* Logo & Route badge */}
          <div className="flex items-center gap-3">
            <LogoCrest className="h-10 w-10" />
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm sm:text-base text-white tracking-wide">
                  {currentLang === 'ar' ? 'لوحة تحكم الاتحاد' : currentLang === 'tr' ? 'MÖB Yönetim Paneli' : 'MÖB Admin Console'}
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-[#C8B273]/20 text-[#C8B273] border border-[#C8B273]/30">
                  /admin
                </span>
              </div>
              <p className="text-[10px] text-slate-300 hidden sm:block">
                {currentLang === 'ar' ? 'نظام الإدارة المركزي المتكامل' : 'Merkezi Yönetim ve İçerik Kontrol Sistemi'}
              </p>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* View live public site */}
            {onNavigateToSite && (
              <button
                type="button"
                onClick={onNavigateToSite}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-xs text-slate-100 border border-white/15 transition-all cursor-pointer"
                title="Ana siteye dön"
              >
                <ExternalLink className="h-3.5 w-3.5 text-[#C8B273]" />
                <span className="hidden sm:inline">
                  {currentLang === 'ar' ? 'معاينة الموقع' : currentLang === 'tr' ? 'Siteyi Görüntüle' : 'View Live Site'}
                </span>
              </button>
            )}

            {/* Logout button */}
            {onLogout && (
              <button
                type="button"
                onClick={onLogout}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-600/80 hover:bg-red-600 text-xs text-white font-semibold transition-all cursor-pointer shadow-xs"
                title="Çıkış Yap"
              >
                <LogOut className="h-3.5 w-3.5" />
                <span>
                  {currentLang === 'ar' ? 'تسجيل الخروج' : currentLang === 'tr' ? 'Çıkış Yap' : 'Logout'}
                </span>
              </button>
            )}
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header bar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-6 border-b border-slate-200 mb-8 gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black text-[#163A4A] tracking-tight">
                {currentLang === 'ar' ? 'نظام التحكم الإداري الشامل للموقع (MÖB Admin Master Suite)' : 'MÖB Complete Administration & Governance Suite'}
              </h1>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              {currentLang === 'ar' ? 'تحكم كامل بنسبة 100% في كافة صفحات ومحتويات وتفاصيل المنظومة' : 'Total control panel managing every component, registry, and page detail of the union portal'}
            </p>
          </div>
          <div className="flex items-center gap-2 bg-green-50 border border-green-200 text-green-800 text-[11px] font-mono px-3.5 py-1.5 rounded-full">
            <span className="h-2 w-2 rounded-full bg-green-600 animate-pulse"></span>
            <span>ROOT ACCESS • MASTER CONTROL</span>
          </div>
        </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Left Navigation Bar */}
        <div className="col-span-1 bg-[#163A4A] rounded-2xl shadow-md p-4 text-white space-y-1 h-fit">
          <div className="pb-4 mb-3 border-b border-slate-700 text-center">
            <span className="block text-xs font-bold text-[#C8B273] tracking-widest uppercase font-mono">Control Desk</span>
            <span className="text-[11px] text-slate-300">{adminEmail}</span>
          </div>

          <div className="space-y-1">
            {menuItems.map(item => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id as AdminTab)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-[#C8B273] text-[#163A4A] shadow-sm font-bold'
                      : 'text-slate-100 hover:bg-[#24495D] hover:text-[#C8B273]'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className="h-4 w-4 shrink-0" />
                    <span>{item.label}</span>
                  </div>
                  {item.badge !== undefined && item.badge > 0 && (
                    <span className="bg-red-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full font-mono">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Content Area */}
        <div className="col-span-1 lg:col-span-3" key={dataVersion}>
          {/* DASHBOARD TAB */}
          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              <div className="pb-3 border-b">
                <h2 className="text-xl font-bold text-[#163A4A]">
                  {currentLang === 'ar' ? 'ملخص ومؤشرات الأداء التشغيلي' : 'Operations & System Status'}
                </h2>
                <p className="text-xs text-slate-500">
                  {currentLang === 'ar' ? 'نظرة شمولية سريعة على كافة أقسام المنصة وقواعد البيانات' : 'Real-time overview across all operational departments'}
                </p>
              </div>

              {/* Stats Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="bg-white p-4 rounded-xl border shadow-xs">
                  <span className="text-[10px] font-bold text-slate-400 font-mono block">MEMBERS / الأعضاء</span>
                  <span className="text-2xl font-black text-[#163A4A] mt-1 block">{db.getMemberships().length}</span>
                  <span className="text-[10px] text-amber-600 font-bold mt-1 block">● {pendingMemberships} pending</span>
                </div>
                <div className="bg-white p-4 rounded-xl border shadow-xs">
                  <span className="text-[10px] font-bold text-slate-400 font-mono block">EVENTS / الفعاليات</span>
                  <span className="text-2xl font-black text-[#163A4A] mt-1 block">{db.getEvents().length}</span>
                  <span className="text-[10px] text-green-600 font-bold mt-1 block">Active Programs</span>
                </div>
                <div className="bg-white p-4 rounded-xl border shadow-xs">
                  <span className="text-[10px] font-bold text-slate-400 font-mono block">TICKETS / الشكاوى</span>
                  <span className="text-2xl font-black text-[#163A4A] mt-1 block">{db.getComplaints().length}</span>
                  <span className="text-[10px] text-blue-600 font-bold mt-1 block">● {activeComplaints} active</span>
                </div>
                <div className="bg-white p-4 rounded-xl border shadow-xs">
                  <span className="text-[10px] font-bold text-slate-400 font-mono block">VOLUNTEERS / المتطوعين</span>
                  <span className="text-2xl font-black text-[#163A4A] mt-1 block">{db.getVolunteers().length}</span>
                  <span className="text-[10px] text-purple-600 font-bold mt-1 block">● {pendingVolunteers} pending</span>
                </div>
              </div>

              {/* Quick Jump Action Grid */}
              <div className="bg-white p-5 rounded-2xl border shadow-xs space-y-3">
                <h3 className="font-bold text-sm text-[#163A4A]">
                  {currentLang === 'ar' ? 'الوصول المباشر لإدارة أقسام الموقع' : 'Quick Site Section Management'}
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  <button onClick={() => setActiveTab('homepage')} className="p-3 bg-amber-50/60 hover:bg-amber-100/60 rounded-xl border border-amber-200 text-left rtl:text-right cursor-pointer flex flex-col justify-between">
                    <span className="font-bold text-amber-900">تخصيص الصفحة الرئيسية</span>
                    <span className="text-[10px] text-amber-700 mt-1">كلمة الرئيس والإحصائيات</span>
                  </button>
                  <button onClick={() => setActiveTab('board')} className="p-3 bg-slate-50 hover:bg-slate-100 rounded-xl border text-left rtl:text-right cursor-pointer flex flex-col justify-between">
                    <span className="font-bold text-slate-900">الهيئة الإدارية</span>
                    <span className="text-[10px] text-slate-500 mt-1">{db.getBoardMembers().length} أعضاء مسجلين</span>
                  </button>
                  <button onClick={() => setActiveTab('guides')} className="p-3 bg-slate-50 hover:bg-slate-100 rounded-xl border text-left rtl:text-right cursor-pointer flex flex-col justify-between">
                    <span className="font-bold text-slate-900">دليل الطالب الشامل</span>
                    <span className="text-[10px] text-slate-500 mt-1">{db.getGuides().length} أقسام إرشادية</span>
                  </button>
                  <button onClick={() => setActiveTab('activities')} className="p-3 bg-slate-50 hover:bg-slate-100 rounded-xl border text-left rtl:text-right cursor-pointer flex flex-col justify-between">
                    <span className="font-bold text-slate-900">الأنشطة والمبادرات</span>
                    <span className="text-[10px] text-slate-500 mt-1">{db.getActivities().length} نشاط موثق</span>
                  </button>
                  <button onClick={() => setActiveTab('media')} className="p-3 bg-slate-50 hover:bg-slate-100 rounded-xl border text-left rtl:text-right cursor-pointer flex flex-col justify-between">
                    <span className="font-bold text-slate-900">المركز الإعلامي</span>
                    <span className="text-[10px] text-slate-500 mt-1">{db.getMediaItems().length} عناصر ألبوم ومجلات</span>
                  </button>
                  <button onClick={() => setActiveTab('sponsors')} className="p-3 bg-slate-50 hover:bg-slate-100 rounded-xl border text-left rtl:text-right cursor-pointer flex flex-col justify-between">
                    <span className="font-bold text-slate-900">الرعاة والشركاء</span>
                    <span className="text-[10px] text-slate-500 mt-1">{db.getSponsors().length} جهات شريكة</span>
                  </button>
                  <button onClick={() => setActiveTab('translations')} className="p-3 bg-slate-50 hover:bg-slate-100 rounded-xl border text-left rtl:text-right cursor-pointer flex flex-col justify-between">
                    <span className="font-bold text-slate-900">محرر النصوص والترجمات</span>
                    <span className="text-[10px] text-slate-500 mt-1">{Object.keys(translations).length} نصوص ومفاتيح</span>
                  </button>
                  <button onClick={() => setActiveTab('events')} className="p-3 bg-slate-50 hover:bg-slate-100 rounded-xl border text-left rtl:text-right cursor-pointer flex flex-col justify-between">
                    <span className="font-bold text-slate-900">الفعاليات والحضور</span>
                    <span className="text-[10px] text-slate-500 mt-1">{db.getEvents().length} برامج مجدولة</span>
                  </button>
                </div>
              </div>

              {/* Recent Audit Logs */}
              <div className="bg-white p-5 rounded-2xl border shadow-xs space-y-3">
                <h3 className="font-bold text-sm text-[#163A4A]">
                  {currentLang === 'ar' ? 'سجل العمليات الإدارية الحديثة' : 'Recent Administrator Activity Log'}
                </h3>
                <div className="divide-y divide-slate-100 max-h-48 overflow-y-auto">
                  {db.getActivityLogs().slice(0, 5).map(log => (
                    <div key={log.id} className="py-2.5 text-xs flex justify-between items-start">
                      <div>
                        <p className="font-bold text-slate-800">{log.action}</p>
                        <p className="text-slate-500 mt-0.5">{log.details}</p>
                        <span className="text-[10px] text-slate-400 font-mono mt-1 block">{log.timestamp} • IP: {log.ip}</span>
                      </div>
                      <span className="text-[10px] bg-slate-100 px-2 py-0.5 rounded font-mono text-slate-600 shrink-0">
                        {log.adminUser.split(' ')[0]}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* OTHER TABS */}
          {activeTab === 'homepage' && (
            <HomepageTab
              currentLang={currentLang}
              settings={settings}
              onSettingsUpdate={onSettingsUpdate}
              addToast={addToast}
              addActivityLog={addActivityLog}
            />
          )}

          {activeTab === 'memberships' && (
            <MembershipsTab currentLang={currentLang} addToast={addToast} addActivityLog={addActivityLog} />
          )}

          {activeTab === 'events' && (
            <EventsTab currentLang={currentLang} addToast={addToast} addActivityLog={addActivityLog} />
          )}

          {activeTab === 'announcements' && (
            <AnnouncementsTab currentLang={currentLang} addToast={addToast} addActivityLog={addActivityLog} />
          )}

          {activeTab === 'board' && (
            <BoardTab currentLang={currentLang} addToast={addToast} addActivityLog={addActivityLog} />
          )}

          {activeTab === 'guides' && (
            <GuidesTab currentLang={currentLang} addToast={addToast} addActivityLog={addActivityLog} />
          )}

          {activeTab === 'activities' && (
            <ActivitiesTab currentLang={currentLang} addToast={addToast} addActivityLog={addActivityLog} />
          )}

          {activeTab === 'media' && (
            <MediaTab currentLang={currentLang} addToast={addToast} addActivityLog={addActivityLog} />
          )}

          {activeTab === 'volunteers' && (
            <VolunteersTab currentLang={currentLang} addToast={addToast} addActivityLog={addActivityLog} />
          )}

          {activeTab === 'sponsors' && (
            <SponsorsTab currentLang={currentLang} addToast={addToast} addActivityLog={addActivityLog} />
          )}

          {activeTab === 'inbox' && (
            <InboxTab currentLang={currentLang} addToast={addToast} addActivityLog={addActivityLog} />
          )}

          {activeTab === 'complaints' && (
            <ComplaintsTab currentLang={currentLang} addToast={addToast} addActivityLog={addActivityLog} />
          )}

          {activeTab === 'translations' && (
            <TranslationsTab
              currentLang={currentLang}
              translations={translations}
              onTranslationUpdate={onTranslationUpdate}
              addToast={addToast}
              addActivityLog={addActivityLog}
            />
          )}

          {activeTab === 'settings' && (
            <SettingsTab
              currentLang={currentLang}
              settings={settings}
              onSettingsUpdate={onSettingsUpdate}
              addToast={addToast}
              addActivityLog={addActivityLog}
            />
          )}

          {activeTab === 'security' && (
            <SecurityTab currentLang={currentLang} addToast={addToast} addActivityLog={addActivityLog} adminEmail={adminEmail} />
          )}
        </div>
      </div>
    </div>
    </div>
  );
};
