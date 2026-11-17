# Rysee — Affiliate Commerce Platform

Platform affiliate untuk menjual produk digital dan jasa pembuatan website. Affiliate membuat toko mereka sendiri, menambahkan produk dari katalog, dan mendapatkan komisi dari setiap penjualan — termasuk sistem referral dan payout.

**Live:** [rysee.my.id](https://rysee.my.id)

## Tech Stack

- **Framework:** Next.js 15 (App Router, Server Components, Route Handlers)
- **Language:** TypeScript
- **Database:** PostgreSQL (Supabase) via Prisma 7 + `@prisma/adapter-pg`
- **Auth:** Supabase Auth (member), signed cookie session (admin, HMAC-SHA256 via Web Crypto, edge middleware)
- **Payments:** Midtrans Snap + manual transfer verification flow
- **Storage:** Supabase Storage, Cloudinary
- **Email:** Resend
- **Styling:** Tailwind CSS, Framer Motion

## Fitur Utama

- **Katalog produk** — template website & produk digital dengan ISR (`unstable_cache` + `revalidateTag` on admin CRUD)
- **Toko affiliate** (`/affstore/[userId]`) — storefront per-affiliate dengan link tracking
- **Sistem komisi** — per-tier (free/pro/premium), earnings dashboard, withdrawal request flow
- **Referral program** — referral tracking, komisi, dan payout approval
- **Order lifecycle** — checkout (Midtrans / manual), proof upload, admin approve/decline, delivery via signed download link dengan expiry
- **Admin dashboard** (`/dashboard`) — overview analytics, sales chart, traffic split, manajemen produk/template/membership/admin
- **Kelas konten** — materi edukasi untuk member

## Struktur

```
app/
  api/              # route handlers (public, user, admin)
  dashboard/        # admin dashboard (protected)
  templates/        # katalog template website
  digital-products/ # katalog produk digital
  affstore/         # storefront per affiliate
lib/
  prisma.ts         # Prisma + pg pool
  catalog.ts        # cached product queries
  admin-auth.ts     # admin session verification (DB-backed)
  admin-session.ts  # HMAC session signature (edge-safe)
components/         # shared UI components
prisma/             # schema & seed
scripts/            # admin utilities
```

## Menjalankan Lokal

```bash
npm install
npx prisma generate
npm run dev
```

Environment variables: `DATABASE_URL`, `DIRECT_URL`, `NEXT_PUBLIC_SUPABASE_URL`,
`NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`,
`MIDTRANS_SERVER_KEY`, `NEXT_PUBLIC_MIDTRANS_CLIENT_KEY`,
`RESEND_API_KEY`, `ADMIN_EMAIL`, `ADMIN_SESSION_SECRET`, `CLOUDINARY_*`.

## Catatan Keamanan

- Admin session = `admin_session` (admin id) + `admin_sig` (HMAC-SHA256) — diverifikasi di edge middleware dan di-setiap admin API route via DB lookup
- Password admin di-hash bcrypt; reset via `npx ts-node scripts/reset-admin-password.ts <password>`
- Seed admin: `SEED_ADMIN_PASSWORD=<pw> npm run seed`
