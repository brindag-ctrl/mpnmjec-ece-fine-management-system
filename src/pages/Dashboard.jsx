import React from 'react';
import { 
  IndianRupee, 
  Landmark, 
  Clock, 
  Ban, 
  Users, 
  Plus, 
  CheckCircle, 
  XCircle, 
  FileText, 
  Eye, 
  ArrowRight 
} from 'lucide-react';
import { DashboardCard } from '../components/DashboardCard';
import { calculateFinancials, formatCurrency, formatDate } from '../utils/calculations';

export const Dashboard = ({
  students = [],
  fines = [],
  onOpenAddFine,
  onOpenAddStudent,
  onNavigate,
  onViewStudent,
  onOpenReceipt,
  onStatusChange,
}) => {
  const financials = calculateFinancials(fines);

  // Recent Fines (top 8 latest)
  const recentFines = [...fines].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 8);

  return (
    <div className="space-y-5 pb-10">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-red-700">
            ECE Financial Oversight & Treasury
          </span>
          <h2 className="text-lg sm:text-xl font-bold text-slate-900 mt-0.5">
            Department Fine Management Dashboard
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Real-time financial summaries, student disciplinary fines, and treasury tracking.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={onOpenAddFine}
            className="flex items-center gap-2 px-4 py-2.5 bg-red-700 hover:bg-red-800 text-white text-xs font-semibold rounded-xl shadow-md shadow-red-700/20 transition-all active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>Add Fine Record</span>
          </button>
        </div>
      </div>

      {/* 4 Main Financial KPI Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <DashboardCard
          title="Total Fine Amount"
          amount={financials.totalAmount}
          count={financials.totalCount}
          countLabel="fines total"
          icon={IndianRupee}
          variant="indigo"
          subtitle={`Paid + Unpaid + Cancelled (${financials.totalCount} fines)`}
        />

        <DashboardCard
          title="Treasury / Collected"
          amount={financials.paidAmount}
          count={financials.paidCount}
          countLabel="paid fines"
          icon={Landmark}
          variant="emerald"
          subtitle={`Deposited to Dept Treasury (${financials.paidCount} paid)`}
        />

        <DashboardCard
          title="Pending Fine"
          amount={financials.pendingAmount}
          count={financials.unpaidCount}
          countLabel="unpaid fines"
          icon={Clock}
          variant="amber"
          subtitle={`Awaiting student clearance (${financials.unpaidCount} unpaid)`}
        />

        <DashboardCard
          title="Cancelled Fine"
          amount={financials.cancelledAmount}
          count={financials.cancelledCount}
          countLabel="cancelled fines"
          icon={Ban}
          variant="rose"
          subtitle={`Waived / Approved (${financials.cancelledCount} cancelled)`}
        />
      </div>

      {/* Secondary Quick Counters */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div 
          onClick={() => onNavigate('students')}
          className="p-3.5 rounded-xl bg-white border border-slate-200 hover:border-red-400 hover:shadow-xs cursor-pointer transition-all flex items-center justify-between"
        >
          <div>
            <p className="text-[11px] text-slate-500 font-medium">Total Students</p>
            <p className="text-lg font-bold text-slate-900 font-mono mt-0.5">{students.length}</p>
          </div>
          <Users className="w-5 h-5 text-red-700" />
        </div>

        <div 
          onClick={() => onNavigate('fines')}
          className="p-3.5 rounded-xl bg-white border border-slate-200 hover:border-emerald-400 hover:shadow-xs cursor-pointer transition-all flex items-center justify-between"
        >
          <div>
            <p className="text-[11px] text-emerald-700 font-medium">Paid Fines Count</p>
            <p className="text-lg font-bold text-emerald-700 font-mono mt-0.5">{financials.paidCount}</p>
          </div>
          <CheckCircle className="w-5 h-5 text-emerald-600" />
        </div>

        <div 
          onClick={() => onNavigate('fines')}
          className="p-3.5 rounded-xl bg-white border border-slate-200 hover:border-amber-400 hover:shadow-xs cursor-pointer transition-all flex items-center justify-between"
        >
          <div>
            <p className="text-[11px] text-amber-700 font-medium">Unpaid Fines Count</p>
            <p className="text-lg font-bold text-amber-700 font-mono mt-0.5">{financials.unpaidCount}</p>
          </div>
          <Clock className="w-5 h-5 text-amber-600" />
        </div>

        <div 
          onClick={() => onNavigate('fines')}
          className="p-3.5 rounded-xl bg-white border border-slate-200 hover:border-rose-400 hover:shadow-xs cursor-pointer transition-all flex items-center justify-between"
        >
          <div>
            <p className="text-[11px] text-rose-700 font-medium">Cancelled Fines Count</p>
            <p className="text-lg font-bold text-rose-700 font-mono mt-0.5">{financials.cancelledCount}</p>
          </div>
          <XCircle className="w-5 h-5 text-rose-600" />
        </div>
      </div>

      {/* Recent Fines Table */}
      <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Recent Fine Records</h3>
            <p className="text-xs text-slate-500">Latest disciplinary fines recorded in the department</p>
          </div>
          <button
            onClick={() => onNavigate('fines')}
            className="text-xs font-semibold text-red-700 hover:text-red-800 flex items-center gap-1 group"
          >
            <span>View All Fines</span>
            <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
          </button>
        </div>

        <div className="overflow-x-auto rounded-xl border border-slate-200">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 font-semibold uppercase tracking-wider border-b border-slate-200">
              <tr>
                <th className="p-3.5">Student</th>
                <th className="p-3.5">Register No</th>
                <th className="p-3.5">Year</th>
                <th className="p-3.5">Reason</th>
                <th className="p-3.5 text-right">Fine Amount</th>
                <th className="p-3.5 text-center">Status</th>
                <th className="p-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {recentFines.length === 0 ? (
                <tr>
                  <td colSpan="7" className="p-8 text-center text-slate-400">
                    No fines recorded yet. Click "+ Add Fine Record" to issue the first fine.
                  </td>
                </tr>
              ) : (
                recentFines.map((fine) => (
                  <tr key={fine.id} className="hover:bg-slate-50 transition-colors">
                    <td className="p-3.5 font-medium text-slate-900">
                      <button
                        onClick={() => onViewStudent(fine.studentId)}
                        className="hover:text-red-700 hover:underline text-left font-bold"
                      >
                        {fine.studentName}
                      </button>
                    </td>
                    <td className="p-3.5 font-mono text-red-700 font-semibold">
                      {fine.registerNumber}
                    </td>
                    <td className="p-3.5">
                      <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-slate-100 border border-slate-200 text-slate-700">
                        {fine.year} Year
                      </span>
                    </td>
                    <td className="p-3.5 max-w-xs truncate text-slate-600" title={fine.reason}>
                      {fine.reason}
                    </td>
                    <td className="p-3.5 text-right font-mono font-bold text-slate-900">
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
                    <td className="p-3.5 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {fine.status === 'Unpaid' && (
                          <button
                            onClick={() => onStatusChange(fine.id, 'Paid')}
                            title="Mark as Paid"
                            className="px-2.5 py-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 rounded-lg transition-colors"
                          >
                            Mark Paid
                          </button>
                        )}
                        {fine.status === 'Paid' && (
                          <button
                            onClick={() => onOpenReceipt(fine)}
                            title="Print Department Receipt"
                            className="p-1.5 text-slate-500 hover:text-red-700 rounded-lg hover:bg-slate-100 transition-colors"
                          >
                            <FileText className="w-4 h-4" />
                          </button>
                        )}
                        <button
                          onClick={() => onViewStudent(fine.studentId)}
                          title="View Student History"
                          className="p-1.5 text-slate-500 hover:text-red-700 rounded-lg hover:bg-slate-100 transition-colors"
                        >
                          <Eye className="w-4 h-4" />
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
