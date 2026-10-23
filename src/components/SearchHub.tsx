import React, { useState, useMemo } from 'react';
import { 
  Search, 
  X, 
  Filter, 
  Sparkles, 
  BookOpen, 
  FileSpreadsheet, 
  FileText, 
  Lightbulb, 
  Download, 
  ArrowRight, 
  Clock, 
  CheckCircle2, 
  GraduationCap, 
  Trash2,
  BookmarkPlus
} from 'lucide-react';
import { GradeLevel, SchemeDocument, ContentIdea } from '../types';
import { searchService, SearchResultItem, SearchFilters } from '../services/searchService';
import { GRADES_LIST } from '../data/kenyanCurriculum';

interface SearchHubProps {
  savedSchemes: SchemeDocument[];
  contentIdeas: ContentIdea[];
  onSelectForGenerator: (grade: GradeLevel, subject: string, strand?: string, docType?: 'scheme' | 'lesson_plan') => void;
  onInitiateDownload: (docOrTitle: SchemeDocument | string, format: 'docx' | 'pdf', type?: 'scheme' | 'lesson_plan' | 'revision') => void;
  onSaveIdea: (idea: ContentIdea) => void;
}

const POPULAR_SEARCHES = [
  { label: 'Orthographic Projection', query: 'Orthographic Projection' },
  { label: 'Taxation & PAYE', query: 'Taxation' },
  { label: 'Acids & Bases', query: 'Acids' },
  { label: 'Kitchen Garden', query: 'Kitchen garden' },
  { label: 'Fractions', query: 'Fractions' },
  { label: 'Onion Cell', query: 'Onion cell' },
  { label: 'Newton’s Laws', query: 'Newton' },
  { label: 'Photosynthesis', query: 'Photosynthesis' },
];

