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
  serverTimestamp 
} from 'firebase/firestore';
import { db, isFirebaseConfigured } from './firebase';
import { OFFICIAL_ECE_STUDENTS } from './officialStudents';

export const studentService = {
  /**
   * Sync / Upload all official ECE students directly to Cloud Firestore Database
   */
  syncOfficialStudentsToFirebase: async () => {
    if (!isFirebaseConfigured() || !db) {
      throw new Error('Firebase Cloud Firestore is not configured.');
    }

    console.log(`⚡ Syncing ${OFFICIAL_ECE_STUDENTS.length} Official ECE Students to Cloud Firestore...`);
    const nowIso = new Date().toISOString();
    const syncedList = [];

    for (const std of OFFICIAL_ECE_STUDENTS) {
      const customDocId = 'std_ece_' + std.registerNumber;
      const docRef = doc(db, 'students', customDocId);
      const payload = {
        name: std.name,
        registerNumber: std.registerNumber,
        department: 'ECE',
        year: std.year || '2nd',
        phone: std.phone || '',
        email: std.email || '',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };

      await setDoc(docRef, payload, { merge: true });
      syncedList.push({ id: customDocId, ...payload, createdAt: nowIso, updatedAt: nowIso });
    }

    console.log(`✅ Successfully synced all ${OFFICIAL_ECE_STUDENTS.length} official ECE students to Firestore!`);
    return syncedList;
  },

  /**
   * Get all live students directly from Firebase Firestore
   */
  getAllStudents: async () => {
    if (!isFirebaseConfigured() || !db) {
      throw new Error('Firebase Cloud Firestore is not configured.');
    }

    const q = query(collection(db, 'students'));
    const querySnapshot = await getDocs(q);
    const students = [];
    
    querySnapshot.forEach((docSnapshot) => {
      const data = docSnapshot.data();
      students.push({
        id: docSnapshot.id,
        ...data,
        createdAt: data.createdAt?.toDate ? data.createdAt.toDate().toISOString() : data.createdAt || new Date().toISOString(),
        updatedAt: data.updatedAt?.toDate ? data.updatedAt.toDate().toISOString() : data.updatedAt || new Date().toISOString(),
      });
    });

    // If database is empty, automatically upload official students to Firestore!
    if (students.length === 0) {
      console.log('Firestore students collection empty. Automatically uploading official ECE students to Firestore...');
      return await studentService.syncOfficialStudentsToFirebase();
    }

    // Auto-sync any newly added official students (e.g. Passout-2026 batch) to Firestore
    const existingRegs = new Set(students.map((s) => (s.registerNumber || '').toUpperCase()));
    const missingOfficial = OFFICIAL_ECE_STUDENTS.filter(
      (s) => !existingRegs.has(s.registerNumber.toUpperCase())
    );

    if (missingOfficial.length > 0) {
      console.log(`Syncing ${missingOfficial.length} missing official students to Firestore...`);
      const nowIso = new Date().toISOString();
      for (const std of missingOfficial) {
        const customDocId = 'std_ece_' + std.registerNumber;
        const docRef = doc(db, 'students', customDocId);
        const payload = {
          name: std.name,
          registerNumber: std.registerNumber,
          department: 'ECE',
          year: std.year || '2nd',
          phone: std.phone || '',
          email: std.email || '',
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        };
        try {
          await setDoc(docRef, payload, { merge: true });
          students.push({ id: customDocId, ...payload, createdAt: nowIso, updatedAt: nowIso });
        } catch (syncErr) {
          console.warn(`Could not sync student ${std.registerNumber}:`, syncErr.message);
        }
      }
    }

    // Sort by register number
    students.sort((a, b) => (a.registerNumber || '').localeCompare(b.registerNumber || ''));
    return students;
  },

  /**
   * Get single student by ID directly from Firestore
   */
  getStudentById: async (studentId) => {
    if (!studentId) return null;
    if (!isFirebaseConfigured() || !db) {
      throw new Error('Firebase Cloud Firestore is not configured.');
    }

    const docRef = doc(db, 'students', studentId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const data = docSnap.data();
      return {
        id: docSnap.id,
        ...data,
        createdAt: data.createdAt?.toDate ? data.createdAt.toDate().toISOString() : data.createdAt || new Date().toISOString(),
        updatedAt: data.updatedAt?.toDate ? data.updatedAt.toDate().toISOString() : data.updatedAt || new Date().toISOString(),
      };
    }
    return null;
  },

  /**
   * Check if register number is already registered in Firestore
   */
  isRegisterNumberTaken: async (registerNumber, excludeStudentId = null) => {
    if (!registerNumber) return false;
    const cleanReg = registerNumber.trim().toUpperCase();
    if (!isFirebaseConfigured() || !db) {
      throw new Error('Firebase Cloud Firestore is not configured.');
    }

    const q = query(collection(db, 'students'), where('registerNumber', '==', cleanReg));
    const querySnapshot = await getDocs(q);
    let taken = false;
    querySnapshot.forEach((docSnapshot) => {
      if (docSnapshot.id !== excludeStudentId) {
        taken = true;
      }
    });
    return taken;
  },

  /**
   * Add a new student directly to Firestore
   */
  addStudent: async (studentData) => {
    const cleanReg = (studentData.registerNumber || '').trim().toUpperCase();
    
    // Check duplicates in Firestore
    const isTaken = await studentService.isRegisterNumberTaken(cleanReg);
    if (isTaken) {
      throw new Error(`Register Number "${cleanReg}" is already registered in the system.`);
    }

    if (!isFirebaseConfigured() || !db) {
      throw new Error('Firebase Cloud Firestore is not configured.');
    }

    const nowIso = new Date().toISOString();
    const newStudent = {
      name: studentData.name.trim(),
      registerNumber: cleanReg,
      department: 'ECE',
      year: studentData.year || '2nd',
      phone: studentData.phone ? studentData.phone.trim() : '',
      email: studentData.email ? studentData.email.trim() : '',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };

    const docRef = await addDoc(collection(db, 'students'), newStudent);

    return {
      id: docRef.id,
      ...newStudent,
      createdAt: nowIso,
      updatedAt: nowIso,
    };
  },

  /**
   * Update student details directly in Firestore
   */
  updateStudent: async (studentId, studentData) => {
    const cleanReg = (studentData.registerNumber || '').trim().toUpperCase();

    const isTaken = await studentService.isRegisterNumberTaken(cleanReg, studentId);
    if (isTaken) {
      throw new Error(`Register Number "${cleanReg}" belongs to another student.`);
    }

    if (!isFirebaseConfigured() || !db) {
      throw new Error('Firebase Cloud Firestore is not configured.');
    }

    const nowIso = new Date().toISOString();
    const updatedFields = {
      name: studentData.name.trim(),
      registerNumber: cleanReg,
      department: 'ECE',
      year: studentData.year || '2nd',
      phone: studentData.phone ? studentData.phone.trim() : '',
      updatedAt: serverTimestamp(),
    };

    if (studentData.email !== undefined) {
      updatedFields.email = studentData.email ? studentData.email.trim() : '';
    }

    const docRef = doc(db, 'students', studentId);
    await updateDoc(docRef, updatedFields);

    return { id: studentId, ...updatedFields, updatedAt: nowIso };
  },

  /**
   * Delete student directly from Firestore
   */
  deleteStudent: async (studentId) => {
    if (!isFirebaseConfigured() || !db) {
      throw new Error('Firebase Cloud Firestore is not configured.');
    }

    const docRef = doc(db, 'students', studentId);
    await deleteDoc(docRef);
    return true;
  },

  /**
   * Bulk promote selected students directly in Firestore
   */
  bulkPromoteStudents: async (studentIds, targetYear) => {
    if (!studentIds || studentIds.length === 0) return [];
    if (!isFirebaseConfigured() || !db) {
      throw new Error('Firebase Cloud Firestore is not configured.');
    }

    const nowIso = new Date().toISOString();
    for (const sId of studentIds) {
      const docRef = doc(db, 'students', sId);
      await updateDoc(docRef, {
        year: targetYear,
        updatedAt: serverTimestamp(),
      });
    }

    return studentIds.map((sId) => ({ id: sId, year: targetYear, updatedAt: nowIso }));
  },

  /**
   * Bulk delete selected students directly from Firestore
   */
  bulkDeleteStudents: async (studentIds) => {
    if (!studentIds || studentIds.length === 0) return true;
    if (!isFirebaseConfigured() || !db) {
      throw new Error('Firebase Cloud Firestore is not configured.');
    }

    for (const sId of studentIds) {
      const docRef = doc(db, 'students', sId);
      await deleteDoc(docRef);
    }

    return true;
  },
};
