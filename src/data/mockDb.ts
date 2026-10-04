import { 
  BoardMember, 
  Membership, 
  StudentGuideSection, 
  Event, 
  Activity, 
  Announcement, 
  MediaItem, 
  ContactMessage, 
  Complaint, 
  Volunteer, 
  Sponsor, 
  SecurityConfig, 
  LoginAttempt, 
  ActivityLog, 
  WebsiteSettings,
  EventRegistration
} from '../types';
import { INITIAL_TRANSLATIONS } from './translations';

// ------------------ INITIAL SEED DATA ------------------

const INITIAL_BOARD_MEMBERS: BoardMember[] = [
  {
    id: 'b1',
    name: {
      ar: 'أحمد محمود الرفاعي',
      tr: 'Ahmet Mahmut El-Rifai',
      en: 'Ahmed Mahmoud El-Rifai'
    },
    role: 'president',
    roleTitle: {
      ar: 'رئيس مجلس الإدارة',
      tr: 'Yönetim Kurulu Başkanı',
      en: 'President of the Board'
    },
    photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=300',
    bio: {
      ar: 'طالب في السنة الأخيرة في هندسة البترول والغاز الطبيعي. مهتم بالعمل التطوعي والتنمية القيادية للشباب.',
      tr: 'Petrol ve Doğal Gaz Mühendisliği son sınıf öğrencisi. Gönüllü çalışmalar ve gençlik liderliği gelişimine ilgi duyuyor.',
      en: 'Senior Petroleum and Natural Gas Engineering student. Passionate about community volunteer work and youth leadership development.'
    },
    email: 'president.mob@iste.edu.tr',
    phone: '+90 555 123 4567',
    whatsapp: '905551234567',
    socials: {
      linkedin: 'https://linkedin.com/in/ahmed-rifai',
      facebook: 'https://facebook.com/rifai'
    },
    academicInfo: {
      university: {
        ar: 'جامعة إسكندرون التقنية',
        tr: 'İskenderun Teknik Üniversitesi',
        en: 'Iskenderun Technical University'
      },
      major: {
        ar: 'هندسة البترول والغاز الطبيعي',
        tr: 'Petrol ve Doğal Gaz Mühendisliği',
        en: 'Petroleum and Natural Gas Engineering'
      },
      year: '4'
    }
  },
  {
    id: 'b2',
    name: {
      ar: 'سارة عبد الرحمن الشامي',
      tr: 'Sara Abdurrahman El-Şami',
      en: 'Sara Abdulrahman El-Shamy'
    },
    role: 'vice_president',
    roleTitle: {
      ar: 'نائب رئيس الاتحاد',
      tr: 'Birlik Başkan Yardımcısı',
      en: 'Vice President'
    },
    photo: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=300',
    bio: {
      ar: 'طالبة في تخصص هندسة البرمجيات. مسؤولة عن العلاقات الأكاديمية والتواصل والأنشطة التقنية.',
      tr: 'Yazılım Mühendisliği öğrencisi. Akademik ilişkiler, iletişim koordinasyonu ve teknik faaliyetlerden sorumludur.',
      en: 'Software Engineering student. Responsible for academic relations, communications, and technical events coordination.'
    },
    email: 'vice.president.mob@iste.edu.tr',
    phone: '+90 555 987 6543',
    whatsapp: '905559876543',
    socials: {
      linkedin: 'https://linkedin.com/in/sara-shamy',
      twitter: 'https://twitter.com/sara_shamy'
    },
    academicInfo: {
      university: {
        ar: 'جامعة إسكندرون التقنية',
        tr: 'İskenderun Teknik Üniversitesi',
        en: 'Iskenderun Technical University'
      },
      major: {
        ar: 'هندسة البرمجيات',
        tr: 'Yazılım Mühendisliği',
        en: 'Software Engineering'
      },
      year: '3'
    }
  },
  {
    id: 'b3',
    name: {
      ar: 'مصطفى كريم الغزاوي',
      tr: 'Mustafa Kerim El-Gazzavi',
      en: 'Mostafa Karim El-Gazzawy'
    },
    role: 'secretary',
    roleTitle: {
      ar: 'أمين عام الاتحاد',
      tr: 'Genel Sekreter',
      en: 'General Secretary'
    },
    photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=300',
    bio: {
      ar: 'طالب هندسة معمارية. مسؤول عن التوثيق والملفات والعلاقات الإدارية وصياغة اللوائح.',
      tr: 'Mimarlık öğrencisi. Dokümantasyon, idari dosyalar, resmi ilişkiler ve tüzük düzenlemelerinden sorumludur.',
      en: 'Architecture student. Responsible for documentation, administrative archives, official relations, and bylaws formulation.'
    },
    email: 'secretary.mob@iste.edu.tr',
    phone: '+90 555 456 7890',
    whatsapp: '905554567890',
    socials: {
      linkedin: 'https://linkedin.com/in/mostafa-gazzawy'
    },
    academicInfo: {
      university: {
        ar: 'جامعة إسكندرون التقنية',
        tr: 'İskenderun Teknik Üniversitesi',
        en: 'Iskenderun Technical University'
      },
      major: {
        ar: 'العمارة',
        tr: 'Mimarlık',
        en: 'Architecture'
      },
      year: '3'
    }
  },
  {
    id: 'b4',
    name: {
      ar: 'يوسف هاني الجندي',
      tr: 'Yusuf Hani El-Cundi',
      en: 'Youssef Hany El-Gendy'
    },
    role: 'treasurer',
    roleTitle: {
      ar: 'أمين الصندوق والمالية',
      tr: 'Sayman ve Mali İşler Sorumlusu',
      en: 'Treasurer & Financial Officer'
    },
    photo: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=300',
    bio: {
      ar: 'طالب إدارة أعمال وإدارة دولية. مسؤول عن الموازنات والاشتراكات والتمويل ورعاية الفعاليات.',
      tr: 'İşletme öğrencisi. Bütçeler, üyelik aidatları, finansman kaynakları ve etkinlik sponsorluklarından sorumludur.',
      en: 'Business Administration student. Responsible for budgets, subscription processing, funding, and event sponsorships.'
    },
    email: 'treasurer.mob@iste.edu.tr',
    phone: '+90 555 111 2222',
    whatsapp: '905551112222',
    socials: {
      linkedin: 'https://linkedin.com/in/youssef-gendy'
    },
    academicInfo: {
      university: {
        ar: 'جامعة إسكندرون التقنية',
        tr: 'İskenderun Teknik Üniversitesi',
        en: 'Iskenderun Technical University'
      },
      major: {
        ar: 'إدارة الأعمال',
        tr: 'İşletme',
        en: 'Business Administration'
      },
      year: '2'
    }
  }
];

