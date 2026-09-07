import React, { useState } from 'react';
import { 
  Plus, 
  Search, 
  Filter, 
  Download, 
  Calendar, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Edit2, 
  Trash2, 
  FileText, 
  Eye, 
  Ban,
  Receipt,
  RotateCcw
} from 'lucide-react';
import { formatCurrency, formatDate } from '../utils/calculations';
import { exportFinesToCSV } from '../utils/csvExport';

export const Fines = ({
  fines = [],
  students = [],
  onOpenAddFine,
  onEditFine,
  onDeleteFine,
  onStatusChange,
  onViewStudentHistory,
  onOpenReceipt,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [yearFilter, setYearFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [dateFilter, setDateFilter] = useState('');

  const filteredFines = fines.filter((f) => {
    const matchesSearch =
      f.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      f.registerNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      f.reason.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (f.id && f.id.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesYear = yearFilter === 'All' || f.year === yearFilter;
    const matchesStatus = statusFilter === 'All' || f.status === statusFilter;

    let matchesDate = true;
    if (dateFilter) {
      const fineDateStr = (f.createdAt || '').slice(0, 10);
      matchesDate = fineDateStr === dateFilter;
    }

    return matchesSearch && matchesYear && matchesStatus && matchesDate;
  });

  const handleExportCSV = () => {
    exportFinesToCSV(filteredFines, {
      college: 'M.P. Nachimuthu M. Jaganathan Engineering College',
      department: 'Department of Electronics and Communication Engineering (ECE)',
      reportTitle: `Department Fine Roster (${statusFilter === 'All' ? 'All Statuses' : statusFilter})`,
    });
  };

  const handleResetFilters = () => {
    setSearchTerm('');
    setYearFilter('All');
    setStatusFilter('All');
    setDateFilter('');
  };

  return (
    <div className="space-y-5 pb-12">
      {/* Top Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-blue-700">
            Disciplinary Ledger
          </span>
          <h2 className="text-lg sm:text-xl font-bold text-slate-900 mt-0.5">
            Fine Management System
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Search, filter, track status, and collect student department fines.
          </p>
        </div>

        <div className="flex items-center gap-2.5 self-start sm:self-auto">
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 hover:text-slate-900 rounded-xl border border-slate-300 transition-all shadow-xs"
          >
            <Download className="w-3.5 h-3.5 text-blue-600" />
            <span>Export CSV</span>
          </button>

          {/* Prominent + Add Fine Button */}
          <button
            onClick={onOpenAddFine}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-md shadow-blue-500/20 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Add Fine</span>
          </button>
        </div>
      </div>

      {/* Search and Dynamic Filter Controls */}
      <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Search input */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder="Search student, reg no, reason..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-3.5 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-300 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-600 focus:bg-white"
            />
          </div>

          {/* Year Filter */}
          <div className="flex items-center gap-2">
            <select
              value={yearFilter}
              onChange={(e) => setYearFilter(e.target.value)}
              className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-300 rounded-xl text-slate-800 focus:outline-none focus:border-blue-600 focus:bg-white"
            >
              <option value="All">Year: All (2nd, 3rd, 4th)</option>
              <option value="2nd">2nd Year ECE</option>
              <option value="3rd">3rd Year ECE</option>
              <option value="4th">4th Year ECE</option>
            </select>
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-2">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-300 rounded-xl text-slate-800 focus:outline-none focus:border-blue-600 focus:bg-white"
            >
              <option value="All">Status: All Statuses</option>
              <option value="Paid">Paid (Treasury)</option>
              <option value="Unpaid">Unpaid (Pending)</option>
              <option value="Cancelled">Cancelled (Waived)</option>
            </select>
          </div>

          {/* Date Filter */}
          <div className="flex items-center gap-2">
            <input
              type="date"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-300 rounded-xl text-slate-800 focus:outline-none focus:border-blue-600 focus:bg-white"
            />
          </div>
        </div>

        {/* Filter metadata & reset */}
        {(searchTerm || yearFilter !== 'All' || statusFilter !== 'All' || dateFilter) && (
          <div className="flex items-center justify-between pt-2 text-xs text-slate-500 border-t border-slate-100">
            <span>Filtered results active</span>
            <button
              onClick={handleResetFilters}
              className="inline-flex items-center gap-1 text-blue-700 hover:text-blue-800 font-semibold"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset Filters</span>
            </button>
          </div>
        )}
      </div>

      {/* Main Fine Records Table */}
      <div className="rounded-2xl bg-white border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between text-xs">
          <span className="text-slate-500">
            Displaying <strong className="text-slate-900">{filteredFines.length}</strong> of{' '}
            <strong className="text-slate-700">{fines.length}</strong> recorded department fines
          </span>
          <span className="text-blue-700 font-bold bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
            Department: ECE
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 font-semibold uppercase tracking-wider border-b border-slate-200">
              <tr>
                <th className="p-3.5 w-12 text-center">S.No</th>
                <th className="p-3.5">Student Name</th>
                <th className="p-3.5">Register No</th>
                <th className="p-3.5">Year</th>
                <th className="p-3.5">Department</th>
                <th className="p-3.5">Fine Reason</th>
                <th className="p-3.5 text-right">Amount</th>
                <th className="p-3.5 text-center">Status</th>
                <th className="p-3.5">Issued Date</th>
                <th className="p-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredFines.length === 0 ? (
                <tr>
                  <td colSpan="10" className="p-8 text-center text-slate-400">
                    <Receipt className="w-8 h-8 mx-auto text-slate-300 mb-2" />
                    <p className="text-slate-600 font-medium">No fine records match your search criteria.</p>
                  </td>
                </tr>
              ) : (
                filteredFines.map((fine, index) => (
                  <tr key={fine.id} className="hover:bg-slate-50 transition-colors">
                    <td className="p-3.5 text-center font-mono text-slate-400">
                      {index + 1}
                    </td>
                    <td className="p-3.5 font-medium text-slate-900">
                      <button
                        onClick={() => onViewStudentHistory(fine.studentId)}
                        className="hover:text-blue-600 hover:underline font-bold text-left"
                      >
                        {fine.studentName}
                      </button>
                    </td>
                    <td className="p-3.5 font-mono text-blue-700 font-semibold">
                      {fine.registerNumber}
                    </td>
                    <td className="p-3.5">
                      <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-slate-100 border border-slate-200 text-slate-700">
                        {fine.year} Year
                      </span>
                    </td>
                    <td className="p-3.5 font-bold text-blue-700">
                      ECE
                    </td>
                    <td className="p-3.5 max-w-xs truncate text-slate-600" title={fine.reason}>
                      {fine.reason}
                    </td>
                    <td className="p-3.5 text-right font-mono font-bold text-slate-900 text-sm">
                      {formatCurrency(fine.amount)}
                    </td>
                    <td className="p-3.5 text-center">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${
                          fine.status === 'Paid'
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : fine.status === 'Unpaid'
                            ? 'bg-amber-50 text-amber-700 border-amber-200'
                            : 'bg-rose-50 text-rose-700 border-rose-200'
                        }`}
                      >
                        {fine.status}
                      </span>
                    </td>
                    <td className="p-3.5 text-slate-500 whitespace-nowrap">
                      {formatDate(fine.createdAt)}
                    </td>
                    <td className="p-3.5 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {/* Status Toggle buttons */}
                        {fine.status === 'Unpaid' && (
                          <button
                            onClick={() => onStatusChange(fine.id, 'Paid')}
                            title="Mark as Paid"
                            className="px-2.5 py-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 rounded-lg transition-colors"
                          >
                            Pay
                          </button>
                        )}
                        {fine.status === 'Paid' && (
                          <button
                            onClick={() => onOpenReceipt(fine)}
                            title="Print Official Receipt"
                            className="p-1.5 text-slate-500 hover:text-blue-600 rounded-lg hover:bg-slate-100 transition-colors"
                          >
                            <FileText className="w-4 h-4" />
                          </button>
                        )}
                        {fine.status !== 'Cancelled' && (
                          <button
                            onClick={() => onStatusChange(fine.id, 'Cancelled')}
                            title="Cancel / Waive Fine"
                            className="p-1.5 text-slate-500 hover:text-amber-600 rounded-lg hover:bg-slate-100 transition-colors"
                          >
                            <Ban className="w-4 h-4" />
                          </button>
                        )}

                        {/* View Student Profile */}
                        <button
                          onClick={() => onViewStudentHistory(fine.studentId)}
                          title="View Student Fine Profile"
                          className="p-1.5 text-slate-500 hover:text-blue-600 rounded-lg hover:bg-slate-100 transition-colors"
                        >
                          <Eye className="w-4 h-4" />
                        </button>

                        {/* Edit Fine */}
                        <button
                          onClick={() => onEditFine(fine)}
                          title="Edit Fine Details"
                          className="p-1.5 text-slate-500 hover:text-indigo-600 rounded-lg hover:bg-slate-100 transition-colors"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>

                        {/* Delete Fine */}
                        <button
                          onClick={() => onDeleteFine(fine)}
                          title="Delete Fine Record"
                          className="p-1.5 text-slate-500 hover:text-rose-600 rounded-lg hover:bg-slate-100 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