export const SearchHub: React.FC<SearchHubProps> = ({
  savedSchemes,
  contentIdeas,
  onSelectForGenerator,
  onInitiateDownload,
  onSaveIdea,
}) => {
  const [query, setQuery] = useState('');
  const [levelGroup, setLevelGroup] = useState<SearchFilters['levelGroup']>('all');
  const [resultType, setResultType] = useState<SearchFilters['resultType']>('all');
  const [selectedSubject, setSelectedSubject] = useState<string>('all');
  const [recentSearches, setRecentSearches] = useState<string[]>(() => searchService.getRecentSearches());
  const [savedIdeaNotice, setSavedIdeaNotice] = useState<string | null>(null);

  // Available subjects for current level
  const availableSubjectsList = useMemo(() => {
    const list = new Set<string>();
    // Collect from schemes and ideas and common curriculum
    list.add('Mathematics');
    list.add('English');
    list.add('Kiswahili');
    list.add('Integrated Science');
    list.add('Pre-Technical Studies');
    list.add('Agriculture & Nutrition');
    list.add('Social Studies');
    list.add('Biology');
    list.add('Chemistry');
    list.add('Physics');
    list.add('Creative Arts & Sports');
    return Array.from(list);
  }, []);

  // Compute search results
  const results = useMemo(() => {
    return searchService.searchAll(
      query,
      {
        levelGroup,
        resultType,
        subject: selectedSubject === 'all' ? undefined : selectedSubject
      },
      savedSchemes,
      contentIdeas
    );
  }, [query, levelGroup, resultType, selectedSubject, savedSchemes, contentIdeas]);

  const handleExecuteSearch = (newQuery: string) => {
    setQuery(newQuery);
    searchService.addRecentSearch(newQuery);
    setRecentSearches(searchService.getRecentSearches());
  };

  const handleClearHistory = () => {
    searchService.clearRecentSearches();
    setRecentSearches([]);
  };

  const handleQuickSaveIdea = (res: SearchResultItem) => {
    const newIdea: ContentIdea = {
      id: `idea-${Date.now()}`,
      title: `${res.strand} — Practical Lab`,
      grade: res.grade,
      subject: res.subject,
      notes: res.description || `Inquiry and learning experience for ${res.strand}`,
      scheduledDate: new Date(Date.now() + 86400000 * 3).toISOString().split('T')[0],
      status: 'Idea',
      progress: 25,
      createdAt: new Date().toISOString().split('T')[0]
    };
    onSaveIdea(newIdea);
    setSavedIdeaNotice(`Saved "${res.strand}" to your Teaching Ideas!`);
    setTimeout(() => setSavedIdeaNotice(null), 3000);
  };

  // Helper to highlight matching text
  const highlightMatch = (text?: string) => {
    if (!text) return null;
    if (!query.trim()) return text;

    const regex = new RegExp(`(${query.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    const parts = text.split(regex);

    return parts.map((part, i) => 
      regex.test(part) ? (
        <mark key={i} className="bg-amber-200 dark:bg-amber-900/80 text-amber-950 dark:text-amber-100 px-0.5 rounded font-semibold">
          {part}
        </mark>
      ) : (
        part
      )
    );
  };

  return (
    <div className="space-y-6 pb-28">
      
      {/* Search Header Banner */}
      <div className="rounded-3xl bg-slate-900 dark:bg-slate-900 border border-slate-800 p-6 sm:p-8 text-white shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <div className="inline-flex items-center gap-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 text-xs font-semibold text-emerald-400">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Universal Kenyan Syllabus Search Engine</span>
          </div>
          <span className="text-xs text-slate-400">
            Covers PP1 to Grade 12 & KCSE
          </span>
        </div>

        <div className="max-w-2xl space-y-1.5">
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Search All Syllabus Topics & Materials
          </h1>
          <p className="text-xs sm:text-sm text-slate-300">
            Enter any topic, keyword, or strand to instantly find matching curriculum learning areas, specific outcomes, generation templates, and saved documents.
          </p>
        </div>

        {/* Search Bar Input */}
        <div className="relative max-w-3xl pt-2">
          <div className="relative flex items-center">
            <Search className="absolute left-4 h-5 w-5 text-emerald-500 shrink-0 pointer-events-none" />
            <input
              type="text"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                if (e.target.value.trim().length > 2) {
                  searchService.addRecentSearch(e.target.value);
                  setRecentSearches(searchService.getRecentSearches());
                }
              }}
              placeholder="Search topics (e.g. 'Orthographic projection', 'Taxation PAYE', 'Onion cell', 'Acids', 'Soil', 'Living things')..."
              className="w-full h-13 pl-12 pr-10 rounded-2xl bg-slate-800/90 border border-slate-700 text-white placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all shadow-inner"
            />
            {query && (
              <button
                onClick={() => setQuery('')}
                className="absolute right-3 h-8 w-8 rounded-xl hover:bg-slate-700 flex items-center justify-center text-slate-400 hover:text-white transition-colors"
                title="Clear search"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>

        {/* Popular Searches Prompt Row */}
        <div className="pt-2 flex flex-wrap items-center gap-1.5 text-xs">
          <span className="text-slate-400 font-medium">Popular:</span>
          {POPULAR_SEARCHES.map((item) => (
            <button
              key={item.label}
              onClick={() => handleExecuteSearch(item.query)}
              className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-emerald-950/80 hover:text-emerald-300 border border-slate-700/80 text-slate-300 text-[11px] font-medium transition-colors"
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* Temporary Notice if Idea Saved */}
      {savedIdeaNotice && (
        <div className="p-3 rounded-2xl bg-emerald-100 border border-emerald-300 text-emerald-900 dark:bg-emerald-950 dark:border-emerald-800 dark:text-emerald-200 text-xs font-semibold flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="h-4 w-4 text-emerald-600" />
          <span>{savedIdeaNotice}</span>
        </div>
      )}

      {/* Recent Searches Bar (If Any) */}
      {recentSearches.length > 0 && !query && (
        <div className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900 shadow-sm flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 overflow-x-auto scrollbar-none py-1">
            <span className="text-xs font-bold text-slate-500 flex items-center gap-1 shrink-0">
              <Clock className="h-3.5 w-3.5" />
              <span>Recent:</span>
            </span>
            {recentSearches.map((s, idx) => (
              <button
                key={idx}
                onClick={() => handleExecuteSearch(s)}
                className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-medium shrink-0 transition-colors"
              >
                {s}
              </button>
            ))}
          </div>

          <button
            onClick={handleClearHistory}
            className="text-[11px] text-slate-400 hover:text-rose-600 shrink-0 transition-colors flex items-center gap-1"
            title="Clear history"
          >
            <Trash2 className="h-3 w-3" />
            <span className="hidden sm:inline">Clear</span>
          </button>
        </div>
      )}

      {/* Filter Tabs Section */}
      <div className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900 shadow-sm space-y-3">
        
        {/* Row 1: Level Groups */}
        <div className="space-y-1.5">
          <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block">
            Filter by Level / Class
          </label>
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            {[
              { id: 'all', label: 'All Levels (PP1–Gr. 12)' },
              { id: 'early_years', label: 'Early Years (PP1–PP2)' },
              { id: 'lower_primary', label: 'Lower Primary (Gr. 1–3)' },
              { id: 'upper_primary', label: 'Upper Primary (Gr. 4–6)' },
              { id: 'junior_secondary', label: 'Junior Secondary (Gr. 7–9)' },
              { id: 'senior_secondary', label: 'Senior Secondary (Gr. 10–12)' },
              { id: 'kcse', label: 'KCSE Revision' },
            ].map(lvl => (
              <button
                key={lvl.id}
                onClick={() => setLevelGroup(lvl.id as any)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold shrink-0 transition-all ${
                  levelGroup === lvl.id
                    ? 'bg-[#008751] text-white shadow-sm'
                    : 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300'
                }`}
              >
                {lvl.label}
              </button>
            ))}
          </div>
        </div>

        {/* Row 2: Type Filter & Subject Filter */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-100 dark:border-slate-800">
          
          {/* Result Type Tabs */}
          <div className="flex items-center gap-1 overflow-x-auto scrollbar-none">
            {[
              { id: 'all', label: 'All Results' },
              { id: 'syllabus_topic', label: 'Syllabus Strands' },
              { id: 'template', label: 'Scheme Templates' },
              { id: 'saved_scheme', label: 'Saved Documents' },
              { id: 'content_idea', label: 'Content Ideas' },
            ].map(t => (
              <button
                key={t.id}
                onClick={() => setResultType(t.id as any)}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                  resultType === t.id
                    ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          {/* Subject Filter Dropdown */}
          <div className="flex items-center gap-1.5 text-xs">
            <span className="text-slate-500 font-medium">Subject:</span>
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="h-8 px-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-xs font-semibold text-slate-800 dark:text-slate-200 outline-none"
            >
              <option value="all">All Subjects</option>
              {availableSubjectsList.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

        </div>

      </div>

      {/* Results Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h2 className="text-base font-bold text-slate-900 dark:text-white">
            Search Results
          </h2>
          <span className="text-xs font-mono bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-2 py-0.5 rounded-full">
            {results.length} found
          </span>
        </div>

        <span className="text-xs text-slate-500">
          Downloads: Ksh. 20 M-Pesa to 0707423879
        </span>
      </div>

      {/* Results Grid */}
      {results.length === 0 ? (
        <div className="rounded-3xl border border-slate-200 bg-white p-12 text-center text-slate-500 dark:border-slate-800 dark:bg-slate-900 space-y-3">
          <BookOpen className="h-10 w-10 mx-auto text-emerald-600/50" />
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            No matching curriculum strands found
          </h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            We couldn't find any curriculum topics matching "{query}" with current filters. Try searching for related keywords like <strong>"Numbers"</strong>, <strong>"Living Things"</strong>, <strong>"Fractions"</strong>, or <strong>"Matter"</strong>.
          </p>
          <button
            onClick={() => {
              setQuery('');
              setLevelGroup('all');
              setResultType('all');
              setSelectedSubject('all');
            }}
            className="text-xs font-semibold text-emerald-600 hover:underline pt-2 inline-block"
          >
            Reset all search filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {results.map((res) => {
            const isSaved = res.type === 'saved_scheme';
            const isTemplate = res.type === 'template';
            const isIdea = res.type === 'content_idea';

            return (
              <div
                key={res.id}
                className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  
                  {/* Top Header Tag */}
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                          {res.grade} · {res.category}
                        </span>
                        {isSaved && (
                          <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300">
                            Saved Document
                          </span>
                        )}
                        {isTemplate && (
                          <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300">
                            KICD Template
                          </span>
                        )}
                        {isIdea && (
                          <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300">
                            Content Idea
                          </span>
                        )}
                      </div>

                      <h3 className="text-base font-bold text-slate-900 dark:text-white mt-0.5">
                        {highlightMatch(res.title)}
                      </h3>
                      <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                        Learning Area: {highlightMatch(res.subject)}
                      </p>
                    </div>

                    <div className="h-9 w-9 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 flex items-center justify-center text-emerald-700 dark:text-emerald-300 shrink-0">
                      {isSaved ? <FileSpreadsheet className="h-4 w-4" /> : isIdea ? <Lightbulb className="h-4 w-4" /> : <BookOpen className="h-4 w-4" />}
                    </div>
                  </div>

                  {/* Strand & Sub-strand Box */}
                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 text-xs space-y-1.5">
                    <div className="font-bold text-slate-900 dark:text-slate-100">
                      Strand / Topic: {highlightMatch(res.strand)}
                    </div>
                    {res.subStrand && (
                      <div className="text-[11px] text-slate-600 dark:text-slate-300">
                        <strong>Sub-strand: </strong>{highlightMatch(res.subStrand)}
                      </div>
                    )}
                    {res.specificOutcomes && (
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 italic">
                        "{highlightMatch(res.specificOutcomes)}"
                      </p>
                    )}
                    {res.inquiryQuestions && (
                      <p className="text-[11px] text-emerald-700 dark:text-emerald-400 font-medium">
                        Inquiry: {highlightMatch(res.inquiryQuestions)}
                      </p>
                    )}
                  </div>

                </div>

                {/* Actions Row */}
                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-2">
                  
                  {/* Left: Load into generator or open */}
                  <div className="flex items-center gap-2">
                    {isSaved && res.savedDoc ? (
                      <button
                        onClick={() => onSelectForGenerator(res.grade, res.subject, res.strand)}
                        className="flex items-center gap-1 text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline"
                      >
                        <FileText className="h-3.5 w-3.5" />
                        <span>Edit Saved Scheme</span>
                      </button>
                    ) : (
                      <button
                        onClick={() => onSelectForGenerator(res.grade, res.subject, res.strand, 'scheme')}
                        className="flex items-center gap-1.5 h-8 px-3 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-900 dark:bg-emerald-950/80 dark:hover:bg-emerald-900 dark:text-emerald-200 text-xs font-bold transition-colors"
                      >
                        <Sparkles className="h-3.5 w-3.5 text-emerald-600" />
                        <span>Load in Generator</span>
                        <ArrowRight className="h-3.5 w-3.5" />
                      </button>
                    )}

                    {!isSaved && !isIdea && (
                      <button
                        onClick={() => handleQuickSaveIdea(res)}
                        className="p-2 rounded-xl text-slate-500 hover:text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-950 transition-colors"
                        title="Save to Content Ideas"
                      >
                        <BookmarkPlus className="h-4 w-4" />
                      </button>
                    )}
                  </div>

                  {/* Right: Quick Download with M-Pesa Ksh. 20 */}
                  <div className="flex items-center gap-1.5">
                    {isSaved && res.savedDoc ? (
                      <>
                        <button
                          onClick={() => onInitiateDownload(res.savedDoc!, 'docx', 'scheme')}
                          className="px-2.5 py-1.5 rounded-lg bg-slate-900 text-white font-semibold text-[11px] hover:bg-slate-800 transition-colors"
                          title="Download Word (.docx)"
                        >
                          Word
                        </button>
                        <button
                          onClick={() => onInitiateDownload(res.savedDoc!, 'pdf', 'scheme')}
                          className="px-2.5 py-1.5 rounded-lg bg-[#008751] text-white font-semibold text-[11px] hover:bg-[#007043] transition-colors"
                          title="Download PDF (.pdf)"
                        >
                          PDF
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => onInitiateDownload(`${res.grade} ${res.subject} (${res.strand})`, 'docx', 'scheme')}
                          className="px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-semibold text-[11px] transition-colors"
                          title="Download Word Document (Ksh. 20 M-Pesa)"
                        >
                          Word · Ksh 20
                        </button>
                        <button
                          onClick={() => onInitiateDownload(`${res.grade} ${res.subject} (${res.strand})`, 'pdf', 'scheme')}
                          className="px-2.5 py-1.5 rounded-lg bg-[#008751] hover:bg-[#007043] text-white font-semibold text-[11px] shadow-sm transition-colors"
                          title="Download PDF Document (Ksh. 20 M-Pesa)"
                        >
                          PDF · Ksh 20
                        </button>
                      </>
                    )}
                  </div>

                </div>

              </div>
            );
          })}
        </div>
      )}

    </div>
  );
};
