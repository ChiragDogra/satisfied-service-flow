import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  doc, 
  getDoc, 
  setDoc, 
  serverTimestamp 
} from 'firebase/firestore';
import { db } from '../firebase';

export interface HomePageContent {
  hero: {
    title: string;
    subtitle: string;
  };
  trustIndicators: {
    customers: string;
    experience: string;
    successRate: string;
    support: string;
  };
  services: {
    title: string;
    subtitle: string;
  };
  contact: {
    title: string;
    subtitle: string;
    phone: string;
    whatsapp: string;
    email: string;
    address: {
      line1: string;
      line2: string;
    };
    hours: {
      weekdays: string;
      saturday: string;
    };
  };
  footer: {
    description: string;
  };
}

interface ContentContextType {
  content: HomePageContent;
  updateContent: (newContent: HomePageContent) => Promise<void>;
  loading: boolean;
  resetToDefaults: () => void;
}

const defaultContent: HomePageContent = {
  hero: {
    title: "Professional IT Services You Can Trust",
    subtitle: "Expert computer repair, networking solutions, and IT support for homes and businesses. Fast, reliable, and professional service with 15+ years of experience."
  },
  trustIndicators: {
    customers: "500+",
    experience: "15+",
    successRate: "98%",
    support: "24/7"
  },
  services: {
    title: "Complete IT Solutions",
    subtitle: "From computer repair to network setup, we provide comprehensive IT services for homes and businesses across all major brands and systems."
  },
  contact: {
    title: "Ready to Get Started?",
    subtitle: "Contact us today for fast, professional IT service. We're here to help!",
    phone: "+91 9634409988",
    whatsapp: "+91 9634409988",
    email: "satisfiedcomputers@gmail.com",
    address: {
      line1: "Transport Nagar",
      line2: "Saharanpur"
    },
    hours: {
      weekdays: "Mon-Fri: 8AM-6PM",
      saturday: "Sat: 9AM-4PM"
    }
  },
  footer: {
    description: "Professional IT services and computer repair with over 15 years of experience. Your satisfaction is our priority."
  }
};

const ContentContext = createContext<ContentContextType | undefined>(undefined);

export function ContentProvider({ children }: { children: React.ReactNode }) {
  const [content, setContent] = useState<HomePageContent>(defaultContent);
  const [loading, setLoading] = useState(true);

  // Load content from Firestore on mount
  useEffect(() => {
    const loadContent = async () => {
      const hasEnv = Boolean(import.meta.env.VITE_FIREBASE_API_KEY && import.meta.env.VITE_FIREBASE_PROJECT_ID);
      if (!db || !hasEnv) {
        setLoading(false);
        return;
      }

      try {
        const docRef = doc(db, 'siteContent', 'homePage');
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          const data = docSnap.data();
          setContent({ ...defaultContent, ...data.content });
        }
      } catch (error) {
        console.error('Error loading content:', error);
      } finally {
        setLoading(false);
      }
    };

    loadContent();
  }, []);

  const updateContent = async (newContent: HomePageContent) => {
    if (!db) {
      throw new Error('Firebase not initialized');
    }

    try {
      // Validate content before saving
      const validatedContent = validateContent(newContent);
      
      const docRef = doc(db, 'siteContent', 'homePage');
      await setDoc(docRef, {
        content: validatedContent,
        updatedAt: serverTimestamp(),
        updatedBy: 'admin'
      });
      
      setContent(validatedContent);
    } catch (error) {
      console.error('Error updating content:', error);
      throw error;
    }
  };

  const resetToDefaults = () => {
    setContent(defaultContent);
  };

  const value: ContentContextType = {
    content,
    updateContent,
    loading,
    resetToDefaults
  };

  return (
    <ContentContext.Provider value={value}>
      {children}
    </ContentContext.Provider>
  );
}

// Validation function to ensure content doesn't break the UI
function validateContent(content: HomePageContent): HomePageContent {
  const validated = { ...content };

  // Validate hero section
  if (!validated.hero.title || validated.hero.title.length > 100) {
    validated.hero.title = defaultContent.hero.title;
  }
  if (!validated.hero.subtitle || validated.hero.subtitle.length > 300) {
    validated.hero.subtitle = defaultContent.hero.subtitle;
  }

  // Validate trust indicators (must be short)
  Object.keys(validated.trustIndicators).forEach(key => {
    const value = validated.trustIndicators[key as keyof typeof validated.trustIndicators];
    if (!value || value.length > 10) {
      validated.trustIndicators[key as keyof typeof validated.trustIndicators] = 
        defaultContent.trustIndicators[key as keyof typeof defaultContent.trustIndicators];
    }
  });

  // Validate services section
  if (!validated.services.title || validated.services.title.length > 80) {
    validated.services.title = defaultContent.services.title;
  }
  if (!validated.services.subtitle || validated.services.subtitle.length > 250) {
    validated.services.subtitle = defaultContent.services.subtitle;
  }

  // Validate contact section
  if (!validated.contact.title || validated.contact.title.length > 80) {
    validated.contact.title = defaultContent.contact.title;
  }
  if (!validated.contact.subtitle || validated.contact.subtitle.length > 200) {
    validated.contact.subtitle = defaultContent.contact.subtitle;
  }

  // Validate contact info (basic format checks)
  if (!validated.contact.phone || !/^\+?[\d\s\-\(\)]{10,15}$/.test(validated.contact.phone)) {
    validated.contact.phone = defaultContent.contact.phone;
  }
  if (!validated.contact.whatsapp || !/^\+?[\d\s\-\(\)]{10,15}$/.test(validated.contact.whatsapp)) {
    validated.contact.whatsapp = defaultContent.contact.whatsapp;
  }
  if (!validated.contact.email || !/\S+@\S+\.\S+/.test(validated.contact.email)) {
    validated.contact.email = defaultContent.contact.email;
  }

  // Validate address
  if (!validated.contact.address.line1 || validated.contact.address.line1.length > 50) {
    validated.contact.address.line1 = defaultContent.contact.address.line1;
  }
  if (!validated.contact.address.line2 || validated.contact.address.line2.length > 50) {
    validated.contact.address.line2 = defaultContent.contact.address.line2;
  }

  // Validate footer
  if (!validated.footer.description || validated.footer.description.length > 200) {
    validated.footer.description = defaultContent.footer.description;
  }

  return validated;
}

export function useContent() {
  const context = useContext(ContentContext);
  if (context === undefined) {
    throw new Error('useContent must be used within a ContentProvider');
  }
  return context;
}
