import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  collection, 
  getDocs, 
  query, 
  orderBy, 
  onSnapshot,
  doc,
  updateDoc,
  deleteDoc,
  where
} from 'firebase/firestore';
import { db } from '../firebase';
import { UserProfile } from '../types/UserProfile';
import { ServiceRequest } from './ServiceContext';

interface AdminContextType {
  users: UserProfile[];
  allServiceRequests: ServiceRequest[];
  loading: boolean;
  updateUserProfile: (userId: string, updates: Partial<UserProfile>) => Promise<void>;
  deleteUser: (userId: string) => Promise<void>;
  getUserServiceHistory: (userId: string) => ServiceRequest[];
  getUserServiceHistoryByPeriod: (userId: string, period: 'thisMonth' | 'thisYear' | 'all') => ServiceRequest[];
  refreshData: () => Promise<void>;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export function AdminProvider({ children }: { children: React.ReactNode }) {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [allServiceRequests, setAllServiceRequests] = useState<ServiceRequest[]>([]);
  const [loading, setLoading] = useState(true);

  // Listen to all users in real-time
  useEffect(() => {
    const hasEnv = Boolean(import.meta.env.VITE_FIREBASE_API_KEY && import.meta.env.VITE_FIREBASE_PROJECT_ID);
    if (!db || !hasEnv) {
      setLoading(false);
      return;
    }

    const usersQuery = query(
      collection(db, 'users'),
      orderBy('createdAt', 'desc')
    );

    const unsubscribeUsers = onSnapshot(usersQuery, (snapshot) => {
      const usersData: UserProfile[] = [];
      snapshot.forEach((doc) => {
        usersData.push({
          uid: doc.id,
          ...doc.data()
        } as UserProfile);
      });
      setUsers(usersData);
    }, (error) => {
      if (error.code !== 'permission-denied' && error.code !== 'unavailable') {
        console.warn('Users listen error:', error);
      }
    });

    return () => unsubscribeUsers();
  }, []);

  // Listen to all service requests in real-time
  useEffect(() => {
    const hasEnv = Boolean(import.meta.env.VITE_FIREBASE_API_KEY && import.meta.env.VITE_FIREBASE_PROJECT_ID);
    if (!db || !hasEnv) {
      setLoading(false);
      return;
    }

    const requestsQuery = query(
      collection(db, 'serviceRequests'),
      orderBy('createdAt', 'desc')
    );

    const unsubscribeRequests = onSnapshot(requestsQuery, (snapshot) => {
      const requestsData: ServiceRequest[] = [];
      snapshot.forEach((doc) => {
        requestsData.push({
          id: doc.id,
          ...doc.data()
        } as ServiceRequest);
      });
      setAllServiceRequests(requestsData);
      setLoading(false);
    }, (error) => {
      if (error.code !== 'permission-denied' && error.code !== 'unavailable') {
        console.warn('Service requests listen error:', error);
      }
      setLoading(false);
    });

    return () => unsubscribeRequests();
  }, []);

  const updateUserProfile = async (userId: string, updates: Partial<UserProfile>) => {
    if (!db) {
      throw new Error('Firebase not initialized');
    }

    try {
      await updateDoc(doc(db, 'users', userId), {
        ...updates,
        updatedAt: new Date()
      });
    } catch (error) {
      console.error('Error updating user profile:', error);
      throw error;
    }
  };

  const deleteUser = async (userId: string) => {
    if (!db) {
      throw new Error('Firebase not initialized');
    }

    try {
      // Note: This only deletes the user profile from Firestore
      // The Firebase Auth user would need to be deleted separately using Admin SDK
      await deleteDoc(doc(db, 'users', userId));
    } catch (error) {
      console.error('Error deleting user:', error);
      throw error;
    }
  };

  const getUserServiceHistory = (userId: string): ServiceRequest[] => {
    return allServiceRequests.filter(request => request.userId === userId);
  };

  const getUserServiceHistoryByPeriod = (userId: string, period: 'thisMonth' | 'thisYear' | 'all'): ServiceRequest[] => {
    const userRequests = allServiceRequests.filter(request => request.userId === userId);
    
    if (period === 'all') {
      return userRequests;
    }

    const now = new Date();
    let startDate: Date;

    if (period === 'thisMonth') {
      startDate = new Date(now.getFullYear(), now.getMonth(), 1);
    } else { // thisYear
      startDate = new Date(now.getFullYear(), 0, 1);
    }

    return userRequests.filter(request => {
      try {
        let requestDate: Date;
        
        if (request.createdAt && typeof request.createdAt === 'object' && 'toDate' in request.createdAt) {
          requestDate = (request.createdAt as any).toDate();
        } else if (typeof request.createdAt === 'string') {
          requestDate = new Date(request.createdAt);
        } else if (request.createdAt instanceof Date) {
          requestDate = request.createdAt;
        } else {
          return false;
        }
        
        return requestDate >= startDate;
      } catch {
        return false;
      }
    });
  };

  const refreshData = async () => {
    setLoading(true);
    // The real-time listeners will automatically refresh the data
    // This function is here for manual refresh if needed
    setTimeout(() => setLoading(false), 1000);
  };

  const value: AdminContextType = {
    users,
    allServiceRequests,
    loading,
    updateUserProfile,
    deleteUser,
    getUserServiceHistory,
    getUserServiceHistoryByPeriod,
    refreshData
  };

  return (
    <AdminContext.Provider value={value}>
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin() {
  const context = useContext(AdminContext);
  if (context === undefined) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
}
