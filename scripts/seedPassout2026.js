import { initializeApp } from 'firebase/app';
import { getFirestore, collection, doc, setDoc, getDocs, serverTimestamp } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyCQ9St8Kq0GmJ-hFmwT5R4hj95PdcH8HPk",
  authDomain: "mpnmjec-ece-fines.firebaseapp.com",
  projectId: "mpnmjec-ece-fines",
  storageBucket: "mpnmjec-ece-fines.firebasestorage.app",
  messagingSenderId: "731005904218",
  appId: "1:731005904218:web:0828bd14d6c16c0df93f63"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const PASSOUT_2026_STUDENTS = [
  { registerNumber: '731722106001', name: 'AJAY T', year: 'Passout-2026', department: 'ECE', phone: '', email: '22ECE001@mpnmjec.ac.in' },
  { registerNumber: '731722106002', name: 'ASWINI K', year: 'Passout-2026', department: 'ECE', phone: '', email: '22ECE002@mpnmjec.ac.in' },
  { registerNumber: '731722106003', name: 'BALA A P', year: 'Passout-2026', department: 'ECE', phone: '', email: '22ECE003@mpnmjec.ac.in' },
  { registerNumber: '731722106004', name: 'CHANDRU S', year: 'Passout-2026', department: 'ECE', phone: '', email: '22ECE004@mpnmjec.ac.in' },
  { registerNumber: '731722106005', name: 'DEEPAK I', year: 'Passout-2026', department: 'ECE', phone: '', email: '22ECE005@mpnmjec.ac.in' },
  { registerNumber: '731722106006', name: 'DEVADHARSHINI M L', year: 'Passout-2026', department: 'ECE', phone: '', email: '22ECE006@mpnmjec.ac.in' },
  { registerNumber: '731722106007', name: 'DHANUSHKODI S', year: 'Passout-2026', department: 'ECE', phone: '', email: '22ECE007@mpnmjec.ac.in' },
  { registerNumber: '731722106008', name: 'DURAISAMY S A', year: 'Passout-2026', department: 'ECE', phone: '', email: '22ECE008@mpnmjec.ac.in' },
  { registerNumber: '731722106009', name: 'ELAMATHI P', year: 'Passout-2026', department: 'ECE', phone: '', email: '22ECE009@mpnmjec.ac.in' },
  { registerNumber: '731722106010', name: 'GNANA PRAKASH A', year: 'Passout-2026', department: 'ECE', phone: '', email: '22ECE010@mpnmjec.ac.in' },
  { registerNumber: '731722106011', name: 'JAYAVARTHINI M', year: 'Passout-2026', department: 'ECE', phone: '', email: '22ECE011@mpnmjec.ac.in' },
  { registerNumber: '731722106012', name: 'KANIMOZHI V', year: 'Passout-2026', department: 'ECE', phone: '', email: '22ECE012@mpnmjec.ac.in' },
  { registerNumber: '731722106013', name: 'KARTHIKA M', year: 'Passout-2026', department: 'ECE', phone: '', email: '22ECE013@mpnmjec.ac.in' },
  { registerNumber: '731722106014', name: 'KATHIRAVAN M', year: 'Passout-2026', department: 'ECE', phone: '', email: '22ECE014@mpnmjec.ac.in' },
  { registerNumber: '731722106015', name: 'KATHIRAVAN S M', year: 'Passout-2026', department: 'ECE', phone: '', email: '22ECE015@mpnmjec.ac.in' },
  { registerNumber: '731722106016', name: 'KAVINKUMAR S', year: 'Passout-2026', department: 'ECE', phone: '', email: '22ECE016@mpnmjec.ac.in' },
  { registerNumber: '731722106017', name: 'KAVIYA S', year: 'Passout-2026', department: 'ECE', phone: '', email: '22ECE017@mpnmjec.ac.in' },
  { registerNumber: '731722106018', name: 'MAHASRI S', year: 'Passout-2026', department: 'ECE', phone: '', email: '22ECE018@mpnmjec.ac.in' },
  { registerNumber: '731722106019', name: 'MANIKANDAN A', year: 'Passout-2026', department: 'ECE', phone: '', email: '22ECE019@mpnmjec.ac.in' },
  { registerNumber: '731722106020', name: 'MEIYARASAN R', year: 'Passout-2026', department: 'ECE', phone: '', email: '22ECE020@mpnmjec.ac.in' },
  { registerNumber: '731722106021', name: 'MEKANTHIKA S', year: 'Passout-2026', department: 'ECE', phone: '', email: '22ECE021@mpnmjec.ac.in' },
  { registerNumber: '731722106023', name: 'MURUGESAN S D', year: 'Passout-2026', department: 'ECE', phone: '', email: '22ECE023@mpnmjec.ac.in' },
  { registerNumber: '731722106024', name: 'MYTHILI R', year: 'Passout-2026', department: 'ECE', phone: '', email: '22ECE024@mpnmjec.ac.in' },
  { registerNumber: '731722106025', name: 'NAGUL D R', year: 'Passout-2026', department: 'ECE', phone: '', email: '22ECE025@mpnmjec.ac.in' },
  { registerNumber: '731722106026', name: 'NARMATHA R', year: 'Passout-2026', department: 'ECE', phone: '', email: '22ECE026@mpnmjec.ac.in' },
  { registerNumber: '731722106027', name: 'NAVEENA K', year: 'Passout-2026', department: 'ECE', phone: '', email: '22ECE027@mpnmjec.ac.in' },
  { registerNumber: '731722106028', name: 'PARAMAGURU S', year: 'Passout-2026', department: 'ECE', phone: '', email: '22ECE028@mpnmjec.ac.in' },
  { registerNumber: '731722106030', name: 'PONSANKAR M', year: 'Passout-2026', department: 'ECE', phone: '', email: '22ECE030@mpnmjec.ac.in' },
  { registerNumber: '731722106031', name: 'RANJANI S', year: 'Passout-2026', department: 'ECE', phone: '', email: '22ECE031@mpnmjec.ac.in' },
  { registerNumber: '731722106032', name: 'RATHNAVEL V', year: 'Passout-2026', department: 'ECE', phone: '', email: '22ECE032@mpnmjec.ac.in' },
  { registerNumber: '731722106033', name: 'RITHIKA S', year: 'Passout-2026', department: 'ECE', phone: '', email: '22ECE033@mpnmjec.ac.in' },
  { registerNumber: '731722106034', name: 'RITHIKA SHREE Y', year: 'Passout-2026', department: 'ECE', phone: '', email: '22ECE034@mpnmjec.ac.in' },
  { registerNumber: '731722106036', name: 'SAMEEN AFROSE M', year: 'Passout-2026', department: 'ECE', phone: '', email: '22ECE036@mpnmjec.ac.in' },
  { registerNumber: '731722106037', name: 'SANDHIYA S', year: 'Passout-2026', department: 'ECE', phone: '', email: '22ECE037@mpnmjec.ac.in' },
  { registerNumber: '731722106038', name: 'SARAN .N', year: 'Passout-2026', department: 'ECE', phone: '', email: '22ECE038@mpnmjec.ac.in' },
  { registerNumber: '731722106039', name: 'SASIKANTH J', year: 'Passout-2026', department: 'ECE', phone: '', email: '22ECE039@mpnmjec.ac.in' },
  { registerNumber: '731722106041', name: 'SHALINI A', year: 'Passout-2026', department: 'ECE', phone: '', email: '22ECE041@mpnmjec.ac.in' },
  { registerNumber: '731722106042', name: 'SRIDHAR S V', year: 'Passout-2026', department: 'ECE', phone: '', email: '22ECE042@mpnmjec.ac.in' },
  { registerNumber: '731722106043', name: 'SUDHARSAN S', year: 'Passout-2026', department: 'ECE', phone: '', email: '22ECE043@mpnmjec.ac.in' },
  { registerNumber: '731722106044', name: 'TAMILSELVAN K', year: 'Passout-2026', department: 'ECE', phone: '', email: '22ECE044@mpnmjec.ac.in' },
  { registerNumber: '731722106045', name: 'TAMILSELVAN O K', year: 'Passout-2026', department: 'ECE', phone: '', email: '22ECE045@mpnmjec.ac.in' },
  { registerNumber: '731722106046', name: 'THILAGAVATHI D', year: 'Passout-2026', department: 'ECE', phone: '', email: '22ECE046@mpnmjec.ac.in' },
  { registerNumber: '731722106047', name: 'THIRUMOORTHY S A', year: 'Passout-2026', department: 'ECE', phone: '', email: '22ECE047@mpnmjec.ac.in' },
  { registerNumber: '731722106048', name: 'VELAYUTHAM S', year: 'Passout-2026', department: 'ECE', phone: '', email: '22ECE048@mpnmjec.ac.in' },
  { registerNumber: '731722106049', name: 'VIGNESWARI', year: 'Passout-2026', department: 'ECE', phone: '', email: '22ECE049@mpnmjec.ac.in' },
  { registerNumber: '731722106051', name: 'VINITHA S', year: 'Passout-2026', department: 'ECE', phone: '', email: '22ECE051@mpnmjec.ac.in' },
  { registerNumber: '731722106052', name: 'YASMINE S', year: 'Passout-2026', department: 'ECE', phone: '', email: '22ECE052@mpnmjec.ac.in' },
];

