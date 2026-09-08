import React from 'react';
import { 
  ArrowLeft, 
  User, 
  Hash, 
  GraduationCap, 
  Phone, 
  Plus, 
  Receipt, 
  Clock, 
  CheckCircle, 
  XCircle, 
  FileText, 
  Trash2, 
  Calendar, 
  Edit2
} from 'lucide-react';
import { calculateStudentStats, formatCurrency, formatDate, formatDateTime } from '../utils/calculations';

export const StudentDetails = ({
  student,
  fines = [],
  onBack,
  onOpenAddFine,
  onEditFine,
  onDeleteFine,
  onStatusChange,
  onOpenReceipt,
  onEditStudent,
}) => {
  if (!student) {
    return (
      <div className="p-8 text-center text-slate-500 bg-white rounded-2xl border border-slate-200">
        <p>Student not found or was removed.</p>
        <button
          onClick={onBack}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-semibold"
        >
          Back to Students
        </button>
      </div>
    );
  }

  const studentFines = fines.filter((f) => f.studentId === student.id);
  const stats = calculateStudentStats(studentFines);

  return (
    <div className="space-y-5 pb-12">
      {/* Back Button and Actions */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-700 hover:text-slate-900 px-3 py-2 rounded-xl bg-white border border-slate-200 shadow-xs hover:bg-slate-50 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Students List</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onEditStudent(student)}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 rounded-xl border border-slate-200 transition-colors shadow-xs"
          >
            <Edit2 className="w-3.5 h-3.5" />
            <span>Edit Info</span>
          </button>

          <button
            onClick={() => onOpenAddFine(student.id)}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-md shadow-blue-500/20 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Add Fine for {student.name.split(' ')[0]}</span>
          </button>
        </div>
      </div>

      {/* Student Profile Overview Card */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-2xl bg-blue-50 border border-blue-200 text-blue-700 flex items-center justify-center font-bold text-xl shrink-0 font-mono">
              {student.name.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-slate-900">{student.name}</h2>
                {(student.year || '').toLowerCase().includes('passout') || (student.year || '').toLowerCase().includes('passed out') ? (
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-purple-50 border border-purple-300 text-purple-800 flex items-center gap-1.5">
                    🎓 {student.year.startsWith('Passout-') ? student.year : `Passout ${student.year}`}
                  </span>
                ) : (student.year || '').toLowerCase() === 'discontinued' ? (
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-50 border border-amber-300 text-amber-800 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                    Discontinued Student
                  </span>
                ) : (
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-50 border border-blue-200 text-blue-700">
                    {student.year} Year ECE
                  </span>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-4 text-xs text-slate-600 mt-2 font-mono">
                <span className="flex items-center gap-1.5 text-blue-700 font-bold">
                  <Hash className="w-3.5 h-3.5" />
                  <span>{student.registerNumber}</span>
                </span>
                <span className="flex items-center gap-1.5 text-slate-500">
                  <GraduationCap className="w-3.5 h-3.5" />
                  <span>Dept: ECE</span>
                </span>
                {student.phone && (
                  <span className="flex items-center gap-1.5 text-slate-500">
                    <Phone className="w-3.5 h-3.5" />
                    <span>{student.phone}</span>
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Department Clearance Badge */}
          <div>
            {stats.totalPendingAmount === 0 ? (
              <div className="px-4 py-2.5 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                <div>
                  <p className="font-bold">Clearance Status: ALL CLEAR</p>
                  <p className="text-[10px] text-emerald-700">No pending disciplinary dues</p>
                </div>
              </div>
            ) : (
              <div className="px-4 py-2.5 rounded-xl bg-amber-50 border border-amber-300 text-amber-800 text-xs flex items-center gap-2">
                <Clock className="w-4 h-4 text-amber-600 shrink-0" />
                <div>
                  <p className="font-bold">Pending Dues: {formatCurrency(stats.totalPendingAmount)}</p>
                  <p className="text-[10px] text-amber-700">Clear before Hall Ticket issue</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Individual Financial Calculation Counters */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-slate-100">
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Total Recorded</span>
            <p className="text-xl font-semibold font-mono text-slate-900 mt-1">{formatCurrency(stats.totalFineAmount)}</p>
            <p className="text-[10px] text-slate-500 mt-0.5">{stats.totalFinesCount} fines total</p>
          </div>

          <div className="p-3.5 rounded-xl bg-emerald-50/70 border border-emerald-200">
            <span className="text-[11px] font-semibold text-emerald-800 uppercase tracking-wider">Total Paid</span>
            <p className="text-xl font-semibold font-mono text-emerald-700 mt-1">{formatCurrency(stats.totalPaidAmount)}</p>
            <p className="text-[10px] text-emerald-600 mt-0.5">Cleared to Treasury</p>
          </div>

          <div className="p-3.5 rounded-xl bg-amber-50/70 border border-amber-200">
            <span className="text-[11px] font-semibold text-amber-800 uppercase tracking-wider">Total Pending</span>
            <p className="text-xl font-semibold font-mono text-amber-700 mt-1">{formatCurrency(stats.totalPendingAmount)}</p>
            <p className="text-[10px] text-amber-600 mt-0.5">Unpaid fine balance</p>
          </div>

          <div className="p-3.5 rounded-xl bg-rose-50/70 border border-rose-200">
            <span className="text-[11px] font-semibold text-rose-800 uppercase tracking-wider">Total Cancelled</span>
            <p className="text-xl font-semibold font-mono text-rose-700 mt-1">{formatCurrency(stats.totalCancelledAmount)}</p>
            <p className="text-[10px] text-rose-600 mt-0.5">Waived by HOD</p>
          </div>
        </div>
      </div>

      {/* Student Complete Fine History Table */}
      <div className="rounded-2xl bg-white border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-semibold text-slate-900">Department Fine Timeline & History</h3>
            <p className="text-xs text-slate-500">Complete historical records for {student.name}</p>
          </div>
          <span className="text-xs font-mono text-blue-700 font-semibold bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-200">
            {studentFines.length} records found
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 font-semibold uppercase tracking-wider border-b border-slate-200">
              <tr>
                <th className="p-3.5">Issued Date</th>
                <th className="p-3.5">Reason for Fine</th>
                <th className="p-3.5 text-right">Amount</th>
                <th className="p-3.5 text-center">Status</th>
                <th className="p-3.5">Remarks / Settlement</th>
                <th className="p-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {studentFines.length === 0 ? (
                <tr>
                  <td colSpan="6" className="p-8 text-center text-slate-400">
                    <CheckCircle className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
                    <p className="text-slate-700 font-medium">No fine records found for this student.</p>
                    <p className="text-[11px] text-slate-500 mt-1">Great! Student has maintained clear discipline.</p>
                  </td>
                </tr>
              ) : (
                studentFines.map((fine) => (
                  <tr key={fine.id} className="hover:bg-slate-50 transition-colors">
                    <td className="p-3.5 whitespace-nowrap text-slate-500">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        <span>{formatDate(fine.createdAt)}</span>
                      </div>
                    </td>
                    <td className="p-3.5 font-medium text-slate-900 max-w-sm">
                      <p>{fine.reason}</p>
                      <p className="text-[10px] text-slate-400 font-mono mt-0.5">ID: {fine.id}</p>
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
                    <td className="p-3.5 text-slate-500 max-w-xs truncate text-[11px]">
                      {fine.remarks || (
                        <span className="text-slate-400 italic">No remarks</span>
                      )}
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
                            className="p-1.5 text-slate-500 hover:text-blue-600 rounded-lg hover:bg-slate-100 transition-colors"
                          >
                            <FileText className="w-4 h-4" />
                          </button>
                        )}
                        <button
                          onClick={() => onEditFine(fine)}
                          title="Edit Fine"
                          className="p-1.5 text-slate-500 hover:text-indigo-600 rounded-lg hover:bg-slate-100 transition-colors"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => onDeleteFine(fine)}
                          title="Delete Fine"
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
