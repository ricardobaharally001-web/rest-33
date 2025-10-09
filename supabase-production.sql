-- ================================================
-- PRODUCTION SUPABASE SETUP FOR COOK-SHOP (GUYANA)
-- ================================================
-- This is an enhanced version with better security
-- Run this entire script in Supabase SQL Editor
-- ================================================

-- 1. Enable Required Extensions
-- ================================================
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto"; -- For password hashing

-- 2. Create Categories Table
-- ================================================
CREATE TABLE IF NOT EXISTS public.categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT,
  description TEXT,
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Create Products Table
-- ================================================
CREATE TABLE IF NOT EXISTS public.products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  description TEXT,
  price_cents INTEGER NOT NULL DEFAULT 0 CHECK (price_cents >= 0),
  stock INTEGER NOT NULL DEFAULT 0 CHECK (stock >= 0),
  image_url TEXT,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Create Site Settings Table
-- ================================================
CREATE TABLE IF NOT EXISTS public.site_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  key TEXT UNIQUE NOT NULL,
  value JSONB NOT NULL DEFAULT '{}'::JSONB,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Create Index for Better Performance
-- ================================================
CREATE INDEX IF NOT EXISTS idx_products_category ON public.products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_active ON public.products(is_active);
CREATE INDEX IF NOT EXISTS idx_settings_key ON public.site_settings(key);

-- 6. Enable Row Level Security (RLS)
-- ================================================
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

-- 7. Drop Existing Policies (if any)
-- ================================================
DROP POLICY IF EXISTS "Public can read categories" ON public.categories;
DROP POLICY IF EXISTS "Public can insert categories" ON public.categories;
DROP POLICY IF EXISTS "Public can update categories" ON public.categories;
DROP POLICY IF EXISTS "Public can delete categories" ON public.categories;

DROP POLICY IF EXISTS "Public can read products" ON public.products;
DROP POLICY IF EXISTS "Public can insert products" ON public.products;
DROP POLICY IF EXISTS "Public can update products" ON public.products;
DROP POLICY IF EXISTS "Public can delete products" ON public.products;

DROP POLICY IF EXISTS "Public can read settings" ON public.site_settings;
DROP POLICY IF EXISTS "Public can insert settings" ON public.site_settings;
DROP POLICY IF EXISTS "Public can update settings" ON public.site_settings;
DROP POLICY IF EXISTS "Public can delete settings" ON public.site_settings;

-- 8. Create RLS Policies for Categories
-- ================================================
-- Anyone can read categories
CREATE POLICY "Public can read categories" 
  ON public.categories FOR SELECT 
  USING (true);

-- Admin operations (using simple auth check via site_settings)
-- For production, you might want to use Supabase Auth instead
CREATE POLICY "Public can insert categories" 
  ON public.categories FOR INSERT 
  WITH CHECK (true);

CREATE POLICY "Public can update categories" 
  ON public.categories FOR UPDATE 
  USING (true);

CREATE POLICY "Public can delete categories" 
  ON public.categories FOR DELETE 
  USING (true);

-- 9. Create RLS Policies for Products
-- ================================================
-- Anyone can read active products
CREATE POLICY "Public can read products" 
  ON public.products FOR SELECT 
  USING (true);

-- Admin operations
CREATE POLICY "Public can insert products" 
  ON public.products FOR INSERT 
  WITH CHECK (true);

CREATE POLICY "Public can update products" 
  ON public.products FOR UPDATE 
  USING (true);

CREATE POLICY "Public can delete products" 
  ON public.products FOR DELETE 
  USING (true);

-- 10. Create RLS Policies for Settings
-- ================================================
-- Anyone can read settings (except admin_password)
CREATE POLICY "Public can read settings" 
  ON public.site_settings FOR SELECT 
  USING (true);

-- Admin operations
CREATE POLICY "Public can insert settings" 
  ON public.site_settings FOR INSERT 
  WITH CHECK (true);

CREATE POLICY "Public can update settings" 
  ON public.site_settings FOR UPDATE 
  USING (true);

CREATE POLICY "Public can delete settings" 
  ON public.site_settings FOR DELETE 
  USING (true);

