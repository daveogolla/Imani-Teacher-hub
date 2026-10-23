import React, { useState } from 'react';
import { 
  User, 
  Lock, 
  Mail, 
  Building2, 
  ShieldCheck, 
  MapPin, 
  Phone, 
  Check, 
  Receipt, 
  X,
  Sparkles
} from 'lucide-react';
import { UserProfile, MpesaReceipt } from '../types';
import { storageService } from '../services/storageService';

interface TeacherProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  userProfile: UserProfile;
  payments: MpesaReceipt[];
  onProfileUpdated: (profile: UserProfile) => void;
}

export const TeacherProfileModal: React.FC<TeacherProfileModalProps> = ({
  isOpen,
  onClose,
  userProfile,
  payments,
  onProfileUpdated,
}) => {
  const [activeTab, setActiveTab] = useState<'profile' | 'receipts'>('profile');

  // Form Fields
  const [email, setEmail] = useState(userProfile.email || 'teacher@education.go.ke');
  const [password, setPassword] = useState('••••••••••••');
  const [teacherName, setTeacherName] = useState(userProfile.teacherName || 'Mwalimu Otieno');
  const [tscNumber, setTscNumber] = useState(userProfile.tscNumber || 'TSC-784291');
  const [schoolName, setSchoolName] = useState(userProfile.schoolName || 'Moi Forces Academy');
  const [role, setRole] = useState(userProfile.role || 'Teacher');
  const [county, setCounty] = useState(userProfile.county || 'Nairobi');
  const [subCounty, setSubCounty] = useState(userProfile.subCounty || 'Kasarani');
  const [phoneNumber, setPhoneNumber] = useState(userProfile.phoneNumber || '0707423879');

  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();

    const updated: UserProfile = {
      ...userProfile,
      email,
      teacherName: teacherName.trim(),
      tscNumber: tscNumber.trim(),
      schoolName: schoolName.trim(),
      role: role as any,
      county,
      subCounty,
      phoneNumber
    };

    storageService.saveUserProfile(updated);
    onProfileUpdated(updated);
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg overflow-hidden rounded-3xl bg-white shadow-2xl dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
        
        {/* Header */}
        <div className="bg-slate-900 p-5 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-600 text-white font-bold text-sm">
              {teacherName ? teacherName.charAt(0).toUpperCase() : 'M'}
            </div>
            <div>
              <h3 className="text-base font-bold tracking-tight">Teacher Account & School Setup</h3>
              <p className="text-xs text-slate-400">Credentials auto-populate on generated Cover Pages</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-white/10 text-slate-400 hover:text-white"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Tab Selector */}
        <div className="flex border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/40 px-6 pt-3">
          <button
            type="button"
            onClick={() => setActiveTab('profile')}
            className={`pb-3 px-2 text-xs font-bold transition-all border-b-2 ${
              activeTab === 'profile'
                ? 'border-emerald-600 text-emerald-600 dark:text-emerald-400'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Teacher & School Profile
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('receipts')}
            className={`pb-3 px-2 text-xs font-bold transition-all border-b-2 flex items-center gap-1.5 ${
              activeTab === 'receipts'
                ? 'border-emerald-600 text-emerald-600 dark:text-emerald-400'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <span>M-Pesa Receipts</span>
            <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-full bg-slate-200 dark:bg-slate-800">
              {payments.length}
            </span>
          </button>
        </div>

        {/* Body Content */}
        <div className="p-6 max-h-[75vh] overflow-y-auto">
          {activeTab === 'profile' ? (
            <form onSubmit={handleSave} className="space-y-4 text-xs">
              
              {/* Account Credentials */}
              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 space-y-2.5">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block">
                  Account Registration & Login
                </span>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <div>
                    <label className="font-semibold text-slate-700 dark:text-slate-300">Email Address</label>
                    <div className="relative mt-1">
                      <Mail className="absolute left-3 top-3 h-3.5 w-3.5 text-slate-400" />
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full h-9 pl-9 pr-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="font-semibold text-slate-700 dark:text-slate-300">Password</label>
                    <div className="relative mt-1">
                      <Lock className="absolute left-3 top-3 h-3.5 w-3.5 text-slate-400" />
                      <input
                        type="password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full h-9 pl-9 pr-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Institution Details */}
              <div className="space-y-3">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block">
                  School & Cover Page Information
                </span>

                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300">School Name</label>
                  <div className="relative mt-1">
                    <Building2 className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                    <input
                      type="text"
                      required
                      value={schoolName}
                      onChange={(e) => setSchoolName(e.target.value)}
                      placeholder="e.g. Moi Forces Academy"
                      className="w-full h-10 pl-9 pr-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="font-semibold text-slate-700 dark:text-slate-300">Teacher's Full Name</label>
                    <input
                      type="text"
                      required
                      value={teacherName}
                      onChange={(e) => setTeacherName(e.target.value)}
                      placeholder="e.g. Mwalimu Otieno"
                      className="mt-1 w-full h-10 px-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="font-semibold text-slate-700 dark:text-slate-300">TSC Number</label>
                    <input
                      type="text"
                      required
                      value={tscNumber}
                      onChange={(e) => setTscNumber(e.target.value)}
                      placeholder="e.g. TSC-784291"
                      className="mt-1 w-full h-10 px-3 rounded-xl font-mono border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="font-semibold text-slate-700 dark:text-slate-300">Administrative Role</label>
                    <select
                      value={role}
                      onChange={(e) => setRole(e.target.value as any)}
                      className="mt-1 w-full h-10 px-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-emerald-500"
                    >
                      <option value="Teacher">Subject Teacher</option>
                      <option value="Head of Department">Head of Department (HoD)</option>
                      <option value="Deputy Principal">Deputy Principal (Academics)</option>
                      <option value="Principal">Principal / Head Teacher</option>
                    </select>
                  </div>

                  <div>
                    <label className="font-semibold text-slate-700 dark:text-slate-300">M-PESA Phone Number</label>
                    <input
                      type="text"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      placeholder="0707423879"
                      className="mt-1 w-full h-10 px-3 rounded-xl font-mono border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="font-semibold text-slate-700 dark:text-slate-300">County</label>
                    <input
                      type="text"
                      value={county}
                      onChange={(e) => setCounty(e.target.value)}
                      placeholder="e.g. Nairobi"
                      className="mt-1 w-full h-9 px-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="font-semibold text-slate-700 dark:text-slate-300">Sub-County</label>
                    <input
                      type="text"
                      value={subCounty}
                      onChange={(e) => setSubCounty(e.target.value)}
                      placeholder="e.g. Kasarani"
                      className="mt-1 w-full h-9 px-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                </div>
              </div>

              {/* Action */}
              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full h-11 rounded-2xl bg-[#008751] hover:bg-[#007043] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-900/20 active:scale-95 transition-all"
                >
                  {savedSuccess ? (
                    <>
                      <Check className="h-4 w-4" />
                      <span>Profile & School Information Saved!</span>
                    </>
                  ) : (
                    <span>Save Teacher Credentials & School Info</span>
                  )}
                </button>
              </div>

            </form>
          ) : (
            /* Tab 2: Receipts */
            <div className="space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Verified M-Pesa Downloads (Ksh. 20 / Item)
                </span>
                <span className="text-[11px] text-slate-500">Pay to 0707423879</span>
              </div>

              {payments.length === 0 ? (
                <div className="py-12 text-center text-slate-400 text-xs space-y-2">
                  <Receipt className="h-8 w-8 mx-auto opacity-50" />
                  <p>No M-PESA receipts recorded yet.</p>
                  <p className="text-[11px] text-slate-500">
                    Each downloaded document logs an official transaction code here for unlimited re-download.
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  {payments.map((p) => (
                    <div
                      key={p.id}
                      className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 text-xs flex items-center justify-between"
                    >
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-900 dark:text-white">
                            {p.itemTitle}
                          </span>
                          <span className="text-[10px] font-bold text-emerald-600 bg-emerald-100 dark:bg-emerald-950 dark:text-emerald-300 px-1.5 py-0.2 rounded">
                            Verified
                          </span>
                        </div>
                        <p className="text-[11px] font-mono text-slate-500">
                          M-PESA Code: <strong>{p.mpesaCode}</strong> · Sent to {p.payNumber}
                        </p>
                      </div>

                      <div className="text-right">
                        <span className="font-extrabold text-sm text-slate-900 dark:text-white">
                          Ksh. {p.amount}
                        </span>
                        <p className="text-[10px] text-slate-400">
                          {p.timestamp.split('T')[0]}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
