import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useAdmin } from '../contexts/AdminContext';
import { useService } from '../contexts/ServiceContext';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { LogOut, Shield, Users, Settings, BarChart3, FileText, TrendingUp, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import EmailVerification from '@/components/EmailVerification';
import ServiceRequestsManager from '../components/admin/ServiceRequestsManager';
import UserManager from '../components/admin/UserManager';
import { getServiceStatistics } from '../utils/exportUtils';

const AdminDashboard: React.FC = () => {
  const { user, signOut } = useAuth();
  const { users, allServiceRequests, loading } = useAdmin();
  const [activeTab, setActiveTab] = useState('overview');

  // Calculate statistics
  const stats = getServiceStatistics(allServiceRequests);
  const totalUsers = users.length;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold text-gray-900">
                Satisfied Computers
              </h1>
              <Badge variant="destructive" className="ml-3">
                Admin Portal
              </Badge>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">
                Welcome, Admin
              </span>
              <Button variant="outline" onClick={signOut}>
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {/* Email Verification Check */}
        <EmailVerification />
        <div className="px-4 py-6 sm:px-0">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Admin Dashboard
            </h2>
            <p className="text-gray-600">
              Manage users, service requests, and system settings
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {/* Stats Cards */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Users
                </CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{loading ? '...' : totalUsers}</div>
                <p className="text-xs text-muted-foreground">
                  Registered customers
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Requests
                </CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{loading ? '...' : stats.total}</div>
                <p className="text-xs text-muted-foreground">
                  {stats.pending} pending, {stats.inProgress} active
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Completed Today
                </CardTitle>
                <CheckCircle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{loading ? '...' : stats.completedToday}</div>
                <p className="text-xs text-muted-foreground">
                  {stats.completed} total completed
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  System Status
                </CardTitle>
                <Settings className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">Online</div>
                <p className="text-xs text-muted-foreground">
                  All systems operational
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Main Admin Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="requests">Service Requests</TabsTrigger>
              <TabsTrigger value="users">User Management</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Quick Actions */}
                <Card>
                  <CardHeader>
                    <CardTitle>Quick Actions</CardTitle>
                    <CardDescription>
                      Common administrative tasks
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Button 
                      className="w-full justify-start" 
                      variant="outline"
                      onClick={() => setActiveTab('requests')}
                    >
                      <FileText className="w-4 h-4 mr-2" />
                      View All Service Requests
                    </Button>
                    <Button 
                      className="w-full justify-start" 
                      variant="outline"
                      onClick={() => setActiveTab('users')}
                    >
                      <Users className="w-4 h-4 mr-2" />
                      Manage Users
                    </Button>
                    <Button 
                      className="w-full justify-start" 
                      variant="outline"
                      onClick={() => setActiveTab('analytics')}
                    >
                      <TrendingUp className="w-4 h-4 mr-2" />
                      View Analytics
                    </Button>
                  </CardContent>
                </Card>

                {/* Service Type Breakdown */}
                <Card>
                  <CardHeader>
                    <CardTitle>Service Type Breakdown</CardTitle>
                    <CardDescription>
                      Distribution of service requests by type
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {loading ? (
                      <div className="text-center py-4">Loading...</div>
                    ) : (
                      <div className="space-y-3">
                        {Object.entries(stats.serviceTypeStats).map(([type, count]) => (
                          <div key={type} className="flex items-center justify-between">
                            <span className="text-sm">{type}</span>
                            <Badge variant="outline">{count}</Badge>
                          </div>
                        ))}
                        {Object.keys(stats.serviceTypeStats).length === 0 && (
                          <p className="text-muted-foreground text-center py-4">No service requests yet</p>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Status Overview */}
                <Card>
                  <CardHeader>
                    <CardTitle>Request Status Overview</CardTitle>
                    <CardDescription>
                      Current status of all service requests
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-yellow-500" />
                          <span className="text-sm">Pending</span>
                        </div>
                        <Badge variant="secondary">{stats.pending}</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <AlertCircle className="w-4 h-4 text-blue-500" />
                          <span className="text-sm">In Progress</span>
                        </div>
                        <Badge variant="default">{stats.inProgress}</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-500" />
                          <span className="text-sm">Completed</span>
                        </div>
                        <Badge variant="outline" className="text-green-600 border-green-600">{stats.completed}</Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Recent Activity */}
                <Card>
                  <CardHeader>
                    <CardTitle>Recent Service Requests</CardTitle>
                    <CardDescription>
                      Latest service requests from customers
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {loading ? (
                      <div className="text-center py-4">Loading...</div>
                    ) : allServiceRequests.length === 0 ? (
                      <div className="text-center py-8">
                        <p className="text-gray-500">No service requests yet</p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {allServiceRequests.slice(0, 5).map((request) => (
                          <div key={request.id} className="flex items-center justify-between p-3 border rounded-lg">
                            <div>
                              <p className="text-sm font-medium">{request.customerName}</p>
                              <p className="text-xs text-muted-foreground">{request.serviceType}</p>
                            </div>
                            <Badge variant={
                              request.status === 'Completed' ? 'outline' :
                              request.status === 'In Progress' ? 'default' : 'secondary'
                            }>
                              {request.status}
                            </Badge>
                          </div>
                        ))}
                        {allServiceRequests.length > 5 && (
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="w-full"
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

            <TabsContent value="requests">
              <ServiceRequestsManager />
            </TabsContent>

            <TabsContent value="users">
              <UserManager />
            </TabsContent>

            <TabsContent value="analytics" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Analytics Dashboard</CardTitle>
                  <CardDescription>
                    Detailed analytics and reporting
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div className="text-center p-6 border rounded-lg">
                      <h3 className="text-2xl font-bold">{stats.total}</h3>
                      <p className="text-sm text-muted-foreground">Total Requests</p>
                    </div>
                    <div className="text-center p-6 border rounded-lg">
                      <h3 className="text-2xl font-bold">{totalUsers}</h3>
                      <p className="text-sm text-muted-foreground">Total Users</p>
                    </div>
                    <div className="text-center p-6 border rounded-lg">
                      <h3 className="text-2xl font-bold">{stats.completedToday}</h3>
                      <p className="text-sm text-muted-foreground">Completed Today</p>
                    </div>
                  </div>
                  
                  <div className="mt-6">
                    <h4 className="text-lg font-medium mb-4">Urgency Distribution</h4>
                    <div className="space-y-2">
                      {Object.entries(stats.urgencyStats).map(([urgency, count]) => (
                        <div key={urgency} className="flex items-center justify-between p-2 border rounded">
                          <span>{urgency} Priority</span>
                          <Badge variant={
                            urgency === 'High' ? 'destructive' :
                            urgency === 'Medium' ? 'default' : 'secondary'
                          }>
                            {count}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;