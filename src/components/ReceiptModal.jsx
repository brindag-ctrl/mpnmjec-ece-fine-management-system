import React from 'react';
import { X, Printer, Download, CheckCircle2 } from 'lucide-react';
import { formatDate, formatCurrency, numberToWords } from '../utils/calculations';
import { CollegeLogo } from './CollegeLogo';

export const ReceiptModal = ({ isOpen, onClose, fine }) => {
  if (!isOpen || !fine) return null;

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

  // Convert year to Roman numeral for traditional receipt feel
  const getRomanYear = (yr) => {
    const s = String(yr || '').trim();
    if (s.includes('4')) return 'IV';
    if (s.includes('3')) return 'III';
    if (s.includes('2')) return 'II';
    if (s.includes('1')) return 'I';
    return s || 'ECE';
  };

  const receiptDate = getReceiptDate(fine.paidAt || fine.createdAt);
  const amountWords = numberToWords(fine.amount);
  const receiptNo = fine.receiptNo || fine.id || '24204';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-xl bg-white border border-slate-200 rounded-2xl shadow-2xl overflow-hidden my-6 animate-fade-in">
        {/* Modal Controls (Hidden during print) */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-100 bg-slate-50 print:hidden">
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-700">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Official College Payment Receipt</span>
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
                <span>No. : </span>
                <span className="text-slate-950 tracking-wide">{receiptNo}</span>
              </div>
              <div className="text-center">
                <span className="inline-block px-4 py-0.5 rounded-full bg-slate-950 text-white font-bold text-[11px] uppercase tracking-widest shadow-xs">
                  RECEIPT
                </span>
              </div>
              <div className="text-right text-xs">
                <span>Date : </span>
                <strong className="font-mono text-slate-950">{receiptDate}</strong>
              </div>
            </div>

            {/* Student Info Lines */}
            <div className="py-2.5 space-y-2 border-b border-slate-900">
              {/* Name line */}
              <div className="flex items-baseline gap-2">
                <span className="shrink-0 font-medium text-slate-700">Name</span>
                <div className="flex-1 border-b border-dotted border-slate-700 pb-0.5 px-1 font-bold text-slate-950 text-sm">
                  {fine.studentName}
                </div>
              </div>

              {/* Year, Branch & Register No */}
              <div className="flex flex-wrap items-baseline gap-4 sm:gap-6 text-xs">
                <div className="flex items-baseline gap-1.5">
                  <span className="font-medium text-slate-700">Year</span>
                  <div className="border-b border-dotted border-slate-700 px-2 font-bold font-mono text-slate-950">
                    {getRomanYear(fine.year)} ({fine.year} Year)
                  </div>
                </div>

                <div className="flex items-baseline gap-1.5 flex-1 min-w-[120px]">
                  <span className="font-medium text-slate-700">Branch</span>
                  <div className="flex-1 border-b border-dotted border-slate-700 px-2 font-bold text-slate-950">
                    ECE
                  </div>
                </div>

                <div className="flex items-baseline gap-1.5">
                  <span className="font-medium text-slate-700">Reg No</span>
                  <div className="border-b border-dotted border-slate-700 px-2 font-mono font-bold text-slate-950">
                    {fine.registerNumber}
                  </div>
                </div>
              </div>
            </div>

            {/* Main Table: Particulars & Amount (Rs. | Ps.) */}
            <div className="border border-slate-900 mt-2.5">
              {/* Table Header */}
              <div className="grid grid-cols-12 border-b border-slate-900 bg-slate-50 font-bold text-[11px] text-center">
                <div className="col-span-8 p-1.5 border-r border-slate-900 text-left pl-3">
                  Particulars
                </div>
                <div className="col-span-4 grid grid-cols-3">
                  <div className="col-span-2 p-1.5 border-r border-slate-900">
                    Amount<br /><span className="text-[10px] font-normal">Rs.</span>
                  </div>
                  <div className="col-span-1 p-1.5">
                    <br /><span className="text-[10px] font-normal">Ps.</span>
                  </div>
                </div>
              </div>

              {/* Table Body */}
              <div className="grid grid-cols-12 min-h-[110px] relative text-xs">
                {/* Particulars Left */}
                <div className="col-span-8 p-2.5 border-r border-slate-900 flex flex-col justify-between">
                  <div className="space-y-1.5">
                    <p className="font-bold text-slate-900 text-[13px]">
                      Department Disciplinary Fine
                    </p>
                    <p className="text-slate-700">
                      <strong>Reason:</strong> {fine.reason}
                    </p>
                    {fine.remarks && (
                      <p className="text-[11px] text-slate-600 italic">
                        <strong>Remarks:</strong> {fine.remarks}
                      </p>
                    )}
                    <div className="text-[10px] text-slate-600 pt-1 space-y-0.5">
                      <p><strong>Payment Mode:</strong> Cash / Department Treasury</p>
                      <p><strong>Voucher Ref:</strong> {fine.id}</p>
                    </div>
                  </div>
                </div>

                {/* Amount Right (Rs. and Ps.) */}
                <div className="col-span-4 grid grid-cols-3 font-mono font-bold text-sm">
                  <div className="col-span-2 p-2.5 text-right border-r border-slate-900 pr-3">
                    {fine.amount}
                  </div>
                  <div className="col-span-1 p-2.5 text-center text-slate-500">
                    —
                  </div>
                </div>
              </div>

              {/* Table Total */}
              <div className="grid grid-cols-12 border-t-2 border-slate-900 font-bold text-xs bg-slate-50">
                <div className="col-span-8 p-2 text-right uppercase tracking-wider border-r border-slate-900 pr-3">
                  TOTAL
                </div>
                <div className="col-span-4 grid grid-cols-3 font-mono text-sm">
                  <div className="col-span-2 p-2 text-right border-r border-slate-900 pr-3 text-slate-950">
                    {fine.amount}
                  </div>
                  <div className="col-span-1 p-2 text-center text-slate-500">
                    —
                  </div>
                </div>
              </div>
            </div>

            {/* Rupees in Words */}
            <div className="py-2.5 border-b border-slate-900">
              <div className="flex items-baseline gap-2">
                <span className="shrink-0 font-medium text-slate-700">Rupees</span>
                <div className="flex-1 border-b border-dotted border-slate-700 pb-0.5 px-1 font-semibold italic text-slate-900 capitalize text-xs">
                  {amountWords}
                </div>
                <span className="shrink-0 font-medium text-slate-700 text-xs">Only</span>
              </div>
            </div>

            {/* Footer */}
            <div className="pt-6 pb-1 flex items-end justify-between text-xs">
              <div className="text-left text-[10px] text-slate-500">
                <p className="font-semibold text-slate-800">Department of ECE</p>
                <p>MPNMJEC Fine Management System</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
