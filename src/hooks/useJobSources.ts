'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { JobSource, CreateJobSourceData } from '@/lib/types';
import {
  subscribeJobSources,
  createJobSource,
  updateJobSource,
  deleteJobSource,
} from '@/lib/firebase/services/jobSources';
import { useToast } from '@/components/ui';

export function useJobSources() {
  const [jobSources, setJobSources] = useState<JobSource[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  const toast = useToast();
  const toastRef = useRef(toast);
  toastRef.current = toast;

  useEffect(() => {
    const unsubscribe = subscribeJobSources(
      (data) => {
        setJobSources(data);
        setLoading(false);
        setError(null);
      },
      (err) => {
        console.error('Error fetching job sources from Firestore:', err);
        setError(err);
        setLoading(false);
        toastRef.current.error('Gagal mengambil data Sumber Loker dari Firebase', 'Error Real-time Sync');
      }
    );

    return () => unsubscribe();
  }, []);

  /**
   * Tambah Job Source baru
   */
  const addJobSource = useCallback(
    async (data: CreateJobSourceData): Promise<boolean> => {
      try {
        await createJobSource(data);
        toast.success(`Platform ${data.name} berhasil ditambahkan!`, 'Berhasil Disimpan');
        return true;
      } catch (err: unknown) {
        console.error('Failed to add job source:', err);
        const errMsg = err instanceof Error ? err.message : 'Gagal menyimpan data ke Firestore';
        toast.error(errMsg, 'Gagal Simpan');
        return false;
      }
    },
    [toast]
  );

  /**
   * Edit/Update Job Source
   */
  const updateSource = useCallback(
    async (id: string, data: Partial<CreateJobSourceData>): Promise<boolean> => {
      try {
        await updateJobSource(id, data);
        toast.success('Data Sumber Loker berhasil diperbarui!', 'Berhasil Diperbarui');
        return true;
      } catch (err: unknown) {
        console.error('Failed to update job source:', err);
        const errMsg = err instanceof Error ? err.message : 'Gagal memperbarui data di Firestore';
        toast.error(errMsg, 'Gagal Update');
        return false;
      }
    },
    [toast]
  );

  /**
   * Hapus Job Source
   */
  const deleteSource = useCallback(
    async (id: string, name?: string): Promise<boolean> => {
      try {
        await deleteJobSource(id);
        toast.success(
          name ? `Platform ${name} berhasil dihapus.` : 'Data Sumber Loker berhasil dihapus.',
          'Berhasil Dihapus'
        );
        return true;
      } catch (err: unknown) {
        console.error('Failed to delete job source:', err);
        const errMsg = err instanceof Error ? err.message : 'Gagal menghapus data dari Firestore';
        toast.error(errMsg, 'Gagal Hapus');
        return false;
      }
    },
    [toast]
  );

  return {
    jobSources,
    loading,
    error,
    addJobSource,
    updateJobSource: updateSource,
    deleteJobSource: deleteSource,
  };
}

export default useJobSources;
