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

const LOCAL_STORAGE_STUDENTS_KEY = 'mpnmjec_ece_students_db';

const getLocalStudents = () => {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_STUDENTS_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (err) {
    console.error('Error accessing local students:', err);
  }
  return [...OFFICIAL_ECE_STUDENTS];
};

const saveLocalStudents = (students) => {
  try {
    localStorage.setItem(LOCAL_STORAGE_STUDENTS_KEY, JSON.stringify(students));
  } catch (err) {
    console.error('Error saving local students:', err);
  }
};

export const studentService = {
  /**
   * Sync / Upload all 53 official 2nd Year ECE students directly to Cloud Firestore Database
   */
  syncOfficialStudentsToFirebase: async () => {
    if (isFirebaseConfigured() && db) {
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
          createdAt: nowIso,
          updatedAt: nowIso,
        };

        await setDoc(docRef, {
          ...payload,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        }, { merge: true });

        syncedList.push({ id: customDocId, ...payload });
      }

      saveLocalStudents(syncedList);
      console.log(`✅ Successfully synced all ${OFFICIAL_ECE_STUDENTS.length} official ECE students (2nd, 3rd, 4th Year) to Firestore!`);
      return syncedList;
    }

    saveLocalStudents(OFFICIAL_ECE_STUDENTS);
    return OFFICIAL_ECE_STUDENTS;
  },

  /**
   * Get all live students from Firebase Firestore
   */
  getAllStudents: async () => {
    if (isFirebaseConfigured() && db) {
      try {
        const q = query(collection(db, 'students'));
        const querySnapshot = await getDocs(q);
        const students = [];
        querySnapshot.forEach((doc) => {
          students.push({ id: doc.id, ...doc.data() });
        });

        // If database is empty, automatically upload official students to Firestore!
        if (students.length === 0) {
          console.log('Database empty. Automatically uploading official ECE students to Firestore...');
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
        saveLocalStudents(students);
        return students;
      } catch (err) {
        console.warn('Firestore fetch students notice (using local storage):', err.message);
        return getLocalStudents();
      }
    }
    return getLocalStudents();
  },

  /**
   * Get single student by ID
   */
  getStudentById: async (studentId) => {
    if (!studentId) return null;

    if (isFirebaseConfigured() && db) {
      try {
        const docRef = doc(db, 'students', studentId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          return { id: docSnap.id, ...docSnap.data() };
        }
      } catch (err) {
        console.warn('Firestore single student fetch notice:', err.message);
      }
    }

    const localList = getLocalStudents();
    return localList.find((s) => s.id === studentId) || null;
  },

  /**
   * Check if register number is already registered in Firestore
   */
  isRegisterNumberTaken: async (registerNumber, excludeStudentId = null) => {
    if (!registerNumber) return false;
    const cleanReg = registerNumber.trim().toUpperCase();

    if (isFirebaseConfigured() && db) {
      try {
        const q = query(collection(db, 'students'), where('registerNumber', '==', cleanReg));
        const querySnapshot = await getDocs(q);
        let taken = false;
        querySnapshot.forEach((doc) => {
          if (doc.id !== excludeStudentId) {
            taken = true;
          }
        });
        if (taken) return true;
      } catch (err) {
        console.warn('Firestore register check notice:', err.message);
      }
    }

    const localList = getLocalStudents();
    return localList.some(
      (s) => s.registerNumber.trim().toUpperCase() === cleanReg && s.id !== excludeStudentId
    );
  },

  /**
   * Add a new student directly to Firestore
   */
  addStudent: async (studentData) => {
    const cleanReg = (studentData.registerNumber || '').trim().toUpperCase();
    
    // Check duplicates
    const isTaken = await studentService.isRegisterNumberTaken(cleanReg);
    if (isTaken) {
      throw new Error(`Register Number "${cleanReg}" is already registered in the system.`);
    }

    const nowIso = new Date().toISOString();
    const newStudent = {
      name: studentData.name.trim(),
      registerNumber: cleanReg,
      department: 'ECE',
      year: studentData.year || '2nd',
      phone: studentData.phone ? studentData.phone.trim() : '',
      createdAt: nowIso,
      updatedAt: nowIso,
    };

    let generatedId = 'std_' + Date.now();

    if (isFirebaseConfigured() && db) {
      try {
        const docRef = await addDoc(collection(db, 'students'), {
          ...newStudent,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
        generatedId = docRef.id;
      } catch (err) {
        console.warn('Firestore add student permission error:', err.message);
        if (err.code === 'permission-denied' || err.message.includes('permission')) {
          throw new Error('Firebase Firestore Rules locked! In Firebase Console > Firestore Database > Rules, set "allow read, write: if true;"');
        }
        throw err;
      }
    }

    const studentWithId = { id: generatedId, ...newStudent };
    const currentList = getLocalStudents();
    saveLocalStudents([studentWithId, ...currentList]);

    return studentWithId;
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

    const nowIso = new Date().toISOString();
    const updatedFields = {
      name: studentData.name.trim(),
      registerNumber: cleanReg,
      department: 'ECE',
      year: studentData.year || '2nd',
      phone: studentData.phone ? studentData.phone.trim() : '',
      updatedAt: nowIso,
    };

    if (isFirebaseConfigured() && db) {
      try {
        const docRef = doc(db, 'students', studentId);
        await updateDoc(docRef, {
          ...updatedFields,
          updatedAt: serverTimestamp(),
        });
      } catch (err) {
        console.warn('Firestore update student notice:', err.message);
      }
    }

    const currentList = getLocalStudents();
    const updatedList = currentList.map((s) =>
      s.id === studentId ? { ...s, ...updatedFields } : s
    );
    saveLocalStudents(updatedList);

    return { id: studentId, ...updatedFields };
  },

  /**
   * Delete student from Firestore
   */
  deleteStudent: async (studentId) => {
    if (isFirebaseConfigured() && db) {
      try {
        const docRef = doc(db, 'students', studentId);
        await deleteDoc(docRef);
      } catch (err) {
        console.warn('Firestore delete student notice:', err.message);
      }
    }

    const currentList = getLocalStudents();
    const filteredList = currentList.filter((s) => s.id !== studentId);
    saveLocalStudents(filteredList);

    return true;
  },

  /**
   * Bulk promote selected students to a target year
   */
  bulkPromoteStudents: async (studentIds, targetYear) => {
    if (!studentIds || studentIds.length === 0) return [];
    const nowIso = new Date().toISOString();

    if (isFirebaseConfigured() && db) {
      try {
        for (const sId of studentIds) {
          const docRef = doc(db, 'students', sId);
          await updateDoc(docRef, {
            year: targetYear,
            updatedAt: serverTimestamp(),
          });
        }
      } catch (err) {
        console.warn('Firestore bulk promote notice:', err.message);
      }
    }

    const currentList = getLocalStudents();
    const updatedList = currentList.map((s) =>
      studentIds.includes(s.id) ? { ...s, year: targetYear, updatedAt: nowIso } : s
    );
    saveLocalStudents(updatedList);
    return updatedList;
  },

  /**
   * Bulk delete selected students from Firestore & local database
   */
  bulkDeleteStudents: async (studentIds) => {
    if (!studentIds || studentIds.length === 0) return true;

    if (isFirebaseConfigured() && db) {
      try {
        for (const sId of studentIds) {
          const docRef = doc(db, 'students', sId);
          await deleteDoc(docRef);
        }
      } catch (err) {
        console.warn('Firestore bulk delete notice:', err.message);
      }
    }

    const currentList = getLocalStudents();
    const filteredList = currentList.filter((s) => !studentIds.includes(s.id));
    saveLocalStudents(filteredList);
    return true;
  },
};

