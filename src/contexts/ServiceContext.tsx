import React, { createContext, useContext, useState, useEffect } from 'react';

export interface ServiceRequest {
  id: string;
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
  createdAt: string;
  updatedAt: string;
}

interface ServiceContextType {
  requests: ServiceRequest[];
  addRequest: (request: Omit<ServiceRequest, 'id' | 'status' | 'createdAt' | 'updatedAt'>) => string;
  updateRequestStatus: (id: string, status: ServiceRequest['status']) => void;
  getRequestsByContact: (emailOrPhone: string) => ServiceRequest[];
  getRequestById: (id: string) => ServiceRequest | undefined;
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

  // Load data from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('satisfied-computers-requests');
    if (saved) {
      setRequests(JSON.parse(saved));
    } else {
      setRequests(mockRequests);
    }
  }, []);

  // Save to localStorage whenever requests change
  useEffect(() => {
    localStorage.setItem('satisfied-computers-requests', JSON.stringify(requests));
  }, [requests]);

  const addRequest = (newRequest: Omit<ServiceRequest, 'id' | 'status' | 'createdAt' | 'updatedAt'>) => {
    const id = `SC-${String(requests.length + 1).padStart(3, '0')}`;
    const now = new Date().toISOString();
    
    const request: ServiceRequest = {
      ...newRequest,
      id,
      status: 'Pending',
      createdAt: now,
      updatedAt: now
    };

    setRequests(prev => [...prev, request]);
    return id;
  };

  const updateRequestStatus = (id: string, status: ServiceRequest['status']) => {
    setRequests(prev => prev.map(req => 
      req.id === id 
        ? { ...req, status, updatedAt: new Date().toISOString() }
        : req
    ));
  };

  const getRequestsByContact = (emailOrPhone: string) => {
    return requests.filter(req => 
      req.email.toLowerCase() === emailOrPhone.toLowerCase() || 
      req.phone === emailOrPhone
    );
  };

  const getRequestById = (id: string) => {
    return requests.find(req => req.id === id);
  };

  const value: ServiceContextType = {
    requests,
    addRequest,
    updateRequestStatus,
    getRequestsByContact,
    getRequestById
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