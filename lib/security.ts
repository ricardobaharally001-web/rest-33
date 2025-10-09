/**
 * Security utilities for production deployment
 */

/**
 * Validate password strength
 * @param password - Password to validate
 * @returns Object with validation result and message
 */
export function validatePassword(password: string): { valid: boolean; message: string } {
  if (password.length < 8) {
    return {
      valid: false,
      message: "Password must be at least 8 characters long"
    };
  }

  if (password.length > 100) {
    return {
      valid: false,
      message: "Password is too long (max 100 characters)"
    };
  }

  // Check for at least one number OR special character
  const hasNumberOrSpecial = /[0-9!@#$%^&*(),.?":{}|<>]/.test(password);
  if (!hasNumberOrSpecial) {
    return {
      valid: false,
      message: "Password must contain at least one number or special character"
    };
  }

  // Warn about common passwords (but allow them for simplicity)
  const commonPasswords = ['password', '12345678', 'admin123', 'qwerty'];
  if (commonPasswords.some(common => password.toLowerCase().includes(common))) {
    return {
      valid: true,
      message: "⚠️ Warning: This password is common. Consider using a stronger password."
    };
  }

  return {
    valid: true,
    message: "✓ Password is strong"
  };
}

/**
 * Validate WhatsApp number for Guyana
 * @param number - WhatsApp number to validate
 * @returns Object with validation result and message
 */
export function validateWhatsAppNumber(number: string): { valid: boolean; message: string } {
  // Remove all non-digit characters
  const digits = number.replace(/\D/g, '');

  // Check if empty
  if (!digits) {
    return {
      valid: false,
      message: "WhatsApp number is required"
    };
  }

  // Guyana numbers should be 10 digits with 592 prefix
  // Or 7 digits without prefix (will be added automatically)
  if (digits.startsWith('592')) {
    if (digits.length !== 10) {
      return {
        valid: false,
        message: "Guyana number with country code should be 10 digits (592XXXXXXX)"
      };
    }
    return {
      valid: true,
      message: "✓ Valid Guyana WhatsApp number"
    };
  }

  // Check if it's a 7-digit local number
  if (digits.length === 7) {
    return {
      valid: true,
      message: "✓ Valid local number (592 will be added automatically)"
    };
  }

  // Check if it's 10 digits starting with 0 (old format)
  if (digits.length === 10 && digits.startsWith('0')) {
    return {
      valid: true,
      message: "✓ Valid number (592 prefix will replace the 0)"
    };
  }

  return {
    valid: false,
    message: "Invalid number format. Use: 592XXXXXXX (10 digits) or XXXXXXX (7 digits)"
  };
}

/**
 * Sanitize user input to prevent XSS
 * @param input - User input string
 * @returns Sanitized string
 */
export function sanitizeInput(input: string): string {
  if (!input) return '';
  
  return input
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;')
    .trim();
}

/**
 * Validate product price (in dollars)
 * @param priceDollars - Price in Guyanese Dollars
 * @returns Object with validation result and message
 */
export function validatePrice(priceDollars: number): { valid: boolean; message: string } {
  if (isNaN(priceDollars)) {
    return {
      valid: false,
      message: "Price must be a number"
    };
  }

  if (priceDollars < 0) {
    return {
      valid: false,
      message: "Price cannot be negative"
    };
  }

  if (priceDollars === 0) {
    return {
      valid: false,
      message: "Price cannot be zero (minimum GYD $20)"
    };
  }

  // Minimum price should be at least $20 (smallest common bill)
  if (priceDollars < 20 && priceDollars !== 0) {
    return {
      valid: false,
      message: "Price should be at least GYD $20 (smallest common bill)"
    };
  }

  // Maximum price: GYD $10,000,000
  if (priceDollars > 10000000) {
    return {
      valid: false,
      message: "Price is too high (maximum: GYD $10,000,000)"
    };
  }

  return {
    valid: true,
    message: "✓ Valid price"
  };
}

/**
 * Validate stock quantity
 * @param stock - Stock quantity
 * @returns Object with validation result and message
 */
export function validateStock(stock: number): { valid: boolean; message: string } {
  if (isNaN(stock)) {
    return {
      valid: false,
      message: "Stock must be a number"
    };
  }

  if (stock < 0) {
    return {
      valid: false,
      message: "Stock cannot be negative"
    };
  }

  if (!Number.isInteger(stock)) {
    return {
      valid: false,
      message: "Stock must be a whole number"
    };
  }

  // Maximum stock: 10,000 items
  if (stock > 10000) {
    return {
      valid: false,
      message: "Stock is too high (maximum: 10,000 items)"
    };
  }

  return {
    valid: true,
    message: "✓ Valid stock quantity"
  };
}

/**
 * Rate limiting helper (simple client-side)
 * Prevents too many rapid requests
 */
export class RateLimiter {
  private attempts: Map<string, number[]>;
  private maxAttempts: number;
  private windowMs: number;

  constructor(maxAttempts: number = 5, windowMs: number = 60000) {
    this.attempts = new Map();
    this.maxAttempts = maxAttempts;
    this.windowMs = windowMs;
  }

  /**
   * Check if action is allowed
   * @param key - Unique key for the action (e.g., 'login', 'add-product')
   * @returns true if allowed, false if rate limited
   */
  isAllowed(key: string): boolean {
    const now = Date.now();
    const timestamps = this.attempts.get(key) || [];

    // Remove old timestamps outside the window
    const recentAttempts = timestamps.filter(t => now - t < this.windowMs);

    if (recentAttempts.length >= this.maxAttempts) {
      return false;
    }

    // Add current attempt
    recentAttempts.push(now);
    this.attempts.set(key, recentAttempts);

    return true;
  }

  /**
   * Reset rate limit for a key
   * @param key - Key to reset
   */
  reset(key: string): void {
    this.attempts.delete(key);
  }

  /**
   * Get remaining attempts
   * @param key - Key to check
   * @returns Number of remaining attempts
   */
  getRemainingAttempts(key: string): number {
    const now = Date.now();
    const timestamps = this.attempts.get(key) || [];
    const recentAttempts = timestamps.filter(t => now - t < this.windowMs);
    return Math.max(0, this.maxAttempts - recentAttempts.length);
  }
}

/**
 * Check if running in production
 */
export function isProduction(): boolean {
  return process.env.NODE_ENV === 'production';
}

/**
 * Log security events (only in development)
 */
export function logSecurityEvent(event: string, details?: any): void {
  if (!isProduction()) {
    console.log(`[Security Event] ${event}`, details);
  }
}

