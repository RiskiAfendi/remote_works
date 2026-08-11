# Panduan Audit & Optimasi Lighthouse - Remote Works

Dokumen ini berisi panduan komprehensif untuk menjalankan audit **Google Lighthouse** pada aplikasi **Remote Works** serta strategi perbaikan metrik untuk mencapai target skor **> 90** di semua kategori: **Performance**, **Accessibility**, **Best Practices**, dan **SEO**.

---

## 1. Ringkasan Target Metrik

| Kategori | Target Skor | Fokus Utama |
| :--- | :--- | :--- |
| **Performance** | 🟢 90 - 100 | LCP < 2.5s, CLS < 0.1, INP < 200ms, Rendering Liquid Glass yang teroptimasi GPU |
| **Accessibility** | 🟢 95 - 100 | Kontras warna di atas background glass, ARIA labels, Keyboard navigation |
| **Best Practices** | 🟢 100 | HTTPS, No console errors, modern Web APIs, security headers |
| **SEO** | 🟢 95 - 100 | Meta tags lengkap, struktur HTML semantik, responsive viewport |

---

## 2. Langkah-Langkah Menjalankan Audit

### Cara 1: Menggunakan Chrome DevTools (Rekomendasi)
1. Build aplikasi secara lokal untuk mode produksi:
   ```bash
   npm run build
   npx serve out
   ```
2. Buka browser **Google Chrome** dalam mode **Incognito/Private** (untuk menghindari interferensi ekstensi browser).
3. Akses `http://localhost:3000` (atau URL preview serve).
4. Tekan `F12` atau `Ctrl + Shift + I` untuk membuka DevTools, lalu pilih tab **Lighthouse**.
5. Konfigurasi audit:
   - **Mode**: Navigation (Default)
   - **Device**: Desktop (atau Mobile untuk pengujian seluler)
   - **Categories**: Centang seluruh 4 kategori (*Performance*, *Accessibility*, *Best Practices*, *SEO*).
6. Klik **Analyze page load**.

### Cara 2: Menggunakan Lighthouse CLI
Jalankan audit secara otomatis dari command line:
```bash
npx lighthouse-ci collect --url=http://localhost:3000
```

---

## 3. Strategi Optimasi per Kategori

### A. Performance (Kinerja Rendering & Loading)

Efek **Liquid Glass (Glassmorphism)** memerlukan daya pemrosesan GPU/CPU untuk rendering `backdrop-filter: blur()`. Berikut optimasi yang telah dan harus diterapkan:

1. **Optimasi CSS Backdrop Blur & GPU Acceleration**:
   - Gunakan kelas Tailwind `backdrop-blur-md` atau `backdrop-blur-lg` daripada nilai blur yang berlebihan (`backdrop-blur-3xl`).
   - Tambahkan utility hardware acceleration `transform-gpu` pada kontainer glass yang sering di-render atau dianimasikan untuk memindahkan beban komposisi ke GPU.
   - Hindari penerapan `backdrop-blur` pada elemen anak yang bersarang (*nested glass elements*).

2. **Font Optimization dengan `next/font`**:
   - Gunakan `next/font/google` (Geist / Inter) dengan opsi `display: 'swap'` untuk mencegah *Flash of Unstyled Text* (FOUT) atau *Flash of Invisible Text* (FOIT).

3. **Static Export Image Handling**:
   - Karena mode static export menggunakan `images.unoptimized: true`, pastikan gambar/screenshot yang diunggah ke Firebase Storage telah di-compress (format WebP/JPEG, max 2MB).
   - Selalu sertakan atribut `width` dan `height` atau aspek rasio pada elemen `<img>` untuk mencegah **Cumulative Layout Shift (CLS)**.

4. **Dynamic Imports & Code Splitting**:
   - Gunakan `next/dynamic` atau React `lazy` untuk memuat modal berat (seperti `ApplicationForm` atau `ImagePreviewModal`) secara *on-demand* saat pengguna melakukan interaksi.

---

### B. Accessibility (Aksesibilitas & Kontras Visual)

Tantangan utama pada UI Glassmorphism adalah menjaga keterbacaan teks di atas latar belakang semi-transparan.

1. **Kontras Warna Teks & Glass**:
   - Teks utama harus menggunakan kontras tinggi:
     - **Dark Mode**: Teks `text-slate-100` atau `text-white` di atas `bg-slate-900/80` atau `bg-white/10`.
     - **Light Mode**: Teks `text-slate-900` atau `text-slate-800` di atas `bg-white/70` atau `bg-slate-100/80`.
   - Hindari warna teks yang terlalu pudar (`text-slate-400` hanya untuk label sekunder atau placeholder).

2. **Keyboard Focus Visible Ring**:
   - Semua elemen interaktif (`<button>`, `<input>`, `<a>`, `<select>`) wajib memiliki indicator focus ring yang jelas untuk navigasi keyboard:
     ```tsx
     className="focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
     ```

3. **Dukungan ARIA Labels & Roles**:
   - Berikan `aria-label` pada tombol yang hanya menggunakan ikon (misal: tombol edit/delete ikon trash):
     ```tsx
     <button aria-label="Hapus Lamaran" className="...">
       <TrashIcon />
     </button>
     ```
   - Komponen Modal wajib menggunakan `role="dialog"` dan `aria-modal="true"`.

---

### C. Best Practices (Praktik Terbaik Pengembangan Web)

1. **Clean Console Log di Production**:
   - Pastikan tidak ada `console.log` debug yang tertinggal pada kode production.

2. **Security & HTTPS**:
   - Firebase SDK mengomunikasikan data secara otomatis via SSL/TLS (HTTPS).
   - GitHub Pages menyediakan sertifikat SSL otomatis untuk repositori publik.

3. **Valid DOCTYPE & HTML Structure**:
   - File `layout.tsx` harus mendeklarasikan `lang` yang sesuai (`<html lang="id">` atau dinamis berdasarkan konteks i18n).

---

### D. SEO (Search Engine Optimization)

1. **Meta Tags & Title Structure**:
   - Setiap halaman memiliki `<title>` dan `<meta name="description">` yang kontekstual dan unik:
     ```tsx
     export const metadata: Metadata = {
       title: 'Remote Works - Remote Job Application Tracker',
       description: 'Dashboard tracker lamaran kerja remote dengan desain Liquid Glass dan integrasi real-time Firebase.',
     };
     ```

2. **HTML Semantik**:
   - Gunakan struktur elemen semantik HTML5:
     - `<header>` untuk Navbar
     - `<aside>` untuk Sidebar
     - `<main>` untuk area konten utama
     - `<h1>` utama per halaman
     - `<table>`, `<thead>`, `<tbody>` untuk daftar lamaran

3. **Viewport Meta Tag**:
   - Dipastikan ada di `layout.tsx`: `width=device-width, initial-scale=1.0`.

---

## 4. Checklist Pengujian Sebelum Rilis

- [x] Run `npm run build` tanpa warning atau error TypeScript.
- [x] Uji keterbacaan teks pada Light Mode dan Dark Mode.
- [x] Pastikan semua tombol ikon memiliki `aria-label`.
- [x] Cek navigasi `Tab` keyboard mengitari form dan modal secara logis.
- [x] Jalankan Lighthouse audit dan simpan laporan di folder `docs/lighthouse/`.
