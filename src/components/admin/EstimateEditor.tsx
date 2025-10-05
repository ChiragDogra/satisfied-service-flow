import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { useService, ServiceRequest } from '../../contexts/ServiceContext';
import { DollarSign, Clock, Save, X, Calculator, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

interface EstimateEditorProps {
  isOpen: boolean;
  onClose: () => void;
  request: ServiceRequest | null;
}

const EstimateEditor: React.FC<EstimateEditorProps> = ({ isOpen, onClose, request }) => {
  const { updateRequestEstimates } = useService();
  const [estimatedPrice, setEstimatedPrice] = useState<string>('');
  const [estimatedCompletionTime, setEstimatedCompletionTime] = useState<string>('');
  const [diagnosedIssue, setDiagnosedIssue] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  // Initialize form when dialog opens or request changes
  React.useEffect(() => {
    if (isOpen && request) {
      setEstimatedPrice(request.estimatedPrice?.toString() || '');
      setEstimatedCompletionTime(request.estimatedCompletionTime || '');
      setDiagnosedIssue(request.diagnosedIssue || '');
    }
  }, [isOpen, request]);

  const handleSave = async () => {
    if (!request) return;

    setIsLoading(true);
    try {
      const estimates: { estimatedPrice?: number; estimatedCompletionTime?: string; diagnosedIssue?: string } = {};

      // Parse price
      if (estimatedPrice.trim()) {
        const price = parseFloat(estimatedPrice);
        if (isNaN(price) || price < 0) {
          toast.error('Please enter a valid price');
          setIsLoading(false);
          return;
        }
        estimates.estimatedPrice = price;
      }

      // Set completion time
      if (estimatedCompletionTime.trim()) {
        estimates.estimatedCompletionTime = estimatedCompletionTime.trim();
      }

      // Set diagnosed issue
      if (diagnosedIssue.trim()) {
        estimates.diagnosedIssue = diagnosedIssue.trim();
      }

      await updateRequestEstimates(request.id, estimates);
      toast.success('Service details updated successfully!');
      onClose();
    } catch (error) {
      console.error('Error updating service details:', error);
      toast.error('Failed to update service details. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    // Reset form to original values
    if (request) {
      setEstimatedPrice(request.estimatedPrice?.toString() || '');
      setEstimatedCompletionTime(request.estimatedCompletionTime || '');
      setDiagnosedIssue(request.diagnosedIssue || '');
    }
    onClose();
  };

  if (!request) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div className="flex-1 min-w-0">
              <DialogTitle className="flex items-center gap-2">
                <Calculator className="w-5 h-5" />
                Update Service Details
              </DialogTitle>
              <DialogDescription>
                Set estimates, completion time, and diagnosed issue for ticket {request.ticketId || request.id}
              </DialogDescription>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="h-8 w-8 p-0 rounded-full hover:bg-muted flex-shrink-0 ml-2"
              title="Close"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Service Request Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Service Request Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium">Customer:</span> {request.customerName}
                </div>
                <div>
                  <span className="font-medium">Service Type:</span> {request.serviceType}
                </div>
                <div>
                  <span className="font-medium">Status:</span> {request.status}
                </div>
                <div>
                  <span className="font-medium">Urgency:</span> {request.urgency}
                </div>
              </div>
              <div className="pt-2">
                <span className="font-medium">Description:</span>
                <p className="text-muted-foreground mt-1">{request.description}</p>
              </div>
            </CardContent>
          </Card>

          {/* Estimate Form */}
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Estimated Price */}
              <div className="space-y-2">
                <Label htmlFor="estimatedPrice" className="flex items-center gap-2">
                  <DollarSign className="w-4 h-4" />
                  Estimated Price (₹)
                </Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">₹</span>
                  <Input
                    id="estimatedPrice"
                    type="number"
                    min="0"
                    step="0.01"
                    value={estimatedPrice}
                    onChange={(e) => setEstimatedPrice(e.target.value)}
                    placeholder="0.00"
                    className="pl-8"
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  Enter the estimated cost in Indian Rupees
                </p>
              </div>

              {/* Estimated Completion Time */}
              <div className="space-y-2">
                <Label htmlFor="estimatedCompletionTime" className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  Estimated Completion Date & Time
                </Label>
                <Input
                  id="estimatedCompletionTime"
                  type="datetime-local"
                  value={estimatedCompletionTime}
                  onChange={(e) => setEstimatedCompletionTime(e.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                  Select the expected completion date and time
                </p>
              </div>
            </div>

            {/* Diagnosed Issue */}
            <div className="space-y-2">
              <Label htmlFor="diagnosedIssue" className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4" />
                Diagnosed Issue
              </Label>
              <Textarea
                id="diagnosedIssue"
                value={diagnosedIssue}
                onChange={(e) => setDiagnosedIssue(e.target.value)}
                placeholder="Describe the diagnosed issue and findings..."
                rows={3}
              />
              <p className="text-xs text-muted-foreground">
                Provide details about what was found during diagnosis
              </p>
            </div>

            {/* Current Details Display */}
            {(request.estimatedPrice || request.estimatedCompletionTime || request.diagnosedIssue) && (
              <Card className="bg-muted/50">
                <CardContent className="p-4">
                  <h4 className="font-medium mb-2">Current Service Details:</h4>
                  <div className="space-y-2 text-sm">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <span className="font-medium">Price:</span>{' '}
                        {request.estimatedPrice ? `₹${request.estimatedPrice.toFixed(2)}` : 'Not set'}
                      </div>
                      <div>
                        <span className="font-medium">Completion:</span>{' '}
                        {request.estimatedCompletionTime ? 
                          new Date(request.estimatedCompletionTime).toLocaleString('en-IN', {
                            dateStyle: 'medium',
                            timeStyle: 'short'
                          }) : 'Not set'}
                      </div>
                    </div>
                    {request.diagnosedIssue && (
                      <div>
                        <span className="font-medium">Diagnosed Issue:</span>
                        <p className="text-muted-foreground mt-1">{request.diagnosedIssue}</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <Button 
              onClick={handleSave} 
              disabled={isLoading}
              className="flex-1 sm:flex-none"
            >
              <Save className="w-4 h-4 mr-2" />
              {isLoading ? 'Saving...' : 'Save Details'}
            </Button>
            <Button 
              variant="outline" 
              onClick={handleCancel}
              disabled={isLoading}
              className="flex-1 sm:flex-none"
            >
              <X className="w-4 h-4 mr-2" />
              Cancel
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EstimateEditor;
