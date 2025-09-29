import { createContext } from 'react';
import { User, ConfirmationResult } from 'firebase/auth';
import { UserProfile } from '../types/UserProfile';

// Auth context interface
export interface AuthContextType {
  user: User | null;
  userProfile: UserProfile | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<boolean>;
  signUp: (email: string, password: string, name: string, phone?: string) => Promise<boolean>;
  signInWithGoogle: () => Promise<boolean>;
  signInWithPhone: (phoneNumber: string) => Promise<ConfirmationResult>;
  verifyPhoneCode: (confirmationResult: ConfirmationResult, code: string) => Promise<boolean>;
  signOut: () => Promise<void>;
  sendPasswordResetEmail: (email: string) => Promise<boolean>;
  sendEmailVerification: () => Promise<boolean>;
  checkEmailVerified: () => Promise<boolean>;
  isEmailVerified: boolean;
  resendVerificationEmail: () => Promise<boolean>;
  isAdmin: boolean;
}

// Create the context
export const AuthContext = createContext<AuthContextType | undefined>(undefined);