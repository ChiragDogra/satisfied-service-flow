import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Header from '@/components/Header';
import {
  Monitor,
  Printer,
  Camera,
  Network,
  Settings,
  CheckCircle,
  Users,
  Award,
  Clock,
  Phone,
  Mail,
  MapPin
} from 'lucide-react';

const services = [
  {
    icon: Monitor,
    title: 'Computer Repair',
    description: 'Desktop and laptop repair, virus removal, hardware upgrades, and system optimization.',
    features: ['Hardware Diagnostics', 'Virus Removal', 'System Optimization', 'Data Recovery']
  },
  {
    icon: Printer,
    title: 'Printer Repair',
    description: 'All printer brands serviced including setup, troubleshooting, and maintenance.',
    features: ['All Brands Supported', 'Setup & Configuration', 'Troubleshooting', 'Maintenance']
  },
  {
    icon: Camera,
    title: 'CCTV Repair',
    description: 'Security camera installation, repair, and monitoring system maintenance.',
    features: ['Installation', 'System Repair', 'Monitoring Setup', '24/7 Support']
  },
  {
    icon: Network,
    title: 'Networking',
    description: 'Business and home network setup, Wi-Fi optimization, and security configuration.',
    features: ['Network Setup', 'Wi-Fi Optimization', 'Security Config', 'Business Solutions']
  },
  {
    icon: Settings,
    title: 'Other Services',
    description: 'Custom IT solutions, consulting, and specialized technical support for unique needs.',
    features: ['Custom Solutions', 'IT Consulting', 'Training', 'Emergency Support']
  }
];

const trustIndicators = [
  { icon: Users, value: '500+', label: 'Satisfied Customers' },
  { icon: Award, value: '15+', label: 'Years Experience' },
  { icon: CheckCircle, value: '98%', label: 'Success Rate' },
  { icon: Clock, value: '24/7', label: 'Support Available' }
];

export default function Landing() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-hero py-24 sm:py-32">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.05%22%3E%3Ccircle%20cx%3D%2230%22%20cy%3D%2230%22%20r%3D%221%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-20" />
        
        <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="text-4xl font-bold tracking-tight text-primary-foreground sm:text-6xl">
              Professional IT Services You Can Trust
            </h1>
            <p className="mt-6 text-lg leading-8 text-primary-foreground/90">
              Expert computer repair, networking solutions, and IT support for homes and businesses. 
              Fast, reliable, and professional service with 15+ years of experience.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Button asChild size="xl" variant="secondary" className="shadow-xl">
                <Link to="/request">Request Service Now</Link>
              </Button>
              <Button asChild variant="outline" size="xl" className="bg-primary-foreground/10 text-primary-foreground border-primary-foreground hover:bg-primary-foreground hover:text-primary">
                <Link to="/status">Check Service Status</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Indicators */}
      <section className="py-16 bg-muted/30">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            {trustIndicators.map((item, index) => (
              <div key={index} className="text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <item.icon className="h-6 w-6 text-primary" />
                </div>
                <div className="mt-4">
                  <div className="text-2xl font-bold text-primary">{item.value}</div>
                  <div className="text-sm text-muted-foreground">{item.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Overview */}
      <section className="py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Complete IT Solutions
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              From computer repair to network setup, we provide comprehensive IT services 
              for homes and businesses across all major brands and systems.
            </p>
          </div>
          
          <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {services.map((service, index) => (
              <Card key={index} className="group hover:shadow-lg transition-all duration-300 hover:scale-105 border-border/40">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                      <service.icon className="h-6 w-6 text-primary group-hover:text-primary-foreground" />
                    </div>
                    <h3 className="text-xl font-semibold text-foreground">{service.title}</h3>
                  </div>
                  <p className="text-muted-foreground mb-4">{service.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {service.features.map((feature, featureIndex) => (
                      <Badge key={featureIndex} variant="secondary" className="text-xs">
                        {feature}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <div className="mt-12 text-center">
            <Button asChild size="lg" variant="hero" className="shadow-xl">
              <Link to="/request">Get Started Today</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="bg-muted/50 py-16">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight text-foreground">
              Ready to Get Started?
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Contact us today for fast, professional IT service. We're here to help!
            </p>
          </div>
          
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            <div className="text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 mb-4">
                <Phone className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Call Us</h3>
              <p className="text-muted-foreground">(555) 123-TECH</p>
              <p className="text-sm text-muted-foreground">Mon-Fri: 8AM-6PM</p>
            </div>
            
            <div className="text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 mb-4">
                <Mail className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Email Us</h3>
              <p className="text-muted-foreground">service@satisfiedcomputers.com</p>
              <p className="text-sm text-muted-foreground">24hr response time</p>
            </div>
            
            <div className="text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 mb-4">
                <MapPin className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Visit Us</h3>
              <p className="text-muted-foreground">123 Tech Street</p>
              <p className="text-sm text-muted-foreground">City, State 12345</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-foreground text-background py-12">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            <div>
              <h3 className="text-lg font-semibold mb-4">Satisfied Computers</h3>
              <p className="text-background/70 mb-4">
                Professional IT services and computer repair with over 15 years of experience. 
                Your satisfaction is our priority.
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Services</h3>
              <ul className="space-y-2 text-background/70">
                <li>Computer Repair</li>
                <li>Printer Repair</li>
                <li>CCTV Systems</li>
                <li>Networking</li>
                <li>IT Consulting</li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Contact Info</h3>
              <div className="space-y-2 text-background/70">
                <p>Phone: (555) 123-TECH</p>
                <p>Email: service@satisfiedcomputers.com</p>
                <p>Address: 123 Tech Street, City, State 12345</p>
                <p>Hours: Mon-Fri 8AM-6PM, Sat 9AM-4PM</p>
              </div>
            </div>
          </div>
          
          <div className="mt-8 pt-8 border-t border-background/20 text-center">
            <p className="text-background/70">
              © 2024 Satisfied Computers. All rights reserved. | Licensed & Insured IT Services
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}