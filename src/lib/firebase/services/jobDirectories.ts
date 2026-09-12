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
import { JobDirectory, CreateJobDirectoryData } from '@/lib/types';

const COLLECTION_NAME = 'jobDirectories';

/**
 * Helper untuk mengonversi data dokumen Firestore menjadi objek JobDirectory
 */
const docToJobDirectory = (id: string, data: Record<string, unknown>): JobDirectory => {
  const parseDate = (val: unknown): Date => {
    if (!val) return new Date();
    if (typeof (val as { toDate?: () => Date }).toDate === 'function') {
      return (val as { toDate: () => Date }).toDate();
    }
    if (val && typeof (val as { seconds?: number }).seconds === 'number') {
      return new Date((val as { seconds: number }).seconds * 1000);
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
    description: typeof data.description === 'string' ? data.description : '',
    category: (data.category as JobDirectory['category']) || 'other',
    region_scope: (data.region_scope as JobDirectory['region_scope']) || 'Worldwide',
    compensation_model:
      (data.compensation_model as JobDirectory['compensation_model']) || 'Mixed',
    tags: Array.isArray(data.tags)
      ? (data.tags as unknown[]).map(String)
      : [],
    is_curated: Boolean(data.is_curated),
    created_at: parseDate(data.created_at),
    updated_at: parseDate(data.updated_at),
  };
};

/**
 * Berlangganan (subscribe) ke Firestore collection "jobDirectories" secara real-time.
 */
export const subscribeJobDirectories = (
  onSuccess: (directories: JobDirectory[]) => void,
  onError: (error: Error) => void
): (() => void) => {
  const collRef = collection(db, COLLECTION_NAME);
  const q = query(collRef, orderBy('created_at', 'desc'));

  let fallbackUnsub: (() => void) | null = null;
  const unsubscribe = onSnapshot(
    q,
    (snapshot) => {
      const list = snapshot.docs.map((d) => docToJobDirectory(d.id, d.data()));
      onSuccess(list);
    },
    (err) => {
      console.warn('Snapshot query with orderBy failed for jobDirectories, fallback query:', err.message);
      fallbackUnsub = onSnapshot(
        collRef,
        (fallbackSnapshot) => {
          const list = fallbackSnapshot.docs.map((d) => docToJobDirectory(d.id, d.data()));
          list.sort((a, b) => b.created_at.getTime() - a.created_at.getTime());
          onSuccess(list);
        },
        onError
      );
    }
  );

  return () => {
    unsubscribe();
    if (fallbackUnsub) {
      fallbackUnsub();
    }
  };
};

/**
 * Menambahkan data Job Directory baru ke Firestore.
 */
export const createJobDirectory = async (data: CreateJobDirectoryData): Promise<string> => {
  const collRef = collection(db, COLLECTION_NAME);
  const payload = {
    ...data,
    created_at: serverTimestamp(),
    updated_at: serverTimestamp(),
  };

  const docRef = await addDoc(collRef, payload);
  return docRef.id;
};

/**
 * Memperbarui data Job Directory di Firestore.
 */
export const updateJobDirectory = async (
  id: string,
  data: Partial<CreateJobDirectoryData>
): Promise<void> => {
  const docRef = doc(db, COLLECTION_NAME, id);
  const payload: Record<string, unknown> = {
    ...data,
    updated_at: serverTimestamp(),
  };

  await updateDoc(docRef, payload);
};

/**
 * Menghapus data Job Directory dari Firestore.
 */
export const deleteJobDirectory = async (id: string): Promise<void> => {
  const docRef = doc(db, COLLECTION_NAME, id);
  await deleteDoc(docRef);
};
