import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  collection, 
  doc, 
  addDoc, 
  updateDoc, 
  getDocs, 
  query, 
  where, 
  orderBy, 
  onSnapshot,
  serverTimestamp 
} from 'firebase/firestore';
import { db } from '../firebase';

export interface ServiceRequest {
  id: string;
  userId?: string;
  customerName: string;
  email: string;
  phone: string;
  address: string;
  serviceType: 'Computer Repair' | 'Printer Repair' | 'CCTV Repair' | 'Networking' | 'Other Services';
  description: string;
  customService?: string;
  urgency: 'Low' | 'Medium' | 'High';
  preferredDate: string;
  status: 'Pending' | 'In Progress' | 'Completed';
  createdAt: unknown; // Firestore timestamp
  updatedAt: unknown; // Firestore timestamp
}

interface ServiceContextType {
  requests: ServiceRequest[];
  addRequest: (request: Omit<ServiceRequest, 'id' | 'status' | 'createdAt' | 'updatedAt'>) => Promise<string>;
  updateRequestStatus: (id: string, status: ServiceRequest['status']) => Promise<void>;
  getRequestsByContact: (emailOrPhone: string) => Promise<ServiceRequest[]>;
  getRequestsByUserId: (userId: string) => ServiceRequest[];
  getRequestById: (id: string) => Promise<ServiceRequest | undefined>;
  loading: boolean;
}

const ServiceContext = createContext<ServiceContextType | undefined>(undefined);

// Mock data for demonstration
const mockRequests: ServiceRequest[] = [
  {
    id: 'SC-001',
    customerName: 'John Smith',
    email: 'john.smith@email.com',
    phone: '+1-555-0123',
    address: '123 Main St, City, State 12345',
    serviceType: 'Computer Repair',
    description: 'Laptop not turning on, blue screen issues',
    urgency: 'High',
    preferredDate: '2024-01-15',
    status: 'In Progress',
    createdAt: '2024-01-10T09:00:00Z',
    updatedAt: '2024-01-12T14:30:00Z'
  },
  {
    id: 'SC-002',
    customerName: 'Sarah Johnson',
    email: 'sarah.j@business.com',
    phone: '+1-555-0456',
    address: '456 Oak Ave, Business Park, State 12346',
    serviceType: 'Networking',
    description: 'Office network setup for 20 employees',
    urgency: 'Medium',
    preferredDate: '2024-01-20',
    status: 'Pending',
    createdAt: '2024-01-12T11:15:00Z',
    updatedAt: '2024-01-12T11:15:00Z'
  },
  {
    id: 'SC-003',
    customerName: 'Mike Davis',
    email: 'mike.davis@home.net',
    phone: '+1-555-0789',
    address: '789 Pine St, Residential Area, State 12347',
    serviceType: 'Printer Repair',
    description: 'HP LaserJet not printing, paper jam error',
    urgency: 'Low',
    preferredDate: '2024-01-18',
    status: 'Completed',
    createdAt: '2024-01-08T16:45:00Z',
    updatedAt: '2024-01-14T10:20:00Z'
  }
];

