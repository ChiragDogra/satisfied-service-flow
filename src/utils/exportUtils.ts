import { ServiceRequest } from '../contexts/ServiceContext';
import { UserProfile } from '../types/UserProfile';

// Function to export service requests to CSV format
export const exportServiceRequestsToCSV = (requests: ServiceRequest[]): string => {
  const headers = [
    'Ticket ID',
    'Customer Name',
    'Email',
    'Phone',
    'Address',
    'Service Type',
    'Description',
    'Custom Service',
    'Urgency',
    'Preferred Date',
    'Status',
    'Created At',
    'Updated At'
  ];

  const csvContent = [
    headers.join(','),
    ...requests.map(request => [
      request.id,
      `"${request.customerName}"`,
      request.email,
      request.phone,
      `"${request.address}"`,
      request.serviceType,
      `"${request.description.replace(/"/g, '""')}"`,
      request.customService ? `"${request.customService}"` : '',
      request.urgency,
      request.preferredDate,
      request.status,
      formatDateForExport(request.createdAt),
      formatDateForExport(request.updatedAt)
    ].join(','))
  ].join('\n');

  return csvContent;
};

// Function to export user profiles to CSV format
export const exportUsersToCSV = (users: UserProfile[]): string => {
  const headers = [
    'User ID',
    'Name',
    'Email',
    'Phone',
    'Street',
    'City',
    'State',
    'Zip Code',
    'Created At',
    'Updated At'
  ];

  const csvContent = [
    headers.join(','),
    ...users.map(user => [
      user.uid,
      `"${user.name}"`,
      user.email,
      user.phone || '',
      user.address?.street ? `"${user.address.street}"` : '',
      user.address?.city || '',
      user.address?.state || '',
      user.address?.zipCode || '',
      formatDateForExport(user.createdAt),
      formatDateForExport(user.updatedAt)
    ].join(','))
  ].join('\n');

  return csvContent;
};

// Function to download CSV file
export const downloadCSV = (csvContent: string, filename: string): void => {
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

// Helper function to format dates for export
const formatDateForExport = (timestamp: unknown): string => {
  if (!timestamp) return '';
  
  try {
    // Handle Firestore timestamp
    if (timestamp && typeof timestamp === 'object' && 'toDate' in timestamp) {
      return (timestamp as any).toDate().toISOString();
    }
    
    // Handle string dates
    if (typeof timestamp === 'string') {
      return new Date(timestamp).toISOString();
    }
    
    // Handle Date objects
    if (timestamp instanceof Date) {
      return timestamp.toISOString();
    }
    
    return '';
  } catch (error) {
    console.error('Error formatting date:', error);
    return '';
  }
};

// Helper function to format dates for display
export const formatDateForDisplay = (timestamp: unknown): string => {
  if (!timestamp) return 'Unknown';
  
  try {
    let date: Date | null = null;
    
    // Handle Firestore timestamp
    if (timestamp && typeof timestamp === 'object' && 'toDate' in timestamp) {
      date = (timestamp as any).toDate();
    }
    // Handle string dates
    else if (typeof timestamp === 'string') {
      date = new Date(timestamp);
    }
    // Handle Date objects
    else if (timestamp instanceof Date) {
      date = timestamp;
    }
    
    if (date && !isNaN(date.getTime())) {
      return date.toLocaleString();
    }
    
    return 'Invalid Date';
  } catch (error) {
    console.error('Error formatting date for display:', error);
    return 'Invalid Date';
  }
};

// Function to export individual user's service requests with user info
export const exportUserServiceRequestsToCSV = (
  user: UserProfile, 
  requests: ServiceRequest[], 
  period: string
): string => {
  const headers = [
    'User Name',
    'User Email',
    'User Phone',
    'User ID',
    'Ticket ID',
    'Service Type',
    'Description',
    'Custom Service',
    'Urgency',
    'Preferred Date',
    'Status',
    'Created At',
    'Updated At',
    'Address'
  ];

  const csvContent = [
    headers.join(','),
    ...requests.map(request => [
      `"${user.name}"`,
      user.email,
      user.phone || '',
      user.uid,
      request.id,
      request.serviceType,
      `"${request.description.replace(/"/g, '""')}"`,
      request.customService ? `"${request.customService}"` : '',
      request.urgency,
      request.preferredDate,
      request.status,
      formatDateForExport(request.createdAt),
      formatDateForExport(request.updatedAt),
      `"${request.address}"`
    ].join(','))
  ].join('\n');

  return csvContent;
};

// Function to get service statistics
export const getServiceStatistics = (requests: ServiceRequest[]) => {
  const total = requests.length;
  const pending = requests.filter(r => r.status === 'Pending').length;
  const inProgress = requests.filter(r => r.status === 'In Progress').length;
  const completed = requests.filter(r => r.status === 'Completed').length;
  
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const completedToday = requests.filter(r => {
    if (r.status !== 'Completed') return false;
    
    try {
      let updatedDate: Date;
      
      if (r.updatedAt && typeof r.updatedAt === 'object' && 'toDate' in r.updatedAt) {
        updatedDate = (r.updatedAt as any).toDate();
      } else if (typeof r.updatedAt === 'string') {
        updatedDate = new Date(r.updatedAt);
      } else if (r.updatedAt instanceof Date) {
        updatedDate = r.updatedAt;
      } else {
        return false;
      }
      
      updatedDate.setHours(0, 0, 0, 0);
      return updatedDate.getTime() === today.getTime();
    } catch {
      return false;
    }
  }).length;

  const serviceTypeStats = requests.reduce((acc, request) => {
    acc[request.serviceType] = (acc[request.serviceType] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const urgencyStats = requests.reduce((acc, request) => {
    acc[request.urgency] = (acc[request.urgency] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return {
    total,
    pending,
    inProgress,
    completed,
    completedToday,
    serviceTypeStats,
    urgencyStats
  };
};
