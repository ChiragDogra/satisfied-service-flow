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
};