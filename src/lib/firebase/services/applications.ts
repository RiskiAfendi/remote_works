import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  query,
  orderBy,
  Timestamp,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from '../config';
import { Application, CreateApplicationData } from '@/lib/types';

const COLLECTION_NAME = 'applications';

/**
 * Helper untuk mengonversi data dokumen Firestore menjadi objek Application
 */
const docToApplication = (id: string, data: Record<string, unknown>): Application => {
  const parseDate = (val: unknown): Date => {
    if (!val) return new Date();
    if (typeof (val as { toDate?: () => Date }).toDate === 'function') {
      return (val as { toDate: () => Date }).toDate();
    }
    if (val instanceof Date) return val;
    if (typeof val === 'string' || typeof val === 'number') return new Date(val);
    return new Date();
  };

  return {
    id,
    company_name: typeof data.company_name === 'string' ? data.company_name : '',
    job_title: typeof data.job_title === 'string' ? data.job_title : '',
    source_url: typeof data.source_url === 'string' ? data.source_url : '',
    apply_url: typeof data.apply_url === 'string' ? data.apply_url : '',
    account_email: typeof data.account_email === 'string' ? data.account_email : '',
    applied_date: parseDate(data.applied_date),
    status: (data.status as Application['status']) || 'Applied',
    image_url: typeof data.image_url === 'string' ? data.image_url : '',
    salary_rate: typeof data.salary_rate === 'string' ? data.salary_rate : '',
    employment_type: (data.employment_type as Application['employment_type']) || 'Full-time',
    skills_required: Array.isArray(data.skills_required) ? (data.skills_required as string[]) : [],
    notes: typeof data.notes === 'string' ? data.notes : '',
    created_at: parseDate(data.created_at),
    updated_at: parseDate(data.updated_at),
  };
};

/**
 * Berlangganan (subscribe) ke Firestore collection "applications" secara real-time.
 * Data diurutkan berdasarkan `applied_date` descending.
 */
export const subscribeApplications = (
  onSuccess: (applications: Application[]) => void,
  onError: (error: Error) => void
): (() => void) => {
  const appsRef = collection(db, COLLECTION_NAME);
  const q = query(appsRef, orderBy('applied_date', 'desc'));

  const unsubscribe = onSnapshot(
    q,
    (snapshot) => {
      const apps = snapshot.docs.map((docSnap) => docToApplication(docSnap.id, docSnap.data()));
      onSuccess(apps);
    },
    (err) => {
      // Fallback jika klausa orderBy belum terindeks atau gagal
      console.warn('Snapshot query with orderBy failed, falling back to basic query:', err.message);
      const fallbackUnsub = onSnapshot(
        appsRef,
        (fallbackSnapshot) => {
          const apps = fallbackSnapshot.docs.map((docSnap) =>
            docToApplication(docSnap.id, docSnap.data())
          );
          // Urutkan secara lokal
          apps.sort((a, b) => b.applied_date.getTime() - a.applied_date.getTime());
          onSuccess(apps);
        },
        onError
      );
      return fallbackUnsub;
    }
  );

  return unsubscribe;
};

/**
 * Menambahkan data lamaran kerja baru ke Firestore.
 */
export const createApplication = async (data: CreateApplicationData): Promise<string> => {
  const appsRef = collection(db, COLLECTION_NAME);
  const payload = {
    ...data,
    applied_date: Timestamp.fromDate(new Date(data.applied_date)),
    created_at: serverTimestamp(),
    updated_at: serverTimestamp(),
  };

  const docRef = await addDoc(appsRef, payload);
  return docRef.id;
};

/**
 * Memperbarui data lamaran kerja yang sudah ada di Firestore.
 */
export const updateApplication = async (
  id: string,
  data: Partial<CreateApplicationData>
): Promise<void> => {
  const docRef = doc(db, COLLECTION_NAME, id);
  const payload: Record<string, unknown> = {
    ...data,
    updated_at: serverTimestamp(),
  };

  if (data.applied_date) {
    payload.applied_date = Timestamp.fromDate(new Date(data.applied_date));
  }

  await updateDoc(docRef, payload);
};

/**
 * Menghapus data lamaran kerja dari Firestore.
 */
export const deleteApplication = async (id: string): Promise<void> => {
  const docRef = doc(db, COLLECTION_NAME, id);
  await deleteDoc(docRef);
};
