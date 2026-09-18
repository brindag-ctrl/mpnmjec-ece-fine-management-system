import { 
  collection, 
  getDocs, 
  doc, 
  addDoc, 
  deleteDoc, 
  updateDoc, 
  query, 
  serverTimestamp 
} from 'firebase/firestore';
import { db, isFirebaseConfigured } from './firebase';

export const incomeService = {
  /**
   * Get all department incomes directly from Firebase Cloud Firestore
   */
  getAllIncomes: async () => {
    if (!isFirebaseConfigured() || !db) {
      // Return empty array if offline / fallback
      return [];
    }

    try {
      const q = query(collection(db, 'incomes'));
      const querySnapshot = await getDocs(q);
      const incomes = [];

      querySnapshot.forEach((docSnapshot) => {
        const data = docSnapshot.data();
        incomes.push({
          id: docSnapshot.id,
          ...data,
          amount: parseFloat(data.amount) || 0,
          createdAt: data.createdAt?.toDate ? data.createdAt.toDate().toISOString() : data.createdAt || new Date().toISOString(),
          updatedAt: data.updatedAt?.toDate ? data.updatedAt.toDate().toISOString() : data.updatedAt || new Date().toISOString(),
        });
      });

      // Sort by date or createdAt descending
      incomes.sort((a, b) => new Date(b.date || b.createdAt || 0) - new Date(a.date || a.createdAt || 0));
      return incomes;
    } catch (err) {
      console.error('Error fetching incomes from Firestore:', err);
      return [];
    }
  },

  /**
   * Add a new department income record to Firebase Cloud Firestore
   */
  addIncome: async (incomeData) => {
    const amount = parseFloat(incomeData.amount) || 0;
    if (amount <= 0) {
      throw new Error('Income amount must be greater than 0.');
    }

    if (!incomeData.title || !incomeData.title.trim()) {
      throw new Error('Income title/purpose is required.');
    }

    if (!isFirebaseConfigured() || !db) {
      throw new Error('Firebase Cloud Firestore is not configured.');
    }

    const nowIso = new Date().toISOString();
    const payload = {
      title: incomeData.title.trim(),
      amount: amount,
      source: incomeData.source ? incomeData.source.trim() : 'ECE Department',
      date: incomeData.date || new Date().toISOString().split('T')[0],
      academicYear: incomeData.academicYear || '2025-2026',
      paymentMode: incomeData.paymentMode || 'Cash',
      referenceNumber: incomeData.referenceNumber ? incomeData.referenceNumber.trim() : '',
      receivedBy: incomeData.receivedBy ? incomeData.receivedBy.trim() : 'ECE Staff Coordinator',
      remarks: incomeData.remarks ? incomeData.remarks.trim() : '',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };

    const docRef = await addDoc(collection(db, 'incomes'), payload);

    return {
      id: docRef.id,
      ...payload,
      createdAt: nowIso,
      updatedAt: nowIso,
    };
  },

  /**
   * Delete an income record from Firebase Cloud Firestore
   */
  deleteIncome: async (incomeId) => {
    if (!isFirebaseConfigured() || !db) {
      throw new Error('Firebase Cloud Firestore is not configured.');
    }

    const docRef = doc(db, 'incomes', incomeId);
    await deleteDoc(docRef);
    return true;
  },

  /**
   * Update an income record in Firebase Cloud Firestore
   */
  updateIncome: async (incomeId, updatedData) => {
    const amount = parseFloat(updatedData.amount) || 0;
    if (amount <= 0) {
      throw new Error('Income amount must be greater than 0.');
    }

    if (!isFirebaseConfigured() || !db) {
      throw new Error('Firebase Cloud Firestore is not configured.');
    }

    const nowIso = new Date().toISOString();
    const fieldsToUpdate = {
      title: updatedData.title.trim(),
      amount: amount,
      source: updatedData.source ? updatedData.source.trim() : 'ECE Department',
      date: updatedData.date || new Date().toISOString().split('T')[0],
      academicYear: updatedData.academicYear || '2025-2026',
      paymentMode: updatedData.paymentMode || 'Cash',
      referenceNumber: updatedData.referenceNumber !== undefined ? updatedData.referenceNumber.trim() : '',
      receivedBy: updatedData.receivedBy ? updatedData.receivedBy.trim() : 'ECE Staff Coordinator',
      remarks: updatedData.remarks !== undefined ? updatedData.remarks.trim() : '',
      updatedAt: serverTimestamp(),
    };

    const docRef = doc(db, 'incomes', incomeId);
    await updateDoc(docRef, fieldsToUpdate);

    return { id: incomeId, ...updatedData, ...fieldsToUpdate, updatedAt: nowIso };
  },
};
