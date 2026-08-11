'use client';

import { useState, useEffect, useCallback } from 'react';
import { Application, CreateApplicationData } from '@/lib/types';
import {
  subscribeApplications,
  createApplication,
  updateApplication,
  deleteApplication,
} from '@/lib/firebase/services/applications';
import { useToast } from '@/components/ui';

export function useApplications() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  const toast = useToast();

  useEffect(() => {
    const unsubscribe = subscribeApplications(
      (data) => {
        setApplications(data);
        setLoading(false);
        setError(null);
      },
      (err) => {
        console.error('Error fetching applications from Firestore:', err);
        setError(err);
        setLoading(false);
        toast.error('Gagal mengambil data dari Firebase Firestore', 'Error Real-time Sync');
      }
    );

    return () => unsubscribe();
  }, [toast]);

  /**
   * Tambah lamaran baru
   */
  const addApp = useCallback(
    async (data: CreateApplicationData): Promise<boolean> => {
      try {
        await createApplication(data);
        toast.success(`Lamaran ke ${data.company_name} berhasil ditambahkan!`, 'Berhasil Disimpan');
        return true;
      } catch (err: unknown) {
        console.error('Failed to add application:', err);
        const errMsg = err instanceof Error ? err.message : 'Gagal menyimpan data ke Firestore';
        toast.error(errMsg, 'Gagal Simpan');
        return false;
      }
    },
    [toast]
  );

  /**
   * Edit/Update lamaran
   */
  const updateApp = useCallback(
    async (id: string, data: Partial<CreateApplicationData>): Promise<boolean> => {
      try {
        await updateApplication(id, data);
        toast.success('Perubahan data lamaran berhasil diperbarui!', 'Berhasil Diperbarui');
        return true;
      } catch (err: unknown) {
        console.error('Failed to update application:', err);
        const errMsg = err instanceof Error ? err.message : 'Gagal memperbarui data di Firestore';
        toast.error(errMsg, 'Gagal Update');
        return false;
      }
    },
    [toast]
  );

  /**
   * Hapus lamaran
   */
  const deleteApp = useCallback(
    async (id: string, companyName?: string): Promise<boolean> => {
      try {
        await deleteApplication(id);
        toast.success(
          companyName
            ? `Lamaran ke ${companyName} berhasil dihapus.`
            : 'Data lamaran berhasil dihapus.',
          'Berhasil Dihapus'
        );
        return true;
      } catch (err: unknown) {
        console.error('Failed to delete application:', err);
        const errMsg = err instanceof Error ? err.message : 'Gagal menghapus data dari Firestore';
        toast.error(errMsg, 'Gagal Hapus');
        return false;
      }
    },
    [toast]
  );

  return {
    applications,
    loading,
    error,
    addApp,
    updateApp,
    deleteApp,
  };
}

export default useApplications;
