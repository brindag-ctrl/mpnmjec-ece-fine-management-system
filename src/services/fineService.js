import { 
  collection, 
  getDocs, 
  getDoc, 
  doc, 
  setDoc,
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy,
  serverTimestamp 
} from 'firebase/firestore';
import { db, isFirebaseConfigured } from './firebase';

export const OFFICIAL_LEDGER_4TH_YEAR_FINES = [
  {
    id: 'fine_ledger_4th_01',
    studentId: 'std_ece_731723106024',
    studentName: 'MANIKANDAN M',
    registerNumber: '731723106024',
    department: 'ECE',
    year: '4th',
    reason: 'OCN syllabus not stick and incomplete note',
    amount: 10,
    status: 'Paid',
    remarks: 'Signed in ledger sheet',
    paidAt: '2025-09-29T10:00:00.000Z',
    createdAt: '2025-09-29T10:00:00.000Z',
  },
  {
    id: 'fine_ledger_4th_02',
    studentId: 'std_ece_731723106001',
    studentName: 'ANANDH M',
    registerNumber: '731723106001',
    department: 'ECE',
    year: '4th',
    reason: 'OCN syllabus not stick and incomplete note',
    amount: 10,
    status: 'Paid',
    remarks: 'Signed in ledger sheet',
    paidAt: '2025-09-29T10:00:00.000Z',
    createdAt: '2025-09-29T10:00:00.000Z',
  },
  {
    id: 'fine_ledger_4th_03',
    studentId: 'std_ece_731723106039',
    studentName: 'SEKAR',
    registerNumber: '731723106039',
    department: 'ECE',
    year: 'Discontinued',
    reason: 'OCN syllabus not stick and incomplete note',
    amount: 10,
    status: 'Paid',
    remarks: 'Signed in ledger sheet',
    paidAt: '2025-09-29T10:00:00.000Z',
    createdAt: '2025-09-29T10:00:00.000Z',
  },
  {
    id: 'fine_ledger_4th_04',
    studentId: 'std_ece_731723106009',
    studentName: 'ENIYAN P',
    registerNumber: '731723106009',
    department: 'ECE',
    year: '4th',
    reason: 'OCN syllabus not stick and incomplete note',
    amount: 10,
    status: 'Paid',
    remarks: 'Signed in ledger sheet',
    paidAt: '2025-09-29T10:00:00.000Z',
    createdAt: '2025-09-29T10:00:00.000Z',
  },
  {
    id: 'fine_ledger_4th_05',
    studentId: 'std_ece_731723106003',
    studentName: 'ARUN KUMAR R B',
    registerNumber: '731723106003',
    department: 'ECE',
    year: '4th',
    reason: 'OCN syllabus not stick and incomplete note',
    amount: 10,
    status: 'Paid',
    remarks: 'Signed in ledger sheet',
    paidAt: '2025-09-29T10:00:00.000Z',
    createdAt: '2025-09-29T10:00:00.000Z',
  },
  {
    id: 'fine_ledger_4th_06',
    studentId: 'std_ece_731723106004',
    studentName: 'BALASUBRAMANIAM R',
    registerNumber: '731723106004',
    department: 'ECE',
    year: '4th',
    reason: 'OCN syllabus not stick and incomplete note',
    amount: 10,
    status: 'Unpaid',
    remarks: 'Pending in ledger sheet',
    paidAt: null,
    createdAt: '2025-09-29T10:00:00.000Z',
  },
  {
    id: 'fine_ledger_4th_07',
    studentId: 'std_ece_731723106023',
    studentName: 'MAHENDHIRAN R',
    registerNumber: '731723106023',
    department: 'ECE',
    year: '4th',
    reason: 'OCN syllabus not stick and incomplete note',
    amount: 10,
    status: 'Paid',
    remarks: 'Signed in ledger sheet',
    paidAt: '2025-09-29T10:00:00.000Z',
    createdAt: '2025-09-29T10:00:00.000Z',
  },
  {
    id: 'fine_ledger_4th_08',
    studentId: 'std_ece_731723106036',
    studentName: 'SANTHAKUMAR P',
    registerNumber: '731723106036',
    department: 'ECE',
    year: '4th',
    reason: 'OCN syllabus not stick and incomplete note',
    amount: 10,
    status: 'Paid',
    remarks: 'Signed in ledger sheet',
    paidAt: '2025-09-29T10:00:00.000Z',
    createdAt: '2025-09-29T10:00:00.000Z',
  },
  {
    id: 'fine_ledger_4th_09',
    studentId: 'std_ece_731723106012',
    studentName: 'GOWRI SHANKAR N G',
    registerNumber: '731723106012',
    department: 'ECE',
    year: '4th',
    reason: 'OCN syllabus not stick and incomplete note',
    amount: 10,
    status: 'Paid',
    remarks: 'Signed in ledger sheet',
    paidAt: '2025-09-29T10:00:00.000Z',
    createdAt: '2025-09-29T10:00:00.000Z',
  },
  {
    id: 'fine_ledger_4th_10',
    studentId: 'std_ece_731723106005',
    studentName: 'DANIEL JACOB D',
    registerNumber: '731723106005',
    department: 'ECE',
    year: '4th',
    reason: 'OCN syllabus not stick and incomplete note',
    amount: 10,
    status: 'Paid',
    remarks: 'Signed in ledger sheet',
    paidAt: '2025-09-29T10:00:00.000Z',
    createdAt: '2025-09-29T10:00:00.000Z',
  },
  {
    id: 'fine_ledger_4th_11',
    studentId: 'std_ece_731723106034',
    studentName: 'RAVINATH S',
    registerNumber: '731723106034',
    department: 'ECE',
    year: '4th',
    reason: 'OCN syllabus not stick and incomplete note',
    amount: 10,
    status: 'Paid',
    remarks: 'Signed in ledger sheet',
    paidAt: '2025-09-29T10:00:00.000Z',
    createdAt: '2025-09-29T10:00:00.000Z',
  },
  {
    id: 'fine_ledger_4th_12',
    studentId: 'std_ece_731723106010',
    studentName: 'GOKULRAJ T',
    registerNumber: '731723106010',
    department: 'ECE',
    year: '4th',
    reason: 'OCN syllabus not stick and incomplete note',
    amount: 10,
    status: 'Paid',
    remarks: 'Signed in ledger sheet',
    paidAt: '2025-09-29T10:00:00.000Z',
    createdAt: '2025-09-29T10:00:00.000Z',
  },
  {
    id: 'fine_ledger_4th_13',
    studentId: 'std_ece_731723106033',
    studentName: 'RAGHU A',
    registerNumber: '731723106033',
    department: 'ECE',
    year: '4th',
    reason: 'OCN syllabus not stick and incomplete note',
    amount: 10,
    status: 'Paid',
    remarks: 'Signed in ledger sheet',
    paidAt: '2025-09-29T10:00:00.000Z',
    createdAt: '2025-09-29T10:00:00.000Z',
  },
  {
    id: 'fine_ledger_4th_14',
    studentId: 'std_ece_731723106018',
    studentName: 'JASMINE J',
    registerNumber: '731723106018',
    department: 'ECE',
    year: '4th',
    reason: 'OCN syllabus not stick and incomplete note',
    amount: 10,
    status: 'Paid',
    remarks: 'Signed in ledger sheet',
    paidAt: '2025-09-29T10:00:00.000Z',
    createdAt: '2025-09-29T10:00:00.000Z',
  },
  {
    id: 'fine_ledger_4th_15',
    studentId: 'std_ece_731723106042',
    studentName: 'SUBA N',
    registerNumber: '731723106042',
    department: 'ECE',
    year: '4th',
    reason: 'OCN syllabus not stick and incomplete note',
    amount: 10,
    status: 'Paid',
    remarks: 'Signed in ledger sheet',
    paidAt: '2025-09-29T10:00:00.000Z',
    createdAt: '2025-09-29T10:00:00.000Z',
  },
  {
    id: 'fine_ledger_4th_16',
    studentId: 'std_ece_731723106014',
    studentName: 'GOWTHAMI K',
    registerNumber: '731723106014',
    department: 'ECE',
    year: '4th',
    reason: 'OCN syllabus not stick and incomplete note',
    amount: 10,
    status: 'Paid',
    remarks: 'Signed in ledger sheet',
    paidAt: '2025-09-29T10:00:00.000Z',
    createdAt: '2025-09-29T10:00:00.000Z',
  },
  {
    id: 'fine_ledger_4th_17',
    studentId: 'std_ece_731723106041',
    studentName: 'SREE DEVIKA S',
    registerNumber: '731723106041',
    department: 'ECE',
    year: '4th',
    reason: 'OCN syllabus not stick and incomplete note',
    amount: 10,
    status: 'Paid',
    remarks: 'Signed in ledger sheet',
    paidAt: '2025-09-29T10:00:00.000Z',
    createdAt: '2025-09-29T10:00:00.000Z',
  },
  {
    id: 'fine_ledger_4th_18',
    studentId: 'std_ece_731723106011',
    studentName: 'GOWRI MANOHARI P',
    registerNumber: '731723106011',
    department: 'ECE',
    year: '4th',
    reason: 'OCN syllabus not stick and incomplete note',
    amount: 10,
    status: 'Paid',
    remarks: 'Signed in ledger sheet',
    paidAt: '2025-09-29T10:00:00.000Z',
    createdAt: '2025-09-29T10:00:00.000Z',
  },
  {
    id: 'fine_ledger_4th_19',
    studentId: 'std_ece_731723106033',
    studentName: 'RAGHU A',
    registerNumber: '731723106033',
    department: 'ECE',
    year: '4th',
    reason: 'OCN syllabus not stick and incomplete note',
    amount: 50,
    status: 'Paid',
    remarks: 'Signed in ledger sheet (Incomplete class note)',
    paidAt: '2025-09-29T10:00:00.000Z',
    createdAt: '2025-09-29T10:00:00.000Z',
  },
  {
    id: 'fine_ledger_4th_20',
    studentId: 'std_ece_731723106004',
    studentName: 'BALASUBRAMANIAM R',
    registerNumber: '731723106004',
    department: 'ECE',
    year: '4th',
    reason: 'OCN syllabus not stick and incomplete note',
    amount: 50,
    status: 'Unpaid',
    remarks: 'Pending in ledger sheet (Incomplete class note)',
    paidAt: null,
    createdAt: '2025-09-29T10:00:00.000Z',
  },
  {
    id: 'fine_ledger_4th_21',
    studentId: 'std_ece_731723106012',
    studentName: 'GOWRI SHANKAR N G',
    registerNumber: '731723106012',
    department: 'ECE',
    year: '4th',
    reason: 'OCN syllabus not stick and incomplete note',
    amount: 50,
    status: 'Paid',
    remarks: 'Signed in ledger sheet (Incomplete class note)',
    paidAt: '2025-09-29T10:00:00.000Z',
    createdAt: '2025-09-29T10:00:00.000Z',
  },
  {
    id: 'fine_ledger_4th_22',
    studentId: 'std_ece_731723106033',
    studentName: 'RAGHU A',
    registerNumber: '731723106033',
    department: 'ECE',
    year: '4th',
    reason: 'OCN syllabus not stick and incomplete note',
    amount: 100,
    status: 'Paid',
    remarks: 'Signed in ledger sheet',
    paidAt: '2025-09-29T10:00:00.000Z',
    createdAt: '2025-09-29T10:00:00.000Z',
  },
  {
    id: 'fine_ledger_4th_23',
    studentId: 'std_ece_731723106033',
    studentName: 'RAGHU A',
    registerNumber: '731723106033',
    department: 'ECE',
    year: '4th',
    reason: 'OCN syllabus not stick and incomplete note',
    amount: 100,
    status: 'Paid',
    remarks: 'Signed in ledger sheet',
    paidAt: '2025-09-29T10:00:00.000Z',
    createdAt: '2025-09-29T10:00:00.000Z',
  },
];

