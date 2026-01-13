import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ArrowRight,
  CheckCircle,
  Phone,
  Mail,
  MapPin,
  Clock,
  Star,
  Users,
  MessageCircle,
  Monitor,
  Printer,
  Camera,
  Network,
  Settings,
  Award,
  Sparkles
} from "lucide-react";
import Header from "@/components/Header";
import ClickableContact from "@/components/ClickableContact";
import { CarouselSection } from "@/components/CarouselSection";
import { useAuth } from "@/contexts/AuthContext";
import { useContent } from "@/contexts/ContentContext";

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

export default function Landing() {
  const { user, isAdmin } = useAuth();
  const { content, loading } = useContent();

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  const trustIndicators = [
    { icon: Users, value: content.trustIndicators.customers, label: 'Satisfied Customers' },
    { icon: Award, value: content.trustIndicators.experience, label: 'Years Experience' },
    { icon: CheckCircle, value: content.trustIndicators.successRate, label: 'Success Rate' },
    { icon: Clock, value: content.trustIndicators.support, label: 'Support Available' }
  ];

  return (
    <div className="min-h-screen bg-background pb-16 lg:pb-0 overflow-hidden">
      <Header />

      {/* Hero Section - Enhanced with decorative elements */}
      <section className="relative overflow-hidden bg-gradient-hero py-12 sm:py-16 lg:py-20 xl:py-24 animate-gradient">
        {/* Animated Background Pattern */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.05%22%3E%3Ccircle%20cx%3D%2230%22%20cy%3D%2230%22%20r%3D%221%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-20" />

        {/* Decorative Blobs */}
        <div className="absolute top-10 left-10 w-64 h-64 blob opacity-50 animate-float hidden lg:block" />
        <div className="absolute bottom-10 right-10 w-96 h-96 blob opacity-30 animate-float-delayed hidden lg:block" />

        {/* Particles */}
        <div className="absolute top-1/4 left-1/4 particle" style={{ animationDelay: '0s' }} />
        <div className="absolute top-1/3 right-1/3 particle" style={{ animationDelay: '2s' }} />
        <div className="absolute bottom-1/4 left-1/2 particle" style={{ animationDelay: '4s' }} />
        <div className="absolute top-2/3 right-1/4 particle" style={{ animationDelay: '6s' }} />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            {/* Enhanced Title with Gradient Text */}
            <div className="inline-flex items-center gap-2 mb-6 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20">
              <Sparkles className="h-4 w-4 text-yellow-300 animate-pulse" />
              <span className="text-sm font-medium text-white">Professional IT Services</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold tracking-tight gradient-text-hero leading-tight mb-4">
              {content.hero.title}
            </h1>

            <p className="mt-4 sm:mt-6 text-base sm:text-lg lg:text-xl leading-relaxed text-primary-foreground/90 px-2 sm:px-0">
              {content.hero.subtitle}
            </p>

            {/* Enhanced CTA Buttons */}
            <div className="mt-6 sm:mt-8 lg:mt-10 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 lg:gap-6 px-4 sm:px-0">
              {user ? (
                <Button
                  asChild
                  size="xl"
                  variant="secondary"
                  className="shadow-xl w-full sm:w-auto min-h-[48px] text-base font-semibold hover-glow group"
                >
                  <Link to={isAdmin ? '/admin/dashboard' : '/customer/dashboard'}>
                    Go to Dashboard
                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </Button>
              ) : (
                <>
                  <Button
                    asChild
                    size="xl"
                    variant="secondary"
                    className="shadow-xl w-full sm:w-auto min-h-[48px] text-base font-semibold hover-glow animate-pulse-glow group"
                  >
                    <Link to="/register">
                      Get Started
                      <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </Button>
                  <Button
                    asChild
                    variant="outline"
                    size="xl"
                    className="bg-primary-foreground/10 text-primary-foreground border-primary-foreground hover:bg-primary-foreground hover:text-primary w-full sm:w-auto min-h-[48px] text-base font-semibold hover-scale backdrop-blur-sm"
                  >
                    <Link to="/login">Sign In</Link>
                  </Button>
                </>
              )}
            </div>

            {/* Carousel Section */}
            <div className="animate-float-delayed mt-12 w-full max-w-5xl mx-auto">
              <CarouselSection />
            </div>
          </div>
        </div>
      </section>

      {/* Trust Indicators - Glassmorphic Cards */}
      <section className="py-8 sm:py-12 lg:py-16 bg-muted/30 relative">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:gap-8 lg:grid-cols-4">
            {trustIndicators.map((item, index) => (
              <div
                key={index}
                className="text-center p-4 sm:p-6 glass-card rounded-2xl hover-glow hover-scale transition-all"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="mx-auto flex h-12 w-12 sm:h-14 sm:w-14 lg:h-16 lg:w-16 items-center justify-center rounded-xl bg-gradient-primary animate-pulse-glow">
                  <item.icon className="h-6 w-6 sm:h-7 sm:w-7 lg:h-8 lg:w-8 text-white" />
                </div>
                <div className="mt-3 sm:mt-4">
                  <div className="text-xl sm:text-2xl lg:text-3xl font-bold gradient-text">{item.value}</div>
                  <div className="text-xs sm:text-sm lg:text-base text-muted-foreground leading-tight mt-1">{item.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Overview - 3D Tilt Cards */}
      <section className="py-12 sm:py-16 lg:py-20 xl:py-24 relative">
        {/* Background Decoration */}
        <div className="absolute top-20 right-0 w-72 h-72 blob opacity-20 animate-float hidden xl:block" />

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center mb-8 sm:mb-12 lg:mb-16">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight gradient-text">
              {content.services.title}
            </h2>
            <p className="mt-3 sm:mt-4 text-base sm:text-lg text-muted-foreground leading-relaxed px-4 sm:px-0">
              {content.services.subtitle}
            </p>
          </div>

          <div className="mt-8 sm:mt-12 lg:mt-16 grid grid-cols-1 gap-6 sm:gap-8 lg:gap-10 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((service, index) => (
              <Card
                key={index}
                className="group tilt-3d hover-glow gradient-border overflow-hidden h-full bg-gradient-card transition-all duration-300"
                style={{ animationDelay: `${index * 0.15}s` }}
              >
                <CardContent className="p-6 sm:p-8 h-full flex flex-col relative">
                  {/* Decorative corner accent */}
                  <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-primary opacity-10 rounded-bl-full" />

                  <div className="flex flex-col sm:flex-row sm:items-center space-y-3 sm:space-y-0 sm:space-x-4 mb-4">
                    <div className="flex h-14 w-14 sm:h-16 sm:w-16 items-center justify-center rounded-2xl bg-gradient-primary group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 shadow-lg flex-shrink-0">
                      <service.icon className="h-7 w-7 sm:h-8 sm:w-8 text-white" />
                    </div>
                    <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-foreground">{service.title}</h3>
                  </div>

                  <p className="text-sm sm:text-base text-muted-foreground mb-5 leading-relaxed flex-grow">
                    {service.description}
                  </p>

                  <div className="flex flex-wrap gap-2">
                    {service.features.map((feature, featureIndex) => (
                      <Badge
                        key={featureIndex}
                        variant="secondary"
                        className="text-xs px-3 py-1.5 bg-primary/10 text-primary border-primary/20 hover:bg-primary/20 transition-colors"
                      >
                        <CheckCircle className="h-3 w-3 mr-1" />
                        {feature}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="mt-8 sm:mt-12 lg:mt-16 text-center">
            <Button
              asChild
              size="lg"
              variant="hero"
              className="shadow-xl min-h-[52px] w-full sm:w-auto text-base font-semibold max-w-xs hover-glow group px-8"
            >
              <Link to="/register">
                Get Started Today
                <Sparkles className="ml-2 h-5 w-5 group-hover:rotate-12 transition-transform" />
              </Link>
            </Button>
          </div>
        </div>
      </section >

      {/* Contact Section - Enhanced */}
      < section className="bg-muted/50 py-10 sm:py-12 lg:py-16 relative overflow-hidden" >
        {/* Background Decoration */}
        < div className="absolute bottom-0 left-0 w-96 h-96 blob opacity-10 animate-float-delayed" />

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="mx-auto max-w-2xl text-center mb-8 sm:mb-10 lg:mb-14">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight gradient-text">
              {content.contact.title}
            </h2>
            <p className="mt-3 sm:mt-4 text-base sm:text-lg text-muted-foreground leading-relaxed px-4 sm:px-0">
              {content.contact.subtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 gap-5 sm:gap-6 lg:gap-8 sm:grid-cols-2 lg:grid-cols-4 mb-10">
            <div className="text-center p-5 sm:p-6 glass-card rounded-2xl hover-scale hover-glow transition-all">
              <div className="mx-auto flex h-14 w-14 sm:h-16 sm:w-16 items-center justify-center rounded-xl bg-gradient-primary mb-4 animate-pulse-glow">
                <Phone className="h-7 w-7 sm:h-8 sm:w-8 text-white" />
              </div>
              <h3 className="text-base sm:text-lg font-semibold mb-2">Call Us</h3>
              <ClickableContact type="phone" value={content.contact.phone} showIcon={false} className="text-muted-foreground text-sm sm:text-base font-medium hover:text-primary transition-colors" />
              <p className="text-xs sm:text-sm text-muted-foreground mt-1">Mon-Fri: 8AM-6PM</p>
            </div>

            <div className="text-center p-5 sm:p-6 glass-card rounded-2xl hover-scale hover-glow transition-all">
              <div className="mx-auto flex h-14 w-14 sm:h-16 sm:w-16 items-center justify-center rounded-xl bg-gradient-to-br from-green-400 to-green-600 mb-4 shadow-lg">
                <MessageCircle className="h-7 w-7 sm:h-8 sm:w-8 text-white" />
              </div>
              <h3 className="text-base sm:text-lg font-semibold mb-2">WhatsApp</h3>
              <ClickableContact type="whatsapp" value={content.contact.whatsapp} showIcon={false} className="text-muted-foreground text-sm sm:text-base font-medium hover:text-green-600 transition-colors" />
              <p className="text-xs sm:text-sm text-muted-foreground mt-1">Quick Support</p>
            </div>

            <div className="text-center p-5 sm:p-6 glass-card rounded-2xl hover-scale hover-glow transition-all">
              <div className="mx-auto flex h-14 w-14 sm:h-16 sm:w-16 items-center justify-center rounded-xl bg-gradient-primary mb-4 animate-pulse-glow">
                <Mail className="h-7 w-7 sm:h-8 sm:w-8 text-white" />
              </div>
              <h3 className="text-base sm:text-lg font-semibold mb-2">Email Us</h3>
              <ClickableContact type="email" value={content.contact.email} showIcon={false} className="text-muted-foreground text-sm sm:text-base font-medium break-all hover:text-primary transition-colors" />
              <p className="text-xs sm:text-sm text-muted-foreground mt-1">24hr response time</p>
            </div>

            <div className="text-center p-5 sm:p-6 glass-card rounded-2xl hover-scale hover-glow transition-all">
              <div className="mx-auto flex h-14 w-14 sm:h-16 sm:w-16 items-center justify-center rounded-xl bg-gradient-primary mb-4 animate-pulse-glow">
                <MapPin className="h-7 w-7 sm:h-8 sm:w-8 text-white" />
              </div>
              <h3 className="text-base sm:text-lg font-semibold mb-2">Visit Us</h3>
              <p className="text-muted-foreground text-sm sm:text-base font-medium">{content.contact.address.line1}</p>
              <p className="text-xs sm:text-sm text-muted-foreground mt-1">{content.contact.address.line2}</p>
            </div>
          </div>

          {/* Google Maps Embed - Enhanced */}
          <div className="mt-8 sm:mt-12 lg:mt-16">
            <div className="mx-auto max-w-4xl">
              <div className="text-center mb-6">
                <h3 className="text-xl sm:text-2xl font-bold gradient-text mb-2">Find Us</h3>
                <p className="text-muted-foreground text-sm sm:text-base">Visit our location for in-person service and support</p>
              </div>
              <div className="relative overflow-hidden rounded-2xl shadow-2xl border-2 border-primary/20 gradient-border">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3462.8!2d77.585625!3d29.9743692!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390eebf6e7e6ab89%3A0xc72d6a6129acfacf!2sSatisfied%20computer!5e0!3m2!1sen!2sin!4v1696512345678!5m2!1sen!2sin"
                  width="100%"
                  height="300"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="w-full h-[300px] sm:h-[350px] lg:h-[450px]"
                  title="Satisfied Computers Location - Transport Nagar, Saharanpur"
                />
              </div>
              <div className="text-center mt-6">
                <Button
                  asChild
                  variant="outline"
                  size="sm"
                  className="text-xs sm:text-sm px-4 py-2 h-9 sm:h-10 hover-scale glass-card"
                >
                  <a
                    href="https://maps.app.goo.gl/ynAf6JfJU6QiA41k9"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2"
                  >
                    <MapPin className="h-4 w-4" />
                    Open in Maps
                    <ArrowRight className="h-4 w-4" />
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section >

      {/* Footer - Enhanced */}
      < footer className="bg-foreground text-background py-8 sm:py-10 lg:py-12 relative overflow-hidden" >
        {/* Decorative Elements */}
        < div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-secondary/5 rounded-full blur-3xl" />

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            <div>
              <h3 className="text-base sm:text-lg font-semibold mb-4 flex items-center gap-2">
                <Star className="h-5 w-5 text-yellow-400" />
                Satisfied Computers
              </h3>
              <p className="text-background/70 mb-4 text-sm sm:text-base leading-relaxed">
                {content.footer.description}
              </p>
            </div>

            <div>
              <h3 className="text-base sm:text-lg font-semibold mb-4">Services</h3>
              <ul className="space-y-2 text-background/70 text-sm sm:text-base">
                <li className="hover:text-background transition-colors cursor-pointer">• Computer Repair</li>
                <li className="hover:text-background transition-colors cursor-pointer">• Printer Repair</li>
                <li className="hover:text-background transition-colors cursor-pointer">• CCTV Systems</li>
                <li className="hover:text-background transition-colors cursor-pointer">• Networking</li>
                <li className="hover:text-background transition-colors cursor-pointer">• IT Consulting</li>
              </ul>
            </div>

            <div>
              <h3 className="text-base sm:text-lg font-semibold mb-4">Contact Info</h3>
              <div className="space-y-2 text-background/70 text-sm sm:text-base">
                <p className="flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  <ClickableContact type="phone" value={content.contact.phone} showIcon={false} className="text-background/70 hover:text-background transition-colors" />
                </p>
                <p className="flex items-center gap-2">
                  <MessageCircle className="h-4 w-4" />
                  <ClickableContact type="whatsapp" value={content.contact.whatsapp} showIcon={false} className="text-background/70 hover:text-background transition-colors" />
                </p>
                <p className="flex items-center gap-2 break-all">
                  <Mail className="h-4 w-4 flex-shrink-0" />
                  <ClickableContact type="email" value={content.contact.email} showIcon={false} className="text-background/70 hover:text-background break-all transition-colors" />
                </p>
                <p className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 flex-shrink-0" />
                  <span>{content.contact.address.line1}, {content.contact.address.line2}</span>
                </p>
                <p className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  <span>{content.contact.hours.weekdays}, {content.contact.hours.saturday}</span>
                </p>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-8 border-t border-background/20 text-center">
            <p className="text-background/70 text-sm sm:text-base">
              © {new Date().getFullYear()} Satisfied Computers. Professional IT Services.
            </p>
          </div>
        </div>
      </footer >
    </div >
  );
}