import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { useAuth } from '../contexts/AuthContext';
import { ConfirmationResult } from 'firebase/auth';
import { toast } from 'sonner';
import { validatePhoneNumber, formatPhoneNumber, validateIndianPhoneNumber } from '../lib/auth-utils';

interface PhoneLoginProps {
  onClose: () => void;
}

const PhoneLogin: React.FC<PhoneLoginProps> = ({ onClose }) => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [step, setStep] = useState<'phone' | 'verify'>('phone');
  const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { signInWithPhone, verifyPhoneCode } = useAuth();


  const handleSendCode = async () => {
    if (!phoneNumber.trim()) {
      setError('Please enter a phone number');
      return;
    }

    setError('');
    setLoading(true);
    
    try {
      // Format phone number
      const formattedPhone = formatPhoneNumber(phoneNumber);
      
      // Validate phone number (use Indian-specific validation)
      if (!validateIndianPhoneNumber(formattedPhone)) {
        setError('Please enter a valid Indian mobile number (e.g., +919876543210 or 9876543210)');
        setLoading(false);
        return;
      }

      // Send verification code
      const result = await signInWithPhone(formattedPhone);
      setConfirmationResult(result);
      setStep('verify');
      setPhoneNumber(formattedPhone); // Update with formatted number
    } catch (error: unknown) {
      console.error('Error sending code:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to send verification code';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyCode = async () => {
    if (!verificationCode.trim() || !confirmationResult) {
      setError('Please enter the verification code');
      return;
    }

    setError('');
    setLoading(true);
    
    try {
      await verifyPhoneCode(confirmationResult, verificationCode);
      onClose();
    } catch (error: unknown) {
      console.error('Error verifying code:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to verify code';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    setStep('phone');
    setConfirmationResult(null);
    setVerificationCode('');
    setError('');
  };

  const handlePhoneNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPhoneNumber(value);
    setError(''); // Clear error when user starts typing
  };

  const handleVerificationCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, ''); // Only allow digits
    setVerificationCode(value);
    setError(''); // Clear error when user starts typing
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
          {error && (
            <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">
              {error}
            </div>
          )}
          
          {step === 'phone' ? (
            <>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="+919876543210 or 9876543210"
                  value={phoneNumber}
                  onChange={handlePhoneNumberChange}
                  disabled={loading}
                  className={error ? 'border-red-500' : ''}
                />
                <p className="text-sm text-gray-500">
                  Enter 10-digit Indian mobile number (starts with 6, 7, 8, or 9) or include +91
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
                  onChange={handleVerificationCodeChange}
                  disabled={loading}
                  maxLength={6}
                  className={error ? 'border-red-500' : ''}
                />
                <p className="text-sm text-gray-500">
                  Code sent to {phoneNumber}
                </p>
              </div>
              <div className="flex space-x-2">
                <Button 
                  onClick={handleVerifyCode} 
                  disabled={loading || !verificationCode.trim() || verificationCode.length !== 6}
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