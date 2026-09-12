'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { JobDirectory, CreateJobDirectoryData } from '@/lib/types';
import { CURATED_JOB_DIRECTORIES } from '@/lib/data/curatedJobDirectories';
import {
  subscribeJobDirectories,
  createJobDirectory,
  updateJobDirectory,
  deleteJobDirectory,
} from '@/lib/firebase/services/jobDirectories';
import { useToast } from '@/components/ui';

const STORAGE_KEY = 'rw_custom_job_directories';

export function useJobDirectories() {
  const [customDirectories, setCustomDirectories] = useState<JobDirectory[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          const parsed = JSON.parse(stored);
          return (Array.isArray(parsed) ? parsed : []).map((item) => ({
            ...item,
            created_at: new Date(item.created_at || Date.now()),
            updated_at: new Date(item.updated_at || Date.now()),
          }));
        }
      } catch (e) {
        console.warn('Failed to parse local custom directories:', e);
      }
    }
    return [];
  });

  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  const toast = useToast();
  const toastRef = useRef(toast);

  useEffect(() => {
    toastRef.current = toast;
  });

  // Subscribe ke Firestore
  useEffect(() => {
    let isSubscribed = true;
    const unsubscribe = subscribeJobDirectories(
      (firestoreData) => {
        if (!isSubscribed) return;
        setCustomDirectories(firestoreData);
        setLoading(false);
        setError(null);
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(firestoreData));
        } catch {
          // Ignore localStorage quota errors
        }
      },
      (err) => {
        if (!isSubscribed) return;
        console.warn('Firestore jobDirectories sync fallback to localStorage:', err.message);
        // Tetap menggunakan data dari localStorage jika ada
        setLoading(false);
      }
    );

    return () => {
      isSubscribed = false;
      unsubscribe();
    };
  }, []);

  // Simpan ke localStorage setiap kali customDirectories berubah jika offline
  const saveToLocalStorage = useCallback((data: JobDirectory[]) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (e) {
      console.warn('Failed to save to localStorage:', e);
    }
  }, []);

  /**
   * Tambah Job Directory baru
   */
  const addDirectory = useCallback(
    async (data: CreateJobDirectoryData): Promise<boolean> => {
      try {
        let createdId = '';
        try {
          createdId = await createJobDirectory(data);
        } catch (dbErr) {
          console.warn('Firestore create failed, falling back to local:', dbErr);
          createdId = `custom-${Date.now()}`;
        }

        const newEntry: JobDirectory = {
          ...data,
          id: createdId,
          is_curated: false,
          created_at: new Date(),
          updated_at: new Date(),
        };

        setCustomDirectories((prev) => {
          const updated = [newEntry, ...prev.filter((d) => d.id !== createdId)];
          saveToLocalStorage(updated);
          return updated;
        });

        toastRef.current.success(
          `Direktori "${data.name}" berhasil ditambahkan!`,
          'Berhasil Disimpan'
        );
        return true;
      } catch (err: unknown) {
        console.error('Failed to add directory:', err);
        const errMsg = err instanceof Error ? err.message : 'Gagal menyimpan direktori';
        toastRef.current.error(errMsg, 'Gagal Simpan');
        return false;
      }
    },
    [saveToLocalStorage]
  );

  /**
   * Edit / Perbarui Job Directory
   */
  const updateDirectory = useCallback(
    async (id: string, data: Partial<CreateJobDirectoryData>): Promise<boolean> => {
      try {
        try {
          await updateJobDirectory(id, data);
        } catch (dbErr) {
          console.warn('Firestore update failed, updating local state:', dbErr);
        }

        setCustomDirectories((prev) => {
          const updated = prev.map((item) =>
            item.id === id
              ? {
                  ...item,
                  ...data,
                  updated_at: new Date(),
                }
              : item
          );
          saveToLocalStorage(updated);
          return updated;
        });

        toastRef.current.success('Data direktori berhasil diperbarui!', 'Berhasil Diperbarui');
        return true;
      } catch (err: unknown) {
        console.error('Failed to update directory:', err);
        const errMsg = err instanceof Error ? err.message : 'Gagal memperbarui direktori';
        toastRef.current.error(errMsg, 'Gagal Update');
        return false;
      }
    },
    [saveToLocalStorage]
  );

  /**
   * Hapus Job Directory
   */
  const deleteDirectory = useCallback(
    async (id: string, name?: string): Promise<boolean> => {
      try {
        try {
          await deleteJobDirectory(id);
        } catch (dbErr) {
          console.warn('Firestore delete failed, deleting from local state:', dbErr);
        }

        setCustomDirectories((prev) => {
          const updated = prev.filter((item) => item.id !== id);
          saveToLocalStorage(updated);
          return updated;
        });

        toastRef.current.success(
          name ? `Direktori "${name}" berhasil dihapus.` : 'Direktori berhasil dihapus.',
          'Berhasil Dihapus'
        );
        return true;
      } catch (err: unknown) {
        console.error('Failed to delete directory:', err);
        const errMsg = err instanceof Error ? err.message : 'Gagal menghapus direktori';
        toastRef.current.error(errMsg, 'Gagal Hapus');
        return false;
      }
    },
    [saveToLocalStorage]
  );

  // Gabungkan custom directories dengan seed directories terkurasi
  // Custom directories tampil di awal atau berbarengan dengan curated directories
  const directories: JobDirectory[] = [
    ...customDirectories,
    ...CURATED_JOB_DIRECTORIES.filter(
      (curated) => !customDirectories.some((custom) => custom.id === curated.id)
    ),
  ];

  return {
    directories,
    customDirectories,
    curatedDirectories: CURATED_JOB_DIRECTORIES,
    loading,
    error,
    addDirectory,
    updateDirectory,
    deleteDirectory,
  };
}

export default useJobDirectories;
