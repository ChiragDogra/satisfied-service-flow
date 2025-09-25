import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { useAuth } from '../contexts/AuthContext';
import { ConfirmationResult } from 'firebase/auth';

interface PhoneLoginProps {
  onClose: () => void;
}

const PhoneLogin: React.FC<PhoneLoginProps> = ({ onClose }) => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [step, setStep] = useState<'phone' | 'verify'>('phone');
  const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null);
  const [loading, setLoading] = useState(false);
// Phone authentication not implemented yet - commenting out for now
// const { signInWithPhone, verifyPhoneCode } = useAuth();

  const handleSendCode = async () => {
    if (!phoneNumber.trim()) {
      return;
    }

    setLoading(true);
    try {
      // Phone authentication not implemented yet
      console.error('Phone authentication not yet implemented');
      // TODO: Implement phone authentication
    } catch (error) {
      console.error('Error sending code:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyCode = async () => {
    if (!verificationCode.trim() || !confirmationResult) {
      return;
    }

    setLoading(true);
    try {
      // Phone authentication not implemented yet
      console.error('Phone verification not yet implemented');
      // TODO: Implement phone verification
      onClose();
    } catch (error) {
      console.error('Error verifying code:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    setStep('phone');
    setConfirmationResult(null);
    setVerificationCode('');
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <Card className="w-full max-w-md mx-4">
        <CardHeader>
          <CardTitle>Phone Number Login</CardTitle>
          <CardDescription>
            {step === 'phone' 
              ? 'Enter your phone number to receive a verification code'
              : 'Enter the verification code sent to your phone'
            }
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {step === 'phone' ? (
            <>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="+1234567890"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  disabled={loading}
                />
                <p className="text-sm text-gray-500">
                  Include country code (e.g., +1 for US)
                </p>
              </div>
              <div className="flex space-x-2">
                <Button 
                  onClick={handleSendCode} 
                  disabled={loading || !phoneNumber.trim()}
                  className="flex-1"
                >
                  {loading ? 'Sending...' : 'Send Code'}
                </Button>
                <Button variant="outline" onClick={onClose}>
                  Cancel
                </Button>
              </div>
            </>
          ) : (
            <>
              <div className="space-y-2">
                <Label htmlFor="code">Verification Code</Label>
                <Input
                  id="code"
                  type="text"
                  placeholder="123456"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value)}
                  disabled={loading}
                />
                <p className="text-sm text-gray-500">
                  Code sent to {phoneNumber}
                </p>
              </div>
              <div className="flex space-x-2">
                <Button 
                  onClick={handleVerifyCode} 
                  disabled={loading || !verificationCode.trim()}
                  className="flex-1"
                >
                  {loading ? 'Verifying...' : 'Verify Code'}
                </Button>
                <Button variant="outline" onClick={handleBack}>
                  Back
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>
      
      {/* reCAPTCHA container */}
      <div id="recaptcha-container"></div>
    </div>
  );
};

export default PhoneLogin;




