import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { storage } from '../config';

/**
 * Mengompres file gambar di sisi klien sebelum diunggah.
 * Mengubah dimensi maksimum ke 1200px dan kualitas ke 0.8 JPEG.
 */
export async function compressImage(
  file: File,
  maxWidth = 1200,
  maxHeight = 1200,
  quality = 0.8
): Promise<Blob> {
  return new Promise((resolve) => {
    if (!file.type.startsWith('image/')) {
      resolve(file);
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }
        if (height > maxHeight) {
          width = Math.round((width * maxHeight) / height);
          height = maxHeight;
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(file);
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);

        canvas.toBlob(
          (blob) => {
            if (blob) {
              resolve(blob);
            } else {
              resolve(file);
            }
          },
          'image/jpeg',
          quality
        );
      };
      img.onerror = () => resolve(file);
      img.src = e.target?.result as string;
    };
    reader.onerror = () => resolve(file);
    reader.readAsDataURL(file);
  });
}

/**
 * Mengunggah file screenshot gambar lamaran ke Firebase Storage.
 * Mengembalikan download URL publik.
 */
/**
 * Mengunggah file screenshot gambar lamaran ke Firebase Storage.
 * Jika Firebase Storage tidak diaktifkan/perlu upgrade berbayar, secara otomatis
 * mengonversi gambar terkompresi menjadi string Base64 yang disimpan gratis di Firestore.
 */
export async function uploadApplicationScreenshot(file: File): Promise<string> {
  const compressedBlob = await compressImage(file, 800, 800, 0.7);

  // Helper untuk konversi ke Base64 (100% gratis, disimpan di Firestore)
  const convertToBase64 = (): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (reader.result) {
          resolve(reader.result as string);
        } else {
          reject(new Error('Gagal mengonversi gambar ke Base64'));
        }
      };
      reader.onerror = () => reject(new Error('Gagal membaca file gambar'));
      reader.readAsDataURL(compressedBlob);
    });
  };

  try {
    const cleanFileName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
    const fileName = `screenshots/${Date.now()}_${cleanFileName}`;
    const storageRef = ref(storage, fileName);

    const uploadPromise = uploadBytes(storageRef, compressedBlob, {
      contentType: 'image/jpeg',
    });

    // Timeout 3 detik jika Storage tidak merespon / tidak aktif
    const timeoutPromise = new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error('Storage timeout / not enabled')), 3000)
    );

    await Promise.race([uploadPromise, timeoutPromise]);
    const downloadUrl = await getDownloadURL(storageRef);
    return downloadUrl;
  } catch (storageErr) {
    console.warn(
      'Firebase Storage tidak aktif atau memerlukan upgrade plan. Menggunakan penyimpanan Base64 gratis di Firestore:',
      storageErr
    );
    return convertToBase64();
  }
}

/**
 * Menghapus file screenshot dari Firebase Storage berdasarkan URL.
 */
export async function deleteApplicationScreenshot(fileUrl: string): Promise<void> {
  if (!fileUrl || !fileUrl.includes('firebasestorage')) return;
  try {
    const storageRef = ref(storage, fileUrl);
    await deleteObject(storageRef);
  } catch (err) {
    console.warn('Gagal menghapus gambar dari Firebase Storage:', err);
  }
}
