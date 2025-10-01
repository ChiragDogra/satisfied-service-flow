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
      <DialogContent className="max-w-7xl max-h-[95vh] overflow-hidden flex flex-col p-0">
        <DialogHeader className="px-4 sm:px-6 py-4 sm:py-6 border-b sticky top-0 bg-background z-10">
          <DialogTitle className="flex items-center gap-2 text-lg sm:text-xl">
            <User className="w-5 h-5 sm:w-6 sm:h-6" />
            <span className="truncate">{user.name}</span>
          </DialogTitle>
          <DialogDescription className="text-xs sm:text-sm">
            Comprehensive user profile and service request analytics
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 sm:space-y-6 overflow-y-auto px-4 sm:px-6 py-4 sm:py-6">
          {/* User Information Card */}
          <Card className="animate-fade-in">
            <CardHeader className="pb-3">
              <CardTitle className="text-base sm:text-lg flex items-center gap-2">
                <User className="w-4 h-4" />
                User Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                <div className="space-y-1.5 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
                  <Label className="text-xs font-medium text-muted-foreground">Full Name</Label>
                  <div className="flex items-center gap-2">
                    <User className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0" />
                    <p className="text-sm font-medium truncate">{user.name}</p>
                  </div>
                </div>
                <div className="space-y-1.5 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
                  <Label className="text-xs font-medium text-muted-foreground">Email</Label>
                  <div className="flex items-center gap-2">
                    <Mail className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0" />
                    <p className="text-sm truncate">{user.email}</p>
                  </div>
                </div>
                <div className="space-y-1.5 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
                  <Label className="text-xs font-medium text-muted-foreground">Phone</Label>
                  <div className="flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0" />
                    <p className="text-sm truncate">{user.phone || 'Not provided'}</p>
                  </div>
                </div>
                <div className="space-y-1.5 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors sm:col-span-2 lg:col-span-1">
                  <Label className="text-xs font-medium text-muted-foreground">User ID</Label>
                  <p className="text-xs font-mono bg-background px-2 py-1 rounded border truncate">{user.uid}</p>
                </div>
                <div className="space-y-1.5 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
                  <Label className="text-xs font-medium text-muted-foreground">Member Since</Label>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0" />
                    <p className="text-sm truncate">{formatDate(user.createdAt)}</p>
                  </div>
                </div>
                {user.address && (
                  <div className="space-y-1.5 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors sm:col-span-2 lg:col-span-1">
                    <Label className="text-xs font-medium text-muted-foreground">Address</Label>
                    <div className="flex items-start gap-2">
                      <MapPin className="w-3.5 h-3.5 text-muted-foreground mt-0.5 flex-shrink-0" />
                      <div className="text-sm min-w-0">
                        <p className="truncate">{user.address.street}</p>
                        <p className="truncate">{user.address.city}, {user.address.state} {user.address.zipCode}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Service Requests Analysis */}
          <Card className="animate-fade-in">
            <CardHeader className="pb-3 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                <div className="space-y-1">
                  <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                    <FileText className="w-4 h-4 sm:w-5 sm:h-5" />
                    Service Requests Analytics
                  </CardTitle>
                  <CardDescription className="text-xs sm:text-sm">
                    View and export by time period
                  </CardDescription>
                </div>
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                  <Select value={selectedPeriod} onValueChange={(value: 'thisMonth' | 'thisYear' | 'all') => setSelectedPeriod(value)}>
                    <SelectTrigger className="w-full sm:w-36">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="thisMonth">This Month</SelectItem>
                      <SelectItem value="thisYear">This Year</SelectItem>
                      <SelectItem value="all">All Time</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button onClick={handleExportUserData} variant="outline" size="sm" className="w-full sm:w-auto">
                    <Download className="w-4 h-4 mr-2" />
                    <span className="sm:inline">Export</span>
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Statistics Overview */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100/50 dark:from-blue-950/30 dark:to-blue-900/20 p-3 sm:p-4 rounded-lg border border-blue-200/50 dark:border-blue-800/50 hover:scale-105 transition-transform">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
                    <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                    <div className="min-w-0">
                      <p className="text-xl sm:text-2xl font-bold text-blue-600 dark:text-blue-400 tabular-nums">{stats.total}</p>
                      <p className="text-xs text-muted-foreground truncate">Total</p>
                    </div>
                  </div>
                </div>
                <div className="bg-gradient-to-br from-yellow-50 to-yellow-100/50 dark:from-yellow-950/30 dark:to-yellow-900/20 p-3 sm:p-4 rounded-lg border border-yellow-200/50 dark:border-yellow-800/50 hover:scale-105 transition-transform">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
                    <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-600 dark:text-yellow-400 flex-shrink-0" />
                    <div className="min-w-0">
                      <p className="text-xl sm:text-2xl font-bold text-yellow-600 dark:text-yellow-400 tabular-nums">{stats.pending}</p>
                      <p className="text-xs text-muted-foreground truncate">Pending</p>
                    </div>
                  </div>
                </div>
                <div className="bg-gradient-to-br from-orange-50 to-orange-100/50 dark:from-orange-950/30 dark:to-orange-900/20 p-3 sm:p-4 rounded-lg border border-orange-200/50 dark:border-orange-800/50 hover:scale-105 transition-transform">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
                    <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 text-orange-600 dark:text-orange-400 flex-shrink-0" />
                    <div className="min-w-0">
                      <p className="text-xl sm:text-2xl font-bold text-orange-600 dark:text-orange-400 tabular-nums">{stats.inProgress}</p>
                      <p className="text-xs text-muted-foreground truncate">In Progress</p>
                    </div>
                  </div>
                </div>
                <div className="bg-gradient-to-br from-green-50 to-green-100/50 dark:from-green-950/30 dark:to-green-900/20 p-3 sm:p-4 rounded-lg border border-green-200/50 dark:border-green-800/50 hover:scale-105 transition-transform">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
                    <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-600 dark:text-green-400 flex-shrink-0" />
                    <div className="min-w-0">
                      <p className="text-xl sm:text-2xl font-bold text-green-600 dark:text-green-400 tabular-nums">{stats.completed}</p>
                      <p className="text-xs text-muted-foreground truncate">Completed</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Period Info */}
              <div className="p-3 bg-muted/50 rounded-lg border">
                <p className="text-xs sm:text-sm">
                  <span className="font-medium">Showing:</span> {stats.total} requests for <span className="font-semibold">{getPeriodLabel()}</span>
                  {filteredRequests.length === 0 && (
                    <span className="text-muted-foreground"> - No requests found</span>
                  )}
                </p>
              </div>

              {/* Service Requests Table */}
              {filteredRequests.length > 0 ? (
                <div className="border rounded-lg overflow-hidden">
                  {/* Mobile Cards View */}
                  <div className="block lg:hidden divide-y">
                    {filteredRequests.map((request) => (
                      <div key={request.id} className="p-4 space-y-3 hover:bg-muted/50 transition-colors">
                        <div className="flex items-start justify-between gap-2">
                          <div className="space-y-1 min-w-0 flex-1">
                            <p className="text-xs text-muted-foreground">Ticket ID</p>
                            <p className="font-mono text-sm truncate">{request.id}</p>
                          </div>
                          <Badge variant={
                            request.status === 'Completed' ? 'outline' :
                            request.status === 'In Progress' ? 'default' : 'secondary'
                          } className="flex-shrink-0">
                            {request.status}
                          </Badge>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <div className="space-y-1">
                            <p className="text-xs text-muted-foreground">Service Type</p>
                            <p className="text-sm font-medium truncate">{request.serviceType}</p>
                          </div>
                          <div className="space-y-1">
                            <p className="text-xs text-muted-foreground">Urgency</p>
                            <Badge variant={
                              request.urgency === 'High' ? 'destructive' :
                              request.urgency === 'Medium' ? 'default' : 'secondary'
                            } className="w-fit">
                              {request.urgency}
                            </Badge>
                          </div>
                        </div>
                        <div className="space-y-1">
                          <p className="text-xs text-muted-foreground">Description</p>
                          <p className="text-sm line-clamp-2">{request.description}</p>
                        </div>
                        <div className="grid grid-cols-2 gap-3 text-xs">
                          <div className="space-y-1">
                            <p className="text-muted-foreground">Created</p>
                            <p className="truncate">{formatDate(request.createdAt)}</p>
                          </div>
                          <div className="space-y-1">
                            <p className="text-muted-foreground">Preferred Date</p>
                            <p className="truncate">{request.preferredDate}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Desktop Table View */}
                  <div className="hidden lg:block overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-32">Ticket ID</TableHead>
                          <TableHead className="w-40">Service Type</TableHead>
                          <TableHead className="min-w-[200px]">Description</TableHead>
                          <TableHead className="w-32">Status</TableHead>
                          <TableHead className="w-28">Urgency</TableHead>
                          <TableHead className="w-40">Created</TableHead>
                          <TableHead className="w-32">Preferred Date</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredRequests.map((request) => (
                          <TableRow key={request.id} className="hover:bg-muted/50">
                            <TableCell className="font-mono text-xs">{request.id}</TableCell>
                            <TableCell className="font-medium text-sm">{request.serviceType}</TableCell>
                            <TableCell className="max-w-xs">
                              <div className="truncate text-sm" title={request.description}>
                                {request.description}
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge variant={
                                request.status === 'Completed' ? 'outline' :
                                request.status === 'In Progress' ? 'default' : 'secondary'
                              } className="text-xs">
                                {request.status}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <Badge variant={
                                request.urgency === 'High' ? 'destructive' :
                                request.urgency === 'Medium' ? 'default' : 'secondary'
                              } className="text-xs">
                                {request.urgency}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-xs">{formatDate(request.createdAt)}</TableCell>
                            <TableCell className="text-xs">{request.preferredDate}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12 text-muted-foreground">
                  <FileText className="w-12 h-12 mx-auto mb-4 opacity-30" />
                  <p className="text-sm">No service requests found for {getPeriodLabel().toLowerCase()}</p>
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
