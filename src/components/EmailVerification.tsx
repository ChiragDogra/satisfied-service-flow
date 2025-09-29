import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { useAuth } from '../contexts/AuthContext';
import { checkEmailVerificationStatus } from '../lib/auth-utils';
import { toast } from 'sonner';
import { AlertCircle, Mail } from 'lucide-react';
import { Alert, AlertDescription } from './ui/alert';

const EmailVerification: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [verifying, setVerifying] = useState(true);
  const [isVerified, setIsVerified] = useState(false);
  const { user, sendEmailVerification } = useAuth();

  useEffect(() => {
    checkVerification();
  }, [user]);

  const checkVerification = async () => {
    if (!user) return;
    setVerifying(true);
    try {
      const verified = await checkEmailVerificationStatus(user);
      setIsVerified(verified);
    } catch (error) {
      console.error('Verification check error:', error);
    } finally {
      setVerifying(false);
    }
  };

  const handleResendVerification = async () => {
    setLoading(true);
    try {
      const success = await sendEmailVerification();
      if (success) {
        toast.success('Verification email sent! Please check your inbox.');
      }
    } catch (error) {
      toast.error('Failed to send verification email. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;
  if (isVerified) return null;

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertCircle className="h-5 w-5 text-yellow-500" />
          Email Verification Required
        </CardTitle>
        <CardDescription>
          Please verify your email address to access all features.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Alert className="mb-4 border-yellow-500 bg-yellow-50">
          <AlertDescription>
            A verification email has been sent to <strong>{user.email}</strong>.
            Please check your inbox and click the verification link.
          </AlertDescription>
        </Alert>

        <div className="space-y-4">
          <Button
            onClick={handleResendVerification}
            disabled={loading}
            variant="outline"
            className="w-full"
          >
            <Mail className="mr-2 h-4 w-4" />
            {loading ? 'Sending...' : 'Resend Verification Email'}
          </Button>
          
          <Button
            onClick={checkVerification}
            disabled={verifying}
            variant="ghost"
            className="w-full"
          >
            {verifying ? 'Checking...' : 'Check Verification Status'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default EmailVerification;