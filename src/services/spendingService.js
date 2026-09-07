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

export const spendingService = {
  /**
   * Get all spendings directly from Firebase Cloud Firestore
   */
  getAllSpendings: async () => {
    if (!isFirebaseConfigured() || !db) {
      throw new Error('Firebase Cloud Firestore is not configured.');
    }

    const q = query(collection(db, 'spendings'));
    const querySnapshot = await getDocs(q);
    const spendings = [];

    querySnapshot.forEach((docSnapshot) => {
      const data = docSnapshot.data();
      spendings.push({
        id: docSnapshot.id,
        ...data,
        amount: parseFloat(data.amount) || 0,
        createdAt: data.createdAt?.toDate ? data.createdAt.toDate().toISOString() : data.createdAt || new Date().toISOString(),
        updatedAt: data.updatedAt?.toDate ? data.updatedAt.toDate().toISOString() : data.updatedAt || new Date().toISOString(),
      });
    });

    // Sort by date or createdAt descending
    spendings.sort((a, b) => new Date(b.date || b.createdAt || 0) - new Date(a.date || a.createdAt || 0));
    return spendings;
  },

  /**
   * Add a new spending record to Firebase Cloud Firestore
   */
  addSpending: async (spendingData) => {
    const amount = parseFloat(spendingData.amount) || 0;
    if (amount <= 0) {
      throw new Error('Spending amount must be greater than 0.');
    }

    if (!spendingData.title || !spendingData.title.trim()) {
      throw new Error('Spending item or reason is required.');
    }

    if (!isFirebaseConfigured() || !db) {
      throw new Error('Firebase Cloud Firestore is not configured.');
    }

    const nowIso = new Date().toISOString();
    const payload = {
      title: spendingData.title.trim(),
      amount: amount,
      category: spendingData.category || 'General',
      date: spendingData.date || new Date().toISOString().split('T')[0],
      spentBy: spendingData.spentBy ? spendingData.spentBy.trim() : 'ECE Dept',
      remarks: spendingData.remarks ? spendingData.remarks.trim() : '',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };

    const docRef = await addDoc(collection(db, 'spendings'), payload);

    return {
      id: docRef.id,
      ...payload,
      createdAt: nowIso,
      updatedAt: nowIso,
    };
  },

  /**
   * Delete a spending record from Firebase Cloud Firestore
   */
  deleteSpending: async (spendingId) => {
    if (!isFirebaseConfigured() || !db) {
      throw new Error('Firebase Cloud Firestore is not configured.');
    }

    const docRef = doc(db, 'spendings', spendingId);
    await deleteDoc(docRef);
    return true;
  },

  /**
   * Update a spending record in Firebase Cloud Firestore
   */
  updateSpending: async (spendingId, updatedData) => {
    const amount = parseFloat(updatedData.amount) || 0;
    if (amount <= 0) {
      throw new Error('Spending amount must be greater than 0.');
    }

    if (!isFirebaseConfigured() || !db) {
      throw new Error('Firebase Cloud Firestore is not configured.');
    }

    const nowIso = new Date().toISOString();
    const fieldsToUpdate = {
      title: updatedData.title.trim(),
      amount: amount,
      category: updatedData.category || 'General',
      date: updatedData.date || new Date().toISOString().split('T')[0],
      spentBy: updatedData.spentBy ? updatedData.spentBy.trim() : 'ECE Dept',
      remarks: updatedData.remarks !== undefined ? updatedData.remarks.trim() : '',
      updatedAt: serverTimestamp(),
    };

    const docRef = doc(db, 'spendings', spendingId);
    await updateDoc(docRef, fieldsToUpdate);

    return { id: spendingId, ...updatedData, ...fieldsToUpdate, updatedAt: nowIso };
  },
};
