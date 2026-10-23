import { scopedKey } from './storageService';
import { GradeLevel, SubjectCurriculum, SchemeDocument, ContentIdea } from '../types';
import { CURRICULUM_DATABASE, GRADES_LIST } from '../data/kenyanCurriculum';

export interface SearchResultItem {
  id: string;
  type: 'syllabus_topic' | 'template' | 'saved_scheme' | 'content_idea';
  grade: GradeLevel;
  subject: string;
  category: string;
  strand: string;
  subStrand: string;
  specificOutcomes?: string;
  inquiryQuestions?: string;
  title: string;
  description: string;
  relevanceScore: number;
  savedDoc?: SchemeDocument;
  savedIdea?: ContentIdea;
}

export interface SearchFilters {
  levelGroup?: 'all' | 'early_years' | 'lower_primary' | 'upper_primary' | 'junior_secondary' | 'senior_secondary' | 'kcse';
  resultType?: 'all' | 'syllabus_topic' | 'template' | 'saved_scheme' | 'content_idea';
  subject?: string;
}

const RECENT_SEARCHES_KEY = 'cbchub_recent_searches';

export const searchService = {
  getRecentSearches(): string[] {
    try {
      const data = localStorage.getItem(scopedKey(RECENT_SEARCHES_KEY));
      return data ? JSON.parse(data) : [
        'Pre-Technical Drawing',
        'Taxation PAYE',
        'Fractions',
        'Acids and Bases',
        'Kitchen Garden',
        'Integrated Science'
      ];
    } catch {
      return ['Pre-Technical Drawing', 'Taxation PAYE', 'Fractions'];
    }
  },

  addRecentSearch(query: string): void {
    if (!query.trim()) return;
    const current = this.getRecentSearches();
    const clean = query.trim();
    const updated = [clean, ...current.filter(item => item.toLowerCase() !== clean.toLowerCase())].slice(0, 8);
    try {
      localStorage.setItem(scopedKey(RECENT_SEARCHES_KEY), JSON.stringify(updated));
    } catch {
      // ignore
    }
  },

  clearRecentSearches(): void {
    try {
      localStorage.removeItem(scopedKey(RECENT_SEARCHES_KEY));
    } catch {
      // ignore
    }
  },

  getLevelGroup(grade: GradeLevel): 'early_years' | 'lower_primary' | 'upper_primary' | 'junior_secondary' | 'senior_secondary' | 'kcse' {
    if (grade.startsWith('PP')) return 'early_years';
    if (['Grade 1', 'Grade 2', 'Grade 3'].includes(grade)) return 'lower_primary';
    if (['Grade 4', 'Grade 5', 'Grade 6'].includes(grade)) return 'upper_primary';
    if (['Grade 7', 'Grade 8', 'Grade 9'].includes(grade)) return 'junior_secondary';
    if (['Grade 10', 'Grade 11', 'Grade 12'].includes(grade)) return 'senior_secondary';
    return 'kcse';
  },

  searchAll(
    query: string,
    filters: SearchFilters = {},
    savedSchemes: SchemeDocument[] = [],
    contentIdeas: ContentIdea[] = []
  ): SearchResultItem[] {
    const q = query.trim().toLowerCase();
    const results: SearchResultItem[] = [];

    // Helper to test if item matches levelGroup filter
    const matchesLevel = (grade: GradeLevel): boolean => {
      if (!filters.levelGroup || filters.levelGroup === 'all') return true;
      return this.getLevelGroup(grade) === filters.levelGroup;
    };

    // Helper to test if item matches subject filter
    const matchesSubject = (subjectName: string): boolean => {
      if (!filters.subject || filters.subject === 'all') return true;
      return subjectName.toLowerCase() === filters.subject.toLowerCase();
    };

    // Helper to test if item matches resultType filter
    const matchesType = (type: SearchResultItem['type']): boolean => {
      if (!filters.resultType || filters.resultType === 'all') return true;
      return type === filters.resultType;
    };

    // 1. Search Syllabus Topics & Strands from Curriculum Database
    GRADES_LIST.forEach((grade) => {
      if (!matchesLevel(grade)) return;

      const subjects = CURRICULUM_DATABASE[grade] || [];
      subjects.forEach((subj) => {
        if (!matchesSubject(subj.name)) return;

        subj.topics.forEach((topic, tIdx) => {
          let score = 0;
          const matchGrade = grade.toLowerCase().includes(q);
          const matchSubj = subj.name.toLowerCase().includes(q);
          const matchStrand = topic.strand.toLowerCase().includes(q);
          const matchSubStrands = topic.subStrands.filter(s => s.toLowerCase().includes(q));
          const matchOutcomes = topic.sampleOutcomes.toLowerCase().includes(q);
          const matchQuestions = topic.sampleQuestions.toLowerCase().includes(q);

          if (!q) {
            // Default score if no query (show all items sorted by grade)
            score = 1;
          } else {
            if (matchStrand) score += 50;
            if (matchSubStrands.length > 0) score += 40;
            if (matchSubj) score += 30;
            if (matchGrade) score += 20;
            if (matchOutcomes) score += 15;
            if (matchQuestions) score += 10;
          }

          if (score > 0) {
            // Add as Syllabus Topic
            if (matchesType('syllabus_topic')) {
              results.push({
                id: `syl-${grade}-${subj.name}-${tIdx}`,
                type: 'syllabus_topic',
                grade,
                subject: subj.name,
                category: subj.category,
                strand: topic.strand,
                subStrand: topic.subStrands.join(', '),
                specificOutcomes: topic.sampleOutcomes,
                inquiryQuestions: topic.sampleQuestions,
                title: `${topic.strand} (${grade})`,
                description: topic.sampleOutcomes,
                relevanceScore: score
              });
            }

            // Also provide a matching Template if relevant
            if (matchesType('template') && (!q || matchStrand || matchSubj || matchGrade)) {
              results.push({
                id: `tmpl-${grade}-${subj.name}-${tIdx}`,
                type: 'template',
                grade,
                subject: subj.name,
                category: `${subj.category} Template`,
                strand: topic.strand,
                subStrand: topic.subStrands[0] || 'Unit 1',
                specificOutcomes: topic.sampleOutcomes,
                inquiryQuestions: topic.sampleQuestions,
                title: `Teaching Scheme Template: ${grade} ${subj.name}`,
                description: `CBC planning matrix pre-configured for ${topic.strand} with lessons per week and breaks.`,
                relevanceScore: score + 5
              });
            }
          }
        });
      });
    });

    // 2. Search Saved Schemes of Work
    if (matchesType('saved_scheme')) {
      savedSchemes.forEach((doc) => {
        if (!matchesLevel(doc.grade)) return;
        if (!matchesSubject(doc.subject)) return;

        let score = 0;
        if (!q) {
          score = 5;
        } else {
          if (doc.subject.toLowerCase().includes(q)) score += 45;
          if (doc.schoolName.toLowerCase().includes(q)) score += 35;
          if (doc.grade.toLowerCase().includes(q)) score += 25;
          if (doc.teacherName.toLowerCase().includes(q)) score += 20;
          const matchRows = doc.rows.some(r =>
            r.strand.toLowerCase().includes(q) ||
            r.subStrand.toLowerCase().includes(q) ||
            r.specificOutcomes.toLowerCase().includes(q)
          );
          if (matchRows) score += 30;
        }

        if (score > 0) {
          results.push({
            id: `saved-${doc.id}`,
            type: 'saved_scheme',
            grade: doc.grade,
            subject: doc.subject,
            category: 'Saved Document',
            strand: doc.rows[0]?.strand || 'Scheme of Work',
            subStrand: doc.rows[0]?.subStrand || 'Full Term Matrix',
            title: `${doc.title} (${doc.schoolName})`,
            description: `Generated by ${doc.teacherName} (TSC: ${doc.tscNumber}) · Term ${doc.term}, ${doc.year} · ${doc.rows.length} Lessons`,
            relevanceScore: score + 10,
            savedDoc: doc
          });
        }
      });
    }

    // 3. Search Saved Content Ideas
    if (matchesType('content_idea')) {
      contentIdeas.forEach((idea) => {
        if (!matchesLevel(idea.grade)) return;
        if (!matchesSubject(idea.subject)) return;

        let score = 0;
        if (!q) {
          score = 5;
        } else {
          if (idea.title.toLowerCase().includes(q)) score += 50;
          if (idea.notes.toLowerCase().includes(q)) score += 30;
          if (idea.subject.toLowerCase().includes(q)) score += 20;
          if (idea.grade.toLowerCase().includes(q)) score += 15;
        }

        if (score > 0) {
          results.push({
            id: `idea-${idea.id}`,
            type: 'content_idea',
            grade: idea.grade,
            subject: idea.subject,
            category: `Content Idea (${idea.status})`,
            strand: idea.title,
            subStrand: idea.subject,
            title: idea.title,
            description: idea.notes,
            relevanceScore: score,
            savedIdea: idea
          });
        }
      });
    }

    // Sort by relevance score descending
    results.sort((a, b) => b.relevanceScore - a.relevanceScore);
    return results;
  }
};
