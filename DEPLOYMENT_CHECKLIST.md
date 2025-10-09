# 🚀 Quick Deployment Checklist

Use this checklist when deploying your e-commerce store to production.

---

## Pre-Deployment (Before You Start)

- [ ] Read `PRODUCTION_SETUP_GUIDE.md` completely
- [ ] Have Supabase account ready
- [ ] Have Vercel/Netlify account ready
- [ ] Have WhatsApp Business app installed
- [ ] Have products and images ready
- [ ] Have business information ready

---

## Phase 1: Database Setup (30 minutes)

### Supabase Setup
- [ ] Create Supabase project
- [ ] Copy Project URL and API Key
- [ ] Run `supabase-production.sql` in SQL Editor
- [ ] Create storage bucket: `product-images` (Public)
- [ ] Create storage bucket: `brand-assets` (Public)
- [ ] Verify tables created (categories, products, site_settings)

### Test Database
- [ ] Check categories table has sample data
- [ ] Check products table has sample data
- [ ] Check site_settings table has default values

---

## Phase 2: Local Testing (20 minutes)

### Environment Setup
- [ ] Create `.env.local` file
- [ ] Add `NEXT_PUBLIC_SUPABASE_URL`
- [ ] Add `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- [ ] Add `NEXT_PUBLIC_WHATSAPP_NUMBER` (format: 592XXXXXXX)
- [ ] Add `NEXT_PUBLIC_BUSINESS_NAME`
- [ ] Add `NEXT_PUBLIC_CURRENCY=GYD`

### Run Locally
```bash
npm install
npm run dev
```

- [ ] Open `http://localhost:3000`
- [ ] Homepage loads successfully
- [ ] Products display
- [ ] Can add to cart
- [ ] Cart page works
- [ ] Admin login works (password: `admin123`)

---

## Phase 3: Deployment (30 minutes)

### Deploy to Vercel (Recommended)

1. **Install Vercel CLI**
```bash
npm install -g vercel
```

2. **Login**
```bash
vercel login
```

3. **Deploy**
```bash
cd rest-33-main
vercel
```

4. **Set Environment Variables**
- [ ] Go to Vercel Dashboard → Your Project → Settings → Environment Variables
- [ ] Add `NEXT_PUBLIC_SUPABASE_URL`
- [ ] Add `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- [ ] Add `NEXT_PUBLIC_WHATSAPP_NUMBER`
- [ ] Add `NEXT_PUBLIC_BUSINESS_NAME`
- [ ] Add `NEXT_PUBLIC_CURRENCY`

5. **Deploy to Production**
```bash
vercel --prod
```

- [ ] Copy production URL (e.g., `https://your-shop.vercel.app`)
- [ ] Save URL for later use

---

## Phase 4: Initial Configuration (30 minutes)

### Update Admin Settings

1. **Login to Admin**
- [ ] Go to `https://your-shop.vercel.app/admin`
- [ ] Login with password: `admin123`

2. **Change Admin Password**
- [ ] Go to Settings tab
- [ ] Change password to something secure
- [ ] Save and re-login with new password
- [ ] ⚠️ **CRITICAL**: Save new password securely!

3. **Update Business Information**
- [ ] Set Business Name
- [ ] Update WhatsApp Number (verify format: 592XXXXXXX)
- [ ] Upload Business Logo
- [ ] Set theme preference
- [ ] Enable/disable stock display

### Update Database Settings

1. **Go to Supabase Dashboard**
2. **Table Editor → site_settings**
3. **Update these rows**:
   - [ ] `business_name`: "Your Shop Name"
   - [ ] `whatsapp_number`: "5926771234567"
   - [ ] `admin_password`: (Your new secure password)
   - [ ] `logo_url`: (Your logo URL)

---

## Phase 5: Add Your Products (1-2 hours)

### Delete Sample Products (Optional)
- [ ] Go to Admin → Products
- [ ] Delete all sample products
- [ ] Or keep them as templates

### Add Real Categories
- [ ] Go to Admin → Categories
- [ ] Delete sample categories (optional)
- [ ] Add your real categories
- [ ] Upload category images
- [ ] Verify categories appear on storefront

### Add Real Products
For each product:
- [ ] Product name
- [ ] Description
- [ ] Price in GYD (whole dollars - NO cents!)
  - Example: GYD $1,500 = enter **1500**
  - Example: GYD $500 = enter **500**
  - (Guyana bills: $20, $100, $500, $1,000, $2,000, $5,000)
- [ ] Stock quantity
- [ ] Select category
- [ ] Upload product image
- [ ] Mark as Active
- [ ] Save

Verify:
- [ ] Product appears on storefront
- [ ] Image displays correctly
- [ ] Price shows correctly
- [ ] Can add to cart

---

## Phase 6: Test Everything (Use TESTING_CHECKLIST.md)

### Quick Critical Tests
- [ ] Homepage loads fast (< 3 seconds)
- [ ] All products display
- [ ] Can search products
- [ ] Can filter by category
- [ ] Can add to cart
- [ ] Cart persists after refresh
- [ ] Checkout creates WhatsApp message
- [ ] WhatsApp message has correct info
- [ ] Order arrives on your WhatsApp Business
- [ ] Admin login works
- [ ] Can edit products in admin
- [ ] Can delete products in admin

### Test on Mobile
- [ ] Open site on Android phone
- [ ] Open site on iPhone (if possible)
- [ ] Everything works on mobile
- [ ] WhatsApp checkout works on mobile

---

## Phase 7: Security Hardening (15 minutes)

### Security Checklist
- [ ] Admin password changed from default
- [ ] Environment variables not in code
- [ ] `.env.local` in `.gitignore`
- [ ] Supabase RLS policies enabled
- [ ] HTTPS enabled (automatic with Vercel)
- [ ] No API keys in public code

