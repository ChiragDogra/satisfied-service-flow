import { Link, useLocation } from 'react-router-dom';
import { Home, FileText, Search, LayoutDashboard, Plus } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';

export default function MobileNav() {
  const location = useLocation();
  const { user, isAdmin } = useAuth();
  const isMobile = useIsMobile();

  // Don't show on auth pages or if not mobile
  if (!isMobile || ['/login', '/register'].includes(location.pathname)) {
    return null;
  }

  const isActive = (path: string) => location.pathname === path;

  const navigation = user
    ? [
        { name: 'Home', href: '/', icon: Home },
        { name: 'Request', href: '/request', icon: Plus },
        { name: 'Status', href: '/status', icon: Search },
        { 
          name: 'Dashboard', 
          href: isAdmin ? '/admin/dashboard' : '/customer/dashboard', 
          icon: LayoutDashboard 
        },
      ]
    : [
        { name: 'Home', href: '/', icon: Home },
        { name: 'Request', href: '/request', icon: Plus },
        { name: 'Status', href: '/status', icon: Search },
      ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 border-t border-border shadow-lg lg:hidden">
      <div className="flex items-center justify-around px-2 py-2 safe-area-bottom">
        {navigation.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href);
          return (
            <Link
              key={item.name}
              to={item.href}
              className={cn(
                "flex flex-col items-center justify-center min-w-[64px] min-h-[56px] rounded-lg transition-all duration-200 relative px-3 py-2",
                active
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <div className={cn(
                "flex items-center justify-center w-10 h-10 rounded-full transition-colors duration-200",
                active && "bg-primary/10"
              )}>
                <Icon className={cn(
                  "w-5 h-5 transition-all duration-200",
                  active && "scale-110"
                )} />
              </div>
              <span className={cn(
                "text-xs font-medium mt-1 transition-all duration-200",
                active && "font-semibold"
              )}>
                {item.name}
              </span>
              {active && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-12 h-1 bg-primary rounded-full" />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
