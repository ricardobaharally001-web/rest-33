# 🛍️ E-Commerce Platform for Guyana

A fast, modern, production-ready e-commerce platform optimized for selling products in Guyana. Built with Next.js, Supabase, and WhatsApp Business integration.

## 🇬🇾 Guyana-Specific Features

✅ **GYD Currency** - All prices in Guyanese Dollars  
✅ **WhatsApp Checkout** - Orders sent directly to your WhatsApp Business  
✅ **Mobile-First** - Optimized for Guyana's mobile-heavy market  
✅ **No Payment Gateway** - Simple COD, Mobile Money, Bank Transfer  
✅ **Zero Customer Data** - Privacy-focused, WhatsApp-only communication  

## 🚀 Features

### 🛒 **Storefront**
- Beautiful product catalog with categories
- Fast product search and filtering
- Shopping cart with persistence
- WhatsApp checkout integration (Guyana format)
- Dark/light mode toggle
- Mobile-responsive design
- Stock availability display

### 🛠️ **Admin Dashboard**
- Product management (Add, Edit, Delete)
- Category management
- Site settings configuration
- Image upload (device or URL)
- Stock management
- Password-protected access

### 🔒 **Security & Privacy**
- Supabase Row Level Security (RLS)
- Password-protected admin panel
- No customer data collection
- HTTPS encryption
- Input validation & sanitization
- Rate limiting protection

### 💼 **Business Features**
- WhatsApp Business integration
- GYD currency formatting
- Stock tracking
- Admin analytics
- Business branding (logo, name)

## 📚 Documentation

**New to this project? Start here:**

1. **[PRODUCTION_READY_SUMMARY.md](./PRODUCTION_READY_SUMMARY.md)** ⭐ **START HERE!**
   - Overview of all improvements
   - Quick start guide
   - Business tips for Guyana

2. **[DEPLOYMENT_CHECKLIST.md](./DEPLOYMENT_CHECKLIST.md)** 
   - Step-by-step deployment guide
   - Quick reference for going live

3. **[PRODUCTION_SETUP_GUIDE.md](./PRODUCTION_SETUP_GUIDE.md)**
   - Comprehensive setup instructions
   - Supabase configuration
   - Vercel deployment
   - WhatsApp setup

4. **[TESTING_CHECKLIST.md](./TESTING_CHECKLIST.md)**
   - 100+ test cases
   - Pre-launch testing guide
   - Quality assurance

5. **[scripts/backup-database.md](./scripts/backup-database.md)**
   - Database backup procedures
   - Recovery instructions
   - Backup schedule

6. **[PRIVACY_POLICY.md](./PRIVACY_POLICY.md)**
   - Privacy policy template
   - Customize for your business

7. **[PRICING_GUIDE_GUYANA.md](./PRICING_GUIDE_GUYANA.md)** ⭐ **IMPORTANT!**
   - How pricing works in Guyana (whole dollars, no cents!)
   - Product pricing examples
   - Common mistakes to avoid

## 🎯 Quick Start (5 Minutes)

### Development Setup

```bash
# 1. Clone the repository
git clone https://github.com/your-username/rest-33-main.git
cd rest-33-main

# 2. Install dependencies
npm install

# 3. Create .env.local file with your Supabase credentials
# (See PRODUCTION_SETUP_GUIDE.md for detailed instructions)

# 4. Run development server
npm run dev

# 5. Open http://localhost:3000
```

### Production Deployment

**For complete production setup, see [DEPLOYMENT_CHECKLIST.md](./DEPLOYMENT_CHECKLIST.md)**

Quick steps:
1. Set up Supabase database
2. Deploy to Vercel
3. Configure admin settings
4. Add your products
5. Test and launch!

## 🛠️ Tech Stack

- **Frontend**: Next.js 15, React 18, TypeScript
- **Database**: Supabase (PostgreSQL)
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **Icons**: Lucide React
- **Deployment**: Vercel (recommended) or Netlify
- **Messaging**: WhatsApp Business API

## 💰 Pricing Model

Prices are stored as **whole Guyanese Dollars** (no cents):

**Guyana Currency Bills:** $20, $100, $500, $1,000, $2,000, $5,000

| You Charge | Admin Input | Database | Customer Sees |
|------------|-------------|----------|---------------|
| GYD $500 | **500** | 500 | **$500** |
| GYD $1,500 | **1500** | 1500 | **$1,500** |
| GYD $5,000 | **5000** | 5000 | **$5,000** |

**Formula:** Want to charge $1,500? Enter **1500** (simple!)

## 📱 WhatsApp Integration

### Number Format for Guyana
- **Country Code:** 592
- **Format:** 592XXXXXXX (10 digits)
- **Example:** 5926771234

### How It Works
1. Customer adds products to cart
2. Customer enters their name
3. Customer clicks "Checkout via WhatsApp"
4. WhatsApp opens with pre-filled order message
5. Order sent to your WhatsApp Business
6. You confirm and arrange payment/delivery

## 🏪 Admin Panel

Access: `https://your-site.com/admin`

**Default Password:** `admin123` ⚠️ **CHANGE IMMEDIATELY!**

### Admin Features:
- **Products**: Add, edit, delete products
- **Categories**: Manage product categories
- **Settings**: Business name, logo, WhatsApp number, admin password

## 📊 Project Structure

