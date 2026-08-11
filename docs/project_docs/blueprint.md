# Remote Works - Project Blueprint

**Remote Works** adalah sebuah dashboard CRUD tracker lamaran kerja remote yang dirancang dengan desain Premium Liquid Glass. Dokumen ini adalah cetak biru (blueprint) yang mencakup arsitektur, teknologi, skema database, spesifikasi fitur, keamanan, dan strategi deployment proyek.

---

## 1. Project Overview

**Deskripsi Proyek**
Remote Works adalah aplikasi web dashboard yang berfungsi sebagai pencatat dan pelacak (tracker) lamaran pekerjaan remote. Aplikasi ini memungkinkan pengguna untuk memantau status setiap lamaran, mencatat detail penting seperti ekspektasi gaji dan keterampilan yang dibutuhkan, serta menyimpan tangkapan layar terkait pekerjaan tersebut.

**Tujuan**
- Memberikan wadah tersentralisasi bagi pencari kerja untuk mengelola proses aplikasi mereka.
- Mengurangi kebingungan akibat banyaknya lamaran yang dikirim di berbagai platform (LinkedIn, Indeed, portal perusahaan, dll).
- Memberikan visibilitas terhadap status lamaran yang belum ditindaklanjuti (_aging alert_).

**Target Pengguna**
Individu (Single User) yang aktif melamar pekerjaan jarak jauh (remote work) dan membutuhkan sistem pencatatan pribadi yang terstruktur dan menarik secara visual.

---

## 2. Architecture Overview

Aplikasi dibangun sebagai **Static Site** menggunakan Next.js Static Export. Data diambil dan dimanipulasi secara langsung (Client-Side) dari Firebase (Firestore & Storage) melalui SDK. Aplikasi di-hosting di GitHub Pages.

```mermaid
architecture-beta
    group client(Client Side)
    group firebase(Firebase Services)
    group hosting(GitHub Infrastructure)

    service app(Next.js App) in client
    service firestore(Firestore DB) in firebase
    service storage(Cloud Storage) in firebase
    service pages(GitHub Pages) in hosting

    app:app -- read/write --> firestore:firestore
    app:app -- upload/download --> storage:storage
    pages:pages -- serve --> app:app
```

**Data Flow:**
1. Pengguna membuka dashboard melalui GitHub Pages.
2. Aplikasi Next.js meminta PIN akses.
3. Setelah diverifikasi secara lokal, aplikasi menginisialisasi koneksi ke Firebase.
4. Komponen dashboard memuat data dari Firestore secara real-time.
5. Gambar yang diunggah dikirim ke Firebase Storage, lalu _download URL_ disimpan di Firestore.

---

## 3. Tech Stack Detail

| Kategori | Teknologi | Alasan Pemilihan |
| :--- | :--- | :--- |
| **Framework** | Next.js (App Router) | Memberikan struktur yang clean, optimasi bawaan, dan fitur Static Export yang sangat cocok untuk di-host di GitHub Pages. |
| **Styling** | Tailwind CSS | Utility-first CSS mempermudah pembuatan desain kustom seperti Premium Liquid Glass dengan performa tinggi. |
| **Database** | Firebase Firestore | NoSQL document database yang _serverless_, sangat cocok untuk single-page application (SPA) dengan sinkronisasi real-time. |
| **File Storage**| Firebase Storage | Integrasi mulus dengan ekosistem Firebase untuk menyimpan file _screenshot_ bukti lamaran. |
| **Hosting** | GitHub Pages | Gratis, andal, dan dapat diintegrasikan dengan mudah menggunakan GitHub Actions untuk CI/CD (Static Export). |
| **Icons** | Lucide React | Ringan, memiliki varian yang modern dan _clean_ yang cocok dengan estetika Glassmorphism. |

---

## 4. Database Schema

Semua data lamaran disimpan dalam collection `applications` di Firestore.

**Collection:** `applications`

