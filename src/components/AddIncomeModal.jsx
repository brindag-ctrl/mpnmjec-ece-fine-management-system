import React, { useState, useEffect } from 'react';
import { X, Plus, Edit2, Coins, IndianRupee } from 'lucide-react';

const PAYMENT_MODES = [
  'Cash',
  'UPI / Online',
  'Bank Transfer',
  'Cheque'
];

export const AddIncomeModal = ({
  isOpen,
  onClose,
  onSave,
  editingIncome = null,
  currentAcademicYear = '2025-2026',
}) => {
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [source, setSource] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [academicYear, setAcademicYear] = useState(currentAcademicYear);
  const [paymentMode, setPaymentMode] = useState('Cash');
  const [referenceNumber, setReferenceNumber] = useState('');
  const [receivedBy, setReceivedBy] = useState('ECE Staff Coordinator');
  const [remarks, setRemarks] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (editingIncome) {
      setTitle(editingIncome.title || '');
      setAmount(editingIncome.amount || '');
      setSource(editingIncome.source || '');
      setDate(editingIncome.date || new Date().toISOString().split('T')[0]);
      setAcademicYear(editingIncome.academicYear || currentAcademicYear);
      setPaymentMode(editingIncome.paymentMode || 'Cash');
      setReferenceNumber(editingIncome.referenceNumber || '');
      setReceivedBy(editingIncome.receivedBy || 'ECE Staff Coordinator');
      setRemarks(editingIncome.remarks || '');
    } else {
      setTitle('');
      setAmount('');
      setSource('');
      setDate(new Date().toISOString().split('T')[0]);
      setAcademicYear(currentAcademicYear === 'ALL' ? '2025-2026' : currentAcademicYear);
      setPaymentMode('Cash');
      setReferenceNumber('');
      setReceivedBy('ECE Staff Coordinator');
      setRemarks('');
    }
    setError('');
  }, [editingIncome, isOpen, currentAcademicYear]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      setError('Please enter a valid amount greater than ₹0');
      return;
    }

    if (!title.trim()) {
      setError('Please enter a title or purpose for this income');
      return;
    }

    setLoading(true);
    try {
      await onSave({
        title: title.trim(),
        amount: parsedAmount,
        source: source.trim() || 'ECE Department',
        date: date || new Date().toISOString().split('T')[0],
        academicYear,
        paymentMode,
        referenceNumber: referenceNumber.trim(),
        receivedBy: receivedBy.trim() || 'ECE Staff Coordinator',
        remarks: remarks.trim(),
      }, editingIncome?.id);
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to save income record');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-6 animate-fade-in">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/70">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <Coins className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">
                {editingIncome ? 'Edit Department Income' : 'Add Department Income'}
              </h2>
              <p className="text-xs text-slate-500">
                Record general department funds, event income, donations, and other inflows
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[calc(85vh-120px)] overflow-y-auto">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs font-semibold text-red-700">
              {error}
            </div>
          )}

          {/* Title / Purpose */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
              Income Purpose / Title <span className="text-red-600">*</span>
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Symposium Registrations, Association Fees, Alumni Contribution"
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:bg-white transition-all text-slate-900"
            />
          </div>

          {/* Amount & Academic Year */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                Amount (₹) <span className="text-red-600">*</span>
              </label>
              <div className="relative">
                <IndianRupee className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="number"
                  required
                  min="1"
                  step="any"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0.00"
                  className="w-full pl-9 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:bg-white transition-all text-slate-900"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                Academic Year
              </label>
              <select
                value={academicYear}
                onChange={(e) => setAcademicYear(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:bg-white transition-all text-slate-900"
              >
                <option value="2025-2026">AY 2025-2026 (Current)</option>
                <option value="2024-2025">AY 2024-2025</option>
                <option value="2026-2027">AY 2026-2027</option>
              </select>
            </div>
          </div>

          {/* Source & Date */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                Received From / Source
              </label>
              <input
                type="text"
                value={source}
                onChange={(e) => setSource(e.target.value)}
                placeholder="e.g. Participants, Alumni Batch, College Dept"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:bg-white transition-all text-slate-900"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                Date
              </label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:bg-white transition-all text-slate-900"
              />
            </div>
          </div>

          {/* Payment Mode & Reference No */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                Payment Mode
              </label>
              <select
                value={paymentMode}
                onChange={(e) => setPaymentMode(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:bg-white transition-all text-slate-900"
              >
                {PAYMENT_MODES.map((mode) => (
                  <option key={mode} value={mode}>
                    {mode}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                Transaction / Ref / Cheque No
              </label>
              <input
                type="text"
                value={referenceNumber}
                onChange={(e) => setReferenceNumber(e.target.value)}
                placeholder="e.g. UPI-123456 or CHQ-987"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-mono focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:bg-white transition-all text-slate-900"
              />
            </div>
          </div>

          {/* Received By */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
              Received By (Staff / Coordinator)
            </label>
            <input
              type="text"
              value={receivedBy}
              onChange={(e) => setReceivedBy(e.target.value)}
              placeholder="e.g. Dr. Staff Coordinator"
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:bg-white transition-all text-slate-900"
            />
          </div>

          {/* Remarks */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
              Remarks / Description (Optional)
            </label>
            <textarea
              rows="2"
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              placeholder="Additional notes about this collection..."
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:bg-white transition-all text-slate-900 resize-none"
            />
          </div>

          {/* Footer Actions */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-semibold text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 px-5 py-2 text-sm font-semibold text-white bg-emerald-700 hover:bg-emerald-800 rounded-xl shadow-xs transition-all active:scale-95 disabled:opacity-50"
            >
              {loading ? (
                <span>Saving...</span>
              ) : (
                <>
                  {editingIncome ? <Edit2 className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                  <span>{editingIncome ? 'Update Income' : 'Record Income'}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
