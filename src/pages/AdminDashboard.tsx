import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useAdmin } from '../contexts/AdminContext';
import { useService } from '../contexts/ServiceContext';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Users, BarChart3, FileText, TrendingUp, Clock, CheckCircle, AlertCircle, Home } from 'lucide-react';
import EmailVerification from '@/components/EmailVerification';
import ServiceRequestsManager from '../components/admin/ServiceRequestsManager';
import UserManager from '../components/admin/UserManager';
import HomePageSettings from '../components/admin/HomePageSettings';
import { getServiceStatistics } from '../utils/exportUtils';
import Header from '../components/Header';

const AdminDashboard: React.FC = () => {
  const { user, signOut } = useAuth();
  const { users, allServiceRequests, loading } = useAdmin();
  const [activeTab, setActiveTab] = useState('overview');

  // Calculate statistics
  const stats = getServiceStatistics(allServiceRequests);
  const totalUsers = users.length;

  return (
    <div className="min-h-screen bg-background pb-20 lg:pb-0">
      {/* Header with Hamburger Menu */}
      <Header />

      {/* Main Content */}
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 max-w-7xl animate-fade-in">
        {/* Email Verification Check */}
        <EmailVerification />
        
        <div className="space-y-6">
          {/* Page Title */}
          <div className="space-y-2">
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="text-2xl sm:text-3xl font-bold">Admin Dashboard</h1>
              <Badge variant="destructive" className="h-6">Admin Portal</Badge>
            </div>
            <p className="text-muted-foreground text-sm sm:text-base">
              Manage users, service requests, and system settings
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            <Card className="hover-scale transition-all">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Users
                </CardTitle>
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <Users className="h-4 w-4 text-primary" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl sm:text-3xl font-bold">{loading ? '...' : totalUsers}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  Registered customers
                </p>
              </CardContent>
            </Card>

            <Card className="hover-scale transition-all">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Requests
                </CardTitle>
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <FileText className="h-4 w-4 text-primary" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl sm:text-3xl font-bold">{loading ? '...' : stats.total}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  {stats.pending} pending, {stats.inProgress} active
                </p>
              </CardContent>
            </Card>

            <Card className="hover-scale transition-all">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Completed Today
                </CardTitle>
                <div className="w-8 h-8 rounded-full bg-green-100 dark:bg-green-900/20 flex items-center justify-center">
                  <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl sm:text-3xl font-bold">{loading ? '...' : stats.completedToday}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  {stats.completed} total completed
                </p>
              </CardContent>
            </Card>

            <Card className="hover-scale transition-all">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  System Status
                </CardTitle>
                <div className="w-8 h-8 rounded-full bg-green-100 dark:bg-green-900/20 flex items-center justify-center">
                  <BarChart3 className="h-4 w-4 text-green-600 dark:text-green-400" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl sm:text-3xl font-bold text-green-600 dark:text-green-400">Online</div>
                <p className="text-xs text-muted-foreground mt-1">
                  All systems operational
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Main Admin Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <div className="border-b overflow-x-auto">
              <TabsList className="inline-flex w-full sm:w-auto min-w-full sm:min-w-0 h-auto p-0 bg-transparent">
                <TabsTrigger value="overview" className="flex-1 sm:flex-none rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-4 py-3">
                  Overview
                </TabsTrigger>
                <TabsTrigger value="requests" className="flex-1 sm:flex-none rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-4 py-3">
                  Requests
                </TabsTrigger>
                <TabsTrigger value="users" className="flex-1 sm:flex-none rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-4 py-3">
                  Users
                </TabsTrigger>
                <TabsTrigger value="analytics" className="flex-1 sm:flex-none rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-4 py-3">
                  Analytics
                </TabsTrigger>
                <TabsTrigger value="homepage" className="flex-1 sm:flex-none rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-4 py-3">
                  Home Page
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="overview" className="space-y-4 sm:space-y-6 animate-fade-in">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                {/* Quick Actions */}
                <Card className="h-fit">
                  <CardHeader>
                    <CardTitle className="text-lg sm:text-xl">Quick Actions</CardTitle>
                    <CardDescription className="text-sm">
                      Common administrative tasks
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-2 sm:space-y-3">
                    <Button 
                      className="w-full justify-start h-11" 
                      variant="outline"
                      onClick={() => setActiveTab('requests')}
                    >
                      <FileText className="w-4 h-4 mr-2 flex-shrink-0" />
                      <span className="truncate">View All Service Requests</span>
                    </Button>
                    <Button 
                      className="w-full justify-start h-11" 
                      variant="outline"
                      onClick={() => setActiveTab('users')}
                    >
                      <Users className="w-4 h-4 mr-2 flex-shrink-0" />
                      <span className="truncate">Manage Users</span>
                    </Button>
                    <Button 
                      className="w-full justify-start h-11" 
                      variant="outline"
                      onClick={() => setActiveTab('analytics')}
                    >
                      <TrendingUp className="w-4 h-4 mr-2 flex-shrink-0" />
                      <span className="truncate">View Analytics</span>
                    </Button>
                    <Button 
                      className="w-full justify-start h-11" 
                      variant="outline"
                      onClick={() => setActiveTab('homepage')}
                    >
                      <Home className="w-4 h-4 mr-2 flex-shrink-0" />
                      <span className="truncate">Edit Home Page</span>
                    </Button>
                  </CardContent>
                </Card>

                {/* Service Type Breakdown */}
                <Card className="h-fit">
                  <CardHeader>
                    <CardTitle className="text-lg sm:text-xl">Service Type Breakdown</CardTitle>
                    <CardDescription className="text-sm">
                      Distribution of service requests by type
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {loading ? (
                      <div className="text-center py-8 text-muted-foreground">Loading...</div>
                    ) : (
                      <div className="space-y-3">
                        {Object.entries(stats.serviceTypeStats).map(([type, count]) => (
                          <div key={type} className="flex items-center justify-between p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
                            <span className="text-sm font-medium">{type}</span>
                            <Badge variant="outline" className="font-semibold">{count}</Badge>
                          </div>
                        ))}
                        {Object.keys(stats.serviceTypeStats).length === 0 && (
                          <p className="text-muted-foreground text-center py-8 text-sm">No service requests yet</p>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Status Overview */}
                <Card className="h-fit">
                  <CardHeader>
                    <CardTitle className="text-lg sm:text-xl">Request Status Overview</CardTitle>
                    <CardDescription className="text-sm">
                      Current status of all service requests
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 rounded-lg bg-yellow-50 dark:bg-yellow-900/10 border border-yellow-200 dark:border-yellow-900/20">
                        <div className="flex items-center gap-2">
                          <Clock className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
                          <span className="text-sm font-medium">Pending</span>
                        </div>
                        <Badge variant="secondary" className="text-base font-semibold">{stats.pending}</Badge>
                      </div>
                      <div className="flex items-center justify-between p-3 rounded-lg bg-blue-50 dark:bg-blue-900/10 border border-blue-200 dark:border-blue-900/20">
                        <div className="flex items-center gap-2">
                          <AlertCircle className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                          <span className="text-sm font-medium">In Progress</span>
                        </div>
                        <Badge variant="default" className="text-base font-semibold">{stats.inProgress}</Badge>
                      </div>
                      <div className="flex items-center justify-between p-3 rounded-lg bg-green-50 dark:bg-green-900/10 border border-green-200 dark:border-green-900/20">
                        <div className="flex items-center gap-2">
                          <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                          <span className="text-sm font-medium">Completed</span>
                        </div>
                        <Badge variant="outline" className="text-base font-semibold text-green-600 dark:text-green-400 border-green-600">{stats.completed}</Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Recent Activity */}
                <Card className="h-fit">
                  <CardHeader>
                    <CardTitle className="text-lg sm:text-xl">Recent Service Requests</CardTitle>
                    <CardDescription className="text-sm">
                      Latest service requests from customers
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {loading ? (
                      <div className="text-center py-8 text-muted-foreground">Loading...</div>
                    ) : allServiceRequests.length === 0 ? (
                      <div className="text-center py-8">
                        <FileText className="w-12 h-12 mx-auto text-muted-foreground/50 mb-2" />
                        <p className="text-muted-foreground text-sm">No service requests yet</p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {allServiceRequests.slice(0, 5).map((request) => (
                          <div key={request.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3 border rounded-lg hover:bg-muted/30 transition-colors">
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium truncate">{request.customerName}</p>
                              <p className="text-xs text-muted-foreground truncate">{request.serviceType}</p>
                            </div>
                            <Badge 
                              variant={
                                request.status === 'Completed' ? 'outline' :
                                request.status === 'In Progress' ? 'default' : 'secondary'
                              }
                              className="self-start sm:self-center flex-shrink-0"
                            >
                              {request.status}
                            </Badge>
                          </div>
                        ))}
                        {allServiceRequests.length > 5 && (
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="w-full mt-2"
                            onClick={() => setActiveTab('requests')}
                          >
                            View All Requests
                          </Button>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="requests" className="animate-fade-in">
              <ServiceRequestsManager />
            </TabsContent>
            <TabsContent value="users" className="animate-fade-in">
              <UserManager />
            </TabsContent>

            <TabsContent value="analytics" className="space-y-4 sm:space-y-6 animate-fade-in">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg sm:text-xl">Analytics Dashboard</CardTitle>
                  <CardDescription className="text-sm">
                    Detailed analytics and reporting
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div className="text-center p-6 border rounded-lg bg-card hover:bg-muted/30 transition-colors">
                      <h3 className="text-3xl font-bold text-primary">{stats.total}</h3>
                      <p className="text-sm text-muted-foreground mt-2">Total Requests</p>
                    </div>
                    <div className="text-center p-6 border rounded-lg bg-card hover:bg-muted/30 transition-colors">
                      <h3 className="text-3xl font-bold text-primary">{totalUsers}</h3>
                      <p className="text-sm text-muted-foreground mt-2">Total Users</p>
                    </div>
                    <div className="text-center p-6 border rounded-lg bg-card hover:bg-muted/30 transition-colors">
                      <h3 className="text-3xl font-bold text-primary">{stats.completedToday}</h3>
                      <p className="text-sm text-muted-foreground mt-2">Completed Today</p>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-base sm:text-lg font-medium mb-4">Urgency Distribution</h4>
                    <div className="space-y-3">
                      {Object.entries(stats.urgencyStats).map(([urgency, count]) => (
                        <div key={urgency} className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/30 transition-colors">
                          <span className="font-medium">{urgency} Priority</span>
                          <Badge variant={
                            urgency === 'High' ? 'destructive' :
                            urgency === 'Medium' ? 'default' : 'secondary'
                          } className="text-base font-semibold">
                            {count}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="homepage" className="space-y-4 sm:space-y-6 animate-fade-in">
              <HomePageSettings />
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );

};

export default AdminDashboard;