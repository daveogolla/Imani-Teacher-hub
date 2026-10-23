import React, { useState, useEffect } from 'react';
import { 
  GradeLevel, 
  SchemeDocument, 
  ContentIdea, 
  CalendarEvent, 
  UserProfile, 
  MpesaReceipt 
} from './types';
import { storageService } from './services/storageService';
import { Header } from './components/Header';
import { Navigation, NavTab } from './components/Navigation';
import { Dashboard } from './components/Dashboard';
import { SearchHub } from './components/SearchHub';
import { SchemeGenerator } from './components/SchemeGenerator';
import { SyllabusExplorer } from './components/SyllabusExplorer';
import { ContentIdeasTracker } from './components/ContentIdeasTracker';
import { AcademicCalendar } from './components/AcademicCalendar';
import { MpesaPaymentModal } from './components/MpesaPaymentModal';
import { TeacherProfileModal } from './components/TeacherProfileModal';
import { SearchModal } from './components/SearchModal';
import { Wifi, Signal, Battery, Smartphone } from 'lucide-react';

export default function App() {
  // Theme & Layout Frame State
  const [themeMode, setThemeMode] = useState<'dark' | 'light'>(() => storageService.getThemeMode());
  const [isFrameView, setIsFrameView] = useState<boolean>(() => storageService.getFrameView());

  // Navigation State
  const [activeTab, setActiveTab] = useState<NavTab>('dashboard');

  // Generator pre-selection state
  const [generatorGrade, setGeneratorGrade] = useState<GradeLevel>('Grade 8');
  const [generatorSubject, setGeneratorSubject] = useState<string | undefined>(undefined);
  const [generatorStrand, setGeneratorStrand] = useState<string | undefined>(undefined);
  const [generatorDocType, setGeneratorDocType] = useState<'scheme' | 'lesson_plan' | 'revision'>('scheme');

  // App Data State (Local Storage)
  const [userProfile, setUserProfile] = useState<UserProfile>(() => storageService.getUserProfile());
  const [savedSchemes, setSavedSchemes] = useState<SchemeDocument[]>(() => storageService.getSavedSchemes());
  const [contentIdeas, setContentIdeas] = useState<ContentIdea[]>(() => storageService.getContentIdeas());
  const [calendarEvents, setCalendarEvents] = useState<CalendarEvent[]>(() => storageService.getCalendarEvents());
  const [payments, setPayments] = useState<MpesaReceipt[]>(() => storageService.getPayments());

  // Modals State
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);

  // M-Pesa Download State
  const [mpesaModalOpen, setMpesaModalOpen] = useState(false);
  const [pendingDownload, setPendingDownload] = useState<{
    scheme?: SchemeDocument;
    customTitle?: string;
    itemType: 'scheme' | 'lesson_plan' | 'revision';
    format: 'docx' | 'pdf';
  } | null>(null);

  // Sync theme with HTML document
  useEffect(() => {
    if (themeMode === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    storageService.setThemeMode(themeMode);
  }, [themeMode]);

  const toggleTheme = () => {
    setThemeMode(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  const toggleFrameView = () => {
    setIsFrameView(prev => {
      const next = !prev;
      storageService.setFrameView(next);
      return next;
    });
  };

  // Download trigger: checks if unlocked, otherwise opens M-Pesa dialog
  const handleInitiateDownload = (
    docOrTitle: SchemeDocument | string,
    format: 'docx' | 'pdf',
    itemType: 'scheme' | 'lesson_plan' | 'revision' = 'scheme'
  ) => {
    const isDoc = typeof docOrTitle !== 'string';
    const itemTitle = isDoc ? docOrTitle.title : docOrTitle;

    if(!isDoc) {
      setGeneratorSubject(itemTitle);setGeneratorDocType('revision');setActiveTab('generator');return;
    }

    // Set pending download and open M-PESA payment modal
    setPendingDownload({
      scheme: isDoc ? docOrTitle : undefined,
      customTitle: !isDoc ? docOrTitle : undefined,
      itemType,
      format
    });
    setMpesaModalOpen(true);
  };

  const handleMpesaVerified = () => {
    // Downloads stay blocked until a merchant-backed verification flow exists.
    setMpesaModalOpen(false);
  };

  const handleNavigateToGenerator = (
    grade?: GradeLevel, 
    subject?: string, 
    strand?: string, 
    docType: 'scheme' | 'lesson_plan' | 'revision' = 'scheme'
  ) => {
    if (grade) setGeneratorGrade(grade);
    if (subject) setGeneratorSubject(subject);
    if (strand) setGeneratorStrand(strand);
    setGeneratorDocType(docType);
    setActiveTab('generator');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavigateToSyllabus = (grade?: GradeLevel) => {
    if (grade) setGeneratorGrade(grade);
    setActiveTab('syllabus');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSaveIdea = (newIdea: ContentIdea) => {
    storageService.saveContentIdea(newIdea);
    setContentIdeas(storageService.getContentIdeas());
  };

  // Main application content
  const renderTabContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <Dashboard
            userProfile={userProfile}
            savedSchemes={savedSchemes}
            contentIdeas={contentIdeas}
            payments={payments}
            onNavigateToGenerator={(g, s) => handleNavigateToGenerator(g, s)}
            onNavigateToSyllabus={handleNavigateToSyllabus}
            onNavigateToSearch={() => setActiveTab('search')}
            onNavigateToIdeas={() => setActiveTab('ideas')}
            onNavigateToCalendar={() => setActiveTab('calendar')}
            onDownloadScheme={(scheme, format) => handleInitiateDownload(scheme, format, 'scheme')}
          />
        );
      case 'search':
        return (
          <SearchHub
            savedSchemes={savedSchemes}
            contentIdeas={contentIdeas}
            onSelectForGenerator={handleNavigateToGenerator}
            onInitiateDownload={handleInitiateDownload}
            onSaveIdea={handleSaveIdea}
          />
        );
      case 'generator':
        return (
          <SchemeGenerator
            userProfile={userProfile}
            initialGrade={generatorGrade}
            initialSubject={generatorSubject}
            initialStrand={generatorStrand}
            initialDocumentType={generatorDocType}
            onInitiateDownload={(scheme, format) => {
              setSavedSchemes(storageService.getSavedSchemes());
              handleInitiateDownload(scheme, format, scheme.documentType);
            }}
          />
        );
      case 'syllabus':
        return (
          <SyllabusExplorer
            initialGrade={generatorGrade}
            onSelectForGenerator={(g, s) => handleNavigateToGenerator(g, s)}
            onInitiateMaterialDownload={(title, format) => handleInitiateDownload(title, format, 'revision')}
          />
        );
      case 'ideas':
        return (
          <ContentIdeasTracker
            ideas={contentIdeas}
            onIdeasChange={(newIdeas) => setContentIdeas(newIdeas)}
            onSendToGenerator={(g, s) => handleNavigateToGenerator(g, s)}
          />
        );
      case 'calendar':
        return (
          <AcademicCalendar
            events={[...calendarEvents,...contentIdeas.filter(idea=>idea.scheduledDate && idea.status==='Scheduled').map(idea=>({id:`scheduled-${idea.id}`,title:idea.title,date:idea.scheduledDate!,category:'school_event' as const,description:`Scheduled content · ${idea.subject} · ${idea.progress}% complete`}))]}
            onEventsChange={(newEvents) => setCalendarEvents(newEvents)}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className={`min-h-screen bg-slate-100 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors ${
      isFrameView ? 'py-4 sm:py-8 flex justify-center items-center' : ''
    }`}>
      
      {/* Container wrapper: Either simulated Android Device Frame OR full responsive view */}
      <div className={
        isFrameView
          ? 'relative w-full max-w-[430px] h-[920px] max-h-[96vh] rounded-[48px] bg-white dark:bg-slate-900 shadow-2xl border-[10px] border-slate-900 dark:border-slate-800 flex flex-col overflow-hidden ring-1 ring-black/10'
          : 'w-full min-h-screen flex flex-col'
      }>

        {/* Android Simulated Status Bar (Only in Frame View) */}
        {isFrameView && (
          <div className="h-8 w-full bg-slate-900 text-white px-6 flex items-center justify-between text-[11px] font-semibold shrink-0 z-50 select-none">
            <span className="font-mono">09:00</span>
            {/* Camera cutout */}
            <div className="h-4 w-24 rounded-full bg-black/60 mx-auto" />
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] text-emerald-400">Safaricom 5G</span>
              <Signal className="h-3 w-3" />
              <Wifi className="h-3 w-3" />
              <Battery className="h-3.5 w-3.5" />
            </div>
          </div>
        )}

        {/* Top Header */}
        <Header
          currentTab={activeTab}
          themeMode={themeMode}
          onToggleTheme={toggleTheme}
          isFrameView={isFrameView}
          onToggleFrameView={toggleFrameView}
          onOpenSearch={() => setIsSearchModalOpen(true)}
          onOpenProfile={() => setIsProfileModalOpen(true)}
          userProfile={userProfile}
        />

        {/* Scrollable Viewport Content */}
        <main className="flex-1 overflow-y-auto px-4 sm:px-6 pt-5 pb-20 scrollbar-thin">
          <div className={isFrameView ? 'w-full' : 'max-w-7xl mx-auto'}>
            {renderTabContent()}
          </div>
        </main>

        {/* Fixed Android Bottom Navigation Bar */}
        <Navigation
          activeTab={activeTab}
          onTabChange={(tab) => {
            setSavedSchemes(storageService.getSavedSchemes());
            setActiveTab(tab);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
        />

      </div>

      {/* M-PESA Ksh. 15 Payment Modal */}
      <MpesaPaymentModal
        isOpen={mpesaModalOpen}
        onClose={() => setMpesaModalOpen(false)}
        itemTitle={pendingDownload?.scheme?.title || pendingDownload?.customTitle || 'Curriculum Document'}
        itemType={pendingDownload?.itemType || 'scheme'}
        fileFormat={pendingDownload?.format || 'pdf'}
        onVerified={handleMpesaVerified}
      />

      {/* Teacher Profile & Account Registration Modal */}
      <TeacherProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        userProfile={userProfile}
        payments={payments}
        onProfileUpdated={(updated) => setUserProfile(updated)}
      />

      {/* Unified Search Modal */}
      <SearchModal
        isOpen={isSearchModalOpen}
        onClose={() => setIsSearchModalOpen(false)}
        ideas={contentIdeas}
        schemes={savedSchemes}
        calendarEvents={calendarEvents}
        onSelectGradeSubject={(g, s, str, docT) => handleNavigateToGenerator(g, s, str, docT)}
        onNavigateToTab={(t) => setActiveTab(t)}
        onInitiateDownload={handleInitiateDownload}
      />

    </div>
  );
}
