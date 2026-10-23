import React, { useState, useMemo } from 'react';
import { 
  Search, 
  X, 
  BookOpen, 
  FileSpreadsheet, 
  Lightbulb, 
  ArrowRight, 
  Sparkles, 
  ExternalLink,
  Download,
  Filter
} from 'lucide-react';
import { GradeLevel, ContentIdea, SchemeDocument, CalendarEvent } from '../types';
import { searchService, SearchResultItem } from '../services/searchService';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  ideas: ContentIdea[];
  schemes: SchemeDocument[];
  calendarEvents: CalendarEvent[];
  onSelectGradeSubject: (grade: GradeLevel, subject: string, strand?: string, docType?: 'scheme' | 'lesson_plan') => void;
  onNavigateToTab: (tab: any) => void;
  onInitiateDownload: (docOrTitle: SchemeDocument | string, format: 'docx' | 'pdf', type?: any) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  ideas,
  schemes,
  calendarEvents,
  onSelectGradeSubject,
  onNavigateToTab,
  onInitiateDownload,
}) => {
  const [query, setQuery] = useState('');
  const [selectedType, setSelectedType] = useState<'all' | 'syllabus_topic' | 'template' | 'saved_scheme' | 'content_idea'>('all');

  // Compute matched items
  const results = useMemo(() => {
    return searchService.searchAll(
      query,
      { resultType: selectedType },
      schemes,
      ideas
    );
  }, [query, selectedType, schemes, ideas]);

  if (!isOpen) return null;

  const quickPrompts = [
    'Orthographic projection',
    'Taxation PAYE',
    'Acids & Bases',
    'Kitchen garden',
    'Fractions',
    'Onion cell'
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center p-3 sm:p-6 pt-12 sm:pt-16 bg-slate-950/75 backdrop-blur-md animate-in fade-in duration-150">
      <div className="w-full max-w-2xl rounded-3xl bg-white shadow-2xl dark:bg-slate-900 border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[85vh]">
        
        {/* Search Input Bar */}
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center gap-3 bg-slate-50/50 dark:bg-slate-950/40">
          <Search className="h-5 w-5 text-emerald-600 shrink-0" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search all Kenyan syllabus topics, PP1-Gr12, schemes, or ideas..."
            className="w-full bg-transparent text-sm text-slate-900 dark:text-white outline-none placeholder-slate-400"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 rounded-lg"
              title="Clear"
            >
              <X className="h-4 w-4" />
            </button>
          )}
          <button
            onClick={onClose}
            className="text-xs font-semibold text-slate-500 hover:text-slate-900 dark:hover:text-white px-2.5 py-1 rounded-lg bg-slate-200/60 dark:bg-slate-800"
          >
            Esc
          </button>
        </div>

        {/* Filter Quick Pills */}
        <div className="px-4 py-2 border-b border-slate-100 dark:border-slate-800/80 flex items-center justify-between gap-2 overflow-x-auto scrollbar-none text-xs">
          <div className="flex items-center gap-1">
            {[
              { id: 'all', label: 'All' },
              { id: 'syllabus_topic', label: 'Syllabus' },
              { id: 'template', label: 'Templates' },
              { id: 'saved_scheme', label: 'Saved Docs' },
              { id: 'content_idea', label: 'Ideas' },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setSelectedType(tab.id as any)}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                  selectedType === tab.id
                    ? 'bg-[#008751] text-white'
                    : 'text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <button
            onClick={() => {
              onNavigateToTab('search');
              onClose();
            }}
            className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1 shrink-0"
          >
            <span>Open Full Search Hub</span>
            <ExternalLink className="h-3 w-3" />
          </button>
        </div>

        {/* Results Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {!query ? (
            <div className="py-8 space-y-4 text-center">
              <div className="space-y-1">
                <p className="text-sm font-bold text-slate-800 dark:text-slate-200">
                  Universal Kenyan Curriculum Search
                </p>
                <p className="text-xs text-slate-500">
                  Search across Early Years (PP1–PP2), Primary (Grades 1–6), Junior Secondary (Grades 7–9), Senior Secondary (Grades 10–12), and KCSE Revision.
                </p>
              </div>

              {/* Quick Prompts */}
              <div className="flex flex-wrap items-center justify-center gap-1.5 pt-2">
                {quickPrompts.map((p) => (
                  <button
                    key={p}
                    onClick={() => setQuery(p)}
                    className="px-3 py-1 rounded-xl bg-slate-100 hover:bg-emerald-50 hover:text-emerald-900 dark:bg-slate-800 dark:hover:bg-emerald-950/80 dark:hover:text-emerald-300 text-xs font-medium text-slate-700 dark:text-slate-300 transition-colors"
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>
          ) : results.length === 0 ? (
            <div className="py-12 text-center text-slate-400 space-y-2">
              <p className="text-xs font-medium">No results found for "{query}".</p>
              <button
                onClick={() => setQuery('')}
                className="text-xs font-semibold text-emerald-600 hover:underline"
              >
                Clear query
              </button>
            </div>
          ) : (
            <div className="space-y-2">
              {results.slice(0, 12).map((res) => {
                const isSaved = res.type === 'saved_scheme';
                const isTemplate = res.type === 'template';
                const isIdea = res.type === 'content_idea';

                return (
                  <div
                    key={res.id}
                    className="p-3.5 rounded-2xl border border-slate-100 dark:border-slate-800 hover:border-emerald-300 dark:hover:border-emerald-800 bg-slate-50/50 dark:bg-slate-800/40 hover:bg-white dark:hover:bg-slate-800/80 transition-all space-y-2"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                            {res.grade} · {res.subject}
                          </span>
                          {isSaved && (
                            <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300">
                              Saved Doc
                            </span>
                          )}
                          {isTemplate && (
                            <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300">
                              Template
                            </span>
                          )}
                        </div>

                        <h4 className="text-xs font-bold text-slate-900 dark:text-white mt-0.5">
                          {res.title}
                        </h4>

                        <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1 mt-0.5">
                          Strand: {res.strand} {res.subStrand ? `· ${res.subStrand}` : ''}
                        </p>
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0">
                        <button
                          onClick={() => {
                            if (isSaved && res.savedDoc) {
                              onSelectGradeSubject(res.grade, res.subject, res.strand);
                            } else {
                              onSelectGradeSubject(res.grade, res.subject, res.strand, 'scheme');
                            }
                            onClose();
                          }}
                          className="flex items-center gap-1 h-7 px-2.5 rounded-lg bg-emerald-600 text-white font-semibold text-[11px] hover:bg-emerald-700 transition-colors"
                          title="Load into Scheme Generator"
                        >
                          <Sparkles className="h-3 w-3" />
                          <span>Generate</span>
                        </button>

                        <button
                          onClick={() => {
                            if (isSaved && res.savedDoc) {
                              onInitiateDownload(res.savedDoc, 'docx', 'scheme');
                            } else {
                              onInitiateDownload(`${res.grade} ${res.subject} (${res.strand})`, 'docx', 'scheme');
                            }
                          }}
                          className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300"
                          title="Download Word (Ksh. 20)"
                        >
                          <Download className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60 flex items-center justify-between text-[11px] text-slate-500">
          <span>Results: {results.length} available</span>
          <button
            onClick={() => {
              onNavigateToTab('search');
              onClose();
            }}
            className="font-semibold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1"
          >
            <span>Advanced Search Hub</span>
            <ArrowRight className="h-3 w-3" />
          </button>
        </div>

      </div>
    </div>
  );
};
