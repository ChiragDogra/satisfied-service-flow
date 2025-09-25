import React, { useMemo, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { LogOut, User, Mail, Phone, Calendar, Home } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useService } from '@/contexts/ServiceContext';
const CustomerDashboard: React.FC = () => {
  const {
    user,
    userProfile,
    signOut
  } = useAuth();
  const {
    requests
  } = useService();
  const historyRef = useRef<HTMLDivElement | null>(null);
  const myRequests = useMemo(() => {
    if (!user?.uid) return [] as any[];
    return requests.filter(r => r.userId === user.uid).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [requests, user?.uid]);
  return <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold text-gray-900">
                Satisfied Computers
              </h1>
              <Badge variant="secondary" className="ml-3">
                Customer Portal
              </Badge>
            </div>
            <div className="flex items-center space-x-4">
              <Button asChild variant="outline">
                
              </Button>
              <span className="text-sm text-gray-600">
                Welcome, {userProfile?.name || user?.displayName || 'Customer'}
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
        <div className="px-4 py-6 sm:px-0">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Welcome to Your Dashboard
            </h2>
            <p className="text-gray-600">
              Manage your service requests and account information
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Profile Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <User className="w-5 h-5 mr-2" />
                  Profile Information
                </CardTitle>
                <CardDescription>
                  Your account details
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Mail className="w-4 h-4 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Email</p>
                    <p className="text-sm text-gray-600">{user?.email}</p>
                  </div>
                </div>
                
                {userProfile?.phone && <div className="flex items-center space-x-3">
                    <Phone className="w-4 h-4 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">Phone</p>
                      <p className="text-sm text-gray-600">{userProfile.phone}</p>
                    </div>
                  </div>}

                {userProfile?.createdAt && <div className="flex items-center space-x-3">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">Member Since</p>
                      <p className="text-sm text-gray-600">
                        {new Date(userProfile.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>}
              </CardContent>
            </Card>

            {/* Service Requests */}
            <Card>
              <CardHeader>
                <CardTitle>Service Requests</CardTitle>
                <CardDescription>
                  Track your service requests
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <p className="text-gray-500 mb-4">No service requests yet</p>
                  <Button asChild>
                    <Link to="/request">Create New Request</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>
                  Common tasks and shortcuts
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full justify-start" variant="outline">
                  Update Profile
                </Button>
                <Button className="w-full justify-start" variant="outline" onClick={() => historyRef.current?.scrollIntoView({
                behavior: 'smooth'
              })}>
                  View Service History
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  Contact Support
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity */}
          <Card className="mt-6" ref={historyRef}>
            <CardHeader>
              <CardTitle>Your Service History</CardTitle>
              <CardDescription>
                All your submitted requests and their current status
              </CardDescription>
            </CardHeader>
            <CardContent>
              {myRequests.length === 0 ? <div className="text-center py-8">
                  <p className="text-gray-500">No requests yet. Create your first request.</p>
                </div> : <div className="space-y-3">
                  {myRequests.map(r => <div key={r.id} className="rounded-md border p-4">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                        <div>
                          <div className="font-semibold">{r.id}</div>
                          <div className="text-sm text-gray-600">{r.serviceType}</div>
                        </div>
                        <div className="text-sm">
                          <span className="px-2 py-1 rounded bg-gray-100">{r.status}</span>
                        </div>
                      </div>
                      <div className="mt-2 text-sm text-gray-600">
                        Submitted on {new Date(r.createdAt).toLocaleString()}
                      </div>
                      <div className="mt-2 text-sm">{r.description}</div>
                    </div>)}
                </div>}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>;
};
export default CustomerDashboard;