# Panduan Pengembangan (Development Guide) - Remote Works

Dokumen ini adalah panduan lengkap untuk pengembangan proyek **Remote Works**, sebuah dashboard CRUD tracker lamaran kerja remote yang dibangun dengan arsitektur modern berbasis web.

## Tech Stack
- **Framework**: Next.js 14+ (Dikonfigurasi untuk Static Export)
- **Bahasa**: TypeScript
- **Styling**: Tailwind CSS v3+ (dengan konsep Liquid Glass UI)
- **Backend & Database**: Firebase v10+ (Firestore & Storage)
- **Hosting**: GitHub Pages

---

## 1. Prerequisites & Environment Setup

Sebelum memulai pengembangan, pastikan environment lokal Anda telah disiapkan dengan baik.

### Persyaratan Sistem (System Requirements)
- **Node.js**: Versi `18.17.0` atau yang lebih baru. Direkomendasikan menggunakan versi LTS (misal: v20).
- **Package Manager**: `npm` (bawaan Node.js), `yarn`, atau `pnpm`. Proyek ini akan menggunakan `npm` sebagai standar dokumentasi.
- **Git**: Versi 2.x ke atas untuk version control.
- **OS**: Windows, macOS, atau Linux (Jika di Windows, disarankan menggunakan WSL2 atau Git Bash).

### Setup Laragon (Khusus Local Development di Windows)
Jika Anda menggunakan Laragon sebagai environment lokal:
1. Jalankan Laragon, pastikan terminal yang digunakan adalah Cmder yang sudah terintegrasi Node.js.
2. Buat folder proyek di dalam direktori `www` Laragon (`c:\laragon\www\remote_works`).
3. Anda dapat mengakses proyek melalui virtual host Laragon (contoh: `http://remote_works.test`) jika menggunakan proxy, namun untuk Next.js lebih mudah menggunakan port standar `http://localhost:3000`.

### Rekomendasi VS Code Extensions
Untuk pengalaman developer terbaik, install ekstensi VS Code berikut:
- **ESLint** (`dbaeumer.vscode-eslint`)
- **Prettier - Code formatter** (`esbenp.prettier-vscode`)
- **Tailwind CSS IntelliSense** (`bradlc.vscode-tailwindcss`)
- **Firebase Explorer** (opsional)
- **Error Lens** (untuk visibilitas error yang lebih baik)

---

## 2. Firebase Setup Guide (Step-by-Step)

Proyek ini tidak memiliki custom backend server; seluruh kebutuhan database dan penyimpanan file ditangani oleh Firebase.

### Langkah 1: Buat Proyek Firebase Baru
1. Buka [Firebase Console](https://console.firebase.google.com/).
2. Klik **"Add project"**.
3. Beri nama proyek (contoh: `remote-works-app`).
4. Matikan Google Analytics (karena ini adalah proyek portofolio/sederhana), lalu klik **"Create project"**.

### Langkah 2: Aktifkan Firestore Database
1. Di dashboard Firebase, pilih menu **"Build" > "Firestore Database"**.
2. Klik **"Create database"**.
3. Pilih lokasi server yang paling dekat dengan target pengguna Anda (misal: `asia-southeast2` untuk Jakarta).
4. Pilih **"Start in test mode"** untuk memudahkan development awal, lalu klik **"Enable"**.

### Langkah 3: Aktifkan Firebase Storage
1. Buka menu **"Build" > "Storage"**.
2. Klik **"Get started"**, pilih test mode.
3. Gunakan lokasi server yang sama dengan Firestore.

### Langkah 4: Dapatkan Firebase Config
1. Buka ikon "Gear" (Project settings) di sidebar kiri atas.
2. Di tab "General", scroll ke bawah ke bagian "Your apps".
3. Klik ikon **Web (`</>`)** untuk menambahkan aplikasi web.
4. Beri nama aplikasi (contoh: `remote-works-web`) dan klik **"Register app"**.
5. Salin objek `firebaseConfig` yang muncul. Anda akan membutuhkannya untuk `.env.local`.

### Langkah 5: Security Rules
Ganti default security rules dengan yang berikut (penting untuk production).

**Firestore Rules:**
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Karena tidak ada sistem auth, kita batasi akses dasar.
    // Di production sebenarnya butuh autentikasi.
    match /applications/{document=**} {
      allow read, write: if true; // PERINGATAN: Hanya untuk demo/development
    }
  }
}
```

**Storage Rules:**
```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /company_logos/{allPaths=**} {
      allow read, write: if true; // PERINGATAN: Hanya untuk demo/development
      // Batasi ukuran file maksimum 2MB dan hanya gambar
      allow write: if request.resource.size < 2 * 1024 * 1024
                   && request.resource.contentType.matches('image/.*');
    }
  }
}
```

---

## 3. Project Initialization

Jika memulai dari awal, berikut adalah langkah untuk menginisialisasi proyek.

### Create Next.js Project
Buka terminal di folder `c:\laragon\www\` dan jalankan:
```bash
npx create-next-app@latest remote_works
```
Pilih opsi berikut saat ditanya:
- Use TypeScript? **Yes**
- Use ESLint? **Yes**
- Use Tailwind CSS? **Yes**
- Use `src/` directory? **Yes**
- Use App Router? **Yes** (Disarankan) / **No** (Gunakan Pages Router jika lebih familiar. Panduan ini berasumsi Pages Router atau App Router bisa digunakan, namun setup ekspor statis berlaku untuk keduanya).
- Customize default import alias? **No**

### Setup Firebase & State Management
Masuk ke folder proyek:
```bash
cd remote_works
npm install firebase
npm install react-icons clsx tailwind-merge framer-motion date-fns
```

### Konfigurasi `.env.local`
Buat file `.env.local` di root direktori dan isi dengan config dari Langkah 2:
```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

