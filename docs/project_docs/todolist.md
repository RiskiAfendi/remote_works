# Todo List & Fase Pengerjaan: Remote Works

Dokumen ini berisi daftar tugas (todolist) dan pembagian fase pengerjaan untuk proyek **Remote Works**, sebuah dashboard CRUD tracker lamaran kerja remote.
**Tech Stack:** Next.js Static Export + Tailwind CSS + Firebase + GitHub Pages
**Design System:** Premium Liquid Glass

---

## FASE 1: Foundation & Setup

- [ ] **Setup Next.js project dengan TypeScript**
  - Inisialisasi proyek Next.js baru dengan konfigurasi TypeScript, App Router, dan Tailwind CSS.
  - File: `package.json`, `tsconfig.json`, `next.config.js`
  - Acceptance criteria: Proyek berhasil dijalankan secara lokal tanpa error.

- [ ] **Konfigurasi Tailwind CSS dengan design tokens Liquid Glass**
  - Menambahkan plugin dan konfigurasi theme kustom Tailwind untuk efek Liquid Glass.
  - File: `tailwind.config.ts`, `postcss.config.js`
  - Acceptance criteria: Utilities Tailwind untuk glassmorphism tersedia.

- [ ] **Setup Firebase project (panduan step-by-step)**
  - Membuat instruksi setup Firebase dan inisialisasi SDK di dalam proyek.
  - File: `docs/project_docs/firebase_setup.md`, `src/lib/firebase/config.ts`
  - Acceptance criteria: Konfigurasi Firebase tersedia dan dapat dihubungkan menggunakan environment variables.

- [ ] **Buat folder structure clean architecture**
  - Menyiapkan struktur direktori yang modular (components, features, lib, hooks, utils).
  - File: `src/components/*`, `src/features/*`, `src/lib/*`
  - Acceptance criteria: Struktur folder terorganisir sesuai best practices Clean Architecture.

- [ ] **Setup i18n (bilingual ID/EN)**
  - Mengonfigurasi pustaka i18n untuk mendukung bahasa Indonesia dan Inggris (berjalan secara client-side untuk Static Export).
  - File: `src/i18n/config.ts`, `src/locales/id.json`, `src/locales/en.json`
  - Acceptance criteria: Teks dapat di-switch antar bahasa.

- [ ] **Setup theme provider (dark/light mode)**
  - Menerapkan React Context atau next-themes untuk mengelola state dark/light mode.
  - File: `src/components/ThemeProvider.tsx`, `src/app/layout.tsx`
  - Acceptance criteria: Pengguna dapat mengganti tema dan tersimpan di localStorage.

- [ ] **Buat design tokens CSS variables**
  - Mendefinisikan variabel CSS untuk warna, bayangan, dan efek glass di file global styles.
  - File: `src/app/globals.css`
  - Acceptance criteria: Variabel CSS dapat digunakan oleh Tailwind dan komponen UI.

- [ ] **Buat base layout (Navbar, Sidebar, Main Area)**
  - Membangun struktur layout utama aplikasi yang responsif.
  - File: `src/components/layout/Navbar.tsx`, `src/components/layout/Sidebar.tsx`, `src/components/layout/MainLayout.tsx`
  - Acceptance criteria: Layout dasar tampil dengan benar di desktop dan mobile.

---

## FASE 2: Design System & UI Components

- [ ] **Buat komponen UI primitif**
  - Mengembangkan komponen dasar yang reusable: Button, Badge, Modal, Input, Select, Textarea, Toggle, Toast.
  - File: `src/components/ui/*.tsx`
  - Acceptance criteria: Semua komponen primitif berfungsi dan memiliki props yang sesuai.

- [ ] **Implementasi Liquid Glass styling pada komponen**
  - Menerapkan efek glassmorphism, blur, dan transparansi pada komponen UI.
  - File: `src/components/ui/*.tsx`
  - Acceptance criteria: Komponen memiliki estetika Liquid Glass yang konsisten di kedua tema.

