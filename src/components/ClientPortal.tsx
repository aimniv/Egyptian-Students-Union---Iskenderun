import React, { useState, useEffect } from 'react';
import { 
  Language, 
  BoardMember, 
  StudentGuideSection, 
  Event, 
  Activity, 
  Announcement, 
  MediaItem, 
  ContactMessage, 
  Complaint, 
  Membership, 
  Sponsor,
  WebsiteSettings,
  EventRegistration
} from '../types';
import { db } from '../data/mockDb';
import { siteApi } from '../lib/siteApi';
import { ApiError } from '../lib/adminApi';
import { LogoCrest } from './Header';
import { 
  Search, Calendar, Clock, MapPin, Users, Award, Shield, FileText, 
  Send, Phone, HelpCircle, CheckCircle, ArrowRight, Download, Eye, 
  HeartHandshake, ChevronRight, ChevronLeft, Volume2, User, BookOpen, QrCode
} from 'lucide-react';
import { alertDialog } from '../lib/dialog';

interface ClientPortalProps {
  currentLang: Language;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  translations: Record<string, { ar: string; tr: string; en: string }>;
  settings: WebsiteSettings;
  addToast: (message: string, type: 'success' | 'info' | 'warning') => void;
}

export const ClientPortal: React.FC<ClientPortalProps> = ({
  currentLang,
  activeTab,
  setActiveTab,
  translations,
  settings,
  addToast,
}) => {
  // DB States
  const [board, setBoard] = useState<BoardMember[]>([]);
  const [guides, setGuides] = useState<StudentGuideSection[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [sponsors, setSponsors] = useState<Sponsor[]>([]);

  // Local Action States
  const [activeGuideCategory, setActiveGuideCategory] = useState<string>('residence');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Membership form state
  const [membershipType, setMembershipType] = useState<'new' | 'renewal'>('new');
  const [fullNameAr, setFullNameAr] = useState('');
  const [fullNameEn, setFullNameEn] = useState('');
  const [passportId, setPassportId] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [univ, setUniv] = useState('İskenderun Teknik Üniversitesi');
  const [faculty, setFaculty] = useState('');
  const [major, setMajor] = useState('');
  const [year, setYear] = useState('1');
  const [address, setAddress] = useState('');
  const [trackingCode, setTrackingCode] = useState('');
  const [searchedCode, setSearchedCode] = useState('');
  const [trackedMembership, setTrackedMembership] = useState<Membership | null>(null);

  // Event Register Form
  const [registeringEvent, setRegisteringEvent] = useState<Event | null>(null);
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regWhatsapp, setRegWhatsapp] = useState('');
  const [registeredTickets, setRegisteredTickets] = useState<Record<string, string>>({}); // eventId -> ticketCode

  // Contact / Complaint states
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [contactSubject, setContactSubject] = useState('');
  const [contactMsg, setContactMsg] = useState('');

  const [complaintName, setComplaintName] = useState('');
  const [complaintEmail, setComplaintEmail] = useState('');
  const [complaintPhone, setComplaintPhone] = useState('');
  const [complaintCat, setComplaintCat] = useState<'academic' | 'services' | 'logistics' | 'harassment_safety' | 'union_activities' | 'other'>('academic');
  const [complaintSub, setComplaintSub] = useState('');
  const [complaintDetails, setComplaintDetails] = useState('');
  const [complaintPriority, setComplaintPriority] = useState<'low' | 'medium' | 'high' | 'urgent'>('medium');
  const [complaintTicketCreated, setComplaintTicketCreated] = useState('');

  const [trackedTicketCode, setTrackedTicketCode] = useState('');
  const [trackedComplaint, setTrackedComplaint] = useState<Complaint | null>(null);

  // Load Database once
  useEffect(() => {
    setBoard(db.getBoardMembers());
    setGuides(db.getGuides());
    setEvents(db.getEvents());
    setActivities(db.getActivities());
    setAnnouncements(db.getAnnouncements());
    setMedia(db.getMediaItems());
    setSponsors(db.getSponsors());
  }, [activeTab]);

  const t = (key: string): string => {
    return translations[key]?.[currentLang] || key;
  };

  const isRtl = currentLang === 'ar';

  const submitErrorText = (err: unknown): string => {
    const code = err instanceof ApiError ? err.code : '';
    if (code === 'too_many_attempts') return isRtl ? 'محاولات كثيرة، حاول لاحقاً' : currentLang === 'tr' ? 'Çok fazla deneme, daha sonra tekrar deneyin' : 'Too many attempts, please try later';
    if (code === 'invalid_input') return isRtl ? 'يرجى التحقق من البيانات المدخلة (البريد الإلكتروني صحيح؟)' : currentLang === 'tr' ? 'Lütfen girdiğiniz bilgileri kontrol edin (e-posta geçerli mi?)' : 'Please check the data you entered (is the email valid?)';
    if (code === 'event_full') return isRtl ? 'عذراً، اكتمل عدد المقاعد' : currentLang === 'tr' ? 'Üzgünüz, kontenjan doldu' : 'Sorry, this event is full';
    return isRtl ? 'تعذر الإرسال حالياً، حاول مرة أخرى' : currentLang === 'tr' ? 'Şu anda gönderilemedi, tekrar deneyin' : 'Could not send right now, please try again';
  };

  // Membership Submission handler
  const handleMembershipSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullNameAr || !fullNameEn || !passportId || !email || !phone || !address) {
      alertDialog(isRtl ? 'يرجى ملء جميع الحقول المطلوبة' : 'Please fill all required fields');
      return;
    }

    let uniqueId: string;
    try {
      ({ code: uniqueId } = await siteApi.submit('membership', {
        nameAr: fullNameAr, nameEn: fullNameEn, passportOrId: passportId, email, phone, whatsapp: whatsapp || phone,
        university: univ, faculty, major, academicYear: year, residenceAddress: address, type: membershipType,
      }));
    } catch (err) {
      alertDialog(submitErrorText(err));
      return;
    }

    setTrackingCode(uniqueId);
    addToast(isRtl ? 'تم تقديم طلب العضوية بنجاح!' : 'Membership application submitted successfully!', 'success');
    
    // Reset fields
    setFullNameAr('');
    setFullNameEn('');
    setPassportId('');
    setEmail('');
    setPhone('');
    setWhatsapp('');
    setFaculty('');
    setMajor('');
    setAddress('');
  };

  // Membership Search/Track
  const handleTrackMembership = async () => {
    if (!searchedCode) return;
    try {
      const { record } = await siteApi.track<Membership>('membership', searchedCode);
      setTrackedMembership(record);
    } catch (err) {
      setTrackedMembership(null);
      alertDialog(err instanceof ApiError && err.code !== 'not_found' ? submitErrorText(err) : (isRtl ? 'عذراً، لم يتم العثور على أي طلب بهذا الرمز.' : 'Sorry, no membership application was found with this code.'));
    }
  };

  // Contact form Submission
  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactName || !contactEmail || !contactMsg) {
      alertDialog(isRtl ? 'الرجاء ملء الحقول الإجبارية' : 'Please fill all compulsory fields');
      return;
    }

    try {
      await siteApi.submit('message', {
        name: contactName, email: contactEmail, phone: contactPhone,
        subject: contactSubject || (isRtl ? 'استفسار عام' : 'General Inquiry'), message: contactMsg, language: currentLang,
      });
    } catch (err) {
      alertDialog(submitErrorText(err));
      return;
    }

    addToast(isRtl ? 'تم إرسال رسالتكم للأمانة العامة بنجاح!' : 'Your message has been sent successfully!', 'success');
    
    // Clear
    setContactName('');
    setContactEmail('');
    setContactPhone('');
    setContactSubject('');
    setContactMsg('');
  };

  // Complaint system submission
  const handleComplaintSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!complaintName || !complaintEmail || !complaintDetails || !complaintSub) {
      alertDialog(isRtl ? 'الرجاء تعبئة حقول النموذج بالكامل' : 'Please complete the ticket form details');
      return;
    }

    let ticketNo: string;
    try {
      ({ code: ticketNo } = await siteApi.submit('complaint', {
        name: complaintName, email: complaintEmail, phone: complaintPhone, category: complaintCat,
        subject: complaintSub, details: complaintDetails, priority: complaintPriority,
      }));
    } catch (err) {
      alertDialog(submitErrorText(err));
      return;
    }

    setComplaintTicketCreated(ticketNo);
    addToast(isRtl ? 'تم تسجيل شكواكم كطلب رسمي!' : 'Your complaint has been logged as a ticket!', 'success');

    // Clear
    setComplaintName('');
    setComplaintEmail('');
    setComplaintPhone('');
    setComplaintSub('');
    setComplaintDetails('');
  };

  // Complaint track
  const handleTrackComplaint = async () => {
    if (!trackedTicketCode) return;
    try {
      const { record } = await siteApi.track<Complaint>('complaint', trackedTicketCode);
      setTrackedComplaint(record);
    } catch (err) {
      setTrackedComplaint(null);
      alertDialog(err instanceof ApiError && err.code !== 'not_found' ? submitErrorText(err) : (isRtl ? 'لم يتم العثور على تذكرة بهذا الرقم.' : 'Ticket not found.'));
    }
  };

  // Event Registration Submission
  const handleEventRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!registeringEvent) return;

    if (!regName || !regEmail || !regPhone) {
      alertDialog(isRtl ? 'يرجى تعبئة الحقول الإلزامية' : 'Please fill all mandatory fields');
      return;
    }

    let ticketCode: string;
    try {
      ({ code: ticketCode } = await siteApi.submit('registration', {
        eventId: registeringEvent.id, name: regName, email: regEmail, phone: regPhone, whatsapp: regWhatsapp || regPhone,
      }));
    } catch (err) {
      alertDialog(submitErrorText(err));
      return;
    }

    // The server keeps the real counter; mirror it here so the page updates immediately.
    setEvents(events.map(ev => (ev.id === registeringEvent.id ? { ...ev, registeredCount: ev.registeredCount + 1 } : ev)));

    // Save ticket locally
    setRegisteredTickets(prev => ({ ...prev, [registeringEvent.id]: ticketCode }));
    addToast(isRtl ? 'تم تسجيل حضوركم وإصدار التذكرة!' : 'Registration successful, ticket issued!', 'success');

    setRegisteringEvent(null);
    setRegName('');
    setRegEmail('');
    setRegPhone('');
    setRegWhatsapp('');
  };

  return (
    <div className="flex-1 w-full" id="client-portal-wrapper">
      
      {/* 1. HOME VIEW */}
      {activeTab === 'home' && (
        <div className="space-y-12">
          
          {/* Hero Slider banner */}
          <div className="relative overflow-hidden bg-gradient-to-br from-[#163A4A] to-[#24495D] text-white py-20 px-4 sm:px-6 lg:px-8 border-b-4 border-[#C8B273]">
            {/* Background geometric accents */}
            <div className="absolute inset-0 opacity-10 pointer-events-none">
              <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                    <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="1" />
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#grid)" />
              </svg>
            </div>

            <div className="relative max-w-5xl mx-auto text-center space-y-6">
              <div className="inline-flex items-center space-x-2 bg-white/10 px-4 py-1.5 rounded-full text-xs sm:text-sm text-[#C8B273] font-medium border border-[#C8B273]/30 rtl:space-x-reverse">
                <Shield className="h-4 w-4" />
                <span>
                  {settings.homepage?.hero.badge[currentLang] || (currentLang === 'ar' ? 'البوابة الرقمية الرسمية المعتمدة' : currentLang === 'tr' ? 'Resmi Onaylı Dijital Portal' : 'Official Accredited Digital Portal')}
                </span>
              </div>
              
              <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight leading-tight text-white drop-shadow-sm font-sans">
                {settings.homepage?.hero.title[currentLang] || t('home.welcome')}
              </h1>
              
              <p className="max-w-2xl mx-auto text-sm sm:text-lg text-slate-300 leading-relaxed font-sans">
                {settings.homepage?.hero.subtitle[currentLang] || t('home.subtitle')}
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                <button 
                  onClick={() => setActiveTab('membership')} 
                  className="w-full sm:w-auto px-8 py-3 bg-[#C8B273] text-[#163A4A] font-bold rounded shadow-lg hover:bg-white hover:text-[#163A4A] transition-all duration-300 flex items-center justify-center space-x-2 cursor-pointer"
                >
                  <Users className="h-5 w-5" />
                  <span>{settings.homepage?.hero.primaryBtnText[currentLang] || t('home.applyBtn')}</span>
                </button>
                <button 
                  onClick={() => setActiveTab('guide')} 
                  className="w-full sm:w-auto px-8 py-3 bg-white/10 border border-[#C8B273]/50 text-[#C8B273] hover:bg-white/20 font-bold rounded transition-all duration-300 flex items-center justify-center space-x-2 cursor-pointer"
                >
                  <FileText className="h-5 w-5" />
                  <span>{settings.homepage?.hero.secondaryBtnText[currentLang] || t('home.guideBtn')}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Quick Announcement ticker if exists */}
          {announcements.length > 0 && (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="bg-[#F7F5EC] border-l-4 border-[#C8B273] p-4 rounded shadow-sm flex items-center space-x-4 rtl:space-x-reverse">
                <div className="p-2 bg-[#163A4A] text-[#C8B273] rounded">
                  <Volume2 className="h-5 w-5" />
                </div>
                <div className="flex-1 overflow-hidden">
                  <p className="text-xs text-amber-800 font-bold tracking-wider uppercase">
                    {currentLang === 'ar' ? 'آخر إعلان مثبت' : currentLang === 'tr' ? 'Son Sabitlenen Duyuru' : 'Latest Announcement'}
                  </p>
                  <p className="text-sm font-semibold text-[#163A4A] truncate">
                    {announcements.find(a => a.isPinned)?.title[currentLang] || announcements[0].title[currentLang]}
                  </p>
                </div>
                <button 
                  onClick={() => setActiveTab('announcements')} 
                  className="text-xs font-bold text-[#163A4A] hover:underline flex items-center space-x-1 rtl:space-x-reverse"
                >
                  <span>{currentLang === 'ar' ? 'عرض الكل' : currentLang === 'tr' ? 'Tümünü Gör' : 'View All'}</span>
                  <ArrowRight className="h-3 w-3 rtl:rotate-180" />
                </button>
              </div>
            </div>
          )}

          {/* President's Message */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white rounded-lg shadow-md border border-slate-100 overflow-hidden grid grid-cols-1 lg:grid-cols-3">
              <div className="relative bg-[#163A4A] text-white p-8 flex flex-col justify-center items-center text-center border-b lg:border-b-0 lg:border-r rtl:lg:border-r-0 rtl:lg:border-l border-[#C8B273]/30">
                <img 
                  src={settings.homepage?.presidentMessage.photo || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=300"} 
                  alt="President" 
                  className="h-32 w-32 rounded-full border-4 border-[#C8B273] object-cover shadow-md mb-4"
                />
                <h4 className="font-bold text-lg text-[#C8B273]">
                  {settings.homepage?.presidentMessage.name[currentLang] || (currentLang === 'ar' ? 'أحمد محمود الرفاعي' : currentLang === 'tr' ? 'Ahmet Mahmut El-Rifai' : 'Ahmed Mahmoud El-Rifai')}
                </h4>
                <p className="text-xs text-slate-300">
                  {settings.homepage?.presidentMessage.title[currentLang] || (currentLang === 'ar' ? 'رئيس مجلس إدارة اتحاد الطلاب' : currentLang === 'tr' ? 'MÖB İskenderun Yönetim Kurulu Başkanı' : 'President of the Egyptian Students\' Union')}
                </p>
              </div>
              <div className="lg:col-span-2 p-8 flex flex-col justify-center space-y-4">
                <h3 className="text-xl sm:text-2xl font-bold text-[#163A4A] font-sans flex items-center space-x-2 rtl:space-x-reverse">
                  <span className="text-[#C8B273]">■</span>
                  <span>{settings.homepage?.presidentMessage.sectionTitle[currentLang] || t('home.pres.title')}</span>
                </h3>
                <p className="text-sm sm:text-base text-slate-600 leading-relaxed italic">
                  "{settings.homepage?.presidentMessage.messageText[currentLang] || t('home.pres.text')}"
                </p>
              </div>
            </div>
          </div>

          {/* Statistics Block */}
          <div className="bg-[#163A4A] text-white py-12 border-y border-[#C8B273]/30">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <h3 className="text-center text-xl sm:text-2xl font-bold text-[#C8B273] mb-8 font-sans">
                {settings.homepage?.stats.sectionTitle[currentLang] || t('home.stats.title')}
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
                <div className="p-4 bg-[#24495D] rounded-lg border border-[#C8B273]/20 shadow-inner">
                  <p className="text-3xl sm:text-4xl font-extrabold text-[#C8B273] font-mono">
                    {settings.homepage?.stats.stat1.number || '450+'}
                  </p>
                  <p className="text-xs sm:text-sm text-slate-300 mt-2 font-sans">
                    {settings.homepage?.stats.stat1.label[currentLang] || t('home.stats.members')}
                  </p>
                </div>
                <div className="p-4 bg-[#24495D] rounded-lg border border-[#C8B273]/20 shadow-inner">
                  <p className="text-3xl sm:text-4xl font-extrabold text-[#C8B273] font-mono">
                    {settings.homepage?.stats.stat2.number || '24+'}
                  </p>
                  <p className="text-xs sm:text-sm text-slate-300 mt-2 font-sans">
                    {settings.homepage?.stats.stat2.label[currentLang] || t('home.stats.events')}
                  </p>
                </div>
                <div className="p-4 bg-[#24495D] rounded-lg border border-[#C8B273]/20 shadow-inner">
                  <p className="text-3xl sm:text-4xl font-extrabold text-[#C8B273] font-mono">
                    {settings.homepage?.stats.stat3.number || '6+'}
                  </p>
                  <p className="text-xs sm:text-sm text-slate-300 mt-2 font-sans">
                    {settings.homepage?.stats.stat3.label[currentLang] || t('home.stats.years')}
                  </p>
                </div>
                <div className="p-4 bg-[#24495D] rounded-lg border border-[#C8B273]/20 shadow-inner">
                  <p className="text-3xl sm:text-4xl font-extrabold text-[#C8B273] font-mono">
                    {settings.homepage?.stats.stat4.number || '5+'}
                  </p>
                  <p className="text-xs sm:text-sm text-slate-300 mt-2 font-sans">
                    {settings.homepage?.stats.stat4.label[currentLang] || t('home.stats.partners')}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Upcoming Event Spotlight */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="border-b border-slate-200 pb-4 mb-6">
              <h3 className="text-2xl font-bold text-[#163A4A] font-sans flex items-center space-x-2 rtl:space-x-reverse">
                <span className="text-[#C8B273]">■</span>
                <span>{currentLang === 'ar' ? 'الفعالية القادمة الكبرى' : currentLang === 'tr' ? 'Yaklaşan Büyük Etkinlik' : 'Upcoming Major Event'}</span>
              </h3>
            </div>

            {events.filter(e => e.countdownActive).map(ev => (
              <div key={ev.id} className="bg-white rounded-lg shadow-md overflow-hidden grid grid-cols-1 md:grid-cols-2 border border-slate-100">
                <div className="relative h-64 md:h-full min-h-[300px]">
                  <img src={ev.image} alt={ev.title[currentLang]} className="absolute inset-0 w-full h-full object-cover" />
                  <div className="absolute top-4 left-4 bg-[#163A4A]/90 text-[#C8B273] px-3 py-1 rounded text-xs font-semibold uppercase">
                    {ev.category}
                  </div>
                </div>
                <div className="p-8 flex flex-col justify-between space-y-4">
                  <div className="space-y-3">
                    <h4 className="text-xl font-bold text-[#163A4A] font-sans">{ev.title[currentLang]}</h4>
                    <p className="text-sm text-slate-500 leading-relaxed line-clamp-4">{ev.description[currentLang]}</p>
                    
                    <div className="grid grid-cols-2 gap-2 text-xs text-slate-600 font-sans pt-2">
                      <div className="flex items-center space-x-1.5 rtl:space-x-reverse">
                        <Calendar className="h-4 w-4 text-[#C8B273]" />
                        <span>{ev.date}</span>
                      </div>
                      <div className="flex items-center space-x-1.5 rtl:space-x-reverse">
                        <Clock className="h-4 w-4 text-[#C8B273]" />
                        <span>{ev.time}</span>
                      </div>
                      <div className="flex items-center space-x-1.5 rtl:space-x-reverse col-span-2">
                        <MapPin className="h-4 w-4 text-[#C8B273]" />
                        <span>{ev.location[currentLang]}</span>
                      </div>
                    </div>
                  </div>

                  {/* Active countdown simulation */}
                  <div className="bg-[#F7F5EC] border border-[#C8B273]/30 p-3 rounded-lg flex items-center justify-between">
                    <span className="text-xs font-bold text-[#163A4A] font-sans">{t('events.countdown')}:</span>
                    <span className="text-sm font-mono font-bold text-[#163A4A] bg-[#C8B273]/30 px-3 py-1 rounded">
                      74 {currentLang === 'ar' ? 'يوم' : 'Gün'} • 12:45:09
                    </span>
                  </div>

                  <div className="pt-2">
                    {registeredTickets[ev.id] ? (
                      <div className="p-3 bg-green-50 text-green-800 text-xs rounded border border-green-200 flex items-center justify-between">
                        <div className="flex items-center space-x-2 rtl:space-x-reverse">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                          <span>{currentLang === 'ar' ? 'أنت مسجل بالفعالية! كود تذكرتك:' : 'You are registered! Ticket Code:'} <strong>{registeredTickets[ev.id]}</strong></span>
                        </div>
                        <button 
                          onClick={() => {
                            alertDialog(currentLang === 'ar' ? `رمز التحقق للحضور الشخصي هو: ${ev.qrCodeValue}` : `Verification value: ${ev.qrCodeValue}`);
                          }}
                          className="px-2 py-1 bg-green-600 text-white rounded font-bold text-[10px]"
                        >
                          Show QR
                        </button>
                      </div>
                    ) : (
                      <button 
                        onClick={() => setRegisteringEvent(ev)} 
                        className="w-full py-2.5 bg-[#163A4A] hover:bg-[#24495D] text-white rounded font-bold transition-all text-sm flex items-center justify-center space-x-2 cursor-pointer"
                      >
                        <Award className="h-4 w-4 text-[#C8B273]" />
                        <span>{t('events.register')}</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Sponsors Section */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
            <div className="text-center border-t border-slate-200 pt-8 mb-6">
              <h4 className="text-xs font-bold text-slate-400 tracking-widest uppercase">
                {currentLang === 'ar' ? 'تحت رعاية وشركاء النجاح' : currentLang === 'tr' ? 'Sponsorlarımız ve Ortaklarımız' : 'Sponsors & Official Partners'}
              </h4>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-8 opacity-75 grayscale hover:grayscale-0 transition-all duration-300">
              {sponsors.map(sp => (
                <div key={sp.id} className="flex flex-col items-center bg-white p-4 rounded-lg shadow-sm border border-slate-100 max-w-[200px] text-center">
                  <img src={sp.logo} alt={sp.name[currentLang]} className="h-10 w-auto mb-2 object-contain" />
                  <span className="text-[10px] font-bold text-[#163A4A] line-clamp-1">{sp.name[currentLang]}</span>
                  <span className="text-[8px] uppercase text-[#C8B273] font-mono tracking-wider">{sp.tier}</span>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* 2. ABOUT US VIEW */}
      {activeTab === 'about' && (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
          
          {/* History */}
          <div className="space-y-4">
            <h2 className="text-3xl font-bold text-[#163A4A] font-sans border-b-2 border-[#C8B273] pb-2">
              {t('about.history.title')}
            </h2>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed text-justify font-sans">
              {t('about.history.text')}
            </p>
          </div>

          {/* Mission & Vision */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-100 space-y-3">
              <div className="p-3 bg-[#F7F5EC] inline-block rounded border border-[#C8B273]/30">
                <Award className="h-6 w-6 text-[#163A4A]" />
              </div>
              <h3 className="text-xl font-bold text-[#163A4A] font-sans">
                {t('about.mission.title')}
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                {t('about.mission.text')}
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-100 space-y-3">
              <div className="p-3 bg-[#F7F5EC] inline-block rounded border border-[#C8B273]/30">
                <Shield className="h-6 w-6 text-[#163A4A]" />
              </div>
              <h3 className="text-xl font-bold text-[#163A4A] font-sans">
                {t('about.vision.title')}
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                {t('about.vision.text')}
              </p>
            </div>
          </div>

          {/* Objectives */}
          <div className="bg-[#163A4A] text-white p-8 rounded-lg shadow-md border border-[#C8B273]/30 space-y-4">
            <h3 className="text-xl font-bold text-[#C8B273] font-sans">
              {currentLang === 'ar' ? 'أهداف الاتحاد الرئيسية' : currentLang === 'tr' ? 'Birliğin Temel Amaçları' : 'Core Objectives of the Union'}
            </h3>
            <ul className="space-y-3 text-xs sm:text-sm text-slate-200 list-disc list-inside">
              <li>
                {currentLang === 'ar' 
                  ? 'رعاية وتنسيق شؤون الطلبة المصريين أمام الهيئات الأكاديمية والملحقيات.'
                  : currentLang === 'tr'
                  ? 'Mısır Kültür Ataşeliği ve Üniversite yönetimleri nezdinde öğrencileri temsil etmek.'
                  : 'Represent and advocate for Egyptian student needs before academic bureaus.'}
              </li>
              <li>
                {currentLang === 'ar' 
                  ? 'تقديم الدعم اللوجستي والأكاديمي والتعليمي للطلاب لتيسير مسار دراستهم بتركيا.'
                  : currentLang === 'tr'
                  ? 'Eğitim hayatlarını kolaylaştırmak için akademik ve lojistik danışmanlık hizmetleri sağlamak.'
                  : 'Provide critical logistical and academic consulting to ease the Turkish study pathway.'}
              </li>
              <li>
                {currentLang === 'ar' 
                  ? 'تفعيل الأنشطة الثقافية والرياضية والاجتماعية التي تساهم في تعميق التآخي الإيجابي.'
                  : currentLang === 'tr'
                  ? 'Sosyal bağları güçlendiren kültürel, sportif ve sosyal aktiviteler organize etmek.'
                  : 'Organize sports tournaments, cultural days, and excursions fostering robust student integration.'}
              </li>
            </ul>
          </div>

          {/* Constitution bylaws */}
          <div className="space-y-4">
            <h3 className="text-2xl font-bold text-[#163A4A] font-sans border-b border-slate-200 pb-2">
              {t('about.constitution.title')}
            </h3>
            <div className="space-y-3 text-xs sm:text-sm text-slate-600 leading-relaxed bg-[#F7F5EC] p-6 rounded-lg border border-slate-200">
              <p className="font-bold text-[#163A4A]">
                {currentLang === 'ar' ? 'المادة الأولى: التعريف والهوية' : currentLang === 'tr' ? 'Madde 1: Tanım ve Kimlik' : 'Article 1: Definition & Org Identity'}
              </p>
              <p>
                {currentLang === 'ar' 
                  ? 'اتحاد الطلاب المصريين بإسكندرون هو كيان طلابي تطوعي رسمي غير سياسي، يهدف لخدمة الطلاب المصريين الدارسين في مدينة إسكندرون وتوفير المناخ الأكاديمي والاجتماعي الملائم لهم.'
                  : currentLang === 'tr'
                  ? 'İskenderun Mısırlı Öğrenciler Birliği (MÖB), siyasi amaç gütmeyen gönüllü bir öğrenci topluluğudur. Amacı, İskenderun\'da eğitim gören Mısırlı öğrencilere destek olmak ve sosyal entegrasyonu sağlamaktır.'
                  : 'The Egyptian Students\' Union - Iskenderun is a non-political, voluntary institutional entity aimed strictly at looking after and integrating Egyptian scholars studying within Hatay/Iskenderun.'}
              </p>
              <p className="font-bold text-[#163A4A] pt-2">
                {currentLang === 'ar' ? 'المادة الثانية: العضوية والاشتراك' : currentLang === 'tr' ? 'Madde 2: Üyelik Şartları' : 'Article 2: Membership Scope'}
              </p>
              <p>
                {currentLang === 'ar' 
                  ? 'تمنح العضوية لكل طالب مصري مسجل رسمياً في إحدى الجامعات أو المعاهد التركية المعتمدة في نطاق ولاية هاتاي بعد تقديم الأوراق الثبوتية والموافقة عليها من قبل الأمانة العامة.'
                  : currentLang === 'tr'
                  ? 'Hatay ilindeki akredite yükseköğretim kurumlarında kayıtlı tüm Mısırlı öğrenciler, tüzükte belirlenen evrakları teslim ettikten sonra genel sekreterlik onayıyla üye olabilirler.'
                  : 'Membership is granted to any active Egyptian student registered in accredited higher educational institutes in Hatay following credential audit and official approval.'}
              </p>
            </div>
          </div>

        </div>
      )}

      {/* 3. EXECUTIVE BOARD VIEW */}
      {activeTab === 'board' && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
          <div className="text-center space-y-2">
            <h2 className="text-3xl font-bold text-[#163A4A] font-sans">
              {t('nav.board')}
            </h2>
            <p className="text-sm text-slate-500 max-w-xl mx-auto">
              {currentLang === 'ar' ? 'تعرف على قادة العمل الطلابي في الهيئة الإدارية للاتحاد واللجان التنفيذية للعام الحالي.' : 'Meet the active leaders managing the student affairs and executive boards.'}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pt-6">
            {board.map((member) => (
              <div key={member.id} className="bg-white rounded-lg shadow-sm border border-slate-100 overflow-hidden group hover:shadow-lg transition-all duration-300">
                <div className="relative h-64 overflow-hidden bg-slate-100">
                  <img 
                    src={member.photo} 
                    alt={member.name[currentLang]} 
                    className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                    <p className="text-xs text-slate-200 font-sans italic">{member.bio[currentLang]}</p>
                  </div>
                </div>
                <div className="p-5 space-y-2 text-center sm:text-right rtl:sm:text-right ltr:sm:text-left">
                  <span className="text-[10px] font-bold uppercase text-[#C8B273] tracking-widest font-mono">
                    {member.roleTitle[currentLang]}
                  </span>
                  <h4 className="font-bold text-base text-[#163A4A] font-sans truncate">{member.name[currentLang]}</h4>
                  
                  <div className="border-t border-slate-100 pt-3 mt-3 text-xs text-slate-500 font-sans space-y-1">
                    <p className="font-semibold text-slate-700 truncate">{member.academicInfo.major[currentLang]}</p>
                    <p className="text-[10px] text-slate-400 truncate">{member.academicInfo.university[currentLang]}</p>
                    <p className="text-[10px] text-slate-400">{currentLang === 'ar' ? 'السنة الدراسية:' : 'Sınıf/Year:'} {member.academicInfo.year}</p>
                  </div>

                  <div className="pt-2 border-t border-slate-50 flex items-center justify-center space-x-3 rtl:space-x-reverse text-xs font-semibold text-[#163A4A]">
                    <a href={`mailto:${member.email}`} className="text-[#C8B273] hover:underline">Email</a>
                    <span>•</span>
                    <a href={`https://wa.me/${member.whatsapp}`} target="_blank" className="hover:underline">WhatsApp</a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. MEMBERSHIP PORTAL */}
      {activeTab === 'membership' && (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12 animate-fade-in">
          
          <div className="text-center space-y-2">
            <h2 className="text-3xl font-bold text-[#163A4A] font-sans">
              {t('membership.title')}
            </h2>
            <p className="text-sm text-slate-500">
              {currentLang === 'ar' ? 'انضم إلى عائلة الاتحاد واستفد من الخصومات والخدمات الأكاديمية والبطاقة الطلابية.' : 'Become a union member to unlock student guides, event tickets, and certified cards.'}
            </p>
          </div>

          {/* Tab Selection: Apply vs Status Check */}
          <div className="flex bg-slate-200/60 p-1 rounded-lg max-w-md mx-auto">
            <button 
              onClick={() => { setTrackedMembership(null); setSearchedCode(''); setTrackingCode(''); }}
              className={`flex-1 py-2 text-xs sm:text-sm font-semibold rounded cursor-pointer ${!trackingCode && !trackedMembership ? 'bg-[#163A4A] text-[#C8B273]' : 'text-slate-600 hover:text-slate-800'}`}
            >
              {t('membership.applyForm')}
            </button>
            <button 
              onClick={() => { setTrackingCode(' '); }}
              className={`flex-1 py-2 text-xs sm:text-sm font-semibold rounded cursor-pointer ${trackingCode || trackedMembership ? 'bg-[#163A4A] text-[#C8B273]' : 'text-slate-600 hover:text-slate-800'}`}
            >
              {t('membership.statusCheck')}
            </button>
          </div>

          {/* Sub-View A: Form Submission Success */}
          {trackingCode && trackingCode !== ' ' && (
            <div className="bg-[#F7F5EC] border-2 border-[#C8B273] rounded-lg p-8 text-center space-y-6">
              <div className="mx-auto h-14 w-14 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-2xl font-bold text-[#163A4A] font-sans">
                {currentLang === 'ar' ? 'تم تسجيل طلبك بنجاح!' : 'Application Received Successfully!'}
              </h3>
              <p className="text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
                {t('membership.successMessage')}
              </p>
              <div className="p-4 bg-white border border-[#C8B273]/40 rounded-md inline-block">
                <span className="block text-xs text-slate-400 font-mono">TRACKING ID / كود المتابعة</span>
                <span className="text-2xl font-mono font-bold text-[#163A4A] select-all">{trackingCode}</span>
              </div>
              <div>
                <button 
                  onClick={() => {
                    setSearchedCode(trackingCode);
                    handleTrackMembership();
                    setTrackingCode('');
                  }}
                  className="px-6 py-2 bg-[#163A4A] text-white rounded font-bold text-sm hover:bg-[#24495D]"
                >
                  {currentLang === 'ar' ? 'تتبع حالة الطلب الفورية' : 'Track Status Instantly'}
                </button>
              </div>
            </div>
          )}

          {/* Sub-View B: Form Apply */}
          {!trackingCode && !trackedMembership && (
            <form onSubmit={handleMembershipSubmit} className="bg-white rounded-lg shadow-sm border border-slate-200 p-6 sm:p-8 space-y-6 font-sans">
              <div className="border-b border-slate-100 pb-4 flex items-center justify-between">
                <span className="font-bold text-lg text-[#163A4A]">
                  {currentLang === 'ar' ? 'تفاصيل مقدم الطلب الشخصية' : 'Personal Applicant Details'}
                </span>
                <div className="flex space-x-2 rtl:space-x-reverse">
                  <button 
                    type="button" 
                    onClick={() => setMembershipType('new')}
                    className={`px-3 py-1 text-xs rounded font-bold ${membershipType === 'new' ? 'bg-[#C8B273] text-[#163A4A]' : 'bg-slate-100 text-slate-600'}`}
                  >
                    {currentLang === 'ar' ? 'عضوية جديدة' : 'New'}
                  </button>
                  <button 
                    type="button" 
                    onClick={() => setMembershipType('renewal')}
                    className={`px-3 py-1 text-xs rounded font-bold ${membershipType === 'renewal' ? 'bg-[#C8B273] text-[#163A4A]' : 'bg-slate-100 text-slate-600'}`}
                  >
                    {currentLang === 'ar' ? 'تجديد' : 'Renewal'}
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">{t('membership.fullnameAr')} *</label>
                  <input required type="text" value={fullNameAr} onChange={(e) => setFullNameAr(e.target.value)} className="w-full px-3 py-2 border border-slate-300 rounded text-sm text-right font-sans" placeholder="أحمد محمد السيد" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">{t('membership.fullnameEn')} *</label>
                  <input required type="text" value={fullNameEn} onChange={(e) => setFullNameEn(e.target.value)} className="w-full px-3 py-2 border border-slate-300 rounded text-sm font-sans" placeholder="Ahmed Mohamed El-Sayed" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">{t('membership.passport')} *</label>
                  <input required type="text" value={passportId} onChange={(e) => setPassportId(e.target.value)} className="w-full px-3 py-2 border border-slate-300 rounded text-sm font-mono" placeholder="99xxxxxxxx / Axxxxxxxx" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">{currentLang === 'ar' ? 'البريد الإلكتروني' : 'Email Address'} *</label>
                  <input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-3 py-2 border border-slate-300 rounded text-sm font-sans" placeholder="student@example.com" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">{t('membership.phone')} *</label>
                  <input required type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full px-3 py-2 border border-slate-300 rounded text-sm font-sans" placeholder="+90 5xx xxx xxxx" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">{t('membership.whatsapp')}</label>
                  <input type="tel" value={whatsapp} onChange={(e) => setWhatsapp(e.target.value)} className="w-full px-3 py-2 border border-slate-300 rounded text-sm font-sans" placeholder="+20 1xx xxx xxxx" />
                </div>
              </div>

              <div className="border-t border-slate-100 pt-4 font-sans">
                <span className="block font-bold text-sm text-[#163A4A] mb-3">
                  {currentLang === 'ar' ? 'البيانات الأكاديمية والجامعية' : 'University & Academic Information'}
                </span>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">{t('membership.university')}</label>
                    <select value={univ} onChange={(e) => setUniv(e.target.value)} className="w-full px-3 py-2 border border-slate-300 rounded text-sm bg-white font-sans">
                      <option value="İskenderun Teknik Üniversitesi">İskenderun Teknik Üniversitesi (İSTE)</option>
                      <option value="Hatay Mustafa Kemal Üniversitesi">Hatay Mustafa Kemal Üniversitesi</option>
                      <option value="Other Turkish University">Other / أخرى</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">{t('membership.faculty')} *</label>
                    <input required type="text" value={faculty} onChange={(e) => setFaculty(e.target.value)} className="w-full px-3 py-2 border border-slate-300 rounded text-sm font-sans" placeholder="e.g. Mühendislik" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">{t('membership.major')} *</label>
                    <input required type="text" value={major} onChange={(e) => setMajor(e.target.value)} className="w-full px-3 py-2 border border-slate-300 rounded text-sm font-sans" placeholder="e.g. Bilgisayar" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">{t('membership.year')}</label>
                    <select value={year} onChange={(e) => setYear(e.target.value)} className="w-full px-3 py-2 border border-slate-300 rounded text-sm bg-white font-sans">
                      <option value="Prep">Prep / تحضيري</option>
                      <option value="1">1st Year / السنة الأولى</option>
                      <option value="2">2nd Year / السنة الثانية</option>
                      <option value="3">3rd Year / السنة الثالثة</option>
                      <option value="4">4th Year / السنة الرابعة</option>
                      <option value="Graduate">Postgraduate / دراسات عليا</option>
                    </select>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">{t('membership.address')} *</label>
                <textarea required rows={3} value={address} onChange={(e) => setAddress(e.target.value)} className="w-full px-3 py-2 border border-slate-300 rounded text-sm font-sans" placeholder="e.g. Hatay, İskenderun, Cumhuriyet Mahallesi..." />
              </div>

              <div className="pt-2">
                <button type="submit" className="w-full py-3 bg-[#163A4A] text-white font-bold rounded shadow hover:bg-[#24495D] transition-colors cursor-pointer text-sm">
                  {t('membership.submitBtn')}
                </button>
              </div>
            </form>
          )}

          {/* Sub-View C: Status Tracking & Printable E-Card */}
          {(trackingCode === ' ' || trackedMembership) && (
            <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6 sm:p-8 space-y-6">
              <h3 className="font-bold text-lg text-[#163A4A] font-sans">
                {t('membership.statusCheck')}
              </h3>

              <div className="flex space-x-3 rtl:space-x-reverse">
                <input 
                  type="text" 
                  value={searchedCode} 
                  onChange={(e) => setSearchedCode(e.target.value)} 
                  className="flex-1 px-3 py-2 border border-slate-300 rounded text-sm font-mono" 
                  placeholder="e.g. MEMB-xxxxxx or Passport No." 
                />
                <button 
                  onClick={handleTrackMembership}
                  className="px-6 py-2 bg-[#163A4A] hover:bg-[#24495D] text-[#C8B273] font-bold rounded text-sm cursor-pointer"
                >
                  {currentLang === 'ar' ? 'بحث واستخراج' : 'Search Card'}
                </button>
              </div>

              {trackedMembership && (
                <div className="border-t border-slate-100 pt-6 space-y-6 animate-fade-in">
                  
                  {/* Status Indicator */}
                  <div className="flex items-center justify-between p-4 bg-slate-50 rounded border border-slate-200">
                    <span className="text-xs font-bold text-slate-500 uppercase font-mono">STATUS / الحالة</span>
                    <span className={`px-3 py-1 rounded text-xs font-bold uppercase ${
                      trackedMembership.status === 'approved' ? 'bg-green-100 text-green-800' :
                      trackedMembership.status === 'rejected' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {trackedMembership.status === 'approved' && (currentLang === 'ar' ? 'معتمد / نشط' : 'Approved / Active')}
                      {trackedMembership.status === 'rejected' && (currentLang === 'ar' ? 'مرفوض' : 'Rejected')}
                      {trackedMembership.status === 'pending' && (currentLang === 'ar' ? 'تحت الدراسة والمراجعة' : 'Pending Review')}
                    </span>
                  </div>

                  {trackedMembership.status === 'rejected' && (
                    <div className="p-4 bg-red-50 text-red-700 rounded border border-red-200 text-sm">
                      <strong>{currentLang === 'ar' ? 'سبب الرفض:' : 'Rejection Reason:'}</strong> {trackedMembership.rejectionReason || 'Documents mismatch.'}
                    </div>
                  )}

                  {/* HIGH FIDELITY PRINTABLE E-CARD */}
                  {trackedMembership.status === 'approved' && (
                    <div className="space-y-4">
                      <div className="text-center">
                        <span className="text-xs text-slate-400 font-sans">
                          {currentLang === 'ar' ? 'بطاقة العضوية الإلكترونية الرسمية (صالحة للاستخدام والخصومات)' : 'Official Electronic Membership Card (Active for Discounts)'}
                        </span>
                      </div>

                      {/* Vector CSS Card */}
                      <div id="student-id-card" className="max-w-md mx-auto aspect-[1.58/1] bg-gradient-to-br from-[#163A4A] to-[#24495D] text-white rounded-xl shadow-2xl overflow-hidden p-5 border-2 border-[#C8B273] relative">
                        {/* Gold watermark */}
                        <div className="absolute top-2 right-2 opacity-15">
                          <LogoCrest className="h-28 w-28" />
                        </div>

                        {/* Top Header */}
                        <div className="flex items-center space-x-2.5 rtl:space-x-reverse border-b border-[#C8B273]/30 pb-3 mb-3">
                          <LogoCrest className="h-10 w-10" />
                          <div className="flex flex-col text-left rtl:text-right">
                            <span className="text-[10px] font-bold text-[#C8B273] font-sans tracking-wide uppercase">
                              Egyptian Students' Union - Iskenderun
                            </span>
                            <span className="text-[8px] font-mono text-slate-300">
                              Mısırlı Öğrenciler Birliği - İskenderun (MÖB)
                            </span>
                          </div>
                        </div>

                        {/* Card Content Grid */}
                        <div className="grid grid-cols-4 gap-3">
                          {/* Left avatar photo */}
                          <div className="col-span-1 flex flex-col items-center justify-center space-y-1">
                            <img 
                              src={trackedMembership.photoUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150'} 
                              alt="Student" 
                              className="h-20 w-16 object-cover rounded border border-[#C8B273]/50 bg-slate-800"
                            />
                            <span className="text-[7px] font-mono text-slate-400">ID PHOTO</span>
                          </div>

                          {/* Center info */}
                          <div className="col-span-3 text-left rtl:text-right text-[10px] space-y-1 sm:space-y-1.5 font-sans">
                            <p className="line-clamp-1"><strong className="text-slate-300">{currentLang === 'ar' ? 'الاسم:' : 'Name:'}</strong> <span className="font-semibold text-[#C8B273]">{currentLang === 'ar' ? trackedMembership.nameAr : trackedMembership.nameEn}</span></p>
                            <p className="line-clamp-1"><strong className="text-slate-300">{currentLang === 'ar' ? 'الجامعة:' : 'Univ:'}</strong> <span className="text-slate-200">{trackedMembership.university}</span></p>
                            <p className="line-clamp-1"><strong className="text-slate-300">{currentLang === 'ar' ? 'التخصص:' : 'Major:'}</strong> <span className="text-slate-200">{trackedMembership.faculty} - {trackedMembership.major}</span></p>
                            <p className="line-clamp-1"><strong className="text-slate-300">{currentLang === 'ar' ? 'رقم العضوية:' : 'Member No:'}</strong> <span className="font-mono text-[#C8B273] font-semibold">{trackedMembership.studentNumber}</span></p>
                            
                            <div className="flex justify-between items-center pt-1 border-t border-[#C8B273]/20">
                              <span className="text-[8px] text-slate-400 font-mono">EXP: 2027-01-12</span>
                              {/* Vector barcode mockup */}
                              <div className="flex items-center space-x-0.5 bg-white p-0.5 rounded">
                                <div className="w-[1px] h-3 bg-black"></div>
                                <div className="w-[2px] h-3 bg-black"></div>
                                <div className="w-[1px] h-3 bg-black"></div>
                                <div className="w-[1px] h-3 bg-black"></div>
                                <div className="w-[3px] h-3 bg-black"></div>
                                <div className="w-[1px] h-3 bg-black"></div>
                                <div className="w-[2px] h-3 bg-black"></div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Download trigger */}
                      <div className="text-center pt-2">
                        <button 
                          onClick={() => {
                            window.print();
                          }} 
                          className="px-6 py-2.5 bg-slate-800 text-white rounded font-bold text-xs flex items-center justify-center space-x-2 mx-auto cursor-pointer"
                        >
                          <Download className="h-4 w-4 text-[#C8B273]" />
                          <span>{currentLang === 'ar' ? 'طباعة وحفظ كرت العضوية (PDF)' : 'Print / Download Membership Card (PDF)'}</span>
                        </button>
                      </div>

                    </div>
                  )}

                </div>
              )}

            </div>
          )}

        </div>
      )}

      {/* 5. STUDENT GUIDE */}
      {activeTab === 'guide' && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          
          <div className="text-center space-y-2 mb-10">
            <h2 className="text-3xl font-bold text-[#163A4A] font-sans">
              {t('guide.title')}
            </h2>
            <p className="text-sm text-slate-500 max-w-xl mx-auto">
              {t('guide.sub')}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            
            {/* Guide sidebar tabs */}
            <div className="col-span-1 bg-white rounded-lg shadow-sm border border-slate-200 p-4 space-y-1 h-fit">
              {[
                { id: 'residence', label: currentLang === 'ar' ? 'إقامة الطالب' : currentLang === 'tr' ? 'Öğrenci İkameti' : 'Residence Permit' },
                { id: 'health', label: currentLang === 'ar' ? 'التأمين الصحي' : currentLang === 'tr' ? 'Sağlık Sigortası' : 'Health Insurance' },
                { id: 'transport', label: currentLang === 'ar' ? 'المواصلات المخفضة' : currentLang === 'tr' ? 'Toplu Taşıma' : 'Transportation' },
                { id: 'emergency', label: currentLang === 'ar' ? 'أرقام الطوارئ' : currentLang === 'tr' ? 'Acil Telefonlar' : 'Emergency Numbers' },
              ].map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setActiveGuideCategory(cat.id)}
                  className={`w-full text-right rtl:text-right ltr:text-left block px-4 py-3 rounded-md text-sm font-semibold transition-all cursor-pointer ${
                    activeGuideCategory === cat.id
                      ? 'bg-[#163A4A] text-[#C8B273]'
                      : 'text-slate-600 hover:bg-[#F7F5EC] hover:text-[#163A4A]'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            {/* Guide content area */}
            <div className="col-span-1 lg:col-span-3 bg-white rounded-lg shadow-sm border border-slate-200 p-6 sm:p-8 space-y-6">
              {guides.filter(g => g.category === activeGuideCategory).map(sec => (
                <div key={sec.id} className="space-y-6 animate-fade-in">
                  <h3 className="text-2xl font-bold text-[#163A4A] border-b border-[#C8B273]/30 pb-3 font-sans">
                    {sec.title[currentLang]}
                  </h3>
                  
                  {/* Content markup parsing with spacing */}
                  <div className="text-slate-600 leading-relaxed text-sm sm:text-base space-y-4 font-sans whitespace-pre-line">
                    {sec.content[currentLang]}
                  </div>

                  {sec.links && sec.links.length > 0 && (
                    <div className="border-t border-slate-100 pt-4 space-y-2">
                      <span className="block text-xs font-bold text-slate-400 font-mono">USEFUL LINK RESOURCES / روابط الهيئات</span>
                      <div className="flex flex-wrap gap-3">
                        {sec.links.map((lnk, idx) => (
                          <a 
                            key={idx} 
                            href={lnk.url} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="inline-flex items-center space-x-1 px-4 py-2 bg-[#F7F5EC] text-[#163A4A] font-bold text-xs rounded border border-[#C8B273]/30 hover:bg-[#163A4A] hover:text-white transition-all rtl:space-x-reverse"
                          >
                            <span>{lnk.title[currentLang]}</span>
                            <ArrowRight className="h-3 w-3 rtl:rotate-180" />
                          </a>
                        ))}
                      </div>
                    </div>
                  )}

                </div>
              ))}
            </div>

          </div>

          {/* Guide FAQS */}
          <div className="mt-12 bg-[#F7F5EC] border border-[#C8B273]/20 rounded-lg p-6 sm:p-8 space-y-4 font-sans">
            <h4 className="text-lg font-bold text-[#163A4A] mb-4">
              {currentLang === 'ar' ? 'الأسئلة الشائعة للطلاب المصريين' : 'Frequently Asked Questions (FAQ)'}
            </h4>
            <div className="space-y-4">
              <details className="group bg-white p-4 rounded border border-slate-200 cursor-pointer">
                <summary className="font-bold text-xs sm:text-sm text-[#163A4A] list-none flex justify-between items-center">
                  <span>{currentLang === 'ar' ? 'هل يحق للطالب العمل قانونياً في تركيا بموجب إقامة الطالب؟' : 'Can student work legally with student permit?'}</span>
                  <span className="text-[#C8B273] font-bold">+</span>
                </summary>
                <p className="text-xs sm:text-sm text-slate-500 mt-2 leading-relaxed">
                  {currentLang === 'ar' 
                    ? 'نعم، بموجب اللوائح التركية الجديدة، يحق لطلاب البكالوريوس العمل بدوام جزئي (24 ساعة أسبوعياً) بعد السنة الأولى، ويحق لطلاب الدراسات العليا (الماجستير والدكتوراه) العمل فوراً بمجرد استخراج إذن العمل الرسمي.'
                    : 'Yes, undergrads can work part-time up to 24 hours weekly starting from their sophomore year. Master/PhD candidates can secure work permits immediately upon arrival.'}
                </p>
              </details>
              <details className="group bg-white p-4 rounded border border-slate-200 cursor-pointer">
                <summary className="font-bold text-xs sm:text-sm text-[#163A4A] list-none flex justify-between items-center">
                  <span>{currentLang === 'ar' ? 'كيف أقوم بمعادلة شهادتي الثانوية المصرية في تركيا؟' : 'How to do Egyptian high-school equivalency (Denklik)?'}</span>
                  <span className="text-[#C8B273] font-bold">+</span>
                </summary>
                <p className="text-xs sm:text-sm text-slate-500 mt-2 leading-relaxed">
                  {currentLang === 'ar' 
                    ? 'يتم ذلك عن طريق حجز موعد معادلة إلكتروني (Denklik) وتجهيز شهادة الثانوية العامة الأصلية (مصدقة من الخارجية المصرية) مع بيان الدرجات وجواز السفر وتأشيرة الدخول، وتوجهك لمديرية التربية والتعليم الوطنية (Milli Eğitim Müdürlüğü) بهاتاي.'
                    : 'File for equivalency (Denklik) appointment via MEB portal. Bring notarized, Egyptian Foreign Ministry-authenticated high school transcripts, passport, and entry visa to local Hatay MEB office.'}
                </p>
              </details>
            </div>
          </div>

        </div>
      )}

      {/* 6. EVENTS VIEW */}
      {activeTab === 'events' && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10 animate-fade-in">
          
          <div className="text-center space-y-2 mb-4">
            <h2 className="text-3xl font-bold text-[#163A4A] font-sans">
              {t('events.title')}
            </h2>
            <p className="text-sm text-slate-500 max-w-xl mx-auto">
              {currentLang === 'ar' ? 'سجل في الفعاليات والندوات الرياضية والتعليمية التي يقيمها الاتحاد واستخرج تذكرتك الشخصية.' : 'Discover and register for certified workshops, excursions, and activities.'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {events.map((ev) => (
              <div key={ev.id} className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden flex flex-col justify-between group">
                <div>
                  <div className="relative h-48 overflow-hidden bg-slate-100">
                    <img src={ev.image} alt={ev.title[currentLang]} className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500" />
                    <div className="absolute top-4 left-4 bg-[#163A4A] text-[#C8B273] px-3 py-1 rounded text-xs font-semibold uppercase">
                      {ev.category}
                    </div>
                  </div>
                  <div className="p-6 space-y-3">
                    <h3 className="font-bold text-lg text-[#163A4A] font-sans line-clamp-1">{ev.title[currentLang]}</h3>
                    <p className="text-xs sm:text-sm text-slate-500 leading-relaxed line-clamp-3">{ev.description[currentLang]}</p>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-600 font-sans pt-2 border-t border-slate-100">
                      <div className="flex items-center space-x-1.5 rtl:space-x-reverse">
                        <Calendar className="h-4 w-4 text-[#C8B273]" />
                        <span>{ev.date}</span>
                      </div>
                      <div className="flex items-center space-x-1.5 rtl:space-x-reverse">
                        <Clock className="h-4 w-4 text-[#C8B273]" />
                        <span>{ev.time}</span>
                      </div>
                      <div className="flex items-center space-x-1.5 rtl:space-x-reverse col-span-1 sm:col-span-2">
                        <MapPin className="h-4 w-4 text-[#C8B273]" />
                        <span className="truncate">{ev.location[currentLang]}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-6 pt-0 border-t border-slate-50">
                  {registeredTickets[ev.id] ? (
                    <div className="bg-green-50 border border-green-200 p-4 rounded-lg flex flex-col items-center justify-center space-y-3">
                      <div className="flex items-center space-x-2 text-green-800 text-xs font-semibold">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span>{currentLang === 'ar' ? 'تم تسجيل حضورك! رمز تذكرتك الإلكترونية:' : 'Registered! Ticket Code:'}</span>
                      </div>
                      <span className="font-mono font-bold text-base text-[#163A4A] px-4 py-1.5 bg-[#C8B273]/20 border border-[#C8B273] rounded">
                        {registeredTickets[ev.id]}
                      </span>
                      
                      {/* Interactive mock QR Code */}
                      <div className="flex flex-col items-center space-y-1 bg-white p-2 rounded border border-slate-200">
                        <QrCode className="h-24 w-24 text-slate-800" />
                        <span className="text-[9px] font-mono text-slate-400">{ev.qrCodeValue}</span>
                      </div>
                      <span className="text-[10px] text-slate-400 text-center font-sans">
                        {currentLang === 'ar' ? 'يرجى تصوير الشاشة وإبراز رمز QR عند بوابات الدخول للتحضير' : 'Present QR to organizers on check-in'}
                      </span>
                    </div>
                  ) : (
                    <button
                      onClick={() => setRegisteringEvent(ev)}
                      className="w-full py-2.5 bg-[#163A4A] hover:bg-[#24495D] text-[#C8B273] font-bold text-sm rounded cursor-pointer transition-colors"
                    >
                      {t('events.register')}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Event Registration Form Modal */}
          {registeringEvent && (
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[110] flex items-center justify-center p-4">
              <div className="bg-white rounded-lg shadow-2xl max-w-md w-full overflow-hidden animate-fade-in text-slate-800">
                <div className="bg-[#163A4A] px-6 py-4 flex items-center justify-between border-b border-[#C8B273]/30">
                  <span className="font-bold text-white text-sm sm:text-base font-sans line-clamp-1">
                    {registeringEvent.title[currentLang]}
                  </span>
                  <button onClick={() => setRegisteringEvent(null)} className="text-slate-300 hover:text-white text-xl">×</button>
                </div>
                <form onSubmit={handleEventRegisterSubmit} className="p-6 space-y-4 font-sans">
                  <div className="p-3 bg-slate-50 border rounded text-xs text-slate-500">
                    {currentLang === 'ar' ? 'سعة الفعالية محدودة! يرجى حجز المقعد بالبيانات الصحيحة.' : 'Limited seats! Secure ticket with authentic details.'}
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">{currentLang === 'ar' ? 'الاسم الكامل بالإنجليزية' : 'Full Name (Latin)'} *</label>
                    <input required type="text" value={regName} onChange={(e) => setRegName(e.target.value)} className="w-full px-3 py-2 border border-slate-300 rounded text-sm" placeholder="e.g. Aly Aly" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">{currentLang === 'ar' ? 'البريد الإلكتروني' : 'Email Address'} *</label>
                    <input required type="email" value={regEmail} onChange={(e) => setRegEmail(e.target.value)} className="w-full px-3 py-2 border border-slate-300 rounded text-sm" placeholder="aly@example.com" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">{currentLang === 'ar' ? 'رقم الهاتف' : 'Phone Number'} *</label>
                    <input required type="tel" value={regPhone} onChange={(e) => setRegPhone(e.target.value)} className="w-full px-3 py-2 border border-slate-300 rounded text-sm" placeholder="+90 5xx xxx xxxx" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">{currentLang === 'ar' ? 'رقم الواتساب (إذا اختلف)' : 'WhatsApp (if different)'}</label>
                    <input type="tel" value={regWhatsapp} onChange={(e) => setRegWhatsapp(e.target.value)} className="w-full px-3 py-2 border border-slate-300 rounded text-sm" placeholder="+20 1xx xxx xxxx" />
                  </div>

                  <div className="flex space-x-3 rtl:space-x-reverse pt-2">
                    <button type="button" onClick={() => setRegisteringEvent(null)} className="flex-1 py-2 border rounded text-sm hover:bg-slate-50">
                      {currentLang === 'ar' ? 'إلغاء' : 'Cancel'}
                    </button>
                    <button type="submit" className="flex-1 py-2 bg-[#163A4A] text-[#C8B273] font-bold rounded text-sm hover:bg-[#24495D]">
                      {currentLang === 'ar' ? 'تأكيد الحجز' : 'Confirm Spot'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

        </div>
      )}

      {/* 7. ACTIVITIES VIEW */}
      {activeTab === 'activities' && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10 animate-fade-in">
          <div className="text-center space-y-2 mb-4">
            <h2 className="text-3xl font-bold text-[#163A4A] font-sans">
              {t('nav.activities')}
            </h2>
            <p className="text-sm text-slate-500 max-w-xl mx-auto">
              {currentLang === 'ar' ? 'شاهد مبادرات الاتحاد المجتمعية، والأيام التطوعية والمشاريع الرياضية التي ينظمها لخدمة ورعاية الطلاب.' : 'Review community activities, reforestation drives, and athletic tournaments.'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {activities.map(act => (
              <div key={act.id} className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden group flex flex-col justify-between">
                <div>
                  <div className="relative h-56 overflow-hidden bg-slate-100">
                    <img src={act.image} alt={act.title[currentLang]} className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500" />
                    <div className="absolute top-4 left-4 bg-[#C8B273] text-[#163A4A] px-3 py-1 rounded text-[10px] font-bold uppercase tracking-wider">
                      {act.category}
                    </div>
                  </div>
                  <div className="p-6 space-y-3">
                    <span className="text-[10px] text-slate-400 font-mono flex items-center space-x-1 rtl:space-x-reverse">
                      <Clock className="h-3.5 w-3.5" />
                      <span>{act.date}</span>
                    </span>
                    <h3 className="font-bold text-lg text-[#163A4A] font-sans">{act.title[currentLang]}</h3>
                    <p className="text-xs sm:text-sm text-slate-500 leading-relaxed font-sans">{act.description[currentLang]}</p>
                  </div>
                </div>

                {act.mediaCoverageUrl && (
                  <div className="p-6 pt-0">
                    <a 
                      href={act.mediaCoverageUrl} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="inline-flex items-center space-x-1.5 text-xs font-bold text-[#C8B273] hover:underline rtl:space-x-reverse"
                    >
                      <span>{currentLang === 'ar' ? 'رابط التغطية الصحفية والإعلامية للمبادرة' : 'Press & Media Coverage Link'}</span>
                      <ArrowRight className="h-3.5 w-3.5 rtl:rotate-180" />
                    </a>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 8. ANNOUNCEMENTS VIEW */}
      {activeTab === 'announcements' && (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10 animate-fade-in">
          <div className="text-center space-y-2">
            <h2 className="text-3xl font-bold text-[#163A4A] font-sans">
              {t('nav.announcements')}
            </h2>
            <p className="text-sm text-slate-500">
              {currentLang === 'ar' ? 'تابع الإعلانات والفرص التعليمية والمنح والتدريب والمستجدات الطارئة للاتحاد.' : 'Browse open scholarships, training opportunities, and student circulars.'}
            </p>
          </div>

          {/* Search/Filter bar */}
          <div className="flex bg-white p-3 rounded-lg border border-slate-200 shadow-sm space-x-3 rtl:space-x-reverse items-center">
            <Search className="h-5 w-5 text-slate-400 shrink-0" />
            <input 
              type="text" 
              value={searchQuery} 
              onChange={(e) => setSearchQuery(e.target.value)} 
              className="flex-1 bg-transparent border-none text-sm focus:outline-none focus:ring-0" 
              placeholder={currentLang === 'ar' ? 'بحث في الإعلانات المتاحة والمنح...' : 'Search active circulars or scholarships...'} 
            />
          </div>

          <div className="space-y-6">
            {announcements
              .filter(a => searchQuery === '' || a.title[currentLang].toLowerCase().includes(searchQuery.toLowerCase()) || a.content[currentLang].toLowerCase().includes(searchQuery.toLowerCase()))
              .map(ann => (
                <div 
                  key={ann.id} 
                  className={`bg-white rounded-lg shadow-sm border p-6 space-y-4 relative overflow-hidden transition-all duration-300 ${
                    ann.isPinned ? 'border-[#C8B273] bg-[#F7F5EC]/30' : 'border-slate-200'
                  }`}
                >
                  {ann.isPinned && (
                    <div className="absolute top-0 right-0 rtl:left-0 rtl:right-auto bg-[#C8B273] text-[#163A4A] text-[9px] font-bold px-3 py-1 uppercase tracking-wider rounded-bl rtl:rounded-bl-none rtl:rounded-br font-mono">
                      PINNED / مثبت
                    </div>
                  )}

                  <div className="space-y-2">
                    <div className="flex items-center space-x-2 text-[10px] text-slate-400 font-mono rtl:space-x-reverse">
                      <span>{ann.publishDate}</span>
                      <span>•</span>
                      <span className="uppercase text-[#163A4A] font-bold">{ann.category}</span>
                    </div>
                    <h3 className="font-bold text-lg text-[#163A4A] font-sans leading-tight">
                      {ann.title[currentLang]}
                    </h3>
                  </div>

                  {ann.image && (
                    <img src={ann.image} alt={ann.title[currentLang]} className="w-full h-48 object-cover rounded border" />
                  )}

                  <div className="text-slate-600 leading-relaxed text-sm whitespace-pre-line font-sans">
                    {ann.content[currentLang]}
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* 9. MEDIA CENTER VIEW */}
      {activeTab === 'media' && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10 animate-fade-in">
          <div className="text-center space-y-2 mb-4">
            <h2 className="text-3xl font-bold text-[#163A4A] font-sans">
              {t('nav.media')}
            </h2>
            <p className="text-sm text-slate-500 max-w-xl mx-auto">
              {t('media.gallery')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {media.map(item => (
              <div key={item.id} className="bg-white rounded-lg overflow-hidden shadow-sm border border-slate-200 flex flex-col justify-between group">
                <div>
                  {item.type === 'photo' && (
                    <img src={item.url} alt={item.title[currentLang]} className="w-full h-48 object-cover group-hover:scale-102 transition-transform duration-300" />
                  )}
                  {item.type === 'video' && (
                    <div className="relative aspect-video bg-black">
                      <iframe 
                        className="w-full h-full" 
                        src={item.url} 
                        title={item.title[currentLang]} 
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                        allowFullScreen
                      ></iframe>
                    </div>
                  )}
                  {item.type === 'magazine' && item.thumbnail && (
                    <img src={item.thumbnail} alt={item.title[currentLang]} className="w-full h-56 object-cover" />
                  )}

                  <div className="p-5 space-y-2">
                    <span className="text-[9px] font-mono text-slate-400 block">{item.date} • {item.type.toUpperCase()}</span>
                    <h4 className="font-bold text-sm text-[#163A4A] font-sans line-clamp-2">{item.title[currentLang]}</h4>
                  </div>
                </div>

                <div className="p-5 pt-0 border-t border-slate-50">
                  <button 
                    onClick={() => {
                      alertDialog(currentLang === 'ar' ? 'جاري محاكاة تنزيل الملف المرفق!' : 'Downloading attached resource mock...');
                    }}
                    className="w-full py-1.5 border border-[#C8B273] text-[#163A4A] font-bold text-xs rounded hover:bg-[#163A4A] hover:text-white transition-colors cursor-pointer flex items-center justify-center space-x-1.5"
                  >
                    <Download className="h-3.5 w-3.5" />
                    <span>{currentLang === 'ar' ? 'تحميل المستند أو المجلة (PDF)' : 'Download PDF Document'}</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 10. CONTACT & COMPLAINTS VIEW */}
      {activeTab === 'contact' && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12 animate-fade-in font-sans">
          
          <div className="text-center space-y-2 mb-4">
            <h2 className="text-3xl font-bold text-[#163A4A] font-sans">
              {t('contact.header')}
            </h2>
            <p className="text-sm text-slate-500">
              {currentLang === 'ar' ? 'تواصل معنا مباشرة أو تتبع شكواك واقتراحك المقدم للأمانة العامة.' : 'Message our general desks or lodge suggestional complaint tickets.'}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* Direct contact and Suggesion Form split */}
            <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6 sm:p-8 space-y-6">
              <span className="block font-bold text-lg text-[#163A4A] border-b border-slate-100 pb-3">
                {currentLang === 'ar' ? 'نموذج الاتصال والاستفسار المباشر' : 'Send Direct Message Inquiry'}
              </span>

              <form onSubmit={handleContactSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">{currentLang === 'ar' ? 'الاسم' : 'Name'} *</label>
                  <input required type="text" value={contactName} onChange={(e) => setContactName(e.target.value)} className="w-full px-3 py-2 border border-slate-300 rounded text-sm" placeholder="Aly" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">{currentLang === 'ar' ? 'البريد الإلكتروني' : 'Email'} *</label>
                    <input required type="email" value={contactEmail} onChange={(e) => setContactEmail(e.target.value)} className="w-full px-3 py-2 border border-slate-300 rounded text-sm" placeholder="aly@gmail.com" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">{currentLang === 'ar' ? 'رقم الهاتف' : 'Phone'}</label>
                    <input type="tel" value={contactPhone} onChange={(e) => setContactPhone(e.target.value)} className="w-full px-3 py-2 border border-slate-300 rounded text-sm" placeholder="+90" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">{currentLang === 'ar' ? 'موضوع الرسالة' : 'Subject'}</label>
                  <input type="text" value={contactSubject} onChange={(e) => setContactSubject(e.target.value)} className="w-full px-3 py-2 border border-slate-300 rounded text-sm" placeholder="Inquiry" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">{currentLang === 'ar' ? 'محتوى الرسالة' : 'Message Contents'} *</label>
                  <textarea required rows={4} value={contactMsg} onChange={(e) => setContactMsg(e.target.value)} className="w-full px-3 py-2 border border-slate-300 rounded text-sm" placeholder="Write here..." />
                </div>
                <button type="submit" className="w-full py-2.5 bg-[#163A4A] text-[#C8B273] font-bold rounded text-sm hover:bg-[#24495D] flex items-center justify-center space-x-2 cursor-pointer">
                  <Send className="h-4 w-4" />
                  <span>{t('contact.sendBtn')}</span>
                </button>
              </form>
            </div>

            {/* Suggesional Complaint & CRM tracking ticket */}
            <div className="bg-[#F7F5EC] rounded-lg border border-[#C8B273]/30 p-6 sm:p-8 space-y-6 flex flex-col justify-between">
              
              <div className="space-y-4">
                <span className="block font-bold text-lg text-[#163A4A] border-b border-[#C8B273]/20 pb-3">
                  {t('contact.complaints')}
                </span>
                <p className="text-xs text-slate-500 leading-relaxed">
                  {t('contact.complaintSub')}
                </p>

                {complaintTicketCreated ? (
                  <div className="bg-white border border-[#C8B273] rounded-lg p-5 text-center space-y-4">
                    <CheckCircle className="h-10 w-10 text-green-600 mx-auto" />
                    <p className="text-sm font-semibold text-[#163A4A] leading-normal">
                      {t('contact.ticketCreated')}
                    </p>
                    <span className="text-xl font-mono font-bold text-[#163A4A] block bg-[#F7F5EC] p-2 rounded border border-slate-200">
                      {complaintTicketCreated}
                    </span>
                    <button 
                      onClick={() => {
                        setTrackedTicketCode(complaintTicketCreated);
                        handleTrackComplaint();
                        setComplaintTicketCreated('');
                      }}
                      className="text-xs font-bold text-[#163A4A] hover:underline"
                    >
                      {currentLang === 'ar' ? 'عرض تذكرة الشكوى الخاصة بي والردود فوراً' : 'View my Ticket replies instantly'}
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleComplaintSubmit} className="space-y-3 font-sans text-xs">
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block font-semibold text-slate-600 mb-1">{currentLang === 'ar' ? 'الاسم الثنائي' : 'Full Name'}</label>
                        <input required type="text" value={complaintName} onChange={(e) => setComplaintName(e.target.value)} className="w-full px-3 py-1.5 border border-slate-300 rounded bg-white" placeholder="Aly" />
                      </div>
                      <div>
                        <label className="block font-semibold text-slate-600 mb-1">{currentLang === 'ar' ? 'البريد الإلكتروني' : 'Email'}</label>
                        <input required type="email" value={complaintEmail} onChange={(e) => setComplaintEmail(e.target.value)} className="w-full px-3 py-1.5 border border-slate-300 rounded bg-white" placeholder="aly@gmail.com" />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-2">
                      <div className="col-span-2">
                        <label className="block font-semibold text-slate-600 mb-1">{currentLang === 'ar' ? 'رقم الهاتف' : 'Phone'}</label>
                        <input type="tel" value={complaintPhone} onChange={(e) => setComplaintPhone(e.target.value)} className="w-full px-3 py-1.5 border border-slate-300 rounded bg-white" placeholder="+90" />
                      </div>
                      <div>
                        <label className="block font-semibold text-slate-600 mb-1">{currentLang === 'ar' ? 'الأولوية' : 'Priority'}</label>
                        <select value={complaintPriority} onChange={(e) => setComplaintPriority(e.target.value as any)} className="w-full px-2 py-1.5 border border-slate-300 rounded bg-white">
                          <option value="low">Low</option>
                          <option value="medium">Medium</option>
                          <option value="high">High</option>
                          <option value="urgent">Urgent</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-2">
                      <div className="col-span-1">
                        <label className="block font-semibold text-slate-600 mb-1">{currentLang === 'ar' ? 'فئة الشكوى' : 'Category'}</label>
                        <select value={complaintCat} onChange={(e) => setComplaintCat(e.target.value as any)} className="w-full px-2 py-1.5 border border-slate-300 rounded bg-white">
                          <option value="academic">Academic</option>
                          <option value="services">Services</option>
                          <option value="logistics">Logistics</option>
                          <option value="harassment_safety">Safety</option>
                          <option value="union_activities">Activities</option>
                          <option value="other">Other</option>
                        </select>
                      </div>
                      <div className="col-span-2">
                        <label className="block font-semibold text-slate-600 mb-1">{currentLang === 'ar' ? 'موضوع التذكرة' : 'Ticket Subject'}</label>
                        <input required type="text" value={complaintSub} onChange={(e) => setComplaintSub(e.target.value)} className="w-full px-3 py-1.5 border border-slate-300 rounded bg-white" placeholder="Issue title" />
                      </div>
                    </div>

                    <div>
                      <label className="block font-semibold text-slate-600 mb-1">{currentLang === 'ar' ? 'التفاصيل والوقائع والأثر الجانبي' : 'Incident Details'} *</label>
                      <textarea required rows={3} value={complaintDetails} onChange={(e) => setComplaintDetails(e.target.value)} className="w-full px-3 py-1.5 border border-slate-300 rounded bg-white" placeholder="Detailed logs..." />
                    </div>

                    <button type="submit" className="w-full py-2 bg-slate-800 hover:bg-slate-950 text-[#C8B273] font-bold rounded">
                      {currentLang === 'ar' ? 'تسجيل تذكرة الشكوى والمتابعة' : 'Lodge Formal Complaint Ticket'}
                    </button>
                  </form>
                )}
              </div>

              {/* Live Ticket tracker check */}
              <div className="border-t border-[#C8B273]/20 pt-4 mt-4 space-y-3">
                <span className="block font-bold text-xs text-[#163A4A] uppercase font-mono">
                  {currentLang === 'ar' ? 'التحقق وتتبع تذكرة سابقة' : 'Track Existing Complaint Ticket'}
                </span>
                <div className="flex space-x-2 rtl:space-x-reverse">
                  <input 
                    type="text" 
                    value={trackedTicketCode} 
                    onChange={(e) => setTrackedTicketCode(e.target.value)} 
                    className="flex-1 px-3 py-1 bg-white border border-slate-300 rounded text-xs font-mono" 
                    placeholder="e.g. MOB-REQ-2026-xxx" 
                  />
                  <button onClick={handleTrackComplaint} className="px-4 py-1.5 bg-[#163A4A] text-white font-bold rounded text-xs">
                    {currentLang === 'ar' ? 'تتبع' : 'Track'}
                  </button>
                </div>

                {trackedComplaint && (
                  <div className="bg-white p-4 rounded border border-slate-200 mt-2 space-y-3 animate-fade-in text-xs text-slate-700">
                    <div className="flex items-center justify-between border-b pb-2">
                      <span className="font-bold text-[#163A4A]">{trackedComplaint.ticketNumber}</span>
                      <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase ${
                        trackedComplaint.status === 'resolved' ? 'bg-green-100 text-green-800' :
                        trackedComplaint.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
                        trackedComplaint.status === 'under_review' ? 'bg-yellow-100 text-yellow-800' : 'bg-slate-100 text-slate-800'
                      }`}>
                        {trackedComplaint.status}
                      </span>
                    </div>
                    <p><strong>{currentLang === 'ar' ? 'الموضوع:' : 'Subject:'}</strong> {trackedComplaint.subject}</p>
                    <p><strong>{currentLang === 'ar' ? 'التفاصيل:' : 'Details:'}</strong> {trackedComplaint.details}</p>
                    
                    {trackedComplaint.responses && trackedComplaint.responses.length > 0 && (
                      <div className="border-t pt-2 mt-2 space-y-2">
                        <span className="font-bold text-slate-400 block uppercase text-[9px]">Replies / الردود الرسمية</span>
                        {trackedComplaint.responses.map(resp => (
                          <div key={resp.id} className="bg-[#F7F5EC] p-2 rounded border border-slate-100">
                            <span className="font-bold text-[#163A4A] block">{resp.authorName}</span>
                            <p className="mt-1">{resp.message}</p>
                            <span className="text-[8px] text-slate-400 block mt-1 font-mono">{resp.date.substring(0, 16)}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>

            </div>

          </div>

          {/* Map & Office locations */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-white p-6 rounded-lg shadow-sm border border-slate-200 font-sans">
            <div className="md:col-span-1 space-y-4">
              <span className="block font-bold text-lg text-[#163A4A]">
                {currentLang === 'ar' ? 'العنوان والمكتب الفعلي' : 'Physical Location Details'}
              </span>
              <p className="text-xs text-slate-500 leading-relaxed">
                {settings.address[currentLang]}
              </p>
              <div className="border-t pt-3 space-y-2 text-xs">
                <p><strong>{currentLang === 'ar' ? 'ساعات العمل:' : 'Office Hours:'}</strong> {settings.officeHours[currentLang]}</p>
                <p><strong>{currentLang === 'ar' ? 'واتساب الأمانة:' : 'WhatsApp Desk:'}</strong> <a href={`https://wa.me/${settings.whatsapp}`} className="text-[#C8B273] underline">{settings.whatsapp}</a></p>
                <p><strong>{currentLang === 'ar' ? 'البريد الرسمي:' : 'Bureau Email:'}</strong> {settings.email}</p>
              </div>
            </div>
            
            <div className="md:col-span-2 h-60 rounded-md overflow-hidden border border-slate-200 relative">
              <iframe 
                src={settings.googleMapUrl}
                width="100%" 
                height="100%" 
                style={{ border: 0 }} 
                allowFullScreen={false} 
                loading="lazy"
                referrerPolicy="no-referrer"
              ></iframe>
            </div>
          </div>

        </div>
      )}

    </div>
  );
};
