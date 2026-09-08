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

  const round2 = (num) => Math.round((Number(num) || 0) * 100) / 100;

  const totalAmount = round2(paidAmount + pendingAmount + cancelledAmount);
  const totalCount = fines.length;

  return {
    totalAmount,
    paidAmount: round2(paidAmount), // Treasury / Collected Amount
    pendingAmount: round2(pendingAmount), // Pending Fine
    cancelledAmount: round2(cancelledAmount), // Cancelled Fine
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
  const val = Number(amount) || 0;
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(val);
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

export const numberToWords = (num) => {
  const n = Math.floor(Number(num) || 0);
  if (n === 0) return 'Zero Rupees Only';

  const a = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
  const b = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

  const convertLessThanOneThousand = (number) => {
    let current = '';
    if (number % 100 < 20) {
      current = a[number % 100];
      number = Math.floor(number / 100);
    } else {
      current = a[number % 10];
      number = Math.floor(number / 10);
      current = b[number % 10] + (current ? ' ' + current : '');
      number = Math.floor(number / 10);
    }
    if (number === 0) return current;
    return a[number] + ' Hundred' + (current ? ' and ' + current : '');
  };

  let result = '';
  const crore = Math.floor(n / 10000000);
  const lakh = Math.floor((n % 10000000) / 100000);
  const thousand = Math.floor((n % 100000) / 1000);
  const remainder = n % 1000;

  if (crore > 0) {
    result += convertLessThanOneThousand(crore) + ' Crore ';
  }
  if (lakh > 0) {
    result += convertLessThanOneThousand(lakh) + ' Lakh ';
  }
  if (thousand > 0) {
    result += convertLessThanOneThousand(thousand) + ' Thousand ';
  }
  if (remainder > 0) {
    result += convertLessThanOneThousand(remainder);
  }

  return result.trim() + ' Only';
};
