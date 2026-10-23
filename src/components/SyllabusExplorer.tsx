import React, { useState } from 'react';
import { 
  GraduationCap, 
  Search, 
  FileText, 
  Download, 
  ArrowRight, 
  BookOpen, 
  Sparkles, 
  Layers, 
  CheckCircle2, 
  Filter
} from 'lucide-react';
import { GradeLevel, SubjectCurriculum } from '../types';
import { GRADES_LIST, CURRICULUM_DATABASE } from '../data/kenyanCurriculum';

interface SyllabusExplorerProps {
  initialGrade?: GradeLevel;
  onSelectForGenerator: (grade: GradeLevel, subject: string) => void;
  onInitiateMaterialDownload: (title: string, format: 'docx' | 'pdf') => void;
}

export const SyllabusExplorer: React.FC<SyllabusExplorerProps> = ({
  initialGrade = 'Grade 7',
  onSelectForGenerator,
  onInitiateMaterialDownload,
}) => {
  const [selectedGrade, setSelectedGrade] = useState<GradeLevel>(initialGrade);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<'All' | 'Early Years' | 'Primary' | 'Junior Secondary' | 'Senior Secondary' | 'KCSE Revision'>('All');

  // Filter grades by category
  const filteredGrades = GRADES_LIST.filter(grade => {
    if (activeCategoryFilter === 'All') return true;
    if (activeCategoryFilter === 'Early Years') return grade.startsWith('PP');
    if (activeCategoryFilter === 'Primary') return ['Grade 1', 'Grade 2', 'Grade 3', 'Grade 4', 'Grade 5', 'Grade 6'].includes(grade);
    if (activeCategoryFilter === 'Junior Secondary') return ['Grade 7', 'Grade 8', 'Grade 9'].includes(grade);
    if (activeCategoryFilter === 'Senior Secondary') return ['Grade 10', 'Grade 11', 'Grade 12'].includes(grade);
    if (activeCategoryFilter === 'KCSE Revision') return grade === 'KCSE Revision';
    return true;
  });

  const subjects = CURRICULUM_DATABASE[selectedGrade] || [];

  // Filter subjects by search
  const visibleSubjects = subjects.filter(subject => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    const matchesSubject = subject.name.toLowerCase().includes(q);
    const matchesTopic = subject.topics.some(t => 
      t.strand.toLowerCase().includes(q) || 
      t.subStrands.some(s => s.toLowerCase().includes(q)) ||
      t.sampleOutcomes.toLowerCase().includes(q)
    );
    return matchesSubject || matchesTopic;
  });

  return (
    <div className="space-y-6 pb-24">
      
      {/* Top Banner */}
      <div className="rounded-3xl bg-slate-900 dark:bg-slate-900 border border-slate-800 p-6 text-white shadow-lg space-y-3">
        <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400">
          <GraduationCap className="h-4 w-4" />
          <span>Curriculum topic explorer · sample coverage</span>
        </div>
        <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight">
          Kenyan CBC, CBE & KCSE Revision Syllabus Hub
        </h1>
        <p className="text-xs sm:text-sm text-slate-300 max-w-2xl">
          Browse strands, sub-strands, specific learning outcomes, key inquiry questions, and topical revision packages across PP1 to Grade 12 and KCSE examination papers.
        </p>

        {/* Search Bar */}
        <div className="pt-2">
          <div className="relative max-w-lg">
            <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search learning areas, strands, topics or questions (e.g. Integers, Soil, Digestive system, KCSE Tax)..."
              className="w-full h-11 pl-10 pr-4 rounded-xl border border-slate-700 bg-slate-800 text-xs text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
        </div>
      </div>

      {/* Category Filter Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        {(['All', 'Early Years', 'Primary', 'Junior Secondary', 'Senior Secondary', 'KCSE Revision'] as const).map(cat => (
          <button
            key={cat}
            onClick={() => {
              setActiveCategoryFilter(cat);
              // Set appropriate first grade if changing category
              if (cat === 'Early Years') setSelectedGrade('PP1');
              if (cat === 'Primary') setSelectedGrade('Grade 4');
              if (cat === 'Junior Secondary') setSelectedGrade('Grade 7');
              if (cat === 'Senior Secondary') setSelectedGrade('Grade 10');
              if (cat === 'KCSE Revision') setSelectedGrade('KCSE Revision');
            }}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold shrink-0 transition-all ${
              activeCategoryFilter === cat
                ? 'bg-[#008751] text-white shadow-sm'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200 dark:bg-slate-900 dark:border-slate-800 dark:text-slate-400'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Grade Selector Pills */}
      <div className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900 shadow-sm space-y-2">
        <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
          Select Grade / Level to Inspect:
        </label>
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {filteredGrades.map((grade) => (
            <button
              key={grade}
              onClick={() => setSelectedGrade(grade)}
              className={`h-9 px-3.5 shrink-0 rounded-xl text-xs font-semibold transition-all ${
                selectedGrade === grade
                  ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-sm'
                  : 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300'
              }`}
            >
              {grade}
            </button>
          ))}
        </div>
      </div>

      {/* Subject Cards */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-slate-900 dark:text-white">
            {selectedGrade} Curriculum Strands & Materials ({visibleSubjects.length} Areas)
          </h2>
          <span className="text-xs text-slate-500">M-Pesa Download: Ksh. 15</span>
        </div>

        {visibleSubjects.length === 0 ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center text-slate-500 dark:border-slate-800 dark:bg-slate-900">
            <p className="text-sm font-medium">No learning areas match your query "{searchQuery}".</p>
            <button
              onClick={() => setSearchQuery('')}
              className="mt-2 text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline"
            >
              Clear search filter
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {visibleSubjects.map((subject, idx) => (
              <div
                key={idx}
                className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900 shadow-sm hover:shadow-md transition-shadow space-y-4 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-emerald-600 dark:text-emerald-400 tracking-wider">
                        {subject.category} · {selectedGrade}
                      </span>
                      <h3 className="text-base font-bold text-slate-900 dark:text-white">
                        {subject.name}
                      </h3>
                    </div>
                    <div className="h-8 w-8 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 flex items-center justify-center text-emerald-700 dark:text-emerald-300 shrink-0">
                      <BookOpen className="h-4 w-4" />
                    </div>
                  </div>

                  {/* Topics List */}
                  <div className="space-y-2.5 pt-1">
                    {subject.topics.map((topic, tIdx) => (
                      <div key={tIdx} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 text-xs space-y-1.5 border border-slate-100 dark:border-slate-800">
                        <div className="font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                          <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                          <span>Strand: {topic.strand}</span>
                        </div>

                        <div className="text-[11px] text-slate-600 dark:text-slate-300">
                          <strong>Sub-strands: </strong>
                          {topic.subStrands.join(' · ')}
                        </div>

                        <p className="text-[11px] text-slate-500 dark:text-slate-400 italic">
                          "{topic.sampleOutcomes}"
                        </p>

                        <div className="text-[11px] text-emerald-700 dark:text-emerald-400 font-medium">
                          Inquiry: {topic.sampleQuestions}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Actions: Load into generator or Direct Download */}
                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
                  <button
                    onClick={() => onSelectForGenerator(selectedGrade, subject.name)}
                    className="flex items-center gap-1.5 text-xs font-semibold text-emerald-700 dark:text-emerald-400 hover:text-emerald-800 dark:hover:text-emerald-300 py-1.5"
                  >
                    <Sparkles className="h-3.5 w-3.5" />
                    <span>Generate Scheme</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => onInitiateMaterialDownload(`${selectedGrade} ${subject.name} Revision Pack`, 'docx')}
                      className="px-2.5 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-semibold text-[11px] hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                      title="Download Word (.docx) - Ksh. 15"
                    >
                      Word · Ksh 20
                    </button>
                    <button
                      onClick={() => onInitiateMaterialDownload(`${selectedGrade} ${subject.name} Revision Pack`, 'pdf')}
                      className="px-2.5 py-1.5 rounded-lg bg-[#008751] text-white font-semibold text-[11px] hover:bg-[#007043] transition-colors"
                      title="Download PDF (.pdf) - Ksh. 15"
                    >
                      PDF · Ksh 20
                    </button>
                  </div>
                </div>

              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
};