```typescript
type Status = 'Applied' | 'Interview' | 'Offer' | 'Rejected' | 'Ghosted';
type EmploymentType = 'Full-time' | 'Part-time' | 'Contract' | 'Hourly';

interface Application {
  id: string; // Auto-generated document ID
  company_name: string; // Nama perusahaan
  job_title: string; // Posisi pekerjaan
  source_url: string; // URL sumber lowongan (LinkedIn, dsb)
  apply_url: string; // URL portal lamaran (jika berbeda dengan sumber)
  account_email: string; // Email yang digunakan untuk melamar
  applied_date: Timestamp; // Tanggal melamar (Firestore Timestamp)
  status: Status; // Status lamaran saat ini
  image_url: string; // URL screenshot dari Firebase Storage
  salary_rate: string; // Ekspektasi/Penawaran gaji (mis. "$50/hr", "Rp10jt/bln")
  employment_type: EmploymentType; // Jenis pekerjaan
  skills_required: string[]; // Daftar keterampilan yang dibutuhkan
  notes: string; // Catatan tambahan (opsional)
  created_at: Timestamp; // Tanggal record dibuat
  updated_at: Timestamp; // Tanggal record terakhir diubah
}
```

---

## 5. Feature Specifications

### 5.1 CRUD Modal
- **Create**: Modal form untuk memasukkan data lamaran baru, mencakup pengunggahan gambar ke Firebase Storage.
- **Read**: Data ditampilkan dalam format _DataTable_ pada tampilan desktop, dan _Card Layout_ pada tampilan _mobile_.
- **Update**: Fungsi edit pada setiap baris/card untuk memperbarui status atau field lainnya. Menggunakan modal yang sama dengan Create (pre-filled).
- **Delete**: Fungsi hapus permanen dengan dialog konfirmasi (_soft delete_ tidak diterapkan di v1).

### 5.2 Filter & Search
- **Pencarian Teks**: Pencarian real-time (Client-side) berdasarkan `company_name` atau `job_title`.
- **Filter Dropdown**: Menyaring data berdasarkan `status` dan `account_email`.

### 5.3 Aging Alert
Visual indikator (Badge) khusus untuk status lamaran **Applied**, dihitung berdasarkan `applied_date`:
- **Hijau**: < 7 hari (Masih baru)
- **Kuning**: 7 - 14 hari (Perlu di-follow up)
- **Merah**: > 14 hari (Risiko di-ghosting tinggi)

### 5.4 Stats Cards
Kartu analitik di bagian atas dashboard (_Glassmorphism style_):
- **Total Applications**: Total semua dokumen di koleksi.
- **Applied**: Total dokumen dengan status 'Applied'.
- **Interview**: Total dokumen dengan status 'Interview'.
- **Offer**: Total dokumen dengan status 'Offer'.

### 5.5 Screenshot Upload
Input file terintegrasi dengan Firebase SDK untuk langsung mengunggah gambar ke bucket Storage dan mengembalikan _download URL_ untuk disimpan di Firestore.

### 5.6 Export CSV
Tombol aksi untuk mengunduh seluruh data (atau hasil filter saat ini) ke format `.csv` (Client-side generation).

### 5.7 Tabel Interaktif
Fitur menyortir (_Sort_) data berdasarkan kolom pada tabel Desktop (klik header tabel, misalnya menyortir dari _Applied Date_ terbaru).

### 5.8 Mode & Lokalisasi
- **Tema**: _Dark mode_ sebagai _default_, dengan _toggle switch_ ke _light mode_. Aksen warna Ocean Breeze digunakan.
- **Bilingual**: Dropdown/toggle mengubah string UI antara Bahasa Indonesia dan English menggunakan file JSON lokal.

---

## 6. Security Model

