/**
 * Financial and aggregate calculations for College Department Fine Management System
 * M.P. Nachimuthu M. Jaganathan Engineering College - ECE Department
 */

export const calculateFinancials = (fines = []) => {
  let paidAmount = 0;
  let pendingAmount = 0;
  let cancelledAmount = 0;

  let paidCount = 0;
  let unpaidCount = 0;
  let cancelledCount = 0;

  fines.forEach((fine) => {
    const amount = Number(fine.amount) || 0;
    const status = (fine.status || '').toLowerCase();

    if (status === 'paid') {
      paidAmount += amount;
      paidCount++;
    } else if (status === 'unpaid') {
      pendingAmount += amount;
      unpaidCount++;
    } else if (status === 'cancelled') {
      cancelledAmount += amount;
      cancelledCount++;
    }
  });

  const totalAmount = paidAmount + pendingAmount + cancelledAmount;
  const totalCount = fines.length;

  return {
    totalAmount,
    paidAmount, // Treasury / Collected Amount
    pendingAmount, // Pending Fine
    cancelledAmount, // Cancelled Fine
    totalCount,
    paidCount,
    unpaidCount,
    cancelledCount,
  };
};

export const calculateStudentStats = (studentFines = []) => {
  const financials = calculateFinancials(studentFines);
  return {
    totalFinesCount: financials.totalCount,
    totalFineAmount: financials.totalAmount,
    totalPaidAmount: financials.paidAmount,
    totalPendingAmount: financials.pendingAmount,
    totalCancelledAmount: financials.cancelledAmount,
  };
};

export const formatCurrency = (amount = 0) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
};

export const formatDate = (dateStringOrTimestamp) => {
  if (!dateStringOrTimestamp) return 'N/A';
  
  let date;
  if (typeof dateStringOrTimestamp === 'object' && dateStringOrTimestamp.seconds) {
    date = new Date(dateStringOrTimestamp.seconds * 1000);
  } else {
    date = new Date(dateStringOrTimestamp);
  }

  if (isNaN(date.getTime())) return 'N/A';

  return new Intl.DateTimeFormat('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(date);
};

export const formatDateTime = (dateStringOrTimestamp) => {
  if (!dateStringOrTimestamp) return 'N/A';
  
  let date;
  if (typeof dateStringOrTimestamp === 'object' && dateStringOrTimestamp.seconds) {
    date = new Date(dateStringOrTimestamp.seconds * 1000);
  } else {
    date = new Date(dateStringOrTimestamp);
  }

  if (isNaN(date.getTime())) return 'N/A';

  return new Intl.DateTimeFormat('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  }).format(date);
};