- [ ] **Buat glass navbar dengan edge lighting**
  - Membuat komponen Navbar dengan efek glass dan highlight pada tepi (edge lighting).
  - File: `src/components/layout/Navbar.tsx`
  - Acceptance criteria: Navbar terlihat semi-transparan dengan border highlight yang elegan.

- [ ] **Buat glass sidebar**
  - Mendesain Sidebar dengan material glass dan efek active state yang jelas.
  - File: `src/components/layout/Sidebar.tsx`
  - Acceptance criteria: Sidebar berfungsi dengan baik untuk navigasi.

- [ ] **Buat glass stat cards**
  - Membuat komponen Card untuk menampilkan statistik ringkas.
  - File: `src/components/ui/StatCard.tsx`
  - Acceptance criteria: Stat Card menampilkan angka dan label dengan desain yang rapi.

- [ ] **Buat glass modal**
  - Mengembangkan komponen Modal dengan backdrop blur dan kontainer glass.
  - File: `src/components/ui/Modal.tsx`
  - Acceptance criteria: Modal muncul di tengah layar dengan animasi halus.

- [ ] **Responsive layouts**
  - Menyesuaikan semua komponen UI agar tampil optimal di berbagai ukuran layar.
  - File: `src/components/**/*.tsx`
  - Acceptance criteria: Tidak ada elemen yang overflow atau terpotong di perangkat mobile.

- [ ] **Micro-animations dan hover effects**
  - Menambahkan transisi halus dan feedback visual saat interaksi (hover, click).
  - File: `src/components/**/*.tsx`, `tailwind.config.ts`
  - Acceptance criteria: Interaksi terasa responsif dan premium.

- [ ] **Dark/Light mode transitions**
  - Memastikan transisi warna saat perpindahan tema berjalan mulus tanpa flash.
  - File: `src/app/globals.css`
  - Acceptance criteria: Perpindahan tema terjadi dengan transisi yang nyaman di mata.

---

## FASE 3: Firebase Integration & CRUD

- [ ] **Setup Firebase config**
  - Menghubungkan aplikasi dengan project Firebase yang telah dibuat.
  - File: `src/lib/firebase/firebase.ts`
  - Acceptance criteria: Firebase app berhasil diinisialisasi.

- [ ] **Implementasi Firestore CRUD operations**
  - Membuat fungsi-fungsi helper untuk Create, Read, Update, Delete data lamaran.
  - File: `src/lib/firebase/services/applications.ts`
  - Acceptance criteria: Semua operasi CRUD berjalan sukses berinteraksi dengan Firestore.

- [ ] **Buat ApplicationForm (Create/Edit)**
  - Mengembangkan form untuk menambah dan mengubah data lamaran kerja.
  - File: `src/features/applications/ApplicationForm.tsx`
  - Acceptance criteria: Form dapat menyimpan data ke Firestore dengan benar.

- [ ] **Buat DataTable dengan data dari Firestore**
  - Membuat tabel interaktif untuk menampilkan daftar lamaran kerja.
  - File: `src/features/applications/ApplicationTable.tsx`
  - Acceptance criteria: Tabel merender data yang diambil dari Firestore secara akurat.

- [ ] **Implementasi Delete dengan konfirmasi**
  - Menambahkan fitur hapus data lengkap dengan modal konfirmasi keamanan.
  - File: `src/features/applications/ApplicationTable.tsx`, `src/components/ui/ConfirmModal.tsx`
  - Acceptance criteria: Data terhapus dari Firestore setelah konfirmasi.

- [ ] **Real-time data updates (onSnapshot)**
  - Menggunakan listener real-time Firestore untuk memperbarui tabel secara instan.
  - File: `src/hooks/useApplications.ts`
  - Acceptance criteria: Perubahan data dari tab/perangkat lain langsung tercermin di UI.

- [ ] **Form validation**
  - Menambahkan validasi input form menggunakan library seperti Zod atau React Hook Form.
  - File: `src/features/applications/ApplicationForm.tsx`, `src/lib/validations.ts`
  - Acceptance criteria: Form menampilkan pesan error yang sesuai jika input tidak valid.

