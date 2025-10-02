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
import { Search, Filter, Calendar, User, Mail, Phone, MapPin, Clock, AlertCircle, Package } from 'lucide-react';

export default function Status() {
  const { requests, getRequestsByContact, getRequestById, getRequestsByUserId, loading } = useService();
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
  const [filterDateFrom, setFilterDateFrom] = useState('');
  const [filterDateTo, setFilterDateTo] = useState('');

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

  // Filter admin requests based on selected filters
  const filteredAdminRequests = useMemo(() => {
    let filtered = [...requests];

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
  }, [requests, filterUser, filterEmail, filterStatus, filterDateFrom, filterDateTo]);

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
    setFilterDateFrom('');
    setFilterDateTo('');
    setQuery('');
    setResults([]);
    setError('');
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
                <span className="font-medium text-foreground">{r.customerName}</span>
                <span className="text-muted-foreground">•</span>
                <span className="text-muted-foreground">{r.serviceType}</span>
              </div>
              
              {isAdmin && (
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    <span>{r.email}</span>
                  </div>
                  <span className="hidden sm:inline">•</span>
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4" />
                    <span>{r.phone}</span>
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

          {/* Status Badge */}
          <div className="flex sm:flex-col items-start gap-2">
            <Badge 
              variant={getStatusVariant(r.status)}
              className="text-xs font-semibold px-3 py-1 whitespace-nowrap"
            >
              {r.status}
            </Badge>
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
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-2">
            {isAdmin ? 'Service Status Management' : 'Your Service Requests'}
          </h1>
          <p className="text-muted-foreground">
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

          {/* Guest User View */}
          {!isAdmin && !user && (
            <Card className="animate-fade-in">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Search className="h-5 w-5" />
                  Track Your Service Request
                </CardTitle>
                <CardDescription>
                  Enter your ticket ID, email, or phone number to view your service status
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="flex-1 space-y-2">
                    <Label htmlFor="query" className="sr-only">Search</Label>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="query"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                        placeholder="SC-004 or email@example.com or +1-555-1234"
                        className="pl-10 h-11"
                      />
                    </div>
                  </div>
                  <Button onClick={handleSearch} size="lg" className="sm:w-auto">
                    <Search className="h-4 w-4 mr-2" />
                    Search
                  </Button>
                </div>

                {error && (
                  <div className="flex items-center gap-2 p-3 rounded-lg bg-destructive/10 text-destructive text-sm">
                    <AlertCircle className="h-4 w-4" />
                    <p>{error}</p>
                  </div>
                )}

                <div className="space-y-4">
                  {results.length > 0 ? (
                    results.map(renderServiceRequest)
                  ) : !error && (
                    <div className="text-center py-8 px-4">
                      <Package className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
                      <p className="text-sm text-muted-foreground mb-4">
                        Enter your details above to track your service request
                      </p>
                      <p className="text-sm text-muted-foreground">
                        <a href="/login" className="text-primary hover:underline font-medium">Sign in</a> to automatically view all your requests
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Admin View */}
          {isAdmin && (
            <div className="space-y-6">
              {/* Admin Filters */}
              <Card className="animate-fade-in">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Filter className="h-5 w-5" />
                    Filters & Search
                  </CardTitle>
                  <CardDescription>
                    Filter and search through all service requests
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="filterUser" className="flex items-center gap-2">
                        <User className="h-4 w-4" />
                        Customer
                      </Label>
                      <Select value={filterUser} onValueChange={setFilterUser}>
                        <SelectTrigger id="filterUser">
                          <SelectValue placeholder="All customers" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="__all__">All customers</SelectItem>
                          {uniqueUsers.map(user => (
                            <SelectItem key={user} value={user}>{user}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="filterEmail" className="flex items-center gap-2">
                        <Mail className="h-4 w-4" />
                        Email
                      </Label>
                      <Select value={filterEmail} onValueChange={setFilterEmail}>
                        <SelectTrigger id="filterEmail">
                          <SelectValue placeholder="All emails" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="__all__">All emails</SelectItem>
                          {uniqueEmails.map(email => (
                            <SelectItem key={email} value={email}>{email}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="filterStatus" className="flex items-center gap-2">
                        <Package className="h-4 w-4" />
                        Status
                      </Label>
                      <Select value={filterStatus} onValueChange={setFilterStatus}>
                        <SelectTrigger id="filterStatus">
                          <SelectValue placeholder="All statuses" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="__all__">All statuses</SelectItem>
                          <SelectItem value="Pending">Pending</SelectItem>
                          <SelectItem value="In Progress">In Progress</SelectItem>
                          <SelectItem value="Completed">Completed</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="filterDateFrom" className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        From Date
                      </Label>
                      <Input
                        id="filterDateFrom"
                        type="date"
                        value={filterDateFrom}
                        onChange={(e) => setFilterDateFrom(e.target.value)}
                        className="h-10"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="filterDateTo" className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        To Date
                      </Label>
                      <Input
                        id="filterDateTo"
                        type="date"
                        value={filterDateTo}
                        onChange={(e) => setFilterDateTo(e.target.value)}
                        className="h-10"
                      />
                    </div>

                    <div className="flex items-end">
                      <Button onClick={clearFilters} variant="outline" className="w-full h-10">
                        Clear All
                      </Button>
                    </div>
                  </div>

                  {/* Manual Search for Admin */}
                  <div className="pt-6 border-t border-border">
                    <div className="flex flex-col sm:flex-row gap-3">
                      <div className="flex-1 space-y-2">
                        <Label htmlFor="adminQuery" className="flex items-center gap-2">
                          <Search className="h-4 w-4" />
                          Manual Search
                        </Label>
                        <div className="relative">
                          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="adminQuery"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                            placeholder="Ticket ID, email, or phone"
                            className="pl-10 h-10"
                          />
                        </div>
                      </div>
                      <div className="flex items-end">
                        <Button onClick={handleSearch} className="w-full sm:w-auto h-10">
                          <Search className="h-4 w-4 mr-2" />
                          Search
                        </Button>
                      </div>
                    </div>
                  </div>
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
                  // Show search results when admin has searched
                  <>
                    <div className="flex items-center justify-between">
                      <h2 className="text-xl font-semibold">Search Results</h2>
                      <Badge variant="secondary">{results.length} found</Badge>
                    </div>
                    {results.map(renderServiceRequest)}
                  </>
                ) : (
                  // Show filtered results when no search query
                  <>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <h2 className="text-xl font-semibold">All Service Requests</h2>
                      <Badge variant="secondary" className="w-fit">
                        {filteredAdminRequests.length} {filteredAdminRequests.length === 1 ? 'request' : 'requests'}
                      </Badge>
                    </div>
                    {filteredAdminRequests.length > 0 ? (
                      filteredAdminRequests.map(renderServiceRequest)
                    ) : (
                      <Card className="border-dashed">
                        <CardContent className="flex flex-col items-center justify-center py-12 px-6 text-center">
                          <Package className="h-12 w-12 text-muted-foreground/50 mb-4" />
                          <h3 className="text-lg font-semibold mb-2">No requests found</h3>
                          <p className="text-sm text-muted-foreground">
                            Try adjusting your filters or search criteria
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
    </div>
  );
}


