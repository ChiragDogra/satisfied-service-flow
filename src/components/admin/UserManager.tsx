import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Label } from '../ui/label';
import { useAdmin } from '../../contexts/AdminContext';
import { UserProfile } from '../../types/UserProfile';
import { ServiceRequest } from '../../contexts/ServiceContext';
import { exportUsersToCSV, downloadCSV } from '../../utils/exportUtils';
import UserDetailView from './UserDetailView';
import { 
  Search, 
  Download, 
  Eye, 
  Edit, 
  Trash2,
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  History,
  BarChart3
} from 'lucide-react';
import { toast } from 'sonner';

const UserManager: React.FC = () => {
  const { users, allServiceRequests, loading, updateUserProfile, deleteUser, getUserServiceHistory } = useAdmin();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isUserDetailOpen, setIsUserDetailOpen] = useState(false);
  const [editFormData, setEditFormData] = useState<UserProfile | null>(null);

  // Filter users based on search
  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (user.phone && user.phone.includes(searchTerm)) ||
      user.uid.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesSearch;
  });

  const handleExportUsers = () => {
    try {
      const csvContent = exportUsersToCSV(filteredUsers);
      const filename = `users-${new Date().toISOString().split('T')[0]}.csv`;
      downloadCSV(csvContent, filename);
      toast.success('Users exported successfully');
    } catch (error) {
      console.error('Export error:', error);
      toast.error('Failed to export users');
    }
  };

  const handleEditUser = (user: UserProfile) => {
    setEditFormData({ ...user });
    setSelectedUser(user);
    setIsEditOpen(true);
  };

  const handleSaveUser = async () => {
    if (!editFormData || !selectedUser) return;

    try {
      await updateUserProfile(selectedUser.uid, {
        name: editFormData.name,
        email: editFormData.email,
        phone: editFormData.phone,
        address: editFormData.address
      });
      toast.success('User profile updated successfully');
      setIsEditOpen(false);
      setEditFormData(null);
    } catch (error) {
      console.error('Error updating user:', error);
      toast.error('Failed to update user profile');
    }
  };

  const handleDeleteUser = async (user: UserProfile) => {
    if (!confirm(`Are you sure you want to delete user ${user.name}? This action cannot be undone.`)) {
      return;
    }

    try {
      await deleteUser(user.uid);
      toast.success('User deleted successfully');
    } catch (error) {
      console.error('Error deleting user:', error);
      toast.error('Failed to delete user');
    }
  };

  const handleOpenUserDetail = (user: UserProfile) => {
    setSelectedUser(user);
    setIsUserDetailOpen(true);
  };

  const formatDate = (timestamp: unknown): string => {
    if (!timestamp) return 'N/A';
    
    try {
      let date: Date;
      
      if (timestamp && typeof timestamp === 'object' && 'toDate' in timestamp) {
        date = (timestamp as any).toDate();
      } else if (typeof timestamp === 'string') {
        date = new Date(timestamp);
      } else if (timestamp instanceof Date) {
        date = timestamp;
      } else {
        return 'N/A';
      }
      
      return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
    } catch {
      return 'N/A';
    }
  };

  const getUserStats = (userId: string) => {
    const userRequests = getUserServiceHistory(userId);
    return {
      total: userRequests.length,
      pending: userRequests.filter(r => r.status === 'Pending').length,
      inProgress: userRequests.filter(r => r.status === 'In Progress').length,
      completed: userRequests.filter(r => r.status === 'Completed').length
    };
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">Loading users...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            User Management
            <Button onClick={handleExportUsers} variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Export CSV
            </Button>
          </CardTitle>
          <CardDescription>
            Manage customer accounts and view their service history
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Search */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by name, email, phone, or user ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </div>

          {/* Results Summary */}
          <div className="mb-4 text-sm text-muted-foreground">
            Showing {filteredUsers.length} of {users.length} users
          </div>

          {/* Users Table */}
          <div className="border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Service Requests</TableHead>
                  <TableHead>Joined</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                      No users found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredUsers.map((user) => {
                    const stats = getUserStats(user.uid);
                    return (
                      <TableRow key={user.uid}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                              <User className="w-4 h-4 text-primary" />
                            </div>
                            <div>
                              <div className="font-medium">{user.name}</div>
                              <div className="text-sm text-muted-foreground font-mono">{user.uid}</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <div className="flex items-center gap-2 text-sm">
                              <Mail className="w-3 h-3 text-muted-foreground" />
                              {user.email}
                            </div>
                            {user.phone && (
                              <div className="flex items-center gap-2 text-sm">
                                <Phone className="w-3 h-3 text-muted-foreground" />
                                {user.phone}
                              </div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Badge variant="outline">{stats.total} Total</Badge>
                            {stats.pending > 0 && <Badge variant="secondary">{stats.pending} Pending</Badge>}
                            {stats.inProgress > 0 && <Badge variant="default">{stats.inProgress} Active</Badge>}
                            {stats.completed > 0 && <Badge variant="outline" className="text-green-600 border-green-600">{stats.completed} Done</Badge>}
                          </div>
                        </TableCell>
                        <TableCell className="text-sm">{formatDate(user.createdAt)}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleOpenUserDetail(user)}
                              title="Detailed Analysis"
                            >
                              <BarChart3 className="w-4 h-4" />
                            </Button>
                            
                            <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
                              <DialogTrigger asChild>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => setSelectedUser(user)}
                                  title="Quick View"
                                >
                                  <Eye className="w-4 h-4" />
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                                <DialogHeader>
                                  <DialogTitle>User Profile & Service History</DialogTitle>
                                  <DialogDescription>
                                    {selectedUser?.name} ({selectedUser?.email})
                                  </DialogDescription>
                                </DialogHeader>
                                {selectedUser && (
                                  <div className="space-y-6">
                                    {/* User Information */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                      <div>
                                        <Label className="text-sm font-medium">Full Name</Label>
                                        <p className="text-sm">{selectedUser.name}</p>
                                      </div>
                                      <div>
                                        <Label className="text-sm font-medium">Email</Label>
                                        <div className="flex items-center gap-2">
                                          <Mail className="w-4 h-4 text-muted-foreground" />
                                          <p className="text-sm">{selectedUser.email}</p>
                                        </div>
                                      </div>
                                      <div>
                                        <Label className="text-sm font-medium">Phone</Label>
                                        <div className="flex items-center gap-2">
                                          <Phone className="w-4 h-4 text-muted-foreground" />
                                          <p className="text-sm">{selectedUser.phone || 'Not provided'}</p>
                                        </div>
                                      </div>
                                      <div>
                                        <Label className="text-sm font-medium">User ID</Label>
                                        <p className="text-sm font-mono">{selectedUser.uid}</p>
                                      </div>
                                    </div>

                                    {selectedUser.address && (
                                      <div>
                                        <Label className="text-sm font-medium">Address</Label>
                                        <div className="flex items-start gap-2 mt-1">
                                          <MapPin className="w-4 h-4 text-muted-foreground mt-0.5" />
                                          <div className="text-sm">
                                            <p>{selectedUser.address.street}</p>
                                            <p>{selectedUser.address.city}, {selectedUser.address.state} {selectedUser.address.zipCode}</p>
                                          </div>
                                        </div>
                                      </div>
                                    )}

                                    {/* Service History */}
                                    <div className="border-t pt-4">
                                      <div className="flex items-center gap-2 mb-4">
                                        <History className="w-5 h-5" />
                                        <h3 className="text-lg font-medium">Service History</h3>
                                      </div>
                                      
                                      {(() => {
                                        const userRequests = getUserServiceHistory(selectedUser.uid);
                                        if (userRequests.length === 0) {
                                          return (
                                            <p className="text-muted-foreground text-center py-4">
                                              No service requests found for this user
                                            </p>
                                          );
                                        }

                                        return (
                                          <div className="space-y-3">
                                            {userRequests.map((request) => (
                                              <div key={request.id} className="border rounded-lg p-4">
                                                <div className="flex items-start justify-between mb-2">
                                                  <div>
                                                    <h4 className="font-medium">{request.serviceType}</h4>
                                                    <p className="text-sm text-muted-foreground">Ticket: {request.id}</p>
                                                  </div>
                                                  <div className="flex items-center gap-2">
                                                    <Badge variant={
                                                      request.status === 'Completed' ? 'outline' :
                                                      request.status === 'In Progress' ? 'default' : 'secondary'
                                                    }>
                                                      {request.status}
                                                    </Badge>
                                                    <Badge variant={
                                                      request.urgency === 'High' ? 'destructive' :
                                                      request.urgency === 'Medium' ? 'default' : 'secondary'
                                                    }>
                                                      {request.urgency}
                                                    </Badge>
                                                  </div>
                                                </div>
                                                <p className="text-sm mb-2">{request.description}</p>
                                                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                                  <span>Created: {formatDate(request.createdAt)}</span>
                                                  <span>Updated: {formatDate(request.updatedAt)}</span>
                                                  <span>Preferred: {request.preferredDate}</span>
                                                </div>
                                              </div>
                                            ))}
                                          </div>
                                        );
                                      })()}
                                    </div>
                                  </div>
                                )}
                              </DialogContent>
                            </Dialog>
                            
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEditUser(user)}
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDeleteUser(user)}
                              className="text-destructive hover:text-destructive"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Edit User Dialog */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit User Profile</DialogTitle>
            <DialogDescription>
              Update user information
            </DialogDescription>
          </DialogHeader>
          {editFormData && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="edit-name">Full Name</Label>
                <Input
                  id="edit-name"
                  value={editFormData.name}
                  onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="edit-email">Email</Label>
                <Input
                  id="edit-email"
                  type="email"
                  value={editFormData.email}
                  onChange={(e) => setEditFormData({ ...editFormData, email: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="edit-phone">Phone</Label>
                <Input
                  id="edit-phone"
                  value={editFormData.phone || ''}
                  onChange={(e) => setEditFormData({ ...editFormData, phone: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="edit-street">Street</Label>
                  <Input
                    id="edit-street"
                    value={editFormData.address?.street || ''}
                    onChange={(e) => setEditFormData({ 
                      ...editFormData, 
                      address: { ...editFormData.address, street: e.target.value } as any
                    })}
                  />
                </div>
                <div>
                  <Label htmlFor="edit-city">City</Label>
                  <Input
                    id="edit-city"
                    value={editFormData.address?.city || ''}
                    onChange={(e) => setEditFormData({ 
                      ...editFormData, 
                      address: { ...editFormData.address, city: e.target.value } as any
                    })}
                  />
                </div>
                <div>
                  <Label htmlFor="edit-state">State</Label>
                  <Input
                    id="edit-state"
                    value={editFormData.address?.state || ''}
                    onChange={(e) => setEditFormData({ 
                      ...editFormData, 
                      address: { ...editFormData.address, state: e.target.value } as any
                    })}
                  />
                </div>
                <div>
                  <Label htmlFor="edit-zip">Zip Code</Label>
                  <Input
                    id="edit-zip"
                    value={editFormData.address?.zipCode || ''}
                    onChange={(e) => setEditFormData({ 
                      ...editFormData, 
                      address: { ...editFormData.address, zipCode: e.target.value } as any
                    })}
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-4">
                <Button variant="outline" onClick={() => setIsEditOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleSaveUser}>
                  Save Changes
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* User Detail Analysis View */}
      {selectedUser && (
        <UserDetailView
          user={selectedUser}
          isOpen={isUserDetailOpen}
          onClose={() => {
            setIsUserDetailOpen(false);
            setSelectedUser(null);
          }}
        />
      )}
    </div>
  );
};

export default UserManager;
