import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from './context/AuthContext';
import { useToast } from './components/Toast';
import { studentService } from './services/studentService';
import { fineService } from './services/fineService';

// Layout & Components
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { AddFineModal } from './components/AddFineModal';
import { AddStudentModal } from './components/AddStudentModal';
import { ConfirmationModal } from './components/ConfirmationModal';
import { ReceiptModal } from './components/ReceiptModal';

// Pages
import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';
import { Students } from './pages/Students';
import { StudentDetails } from './pages/StudentDetails';
import { Fines } from './pages/Fines';
import { Settings } from './pages/Settings';

export const App = () => {
  const { user, loading: authLoading, isAuthenticated } = useAuth();
  const toast = useToast();

  // Navigation State
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [viewingStudentId, setViewingStudentId] = useState(null);

  // Data State
  const [students, setStudents] = useState([]);
  const [fines, setFines] = useState([]);
  const [dataLoading, setDataLoading] = useState(true);

  // Modal States
  const [isAddFineOpen, setIsAddFineOpen] = useState(false);
  const [editingFine, setEditingFine] = useState(null);
  const [fineDefaultStudentId, setFineDefaultStudentId] = useState(null);

  const [isAddStudentOpen, setIsAddStudentOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);

  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    title: '',
    message: '',
    confirmText: 'Confirm',
    type: 'danger',
    onConfirm: null,
  });

  const [receiptModalFine, setReceiptModalFine] = useState(null);

  // Load all initial data
  const loadAllData = useCallback(async () => {
    setDataLoading(true);
    try {
      const [fetchedStudents, fetchedFines] = await Promise.all([
        studentService.getAllStudents(),
        fineService.getAllFines(),
      ]);
      setStudents(fetchedStudents);
      setFines(fetchedFines);
    } catch (err) {
      console.error('Error fetching data:', err);
      toast.error('Failed to load department records: ' + err.message);
    } finally {
      setDataLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    if (isAuthenticated) {
      loadAllData();
    }
  }, [isAuthenticated, loadAllData]);

  // --- Student Actions ---
  const handleSaveStudent = async (studentData, studentId = null) => {
    if (studentId) {
      // Edit
      const updated = await studentService.updateStudent(studentId, studentData);
      setStudents((prev) => prev.map((s) => (s.id === studentId ? { ...s, ...updated } : s)));
      toast.success(`Student "${studentData.name}" updated successfully.`);
    } else {
      // Add
      const created = await studentService.addStudent(studentData);
      setStudents((prev) => [created, ...prev]);
      toast.success(`Student "${studentData.name}" registered successfully.`);
    }
  };

  const handleDeleteStudent = (student) => {
    setConfirmModal({
      isOpen: true,
      title: `Delete Student Record: ${student.name}`,
      message: `Are you sure you want to remove ${student.name} (${student.registerNumber})? This will also remove the student from the registry.`,
      confirmText: 'Delete Student',
      type: 'danger',
      onConfirm: async () => {
        try {
          await studentService.deleteStudent(student.id);
          setStudents((prev) => prev.filter((s) => s.id !== student.id));
          toast.success(`Student ${student.name} deleted.`);
          if (viewingStudentId === student.id) {
            setCurrentPage('students');
          }
        } catch (err) {
          toast.error('Failed to delete student: ' + err.message);
        } finally {
          setConfirmModal((prev) => ({ ...prev, isOpen: false }));
        }
      },
    });
  };

  const handleBulkPromoteStudents = async (studentIds, targetYear) => {
    try {
      await studentService.bulkPromoteStudents(studentIds, targetYear);
      setStudents((prev) =>
        prev.map((s) => (studentIds.includes(s.id) ? { ...s, year: targetYear } : s))
      );
      toast.success(`Successfully promoted ${studentIds.length} student(s) to ${targetYear} Year ECE!`);
    } catch (err) {
      toast.error('Failed to promote students: ' + err.message);
    }
  };

  const handleBulkDeleteStudents = (studentIds) => {
    setConfirmModal({
      isOpen: true,
      title: `Bulk Delete (${studentIds.length}) Students`,
      message: `Are you sure you want to permanently remove ${studentIds.length} selected student record(s)? This action cannot be undone.`,
      confirmText: `Delete ${studentIds.length} Students`,
      type: 'danger',
      onConfirm: async () => {
        try {
          await studentService.bulkDeleteStudents(studentIds);
          setStudents((prev) => prev.filter((s) => !studentIds.includes(s.id)));
          toast.success(`Removed ${studentIds.length} student record(s) from database.`);
        } catch (err) {
          toast.error('Failed to delete students: ' + err.message);
        } finally {
          setConfirmModal((prev) => ({ ...prev, isOpen: false }));
        }
      },
    });
  };

  // --- Fine Actions ---
  const handleSaveFine = async (fineData, fineId = null) => {
    if (fineId) {
      // Edit
      const updated = await fineService.updateFine(fineId, fineData);
      setFines((prev) => prev.map((f) => (f.id === fineId ? { ...f, ...updated } : f)));
      toast.success(`Fine record updated successfully.`);
    } else {
      // Add
      const created = await fineService.addFine(fineData);
      setFines((prev) => [created, ...prev]);
      toast.success(`Fine of ₹${fineData.amount} recorded for ${fineData.studentName}.`);
    }
  };

  const handleStatusChange = async (fineId, newStatus) => {
    const fine = fines.find((f) => f.id === fineId);
    if (!fine) return;

    if (newStatus === 'Cancelled') {
      setConfirmModal({
        isOpen: true,
        title: 'Cancel / Waive Fine',
        message: `Are you sure you want to cancel the fine of ₹${fine.amount} for ${fine.studentName}? Cancelled fines do not contribute to the treasury or pending dues.`,
        confirmText: 'Confirm Cancellation',
        type: 'warning',
        onConfirm: async () => {
          try {
            const updated = await fineService.changeFineStatus(fineId, 'Cancelled', 'Waived with authorization');
            setFines((prev) => prev.map((f) => (f.id === fineId ? { ...f, ...updated } : f)));
            toast.info(`Fine for ${fine.studentName} has been cancelled/waived.`);
          } catch (err) {
            toast.error('Failed to cancel fine: ' + err.message);
          } finally {
            setConfirmModal((prev) => ({ ...prev, isOpen: false }));
          }
        },
      });
      return;
    }

    try {
      const updated = await fineService.changeFineStatus(fineId, newStatus);
      setFines((prev) => prev.map((f) => (f.id === fineId ? { ...f, ...updated } : f)));
      if (newStatus === 'Paid') {
        toast.success(`Fine for ${fine.studentName} marked as PAID. Treasury updated!`);
      } else {
        toast.info(`Fine status set to ${newStatus}.`);
      }
    } catch (err) {
      toast.error('Failed to update status: ' + err.message);
    }
  };

  const handleDeleteFine = (fine) => {
    setConfirmModal({
      isOpen: true,
      title: `Delete Fine: ${fine.id}`,
      message: `Are you sure you want to permanently delete this fine record of ₹${fine.amount} for ${fine.studentName}?`,
      confirmText: 'Delete Fine',
      type: 'danger',
      onConfirm: async () => {
        try {
          await fineService.deleteFine(fine.id);
          setFines((prev) => prev.filter((f) => f.id !== fine.id));
          toast.success('Fine record removed.');
        } catch (err) {
          toast.error('Failed to delete fine: ' + err.message);
        } finally {
          setConfirmModal((prev) => ({ ...prev, isOpen: false }));
        }
      },
    });
  };

  // Navigation Helpers
  const handleViewStudentProfile = (studentId) => {
    setViewingStudentId(studentId);
    setCurrentPage('student-details');
  };

  const handleOpenAddFineForStudent = (studentId) => {
    setEditingFine(null);
    setFineDefaultStudentId(studentId);
    setIsAddFineOpen(true);
  };

  const handleOpenEditFine = (fine) => {
    setEditingFine(fine);
    setFineDefaultStudentId(fine.studentId);
    setIsAddFineOpen(true);
  };

  const handleOpenEditStudent = (student) => {
    setEditingStudent(student);
    setIsAddStudentOpen(true);
  };

  // Auth loading splash
  if (authLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center text-slate-600">
        <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mb-4" />
        <p className="text-sm font-semibold text-slate-800">Loading MPNMJEC ECE Fine Management Portal...</p>
      </div>
    );
  }

  // Not logged in -> Show Login Page
  if (!isAuthenticated) {
    return <Login />;
  }

  // Target student for student details page
  const activeStudent = students.find((s) => s.id === viewingStudentId);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex">
      {/* Sidebar */}
      <Sidebar
        currentPage={currentPage === 'student-details' ? 'students' : currentPage}
        onNavigate={(pageId) => {
          setCurrentPage(pageId);
          if (pageId !== 'student-details') setViewingStudentId(null);
        }}
        mobileOpen={mobileSidebarOpen}
        onCloseMobile={() => setMobileSidebarOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex-1 lg:pl-72 flex flex-col min-w-0">
        {/* Top Header */}
        <Header
          onOpenMobileMenu={() => setMobileSidebarOpen(true)}
          onOpenAddFine={() => {
            setEditingFine(null);
            setFineDefaultStudentId(null);
            setIsAddFineOpen(true);
          }}
          onOpenAddStudent={() => {
            setEditingStudent(null);
            setIsAddStudentOpen(true);
          }}
        />

        {/* Dynamic Page Routing */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {dataLoading ? (
            <div className="py-20 text-center text-slate-400">
              <div className="w-8 h-8 border-2 border-indigo-500/40 border-t-indigo-500 rounded-full animate-spin mx-auto mb-3" />
              <p className="text-xs">Synchronizing Department Records...</p>
            </div>
          ) : (
            <>
              {currentPage === 'dashboard' && (
                <Dashboard
                  students={students}
                  fines={fines}
                  onOpenAddFine={() => {
                    setEditingFine(null);
                    setFineDefaultStudentId(null);
                    setIsAddFineOpen(true);
                  }}
                  onOpenAddStudent={() => {
                    setEditingStudent(null);
                    setIsAddStudentOpen(true);
                  }}
                  onNavigate={setCurrentPage}
                  onViewStudent={handleViewStudentProfile}
                  onOpenReceipt={(fine) => setReceiptModalFine(fine)}
                  onStatusChange={handleStatusChange}
                />
              )}

              {currentPage === 'students' && (
                <Students
                  students={students}
                  fines={fines}
                  onOpenAddStudent={() => {
                    setEditingStudent(null);
                    setIsAddStudentOpen(true);
                  }}
                  onEditStudent={handleOpenEditStudent}
                  onDeleteStudent={handleDeleteStudent}
                  onViewStudentHistory={handleViewStudentProfile}
                  onAddFineForStudent={handleOpenAddFineForStudent}
                  onBulkPromoteStudents={handleBulkPromoteStudents}
                  onBulkDeleteStudents={handleBulkDeleteStudents}
                />
              )}

              {currentPage === 'student-details' && (
                <StudentDetails
                  student={activeStudent}
                  fines={fines}
                  onBack={() => setCurrentPage('students')}
                  onOpenAddFine={handleOpenAddFineForStudent}
                  onEditFine={handleOpenEditFine}
                  onDeleteFine={handleDeleteFine}
                  onStatusChange={handleStatusChange}
                  onOpenReceipt={(fine) => setReceiptModalFine(fine)}
                  onEditStudent={handleOpenEditStudent}
                />
              )}

              {currentPage === 'fines' && (
                <Fines
                  fines={fines}
                  students={students}
                  onOpenAddFine={() => {
                    setEditingFine(null);
                    setFineDefaultStudentId(null);
                    setIsAddFineOpen(true);
                  }}
                  onEditFine={handleOpenEditFine}
                  onDeleteFine={handleDeleteFine}
                  onStatusChange={handleStatusChange}
                  onViewStudentHistory={handleViewStudentProfile}
                  onOpenReceipt={(fine) => setReceiptModalFine(fine)}
                />
              )}

              {currentPage === 'settings' && (
                <Settings />
              )}
            </>
          )}
        </main>
      </div>

      {/* --- Modals --- */}
      <AddFineModal
        isOpen={isAddFineOpen}
        onClose={() => setIsAddFineOpen(false)}
        onSubmit={handleSaveFine}
        students={students}
        initialData={editingFine}
        defaultStudentId={fineDefaultStudentId}
      />

      <AddStudentModal
        isOpen={isAddStudentOpen}
        onClose={() => setIsAddStudentOpen(false)}
        onSubmit={handleSaveStudent}
        initialData={editingStudent}
      />

      <ConfirmationModal
        isOpen={confirmModal.isOpen}
        onClose={() => setConfirmModal((prev) => ({ ...prev, isOpen: false }))}
        onConfirm={confirmModal.onConfirm}
        title={confirmModal.title}
        message={confirmModal.message}
        confirmText={confirmModal.confirmText}
        type={confirmModal.type}
      />

      <ReceiptModal
        isOpen={!!receiptModalFine}
        onClose={() => setReceiptModalFine(null)}
        fine={receiptModalFine}
      />
    </div>
  );
};
export default App;
