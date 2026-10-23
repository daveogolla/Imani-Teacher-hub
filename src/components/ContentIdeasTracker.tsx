import React, { useState } from 'react';
import { 
  Lightbulb, 
  Plus, 
  Calendar, 
  Clock, 
  CheckCircle2, 
  Sliders, 
  Trash2, 
  Tag, 
  Sparkles,
  ArrowRight,
  TrendingUp,
  X
} from 'lucide-react';
import { ContentIdea, GradeLevel } from '../types';
import { GRADES_LIST, CURRICULUM_DATABASE } from '../data/kenyanCurriculum';
import { storageService } from '../services/storageService';

interface ContentIdeasTrackerProps {
  ideas: ContentIdea[];
  onIdeasChange: (ideas: ContentIdea[]) => void;
  onSendToGenerator: (grade: GradeLevel, subject: string) => void;
}

export const ContentIdeasTracker: React.FC<ContentIdeasTrackerProps> = ({
  ideas,
  onIdeasChange,
  onSendToGenerator,
}) => {
  const [filterStatus, setFilterStatus] = useState<string>('All');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // New Idea Form State
  const [title, setTitle] = useState('');
  const [grade, setGrade] = useState<GradeLevel>('Grade 8');
  const [subject, setSubject] = useState('Pre-Technical Studies');
  const [notes, setNotes] = useState('');
  const [scheduledDate, setScheduledDate] = useState('');
  const [status, setStatus] = useState<'Idea' | 'Drafting' | 'Scheduled' | 'Completed'>('Idea');
  const [progress, setProgress] = useState(25);

  const handleSaveIdea = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const newIdea: ContentIdea = {
      id: `idea-${Date.now()}`,
      title: title.trim(),
      grade,
      subject,
      notes: notes.trim(),
      scheduledDate: scheduledDate || undefined,
      status,
      progress: status === 'Completed' ? 100 : progress,
      createdAt: new Date().toISOString().split('T')[0]
    };

    storageService.saveContentIdea(newIdea);
    onIdeasChange(storageService.getContentIdeas());

    // Reset Form
    setTitle('');
    setNotes('');
    setScheduledDate('');
    setStatus('Idea');
    setProgress(25);
    setIsModalOpen(false);
  };

  const handleUpdateStatus = (idea: ContentIdea, newStatus: 'Idea' | 'Drafting' | 'Scheduled' | 'Completed') => {
    const updated: ContentIdea = {
      ...idea,
      status: newStatus,
      progress: newStatus === 'Completed' ? 100 : newStatus === 'Scheduled' ? 75 : newStatus === 'Drafting' ? 50 : 25
    };
    storageService.saveContentIdea(updated);
    onIdeasChange(storageService.getContentIdeas());
  };

  const handleUpdateProgress = (idea: ContentIdea, newProgress: number) => {
    const updated: ContentIdea = {
      ...idea,
      progress: newProgress,
      status: newProgress === 100 ? 'Completed' : idea.status
    };
    storageService.saveContentIdea(updated);
    onIdeasChange(storageService.getContentIdeas());
  };

  const handleDeleteIdea = (id: string) => {
    storageService.deleteContentIdea(id);
    onIdeasChange(storageService.getContentIdeas());
  };

  const filteredIdeas = ideas.filter(idea => {
    if (filterStatus === 'All') return true;
    return idea.status === filterStatus;
  });

  const completedCount = ideas.filter(i => i.status === 'Completed').length;
  const overallCompletionRate = ideas.length > 0 ? Math.round((completedCount / ideas.length) * 100) : 0;

  return (
    <div className="space-y-6 pb-24">
      
      {/* Header & Add Trigger */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            <Lightbulb className="h-6 w-6 text-amber-500" />
            <span>Content Ideas & Post Schedule</span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Plan lessons, schedule classroom presentations or social teaching posts, and track preparation progress.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 h-10 px-4 rounded-xl bg-[#008751] text-white font-bold text-xs hover:bg-[#007043] shadow-sm shadow-emerald-900/20 active:scale-95 transition-all self-start sm:self-auto"
        >
          <Plus className="h-4 w-4" />
          <span>New Content Idea</span>
        </button>
      </div>

      {/* Progress & Summary Bar */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900 shadow-sm space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-emerald-600" />
              <span>Teaching Post Execution Progress</span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {completedCount} of {ideas.length} ideas developed and taught ({overallCompletionRate}% completed)
            </p>
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto">
            {['All', 'Idea', 'Drafting', 'Scheduled', 'Completed'].map(st => (
              <button
                key={st}
                onClick={() => setFilterStatus(st)}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                  filterStatus === st
                    ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-sm'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-400'
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>

        {/* Progress Track */}
        <div className="w-full bg-slate-100 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden">
          <div
            className="bg-[#008751] h-full rounded-full transition-all duration-500"
            style={{ width: `${overallCompletionRate}%` }}
          />
        </div>
      </div>

      {/* Ideas Grid */}
      <div className="space-y-3">
        {filteredIdeas.length === 0 ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center text-slate-500 dark:border-slate-800 dark:bg-slate-900 space-y-3">
            <Lightbulb className="h-10 w-10 mx-auto text-amber-400 opacity-60" />
            <p className="text-sm font-medium">No ideas under "{filterStatus}".</p>
            <button
              onClick={() => setIsModalOpen(true)}
              className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline"
            >
              Add your first teaching idea or post →
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredIdeas.map((idea) => (
              <div
                key={idea.id}
                className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900 shadow-sm hover:shadow-md transition-shadow space-y-3 flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                        {idea.grade} · {idea.subject}
                      </span>
                      <h3 className="text-sm font-bold text-slate-900 dark:text-white line-clamp-1">
                        {idea.title}
                      </h3>
                    </div>

                    {/* Status Badge */}
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      idea.status === 'Completed'
                        ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                        : idea.status === 'Scheduled'
                        ? 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300'
                        : idea.status === 'Drafting'
                        ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                        : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                    }`}>
                      {idea.status}
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-3 leading-relaxed">
                    {idea.notes}
                  </p>

                  {idea.scheduledDate && (
                    <div className="flex items-center gap-1.5 text-[11px] text-slate-500 dark:text-slate-400 pt-1">
                      <Calendar className="h-3.5 w-3.5 text-blue-500" />
                      <span>Scheduled for: <strong>{idea.scheduledDate}</strong></span>
                    </div>
                  )}
                </div>

                {/* Progress Slider & Quick Actions */}
                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-2">
                  <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
                    <span>Progress: {idea.progress}%</span>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleUpdateStatus(idea, 'Idea')}
                        className={`px-1.5 py-0.5 rounded text-[10px] ${idea.status === 'Idea' ? 'bg-slate-200 dark:bg-slate-700 font-bold' : 'hover:bg-slate-100'}`}
                      >
                        Idea
                      </button>
                      <button
                        onClick={() => handleUpdateStatus(idea, 'Drafting')}
                        className={`px-1.5 py-0.5 rounded text-[10px] ${idea.status === 'Drafting' ? 'bg-amber-200 dark:bg-amber-900 font-bold' : 'hover:bg-slate-100'}`}
                      >
                        Draft
                      </button>
                      <button
                        onClick={() => handleUpdateStatus(idea, 'Scheduled')}
                        className={`px-1.5 py-0.5 rounded text-[10px] ${idea.status === 'Scheduled' ? 'bg-blue-200 dark:bg-blue-900 font-bold' : 'hover:bg-slate-100'}`}
                      >
                        Plan
                      </button>
                      <button
                        onClick={() => handleUpdateStatus(idea, 'Completed')}
                        className={`px-1.5 py-0.5 rounded text-[10px] ${idea.status === 'Completed' ? 'bg-emerald-200 dark:bg-emerald-900 font-bold' : 'hover:bg-slate-100'}`}
                      >
                        Done
                      </button>
                    </div>
                  </div>

                  {/* Interactive Progress Bar */}
                  <input
                    type="range"
                    min={0}
                    max={100}
                    value={idea.progress}
                    onChange={(e) => handleUpdateProgress(idea, Number(e.target.value))}
                    className="w-full accent-emerald-600 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg cursor-pointer"
                  />

                  <div className="flex items-center justify-between pt-1">
                    <button
                      onClick={() => onSendToGenerator(idea.grade, idea.subject)}
                      className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1"
                    >
                      <Sparkles className="h-3 w-3" />
                      <span>Generate Scheme for this</span>
                    </button>
                    <button
                      onClick={() => handleDeleteIdea(idea.id)}
                      className="text-slate-400 hover:text-rose-600 transition-colors p-1"
                      title="Delete idea"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>

              </div>
            ))}
          </div>
        )}
      </div>

      {/* New Idea Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-lg rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Lightbulb className="h-5 w-5 text-amber-500" />
                <h3 className="text-base font-bold text-slate-900 dark:text-white">Save Content Idea / Post</h3>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="h-8 w-8 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-center text-slate-500"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleSaveIdea} className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300">Idea / Topic Title</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Grade 8 Woodwork Joint Demonstration"
                  className="mt-1 w-full h-10 px-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300">Grade / Class</label>
                  <select
                    value={grade}
                    onChange={(e) => setGrade(e.target.value as GradeLevel)}
                    className="mt-1 w-full h-10 px-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    {GRADES_LIST.map((g) => (
                      <option key={g} value={g}>{g}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300">Subject / Area</label>
                  <input
                    type="text"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="e.g. Science, Pre-Tech"
                    className="mt-1 w-full h-10 px-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300">Teaching Notes & Learning Activities</label>
                <textarea
                  rows={3}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Describe the practical inquiry, materials needed, experiments, or teaching steps..."
                  className="mt-1 w-full p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300">Schedule Date</label>
                  <input
                    type="date"
                    value={scheduledDate}
                    onChange={(e) => setScheduledDate(e.target.value)}
                    className="mt-1 w-full h-10 px-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300">Status</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as any)}
                    className="mt-1 w-full h-10 px-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="Idea">Idea (25%)</option>
                    <option value="Drafting">Drafting (50%)</option>
                    <option value="Scheduled">Scheduled (75%)</option>
                    <option value="Completed">Completed (100%)</option>
                  </select>
                </div>
              </div>

              <div className="pt-3 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="h-10 px-4 rounded-xl text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="h-10 px-5 rounded-xl bg-[#008751] text-white font-bold hover:bg-[#007043] shadow-md shadow-emerald-900/20"
                >
                  Save Idea
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