const INITIAL_GUIDES: StudentGuideSection[] = [
  {
    id: 'g1',
    category: 'residence',
    title: {
      ar: 'إجراءات تصريح الإقامة الطلابية (Öğrenci İkamet İzni)',
      tr: 'Öğrenci İkamet İzni İşlemleri',
      en: 'Student Residence Permit Procedures'
    },
    content: {
      ar: 'للبقاء في تركيا بشكل قانوني، يجب على الطالب التقدم بطلب للحصول على تصريح إقامة طلابية خلال 30 يوماً من دخوله البلاد.\n\n**الأوراق المطلوبة:**\n1. وثيقة الطالب (Öğrenci Belgesi) حديثة.\n2. تأمين صحي يغطي مدة الإقامة.\n3. موعد المقابلة المطبوع من موقع إدارة الهجرة الرسمي.\n4. نسخة ملونة من جواز السفر (صفحة البيانات وختم الدخول).\n5. إثبات السكن (عقد الإيجار مصدق من كاتب العدل أو ورقة السكن الجامعي).\n6. 4 صور شخصية بخلفية بيضاء (بيومترية).\n7. إيصال دفع رسوم بطاقة الإقامة.\n\n**خطوات هامة:** بعد ملء الاستمارة عبر موقع e-ikamet، يتوجه الطالب لتسليم الملف للجامعة أو لإدارة الهجرة في الموعد المحدد.',
      tr: 'Türkiye\'de yasal olarak kalabilmek için öğrencilerin ülkeye giriş yaptıktan sonraki 30 gün içinde öğrenci ikamet iznine başvurmaları gerekmektedir.\n\n**Gerekli Belgeler:**\n1. Güncel Öğrenci Belgesi.\n2. İkamet süresini kapsayan Özel Sağlık Sigortası.\n3. Göç İdaresi resmi sitesinden alınmış randevu formu çıktısı.\n4. Pasaportun aslı ve fotoğraflı sayfası ile giriş damgasının bulunduğu sayfaların fotokopisi.\n5. Adres Beyanı (Noter onaylı kira sözleşmesi veya yurt belgesi).\n6. 4 adet biyometrik fotoğraf.\n7. İkamet kart harcı ödeme makbuzu.\n\n**Önemli Adım:** e-ikamet sitesinden form doldurulduktan sonra, belirtilen randevu gününde evraklar üniversite öğrenci işlerine veya İl Göç İdaresine teslim edilmelidir.',
      en: 'To reside legally in Türkiye, students must apply for a student residence permit within 30 days of entry.\n\n**Required Documents:**\n1. Current Student Certificate (Öğrenci Belgesi).\n2. Valid Health Insurance covering the permit duration.\n3. Appointment form printed from the official e-ikamet portal.\n4. Passport copy (identity details and entry stamp pages).\n5. Proof of Address (notarized rental contract or official dormitory document).\n6. 4 biometric photographs.\n7. Residence permit card fee payment receipt.\n\n**Important Step:** After completing the online form on e-ikamet, submit your dossier to either your university\'s student affairs office or the local immigration office on the appointed date.'
    },
    links: [
      { title: { ar: 'بوابة الهجرة الإلكترونية', tr: 'E-İkamet Resmi Kapısı', en: 'Official e-Ikamet Portal' }, url: 'https://e-ikamet.goc.gov.tr/' }
    ]
  },
  {
    id: 'g2',
    category: 'health',
    title: {
      ar: 'التأمين الصحي الحكومي والخاص',
      tr: 'Genel ve Özel Sağlık Sigortası',
      en: 'Government and Private Health Insurance'
    },
    content: {
      ar: 'هناك خياران أساسيان للتأمين الصحي في تركيا للطلاب الأجانب:\n\n**1. التأمين الصحي الخاص (Özel Sağlık Sigortası):**\nهو الخيار الأسرع للحصول على الإقامة، وتكلفته منخفضة تتراوح بين 400 إلى 1200 ليرة تركية سنوياً حسب الفئة العمرية. يغطي الحالات الإسعافية ونسبة معينة من العلاج والتحاليل في المستشفيات الخاصة المتعاقدة.\n\n**2. التأمين الصحي العام الحكومي (SGK - GSS):**\nيحق للطلاب الأجانب التسجيل فيه خلال الأشهر الثلاثة الأولى فقط من تاريخ تسجيلهم الأول بالجامعة. يوفر تغطية شاملة ومجانية بالكامل في كافة المستشفيات الحكومية والجامعية ونسبة كبيرة من الأدوية.\n\n**توصية الاتحاد:** ينصح الاتحاد بتفعيل التأمين الحكومي (SGK) لمن يعانون من أمراض مزمنة أو يحتاجون لمتابعة طبية مستمرة.',
      tr: 'Türkiye\'de yabancı öğrenciler için iki temel sağlık sigortası seçeneği bulunmaktadır:\n\n**1. Özel Sağlık Sigortası:**\nİkamet başvurusu için en hızlı seçenektir. Yaş grubuna göre yıllık 400 ila 1200 TL arasında değişen düşük bir maliyeti vardır. Anlaşmalı özel hastanelerde acil durumları ve belirli oranda tedavi/tahlil masraflarını kapsar.\n\n**2. Genel Sağlık Sigortası (SGK - GSS):**\nYabancı uyruklu öğrenciler, üniversiteye ilk kayıt yaptırdıkları tarihten itibaren ilk 3 ay içinde başvuru hakkına sahiptir. Devlet ve üniversite hastanelerinde tam kapsamlı ücretsiz sağlık hizmeti sunar ve ilaç giderlerinin büyük kısmını karşılar.\n\n**Birlik Önerisi:** Kronik rahatsızlığı olan veya sürekli tıbbi takip gereksinimi duyan öğrencilerin kesinlikle SGK (GSS) yaptırmaları önerilir.',
      en: 'There are two main health insurance options available to foreign students in Türkiye:\n\n**1. Private Health Insurance (Özel Sağlık Sigortası):**\nThe fastest and most common option to secure residency. Affordable pricing ranges from 400 to 1200 TRY annually depending on age. It covers emergencies and a percentage of standard treatments/tests at contracted private hospitals.\n\n**2. General Public Health Insurance (SGK - GSS):**\nInternational students have the right to register for public social security (SGK) within the first 3 months of their initial university registration. It offers comprehensive, fully free medical care at all state and university hospitals, and heavily subsidizes medications.\n\n**Union Recommendation:** The union highly advises enrolling in government SGK for students with chronic conditions or those requiring regular medical follow-ups.'
    }
  },
  {
    id: 'g3',
    category: 'transport',
    title: {
      ar: 'المواصلات وبطاقة الطالب المخفضة في إسكندرون / هاتاي',
      tr: 'İskenderun/Hatay Öğrenci Seyahat Kartı',
      en: 'Public Transport & Discounted Student Card in Hatay'
    },
    content: {
      ar: 'تتميز مدينة إسكندرون بشبكة مواصلات عامة مريحة تعتمد على الحافلات الصغيرة (Dolmuş) وحافلات بلدية هاتاي الكبرى (Hatay Kart).\n\n**كيفية استخراج بطاقة الطالب للمواصلات (Hatay Kart):**\n1. توجه إلى مركز مبيعات البطاقات الرئيسي في وسط المدينة.\n2. أحضر معك: وثيقة الطالب (Öğrenci Belgesi)، صورة شخصية واحدة، وجواز السفر.\n3. رسوم استخراج الكرت رمزية جداً وتصدر فورياً.\n\nتمنحك البطاقة خصماً يتجاوز 50% على جميع خطوط المواصلات العامة التابعة للبلدية ومسارات الجامعة التقنية.',
      tr: 'İskenderun, minibüsler (Dolmuş) ve Hatay Büyükşehir Belediyesi toplu taşıma otobüsleri (Hatay Kart) ile konforlu bir ulaşım ağına sahiptir.\n\n**Hatay Kart İndirimli Öğrenci Kartı Nasıl Çıkarılır?**\n1. Şehir merkezindeki ana kart işlem merkezine gidin.\n2. Yanınızda götürün: Güncel Öğrenci Belgesi, 1 adet vesikalık fotoğraf ve Pasaport.\n3. Kart basım ücreti oldukça düşüktür ve kartınız anında teslim edilir.\n4. Bu kart ile tüm belediye otobüslerinde ve üniversite hatlarında %50\'yi aşan öğrenci indiriminden faydalanabilirsiniz.',
      en: 'Iskenderun features a convenient public transport grid relying on local minibuses (Dolmuş) and Hatay Metropolitan Municipality buses (Hatay Kart).\n\n**How to obtain the Student Transport Card (Hatay Kart):**\n1. Visit the main card service center in the city center.\n2. Bring: Your Student Certificate (Öğrenci Belgesi), 1 photo, and your passport.\n3. The processing fee is very nominal, and the card is issued on the spot.\nThis card grants you over 50% discount on all municipality transit lines and campus routes.'
    }
  },
  {
    id: 'g4',
    category: 'emergency',
    title: {
      ar: 'أرقام الطوارئ والاتصال الحكومية الأساسية',
      tr: 'Temel Acil Durum ve Devlet Telefon Numaraları',
      en: 'Critical Emergency & Government Hotline Numbers'
    },
    content: {
      ar: 'في تركيا، تم دمج جميع أرقام الطوارئ في رقم موحد لسهولة وسرعة الاستجابة.\n\n* **رقم الطوارئ الموحد (شرطة، إسعاف، إطفاء):** 112\n* **إرشاد الأجانب وإدارة الهجرة (YİMER):** 157 (يدعم اللغة العربية والإنجليزية على مدار الساعة لمعالجة أي استفسارات تخص الإقامة وتأشيرات الدخول).\n* **الاستشارات الصحية (المستشفيات والأمراض):** 182\n* **مركز اتصالات بلدية هاتاي:** 153',
      tr: 'Türkiye\'de tüm acil çağrı numaraları daha hızlı ve etkin müdahale için tek bir çatı altında birleştirilmiştir.\n\n* **Ortak Acil Çağrı Merkezi (Polis, Ambulans, İtfaiye):** 112\n* **Yabancılar İletişim Merkezi (YİMER):** 157 (İkamet, vize ve yabancıların tüm yasal işlemleri için 7/24 Arapça ve İngilizce dil desteği sağlar).\n* **Hastane Randevu Sistemi (MHRS):** 182\n* **Hatay Büyükşehir Belediyesi Çağrı Merkezi:** 153',
      en: 'In Türkiye, all localized emergency hotlines are unified into a single coordinate for rapid response.\n\n* **Unified Emergency Hotline (Police, Ambulance, Fire):** 112\n* **Foreigners Communication Center (YİMER):** 157 (Offers 24/7 Arabic, English, Russian and Turkish support for queries regarding residency, visas, and legal stay status).\n* **Medical Appointment Center (MHRS):** 182\n* **Hatay Municipality Call Center:** 153'
    }
  }
];