```
rest-33-main/
├── app/                    # Next.js app directory
│   ├── admin/             # Admin dashboard
│   ├── cart/              # Shopping cart page
│   └── page.tsx           # Homepage/storefront
├── components/            # React components
│   ├── AdminLayout.tsx    # Admin panel layout
│   ├── Navbar.tsx         # Navigation
│   └── ProductCard.tsx    # Product display
├── lib/                   # Utilities and stores
│   ├── supabase.ts        # Supabase client
│   ├── cart-store.ts      # Cart state management
│   ├── currency.ts        # Currency utilities (GYD)
│   └── security.ts        # Security utilities
├── scripts/               # Helper scripts
│   └── backup-database.md # Backup guide
├── supabase-production.sql # Database setup
├── PRODUCTION_READY_SUMMARY.md
├── DEPLOYMENT_CHECKLIST.md
├── PRODUCTION_SETUP_GUIDE.md
├── TESTING_CHECKLIST.md
└── PRIVACY_POLICY.md
```

## 🔐 Environment Variables

Create `.env.local` in the project root:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
NEXT_PUBLIC_WHATSAPP_NUMBER=5926771234567
NEXT_PUBLIC_BUSINESS_NAME=Your Shop Name
NEXT_PUBLIC_CURRENCY=GYD
```

## 🧪 Testing

Run the complete testing checklist before launching:

```bash
# Run development server
npm run dev

# Test in browser
# Follow TESTING_CHECKLIST.md
```

**Key Tests:**
- [ ] Homepage loads
- [ ] Products display
- [ ] Add to cart works
- [ ] WhatsApp checkout works
- [ ] Admin login works
- [ ] Mobile responsive

## 📦 Database Setup

1. Create Supabase account at https://supabase.com
2. Create new project
3. Run `supabase-production.sql` in SQL Editor
4. Create storage buckets: `product-images`, `brand-assets` (make PUBLIC)
5. Copy project URL and API key

## 🚀 Deployment

### Recommended: Vercel

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel

# Set environment variables in Vercel dashboard
# Deploy to production
vercel --prod
```

### Alternative: Netlify

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Build and deploy
npm run build
netlify deploy --prod
```

## 📈 Business Features

### Payment Methods (Guyana)
- Cash on Delivery (COD)
- GTT Mobile Money
- Digicel Mobile Money
- Bank Transfer (Republic Bank, Demerara Bank, ScotiaBank)

### Delivery Options
- Local delivery (Georgetown area)
- Nationwide shipping
- Pickup available

### Marketing Channels
- WhatsApp Business
- Facebook
- Instagram
- Google My Business
- Local Guyana Facebook groups

## 🔒 Security Features

- ✅ Password-protected admin panel
- ✅ Input validation and sanitization
- ✅ Rate limiting on admin actions
- ✅ Supabase Row Level Security (RLS)
- ✅ HTTPS encryption (automatic with Vercel)
- ✅ No customer data storage
- ✅ Environment variable protection

## 📱 Mobile Optimization

- Responsive design (works on all devices)
- Touch-friendly buttons
- Mobile-first approach
- Fast loading on slow connections
- WhatsApp integration (native mobile)

## 🎨 Customization

### Branding
- Update business name in admin settings
- Upload your logo
- Customize colors in `tailwind.config.ts`
- Add your product categories

### Products
- Add your products via admin panel
- Upload product images
- Set prices in GYD
- Manage stock levels

## 📊 Analytics (Optional)

Add Google Analytics:
1. Create GA4 property
2. Add tracking code to `app/layout.tsx`
3. Monitor traffic and sales

## 🆘 Troubleshooting

### Common Issues

**Website not loading?**
- Check Vercel deployment status
- Verify environment variables
- Check browser console

**WhatsApp not working?**
- Verify number format: 592XXXXXXX
- Check WhatsApp Business is active
- Test on different device

**Can't login to admin?**
- Default password: `admin123`
- Clear browser cache
- Check Supabase site_settings

**Products not showing?**
- Mark products as "Active"
- Assign valid category
- Refresh browser

## 🤝 Support

- **Documentation**: See guides in project folder
- **Supabase Docs**: https://supabase.com/docs
- **Next.js Docs**: https://nextjs.org/docs
- **Vercel Support**: https://vercel.com/support

## 📜 License

This project is open source and available for commercial use.

## 🎯 Next Steps

1. **Read** [PRODUCTION_READY_SUMMARY.md](./PRODUCTION_READY_SUMMARY.md)
2. **Follow** [DEPLOYMENT_CHECKLIST.md](./DEPLOYMENT_CHECKLIST.md)
3. **Test** using [TESTING_CHECKLIST.md](./TESTING_CHECKLIST.md)
4. **Launch** your business! 🚀

## 🌟 Features Coming Soon

- Customer order history
- Email notifications
- SMS notifications (Guyana carriers)
- Loyalty program
- Discount codes
- Product reviews
- Analytics dashboard

## 💡 Tips for Success

1. **Start Small**: Begin with 10-20 products
2. **Test Thoroughly**: Use testing checklist
3. **Respond Quickly**: Answer WhatsApp messages fast
4. **Good Photos**: Use clear product images
5. **Accurate Prices**: Double-check all prices
6. **Backup Regularly**: Daily backups recommended
7. **Customer Service**: Provide excellent service
8. **Market Actively**: Use social media

## 🇬🇾 Made for Guyana

This platform is specifically designed for the Guyana market with:
- GYD currency
- Local phone formats
- WhatsApp-first approach
- Mobile optimization
- Local payment methods
- Guyana business practices

---

**Ready to launch your e-commerce business in Guyana?**

👉 **Start with [PRODUCTION_READY_SUMMARY.md](./PRODUCTION_READY_SUMMARY.md)**

**Good luck! 🚀🇬🇾**
