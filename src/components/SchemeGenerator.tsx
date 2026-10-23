import React, { useState, useEffect, useRef } from 'react';
import { 
  FileSpreadsheet, 
  Sparkles, 
  Download, 
  ChevronLeft, 
  ChevronRight, 
  Building2, 
  User, 
  Calendar, 
  Clock, 
  FileText, 
  CheckSquare, 
  Eye, 
  ShieldCheck, 
  Layers, 
  BookOpen, 
  HelpCircle,
  PlusCircle,
  Trash2
} from 'lucide-react';
import { GradeLevel, SchemeDocument, SchemeRow, UserProfile } from '../types';
import { GRADES_LIST, CURRICULUM_DATABASE } from '../data/kenyanCurriculum';
import { buildSchedule } from '../services/schedule';
import { storageService } from '../services/storageService';

interface SchemeGeneratorProps {
  userProfile: UserProfile;
  initialGrade?: GradeLevel;
  initialSubject?: string;
  initialStrand?: string;
  initialDocumentType?: 'scheme' | 'lesson_plan' | 'revision';
  onInitiateDownload: (scheme: SchemeDocument, format: 'docx' | 'pdf') => void;
}

export const SchemeGenerator: React.FC<SchemeGeneratorProps> = ({
  userProfile,
  initialGrade = 'Grade 8',
  initialSubject,
  initialStrand,
  initialDocumentType = 'scheme',
  onInitiateDownload,
}) => {
  // Form State
  const [documentType, setDocumentType] = useState<'scheme' | 'lesson_plan' | 'revision'>(initialDocumentType);
  const [schoolName, setSchoolName] = useState(userProfile.schoolName || '');
  const [teacherName, setTeacherName] = useState(userProfile.teacherName || '');
  const [tscNumber, setTscNumber] = useState(userProfile.tscNumber || '');

  // Grade Selection & Previous/Next Grade feature
  const [selectedGrade, setSelectedGrade] = useState<GradeLevel>(initialGrade);
  const gradeIndex = GRADES_LIST.indexOf(selectedGrade);

  // Available subjects for current grade
  const availableSubjects = CURRICULUM_DATABASE[selectedGrade] || [];
  const [selectedSubject, setSelectedSubject] = useState(
    initialSubject || (availableSubjects[0]?.name || 'Mathematics')
  );

  // Selected Topic / Strand
  const currentSubjectCurriculum = availableSubjects.find(s => s.name === selectedSubject);
  const [selectedStrand, setSelectedStrand] = useState(initialStrand || '');
  const [customTopic, setCustomTopic] = useState(initialStrand || '');

  // Synchronize when initial props change (e.g. from Search Hub or Syllabus click)
  useEffect(() => {
    if (initialGrade) setSelectedGrade(initialGrade);
  }, [initialGrade]);

  useEffect(() => {
    if (initialSubject) setSelectedSubject(initialSubject);
  }, [initialSubject]);

  useEffect(() => {
    if (initialStrand) {
      setSelectedStrand(initialStrand);
      setCustomTopic(initialStrand);
    }
  }, [initialStrand]);

  useEffect(() => {
    if (initialDocumentType) setDocumentType(initialDocumentType);
  }, [initialDocumentType]);

  // Update subject if grade changes
  useEffect(() => {
    const subjects = CURRICULUM_DATABASE[selectedGrade] || [];
    if (subjects.length > 0) {
      const match = subjects.find(s => s.name === selectedSubject);
      if (!match) {
        setSelectedSubject(subjects[0].name);
      }
    }
  }, [selectedGrade]);

  // Term and Timing Configuration
  const [term, setTerm] = useState(1);
  const [year, setYear] = useState(2026);
  const [lessonsPerWeek, setLessonsPerWeek] = useState(5);
  const [termStartDate, setTermStartDate] = useState('2026-01-05');
  const [halfTermDate, setHalfTermDate] = useState('2026-02-18 to 2026-02-22');
  const [closingDate, setClosingDate] = useState('2026-04-03');

  // Cover Page Sign-off options
  const [includeHodSign, setIncludeHodSign] = useState(true);
  const [includeDeputySign, setIncludeDeputySign] = useState(true);
  const [includePrincipalSign, setIncludePrincipalSign] = useState(true);

  // Generated Rows
  const [rows, setRows] = useState<SchemeRow[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [previewTab, setPreviewTab] = useState<'table' | 'cover'>('table');

  const [generationError, setGenerationError] = useState('');
  const [bookReference, setBookReference] = useState('');
  const [extraBreaks, setExtraBreaks] = useState('');
  const requestVersion = useRef(0);
  useEffect(()=>{ requestVersion.current++;setRows([]); },[selectedGrade,selectedSubject,customTopic,selectedStrand,documentType,term,year,lessonsPerWeek,termStartDate,halfTermDate,closingDate,extraBreaks,bookReference]);
  const generateCurriculumRows = async () => {
    const version=++requestVersion.current;
    setIsGenerating(true); setGenerationError('');
    try {
      const otherBreaks = extraBreaks.split('\n').filter(line=>line.trim()).map(line=>{
        const [start,end,...label] = line.split(',').map(p=>p.trim());
        return {start,end,label:label.join(',') || 'SCHOOL BREAK'};
      });
      const half = halfTermDate.split(/\s+to\s+/);
      const breaks = [...otherBreaks, ...(halfTermDate.trim() ? [{start:half[0],end:half[1]||half[0],label:'HALF-TERM BREAK'}] : [])];
      // Validate schedule before starting a paid AI request.
      buildSchedule([{} as SchemeRow],termStartDate,closingDate,lessonsPerWeek,breaks);
      const response=await fetch('/.netlify/functions/generate',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({grade:selectedGrade,subject:selectedSubject,topic:customTopic||selectedStrand,documentType,term,year,bookReference})});
      const data=await response.json();
      if(!response.ok)throw new Error(data.error||'Unable to generate a draft.');
      if(version!==requestVersion.current)throw new Error('Settings changed during generation. Generate again using the current settings.');
      setRows(documentType==='revision' ? data.rows.map((row:SchemeRow,index:number)=>({...row,id:`revision-${index}`,week:1,lesson:index+1})) : buildSchedule(data.rows,termStartDate,closingDate,lessonsPerWeek,breaks,documentType==='lesson_plan'));
    }catch(error){setGenerationError(error instanceof Error?error.message:'Generation failed. Please try again.');}
    finally{setIsGenerating(false);}
  };

  // Navigate to previous grade
  const handlePreviousGrade = () => {
    if (gradeIndex > 0) {
      setSelectedGrade(GRADES_LIST[gradeIndex - 1]);
    }
  };

  // Navigate to next grade
  const handleNextGrade = () => {
    if (gradeIndex < GRADES_LIST.length - 1) {
      setSelectedGrade(GRADES_LIST[gradeIndex + 1]);
    }
  };

  // Prepare full document object
  const getDocumentObject = (): SchemeDocument => ({
    id: `scheme-${Date.now()}`,
    title: `${selectedGrade} ${selectedSubject} ${documentType === 'scheme' ? 'Schemes of Work' : documentType === 'lesson_plan' ? 'Lesson Plan' : 'Revision Material'} - Term ${term}`,
    documentType,
    schoolName: schoolName.trim() || '',
    teacherName: teacherName.trim() || '',
    tscNumber: tscNumber.trim() || '',
    grade: selectedGrade,
    subject: selectedSubject,
    term,
    year,
    lessonsPerWeek,
    termStartDate,
    halfTermDate,
    closingDate,
    includeHodSign,
    includeDeputySign,
    includePrincipalSign,
    rows,
    bookReference,
    additionalBreaks: extraBreaks,
    createdAt: new Date().toISOString()
  });

  const handleDownloadClick = (format: 'docx' | 'pdf') => {
    if(!rows.length || isGenerating){setGenerationError('Generate a draft before requesting a download.');return;}
    const doc = getDocumentObject();
    // Save to local storage for persistence
    storageService.saveScheme(doc);
    onInitiateDownload(doc, format);
  };

  return (
    <div className="space-y-6 pb-24">
      <section className="rounded-2xl border border-amber-200 dark:border-amber-800 p-4 space-y-3 bg-amber-50/60 dark:bg-amber-950/20">
        <p className="text-sm font-semibold">Original AI drafts · teacher review required</p>
        <p className="text-xs">Check current KICD curriculum designs before use. Book references guide the draft; CBC HUB does not reproduce or verify every approved textbook.</p>
        <label className="block text-xs">Document type<select value={documentType} onChange={e=>{setDocumentType(e.target.value as any);setRows([])}} className="block w-full p-2 border rounded-lg mt-1 bg-white dark:bg-slate-950"><option value="scheme">Scheme of work</option><option value="lesson_plan">Lesson plan</option><option value="revision">CBE / KCSE revision</option></select></label>
        <label className="block text-xs">Subject or learning area<input value={selectedSubject} onChange={e=>setSelectedSubject(e.target.value)} placeholder="Enter any subject" className="block w-full p-2 border rounded-lg mt-1 bg-white dark:bg-slate-950"/></label>
        <label className="block text-xs">Book title, publisher, edition and pages (optional)<input value={bookReference} onChange={e=>setBookReference(e.target.value)} placeholder="Enter your KICD-approved reference" className="block w-full p-2 border rounded-lg mt-1 bg-white dark:bg-slate-950"/></label>
        <label className="block text-xs">Additional breaks: one per line, YYYY-MM-DD, YYYY-MM-DD, reason<textarea value={extraBreaks} onChange={e=>setExtraBreaks(e.target.value)} placeholder="2026-03-12, 2026-03-13, School break" className="block w-full p-2 border rounded-lg mt-1 bg-white dark:bg-slate-950"/></label>
        <p className="text-xs">Start and closing dates use YYYY-MM-DD. Half-term dates use YYYY-MM-DD to YYYY-MM-DD. Teaching stops on break dates and the closing date. Longer schemes cycle the generated sequence for practice and consolidation.</p>
        {generationError && <p role="alert" className="text-sm text-rose-700 dark:text-rose-300">{generationError}</p>}
        <button onClick={()=>{if(rows.length){storageService.saveScheme(getDocumentObject());setGenerationError('Draft saved to your workspace.')}else setGenerationError('Generate a draft first.')}} className="rounded-lg bg-emerald-900 text-white px-4 py-2 text-xs">Save draft without downloading</button>
      </section>

      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            <FileSpreadsheet className="h-6 w-6 text-[#008751]" />
            <span>KICD Schemes & Lesson Plan Generator</span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Kenyan CBC, CBE and KCSE planning drafts · Export to Word (.docx) or PDF
          </p>
        </div>

        {/* Quick Format & Generate */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleDownloadClick('docx')}
            className="flex items-center gap-2 h-10 px-3.5 rounded-xl bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 font-semibold text-xs hover:bg-slate-800 dark:hover:bg-white shadow-sm active:scale-95 transition-all"
          >
            <Download className="h-4 w-4" />
            <span>MS Word (.docx) · Ksh. 15</span>
          </button>
          <button
            onClick={() => handleDownloadClick('pdf')}
            className="flex items-center gap-2 h-10 px-3.5 rounded-xl bg-[#008751] text-white font-semibold text-xs hover:bg-[#007043] shadow-sm shadow-emerald-900/20 active:scale-95 transition-all"
          >
            <Download className="h-4 w-4" />
            <span>PDF (.pdf) · Ksh. 15</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Form Left, Preview Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Generator Form (5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          
          {/* Document Type Selector */}
          <div className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900 shadow-sm space-y-3">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
              1. Document Type
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setDocumentType('scheme')}
                className={`flex items-center justify-center gap-2 h-10 rounded-xl text-xs font-semibold transition-all ${
                  documentType === 'scheme'
                    ? 'bg-[#008751] text-white shadow-sm'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300'
                }`}
              >
                <FileSpreadsheet className="h-4 w-4" />
                <span>Schemes of Work</span>
              </button>
              <button
                type="button"
                onClick={() => setDocumentType('lesson_plan')}
                className={`flex items-center justify-center gap-2 h-10 rounded-xl text-xs font-semibold transition-all ${
                  documentType === 'lesson_plan'
                    ? 'bg-[#008751] text-white shadow-sm'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300'
                }`}
              >
                <BookOpen className="h-4 w-4" />
                <span>CBC Lesson Plan</span>
              </button>
            </div>
          </div>

          {/* School & Teacher Information Box */}
          <div className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                2. Institution & Teacher Credentials
              </label>
              <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">Document cover details</span>
            </div>

            <div className="space-y-2">
              <div>
                <label className="text-[11px] font-medium text-slate-500 dark:text-slate-400">School Name (For Cover Page)</label>
                <div className="relative mt-1">
                  <Building2 className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                  <input
                    type="text"
                    value={schoolName}
                    onChange={(e) => setSchoolName(e.target.value)}
                    placeholder="e.g. Alliance High School or Lenana School"
                    className="w-full h-10 pl-9 pr-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-xs font-medium text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[11px] font-medium text-slate-500 dark:text-slate-400">Teacher's Name</label>
                  <div className="relative mt-1">
                    <User className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                    <input
                      type="text"
                      value={teacherName}
                      onChange={(e) => setTeacherName(e.target.value)}
                      placeholder="e.g. Mwalimu Kamau"
                      className="w-full h-10 pl-9 pr-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-xs font-medium text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-medium text-slate-500 dark:text-slate-400">TSC Number</label>
                  <div className="relative mt-1">
                    <ShieldCheck className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                    <input
                      type="text"
                      value={tscNumber}
                      onChange={(e) => setTscNumber(e.target.value)}
                      placeholder="e.g. "
                      className="w-full h-10 pl-9 pr-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-xs font-medium font-mono text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 outline-none"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Grade / Class Navigator with "Previous Grade" & "Next Grade" */}
          <div className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                3. Grade / Class Navigation
              </label>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={handlePreviousGrade}
                  disabled={gradeIndex === 0}
                  className="flex items-center gap-0.5 px-2 py-1 rounded-lg border border-slate-200 dark:border-slate-700 text-[10px] font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-40"
                  title="Go to Previous Class/Grade"
                >
                  <ChevronLeft className="h-3 w-3" />
                  <span>Prev Grade</span>
                </button>
                <button
                  type="button"
                  onClick={handleNextGrade}
                  disabled={gradeIndex === GRADES_LIST.length - 1}
                  className="flex items-center gap-0.5 px-2 py-1 rounded-lg border border-slate-200 dark:border-slate-700 text-[10px] font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-40"
                  title="Go to Next Class/Grade"
                >
                  <span>Next Grade</span>
                  <ChevronRight className="h-3 w-3" />
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <select
                value={selectedGrade}
                onChange={(e) => setSelectedGrade(e.target.value as GradeLevel)}
                className="w-full h-10 px-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-xs font-semibold text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 outline-none"
              >
                {GRADES_LIST.map((g) => (
                  <option key={g} value={g}>
                    {g} ({g.startsWith('PP') ? 'Early Years' : g.includes('KCSE') ? 'National Examination' : g.includes('7') || g.includes('8') || g.includes('9') ? 'Junior Secondary' : 'Kenyan Curriculum'})
                  </option>
                ))}
              </select>

              {/* Subject Dropdown */}
              <div>
                <label className="text-[11px] font-medium text-slate-500 dark:text-slate-400">Learning Area / Subject</label>
                <select
                  value={selectedSubject}
                  onChange={(e) => setSelectedSubject(e.target.value)}
                  className="mt-1 w-full h-10 px-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-xs font-semibold text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 outline-none"
                >
                  {availableSubjects.map((s) => (
                    <option key={s.name} value={s.name}>
                      {s.name} ({s.category})
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Term, Breaks & Lessons Timing Options */}
          <div className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900 shadow-sm space-y-3">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
              4. Term Dates, Lessons per Week & Breaks
            </label>

            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="text-[11px] font-medium text-slate-500 dark:text-slate-400">Term</label>
                <select
                  value={term}
                  onChange={(e) => setTerm(Number(e.target.value))}
                  className="mt-1 w-full h-9 px-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-xs font-semibold text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 outline-none"
                >
                  <option value={1}>Term 1</option>
                  <option value={2}>Term 2</option>
                  <option value={3}>Term 3</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] font-medium text-slate-500 dark:text-slate-400">Year</label>
                <input
                  type="number"
                  value={year}
                  onChange={(e) => setYear(Number(e.target.value))}
                  className="mt-1 w-full h-9 px-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-xs font-semibold text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 outline-none"
                />
              </div>

              <div>
                <label className="text-[11px] font-medium text-slate-500 dark:text-slate-400">Lessons / Wk</label>
                <input
                  type="number"
                  min={1}
                  max={10}
                  value={lessonsPerWeek}
                  onChange={(e) => setLessonsPerWeek(Number(e.target.value))}
                  className="mt-1 w-full h-9 px-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-xs font-semibold text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 outline-none"
                />
              </div>
            </div>

            <div className="space-y-2 pt-1">
              <div>
                <label className="text-[11px] font-medium text-slate-500 dark:text-slate-400">Term Started Date</label>
                <input
                  type="text"
                  value={termStartDate}
                  onChange={(e) => setTermStartDate(e.target.value)}
                  placeholder="e.g. 05/01/2026 or 5th Jan 2026"
                  className="mt-0.5 w-full h-9 px-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 outline-none"
                />
              </div>

              <div>
                <label className="text-[11px] font-medium text-slate-500 dark:text-slate-400">Half Term Break Dates</label>
                <input
                  type="text"
                  value={halfTermDate}
                  onChange={(e) => setHalfTermDate(e.target.value)}
                  placeholder="e.g. 18th Feb - 22nd Feb 2026"
                  className="mt-0.5 w-full h-9 px-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 outline-none"
                />
              </div>

              <div>
                <label className="text-[11px] font-medium text-slate-500 dark:text-slate-400">End Term Closing Date</label>
                <input
                  type="text"
                  value={closingDate}
                  onChange={(e) => setClosingDate(e.target.value)}
                  placeholder="e.g. 03/04/2026 or 3rd April 2026"
                  className="mt-0.5 w-full h-9 px-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 outline-none"
                />
              </div>
            </div>
          </div>

          {/* Cover Page Administrative Sign-off Options */}
          <div className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900 shadow-sm space-y-3">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
              5. Cover Page Administrative Sign-Offs
            </label>

            <div className="space-y-2 text-xs">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={includeHodSign}
                  onChange={(e) => setIncludeHodSign(e.target.checked)}
                  className="h-4 w-4 rounded text-emerald-600 focus:ring-emerald-500"
                />
                <span className="text-slate-700 dark:text-slate-300 font-medium">Head of Department (HoD) Sign & Date Line</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={includeDeputySign}
                  onChange={(e) => setIncludeDeputySign(e.target.checked)}
                  className="h-4 w-4 rounded text-emerald-600 focus:ring-emerald-500"
                />
                <span className="text-slate-700 dark:text-slate-300 font-medium">Deputy Principal (Academics) Sign & Date Line</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={includePrincipalSign}
                  onChange={(e) => setIncludePrincipalSign(e.target.checked)}
                  className="h-4 w-4 rounded text-emerald-600 focus:ring-emerald-500"
                />
                <span className="text-slate-700 dark:text-slate-300 font-medium">Principal / Head Teacher Signature & Rubber Stamp Box</span>
              </label>
            </div>
          </div>

          {/* Regenerate Button */}
          <button
            type="button"
            onClick={generateCurriculumRows}
            disabled={isGenerating}
            className="w-full h-11 rounded-2xl bg-emerald-50 hover:bg-emerald-100 text-emerald-900 dark:bg-emerald-950/70 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800 font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-all"
          >
            <Sparkles className="h-4 w-4 text-emerald-600" />
            <span>{isGenerating ? 'Updating Scheme Matrix...' : 'Regenerate Scheme Matrix'}</span>
          </button>

        </div>

        {/* Right Column: Live Interactive Document Preview (7 Cols) */}
        <div className="lg:col-span-7 space-y-4">
          
          {/* Preview Navigation Bar */}
          <div className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-3 dark:border-slate-800 dark:bg-slate-900 shadow-sm">
            <div className="flex items-center gap-2">
              <Eye className="h-4 w-4 text-emerald-600" />
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                Document Preview
              </span>
              <span className="text-[11px] text-slate-400">· Continuous Paging Enabled</span>
            </div>

            <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
              <button
                type="button"
                onClick={() => setPreviewTab('cover')}
                className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all ${
                  previewTab === 'cover'
                    ? 'bg-white text-slate-900 shadow-sm dark:bg-slate-700 dark:text-white'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                Cover Page
              </button>
              <button
                type="button"
                onClick={() => setPreviewTab('table')}
                className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all ${
                  previewTab === 'table'
                    ? 'bg-white text-slate-900 shadow-sm dark:bg-slate-700 dark:text-white'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                Content Matrix ({rows.length} Lessons)
              </button>
            </div>
          </div>

          {/* Document Paper Container */}
          <div className="rounded-2xl border border-slate-300/80 bg-white dark:bg-slate-900 dark:border-slate-800 shadow-lg p-6 min-h-[580px] overflow-hidden">
            
            {/* VIEW A: COVER PAGE PREVIEW */}
            {previewTab === 'cover' ? (
              <div className="border border-emerald-800/40 p-6 rounded-xl space-y-6 text-center bg-emerald-50/20 dark:bg-slate-950/40">
                <div>
                  <h4 className="text-xs font-extrabold tracking-widest text-slate-600 dark:text-slate-400 uppercase">
                    Republic of Kenya
                  </h4>
                  <p className="text-[11px] text-slate-500 uppercase tracking-tight">
                    Ministry of Education · State Department for Basic Education
                  </p>
                  <p className="text-[10px] text-emerald-700 dark:text-emerald-400 font-semibold italic mt-0.5">
                    Kenya Institute of Curriculum Development (KICD) Approved Design
                  </p>
                </div>

                <div className="py-2">
                  <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight">
                    {schoolName.toUpperCase()}
                  </h2>
                  <div className="mt-2 inline-block rounded-lg bg-emerald-800 px-4 py-1 text-white text-xs font-bold uppercase tracking-wider">
                    {documentType === 'lesson_plan' ? 'CBC LESSON PLAN' : 'CBC / CBE SCHEMES OF WORK'}
                  </div>
                  <p className="mt-2 text-sm font-bold text-slate-800 dark:text-slate-200">
                    SUBJECT: {selectedSubject.toUpperCase()} | LEVEL: {selectedGrade.toUpperCase()}
                  </p>
                </div>

                {/* Cover Details Box */}
                <div className="max-w-md mx-auto rounded-xl border border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 p-4 text-left text-xs space-y-2">
                  <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                    <span className="font-semibold text-slate-500">Teacher's Name:</span>
                    <span className="font-bold text-slate-800 dark:text-slate-200">{teacherName}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                    <span className="font-semibold text-slate-500">TSC Number:</span>
                    <span className="font-mono font-bold text-slate-800 dark:text-slate-200">{tscNumber}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                    <span className="font-semibold text-slate-500">Academic Term:</span>
                    <span className="font-bold text-slate-800 dark:text-slate-200">Term {term}, {year}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                    <span className="font-semibold text-slate-500">Lessons / Week:</span>
                    <span className="font-bold text-slate-800 dark:text-slate-200">{lessonsPerWeek} Lessons</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                    <span className="font-semibold text-slate-500">Term Start Date:</span>
                    <span className="font-medium text-slate-800 dark:text-slate-200">{termStartDate}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                    <span className="font-semibold text-slate-500">Half Term Break:</span>
                    <span className="font-medium text-slate-800 dark:text-slate-200">{halfTermDate}</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="font-semibold text-slate-500">End Term Closing:</span>
                    <span className="font-medium text-slate-800 dark:text-slate-200">{closingDate}</span>
                  </div>
                </div>

                {/* Sign-Off Block */}
                <div className="pt-4 border-t border-slate-200 dark:border-slate-800 space-y-3 text-left">
                  <h5 className="text-[11px] font-bold text-slate-500 uppercase tracking-wider text-center">
                    Administrative Endorsements
                  </h5>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-[11px]">
                    {includeHodSign && (
                      <div className="p-2.5 rounded-lg border border-dashed border-slate-300 dark:border-slate-700 bg-white/50 dark:bg-slate-900/50">
                        <p className="font-bold text-slate-800 dark:text-slate-200">HoD Signature</p>
                        <p className="mt-4 text-slate-400">Sign: ______________</p>
                        <p className="mt-1 text-slate-400">Date: ______________</p>
                      </div>
                    )}
                    {includeDeputySign && (
                      <div className="p-2.5 rounded-lg border border-dashed border-slate-300 dark:border-slate-700 bg-white/50 dark:bg-slate-900/50">
                        <p className="font-bold text-slate-800 dark:text-slate-200">Deputy Principal</p>
                        <p className="mt-4 text-slate-400">Sign: ______________</p>
                        <p className="mt-1 text-slate-400">Date: ______________</p>
                      </div>
                    )}
                    {includePrincipalSign && (
                      <div className="p-2.5 rounded-lg border border-dashed border-slate-300 dark:border-slate-700 bg-white/50 dark:bg-slate-900/50">
                        <p className="font-bold text-slate-800 dark:text-slate-200">Principal Stamp</p>
                        <p className="mt-2 text-slate-400">Sign: ______________</p>
                        <div className="mt-1.5 h-10 border border-slate-300 dark:border-slate-700 rounded flex items-center justify-center text-[9px] text-slate-400">
                          Rubber Stamp
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="text-[10px] text-slate-400 pt-3">
                  Document Generated by CBC HUB · Page 1 of Cover Page
                </div>
              </div>
            ) : (
              /* VIEW B: TABLE CONTENT PREVIEW */
              <div className="space-y-4">
                <div className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-300 pb-2 border-b border-slate-200 dark:border-slate-800">
                  <span className="font-bold">{schoolName} — {selectedSubject} ({selectedGrade})</span>
                  <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold">{rows.length ? `${Math.max(...rows.map(row=>row.week))} weeks in draft` : 'Generate to preview'}</span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-[#008751] text-white text-[11px]">
                        <th className="p-2 border border-emerald-800 font-bold text-center">Wk</th>
                        <th className="p-2 border border-emerald-800 font-bold text-center">Lsn</th>
                        <th className="p-2 border border-emerald-800 font-bold min-w-[120px]">Strand / Theme</th>
                        <th className="p-2 border border-emerald-800 font-bold min-w-[120px]">Sub-Strand</th>
                        <th className="p-2 border border-emerald-800 font-bold min-w-[200px]">Specific Outcomes</th>
                        <th className="p-2 border border-emerald-800 font-bold min-w-[140px]">Inquiry Questions</th>
                        <th className="p-2 border border-emerald-800 font-bold min-w-[120px]">Resources</th>
                        <th className="p-2 border border-emerald-800 font-bold min-w-[100px]">Assessment</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 dark:divide-slate-800 text-[11px]">
                      {rows.map((row) => (
                        <tr 
                          key={row.id}
                          className={row.strand.includes('BREAK') || row.strand.includes('EVALUATION') 
                            ? 'bg-amber-50 dark:bg-amber-950/40 font-semibold' 
                            : 'hover:bg-slate-50 dark:hover:bg-slate-800/40'}
                        >
                          <td className="p-2 border border-slate-200 dark:border-slate-800 text-center font-bold text-slate-700 dark:text-slate-300">
                            {row.week}
                          </td>
                          <td className="p-2 border border-slate-200 dark:border-slate-800 text-center text-slate-600 dark:text-slate-400">
                            {row.lesson || ''}
                          </td>
                          <td className="p-2 border border-slate-200 dark:border-slate-800 font-bold text-slate-900 dark:text-white">
                            {row.strand}
                          </td>
                          <td className="p-2 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300">
                            {row.subStrand}
                          </td>
                          <td className="p-2 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300">
                            {row.specificOutcomes}
                          </td>
                          <td className="p-2 border border-slate-200 dark:border-slate-800 italic text-slate-500 dark:text-slate-400">
                            {row.inquiryQuestions}
                          </td>
                          <td className="p-2 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400">
                            {row.resources}
                          </td>
                          <td className="p-2 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400">
                            {row.assessment}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="flex items-center justify-between pt-3 text-[10px] text-slate-400 border-t border-slate-200 dark:border-slate-800">
                  <span>CBC HUB KICD Matrix Standard</span>
                  <span>Page 2+ Continues with Paging</span>
                </div>
              </div>
            )}

          </div>

          {/* Download Callout Box */}
          <div className="rounded-2xl border border-emerald-200 dark:border-emerald-900 bg-emerald-50/60 dark:bg-emerald-950/30 p-4 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="space-y-0.5 text-center sm:text-left">
              <p className="text-xs font-bold text-emerald-950 dark:text-emerald-200">
                Ready to Export this Document?
              </p>
              <p className="text-[11px] text-emerald-800 dark:text-emerald-400">
                M-Pesa Ksh. 15 Send Money to <strong>0707423879</strong>. Each download costs Ksh. 15.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => handleDownloadClick('docx')}
                className="h-10 px-4 rounded-xl bg-slate-900 text-white font-bold text-xs hover:bg-slate-800 shadow-md active:scale-95 transition-all"
              >
                Word (.docx)
              </button>
              <button
                type="button"
                onClick={() => handleDownloadClick('pdf')}
                className="h-10 px-4 rounded-xl bg-[#008751] text-white font-bold text-xs hover:bg-[#007043] shadow-md shadow-emerald-900/20 active:scale-95 transition-all"
              >
                PDF (.pdf)
              </button>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
