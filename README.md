# fundloka-nextjs

Port Next.js (App Router) + TailwindCSS + Redux Toolkit dari project **startup-frontend-master** (Nuxt.js/Vue, `mode: 'spa'`). Struktur halaman, alur auth, dan semua fitur dibuat 1:1 mengikuti aslinya, dan menargetkan backend `fundloka-api` (port Node/Express dari API Go yang sama).

## Pemetaan Nuxt → Next.js

| Aspek | Nuxt.js (asli) | Next.js (port ini) |
|---|---|---|
| Bahasa | JavaScript | TypeScript |
| Routing | Pages Router (`pages/`, mode `spa`) | App Router (`src/app/`) |
| State management | `@nuxtjs/auth` (auth state) + Vuex (tidak dipakai nyata) | Redux Toolkit (`authSlice`: token, user, loggedIn) |
| HTTP client | `@nuxtjs/axios` (auto-attach Bearer token) | `axios` instance + request interceptor (`src/lib/api.ts`) |
| Data per halaman | `asyncData` (client-fetch karena mode spa) | `useFetch` hook custom (client component + `useEffect`) |
| Auth guard | `middleware: 'auth'` per halaman | `<AuthGuard>` client component, dipasang di `app/dashboard/layout.tsx` |
| Layout | `layouts/auth.vue`, `default.vue`, `success.vue`, `error.vue` | Route group `(auth)/layout.tsx` untuk login/register/upload; `not-found.tsx` & `error.tsx` untuk 404/error |
| Styling | Tailwind (`@nuxtjs/tailwindcss`) + `<style lang="scss">` per halaman | Tailwind + `src/app/globals.css` (kelas dekoratif yang berulang di banyak halaman asli digabung jadi satu) |
| Font | Google Fonts CDN `@import` | `next/font/google` (self-hosted, tidak bergantung koneksi ke Google saat runtime) |

## Struktur folder

```
src/
  app/
    layout.tsx              Root layout: font Poppins, ReduxProvider + AuthInitializer
    globals.css              Tailwind + semua kelas dekoratif (card-project, cta-clip, dst)
    page.tsx                 Landing page ("/") — hero, 3 steps, list campaign, testimonial, CTA
    not-found.tsx             404 (setara layouts/error.vue)
    error.tsx                 Error boundary global
    register-success/         Halaman sukses setelah registrasi
    (auth)/
      layout.tsx              Wrapper background ungu (setara layouts/auth.vue)
      login/                  Setara pages/login.vue
      register/               Setara pages/register.vue
      upload/                  Setara pages/upload.vue (upload avatar)
    dashboard/
      layout.tsx              <AuthGuard> — setara middleware:'auth'
      page.tsx                 List campaign milik user
      transactions/            Riwayat transaksi milik user
      projects/create/         Form buat campaign baru
      projects/[id]/           Detail campaign + upload galeri + riwayat transaksi campaign
      projects/[id]/edit/       Form edit campaign
    projects/[id]/             Halaman publik detail + funding campaign
    transaction/finish|unfinish|error/   Halaman redirect Midtrans
  components/
    Navbar.tsx, Footer.tsx, CallToAction.tsx, AuthGuard.tsx
  store/
    store.ts, hooks.ts, authSlice.ts, Providers.tsx
  lib/
    api.ts        axios instance (baseURL dari env, auto-attach Bearer token dari localStorage)
    format.ts      formatNumber, imageUrl, progressPercentage
    useFetch.ts    hook generik GET + loading/error/reload
  types/api.ts     Tipe response API (User, Campaign, CampaignDetail, Transaction, dst)
public/            Semua aset statis (logo, ilustrasi, background) disalin dari static/ Nuxt
```

## Fitur yang di-cover (tidak ada yang terlewat)

- Landing page dengan data campaign real-time dari API
- Register → set token → fetch user → upload avatar → halaman sukses
- Login (redirect ke home setelah berhasil, meniru perilaku default `@nuxtjs/auth`)
- Logout (clear token lokal, tidak memanggil endpoint backend — sama seperti aslinya yang `logout: false`)
- Dashboard: list campaign milik user, buat campaign baru, detail + upload galeri gambar, edit campaign, riwayat transaksi per-campaign & per-user
- Halaman publik detail campaign: galeri gambar (klik thumbnail ganti gambar utama), form funding (kalau login) atau tombol "Sign in to Fund" (kalau belum), redirect ke `payment_url` Midtrans
- Halaman redirect Midtrans: `transaction/finish`, `transaction/unfinish`, `transaction/error`
- 404 dan error boundary

## Setup

1. Pastikan `fundloka-api` sudah jalan (lihat README-nya) — default di `http://localhost:8080`.
2. Copy env:
   ```
   cp .env.local.example .env.local
   ```
   Sesuaikan `NEXT_PUBLIC_API_BASE_URL` kalau backend jalan di port/host lain.
3. Install dependency:
   ```
   npm install
   ```
4. Jalankan development server:
   ```
   npm run dev
   ```
   Buka `http://localhost:3000`.

## Catatan verifikasi

- `npm run typecheck`, `npm run build`, dan `npm run lint` semuanya lolos tanpa error/warning.
- Server sudah di-boot dan diuji: seluruh route (`/`, `/login`, `/register`, `/dashboard`, `/projects/[id]`, 404, dst) merespons dengan status HTTP yang benar, tanpa error di log dev server.
- Sudah diuji terhadap `fundloka-api` yang benar-benar jalan: register user baru dan create campaign lewat API berhasil, bundle client-side terbukti memanggil endpoint yang tepat (`/api/v1/campaigns`, dst).
- **Keterbatasan**: karena halaman-halaman ini adalah client component yang fetch data di browser (meniru `mode: 'spa'` aslinya), verifikasi otomatis di sini terbatas pada level HTTP/build (tidak ada headless browser di environment ini untuk mengklik-klik dan melihat hasil fetch di layar). Disarankan buka di browser sungguhan untuk memvalidasi visual & interaksi (login, upload file, funding flow) sebelum dianggap final.
