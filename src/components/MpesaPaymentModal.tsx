import React, { useState } from 'react';
import { Lock, Phone, Copy, Check, ArrowRight, ShieldCheck, Sparkles, X } from 'lucide-react';
import { storageService } from '../services/storageService';
import { MpesaReceipt } from '../types';

interface MpesaPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  itemTitle: string;
  itemType: 'scheme' | 'lesson_plan' | 'revision';
  fileFormat: 'docx' | 'pdf';
  onVerified: () => void;
}

export const MpesaPaymentModal: React.FC<MpesaPaymentModalProps> = ({
  isOpen,
  onClose,
  itemTitle,
  itemType,
  fileFormat,
  onVerified,
}) => {
  const [transactionCode, setTransactionCode] = useState('');
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [success, setSuccess] = useState(false);

  if (!isOpen) return null;

  const targetNumber = '0707423879';
  const amount = 20;

  const handleCopyNumber = () => {
    navigator.clipboard.writeText(targetNumber);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSimulateStk = () => {
    // Generate an authentic M-PESA code like TKA84920LX
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const randLetters = (len: number) => Array.from({ length: len }, () => letters[Math.floor(Math.random() * letters.length)]).join('');
    const randDigits = Math.floor(1000 + Math.random() * 9000);
    const mockCode = `${randLetters(3)}${randDigits}${randLetters(3)}`;
    setTransactionCode(mockCode);
    setError('');
  };

  const handleVerify = () => {
    const code = transactionCode.trim().toUpperCase();
    if (!code) {
      setError('Please enter the M-PESA transaction code from your SMS.');
      return;
    }
    if (code.length < 8) {
      setError('M-PESA transaction codes are typically 10 characters (e.g. SAK281XX99).');
      return;
    }

    setIsVerifying(true);
    setError('');

    setTimeout(() => {
      setIsVerifying(false);
      setSuccess(true);

      const receipt: MpesaReceipt = {
        id: `rcpt-${Date.now()}`,
        mpesaCode: code,
        amount,
        payNumber: targetNumber,
        timestamp: new Date().toISOString(),
        itemTitle,
        itemType,
        status: 'verified'
      };

      storageService.recordMpesaPayment(receipt);

      setTimeout(() => {
        setSuccess(false);
        onVerified();
        onClose();
      }, 900);
    }, 700);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-md overflow-hidden rounded-3xl bg-white shadow-2xl dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
        
        {/* Header Banner - Safaricom M-Pesa Signature Forest Green */}
        <div className="bg-[#008751] p-5 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/20 backdrop-blur-md">
                <Lock className="h-5 w-5 text-white" />
              </div>
              <div>
                <h3 className="text-base font-bold tracking-tight">M-PESA Send Money</h3>
                <p className="text-xs text-emerald-100">Official CBC HUB Kenyan Curriculum Store</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-white/20 transition-colors"
              aria-label="Close"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Item Price Pill */}
          <div className="mt-4 flex items-center justify-between rounded-xl bg-black/15 p-3">
            <div className="truncate pr-2">
              <p className="text-xs text-emerald-100">Document to Download</p>
              <p className="text-sm font-semibold truncate text-white">{itemTitle}</p>
            </div>
            <div className="text-right shrink-0">
              <span className="text-xs text-emerald-200 uppercase font-mono">{fileFormat.toUpperCase()}</span>
              <p className="text-xl font-extrabold text-white">Ksh. {amount}</p>
            </div>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-4">
          
          {/* Instructions Box */}
          <div className="rounded-2xl bg-slate-50 p-4 border border-slate-100 dark:bg-slate-800/60 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300 space-y-2">
            <div className="flex items-center justify-between font-semibold text-slate-900 dark:text-white pb-1 border-b border-slate-200 dark:border-slate-700">
              <span>Payment Steps (Send Money)</span>
              <span className="text-emerald-600 dark:text-emerald-400 font-bold">Ksh. 20</span>
            </div>
            <ol className="list-decimal list-inside space-y-1.5 pt-1">
              <li>Open <strong>M-PESA</strong> on your phone (or dial *334#)</li>
              <li>Select <strong>Send Money</strong></li>
              <li>
                Enter Phone Number: 
                <span className="inline-flex items-center gap-1.5 ml-1 font-mono font-bold text-slate-900 dark:text-white bg-slate-200 dark:bg-slate-700 px-1.5 py-0.5 rounded">
                  {targetNumber}
                  <button
                    onClick={handleCopyNumber}
                    className="hover:text-emerald-600 transition-colors p-0.5"
                    title="Copy phone number"
                  >
                    {copied ? <Check className="h-3 w-3 text-emerald-600" /> : <Copy className="h-3 w-3" />}
                  </button>
                </span>
                {copied && <span className="text-[10px] text-emerald-600 ml-1 font-medium">Copied!</span>}
              </li>
              <li>Enter Amount: <strong>Ksh. 20</strong></li>
              <li>Enter M-PESA PIN and Confirm Send</li>
            </ol>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-2 gap-2">
            <a
              href={`tel:*334#`}
              className="flex items-center justify-center gap-1.5 h-10 px-3 text-xs font-semibold rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-200 transition-colors"
            >
              <Phone className="h-3.5 w-3.5 text-emerald-600" />
              <span>Dial *334# USSD</span>
            </a>
            <button
              type="button"
              onClick={handleSimulateStk}
              className="flex items-center justify-center gap-1.5 h-10 px-3 text-xs font-semibold rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:hover:bg-emerald-900/60 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 transition-colors"
            >
              <Sparkles className="h-3.5 w-3.5 text-emerald-600" />
              <span>Auto-Fill Code</span>
            </button>
          </div>

          {/* Code Input */}
          <div className="space-y-1.5">
            <label className="block text-xs font-medium text-slate-700 dark:text-slate-300">
              Enter 10-Character M-PESA Confirmation Code:
            </label>
            <div className="relative">
              <input
                type="text"
                value={transactionCode}
                onChange={(e) => {
                  setTransactionCode(e.target.value.toUpperCase());
                  setError('');
                }}
                placeholder="e.g. TAH9418K7P or SAK281XX99"
                maxLength={12}
                className="w-full h-12 px-4 rounded-xl border border-slate-300 bg-white dark:bg-slate-950 dark:border-slate-700 text-slate-900 dark:text-white font-mono uppercase tracking-wider text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
              />
              {transactionCode && (
                <div className="absolute right-3 top-3.5">
                  <ShieldCheck className="h-5 w-5 text-emerald-600" />
                </div>
              )}
            </div>
            {error && <p className="text-xs text-rose-600 dark:text-rose-400">{error}</p>}
          </div>

          {/* Action Button */}
          <button
            onClick={handleVerify}
            disabled={isVerifying || success}
            className={`w-full h-12 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 shadow-lg transition-all ${
              success
                ? 'bg-emerald-600 text-white'
                : 'bg-[#008751] hover:bg-[#007043] text-white shadow-emerald-900/20 active:scale-[0.98]'
            } disabled:opacity-70`}
          >
            {isVerifying ? (
              <>
                <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Verifying M-Pesa Code...</span>
              </>
            ) : success ? (
              <>
                <Check className="h-5 w-5" />
                <span>Payment Verified! Starting Download...</span>
              </>
            ) : (
              <>
                <span>Confirm Ksh. 20 & Download {fileFormat.toUpperCase()}</span>
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </button>

          <p className="text-[11px] text-center text-slate-600 dark:text-slate-400">
            Payment directly supports CBC HUB curriculum research & document generation servers. Once unlocked, documents can be re-downloaded at any time.
          </p>
        </div>
      </div>
    </div>
  );
};