const INITIAL_EVENTS: Event[] = [
  {
    id: 'e1',
    title: {
      ar: 'ملتقى التعارف الطلابي السنوي للعام 2026',
      tr: '2026 Yıllık Öğrenci Tanışma Toplantısı',
      en: 'Annual Student Welcome & Networking Meetup 2026'
    },
    description: {
      ar: 'الملتقى السنوي الأكبر للترحيب بالطلاب المصريين الجدد في إسكندرون، بحضور رئيس الاتحاد وأعضاء الهيئة الإدارية وممثلين عن المجتمع الأكاديمي. يشمل الملتقى أنشطة ترفيهية، وتوزيع هدايا، وشرح تفصيلي للحياة الأكاديمية ونظام المعيشة، يليه مأدبة غداء تقليدية.',
      tr: 'İskenderun\'daki yeni Mısırlı öğrencileri karşılamak için düzenlenen en büyük yıllık buluşma. Birlik başkanı, yönetim kurulu üyeleri ve akademisyenlerin katılımıyla gerçekleşecektir. Eğlenceli etkinlikler, hediyeler, eğitim hayatı ve yaşam rehberi sunumlarının ardından geleneksel akşam yemeği ikram edilecektir.',
      en: 'The grandest annual gathering welcoming new and returning Egyptian students to Iskenderun, in the presence of the union board and academic guests. The event features orientation briefings, interactive icebreakers, distribution of welcome guides, followed by a formal lunch buffet.'
    },
    category: 'cultural',
    date: '2026-09-15',
    time: '14:00',
    location: {
      ar: 'القاعة الكبرى، جامعة إسكندرون التقنية',
      tr: 'İskenderun Teknik Üniversitesi Ana Konferans Salonu',
      en: 'Grand Hall, Iskenderun Technical University (İSTE)'
    },
    image: 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&q=80&w=600',
    capacity: 120,
    registeredCount: 84,
    countdownActive: true,
    qrCodeValue: 'MOB-EVENT-INTRO-2026',
    galleryImages: [
      'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80&w=400',
      'https://images.unsplash.com/photo-1528605248644-14dd04022da1?auto=format&fit=crop&q=80&w=400'
    ]
  },
  {
    id: 'e2',
    title: {
      ar: 'ورشة عمل: كتابة السيرة الذاتية واجتياز مقابلات العمل',
      tr: 'Atölye: CV Yazma ve Mülakat Teknikleri Eğitimi',
      en: 'Workshop: Resume Writing & Job Interview Mastery'
    },
    description: {
      ar: 'ورشة تدريبية مكثفة بالتعاون مع متخصصين في الموارد البشرية لتعريف الطلاب بكيفية صياغة سيرة ذاتية احترافية واجتياز مقابلات العمل بنجاح وتأسيس حسابات مميزة على منصة LinkedIn.',
      tr: 'Öğrencilere profesyonel düzeyde CV hazırlama, iş mülakatlarında başarılı olma ve etkili LinkedIn profili oluşturma yöntemlerini anlatmak üzere İK uzmanları eşliğinde düzenlenen uygulamalı eğitim.',
      en: 'An intensive career-building seminar led by HR practitioners teaching students how to author competitive resumes, perform outstandingly in job interviews, and build high-traction LinkedIn portfolios.'
    },
    category: 'workshops',
    date: '2026-10-05',
    time: '11:00',
    location: {
      ar: 'قاعة السيمينار، كلية الهندسة',
      tr: 'Mühendislik Fakültesi Seminer Salonu',
      en: 'Seminar Suite, Faculty of Engineering'
    },
    image: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?auto=format&fit=crop&q=80&w=600',
    capacity: 60,
    registeredCount: 45,
    countdownActive: false,
    qrCodeValue: 'MOB-EVENT-RESUME-WORKSHOP',
    galleryImages: []
  }
];