### Setup Static Export (next.config.js)
Untuk GitHub Pages, Next.js harus mengekspor HTML/CSS/JS statis.
Buka `next.config.js` (atau `.mjs`) dan ubah menjadi:
```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true, // Wajib untuk static export
  },
  // Jika repo GitHub Anda bukan .github.io (misal username.github.io/remote-works)
  // basePath: '/remote-works',
};

module.exports = nextConfig;
```

---

## 4. Development Workflow

### Script Commands
- `npm run dev` : Menjalankan development server (dengan Hot Module Replacement) di `localhost:3000`.
- `npm run build` : Membangun versi production dari aplikasi.
- `npm run lint` : Menjalankan ESLint untuk mengecek kualitas dan error pada kode.

### Naming Conventions
- **Files/Folders**: Gunakan `kebab-case` untuk folder (misal: `components/glass-card`).
- **Komponen React**: Gunakan `PascalCase` (misal: `GlassCard.tsx`, `ApplicationList.tsx`).
- **Fungsi/Variabel/Hooks**: Gunakan `camelCase` (misal: `useApplications`, `fetchData`).
- **Tipe Data (TypeScript)**: Gunakan awalan `I` untuk interfaces (opsional tapi disarankan jika tim suka, atau cukup `PascalCase` seperti `ApplicationData`).

### Git Branching Strategy
Gunakan strategi GitHub Flow sederhana:
- `main` : Branch stabil untuk production (deploy ke GitHub Pages).
- `dev` / `feature-*` : Branch untuk pengembangan fitur baru.
- Commit messages harus jelas (misal: `feat: add glassmorphism application card`, `fix: Firebase storage upload bug`).

---

## 5. Coding Standards

### TypeScript
- Aktifkan `strict: true` di `tsconfig.json`.
- Selalu definisikan `type` atau `interface` untuk props komponen dan struktur data state/Firebase.
- Hindari penggunaan tipe `any`. Gunakan `unknown` jika tipe tidak pasti, lalu persempit tipenya.

### React Component Patterns
- Gunakan *Functional Components* dan *React Hooks*.
- Pisahkan logika state dari komponen presentasional jika komponen terlalu besar (Custom Hooks).

### Tailwind CSS Ordering
Gunakan konvensi standar (atau plugin prettier-plugin-tailwindcss) untuk mengurutkan class:
1. Base (layout, position: `relative flex block`)
2. Spacing (`p-4 m-2`)
3. Sizing (`w-full h-10`)
4. Typography (`text-lg font-bold`)
5. Visuals (`bg-white/10 backdrop-blur-md border border-white/20`)

### State Management
Gunakan React Context API (`createContext`, `useContext`) untuk state global seperti:
- Pengaturan Tema (Light/Dark/Glass)
- Pengaturan Bahasa (ID/EN)
Hindari library eksternal (Redux, Zustand) kecuali aplikasi menjadi sangat kompleks.

---

## 6. Deployment Guide

Aplikasi ini akan di-deploy ke GitHub Pages menggunakan GitHub Actions.

### Setup GitHub Actions Workflow
Buat file di `.github/workflows/deploy.yml`:

