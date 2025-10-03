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
  const {
    requests,
    getRequestsByContact,
    getRequestById,
    getRequestsByUserId,
    updateRequestStatus,
    loading
  } = useService();
  const {
    user,
    isAdmin
  } = useAuth();

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
        const searchableFields = [req.id, req.customerName, req.email, req.phone, req.serviceType, req.status, req.description, req.address, req.urgency, req.preferredDate].filter(Boolean).map(field => field.toString().toLowerCase());

        // Also search in formatted date
        let dateString = '';
        if (req?.createdAt && typeof req.createdAt === 'object' && 'toDate' in req.createdAt) {
          try {
            dateString = (req.createdAt as any).toDate().toLocaleDateString();
          } catch {}
        } else if (typeof req?.createdAt === 'string' || typeof req?.createdAt === 'number') {
          try {
            dateString = new Date(req.createdAt).toLocaleDateString();
          } catch {}
        }
        if (dateString) searchableFields.push(dateString);
        return searchableFields.some(field => field.includes(searchTerm));
      });
    }

    // Apply dropdown filters
    if (filterUser && filterUser !== '__all__') {
      filtered = filtered.filter(req => req.customerName.toLowerCase().includes(filterUser.toLowerCase()));
    }
    if (filterEmail && filterEmail !== '__all__') {
      filtered = filtered.filter(req => req.email.toLowerCase().includes(filterEmail.toLowerCase()));
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
          try {
            requestDate = (req.createdAt as any).toDate();
          } catch {}
        } else if (typeof req?.createdAt === 'string' || typeof req?.createdAt === 'number') {
          try {
            requestDate = new Date(req.createdAt);
          } catch {}
        }
        return requestDate && requestDate >= new Date(filterDateFrom);
      });
    }
    if (filterDateTo) {
      filtered = filtered.filter(req => {
        let requestDate: Date | null = null;
        if (req?.createdAt && typeof req.createdAt === 'object' && 'toDate' in req.createdAt) {
          try {
            requestDate = (req.createdAt as any).toDate();
          } catch {}
        } else if (typeof req?.createdAt === 'string' || typeof req?.createdAt === 'number') {
          try {
            requestDate = new Date(req.createdAt);
          } catch {}
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
      case 'Completed':
        return 'default';
      case 'In Progress':
        return 'secondary';
      default:
        return 'outline';
    }
  };

  // Helper function to render service request cards
  const renderServiceRequest = (r: ServiceRequest) => {
    // Determine card styling based on status
    const getStatusColor = (status: string) => {
      switch (status) {
        case 'Completed': return 'border-l-4 border-l-green-500 bg-gradient-to-r from-green-50/50 to-transparent dark:from-green-950/20';
        case 'In Progress': return 'border-l-4 border-l-blue-500 bg-gradient-to-r from-blue-50/50 to-transparent dark:from-blue-950/20';
        case 'Pending': return 'border-l-4 border-l-orange-500 bg-gradient-to-r from-orange-50/50 to-transparent dark:from-orange-950/20';
        default: return 'border-l-4 border-l-muted';
      }
    };

    return (
      <Card 
        key={r.id} 
        className={`group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 animate-fade-in overflow-hidden ${getStatusColor(r.status)}`}
      >
        <CardContent className="p-4 sm:p-6">
          <div className="flex flex-col gap-4">
            {/* Header: Ticket ID & Status */}
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 pb-3 border-b border-border/50">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Package className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <span className="text-xs text-muted-foreground font-medium uppercase tracking-wide">Ticket ID</span>
                  <p className="font-mono font-bold text-lg text-foreground">{r.id}</p>
                </div>
              </div>
              
              {/* Status Badge & Admin Actions */}
              <div className="flex items-center gap-2">
                {isAdmin ? (
                  <Select 
                    value={r.status} 
                    onValueChange={value => handleStatusUpdate(r.id, value as ServiceRequest['status'])}
                  >
                    <SelectTrigger className="min-w-[140px] h-9 text-xs font-semibold shadow-sm">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Pending">🟠 Pending</SelectItem>
                      <SelectItem value="In Progress">🔵 In Progress</SelectItem>
                      <SelectItem value="Completed">🟢 Completed</SelectItem>
                    </SelectContent>
                  </Select>
                ) : (
                  <Badge 
                    variant={getStatusVariant(r.status)} 
                    className="text-xs font-semibold px-4 py-1.5 whitespace-nowrap shadow-sm"
                  >
                    {r.status}
                  </Badge>
                )}
                {isAdmin && (
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => handleEditEstimates(r)} 
                    className="h-9 px-3 shadow-sm hover:bg-primary hover:text-primary-foreground transition-colors" 
                    title="Edit Service Details"
                  >
                    <Calculator className="w-4 h-4 mr-1" />
                    <span className="hidden sm:inline">Edit</span>
                  </Button>
                )}
              </div>
            </div>

            {/* Customer Info Section */}
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-muted/50 mt-0.5">
                  <User className="h-4 w-4 text-muted-foreground" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    {isAdmin ? (
                      <ClickableCustomerName 
                        customerName={r.customerName} 
                        email={r.email} 
                        className="font-semibold text-base text-foreground" 
                      />
                    ) : (
                      <span className="font-semibold text-base text-foreground">{r.customerName}</span>
                    )}
                    <Badge variant="secondary" className="text-xs">
                      {r.serviceType}
                    </Badge>
                  </div>
                  
                  {isAdmin && (
                    <div className="flex flex-col gap-1.5 mt-2 text-sm">
                      <ClickableContact type="email" value={r.email} />
                      <ClickableContact type="phone" value={r.phone} />
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Timestamp */}
            <div className="flex items-center gap-2 text-sm text-muted-foreground bg-muted/30 px-3 py-2 rounded-lg">
              <Clock className="h-4 w-4 flex-shrink-0" />
              {(() => {
                let created: Date | null = null;
                if (r?.createdAt && typeof r.createdAt === 'object' && 'toDate' in r.createdAt) {
                  try { created = (r.createdAt as any).toDate(); } catch {}
                } else if (typeof r?.createdAt === 'string' || typeof r?.createdAt === 'number') {
                  try { created = new Date(r.createdAt); } catch {}
                }
                return (
                  <span className="font-medium">
                    Submitted {created ? created.toLocaleDateString('en-US', {
                      month: 'short', day: 'numeric', year: 'numeric',
                      hour: '2-digit', minute: '2-digit'
                    }) : 'Unknown'}
                  </span>
                );
              })()}
            </div>

            {/* Description */}
            <div className="bg-card/50 rounded-lg p-4 border border-border/50">
              <p className="text-sm text-foreground leading-relaxed">{r.description}</p>
            </div>

            {/* Service Details (Estimates) */}
            {(r.estimatedPrice || r.estimatedCompletionTime || r.diagnosedIssue) && (
              <div className="bg-gradient-to-br from-primary/5 to-primary/10 rounded-lg p-4 border border-primary/20 space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {r.estimatedPrice && (
                    <div className="flex items-center gap-2 bg-green-500/10 text-green-700 dark:text-green-400 px-3 py-2 rounded-md">
                      <DollarSign className="h-5 w-5 flex-shrink-0" />
                      <div>
                        <span className="text-xs font-medium opacity-80">Estimated Cost</span>
                        <p className="font-bold text-base">₹{r.estimatedPrice.toFixed(2)}</p>
                      </div>
                    </div>
                  )}
                  {r.estimatedCompletionTime && (
                    <div className="flex items-center gap-2 bg-blue-500/10 text-blue-700 dark:text-blue-400 px-3 py-2 rounded-md">
                      <Clock className="h-5 w-5 flex-shrink-0" />
                      <div>
                        <span className="text-xs font-medium opacity-80">Completion Time</span>
                        <p className="font-bold text-sm">
                          {r.estimatedCompletionTime.includes('T') 
                            ? new Date(r.estimatedCompletionTime).toLocaleString('en-IN', {
                                dateStyle: 'medium', timeStyle: 'short'
                              }) 
                            : r.estimatedCompletionTime}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
                {r.diagnosedIssue && (
                  <div className="bg-orange-500/10 text-orange-700 dark:text-orange-400 px-3 py-2 rounded-md">
                    <div className="flex items-start gap-2">
                      <AlertCircle className="h-5 w-5 mt-0.5 flex-shrink-0" />
                      <div>
                        <span className="text-xs font-medium opacity-80 block mb-1">Diagnosed Issue</span>
                        <p className="text-sm font-medium leading-relaxed">{r.diagnosedIssue}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Admin Additional Details */}
            {isAdmin && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-border/50">
                <div className="flex items-start gap-2 text-sm bg-muted/30 px-3 py-2 rounded-lg">
                  <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0 text-muted-foreground" />
                  <div>
                    <span className="text-xs text-muted-foreground font-medium block mb-0.5">Address</span>
                    <span className="text-foreground">{r.address}</span>
                  </div>
                </div>
                <div className="flex items-start gap-2 text-sm bg-muted/30 px-3 py-2 rounded-lg">
                  <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0 text-muted-foreground" />
                  <div>
                    <span className="text-xs text-muted-foreground font-medium block mb-0.5">Priority</span>
                    <span className="text-foreground font-medium">{r.urgency}</span>
                  </div>
                </div>
                <div className="flex items-start gap-2 text-sm bg-muted/30 px-3 py-2 rounded-lg sm:col-span-2">
                  <Calendar className="h-4 w-4 mt-0.5 flex-shrink-0 text-muted-foreground" />
                  <div>
                    <span className="text-xs text-muted-foreground font-medium block mb-0.5">Preferred Date</span>
                    <span className="text-foreground font-medium">{r.preferredDate}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    );
  };
  if (loading) {
    return <div className="min-h-screen bg-background pb-20 lg:pb-0">
        <Header />
        <div className="mx-auto max-w-6xl px-4 sm:px-6 py-8 sm:py-12">
          <Card>
            <CardContent className="p-6">
              <div className="text-center">Loading...</div>
            </CardContent>
          </Card>
        </div>
      </div>;
  }
  return <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 pb-20 lg:pb-0">
      <Header />
      <div className={`mx-auto px-4 sm:px-6 py-8 sm:py-12 ${isAdmin ? 'max-w-7xl' : 'max-w-4xl'}`}>
        <div className="mb-6 sm:mb-8 animate-fade-in rounded-none">
          
          <p className="text-base sm:text-lg text-muted-foreground/80">
            {isAdmin ? 'Manage and track all customer service requests' : 'Track the status of your service requests'}
          </p>
        </div>

        <div className="space-y-6">
          {/* Regular User View */}
          {!isAdmin && user && <div>
              {userRequests.length > 0 ? <div className="space-y-4">
                  {userRequests.map(renderServiceRequest)}
                </div> : <Card className="border-dashed">
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
                </Card>}
            </div>}

          {/* Guest User View - Login Required */}
          {!isAdmin && !user && <Card className="animate-fade-in border-dashed">
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
            </Card>}

          {/* Admin View */}
          {isAdmin && <div className="space-y-6">
              {/* Enhanced Admin Filters Section */}
              <Card className="animate-fade-in shadow-lg border-primary/20">
                <CardHeader className="pb-3 border-b border-border/50">
                  <div className="flex items-center gap-2">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <Filter className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">Search & Filters</CardTitle>
                      <CardDescription className="text-xs">Find and filter service requests</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-4 space-y-4">
                  {/* Semantic Search */}
                  <div>
                    <Label className="text-xs font-medium text-muted-foreground mb-2 block">
                      Quick Search
                    </Label>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground z-10" />
                      <Input 
                        value={semanticSearch} 
                        onChange={e => setSemanticSearch(e.target.value)} 
                        placeholder="Search by ticket ID, customer, email, service type, status..." 
                        className="pl-10 h-11 shadow-sm border-border/50 focus:border-primary"
                      />
                    </div>
                  </div>

                  {/* Filter Grid */}
                  <div>
                    <Label className="text-xs font-medium text-muted-foreground mb-2 block">
                      Advanced Filters
                    </Label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3">
                      <Select value={filterStatus} onValueChange={setFilterStatus}>
                        <SelectTrigger className="h-10 shadow-sm">
                          <SelectValue placeholder="Status" />
                        </SelectTrigger>
                        <SelectContent className="bg-background">
                          <SelectItem value="__all__">All Status</SelectItem>
                          <SelectItem value="Pending">🟠 Pending</SelectItem>
                          <SelectItem value="In Progress">🔵 In Progress</SelectItem>
                          <SelectItem value="Completed">🟢 Completed</SelectItem>
                        </SelectContent>
                      </Select>

                      <Select value={filterServiceType} onValueChange={setFilterServiceType}>
                        <SelectTrigger className="h-10 shadow-sm">
                          <SelectValue placeholder="Service Type" />
                        </SelectTrigger>
                        <SelectContent className="bg-background">
                          <SelectItem value="__all__">All Service Types</SelectItem>
                          {uniqueServiceTypes.map(type => <SelectItem key={type} value={type}>{type}</SelectItem>)}
                        </SelectContent>
                      </Select>

                      <Select value={filterUser} onValueChange={setFilterUser}>
                        <SelectTrigger className="h-10 shadow-sm">
                          <SelectValue placeholder="Customer" />
                        </SelectTrigger>
                        <SelectContent className="bg-background">
                          <SelectItem value="__all__">All Customers</SelectItem>
                          {uniqueUsers.map(user => <SelectItem key={user} value={user}>{user}</SelectItem>)}
                        </SelectContent>
                      </Select>

                      <Select value={filterEmail} onValueChange={setFilterEmail}>
                        <SelectTrigger className="h-10 shadow-sm">
                          <SelectValue placeholder="Email" />
                        </SelectTrigger>
                        <SelectContent className="bg-background">
                          <SelectItem value="__all__">All Emails</SelectItem>
                          {uniqueEmails.map(email => <SelectItem key={email} value={email}>{email}</SelectItem>)}
                        </SelectContent>
                      </Select>

                      <Button 
                        onClick={clearFilters} 
                        variant="outline" 
                        className="h-10 shadow-sm hover:bg-destructive/10 hover:text-destructive hover:border-destructive/50 col-span-1 sm:col-span-2 lg:col-span-1"
                      >
                        Clear All
                      </Button>
                    </div>

                    {/* Date Range Filters */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
                      <div className="space-y-1.5">
                        <Label className="text-xs text-muted-foreground">From Date</Label>
                        <Input 
                          type="date" 
                          value={filterDateFrom} 
                          onChange={e => setFilterDateFrom(e.target.value)} 
                          className="h-10 shadow-sm" 
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label className="text-xs text-muted-foreground">To Date</Label>
                        <Input 
                          type="date" 
                          value={filterDateTo} 
                          onChange={e => setFilterDateTo(e.target.value)} 
                          className="h-10 shadow-sm" 
                        />
                      </div>
                    </div>
                  </div>

                  {/* Legacy Search (kept for backward compatibility) */}
                  {query && <div className="pt-4 border-t border-border/50">
                      <Label className="text-xs font-medium text-muted-foreground mb-2 block">
                        Legacy Search
                      </Label>
                      <div className="flex gap-3">
                        <div className="flex-1">
                          <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input 
                              value={query} 
                              onChange={e => setQuery(e.target.value)} 
                              onKeyDown={e => e.key === 'Enter' && handleSearch()} 
                              placeholder="Ticket ID, email, or phone" 
                              className="pl-10 h-10 shadow-sm" 
                            />
                          </div>
                        </div>
                        <Button onClick={handleSearch} className="h-10 shadow-sm">
                          <Search className="h-4 w-4 mr-2" />
                          Search
                        </Button>
                      </div>
                    </div>}
                </CardContent>
              </Card>

              {error && <div className="flex items-center gap-2 p-3 rounded-lg bg-destructive/10 text-destructive text-sm animate-fade-in">
                  <AlertCircle className="h-4 w-4" />
                  <p>{error}</p>
                </div>}

              {/* Results Display */}
              <div className="space-y-5">
                {query && results.length > 0 ?
            // Show legacy search results when admin has used the old search
            <>
                    <Card className="bg-muted/30 border-primary/30">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <h2 className="text-lg font-semibold text-foreground">Legacy Search Results</h2>
                          <Badge variant="secondary" className="shadow-sm">{results.length} found</Badge>
                        </div>
                      </CardContent>
                    </Card>
                    <div className="space-y-4">
                      {results.map(renderServiceRequest)}
                    </div>
                  </> :
            // Show filtered/searched results (including semantic search)
            <>
                    <Card className="bg-gradient-to-r from-primary/5 to-primary/10 border-primary/30">
                      <CardContent className="p-4">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                          <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-primary/20">
                              <Package className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                              <h2 className="text-lg font-bold text-foreground">
                                {semanticSearch.trim() ? 'Search Results' : 'All Service Requests'}
                              </h2>
                              <p className="text-xs text-muted-foreground">
                                {semanticSearch.trim() ? 'Matching your search criteria' : 'Complete overview of all requests'}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant="default" className="shadow-sm px-3 py-1">
                              {filteredAdminRequests.length} {filteredAdminRequests.length === 1 ? 'request' : 'requests'}
                            </Badge>
                            {(semanticSearch.trim() || filterStatus !== '__all__' || filterServiceType !== '__all__' || filterUser !== '__all__' || filterEmail !== '__all__' || filterDateFrom || filterDateTo) && (
                              <Badge variant="outline" className="text-xs shadow-sm bg-background">
                                🔍 Filtered View
                              </Badge>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                    {filteredAdminRequests.length > 0 ? (
                      <div className="space-y-4">
                        {filteredAdminRequests.map(renderServiceRequest)}
                      </div>
                    ) : (
                      <Card className="border-dashed border-2">
                        <CardContent className="flex flex-col items-center justify-center py-16 px-6 text-center">
                          <div className="p-4 rounded-full bg-muted/50 mb-4">
                            <Package className="h-12 w-12 text-muted-foreground/50" />
                          </div>
                          <h3 className="text-xl font-semibold mb-2">No requests found</h3>
                          <p className="text-sm text-muted-foreground max-w-md">
                            {semanticSearch.trim() 
                              ? 'No requests match your search criteria. Try different keywords or adjust your filters.' 
                              : 'Try adjusting your filters or search criteria to find requests'}
                          </p>
                          <Button 
                            onClick={clearFilters} 
                            variant="outline" 
                            className="mt-6"
                          >
                            Clear All Filters
                          </Button>
                        </CardContent>
                      </Card>
                    )}
                  </>}
              </div>
            </div>}
        </div>
      </div>

      {/* Estimate Editor Dialog */}
      <EstimateEditor isOpen={isEstimateEditorOpen} onClose={() => setIsEstimateEditorOpen(false)} request={estimateRequest} />
    </div>;
}