export const fineService = {
  /**
   * Sync official ledger fines to Cloud Firestore
   */
  syncLedgerFinesToFirestore: async () => {
    if (!isFirebaseConfigured() || !db) {
      throw new Error('Firebase Cloud Firestore is not configured.');
    }

    console.log(`⚡ Syncing ${OFFICIAL_LEDGER_4TH_YEAR_FINES.length} 4th Year Ledger Fines to Firestore...`);
    const syncedList = [];

    for (const fine of OFFICIAL_LEDGER_4TH_YEAR_FINES) {
      const docRef = doc(db, 'fines', fine.id);
      const payload = {
        studentId: fine.studentId,
        studentName: fine.studentName,
        registerNumber: fine.registerNumber,
        department: fine.department,
        year: fine.year,
        reason: fine.reason,
        amount: fine.amount,
        status: fine.status,
        remarks: fine.remarks || '',
        paidAt: fine.paidAt || null,
        cancelledAt: null,
        createdAt: fine.createdAt || serverTimestamp(),
        updatedAt: serverTimestamp(),
      };

      await setDoc(docRef, payload, { merge: true });
      syncedList.push({ id: fine.id, ...payload });
    }

    console.log('✅ Successfully synced 4th Year ledger fines to Firestore!');
    return syncedList;
  },

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

    // Auto-sync missing ledger fines to Firestore
    const existingFineIds = new Set(fines.map((f) => f.id));
    const missingFines = OFFICIAL_LEDGER_4TH_YEAR_FINES.filter((f) => !existingFineIds.has(f.id));

    if (missingFines.length > 0) {
      console.log(`⚡ Auto-syncing ${missingFines.length} 4th Year ledger fines directly into Cloud Firestore...`);
      for (const fine of missingFines) {
        const docRef = doc(db, 'fines', fine.id);
        const payload = {
          studentId: fine.studentId,
          studentName: fine.studentName,
          registerNumber: fine.registerNumber,
          department: fine.department,
          year: fine.year,
          reason: fine.reason,
          amount: fine.amount,
          status: fine.status,
          remarks: fine.remarks || '',
          paidAt: fine.paidAt || null,
          cancelledAt: null,
          createdAt: fine.createdAt || new Date().toISOString(),
          updatedAt: serverTimestamp(),
        };
        await setDoc(docRef, payload, { merge: true });
        fines.push({ id: fine.id, ...payload });
      }
    }

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
