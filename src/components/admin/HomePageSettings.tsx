import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { useContent, HomePageContent } from '@/contexts/ContentContext';
import { 
  Save, 
  RotateCcw, 
  Eye, 
  AlertTriangle, 
  CheckCircle,
  Home,
  Users,
  Award,
  Clock,
  Star,
  Phone,
  Mail,
  MapPin,
  MessageCircle
} from 'lucide-react';

export default function HomePageSettings() {
  const { content, updateContent, loading, resetToDefaults } = useContent();
  const { toast } = useToast();
  const [editedContent, setEditedContent] = useState<HomePageContent>(content);
  const [saving, setSaving] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);

  // Update local state when content changes
  useEffect(() => {
    setEditedContent(content);
  }, [content]);

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateContent(editedContent);
      toast({
        title: "Success!",
        description: "Home page content updated successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update content. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    resetToDefaults();
    setEditedContent(content);
    toast({
      title: "Reset Complete",
      description: "Content has been reset to default values.",
    });
  };

  const updateField = (section: keyof HomePageContent, field: string, value: string) => {
    setEditedContent(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const updateNestedField = (section: keyof HomePageContent, nestedSection: string, field: string, value: string) => {
    setEditedContent(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [nestedSection]: {
          ...(prev[section] as any)[nestedSection],
          [field]: value
        }
      }
    }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading content...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Home className="h-6 w-6" />
            Home Page Settings
          </h1>
          <p className="text-muted-foreground">
            Customize the content displayed on your home page. Changes are validated to maintain design integrity.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={() => setPreviewMode(!previewMode)}
            className="flex items-center gap-2"
          >
            <Eye className="h-4 w-4" />
            {previewMode ? 'Edit Mode' : 'Preview'}
          </Button>
          <Button
            variant="outline"
            onClick={handleReset}
            className="flex items-center gap-2"
          >
            <RotateCcw className="h-4 w-4" />
            Reset
          </Button>
          <Button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2"
          >
            <Save className="h-4 w-4" />
            {saving ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </div>

      {/* Safety Notice */}
      <Card className="border-orange-200 bg-orange-50/50">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-orange-600 mt-0.5" />
            <div>
              <h3 className="font-semibold text-orange-800">Content Guidelines</h3>
              <p className="text-sm text-orange-700 mt-1">
                Keep titles short and descriptive. Long text may be automatically truncated to maintain design consistency. 
                Phone numbers and emails are validated for proper format.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {previewMode ? (
        /* Preview Mode */
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="h-5 w-5" />
                Content Preview
              </CardTitle>
              <CardDescription>
                This is how your content will appear on the home page
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Hero Preview */}
              <div className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground p-6 rounded-lg">
                <h1 className="text-2xl font-bold mb-2">{editedContent.hero.title}</h1>
                <p className="opacity-90">{editedContent.hero.subtitle}</p>
              </div>

              {/* Trust Indicators Preview */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="text-center p-3 bg-muted/50 rounded-lg">
                  <Users className="h-6 w-6 mx-auto mb-2 text-primary" />
                  <div className="font-bold text-primary">{editedContent.trustIndicators.customers}</div>
                  <div className="text-xs text-muted-foreground">Satisfied Customers</div>
                </div>
                <div className="text-center p-3 bg-muted/50 rounded-lg">
                  <Award className="h-6 w-6 mx-auto mb-2 text-primary" />
                  <div className="font-bold text-primary">{editedContent.trustIndicators.experience}</div>
                  <div className="text-xs text-muted-foreground">Years Experience</div>
                </div>
                <div className="text-center p-3 bg-muted/50 rounded-lg">
                  <CheckCircle className="h-6 w-6 mx-auto mb-2 text-primary" />
                  <div className="font-bold text-primary">{editedContent.trustIndicators.successRate}</div>
                  <div className="text-xs text-muted-foreground">Success Rate</div>
                </div>
                <div className="text-center p-3 bg-muted/50 rounded-lg">
                  <Clock className="h-6 w-6 mx-auto mb-2 text-primary" />
                  <div className="font-bold text-primary">{editedContent.trustIndicators.support}</div>
                  <div className="text-xs text-muted-foreground">Support Available</div>
                </div>
              </div>

              {/* Contact Preview */}
              <div className="bg-muted/30 p-6 rounded-lg">
                <h2 className="text-xl font-bold mb-2">{editedContent.contact.title}</h2>
                <p className="text-muted-foreground mb-4">{editedContent.contact.subtitle}</p>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4" />
                    {editedContent.contact.phone}
                  </div>
                  <div className="flex items-center gap-2">
                    <MessageCircle className="h-4 w-4" />
                    {editedContent.contact.whatsapp}
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    {editedContent.contact.email}
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    {editedContent.contact.address.line1}, {editedContent.contact.address.line2}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      ) : (
        /* Edit Mode */
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Hero Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Star className="h-5 w-5" />
                Hero Section
              </CardTitle>
              <CardDescription>
                Main headline and description that visitors see first
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="hero-title">Main Title</Label>
                <Input
                  id="hero-title"
                  value={editedContent.hero.title}
                  onChange={(e) => updateField('hero', 'title', e.target.value)}
                  placeholder="Professional IT Services You Can Trust"
                  maxLength={100}
                />
                <div className="flex justify-between items-center mt-1">
                  <p className="text-xs text-muted-foreground">Keep it short and impactful</p>
                  <Badge variant="outline" className="text-xs">
                    {editedContent.hero.title.length}/100
                  </Badge>
                </div>
              </div>
              <div>
                <Label htmlFor="hero-subtitle">Subtitle</Label>
                <Textarea
                  id="hero-subtitle"
                  value={editedContent.hero.subtitle}
                  onChange={(e) => updateField('hero', 'subtitle', e.target.value)}
                  placeholder="Expert computer repair, networking solutions..."
                  maxLength={300}
                  rows={3}
                />
                <div className="flex justify-between items-center mt-1">
                  <p className="text-xs text-muted-foreground">Describe your services briefly</p>
                  <Badge variant="outline" className="text-xs">
                    {editedContent.hero.subtitle.length}/300
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Trust Indicators */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Trust Indicators
              </CardTitle>
              <CardDescription>
                Statistics that build credibility (keep very short)
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="customers">Customers</Label>
                  <Input
                    id="customers"
                    value={editedContent.trustIndicators.customers}
                    onChange={(e) => updateField('trustIndicators', 'customers', e.target.value)}
                    placeholder="500+"
                    maxLength={10}
                  />
                </div>
                <div>
                  <Label htmlFor="experience">Experience</Label>
                  <Input
                    id="experience"
                    value={editedContent.trustIndicators.experience}
                    onChange={(e) => updateField('trustIndicators', 'experience', e.target.value)}
                    placeholder="15+"
                    maxLength={10}
                  />
                </div>
                <div>
                  <Label htmlFor="success-rate">Success Rate</Label>
                  <Input
                    id="success-rate"
                    value={editedContent.trustIndicators.successRate}
                    onChange={(e) => updateField('trustIndicators', 'successRate', e.target.value)}
                    placeholder="98%"
                    maxLength={10}
                  />
                </div>
                <div>
                  <Label htmlFor="support">Support</Label>
                  <Input
                    id="support"
                    value={editedContent.trustIndicators.support}
                    onChange={(e) => updateField('trustIndicators', 'support', e.target.value)}
                    placeholder="24/7"
                    maxLength={10}
                  />
                </div>
              </div>
              <p className="text-xs text-muted-foreground">
                Use short values like "500+", "15+", "98%", "24/7"
              </p>
            </CardContent>
          </Card>

          {/* Services Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="h-5 w-5" />
                Services Section
              </CardTitle>
              <CardDescription>
                Title and description for your services overview
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="services-title">Services Title</Label>
                <Input
                  id="services-title"
                  value={editedContent.services.title}
                  onChange={(e) => updateField('services', 'title', e.target.value)}
                  placeholder="Complete IT Solutions"
                  maxLength={80}
                />
                <Badge variant="outline" className="text-xs mt-1">
                  {editedContent.services.title.length}/80
                </Badge>
              </div>
              <div>
                <Label htmlFor="services-subtitle">Services Description</Label>
                <Textarea
                  id="services-subtitle"
                  value={editedContent.services.subtitle}
                  onChange={(e) => updateField('services', 'subtitle', e.target.value)}
                  placeholder="From computer repair to network setup..."
                  maxLength={250}
                  rows={3}
                />
                <Badge variant="outline" className="text-xs mt-1">
                  {editedContent.services.subtitle.length}/250
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Contact Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Phone className="h-5 w-5" />
                Contact Information
              </CardTitle>
              <CardDescription>
                Contact details and call-to-action text
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="contact-title">Contact Title</Label>
                <Input
                  id="contact-title"
                  value={editedContent.contact.title}
                  onChange={(e) => updateField('contact', 'title', e.target.value)}
                  placeholder="Ready to Get Started?"
                  maxLength={80}
                />
              </div>
              <div>
                <Label htmlFor="contact-subtitle">Contact Subtitle</Label>
                <Textarea
                  id="contact-subtitle"
                  value={editedContent.contact.subtitle}
                  onChange={(e) => updateField('contact', 'subtitle', e.target.value)}
                  placeholder="Contact us today for fast, professional IT service..."
                  maxLength={200}
                  rows={2}
                />
              </div>
              
              <Separator />
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    value={editedContent.contact.phone}
                    onChange={(e) => updateField('contact', 'phone', e.target.value)}
                    placeholder="+91 9634409988"
                  />
                </div>
                <div>
                  <Label htmlFor="whatsapp">WhatsApp Number</Label>
                  <Input
                    id="whatsapp"
                    value={editedContent.contact.whatsapp}
                    onChange={(e) => updateField('contact', 'whatsapp', e.target.value)}
                    placeholder="+91 9634409988"
                  />
                </div>
                <div className="sm:col-span-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    value={editedContent.contact.email}
                    onChange={(e) => updateField('contact', 'email', e.target.value)}
                    placeholder="satisfiedcomputers@gmail.com"
                  />
                </div>
                <div>
                  <Label htmlFor="address-line1">Address Line 1</Label>
                  <Input
                    id="address-line1"
                    value={editedContent.contact.address.line1}
                    onChange={(e) => updateNestedField('contact', 'address', 'line1', e.target.value)}
                    placeholder="Transport Nagar"
                    maxLength={50}
                  />
                </div>
                <div>
                  <Label htmlFor="address-line2">Address Line 2</Label>
                  <Input
                    id="address-line2"
                    value={editedContent.contact.address.line2}
                    onChange={(e) => updateNestedField('contact', 'address', 'line2', e.target.value)}
                    placeholder="Saharanpur"
                    maxLength={50}
                  />
                </div>
                <div>
                  <Label htmlFor="weekdays">Weekday Hours</Label>
                  <Input
                    id="weekdays"
                    value={editedContent.contact.hours.weekdays}
                    onChange={(e) => updateNestedField('contact', 'hours', 'weekdays', e.target.value)}
                    placeholder="Mon-Fri: 8AM-6PM"
                  />
                </div>
                <div>
                  <Label htmlFor="saturday">Saturday Hours</Label>
                  <Input
                    id="saturday"
                    value={editedContent.contact.hours.saturday}
                    onChange={(e) => updateNestedField('contact', 'hours', 'saturday', e.target.value)}
                    placeholder="Sat: 9AM-4PM"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Footer Section */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Home className="h-5 w-5" />
                Footer Description
              </CardTitle>
              <CardDescription>
                Brief description about your business for the footer
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div>
                <Label htmlFor="footer-description">Footer Description</Label>
                <Textarea
                  id="footer-description"
                  value={editedContent.footer.description}
                  onChange={(e) => updateField('footer', 'description', e.target.value)}
                  placeholder="Professional IT services and computer repair..."
                  maxLength={200}
                  rows={3}
                />
                <Badge variant="outline" className="text-xs mt-1">
                  {editedContent.footer.description.length}/200
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