const INITIAL_ACTIVITIES: Activity[] = [
  {
    id: 'ac1',
    title: {
      ar: 'حملة تشجير وتنظيف شاطئ إسكندرون',
      tr: 'İskenderun Sahili Ağaçlandırma ve Temizlik Kampanyası',
      en: 'Iskenderun Beach Reforestation & Cleaning Drive'
    },
    description: {
      ar: 'ضمن مبادرة المسؤولية المجتمعية والبيئية للاتحاد، قام متطوعو الاتحاد بحملة تشجير وتنظيف لشواطئ وحدائق مدينة إسكندرون بالتنسيق مع البلدية لتعزيز الأثر الإيجابي والوعي البيئي للشباب العربي في تركيا.',
      tr: 'Birliğin sosyal sorumluluk ve çevre bilinci misyonu doğrultusunda, İskenderun Belediyesi ile koordineli olarak sahil şeridi ve parklarda fidan dikim ve çevre temizliği faaliyeti gerçekleştirilmiştir.',
      en: 'Aligned with the union\'s community engagement mandate, student volunteers mobilized alongside municipal environment officers to plant trees and clean up public beaches in Iskenderun.'
    },
    category: 'community',
    date: '2026-05-10',
    image: 'https://images.unsplash.com/photo-1618477388954-7852f32655ec?auto=format&fit=crop&q=80&w=600',
    mediaCoverageUrl: 'https://hataynews.com/mob-iskenderun'
  },
  {
    id: 'ac2',
    title: {
      ar: 'دوري كرة القدم الرمضاني للطلاب الجاليات',
      tr: 'Ramazan Ayı Topluluklar Arası Futbol Turnuvası',
      en: 'Ramadan Communities Football League'
    },
    description: {
      ar: 'دورة رياضية رمضانية مميزة جمعت فرقاً من الطلاب المصريين والجاليات العربية والأجنبية والتركية لتعزيز أواصر المحبة والروح الرياضية في أجواء احتفالية رائعة.',
      tr: 'Mısırlı öğrenciler ile Arap, yabancı ve Türk öğrenci takımlarını bir araya getiren, kardeşlik ve spor ruhunu canlandıran geleneksel ramazan ayı dostluk turnuvası.',
      en: 'A vibrant Ramadan soccer tournament gathering teams of Egyptian, Middle Eastern, international, and Turkish students to foster camaraderie and healthy sportsmanship.'
    },
    category: 'sports',
    date: '2026-03-24',
    image: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&q=80&w=600'
  }
];

const INITIAL_ANNOUNCEMENTS: Announcement[] = [
  {
    id: 'a1',
    title: {
      ar: 'هام جداً: بدء التقديم على المنحة التركية الحكومية لعام 2026/2027',
      tr: 'Türkiye Bursları 2026/2027 Başvuruları Başladı',
      en: 'Urgent: Turkish Government Scholarship (Türkiye Bursları) 2026 Application Cycle'
    },
    content: {
      ar: 'تعلن الأمانة العامة للاتحاد عن فتح باب التسجيل للمنحة التركية الحكومية الشهيرة لدرجات البكالوريوس والدراسات العليا. توفر المنحة راتباً شهرياً، وتغطية كاملة للأقساط الدراسية، وسكناً مجانياً، وتأميناً صحياً شاملاً، وتذاكر طيران للذهاب والعودة.\n\nيسر اللجنة الأكاديمية بالاتحاد تقديم جلسات إرشادية مجانية لفحص وتدقيق خطابات الدافع ومراجعة ملفات التقديم لجميع الطلاب الأعضاء الراغبين بالتقديم.',
      tr: 'Birliğimiz Akademik Komisyonu, lisans ve lisansüstü düzeyinde Türkiye Bursları başvurularının açıldığını duyurmaktan mutluluk duyar. Burs kapsamında aylık cep harçlığı, tam harç muafiyeti, ücretsiz yurt konaklaması, sağlık sigortası ve gidiş-dönüş uçak bileti sağlanmaktadır.\n\nBaşvurmak isteyen tüm üye öğrencilerimiz için motivasyon mektubu kontrolü ve evrak incelemesi danışmanlık hizmetimiz tamamen ücretsiz olarak verilecektir.',
      en: 'The Union Academic Committee announces that applications are officially open for the prestigious Türkiye Scholarships (Türkiye Bursları) for Bachelor\'s, Master\'s, and PhD programs. The scholarship covers full tuition, monthly stipend, free state dormitory housing, health insurance, and round-trip flight tickets.\n\nOur academic department will host free counseling webinars and mock application reviews for all registered union members.'
    },
    category: 'scholarships',
    publishDate: '2026-06-25',
    isPinned: true,
    image: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&q=80&w=600'
  },
  {
    id: 'a2',
    title: {
      ar: 'إعلان بخصوص توفر فرص تدريب صيفي مدفوع في كبرى الشركات الهندسية والتقنية',
      tr: 'Mühendislik ve Yazılım Alanlarında Ücretli Yaz Stajı Fırsatları',
      en: 'Paid Summer Internship Openings at Elite Industrial & Engineering Partners'
    },
    content: {
      ar: 'بالتنسيق مع الملحقية التجارية والشركاء الصناعيين في منطقة هاتاي الصناعية، يسر لجنة العلاقات الخارجية بالاتحاد توفير 15 فرصة تدريب صيفي مدفوع الأجر لطلاب تخصصات الهندسة المدنية، الميكانيكية، البرمجيات، والكهرباء.\n\n**الشروط:**\n* أن يكون الطالب في السنة الثالثة أو الرابعة.\n* معدل تراكمي لا يقل عن 2.5.\n* عضوية سارية ونشطة في الاتحاد.',
      tr: 'Hatay Organize Sanayi Bölgesindeki sektörel ortaklarımızla koordineli olarak, Mühendislik ve Bilgisayar bilimleri öğrencileri için 15 adet ücretli yaz stajı kontenjanı ayrılmıştır.\n\n**Başvuru Şartları:**\n* 3. veya 4. sınıf öğrencisi olmak.\n* Genel not ortalamasının en az 2.50 olması.\n* Birliğe aktif üyelik kaydının bulunması.',
      en: 'In partnership with Hatay Industrial Zone corporations, the Union Relations Desk is proud to secure 15 paid corporate summer internship opportunities for juniors and seniors in Civil, Mechanical, Software, and Electrical Engineering.\n\n**Requirements:**\n* Student must be currently enrolled in 3rd or 4th academic year.\n* Cumulative GPA of 2.50 or above.\n* Valid and active union membership registration.'
    },
    category: 'internships',
    publishDate: '2026-06-28',
    isPinned: false
  }
];

