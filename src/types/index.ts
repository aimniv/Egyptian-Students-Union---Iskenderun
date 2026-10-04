export type Language = 'ar' | 'tr' | 'en';

export interface BoardMember {
  id: string;
  name: { ar: string; tr: string; en: string };
  role: 'president' | 'vice_president' | 'secretary' | 'treasurer' | 'board_member' | 'department_head';
  roleTitle: { ar: string; tr: string; en: string };
  department?: { ar: string; tr: string; en: string };
  photo: string;
  bio: { ar: string; tr: string; en: string };
  email: string;
  phone: string;
  whatsapp?: string;
  socials: {
    linkedin?: string;
    twitter?: string;
    facebook?: string;
  };
  academicInfo: {
    university: { ar: string; tr: string; en: string };
    major: { ar: string; tr: string; en: string };
    year: string;
  };
}

export interface Membership {
  id: string;
  studentNumber: string; // generated
  nameAr: string;
  nameEn: string;
  passportOrId: string;
  email: string;
  phone: string;
  whatsapp: string;
  university: string;
  faculty: string;
  major: string;
  academicYear: string;
  residenceAddress: string;
  residencePermitNumber?: string;
  photoUrl?: string; // base64 or placeholder
  status: 'pending' | 'approved' | 'rejected' | 'expired';
  rejectionReason?: string;
  appliedDate: string;
  expirationDate?: string;
  paymentReceiptUrl?: string;
  type: 'new' | 'renewal';
  membershipCardDownloaded?: boolean;
}

export interface StudentGuideSection {
  id: string;
  category: 'residence' | 'university' | 'health' | 'transport' | 'accommodation' | 'emergency' | 'links' | 'faq';
  title: { ar: string; tr: string; en: string };
  content: { ar: string; tr: string; en: string };
  links?: { title: { ar: string; tr: string; en: string }; url: string }[];
}

export interface EventRegistration {
  id: string;
  eventId: string;
  name: string;
  email: string;
  phone: string;
  whatsapp: string;
  registeredDate: string;
  attended: boolean;
  attendanceTime?: string;
}

export interface Event {
  id: string;
  title: { ar: string; tr: string; en: string };
  description: { ar: string; tr: string; en: string };
  category: 'academic' | 'cultural' | 'sports' | 'entertainment' | 'national' | 'workshops' | 'seminars' | 'trips';
  date: string;
  time: string;
  location: { ar: string; tr: string; en: string };
  image: string;
  capacity: number;
  registeredCount: number;
  countdownActive: boolean;
  galleryImages?: string[];
  certificateTemplateUrl?: string;
  qrCodeValue: string; // for physical QR check-in
}

export interface Activity {
  id: string;
  title: { ar: string; tr: string; en: string };
  description: { ar: string; tr: string; en: string };
  category: 'volunteer' | 'community' | 'projects' | 'cultural' | 'educational' | 'charity' | 'media' | 'sports';
  date: string;
  image: string;
  mediaCoverageUrl?: string;
}

export interface Announcement {
  id: string;
  title: { ar: string; tr: string; en: string };
  content: { ar: string; tr: string; en: string };
  category: 'scholarships' | 'internships' | 'university_news' | 'official' | 'union_news' | 'emergency';
  publishDate: string;
  isPinned: boolean;
  image?: string;
  attachments?: { name: string; url: string }[];
}

export interface MediaItem {
  id: string;
  type: 'photo' | 'video' | 'press' | 'document' | 'annual_report' | 'magazine';
  title: { ar: string; tr: string; en: string };
  url: string; // media asset or video link
  thumbnail?: string;
  date: string;
  category?: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  date: string;
  language: Language;
  status: 'new' | 'reviewed' | 'replied' | 'archived';
  adminNotes?: string;
  assignedTo?: string;
  replies?: {
    id: string;
    adminName: string;
    message: string;
    date: string;
  }[];
}

export interface Complaint {
  id: string;
  ticketNumber: string; // e.g. MOB-REQ-2026-004
  name: string;
  email: string;
  phone: string;
  category: 'academic' | 'services' | 'logistics' | 'harassment_safety' | 'union_activities' | 'other';
  subject: string;
  details: string;
  date: string;
  status: 'new' | 'under_review' | 'in_progress' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  internalNotes?: string;
  assignedAdmin?: string;
  responses?: {
    id: string;
    author: 'admin' | 'user';
    authorName: string;
    message: string;
    date: string;
  }[];
}

export interface Volunteer {
  id: string;
  name: string;
  email: string;
  phone: string;
  whatsapp: string;
  interests: string[];
  status: 'pending' | 'approved' | 'rejected';
  appliedDate: string;
}

export interface Sponsor {
  id: string;
  name: { ar: string; tr: string; en: string };
  logo: string;
  website?: string;
  tier: 'gold' | 'silver' | 'bronze' | 'partner';
}

export interface SecurityConfig {
  twoFactorActive: boolean;
  sessionTimeoutMinutes: number;
  csrfProtectionEnabled: boolean;
  sqlInjectionBlockerActive: boolean;
  xssFilterActive: boolean;
}

export interface LoginAttempt {
  id: string;
  username: string;
  ip: string;
  device: string;
  location: string;
  timestamp: string;
  status: 'success' | 'failed' | 'otp_required' | 'otp_failed';
}

export interface ActivityLog {
  id: string;
  adminUser: string;
  action: string;
  details: string;
  timestamp: string;
  ip: string;
}

export interface HomepageConfig {
  hero: {
    badge: { ar: string; tr: string; en: string };
    title: { ar: string; tr: string; en: string };
    subtitle: { ar: string; tr: string; en: string };
    primaryBtnText: { ar: string; tr: string; en: string };
    secondaryBtnText: { ar: string; tr: string; en: string };
  };
  presidentMessage: {
    name: { ar: string; tr: string; en: string };
    title: { ar: string; tr: string; en: string };
    photo: string;
    sectionTitle: { ar: string; tr: string; en: string };
    messageText: { ar: string; tr: string; en: string };
  };
  stats: {
    sectionTitle: { ar: string; tr: string; en: string };
    stat1: { number: string; label: { ar: string; tr: string; en: string } };
    stat2: { number: string; label: { ar: string; tr: string; en: string } };
    stat3: { number: string; label: { ar: string; tr: string; en: string } };
    stat4: { number: string; label: { ar: string; tr: string; en: string } };
  };
}

export interface WebsiteSettings {
  unionName: { ar: string; tr: string; en: string };
  email: string;
  phone: string;
  whatsapp: string;
  officeHours: { ar: string; tr: string; en: string };
  address: { ar: string; tr: string; en: string };
  googleMapUrl: string;
  socials: {
    facebook: string;
    instagram: string;
    twitter: string;
    youtube: string;
    telegram: string;
    linktree: string;
  };
  homepage?: HomepageConfig;
}
