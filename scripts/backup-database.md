# Database Backup Guide

This guide explains how to backup and restore your Supabase database for your e-commerce store.

## Why Backup?

Regular backups protect your business from:
- Accidental data deletion
- Database corruption
- Catastrophic failures
- User errors
- Security incidents

---

## Automatic Backups (Supabase Built-in)

Supabase provides automatic daily backups for paid plans:
- **Free Plan**: 7 days of backups
- **Pro Plan**: 30 days of backups
- **Enterprise**: Custom retention

### Accessing Automatic Backups

1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Select your project
3. Go to **Database** → **Backups**
4. View available backup points
5. Click **Restore** to restore from a backup point

---

## Manual Backup (Free Method)

### Option 1: Export via Supabase Dashboard

1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Select your project
3. Go to **Database** → **Backups**
4. Click **"Download backup"** (if available)
5. Save the `.sql` file to a secure location

### Option 2: Export Specific Tables

For more control, export individual tables:

#### Export Categories
```sql
-- Run in Supabase SQL Editor
COPY (SELECT * FROM public.categories) TO '/tmp/categories_backup.csv' WITH CSV HEADER;
```

Then download the CSV file.

#### Export Products
```sql
COPY (SELECT * FROM public.products) TO '/tmp/products_backup.csv' WITH CSV HEADER;
```

#### Export Settings
```sql
COPY (SELECT * FROM public.site_settings) TO '/tmp/settings_backup.csv' WITH CSV HEADER;
```

### Option 3: JSON Export (Easiest)

Run this in Supabase SQL Editor and copy the results:

```sql
-- Backup Categories
SELECT json_agg(c) FROM (SELECT * FROM public.categories) c;

-- Backup Products  
SELECT json_agg(p) FROM (SELECT * FROM public.products) p;

-- Backup Settings
SELECT json_agg(s) FROM (SELECT * FROM public.site_settings) s;
```

Save each result to separate `.json` files on your computer.

---

## Backup Schedule

### Recommended Schedule for Guyana Business:

| Frequency | When | What to Backup |
|-----------|------|---------------|
| **Daily** | End of business day | Full database export |
| **Weekly** | Sunday night | Database + images backup |
| **Monthly** | 1st of month | Complete archive (database + images + code) |
| **Before Major Changes** | Always | Full backup before editing products/settings |

### Simple Daily Backup Routine

1. **End of Day** (10 PM):
   - Export products table
   - Export orders data (if you add this feature)
   - Save to Google Drive or local folder

2. **Weekly** (Sunday):
   - Download all product images
   - Export full database
   - Save to external drive or cloud storage

3. **Monthly**:
   - Create complete archive
   - Test restoration process
   - Delete old backups (keep last 3 months)

---

## Backup Product Images

### Method 1: Manual Download

1. Go to Supabase Dashboard
2. Navigate to **Storage**
3. Select **product-images** bucket
4. Download all images to your computer
5. Save to `backups/images/YYYY-MM-DD/` folder

### Method 2: List Image URLs

Run this query to get all image URLs:

```sql
SELECT id, name, image_url 
FROM public.products 
WHERE image_url IS NOT NULL;
```

Save the results and you can re-upload images later if needed.

---

## Restore from Backup

### Restore Full Database

1. Go to Supabase Dashboard
2. Select your project
3. Go to **Database** → **Backups**
4. Select backup point
5. Click **Restore**
6. Confirm restoration

**⚠️ Warning**: This will overwrite current data!

### Restore Individual Tables

If you have CSV or JSON backups:

#### From CSV:
```sql
-- First, clear the table (BE CAREFUL!)
TRUNCATE TABLE public.categories CASCADE;

-- Then import from CSV
COPY public.categories FROM '/path/to/categories_backup.csv' WITH CSV HEADER;
```

#### From JSON:
Use the Supabase Table Editor to manually re-insert data from your JSON backup.

---

## Emergency Recovery Plan

If you lose data:

### Step 1: Don't Panic
- Stop all operations immediately
- Don't make any database changes
- Note what data was lost

### Step 2: Check Automatic Backups
1. Go to Supabase → Database → Backups
2. Look for most recent backup before data loss
3. Restore if available

### Step 3: Use Manual Backup
1. Locate your most recent manual backup
2. Follow restore procedures above
3. Verify data integrity

### Step 4: Reconstruct Missing Data
If backups are outdated:
1. Check WhatsApp messages for recent orders
2. Re-enter products from product list
3. Update inventory counts

---

## Backup Storage Locations

### Recommended Storage Options:

1. **Google Drive** (Free 15GB)
   - Create folder: `My Shop Backups/YYYY/MM/`
   - Upload daily/weekly backups
   - Enable automatic sync

