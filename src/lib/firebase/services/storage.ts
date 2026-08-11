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
export async function uploadApplicationScreenshot(file: File): Promise<string> {
  const compressedBlob = await compressImage(file);
  const cleanFileName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
  const fileName = `screenshots/${Date.now()}_${cleanFileName}`;

  const storageRef = ref(storage, fileName);
  await uploadBytes(storageRef, compressedBlob, {
    contentType: file.type.startsWith('image/') ? 'image/jpeg' : file.type,
  });

  const downloadUrl = await getDownloadURL(storageRef);
  return downloadUrl;
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