- [ ] **Error handling & loading states**
  - Mengelola dan menampilkan status loading dan pesan error selama operasi asynchronous.
  - File: `src/hooks/useApplications.ts`, komponen UI terkait.
  - Acceptance criteria: Pengguna mendapatkan feedback visual (spinner, toast error) saat proses berlangsung atau gagal.

---

## FASE 4: Advanced Features

- [ ] **Filter by status, email, company**
  - Menambahkan kemampuan menyaring data di tabel berdasarkan kriteria tertentu.
  - File: `src/features/applications/ApplicationTable.tsx`, `src/features/applications/FilterBar.tsx`
  - Acceptance criteria: Tabel hanya menampilkan data yang sesuai dengan filter yang aktif.

- [ ] **Search bar (by company name, job title)**
  - Mengimplementasikan input pencarian text-based.
  - File: `src/features/applications/SearchBar.tsx`
  - Acceptance criteria: Hasil tabel langsung tersaring saat user mengetik.

- [ ] **Sort tabel (klik header kolom)**
  - Menambahkan fitur pengurutan data ascending/descending pada kolom tabel.
  - File: `src/features/applications/ApplicationTable.tsx`
  - Acceptance criteria: Data terurut dengan benar saat header kolom diklik.

- [ ] **Aging Alert system (hijau/kuning/merah badge)**
  - Membuat sistem visual indikator berdasarkan umur lamaran (kapan terakhir di-update).
  - File: `src/components/ui/AgingBadge.tsx`, `src/utils/date.ts`
  - Acceptance criteria: Badge menampilkan warna yang sesuai berdasarkan selisih waktu.

- [ ] **Stats Cards calculation (real-time)**
  - Menghitung agregat data (total lamaran, interview, diterima, ditolak) dan menampilkannya.
  - File: `src/features/dashboard/DashboardStats.tsx`
  - Acceptance criteria: Angka di Stat Cards selalu sinkron dengan data tabel secara real-time.

- [ ] **Firebase Storage upload screenshot**
  - Mengimplementasikan fitur unggah gambar/screenshot bukti lamaran.
  - File: `src/lib/firebase/services/storage.ts`, `src/features/applications/ApplicationForm.tsx`
  - Acceptance criteria: Gambar berhasil diunggah dan URL-nya tersimpan di dokumen Firestore.

- [ ] **Image preview modal**
  - Membuat modal untuk melihat gambar/screenshot dalam ukuran penuh.
  - File: `src/components/ui/ImagePreviewModal.tsx`
  - Acceptance criteria: Gambar dapat dilihat dengan jelas saat di-klik.

- [ ] **Export data ke CSV**
  - Menambahkan fitur unduh data lamaran ke format CSV.
  - File: `src/utils/export.ts`, `src/features/applications/ExportButton.tsx`
  - Acceptance criteria: File CSV yang diunduh memiliki format dan data yang benar.

---

## FASE 5: Auth, i18n & Polish

- [ ] **PIN/Password protection modal**
  - Mengembangkan sistem proteksi sederhana menggunakan PIN untuk membatasi akses (bukan full Firebase Auth, cocok untuk personal dashboard).
  - File: `src/features/auth/PinModal.tsx`, `src/hooks/useAuth.ts`
  - Acceptance criteria: Aplikasi terkunci jika PIN belum dimasukkan dengan benar.

- [ ] **Bilingual toggle (ID/EN)**
  - Menambahkan tombol switch bahasa di Navbar atau pengaturan.
  - File: `src/components/layout/Navbar.tsx`
  - Acceptance criteria: Semua teks aplikasi berubah ke bahasa yang dipilih tanpa perlu reload penuh.

- [ ] **Skeleton loading states**
  - Mengganti spinner biasa dengan skeleton screen saat memuat data awal.
  - File: `src/components/ui/Skeleton.tsx`, `src/features/applications/TableSkeleton.tsx`
  - Acceptance criteria: UI terlihat lebih responsif dengan skeleton placeholders.