2. **External Hard Drive**
   - Keep weekly backups
   - Store securely
   - Test regularly

3. **Cloud Storage** (Dropbox, OneDrive, etc.)
   - Automatic sync
   - Version history
   - Accessible from anywhere

4. **Local Computer**
   - Quick access
   - Create folder structure:
     ```
     My Shop Backups/
     ├── 2024/
     │   ├── January/
     │   │   ├── daily/
     │   │   └── weekly/
     │   ├── February/
     │   └── ...
     └── README.txt
     ```

---

## Backup Checklist

### Daily Backup (5 minutes)
- [ ] Export products table
- [ ] Export site_settings table  
- [ ] Note number of orders received today
- [ ] Save to Google Drive

### Weekly Backup (15 minutes)
- [ ] Export all database tables
- [ ] Download product images
- [ ] Export Supabase backup point (if available)
- [ ] Verify backups can be opened
- [ ] Save to external drive

### Monthly Backup (30 minutes)
- [ ] Complete database export
- [ ] All product images
- [ ] Copy of entire codebase
- [ ] Screenshots of admin settings
- [ ] Test restore on a sample
- [ ] Archive old backups
- [ ] Update backup documentation

---

## Quick Backup Commands

### Backup Everything (Manual Process)

1. **Database Tables**:
```sql
-- In Supabase SQL Editor, run each and save results:
SELECT * FROM public.categories;
SELECT * FROM public.products;
SELECT * FROM public.site_settings;
```

2. **Business Settings**:
   - Admin password (keep secure!)
   - WhatsApp number
   - Business name
   - Logo URL

3. **Product Images**:
   - List all in Storage → product-images
   - Download to local folder

---

## Testing Your Backups

### Monthly Backup Test

1. **Create test Supabase project**
2. **Restore backup** to test project
3. **Verify data**:
   - All products present?
   - Categories correct?
   - Images accessible?
   - Settings accurate?
4. **Delete test project** (to avoid charges)

---

## Security for Backups

### Protect Your Backup Files:

1. **Encrypt sensitive backups**
   - Use password-protected ZIP files
   - Use encryption software

2. **Secure storage**
   - Don't share backup files publicly
   - Use private cloud folders
   - Keep admin passwords separate

3. **Access control**
   - Only you should access backups
   - Use strong passwords for cloud storage
   - Enable 2FA on Google Drive/Dropbox

---

## What to Backup

### Critical (Must Backup):
- ✅ Products table (all products and prices)
- ✅ Categories table (product categories)
- ✅ Site settings (business name, WhatsApp, admin password)
- ✅ Product images (from Storage)

### Important (Should Backup):
- ✅ Environment variables (`.env.local` file)
- ✅ Supabase credentials
- ✅ Admin password (securely)

### Optional:
- Code repository (if you made custom changes)
- Logo and branding assets

---

## Disaster Recovery Time

With proper backups, you can recover in:

| Scenario | Recovery Time |
|----------|---------------|
| Single product deleted | 5 minutes |
| Category deleted | 10 minutes |
| All products deleted | 30 minutes |
| Complete database loss | 1-2 hours |
| Complete site loss | 2-4 hours |

---

## Backup Automation Ideas

### For Windows:

Create a reminder:
1. Open **Task Scheduler**
2. Create task: "Daily Backup"
3. Trigger: Daily at 10 PM
4. Action: Display reminder to backup

### For Phone:

Set recurring phone alarm:
- Daily: 10 PM - "Backup database"
- Sunday: 8 PM - "Weekly full backup"
- 1st of month: "Monthly archive"

---

## Troubleshooting Backups

### "Download Failed"
- Try exporting as CSV instead of full backup
- Use smaller table exports
- Check internet connection

### "Restore Not Working"
- Verify backup file integrity
- Check SQL syntax
- Try table-by-table restore

### "Backup File Too Large"
- Compress with ZIP/RAR
- Split into multiple files
- Use Supabase built-in backups

---

## Support Resources

- **Supabase Backup Docs**: https://supabase.com/docs/guides/database/backups
- **Community Support**: https://github.com/supabase/supabase/discussions

---

## Final Tips

1. **"3-2-1 Backup Rule"**:
   - 3 copies of data
   - 2 different storage types
   - 1 offsite/cloud copy

2. **Test regularly** - A backup you can't restore is useless

3. **Document everything** - Write down your backup process

4. **Set reminders** - Use phone/computer to remind you

5. **Start today** - Do your first backup NOW!

---

**Remember**: The best time to start backing up was yesterday. The second-best time is NOW! 🔒

