import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { useService } from '@/contexts/ServiceContext';
import { useAuth } from '@/contexts/AuthContext';
import Header from '@/components/Header';
import { Monitor, Printer, Camera, Network, Settings, ArrowLeft, CheckCircle } from 'lucide-react';

const serviceOptions = [
  { value: 'Computer Repair', label: 'Computer Repair', icon: Monitor },
  { value: 'Printer Repair', label: 'Printer Repair', icon: Printer },
  { value: 'CCTV Repair', label: 'CCTV Repair', icon: Camera },
  { value: 'Networking', label: 'Networking', icon: Network },
  { value: 'Other Services', label: 'Other Services', icon: Settings },
];

export default function ServiceRequest() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { addRequest } = useService();
  const { user, signInWithPhone, verifyPhoneCode } = useAuth();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [ticketNumber, setTicketNumber] = useState('');
  
  const [formData, setFormData] = useState({
    customerName: '',
    email: '',
    phone: '',
    address: '',
    serviceType: '',
    description: '',
    customService: '',
    urgency: 'Medium',
    preferredDate: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [otpVerifying, setOtpVerifying] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [otpConfirmation, setOtpConfirmation] = useState<any>(null);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.customerName.trim()) newErrors.customerName = 'Name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Invalid email format';
    if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
    if (!formData.address.trim()) newErrors.address = 'Address is required';
    if (!formData.serviceType) newErrors.serviceType = 'Please select a service type';
    if (!formData.description.trim()) newErrors.description = 'Service description is required';
    if (formData.serviceType === 'Other Services' && !formData.customService.trim()) {
      newErrors.customService = 'Please specify the custom service needed';
    }
    if (!formData.preferredDate) newErrors.preferredDate = 'Preferred date is required';
    // Do not allow a date earlier than today
    if (formData.preferredDate) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const selected = new Date(formData.preferredDate);
      if (selected < today) {
        newErrors.preferredDate = 'Preferred date cannot be earlier than today';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast({
        title: "Form Incomplete",
        description: "Please fill in all required fields correctly.",
        variant: "destructive",
      });
      return;
    }

    try {
      if (!user?.uid) {
        toast({
          title: "Authentication Error",
          description: "Please sign in to submit a service request.",
          variant: "destructive",
        });
        return;
      }

      if (!otpVerified) {
        toast({
          title: "OTP required",
          description: "Please verify the OTP sent to your phone before submitting.",
          variant: "destructive",
        });
        return;
      }

      const payload = {
        ...formData,
        userId: user.uid,
      };
      
      console.log('Submitting payload:', payload);
      const ticketId = await addRequest(payload);
      setTicketNumber(ticketId);
      setIsSubmitted(true);
      
      toast({
        title: "Service Request Submitted",
        description: `Your ticket number is ${ticketId}. We'll contact you soon!`,
      });
    } catch (error) {
      console.error('Error submitting request:', error);
      toast({
        title: "Error",
        description: "Failed to submit request. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleSendOtp = async () => {
    if (!formData.phone) {
      setErrors(prev => ({ ...prev, phone: 'Phone number is required' }));
      return;
    }
    try {
      const confirmation = await signInWithPhone(formData.phone);
      setOtpConfirmation(confirmation);
      setOtpSent(true);
    } catch (err) {
      // Error toasts are handled in auth context
    }
  };

  const handleVerifyOtp = async () => {
    if (!otpConfirmation || !otpCode) return;
    setOtpVerifying(true);
    try {
      await verifyPhoneCode(otpConfirmation, otpCode);
      setOtpVerified(true);
      toast({ title: 'Phone verified', description: 'OTP verification succeeded.' });
    } catch (err) {
      setOtpVerified(false);
    } finally {
      setOtpVerifying(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex items-center justify-center min-h-[80vh] px-4">
          <Card className="w-full max-w-md text-center">
            <CardContent className="p-8">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-success/10 mb-6">
                <CheckCircle className="h-8 w-8 text-success" />
              </div>
              <h2 className="text-2xl font-bold text-foreground mb-4">Request Submitted Successfully!</h2>
              <p className="text-muted-foreground mb-6">
                Your service request has been received and assigned ticket number:
              </p>
              <div className="bg-muted/50 rounded-lg p-4 mb-6">
                <span className="text-2xl font-bold text-primary">{ticketNumber}</span>
              </div>
              <p className="text-sm text-muted-foreground mb-8">
                We'll contact you within 24 hours to confirm your appointment. 
                You can check your service status anytime using your ticket number.
              </p>
              <div className="space-y-3">
                <Button 
                  onClick={() => navigate('/status')} 
                  className="w-full" 
                  size="lg"
                >
                  Track Service Status
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => navigate('/')} 
                  className="w-full"
                >
                  Return to Home
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="mx-auto max-w-4xl px-4 sm:px-6 py-8 sm:py-12">
        <div className="mb-6 sm:mb-8">
          <Button variant="ghost" onClick={() => navigate(-1)} className="mb-4 min-h-[44px]">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Request IT Service</h1>
          <p className="text-muted-foreground mt-2 text-sm sm:text-base leading-relaxed">
            Fill out the form below and we'll contact you within 24 hours to schedule your service.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
          {/* Service Selection */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Our Services</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {serviceOptions.map((service) => {
                  const Icon = service.icon;
                  return (
                    <div
                      key={service.value}
                      className={`flex items-center space-x-3 p-3 rounded-lg border transition-colors cursor-pointer ${
                        formData.serviceType === service.value
                          ? 'border-primary bg-primary/5'
                          : 'border-border hover:bg-muted/50'
                      }`}
                      onClick={() => handleInputChange('serviceType', service.value)}
                    >
                      <Icon className="h-5 w-5 text-primary" />
                      <span className="font-medium">{service.label}</span>
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          </div>

          {/* Main Form */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Service Request Details</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Customer Information */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="customerName" className="text-sm sm:text-base">Full Name *</Label>
                      <Input
                        id="customerName"
                        value={formData.customerName}
                        onChange={(e) => handleInputChange('customerName', e.target.value)}
                        className={`min-h-[44px] text-base ${errors.customerName ? 'border-destructive' : ''}`}
                      />
                      {errors.customerName && (
                        <p className="text-sm text-destructive mt-1">{errors.customerName}</p>
                      )}
                    </div>
                    
                    <div>
                      <Label htmlFor="email" className="text-sm sm:text-base">Email Address *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        className={`min-h-[44px] text-base ${errors.email ? 'border-destructive' : ''}`}
                      />
                      {errors.email && (
                        <p className="text-sm text-destructive mt-1">{errors.email}</p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="phone" className="text-sm sm:text-base">Phone Number *</Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        className={`min-h-[44px] text-base ${errors.phone ? 'border-destructive' : ''}`}
                      />
                      {errors.phone && (
                        <p className="text-sm text-destructive mt-1">{errors.phone}</p>
                      )}
                      <div className="flex gap-2 mt-2">
                        <Button type="button" variant="secondary" onClick={handleSendOtp} disabled={otpSent && !otpVerified}>
                          {otpSent ? (otpVerified ? 'Verified' : 'Resend OTP') : 'Send OTP'}
                        </Button>
                      </div>
                    </div>
                    
                    <div>
                      <Label htmlFor="preferredDate" className="text-sm sm:text-base">Preferred Date *</Label>
                      <Input
                        id="preferredDate"
                        type="date"
                        value={formData.preferredDate}
                        onChange={(e) => handleInputChange('preferredDate', e.target.value)}
                        className={`min-h-[44px] text-base ${errors.preferredDate ? 'border-destructive' : ''}`}
                        min={new Date().toISOString().split('T')[0]}
                      />
                      {errors.preferredDate && (
                        <p className="text-sm text-destructive mt-1">{errors.preferredDate}</p>
                      )}
                    </div>
                  </div>

                  {otpSent && !otpVerified && (
                    <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto] gap-2">
                      <div>
                        <Label htmlFor="otp" className="text-sm sm:text-base">Enter OTP</Label>
                        <Input
                          id="otp"
                          inputMode="numeric"
                          value={otpCode}
                          onChange={(e) => setOtpCode(e.target.value)}
                          placeholder="6-digit code"
                          className="min-h-[44px] text-base"
                        />
                      </div>
                      <div className="flex items-end">
                        <Button type="button" onClick={handleVerifyOtp} disabled={otpVerifying || otpCode.length < 6} className="min-h-[44px]">
                          {otpVerifying ? 'Verifying...' : 'Verify OTP'}
                        </Button>
                      </div>
                    </div>
                  )}

                  <div>
                    <Label htmlFor="address">Service Address *</Label>
                    <Textarea
                      id="address"
                      value={formData.address}
                      onChange={(e) => handleInputChange('address', e.target.value)}
                      className={errors.address ? 'border-destructive' : ''}
                      rows={2}
                    />
                    {errors.address && (
                      <p className="text-sm text-destructive mt-1">{errors.address}</p>
                    )}
                  </div>

                  {/* Service Details */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="serviceType">Service Type *</Label>
                      <Select 
                        value={formData.serviceType} 
                        onValueChange={(value) => handleInputChange('serviceType', value)}
                      >
                        <SelectTrigger className={errors.serviceType ? 'border-destructive' : ''}>
                          <SelectValue placeholder="Select a service" />
                        </SelectTrigger>
                        <SelectContent>
                          {serviceOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {errors.serviceType && (
                        <p className="text-sm text-destructive mt-1">{errors.serviceType}</p>
                      )}
                    </div>
                    
                    <div>
                      <Label htmlFor="urgency">Urgency Level</Label>
                      <Select 
                        value={formData.urgency} 
                        onValueChange={(value) => handleInputChange('urgency', value)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Low">Low - Not urgent</SelectItem>
                          <SelectItem value="Medium">Medium - Within a week</SelectItem>
                          <SelectItem value="High">High - ASAP</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {formData.serviceType === 'Other Services' && (
                    <div>
                      <Label htmlFor="customService">Specify Custom Service *</Label>
                      <Input
                        id="customService"
                        value={formData.customService}
                        onChange={(e) => handleInputChange('customService', e.target.value)}
                        placeholder="Describe the specific service you need"
                        className={errors.customService ? 'border-destructive' : ''}
                      />
                      {errors.customService && (
                        <p className="text-sm text-destructive mt-1">{errors.customService}</p>
                      )}
                    </div>
                  )}

                  <div>
                    <Label htmlFor="description">Problem Description *</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => handleInputChange('description', e.target.value)}
                      placeholder="Please describe the issue or service needed in detail..."
                      className={errors.description ? 'border-destructive' : ''}
                      rows={4}
                    />
                    {errors.description && (
                      <p className="text-sm text-destructive mt-1">{errors.description}</p>
                    )}
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4 pt-4">
                    <Button type="submit" size="lg" className="flex-1 min-h-[48px]" disabled={!otpVerified}>
                      Submit Service Request
                    </Button>
                    <Button type="button" variant="outline" onClick={() => navigate('/')} className="min-h-[48px]">
                      Cancel
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}