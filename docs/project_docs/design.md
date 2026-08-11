# Design System: Remote Works

Dokumen ini berisi spesifikasi **Design System** untuk proyek **Remote Works**, sebuah dashboard CRUD tracker lamaran kerja remote yang mengimplementasikan gaya **Premium Liquid Glass**.

## 1. Design Philosophy

Pendekatan desain untuk Remote Works berfokus pada **Premium Liquid Glass** yang terkendali, menyeimbangkan antara estetika modern dan fungsionalitas profesional.

- **Prinsip Premium Liquid Glass yang Terkendali**: Efek glassmorphism digunakan dengan sengaja, bukan sekadar dekorasi berlebihan. Material glass memberikan kesan kedalaman (depth) dan hierarki tanpa mengorbankan keterbacaan (readability).
- **"Glass as hierarchy, not wallpaper"**: Efek glass hanya diterapkan pada *floating* atau *secondary surfaces* seperti navbar, sidebar, modal, dan stat cards.
- **"Clarity over spectacle"**: Area data utama seperti tabel (data grid) tetap menggunakan latar belakang solid untuk memastikan kontras yang tinggi dan keterbacaan maksimal saat mengelola ratusan baris data lamaran kerja.
- **Inspirasi**: Memadukan estetika Apple Liquid Glass (blur yang dalam dan halus) dengan pendekatan Microsoft Mica/Acrylic (fungsionalitas hierarkis dan *noise texture*).
- **Riset UI**: Mengacu pada temuan riset (Riset_UI) bahwa dashboard produktivitas membutuhkan *cognitive load* yang rendah. Oleh karena itu, *accent color* difokuskan untuk interaksi, sementara warna *background* dan *text* menenangkan mata.

## 2. Color System

Sistem warna menggunakan tema **Ocean Breeze** sebagai warna aksen, dengan mode gelap sebagai *default* (Dark Neutral BG).

### Dark Mode (Default)
```css
:root[data-theme="dark"] {
  /* Backgrounds */
  --bg-base: #0b1020;
  --bg-elevated: rgba(17, 24, 39, 0.72);
  --bg-solid-card: rgba(15, 23, 42, 0.88);

  /* Glass Surfaces */
  --glass-surface: rgba(127, 205, 255, 0.08); /* Ocean Breeze tinted */
  --glass-surface-strong: rgba(127, 205, 255, 0.14);
  --glass-border: rgba(127, 205, 255, 0.18);
  --glass-border-strong: rgba(127, 205, 255, 0.28);

  /* Accents */
  --accent-primary: #7FCDFF; /* Ocean Breeze dark */
  --accent-secondary: #DFF7FF; /* Ocean Breeze light */
  --accent-hover: #9DD8FF;
  --accent-active: #5BBFFF;

  /* Typography */
  --text-primary: rgba(255, 255, 255, 0.96);
  --text-secondary: rgba(255, 255, 255, 0.72);
  --text-muted: rgba(255, 255, 255, 0.48);
}
```

### Light Mode
```css
:root[data-theme="light"] {
  /* Backgrounds */
  --bg-base: #F0F9FF; /* Lightest Ocean Breeze */
  --bg-elevated: rgba(255, 255, 255, 0.85);
  --bg-solid-card: rgba(255, 255, 255, 0.92);

  /* Glass Surfaces */
  --glass-surface: rgba(127, 205, 255, 0.12);
  --glass-surface-strong: rgba(127, 205, 255, 0.20);
  --glass-border: rgba(127, 205, 255, 0.22);

  /* Accents */
  --accent-primary: #0284C7; /* Darker for contrast */
  --accent-secondary: #0EA5E9;

  /* Typography */
  --text-primary: rgba(15, 23, 42, 0.95);
  --text-secondary: rgba(15, 23, 42, 0.72);
  --text-muted: rgba(15, 23, 42, 0.48);
}
```

### Status & Semantic Colors (Both Modes)
```css
:root {
  /* Application Status */
  --status-applied: #60A5FA;   /* blue-400 */
  --status-interview: #FBBF24; /* amber-400 */
  --status-offer: #34D399;     /* emerald-400 */
  --status-rejected: #F87171;  /* red-400 */
  --status-ghosted: #9CA3AF;   /* gray-400 */

  /* Aging Alerts */
  --aging-fresh: #34D399;      /* <7 days (Green) */
  --aging-warning: #FBBF24;    /* 7-14 days (Yellow) */
  --aging-danger: #F87171;     /* >14 days (Red) */
}
```

## 3. Typography System

Tipografi dibangun di atas Google Fonts untuk mengoptimalkan performa dan estetika *clean modern*.

