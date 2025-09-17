import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Menu, X } from 'lucide-react';
import { useState } from 'react';
import logo from '@/assets/logo.png';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  const navigation = [
    { name: 'Home', href: '/' },
    { name: 'Request Service', href: '/request' },
    { name: 'Check Status', href: '/status' },
  ];

  return (
    <header className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50 w-full border-b border-border/40">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8" aria-label="Global">
        <div className="flex flex-1">
          <Link to="/" className="flex items-center space-x-2" onClick={() => setIsMenuOpen(false)}>
            <img className="h-8 w-auto" src={logo} alt="Satisfied Computers" />
            <span className="font-bold text-lg text-foreground hidden xs:block">Satisfied Computers</span>
            <span className="font-bold text-base text-foreground block xs:hidden">SC</span>
          </Link>
        </div>
        
        <div className="flex lg:hidden">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="relative z-50 p-2"
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          >
            {isMenuOpen ? (
              <X className="h-6 w-6" aria-hidden="true" />
            ) : (
              <Menu className="h-6 w-6" aria-hidden="true" />
            )}
          </Button>
        </div>
        
        <div className="hidden lg:flex lg:gap-x-6 xl:gap-x-8">
          {navigation.map((item) => (
            <Link
              key={item.name}
              to={item.href}
              className={`text-sm font-semibold leading-6 transition-colors hover:text-primary min-h-[44px] flex items-center px-3 py-2 rounded-md ${
                isActive(item.href) ? 'text-primary bg-primary/10' : 'text-muted-foreground'
              }`}
            >
              {item.name}
            </Link>
          ))}
        </div>
        
        <div className="hidden lg:flex lg:flex-1 lg:justify-end">
          <Button asChild variant="professional" size="sm" className="min-h-[44px]">
            <Link to="/admin">Admin Access</Link>
          </Button>
        </div>
      </nav>
      
      {/* Mobile menu overlay */}
      {isMenuOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm lg:hidden"
            onClick={() => setIsMenuOpen(false)}
          />
          
          {/* Mobile menu panel */}
          <div className="fixed inset-y-0 right-0 z-50 w-full max-w-sm bg-background shadow-xl lg:hidden">
            <div className="flex h-full flex-col overflow-y-auto">
              {/* Header */}
              <div className="flex items-center justify-between px-4 py-6 border-b border-border/20">
                <Link to="/" className="flex items-center space-x-2" onClick={() => setIsMenuOpen(false)}>
                  <img className="h-8 w-auto" src={logo} alt="Satisfied Computers" />
                  <span className="font-bold text-lg text-foreground">Satisfied Computers</span>
                </Link>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsMenuOpen(false)}
                  className="p-2"
                  aria-label="Close menu"
                >
                  <X className="h-6 w-6" aria-hidden="true" />
                </Button>
              </div>
              
              {/* Navigation links */}
              <div className="flex-1 px-4 py-6">
                <div className="space-y-2">
                  {navigation.map((item) => (
                    <Link
                      key={item.name}
                      to={item.href}
                      className={`block rounded-lg px-4 py-3 text-base font-semibold transition-colors min-h-[48px] flex items-center ${
                        isActive(item.href) 
                          ? 'text-primary bg-primary/10' 
                          : 'text-foreground hover:bg-muted'
                      }`}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {item.name}
                    </Link>
                  ))}
                </div>
                
                {/* Admin button */}
                <div className="mt-6 pt-6 border-t border-border/20">
                  <Button asChild variant="professional" className="w-full min-h-[48px] text-base">
                    <Link to="/admin" onClick={() => setIsMenuOpen(false)}>Admin Access</Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </header>
  );
}