import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { useService } from '../../contexts/ServiceContext';
import { useAdmin } from '../../contexts/AdminContext';
import { ServiceRequest } from '../../contexts/ServiceContext';
import { exportServiceRequestsToCSV, downloadCSV } from '../../utils/exportUtils';
import EstimateEditor from './EstimateEditor';
import { 
  Search, 
  Filter, 
  Download, 
  Eye, 
  Edit, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  Calendar,
  Phone,
  Mail,
  MapPin,
  Calculator
} from 'lucide-react';
import { toast } from 'sonner';

const ServiceRequestsManager: React.FC = () => {
  const { updateRequestStatus } = useService();
  const { allServiceRequests, loading } = useAdmin();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [serviceTypeFilter, setServiceTypeFilter] = useState<string>('all');
  const [selectedRequest, setSelectedRequest] = useState<ServiceRequest | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isEstimateEditorOpen, setIsEstimateEditorOpen] = useState(false);
  const [estimateRequest, setEstimateRequest] = useState<ServiceRequest | null>(null);

  // Filter requests based on search and filters
  const filteredRequests = allServiceRequests.filter(request => {
    const matchesSearch = 
      request.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.phone.includes(searchTerm) ||
      request.id.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || request.status === statusFilter;
    const matchesServiceType = serviceTypeFilter === 'all' || request.serviceType === serviceTypeFilter;
    
    return matchesSearch && matchesStatus && matchesServiceType;
  });

  const handleStatusUpdate = async (requestId: string, newStatus: ServiceRequest['status']) => {
    try {
      await updateRequestStatus(requestId, newStatus);
      toast.success(`Request status updated to ${newStatus}`);
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error('Failed to update request status');
    }
  };

  const handleExportRequests = () => {
    try {
      const csvContent = exportServiceRequestsToCSV(filteredRequests);
      const filename = `service-requests-${new Date().toISOString().split('T')[0]}.csv`;
      downloadCSV(csvContent, filename);
      toast.success('Service requests exported successfully');
    } catch (error) {
      console.error('Export error:', error);
      toast.error('Failed to export service requests');
    }
  };

  const handleEditEstimates = (request: ServiceRequest) => {
    setEstimateRequest(request);
    setIsEstimateEditorOpen(true);
  };

  const getStatusBadge = (status: ServiceRequest['status']) => {
    switch (status) {
      case 'Pending':
        return <Badge variant="secondary"><Clock className="w-3 h-3 mr-1" />Pending</Badge>;
      case 'In Progress':
        return <Badge variant="default"><AlertCircle className="w-3 h-3 mr-1" />In Progress</Badge>;
      case 'Completed':
        return <Badge variant="outline" className="text-green-600 border-green-600"><CheckCircle className="w-3 h-3 mr-1" />Completed</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getUrgencyBadge = (urgency: ServiceRequest['urgency']) => {
    switch (urgency) {
      case 'High':
        return <Badge variant="destructive">High</Badge>;
      case 'Medium':
        return <Badge variant="default">Medium</Badge>;
      case 'Low':
        return <Badge variant="secondary">Low</Badge>;
      default:
        return <Badge variant="secondary">{urgency}</Badge>;
    }
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

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">Loading service requests...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Service Requests Management
            <Button onClick={handleExportRequests} variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Export CSV
            </Button>
          </CardTitle>
          <CardDescription>
            Manage all customer service requests and update their status
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by name, email, phone, or ticket ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="Pending">Pending</SelectItem>
                <SelectItem value="In Progress">In Progress</SelectItem>
                <SelectItem value="Completed">Completed</SelectItem>
              </SelectContent>
            </Select>
            <Select value={serviceTypeFilter} onValueChange={setServiceTypeFilter}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Filter by service" />
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

          {/* Results Summary */}
          <div className="mb-4 text-sm text-muted-foreground">
            Showing {filteredRequests.length} of {allServiceRequests.length} requests
          </div>

          {/* Requests Table */}
          <div className="border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Ticket ID</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Service Type</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Urgency</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRequests.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                      No service requests found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredRequests.map((request) => (
                    <TableRow key={request.id}>
                      <TableCell className="font-mono text-sm">{request.id}</TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{request.customerName}</div>
                          <div className="text-sm text-muted-foreground">{request.email}</div>
                        </div>
                      </TableCell>
                      <TableCell>{request.serviceType}</TableCell>
                      <TableCell>{getStatusBadge(request.status)}</TableCell>
                      <TableCell>{getUrgencyBadge(request.urgency)}</TableCell>
                      <TableCell className="text-sm">{formatDate(request.createdAt)}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
                            <DialogTrigger asChild>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setSelectedRequest(request)}
                              >
                                <Eye className="w-4 h-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                              <DialogHeader>
                                <DialogTitle>Service Request Details</DialogTitle>
                                <DialogDescription>
                                  Ticket ID: {selectedRequest?.id}
                                </DialogDescription>
                              </DialogHeader>
                              {selectedRequest && (
                                <div className="space-y-6">
                                  {/* Customer Information */}
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                      <Label className="text-sm font-medium">Customer Name</Label>
                                      <p className="text-sm">{selectedRequest.customerName}</p>
                                    </div>
                                    <div>
                                      <Label className="text-sm font-medium">Email</Label>
                                      <div className="flex items-center gap-2">
                                        <Mail className="w-4 h-4 text-muted-foreground" />
                                        <p className="text-sm">{selectedRequest.email}</p>
                                      </div>
                                    </div>
                                    <div>
                                      <Label className="text-sm font-medium">Phone</Label>
                                      <div className="flex items-center gap-2">
                                        <Phone className="w-4 h-4 text-muted-foreground" />
                                        <p className="text-sm">{selectedRequest.phone}</p>
                                      </div>
                                    </div>
                                    <div>
                                      <Label className="text-sm font-medium">Preferred Date</Label>
                                      <div className="flex items-center gap-2">
                                        <Calendar className="w-4 h-4 text-muted-foreground" />
                                        <p className="text-sm">{selectedRequest.preferredDate}</p>
                                      </div>
                                    </div>
                                  </div>

                                  <div>
                                    <Label className="text-sm font-medium">Service Address</Label>
                                    <div className="flex items-start gap-2 mt-1">
                                      <MapPin className="w-4 h-4 text-muted-foreground mt-0.5" />
                                      <p className="text-sm">{selectedRequest.address}</p>
                                    </div>
                                  </div>

                                  {/* Service Information */}
                                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div>
                                      <Label className="text-sm font-medium">Service Type</Label>
                                      <p className="text-sm">{selectedRequest.serviceType}</p>
                                    </div>
                                    <div>
                                      <Label className="text-sm font-medium">Status</Label>
                                      <div className="mt-1">{getStatusBadge(selectedRequest.status)}</div>
                                    </div>
                                    <div>
                                      <Label className="text-sm font-medium">Urgency</Label>
                                      <div className="mt-1">{getUrgencyBadge(selectedRequest.urgency)}</div>
                                    </div>
                                  </div>

                                  {selectedRequest.customService && (
                                    <div>
                                      <Label className="text-sm font-medium">Custom Service</Label>
                                      <p className="text-sm">{selectedRequest.customService}</p>
                                    </div>
                                  )}

                                  <div>
                                    <Label className="text-sm font-medium">Description</Label>
                                    <p className="text-sm mt-1 p-3 bg-muted rounded-md">{selectedRequest.description}</p>
                                  </div>

                                  {/* Timestamps */}
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-muted-foreground">
                                    <div>
                                      <Label className="text-sm font-medium">Created At</Label>
                                      <p className="text-sm">{formatDate(selectedRequest.createdAt)}</p>
                                    </div>
                                    <div>
                                      <Label className="text-sm font-medium">Last Updated</Label>
                                      <p className="text-sm">{formatDate(selectedRequest.updatedAt)}</p>
                                    </div>
                                  </div>

                                  {/* Status Update */}
                                  <div className="border-t pt-4">
                                    <Label className="text-sm font-medium">Update Status</Label>
                                    <div className="flex gap-2 mt-2">
                                      <Button
                                        size="sm"
                                        variant={selectedRequest.status === 'Pending' ? 'default' : 'outline'}
                                        onClick={() => handleStatusUpdate(selectedRequest.id, 'Pending')}
                                      >
                                        Pending
                                      </Button>
                                      <Button
                                        size="sm"
                                        variant={selectedRequest.status === 'In Progress' ? 'default' : 'outline'}
                                        onClick={() => handleStatusUpdate(selectedRequest.id, 'In Progress')}
                                      >
                                        In Progress
                                      </Button>
                                      <Button
                                        size="sm"
                                        variant={selectedRequest.status === 'Completed' ? 'default' : 'outline'}
                                        onClick={() => handleStatusUpdate(selectedRequest.id, 'Completed')}
                                      >
                                        Completed
                                      </Button>
                                    </div>
                                  </div>
                                </div>
                              )}
                            </DialogContent>
                          </Dialog>
                          
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEditEstimates(request)}
                            title="Edit Estimates"
                          >
                            <Calculator className="w-4 h-4" />
                          </Button>
                          
                          <Select
                            value={request.status}
                            onValueChange={(value) => handleStatusUpdate(request.id, value as ServiceRequest['status'])}
                          >
                            <SelectTrigger className="w-[120px]">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Pending">Pending</SelectItem>
                              <SelectItem value="In Progress">In Progress</SelectItem>
                              <SelectItem value="Completed">Completed</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Estimate Editor Dialog */}
      <EstimateEditor
        isOpen={isEstimateEditorOpen}
        onClose={() => setIsEstimateEditorOpen(false)}
        request={estimateRequest}
      />
    </div>
  );
};

export default ServiceRequestsManager;
