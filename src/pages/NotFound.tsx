import { Link } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Header from "@/components/Header";
import { Home, AlertTriangle, ArrowLeft } from "lucide-react";

const NotFound = () => {
  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", window.location.pathname);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="flex items-center justify-center min-h-[80vh] px-4">
        <Card className="w-full max-w-md text-center">
          <CardContent className="p-8">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-muted mb-6">
              <AlertTriangle className="h-8 w-8 text-muted-foreground" />
            </div>
            
            <h1 className="text-4xl font-bold text-foreground mb-4">404</h1>
            <h2 className="text-xl font-semibold text-foreground mb-4">Page Not Found</h2>
            <p className="text-muted-foreground mb-8">
              Sorry, we couldn't find the page you're looking for. 
              It might have been moved, deleted, or you may have mistyped the URL.
            </p>
            
            <div className="space-y-3">
              <Button asChild size="lg" className="w-full">
                <Link to="/">
                  <Home className="mr-2 h-4 w-4" />
                  Back to Home
                </Link>
              </Button>
              
              <Button asChild variant="outline" className="w-full">
                <Link to="/request">
                  Request IT Service
                </Link>
              </Button>
            </div>
            
            <div className="mt-8 pt-6 border-t border-border">
              <p className="text-sm text-muted-foreground">
                Need help? Contact us at{" "}
                <a href="tel:+1-555-123-8324" className="text-primary hover:underline font-medium">
                  (555) 123-TECH
                </a>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default NotFound;