export function ServiceProvider({ children }: { children: React.ReactNode }) {
  const [requests, setRequests] = useState<ServiceRequest[]>([]);
  const [loading, setLoading] = useState(true);

  // Listen to all service requests in real-time (skip when Firebase envs are missing)
  useEffect(() => {
    const hasEnv = Boolean(import.meta.env.VITE_FIREBASE_API_KEY && import.meta.env.VITE_FIREBASE_PROJECT_ID);
    if (!db || !hasEnv) {
      setLoading(false);
      return;
    }

    const q = query(
      collection(db, 'serviceRequests'),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const requestsData: ServiceRequest[] = [];
      snapshot.forEach((doc) => {
        requestsData.push({
          id: doc.id,
          ...doc.data()
        } as ServiceRequest);
      });
      setRequests(requestsData);
      setLoading(false);
    }, (error) => {
      // Only log error if it's not a configuration issue
      if (error.code !== 'permission-denied' && error.code !== 'unavailable') {
        console.warn('Firestore listen error:', error);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const addRequest = async (newRequest: Omit<ServiceRequest, 'id' | 'status' | 'createdAt' | 'updatedAt'>) => {
    if (!db) {
      throw new Error('Firebase not initialized');
    }

    try {
      // Validate required fields
      if (!newRequest.customerName || !newRequest.email || !newRequest.phone || !newRequest.address || !newRequest.serviceType || !newRequest.description) {
        throw new Error('Missing required fields');
      }

      const requestData = {
        userId: newRequest.userId || null,
        customerName: newRequest.customerName,
        email: newRequest.email,
        phone: newRequest.phone,
        address: newRequest.address,
        serviceType: newRequest.serviceType,
        description: newRequest.description,
        customService: newRequest.customService || null,
        urgency: newRequest.urgency,
        preferredDate: newRequest.preferredDate,
        status: 'Pending',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };

      console.log('Adding request to Firestore:', requestData);
      const docRef = await addDoc(collection(db, 'serviceRequests'), requestData);
      console.log('Request added with ID:', docRef.id);
      return docRef.id;
    } catch (error) {
      console.error('Error adding service request:', error);
      throw error;
    }
  };

  const updateRequestStatus = async (id: string, status: ServiceRequest['status']) => {
    if (!db) {
      throw new Error('Firebase not initialized');
    }

    try {
      await updateDoc(doc(db, 'serviceRequests', id), {
        status,
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      console.error('Error updating service request:', error);
      throw error;
    }
  };

  const getRequestsByContact = async (emailOrPhone: string) => {
    if (!db) {
      return [];
    }

    try {
      const q = query(
        collection(db, 'serviceRequests'),
        where('email', '==', emailOrPhone.toLowerCase())
      );
      
      const phoneQuery = query(
        collection(db, 'serviceRequests'),
        where('phone', '==', emailOrPhone)
      );

      const [emailSnapshot, phoneSnapshot] = await Promise.all([
        getDocs(q),
        getDocs(phoneQuery)
      ]);

      const results: ServiceRequest[] = [];
      emailSnapshot.forEach((doc) => {
        results.push({ id: doc.id, ...doc.data() } as ServiceRequest);
      });
      phoneSnapshot.forEach((doc) => {
        results.push({ id: doc.id, ...doc.data() } as ServiceRequest);
      });

      return results;
    } catch (error) {
      console.error('Error getting requests by contact:', error);
      return [];
    }
  };

  const getRequestsByUserId = (userId: string) => {
    return requests.filter(req => req.userId === userId);
  };

  const getRequestById = async (id: string) => {
    // First try to find in current requests
    const found = requests.find(req => req.id === id);
    if (found) return found;
    
    // If not found in memory, try to fetch from Firestore
    if (!db) return undefined;
    
    try {
      const docRef = doc(db, 'serviceRequests', id);
      const docSnap = await getDocs(query(collection(db, 'serviceRequests'), where('__name__', '==', id)));
      if (!docSnap.empty) {
        const doc = docSnap.docs[0];
        return { id: doc.id, ...doc.data() } as ServiceRequest;
      }
    } catch (error) {
      console.error('Error fetching request by ID:', error);
    }
    
    return undefined;
  };

  const value: ServiceContextType = {
    requests,
    addRequest,
    updateRequestStatus,
    getRequestsByContact,
    getRequestsByUserId,
    getRequestById,
    loading
  };

  return (
    <ServiceContext.Provider value={value}>
      {children}
    </ServiceContext.Provider>
  );
}

export function useService() {
  const context = useContext(ServiceContext);
  if (context === undefined) {
    throw new Error('useService must be used within a ServiceProvider');
  }
  return context;
}