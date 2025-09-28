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