const INITIAL_MEDIA_ITEMS: MediaItem[] = [
  {
    id: 'm1',
    type: 'photo',
    title: {
      ar: 'صور حفل إفطار الاتحاد الجماعي في رمضان 2026',
      tr: 'Ramadan 2026 Birlik İftar Buluşması Fotoğrafları',
      en: 'Ramadan 2026 Community Iftar Dinner Album'
    },
    url: 'https://images.unsplash.com/photo-1528605248644-14dd04022da1?auto=format&fit=crop&q=80&w=800',
    date: '2026-03-25'
  },
  {
    id: 'm2',
    type: 'video',
    title: {
      ar: 'التقرير المرئي السنوي لإنجازات الاتحاد في تركيا',
      tr: 'MÖB İskenderun Yıllık Faaliyet ve Başarı Videosu',
      en: 'MÖB Iskenderun Annual Achievement & Activity Video Documentary'
    },
    url: 'https://www.youtube.com/embed/dQw4w9WgXcQ', // mock YouTube iframe
    thumbnail: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&q=80&w=400',
    date: '2026-06-01'
  },
  {
    id: 'm3',
    type: 'magazine',
    title: {
      ar: 'مجلة "صوت المغترب" الإلكترونية - العدد الأول',
      tr: 'Gurbetin Sesi Dijital Öğrenci Dergisi - Sayı 1',
      en: '"Voice of the Expatriate" Digital Magazine - Issue 1'
    },
    url: '#',
    thumbnail: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=400',
    date: '2026-05-15'
  }
];

const INITIAL_SPONSORS: Sponsor[] = [
  {
    id: 's1',
    name: { ar: 'الملحقية الثقافية المصرية بأنقرة', tr: 'Mısır Ankara Kültür Ataşeliği', en: 'Egyptian Cultural Bureau in Ankara' },
    logo: 'https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?auto=format&fit=crop&q=80&w=150',
    tier: 'partner'
  },
  {
    id: 's2',
    name: { ar: 'مجموعة المترجمين الدوليين بالتربية والتعليم', tr: 'Uluslararası Çeviri Hizmetleri', en: 'International Translation & Education Group' },
    logo: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&q=80&w=150',
    tier: 'gold'
  }
];

