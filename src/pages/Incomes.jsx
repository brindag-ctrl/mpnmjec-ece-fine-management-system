import React, { useState } from 'react';
import { 
  Coins, 
  Plus, 
  Search, 
  Calendar, 
  Trash2, 
  Edit2, 
  Printer, 
  Landmark, 
  Download,
  CreditCard,
  Receipt
} from 'lucide-react';
import { formatCurrency, formatDate, calculateIncomeFinancials } from '../utils/calculations';

export const Incomes = ({
  incomes = [],
  fines = [],
  spendings = [],
  selectedAcademicYear = '2025-2026',
  onSelectAcademicYear,
  onOpenAddIncome,
  onEditIncome,
  onDeleteIncome,
  onOpenReceipt,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPaymentMode, setSelectedPaymentMode] = useState('ALL');

  // Filter incomes by Academic Year
  const yearFilteredIncomes = incomes.filter((item) => {
    if (selectedAcademicYear === 'ALL') return true;
    return item.academicYear === selectedAcademicYear;
  });

  // Calculate stats for current filter
  const stats = calculateIncomeFinancials(yearFilteredIncomes);

  // Calculate payment mode breakdowns for department incomes
  const cashIncomes = yearFilteredIncomes
    .filter((item) => (item.paymentMode || 'Cash') === 'Cash')
    .reduce((sum, item) => sum + (Number(item.amount) || 0), 0);

  const digitalIncomes = yearFilteredIncomes
    .filter((item) => (item.paymentMode || 'Cash') !== 'Cash')
    .reduce((sum, item) => sum + (Number(item.amount) || 0), 0);

  // Search and Payment Mode filtering
  const displayedIncomes = yearFilteredIncomes.filter((item) => {
    const matchesSearch = 
      (item.title && item.title.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (item.source && item.source.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (item.referenceNumber && item.referenceNumber.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (item.receivedBy && item.receivedBy.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesPaymentMode = selectedPaymentMode === 'ALL' || item.paymentMode === selectedPaymentMode;

    return matchesSearch && matchesPaymentMode;
  });

  // Export CSV
  const handleExportCSV = () => {
    const headers = ['Voucher / Ref No', 'Date', 'Title', 'Source', 'Payment Mode', 'Amount', 'Received By', 'Academic Year', 'Remarks'];
    const rows = displayedIncomes.map((i) => [
      `"${i.referenceNumber || i.id || ''}"`,
      `"${i.date || ''}"`,
      `"${i.title || ''}"`,
      `"${i.source || ''}"`,
      `"${i.paymentMode || ''}"`,
      i.amount || 0,
      `"${i.receivedBy || ''}"`,
      `"${i.academicYear || ''}"`,
      `"${i.remarks || ''}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `ECE_Department_Incomes_${selectedAcademicYear}_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 pb-12 animate-fade-in">
      {/* Top Header & Quick Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              Department Treasury Inflow
            </span>
            <span className="text-xs text-slate-400">•</span>
            <span className="text-xs font-medium text-slate-500">
              AY {selectedAcademicYear}
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight mt-1">
            Department Incomes
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage department revenue, association subscriptions, symposiums, and sponsorships
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handleExportCSV}
            disabled={displayedIncomes.length === 0}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors shadow-2xs disabled:opacity-50"
          >
            <Download className="w-4 h-4 text-slate-500" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={onOpenAddIncome}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-800 rounded-xl shadow-md shadow-emerald-700/20 transition-all active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>Add Department Income</span>
          </button>
        </div>
      </div>

      {/* KPI Cards Grid (Focused Purely on Department Incomes) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* 1. Total Department Incomes */}
        <div className="p-5 rounded-2xl bg-white border border-emerald-200 shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Total Department Incomes
            </span>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <Coins className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl sm:text-3xl font-bold font-mono text-emerald-800">
              {formatCurrency(stats.totalAmount)}
            </div>
            <div className="flex items-center gap-1 text-xs text-slate-400 font-medium mt-1">
              <span>{stats.totalCount} income records logged</span>
            </div>
          </div>
        </div>

        {/* 2. Cash Collections */}
        <div className="p-5 rounded-2xl bg-white border border-blue-200 shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Cash Collections
            </span>
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center">
              <Landmark className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl sm:text-3xl font-bold font-mono text-blue-800">
              {formatCurrency(cashIncomes)}
            </div>
            <div className="text-xs text-slate-400 font-medium mt-1">
              Collected via direct cash
            </div>
          </div>
        </div>

        {/* 3. Digital / UPI Collections */}
        <div className="p-5 rounded-2xl bg-white border border-amber-200 shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              UPI & Online Inflow
            </span>
            <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center">
              <CreditCard className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl sm:text-3xl font-bold font-mono text-amber-800">
              {formatCurrency(digitalIncomes)}
            </div>
            <div className="text-xs text-slate-400 font-medium mt-1">
              UPI, Bank Transfers & Cheques
            </div>
          </div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-2xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder="Search by title, source, voucher ID, or staff coordinator..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:bg-white text-slate-900 transition-all"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {/* Payment Mode Selector */}
            <select
              value={selectedPaymentMode}
              onChange={(e) => setSelectedPaymentMode(e.target.value)}
              className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:bg-white"
            >
              <option value="ALL">All Payment Modes</option>
              <option value="Cash">Cash</option>
              <option value="UPI / Online">UPI / Online</option>
              <option value="Bank Transfer">Bank Transfer</option>
              <option value="Cheque">Cheque</option>
            </select>

            {/* Academic Year Selector */}
            <div className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-slate-400 shrink-0" />
              <select
                value={selectedAcademicYear}
                onChange={(e) => onSelectAcademicYear(e.target.value)}
                className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:bg-white"
              >
                <option value="2025-2026">AY 2025-2026</option>
                <option value="2024-2025">AY 2024-2025</option>
                <option value="2026-2027">AY 2026-2027</option>
                <option value="ALL">All Academic Years</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Incomes Table / List */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
          <h2 className="text-sm font-bold text-slate-900">
            Department Income Transactions ({displayedIncomes.length})
          </h2>
        </div>

        {displayedIncomes.length === 0 ? (
          <div className="py-12 px-4 text-center">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center mx-auto mb-3">
              <Coins className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-bold text-slate-900">No Department Income Records Found</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
              No revenue records match the current filters. Click below to add an income entry.
            </p>
            <button
              onClick={onOpenAddIncome}
              className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-800 rounded-xl shadow-xs transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Record First Income</span>
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs sm:text-sm">
              <thead>
                <tr className="bg-slate-50/75 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[11px]">
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Income Title / Purpose</th>
                  <th className="py-3 px-4">Source / Received From</th>
                  <th className="py-3 px-4">Payment Mode</th>
                  <th className="py-3 px-4">Received By</th>
                  <th className="py-3 px-4 text-right">Amount</th>
                  <th className="py-3 px-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {displayedIncomes.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4 whitespace-nowrap text-slate-600 font-medium">
                      {formatDate(item.date || item.createdAt)}
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-900">{item.title}</div>
                      {item.remarks && (
                        <div className="text-[11px] text-slate-400 mt-0.5 truncate max-w-xs italic">
                          {item.remarks}
                        </div>
                      )}
                    </td>

                    <td className="py-3.5 px-4 text-slate-700 font-medium">
                      {item.source || 'ECE Dept'}
                    </td>

                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <div className="flex items-center gap-1.5">
                        <CreditCard className="w-3.5 h-3.5 text-slate-400" />
                        <span className="font-semibold text-slate-800">{item.paymentMode || 'Cash'}</span>
                      </div>
                      {item.referenceNumber && (
                        <span className="text-[10px] font-mono text-slate-400 block mt-0.5">
                          {item.referenceNumber}
                        </span>
                      )}
                    </td>

                    <td className="py-3.5 px-4 text-slate-700 font-medium">
                      {item.receivedBy || 'Staff Coordinator'}
                    </td>

                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      <span className="font-bold font-mono text-emerald-700 text-sm sm:text-base">
                        +{formatCurrency(item.amount)}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-center whitespace-nowrap">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          onClick={() => onOpenReceipt(item)}
                          title="Generate Voucher / Receipt"
                          className="p-1.5 text-slate-500 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                        >
                          <Printer className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => onEditIncome(item)}
                          title="Edit Income"
                          className="p-1.5 text-slate-500 hover:text-amber-700 hover:bg-amber-50 rounded-lg transition-colors cursor-pointer"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => onDeleteIncome(item)}
                          title="Delete Income"
                          className="p-1.5 text-slate-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
