# cook-shop (Next.js + Supabase + Render)

Fast, modern storefront and admin dashboard for **cook-shop**.

## Features
- Storefront with category filter, search, product grid, add-to-cart
- Cart persisted with Zustand → WhatsApp checkout (`wa.me/<phone>?text=<order>`)
- Admin settings/categories/products (Supabase authenticated users can write)
- Image URLs (use Supabase public storage buckets `product-images` and `brand-assets`)
- Dark mode (persistent), mobile-first nav
- SEO (OG/meta, robots, sitemap)
- Accessibility-first components & focus states

## 1) Prereqs
- Supabase project with anon/public URL + anon key
- Storage buckets: `product-images`, `brand-assets`
- Enable Email auth (or any provider you prefer)

## 2) Database
Paste `supabase.sql` into the Supabase SQL editor and run.  
If you already have `categories`/`products`, this will **not** overwrite, and it will create the `site_settings` table. Policies enable public read and authenticated write.

## 3) Local run
```bash
# 1) Clone & install
npm i

# 2) Configure env
cp .env.example .env
# put NEXT_PUBLIC_SUPABASE_URL + NEXT_PUBLIC_SUPABASE_ANON_KEY

# 3) Dev
npm run dev
```

## 4) Deploy on Render
1. Push this repo to GitHub.
2. Create a **Web Service** on Render → pick this repo.
3. Runtime: **Node 18+**. Build: `npm run build`. Start: `npm start`.
4. Add **Environment Variables**:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - (optional) `SITE_URL` for sitemap
5. (Optional) Add a Secret File if you want `.env` at `/etc/secrets/.env` and Render will pick it up.

## 5) Usage
- Visit `/admin/settings` and set **business_name**, **logo_url**, **theme**, **whatsapp_number`.  
- Add categories & products (or keep using your existing data).  
- Storefront is at `/`, cart at `/cart`.

## 6) Notes
- Public read uses RLS (anon ok). Writes require authenticated users. You can use Supabase Dashboard → Authentication to sign up your admin email and log in from any API client; this starter keeps admin pages open to any browser session that has a Supabase auth session (you can harden with server-side checks or middleware).
- Next/Image is configured to allow Supabase public storage URLs.
- If you previously had a `settings` table, this SQL will copy values into the new `site_settings` table to prevent `column "key" ... does not exist` errors.

## 7) Theming
Tailwind tokens live in `tailwind.config.ts` and `app/globals.css`. Buttons and cards use utility classes. The hamburger icon stays visible in dark mode.

---

MIT © You
