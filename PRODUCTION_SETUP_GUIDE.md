# 🚀 Production Setup Guide for Guyana

This guide will help you set up your e-commerce website for selling products in Guyana.

## 📋 Prerequisites

Before you begin, make sure you have:
- [ ] A Supabase account (free tier works great) - [Sign up here](https://supabase.com)
- [ ] A Vercel/Netlify/Render account for hosting (all have free tiers)
- [ ] A WhatsApp Business number (Guyana format: +592-XXX-XXXX)
- [ ] Your product images ready
- [ ] Your business name and branding

---

## Step 1: Set Up Supabase Database

### 1.1 Create a Supabase Project

1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Click **"New Project"**
3. Choose your organization or create one
4. Fill in project details:
   - **Name**: `your-shop-name`
   - **Database Password**: Create a strong password (save this!)
   - **Region**: Choose closest to Guyana (US East or South America)
5. Click **"Create new project"** and wait 2-3 minutes

### 1.2 Configure Database Tables

1. In your Supabase dashboard, click **"SQL Editor"** in the left sidebar
2. Click **"New Query"**
3. Open the `supabase-production.sql` file from your project
4. Copy and paste the entire content into the SQL Editor
5. Click **"Run"** to create all tables and security policies

### 1.3 Create Storage Buckets

1. Go to **"Storage"** in the left sidebar
2. Click **"Create a new bucket"**
3. Create bucket: `product-images`
   - Make it **Public**
   - Click **"Create bucket"**
4. Repeat for bucket: `brand-assets`
   - Make it **Public**
   - Click **"Create bucket"**

### 1.4 Get Your Supabase Credentials

1. Go to **"Settings"** (gear icon) → **"API"**
2. Copy these values (you'll need them later):
   - **Project URL** (looks like: `https://xxxxx.supabase.co`)
   - **anon public** key (long string starting with `eyJ...`)

---

## Step 2: Configure Your Application

### 2.1 Set Up Environment Variables

1. In your project folder, create a file named `.env.local`
2. Copy the content from `.env.example`
3. Fill in your actual values:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-actual-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
NEXT_PUBLIC_WHATSAPP_NUMBER=5926771234567  # Your Guyana WhatsApp number
NEXT_PUBLIC_BUSINESS_NAME=My Amazing Shop
NEXT_PUBLIC_CURRENCY=GYD
```

**⚠️ IMPORTANT - WhatsApp Number Format:**
- Guyana country code: **592**
- Format: `592` + your 7-digit number
- Example: If your number is 677-1234, enter: `5926771234`
- NO spaces, dashes, or plus signs!

### 2.2 Update Site Settings in Supabase

1. Go to Supabase → **"Table Editor"** → **"site_settings"**
2. Update these important settings:
   - **whatsapp_number**: Your WhatsApp number (format: `5926771234567`)
   - **business_name**: Your shop name
   - **admin_password**: Change from default `admin123` to a strong password!

---

## Step 3: Deploy to Production

### Option A: Deploy to Vercel (Recommended - Easiest)

1. Install Vercel CLI:
   ```bash
   npm install -g vercel
   ```

2. Login to Vercel:
   ```bash
   vercel login
   ```

3. Deploy your site:
   ```bash
   cd rest-33-main
   vercel
   ```

4. Follow the prompts:
   - Link to existing project? **No**
   - Project name? **your-shop-name**
   - Directory? **.**
   - Override settings? **No**

5. Set environment variables in Vercel:
   - Go to [Vercel Dashboard](https://vercel.com/dashboard)
   - Select your project
   - Go to **Settings** → **Environment Variables**
   - Add all variables from your `.env.local` file

6. Redeploy:
   ```bash
   vercel --prod
   ```

### Option B: Deploy to Netlify

1. Install Netlify CLI:
   ```bash
   npm install -g netlify-cli
   ```

2. Build your site:
   ```bash
   npm run build
   ```

3. Deploy:
   ```bash
   netlify deploy --prod
   ```

4. Add environment variables in Netlify Dashboard:
   - Site Settings → Build & Deploy → Environment

---

## Step 4: Initial Configuration

### 4.1 Change Admin Password (CRITICAL!)

1. Go to your website: `https://your-site.vercel.app/admin`
2. Login with default password: `admin123`
3. Go to **Settings** tab
4. Change password immediately to something secure!
5. Save and re-login

### 4.2 Add Your Business Information

1. In Admin → **Settings**:
   - Upload your business logo
   - Set business name
   - Verify WhatsApp number
   - Enable/disable stock display

### 4.3 Add Categories

1. Go to Admin → **Categories**
2. Click **"Add Category"**
3. Add your product categories (e.g., Electronics, Clothing, Food)
4. Upload category images

### 4.4 Add Products

1. Go to Admin → **Products**
2. Click **"Add Product"**
3. For each product, enter:
   - Name
   - Description
   - Price (in Guyanese dollars)
   - Stock quantity
   - Category
   - Upload product image

---

## Step 5: Configure WhatsApp Business

### 5.1 Set Up WhatsApp Business App

1. Download **WhatsApp Business** app (not regular WhatsApp)
2. Register with your business phone number
3. Set up your business profile:
   - Business name
   - Category
   - Description
   - Business hours
   - Location (Guyana)

### 5.2 Test Order Reception

1. Place a test order on your website
2. You should receive the order on WhatsApp
3. Make sure the format is clear and readable

---

## Step 6: Configure Payment Methods (Guyana-Specific)

Since the website doesn't have integrated payment processing, you'll handle payments through:

### Popular Guyana Payment Options:
1. **Cash on Delivery (COD)** - Most common
2. **Mobile Money Transfer**:
   - GTT Mobile Money
   - Digicel Mobile Money
3. **Bank Transfer**:
   - Republic Bank
   - Demerara Bank
   - ScotiaBank Guyana
4. **WhatsApp Pay** (when available in Guyana)

### Set Up Instructions:
1. Add payment instructions in your WhatsApp business message
2. Update the checkout confirmation to mention payment methods
3. Consider adding a FAQ section for payment info

---

## Step 7: Legal & Business Requirements (Guyana)

### 7.1 Business Registration
- [ ] Register with Guyana Revenue Authority (GRA)
- [ ] Get Tax Identification Number (TIN)
- [ ] Register business name (if applicable)

### 7.2 Privacy & Terms
- [ ] Add Privacy Policy (sample provided in PRIVACY_POLICY.md)
- [ ] Add Terms & Conditions
- [ ] Add Refund Policy
- [ ] Add Shipping/Delivery Policy

### 7.3 Required Business Information
- [ ] Business address in Guyana
- [ ] Contact email
- [ ] Business phone number
- [ ] Tax registration (if applicable)

---

## Step 8: SEO & Marketing Setup

### 8.1 Google My Business
1. Create Google My Business profile
2. Add your Guyana location
3. Link to your website

### 8.2 Social Media
1. Create Facebook Business Page
2. Create Instagram Business Account
3. Link all accounts to your WhatsApp Business

### 8.3 Local Listings
- List on Guyana business directories
- Join Guyana e-commerce groups on Facebook

---

## Step 9: Monitor Your Site

### 9.1 Set Up Analytics
1. Create Google Analytics account
2. Add tracking code to your site
3. Monitor traffic and sales

### 9.2 Regular Backups
1. Export Supabase data weekly:
   - Go to Supabase → Database → Export
2. Save product images backup
3. Keep environment variables documented

### 9.3 Performance Monitoring
- Use Vercel Analytics (built-in)
- Monitor page load times
- Check mobile performance

---

## 🔒 Security Checklist

Before going live:
- [ ] Changed default admin password
- [ ] Environment variables are set (not hardcoded)
- [ ] Supabase RLS policies enabled
- [ ] HTTPS enabled (automatic with Vercel/Netlify)
- [ ] No sensitive data in public repo
- [ ] Admin area password-protected
- [ ] Regular backups scheduled

---

## 💰 Pricing Strategy for Guyana

### Current Currency Display
- Prices are stored in cents
- Default display: USD format
- **Updated for Guyana**: GYD (Guyanese Dollar)

### Price Examples:
```
GYD $1,500 = 1500 cents stored as 1500
GYD $25.50 = 2550 cents stored as 2550
```

### Competitive Pricing Tips:
1. Research local market prices
2. Consider delivery costs
3. Account for WhatsApp communication time
4. Set minimum order amounts (optional)

---

## 📞 Customer Support

### Set Up Support Channels:
1. **WhatsApp Business** (primary)
   - Set quick replies for FAQs
   - Create product catalogs
   - Use labels to organize customers

2. **Facebook Messenger** (optional)
3. **Email** (for formal inquiries)

### Response Time Goals:
- WhatsApp: Within 1 hour during business hours
- Email: Within 24 hours
- Social Media: Within 2-3 hours

---

## 🚀 Launch Checklist

Before announcing your store:
- [ ] Test website on mobile phones (most Guyana users)
- [ ] Test on different browsers
- [ ] Complete 5-10 test orders
- [ ] Verify WhatsApp integration works
- [ ] Add all products with prices
- [ ] Add clear product images
- [ ] Set up business hours
- [ ] Prepare launch announcement
- [ ] Have payment methods ready
- [ ] Plan delivery/shipping logistics
- [ ] Set up customer support schedule

---

## 📱 Post-Launch Activities

### Week 1:
- Monitor all orders closely
- Respond quickly to customer questions
- Fix any bugs immediately
- Collect customer feedback

### Ongoing:
- Update products regularly
- Add new categories based on demand
- Run promotions (holidays, special events)
- Build customer relationships
- Request reviews/testimonials

---

## 🆘 Troubleshooting

### Website not loading?
- Check Vercel deployment status
- Verify environment variables are set
- Check browser console for errors

### Orders not coming through WhatsApp?
- Verify WhatsApp number format (592XXXXXXX)
- Check if WhatsApp Business is active
- Test with different devices

### Can't login to admin?
- Default password is `admin123`
- Clear browser cache
- Check Supabase site_settings table

### Products not showing?
- Verify products are marked as "active"
- Check if products have valid category
- Refresh the page

---

## 📞 Support Resources

### Guyana-Specific Resources:
- [Guyana Revenue Authority](https://www.gra.gov.gy/)
- [Guyana Business Registry](https://www.businessregistry.gy/)
- Small Business Bureau of Guyana

### Technical Support:
- Supabase Docs: https://supabase.com/docs
- Next.js Docs: https://nextjs.org/docs
- Vercel Support: https://vercel.com/support

---

## 🎉 Congratulations!

Your e-commerce store is now ready for customers in Guyana! Start small, test thoroughly, and grow your business gradually.

**Next Steps:**
1. Complete the TESTING_CHECKLIST.md
2. Soft launch to friends and family
3. Gather feedback
4. Official public launch
5. Market your business!

Good luck with your business! 🇬🇾