- [ ] **Empty state illustrations**
  - Mendesain dan menampilkan status kosong yang menarik ketika tidak ada data.
  - File: `src/components/ui/EmptyState.tsx`
  - Acceptance criteria: Pesan yang ramah muncul saat tabel atau hasil pencarian kosong.

- [ ] **Toast notifications**
  - Mengintegrasikan sistem toast untuk notifikasi sukses, error, atau info.
  - File: `src/components/ui/ToastProvider.tsx`
  - Acceptance criteria: Toast muncul dan hilang secara otomatis setelah beberapa detik.

- [ ] **Keyboard shortcuts**
  - Menambahkan pintasan keyboard untuk aksi umum (misal: `/` untuk search, `N` untuk tambah lamaran).
  - File: `src/hooks/useKeyboardShortcuts.ts`
  - Acceptance criteria: Pintasan keyboard memicu aksi yang sesuai.

- [ ] **Responsive testing**
  - Melakukan pengecekan menyeluruh pada berbagai ukuran layar.
  - File: Seluruh komponen.
  - Acceptance criteria: Aplikasi terlihat dan berfungsi sempurna di mobile, tablet, dan desktop.

- [ ] **Accessibility audit (kontras, focus ring, screen reader)**
  - Memastikan aplikasi dapat diakses dengan baik oleh pengguna dengan kebutuhan khusus.
  - File: Seluruh komponen.
  - Acceptance criteria: Tidak ada isu kontras yang parah, dan elemen dapat dinavigasi dengan keyboard.

- [ ] **Performance optimization**
  - Mengoptimalkan ukuran bundle, load time, dan rendering.
  - File: `next.config.js`, image optimization, dynamic imports.
  - Acceptance criteria: Aplikasi terasa cepat dan Lighthouse score > 90.

---

## FASE 6: Deploy & Testing

- [ ] **Setup GitHub repository**
  - Membuat repo baru di GitHub dan melakukan push kode.
  - File: `.gitignore`, git commands.
  - Acceptance criteria: Kode sumber tersimpan aman di repositori jarak jauh.

- [ ] **Konfigurasi next.config.js untuk static export**
  - Mengatur Next.js untuk mode `output: 'export'`.
  - File: `next.config.js`
  - Acceptance criteria: Perintah `npm run build` menghasilkan folder `out` yang valid.

- [ ] **Setup GitHub Actions CI/CD**
  - Membuat workflow untuk build dan deploy otomatis.
  - File: `.github/workflows/deploy.yml`
  - Acceptance criteria: Setiap push ke branch `main` memicu build otomatis.

- [ ] **Deploy ke GitHub Pages**
  - Mengonfigurasi environment GitHub Pages untuk membaca dari artifacts GitHub Actions.
  - File: Repo settings.
  - Acceptance criteria: Aplikasi dapat diakses secara publik lewat URL GitHub Pages.

- [ ] **Testing manual (semua fitur)**
  - Menguji ulang semua alur aplikasi di environment production (GitHub Pages).
  - File: N/A
  - Acceptance criteria: Tidak ada bug atau error di production.

- [ ] **Lighthouse audit**
  - Menjalankan Lighthouse pada aplikasi live untuk memeriksa Performance, SEO, dan Best Practices.
  - File: N/A
  - Acceptance criteria: Semua metrik berwarna hijau (>90).

- [ ] **Bug fixes**
  - Memperbaiki isu-isu terakhir yang ditemukan selama testing.
  - File: Tergantung bug.
  - Acceptance criteria: Aplikasi stabil.

- [ ] **Documentation (README.md)**
  - Menulis dokumentasi cara menjalankan proyek, fitur, dan tech stack.
  - File: `README.md`
  - Acceptance criteria: Dokumentasi lengkap dan mudah dipahami.

---

## PROMPT PER FASE

