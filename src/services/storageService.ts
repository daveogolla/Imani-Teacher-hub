import { UserProfile, SchemeDocument, ContentIdea, CalendarEvent, MpesaReceipt } from '../types';
import { KENYAN_OFFICIAL_CALENDAR_2026 } from '../data/kenyanCurriculum';

let owner = '';
export function configureStorage(userId: string) { owner = userId; }
export function scopedKey(key: string) { return `${owner}:${key}`; }
function read(key: string) { return localStorage.getItem(`${owner}:${key}`); }
function write(key: string, value: string) { localStorage.setItem(`${owner}:${key}`, value); localStorage.setItem(`${owner}:dirty`,String(Date.now())); window.dispatchEvent(new Event('workspace-change')); }
let syncQueue: Promise<void> = Promise.resolve();
export function syncWorkspace() {
 const currentOwner = owner;
 syncQueue = syncQueue.catch(()=>{}).then(()=>saveWorkspace(currentOwner));
 return syncQueue;
}
async function saveWorkspace(currentOwner: string) {
 if(currentOwner !== owner || !currentOwner) return;
 const version = localStorage.getItem(`${currentOwner}:dirty`);
 const data: Record<string, unknown> = {};
 for(const key of Object.values(STORAGE_KEYS)) {
  const value = read(key); if(value) data[key] = JSON.parse(value);
 }
 const response = await fetch('/.netlify/functions/workspace', {method:'PUT',headers:{'Content-Type':'application/json'},body:JSON.stringify(data)});
 if(!response.ok) throw new Error('Sync unavailable');
 if(localStorage.getItem(`${currentOwner}:dirty`)===version) localStorage.removeItem(`${currentOwner}:dirty`);
}

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
  email: '',
  teacherName: '',
  tscNumber: '',
  schoolName: '',
  role: 'Teacher',
  county: 'Nairobi',
  subCounty: 'Kasarani',
  phoneNumber: ''
};

export const storageService = {
  getUserProfile(): UserProfile {
    try {
      const data = read(STORAGE_KEYS.USER_PROFILE);
      return data ? JSON.parse(data) : DEFAULT_PROFILE;
    } catch {
      return DEFAULT_PROFILE;
    }
  },

  saveUserProfile(profile: UserProfile): void {
    write(STORAGE_KEYS.USER_PROFILE, JSON.stringify(profile));
  },

  getSavedSchemes(): SchemeDocument[] {
    try {
      const data = read(STORAGE_KEYS.SCHEMES);
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
    write(STORAGE_KEYS.SCHEMES, JSON.stringify(list));
  },

  deleteScheme(id: string): void {
    const list = this.getSavedSchemes().filter(s => s.id !== id);
    write(STORAGE_KEYS.SCHEMES, JSON.stringify(list));
  },

  getContentIdeas(): ContentIdea[] {
    try {
      const data = read(STORAGE_KEYS.IDEAS);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
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
    write(STORAGE_KEYS.IDEAS, JSON.stringify(list));
  },

  deleteContentIdea(id: string): void {
    const list = this.getContentIdeas().filter(i => i.id !== id);
    write(STORAGE_KEYS.IDEAS, JSON.stringify(list));
  },

  getCalendarEvents(): CalendarEvent[] {
    try {
      const data = read(STORAGE_KEYS.CALENDAR);
      return data ? JSON.parse(data) : KENYAN_OFFICIAL_CALENDAR_2026;
    } catch {
      return KENYAN_OFFICIAL_CALENDAR_2026;
    }
  },

  saveCalendarEvent(event: CalendarEvent): void {
    const list = this.getCalendarEvents();
    list.push(event);
    write(STORAGE_KEYS.CALENDAR, JSON.stringify(list));
  },

  getPayments(): MpesaReceipt[] {
    try {
      const data = read(STORAGE_KEYS.PAYMENTS);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  recordMpesaPayment(receipt: MpesaReceipt): void {
    const list = this.getPayments();
    list.unshift(receipt);
    write(STORAGE_KEYS.PAYMENTS, JSON.stringify(list));
  },

  isItemUnlocked(itemTitle: string): boolean {
    const payments = this.getPayments();
    return payments.some(p => p.itemTitle.toLowerCase() === itemTitle.toLowerCase());
  },

  getThemeMode(): 'dark' | 'light' {
    const val = read(STORAGE_KEYS.THEME);
    if (val === 'dark' || val === 'light') return val;
    return window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  },

  setThemeMode(mode: 'dark' | 'light'): void {
    write(STORAGE_KEYS.THEME, mode);
  },

  getFrameView(): boolean {
    const val = read(STORAGE_KEYS.FRAME_VIEW);
    return val === 'true'; // Default to true (Android Phone viewport simulation option available)
  },

  setFrameView(active: boolean): void {
    write(STORAGE_KEYS.FRAME_VIEW, String(active));
  }
};
