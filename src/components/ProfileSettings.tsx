import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Save, 
  Loader2,
  X
} from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '../contexts/AuthContext';

interface ProfileSettingsProps {
  isOpen: boolean;
  onClose: () => void;
}

interface ProfileFormData {
  name: string;
  email: string;
  phone: string;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
  };
}

const ProfileSettings: React.FC<ProfileSettingsProps> = ({ isOpen, onClose }) => {
  const { user, userProfile, updateUserProfile } = useAuth();
  const [formData, setFormData] = useState<ProfileFormData>({
    name: '',
    email: '',
    phone: '',
    address: {
      street: '',
      city: '',
      state: '',
      zipCode: ''
    }
  });
  const [isLoading, setIsLoading] = useState(false);

  // Initialize form data when dialog opens or user profile changes
  useEffect(() => {
    if (isOpen && (user || userProfile)) {
      setFormData({
        name: userProfile?.name || user?.displayName || '',
        email: userProfile?.email || user?.email || '',
        phone: userProfile?.phone || '',
        address: {
          street: userProfile?.address?.street || '',
          city: userProfile?.address?.city || '',
          state: userProfile?.address?.state || '',
          zipCode: userProfile?.address?.zipCode || ''
        }
      });
    }
  }, [isOpen, user, userProfile]);

  const handleInputChange = (field: string, value: string) => {
    if (field.startsWith('address.')) {
      const fieldParts = field.split('.');
      if (fieldParts.length < 2) {
        console.error('Invalid address field format:', field);
        return;
      }
      const addressField = fieldParts[1];
      setFormData(prev => ({
        ...prev,
        address: {
          ...prev.address,
          [addressField]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  const handleSave = async () => {
    if (!user?.uid) {
      toast.error('User not authenticated');
      return;
    }

    if (!formData.name.trim()) {
      toast.error('Name is required');
      return;
    }

    if (!formData.email.trim()) {
      toast.error('Email is required');
      return;
    }

    setIsLoading(true);
    try {
      const updatedProfile = {
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        address: {
          street: formData.address.street.trim(),
          city: formData.address.city.trim(),
          state: formData.address.state.trim(),
          zipCode: formData.address.zipCode.trim()
        },
        updatedAt: new Date()
      };

      await updateUserProfile(updatedProfile);
      toast.success('Profile updated successfully!');
      onClose();
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    // Reset form data to original values
    if (user || userProfile) {
      setFormData({
        name: userProfile?.name || user?.displayName || '',
        email: userProfile?.email || user?.email || '',
        phone: userProfile?.phone || '',
        address: {
          street: userProfile?.address?.street || '',
          city: userProfile?.address?.city || '',
          state: userProfile?.address?.state || '',
          zipCode: userProfile?.address?.zipCode || ''
        }
      });
    }
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div className="flex-1 min-w-0">
              <DialogTitle className="flex items-center gap-2">
                <User className="w-5 h-5" />
                Profile Settings
              </DialogTitle>
              <DialogDescription>
                Update your personal information and contact details
              </DialogDescription>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="h-8 w-8 p-0 rounded-full hover:bg-muted flex-shrink-0 ml-2"
              title="Close"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Personal Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <User className="w-4 h-4" />
                Personal Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Full Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    placeholder="Enter your full name"
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email Address *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    placeholder="Enter your email"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  placeholder="Enter your phone number"
                />
              </div>
            </CardContent>
          </Card>

          {/* Address Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                Address Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="street">Street Address</Label>
                <Input
                  id="street"
                  value={formData.address.street}
                  onChange={(e) => handleInputChange('address.street', e.target.value)}
                  placeholder="Enter your street address"
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    value={formData.address.city}
                    onChange={(e) => handleInputChange('address.city', e.target.value)}
                    placeholder="City"
                  />
                </div>
                <div>
                  <Label htmlFor="state">State</Label>
                  <Input
                    id="state"
                    value={formData.address.state}
                    onChange={(e) => handleInputChange('address.state', e.target.value)}
                    placeholder="State"
                  />
                </div>
                <div>
                  <Label htmlFor="zipCode">ZIP Code</Label>
                  <Input
                    id="zipCode"
                    value={formData.address.zipCode}
                    onChange={(e) => handleInputChange('address.zipCode', e.target.value)}
                    placeholder="ZIP Code"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <Button 
              onClick={handleSave} 
              disabled={isLoading}
              className="flex-1 sm:flex-none"
            >
              <Save className="w-4 h-4 mr-2" />
              {isLoading ? 'Saving...' : 'Save Changes'}
            </Button>
            <Button 
              variant="outline" 
              onClick={handleCancel}
              disabled={isLoading}
              className="flex-1 sm:flex-none"
            >
              <X className="w-4 h-4 mr-2" />
              Cancel
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProfileSettings;
