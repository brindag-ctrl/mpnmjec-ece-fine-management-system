import React, { useState, useEffect, useRef } from 'react';
import { 
  X, 
  Search, 
  CheckCircle2, 
  AlertCircle, 
  User, 
  Check, 
  ChevronDown, 
  IndianRupee, 
  Tag, 
  Clock, 
  RotateCcw,
  Sparkles
} from 'lucide-react';
import { FINE_REASONS } from '../services/mockData';
import confetti from 'canvas-confetti';

const QUICK_FINE_PRESETS = [
  { label: 'Lab Record / Observation Late', amount: 100, tag: 'Lab Record' },
  { label: 'Electronic Component / Equipment Damage', amount: 200, tag: 'Component Damage' },
  { label: 'Missing ID Tag / Improper Lab Attire', amount: 50, tag: 'ID / Attire' },
  { label: 'Mobile Phone in Lab / Class', amount: 100, tag: 'Mobile Phone' },
  { label: 'Department Library Book Overdue', amount: 50, tag: 'Library Overdue' },
  { label: 'Late to Lab / Bench Discipline', amount: 50, tag: 'Late / Discipline' },
];

const QUICK_AMOUNTS = [50, 100, 150, 200, 500];

export const AddFineModal = ({
  isOpen,
  onClose,
  onSubmit,
  students = [],
  initialData = null,
  defaultStudentId = null,
}) => {
  const [selectedStudentId, setSelectedStudentId] = useState('');
  const [isSearchingStudent, setIsSearchingStudent] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [yearFilter, setYearFilter] = useState('All');

  const [reason, setReason] = useState('');
  const [amount, setAmount] = useState('100');
  const [status, setStatus] = useState('Unpaid');
  const [remarks, setRemarks] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const searchInputRef = useRef(null);

  // Initialize modal state on open
  useEffect(() => {
    if (isOpen) {
      setError('');
      setSearchTerm('');
      setYearFilter('All');

      if (initialData) {
        setSelectedStudentId(initialData.studentId || '');
        setReason(initialData.reason || '');
        setAmount(initialData.amount ? String(initialData.amount) : '100');
        setStatus(initialData.status || 'Unpaid');
        setRemarks(initialData.remarks || '');
        setIsSearchingStudent(false);
      } else {
        const initId = defaultStudentId || (students.length > 0 ? students[0].id : '');
        setSelectedStudentId(initId);
        setReason(FINE_REASONS[0] || 'Late submission of Lab Observation / Record');
        setAmount('100');
        setStatus('Unpaid');
        setRemarks('');
        setIsSearchingStudent(!defaultStudentId && students.length === 0);
      }
    }
  }, [isOpen, initialData, defaultStudentId, students.length]);

  // If students load asynchronously after modal opens, ensure student is selected
  useEffect(() => {
    if (isOpen && !selectedStudentId && students.length > 0) {
      setSelectedStudentId(defaultStudentId || students[0].id);
    }
  }, [isOpen, students, selectedStudentId, defaultStudentId]);

  if (!isOpen) return null;

  const selectedStudent = students.find((s) => s.id === selectedStudentId);

  // Filter students based on year filter AND search term
  const filteredStudents = students.filter((s) => {
    const sYear = (s.year || '').toLowerCase();
    const matchesYear =
      yearFilter === 'All' ||
      sYear === yearFilter.toLowerCase() ||
      sYear.includes(yearFilter.toLowerCase());

    if (!matchesYear) return false;

    if (!searchTerm.trim()) return true;
    const term = searchTerm.toLowerCase().trim();
    return (
      (s.name || '').toLowerCase().includes(term) ||
      (s.registerNumber || '').toLowerCase().includes(term) ||
      sYear.includes(term) ||
      `${sYear} year`.includes(term)
    );
  });

  const handleSelectStudent = (studentId) => {
    setSelectedStudentId(studentId);
    setIsSearchingStudent(false);
    setSearchTerm('');
  };

  const handleQuickPresetClick = (preset) => {
    setReason(preset.label);
    setAmount(String(preset.amount));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!selectedStudent) {
      setError('Please select an active ECE student.');
      return;
    }

    const finalReason = reason.trim();
    if (!finalReason) {
      setError('Please enter or select a fine reason.');
      return;
    }

    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      setError('Please enter a valid fine amount greater than ₹0.');
      return;
    }

    setSubmitting(true);
    try {
      const finePayload = {
        studentId: selectedStudent.id,
        studentName: selectedStudent.name,
        registerNumber: selectedStudent.registerNumber,
        department: selectedStudent.department || 'ECE',
        year: selectedStudent.year,
        reason: finalReason,
        amount: numAmount,
        status: status,
        remarks: remarks.trim(),
      };

      await onSubmit(finePayload, initialData?.id);

      if (status === 'Paid') {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.7 },
        });
      }

      onClose();
    } catch (err) {
      setError(err.message || 'Failed to record fine.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-xl bg-white border border-slate-200 rounded-2xl shadow-2xl overflow-hidden my-6 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Top Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-100 bg-gradient-to-r from-slate-50 to-blue-50/40">
          <div>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
              <span className="text-[11px] font-bold uppercase tracking-wider text-blue-700">
                Department Fine Desk • ECE
              </span>
            </div>
            <h3 className="text-base sm:text-lg font-black text-slate-900 mt-0.5">
              {initialData ? 'Edit Department Fine' : 'Record New Department Fine'}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 rounded-xl hover:bg-white/80 border border-transparent hover:border-slate-200 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-5">
          {error && (
            <div className="flex items-center gap-2.5 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
              <span>{error}</span>
            </div>
          )}

          {/* --- 1. STUDENT SELECTOR (User Friendly) --- */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                Select ECE Student <span className="text-rose-500">*</span>
              </label>

              {/* Year Filter Chips */}
              <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-lg border border-slate-200 text-[11px]">
                {['All', '2nd', '3rd', '4th'].map((yr) => (
                  <button
                    key={yr}
                    type="button"
                    onClick={() => {
                      setYearFilter(yr);
                      setIsSearchingStudent(true);
                    }}
                    className={`px-2 py-0.5 rounded-md font-semibold transition-all ${
                      yearFilter === yr
                        ? 'bg-blue-600 text-white shadow-xs'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200'
                    }`}
                  >
                    {yr === 'All' ? 'All (121)' : `${yr} Yr`}
                  </button>
                ))}
              </div>
            </div>

            {/* Selected Student Pill Card (When student is chosen and not currently searching) */}
            {selectedStudent && !isSearchingStudent ? (
              <div className="p-3.5 rounded-xl bg-blue-50/70 border border-blue-200 flex items-center justify-between gap-3 text-xs shadow-2xs hover:border-blue-300 transition-all">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-blue-700 text-white font-bold flex items-center justify-center text-sm font-mono shrink-0 shadow-xs">
                    {selectedStudent.name.charAt(0)}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-bold text-slate-900 text-sm truncate">
                        {selectedStudent.name}
                      </span>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800 border border-blue-200 shrink-0">
                        {selectedStudent.year} Year ECE
                      </span>
                    </div>
                    <p className="text-slate-600 font-mono text-[11px] mt-0.5">
                      Reg No: <strong className="text-blue-900 font-semibold">{selectedStudent.registerNumber}</strong>
                    </p>
                  </div>
                </div>

                {!initialData && (
                  <button
                    type="button"
                    onClick={() => {
                      setIsSearchingStudent(true);
                      setTimeout(() => searchInputRef.current?.focus(), 50);
                    }}
                    className="px-3 py-1.5 text-xs font-bold text-blue-700 bg-white hover:bg-blue-50 border border-blue-300 rounded-lg transition-all shadow-2xs shrink-0 active:scale-95"
                  >
                    Change Student
                  </button>
                )}
              </div>
            ) : (
              /* Search & Live Select Dropdown */
              <div className="space-y-2 border border-slate-300 p-3 rounded-xl bg-slate-50/50">
                <div className="relative">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    ref={searchInputRef}
                    type="text"
                    placeholder="Search by student name, register number (e.g. 731724...), or year..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-9 pr-9 py-2 text-xs sm:text-sm bg-white border border-slate-300 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                  />
                  {selectedStudent && (
                    <button
                      type="button"
                      onClick={() => setIsSearchingStudent(false)}
                      className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-700"
                      title="Keep current student"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>

                {/* Live Student Options List */}
                <div className="max-h-48 overflow-y-auto rounded-lg border border-slate-200 bg-white divide-y divide-slate-100">
                  {filteredStudents.length === 0 ? (
                    <div className="p-4 text-center text-slate-400 text-xs">
                      No ECE students found matching "{searchTerm}".
                    </div>
                  ) : (
                    filteredStudents.map((s) => {
                      const isSelected = s.id === selectedStudentId;
                      return (
                        <div
                          key={s.id}
                          onClick={() => handleSelectStudent(s.id)}
                          className={`p-2.5 text-xs flex items-center justify-between cursor-pointer transition-colors ${
                            isSelected ? 'bg-blue-50 text-blue-900 font-semibold' : 'hover:bg-slate-50 text-slate-800'
                          }`}
                        >
                          <div>
                            <span className="font-bold text-slate-900">{s.name}</span>
                            <span className="text-slate-400 mx-1.5">•</span>
                            <span className="font-mono text-blue-700 font-medium">{s.registerNumber}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-slate-100 text-slate-700 border border-slate-200">
                              {s.year} Yr
                            </span>
                            {isSelected && <Check className="w-3.5 h-3.5 text-blue-600" />}
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            )}
          </div>

          {/* --- 2. FINE REASON & QUICK CHIPS --- */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                Fine Reason <span className="text-rose-500">*</span>
              </label>
              <span className="text-[11px] text-slate-400 font-medium">Click a quick chip or type below</span>
            </div>

            {/* Quick Reason Chips */}
            <div className="flex flex-wrap gap-1.5 mb-2.5">
              {QUICK_FINE_PRESETS.map((preset) => {
                const isMatching = reason === preset.label;
                return (
                  <button
                    key={preset.tag}
                    type="button"
                    onClick={() => handleQuickPresetClick(preset)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 border ${
                      isMatching
                        ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                        : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <span>{preset.tag}</span>
                    <span className={`text-[10px] font-bold ${isMatching ? 'text-blue-100' : 'text-slate-400'}`}>
                      ₹{preset.amount}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Typable Reason Input */}
            <input
              type="text"
              list="fine-reasons-datalist"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="e.g. Late submission of Lab Observation / Record"
              required
              className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 font-medium"
            />
            <datalist id="fine-reasons-datalist">
              {FINE_REASONS.map((r) => (
                <option key={r} value={r} />
              ))}
            </datalist>
          </div>

          {/* --- 3. AMOUNT & STATUS WITH QUICK SELECTORS --- */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Fine Amount */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Fine Amount (₹ INR) <span className="text-rose-500">*</span>
              </label>

              {/* Quick Amount Buttons */}
              <div className="flex items-center gap-1.5 mb-2">
                {QUICK_AMOUNTS.map((amt) => (
                  <button
                    key={amt}
                    type="button"
                    onClick={() => setAmount(String(amt))}
                    className={`flex-1 py-1 rounded-lg text-xs font-bold font-mono transition-all border ${
                      amount === String(amt)
                        ? 'bg-red-700 text-white border-red-700 shadow-2xs'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    ₹{amt}
                  </button>
                ))}
              </div>

              <div className="relative">
                <span className="absolute left-3.5 top-2.5 text-slate-500 font-bold">₹</span>
                <input
                  type="number"
                  min="1"
                  step="1"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="e.g. 100"
                  required
                  className="w-full pl-8 pr-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-sm text-slate-900 font-mono font-bold focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                />
              </div>
            </div>

            {/* Payment Status Segmented Selector */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Payment Status <span className="text-rose-500">*</span>
              </label>

              <div className="grid grid-cols-3 gap-1 p-1 bg-slate-100 rounded-xl border border-slate-200 mb-2">
                <button
                  type="button"
                  onClick={() => setStatus('Unpaid')}
                  className={`py-1.5 text-xs font-bold rounded-lg transition-all ${
                    status === 'Unpaid'
                      ? 'bg-white text-amber-800 shadow-xs border border-amber-300'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Unpaid
                </button>
                <button
                  type="button"
                  onClick={() => setStatus('Paid')}
                  className={`py-1.5 text-xs font-bold rounded-lg transition-all ${
                    status === 'Paid'
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Paid
                </button>
                <button
                  type="button"
                  onClick={() => setStatus('Cancelled')}
                  className={`py-1.5 text-xs font-bold rounded-lg transition-all ${
                    status === 'Cancelled'
                      ? 'bg-rose-600 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Waived
                </button>
              </div>

              <div className="text-[11px] text-slate-500 flex items-center gap-1.5 px-1">
                {status === 'Unpaid' && (
                  <span className="text-amber-700 font-semibold flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-amber-600" />
                    Student will have a pending department due of ₹{amount || 0}
                  </span>
                )}
                {status === 'Paid' && (
                  <span className="text-emerald-700 font-semibold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    Immediately credited to ECE Department Treasury
                  </span>
                )}
                {status === 'Cancelled' && (
                  <span className="text-rose-700 font-semibold flex items-center gap-1">
                    <RotateCcw className="w-3.5 h-3.5 text-rose-600" />
                    Waived / Approved without financial penalty
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* --- 4. OPTIONAL STAFF REMARKS --- */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Staff Remarks / Faculty In-Charge (Optional)
            </label>
            <input
              type="text"
              placeholder="e.g. Issued by DSP Lab In-charge / Paid via Cash Desk"
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              className="w-full px-3.5 py-2 bg-white border border-slate-300 rounded-xl text-xs sm:text-sm text-slate-800 focus:outline-none focus:border-blue-600"
            />
          </div>

          {/* --- 5. LIVE SUMMARY BANNER --- */}
          {selectedStudent && (
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs flex items-center justify-between text-slate-700">
              <span className="text-slate-500">
                Recording fine of <strong className="text-slate-900 font-mono font-bold">₹{amount || 0}</strong> for{' '}
                <strong className="text-blue-900">{selectedStudent.name}</strong> ({selectedStudent.year} Year ECE)
              </span>
              <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                status === 'Paid'
                  ? 'bg-emerald-100 text-emerald-800'
                  : status === 'Unpaid'
                  ? 'bg-amber-100 text-amber-800'
                  : 'bg-rose-100 text-rose-800'
              }`}>
                {status}
              </span>
            </div>
          )}

          {/* --- 6. FOOTER ACTIONS --- */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 text-sm font-semibold text-slate-600 hover:text-slate-900 rounded-xl hover:bg-slate-100 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-2.5 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-md shadow-blue-500/20 transition-all flex items-center gap-2 disabled:opacity-50 active:scale-95"
            >
              {submitting ? 'Recording...' : initialData ? 'Update Fine Record' : 'Record Fine'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
