import React from 'react';
import { X, Printer, CheckCircle } from 'lucide-react';
import { formatDateTime, formatCurrency } from '../utils/calculations';
import { CollegeLogo } from './CollegeLogo';

export const ReceiptModal = ({ isOpen, onClose, fine }) => {
  if (!isOpen || !fine) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-xl bg-white border border-slate-200 rounded-2xl shadow-2xl overflow-hidden my-8">
        {/* Modal Controls (Hidden in print) */}
        <div className="flex items-center justify-between p-4 border-b border-slate-100 bg-slate-50 print:hidden">
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-700">
            <CheckCircle className="w-4 h-4 text-emerald-600" />
            <span>Official Department Payment Receipt</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-red-700 hover:bg-red-800 rounded-lg shadow-sm transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Receipt</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-200"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Printable Area */}
        <div id="printable-receipt" className="p-8 bg-white text-slate-900 font-sans">
          {/* Header with College Emblem */}
          <div className="flex items-center justify-between border-b-2 border-slate-900 pb-4 gap-4">
            <CollegeLogo size={68} className="shrink-0" />
            <div className="text-center flex-1">
              <p className="text-[11px] font-bold text-blue-900 uppercase tracking-wider">
                Approved by AICTE • Affiliated to Anna University, Chennai
              </p>
              <h2 className="text-base sm:text-lg font-black text-slate-950 uppercase tracking-tight leading-tight mt-0.5">
                M.P. Nachimuthu M. Jaganathan Engineering College
              </h2>
              <p className="text-[11px] text-slate-600">
                Chennimalai, Erode - 638 112, Tamil Nadu, India
              </p>
              <div className="mt-1.5 inline-block px-3 py-0.5 bg-red-50 rounded border border-red-200 font-bold text-[11px] text-red-800 uppercase">
                Department of Electronics and Communication Engineering (ECE)
              </div>
            </div>
          </div>

          {/* Receipt Title & Meta */}
          <div className="mt-4 flex items-center justify-between text-xs border-b border-slate-200 pb-3">
            <div>
              <span className="text-slate-500">Receipt Voucher No: </span>
              <strong className="font-mono text-slate-900 text-sm">{fine.id}</strong>
            </div>
            <div>
              <span className="text-slate-500">Payment Date: </span>
              <strong className="text-slate-900">{formatDateTime(fine.paidAt || fine.updatedAt)}</strong>
            </div>
          </div>

          {/* Student & Fine Details Table */}
          <div className="mt-4 space-y-3">
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 grid grid-cols-2 gap-3 text-xs">
              <div>
                <p className="text-slate-500">Student Name</p>
                <p className="font-bold text-slate-900 text-sm mt-0.5">{fine.studentName}</p>
              </div>
              <div>
                <p className="text-slate-500">Register Number</p>
                <p className="font-bold font-mono text-red-700 text-sm mt-0.5">{fine.registerNumber}</p>
              </div>
              <div>
                <p className="text-slate-500">Department / Year</p>
                <p className="font-semibold text-slate-800 mt-0.5">ECE / {fine.year} Year</p>
              </div>
              <div>
                <p className="text-slate-500">Payment Status</p>
                <span className="inline-flex items-center gap-1 font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-300">
                  ✓ PAID & CLEARED
                </span>
              </div>
            </div>

            {/* Fine Particulars */}
            <div className="border border-slate-200 rounded-xl overflow-hidden">
              <table className="w-full text-xs">
                <thead className="bg-slate-100 border-b border-slate-200 text-slate-700 font-bold">
                  <tr>
                    <th className="text-left p-3">Particulars / Reason for Fine</th>
                    <th className="text-right p-3 w-32">Amount (INR)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  <tr>
                    <td className="p-3">
                      <p className="font-bold text-slate-900">{fine.reason}</p>
                      {fine.remarks && (
                        <p className="text-[11px] text-slate-500 mt-1 italic">
                          Remarks: {fine.remarks}
                        </p>
                      )}
                    </td>
                    <td className="p-3 text-right font-mono font-bold text-slate-900 text-sm">
                      {formatCurrency(fine.amount)}
                    </td>
                  </tr>
                </tbody>
                <tfoot className="bg-slate-50 border-t-2 border-slate-300 font-bold text-slate-900">
                  <tr>
                    <td className="p-3 text-right text-xs uppercase tracking-wider">
                      Total Department Fine Collected:
                    </td>
                    <td className="p-3 text-right font-mono text-base text-red-800">
                      {formatCurrency(fine.amount)}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>

          {/* Signatures */}
          <div className="mt-10 grid grid-cols-2 gap-8 text-center text-xs pt-4 border-t border-slate-300">
            <div>
              <div className="h-10"></div>
              <p className="font-bold text-slate-900">Faculty / Lab In-Charge</p>
              <p className="text-[10px] text-slate-500">ECE Department</p>
            </div>
            <div>
              <div className="h-10"></div>
              <p className="font-bold text-slate-900">Head of Department (ECE)</p>
              <p className="text-[10px] text-slate-500">MPNMJEC, Chennimalai</p>
            </div>
          </div>

          <div className="mt-6 text-center text-[10px] text-slate-400">
            * Official acknowledgement receipt generated from MPNMJEC ECE Department Fine Management System.
          </div>
        </div>
      </div>
    </div>
  );
};
