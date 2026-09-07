import React, { useState } from 'react';
import { 
  BarChart3, 
  Download, 
  Calendar, 
  Filter, 
  TrendingUp, 
  Landmark, 
  Clock, 
  Ban, 
  CheckCircle2, 
  FileSpreadsheet 
} from 'lucide-react';
import { calculateFinancials, formatCurrency, formatDate } from '../utils/calculations';
import { exportFinesToCSV } from '../utils/csvExport';

export const Reports = ({ fines = [], students = [] }) => {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [yearFilter, setYearFilter] = useState('All');

  const filteredFines = fines.filter((f) => {
    let matchesDate = true;
    const fineDate = (f.createdAt || '').slice(0, 10);

    if (startDate && fineDate < startDate) matchesDate = false;
    if (endDate && fineDate > endDate) matchesDate = false;

    const matchesYear = yearFilter === 'All' || f.year === yearFilter;

    return matchesDate && matchesYear;
  });

  const financials = calculateFinancials(filteredFines);

  // Group by year
  const yearStats = ['2nd', '3rd', '4th'].map((yr) => {
    const list = filteredFines.filter((f) => f.year === yr);
    return {
      year: `${yr} Year ECE`,
      ...calculateFinancials(list),
    };
  });

  // Group by common reasons
  const reasonMap = {};
  filteredFines.forEach((f) => {
    const r = f.reason || 'General';
    if (!reasonMap[r]) {
      reasonMap[r] = { count: 0, amount: 0, paid: 0, unpaid: 0 };
    }
    const amt = Number(f.amount) || 0;
    reasonMap[r].count++;
    reasonMap[r].amount += amt;
    if (f.status === 'Paid') reasonMap[r].paid += amt;
    if (f.status === 'Unpaid') reasonMap[r].unpaid += amt;
  });

  const sortedReasons = Object.entries(reasonMap)
    .map(([reason, stats]) => ({ reason, ...stats }))
    .sort((a, b) => b.amount - a.amount);

  const handleExport = () => {
    exportFinesToCSV(filteredFines, {
      college: 'M.P. Nachimuthu M. Jaganathan Engineering College',
      department: 'Department of Electronics and Communication Engineering (ECE)',
      reportTitle: `Department Fine Audit Report (${startDate || 'Earliest'} to ${endDate || 'Latest'})`,
    });
  };

  return (
    <div className="space-y-5 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700">
            Financial Audit & Analytics
          </span>
          <h2 className="text-lg sm:text-xl font-bold text-slate-900 mt-0.5">
            Department Fine Reports
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Aggregate revenue, audit records, and export CSV files for college financial verification.
          </p>
        </div>

        <button
          onClick={handleExport}
          className="flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-xl shadow-md shadow-emerald-500/20 transition-all self-start sm:self-auto"
        >
          <FileSpreadsheet className="w-4 h-4" />
          <span>Download Audit CSV Report</span>
        </button>
      </div>

      {/* Date Range & Year Filter Toolbar */}
      <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div>
          <label className="block text-[11px] font-semibold text-slate-600 uppercase tracking-wider mb-1">
            Start Date
          </label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:border-blue-600 focus:bg-white"
          />
        </div>

        <div>
          <label className="block text-[11px] font-semibold text-slate-600 uppercase tracking-wider mb-1">
            End Date
          </label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:border-blue-600 focus:bg-white"
          />
        </div>

        <div>
          <label className="block text-[11px] font-semibold text-slate-600 uppercase tracking-wider mb-1">
            ECE Year Filter
          </label>
          <select
            value={yearFilter}
            onChange={(e) => setYearFilter(e.target.value)}
            className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-300 rounded-xl text-slate-800 focus:outline-none focus:border-blue-600 focus:bg-white"
          >
            <option value="All">All Years (2nd, 3rd, 4th)</option>
            <option value="2nd">2nd Year ECE</option>
            <option value="3rd">3rd Year ECE</option>
            <option value="4th">4th Year ECE</option>
          </select>
        </div>
      </div>

      {/* Filtered Summary KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <p className="text-xs text-slate-500 uppercase font-semibold">Total Revenue Recorded</p>
          <p className="text-2xl font-bold font-mono text-slate-900 mt-1">{formatCurrency(financials.totalAmount)}</p>
          <p className="text-[11px] text-slate-500 mt-2">{financials.totalCount} fine tickets</p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-emerald-200 shadow-xs">
          <p className="text-xs text-emerald-700 uppercase font-semibold">Treasury Collected</p>
          <p className="text-2xl font-bold font-mono text-emerald-700 mt-1">{formatCurrency(financials.paidAmount)}</p>
          <p className="text-[11px] text-emerald-600 mt-2">{financials.paidCount} cleared payments</p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-amber-200 shadow-xs">
          <p className="text-xs text-amber-700 uppercase font-semibold">Pending Fine Dues</p>
          <p className="text-2xl font-bold font-mono text-amber-700 mt-1">{formatCurrency(financials.pendingAmount)}</p>
          <p className="text-[11px] text-amber-600 mt-2">{financials.unpaidCount} unpaid tickets</p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-rose-200 shadow-xs">
          <p className="text-xs text-rose-700 uppercase font-semibold">Cancelled / Waived</p>
          <p className="text-2xl font-bold font-mono text-rose-700 mt-1">{formatCurrency(financials.cancelledAmount)}</p>
          <p className="text-[11px] text-rose-600 mt-2">{financials.cancelledCount} waived tickets</p>
        </div>
      </div>

      {/* Year-wise Audit Table */}
      <div className="rounded-2xl bg-white border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-100">
          <h3 className="text-sm font-bold text-slate-900">Year-wise Department Breakdown</h3>
          <p className="text-xs text-slate-500">Financial distribution across 2nd, 3rd, and 4th years</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 font-semibold uppercase tracking-wider border-b border-slate-200">
              <tr>
                <th className="p-3.5">Academic Year</th>
                <th className="p-3.5 text-center">Fines Issued</th>
                <th className="p-3.5 text-right">Total Amount</th>
                <th className="p-3.5 text-right text-emerald-700">Paid (Treasury)</th>
                <th className="p-3.5 text-right text-amber-700">Pending</th>
                <th className="p-3.5 text-right text-rose-700">Cancelled</th>
                <th className="p-3.5 text-center">Collection Rate</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {yearStats.map((stat) => {
                const rate = stat.totalAmount > 0 ? Math.round((stat.paidAmount / stat.totalAmount) * 100) : 0;
                return (
                  <tr key={stat.year} className="hover:bg-slate-50 transition-colors">
                    <td className="p-3.5 font-bold text-slate-900">{stat.year}</td>
                    <td className="p-3.5 text-center font-mono font-medium">{stat.totalCount}</td>
                    <td className="p-3.5 text-right font-mono font-bold text-slate-900">{formatCurrency(stat.totalAmount)}</td>
                    <td className="p-3.5 text-right font-mono font-semibold text-emerald-700">{formatCurrency(stat.paidAmount)}</td>
                    <td className="p-3.5 text-right font-mono font-semibold text-amber-700">{formatCurrency(stat.pendingAmount)}</td>
                    <td className="p-3.5 text-right font-mono font-semibold text-rose-700">{formatCurrency(stat.cancelledAmount)}</td>
                    <td className="p-3.5 text-center">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
                        {rate}%
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Breakdown by Violation Reason */}
      <div className="rounded-2xl bg-white border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-100">
          <h3 className="text-sm font-bold text-slate-900">Top Fine Categories & Violation Reasons</h3>
          <p className="text-xs text-slate-500">Ranking of department disciplinary reasons</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 font-semibold uppercase tracking-wider border-b border-slate-200">
              <tr>
                <th className="p-3.5">Violation Reason</th>
                <th className="p-3.5 text-center">Occurrences</th>
                <th className="p-3.5 text-right">Total Amount</th>
                <th className="p-3.5 text-right text-emerald-700">Paid</th>
                <th className="p-3.5 text-right text-amber-700">Pending</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {sortedReasons.map((item) => (
                <tr key={item.reason} className="hover:bg-slate-50 transition-colors">
                  <td className="p-3.5 font-medium text-slate-900">{item.reason}</td>
                  <td className="p-3.5 text-center font-mono font-semibold">{item.count}</td>
                  <td className="p-3.5 text-right font-mono font-bold text-slate-900">{formatCurrency(item.amount)}</td>
                  <td className="p-3.5 text-right font-mono text-emerald-700 font-medium">{formatCurrency(item.paid)}</td>
                  <td className="p-3.5 text-right font-mono text-amber-700 font-medium">{formatCurrency(item.unpaid)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
