export type GradeLevel =
  | 'PP1'
  | 'PP2'
  | 'Grade 1'
  | 'Grade 2'
  | 'Grade 3'
  | 'Grade 4'
  | 'Grade 5'
  | 'Grade 6'
  | 'Grade 7'
  | 'Grade 8'
  | 'Grade 9'
  | 'Grade 10'
  | 'Grade 11'
  | 'Grade 12'
  | 'KCSE Revision';

export interface UserProfile {
  id: string;
  email: string;
  teacherName: string;
  tscNumber: string;
  schoolName: string;
  role: 'Teacher' | 'Head of Department' | 'Deputy Principal' | 'Principal';
  phoneNumber?: string;
  county?: string;
  subCounty?: string;
}

export interface SchemeRow {
  id: string;
  week: number;
  lesson: number;
  strand: string;
  subStrand: string;
  specificOutcomes: string;
  inquiryQuestions: string;
  learningExperiences: string;
  coreCompetencies: string;
  resources: string;
  assessment: string;
  reflection?: string;
}

export interface SchemeDocument {
  id: string;
  title: string;
  documentType: 'scheme' | 'lesson_plan' | 'revision';
  schoolName: string;
  teacherName: string;
  tscNumber: string;
  grade: GradeLevel;
  subject: string;
  term: number;
  year: number;
  lessonsPerWeek: number;
  termStartDate: string;
  halfTermDate: string;
  closingDate: string;
  includeHodSign: boolean;
  includeDeputySign: boolean;
  includePrincipalSign: boolean;
  rows: SchemeRow[];
  createdAt: string;
  isPaid?: boolean;
}

export interface ContentIdea {
  id: string;
  title: string;
  grade: GradeLevel;
  subject: string;
  notes: string;
  scheduledDate?: string;
  status: 'Idea' | 'Drafting' | 'Scheduled' | 'Completed';
  progress: number; // 0 to 100
  createdAt: string;
}

export interface CalendarEvent {
  id: string;
  title: string;
  date: string;
  endDate?: string;
  category: 'term_start' | 'half_term' | 'closing' | 'exam' | 'school_event';
  term?: number;
  description: string;
}

export interface MpesaReceipt {
  id: string;
  mpesaCode: string;
  amount: number;
  payNumber: string;
  timestamp: string;
  itemTitle: string;
  itemType: 'scheme' | 'lesson_plan' | 'revision';
  status: 'verified';
}

export interface SubjectCurriculum {
  name: string;
  category: string;
  topics: {
    strand: string;
    subStrands: string[];
    sampleOutcomes: string;
    sampleQuestions: string;
  }[];
}