### Verify Security
- [ ] Try accessing `/admin` without login - blocked
- [ ] Try wrong admin password - denied
- [ ] Check Supabase → Authentication - RLS enabled

---

## Phase 8: WhatsApp Setup (15 minutes)

### WhatsApp Business Configuration
- [ ] WhatsApp Business app installed
- [ ] Business profile complete:
  - [ ] Business name
  - [ ] Business description
  - [ ] Business category
  - [ ] Business hours
  - [ ] Business location (Guyana)
  - [ ] Business email
  - [ ] Business website

### Test Order Reception
- [ ] Place test order on website
- [ ] Receive order on WhatsApp Business
- [ ] Order message is formatted correctly
- [ ] All product info is accurate
- [ ] Total price is correct

### Set Up Quick Replies
Create these quick replies in WhatsApp Business:

1. **Order Confirmation**
```
Thank you for your order! We've received it and will confirm shortly. 
What payment method would you prefer?
1. Cash on Delivery
2. Mobile Money (GTT/Digicel)
3. Bank Transfer
```

2. **Payment Received**
```
Payment confirmed! ✅ Your order is being prepared and will be delivered soon.
```

3. **Out for Delivery**
```
Your order is out for delivery! 🚚 You should receive it within [TIME].
```

- [ ] Quick replies created
- [ ] Test sending quick replies

---

## Phase 9: Performance Optimization (Optional)

### Image Optimization
- [ ] Compress product images (use TinyPNG.com)
- [ ] Images under 500KB each
- [ ] Use WebP format if possible

### Speed Test
- [ ] Test site speed: https://pagespeed.web.dev
- [ ] Score above 80 on mobile
- [ ] Score above 90 on desktop

---

## Phase 10: SEO & Marketing Setup (30 minutes)

### Google My Business
- [ ] Create Google My Business profile
- [ ] Add Guyana location
- [ ] Add business hours
- [ ] Add website link
- [ ] Add photos

### Social Media
- [ ] Create Facebook Business Page
- [ ] Create Instagram Business Account
- [ ] Link WhatsApp to Facebook
- [ ] Post announcement about launch

### Meta Tags (Optional)
Add to your website:
- [ ] Business description meta tag
- [ ] Open Graph image
- [ ] Favicon

---

## Phase 11: Backup Setup (15 minutes)

### Initial Backup
- [ ] Export all categories
- [ ] Export all products
- [ ] Export all settings
- [ ] Download all product images
- [ ] Save to Google Drive or external drive

### Setup Backup Reminders
- [ ] Daily reminder: Backup at 10 PM
- [ ] Weekly reminder: Sunday 8 PM
- [ ] Monthly reminder: 1st of month

Refer to: `scripts/backup-database.md`

---

## Phase 12: Go Live! 🎉

### Final Verification
- [ ] All products added
- [ ] All prices correct
- [ ] WhatsApp number verified
- [ ] Admin password secure
- [ ] Mobile site works
- [ ] Test order completed successfully
- [ ] Backup completed

### Launch Announcement
- [ ] Post on Facebook
- [ ] Post on Instagram
- [ ] Share in WhatsApp Status
- [ ] Tell friends and family
- [ ] Share in local Guyana Facebook groups

### Launch Day Monitoring
- [ ] Check website every 2 hours
- [ ] Monitor WhatsApp for orders
- [ ] Respond to customer questions quickly
- [ ] Fix any issues immediately

---

## Post-Launch (First Week)

### Daily Tasks
- [ ] Check for new orders (every 2-3 hours)
- [ ] Respond to WhatsApp messages
- [ ] Update stock levels
- [ ] Monitor website uptime
- [ ] Daily backup

### Weekly Review
- [ ] Count total orders
- [ ] Calculate total sales
- [ ] Identify popular products
- [ ] Restock low inventory
- [ ] Add new products (if needed)
- [ ] Read customer feedback
- [ ] Weekly full backup

---

## Troubleshooting

### Website Not Loading
1. Check Vercel deployment status
2. Check environment variables
3. Check DNS settings (if custom domain)

### Products Not Showing
1. Check products marked as "Active"
2. Check product has valid category
3. Refresh browser cache

### WhatsApp Not Working
1. Verify WhatsApp number format (592XXXXXXX)
2. Test on different device
3. Check if WhatsApp Business is active

### Can't Login to Admin
1. Try default password: `admin123`
2. Check browser console for errors
3. Clear browser cache
4. Check Supabase site_settings table

---

## Success Metrics

Track these weekly:
- [ ] Number of visitors
- [ ] Number of orders
- [ ] Average order value
- [ ] Most popular products
- [ ] Customer satisfaction
- [ ] Website uptime

---

## Need Help?

1. Check `PRODUCTION_SETUP_GUIDE.md` for detailed instructions
2. Review `TESTING_CHECKLIST.md` for testing help
3. Read `scripts/backup-database.md` for backup help
4. Check Supabase documentation
5. Check Vercel documentation

---

## Certification

**I certify that I have completed all checklist items:**

- [ ] All critical items completed ✅
- [ ] Site tested on mobile and desktop ✅
- [ ] Admin password changed ✅
- [ ] First backup completed ✅
- [ ] Test order successful ✅
- [ ] Ready to accept real customers ✅

**Deployed By:** ________________  
**Date:** ________________  
**Production URL:** ________________  
**Admin Password Saved:** ☐ YES (Keep secure!)

---

## 🎉 Congratulations!

Your e-commerce store is now LIVE and ready to serve customers in Guyana!

**Good luck with your business!** 🇬🇾 🚀