Berikut adalah prompt yang dapat Anda salin dan tempel di percakapan baru dengan AI Assistant untuk mengeksekusi masing-masing fase:

### Prompt FASE 1
```text
Saya sedang membangun aplikasi "Remote Works", sebuah dashboard CRUD tracker lamaran kerja remote.
Tech stack: Next.js App Router (Static Export), TypeScript, Tailwind CSS, Firebase, dan GitHub Pages.
Design Style: Premium Liquid Glass.
Kamu bisa melihat referensi dan spesifikasi di dokumen yang ada di folder docs/project_docs.

Tolong bantu saya mengerjakan FASE 1: Foundation & Setup.
Task yang harus diselesaikan:
1. Setup Next.js project dengan TypeScript
2. Konfigurasi Tailwind CSS dengan design tokens Liquid Glass
3. Buat file konfigurasi Firebase
4. Buat folder structure clean architecture
5. Setup i18n framework (client-side)
6. Setup theme provider (dark/light mode)
7. Buat global CSS dengan design tokens
8. Buat base layout (Navbar, Sidebar, Main Area)

Hasil yang diharapkan: 
Proyek Next.js yang berjalan dengan baik secara lokal, memiliki struktur folder rapi, mendukung dark mode dan bilingual, serta siap menggunakan utilities Tailwind untuk gaya Liquid Glass.

Constraints & Best Practices:
- Gunakan React Client Components (`"use client"`) di mana perlu karena targetnya Static Export.
- Ikuti prinsip Clean Architecture.
- Komentar kode secukupnya dalam Bahasa Indonesia, variabel/fungsi dalam Bahasa Inggris.
```

### Prompt FASE 2
```text
Lanjutan proyek "Remote Works" (Next.js, Tailwind, Firebase, Liquid Glass design).
Proyek ini merupakan dashboard CRUD tracker lamaran kerja remote.

Tolong bantu saya mengerjakan FASE 2: Design System & UI Components.
Task yang harus diselesaikan:
1. Buat komponen UI primitif (Button, Badge, Modal, Input, Select, Textarea, Toggle, Toast)
2. Terapkan styling Liquid Glass pada komponen tersebut
3. Buat komponen Navbar dengan edge lighting
4. Buat komponen Sidebar
5. Buat komponen StatCard
6. Terapkan micro-animations dan hover effects
7. Pastikan semua komponen responsive dan berfungsi di dark/light mode

Hasil yang diharapkan:
Sebuah koleksi komponen UI dasar yang reusable dan memiliki estetika Premium Liquid Glass, yang siap dipakai di halaman utama aplikasi.

Constraints & Best Practices:
- Gunakan clsx atau tailwind-merge untuk menggabungkan class Tailwind.
- Pisahkan komponen ke dalam folder `src/components/ui/` dan `src/components/layout/`.
- Perhatikan kontras teks di atas elemen glass (semi-transparan).
```

### Prompt FASE 3
```text
Lanjutan proyek "Remote Works" (Next.js, Tailwind, Firebase, Liquid Glass design).
Proyek ini merupakan dashboard CRUD tracker lamaran kerja remote.

Tolong bantu saya mengerjakan FASE 3: Firebase Integration & CRUD.
Task yang harus diselesaikan:
1. Tulis kode koneksi/inisialisasi Firebase App & Firestore
2. Buat service functions untuk CRUD Firestore pada collection "applications"
3. Buat komponen ApplicationForm untuk tambah/edit data
4. Buat komponen ApplicationTable untuk menampilkan list data
5. Implementasikan fitur Delete dengan confirmation modal
6. Gunakan onSnapshot untuk real-time data updates
7. Tambahkan form validation (bisa manual atau dengan library Zod/React Hook Form)
8. Tangani loading states dan error handling (tampilkan Toast)

Hasil yang diharapkan:
Fungsi inti aplikasi (CRUD) berjalan sempurna, data tersimpan di Firestore dan UI merespons pembaruan secara real-time.

Constraints & Best Practices:
- Pastikan logika Firebase dipisah di layer `services`.
- Gunakan custom hooks (misalnya `useApplications`) untuk mengakses data di komponen React.
```

