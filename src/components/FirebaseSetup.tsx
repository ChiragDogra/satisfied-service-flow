import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Alert, AlertDescription } from './ui/alert';
import { AlertTriangle, ExternalLink } from 'lucide-react';

const FirebaseSetup: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl w-full space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Firebase Setup Required
          </h1>
          <p className="text-gray-600">
            Please configure Firebase to use the authentication features
          </p>
        </div>

        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            Firebase is not configured. You need to set up your Firebase project and create a .env file.
          </AlertDescription>
        </Alert>

        <Card>
          <CardHeader>
            <CardTitle>Setup Instructions</CardTitle>
            <CardDescription>
              Follow these steps to get Firebase authentication working
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-semibold">
                  1
                </div>
                <div>
                  <h3 className="font-semibold">Create Firebase Project</h3>
                  <p className="text-sm text-gray-600">
                    Go to Firebase Console and create a new project
                  </p>
                  <Button asChild variant="outline" size="sm" className="mt-2">
                    <a href="https://console.firebase.google.com" target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Firebase Console
                    </a>
                  </Button>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-semibold">
                  2
                </div>
                <div>
                  <h3 className="font-semibold">Enable Authentication</h3>
                  <p className="text-sm text-gray-600">
                    Enable Email/Password, Google, Facebook, GitHub, and Phone authentication
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-semibold">
                  3
                </div>
                <div>
                  <h3 className="font-semibold">Create .env File</h3>
                  <p className="text-sm text-gray-600">
                    Create a .env file in your project root with Firebase configuration
                  </p>
                  <div className="mt-2 p-3 bg-gray-100 rounded-md text-sm font-mono">
                    VITE_FIREBASE_API_KEY=your_api_key_here<br/>
                    VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com<br/>
                    VITE_FIREBASE_PROJECT_ID=your_project_id_here<br/>
                    VITE_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com<br/>
                    VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id_here<br/>
                    VITE_FIREBASE_APP_ID=your_app_id_here
                  </div>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-semibold">
                  4
                </div>
                <div>
                  <h3 className="font-semibold">Create Admin User</h3>
                  <p className="text-sm text-gray-600">
                    In Firebase Console → Authentication → Users, add a user with email: admin@satisfiedcomputers.com
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-semibold">
                  5
                </div>
                <div>
                  <h3 className="font-semibold">Restart Development Server</h3>
                  <p className="text-sm text-gray-600">
                    After creating the .env file, restart your development server
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t">
              <p className="text-sm text-gray-600 mb-3">
                For detailed instructions, see the FIREBASE_SETUP.md file in your project root.
              </p>
              <Button onClick={() => window.location.reload()} className="w-full">
                Reload Page
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default FirebaseSetup;




