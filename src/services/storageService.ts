import { UserProfile, SchemeDocument, ContentIdea, CalendarEvent, MpesaReceipt } from '../types';
import { KENYAN_OFFICIAL_CALENDAR_2026 } from '../data/kenyanCurriculum';

const STORAGE_KEYS = {
  USER_PROFILE: 'cbchub_user_profile',
  SCHEMES: 'cbchub_saved_schemes',
  IDEAS: 'cbchub_content_ideas',
  CALENDAR: 'cbchub_calendar_events',
  PAYMENTS: 'cbchub_mpesa_payments',
  THEME: 'cbchub_theme_mode',
  FRAME_VIEW: 'cbchub_frame_view'
};

const DEFAULT_PROFILE: UserProfile = {
  id: 'usr_kenya_1',
  email: 'teacher@education.go.ke',
  teacherName: 'Mwalimu Otieno',
  tscNumber: 'TSC-784291',
  schoolName: 'Moi Forces Academy',
  role: 'Teacher',
  county: 'Nairobi',
  subCounty: 'Kasarani',
  phoneNumber: '0707423879'
};

const INITIAL_IDEAS: ContentIdea[] = [
  {
    id: 'idea-1',
    title: 'Grade 8 Pre-Tech Orthographic Projection Lab',
    grade: 'Grade 8',
    subject: 'Pre-Technical Studies',
    notes: 'Practical demonstration with drawing boards, set squares, and isometric cube models in the workshop.',
    scheduledDate: '2026-10-28',
    status: 'Scheduled',
    progress: 75,
    createdAt: '2026-10-20'
  },
  {
    id: 'idea-2',
    title: 'Grade 4 Kitchen Garden Drip Irrigation Demo',
    grade: 'Grade 4',
    subject: 'Agriculture and Nutrition',
    notes: 'Construct mini drip bottle irrigation using recycled 2L plastic bottles in the school garden.',
    scheduledDate: '2026-11-02',
    status: 'Drafting',
    progress: 40,
    createdAt: '2026-10-21'
  },
  {
    id: 'idea-3',
    title: 'Grade 7 Onion Cell Microscopic Mounting',
    grade: 'Grade 7',
    subject: 'Integrated Science',
    notes: 'Stain epidermal peel with iodine solution and record cellular components in lab logbooks.',
    status: 'Completed',
    progress: 100,
    createdAt: '2026-10-18'
  },
  {
    id: 'idea-4',
    title: 'KCSE Mathematics Taxation (PAYE) Masterclass',
    grade: 'KCSE Revision',
    subject: 'Mathematics Paper 1 & 2 Revision',
    notes: 'Solve 5 past KCSE questions on taxable brackets, personal relief, and insurance deductions.',
    scheduledDate: '2026-11-05',
    status: 'Idea',
    progress: 15,
    createdAt: '2026-10-22'
  }
];

export const storageService = {
  getUserProfile(): UserProfile {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.USER_PROFILE);
      return data ? JSON.parse(data) : DEFAULT_PROFILE;
    } catch {
      return DEFAULT_PROFILE;
    }
  },

  saveUserProfile(profile: UserProfile): void {
    localStorage.setItem(STORAGE_KEYS.USER_PROFILE, JSON.stringify(profile));
  },

  getSavedSchemes(): SchemeDocument[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.SCHEMES);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  saveScheme(scheme: SchemeDocument): void {
    const list = this.getSavedSchemes();
    const idx = list.findIndex(s => s.id === scheme.id);
    if (idx >= 0) {
      list[idx] = scheme;
    } else {
      list.unshift(scheme);
    }
    localStorage.setItem(STORAGE_KEYS.SCHEMES, JSON.stringify(list));
  },

  deleteScheme(id: string): void {
    const list = this.getSavedSchemes().filter(s => s.id !== id);
    localStorage.setItem(STORAGE_KEYS.SCHEMES, JSON.stringify(list));
  },

  getContentIdeas(): ContentIdea[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.IDEAS);
      return data ? JSON.parse(data) : INITIAL_IDEAS;
    } catch {
      return INITIAL_IDEAS;
    }
  },

  saveContentIdea(idea: ContentIdea): void {
    const list = this.getContentIdeas();
    const idx = list.findIndex(i => i.id === idea.id);
    if (idx >= 0) {
      list[idx] = idea;
    } else {
      list.unshift(idea);
    }
    localStorage.setItem(STORAGE_KEYS.IDEAS, JSON.stringify(list));
  },

  deleteContentIdea(id: string): void {
    const list = this.getContentIdeas().filter(i => i.id !== id);
    localStorage.setItem(STORAGE_KEYS.IDEAS, JSON.stringify(list));
  },

  getCalendarEvents(): CalendarEvent[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.CALENDAR);
      return data ? JSON.parse(data) : KENYAN_OFFICIAL_CALENDAR_2026;
    } catch {
      return KENYAN_OFFICIAL_CALENDAR_2026;
    }
  },

  saveCalendarEvent(event: CalendarEvent): void {
    const list = this.getCalendarEvents();
    list.push(event);
    localStorage.setItem(STORAGE_KEYS.CALENDAR, JSON.stringify(list));
  },

  getPayments(): MpesaReceipt[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.PAYMENTS);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  recordMpesaPayment(receipt: MpesaReceipt): void {
    const list = this.getPayments();
    list.unshift(receipt);
    localStorage.setItem(STORAGE_KEYS.PAYMENTS, JSON.stringify(list));
  },

  isItemUnlocked(itemTitle: string): boolean {
    const payments = this.getPayments();
    return payments.some(p => p.itemTitle.toLowerCase() === itemTitle.toLowerCase());
  },

  getThemeMode(): 'dark' | 'light' {
    const val = localStorage.getItem(STORAGE_KEYS.THEME);
    if (val === 'dark' || val === 'light') return val;
    return window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  },

  setThemeMode(mode: 'dark' | 'light'): void {
    localStorage.setItem(STORAGE_KEYS.THEME, mode);
  },

  getFrameView(): boolean {
    const val = localStorage.getItem(STORAGE_KEYS.FRAME_VIEW);
    return val !== 'false'; // Default to true (Android Phone viewport simulation option available)
  },

  setFrameView(active: boolean): void {
    localStorage.setItem(STORAGE_KEYS.FRAME_VIEW, String(active));
  }
};