### Prompt FASE 4
```text
Lanjutan proyek "Remote Works" (Next.js, Tailwind, Firebase, Liquid Glass design).
Proyek ini merupakan dashboard CRUD tracker lamaran kerja remote.

Tolong bantu saya mengerjakan FASE 4: Advanced Features.
Task yang harus diselesaikan:
1. Tambahkan Filter di ApplicationTable (by status, email, company)
2. Tambahkan Search bar (by company name, job title)
3. Implementasikan fungsi Sort pada header tabel
4. Buat Aging Alert system (badge yang menunjukkan lamaran sudah berapa lama tidak ada update: hijau/kuning/merah)
5. Hitung dan tampilkan data di StatCards secara dinamis
6. Integrasikan Firebase Storage untuk fitur upload screenshot di form
7. Buat ImagePreviewModal untuk melihat screenshot
8. Implementasikan fitur export data tabel ke CSV

Hasil yang diharapkan:
Aplikasi memiliki fitur-fitur lanjutan yang membantu user mengelola dan menganalisis data lamaran dengan lebih efisien.

Constraints & Best Practices:
- Pemrosesan filter dan sort dapat dilakukan di sisi klien (karena data kemungkinan tidak terlalu masif untuk personal use), atau dipadukan dengan Firestore queries.
- Optimalkan ukuran file saat upload ke Firebase Storage jika memungkinkan.
```

### Prompt FASE 5
```text
Lanjutan proyek "Remote Works" (Next.js, Tailwind, Firebase, Liquid Glass design).
Proyek ini merupakan dashboard CRUD tracker lamaran kerja remote.

Tolong bantu saya mengerjakan FASE 5: Auth, i18n & Polish.
Task yang harus diselesaikan:
1. Buat sistem proteksi sederhana menggunakan PIN modal (hanya UI yang memblokir akses jika PIN salah)
2. Selesaikan implementasi switch bahasa (ID/EN)
3. Tambahkan skeleton loading states saat mengambil data dari Firestore
4. Buat empty state illustrations jika tabel kosong
5. Terapkan keyboard shortcuts untuk navigasi/aksi cepat
6. Lakukan audit responsivitas layar dan aksesibilitas dasar (focus ring, dll)
7. Terapkan optimasi performa jika ada

Hasil yang diharapkan:
Aplikasi terasa premium, terpoles dengan baik, aman (dari akses tidak sengaja), dan memiliki User Experience (UX) yang memuaskan.

Constraints & Best Practices:
- PIN perlindungan tidak perlu full backend auth, cukup mekanisme lokal/sederhana karena ini adalah dashboard personal.
- Pastikan skeleton loader memiliki bentuk yang mirip dengan konten aslinya.
```

### Prompt FASE 6
```text
Lanjutan proyek "Remote Works" (Next.js, Tailwind, Firebase, Liquid Glass design).
Proyek ini merupakan dashboard CRUD tracker lamaran kerja remote.

Tolong bantu saya mengerjakan FASE 6: Deploy & Testing.
Task yang harus diselesaikan:
1. Berikan panduan dan kode untuk next.config.js static export
2. Buat script/file `.github/workflows/deploy.yml` untuk GitHub Actions CI/CD ke GitHub Pages
3. Tuliskan panduan untuk Lighthouse audit dan perbaikan metrik
4. Buat template file `README.md` yang profesional untuk proyek ini

Hasil yang diharapkan:
Aplikasi siap untuk dirilis (production-ready) dan dapat diakses oleh publik secara online via GitHub Pages dengan dokumentasi yang lengkap.

Constraints & Best Practices:
- Perhatikan konfigurasi `basePath` atau `assetPrefix` di `next.config.js` jika di-deploy ke sub-path GitHub Pages.
- GitHub Actions workflow harus menggunakan action resmi terbaru untuk deploy Pages.
```
