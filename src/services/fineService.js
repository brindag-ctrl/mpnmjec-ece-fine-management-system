import { 
  collection, 
  getDocs, 
  getDoc, 
  doc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy,
  serverTimestamp 
} from 'firebase/firestore';
import { db, isFirebaseConfigured } from './firebase';

export const fineService = {
  /**
   * Get all live fines directly from Firebase Cloud Firestore
   */
  getAllFines: async () => {
    if (!isFirebaseConfigured() || !db) {
      throw new Error('Firebase Cloud Firestore is not configured.');
    }

    const q = query(collection(db, 'fines'));
    const querySnapshot = await getDocs(q);
    const fines = [];
    
    querySnapshot.forEach((docSnapshot) => {
      const data = docSnapshot.data();
      fines.push({
        id: docSnapshot.id,
        ...data,
        createdAt: data.createdAt?.toDate ? data.createdAt.toDate().toISOString() : data.createdAt || new Date().toISOString(),
        updatedAt: data.updatedAt?.toDate ? data.updatedAt.toDate().toISOString() : data.updatedAt || new Date().toISOString(),
      });
    });

    // Sort by createdAt descending
    fines.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
    return fines;
  },

  /**
   * Get fines for a specific student directly from Firestore
   */
  getFinesByStudentId: async (studentId) => {
    if (!studentId) return [];
    if (!isFirebaseConfigured() || !db) {
      throw new Error('Firebase Cloud Firestore is not configured.');
    }

    const q = query(
      collection(db, 'fines'), 
      where('studentId', '==', studentId)
    );
    const querySnapshot = await getDocs(q);
    const fines = [];
    
    querySnapshot.forEach((docSnapshot) => {
      const data = docSnapshot.data();
      fines.push({
        id: docSnapshot.id,
        ...data,
        createdAt: data.createdAt?.toDate ? data.createdAt.toDate().toISOString() : data.createdAt || new Date().toISOString(),
        updatedAt: data.updatedAt?.toDate ? data.updatedAt.toDate().toISOString() : data.updatedAt || new Date().toISOString(),
      });
    });

    fines.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
    return fines;
  },

  /**
   * Add a new fine directly to Firebase Cloud Firestore
   */
  addFine: async (fineData) => {
    const amount = parseFloat(fineData.amount) || 0;
    if (amount <= 0) {
      throw new Error('Fine amount must be greater than 0.');
    }

    if (!fineData.studentId || !fineData.studentName) {
      throw new Error('Fine must be associated with a valid student.');
    }

    if (!fineData.reason || !fineData.reason.trim()) {
      throw new Error('Fine reason is required.');
    }

    if (!isFirebaseConfigured() || !db) {
      throw new Error('Firebase Cloud Firestore is not configured.');
    }

    const nowIso = new Date().toISOString();
    const status = fineData.status || 'Unpaid';

    const newFinePayload = {
      studentId: fineData.studentId,
      studentName: fineData.studentName,
      registerNumber: fineData.registerNumber,
      department: 'ECE',
      year: fineData.year,
      reason: fineData.reason.trim(),
      amount: amount,
      status: status,
      remarks: fineData.remarks ? fineData.remarks.trim() : '',
      paidAt: status === 'Paid' ? nowIso : null,
      cancelledAt: status === 'Cancelled' ? nowIso : null,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };

    const docRef = await addDoc(collection(db, 'fines'), newFinePayload);

    return {
      id: docRef.id,
      ...newFinePayload,
      createdAt: nowIso,
      updatedAt: nowIso,
    };
  },

  /**
   * Update fine details in Firebase Cloud Firestore
   */
  updateFine: async (fineId, updatedData) => {
    const amount = parseFloat(updatedData.amount) || 0;
    if (amount <= 0) {
      throw new Error('Fine amount must be greater than 0.');
    }

    if (!isFirebaseConfigured() || !db) {
      throw new Error('Firebase Cloud Firestore is not configured.');
    }

    const status = updatedData.status || 'Unpaid';
    const nowIso = new Date().toISOString();

    const fieldsToUpdate = {
      reason: updatedData.reason.trim(),
      amount: amount,
      status: status,
      remarks: updatedData.remarks !== undefined ? updatedData.remarks.trim() : '',
      paidAt: status === 'Paid' ? (updatedData.paidAt || nowIso) : null,
      cancelledAt: status === 'Cancelled' ? (updatedData.cancelledAt || nowIso) : null,
      updatedAt: serverTimestamp(),
    };

    const docRef = doc(db, 'fines', fineId);
    await updateDoc(docRef, fieldsToUpdate);

    return { id: fineId, ...updatedData, ...fieldsToUpdate, updatedAt: nowIso };
  },

  /**
   * Change fine status directly in Firebase Cloud Firestore
   */
  changeFineStatus: async (fineId, newStatus, remarks = '') => {
    if (!isFirebaseConfigured() || !db) {
      throw new Error('Firebase Cloud Firestore is not configured.');
    }

    const nowIso = new Date().toISOString();
    const updates = {
      status: newStatus,
      paidAt: newStatus === 'Paid' ? nowIso : null,
      cancelledAt: newStatus === 'Cancelled' ? nowIso : null,
      remarks: remarks || '',
      updatedAt: serverTimestamp(),
    };

    const docRef = doc(db, 'fines', fineId);
    await updateDoc(docRef, updates);

    return { id: fineId, ...updates, updatedAt: nowIso };
  },

  /**
   * Delete fine record directly from Firebase Cloud Firestore
   */
  deleteFine: async (fineId) => {
    if (!isFirebaseConfigured() || !db) {
      throw new Error('Firebase Cloud Firestore is not configured.');
    }

    const docRef = doc(db, 'fines', fineId);
    await deleteDoc(docRef);
    return true;
  },
};
