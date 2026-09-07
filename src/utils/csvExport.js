/**
 * CSV Export utility for Department Fine Management System
 * M.P. Nachimuthu M. Jaganathan Engineering College - ECE Department
 */

import { formatDate, formatCurrency } from './calculations';

export const exportFinesToCSV = (fines = [], metadata = {}) => {
  if (!fines || fines.length === 0) {
    alert('No fine records to export.');
    return;
  }

  const {
    college = 'M.P. Nachimuthu M. Jaganathan Engineering College',
    department = 'Department of Electronics and Communication Engineering (ECE)',
    reportTitle = 'Department Student Fine Audit Report',
  } = metadata;

  // Header information
  const generatedAt = new Date().toLocaleString('en-IN');
  
  // Calculate summary totals
  let totalPaid = 0;
  let totalPending = 0;
  let totalCancelled = 0;

  fines.forEach((f) => {
    const amt = Number(f.amount) || 0;
    const st = (f.status || '').toLowerCase();
    if (st === 'paid') totalPaid += amt;
    else if (st === 'unpaid') totalPending += amt;
    else if (st === 'cancelled') totalCancelled += amt;
  });

  const totalSum = totalPaid + totalPending + totalCancelled;

  // Build CSV Rows
  const rows = [];

  // Institution info
  rows.push([`"${college}"`]);
  rows.push([`"${department}"`]);
  rows.push([`"${reportTitle}"`]);
  rows.push([`"Generated On: ${generatedAt}"`]);
  rows.push([]); // blank line

  // Summary Table in CSV
  rows.push(['"FINANCIAL SUMMARY"']);
  rows.push(['"Total Fines Recorded"', fines.length, '"Total Amount"', `"${formatCurrency(totalSum)}"`]);
  rows.push(['"Paid Fines (Treasury)"', fines.filter(f => (f.status||'').toLowerCase() === 'paid').length, '"Collected Amount"', `"${formatCurrency(totalPaid)}"`]);
  rows.push(['"Unpaid Fines (Pending)"', fines.filter(f => (f.status||'').toLowerCase() === 'unpaid').length, '"Pending Amount"', `"${formatCurrency(totalPending)}"`]);
  rows.push(['"Cancelled Fines"', fines.filter(f => (f.status||'').toLowerCase() === 'cancelled').length, '"Cancelled Amount"', `"${formatCurrency(totalCancelled)}"`]);
  rows.push([]); // blank line

  // Column Headers
  const headers = [
    'S.No',
    'Fine ID',
    'Student Name',
    'Register Number',
    'Department',
    'Year',
    'Fine Reason',
    'Amount (INR)',
    'Status',
    'Issued Date',
    'Payment / Cancellation Date',
    'Remarks / Faculty'
  ];
  rows.push(headers.map(h => `"${h}"`));

  // Data rows
  fines.forEach((fine, index) => {
    const row = [
      index + 1,
      fine.id || `FINE-${index + 1}`,
      fine.studentName || '',
      fine.registerNumber || '',
      fine.department || 'ECE',
      fine.year || '',
      fine.reason ? fine.reason.replace(/"/g, '""') : '',
      fine.amount || 0,
      fine.status || 'Unpaid',
      formatDate(fine.createdAt),
      fine.paidAt ? formatDate(fine.paidAt) : (fine.cancelledAt ? formatDate(fine.cancelledAt) : '-'),
      fine.remarks ? fine.remarks.replace(/"/g, '""') : '-'
    ];
    rows.push(row.map(cell => `"${cell}"`));
  });

  // Construct CSV content string
  const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + rows.map(r => r.join(',')).join('\n');
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement('a');
  link.setAttribute('href', encodedUri);
  const timestamp = new Date().toISOString().slice(0, 10);
  link.setAttribute('download', `MPNMJEC_ECE_Fines_Report_${timestamp}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
