// Input validation utilities for security

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email) && email.length <= 254;
};

export const validatePhoneNumber = (phone: string): boolean => {
  // Remove all non-digit characters for validation
  const cleanPhone = phone.replace(/\D/g, '');
  // Accept 10-15 digit phone numbers (international format)
  return cleanPhone.length >= 10 && cleanPhone.length <= 15;
};

export const validateUrl = (url: string): boolean => {
  try {
    const urlObj = new URL(url.startsWith('http') ? url : `https://${url}`);
    // Only allow http and https protocols
    return ['http:', 'https:'].includes(urlObj.protocol);
  } catch {
    return false;
  }
};

export const validateZapierWebhook = (webhook: string): boolean => {
  try {
    const urlObj = new URL(webhook);
    // Ensure it's a Zapier webhook URL
    return urlObj.hostname.includes('zapier.com') && urlObj.protocol === 'https:';
  } catch {
    return false;
  }
};

export const sanitizeInput = (input: string): string => {
  // Remove potential XSS patterns and normalize whitespace
  return input
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<[^>]*>/g, '')
    .trim()
    .substring(0, 1000); // Limit length
};

export const validateFileUpload = (file: File): { valid: boolean; error?: string } => {
  const maxSize = 10 * 1024 * 1024; // 10MB
  const allowedTypes = [
    'image/jpeg', 'image/png', 'image/gif', 'image/webp',
    'application/pdf', 'text/plain', 'application/zip'
  ];

  if (file.size > maxSize) {
    return { valid: false, error: 'File size must be less than 10MB' };
  }

  if (!allowedTypes.includes(file.type)) {
    return { valid: false, error: 'File type not allowed' };
  }

  return { valid: true };
};