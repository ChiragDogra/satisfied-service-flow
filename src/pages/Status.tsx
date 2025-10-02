import { useState, useEffect, useMemo } from 'react';
import Header from '@/components/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useService, ServiceRequest } from '@/contexts/ServiceContext';
import { useAuth } from '@/contexts/AuthContext';

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

  // Helper function to render service request cards
  const renderServiceRequest = (r: ServiceRequest) => (
    <div key={r.id} className="rounded-md border p-4">
      <div className="flex justify-between items-center">
        <div>
          <div className="font-semibold">{r.id}</div>
          <div className="text-sm text-muted-foreground">{r.customerName} • {r.serviceType}</div>
          {isAdmin && (
            <div className="text-sm text-muted-foreground">{r.email} • {r.phone}</div>
          )}
        </div>
        <div className="text-sm">
          <span className={`px-2 py-1 rounded text-white ${
            r.status === 'Completed' ? 'bg-green-600' :
            r.status === 'In Progress' ? 'bg-blue-600' : 'bg-yellow-600'
          }`}>
            {r.status}
          </span>
        </div>
      </div>
      <div className="mt-2 text-sm text-muted-foreground">
        {(() => {
          let created: Date | null = null;
          if (r?.createdAt && typeof r.createdAt === 'object' && 'toDate' in r.createdAt) {
            try { created = (r.createdAt as any).toDate(); } catch {}
          } else if (typeof r?.createdAt === 'string' || typeof r?.createdAt === 'number') {
            try { created = new Date(r.createdAt); } catch {}
          }
          return (
            <span>
              Submitted on {created ? created.toLocaleString() : 'Unknown'}
            </span>
          );
        })()}
      </div>
      <div className="mt-2 text-sm">{r.description}</div>
      {isAdmin && (
        <div className="mt-2 text-sm text-muted-foreground">
          <div>Address: {r.address}</div>
          <div>Urgency: {r.urgency}</div>
          <div>Preferred Date: {r.preferredDate}</div>
        </div>
      )}
    </div>
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
    <div className="min-h-screen bg-background pb-20 lg:pb-0">
      <Header />
      <div className={`mx-auto px-4 sm:px-6 py-8 sm:py-12 ${isAdmin ? 'max-w-6xl' : 'max-w-3xl'}`}>
        <Card>
          <CardHeader>
            <CardTitle>
              {isAdmin ? 'Service Status Management' : 'Your Service Requests'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {/* Regular User View */}
            {!isAdmin && user && (
              <div>
                {userRequests.length > 0 ? (
                  <div className="space-y-3">
                    {userRequests.map(renderServiceRequest)}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground text-center py-8">
                    You don't have any service requests yet. 
                    <br />
                    <a href="/request" className="text-primary hover:underline">Submit a new request</a> to get started.
                  </p>
                )}
              </div>
            )}

            {/* Guest User View */}
            {!isAdmin && !user && (
              <div>
                <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto] gap-3">
                  <div>
                    <Label htmlFor="query">Ticket ID, Email, or Phone</Label>
                    <Input
                      id="query"
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      placeholder="e.g., SC-004 or you@example.com or +1-555-1234"
                      className="min-h-[44px]"
                    />
                  </div>
                  <div className="flex items-end">
                    <Button onClick={handleSearch} className="w-full sm:w-auto min-h-[44px]">Search</Button>
                  </div>
                </div>

                {error && <p className="text-sm text-destructive mt-3">{error}</p>}

                <div className="mt-6 space-y-3">
                  {results.map(renderServiceRequest)}
                  {results.length === 0 && !error && (
                    <p className="text-sm text-muted-foreground text-center py-8">
                      Enter your ticket ID, email, or phone number to view your service status.
                      <br />
                      <a href="/login" className="text-primary hover:underline">Sign in</a> to automatically view all your requests.
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Admin View */}
            {isAdmin && (
              <div>
                {/* Admin Filters */}
                <div className="mb-6 p-4 bg-muted rounded-lg">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="filterUser">Filter by Customer</Label>
                      <Select value={filterUser} onValueChange={setFilterUser}>
                        <SelectTrigger>
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

                    <div>
                      <Label htmlFor="filterEmail">Filter by Email</Label>
                      <Select value={filterEmail} onValueChange={setFilterEmail}>
                        <SelectTrigger>
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

                    <div>
                      <Label htmlFor="filterStatus">Filter by Status</Label>
                      <Select value={filterStatus} onValueChange={setFilterStatus}>
                        <SelectTrigger>
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

                    <div>
                      <Label htmlFor="filterDateFrom">From Date</Label>
                      <Input
                        id="filterDateFrom"
                        type="date"
                        value={filterDateFrom}
                        onChange={(e) => setFilterDateFrom(e.target.value)}
                      />
                    </div>

                    <div>
                      <Label htmlFor="filterDateTo">To Date</Label>
                      <Input
                        id="filterDateTo"
                        type="date"
                        value={filterDateTo}
                        onChange={(e) => setFilterDateTo(e.target.value)}
                      />
                    </div>

                    <div className="flex items-end">
                      <Button onClick={clearFilters} variant="outline" className="w-full">
                        Clear Filters
                      </Button>
                    </div>
                  </div>

                  {/* Manual Search for Admin */}
                  <div className="mt-4 grid grid-cols-1 sm:grid-cols-[1fr_auto] gap-3">
                    <div>
                      <Label htmlFor="adminQuery">Manual Search (Ticket ID, Email, Phone)</Label>
                      <Input
                        id="adminQuery"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="e.g., SC-004 or customer@email.com"
                      />
                    </div>
                    <div className="flex items-end">
                      <Button onClick={handleSearch} className="w-full sm:w-auto">Search</Button>
                    </div>
                  </div>
                </div>

                {error && <p className="text-sm text-destructive mb-3">{error}</p>}

                {/* Results Display */}
                <div className="space-y-3">
                  {query && results.length > 0 ? (
                    // Show search results when admin has searched
                    results.map(renderServiceRequest)
                  ) : (
                    // Show filtered results when no search query
                    <>
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-semibold">
                          All Service Requests ({filteredAdminRequests.length})
                        </h3>
                      </div>
                      {filteredAdminRequests.length > 0 ? (
                        filteredAdminRequests.map(renderServiceRequest)
                      ) : (
                        <p className="text-sm text-muted-foreground text-center py-8">
                          No service requests found matching the current filters.
                        </p>
                      )}
                    </>
                  )}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}


