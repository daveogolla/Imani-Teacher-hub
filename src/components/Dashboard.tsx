import React from 'react';
import { 
  FileSpreadsheet, 
  BookOpen, 
  Lightbulb, 
  Calendar, 
  ArrowRight, 
  Download, 
  FileText, 
  CheckCircle2, 
  GraduationCap, 
  Clock, 
  Sparkles,
  PhoneCall
} from 'lucide-react';
import { GradeLevel, SchemeDocument, ContentIdea, UserProfile, MpesaReceipt } from '../types';
import { GRADES_LIST } from '../data/kenyanCurriculum';

interface DashboardProps {
  userProfile: UserProfile;
  savedSchemes: SchemeDocument[];
  contentIdeas: ContentIdea[];
  payments: MpesaReceipt[];
  onNavigateToGenerator: (grade?: GradeLevel, subject?: string) => void;
  onNavigateToSyllabus: (grade?: GradeLevel) => void;
  onNavigateToSearch?: () => void;
  onNavigateToIdeas: () => void;
  onNavigateToCalendar: () => void;
  onDownloadScheme: (scheme: SchemeDocument, format: 'docx' | 'pdf') => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  userProfile,
  savedSchemes,
  contentIdeas,
  payments,
  onNavigateToGenerator,
  onNavigateToSyllabus,
  onNavigateToSearch,
  onNavigateToIdeas,
  onNavigateToCalendar,
  onDownloadScheme,
}) => {
  const activeIdeasCount = contentIdeas.filter(i => i.status !== 'Completed').length;
  const completedIdeasCount = contentIdeas.filter(i => i.status === 'Completed').length;

  return (
    <div className="space-y-6 pb-20">
      
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-900 via-[#008751] to-teal-800 p-6 sm:p-8 text-white shadow-lg">
        <div className="relative z-10 max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-white/15 backdrop-blur-md px-3 py-1 text-xs font-medium text-emerald-100">
            <span>Kenyan CBC & KCSE Curriculum Portal</span>
          </div>
          
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Karibu, {userProfile.teacherName || 'Mwalimu'}!
          </h1>
          
          <p className="text-sm text-emerald-100/90 leading-relaxed">
            Generate KICD-compliant Schemes of Work, Lesson Plans, and KCSE revision materials.
            Export directly to <strong>Microsoft Word (.docx)</strong> or <strong>PDF (.pdf)</strong> with custom cover pages, TSC credentials, administrative sign-offs, and continuous pagination.
          </p>

          <div className="pt-2 flex flex-wrap gap-2.5">
            <button
              onClick={() => onNavigateToSearch ? onNavigateToSearch() : onNavigateToSyllabus()}
              className="flex items-center gap-2 h-10 px-4 rounded-xl bg-white text-emerald-950 font-bold text-xs shadow-md hover:bg-emerald-50 active:scale-95 transition-all"
            >
              <Sparkles className="h-4 w-4 text-emerald-700" />
              <span>Search PP1–Gr 12 Syllabus</span>
            </button>
            <button
              onClick={() => onNavigateToGenerator('Grade 8', 'Pre-Technical Studies')}
              className="flex items-center gap-2 h-10 px-4 rounded-xl bg-emerald-950/40 text-white font-semibold text-xs border border-white/20 hover:bg-emerald-950/60 transition-colors"
            >
              <FileSpreadsheet className="h-4 w-4" />
              <span>Generate JSS Scheme</span>
            </button>
            <button
              onClick={() => onNavigateToGenerator('KCSE Revision', 'Mathematics Paper 1 & 2 Revision')}
              className="flex items-center gap-2 h-10 px-4 rounded-xl bg-emerald-950/40 text-white font-semibold text-xs border border-white/20 hover:bg-emerald-950/60 transition-colors"
            >
              <GraduationCap className="h-4 w-4" />
              <span>KCSE Revision</span>
            </button>
          </div>
        </div>

        {/* M-Pesa Transparent Pricing Notice */}
        <div className="mt-6 pt-4 border-t border-white/15 flex flex-wrap items-center justify-between gap-3 text-xs text-emerald-100">
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 rounded-full bg-emerald-400" />
            <span>Document Downloads: <strong>Ksh. 20 per item</strong> via M-PESA Send Money to <strong>0707423879</strong></span>
          </div>
          <span className="font-mono text-[11px] bg-black/20 px-2 py-0.5 rounded">
            Receipts: {payments.length} Unlocked
          </span>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        
        <div className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
            <span className="text-xs font-medium">Curriculum Reach</span>
            <GraduationCap className="h-4 w-4 text-emerald-600" />
          </div>
          <p className="mt-2 text-2xl font-bold tracking-tight text-slate-900 dark:text-white tabular-nums">
            PP1 – Gr.12
          </p>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
            + KCSE Revision Materials
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
            <span className="text-xs font-medium">Generated Schemes</span>
            <FileSpreadsheet className="h-4 w-4 text-blue-600" />
          </div>
          <p className="mt-2 text-2xl font-bold tracking-tight text-slate-900 dark:text-white tabular-nums">
            {savedSchemes.length}
          </p>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
            Ready for Word & PDF export
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
            <span className="text-xs font-medium">Teaching Ideas</span>
            <Lightbulb className="h-4 w-4 text-amber-500" />
          </div>
          <p className="mt-2 text-2xl font-bold tracking-tight text-slate-900 dark:text-white tabular-nums">
            {activeIdeasCount}
          </p>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
            {completedIdeasCount} lessons delivered
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
            <span className="text-xs font-medium">Downloads Unlocked</span>
            <Download className="h-4 w-4 text-emerald-600" />
          </div>
          <p className="mt-2 text-2xl font-bold tracking-tight text-slate-900 dark:text-white tabular-nums">
            {payments.length}
          </p>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
            Ksh. 20 M-Pesa verified
          </p>
        </div>

      </div>

      {/* Grade Quick Jump Bar */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold text-slate-900 dark:text-white">
              Syllabus Jump by Grade / Level
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Select any level to generate schemes or view KICD topics & previous grade contents
            </p>
          </div>
          <button
            onClick={() => onNavigateToSyllabus()}
            className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1"
          >
            <span>View All</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>

        {/* Scrollable Grade Badges */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-1 scrollbar-none">
          {GRADES_LIST.map((grade) => (
            <button
              key={grade}
              onClick={() => onNavigateToGenerator(grade)}
              className="h-9 px-3.5 shrink-0 rounded-xl bg-slate-100 hover:bg-emerald-50 hover:text-emerald-800 hover:border-emerald-300 dark:bg-slate-800 dark:hover:bg-emerald-950/60 dark:hover:text-emerald-300 border border-slate-200/60 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 transition-all active:scale-95 whitespace-nowrap"
            >
              {grade}
            </button>
          ))}
        </div>
      </div>

      {/* Two Column Layout: Quick Actions & Recent Documents */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Cols: Primary Action Cards */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-base font-bold text-slate-900 dark:text-white">
            Curriculum Planning Tools
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            
            <button
              onClick={() => onNavigateToGenerator()}
              className="flex flex-col text-left p-4 rounded-2xl border border-slate-200 hover:border-emerald-500 bg-white dark:border-slate-800 dark:bg-slate-900 hover:shadow-md transition-all group"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 group-hover:scale-105 transition-transform">
                <FileSpreadsheet className="h-5 w-5" />
              </div>
              <h3 className="mt-3 text-sm font-bold text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400">
                Schemes of Work Generator
              </h3>
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                13-week standard KICD scheme matrix with term dates, half-term breaks, and lessons/week.
              </p>
              <div className="mt-3 flex items-center text-xs font-semibold text-emerald-600 dark:text-emerald-400 gap-1">
                <span>Start Generating</span>
                <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </button>

            <button
              onClick={() => onNavigateToGenerator('Grade 7', 'Integrated Science')}
              className="flex flex-col text-left p-4 rounded-2xl border border-slate-200 hover:border-blue-500 bg-white dark:border-slate-800 dark:bg-slate-900 hover:shadow-md transition-all group"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300 group-hover:scale-105 transition-transform">
                <BookOpen className="h-5 w-5" />
              </div>
              <h3 className="mt-3 text-sm font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400">
                CBC Daily Lesson Plans
              </h3>
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                Structured lesson development steps, inquiry questions, core competencies, and reflection.
              </p>
              <div className="mt-3 flex items-center text-xs font-semibold text-blue-600 dark:text-blue-400 gap-1">
                <span>Create Lesson Plan</span>
                <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </button>

            <button
              onClick={() => onNavigateToIdeas()}
              className="flex flex-col text-left p-4 rounded-2xl border border-slate-200 hover:border-amber-500 bg-white dark:border-slate-800 dark:bg-slate-900 hover:shadow-md transition-all group"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 group-hover:scale-105 transition-transform">
                <Lightbulb className="h-5 w-5" />
              </div>
              <h3 className="mt-3 text-sm font-bold text-slate-900 dark:text-white group-hover:text-amber-600 dark:group-hover:text-amber-400">
                Content Ideas & Post Scheduler
              </h3>
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                Schedule practical sessions, teaching posts, experiments, and track execution progress.
              </p>
              <div className="mt-3 flex items-center text-xs font-semibold text-amber-600 dark:text-amber-400 gap-1">
                <span>Schedule Ideas</span>
                <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </button>

            <button
              onClick={() => onNavigateToCalendar()}
              className="flex flex-col text-left p-4 rounded-2xl border border-slate-200 hover:border-purple-500 bg-white dark:border-slate-800 dark:bg-slate-900 hover:shadow-md transition-all group"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300 group-hover:scale-105 transition-transform">
                <Calendar className="h-5 w-5" />
              </div>
              <h3 className="mt-3 text-sm font-bold text-slate-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400">
                Academic Year 2026 Calendar
              </h3>
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                Official Ministry term dates, half-term breaks, closing dates, and KCSE/KPSEA exams.
              </p>
              <div className="mt-3 flex items-center text-xs font-semibold text-purple-600 dark:text-purple-400 gap-1">
                <span>View Term Dates</span>
                <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </button>

            <button
              onClick={() => onNavigateToSearch ? onNavigateToSearch() : onNavigateToSyllabus()}
              className="flex flex-col text-left p-4 rounded-2xl border border-slate-200 hover:border-emerald-500 bg-white dark:border-slate-800 dark:bg-slate-900 hover:shadow-md transition-all group"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 group-hover:scale-105 transition-transform">
                <Sparkles className="h-5 w-5 text-emerald-600" />
              </div>
              <h3 className="mt-3 text-sm font-bold text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400">
                Syllabus & Topics Search
              </h3>
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                Search all PP1 to Grade 12 curriculum strands, outcomes, questions, and matching templates.
              </p>
              <div className="mt-3 flex items-center text-xs font-semibold text-emerald-600 dark:text-emerald-400 gap-1">
                <span>Open Search Hub</span>
                <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </button>

          </div>
        </div>

        {/* Right 1 Col: Saved & Recent Documents */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              Recent Documents
            </h2>
            <span className="text-xs text-slate-500">{savedSchemes.length} total</span>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900 shadow-sm space-y-3">
            {savedSchemes.length === 0 ? (
              <div className="py-8 text-center text-slate-500 dark:text-slate-400 space-y-2">
                <FileText className="h-8 w-8 mx-auto text-slate-400 opacity-60" />
                <p className="text-xs font-medium">No generated documents yet.</p>
                <button
                  onClick={() => onNavigateToGenerator()}
                  className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline"
                >
                  Create your first scheme of work →
                </button>
              </div>
            ) : (
              savedSchemes.slice(0, 4).map((scheme) => (
                <div
                  key={scheme.id}
                  className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/70 border border-slate-100 dark:border-slate-800 space-y-2"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-emerald-600 dark:text-emerald-400 tracking-wider">
                        {scheme.grade} · Term {scheme.term}
                      </span>
                      <h4 className="text-xs font-bold text-slate-900 dark:text-white line-clamp-1">
                        {scheme.subject}
                      </h4>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400">
                        {scheme.schoolName}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-1 border-t border-slate-200/60 dark:border-slate-700/60 text-[11px]">
                    <span className="text-slate-400">{scheme.rows.length} Lessons</span>
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => onDownloadScheme(scheme, 'docx')}
                        className="px-2 py-1 rounded bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-200 font-semibold hover:text-emerald-600 hover:border-emerald-300 text-[10px] transition-colors"
                        title="Download Word (.docx)"
                      >
                        Word
                      </button>
                      <button
                        onClick={() => onDownloadScheme(scheme, 'pdf')}
                        className="px-2 py-1 rounded bg-emerald-600 text-white font-semibold hover:bg-emerald-700 text-[10px] transition-colors"
                        title="Download PDF (.pdf)"
                      >
                        PDF
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

      </div>

    </div>
  );
};
