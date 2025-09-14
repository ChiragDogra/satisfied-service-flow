import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useService, ServiceRequest } from '@/contexts/ServiceContext';
import Header from '@/components/Header';
import { Search, Clock, CheckCircle, AlertCircle, Phone, Mail } from 'lucide-react';

const StatusIcon = ({ status }: { status: string }) => {
  switch (status) {
    case 'Pending':
      return <Clock className="h-5 w-5 text-warning" />;
    case 'In Progress':
      return <AlertCircle className="h-5 w-5 text-primary" />;
    case 'Completed':
      return <CheckCircle className="h-5 w-5 text-success" />;
    default:
      return <Clock className="h-5 w-5 text-muted-foreground" />;
  }
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

const ProgressTracker = ({ status }: { status: string }) => {
  const steps = ['Pending', 'In Progress', 'Completed'];
  const currentIndex = steps.indexOf(status);
  
  return (
    <div className="flex items-center justify-between w-full max-w-md mx-auto">
      {steps.map((step, index) => (
        <div key={step} className="flex items-center">
          <div className={`flex items-center justify-center w-8 h-8 rounded-full border-2 transition-colors ${
            index <= currentIndex 
              ? 'bg-primary border-primary text-primary-foreground' 
              : 'border-muted-foreground text-muted-foreground'
          }`}>
            {index <= currentIndex ? (
              <CheckCircle className="h-4 w-4" />
            ) : (
              <span className="text-xs font-medium">{index + 1}</span>
            )}
          </div>
          {index < steps.length - 1 && (
            <div className={`w-16 h-0.5 mx-2 transition-colors ${
              index < currentIndex ? 'bg-primary' : 'bg-muted-foreground/30'
            }`} />
          )}
        </div>
      ))}
    </div>
  );
};

const ServiceCard = ({ request }: { request: ServiceRequest }) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <StatusIcon status={request.status} />
            Ticket #{request.id}
          </CardTitle>
          <StatusBadge status={request.status} />
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-muted-foreground">Service:</span>
            <p className="font-medium">{request.serviceType}</p>
          </div>
          <div>
            <span className="text-muted-foreground">Urgency:</span>
            <p className="font-medium">{request.urgency}</p>
          </div>
          <div>
            <span className="text-muted-foreground">Submitted:</span>
            <p>{formatDate(request.createdAt)}</p>
          </div>
          <div>
            <span className="text-muted-foreground">Last Updated:</span>
            <p>{formatDate(request.updatedAt)}</p>
          </div>
        </div>
        
        <div>
          <span className="text-muted-foreground text-sm">Description:</span>
          <p className="mt-1 text-sm">{request.description}</p>
        </div>
        
        <div className="pt-4">
          <p className="text-sm text-muted-foreground mb-3">Progress Status</p>
          <ProgressTracker status={request.status} />
        </div>
      </CardContent>
    </Card>
  );
};

export default function CustomerDashboard() {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<ServiceRequest[]>([]);
  const [hasSearched, setHasSearched] = useState(false);
  const { getRequestsByContact } = useService();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;
    
    const results = getRequestsByContact(searchTerm.trim());
    setSearchResults(results);
    setHasSearched(true);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="mx-auto max-w-4xl px-4 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-4">Service Status Tracker</h1>
          <p className="text-muted-foreground">
            Enter your email address or phone number to view your service requests and track their progress.
          </p>
        </div>

        {/* Search Form */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5" />
              Look Up Your Service Requests
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSearch} className="flex gap-4">
              <div className="flex-1">
                <Label htmlFor="search" className="sr-only">
                  Email or Phone Number
                </Label>
                <Input
                  id="search"
                  type="text"
                  placeholder="Enter your email address or phone number"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full"
                />
              </div>
              <Button type="submit" size="lg">
                <Search className="h-4 w-4 mr-2" />
                Search
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Search Results */}
        {hasSearched && (
          <div className="space-y-6">
            {searchResults.length > 0 ? (
              <>
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold">
                    Found {searchResults.length} service request{searchResults.length !== 1 ? 's' : ''}
                  </h2>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setSearchTerm('');
                      setSearchResults([]);
                      setHasSearched(false);
                    }}
                  >
                    New Search
                  </Button>
                </div>
                
                <div className="grid gap-6">
                  {searchResults.map((request) => (
                    <ServiceCard key={request.id} request={request} />
                  ))}
                </div>
              </>
            ) : (
              <Card>
                <CardContent className="text-center py-12">
                  <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No Service Requests Found</h3>
                  <p className="text-muted-foreground mb-6">
                    We couldn't find any service requests associated with "{searchTerm}".
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <Button
                      variant="outline"
                      onClick={() => {
                        setSearchTerm('');
                        setHasSearched(false);
                      }}
                    >
                      Try Different Contact Info
                    </Button>
                    <Button asChild>
                      <a href="/request">Submit New Request</a>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {/* Help Section */}
        {!hasSearched && (
          <Card className="mt-8">
            <CardHeader>
              <CardTitle>Need Help?</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-start space-x-3">
                  <Phone className="h-5 w-5 text-primary mt-1" />
                  <div>
                    <h4 className="font-medium mb-1">Call Us</h4>
                    <p className="text-sm text-muted-foreground mb-2">
                      Speak directly with our support team
                    </p>
                    <p className="text-sm font-medium">(555) 123-TECH</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <Mail className="h-5 w-5 text-primary mt-1" />
                  <div>
                    <h4 className="font-medium mb-1">Email Support</h4>
                    <p className="text-sm text-muted-foreground mb-2">
                      Get help via email within 24 hours
                    </p>
                    <p className="text-sm font-medium">service@satisfiedcomputers.com</p>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 p-4 bg-muted/50 rounded-lg">
                <h4 className="font-medium mb-2">Tips for Finding Your Request:</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Use the same email or phone number you provided when submitting the request</li>
                  <li>• Check your email for the confirmation with your ticket number</li>
                  <li>• If you can't find your request, contact us with your ticket number</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}