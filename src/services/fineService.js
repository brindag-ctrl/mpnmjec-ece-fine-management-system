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
  serverTimestamp 
} from 'firebase/firestore';
import { db, isFirebaseConfigured } from './firebase';

const LOCAL_STORAGE_FINES_KEY = 'mpnmjec_ece_fines_db';

const getLocalFines = () => {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_FINES_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (err) {
    console.error('Error accessing local fines:', err);
  }
  return [];
};

const saveLocalFines = (fines) => {
  try {
    localStorage.setItem(LOCAL_STORAGE_FINES_KEY, JSON.stringify(fines));
  } catch (err) {
    console.error('Error saving local fines:', err);
  }
};

export const fineService = {
  /**
   * Get all live fines directly from Firebase Firestore (with graceful fallback)
   */
  getAllFines: async () => {
    if (isFirebaseConfigured() && db) {
      try {
        const q = query(collection(db, 'fines'));
        const querySnapshot = await getDocs(q);
        const fines = [];
        querySnapshot.forEach((doc) => {
          fines.push({ id: doc.id, ...doc.data() });
        });

        // Sort by createdAt descending
        fines.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
        saveLocalFines(fines);
        return fines;
      } catch (err) {
        console.warn('Firestore fetch fines notice (using local storage):', err.message);
        return getLocalFines();
      }
    }
    return getLocalFines();
  },

  /**
   * Get fines for a specific student from Firestore
   */
  getFinesByStudentId: async (studentId) => {
    if (!studentId) return [];

    if (isFirebaseConfigured() && db) {
      try {
        const q = query(
          collection(db, 'fines'), 
          where('studentId', '==', studentId)
        );
        const querySnapshot = await getDocs(q);
        const fines = [];
        querySnapshot.forEach((doc) => {
          fines.push({ id: doc.id, ...doc.data() });
        });
        fines.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
        return fines;
      } catch (err) {
        console.warn('Firestore getFinesByStudentId notice:', err.message);
      }
    }

    const localList = getLocalFines();
    return localList.filter((f) => f.studentId === studentId);
  },

  /**
   * Add a new fine directly to Firestore
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

    const nowIso = new Date().toISOString();
    const status = fineData.status || 'Unpaid';

    const newFine = {
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
      createdAt: nowIso,
      updatedAt: nowIso,
    };

    let generatedId = 'FINE-' + new Date().getFullYear() + '-' + Math.floor(1000 + Math.random() * 9000);

    if (isFirebaseConfigured() && db) {
      try {
        const docRef = await addDoc(collection(db, 'fines'), {
          ...newFine,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
        generatedId = docRef.id;
      } catch (err) {
        console.warn('Firestore add fine permission error:', err.message);
        if (err.code === 'permission-denied' || err.message.includes('permission')) {
          throw new Error('Firebase Firestore Rules locked! In Firebase Console > Firestore Database > Rules, set "allow read, write: if true;"');
        }
        throw err;
      }
    }

    const fineWithId = { id: generatedId, ...newFine };
    const currentList = getLocalFines();
    saveLocalFines([fineWithId, ...currentList]);

    return fineWithId;
  },

  /**
   * Update fine details in Firestore
   */
  updateFine: async (fineId, updatedData) => {
    const amount = parseFloat(updatedData.amount) || 0;
    if (amount <= 0) {
      throw new Error('Fine amount must be greater than 0.');
    }

    const currentList = getLocalFines();
    const existing = currentList.find((f) => f.id === fineId);

    const status = updatedData.status || existing?.status || 'Unpaid';
    const nowIso = new Date().toISOString();

    const fieldsToUpdate = {
      reason: updatedData.reason.trim(),
      amount: amount,
      status: status,
      remarks: updatedData.remarks !== undefined ? updatedData.remarks.trim() : (existing?.remarks || ''),
      paidAt: status === 'Paid' ? (existing?.paidAt || nowIso) : null,
      cancelledAt: status === 'Cancelled' ? (existing?.cancelledAt || nowIso) : null,
      updatedAt: nowIso,
    };

    if (isFirebaseConfigured() && db) {
      try {
        const docRef = doc(db, 'fines', fineId);
        await updateDoc(docRef, {
          ...fieldsToUpdate,
          updatedAt: serverTimestamp(),
        });
      } catch (err) {
        console.warn('Firestore update fine notice:', err.message);
      }
    }

    const updatedList = currentList.map((f) =>
      f.id === fineId ? { ...f, ...fieldsToUpdate } : f
    );
    saveLocalFines(updatedList);

    return { id: fineId, ...(existing || {}), ...fieldsToUpdate };
  },

  /**
   * Change fine status directly in Firestore
   */
  changeFineStatus: async (fineId, newStatus, remarks = '') => {
    const currentList = getLocalFines();
    const existing = currentList.find((f) => f.id === fineId);

    const nowIso = new Date().toISOString();
    const updates = {
      status: newStatus,
      paidAt: newStatus === 'Paid' ? nowIso : null,
      cancelledAt: newStatus === 'Cancelled' ? nowIso : null,
      remarks: remarks || existing?.remarks || '',
      updatedAt: nowIso,
    };

    if (isFirebaseConfigured() && db) {
      try {
        const docRef = doc(db, 'fines', fineId);
        await updateDoc(docRef, {
          ...updates,
          updatedAt: serverTimestamp(),
        });
      } catch (err) {
        console.warn('Firestore change status notice:', err.message);
      }
    }

    const updatedList = currentList.map((f) =>
      f.id === fineId ? { ...f, ...updates } : f
    );
    saveLocalFines(updatedList);

    return { id: fineId, ...(existing || {}), ...updates };
  },

  /**
   * Delete fine record directly from Firestore
   */
  deleteFine: async (fineId) => {
    if (isFirebaseConfigured() && db) {
      try {
        const docRef = doc(db, 'fines', fineId);
        await deleteDoc(docRef);
      } catch (err) {
        console.warn('Firestore delete fine notice:', err.message);
      }
    }

    const currentList = getLocalFines();
    const filteredList = currentList.filter((f) => f.id !== fineId);
    saveLocalFines(filteredList);

    return true;
  },
};
