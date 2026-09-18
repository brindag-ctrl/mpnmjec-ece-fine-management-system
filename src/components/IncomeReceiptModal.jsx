import React from 'react';
import { X, Printer, CheckCircle2, Landmark } from 'lucide-react';
import { formatCurrency, numberToWords } from '../utils/calculations';
import { CollegeLogo } from './CollegeLogo';

export const IncomeReceiptModal = ({ isOpen, onClose, income }) => {
  if (!isOpen || !income) return null;

  const handlePrint = () => {
    window.print();
  };

  // Format Date in DD.MM.YYYY
  const getReceiptDate = (dateVal) => {
    if (!dateVal) return new Date().toLocaleDateString('en-GB').replace(/\//g, '.');
    try {
      const d = new Date(dateVal.seconds ? dateVal.seconds * 1000 : dateVal);
      if (isNaN(d.getTime())) return new Date().toLocaleDateString('en-GB').replace(/\//g, '.');
      return `${String(d.getDate()).padStart(2, '0')}.${String(d.getMonth() + 1).padStart(2, '0')}.${d.getFullYear()}`;
    } catch {
      return new Date().toLocaleDateString('en-GB').replace(/\//g, '.');
    }
  };

  const receiptDate = getReceiptDate(income.date || income.createdAt);
  const amountWords = numberToWords(income.amount);
  const receiptNo = income.referenceNumber || income.id || `INC-${Date.now().toString().slice(-6)}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-xl bg-white border border-slate-200 rounded-2xl shadow-2xl overflow-hidden my-6 animate-fade-in">
        {/* Modal Controls (Hidden during print) */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-100 bg-slate-50 print:hidden">
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-700">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Official Department Income Receipt / Voucher</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-blue-700 hover:bg-blue-800 rounded-lg shadow-xs transition-all active:scale-95 cursor-pointer"
              title="Print Receipt / Save as PDF"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / Save PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-200 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Printable Area - Designed Exactly as College Receipt Voucher */}
        <div className="p-4 sm:p-6 bg-slate-100 flex justify-center print:p-0 print:bg-white">
          <div
            id="printable-receipt"
            className="w-full bg-white border-2 border-slate-900 p-5 sm:p-6 text-slate-950 font-sans text-xs select-none shadow-sm print:shadow-none print:border-2 print:border-black print:p-6"
            style={{ maxWidth: '580px' }}
          >
            {/* Header: Logo, College Name & NAAC Badge */}
            <div className="flex items-center justify-between pb-3 border-b-2 border-slate-900 gap-3">
              <CollegeLogo size={52} className="shrink-0" />
              <div className="text-center flex-1 min-w-0">
                <h1 className="text-sm sm:text-base font-bold text-slate-950 uppercase tracking-tight leading-tight">
                  M.P.Nachimuthu M.Jaganathan
                </h1>
                <h2 className="text-sm sm:text-base font-bold text-slate-950 uppercase tracking-tight leading-tight">
                  Engineering College
                </h2>
                <p className="text-[10px] sm:text-[11px] font-medium text-slate-700 mt-0.5">
                  Sudhanandhen Kalvi Nagar, Chennimalai, <strong className="text-slate-950">Erode - 638 112.</strong>
                </p>
                <p className="text-[10px] font-bold text-red-700 uppercase tracking-wider mt-0.5">
                  Department of Electronics and Communication Engineering
                </p>
              </div>
              {/* NAAC Badge */}
              <div className="shrink-0 flex flex-col items-center justify-center border border-slate-900 rounded-full px-2 py-1 bg-white">
                <span className="text-[8px] font-black text-slate-950 tracking-wider">NAAC</span>
                <span className="text-[6px] font-bold uppercase text-slate-700 -mt-0.5">ACCREDITED</span>
              </div>
            </div>

            {/* Sub-Header: Receipt No, Centered RECEIPT pill, Date */}
            <div className="grid grid-cols-3 items-center py-2.5 border-b border-slate-900">
              <div className="text-left font-mono font-bold text-xs sm:text-sm">
                <span>Voucher No. : </span>
                <span className="text-slate-950 tracking-wide">{receiptNo}</span>
              </div>
              <div className="text-center">
                <span className="inline-block px-3 py-0.5 border-2 border-slate-900 font-extrabold uppercase tracking-widest text-xs rounded-sm">
                  INCOME RECEIPT
                </span>
              </div>
              <div className="text-right font-mono font-bold text-xs sm:text-sm">
                <span>Date: </span>
                <span className="text-slate-950">{receiptDate}</span>
              </div>
            </div>

            {/* Receipt Body Fields */}
            <div className="py-4 space-y-3 font-medium text-slate-900 leading-relaxed text-xs sm:text-sm">
              {/* Received from */}
              <div className="flex items-baseline">
                <span className="whitespace-nowrap text-slate-700 font-normal">Received with thanks from:</span>
                <span className="flex-1 ml-2 font-bold text-slate-950 border-b border-dotted border-slate-800 pb-0.5 uppercase tracking-wide">
                  {income.source || 'ECE Department Contributor'}
                </span>
              </div>

              {/* Purpose / Title & Academic Year */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2 flex items-baseline">
                  <span className="whitespace-nowrap text-slate-700 font-normal">Towards / Purpose:</span>
                  <span className="flex-1 ml-2 font-semibold text-slate-950 border-b border-dotted border-slate-800 pb-0.5">
                    {income.title}
                  </span>
                </div>
                <div className="flex items-baseline">
                  <span className="whitespace-nowrap text-slate-700 font-normal">Academic Year:</span>
                  <span className="flex-1 ml-2 font-mono font-bold text-slate-950 border-b border-dotted border-slate-800 pb-0.5">
                    {income.academicYear || '2025-2026'}
                  </span>
                </div>
              </div>

              {/* Payment Mode & Reference */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="flex items-baseline">
                  <span className="whitespace-nowrap text-slate-700 font-normal">Payment Mode:</span>
                  <span className="flex-1 ml-2 font-bold text-slate-950 border-b border-dotted border-slate-800 pb-0.5">
                    {income.paymentMode || 'Cash'}
                  </span>
                </div>
                {income.referenceNumber ? (
                  <div className="flex items-baseline">
                    <span className="whitespace-nowrap text-slate-700 font-normal">Txn / Ref No:</span>
                    <span className="flex-1 ml-2 font-mono font-bold text-slate-950 border-b border-dotted border-slate-800 pb-0.5">
                      {income.referenceNumber}
                    </span>
                  </div>
                ) : (
                  <div className="flex items-baseline">
                    <span className="whitespace-nowrap text-slate-700 font-normal">Received By:</span>
                    <span className="flex-1 ml-2 font-semibold text-slate-950 border-b border-dotted border-slate-800 pb-0.5">
                      {income.receivedBy || 'Staff Coordinator'}
                    </span>
                  </div>
                )}
              </div>

              {/* Remarks if any */}
              {income.remarks && (
                <div className="flex items-baseline">
                  <span className="whitespace-nowrap text-slate-700 font-normal">Remarks / Notes:</span>
                  <span className="flex-1 ml-2 font-normal text-slate-800 border-b border-dotted border-slate-800 pb-0.5 italic">
                    {income.remarks}
                  </span>
                </div>
              )}

              {/* The sum of Rupees in words */}
              <div className="flex items-baseline">
                <span className="whitespace-nowrap text-slate-700 font-normal">The sum of Rupees:</span>
                <span className="flex-1 ml-2 font-semibold text-slate-950 border-b border-dotted border-slate-800 pb-0.5 italic">
                  {amountWords}
                </span>
              </div>
            </div>

            {/* Bottom Section: Amount Box & Signatures */}
            <div className="mt-6 pt-3 border-t-2 border-slate-900 flex items-end justify-between gap-4">
              {/* Boxed Amount */}
              <div className="border-2 border-slate-900 bg-slate-50 px-4 py-2 text-left rounded-xs shadow-2xs">
                <div className="text-[10px] uppercase font-bold text-slate-600">Total Inflow Amount</div>
                <div className="font-mono font-extrabold text-base sm:text-xl text-slate-950 tracking-wider">
                  {formatCurrency(income.amount)} /-
                </div>
              </div>

              {/* Official Signatures */}
              <div className="flex items-end gap-6 sm:gap-10 pb-1 text-center">
                <div>
                  <div className="w-20 sm:w-28 border-b border-slate-900 mb-1"></div>
                  <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-slate-800">
                    Received By
                  </span>
                </div>
                <div>
                  <div className="w-20 sm:w-28 border-b border-slate-900 mb-1"></div>
                  <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-slate-800">
                    HOD / Staff In-Charge
                  </span>
                </div>
              </div>
            </div>

            {/* Footer Verification Note */}
            <div className="mt-4 pt-2 border-t border-slate-200 text-center text-[9px] text-slate-500">
              Department of ECE • Official Financial Record • Generated electronically on {new Date().toLocaleString('en-IN')}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
