// Authentication utility functions

// Phone number validation
export const validatePhoneNumber = (phone: string): boolean => {
  const phoneRegex = /^\+[1-9]\d{1,14}$/;
  return phoneRegex.test(phone);
};

// Indian phone number validation (more specific)
export const validateIndianPhoneNumber = (phone: string): boolean => {
  // Remove all non-digit characters
  const digits = phone.replace(/\D/g, '');
  
  // Check if it's a valid Indian mobile number
  // Indian mobile numbers start with 6, 7, 8, or 9 and have 10 digits
  const indianMobileRegex = /^[6-9]\d{9}$/;
  
  // If it has country code +91, check the remaining digits
  if (phone.startsWith('+91')) {
    return indianMobileRegex.test(digits.slice(2));
  }
  
  // If it's just 10 digits, check if it's a valid Indian mobile number
  if (digits.length === 10) {
    return indianMobileRegex.test(digits);
  }
  
  return false;
};

// Format phone number
export const formatPhoneNumber = (phone: string): string => {
  // Remove all non-digit characters
  const digits = phone.replace(/\D/g, '');
  
  // If it starts with 91 and has 12 digits, add +
  if (digits.length === 12 && digits.startsWith('91')) {
    return `+${digits}`;
  }
  // If it has 10 digits, assume Indian number and add +91
  if (digits.length === 10) {
    return `+91${digits}`;
  }
  // If it already has +, return as is
  if (phone.startsWith('+')) {
    return phone;
  }
  // Otherwise, add +91 for India
  return `+91${digits}`;
};

// Email validation
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Password strength validation
export const validatePassword = (password: string): { isValid: boolean; message: string } => {
  if (password.length < 6) {
    return { isValid: false, message: 'Password must be at least 6 characters long' };
  }
  if (password.length > 128) {
    return { isValid: false, message: 'Password must be less than 128 characters' };
  }
  return { isValid: true, message: '' };
};

// Get user-friendly error messages
export const getAuthErrorMessage = (errorCode: string): string => {
  switch (errorCode) {
    case 'auth/user-not-found':
      return 'No user found with this email address.';
    case 'auth/wrong-password':
      return 'Incorrect password.';
    case 'auth/email-already-in-use':
      return 'An account with this email already exists.';
    case 'auth/weak-password':
      return 'Password should be at least 6 characters.';
    case 'auth/invalid-email':
      return 'Invalid email address.';
    case 'auth/user-disabled':
      return 'This account has been disabled.';
    case 'auth/too-many-requests':
      return 'Too many failed attempts. Please try again later.';
    case 'auth/network-request-failed':
      return 'Network error. Please check your connection.';
    case 'auth/popup-closed-by-user':
      return 'Sign-in popup was closed. Please try again.';
    case 'auth/cancelled-popup-request':
      return 'Sign-in was cancelled. Please try again.';
    case 'auth/invalid-phone-number':
      return 'Invalid phone number format.';
    case 'auth/missing-phone-number':
      return 'Phone number is required.';
    case 'auth/invalid-verification-code':
      return 'Invalid verification code. Please try again.';
    case 'auth/code-expired':
      return 'Verification code expired. Please request a new one.';
    case 'auth/invalid-verification-id':
      return 'Invalid verification session. Please start over.';
    case 'auth/missing-email':
      return 'Please provide an email address.';
    case 'auth/invalid-action-code':
      return 'The password reset link has expired or is invalid.';
    case 'auth/email-not-verified':
      return 'Please verify your email address to continue.';
    default:
      return 'An error occurred. Please try again.';
  }
};

// Email verification check
import { User, AuthError } from 'firebase/auth';

// Auth error logging utility
export const logAuthError = (error: AuthError | unknown, context: string) => {
  const authError = error as AuthError;
  console.error(`Auth Error (${context}):`, {
    code: authError.code,
    message: authError.message,
    fullError: error
  });
  return authError.code || 'unknown-error';
};

// Email verification check
export const checkEmailVerificationStatus = async (user: User | null): Promise<boolean> => {
  if (!user) return false;
  await user.reload(); // Refresh the user to get latest email verification status
  return user.emailVerified;
};

// Email templates for verification and reset
// Email templates and utilities
interface EmailTemplate {
  subject: string;
  body: string;
}

export const getPasswordResetEmailTemplate = (email: string): EmailTemplate => {
  return {
    subject: 'Reset Your Password - Satisfied Computers',
    body: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Reset Your Password</h2>
        <p>Hello,</p>
        <p>We received a request to reset the password for your Satisfied Computers account (<strong>${email}</strong>).</p>
        <p>If you have any questions, contact us at <strong>+91 9634409988</strong> or <strong>satisfiedcomputers@gmail.com</strong></p>
        <p style="margin: 20px 0;">Click the link below to choose a new password:</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="{%RESET_LINK%}" style="background-color: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px;">
            Reset Password
          </a>
        </div>
        <p style="color: #666;">If you did not request this change, you can ignore this email.</p>
        <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;" />
        <p style="color: #666; font-size: 14px;">
          Best regards,<br>
          The Satisfied Computers Team
        </p>
      </div>
    `
  };
};

export const getEmailVerificationTemplate = (): EmailTemplate => {
  return {
    subject: 'Verify Your Email - Satisfied Computers',
    body: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Verify Your Email Address</h2>
        <p>Hello,</p>
        <p>Thank you for creating an account with Satisfied Computers. Please verify your email address to access all features.</p>
        <p>If you have any questions, contact us at <strong>+91 9634409988</strong> or <strong>satisfiedcomputers@gmail.com</strong></p>
        <p style="margin: 20px 0;">Click the button below to verify your email address:</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="{%VERIFICATION_LINK%}" style="background-color: #28a745; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px;">
            Verify Email Address
          </a>
        </div>
        <p style="color: #666;">If you did not create this account, you can ignore this email.</p>
        <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;" />
        <p style="color: #666; font-size: 14px;">
          Best regards,<br>
          The Satisfied Computers Team
        </p>
      </div>
    `
  };
};

// Check if Firebase is properly configured
export const isFirebaseConfigured = (): boolean => {
  const requiredEnvVars = [
    'VITE_FIREBASE_API_KEY',
    'VITE_FIREBASE_AUTH_DOMAIN', 
    'VITE_FIREBASE_PROJECT_ID',
    'VITE_FIREBASE_STORAGE_BUCKET',
    'VITE_FIREBASE_MESSAGING_SENDER_ID',
    'VITE_FIREBASE_APP_ID'
  ];

  return requiredEnvVars.every(varName => 
    import.meta.env[varName] && 
    import.meta.env[varName] !== 'your_api_key_here' &&
    import.meta.env[varName] !== 'demo-api-key'
  );
};

// Format phone number for display
export const formatPhoneForDisplay = (phone: string): string => {
  const digits = phone.replace(/\D/g, '');
  
  if (digits.length === 12 && digits.startsWith('91')) {
    // Indian number: +91 XXXXX XXXXX
    return `+91 ${digits.slice(2, 7)} ${digits.slice(7)}`;
  } else if (digits.length === 10) {
    // Indian number without country code: XXXXX XXXXX
    return `${digits.slice(0, 5)} ${digits.slice(5)}`;
  }
  
  return phone; // Return as-is if not a standard Indian number
};
