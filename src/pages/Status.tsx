import { useState, useEffect, useMemo } from 'react';
import Header from '@/components/Header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useService, ServiceRequest } from '@/contexts/ServiceContext';
import { useAuth } from '@/contexts/AuthContext';
import EstimateEditor from '@/components/admin/EstimateEditor';
import ClickableContact from '@/components/ClickableContact';
import ClickableCustomerName from '@/components/ClickableCustomerName';
import { Search, Filter, Calendar, User, Mail, Phone, MapPin, Clock, AlertCircle, Package, DollarSign, Calculator } from 'lucide-react';

export default function Status() {
  const { requests, getRequestsByContact, getRequestById, getRequestsByUserId, updateRequestStatus, loading } = useService();
  const { user, isAdmin } = useAuth();
  
  // For regular users - no search needed, show their requests automatically
  const [userRequests, setUserRequests] = useState<ServiceRequest[]>([]);
  
  // For admins - search and filter functionality
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<ServiceRequest[]>([]);
  const [error, setError] = useState('');
  
  // Admin filtering states
  const [filterUser, setFilterUser] = useState('__all__');
  const [filterEmail, setFilterEmail] = useState('__all__');
  const [filterStatus, setFilterStatus] = useState('__all__');
  const [filterServiceType, setFilterServiceType] = useState('__all__');
  const [filterDateFrom, setFilterDateFrom] = useState('');
  const [filterDateTo, setFilterDateTo] = useState('');
  const [semanticSearch, setSemanticSearch] = useState('');
  const [isEstimateEditorOpen, setIsEstimateEditorOpen] = useState(false);
  const [estimateRequest, setEstimateRequest] = useState<ServiceRequest | null>(null);

  // Load user's requests automatically when logged in (non-admin)
  useEffect(() => {
    if (user && !isAdmin && user.uid) {
      const userServiceRequests = getRequestsByUserId(user.uid);
      setUserRequests(userServiceRequests);
    }
  }, [user, isAdmin, requests, getRequestsByUserId]);

  // Get unique users and emails for admin filtering
  const uniqueUsers = useMemo(() => {
    const users = new Set<string>();
    requests.forEach(req => {
      if (req.customerName) users.add(req.customerName);
    });
    return Array.from(users).sort();
  }, [requests]);

  const uniqueEmails = useMemo(() => {
    const emails = new Set<string>();
    requests.forEach(req => {
      if (req.email) emails.add(req.email);
    });
    return Array.from(emails).sort();
  }, [requests]);

  const uniqueServiceTypes = useMemo(() => {
    const types = new Set<string>();
    requests.forEach(req => {
      if (req.serviceType) types.add(req.serviceType);
    });
    return Array.from(types).sort();
  }, [requests]);

  // Filter admin requests based on selected filters and semantic search
  const filteredAdminRequests = useMemo(() => {
    let filtered = [...requests];

    // Apply semantic search first if provided
    if (semanticSearch.trim()) {
      const searchTerm = semanticSearch.toLowerCase().trim();
      filtered = filtered.filter(req => {
        // Search through all relevant fields
        const searchableFields = [
          req.id,
          req.customerName,
          req.email,
          req.phone,
          req.serviceType,
          req.status,
          req.description,
          req.address,
          req.urgency,
          req.preferredDate
        ].filter(Boolean).map(field => field.toString().toLowerCase());

        // Also search in formatted date
        let dateString = '';
        if (req?.createdAt && typeof req.createdAt === 'object' && 'toDate' in req.createdAt) {
          try { dateString = (req.createdAt as any).toDate().toLocaleDateString(); } catch {}
        } else if (typeof req?.createdAt === 'string' || typeof req?.createdAt === 'number') {
          try { dateString = new Date(req.createdAt).toLocaleDateString(); } catch {}
        }
        if (dateString) searchableFields.push(dateString);

        return searchableFields.some(field => field.includes(searchTerm));
      });
    }

    // Apply dropdown filters
    if (filterUser && filterUser !== '__all__') {
      filtered = filtered.filter(req => 
        req.customerName.toLowerCase().includes(filterUser.toLowerCase())
      );
    }

    if (filterEmail && filterEmail !== '__all__') {
      filtered = filtered.filter(req => 
        req.email.toLowerCase().includes(filterEmail.toLowerCase())
      );
    }

    if (filterStatus && filterStatus !== '__all__') {
      filtered = filtered.filter(req => req.status === filterStatus);
    }

    if (filterServiceType && filterServiceType !== '__all__') {
      filtered = filtered.filter(req => req.serviceType === filterServiceType);
    }

    if (filterDateFrom) {
      filtered = filtered.filter(req => {
        let requestDate: Date | null = null;
        if (req?.createdAt && typeof req.createdAt === 'object' && 'toDate' in req.createdAt) {
          try { requestDate = (req.createdAt as any).toDate(); } catch {}
        } else if (typeof req?.createdAt === 'string' || typeof req?.createdAt === 'number') {
          try { requestDate = new Date(req.createdAt); } catch {}
        }
        return requestDate && requestDate >= new Date(filterDateFrom);
      });
    }

    if (filterDateTo) {
      filtered = filtered.filter(req => {
        let requestDate: Date | null = null;
        if (req?.createdAt && typeof req.createdAt === 'object' && 'toDate' in req.createdAt) {
          try { requestDate = (req.createdAt as any).toDate(); } catch {}
        } else if (typeof req?.createdAt === 'string' || typeof req?.createdAt === 'number') {
          try { requestDate = new Date(req.createdAt); } catch {}
        }
        return requestDate && requestDate <= new Date(filterDateTo + 'T23:59:59');
      });
    }

    return filtered;
  }, [requests, filterUser, filterEmail, filterStatus, filterServiceType, filterDateFrom, filterDateTo, semanticSearch]);

  const handleSearch = async () => {
    setError('');
    const trimmed = query.trim();
    if (!trimmed) {
      setResults([]);
      return;
    }
    // Try ticket ID first
    const byId = await getRequestById(trimmed);
    if (byId) {
      setResults([byId]);
      return;
    }
    // Then try email/phone
    const list = await getRequestsByContact(trimmed);
    if (list.length === 0) {
      setError('No requests found for that ticket, email, or phone.');
    }
    setResults(list);
  };

  const clearFilters = () => {
    setFilterUser('__all__');
    setFilterEmail('__all__');
    setFilterStatus('__all__');
    setFilterServiceType('__all__');
    setFilterDateFrom('');
    setFilterDateTo('');
    setSemanticSearch('');
    setQuery('');
    setResults([]);
    setError('');
  };

  const handleEditEstimates = (request: ServiceRequest) => {
    setEstimateRequest(request);
    setIsEstimateEditorOpen(true);
  };

  // Handle status update for admins
  const handleStatusUpdate = async (requestId: string, newStatus: ServiceRequest['status']) => {
    try {
      await updateRequestStatus(requestId, newStatus);
      // The UI will update automatically through the context
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  // Helper to get status variant
  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'Completed': return 'default';
      case 'In Progress': return 'secondary';
      default: return 'outline';
    }
  };

  // Helper function to render service request cards
  const renderServiceRequest = (r: ServiceRequest) => (
    <Card key={r.id} className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 animate-fade-in border-border/50">
      <CardContent className="p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
          <div className="flex-1 space-y-3">
            {/* Ticket ID */}
            <div className="flex items-center gap-2">
              <Package className="h-4 w-4 text-primary" />
              <span className="font-mono font-bold text-lg text-foreground">{r.id}</span>
            </div>
            
            {/* Customer Info */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <User className="h-4 w-4 text-muted-foreground" />
                {isAdmin ? (
                  <ClickableCustomerName 
                    customerName={r.customerName} 
                    email={r.email}
                    className="font-medium"
                  />
                ) : (
                  <span className="font-medium text-foreground">{r.customerName}</span>
                )}
                <span className="text-muted-foreground">•</span>
                <span className="text-muted-foreground">{r.serviceType}</span>
              </div>
              
              {isAdmin && (
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <ClickableContact type="email" value={r.email} />
                  </div>
                  <span className="hidden sm:inline">•</span>
                  <div className="flex items-center gap-2">
                    <ClickableContact type="phone" value={r.phone} />
                  </div>
                </div>
              )}
            </div>

            {/* Date */}
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="h-4 w-4" />
              {(() => {
                let created: Date | null = null;
                if (r?.createdAt && typeof r.createdAt === 'object' && 'toDate' in r.createdAt) {
                  try { created = (r.createdAt as any).toDate(); } catch {}
                } else if (typeof r?.createdAt === 'string' || typeof r?.createdAt === 'number') {
                  try { created = new Date(r.createdAt); } catch {}
                }
                return (
                  <span>
                    Submitted {created ? created.toLocaleDateString('en-US', { 
                      month: 'short', 
                      day: 'numeric', 
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    }) : 'Unknown'}
                  </span>
                );
              })()}
            </div>

            {/* Description */}
            <div className="pt-2 border-t border-border/50">
              <p className="text-sm text-foreground/80 line-clamp-2">{r.description}</p>
            </div>

            {/* Service Details (visible to all users) */}
            {(r.estimatedPrice || r.estimatedCompletionTime || r.diagnosedIssue) && (
              <div className="pt-2 border-t border-border/50">
                <div className="space-y-2">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                    {r.estimatedPrice && (
                      <div className="flex items-center gap-2 text-green-600">
                        <DollarSign className="h-4 w-4" />
                        <span className="font-medium">Estimated Cost: ₹{r.estimatedPrice.toFixed(2)}</span>
                      </div>
                    )}
                    {r.estimatedCompletionTime && (
                      <div className="flex items-center gap-2 text-blue-600">
                        <Clock className="h-4 w-4" />
                        <span className="font-medium">
                          Completion: {
                            r.estimatedCompletionTime.includes('T') ? 
                              new Date(r.estimatedCompletionTime).toLocaleString('en-IN', {
                                dateStyle: 'medium',
                                timeStyle: 'short'
                              }) : 
                              r.estimatedCompletionTime
                          }
                        </span>
                      </div>
                    )}
                  </div>
                  {r.diagnosedIssue && (
                    <div className="text-sm">
                      <div className="flex items-start gap-2 text-orange-600">
                        <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                        <div>
                          <span className="font-medium">Diagnosed Issue:</span>
                          <p className="text-foreground/80 mt-1">{r.diagnosedIssue}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Admin Details */}
            {isAdmin && (
              <div className="pt-2 space-y-2 text-sm">
                <div className="flex items-start gap-2 text-muted-foreground">
                  <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
                  <span className="line-clamp-1">{r.address}</span>
                </div>
                <div className="flex flex-wrap gap-x-4 gap-y-1 text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="h-4 w-4" />
                    <span>Urgency: <span className="font-medium text-foreground">{r.urgency}</span></span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    <span>Preferred: <span className="font-medium text-foreground">{r.preferredDate}</span></span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Status Badge & Admin Actions */}
          <div className="flex sm:flex-col items-start gap-2">
            {isAdmin ? (
              <Select
                value={r.status}
                onValueChange={(value) => handleStatusUpdate(r.id, value as ServiceRequest['status'])}
              >
                <SelectTrigger className="w-[120px] h-8 text-xs font-semibold">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Pending">Pending</SelectItem>
                  <SelectItem value="In Progress">In Progress</SelectItem>
                  <SelectItem value="Completed">Completed</SelectItem>
                </SelectContent>
              </Select>
            ) : (
              <Badge 
                variant={getStatusVariant(r.status)}
                className="text-xs font-semibold px-3 py-1 whitespace-nowrap"
              >
                {r.status}
              </Badge>
            )}
            {isAdmin && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleEditEstimates(r)}
                className="h-7 px-2"
                title="Edit Service Details"
              >
                <Calculator className="w-3 h-3" />
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-background pb-20 lg:pb-0">
        <Header />
        <div className="mx-auto max-w-6xl px-4 sm:px-6 py-8 sm:py-12">
          <Card>
            <CardContent className="p-6">
              <div className="text-center">Loading...</div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 pb-20 lg:pb-0">
      <Header />
      <div className={`mx-auto px-4 sm:px-6 py-8 sm:py-12 ${isAdmin ? 'max-w-7xl' : 'max-w-4xl'}`}>
        <div className="mb-6 sm:mb-8 animate-fade-in">
          <h1 className="text-3xl sm:text-5xl font-extrabold bg-gradient-to-r from-primary via-primary/90 to-primary/70 bg-clip-text text-transparent mb-3 tracking-tight">
            {isAdmin ? 'Service Status Management' : 'Your Service Requests'}
          </h1>
          <p className="text-base sm:text-lg text-muted-foreground/80">
            {isAdmin 
              ? 'Manage and track all customer service requests' 
              : 'Track the status of your service requests'}
          </p>
        </div>

        <div className="space-y-6">
          {/* Regular User View */}
          {!isAdmin && user && (
            <div>
              {userRequests.length > 0 ? (
                <div className="space-y-4">
                  {userRequests.map(renderServiceRequest)}
                </div>
              ) : (
                <Card className="border-dashed">
                  <CardContent className="flex flex-col items-center justify-center py-12 px-6 text-center">
                    <Package className="h-12 w-12 text-muted-foreground/50 mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No service requests yet</h3>
                    <p className="text-sm text-muted-foreground mb-6">
                      Get started by submitting your first service request
                    </p>
                    <Button asChild>
                      <a href="/request">Submit New Request</a>
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>
          )}

          {/* Guest User View - Login Required */}
          {!isAdmin && !user && (
            <Card className="animate-fade-in border-dashed">
              <CardContent className="flex flex-col items-center justify-center py-16 px-6 text-center">
                <User className="h-16 w-16 text-muted-foreground/50 mb-6" />
                <h3 className="text-xl font-semibold mb-3">Login Required</h3>
                <p className="text-muted-foreground mb-6 max-w-md">
                  Please sign in to view your service requests. This ensures the security and privacy of your service information.
                </p>
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button asChild size="lg">
                    <a href="/login">Sign In</a>
                  </Button>
                  <Button variant="outline" size="lg" asChild>
                    <a href="/register">Create Account</a>
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground mt-6">
                  Don't have an account? Registration is quick and secure.
                </p>
              </CardContent>
            </Card>
          )}

          {/* Admin View */}
          {isAdmin && (
            <div className="space-y-6">
              {/* Compact Admin Filters Bar */}
              <Card className="animate-fade-in">
                <CardContent className="p-4">
                  {/* Semantic Search */}
                  <div className="mb-4">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        value={semanticSearch}
                        onChange={(e) => setSemanticSearch(e.target.value)}
                        placeholder="Search anything: ticket ID, customer name, email, service type, status, date..."
                        className="pl-10 h-10"
                      />
                    </div>
                  </div>

                  {/* Filter Bar */}
                  <div className="flex flex-wrap items-center gap-3">
                    <div className="flex items-center gap-2">
                      <Filter className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-medium text-muted-foreground">Filters:</span>
                    </div>

                    <Select value={filterStatus} onValueChange={setFilterStatus}>
                      <SelectTrigger className="w-[130px] h-8">
                        <SelectValue placeholder="Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="__all__">All Status</SelectItem>
                        <SelectItem value="Pending">Pending</SelectItem>
                        <SelectItem value="In Progress">In Progress</SelectItem>
                        <SelectItem value="Completed">Completed</SelectItem>
                      </SelectContent>
                    </Select>

                    <Select value={filterServiceType} onValueChange={setFilterServiceType}>
                      <SelectTrigger className="w-[150px] h-8">
                        <SelectValue placeholder="Service Type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="__all__">All Types</SelectItem>
                        {uniqueServiceTypes.map(type => (
                          <SelectItem key={type} value={type}>{type}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    <Select value={filterUser} onValueChange={setFilterUser}>
                      <SelectTrigger className="w-[140px] h-8">
                        <SelectValue placeholder="Customer" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="__all__">All Customers</SelectItem>
                        {uniqueUsers.map(user => (
                          <SelectItem key={user} value={user}>{user}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    <Select value={filterEmail} onValueChange={setFilterEmail}>
                      <SelectTrigger className="w-[140px] h-8">
                        <SelectValue placeholder="Email" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="__all__">All Emails</SelectItem>
                        {uniqueEmails.map(email => (
                          <SelectItem key={email} value={email}>{email}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    <div className="flex items-center gap-2">
                      <Input
                        type="date"
                        value={filterDateFrom}
                        onChange={(e) => setFilterDateFrom(e.target.value)}
                        className="w-[140px] h-8"
                        placeholder="From Date"
                      />
                      <span className="text-xs text-muted-foreground">to</span>
                      <Input
                        type="date"
                        value={filterDateTo}
                        onChange={(e) => setFilterDateTo(e.target.value)}
                        className="w-[140px] h-8"
                        placeholder="To Date"
                      />
                    </div>

                    <Button onClick={clearFilters} variant="outline" size="sm" className="h-8">
                      Clear All
                    </Button>
                  </div>

                  {/* Legacy Search (kept for backward compatibility) */}
                  {query && (
                    <div className="mt-4 pt-4 border-t border-border">
                      <div className="flex gap-3">
                        <div className="flex-1">
                          <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                              value={query}
                              onChange={(e) => setQuery(e.target.value)}
                              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                              placeholder="Legacy search: Ticket ID, email, or phone"
                              className="pl-10 h-8"
                            />
                          </div>
                        </div>
                        <Button onClick={handleSearch} size="sm" className="h-8">
                          <Search className="h-4 w-4 mr-2" />
                          Search
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {error && (
                <div className="flex items-center gap-2 p-3 rounded-lg bg-destructive/10 text-destructive text-sm animate-fade-in">
                  <AlertCircle className="h-4 w-4" />
                  <p>{error}</p>
                </div>
              )}

              {/* Results Display */}
              <div className="space-y-4">
                {query && results.length > 0 ? (
                  // Show legacy search results when admin has used the old search
                  <>
                    <div className="flex items-center justify-between">
                      <h2 className="text-xl font-semibold">Legacy Search Results</h2>
                      <Badge variant="secondary">{results.length} found</Badge>
                    </div>
                    {results.map(renderServiceRequest)}
                  </>
                ) : (
                  // Show filtered/searched results (including semantic search)
                  <>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <h2 className="text-xl font-semibold">
                        {semanticSearch.trim() ? 'Search Results' : 'All Service Requests'}
                      </h2>
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary" className="w-fit">
                          {filteredAdminRequests.length} {filteredAdminRequests.length === 1 ? 'request' : 'requests'}
                        </Badge>
                        {(semanticSearch.trim() || filterStatus !== '__all__' || filterServiceType !== '__all__' || 
                          filterUser !== '__all__' || filterEmail !== '__all__' || filterDateFrom || filterDateTo) && (
                          <Badge variant="outline" className="text-xs">
                            Filtered
                          </Badge>
                        )}
                      </div>
                    </div>
                    {filteredAdminRequests.length > 0 ? (
                      filteredAdminRequests.map(renderServiceRequest)
                    ) : (
                      <Card className="border-dashed">
                        <CardContent className="flex flex-col items-center justify-center py-12 px-6 text-center">
                          <Package className="h-12 w-12 text-muted-foreground/50 mb-4" />
                          <h3 className="text-lg font-semibold mb-2">No requests found</h3>
                          <p className="text-sm text-muted-foreground">
                            {semanticSearch.trim() ? 
                              'No requests match your search criteria. Try different keywords.' :
                              'Try adjusting your filters or search criteria'
                            }
                          </p>
                        </CardContent>
                      </Card>
                    )}
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Estimate Editor Dialog */}
      <EstimateEditor
        isOpen={isEstimateEditorOpen}
        onClose={() => setIsEstimateEditorOpen(false)}
        request={estimateRequest}
      />
    </div>
  );
}


