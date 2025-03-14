
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { MapPin, MessageSquare, User, Shield, Menu, X, LogIn, Scan } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/components/AuthProvider';
import AuthModal from '@/components/AuthModal';
import { Button } from '@/components/ui/button';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const location = useLocation();
  const { isAuthenticated, userName } = useAuth();
  
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  const navItems = [
    { name: 'Map', icon: <MapPin size={20} />, path: '/map' },
    { name: 'Forum', icon: <MessageSquare size={20} />, path: '/forum' },
    { name: 'Deepfake', icon: <Scan size={20} />, path: '/deepfake' },
    { name: 'Profile', icon: <User size={20} />, path: '/profile' },
  ];
  
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };
  
  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const handleLogin = () => {
    setAuthMode('login');
    setShowAuthModal(true);
  };

  const handleSignUp = () => {
    setAuthMode('register');
    setShowAuthModal(true);
  };

  return (
    <>
      <header 
        className={cn(
          'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
          isScrolled ? 'bg-background/80 backdrop-blur-md shadow-soft py-2' : 'bg-transparent py-4'
        )}
      >
        <div className="container max-w-7xl mx-auto px-4 md:px-6">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2" onClick={closeMobileMenu}>
              <Shield className="w-8 h-8 text-safety-600" />
              <span className="font-medium text-xl">SecurePathway</span>
            </Link>
            
            {/* Desktop Navigation */}
            {isAuthenticated ? (
              <nav className="hidden md:flex items-center space-x-1">
                {navItems.map((item) => (
                  <Link
                    key={item.name}
                    to={item.path}
                    className={cn(
                      'flex items-center space-x-1 px-4 py-2 rounded-full text-sm font-medium transition-colors',
                      location.pathname === item.path
                        ? 'bg-primary text-primary-foreground'
                        : 'text-foreground/70 hover:text-foreground hover:bg-muted'
                    )}
                  >
                    {item.icon}
                    <span>{item.name}</span>
                  </Link>
                ))}
              </nav>
            ) : (
              <div className="hidden md:flex items-center space-x-2">
                <Button variant="outline" size="sm" onClick={handleLogin}>
                  <LogIn className="mr-2 h-4 w-4" />
                  Sign In
                </Button>
                <Button size="sm" onClick={handleSignUp}>
                  <User className="mr-2 h-4 w-4" />
                  Sign Up
                </Button>
              </div>
            )}
            
            {/* User Profile or Auth Buttons for Mobile */}
            {isAuthenticated ? (
              <Link to="/profile" className="md:hidden flex items-center space-x-2">
                <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                  {userName?.charAt(0) || 'U'}
                </div>
              </Link>
            ) : (
              <div className="md:hidden flex items-center space-x-2">
                <Button variant="outline" size="sm" onClick={handleLogin}>
                  Sign In
                </Button>
              </div>
            )}
            
            {/* Mobile Menu Button */}
            <button
              className="md:hidden flex items-center justify-center w-10 h-10 rounded-full bg-background/90 shadow-soft"
              onClick={toggleMobileMenu}
              aria-label="Toggle mobile menu"
            >
              {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
        
        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden fixed inset-0 z-50 bg-background/95 backdrop-blur-lg animate-fade-in">
            <div className="flex flex-col items-center justify-center h-full">
              <button
                className="absolute top-5 right-5 p-2"
                onClick={toggleMobileMenu}
                aria-label="Close mobile menu"
              >
                <X size={24} />
              </button>
              
              <div className="flex flex-col items-center space-y-6">
                {isAuthenticated ? (
                  <>
                    {navItems.map((item) => (
                      <Link
                        key={item.name}
                        to={item.path}
                        className={cn(
                          'flex items-center space-x-2 px-6 py-3 rounded-full text-lg font-medium transition-colors',
                          location.pathname === item.path
                            ? 'bg-primary text-primary-foreground'
                            : 'text-foreground/80 hover:text-foreground hover:bg-muted'
                        )}
                        onClick={closeMobileMenu}
                      >
                        {item.icon}
                        <span>{item.name}</span>
                      </Link>
                    ))}
                  </>
                ) : (
                  <>
                    <Button onClick={handleLogin} className="w-full justify-center">
                      <LogIn className="mr-2 h-5 w-5" />
                      Sign In
                    </Button>
                    <Button onClick={handleSignUp} variant="outline" className="w-full justify-center">
                      <User className="mr-2 h-5 w-5" />
                      Sign Up
                    </Button>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Auth Modal */}
      <AuthModal 
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        initialMode={authMode}
      />
    </>
  );
};

export default Navbar;
