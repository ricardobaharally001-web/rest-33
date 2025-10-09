/**
 * Currency Formatting Utilities for Guyana (GYD)
 */

export type Currency = 'GYD' | 'USD';

/**
 * Format dollars to currency string
 * @param dollars - Amount in dollars (e.g., 1500 = GYD $1,500)
 * @param currency - Currency code (defaults to GYD for Guyana)
 * @returns Formatted currency string
 */
export function formatCurrency(dollars: number, currency: Currency = 'GYD'): string {
  if (currency === 'GYD') {
    // Guyana Dollar formatting (whole dollars, no cents)
    return `GYD $${dollars.toLocaleString('en-US', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    })}`;
  }
  
  // USD formatting (fallback)
  return `$${dollars.toLocaleString('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  })}`;
}

/**
 * Shorter format for tight spaces (no currency code)
 * @param dollars - Amount in dollars (e.g., 1500 = $1,500)
 * @returns Formatted amount with dollar sign
 */
export function formatPrice(dollars: number): string {
  return `$${dollars.toLocaleString('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  })}`;
}

/**
 * Format WhatsApp number for Guyana
 * @param number - Phone number (can be with or without country code)
 * @returns Formatted number for WhatsApp (592XXXXXXX)
 */
export function formatWhatsAppNumber(number: string): string {
  // Remove all non-digits
  const digits = number.replace(/\D/g, '');
  
  // If starts with 592 (Guyana code), return as is
  if (digits.startsWith('592')) {
    return digits;
  }
  
  // If starts with +592, remove the +
  if (number.startsWith('+592')) {
    return digits;
  }
  
  // If 7 digits (local Guyana number), add 592 prefix
  if (digits.length === 7) {
    return `592${digits}`;
  }
  
  // If 10 digits starting with 0, replace 0 with 592
  if (digits.length === 10 && digits.startsWith('0')) {
    return `592${digits.substring(1)}`;
  }
  
  // Return cleaned number
  return digits;
}

/**
 * Display WhatsApp number in friendly format
 * @param number - WhatsApp number
 * @returns Formatted for display (+592-XXX-XXXX)
 */
export function displayWhatsAppNumber(number: string): string {
  const clean = formatWhatsAppNumber(number);
  
  if (clean.startsWith('592') && clean.length === 10) {
    // Format: +592-XXX-XXXX
    return `+${clean.substring(0, 3)}-${clean.substring(3, 6)}-${clean.substring(6)}`;
  }
  
  return `+${clean}`;
}

/**
 * Validate if a price is valid for Guyana market
 * @param dollars - Amount in dollars
 * @returns boolean
 */
export function isValidPrice(dollars: number): boolean {
  // Prices should be positive and reasonable (under GYD $10,000,000)
  // Common Guyana bills: $20, $100, $500, $1,000, $2,000, $5,000
  return dollars > 0 && dollars < 10000000;
}

/**
 * Round to nearest common Guyana denomination
 * @param dollars - Amount in dollars
 * @returns Rounded amount to common denominations
 */
export function roundToCommonDenomination(dollars: number): number {
  // Common bills: $20, $100, $500, $1,000, $2,000, $5,000
  if (dollars < 20) return 20;
  if (dollars < 100) return Math.round(dollars / 20) * 20; // Round to nearest $20
  if (dollars < 500) return Math.round(dollars / 100) * 100; // Round to nearest $100
  if (dollars < 1000) return Math.round(dollars / 500) * 500; // Round to nearest $500
  return Math.round(dollars / 1000) * 1000; // Round to nearest $1,000
}

