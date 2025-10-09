# 💰 Pricing Guide for Guyana

## 🇬🇾 Guyana Currency System

In Guyana, the currency is **Guyanese Dollars (GYD)** and there are **NO CENTS** used in everyday transactions.

### Common Guyana Bills:
- **$20** (smallest)
- **$100**
- **$500**
- **$1,000**
- **$2,000**
- **$5,000** (largest common bill)

There are **NO coins or cents** in common use in Guyana!

---

## ✅ How Prices Work in Your Store

### **SIMPLE: Prices are Whole Dollars**

Unlike some e-commerce systems that use cents, your store uses **whole dollar amounts** because that's how Guyana works!

### Example Prices:

| What You Charge | Enter in Admin | Stored in Database | Displays to Customer |
|----------------|----------------|-------------------|---------------------|
| Twenty dollars | **20** | 20 | **$20** |
| One hundred dollars | **100** | 100 | **$100** |
| Five hundred dollars | **500** | 500 | **$500** |
| Fifteen hundred dollars | **1500** | 1500 | **$1,500** |
| Two thousand dollars | **2000** | 2000 | **$2,000** |
| Five thousand dollars | **5000** | 5000 | **$5,000** |

### ⚠️ **IMPORTANT**
**DO NOT multiply by 100!**

Just enter the actual dollar amount:
- ✅ For GYD $500 → Enter **500**
- ✅ For GYD $1,500 → Enter **1500**
- ❌ For GYD $500 → DO NOT enter 50000

---

## 📝 Adding Products in Admin

When you add a product:

1. Go to Admin → Products → Add Product
2. Enter product name
3. Enter description
4. **Enter price in whole dollars:**
   - Example: For GYD $800, enter: **800**
   - Example: For GYD $2,500, enter: **2500**
5. Enter stock quantity
6. Upload image
7. Save

---

## 💡 Common Pricing Examples for Guyana

### Food Items
```
Rice 5kg → $1,500
Sugar 2kg → $800
Flour 1kg → $600
Cooking Oil → $1,200
Biscuits → $300
Soft Drink → $200
```

### General Items
```
Soap → $100
Toothpaste → $500
Shampoo → $800
Toilet Paper (4 pack) → $1,000
Laundry Detergent → $1,500
```

### Electronics/Accessories
```
Phone Case → $800
Phone Charger → $1,500
Earphones → $2,000
Power Bank → $3,500
USB Cable → $500
Memory Card → $2,500
```

### Clothing
```
T-Shirt → $2,000
Jeans → $5,000
Sneakers → $8,000
Cap → $1,000
Belt → $1,500
```

---

## 🎯 Recommended Pricing Strategy

### 1. Round to Common Denominations

Since Guyana uses specific bills, round your prices to make change easier:

**For items under $1,000:**
- Round to nearest $20, $50, or $100
- Examples: $500, $600, $800, $1,000

**For items $1,000 - $5,000:**
- Round to nearest $100 or $500
- Examples: $1,500, $2,000, $2,500, $3,000

**For items over $5,000:**
- Round to nearest $1,000
- Examples: $6,000, $8,000, $10,000

### 2. Minimum Price Recommendation

Since the smallest common bill is **$20**, consider setting minimum price at $20 or higher.

### 3. Competitive Pricing

Research local Guyana prices:
- Check local shops
- Check other online Guyana stores
- Check prices in Georgetown markets
- Factor in your delivery costs

---

## 🛒 How Customers See Prices

### On Product Cards:
```
Sample Rice 5kg
Premium quality rice
$1,500
```

### In Shopping Cart:
```
Sample Rice 5kg × 2 — $3,000
Sample Soap × 1 — $100
━━━━━━━━━━━━━━━
Total: $3,100
```

### In WhatsApp Order:
```
🛒 Order for Your Shop Name
From: Customer Name
━━━━━━━━━━━━━━━
• Sample Rice 5kg × 2 — $3,000
• Sample Soap × 1 — $100
━━━━━━━━━━━━━━━
💰 Total: $3,100
```

**Clean, simple, whole dollars - just like Guyana!**

---

## ⚙️ Technical Details (For Developers)

### Database Storage

The field is called `price_cents` for historical reasons (compatibility), but it **stores whole dollars**, not cents!

```sql
-- This field stores GYD $1,500 as the number 1500
price_cents INTEGER NOT NULL DEFAULT 0
```

