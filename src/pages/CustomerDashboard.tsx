import React, { useMemo, useRef, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useService } from '../contexts/ServiceContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Plus, FileText, Calendar, MapPin, Phone, Mail, User, History, Settings, MessageCircle, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import EmailVerification from '../components/EmailVerification';
import ProfileSettings from '../components/ProfileSettings';
import { formatDateForDisplay } from '../utils/exportUtils';
const CustomerDashboard: React.FC = () => {
  const { user, userProfile } = useAuth();
  const { requests } = useService();
  const historyRef = useRef<HTMLDivElement | null>(null);
  const [isProfileSettingsOpen, setIsProfileSettingsOpen] = useState(false);
  
  const myRequests = useMemo(() => {
    if (!user?.uid) return [] as any[];
    return requests.filter(r => r.userId === user.uid).sort((a, b) => {
      // Handle different timestamp formats for sorting
      const getTimestamp = (timestamp: unknown): number => {
        if (timestamp && typeof timestamp === 'object' && 'toDate' in timestamp) {
          return (timestamp as any).toDate().getTime();
        }
        if (typeof timestamp === 'string' || typeof timestamp === 'number') {
          return new Date(timestamp).getTime();
        }
        if (timestamp instanceof Date) {
          return timestamp.getTime();
        }
        return 0;
      };
      
      return getTimestamp(b.createdAt) - getTimestamp(a.createdAt);
    });
  }, [requests, user?.uid]);

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'pending':
        return 'bg-warning-light text-warning border-warning/20';
      case 'in-progress':
        return 'bg-primary-light text-primary border-primary/20';
      case 'completed':
        return 'bg-success-light text-success border-success/20';
      default:
        return 'bg-muted text-muted-foreground border-border';
    }
  };

  return (
    <div className="min-h-screen bg-background pb-20 lg:pb-0">
      <Header />
      
      {/* Email Verification Check */}
      <EmailVerification />
      
      {/* Hero Section */}
      <section className="bg-gradient-primary text-primary-foreground">
        <div className="max-w-7xl mx-auto px-4 py-8 sm:py-12 lg:py-16">
          <div className="text-center">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2">
              Welcome back, {userProfile?.name || user?.displayName || 'Customer'}!
            </h1>
            <p className="text-lg opacity-90 mb-6">
              Manage your service requests and account information
            </p>
            <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
              Customer Portal
            </Badge>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-6 sm:py-8 lg:py-12">
        {/* Quick Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card className="text-center">
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-primary">{myRequests.length}</div>
              <div className="text-sm text-muted-foreground">Total Requests</div>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-warning">{myRequests.filter(r => r.status === 'pending').length}</div>
              <div className="text-sm text-muted-foreground">Pending</div>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-primary">{myRequests.filter(r => r.status === 'in-progress').length}</div>
              <div className="text-sm text-muted-foreground">In Progress</div>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-success">{myRequests.filter(r => r.status === 'completed').length}</div>
              <div className="text-sm text-muted-foreground">Completed</div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Button asChild className="h-auto p-4 flex-col space-y-2">
              <Link to="/request">
                <Plus className="w-6 h-6" />
                <span>New Request</span>
              </Link>
            </Button>
            <Button variant="outline" className="h-auto p-4 flex-col space-y-2" onClick={() => historyRef.current?.scrollIntoView({ behavior: 'smooth' })}>
              <History className="w-6 h-6" />
              <span>View History</span>
            </Button>
            <Button 
              variant="outline" 
              className="h-auto p-4 flex-col space-y-2"
              onClick={() => setIsProfileSettingsOpen(true)}
            >
              <Settings className="w-6 h-6" />
              <span>Settings</span>
            </Button>
            <Button variant="outline" className="h-auto p-4 flex-col space-y-2">
              <MessageCircle className="w-6 h-6" />
              <span>Support</span>
            </Button>
          </div>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Profile Information */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center">
                <User className="w-5 h-5 mr-2" />
                Profile Information
              </CardTitle>
              <CardDescription>
                Your account details and contact information
              </CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Mail className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Email</p>
                  <p className="font-medium">{user?.email}</p>
                </div>
              </div>
              
              {userProfile?.phone && (
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                    <Phone className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Phone</p>
                    <p className="font-medium">{userProfile.phone}</p>
                  </div>
                </div>
              )}

              {userProfile?.createdAt && (
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                    <Calendar className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Member Since</p>
                    <p className="font-medium">
                      {formatDateForDisplay(userProfile.createdAt)}
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Service Overview */}
          <Card>
            <CardHeader>
              <CardTitle>Service Overview</CardTitle>
              <CardDescription>
                Your recent activity
              </CardDescription>
            </CardHeader>
            <CardContent>
              {myRequests.length === 0 ? (
                <div className="text-center py-6">
                  <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center mx-auto mb-3">
                    <Plus className="w-6 h-6 text-muted-foreground" />
                  </div>
                  <p className="text-muted-foreground mb-3">No service requests yet</p>
                  <Button asChild size="sm">
                    <Link to="/request">Create First Request</Link>
                  </Button>
                </div>
              ) : (
                <div className="space-y-3">
                  {myRequests.slice(0, 3).map(r => (
                    <div key={r.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{r.serviceType}</p>
                        <p className="text-sm text-muted-foreground">
                          {formatDateForDisplay(r.createdAt)}
                        </p>
                      </div>
                      <Badge className={getStatusColor(r.status)}>
                        {r.status}
                      </Badge>
                    </div>
                  ))}
                  {myRequests.length > 3 && (
                    <Button variant="ghost" size="sm" className="w-full" onClick={() => historyRef.current?.scrollIntoView({ behavior: 'smooth' })}>
                      View all {myRequests.length} requests
                      <ChevronRight className="w-4 h-4 ml-1" />
                    </Button>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Service History */}
        <Card ref={historyRef}>
          <CardHeader>
            <CardTitle>Service History</CardTitle>
            <CardDescription>
              All your submitted requests and their current status
            </CardDescription>
          </CardHeader>
          <CardContent>
            {myRequests.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-muted rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <History className="w-8 h-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-semibold mb-2">No requests yet</h3>
                <p className="text-muted-foreground mb-4">Create your first service request to get started</p>
                <Button asChild>
                  <Link to="/request">Create New Request</Link>
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {myRequests.map(r => (
                  <div key={r.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-semibold">{r.serviceType}</h3>
                          <Badge className={getStatusColor(r.status)}>
                            {r.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">
                          Request ID: {r.id}
                        </p>
                        <p className="text-sm text-muted-foreground mb-3">
                          Submitted on {formatDateForDisplay(r.createdAt)}
                        </p>
                        <p className="text-sm">{r.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </main>

      {/* Profile Settings Dialog */}
      <ProfileSettings 
        isOpen={isProfileSettingsOpen} 
        onClose={() => setIsProfileSettingsOpen(false)} 
      />
    </div>
  );
};

export default CustomerDashboard;