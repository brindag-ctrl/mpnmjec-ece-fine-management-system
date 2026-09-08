import React, { useState } from 'react';
import { 
  TrendingDown, 
  Plus, 
  Trash2, 
  Search, 
  IndianRupee, 
  Wallet,
  ShoppingBag,
  CheckCircle2
} from 'lucide-react';
import { formatCurrency, formatDate } from '../utils/calculations';

export const Spendings = ({ 
  spendings = [], 
  onAddSpending, 
  onDeleteSpending, 
  totalPaidFines = 0 
}) => {
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showSuccessToast, setShowSuccessToast] = useState(false);

  const totalSpent = spendings.reduce((sum, item) => sum + (parseFloat(item.amount) || 0), 0);
  const netTreasury = totalPaidFines - totalSpent;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !amount || parseFloat(amount) <= 0) return;

    setIsSubmitting(true);
    try {
      await onAddSpending({
        title: title.trim(),
        amount: parseFloat(amount),
        date: date || new Date().toISOString().split('T')[0],
      });
      // Reset form
      setTitle('');
      setAmount('');
      setShowSuccessToast(true);
      setTimeout(() => setShowSuccessToast(false), 3000);
    } catch (err) {
      console.error('Failed to add spending:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredSpendings = spendings.filter((item) => {
    const term = searchTerm.toLowerCase();
    return (
      (item.title && item.title.toLowerCase().includes(term))
    );
  });

  return (
    <div className="space-y-6 pb-12">
      {/* Top 3 Simple Financial Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Treasury Available Balance */}
        <div className="p-5 rounded-2xl bg-white border border-amber-200/80 hover:border-amber-400 shadow-xs flex flex-col justify-between transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Cash in Hand (Treasury)
            </span>
            <div className="p-3 rounded-2xl bg-amber-50 text-amber-700 border border-amber-200 shadow-2xs">
              <Wallet className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl sm:text-3xl font-semibold font-mono text-slate-900">
              {formatCurrency(netTreasury)}
            </div>
            <div className="text-xs text-slate-400 font-medium mt-1">
              {netTreasury >= 0 ? 'Net Available Balance' : 'Treasury Deficit'}
            </div>
          </div>
        </div>

        {/* Total Collected (Inflow) */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Total Fines Collected
            </span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <IndianRupee className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl sm:text-3xl font-semibold text-slate-900 font-mono">
              {formatCurrency(totalPaidFines)}
            </div>
            <div className="text-xs text-emerald-600 font-medium mt-1">
              Collected from paid fines
            </div>
          </div>
        </div>

        {/* Total Spendings (Outflow) */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Total Spendings
            </span>
            <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center">
              <TrendingDown className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl sm:text-3xl font-semibold text-rose-600 font-mono">
              {formatCurrency(totalSpent)}
            </div>
            <div className="text-xs text-slate-400 font-medium mt-1">
              {spendings.length} spendings recorded
            </div>
          </div>
        </div>
      </div>

      {/* Main Section: 2-Column Responsive Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Side: Simple Add Spending Form */}
        <div className="lg:col-span-5 bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-xs h-fit">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-red-50 text-red-700 flex items-center justify-center font-semibold">
                <Plus className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-slate-900">Add Spending</h3>
                <p className="text-[11px] text-slate-500">Record a department expense</p>
              </div>
            </div>

            {showSuccessToast && (
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-1 rounded-md border border-emerald-200 animate-fade-in">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Saved!
              </span>
            )}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* 1. Item / Reason */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Item / Reason <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Projector Cable, Chalk, Lab Items"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-red-600/20 focus:border-red-600 transition-all font-medium text-slate-900"
              />
            </div>

            {/* 2. Amount & Date in 2 columns */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Amount (₹) <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-semibold text-xs">₹</span>
                  <input
                    type="number"
                    required
                    min="1"
                    step="any"
                    placeholder="0"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full pl-7 pr-3 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-red-600/20 focus:border-red-600 transition-all font-mono font-semibold text-slate-900"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">Date</label>
                <input
                  type="date"
                  required
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full px-3 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-red-600/20 focus:border-red-600 transition-all font-medium text-slate-700"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-2.5 px-4 bg-red-700 hover:bg-red-800 text-white text-xs font-semibold rounded-xl shadow-md shadow-red-700/20 transition-all active:scale-98 disabled:opacity-50 mt-2 flex items-center justify-center gap-2"
            >
              <Plus className="w-4 h-4" />
              <span>{isSubmitting ? 'Saving...' : 'Add Spending'}</span>
            </button>
          </form>
        </div>

        {/* Right Side: Spendings History Table */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 shadow-xs flex flex-col">
          <div className="p-4 sm:p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-sm font-semibold text-slate-900">Spending History</h3>
              <p className="text-[11px] text-slate-500">Live records from cloud database</p>
            </div>

            <div className="relative w-full sm:w-56">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search spendings..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-red-600/20 focus:border-red-600 transition-all"
              />
            </div>
          </div>

          <div className="flex-1 overflow-x-auto">
            {filteredSpendings.length === 0 ? (
              <div className="p-12 text-center text-slate-400 flex flex-col items-center justify-center gap-2">
                <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400">
                  <ShoppingBag className="w-6 h-6 stroke-[1.5]" />
                </div>
                <p className="text-xs font-semibold text-slate-700">No spendings recorded yet</p>
                <p className="text-[11px] text-slate-400">
                  Use the simple form on the left to add a spending.
                </p>
              </div>
            ) : (
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50/75 border-b border-slate-100 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                    <th className="py-3 px-4">Date</th>
                    <th className="py-3 px-4">Item / Reason</th>
                    <th className="py-3 px-4 text-right">Amount</th>
                    <th className="py-3 px-4 text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {filteredSpendings.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="py-3 px-4 font-mono text-[11px] text-slate-500 whitespace-nowrap">
                        {item.date ? formatDate(item.date) : formatDate(item.createdAt)}
                      </td>
                      <td className="py-3 px-4 font-semibold text-slate-900">
                        {item.title}
                      </td>
                      <td className="py-3 px-4 text-right font-mono font-semibold text-rose-600 whitespace-nowrap text-sm">
                        {formatCurrency(item.amount)}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <button
                          onClick={() => onDeleteSpending(item)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                          title="Delete record"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
