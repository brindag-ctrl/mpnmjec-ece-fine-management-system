import React, { useState } from 'react';
import { 
  Users, 
  Search, 
  Filter, 
  UserPlus, 
  Edit2, 
  Trash2, 
  Phone, 
  History, 
  Plus,
  ArrowUpCircle,
  CheckSquare,
  Square,
  AlertTriangle,
} from 'lucide-react';
import { formatCurrency } from '../utils/calculations';

export const Students = ({
  students = [],
  fines = [],
  onOpenAddStudent,
  onEditStudent,
  onDeleteStudent,
  onViewStudentHistory,
  onAddFineForStudent,
  onBulkPromoteStudents,
  onBulkDeleteStudents,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [yearFilter, setYearFilter] = useState('All');
  const [selectedStudentIds, setSelectedStudentIds] = useState([]);
  const [targetPromoteYear, setTargetPromoteYear] = useState('3rd');

  const filteredStudents = students.filter((std) => {
    const matchesSearch =
      std.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      std.registerNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (std.phone && std.phone.includes(searchTerm));

    const matchesYear = yearFilter === 'All' || std.year === yearFilter;

    return matchesSearch && matchesYear;
  });

  const allFilteredIds = filteredStudents.map((s) => s.id);
  const isAllSelected = allFilteredIds.length > 0 && allFilteredIds.every((id) => selectedStudentIds.includes(id));
  const isSomeSelected = selectedStudentIds.length > 0;

  const toggleSelectAll = () => {
    if (isAllSelected) {
      setSelectedStudentIds((prev) => prev.filter((id) => !allFilteredIds.includes(id)));
    } else {
      const combined = Array.from(new Set([...selectedStudentIds, ...allFilteredIds]));
      setSelectedStudentIds(combined);
    }
  };

  const toggleSelectStudent = (id) => {
    setSelectedStudentIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleBulkPromoteSubmit = () => {
    if (selectedStudentIds.length === 0) return;
    onBulkPromoteStudents(selectedStudentIds, targetPromoteYear);
    setSelectedStudentIds([]);
  };

  const handleBulkDeleteSubmit = () => {
    if (selectedStudentIds.length === 0) return;
    onBulkDeleteStudents(selectedStudentIds);
    setSelectedStudentIds([]);
  };

  const getStudentFineSummary = (studentId) => {
    const studentFines = fines.filter((f) => f.studentId === studentId);
    const unpaidFines = studentFines.filter((f) => (f.status || '').toLowerCase() === 'unpaid');
    const unpaidAmount = unpaidFines.reduce((acc, curr) => acc + (Number(curr.amount) || 0), 0);
    return {
      totalCount: studentFines.length,
      unpaidCount: unpaidFines.length,
      unpaidAmount,
    };
  };

  return (
    <div className="space-y-5 pb-10">
      {/* Top Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-blue-700">
            Student Roster
          </span>
          <h2 className="text-lg sm:text-xl font-bold text-slate-900 mt-0.5">
            ECE Department Students
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Manage student registrations, academic year promotions, and fine histories.
          </p>
        </div>

        <button
          onClick={onOpenAddStudent}
          className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl shadow-md shadow-blue-500/20 transition-all self-start sm:self-auto"
        >
          <UserPlus className="w-4 h-4" />
          <span>+ Register Student</span>
        </button>
      </div>

      {/* Search and Filters Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
        {/* Search Input */}
        <div className="sm:col-span-2 relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search by student name, register number (e.g. 731725106001), or phone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-300 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-600 focus:bg-white"
          />
        </div>

        {/* Year Filter */}
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-400 shrink-0" />
          <select
            value={yearFilter}
            onChange={(e) => setYearFilter(e.target.value)}
            className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-300 rounded-xl text-slate-800 focus:outline-none focus:border-blue-600 focus:bg-white font-medium"
          >
            <option value="All">All Academic Years</option>
            <option value="2nd">2nd Year ECE</option>
            <option value="3rd">3rd Year ECE</option>
            <option value="4th">4th Year ECE (Final)</option>
          </select>
        </div>
      </div>

      {/* Bulk Actions Floating Bar (Active when students are selected) */}
      {isSomeSelected && (
        <div className="p-4 rounded-2xl bg-blue-900 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-4 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="flex items-center gap-3">
            <span className="flex items-center justify-center w-7 h-7 rounded-full bg-blue-800 text-blue-200 font-bold text-xs">
              {selectedStudentIds.length}
            </span>
            <span className="text-xs font-semibold">
              {selectedStudentIds.length} student{selectedStudentIds.length > 1 ? 's' : ''} selected
            </span>
            <button
              onClick={() => setSelectedStudentIds([])}
              className="text-[11px] text-blue-300 hover:text-white underline ml-1"
            >
              Clear selection
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto justify-end">
            {/* Bulk Year Promotion */}
            <div className="flex items-center gap-1.5 bg-blue-800/80 p-1 rounded-xl border border-blue-700">
              <span className="text-[11px] font-semibold text-blue-200 pl-2">Promote Year to:</span>
              <select
                value={targetPromoteYear}
                onChange={(e) => setTargetPromoteYear(e.target.value)}
                className="px-2.5 py-1 text-xs font-bold bg-blue-950 text-white rounded-lg border border-blue-600 focus:outline-none"
              >
                <option value="2nd">2nd Year</option>
                <option value="3rd">3rd Year</option>
                <option value="4th">4th Year</option>
                <option value="Graduated">Graduated</option>
              </select>
              <button
                onClick={handleBulkPromoteSubmit}
                className="flex items-center gap-1.5 px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-lg transition-colors shadow-xs"
              >
                <ArrowUpCircle className="w-3.5 h-3.5" />
                <span>Promote Selected</span>
              </button>
            </div>

            {/* Bulk Remove */}
            <button
              onClick={handleBulkDeleteSubmit}
              className="flex items-center gap-1.5 px-3.5 py-1.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl transition-colors shadow-xs"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Delete Selected</span>
            </button>
          </div>
        </div>
      )}

      {/* Student List Table */}
      <div className="rounded-2xl bg-white border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between text-xs">
          <div className="flex items-center gap-3">
            <span className="text-slate-500">
              Showing <strong className="text-slate-900">{filteredStudents.length}</strong> of{' '}
              <strong className="text-slate-700">{students.length}</strong> ECE students
            </span>
          </div>

          <span className="text-[11px] text-blue-700 font-bold bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200">
            Department: ECE
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 font-semibold uppercase tracking-wider border-b border-slate-200">
              <tr>
                <th className="p-3.5 w-10 text-center">
                  <input
                    type="checkbox"
                    checked={isAllSelected}
                    onChange={toggleSelectAll}
                    className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 cursor-pointer"
                  />
                </th>
                <th className="p-3.5 w-12 text-center">S.No</th>
                <th className="p-3.5">Student Name</th>
                <th className="p-3.5">Register Number</th>
                <th className="p-3.5">Year</th>
                <th className="p-3.5">Department</th>
                <th className="p-3.5">Phone</th>
                <th className="p-3.5 text-center">Fine Status</th>
                <th className="p-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan="9" className="p-8 text-center text-slate-400">
                    <Users className="w-8 h-8 mx-auto text-slate-300 mb-2" />
                    <p>No students found matching the filters.</p>
                  </td>
                </tr>
              ) : (
                filteredStudents.map((student, index) => {
                  const fineSummary = getStudentFineSummary(student.id);
                  const isSelected = selectedStudentIds.includes(student.id);

                  return (
                    <tr
                      key={student.id}
                      className={`transition-colors ${
                        isSelected ? 'bg-blue-50/70 hover:bg-blue-50' : 'hover:bg-slate-50'
                      }`}
                    >
                      <td className="p-3.5 text-center">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => toggleSelectStudent(student.id)}
                          className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 cursor-pointer"
                        />
                      </td>
                      <td className="p-3.5 text-center font-mono text-slate-400">
                        {index + 1}
                      </td>
                      <td className="p-3.5 font-medium text-slate-900">
                        <button
                          onClick={() => onViewStudentHistory(student.id)}
                          className="hover:text-blue-600 hover:underline text-left font-bold"
                        >
                          {student.name}
                        </button>
                      </td>
                      <td className="p-3.5 font-mono text-blue-700 font-semibold">
                        {student.registerNumber}
                      </td>
                      <td className="p-3.5">
                        <span className="px-2.5 py-0.5 rounded-md text-[11px] font-semibold bg-slate-100 border border-slate-200 text-slate-700">
                          {student.year} Year
                        </span>
                      </td>
                      <td className="p-3.5">
                        <span className="text-blue-700 font-bold">ECE</span>
                      </td>
                      <td className="p-3.5 font-mono text-slate-500">
                        {student.phone ? (
                          <span className="flex items-center gap-1">
                            <Phone className="w-3 h-3 text-slate-400" />
                            {student.phone}
                          </span>
                        ) : (
                          <span className="text-slate-400 italic">Not set</span>
                        )}
                      </td>
                      <td className="p-3.5 text-center">
                        {fineSummary.unpaidCount > 0 ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-300">
                            {formatCurrency(fineSummary.unpaidAmount)} Pending ({fineSummary.unpaidCount})
                          </span>
                        ) : fineSummary.totalCount > 0 ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-emerald-50 text-emerald-800 border border-emerald-300">
                            Clear ({fineSummary.totalCount} fines)
                          </span>
                        ) : (
                          <span className="text-[10px] text-slate-400 font-mono">No fines</span>
                        )}
                      </td>
                      <td className="p-3.5 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* Quick Add Fine */}
                          <button
                            onClick={() => onAddFineForStudent(student.id)}
                            title="Issue fine to student"
                            className="p-1.5 text-slate-500 hover:text-amber-600 rounded-lg hover:bg-slate-100 transition-colors"
                          >
                            <Plus className="w-4 h-4" />
                          </button>

                          {/* View History */}
                          <button
                            onClick={() => onViewStudentHistory(student.id)}
                            title="View Student Fine History"
                            className="p-1.5 text-slate-500 hover:text-blue-600 rounded-lg hover:bg-slate-100 transition-colors"
                          >
                            <History className="w-4 h-4" />
                          </button>

                          {/* Edit Student */}
                          <button
                            onClick={() => onEditStudent(student)}
                            title="Edit Student Info"
                            className="p-1.5 text-slate-500 hover:text-indigo-600 rounded-lg hover:bg-slate-100 transition-colors"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>

                          {/* Delete Student */}
                          <button
                            onClick={() => onDeleteStudent(student)}
                            title="Delete Student"
                            className="p-1.5 text-slate-500 hover:text-rose-600 rounded-lg hover:bg-slate-100 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