- **Authentication**: Karena bersifat _single user_, sistem tidak menggunakan Firebase Auth. Akses ke halaman utama dilindungi oleh PIN/Password sederhana yang disimpan di _environment variable_ (atau dicocokkan secara _hardcoded/hash_ di Client-side untuk v1).
- **Firebase Security Rules**: Dikonfigurasi agar hanya membaca/menulis dari domain asal (GitHub Pages) dan memblokir akses publik yang tidak diizinkan. Namun, karena ini client-side only tanpa Firebase Auth, Firebase rules mungkin diset cukup terbuka (dengan resiko jika project ID diketahui) ATAU kita mengizinkan akses ke database asalkan payload (seperti referer header) sesuai, walau spoofable. Untuk project personal, kombinasi PIN lokal dan obfuskasi variabel dianggap cukup untuk level v1.
_Saran Security Firestore: Implementasi anonymous auth atau custom token, tetapi untuk v1, fokus pada client-side PIN._

---

## 7. Deployment Strategy

- **Environment**: Aplikasi dibuild sebagai static HTML/JS (`next build` output di folder `out`).
- **CI/CD Pipeline**: GitHub Actions akan dikonfigurasi untuk:
  1. Menerima trigger *push* ke branch `main`.
  2. Menginstal dependencies (`npm ci`).
  3. Menjalankan proses _build_.
  4. Men-deploy direktori `out` ke GitHub Pages branch/environment.
- **Variabel Lingkungan (Env)**: Kredensial Firebase Client SDK akan disimpan sebagai *Repository Secrets* di GitHub dan diinjeksikan saat proses _build_.

---

## 8. Performance Targets

- **Lighthouse Score**: Target > 90 untuk kategori Performance, Accessibility, Best Practices, dan SEO.
- **Core Web Vitals**:
  - LCP (Largest Contentful Paint): < 2.5 detik (dicapai karena static export & client-side skeleton loader).
  - FID (First Input Delay): < 100 milidetik.
  - CLS (Cumulative Layout Shift): < 0.1 (mencegah tata letak tabel yang melompat saat data Firestore dimuat).

---

## 9. Accessibility Requirements

Kepatuhan WCAG 2.2 Level AA diutamakan:
- **Contrast Ratio**: Memastikan rasio kontras warna pada background _glassmorphism_ terhadap teks minimal 4.5:1.
- **Keyboard Navigation**: Semua tombol, filter, form input, dan modal (termasuk _focus trap_ di dalam modal) harus dapat diakses penuh via tombol `Tab`, `Enter`, dan `Esc`.
- **Aria Labels**: Elemen interaktif non-teks (ikon, _theme toggle_) harus dilengkapi atribut `aria-label`.
- **Screen Reader Support**: Menambahkan `role="alert"` atau `aria-live="polite"` pada notifikasi aksi (seperti saat form berhasil disimpan).

---

## 10. Folder Structure

Proyek menggunakan struktur _Clean Architecture_ pada framework Next.js:

```
remote_works/
├── public/
│   ├── assets/
│   │   ├── icons/
│   │   └── images/
│   └── locales/
│       ├── id.json
│       └── en.json
├── src/
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   └── globals.css
│   ├── components/
│   │   ├── ui/               # Reusable UI primitives (Button, Modal, Badge, dll)
│   │   ├── layout/           # Layout components (Navbar, Sidebar, Footer)
│   │   ├── dashboard/        # Dashboard-specific (StatsCards, DataTable, FilterBar)
│   │   └── forms/            # Form components (ApplicationForm, SearchInput)
│   ├── lib/
│   │   ├── firebase/         # Firebase config, firestore ops, storage ops
│   │   ├── hooks/            # Custom React hooks
│   │   ├── utils/            # Utility functions (date calc, CSV export, dll)
│   │   ├── constants/        # App constants, enums, config
│   │   └── types/            # TypeScript type definitions
│   ├── context/              # React context providers (Theme, Language, Auth)
│   └── styles/               # Additional CSS modules (bila diperlukan)
├── docs/
│   └── project_docs/         # Dokumentasi (termasuk blueprint.md ini)
├── next.config.js
├── tailwind.config.ts
├── tsconfig.json
├── package.json
└── README.md
```
