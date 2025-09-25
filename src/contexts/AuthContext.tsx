import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { 
  User, 
  onAuthStateChanged, 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  GoogleAuthProvider,
  FacebookAuthProvider,
  GithubAuthProvider,
  signOut as firebaseSignOut
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
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
  createdAt: unknown; // Firestore timestamp
  updatedAt: unknown; // Firestore timestamp
}

// Auth context interface
interface AuthContextType {
  user: User | null;
  userProfile: UserProfile | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, name: string, phone?: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signInWithFacebook: () => Promise<void>;
  signInWithGitHub: () => Promise<void>;
  signOut: () => Promise<void>;
  isAdmin: boolean;
}

// Create the context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Auth provider component
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  // Check if user is admin
  const isAdmin = user?.email === 'admin@satisfiedcomputers.com';


  // Handle redirect result for providers (useful on hosting/iOS/Safari)
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
              createdAt: new Date(),
              updatedAt: new Date()
            });
          }
          toast.success('Signed in successfully!');
        }
      } catch (e) {
        // Ignore if no redirect pending; show friendly error otherwise
      }
    })();
  }, []);

  // Listen for authentication state changes
  useEffect(() => {
    // Check if Firebase is properly configured
    if (!import.meta.env.VITE_FIREBASE_API_KEY || import.meta.env.VITE_FIREBASE_API_KEY === 'your_api_key_here') {
      console.warn('Firebase not configured. Please set up your .env file with Firebase credentials.');
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);
      
      if (user) {
        // Load user profile from Firestore (only for customers, not admin)
        if (user.email !== 'admin@satisfiedcomputers.com') {
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
          setUserProfile(null); // Admin doesn't have a profile
        }
      } else {
        setUserProfile(null);
      }
      
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Email/password sign in
  const signIn = async (email: string, password: string) => {
    if (!auth) {
      toast.error('Firebase not initialized. Please check your configuration.');
      return;
    }
    
    try {
      await signInWithEmailAndPassword(auth, email, password);
      toast.success('Successfully signed in!');
    } catch (error: unknown) {
      console.error('Sign in error:', error);
      toast.error(getErrorMessage((error as { code: string }).code));
    }
  };

  // Email/password sign up
  const signUp = async (email: string, password: string, name: string, phone?: string) => {
    if (!auth || !db) {
      toast.error('Firebase not initialized. Please check your configuration.');
      return;
    }
    
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Create user profile in Firestore
      const userProfile: UserProfile = {
        uid: user.uid,
        name,
        email: user.email!,
        phone: phone || '',
        createdAt: new Date(),
        updatedAt: new Date()
      };

      await setDoc(doc(db, 'users', user.uid), userProfile);
      toast.success('Account created successfully!');
    } catch (error: unknown) {
      console.error('Sign up error:', error);
      toast.error(getErrorMessage((error as { code: string }).code));
    }
  };

  // Google sign in
  const signInWithGoogle = async () => {
    if (!auth || !db) {
      toast.error('Firebase not initialized. Please check your configuration.');
      return;
    }
    
    try {
      const provider = new GoogleAuthProvider();
      // Prefer popup; fallback to redirect if blocked or in restricted browsers
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
          return;
        }
        throw popupError;
      }
      
      // Check if this is a new user and create profile
      if ((result as any).additionalUserInfo?.isNewUser) {
        const user = result.user;
        const userProfile: UserProfile = {
          uid: user.uid,
          name: user.displayName || 'Unknown',
          email: user.email!,
          phone: user.phoneNumber || '',
          createdAt: new Date(),
          updatedAt: new Date()
        };
        await setDoc(doc(db, 'users', user.uid), userProfile);
      }
      
      toast.success('Successfully signed in with Google!');
    } catch (error: unknown) {
      console.error('Google sign in error:', error);
      toast.error(getErrorMessage((error as { code: string }).code));
    }
  };

  // Facebook sign in
  const signInWithFacebook = async () => {
    if (!auth || !db) {
      toast.error('Firebase not initialized. Please check your configuration.');
      return;
    }
    
    try {
      const provider = new FacebookAuthProvider();
      const result = await signInWithPopup(auth, provider);
      
      // Check if this is a new user and create profile
      if ((result as any).additionalUserInfo?.isNewUser) {
        const user = result.user;
        const userProfile: UserProfile = {
          uid: user.uid,
          name: user.displayName || 'Unknown',
          email: user.email!,
          phone: user.phoneNumber || '',
          createdAt: new Date(),
          updatedAt: new Date()
        };
        await setDoc(doc(db, 'users', user.uid), userProfile);
      }
      
      toast.success('Successfully signed in with Facebook!');
    } catch (error: unknown) {
      console.error('Facebook sign in error:', error);
      toast.error(getErrorMessage((error as { code: string }).code));
    }
  };

  // GitHub sign in
  const signInWithGitHub = async () => {
    if (!auth || !db) {
      toast.error('Firebase not initialized. Please check your configuration.');
      return;
    }
    
    try {
      const provider = new GithubAuthProvider();
      const result = await signInWithPopup(auth, provider);
      
      // Check if this is a new user and create profile
      if ((result as any).additionalUserInfo?.isNewUser) {
        const user = result.user;
        const userProfile: UserProfile = {
          uid: user.uid,
          name: user.displayName || 'Unknown',
          email: user.email!,
          phone: user.phoneNumber || '',
          createdAt: new Date(),
          updatedAt: new Date()
        };
        await setDoc(doc(db, 'users', user.uid), userProfile);
      }
      
      toast.success('Successfully signed in with GitHub!');
    } catch (error: unknown) {
      console.error('GitHub sign in error:', error);
      toast.error(getErrorMessage((error as { code: string }).code));
    }
  };


  // Sign out
  const signOut = async () => {
    if (!auth) {
      toast.error('Firebase not initialized. Please check your configuration.');
      return;
    }
    
    try {
      await firebaseSignOut(auth);
      toast.success('Successfully signed out!');
    } catch (error: unknown) {
      console.error('Sign out error:', error);
      toast.error('Failed to sign out');
    }
  };

  const value: AuthContextType = {
    user,
    userProfile,
    loading,
    signIn,
    signUp,
    signInWithGoogle,
    signInWithFacebook,
    signInWithGitHub,
    signOut,
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

// Helper function to get user-friendly error messages
const getErrorMessage = (errorCode: string): string => {
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
    default:
      return 'An error occurred. Please try again.';
  }
};

