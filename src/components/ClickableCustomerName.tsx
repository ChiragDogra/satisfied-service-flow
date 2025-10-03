import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Label } from './ui/label';
import { useAdmin } from '../contexts/AdminContext';
import { UserProfile } from '../types/UserProfile';
import { ServiceRequest } from '../contexts/ServiceContext';
import UserDetailView from './admin/UserDetailView';
import ClickableContact from './ClickableContact';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  FileText,
  BarChart3,
  X
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface ClickableCustomerNameProps {
  customerName: string;
  email?: string;
  className?: string;
  showIcon?: boolean;
}

const ClickableCustomerName: React.FC<ClickableCustomerNameProps> = ({
  customerName,
  email,
  className = '',
  showIcon = false
}) => {
  const { users, getUserServiceHistory } = useAdmin();
  const [isOpen, setIsOpen] = useState(false);
  const [isDetailViewOpen, setIsDetailViewOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null);

  // Find user by name or email
  const findUser = () => {
    if (email) {
      return users.find(user => user.email.toLowerCase() === email.toLowerCase());
    }
    return users.find(user => user.name.toLowerCase() === customerName.toLowerCase());
  };

  const handleClick = () => {
    const user = findUser();
    if (user) {
      setSelectedUser(user);
      setIsOpen(true);
    }
  };

  const handleViewDetails = () => {
    if (selectedUser) {
      setIsOpen(false);
      setIsDetailViewOpen(true);
    }
  };

  const user = findUser();
  
  if (!user) {
    // If user not found, just show the name without clickability
    return (
      <span className={cn('text-foreground', className)}>
        {showIcon && <User className="w-4 h-4 inline mr-1" />}
        {customerName}
      </span>
    );
  }

  const userRequests = getUserServiceHistory(user.uid);
  const stats = {
    total: userRequests.length,
    pending: userRequests.filter(r => r.status === 'Pending').length,
    inProgress: userRequests.filter(r => r.status === 'In Progress').length,
    completed: userRequests.filter(r => r.status === 'Completed').length
  };

  return (
    <>
      <button
        onClick={handleClick}
        className={cn(
          'inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 hover:underline transition-colors duration-200 cursor-pointer',
          className
        )}
        title={`View ${customerName}'s profile and service history`}
      >
        {showIcon && <User className="w-4 h-4" />}
        <span>{customerName}</span>
      </button>

      {/* Quick Profile Dialog */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <DialogTitle className="flex items-center gap-2">
                <User className="w-5 h-5" />
                Customer Profile
              </DialogTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsOpen(false)}
                className="h-8 w-8 p-0 rounded-full hover:bg-muted flex-shrink-0"
                title="Close"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </DialogHeader>
          
          {selectedUser && (
            <div className="space-y-4">
              {/* Basic Info */}
              <div className="space-y-3">
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Name</Label>
                  <p className="text-sm font-medium">{selectedUser.name}</p>
                </div>
                
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Email</Label>
                  <div className="text-sm">
                    <ClickableContact type="email" value={selectedUser.email} iconSize={12} />
                  </div>
                </div>
                
                {selectedUser.phone && (
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Phone</Label>
                    <div className="text-sm">
                      <ClickableContact type="phone" value={selectedUser.phone} iconSize={12} />
                    </div>
                  </div>
                )}
                
                {selectedUser.address && (
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Address</Label>
                    <div className="flex items-start gap-2 text-sm">
                      <MapPin className="w-3 h-3 mt-0.5 text-muted-foreground flex-shrink-0" />
                      <div className="text-muted-foreground">
                        {selectedUser.address.street && <div>{selectedUser.address.street}</div>}
                        <div>
                          {[selectedUser.address.city, selectedUser.address.state, selectedUser.address.zipCode]
                            .filter(Boolean)
                            .join(', ')}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Service Statistics */}
              <div className="border-t pt-4">
                <Label className="text-sm font-medium text-muted-foreground mb-2 block">Service History</Label>
                <div className="grid grid-cols-2 gap-2">
                  <div className="text-center p-2 bg-muted/50 rounded">
                    <div className="text-lg font-bold text-foreground">{stats.total}</div>
                    <div className="text-xs text-muted-foreground">Total</div>
                  </div>
                  <div className="text-center p-2 bg-muted/50 rounded">
                    <div className="text-lg font-bold text-green-600">{stats.completed}</div>
                    <div className="text-xs text-muted-foreground">Completed</div>
                  </div>
                </div>
                {(stats.pending > 0 || stats.inProgress > 0) && (
                  <div className="flex gap-2 mt-2">
                    {stats.pending > 0 && (
                      <Badge variant="outline" className="text-xs">
                        {stats.pending} Pending
                      </Badge>
                    )}
                    {stats.inProgress > 0 && (
                      <Badge variant="secondary" className="text-xs">
                        {stats.inProgress} Active
                      </Badge>
                    )}
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex gap-2 pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleViewDetails}
                  className="flex-1"
                >
                  <BarChart3 className="w-4 h-4 mr-2" />
                  View Details
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Detailed User View */}
      {selectedUser && (
        <UserDetailView
          user={selectedUser}
          isOpen={isDetailViewOpen}
          onClose={() => setIsDetailViewOpen(false)}
        />
      )}
    </>
  );
};

export default ClickableCustomerName;
