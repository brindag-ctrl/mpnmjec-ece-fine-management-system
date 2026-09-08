import React, { useState } from 'react';
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
  ArrowRight,
  TrendingDown,
  Wallet,
  Coins,
  ShieldAlert,
  Search,
  Filter,
  Calendar,
  Lock,
  Sparkles,
  Archive
} from 'lucide-react';
import { DashboardCard } from '../components/DashboardCard';
import { calculateFinancials, formatCurrency, formatDate } from '../utils/calculations';

export const Dashboard = ({
  students = [],
  fines = [],
  spendings = [],
  academicYears = [],
  selectedAcademicYear = '2025-2026',
  onSelectAcademicYear,
  onOpenAddFine,
  onOpenAddStudent,
  onNavigate,
  onViewStudent,
  onOpenReceipt,
  onStatusChange,
}) => {
  const [filterYear, setFilterYear] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const liveFinancials = calculateFinancials(fines);
  const totalSpent = spendings.reduce((sum, item) => sum + (parseFloat(item.amount) || 0), 0);

  // Consolidated AY 2024-2025 Historical Data (With YASMINE S ₹100 pending)
  const AY_2024_2025_DATA = {
    totalAmount: 33250,
    paidAmount: 33150,
    pendingAmount: 100,
    cancelledAmount: 0,
    totalCount: 450,
    paidCount: 449,
    unpaidCount: 1, // 1 pending fine: YASMINE S
    cancelledCount: 0,
    totalSpent: 0,
    netTreasury: 33150,
  };

  // Year-by-Year Cumulative Rollover Balance
  const AY_2024_2025_CLOSING_TREASURY = 33150;
  const AY_2025_2026_CUMULATIVE_TREASURY = AY_2024_2025_CLOSING_TREASURY + liveFinancials.paidAmount - totalSpent;

  // Calculate dynamic financials according to selected Academic Year
  let displayFinancials = {
    ...liveFinancials,
    totalSpent,
    netTreasury: AY_2025_2026_CUMULATIVE_TREASURY, // Cash in hand rolled over from AY 2024-2025
    treasurySubtitle: `Incl. ${formatCurrency(AY_2024_2025_CLOSING_TREASURY)} Rollover`,
  };

  if (selectedAcademicYear === '2024-2025') {
    displayFinancials = {
      ...AY_2024_2025_DATA,
      treasurySubtitle: 'AY 24-25 Treasury',
    };
  } else if (selectedAcademicYear === 'ALL') {
    displayFinancials = {
      totalAmount: liveFinancials.totalAmount + AY_2024_2025_DATA.totalAmount,
      paidAmount: liveFinancials.paidAmount + AY_2024_2025_DATA.paidAmount,
      pendingAmount: liveFinancials.pendingAmount + AY_2024_2025_DATA.pendingAmount,
      cancelledAmount: liveFinancials.cancelledAmount + AY_2024_2025_DATA.cancelledAmount,
      totalCount: liveFinancials.totalCount + AY_2024_2025_DATA.totalCount,
      paidCount: liveFinancials.paidCount + AY_2024_2025_DATA.paidCount,
      unpaidCount: liveFinancials.unpaidCount + AY_2024_2025_DATA.unpaidCount,
      cancelledCount: liveFinancials.cancelledCount + AY_2024_2025_DATA.cancelledCount,
      totalSpent,
      netTreasury: AY_2025_2026_CUMULATIVE_TREASURY,
      treasurySubtitle: 'All-Time In Hand',
    };
  } else if (selectedAcademicYear === '2026-2027') {
    displayFinancials = {
      totalAmount: 0,
      paidAmount: 0,
      pendingAmount: 0,
      cancelledAmount: 0,
      totalCount: 0,
      paidCount: 0,
      unpaidCount: 0,
      cancelledCount: 0,
      totalSpent: 0,
      netTreasury: AY_2025_2026_CUMULATIVE_TREASURY, // Opening balance rolled over from AY 2025-2026
      treasurySubtitle: `Opening Rollover: ${formatCurrency(AY_2025_2026_CUMULATIVE_TREASURY)}`,
    };
  }

  const isClosedArchive = selectedAcademicYear === '2024-2025';

  // Filter recent fines according to Academic Year
  const filteredFines = fines.filter((f) => {
    // Academic Year filter
    if (selectedAcademicYear === '2024-2025') {
      if (f.academicYear !== '2024-2025' && f.id !== 'fine_ay2024_2025_yasmine_pending') return false;
    } else if (selectedAcademicYear === '2025-2026') {
      if (f.academicYear === '2024-2025' || f.id === 'fine_ay2024_2025_yasmine_pending') return false;
    } else if (selectedAcademicYear === '2026-2027') {
      if (f.academicYear !== '2026-2027') return false;
    }

    const matchesYear = filterYear === 'ALL' || String(f.year) === String(filterYear);
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch = !q || 
      (f.studentName && f.studentName.toLowerCase().includes(q)) ||
      (f.registerNumber && f.registerNumber.toLowerCase().includes(q)) ||
      (f.reason && f.reason.toLowerCase().includes(q));
    return matchesYear && matchesSearch;
  });

  // Recent Fines (top 10 latest)
  const recentFines = [...filteredFines]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 10);

  return (
    <div className="space-y-6 pb-12">
      {/* Academic Year Ribbon / Switcher */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 sm:p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center font-bold">
            <Calendar className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Academic Year Filter</span>
            <div className="flex items-center gap-2">
              <h2 className="text-sm sm:text-base font-bold text-slate-900">
                {selectedAcademicYear === 'ALL' ? 'All-Time Grand Treasury' : `Academic Year ${selectedAcademicYear}`}
              </h2>
              {selectedAcademicYear === '2024-2025' && (
                <span className="inline-flex items-center gap-1 text-[10px] font-bold text-purple-800 bg-purple-50 px-2 py-0.5 rounded-full border border-purple-300">
                  <Lock className="w-3 h-3" /> Closed & Audited
                </span>
              )}
              {selectedAcademicYear === '2025-2026' && (
                <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-300">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span> Active Session
                </span>
              )}
              {selectedAcademicYear === '2026-2027' && (
                <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-300">
                  <Sparkles className="w-3 h-3" /> Starts in ~3 Months
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Year Pills */}
        <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl text-xs font-semibold">
          {[
            { id: 'ALL', label: 'All Years' },
            { id: '2024-2025', label: '2024 - 2025 (Closed)' },
            { id: '2025-2026', label: '2025 - 2026 (Active)' },
            { id: '2026-2027', label: '2026 - 2027 (Upcoming)' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => onSelectAcademicYear && onSelectAcademicYear(item.id)}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                selectedAcademicYear === item.id
                  ? 'bg-white text-slate-900 shadow-xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* Special Notice for Closed AY 2024-2025 Archive */}
      {selectedAcademicYear === '2024-2025' && (
        <div className="p-4 rounded-2xl bg-purple-50/70 border border-purple-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center shrink-0">
              <Archive className="w-5 h-5" />
            </div>
            <div>
              <p className="font-bold text-purple-950 text-sm">Official Consolidated Ledger for AY 2024-2025</p>
              <p className="text-purple-700">
                Total Fine: <strong className="font-mono">₹33,250</strong> | Total Collected: <strong className="font-mono">₹33,150</strong> | Pending: <strong className="font-mono">₹100</strong>
              </p>
            </div>
          </div>
          <span className="text-[11px] font-bold text-purple-800 bg-white px-3 py-1.5 rounded-xl border border-purple-200 shadow-2xs self-start sm:self-auto">
            Audited & Closed
          </span>
        </div>
      )}

      {/* Special Notice for Upcoming AY 2026-2027 */}
      {selectedAcademicYear === '2026-2027' && (
        <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <p className="font-bold text-amber-950 text-sm">Academic Year 2026-2027 (Starting in ~3 months)</p>
              <p className="text-amber-700">
                Opening Balance Rollover from 2025-2026: <strong className="font-mono">{formatCurrency(liveFinancials.paidAmount - totalSpent)}</strong>
              </p>
            </div>
          </div>
          <span className="text-[11px] font-bold text-amber-800 bg-white px-3 py-1.5 rounded-xl border border-amber-200 shadow-2xs self-start sm:self-auto">
            Ready for Session Open
          </span>
        </div>
      )}

      {/* ALL Financial Status Cards (6 Cleanly Aligned Cards) */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3.5">
        {/* 1. Cash in Hand / Treasury */}
        <DashboardCard
          title="Cash in Hand"
          amount={displayFinancials.netTreasury}
          icon={Wallet}
          variant="treasury"
          subtitle={displayFinancials.treasurySubtitle || "Net Treasury"}
          badgeText="In Hand"
          onClick={() => onNavigate('spendings')}
        />

        {/* 2. Total Fine Amount */}
        <DashboardCard
          title="Total Fine"
          amount={displayFinancials.totalAmount}
          count={displayFinancials.totalCount}
          countLabel="fines"
          icon={IndianRupee}
          variant="indigo"
          subtitle={`${displayFinancials.totalCount} ${isClosedArchive ? 'entries' : 'recorded'}`}
          badgeText="Recorded"
          onClick={() => onNavigate('fines')}
        />

        {/* 3. Treasury / Collected */}
        <DashboardCard
          title="Collected Fine"
          amount={displayFinancials.paidAmount}
          count={displayFinancials.paidCount}
          countLabel="paid"
          icon={Landmark}
          variant="emerald"
          subtitle={`${displayFinancials.paidCount} cleared`}
          badgeText="Collected"
          onClick={() => onNavigate('fines')}
        />

        {/* 4. Department Spendings */}
        <DashboardCard
          title="Dept Spendings"
          amount={displayFinancials.totalSpent}
          count={spendings.length}
          countLabel="spendings"
          icon={TrendingDown}
          variant="rose"
          subtitle={`${isClosedArchive ? '0' : spendings.length} entries`}
          badgeText="Spent"
          onClick={() => onNavigate('spendings')}
        />

        {/* 5. Pending Fines */}
        <DashboardCard
          title="Pending Fine"
          amount={displayFinancials.pendingAmount}
          count={displayFinancials.unpaidCount}
          countLabel="unpaid"
          icon={Clock}
          variant="amber"
          subtitle={`${displayFinancials.unpaidCount} unpaid`}
          badgeText="Pending"
          onClick={() => onNavigate('fines')}
        />

        {/* 6. Cancelled Fine */}
        <DashboardCard
          title="Cancelled Fine"
          amount={displayFinancials.cancelledAmount}
          count={displayFinancials.cancelledCount}
          countLabel="cancelled"
          icon={Ban}
          variant="slate"
          subtitle={`${displayFinancials.cancelledCount} waived`}
          badgeText="Waived"
          onClick={() => onNavigate('fines')}
        />
      </div>

      {/* Secondary Quick Counters Ribbon (All 4 Included) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div 
          onClick={() => onNavigate('students')}
          className="p-4 rounded-xl bg-white border border-slate-200 hover:border-red-400 hover:shadow-xs cursor-pointer transition-all flex items-center justify-between"
        >
          <div>
            <p className="text-xs text-slate-500 font-medium">Total Students</p>
            <p className="text-xl font-semibold text-slate-900 font-mono mt-0.5">{students.length}</p>
          </div>
          <div className="w-9 h-9 rounded-lg bg-red-50 text-red-700 flex items-center justify-center">
            <Users className="w-5 h-5" />
          </div>
        </div>

        <div 
          onClick={() => onNavigate('fines')}
          className="p-4 rounded-xl bg-white border border-slate-200 hover:border-emerald-400 hover:shadow-xs cursor-pointer transition-all flex items-center justify-between"
        >
          <div>
            <p className="text-xs text-emerald-700 font-medium">Paid Fines Count</p>
            <p className="text-xl font-semibold text-emerald-700 font-mono mt-0.5">{displayFinancials.paidCount}</p>
          </div>
          <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <CheckCircle className="w-5 h-5" />
          </div>
        </div>

        <div 
          onClick={() => onNavigate('fines')}
          className="p-4 rounded-xl bg-white border border-slate-200 hover:border-amber-400 hover:shadow-xs cursor-pointer transition-all flex items-center justify-between"
        >
          <div>
            <p className="text-xs text-amber-700 font-medium">Unpaid Fines Count</p>
            <p className="text-xl font-semibold text-amber-700 font-mono mt-0.5">{displayFinancials.unpaidCount}</p>
          </div>
          <div className="w-9 h-9 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
            <Clock className="w-5 h-5" />
          </div>
        </div>

        <div 
          onClick={() => onNavigate('fines')}
          className="p-4 rounded-xl bg-white border border-slate-200 hover:border-rose-400 hover:shadow-xs cursor-pointer transition-all flex items-center justify-between"
        >
          <div>
            <p className="text-xs text-rose-700 font-medium">Cancelled Fines Count</p>
            <p className="text-xl font-semibold text-rose-700 font-mono mt-0.5">{displayFinancials.cancelledCount}</p>
          </div>
          <div className="w-9 h-9 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center">
            <XCircle className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Recent Disciplinary Records */}
      <div className="p-5 sm:p-6 rounded-2xl bg-white border border-slate-200 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <div>
            <h3 className="text-base font-semibold text-slate-900">Recent Disciplinary Fine Records</h3>
            <p className="text-xs text-slate-500">Live records from the department database</p>
          </div>

          {/* Quick Filters */}
          <div className="flex items-center gap-2">
            <div className="flex items-center bg-slate-100 rounded-xl p-1 text-xs font-semibold">
              {['ALL', '2', '3', '4'].map((yr) => (
                <button
                  key={yr}
                  onClick={() => setFilterYear(yr)}
                  className={`px-2.5 py-1 rounded-lg transition-all ${
                    filterYear === yr
                      ? 'bg-white text-slate-900 shadow-2xs font-semibold'
                      : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  {yr === 'ALL' ? 'All Years' : `${yr}nd/rd/th`}
                </button>
              ))}
            </div>

            <button
              onClick={() => onNavigate('fines')}
              className="text-xs font-semibold text-red-700 hover:text-red-800 flex items-center gap-1 group px-3 py-1.5 rounded-xl hover:bg-red-50 transition-colors"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto rounded-xl border border-slate-200">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 font-semibold uppercase tracking-wider border-b border-slate-200">
              <tr>
                <th className="p-3.5">Student</th>
                <th className="p-3.5">Register No</th>
                <th className="p-3.5">Year</th>
                <th className="p-3.5">Reason</th>
                <th className="p-3.5 text-right">Amount</th>
                <th className="p-3.5 text-center">Status</th>
                <th className="p-3.5 text-right">Quick Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {recentFines.length === 0 ? (
                <tr>
                  <td colSpan="7" className="p-8 text-center text-slate-400">
                    No fine records found matching the filter.
                  </td>
                </tr>
              ) : (
                recentFines.map((fine) => (
                  <tr key={fine.id} className="hover:bg-slate-50 transition-colors">
                    <td className="p-3.5 font-medium text-slate-900">
                      <button
                        onClick={() => onViewStudent(fine.studentId)}
                        className="hover:text-red-700 hover:underline text-left font-semibold"
                      >
                        {fine.studentName}
                      </button>
                    </td>
                    <td className="p-3.5 font-mono text-red-700 font-medium">
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
                    <td className="p-3.5 text-right font-mono font-semibold text-slate-900 text-sm">
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
                            className="px-2.5 py-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 rounded-lg transition-colors active:scale-95"
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
