import React, { useState, useEffect, useRef } from 'react';
import { X, Search, CheckCircle, AlertCircle, User, Check, ChevronDown } from 'lucide-react';
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
  const [searchQuery, setSearchQuery] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const [reason, setReason] = useState('');
  const [amount, setAmount] = useState('100');
  const [status, setStatus] = useState('Unpaid');
  const [remarks, setRemarks] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const dropdownRef = useRef(null);

  // Initialize modal state ONLY when modal opens or initial/default data changes
  useEffect(() => {
    if (isOpen) {
      setError('');
      setSearchQuery('');
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
        setReason(FINE_REASONS[0] || 'Late submission of Lab Observation / Record');
        setAmount('100');
        setStatus('Unpaid');
        setRemarks('');
      }
    }
  }, [isOpen, initialData, defaultStudentId]);

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

  const selectedStudent = students.find((s) => s.id === selectedStudentId);

  // Filter students based on search input
  const filteredStudents = students.filter((s) => {
    if (!searchQuery.trim()) return true;
    const term = searchQuery.toLowerCase().trim();
    return (
      s.name.toLowerCase().includes(term) ||
      s.registerNumber.toLowerCase().includes(term) ||
      (s.year && s.year.toLowerCase().includes(term))
    );
  });

  const handleSelectStudent = (studentId) => {
    setSelectedStudentId(studentId);
    setIsDropdownOpen(false);
    setSearchQuery('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!selectedStudent) {
      setError('Please select a valid ECE student.');
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

          {/* Searchable Student Combobox */}
          <div ref={dropdownRef} className="relative">
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Select ECE Student <span className="text-rose-500">*</span>
            </label>

            {/* Selected Student Card */}
            {selectedStudent && !isDropdownOpen ? (
              <div className="p-3.5 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-blue-600 text-white font-bold flex items-center justify-center text-sm font-mono shrink-0">
                    {selectedStudent.name.charAt(0)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900 text-sm">{selectedStudent.name}</span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-800 border border-blue-200">
                        {selectedStudent.year} Year ECE
                      </span>
                    </div>
                    <p className="text-slate-600 font-mono text-[11px] mt-0.5">
                      Reg No: <strong className="text-blue-900">{selectedStudent.registerNumber}</strong>
                    </p>
                  </div>
                </div>

                {!initialData && (
                  <button
                    type="button"
                    onClick={() => {
                      setIsDropdownOpen(true);
                      setSearchQuery('');
                    }}
                    className="px-3 py-1.5 text-xs font-semibold text-blue-700 bg-white hover:bg-blue-100 border border-blue-300 rounded-lg transition-colors shadow-2xs"
                  >
                    Change Student
                  </button>
                )}
              </div>
            ) : (
              /* Search Input Field */
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  placeholder="Search student by name, register number (e.g. 731725...), or year..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setIsDropdownOpen(true);
                  }}
                  onFocus={() => setIsDropdownOpen(true)}
                  disabled={!!initialData}
                  className="w-full pl-10 pr-9 py-2.5 bg-white border border-slate-300 rounded-xl text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                />
                <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-3 pointer-events-none" />

                {/* Dropdown Options Popup */}
                {isDropdownOpen && (
                  <div className="absolute left-0 right-0 top-full mt-1 max-h-60 overflow-y-auto bg-white border border-slate-200 rounded-xl shadow-xl z-50 divide-y divide-slate-100">
                    {filteredStudents.length === 0 ? (
                      <div className="p-4 text-center text-slate-400 text-xs">
                        No ECE student found matching "{searchQuery}".
                      </div>
                    ) : (
                      filteredStudents.map((s) => {
                        const isSelected = s.id === selectedStudentId;
                        return (
                          <div
                            key={s.id}
                            onClick={() => handleSelectStudent(s.id)}
                            className={`p-3 text-xs flex items-center justify-between cursor-pointer transition-colors ${
                              isSelected ? 'bg-blue-50 text-blue-900' : 'hover:bg-slate-50 text-slate-800'
                            }`}
                          >
                            <div>
                              <p className="font-bold text-slate-900 text-xs sm:text-sm">{s.name}</p>
                              <p className="text-[11px] font-mono text-slate-500 mt-0.5">
                                Reg No: <span className="text-blue-700 font-semibold">{s.registerNumber}</span> • {s.year} Year ECE
                              </p>
                            </div>

                            {isSelected && (
                              <Check className="w-4 h-4 text-blue-600 shrink-0" />
                            )}
                          </div>
                        );
                      })
                    )}
                  </div>
                )}
              </div>
            )}
          </div>

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
