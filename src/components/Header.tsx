import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Menu, X, LogOut, User } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import logo from '@/assets/logo.png';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const { user, isAdmin, signOut } = useAuth();

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
            <span className="font-bold text-base sm:text-lg text-foreground">Satisfied Computers</span>
          </Link>
        </div>

        {/* Desktop navigation */}
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

        <div className="hidden lg:flex lg:flex-1 lg:justify-end lg:items-center lg:gap-3">
          {user ? (
            <>
              <span className="text-sm text-muted-foreground">
                {isAdmin ? 'Admin' : 'Customer'}
              </span>
              <Button asChild variant="outline" size="sm" className="min-h-[44px]">
                <Link to={isAdmin ? '/admin/dashboard' : '/customer/dashboard'}>
                  <User className="w-4 h-4 mr-2" />
                  Dashboard
                </Link>
              </Button>
              <Button variant="ghost" size="sm" onClick={signOut} className="min-h-[44px]">
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out
              </Button>
            </>
          ) : (
            <>
              <Button asChild variant="ghost" size="sm" className="min-h-[44px]">
                <Link to="/login">Sign In</Link>
              </Button>
              <Button asChild variant="professional" size="sm" className="min-h-[44px]">
                <Link to="/register">Get Started</Link>
              </Button>
            </>
          )}
        </div>

        {/* Mobile hamburger & sheet */}
        <div className="flex lg:hidden">
          <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="p-2"
                aria-label="Open menu"
              >
                <Menu className="h-6 w-6" aria-hidden="true" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-full sm:max-w-sm p-0">
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
              <div className="px-4 py-6">
                <div className="space-y-2">
                  {navigation.map((item) => (
                    <Link
                      key={item.name}
                      to={item.href}
                      className={`flex rounded-lg px-4 py-3 text-base font-semibold transition-colors min-h-[48px] items-center ${
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
                <div className="mt-6 pt-6 border-t border-border/20 space-y-3">
                  {user ? (
                    <>
                      <Button asChild variant="outline" className="w-full min-h-[48px] text-base">
                        <Link to={isAdmin ? '/admin/dashboard' : '/customer/dashboard'} onClick={() => setIsMenuOpen(false)}>
                          <User className="w-4 h-4 mr-2" />
                          Dashboard
                        </Link>
                      </Button>
                      <Button variant="ghost" onClick={() => { signOut(); setIsMenuOpen(false); }} className="w-full min-h-[48px] text-base">
                        <LogOut className="w-4 h-4 mr-2" />
                        Sign Out
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button asChild variant="ghost" className="w-full min-h-[48px] text-base">
                        <Link to="/login" onClick={() => setIsMenuOpen(false)}>Sign In</Link>
                      </Button>
                      <Button asChild variant="professional" className="w-full min-h-[48px] text-base">
                        <Link to="/register" onClick={() => setIsMenuOpen(false)}>Get Started</Link>
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </nav>
    </header>
  );
}
