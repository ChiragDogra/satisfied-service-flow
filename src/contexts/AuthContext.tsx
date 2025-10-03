import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  GoogleAuthProvider,
  FacebookAuthProvider,
  GithubAuthProvider,
  signInWithPhoneNumber,
  RecaptchaVerifier,
  ConfirmationResult,
  sendPasswordResetEmail,
  sendEmailVerification,
  reload,
  Auth,
  User,
  AuthError,
  onAuthStateChanged
} from 'firebase/auth';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../firebase';
import { toast } from 'sonner';

// User profile interface for Firestore
export interface UserProfile {
  uid: string;
  name: string;
  email: string;
  phone?: string;
  address?: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
  };
  createdAt: unknown;
  updatedAt: unknown;
}

// Auth context interface
interface AuthContextType {
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
  updateUserProfile: (profileData: Partial<UserProfile>) => Promise<void>;
  isAdmin: boolean;
}

// Create the context
export const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Helper function to get user-friendly error messages
const getAuthErrorMessage = (errorCode: string): string => {
  switch (errorCode) {
    case 'auth/user-not-found':
      return 'No account found with this email address.';
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
    case 'auth/captcha-check-failed':
      return 'reCAPTCHA verification failed. Please try again.';
    case 'auth/credential-already-in-use':
      return 'This phone number is already associated with another account.';
    case 'auth/operation-not-allowed':
      return 'This sign-in method is not enabled.';
    case 'auth/requires-recent-login':
      return 'This operation requires recent authentication. Please sign in again.';
    case 'auth/invalid-credential':
      return 'Invalid credentials. Please check your email and password.';
    case 'auth/unauthorized-continue-uri':
      return 'Domain not authorized for password reset. Please contact support.';
    default:
      return 'An error occurred. Please try again.';
  }
};

// Email validation
const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Password validation
const validatePassword = (password: string): { isValid: boolean; message: string } => {
  if (password.length < 6) {
    return { isValid: false, message: 'Password must be at least 6 characters long' };
  }
  if (password.length > 128) {
    return { isValid: false, message: 'Password must be less than 128 characters' };
  }
  return { isValid: true, message: '' };
};

