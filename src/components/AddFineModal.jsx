import React, { useState, useEffect } from 'react';
import { X, Search, CheckCircle, AlertCircle, Sparkles, Filter } from 'lucide-react';
import { FINE_REASONS } from '../services/mockData';
import confetti from 'canvas-confetti';

export const AddFineModal = ({
  isOpen,
  onClose,
  onSubmit,
  students = [],
  initialData = null,
  defaultStudentId = null,
}) => {
  const [selectedStudentId, setSelectedStudentId] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [yearFilter, setYearFilter] = useState('All');

  const [reason, setReason] = useState('');
  const [amount, setAmount] = useState('100');
  const [status, setStatus] = useState('Unpaid');
  const [remarks, setRemarks] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

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
      } else {
        const initId = defaultStudentId || (students.length > 0 ? students[0].id : '');
        setSelectedStudentId(initId);
        setReason(FINE_REASONS[0] || 'Late submission of Lab Observation / Record');
        setAmount('100');
        setStatus('Unpaid');
        setRemarks('');
      }
    }
  }, [isOpen, initialData, defaultStudentId]);

  // If students load after modal open, ensure initial student is selected
  useEffect(() => {
    if (isOpen && !selectedStudentId && students.length > 0) {
      setSelectedStudentId(defaultStudentId || students[0].id);
    }
  }, [isOpen, students, selectedStudentId, defaultStudentId]);

  if (!isOpen) return null;

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

  // Handle Search Input Change & automatically sync selectedStudentId
  const handleSearchChange = (term, newYearFilter = yearFilter) => {
    setSearchTerm(term);

    const lower = term.toLowerCase().trim();
    const matched = students.filter((s) => {
      const sYear = (s.year || '').toLowerCase();
      const matchesYear =
        newYearFilter === 'All' ||
        (newYearFilter === 'Passed Out'
          ? sYear.includes('passout') || sYear.includes('passed out')
          : sYear === newYearFilter.toLowerCase() || sYear.includes(newYearFilter.toLowerCase()));

      if (!matchesYear) return false;
      if (!lower) return true;

      return (
        (s.name || '').toLowerCase().includes(lower) ||
        (s.registerNumber || '').toLowerCase().includes(lower) ||
        sYear.includes(lower) ||
        `${sYear} year`.includes(lower)
      );
    });

    // Auto-select the top matching student so dropdown, state, and pill stay 100% in sync
    if (matched.length > 0 && !matched.some((s) => s.id === selectedStudentId)) {
      setSelectedStudentId(matched[0].id);
    }
  };

  const handleYearFilterChange = (yr) => {
    setYearFilter(yr);
    handleSearchChange(searchTerm, yr);
  };

  const handleSelectStudentChange = (e) => {
    setSelectedStudentId(e.target.value);
  };

  const selectedStudent = students.find((s) => s.id === selectedStudentId);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!selectedStudent) {
      setError('Please select an active ECE student.');
      return;
    }

    const finalReason = reason.trim();
    if (!finalReason) {
      setError('Please enter or select a reason for the fine.');
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-xl bg-white border border-slate-200 rounded-2xl shadow-2xl overflow-hidden my-8">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-100 bg-slate-50">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-blue-700">
              Department Fine Desk
            </span>
            <h3 className="text-base sm:text-lg font-bold text-slate-900 mt-0.5">
              {initialData ? 'Edit Fine Record' : 'Record New Department Fine'}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-200/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="flex items-center gap-2 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
              <span>{error}</span>
            </div>
          )}

          {/* Student Selector */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
                Select Student (ECE) <span className="text-rose-500">*</span>
              </label>

              {/* Quick Year Filter Chips */}
              {!initialData && (
                <div className="flex flex-wrap items-center gap-1 text-[11px]">
                  {['All', '2nd', '3rd', '4th', 'Passed Out', 'Discontinued'].map((yr) => (
                    <button
                      key={yr}
                      type="button"
                      onClick={() => handleYearFilterChange(yr)}
                      className={`px-2 py-0.5 rounded-md font-semibold transition-colors ${
                        yearFilter === yr
                          ? yr === 'Passed Out'
                            ? 'bg-purple-600 text-white shadow-2xs'
                            : yr === 'Discontinued'
                            ? 'bg-amber-600 text-white shadow-2xs'
                            : 'bg-blue-600 text-white shadow-2xs'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      {yr === 'All' ? 'All' : yr === 'Passed Out' ? 'Passed Out' : yr === 'Discontinued' ? 'Discontinued' : `${yr} Yr`}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Filter Search Input */}
            {!initialData && (
              <div className="relative mb-2">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Filter student by name, register number (e.g. 731724...), or year..."
                  value={searchTerm}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-lg text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-600 focus:bg-white"
                />
              </div>
            )}

            {/* Dropdown Select */}
            <select
              value={selectedStudentId}
              onChange={handleSelectStudentChange}
              disabled={!!initialData}
              className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-sm text-slate-800 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 disabled:bg-slate-100 font-medium"
            >
              <option value="" disabled>-- Select ECE Student --</option>
              {filteredStudents.length === 0 ? (
                <option value="" disabled>No student matches current filter</option>
              ) : (
                filteredStudents.map((s) => {
                  const sYrLower = (s.year || '').toLowerCase();
                  const isPassout = sYrLower.includes('passout') || sYrLower.includes('passed out');
                  const isDisc = sYrLower === 'discontinued';
                  const yrLabel = isPassout ? (s.year.startsWith('Passout-') ? s.year : `Passout ${s.year}`) : isDisc ? 'Discontinued' : `${s.year} Year ECE`;

                  return (
                    <option key={s.id} value={s.id}>
                      {s.name} ({s.registerNumber}) - {yrLabel}
                    </option>
                  );
                })
              )}
            </select>
          </div>

          {/* Selected Student Pill */}
          {selectedStudent && (
            <div className="p-3 rounded-xl bg-blue-50 border border-blue-200 text-xs flex flex-wrap items-center justify-between gap-2 text-slate-700 animate-in fade-in duration-150">
              <div className="flex items-center gap-2">
                <span className="text-slate-500">Selected: </span>
                <strong className="text-slate-900 font-bold">{selectedStudent.name}</strong>
                <span className="text-slate-300">|</span>
                <span className="text-slate-500">Reg: </span>
                <strong className="text-blue-900 font-mono">{selectedStudent.registerNumber}</strong>
              </div>
              <div className="flex items-center gap-3">
                <div>
                  <span className="text-slate-500">Year: </span>
                  {(selectedStudent.year || '').toLowerCase().includes('passout') || (selectedStudent.year || '').toLowerCase().includes('passed out') ? (
                    <span className="font-bold text-purple-800 bg-purple-100 px-1.5 py-0.5 rounded border border-purple-300">
                      🎓 {selectedStudent.year.startsWith('Passout-') ? selectedStudent.year : `Passout ${selectedStudent.year}`}
                    </span>
                  ) : (selectedStudent.year || '').toLowerCase() === 'discontinued' ? (
                    <span className="font-bold text-amber-800 bg-amber-100 px-1.5 py-0.5 rounded border border-amber-300">
                      Discontinued
                    </span>
                  ) : (
                    <span className="font-semibold text-blue-800 bg-blue-100/60 px-1.5 py-0.5 rounded">
                      {selectedStudent.year} Year
                    </span>
                  )}
                </div>
                <div>
                  <span className="text-slate-500">Dept: </span>
                  <span className="text-blue-700 font-bold">ECE</span>
                </div>
              </div>
            </div>
          )}

          {/* Reason Input (Typable with Datalist Suggestions) */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Fine Reason <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              list="fine-reasons-datalist"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Type fine reason (e.g. Late submission of Lab Record, Mobile phone in class...)"
              required
              className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
            />
            <datalist id="fine-reasons-datalist">
              {FINE_REASONS.map((r) => (
                <option key={r} value={r} />
              ))}
            </datalist>
          </div>

          {/* Amount & Status Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Amount */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Fine Amount (₹ INR) <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-2.5 text-slate-500 font-bold">₹</span>
                <input
                  type="number"
                  min="1"
                  step="1"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="e.g. 150"
                  required
                  className="w-full pl-8 pr-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-sm text-slate-900 font-mono font-semibold focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                />
              </div>
            </div>

            {/* Status */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Payment Status <span className="text-rose-500">*</span>
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className={`w-full px-3.5 py-2.5 bg-white border rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 ${
                  status === 'Paid'
                    ? 'border-emerald-500 text-emerald-700 focus:ring-emerald-100'
                    : status === 'Unpaid'
                    ? 'border-amber-500 text-amber-700 focus:ring-amber-100'
                    : 'border-rose-500 text-rose-700 focus:ring-rose-100'
                }`}
              >
                <option value="Unpaid">Unpaid (Pending)</option>
                <option value="Paid">Paid (Treasury)</option>
                <option value="Cancelled">Cancelled (Waived)</option>
              </select>
            </div>
          </div>

          {/* Remarks */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Staff Remarks / Faculty In-Charge (Optional)
            </label>
            <input
              type="text"
              placeholder="e.g. Issued by DSP Lab In-charge / Paid via Cash Desk"
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              className="w-full px-3.5 py-2 bg-white border border-slate-300 rounded-xl text-sm text-slate-800 focus:outline-none focus:border-blue-600"
            />
          </div>

          {/* Footer */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 rounded-xl hover:bg-slate-100 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-5 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-md shadow-blue-500/20 transition-all flex items-center gap-2 disabled:opacity-50"
            >
              {submitting ? 'Saving...' : initialData ? 'Update Fine' : 'Record Fine'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
