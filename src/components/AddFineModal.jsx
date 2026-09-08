import React, { useState, useEffect, useRef } from 'react';
import { X, Search, CheckCircle, AlertCircle, ChevronDown, Check, User } from 'lucide-react';
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
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const [reason, setReason] = useState('');
  const [amount, setAmount] = useState('100');
  const [status, setStatus] = useState('Unpaid');
  const [remarks, setRemarks] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const dropdownRef = useRef(null);

  // Initialize modal state on open
  useEffect(() => {
    if (isOpen) {
      setError('');
      setSearchTerm('');
      setIsDropdownOpen(false);

      if (initialData) {
        setSelectedStudentId(initialData.studentId || '');
        setReason(initialData.reason || '');
        setAmount(initialData.amount ? String(initialData.amount) : '100');
        setStatus(initialData.status || 'Unpaid');
        setRemarks(initialData.remarks || '');
      } else {
        const initId = defaultStudentId || (students.length > 0 ? students[0].id : '');
        setSelectedStudentId(initId);
        setReason('');
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

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!isOpen) return null;

  // Filter students based on search term
  const filteredStudents = students.filter((s) => {
    if (!searchTerm.trim()) return true;
    const term = searchTerm.toLowerCase().trim();
    const sYear = (s.year || '').toLowerCase();
    return (
      (s.name || '').toLowerCase().includes(term) ||
      (s.registerNumber || '').toLowerCase().includes(term) ||
      sYear.includes(term) ||
      `${sYear} year`.includes(term)
    );
  });

  const selectedStudent = students.find((s) => s.id === selectedStudentId);

  const handleSelectStudent = (student) => {
    setSelectedStudentId(student.id);
    setSearchTerm('');
    setIsDropdownOpen(false);
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
        academicYear: initialData?.academicYear || '2025-2026',
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
            <span className="text-[11px] font-bold uppercase tracking-wider text-red-700">
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

          {/* Single Merged Searchable Student Selector */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Select Student (ECE) <span className="text-rose-500">*</span>
            </label>

            {/* Merged Searchable Input & Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <div
                onClick={() => !initialData && setIsDropdownOpen(true)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 bg-white border rounded-xl cursor-pointer transition-all ${
                  isDropdownOpen
                    ? 'border-red-600 ring-2 ring-red-600/20'
                    : 'border-slate-300 hover:border-slate-400'
                } ${initialData ? 'bg-slate-100 cursor-not-allowed opacity-80' : ''}`}
              >
                <div className="flex items-center gap-2.5 flex-1 min-w-0">
                  <Search className="w-4 h-4 text-slate-400 shrink-0" />
                  {isDropdownOpen ? (
                    <input
                      type="text"
                      autoFocus
                      placeholder="Type student name, register number (731724...), or year..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      onClick={(e) => e.stopPropagation()}
                      className="w-full text-xs sm:text-sm bg-transparent border-none outline-none text-slate-900 placeholder-slate-400 font-medium p-0"
                    />
                  ) : (
                    <div className="truncate text-xs sm:text-sm text-slate-900 font-semibold">
                      {selectedStudent ? (
                        <span>
                          {selectedStudent.name}{' '}
                          <span className="font-mono text-red-700 font-bold">({selectedStudent.registerNumber})</span>
                          {' — '}
                          <span className="text-slate-500 font-normal">
                            {(selectedStudent.year || '').toLowerCase().includes('passout') 
                              ? selectedStudent.year 
                              : `${selectedStudent.year} Year`}
                          </span>
                        </span>
                      ) : (
                        <span className="text-slate-400 font-normal">-- Click to Search / Select ECE Student --</span>
                      )}
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-1 shrink-0 ml-2">
                  {searchTerm && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSearchTerm('');
                      }}
                      className="p-1 text-slate-400 hover:text-slate-600 rounded-md"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                  <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${isDropdownOpen ? 'rotate-180 text-red-700' : ''}`} />
                </div>
              </div>

              {/* Dropdown Floating Menu */}
              {isDropdownOpen && !initialData && (
                <div className="absolute top-full left-0 right-0 mt-1.5 max-h-64 overflow-y-auto bg-white border border-slate-200 rounded-xl shadow-xl z-50 divide-y divide-slate-100">
                  {filteredStudents.length === 0 ? (
                    <div className="p-4 text-center text-xs text-slate-400">
                      No students found matching <strong className="text-slate-700">"{searchTerm}"</strong>.
                    </div>
                  ) : (
                    filteredStudents.map((s) => {
                      const isSelected = s.id === selectedStudentId;
                      const sYrLower = (s.year || '').toLowerCase();
                      const isPassout = sYrLower.includes('passout') || sYrLower.includes('passed out');
                      const isDisc = sYrLower === 'discontinued';

                      return (
                        <div
                          key={s.id}
                          onClick={() => handleSelectStudent(s)}
                          className={`p-3 flex items-center justify-between hover:bg-slate-50 cursor-pointer transition-colors text-xs ${
                            isSelected ? 'bg-red-50/70 font-semibold' : ''
                          }`}
                        >
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-slate-900">{s.name}</span>
                              <span className="font-mono text-red-700 font-bold text-[11px] bg-red-50 px-1.5 py-0.5 rounded border border-red-200">
                                {s.registerNumber}
                              </span>
                            </div>
                            <div className="text-[11px] text-slate-500 mt-0.5 flex items-center gap-2">
                              <span>Department: <strong className="text-slate-700 font-medium">ECE</strong></span>
                              <span>•</span>
                              <span>Year: <strong className="text-slate-700 font-medium">{isPassout ? s.year : isDisc ? 'Discontinued' : `${s.year} Year`}</strong></span>
                            </div>
                          </div>

                          <div className="shrink-0 ml-3 flex items-center gap-2">
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                              isPassout
                                ? 'bg-purple-50 text-purple-700 border-purple-200'
                                : isDisc
                                ? 'bg-amber-50 text-amber-700 border-amber-200'
                                : 'bg-slate-100 text-slate-700 border-slate-200'
                            }`}>
                              {isPassout ? 'Passout' : `${s.year} Yr`}
                            </span>
                            {isSelected && <Check className="w-4 h-4 text-red-700" />}
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Selected Student Pill */}
          {selectedStudent && (
            <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs flex flex-wrap items-center justify-between gap-2 text-slate-700 animate-in fade-in duration-150">
              <div className="flex items-center gap-2">
                <span className="text-slate-500">Selected: </span>
                <strong className="text-slate-900 font-bold">{selectedStudent.name}</strong>
                <span className="text-slate-300">|</span>
                <span className="text-slate-500">Reg: </span>
                <strong className="text-red-700 font-mono font-bold">{selectedStudent.registerNumber}</strong>
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
                    <span className="font-semibold text-slate-800 bg-white px-2 py-0.5 rounded border border-slate-200">
                      {selectedStudent.year} Year
                    </span>
                  )}
                </div>
                <div>
                  <span className="text-slate-500">Dept: </span>
                  <span className="text-red-700 font-bold">ECE</span>
                </div>
              </div>
            </div>
          )}

          {/* Plain Text Fine Reason Input */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Fine Reason <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Enter reason for fine (e.g. Incomplete observation, Late submission...)"
              required
              className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-red-600 focus:ring-2 focus:ring-red-600/20 font-medium"
            />
          </div>

          {/* Amount & Status Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Amount */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
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
                  placeholder="e.g. 100"
                  required
                  className="w-full pl-8 pr-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-xs sm:text-sm text-slate-900 font-mono font-bold focus:outline-none focus:border-red-600 focus:ring-2 focus:ring-red-600/20"
                />
              </div>
            </div>

            {/* Status */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Payment Status <span className="text-rose-500">*</span>
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className={`w-full px-3.5 py-2.5 bg-white border rounded-xl text-xs sm:text-sm font-bold focus:outline-none focus:ring-2 ${
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
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Staff Remarks / Faculty In-Charge (Optional)
            </label>
            <input
              type="text"
              placeholder="e.g. Issued by DSP Lab In-charge / Paid via Cash Desk"
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              className="w-full px-3.5 py-2 bg-white border border-slate-300 rounded-xl text-xs sm:text-sm text-slate-800 focus:outline-none focus:border-red-600"
            />
          </div>

          {/* Footer */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs sm:text-sm font-semibold text-slate-600 hover:text-slate-900 rounded-xl hover:bg-slate-100 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-5 py-2.5 text-xs sm:text-sm font-bold text-white bg-red-700 hover:bg-red-800 rounded-xl shadow-md shadow-red-700/20 transition-all flex items-center gap-2 disabled:opacity-50 active:scale-95"
            >
              {submitting ? 'Saving...' : initialData ? 'Update Fine' : 'Record Fine'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