- **Font Family**: 
  - `Inter` untuk **Body & UI Elements** (Teks tabel, paragraf, tombol). Sangat legible pada ukuran kecil.
  - `Outfit` untuk **Heading & Display** (Judul halaman, angka stat, modal title). Memberikan karakter geometris dan modern.

- **Scale**:
  - `xs`: 12px
  - `sm`: 14px
  - `base`: 16px
  - `lg`: 18px
  - `xl`: 20px
  - `2xl`: 24px
  - `3xl`: 30px
  - `4xl`: 36px
  - `5xl`: 48px

- **Weight**: `400` (Regular), `500` (Medium), `600` (SemiBold), `700` (Bold)
- **Line Height**: `1.2` (Heading), `1.5` (Body), `1.75` (Relaxed/Long Form)

## 4. Spacing & Layout System

Sistem *spacing* menggunakan grid berbasis **4px** (*8pt grid system*).

- **Base Unit**: 4px
- **Scale**: `4`, `8`, `12`, `16`, `20`, `24`, `32`, `40`, `48`, `64`, `80`, `96` (px)
- **Border Radius**: 
  - `sm`: 8px (Input fields, tags)
  - `md`: 12px (Buttons, dropdowns)
  - `lg`: 16px (Stat cards)
  - `xl`: 20px (Modals)
  - `2xl`: 24px (Large containers)
  - `pill`: 999px (Badges)

- **Breakpoints**: 
  - `sm`: 640px (Mobile)
  - `md`: 768px (Tablet)
  - `lg`: 1024px (Laptop)
  - `xl`: 1280px (Desktop)
  - `2xl`: 1536px (Large Desktop)

## 5. Glass Material Tokens

Efek Liquid Glass dikonfigurasi melalui kombinasi *backdrop-filter*, *border*, dan *box-shadow*.

```css
.liquid-glass {
  background: var(--glass-surface);
  backdrop-filter: blur(14px) saturate(180%);
  -webkit-backdrop-filter: blur(14px) saturate(180%);
  border: 1px solid var(--glass-border);
  
  /* Edge lighting: border atas lebih terang */
  border-top-color: rgba(255, 255, 255, 0.15);
  border-left-color: rgba(255, 255, 255, 0.05);
  
  /* Inner highlight & ambient shadow */
  box-shadow: 
    inset 0 1px 0 rgba(255, 255, 255, 0.1),
    0 8px 32px 0 rgba(0, 0, 0, 0.2); /* Tinted shadow di dark mode */
}
```

- **Blur Values**: `subtle` (8px), `base` (14px), `medium` (20px), `heavy` (24px)
- **Noise Texture Overlay**: Ditambahkan pseudo-element dengan background SVG *noise* pada *opacity* 2-5% untuk mengurangi *banding* dan menambah nuansa premium.
- **Active State Glow**: Saat tombol atau *card active*, tambahkan `box-shadow: 0 0 16px var(--glass-surface-strong);`.

## 6. Component Specifications

### 6.1 Glass Navbar
- **Visual**: Floating sticky navbar di atas.
- **Glass Properties**: `blur(20px)`, `saturate(180%)`, *edge lighting* di bagian bawah.
- **Isi**: Logo, Search Bar, Mode Toggle, Language Toggle, User Profile.
- **Spacing**: Padding Y 16px, Padding X 24px.

### 6.2 Glass Sidebar
- **Visual**: Panel navigasi dan filter di sebelah kiri.
- **Glass Properties**: `blur(14px)`.
- **States**: Collapsible (lebar 240px ke 80px).
- **Behavior**: Menu *active* mendapat *glow* dan *background* sedikit lebih terang.

### 6.3 Glass Stat Cards
```text
+-------------------------+
| [Icon] Total Lamaran    |
|                         |
|         124             |
|                         |
| +12 minggu ini          |
+-------------------------+
```
- **Visual**: 4 kartu berjejer di atas tabel (Total, Applied, Interview, Offer).
- **Glass Properties**: `blur(14px)`, `border-radius: lg(16px)`.
- **Animation**: *Hover* membuat kartu sedikit terangkat (`translateY(-2px)`) dan menambah intensitas *inner highlight*.

### 6.4 Solid Data Table
- **Visual**: Area kerja utama. **TANPA GLASS** untuk *Clarity over spectacle*.
- **Background**: Solid (menggunakan `--bg-solid-card`).
- **Fitur**: Striped rows (baris ganjil/genap beda warna tipis), sticky header, hover state per baris (solid highlight).
- **Spacing**: Cell padding 12px 16px.