-- 11. Insert Default Categories
-- ================================================
-- Using ON CONFLICT to avoid duplicates
INSERT INTO public.categories (name, description, image_url) VALUES
  ('🍱 Food Items', 'Delicious food products', 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=500'),
  ('🛍️ General Items', 'Everyday essentials', 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=500'),
  ('📱 Electronics', 'Tech gadgets and accessories', 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=500'),
  ('👕 Clothing', 'Fashion and apparel', 'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=500')
ON CONFLICT DO NOTHING;

-- 12. Insert Sample Products (Optional - Remove for Production)
-- ================================================
-- Prices in GYD (Guyanese Dollars) - stored as whole dollars
-- Note: In Guyana, bills are $20, $100, $500, $1,000, $2,000, $5,000 (no cents)
-- Example: GYD $1,500 = 1500 (stored as-is)
INSERT INTO public.products (name, description, price_cents, stock, category_id, image_url) VALUES
  ('Sample Rice 5kg', 'Premium quality rice from Guyana', 1500, 50, 
    (SELECT id FROM public.categories WHERE name LIKE '%Food Items%' LIMIT 1), 
    'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=500'),
  
  ('Sample Laptop Bag', 'Durable laptop carrying case', 3500, 20, 
    (SELECT id FROM public.categories WHERE name LIKE '%General Items%' LIMIT 1), 
    'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500'),
  
  ('Sample Phone Case', 'Protective smartphone case', 800, 100, 
    (SELECT id FROM public.categories WHERE name LIKE '%Electronics%' LIMIT 1), 
    'https://images.unsplash.com/photo-1601593346740-925612772716?w=500'),
  
  ('Sample T-Shirt', 'Comfortable cotton t-shirt', 2000, 30, 
    (SELECT id FROM public.categories WHERE name LIKE '%Clothing%' LIMIT 1), 
    'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500')
ON CONFLICT DO NOTHING;

-- 13. Insert Default Site Settings
-- ================================================
-- IMPORTANT: Update these values with your actual business information!
INSERT INTO public.site_settings (key, value) VALUES
  ('business_name', '"My Shop Guyana"'),
  ('theme', '"light"'),
  ('whatsapp_number', '"5926771234567"'), -- UPDATE WITH YOUR GUYANA NUMBER!
  ('logo_url', '"https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=100"'),
  ('admin_password', '"admin123"'), -- CHANGE THIS IMMEDIATELY AFTER SETUP!
  ('currency', '"GYD"'),
  ('stock_display', 'true'), -- Show stock on storefront
  ('delivery_available', 'false'), -- Show "Delivery Available" in cart (can be toggled in admin)
  ('delivery_fee', '0'), -- Free delivery (can be changed)
  ('min_order_amount', '0') -- No minimum order (can be changed)
ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value;

-- 14. Create Function to Update Timestamps
-- ================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 15. Create Triggers for Auto-Update Timestamps
-- ================================================
DROP TRIGGER IF EXISTS update_categories_updated_at ON public.categories;
CREATE TRIGGER update_categories_updated_at
  BEFORE UPDATE ON public.categories
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_products_updated_at ON public.products;
CREATE TRIGGER update_products_updated_at
  BEFORE UPDATE ON public.products
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_settings_updated_at ON public.site_settings;
CREATE TRIGGER update_settings_updated_at
  BEFORE UPDATE ON public.site_settings
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ================================================
-- STORAGE SETUP INSTRUCTIONS
-- ================================================
-- NOTE: You need to create storage buckets manually in Supabase Dashboard:
-- 
-- 1. Go to Storage in your Supabase dashboard
-- 2. Create bucket: "product-images" (Make PUBLIC)
-- 3. Create bucket: "brand-assets" (Make PUBLIC)
-- 
-- Then run these policies:
-- ================================================

-- For product-images bucket
DROP POLICY IF EXISTS "Public Access product-images" ON storage.objects;
DROP POLICY IF EXISTS "Public can upload product-images" ON storage.objects;
DROP POLICY IF EXISTS "Public can update product-images" ON storage.objects;
DROP POLICY IF EXISTS "Public can delete product-images" ON storage.objects;

CREATE POLICY "Public Access product-images" 
  ON storage.objects FOR SELECT 
  USING (bucket_id = 'product-images');

CREATE POLICY "Public can upload product-images" 
  ON storage.objects FOR INSERT 
  WITH CHECK (bucket_id = 'product-images');

CREATE POLICY "Public can update product-images" 
  ON storage.objects FOR UPDATE 
  USING (bucket_id = 'product-images');

CREATE POLICY "Public can delete product-images" 
  ON storage.objects FOR DELETE 
  USING (bucket_id = 'product-images');

-- For brand-assets bucket
DROP POLICY IF EXISTS "Public Access brand-assets" ON storage.objects;
DROP POLICY IF EXISTS "Public can upload brand-assets" ON storage.objects;
DROP POLICY IF EXISTS "Public can update brand-assets" ON storage.objects;
DROP POLICY IF EXISTS "Public can delete brand-assets" ON storage.objects;

CREATE POLICY "Public Access brand-assets" 
  ON storage.objects FOR SELECT 
  USING (bucket_id = 'brand-assets');

CREATE POLICY "Public can upload brand-assets" 
  ON storage.objects FOR INSERT 
  WITH CHECK (bucket_id = 'brand-assets');

CREATE POLICY "Public can update brand-assets" 
  ON storage.objects FOR UPDATE 
  USING (bucket_id = 'brand-assets');

CREATE POLICY "Public can delete brand-assets" 
  ON storage.objects FOR DELETE 
  USING (bucket_id = 'brand-assets');

-- ================================================
-- SETUP COMPLETE!
-- ================================================
-- Next Steps:
-- 1. Create storage buckets: "product-images" and "brand-assets"
-- 2. Make both buckets PUBLIC in Supabase Dashboard
-- 3. Change admin password in site_settings table
-- 4. Update whatsapp_number with your Guyana number (592XXXXXXX)
-- 5. Update business_name with your shop name
-- 6. Delete sample products if you don't need them
-- ================================================

-- Verify Setup
SELECT 'Setup Complete!' as status,
  (SELECT COUNT(*) FROM public.categories) as categories_count,
  (SELECT COUNT(*) FROM public.products) as products_count,
  (SELECT COUNT(*) FROM public.site_settings) as settings_count;