const INITIAL_WEBSITE_SETTINGS: WebsiteSettings = {
  unionName: {
    ar: 'اتحاد الطلاب المصريين - إسكندرون',
    tr: 'Mısırlı Öğrenciler Birliği - İskenderun',
    en: 'Egyptian Students\' Union - Iskenderun'
  },
  email: 'info.mob@iste.edu.tr',
  phone: '+90 555 123 4567',
  whatsapp: '905551234567',
  officeHours: {
    ar: 'الإثنين إلى الجمعة: 09:00 ص - 05:00 م',
    tr: 'Pazartesi - Cuma: 09:00 - 17:00',
    en: 'Monday - Friday: 09:00 AM - 05:00 PM'
  },
  address: {
    ar: 'مكتب شؤون الطلاب، الطابق الأرضي، مبنى الخدمات العامة، جامعة إسكندرون التقنية، إسكندرون، هاتاي، تركيا',
    tr: 'Öğrenci İşleri Ofisi, Zemin Kat, İskenderun Teknik Üniversitesi Merkez Kampüsü, İskenderun, Hatay, Türkiye',
    en: 'Student Union Suite, Ground Floor, General Services Center, Iskenderun Technical University (İSTE), Iskenderun, Hatay, Türkiye'
  },
  googleMapUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3209.6892518382024!2d36.1912443!3d36.5866164!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x152f58e99b03cbff%3A0xe1681283626154b5!2s%C4%B0skenderun%20Teknik%20%C3%9Cniversitesi!5e0!3m2!1str!2str!4v1680000000000!5m2!1str!2str',
  socials: {
    facebook: 'https://facebook.com/iste_mob',
    instagram: 'https://instagram.com/iste_mob',
    twitter: 'https://twitter.com/iste_mob',
    youtube: 'https://youtube.com/iste_mob',
    telegram: 'https://t.me/iste_mob',
    linktree: 'https://linktr.ee/iste_mob'
  },
  homepage: {
    hero: {
      badge: {
        ar: 'البوابة الرقمية الرسمية المعتمدة',
        tr: 'Resmi Onaylı Dijital Portal',
        en: 'Official Accredited Digital Portal'
      },
      title: {
        ar: 'مرحباً بكم في اتحاد الطلاب المصريين بإسكندرون',
        tr: 'İskenderun Mısırlı Öğrenciler Birliğine Hoş Geldiniz',
        en: 'Welcome to Egyptian Students\' Union in Iskenderun'
      },
      subtitle: {
        ar: 'الكيان الرسمي الراعي للطلاب المصريين في جامعة إسكندرون التقنية، نعمل على تيسير مسيرتكم الأكاديمية وتقديم أرقى الخدمات والأنشطة.',
        tr: 'İskenderun Teknik Üniversitesi\'ndeki Mısırlı öğrencilerin resmi temsilciliği. Akademik yolculuğunuzu destekliyor ve en nitelikli hizmetleri sunuyoruz.',
        en: 'The accredited representative of Egyptian students at Iskenderun Technical University, dedicated to serving academic and community success.'
      },
      primaryBtnText: {
        ar: 'طلب العضوية وإصدار البطاقة',
        tr: 'Üyelik Başvurusu ve Dijital Kart',
        en: 'Apply for Membership Card'
      },
      secondaryBtnText: {
        ar: 'دليل الطالب الشامل',
        tr: 'Kapsamlı Öğrenci Rehberi',
        en: 'Student Survival Guide'
      }
    },
    presidentMessage: {
      name: {
        ar: 'أحمد محمود الرفاعي',
        tr: 'Ahmet Mahmut El-Rifai',
        en: 'Ahmed Mahmoud El-Rifai'
      },
      title: {
        ar: 'رئيس مجلس إدارة اتحاد الطلاب',
        tr: 'MÖB İskenderun Yönetim Kurulu Başkanı',
        en: 'President of the Egyptian Students\' Union'
      },
      photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=300',
      sectionTitle: {
        ar: 'كلمة رئيس الاتحاد',
        tr: 'Birlik Başkanının Mesajı',
        en: 'President\'s Address'
      },
      messageText: {
        ar: 'أبنائي وإخواني الطلاب المصريين في إسكندرون، نرحب بكم في بيتكم الأكاديمي والثقافي والاجتماعي. نسعى دائماً لنكون الجسر الذي يربطكم بوطنكم الحبيب مصر، والمحفز الذي يدعم مسيرتكم العلمية والاجتماعية في تركيا. نلتزم بتقديم كافة المساعدات الأكاديمية والخدمية والإرشادية لتسهيل غربتكم وتحقيق تطلعاتكم الواعدة.',
        tr: 'İskenderun\'daki değerli Mısırlı öğrenci kardeşlerim, akademik ve sosyal yuvanıza hoş geldiniz. Anavatanımız Mısır ile olan bağlarınızı güçlendirmek ve Türkiye\'deki eğitim ve yaşam yolculuğunuzu kolaylaştırmak için her zaman yanınızdayız.',
        en: 'Dear Egyptian students in Iskenderun, we warmly welcome you to your academic and cultural home. We strive tirelessly to be the supportive anchor connecting you with our beloved Egypt while empowering your future in Türkiye.'
      }
    },
    stats: {
      sectionTitle: {
        ar: 'الاتحاد في أرقام',
        tr: 'Rakamlarla Birliğimiz',
        en: 'The Union in Numbers'
      },
      stat1: {
        number: '450+',
        label: {
          ar: 'عضو مسجل',
          tr: 'Kayıtlı Üye',
          en: 'Registered Members'
        }
      },
      stat2: {
        number: '24+',
        label: {
          ar: 'فعالية سنوية',
          tr: 'Yıllık Etkinlik',
          en: 'Annual Events'
        }
      },
      stat3: {
        number: '6+',
        label: {
          ar: 'سنوات من الخدمة',
          tr: 'Yıllık Hizmet',
          en: 'Years of Service'
        }
      },
      stat4: {
        number: '5+',
        label: {
          ar: 'جامعات ومؤسسات شريكة',
          tr: 'Partner Kurum',
          en: 'Partner Institutions'
        }
      }
    }
  }
};

const INITIAL_COMPLAINTS: Complaint[] = [
  {
    id: 'c_seed_1',
    ticketNumber: 'MOB-REQ-2026-001',
    name: 'عمرو عبد السلام الجارحي',
    email: 'amr.garhy@outlook.com',
    phone: '+90 534 888 1234',
    category: 'academic',
    subject: 'صعوبة معادلة بعض المواد الدراسية بقسم هندسة الميكانيكا',
    details: 'أواجه مشكلة في قبول معادلة مقرر الفيزياء والرياضيات المتقدمة الذي درسته في مصر مع المواد المناظرة بجامعة إسكندرون التقنية، حيث يطلب القسم تقديم توصيف معتمد ومترجم للمواد السابقة، أرجو المساعدة أو التوجيه مع ممثل الأكاديمية بالاتحاد.',
    date: '2026-06-29T10:00:00-07:00',
    status: 'under_review',
    priority: 'medium',
    assignedAdmin: 'مصطفى كريم الغزاوي',
    internalNotes: 'تم الاتصال برئيس قسم الهندسة الميكانيكية بالجامعة وأفاد بإمكانية تقديم الملف إلكترونياً للتدقيق.',
    responses: [
      {
        id: 'cr1',
        author: 'admin',
        authorName: 'مصطفى كريم الغزاوي (الأمين العام)',
        message: 'أهلاً بك يا عمرو. لقد اطلعنا على طلبك، وجارٍ التنسيق مع شؤون الطلاب لتبسيط ملفات المعادلة. يرجى إرسال نسخة من توصيف المواد لديك على بريدنا الإلكتروني لتتم مراجعته من قبل ممثل لجنتنا التعليمية.',
        date: '2026-06-29T16:30:00-07:00'
      }
    ]
  },
  {
    id: 'c_seed_2',
    ticketNumber: 'MOB-REQ-2026-002',
    name: 'ياسمين السيد فؤاد',
    email: 'yasmin.fouad@gmail.com',
    phone: '+90 531 222 3344',
    category: 'services',
    subject: 'مشكلة تأخر استخراج كرت الباص الجامعي المخفض',
    details: 'ذهبت مرتين لفرع هاتاي كارت بالمدينة لاستخراج الكرت الطلابي المخفض، وتم رفض الطلب لعدم وجود اسمي في السجلات المشتركة بين الهجرة والبلدية، برغم صدور وثيقة الطالب الخاصة بي قبل أسبوعين.',
    date: '2026-06-30T09:15:00-07:00',
    status: 'new',
    priority: 'high',
    internalNotes: 'تحتاج للتأكد من ربط الرقم الوطني المؤقت 99 في سيستم الجامعة بشكل صحيح لتتمكن البلدية من جلب البيانات.'
  }
];

