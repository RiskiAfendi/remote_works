import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  query,
  orderBy,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from '../config';
import { JobSource, CreateJobSourceData } from '@/lib/types';

const COLLECTION_NAME = 'jobSources';

/**
 * Helper untuk mengonversi data dokumen Firestore menjadi objek JobSource
 */
const docToJobSource = (id: string, data: Record<string, unknown>): JobSource => {
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
    name: typeof data.name === 'string' ? data.name : '',
    url: typeof data.url === 'string' ? data.url : '',
    logo_url: typeof data.logo_url === 'string' ? data.logo_url : '',
    payment_category: (data.payment_category as JobSource['payment_category']) || 'International',
    region_category: (data.region_category as JobSource['region_category']) || 'International',
    login_email: typeof data.login_email === 'string' ? data.login_email : '',
    account_username: typeof data.account_username === 'string' ? data.account_username : '',
    status: (data.status as JobSource['status']) || 'active',
    notes: typeof data.notes === 'string' ? data.notes : '',
    created_at: parseDate(data.created_at),
    updated_at: parseDate(data.updated_at),
  };
};

/**
 * Berlangganan (subscribe) ke Firestore collection "jobSources" secara real-time.
 * Data diurutkan berdasarkan `created_at` descending.
 */
export const subscribeJobSources = (
  onSuccess: (sources: JobSource[]) => void,
  onError: (error: Error) => void
): (() => void) => {
  const sourcesRef = collection(db, COLLECTION_NAME);
  const q = query(sourcesRef, orderBy('created_at', 'desc'));

  const unsubscribe = onSnapshot(
    q,
    (snapshot) => {
      const sources = snapshot.docs.map((docSnap) => docToJobSource(docSnap.id, docSnap.data()));
      onSuccess(sources);
    },
    (err) => {
      console.warn('Snapshot query with orderBy failed, falling back to basic query:', err.message);
      const fallbackUnsub = onSnapshot(
        sourcesRef,
        (fallbackSnapshot) => {
          const sources = fallbackSnapshot.docs.map((docSnap) =>
            docToJobSource(docSnap.id, docSnap.data())
          );
          sources.sort((a, b) => b.created_at.getTime() - a.created_at.getTime());
          onSuccess(sources);
        },
        onError
      );
      return fallbackUnsub;
    }
  );

  return unsubscribe;
};

/**
 * Menambahkan data Sumber Loker baru ke Firestore.
 */
export const createJobSource = async (data: CreateJobSourceData): Promise<string> => {
  const sourcesRef = collection(db, COLLECTION_NAME);
  const payload = {
    ...data,
    created_at: serverTimestamp(),
    updated_at: serverTimestamp(),
  };

  const docRef = await addDoc(sourcesRef, payload);
  return docRef.id;
};

/**
 * Memperbarui data Sumber Loker di Firestore.
 */
export const updateJobSource = async (
  id: string,
  data: Partial<CreateJobSourceData>
): Promise<void> => {
  const docRef = doc(db, COLLECTION_NAME, id);
  const payload: Record<string, unknown> = {
    ...data,
    updated_at: serverTimestamp(),
  };

  await updateDoc(docRef, payload);
};

/**
 * Menghapus data Sumber Loker dari Firestore.
 */
export const deleteJobSource = async (id: string): Promise<void> => {
  const docRef = doc(db, COLLECTION_NAME, id);
  await deleteDoc(docRef);
};