### 6.5 Button
- **Primary**: Solid accent color, text putih/gelap. Hover: *brightness* bertambah.
- **Secondary (Glass)**: Latar glass transparan, border tipis. Hover: latar glass lebih pekat.
- **Danger**: Solid/Outline Red.
- **Ghost**: Transparan, muncul warna latar saat *hover*.
- **Sizes**: `sm` (h: 32px), `md` (h: 40px), `lg` (h: 48px).

### 6.6 Badge (Status & Aging)
- **Status Badges**: Menggunakan warna status (Applied, Interview, dll) dengan *opacity* 15% untuk latar dan 100% untuk teks, border-radius `pill`.
- **Aging Badges**: Dot warna atau teks kecil (Fresh, Warning, Danger) untuk indikator umur lamaran.

### 6.7 Form Elements (Input/Select/Textarea)
- **Visual**: Semi-solid background. Tidak sepenuhnya *glass* agar mudah diketik.
- **Focus State**: Border berubah menjadi `--accent-primary`, tambahkan ring 2px.

### 6.8 Toast Notification
- **Visual**: Melayang di pojok kanan bawah. *Glass finish* tebal (`heavy blur`).
- **Animation**: *Slide-in* dari kanan. *Slide-out* ke kanan.

## 7. Motion & Animation System

- **Duration**: 
  - `fast`: 140ms (Hover state, color toggle)
  - `base`: 220ms (Dropdown, modal fade)
  - `slow`: 360ms (Sidebar collapse, layout shifts)
- **Easing**: 
  - *Standard*: `cubic-bezier(0.2, 0.8, 0.2, 1)`
  - *Emphasized*: `cubic-bezier(0.2, 0, 0, 1)` (Untuk *entrance* modal)
- **Interactions**:
  - *Hover*: Subtle glow shift, slight elevation (`box-shadow`).
  - *Active/Pressed*: `scale(0.97)`, *inner highlight* bertambah, bayangan mengecil.
- **Modals**: Masuk dengan `opacity 0 -> 1` dan `scale 0.95 -> 1`.
- **Reduced Motion**: Gunakan `@media (prefers-reduced-motion: reduce)` untuk mematikan transisi *scale* dan *slide*, ubah menjadi *fade* instan (0ms).

## 8. Responsive Design

Desain beradaptasi dengan gracefully pada berbagai ukuran layar, dengan penyesuaian intensitas *glass* (mengurangi blur pada *mobile* untuk menghemat GPU/baterai).

- **Desktop (>1280px)**: Sidebar (expanded) kiri, tabel data dengan semua kolom, stat cards (4 kolom).
- **Laptop (1024-1279px)**: Sidebar (collapsible) kiri, tabel data (beberapa kolom opsional disembunyikan).
- **Tablet (768-1023px)**: Navigasi berubah menjadi Bottom Nav / Hamburger Menu. Tabel hybrid (kolom esensial saja) dan *stat cards* (2 kolom x 2 baris).
- **Mobile (<768px)**: Bottom Nav (Fix). View tabel diubah menjadi **Card List** vertikal agar mudah dibaca. *Glass blur* diturunkan menjadi `8px`.

## 9. Accessibility (a11y)

- **Focus Ring**: `outline: 2px solid var(--accent-primary); outline-offset: 2px;` pada semua elemen interaktif saat diakses via *keyboard* (`:focus-visible`).
- **Contrast Ratio**: Memastikan teks *Primary* dan *Secondary* memenuhi minimum rasio 4.5:1 terhadap *background/glass*.
- **High Contrast Mode**: *Fallback* CSS jika Windows High Contrast aktif, *glass* akan diubah menjadi solid border.
- **Screen Reader**: Menambahkan `aria-hidden="true"` pada elemen dekoratif *glass* (seperti efek pendar) dan SVG abstrak.
- **Touch Targets**: Area tap/klik pada *mobile* dan *tablet* minimal berukuran 44x44px.

## 10. Dark/Light Mode Transitions

- **Metode**: Menggunakan CSS Custom Properties (Variables) di bawah pseudo-selector `:root` dan `[data-theme="dark/light"]`.
- **Transisi**: Transisi halus pada *background-color* dan *border-color* selama 300ms.
  ```css
  * {
    transition: background-color 300ms ease, border-color 300ms ease, color 300ms ease;
  }
  ```
- **Persistensi**: Menyimpan preferensi pengguna (user preference) di `localStorage`.
- **System Preference Detection**: Secara *default* mengecek `@media (prefers-color-scheme: dark)` jika `localStorage` kosong.