const INITIAL_CONTACT_MESSAGES: ContactMessage[] = [
  {
    id: 'm_seed_1',
    name: 'خالد عبد الوهاب',
    email: 'khaled.wahab@student.com',
    phone: '+90 555 444 7711',
    subject: 'الاستفسار عن موعد ورشة العمل القادمة للمبرمجين',
    message: 'السلام عليكم ورحمة الله، أريد الاستفسار إن كان هناك حد أقصى للحضور بخصوص الورشة البرمجية المزمع عقدها الشهر المقبل وهل يتطلب وجود حاسوب محمول شخصي؟',
    date: '2026-06-29T18:00:00-07:00',
    language: 'ar',
    status: 'replied',
    assignedTo: 'سارة عبد الرحمن الشامي',
    adminNotes: 'تم توجيه الرد من قبل ممثلة لجنة البرمجيات وتوضيح إحضار الحواسيب الشخصية.',
    replies: [
      {
        id: 'rep1',
        adminName: 'سارة عبد الرحمن الشامي',
        message: 'وعليكم السلام ورحمة الله وبركاته يا خالد. نعم، يرجى إحضار حاسوبك الشخصي حيث ستحتوي الورشة على تدريب عملي مكثف. لا يوجد حد أقصى للقبول طالما قمت بالتسجيل عبر الرابط الإلكتروني المتاح في صفحة الفعاليات.',
        date: '2026-06-30T10:00:00-07:00'
      }
    ]
  },
  {
    id: 'm_seed_2',
    name: 'Selim Bayraktar',
    email: 'selim.bayrak@outlook.com',
    phone: '+90 532 999 0088',
    subject: 'Mısırlı Öğrenciler ile Kültür Günü Ortaklığı',
    message: 'Merhaba, üniversitemizin uluslararası ilişkiler kulübü başkanı olarak önümüzdeki dönem Mısır kültürünü tanıtacak ortak bir etkinlik düzenlemek istiyoruz. Yönetiminiz ile bu konuyu görüşmek için uygun bir zaman var mıdır?',
    date: '2026-06-30T11:45:00-07:00',
    language: 'tr',
    status: 'new'
  }
];

const INITIAL_MEMBERSHIPS: Membership[] = [
  {
    id: 'memb_1',
    studentNumber: 'MOB-ST-260104',
    nameAr: 'طارق علي الصعيدي',
    nameEn: 'Tarek Aly El-Saidy',
    passportOrId: '99485746352',
    email: 'tarek.saidy@gmail.com',
    phone: '+90 535 666 4433',
    whatsapp: '905356664433',
    university: 'İskenderun Teknik Üniversitesi',
    faculty: 'Mühendislik ve Doğa Bilimleri',
    major: 'Bilgisayar Mühendisliği',
    academicYear: '3',
    residenceAddress: 'Cumhuriyet Mah. 125. Sokak, No:14 Daire: 5, İskenderun, Hatay',
    residencePermitNumber: '485960483',
    photoUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=200',
    status: 'approved',
    appliedDate: '2026-01-12',
    expirationDate: '2027-01-12',
    type: 'new'
  },
  {
    id: 'memb_2',
    studentNumber: 'MOB-ST-260220',
    nameAr: 'مريم محمد الجيزاوي',
    nameEn: 'Maryam Mohamed El-Gizawy',
    passportOrId: '99104859604',
    email: 'maryam.gizawy@gmail.com',
    phone: '+90 539 333 9988',
    whatsapp: '905393339988',
    university: 'İskenderun Teknik Üniversitesi',
    faculty: 'Mühendislik ve Doğa Bilimleri',
    major: 'Yazılım Mühendisliği',
    academicYear: '2',
    residenceAddress: 'Barış Sitesi A Blok Daire: 12, Karaağaç, Hatay',
    photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
    status: 'pending',
    appliedDate: '2026-06-30',
    type: 'new'
  }
];

const INITIAL_VOLUNTEERS: Volunteer[] = [
  {
    id: 'v1',
    name: 'عماد هشام شلبي',
    email: 'emad.shalaby@gmail.com',
    phone: '+90 534 555 1212',
    whatsapp: '905345551212',
    interests: ['cultural', 'trips', 'media'],
    status: 'approved',
    appliedDate: '2026-04-10'
  },
  {
    id: 'v2',
    name: 'فاطمة محمود الشريف',
    email: 'fatma.sherif@yahoo.com',
    phone: '+90 538 123 9988',
    whatsapp: '905381239988',
    interests: ['academic', 'workshops'],
    status: 'pending',
    appliedDate: '2026-06-29'
  }
];

const INITIAL_LOGIN_HISTORY: LoginAttempt[] = [
  {
    id: 'log1',
    username: 'admin_ahmed',
    ip: '192.168.1.54',
    device: 'Chrome v126 on Windows 11',
    location: 'İskenderun, Hatay',
    timestamp: '2026-06-30 09:00:15',
    status: 'success'
  },
  {
    id: 'log2',
    username: 'admin_mostafa',
    ip: '85.105.16.241',
    device: 'Safari on iPhone 15 Pro',
    location: 'Karaağaç, Hatay',
    timestamp: '2026-06-30 11:32:48',
    status: 'otp_required'
  }
];

const INITIAL_ACTIVITY_LOGS: ActivityLog[] = [
  {
    id: 'actl_1',
    adminUser: 'أحمد محمود الرفاعي',
    action: 'تحديث اللائحة والبيانات الأساسية',
    details: 'تعديل وتحديث بيانات دستور اللائحة الداخلية للعام الأكاديمي الجديد 2026.',
    timestamp: '2026-06-30 09:15:32',
    ip: '192.168.1.54'
  },
  {
    id: 'actl_2',
    adminUser: 'مصطفى كريم الغزاوي',
    action: 'قبول عضوية الطالب: طارق علي الصعيدي',
    details: 'مراجعة وتوثيق الهوية والرقم الوطني ومطابقة الملفات لإصدار بطاقة العضوية MOB-ST-260104.',
    timestamp: '2026-06-30 10:45:12',
    ip: '85.105.16.241'
  }
];

// ------------------ LOCAL STORAGE DATABASE MANAGER ------------------