```yaml
name: Deploy Next.js site to Pages

on:
  push:
    branches: ["main"]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: "pages"
  cancel-in-progress: false

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4
      - name: Detect package manager
        id: detect-package-manager
        run: |
          echo "manager=npm" >> $GITHUB_OUTPUT
          echo "command=ci" >> $GITHUB_OUTPUT
          echo "runner=npx --no-install" >> $GITHUB_OUTPUT
      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: "20"
          cache: ${{ steps.detect-package-manager.outputs.manager }}
      - name: Setup Pages
        uses: actions/configure-pages@v4
        with:
          static_site_generator: next
      - name: Install dependencies
        run: ${{ steps.detect-package-manager.outputs.manager }} ${{ steps.detect-package-manager.outputs.command }}
      - name: Build with Next.js
        run: ${{ steps.detect-package-manager.outputs.runner }} next build
        env:
          NEXT_PUBLIC_FIREBASE_API_KEY: ${{ secrets.NEXT_PUBLIC_FIREBASE_API_KEY }}
          # Tambahkan semua env vars Firebase lainnya di sini...
      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: ./out

  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    needs: build
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

### GitHub Pages Settings
1. Pergi ke repositori Anda di GitHub.
2. Buka tab **Settings** > **Secrets and variables** > **Actions**.
3. Tambahkan *Repository secrets* untuk setiap variabel `NEXT_PUBLIC_FIREBASE_*`.
4. Buka **Settings** > **Pages**.
5. Pada bagian "Build and deployment", pilih Source: **GitHub Actions**.

---

## 7. Troubleshooting

- **Error: Image Optimization using Next.js default loader is not compatible with `export`**
  *Solusi*: Pastikan `images: { unoptimized: true }` ada di `next.config.js`.

- **Firebase Data Null atau Permission Denied**
  *Solusi*: Periksa Firestore/Storage Rules di Firebase Console. Pastikan aturan diset untuk memperbolehkan read/write saat mode pengembangan. Periksa juga apakah Environment Variables sudah terkonfigurasi dengan benar (tidak ada typo atau spasi ekstra).

- **404 Not Found di GitHub Pages pada sub-halaman setelah refresh**
  *Solusi*: GitHub Pages tidak mendukung routing client-side Next.js dengan sempurna secara bawaan tanpa konfigurasi custom 404.html. Pastikan ekspor statis menghasilkan file `.html` untuk setiap rute.

---

## 8. Key Code Patterns

### Setup Firebase Instance (`src/lib/firebase.ts`)
```typescript
import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Mencegah re-inisialisasi saat Next.js HMR berjalan
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);
const storage = getStorage(app);

export { app, db, storage };
```

### Firestore CRUD Operations Hook (`src/hooks/useApplications.ts`)
```typescript
import { useState, useEffect } from "react";
import { collection, onSnapshot, addDoc, deleteDoc, doc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

export interface ApplicationData {
  id?: string;
  companyName: string;
  role: string;
  status: "applied" | "interviewing" | "rejected" | "hired";
  appliedDate: string;
}

export function useApplications() {
  const [applications, setApplications] = useState<ApplicationData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const appsRef = collection(db, "applications");
    const unsubscribe = onSnapshot(appsRef, (snapshot) => {
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as ApplicationData[];
      setApplications(data);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const addApplication = async (data: Omit<ApplicationData, "id">) => {
    await addDoc(collection(db, "applications"), data);
  };

  const updateApplicationStatus = async (id: string, status: string) => {
    const docRef = doc(db, "applications", id);
    await updateDoc(docRef, { status });
  };

  const deleteApplication = async (id: string) => {
    await deleteDoc(doc(db, "applications", id));
  };

  return { applications, loading, addApplication, updateApplicationStatus, deleteApplication };
}
```

### Firebase Storage Upload File
```typescript
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "@/lib/firebase";

export const uploadCompanyLogo = async (file: File): Promise<string> => {
  const fileExt = file.name.split('.').pop();
  const fileName = `logo_${Date.now()}.${fileExt}`;
  const storageRef = ref(storage, `company_logos/${fileName}`);
  
  await uploadBytes(storageRef, file);
  const downloadUrl = await getDownloadURL(storageRef);
  return downloadUrl;
};
```

### Tailwind Liquid Glass Component Styling
Gunakan utility classes berikut untuk efek "Liquid Glass" (glassmorphism):
```tsx
export default function GlassCard({ children }: { children: React.ReactNode }) {
  return (
    <div className="
      relative overflow-hidden rounded-2xl
      bg-white/10 backdrop-blur-lg border border-white/20
      shadow-[0_8px_32px_0_rgba(31,38,135,0.07)]
      hover:bg-white/20 transition-all duration-300 ease-in-out
      p-6
    ">
      {/* Opsional: Tambahkan efek gradient/glow di dalam card */}
      <div className="absolute -top-10 -right-10 w-24 h-24 bg-white/30 rounded-full blur-2xl"></div>
      
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
}
```

---

Dengan mengikuti panduan pengembangan ini, kode yang ditulis akan konsisten, mudah di-maintain, dan siap untuk di-deploy ke production via GitHub Pages.
