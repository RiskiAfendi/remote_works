# Remote Works 🚀

> **Remote Job Application Tracker** — Dashboard CRUD modern dengan estetika **Liquid Glass (Glassmorphism)**, sinkronisasi real-time berbasis **Firebase**, dan dukungan ekspor statis ke **GitHub Pages**.

![Next.js](https://img.shields.io/badge/Next.js-16.3-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.0-38B2AC?style=for-the-badge&logo=tailwind-css)
![Firebase](https://img.shields.io/badge/Firebase-12.0-FFCA28?style=for-the-badge&logo=firebase)
![GitHub Pages](https://img.shields.io/badge/GitHub_Pages-CI%2FCD-222222?style=for-the-badge&logo=githubactions)

---

## 🌟 Fitur Utama (Core Features)

- 💎 **Liquid Glass UI Design**: Antarmuka visual yang modern, responsif, dan elegan menggunakan efek glassmorphism, *backdrop blur*, *edge lighting*, serta transisi tema *Dark/Light mode* yang mulus.
- ⚡ **Real-time Firestore Integration**: Perubahan data lamaran kerja tersinkronisasi secara otomatis dan instan di seluruh sesi browser tanpa perlu melakukan *refresh*.
- 📊 **Real-time Stat Cards & Analytics**: Ringkasan statistik jumlah lamaran (Total, Applied, Interviewing, Accepted, Rejected) yang dihitung secara dinamis.
- ⏰ **Aging Alert System**: Indikator visual otomatis (badge berwarna hijau/kuning/merah) yang menandai berapa hari lamaran belum diperbarui untuk tindakan *follow-up*.
- 🔍 **Filter & Instant Search**: Pencarian cepat berdasarkan nama perusahaan atau posisi, disertai filter status, email, dan kemampuan sorting pada header tabel.
- 🔒 **PIN Security Lock**: Fitur proteksi modal PIN sederhana untuk mengamankan tampilan dashboard dari akses yang tidak disengaja.
- 🖼️ **Firebase Storage Screenshot Upload**: Kemampuan mengunggah dan menampilkan pratinjau (*image preview modal*) screenshot bukti lamaran atau logo perusahaan.
- 🌐 **Bilingual (ID/EN) Support**: Dukungan bahasa Indonesia dan Inggris yang dapat dipindah seketika tanpa *page reload*.
- 📥 **CSV Data Export**: Fitur mengunduh seluruh data lamaran yang tersaring ke dalam format file CSV.
- ⚡ **Static Export Ready**: Dikonfigurasi penuh untuk mode static export Next.js (`output: 'export'`) sehingga efisien dan hemat biaya hosting.

---

## 🛠️ Tech Stack

- **Framework**: [Next.js 16 (App Router)](https://nextjs.org/)
- **Bahasa**: [TypeScript 5](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/) dengan custom Liquid Glass tokens
- **Icons**: [Lucide React](https://lucide.dev/)
- **Database & Storage**: [Google Firebase (Firestore & Cloud Storage)](https://firebase.google.com/)
- **CI/CD & Hosting**: [GitHub Actions](https://github.com/features/actions) & [GitHub Pages](https://pages.github.com/)

---

## 📁 Struktur Direktori (Clean Architecture)

```text
remote_works/
├── .github/
│   └── workflows/
│       └── deploy.yml            # CI/CD Workflow deployment GitHub Pages
├── docs/
│   └── project_docs/             # Dokumentasi teknis, blueprint, & todolist
│       ├── blueprint.md
│       ├── design.md
│       ├── development_guide.md
│       ├── lighthouse_guide.md
│       └── todolist.md
├── public/
│   └── locales/                  # File i18n JSON (ID/EN)
│       ├── en/
│       └── id/
├── src/
│   ├── app/                      # Next.js App Router (Layout & Pages)
│   │   ├── analytics/
│   │   ├── applications/
│   │   ├── dashboard/
│   │   ├── globals.css           # Global design tokens & CSS variables
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── components/               # Komponen UI & Layout
│   │   ├── layout/               # Navbar, Sidebar, MainLayout
│   │   └── ui/                   # Button, Modal, Badge, StatCard, Toast, dll.
│   ├── context/                  # React Context (ThemeContext, I18nContext)
│   ├── features/                 # Fitur domain spesifik (Applications, Auth)
│   ├── hooks/                    # Custom React Hooks (useApplications, useAuth, dll.)
│   └── lib/                      # Firebase setup, utilities, & validation
│       └── firebase/
├── next.config.ts                # Konfigurasi Next.js static export & basePath
└── package.json
```

---

## 🚀 Panduan Memulai (Getting Started)

### Prerequisites
- **Node.js**: Versi `18.17.0` atau yang lebih baru (disarankan v20 LTS).
- **npm**: Paket manager standar Node.js.

### 1. Clone & Install
```bash
git clone https://github.com/username/remote_works.git
cd remote_works
npm install
```

### 2. Konfigurasi Environment Variables
Buat file `.env.local` di direktori root dan masukkan konfigurasi proyek Firebase Anda:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project_id.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

### 3. Jalankan Mode Development
```bash
npm run dev
```
Buka browser Anda di `http://localhost:3000`.

---

## 📦 Build & Static Export

Untuk menguji hasil kompilasi statis secara lokal:

```bash
# Kompilasi proyek ke folder output 'out/'
npm run build

# Menjalankan server statis lokal untuk pengujian
npx serve out
```

---

## 🌐 Deploy ke GitHub Pages (CI/CD)

Proyek ini telah dilengkapi dengan file alur kerja **GitHub Actions** (`.github/workflows/deploy.yml`).

### Langkah Setup di Repository GitHub:
1. Push repositori ini ke GitHub.
2. Buka tab **Settings** > **Secrets and variables** > **Actions** pada repositori GitHub Anda.
3. Tambahkan *Repository Secrets* berikut sesuai dengan isi `.env.local`:
   - `NEXT_PUBLIC_FIREBASE_API_KEY`
   - `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
   - `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
   - `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
   - `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
   - `NEXT_PUBLIC_FIREBASE_APP_ID`
4. Buka tab **Settings** > **Pages**:
   - Pada bagian **Source**, pilih **GitHub Actions**.
5. Setiap kali Anda melakukan `git push` ke branch `main`, GitHub Actions akan secara otomatis mengompilasi aplikasi dan merilisnya di URL GitHub Pages Anda (`https://username.github.io/remote_works/`).

---

## 🎯 Target Audit Lighthouse

Aplikasi dirancang untuk memenuhi standar kualitas web modern:

- 🟢 **Performance**: > 90 (Dengan GPU hardware acceleration untuk CSS backdrop-blur)
- 🟢 **Accessibility**: > 95 (Warna kontras terlindungi di atas elemen Liquid Glass)
- 🟢 **Best Practices**: 100
- 🟢 **SEO**: > 95

Lihat dokumen [Lighthouse Audit Guide](docs/project_docs/lighthouse_guide.md) untuk rincian optimasi teknis.

---

## 📄 Lisensi & Kontribusi

Proyek ini dibuat untuk keperluan manajemen personal lamaran kerja dan portofolio. Lisensi di bawah [MIT License](LICENSE).