### Code Usage

```typescript
// Product with GYD $1,500
product.price_cents = 1500  // Whole dollars!

// Display to customer
import { formatPrice } from '@/lib/currency';
formatPrice(1500)  // Returns: "$1,500"
```

### Cart Calculation

```typescript
// Item 1: GYD $1,500 × 2 = $3,000
// Item 2: GYD $800 × 1 = $800
// Total: $3,800

const total = items.reduce((sum, item) => {
  return sum + (item.price_cents * item.qty);
}, 0);

// total = 3800 (represents GYD $3,800)
formatPrice(total)  // Displays: "$3,800"
```

---

## ❓ Common Questions

### Q: Why is the field called "price_cents" if it stores dollars?
**A:** For compatibility with the original codebase. The name stayed the same, but it now stores **whole dollars** for Guyana.

### Q: What if I want to charge $50?
**A:** Enter **50** in the price field. It will display as $50 to customers.

### Q: Can I charge $2,550 (not a round number)?
**A:** Yes! Enter **2550**. However, for easier transactions, round numbers are recommended.

### Q: What's the minimum price I should set?
**A:** Since the smallest Guyana bill is $20, we recommend minimum $20. The system validates this.

### Q: What's the maximum price?
**A:** The system allows up to GYD $10,000,000, which should be more than enough for any product!

---

## 🔧 Editing Existing Prices

### From Admin Panel:

1. Go to Admin → Products
2. Click "Edit" on a product
3. Update the price field with the new dollar amount
4. Save

### From Database (Advanced):

```sql
-- Update product price to GYD $1,800
UPDATE products 
SET price_cents = 1800 
WHERE id = 'product-id-here';
```

Remember: Enter **1800** for GYD $1,800 (NOT 180000!)

---

## 📊 Bulk Pricing Examples

If you're adding many products at once:

```
Rice 5kg: 1500
Sugar 2kg: 800
Flour 2kg: 1200
Oil 1L: 1000
Milk Powder: 2500
Butter: 1500
Cheese: 2000
Eggs (12): 800
Chicken (whole): 1800
Beef 1kg: 2000
```

Just copy your price list - simple!

---

## 💡 Pro Tips

### 1. **Pricing Psychology**
- GYD $999 vs GYD $1,000 - Psychology still works!
- GYD $1,999 feels better than GYD $2,000

### 2. **Competitive Analysis**
- Check local Georgetown prices
- Add value (delivery, quality, service)
- Don't always be the cheapest

### 3. **Bundle Pricing**
- Sell combo deals
- "3 for $1,000" type offers
- Encourage larger orders

### 4. **Delivery Considerations**
- Factor delivery costs into prices
- Or charge separate delivery fee
- Or offer free delivery over certain amount

### 5. **WhatsApp Negotiation**
- Some customers may negotiate via WhatsApp
- Be flexible but maintain margins
- Build long-term relationships

---

## 🚀 Quick Reference

### Common Conversions (for reference only):

| USD (approx) | GYD (you charge) |
|--------------|------------------|
| $1 USD | ~$200 GYD |
| $5 USD | ~$1,000 GYD |
| $10 USD | ~$2,000 GYD |
| $25 USD | ~$5,000 GYD |
| $50 USD | ~$10,000 GYD |

*Note: Exchange rates vary. These are approximations for reference.*

---

## ✅ Checklist for Setting Prices

Before adding products:
- [ ] Research local Guyana market prices
- [ ] Calculate your costs (product + delivery + fees)
- [ ] Add profit margin (20-50% typical)
- [ ] Round to convenient denomination ($20, $100, $500, etc.)
- [ ] Enter whole dollar amount in admin (NOT cents)
- [ ] Verify price displays correctly on storefront
- [ ] Place test order to confirm WhatsApp shows right price

---

## 🎯 Summary

**Remember:**
1. ✅ Guyana uses whole dollars (no cents)
2. ✅ Enter actual dollar amount (e.g., 1500 for GYD $1,500)
3. ✅ Common bills: $20, $100, $500, $1,000, $2,000, $5,000
4. ✅ Round to convenient numbers
5. ✅ Minimum recommended: $20
6. ✅ Test your prices before launch!

**Simple pricing for Guyana market!** 🇬🇾💰

---

**Need help?** Check the other guides or test with sample products first!

