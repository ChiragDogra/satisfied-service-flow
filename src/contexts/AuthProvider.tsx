import React, { useEffect, useState, ReactNode } from 'react';
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
  User,
  AuthError,
  onAuthStateChanged
} from 'firebase/auth';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../firebase';
import { toast } from 'sonner';
import { validateEmail } from '../lib/auth-utils';
import { AuthContext, AuthContextType } from './AuthContext.types';
import { UserProfile } from '../types/UserProfile';

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
      return 'This credential is already linked to another account.';
    default:
      return 'An error occurred. Please try again.';
  }
};

// Auth provider component
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  // Auth state listener
  useEffect(() => {
    if (!auth) {
      console.error('Firebase auth not initialized');
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);
      setIsEmailVerified(user?.emailVerified || false);

      if (user) {
        // Get user profile
        try {
          const docRef = doc(db, 'users', user.uid);
          const docSnap = await getDoc(docRef);
          
          if (docSnap.exists()) {
            const profile = docSnap.data() as UserProfile;
            setUserProfile(profile);
            // Check if user is admin (modify this logic based on your admin criteria)
            setIsAdmin(profile.email?.endsWith('@satisfied.com') || false);
          }
        } catch (error) {
          console.error('Error fetching user profile:', error);
        }
      } else {
        setUserProfile(null);
        setIsAdmin(false);
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Send password reset email with custom settings
  const sendPasswordResetEmailMethod = async (email: string): Promise<boolean> => {
    if (!auth) {
      console.error('Firebase auth not initialized');
      toast.error('Firebase not initialized. Please check your configuration.');
      return false;
    }

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
        const actionCodeSettings = {
          url: `${window.location.origin}/reset-password`,
          handleCodeInApp: true
        };

        console.log('Using redirect URL (development mode):', actionCodeSettings.url);
        
        await sendPasswordResetEmail(auth, email, actionCodeSettings);
        console.log('Password reset email sent successfully (development mode)');
        toast.success('Password reset email sent! Please check your inbox and spam folder.');
      }
      
      return true;
    } catch (error) {
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
  const sendVerificationEmailInternal = async (): Promise<boolean> => {
    if (!auth || !user) {
      console.error('Cannot send verification email: No user is signed in');
      toast.error('Please sign in to verify your email');
      return false;
    }

    if (user.emailVerified) {
      console.log('Email is already verified');
      toast.info('Your email is already verified');
      return true;
    }

    try {
      // For production, use Firebase's default email verification flow
      const isProduction = window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1';
      
      if (isProduction) {
        // Use Firebase's default email verification for production
        console.log('Attempting to send verification email to:', user.email);
        await sendEmailVerification(user);
      } else {
        // For local development, use custom continue URL
        const actionCodeSettings = {
          url: `${window.location.origin}/dashboard`,
          handleCodeInApp: false
        };

        console.log('Attempting to send verification email to:', user.email);
        await sendEmailVerification(user, actionCodeSettings);
      }
      
      // Force refresh the user to get latest emailVerified status
      await user.reload();
      setIsEmailVerified(user.emailVerified);
      
      console.log('Verification email sent successfully');
      toast.success('Verification email sent! Please check your inbox and spam folder.');
      return true;
    } catch (error) {
      console.error('Failed to send verification email:', error);
      const authError = error as AuthError;
      console.error('Error details:', {
        code: authError.code,
        message: authError.message,
        email: user.email,
        uid: user.uid
      });
      
      // Handle specific error cases
      if (authError.code === 'auth/too-many-requests') {
        toast.error('Too many attempts. Please wait a few minutes before trying again.');
      } else if (authError.code === 'auth/internal-error') {
        toast.error('Server error. Please try again later.');
      } else if (authError.code === 'auth/unauthorized-continue-uri') {
        // Try again without continue URL as fallback
        try {
          await sendEmailVerification(user);
          toast.success('Verification email sent! Please check your inbox.');
          return true;
        } catch (fallbackError) {
          console.error('Fallback email verification also failed:', fallbackError);
          toast.error('Failed to send verification email. Please try again later.');
          return false;
        }
      } else {
        toast.error(getAuthErrorMessage(authError.code));
      }
      return false;
    }
  };

  // Resend verification email (publicly exposed method)
  const resendVerificationEmail = async (): Promise<boolean> => {
    return sendVerificationEmailInternal();
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
      const isVerified = user.emailVerified;
      console.log('Email verified status:', isVerified);
      setIsEmailVerified(isVerified);
      return isVerified;
    } catch (error) {
      console.error('Error checking email verification:', error);
      return false;
    }
  };

  // Sign in with email and password
  const signIn = async (email: string, password: string): Promise<boolean> => {
    if (!auth) {
      console.error('Firebase auth not initialized');
      return false;
    }

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      console.log('Sign in successful:', userCredential);
      return true;
    } catch (error) {
      console.error('Sign in error:', error);
      const authError = error as AuthError;
      toast.error(getAuthErrorMessage(authError.code));
      return false;
    }
  };

  // Sign up with email and password
  const signUp = async (email: string, password: string, name: string, phone?: string): Promise<boolean> => {
    if (!auth || !db) {
      console.error('Firebase not initialized');
      return false;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Create user profile in Firestore
      const userProfile: UserProfile = {
        uid: user.uid,
        name,
        email,
        phone,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };

      await setDoc(doc(db, 'users', user.uid), userProfile);
      
      // Send email verification
      await sendVerificationEmailInternal();
      return true;
    } catch (error) {
      console.error('Sign up error:', error);
      const authError = error as AuthError;
      toast.error(getAuthErrorMessage(authError.code));
      return false;
    }
  };

  // Sign in with Google
  const signInWithGoogle = async (): Promise<boolean> => {
    if (!auth) {
      console.error('Firebase auth not initialized');
      return false;
    }

    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      console.log('Google sign in successful:', result);
      
      if (result.user) {
        // Create/update user profile
        const userProfile: UserProfile = {
          uid: result.user.uid,
          name: result.user.displayName || '',
          email: result.user.email || '',
          phone: result.user.phoneNumber || undefined,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        };

        await setDoc(doc(db, 'users', result.user.uid), userProfile, { merge: true });
      }
      
      return true;
    } catch (error) {
      console.error('Google sign in error:', error);
      const authError = error as AuthError;
      toast.error(getAuthErrorMessage(authError.code));
      return false;
    }
  };

  // Sign in with phone
  const signInWithPhone = async (phoneNumber: string): Promise<ConfirmationResult> => {
    if (!auth) {
      throw new Error('Firebase auth not initialized');
    }

    try {
      const recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
        size: 'invisible'
      });
      
      const confirmationResult = await signInWithPhoneNumber(auth, phoneNumber, recaptchaVerifier);
      return confirmationResult;
    } catch (error) {
      console.error('Phone sign in error:', error);
      const authError = error as AuthError;
      toast.error(getAuthErrorMessage(authError.code));
      throw error;
    }
  };

  // Verify phone code
  const verifyPhoneCode = async (confirmationResult: ConfirmationResult, code: string): Promise<boolean> => {
    try {
      const result = await confirmationResult.confirm(code);
      console.log('Phone authentication successful:', result);
      
      if (result.user) {
        // Create/update user profile
        const userProfile: UserProfile = {
          uid: result.user.uid,
          name: result.user.displayName || '',
          email: result.user.email || '',
          phone: result.user.phoneNumber || undefined,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        };

        await setDoc(doc(db, 'users', result.user.uid), userProfile, { merge: true });
      }
      
      return true;
    } catch (error) {
      console.error('Phone code verification error:', error);
      const authError = error as AuthError;
      toast.error(getAuthErrorMessage(authError.code));
      return false;
    }
  };

  // Sign out
  const handleSignOut = async (): Promise<void> => {
    if (!auth) {
      console.error('Firebase auth not initialized');
      return;
    }

    try {
      await firebaseSignOut(auth);
      setUser(null);
      setUserProfile(null);
      setIsAdmin(false);
      toast.success('Signed out successfully');
    } catch (error) {
      console.error('Sign out error:', error);
      const authError = error as AuthError;
      toast.error(getAuthErrorMessage(authError.code));
    }
  };

  const value: AuthContextType = {
    user,
    userProfile,
    loading,
    signIn, // You'll need to implement this
    signUp, // You'll need to implement this
    signInWithGoogle, // You'll need to implement this
    signInWithPhone, // You'll need to implement this
    verifyPhoneCode, // You'll need to implement this
    signOut: handleSignOut, // You'll need to implement this
    sendPasswordResetEmail: sendPasswordResetEmailMethod,
    sendEmailVerification: sendVerificationEmailInternal,
    checkEmailVerified,
    isEmailVerified,
    resendVerificationEmail,
    isAdmin
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};