async function seed() {
  console.log(`Starting seed of ${PASSOUT_2026_STUDENTS.length} Passout-2026 students into Firestore...`);
  
  // First fetch existing students to avoid duplicates
  const studentsCol = collection(db, 'students');
  const snap = await getDocs(studentsCol);
  const existingMap = new Map();
  snap.forEach(d => {
    const data = d.data();
    if (data.registerNumber) {
      existingMap.set(data.registerNumber.toUpperCase(), d.id);
    }
  });

  console.log(`Existing students in DB: ${existingMap.size}`);

  let added = 0;
  let updated = 0;

  for (const s of PASSOUT_2026_STUDENTS) {
    const regUpper = s.registerNumber.toUpperCase();
    if (existingMap.has(regUpper)) {
      const docId = existingMap.get(regUpper);
      await setDoc(doc(db, 'students', docId), {
        ...s,
        updatedAt: serverTimestamp()
      }, { merge: true });
      updated++;
      console.log(`Updated existing student: ${s.name} (${s.registerNumber})`);
    } else {
      const docRef = doc(collection(db, 'students'));
      await setDoc(docRef, {
        ...s,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      added++;
      console.log(`Added new Passout-2026 student: ${s.name} (${s.registerNumber})`);
    }
  }

  console.log(`\n=== SEED COMPLETED ===`);
  console.log(`Added: ${added}`);
  console.log(`Updated: ${updated}`);
  console.log(`Total Passout-2026 processed: ${PASSOUT_2026_STUDENTS.length}`);
}

seed().catch(err => {
  console.error("Error during seed:", err);
  process.exit(1);
});
