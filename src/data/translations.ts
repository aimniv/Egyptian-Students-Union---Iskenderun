import { Language } from '../types';

export const INITIAL_TRANSLATIONS: Record<string, { ar: string; tr: string; en: string }> = {
  // Navigation & General
  'nav.home': {
    ar: 'الرئيسية',
    tr: 'Ana Sayfa',
    en: 'Home'
  },
  'nav.about': {
    ar: 'عن الاتحاد',
    tr: 'Hakkımızda',
    en: 'About Us'
  },
  'nav.board': {
    ar: 'الهيئة التنفيذية',
    tr: 'Yönetim Kurulu',
    en: 'Executive Board'
  },
  'nav.membership': {
    ar: 'العضوية',
    tr: 'Üyelik',
    en: 'Membership'
  },
  'nav.guide': {
    ar: 'دليل الطالب',
    tr: 'Öğrenci Rehberi',
    en: 'Student Guide'
  },
  'nav.events': {
    ar: 'الفعاليات',
    tr: 'Etkinlikler',
    en: 'Events'
  },
  'nav.activities': {
    ar: 'الأنشطة',
    tr: 'Faaliyetler',
    en: 'Activities'
  },
  'nav.announcements': {
    ar: 'الإعلانات',
    tr: 'Duyurular',
    en: 'Announcements'
  },
  'nav.media': {
    ar: 'المركز الإعلامي',
    tr: 'Medya Merkezi',
    en: 'Media Center'
  },
  'nav.contact': {
    ar: 'اتصل بنا',
    tr: 'İletişim',
    en: 'Contact Us'
  },
  'nav.adminPortal': {
    ar: 'بوابة الإدارة',
    tr: 'Yönetici Paneli',
    en: 'Admin Portal'
  },
  'nav.clientPortal': {
    ar: 'بوابة الطلاب',
    tr: 'Öğrenci Portalı',
    en: 'Student Portal'
  },

  // Hero & Homepage Titles
  'home.welcome': {
    ar: 'أهلاً بكم في الموقع الرسمي لاتحاد الطلاب المصريين بإسكندرون',
    tr: 'Mısırlı Öğrenciler Birliği - İskenderun Resmi Web Sitesine Hoş Geldiniz',
    en: 'Welcome to the Official Website of the Egyptian Students\' Union - Iskenderun'
  },
  'home.subtitle': {
    ar: 'صوت الطلاب المصريين، بيتهم الثاني، وبوابتهم للتميز والنجاح الأكاديمي والاجتماعي في تركيا.',
    tr: 'Türkiye\'de Mısırlı öğrencilerin sesi, ikinci evi ve akademik/sosyal başarıya açılan kapısı.',
    en: 'The voice of Egyptian students, their second home, and their gateway to academic and social excellence in Türkiye.'
  },
  'home.applyBtn': {
    ar: 'قدم طلب عضوية الآن',
    tr: 'Şimdi Üye Ol',
    en: 'Apply for Membership'
  },
  'home.guideBtn': {
    ar: 'تصفح دليل الطالب الكلي',
    tr: 'Öğrenci Rehberini İncele',
    en: 'Browse Student Guide'
  },
  'home.stats.title': {
    ar: 'الاتحاد في أرقام',
    tr: 'Rakamlarla Birliğimiz',
    en: 'Union in Numbers'
  },
  'home.stats.members': {
    ar: 'عضو مسجل',
    tr: 'Kayıtlı Üye',
    en: 'Registered Members'
  },
  'home.stats.events': {
    ar: 'فعالية سنوية',
    tr: 'Yıllık Etkinlik',
    en: 'Annual Events'
  },
  'home.stats.years': {
    ar: 'سنوات من الخدمة',
    tr: 'Yıllık Hizmet',
    en: 'Years of Service'
  },
  'home.stats.partners': {
    ar: 'جامعات ومؤسسات شريكة',
    tr: 'Anlaşmalı Üniversite ve Kurumlar',
    en: 'Partner Institutions'
  },
  'home.pres.title': {
    ar: 'كلمة رئيس الاتحاد',
    tr: 'Birlik Başkanı\'nın Mesajı',
    en: 'President\'s Address'
  },
  'home.pres.text': {
    ar: 'أبنائي وإخواني الطلاب المصريين في إسكندرون، نرحب بكم في بيتكم الأكاديمي والثقافي والاجتماعي. نسعى دائماً لنكون الجسر الذي يربطكم بوطنكم الحبيب مصر، والمحفز الذي يدعم مسيرتكم العلمية والاجتماعية في تركيا. نلتزم بتقديم كافة المساعدات الأكاديمية والخدمية والإرشادية لتسهيل غربتكم وتحقيق تطلعاتكم الواعدة.',
    tr: 'İskenderun\'daki sevgili Mısırlı öğrenci kardeşlerim, sizi akademik, kültürel ve sosyal evinizde sevgiyle selamlıyoruz. Sizleri sevgili vatanımız Mısır\'a bağlayan köprü olmak ve Türkiye\'deki akademik ve sosyal yolculuğunuzu desteklemek için her zaman çabalıyoruz. Eğitim hayatınızı kolaylaştırmak ve hedeflerinize ulaşmanızı sağlamak için her türlü akademik, lojistik ve rehberlik desteğini sunmayı taahhüt ediyoruz.',
    en: 'My fellow Egyptian students in Iskenderun, we welcome you to your academic, cultural, and social home. We strive to be the bridge that connects you to our beloved homeland Egypt, and the catalyst that supports your scientific and social journey in Türkiye. We commit to providing all academic, service, and guidance assistance to ease your transition and help you achieve your promising aspirations.'
  },

  // About Page
  'about.history.title': {
    ar: 'تاريخ الاتحاد',
    tr: 'Birliğin Tarihçesi',
    en: 'History of the Union'
  },
  'about.history.text': {
    ar: 'تأسس اتحاد الطلاب المصريين في إسكندرون ليكون الهيئة الطلابية الرسمية التي تجمع وترعى شؤون الطلاب الدارسين في جامعة إسكندرون التقنية والجامعات المجاورة. منذ اليوم الأول، عمل الاتحاد كحلقة وصل مع الملحقية الثقافية المصرية والسلطات المحلية لتوفير بيئة تعليمية واجتماعية مثالية للطلاب.',
    tr: 'İskenderun Mısırlı Öğrenciler Birliği (MÖB), İskenderun Teknik Üniversitesi ve çevre üniversitelerde eğitim gören Mısırlı öğrencilerin resmi temsilcisi ve destekçisi olarak kurulmuştur. Kurulduğu günden bu yana birlik, öğrencilere ideal bir eğitim ve sosyal ortam sağlamak amacıyla Mısır Kültür Ataşeliği ve yerel makamlarla köprü vazifesi görmüştür.',
    en: 'The Egyptian Students\' Union in Iskenderun was established to be the official student body gathering and supervising the affairs of students studying at Iskenderun Technical University and neighboring universities. Since day one, the union has served as a liaison with the Egyptian Cultural Attaché and local authorities to provide an ideal educational and social environment.'
  },
  'about.mission.title': {
    ar: 'رسالتنا',
    tr: 'Misyonumuz',
    en: 'Our Mission'
  },
  'about.mission.text': {
    ar: 'تقديم خدمات متكاملة ومتميزة تشمل الجوانب الأكاديمية والاجتماعية والثقافية والرياضية للطلبة المصريين في إسكندرون، والعمل على دمجهم الإيجابي في المجتمع التركي مع المحافظة على هويتهم الوطنية والثقافية الأصيلة.',
    tr: 'İskenderun\'daki Mısırlı öğrencilere akademik, sosyal, kültürel ve sportif alanlarda entegre ve üstün hizmetler sunmak, milli ve kültürel kimliklerini korurken Türk toplumuna olumlu entegrasyonlarını kolaylaştırmaktır.',
    en: 'To provide integrated and distinguished services covering academic, social, cultural, and sports aspects for Egyptian students in Iskenderun, and facilitate their positive integration into Turkish society while preserving their authentic national and cultural identity.'
  },
  'about.vision.title': {
    ar: 'رؤيتنا',
    tr: 'Vizyonumuz',
    en: 'Our Vision'
  },
  'about.vision.text': {
    ar: 'أن نكون النموذج الريادي والمنصة الطلابية الرسمية الأكثر تأثيراً وتنظيماً في خدمة ورعاية وتمكين الطلاب المصريين في تركيا، وبناء جيل متميز قيادياً وأكاديمياً.',
    tr: 'Türkiye\'deki Mısırlı öğrencilerin hizmetinde, bakımında ve güçlendirilmesinde en etkili, düzenli resmi öğrenci platformu ve lider model olmak; akademik ve liderlik yönünden üstün bir nesil yetiştirmektir.',
    en: 'To be the pioneering model and the most influential and organized official student platform serving, caring for, and empowering Egyptian students in Türkiye, and building a generation distinguished in leadership and academics.'
  },
  'about.constitution.title': {
    ar: 'دستور اللائحة الداخلية للاتحاد',
    tr: 'Birlik Tüzüğü ve İç Yönetmeliği',
    en: 'Union Constitution & Internal Regulations'
  },

  // Membership Page
  'membership.title': {
    ar: 'بوابة العضوية الطلابية',
    tr: 'Öğrenci Üyelik Portalı',
    en: 'Student Membership Portal'
  },
  'membership.statusCheck': {
    ar: 'تتبع حالة طلب العضوية',
    tr: 'Üyelik Başvuru Durumu Sorgula',
    en: 'Track Membership Status'
  },
  'membership.applyForm': {
    ar: 'استمارة طلب عضوية جديدة',
    tr: 'Yeni Üyelik Başvuru Formu',
    en: 'New Membership Application Form'
  },
  'membership.renewForm': {
    ar: 'تجديد عضوية سابقة',
    tr: 'Üyelik Yenileme Formu',
    en: 'Membership Renewal Form'
  },
  'membership.fullnameAr': {
    ar: 'الاسم الكامل باللغة العربية (كما في جواز السفر)',
    tr: 'Arapça Tam İsim (Pasaporttaki gibi)',
    en: 'Full Name in Arabic (as in passport)'
  },
  'membership.fullnameEn': {
    ar: 'الاسم الكامل باللغة الإنجليزية',
    tr: 'İngilizce Tam İsim',
    en: 'Full Name in English'
  },
  'membership.passport': {
    ar: 'رقم جواز السفر أو الهوية التركية (T.C.)',
    tr: 'Pasaport veya T.C. Kimlik Numarası',
    en: 'Passport or Turkish ID (T.C.) Number'
  },
  'membership.university': {
    ar: 'الجامعة',
    tr: 'Üniversite',
    en: 'University'
  },
  'membership.faculty': {
    ar: 'الكلية / المعهد',
    tr: 'Fakülte / Yüksekokul',
    en: 'Faculty / Institute'
  },
  'membership.major': {
    ar: 'التخصص الدراسي',
    tr: 'Bölüm',
    en: 'Major / Field of Study'
  },
  'membership.year': {
    ar: 'السنة الدراسية',
    tr: 'Sınıf',
    en: 'Academic Year'
  },
  'membership.phone': {
    ar: 'رقم الهاتف (التركي)',
    tr: 'Telefon Numarası (Türkiye)',
    en: 'Phone Number (Turkish)'
  },
  'membership.whatsapp': {
    ar: 'رقم الواتساب',
    tr: 'WhatsApp Numarası',
    en: 'WhatsApp Number'
  },
  'membership.address': {
    ar: 'عنوان السكن التفصيلي في تركيا',
    tr: 'Türkiye\'deki Detaylı Ev Adresi',
    en: 'Detailed Residence Address in Türkiye'
  },
  'membership.submitBtn': {
    ar: 'إرسال طلب العضوية للأمانة العامة',
    tr: 'Başvuruyu Genel Sekreterliğe Gönder',
    en: 'Submit Application to General Secretariat'
  },
  'membership.successMessage': {
    ar: 'تم استلام طلبكم بنجاح! سيتم مراجعة الطلب من قبل الأمانة العامة وإصدار بطاقة العضوية الإلكترونية بعد الموافقة. رقم الطلب الخاص بك للمتابعة هو: ',
    tr: 'Başvurunuz başarıyla alındı! Genel Sekreterlik tarafından incelendikten sonra elektronik üyelik kartınız oluşturulacaktır. Takip için başvuru numaranız: ',
    en: 'Your application has been received successfully! The General Secretariat will review it and issue your electronic membership card upon approval. Your tracking code is: '
  },

  // Student Guide Buttons & Headings
  'guide.title': {
    ar: 'دليل الطالب في تركيا',
    tr: 'Türkiye\'deki Öğrenci Rehberi',
    en: 'Student Guide in Türkiye'
  },
  'guide.sub': {
    ar: 'كل ما يحتاجه الطالب المصري من إجراءات قانونية وأكاديمية ومعيشية لتسهيل حياته الدراسية.',
    tr: 'Mısırlı bir öğrencinin eğitim hayatını kolaylaştırmak için ihtiyaç duyduğu tüm yasal, akademik ve yaşamsal bilgiler.',
    en: 'Everything an Egyptian student needs regarding legal, academic, and practical procedures to ease their study life.'
  },

  // Events & Activities
  'events.title': {
    ar: 'فعاليات ومؤتمرات الاتحاد',
    tr: 'Birlik Etkinlikleri ve Konferansları',
    en: 'Union Events & Conferences'
  },
  'events.register': {
    ar: 'تسجيل في الفعالية',
    tr: 'Etkinliğe Kaydol',
    en: 'Register for Event'
  },
  'events.countdown': {
    ar: 'الوقت المتبقي للفعالية',
    tr: 'Etkinliğe Kalan Süre',
    en: 'Time Remaining'
  },
  'events.attendedQr': {
    ar: 'رمز QR للحضور الشخصي والمشاركة',
    tr: 'Kişisel Katılım ve Yoklama QR Kodu',
    en: 'QR Code for Physical Attendance'
  },

  // Media Center
  'media.gallery': {
    ar: 'معرض الصور والفيديوهات',
    tr: 'Fotoğraf ve Video Galerisi',
    en: 'Photo & Video Gallery'
  },
  'media.reports': {
    ar: 'التقارير السنوية والمجلات الصادرة',
    tr: 'Yıllık Raporlar ve Yayınlanan Dergiler',
    en: 'Annual Reports & Published Magazines'
  },

  // Contact Page & Complaints
  'contact.header': {
    ar: 'تواصل معنا واستفسر',
    tr: 'Bizimle İletişime Geçin',
    en: 'Get in Touch'
  },
  'contact.complaints': {
    ar: 'نظام تقديم الشكاوى والمقترحات الرسمي',
    tr: 'Resmi Şikayet ve Öneri Gönderim Sistemi',
    en: 'Official Complaints & Suggestions System'
  },
  'contact.complaintSub': {
    ar: 'نلتزم بالاستماع لصوتكم وحل مشكلاتكم بسرية تامة عبر الأمانة العامة للاتحاد.',
    tr: 'Birliğin Genel Sekreterliği aracılığıyla sesinizi duymayı ve sorunlarınızı tam bir gizlilikle çözmeyi taahhüt ediyoruz.',
    en: 'We commit to listening to your voice and resolving your issues in strict confidentiality through the General Secretariat.'
  },
  'contact.sendBtn': {
    ar: 'إرسال الرسالة',
    tr: 'Mesajı Gönder',
    en: 'Send Message'
  },
  'contact.ticketCreated': {
    ar: 'تم تقديم الشكوى/المقترح بنجاح! رقم تذكرتك للمتابعة هو: ',
    tr: 'Şikayet/Öneri başarıyla iletildi! Takip için bilet numaranız: ',
    en: 'Complaint/Suggestion submitted successfully! Your tracking ticket number is: '
  },

  // Admin ERP Panels
  'admin.title': {
    ar: 'نظام تخطيط موارد وإدارة الاتحاد (ERP - CMS)',
    tr: 'Birlik ERP ve Yönetim Sistemi',
    en: 'Union Resource Planning & CMS Portal'
  },
  'admin.dashboard': {
    ar: 'لوحة التحكم',
    tr: 'Gösterge Paneli',
    en: 'Dashboard'
  },
  'admin.memberships': {
    ar: 'طلبات العضوية',
    tr: 'Üyelik Başvuruları',
    en: 'Membership Requests'
  },
  'admin.events': {
    ar: 'إدارة الفعاليات',
    tr: 'Etkinlik Yönetimi',
    en: 'Event Management'
  },
  'admin.announcements': {
    ar: 'إدارة الإعلانات والمحتوى',
    tr: 'Duyuru & İçerik Yönetimi',
    en: 'Announcements & Content'
  },
  'admin.messages': {
    ar: 'الرسائل الواردة',
    tr: 'Gelen Mesajlar',
    en: 'Inbox Messages'
  },
  'admin.complaints': {
    ar: 'الشكاوى والتذاكر',
    tr: 'Şikayetler & Talepler',
    en: 'Complaints & Tickets'
  },
  'admin.translations': {
    ar: 'إدارة الترجمات',
    tr: 'Dil ve Çeviri Yönetimi',
    en: 'Translation Editor'
  },
  'admin.security': {
    ar: 'الأمن والتدقيق',
    tr: 'Güvenlik ve Günlükler',
    en: 'Security & Logs'
  },
  'admin.settings': {
    ar: 'إعدادات المنصة',
    tr: 'Sistem Ayarları',
    en: 'Platform Settings'
  },
  'admin.board': {
    ar: 'إدارة الهيئة الإدارية',
    tr: 'Yönetim Kurulu Yönetimi',
    en: 'Board Members Management'
  }
};
