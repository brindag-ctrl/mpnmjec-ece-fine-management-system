import { 
  collection, 
  getDocs, 
  getDoc, 
  doc, 
  setDoc, 
  updateDoc, 
  deleteDoc,
  serverTimestamp 
} from 'firebase/firestore';
import { db, isFirebaseConfigured } from './firebase';

export const INITIAL_ACADEMIC_YEARS = [
  {
    id: 'ay_2024_2025',
    academicYear: '2024-2025',
    label: '2024 - 2025 (Closed)',
    status: 'Closed', // 'Active' | 'Closed' | 'Upcoming'
    isClosed: true,
    isConsolidated: true,
    totalFineAmount: 33250,
    paidAmount: 33150,
    pendingAmount: 100,
    cancelledAmount: 0,
    totalSpendings: 0,
    netTreasury: 33150,
    finesCount: 450, // Approx historical entries
    paidCount: 449,
    unpaidCount: 1, // 1 pending fine for YASMINE S (₹100)
    cancelledCount: 0,
    remarks: 'Official Consolidated Annual Disciplinary Ledger for AY 2024-2025 (Pending fine: ₹100 for YASMINE S - 731722106052)',
    closedAt: '2025-05-31T23:59:59.000Z',
    createdAt: '2024-06-01T00:00:00.000Z',
  },
  {
    id: 'ay_2025_2026',
    academicYear: '2025-2026',
    label: '2025 - 2026 (Active)',
    status: 'Active',
    isClosed: false,
    isConsolidated: false,
    remarks: 'Current Live Academic Year',
    createdAt: '2025-06-01T00:00:00.000Z',
  },
  {
    id: 'ay_2026_2027',
    academicYear: '2026-2027',
    label: '2026 - 2027 (Upcoming)',
    status: 'Upcoming',
    isClosed: false,
    isConsolidated: false,
    remarks: 'Upcoming Academic Year (Starting in ~3 months)',
    createdAt: '2026-06-01T00:00:00.000Z',
  }
];

const COLLECTION_NAME = 'academic_years';

export const academicYearService = {
  // Fetch all academic years from Cloud Firestore or initialize defaults
  async getAllAcademicYears() {
    if (!isFirebaseConfigured || !db) {
      return INITIAL_ACADEMIC_YEARS;
    }

    try {
      const snap = await getDocs(collection(db, COLLECTION_NAME));
      if (snap.empty) {
        // Initialize Firestore with default academic years
        for (const ay of INITIAL_ACADEMIC_YEARS) {
          await setDoc(doc(db, COLLECTION_NAME, ay.id), {
            ...ay,
            updatedAt: serverTimestamp(),
          });
        }
        return INITIAL_ACADEMIC_YEARS;
      }

      const years = [];
      snap.forEach((docSnap) => {
        years.push({ id: docSnap.id, ...docSnap.data() });
      });

      // Ensure 2024-2025, 2025-2026, 2026-2027 exist
      const existingIds = new Set(years.map((y) => y.id || y.academicYear));
      for (const defaultAY of INITIAL_ACADEMIC_YEARS) {
        if (!existingIds.has(defaultAY.id) && !existingIds.has(defaultAY.academicYear)) {
          await setDoc(doc(db, COLLECTION_NAME, defaultAY.id), {
            ...defaultAY,
            updatedAt: serverTimestamp(),
          });
          years.push(defaultAY);
        }
      }

      // Sort chronological
      return years.sort((a, b) => a.academicYear.localeCompare(b.academicYear));
    } catch (err) {
      console.warn('Firestore academic years fetch failed, using defaults:', err);
      return INITIAL_ACADEMIC_YEARS;
    }
  },

  // Close an academic year and lock its financials
  async closeAcademicYear(academicYearId, summaryData) {
    const updatePayload = {
      isClosed: true,
      status: 'Closed',
      closedAt: new Date().toISOString(),
      ...summaryData,
      updatedAt: serverTimestamp(),
    };

    if (isFirebaseConfigured && db) {
      try {
        await updateDoc(doc(db, COLLECTION_NAME, academicYearId), updatePayload);
      } catch (err) {
        console.error('Failed to close academic year in Firestore:', err);
      }
    }

    return { id: academicYearId, ...updatePayload };
  },

  // Activate / Roll over to a new academic year
  async activateAcademicYear(academicYearId) {
    if (isFirebaseConfigured && db) {
      try {
        await updateDoc(doc(db, COLLECTION_NAME, academicYearId), {
          status: 'Active',
          isClosed: false,
          activatedAt: new Date().toISOString(),
          updatedAt: serverTimestamp(),
        });
      } catch (err) {
        console.error('Failed to activate academic year in Firestore:', err);
      }
    }
  },

  // Create a new academic year entry
  async createAcademicYear(yearData) {
    const id = `ay_${yearData.academicYear.replace(/[^0-9]/g, '_')}`;
    const payload = {
      id,
      academicYear: yearData.academicYear,
      label: `${yearData.academicYear} (${yearData.status || 'Upcoming'})`,
      status: yearData.status || 'Upcoming',
      isClosed: false,
      remarks: yearData.remarks || '',
      createdAt: new Date().toISOString(),
      updatedAt: serverTimestamp(),
    };

    if (isFirebaseConfigured && db) {
      await setDoc(doc(db, COLLECTION_NAME, id), payload);
    }

    return payload;
  }
};