class LocalDatabase {
  private get<T>(key: string, defaultValue: T): T {
    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : defaultValue;
    } catch {
      return defaultValue;
    }
  }

  private set<T>(key: string, value: T): void {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      console.error('Local Storage Save Error:', e);
    }
  }

  // Board Members
  getBoardMembers(): BoardMember[] {
    return this.get('mob_board_members', INITIAL_BOARD_MEMBERS);
  }
  saveBoardMembers(data: BoardMember[]) {
    this.set('mob_board_members', data);
  }

  // Student Guides
  getGuides(): StudentGuideSection[] {
    return this.get('mob_guides', INITIAL_GUIDES);
  }
  saveGuides(data: StudentGuideSection[]) {
    this.set('mob_guides', data);
  }

  // Events
  getEvents(): Event[] {
    return this.get('mob_events', INITIAL_EVENTS);
  }
  saveEvents(data: Event[]) {
    this.set('mob_events', data);
  }

  // Event Registrations
  getRegistrations(): EventRegistration[] {
    return this.get('mob_registrations', []);
  }
  saveRegistrations(data: EventRegistration[]) {
    this.set('mob_registrations', data);
  }

  // Activities
  getActivities(): Activity[] {
    return this.get('mob_activities', INITIAL_ACTIVITIES);
  }
  saveActivities(data: Activity[]) {
    this.set('mob_activities', data);
  }

  // Announcements
  getAnnouncements(): Announcement[] {
    return this.get('mob_announcements', INITIAL_ANNOUNCEMENTS);
  }
  saveAnnouncements(data: Announcement[]) {
    this.set('mob_announcements', data);
  }

  // Media Items
  getMediaItems(): MediaItem[] {
    return this.get('mob_media_items', INITIAL_MEDIA_ITEMS);
  }
  saveMediaItems(data: MediaItem[]) {
    this.set('mob_media_items', data);
  }

  // Contact Messages
  getContactMessages(): ContactMessage[] {
    return this.get('mob_contact_messages', INITIAL_CONTACT_MESSAGES);
  }
  saveContactMessages(data: ContactMessage[]) {
    this.set('mob_contact_messages', data);
  }

  // Complaints
  getComplaints(): Complaint[] {
    return this.get('mob_complaints', INITIAL_COMPLAINTS);
  }
  saveComplaints(data: Complaint[]) {
    this.set('mob_complaints', data);
  }

  // Memberships
  getMemberships(): Membership[] {
    return this.get('mob_memberships', INITIAL_MEMBERSHIPS);
  }
  saveMemberships(data: Membership[]) {
    this.set('mob_memberships', data);
  }

  // Volunteers
  getVolunteers(): Volunteer[] {
    return this.get('mob_volunteers', INITIAL_VOLUNTEERS);
  }
  saveVolunteers(data: Volunteer[]) {
    this.set('mob_volunteers', data);
  }

  // Sponsors
  getSponsors(): Sponsor[] {
    return this.get('mob_sponsors', INITIAL_SPONSORS);
  }
  saveSponsors(data: Sponsor[]) {
    this.set('mob_sponsors', data);
  }

  // Settings
  getSettings(): WebsiteSettings {
    const s = this.get('mob_settings', INITIAL_WEBSITE_SETTINGS);
    if (!s.homepage) {
      s.homepage = INITIAL_WEBSITE_SETTINGS.homepage;
    }
    return s;
  }
  saveSettings(data: WebsiteSettings) {
    this.set('mob_settings', data);
  }

  // Translations
  getTranslations(): Record<string, { ar: string; tr: string; en: string }> {
    return this.get('mob_translations', INITIAL_TRANSLATIONS);
  }
  saveTranslations(data: Record<string, { ar: string; tr: string; en: string }>) {
    this.set('mob_translations', data);
  }

  // Security Configuration
  getSecurityConfig(): SecurityConfig {
    const defaultSecurity: SecurityConfig = {
      twoFactorActive: true,
      sessionTimeoutMinutes: 30,
      csrfProtectionEnabled: true,
      sqlInjectionBlockerActive: true,
      xssFilterActive: true
    };
    return this.get('mob_security_config', defaultSecurity);
  }
  saveSecurityConfig(data: SecurityConfig) {
    this.set('mob_security_config', data);
  }

  // Login History
  getLoginHistory(): LoginAttempt[] {
    return this.get('mob_login_history', INITIAL_LOGIN_HISTORY);
  }
  saveLoginHistory(data: LoginAttempt[]) {
    this.set('mob_login_history', data);
  }

  // Activity Logs
  getActivityLogs(): ActivityLog[] {
    return this.get('mob_activity_logs', INITIAL_ACTIVITY_LOGS);
  }
  saveActivityLogs(data: ActivityLog[]) {
    this.set('mob_activity_logs', data);
  }

  // Trigger simulated backup
  triggerBackup(): { filename: string; timestamp: string; sizeKB: number } {
    const fullState = this.getFullBackupObject();
    const stringified = JSON.stringify(fullState);
    const sizeKB = Math.round((stringified.length * 2) / 102.4) / 10;
    const timestamp = new Date().toISOString().replace('T', ' ').substring(0, 19);
    const filename = `mob_backup_${timestamp.replace(/[: ]/g, '_')}.json`;
    return { filename, timestamp, sizeKB };
  }

  getFullBackupObject() {
    return {
      board: this.getBoardMembers(),
      guides: this.getGuides(),
      events: this.getEvents(),
      registrations: this.getRegistrations(),
      activities: this.getActivities(),
      announcements: this.getAnnouncements(),
      media: this.getMediaItems(),
      messages: this.getContactMessages(),
      complaints: this.getComplaints(),
      memberships: this.getMemberships(),
      volunteers: this.getVolunteers(),
      sponsors: this.getSponsors(),
      settings: this.getSettings(),
      translations: this.getTranslations(),
      security: this.getSecurityConfig()
    };
  }

  restoreBackup(jsonString: string): boolean {
    try {
      const data = JSON.parse(jsonString);
      if (data.board) this.saveBoardMembers(data.board);
      if (data.guides) this.saveGuides(data.guides);
      if (data.events) this.saveEvents(data.events);
      if (data.registrations) this.saveRegistrations(data.registrations);
      if (data.activities) this.saveActivities(data.activities);
      if (data.announcements) this.saveAnnouncements(data.announcements);
      if (data.media) this.saveMediaItems(data.media);
      if (data.messages) this.saveContactMessages(data.messages);
      if (data.complaints) this.saveComplaints(data.complaints);
      if (data.memberships) this.saveMemberships(data.memberships);
      if (data.volunteers) this.saveVolunteers(data.volunteers);
      if (data.sponsors) this.saveSponsors(data.sponsors);
      if (data.settings) this.saveSettings(data.settings);
      if (data.translations) this.saveTranslations(data.translations);
      if (data.security) this.saveSecurityConfig(data.security);
      return true;
    } catch (e) {
      console.error('Failed to restore backup', e);
      return false;
    }
  }

  resetToDefault(): void {
    this.saveBoardMembers(INITIAL_BOARD_MEMBERS);
    this.saveGuides(INITIAL_GUIDES);
    this.saveEvents(INITIAL_EVENTS);
    this.saveRegistrations([]);
    this.saveActivities(INITIAL_ACTIVITIES);
    this.saveAnnouncements(INITIAL_ANNOUNCEMENTS);
    this.saveMediaItems(INITIAL_MEDIA_ITEMS);
    this.saveContactMessages(INITIAL_CONTACT_MESSAGES);
    this.saveComplaints(INITIAL_COMPLAINTS);
    this.saveMemberships(INITIAL_MEMBERSHIPS);
    this.saveVolunteers(INITIAL_VOLUNTEERS);
    this.saveSponsors(INITIAL_SPONSORS);
    this.saveSettings(INITIAL_WEBSITE_SETTINGS);
    this.saveTranslations(INITIAL_TRANSLATIONS);
  }
}

export const db = new LocalDatabase();