// Check if Firebase is properly configured
const isFirebaseConfigured = (): boolean => {
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

// Auth provider component
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [emailVerificationState, setEmailVerificationState] = useState(false);

  // Check if user is admin
  const isAdmin = user?.email === 'satisfiedcomputers@gmail.com';
  
  // Check if email is verified (admin is always considered verified)
  const isEmailVerified = isAdmin || (user?.emailVerified ?? false);

  // Handle redirect result for providers
  useEffect(() => {
    (async () => {
      try {
        const result = await getRedirectResult(auth);
        if (result?.user) {
          // If new user, create profile
          if ((result as any).additionalUserInfo?.isNewUser) {
            const u = result.user;
            await setDoc(doc(db, 'users', u.uid), {
              uid: u.uid,
              name: u.displayName || 'Unknown',
              email: u.email || '',
              phone: u.phoneNumber || '',
              createdAt: serverTimestamp(),
              updatedAt: serverTimestamp()
            });
          }
          toast.success('Signed in successfully!');
        }
      } catch (e) {
        console.error('Redirect result error:', e);
      }
    })();
  }, []);

  // Listen for authentication state changes
  useEffect(() => {
    // Check if Firebase is properly configured
    if (!isFirebaseConfigured()) {
      console.error('Firebase not configured. Please set up your .env file with Firebase credentials.');
      setLoading(false);
      return;
    }

    if (!auth) {
      console.error('Firebase auth not initialized');
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      console.log('Auth state changed:', user ? user.uid : 'No user');
      setUser(user);
      
      if (user) {
        // Load user profile from Firestore (only for customers, not admin)
        if (user.email !== 'satisfiedcomputers@gmail.com') {
          try {
            const userDoc = await getDoc(doc(db, 'users', user.uid));
            if (userDoc.exists()) {
              setUserProfile(userDoc.data() as UserProfile);
            }
          } catch (error) {
            console.error('Error loading user profile:', error);
            toast.error('Failed to load user profile');
          }
        } else {
          // Admin doesn't have a customer profile
          setUserProfile(null);
        }
      } else {
        setUserProfile(null);
      }
      
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Email/password sign in
  const signIn = async (email: string, password: string): Promise<boolean> => {
    console.log('=== SIGN IN ATTEMPT ===');
    console.log('Email:', email);
    console.log('Auth instance:', auth);
    console.log('Firebase configured:', isFirebaseConfigured());

    if (!auth) {
      console.error('Firebase auth not initialized');
      toast.error('Firebase not initialized. Please check your configuration.');
      return false;
    }

    // Validate inputs
    if (!email || !password) {
      console.error('Missing email or password');
      toast.error('Please enter both email and password');
      return false;
    }

    if (!validateEmail(email)) {
      console.error('Invalid email format');
      toast.error('Please enter a valid email address');
      return false;
    }
    
    try {
      console.log('Calling signInWithEmailAndPassword...');
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      console.log('Sign in successful:', userCredential.user.uid);
      toast.success('Successfully signed in!');
      return true;
    } catch (error: unknown) {
      console.error('Sign in error:', error);
      const authError = error as AuthError;
      console.error('Error code:', authError.code);
      console.error('Error message:', authError.message);
      toast.error(getAuthErrorMessage(authError.code));
      return false;
    }
  };

  // Email/password sign up
  const signUp = async (email: string, password: string, name: string, phone?: string): Promise<boolean> => {
    console.log('=== SIGN UP ATTEMPT ===');
    console.log('Email:', email);
    console.log('Name:', name);
    console.log('Auth instance:', auth);
    console.log('DB instance:', db);
    console.log('Firebase configured:', isFirebaseConfigured());

    if (!auth || !db) {
      console.error('Firebase not initialized');
      toast.error('Firebase not initialized. Please check your configuration.');
      return false;
    }

    // Validate inputs
    if (!email || !password || !name) {
      console.error('Missing required fields');
      toast.error('Please fill in all required fields');
      return false;
    }

    if (!validateEmail(email)) {
      console.error('Invalid email format');
      toast.error('Please enter a valid email address');
      return false;
    }

    const passwordValidation = validatePassword(password);
    if (!passwordValidation.isValid) {
      console.error('Password validation failed:', passwordValidation.message);
      toast.error(passwordValidation.message);
      return false;
    }
    
    try {
      console.log('Calling createUserWithEmailAndPassword...');
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      console.log('Account created successfully:', user.uid);

      // Create user profile in Firestore
      const userProfile: UserProfile = {
        uid: user.uid,
        name,
        email: user.email!,
        phone: phone || '',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };

      console.log('Creating user profile in Firestore...');
      await setDoc(doc(db, 'users', user.uid), userProfile);
      console.log('User profile created successfully');
      toast.success('Account created successfully!');
      return true;
    } catch (error: unknown) {
      console.error('Sign up error:', error);
      const authError = error as AuthError;
      console.error('Error code:', authError.code);
      console.error('Error message:', authError.message);
      toast.error(getAuthErrorMessage(authError.code));
      return false;
    }
  };

  // Google sign in
  const signInWithGoogle = async (): Promise<boolean> => {
    if (!auth || !db) {
      console.error('Firebase not initialized');
      toast.error('Firebase not initialized. Please check your configuration.');
      return false;
    }
    
    try {
      console.log('Attempting Google sign in...');
      const provider = new GoogleAuthProvider();
      let result;
      try {
        result = await signInWithPopup(auth, provider);
      } catch (popupError: unknown) {
        const shouldFallback =
          (popupError as { code?: string })?.code === 'auth/popup-blocked' ||
          (popupError as { code?: string })?.code === 'auth/popup-closed-by-user' ||
          (popupError as { code?: string })?.code === 'auth/operation-not-supported-in-this-environment';
        if (shouldFallback) {
          await signInWithRedirect(auth, provider);
          return true;
        }
        throw popupError;
      }
      
      console.log('Google sign in successful:', result.user.uid);
      
      // Check if this is a new user and create profile
      if ((result as any).additionalUserInfo?.isNewUser) {
        const user = result.user;
        const userProfile: UserProfile = {
          uid: user.uid,
          name: user.displayName || 'Unknown',
          email: user.email!,
          phone: user.phoneNumber || '',
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        };
        await setDoc(doc(db, 'users', user.uid), userProfile);
        console.log('New user profile created for Google sign in');
      }
      
      toast.success('Successfully signed in with Google!');
      return true;
    } catch (error: unknown) {
      console.error('Google sign in error:', error);
      const authError = error as AuthError;
      toast.error(getAuthErrorMessage(authError.code));
      return false;
    }
  };

  // Phone number sign in
  const signInWithPhone = async (phoneNumber: string): Promise<ConfirmationResult> => {
    if (!auth) {
      throw new Error('Firebase not initialized. Please check your configuration.');
    }

    try {
      console.log('Attempting phone sign in with:', phoneNumber);
      
      // Create reCAPTCHA verifier
      const recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
        size: 'invisible',
        callback: () => {
          console.log('reCAPTCHA solved');
        },
        'expired-callback': () => {
          console.log('reCAPTCHA expired');
          toast.error('reCAPTCHA expired. Please try again.');
        }
      });

      // Send verification code
      const confirmationResult = await signInWithPhoneNumber(auth, phoneNumber, recaptchaVerifier);
      console.log('Verification code sent successfully');
      toast.success('Verification code sent to your phone!');
      return confirmationResult;
    } catch (error: unknown) {
      console.error('Phone sign in error:', error);
      const authError = error as AuthError;
      
      if (authError.code === 'auth/invalid-phone-number') {
        throw new Error('Invalid phone number format.');
      } else if (authError.code === 'auth/too-many-requests') {
        throw new Error('Too many requests. Please try again later.');
      } else if (authError.code === 'auth/captcha-check-failed') {
        throw new Error('reCAPTCHA verification failed. Please try again.');
      } else {
        throw new Error('Failed to send verification code. Please try again.');
      }
    }
  };

  // Verify phone code
  const verifyPhoneCode = async (confirmationResult: ConfirmationResult, code: string): Promise<boolean> => {
    if (!auth || !db) {
      throw new Error('Firebase not initialized. Please check your configuration.');
    }

    try {
      console.log('Attempting to verify phone code');
      const result = await confirmationResult.confirm(code);
      const user = result.user;
      console.log('Phone verification successful:', user.uid);

      // Check if this is a new user and create profile
      if ((result as any).additionalUserInfo?.isNewUser) {
        const userProfile: UserProfile = {
          uid: user.uid,
          name: user.displayName || 'Phone User',
          email: user.email || '',
          phone: user.phoneNumber || '',
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        };
        await setDoc(doc(db, 'users', user.uid), userProfile);
        console.log('New user profile created for phone sign in');
      }

      toast.success('Phone verification successful!');
      return true;
    } catch (error: unknown) {
      console.error('Phone verification error:', error);
      const authError = error as AuthError;
      
      if (authError.code === 'auth/invalid-verification-code') {
        throw new Error('Invalid verification code. Please try again.');
      } else if (authError.code === 'auth/code-expired') {
        throw new Error('Verification code expired. Please request a new one.');
      } else if (authError.code === 'auth/invalid-verification-id') {
        throw new Error('Invalid verification session. Please start over.');
      } else {
        throw new Error('Failed to verify code. Please try again.');
      }
    }
  };

  // Sign out
  const signOut = async (): Promise<void> => {
    if (!auth) {
      console.error('Firebase auth not initialized');
      toast.error('Firebase not initialized. Please check your configuration.');
      return;
    }
    
    try {
      console.log('Signing out user');
      await firebaseSignOut(auth);
      console.log('Sign out successful');
      toast.success('Successfully signed out!');
    } catch (error: unknown) {
      console.error('Sign out error:', error);
      toast.error('Failed to sign out');
    }
  };

  // Send password reset email
  const sendPasswordResetEmailMethod = async (email: string): Promise<boolean> => {
    if (!auth) {
      console.error('Firebase auth not initialized');
      toast.error('Firebase not initialized. Please check your configuration.');
      return false;
    }

    // Validate email
    if (!email || !validateEmail(email)) {
      console.error('Invalid email format');
      toast.error('Please enter a valid email address');
      return false;
    }

    try {
      console.log('Sending password reset email to:', email);
      
      // For production, use Firebase's default password reset flow without custom continue URL
      // This avoids the unauthorized-continue-uri error
      const isProduction = window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1';
      
      if (isProduction) {
        // Use Firebase's default password reset flow for production
        await sendPasswordResetEmail(auth, email);
        console.log('Password reset email sent successfully (production mode)');
        toast.success('Password reset email sent! Check your inbox and follow the instructions.');
      } else {
        // For local development, use custom continue URL
        const currentOrigin = window.location.origin;
        const continueUrl = `${currentOrigin}/login`;
        
        console.log('Using continue URL (development mode):', continueUrl);
        
        await sendPasswordResetEmail(auth, email, {
          handleCodeInApp: false,
          url: continueUrl
        });
        console.log('Password reset email sent successfully (development mode)');
        toast.success('Password reset email sent! Check your inbox.');
      }
      
      return true;
    } catch (error: unknown) {
      console.error('Password reset error:', error);
      const authError = error as AuthError;
      console.error('Error code:', authError.code);
      console.error('Error message:', authError.message);
      
      // Provide specific guidance for unauthorized domain error
      if (authError.code === 'auth/unauthorized-continue-uri') {
        console.error('Domain not allowlisted. Current origin:', window.location.origin);
        toast.error('Using Firebase default password reset. Check your email for reset instructions.');
        
        // Try again without continue URL as fallback
        try {
          await sendPasswordResetEmail(auth, email);
          toast.success('Password reset email sent! Check your inbox.');
          return true;
        } catch (fallbackError) {
          console.error('Fallback password reset also failed:', fallbackError);
          toast.error('Failed to send password reset email. Please try again later.');
          return false;
        }
      } else {
        toast.error(getAuthErrorMessage(authError.code));
      }
      return false;
    }
  };

  // Send email verification
  const sendEmailVerificationMethod = async (): Promise<boolean> => {
    if (!auth || !user) {
      console.error('Firebase auth not initialized or no user');
      toast.error('Please sign in first');
      return false;
    }

    try {
      console.log('Sending email verification to:', user.email);
      await sendEmailVerification(user);
      console.log('Email verification sent successfully');
      toast.success('Verification email sent! Check your inbox.');
      return true;
    } catch (error: unknown) {
      console.error('Email verification error:', error);
      const authError = error as AuthError;
      console.error('Error code:', authError.code);
      console.error('Error message:', authError.message);
      toast.error(getAuthErrorMessage(authError.code));
      return false;
    }
  };

  // Check if email is verified (refresh user data)
  const checkEmailVerified = async (): Promise<boolean> => {
    if (!auth || !user) {
      console.error('Firebase auth not initialized or no user');
      return false;
    }

    try {
      console.log('Checking email verification status');
      await reload(user);
      console.log('Email verified status:', user.emailVerified);
      return user.emailVerified;
    } catch (error: unknown) {
      console.error('Error checking email verification:', error);
      return false;
    }
  };

  // Send email verification email (internal method)
  const sendVerificationEmailInternal = async (): Promise<boolean> => {
    if (!auth || !user) {
      toast.error('No user is currently signed in');
      return false;
    }

    try {
      await sendEmailVerification(user);
      toast.success('Verification email sent! Please check your inbox and spam folder.');
      return true;
    } catch (error) {
      console.error('Email verification error:', error);
      const authError = error as AuthError;
      toast.error(getAuthErrorMessage(authError.code));
      return false;
    }
  };

  // Resend verification email (publicly exposed method)
  const resendVerificationEmail = async (): Promise<boolean> => {
    return sendVerificationEmailInternal();
  };

  // Update user profile
  const updateUserProfile = async (profileData: Partial<UserProfile>): Promise<void> => {
    if (!user?.uid) {
      throw new Error('No user is currently signed in');
    }

    try {
      const userDocRef = doc(db, 'users', user.uid);
      
      // Prepare the update data with timestamp
      const updateData = {
        ...profileData,
        updatedAt: serverTimestamp()
      };

      // Update the document in Firestore
      await setDoc(userDocRef, updateData, { merge: true });

      // Update the local userProfile state
      setUserProfile(prev => prev ? { ...prev, ...profileData } : null);
      
      console.log('User profile updated successfully');
    } catch (error) {
      console.error('Error updating user profile:', error);
      throw error;
    }
  };

  const value: AuthContextType = {
    user,
    userProfile,
    loading,
    signIn,
    signUp,
    signInWithGoogle,
    signInWithPhone,
    verifyPhoneCode,
    signOut,
    sendPasswordResetEmail: sendPasswordResetEmailMethod,
    sendEmailVerification: sendVerificationEmailInternal,
    checkEmailVerified,
    isEmailVerified: user?.emailVerified || false,
    resendVerificationEmail,
    updateUserProfile,
    isAdmin
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
