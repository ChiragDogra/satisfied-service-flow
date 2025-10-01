import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../ui/dialog';
import { Label } from '../ui/label';
import { useAdmin } from '../../contexts/AdminContext';
import { UserProfile } from '../../types/UserProfile';
import { ServiceRequest } from '../../contexts/ServiceContext';
import { exportUserServiceRequestsToCSV, downloadCSV } from '../../utils/exportUtils';
import { 
  Download, 
  Calendar,
  User,
  Mail,
  Phone,
  MapPin,
  FileText,
  TrendingUp,
  Clock,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { toast } from 'sonner';

interface UserDetailViewProps {
  user: UserProfile;
  isOpen: boolean;
  onClose: () => void;
}

const UserDetailView: React.FC<UserDetailViewProps> = ({ user, isOpen, onClose }) => {
  const { getUserServiceHistoryByPeriod } = useAdmin();
  const [selectedPeriod, setSelectedPeriod] = useState<'thisMonth' | 'thisYear' | 'all'>('all');

  // Get filtered service requests based on selected period
  const filteredRequests = getUserServiceHistoryByPeriod(user.uid, selectedPeriod);

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

  const getRequestStats = (requests: ServiceRequest[]) => {
    return {
      total: requests.length,
      pending: requests.filter(r => r.status === 'Pending').length,
      inProgress: requests.filter(r => r.status === 'In Progress').length,
      completed: requests.filter(r => r.status === 'Completed').length
    };
  };

  const handleExportUserData = () => {
    try {
      const periodLabel = selectedPeriod === 'thisMonth' ? 'This Month' : 
                         selectedPeriod === 'thisYear' ? 'This Year' : 'All Time';
      
      const csvContent = exportUserServiceRequestsToCSV(user, filteredRequests, periodLabel);
      const filename = `${user.name.replace(/\s+/g, '_')}_service_requests_${selectedPeriod}_${new Date().toISOString().split('T')[0]}.csv`;
      downloadCSV(csvContent, filename);
      toast.success(`User data exported successfully for ${periodLabel.toLowerCase()}`);
    } catch (error) {
      console.error('Export error:', error);
      toast.error('Failed to export user data');
    }
  };

  const getPeriodLabel = () => {
    switch (selectedPeriod) {
      case 'thisMonth': return 'This Month';
      case 'thisYear': return 'This Year';
      default: return 'All Time';
    }
  };

  const stats = getRequestStats(filteredRequests);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="w-5 h-5" />
            User Detail Analysis - {user.name}
          </DialogTitle>
          <DialogDescription>
            Comprehensive view of user profile and service request history
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* User Information Card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">User Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-muted-foreground">Full Name</Label>
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-muted-foreground" />
                    <p className="text-sm font-medium">{user.name}</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-muted-foreground">Email</Label>
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-muted-foreground" />
                    <p className="text-sm">{user.email}</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-muted-foreground">Phone</Label>
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-muted-foreground" />
                    <p className="text-sm">{user.phone || 'Not provided'}</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-muted-foreground">User ID</Label>
                  <p className="text-sm font-mono bg-muted px-2 py-1 rounded">{user.uid}</p>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-muted-foreground">Member Since</Label>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    <p className="text-sm">{formatDate(user.createdAt)}</p>
                  </div>
                </div>
                {user.address && (
                  <div className="space-y-2 md:col-span-2 lg:col-span-1">
                    <Label className="text-sm font-medium text-muted-foreground">Address</Label>
                    <div className="flex items-start gap-2">
                      <MapPin className="w-4 h-4 text-muted-foreground mt-0.5" />
                      <div className="text-sm">
                        <p>{user.address.street}</p>
                        <p>{user.address.city}, {user.address.state} {user.address.zipCode}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Service Requests Analysis */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="w-5 h-5" />
                    Service Requests Analysis
                  </CardTitle>
                  <CardDescription>
                    View and export service requests by time period
                  </CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <Select value={selectedPeriod} onValueChange={(value: 'thisMonth' | 'thisYear' | 'all') => setSelectedPeriod(value)}>
                    <SelectTrigger className="w-40">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="thisMonth">This Month</SelectItem>
                      <SelectItem value="thisYear">This Year</SelectItem>
                      <SelectItem value="all">All Time</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button onClick={handleExportUserData} variant="outline" size="sm">
                    <Download className="w-4 h-4 mr-2" />
                    Export Excel
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {/* Statistics Overview */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-blue-50 dark:bg-blue-950/20 p-4 rounded-lg">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-blue-600" />
                    <div>
                      <p className="text-2xl font-bold text-blue-600">{stats.total}</p>
                      <p className="text-sm text-muted-foreground">Total Requests</p>
                    </div>
                  </div>
                </div>
                <div className="bg-yellow-50 dark:bg-yellow-950/20 p-4 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Clock className="w-5 h-5 text-yellow-600" />
                    <div>
                      <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
                      <p className="text-sm text-muted-foreground">Pending</p>
                    </div>
                  </div>
                </div>
                <div className="bg-orange-50 dark:bg-orange-950/20 p-4 rounded-lg">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="w-5 h-5 text-orange-600" />
                    <div>
                      <p className="text-2xl font-bold text-orange-600">{stats.inProgress}</p>
                      <p className="text-sm text-muted-foreground">In Progress</p>
                    </div>
                  </div>
                </div>
                <div className="bg-green-50 dark:bg-green-950/20 p-4 rounded-lg">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <div>
                      <p className="text-2xl font-bold text-green-600">{stats.completed}</p>
                      <p className="text-sm text-muted-foreground">Completed</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Period Info */}
              <div className="mb-4 p-3 bg-muted rounded-lg">
                <p className="text-sm">
                  <strong>Showing:</strong> {stats.total} service requests for <strong>{getPeriodLabel()}</strong>
                  {filteredRequests.length === 0 && (
                    <span className="text-muted-foreground"> - No requests found for this period</span>
                  )}
                </p>
              </div>

              {/* Service Requests Table */}
              {filteredRequests.length > 0 ? (
                <div className="border rounded-lg overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Ticket ID</TableHead>
                        <TableHead>Service Type</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Urgency</TableHead>
                        <TableHead>Created</TableHead>
                        <TableHead>Preferred Date</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredRequests.map((request) => (
                        <TableRow key={request.id}>
                          <TableCell className="font-mono text-sm">{request.id}</TableCell>
                          <TableCell className="font-medium">{request.serviceType}</TableCell>
                          <TableCell className="max-w-xs">
                            <div className="truncate" title={request.description}>
                              {request.description}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant={
                              request.status === 'Completed' ? 'outline' :
                              request.status === 'In Progress' ? 'default' : 'secondary'
                            }>
                              {request.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge variant={
                              request.urgency === 'High' ? 'destructive' :
                              request.urgency === 'Medium' ? 'default' : 'secondary'
                            }>
                              {request.urgency}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-sm">{formatDate(request.createdAt)}</TableCell>
                          <TableCell className="text-sm">{request.preferredDate}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No service requests found for {getPeriodLabel().toLowerCase()}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default UserDetailView;
