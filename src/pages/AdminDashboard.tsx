import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useService, ServiceRequest } from '@/contexts/ServiceContext';
import { useToast } from '@/hooks/use-toast';
import Header from '@/components/Header';
import {
  Users,
  Clock,
  CheckCircle,
  TrendingUp,
  Filter,
  Download,
  Eye,
  Edit,
  Phone,
  Mail,
  MapPin,
  Calendar
} from 'lucide-react';

export default function AdminDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterService, setFilterService] = useState<string>('all');
  const [selectedRequest, setSelectedRequest] = useState<ServiceRequest | null>(null);
  
  const { requests, updateRequestStatus } = useService();
  const { toast } = useToast();

  // Simple password authentication (in a real app, use proper auth)
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'admin123') {
      setIsAuthenticated(true);
      toast({
        title: "Welcome to Admin Dashboard",
        description: "You have successfully logged in.",
      });
    } else {
      toast({
        title: "Access Denied",
        description: "Invalid password. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleStatusUpdate = (requestId: string, newStatus: ServiceRequest['status']) => {
    updateRequestStatus(requestId, newStatus);
    toast({
      title: "Status Updated",
      description: `Request ${requestId} status changed to ${newStatus}`,
    });
  };

  const filteredRequests = requests.filter(request => {
    const statusMatch = filterStatus === 'all' || request.status === filterStatus;
    const serviceMatch = filterService === 'all' || request.serviceType === filterService;
    return statusMatch && serviceMatch;
  });

  const stats = {
    total: requests.length,
    pending: requests.filter(r => r.status === 'Pending').length,
    inProgress: requests.filter(r => r.status === 'In Progress').length,
    completed: requests.filter(r => r.status === 'Completed').length,
    completionRate: requests.length > 0 ? Math.round((requests.filter(r => r.status === 'Completed').length / requests.length) * 100) : 0
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const StatusBadge = ({ status }: { status: string }) => {
    const variants = {
      'Pending': 'bg-warning/10 text-warning border-warning/20',
      'In Progress': 'bg-primary/10 text-primary border-primary/20',
      'Completed': 'bg-success/10 text-success border-success/20'
    };
    
    return (
      <Badge variant="outline" className={variants[status as keyof typeof variants] || 'bg-muted'}>
        {status}
      </Badge>
    );
  };

  const UrgencyBadge = ({ urgency }: { urgency: string }) => {
    const variants = {
      'Low': 'bg-muted text-muted-foreground',
      'Medium': 'bg-warning/10 text-warning border-warning/20',
      'High': 'bg-destructive/10 text-destructive border-destructive/20'
    };
    
    return (
      <Badge variant="outline" className={variants[urgency as keyof typeof variants] || 'bg-muted'}>
        {urgency}
      </Badge>
    );
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex items-center justify-center min-h-[80vh] px-4">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle className="text-center">Admin Access</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter admin password"
                    required
                  />
                </div>
                <Button type="submit" className="w-full">
                  Login to Admin Dashboard
                </Button>
              </form>
              <div className="mt-4 p-3 bg-muted/50 rounded-lg text-sm text-muted-foreground">
                <p className="font-medium">Demo Access:</p>
                <p>Password: admin123</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="mx-auto max-w-7xl px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-4">Admin Dashboard</h1>
          <p className="text-muted-foreground">
            Manage service requests, update statuses, and monitor business performance.
          </p>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Requests</p>
                  <p className="text-2xl font-bold text-foreground">{stats.total}</p>
                </div>
                <Users className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Pending</p>
                  <p className="text-2xl font-bold text-warning">{stats.pending}</p>
                </div>
                <Clock className="h-8 w-8 text-warning" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Completed</p>
                  <p className="text-2xl font-bold text-success">{stats.completed}</p>
                </div>
                <CheckCircle className="h-8 w-8 text-success" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Success Rate</p>
                  <p className="text-2xl font-bold text-primary">{stats.completionRate}%</p>
                </div>
                <TrendingUp className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Actions */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
              <div className="flex gap-4 flex-wrap">
                <div className="flex items-center gap-2">
                  <Filter className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Filters:</span>
                </div>
                
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="w-[140px]">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="Pending">Pending</SelectItem>
                    <SelectItem value="In Progress">In Progress</SelectItem>
                    <SelectItem value="Completed">Completed</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={filterService} onValueChange={setFilterService}>
                  <SelectTrigger className="w-[160px]">
                    <SelectValue placeholder="Service Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Services</SelectItem>
                    <SelectItem value="Computer Repair">Computer Repair</SelectItem>
                    <SelectItem value="Printer Repair">Printer Repair</SelectItem>
                    <SelectItem value="CCTV Repair">CCTV Repair</SelectItem>
                    <SelectItem value="Networking">Networking</SelectItem>
                    <SelectItem value="Other Services">Other Services</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Export Data
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Service Requests Table */}
        <Card>
          <CardHeader>
            <CardTitle>Service Requests ({filteredRequests.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredRequests.length > 0 ? (
                filteredRequests.map((request) => (
                  <div key={request.id} className="border rounded-lg p-4 hover:bg-muted/30 transition-colors">
                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 items-start">
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <span className="font-semibold">#{request.id}</span>
                          <StatusBadge status={request.status} />
                          <UrgencyBadge urgency={request.urgency} />
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {request.serviceType}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Created: {formatDate(request.createdAt)}
                        </p>
                      </div>

                      <div>
                        <p className="font-medium">{request.customerName}</p>
                        <div className="text-sm text-muted-foreground space-y-1">
                          <div className="flex items-center gap-1">
                            <Mail className="h-3 w-3" />
                            <span>{request.email}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Phone className="h-3 w-3" />
                            <span>{request.phone}</span>
                          </div>
                        </div>
                      </div>

                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Description:</p>
                        <p className="text-sm line-clamp-2">{request.description}</p>
                        {request.preferredDate && (
                          <div className="flex items-center gap-1 mt-2 text-sm text-muted-foreground">
                            <Calendar className="h-3 w-3" />
                            <span>Preferred: {new Date(request.preferredDate).toLocaleDateString()}</span>
                          </div>
                        )}
                      </div>

                      <div className="flex flex-col gap-2">
                        <Select
                          value={request.status}
                          onValueChange={(newStatus) => handleStatusUpdate(request.id, newStatus as ServiceRequest['status'])}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Pending">Pending</SelectItem>
                            <SelectItem value="In Progress">In Progress</SelectItem>
                            <SelectItem value="Completed">Completed</SelectItem>
                          </SelectContent>
                        </Select>

                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setSelectedRequest(request)}
                            >
                              <Eye className="h-4 w-4 mr-2" />
                              View Details
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl">
                            <DialogHeader>
                              <DialogTitle>Service Request Details - #{selectedRequest?.id}</DialogTitle>
                            </DialogHeader>
                            {selectedRequest && (
                              <div className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                  <div>
                                    <h4 className="font-semibold mb-3">Customer Information</h4>
                                    <div className="space-y-2 text-sm">
                                      <p><span className="text-muted-foreground">Name:</span> {selectedRequest.customerName}</p>
                                      <p><span className="text-muted-foreground">Email:</span> {selectedRequest.email}</p>
                                      <p><span className="text-muted-foreground">Phone:</span> {selectedRequest.phone}</p>
                                      <div>
                                        <span className="text-muted-foreground">Address:</span>
                                        <p className="mt-1">{selectedRequest.address}</p>
                                      </div>
                                    </div>
                                  </div>

                                  <div>
                                    <h4 className="font-semibold mb-3">Service Details</h4>
                                    <div className="space-y-2 text-sm">
                                      <p><span className="text-muted-foreground">Service Type:</span> {selectedRequest.serviceType}</p>
                                      <p><span className="text-muted-foreground">Urgency:</span> {selectedRequest.urgency}</p>
                                      <p><span className="text-muted-foreground">Preferred Date:</span> {new Date(selectedRequest.preferredDate).toLocaleDateString()}</p>
                                      <p><span className="text-muted-foreground">Status:</span> {selectedRequest.status}</p>
                                    </div>
                                  </div>
                                </div>

                                <div>
                                  <h4 className="font-semibold mb-2">Problem Description</h4>
                                  <p className="text-sm bg-muted/50 rounded-lg p-3">{selectedRequest.description}</p>
                                </div>

                                {selectedRequest.customService && (
                                  <div>
                                    <h4 className="font-semibold mb-2">Custom Service Details</h4>
                                    <p className="text-sm bg-muted/50 rounded-lg p-3">{selectedRequest.customService}</p>
                                  </div>
                                )}

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                  <div>
                                    <span className="text-muted-foreground">Created:</span>
                                    <p>{formatDate(selectedRequest.createdAt)}</p>
                                  </div>
                                  <div>
                                    <span className="text-muted-foreground">Last Updated:</span>
                                    <p>{formatDate(selectedRequest.updatedAt)}</p>
                                  </div>
                                </div>

                                <div className="flex gap-3 pt-4">
                                  <Button variant="outline" className="flex-1">
                                    <Download className="h-4 w-4 mr-2" />
                                    Download Customer Data
                                  </Button>
                                  <Button asChild className="flex-1">
                                    <a href={`tel:${selectedRequest.phone}`}>
                                      <Phone className="h-4 w-4 mr-2" />
                                      Call Customer
                                    </a>
                                  </Button>
                                </div>
                              </div>
                            )}
                          </DialogContent>
                        </Dialog>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-12">
                  <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No Service Requests Found</h3>
                  <p className="text-muted-foreground">
                    {filterStatus !== 'all' || filterService !== 'all' 
                      ? 'Try adjusting your filters to see more results.'
                      : 'No service requests have been submitted yet.'}
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}