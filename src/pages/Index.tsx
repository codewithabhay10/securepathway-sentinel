
import React, { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Shield, ArrowRight, Map, MessageSquare, Bell, User, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import AuthModal from '@/components/AuthModal';
import { useAuth } from '@/components/AuthProvider';

const Index = () => {
  const featuresRef = useRef<HTMLDivElement>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const { isAuthenticated, userName } = useAuth();
  const navigate = useNavigate();
  
  const scrollToFeatures = () => {
    featuresRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  const handleLoginClick = () => {
    setAuthMode('login');
    setShowAuthModal(true);
  };
  
  const handleRegisterClick = () => {
    setAuthMode('register');
    setShowAuthModal(true);
  };
  
  const handleGetStartedClick = () => {
    if (isAuthenticated) {
      navigate('/map');
    } else {
      setAuthMode('register');
      setShowAuthModal(true);
    }
  };
  
  return (
    <div className="min-h-screen">
      {/* Navigation Bar */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b">
        <div className="container max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-2">
              <Shield className="w-6 h-6 text-safety-600" />
              <span className="font-medium text-lg">SecurePathway</span>
            </div>
            
            <nav className="hidden md:flex items-center space-x-6">
              {isAuthenticated && (
                <>
                  <Link to="/map" className="text-muted-foreground hover:text-foreground transition-colors">
                    Safety Map
                  </Link>
                  <Link to="/forum" className="text-muted-foreground hover:text-foreground transition-colors">
                    Community
                  </Link>
                  <Link to="/profile" className="text-muted-foreground hover:text-foreground transition-colors">
                    Resources
                  </Link>
                </>
              )}
            </nav>
            
            <div>
              {isAuthenticated ? (
                <Link to="/profile" className="flex items-center space-x-2">
                  <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                    {userName?.charAt(0) || 'U'}
                  </div>
                  <span className="hidden md:inline">{userName || 'Profile'}</span>
                </Link>
              ) : (
                <div className="space-x-2">
                  <Button variant="outline" size="sm" onClick={handleLoginClick}>
                    Sign In
                  </Button>
                  <Button size="sm" onClick={handleRegisterClick}>
                    Sign Up
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>
      
      {/* Hero Section */}
      <section className="relative pt-24 pb-32 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-safety-100 to-background -z-10" />
        <div className="absolute top-1/4 right-0 w-3/4 h-3/4 bg-safety-200 rounded-full blur-3xl opacity-20 transform translate-x-1/2 -z-10" />
        
        <div className="container max-w-6xl mx-auto">
          <div className="flex flex-col items-center text-center mb-16">
            <div className="inline-flex items-center justify-center mb-8 p-3 rounded-2xl bg-safety-100">
              <Shield className="w-8 h-8 text-safety-600" />
            </div>
            
            <h1 className="text-4xl md:text-6xl font-semibold leading-tight tracking-tight mb-6 max-w-3xl">
              Safety & Community for Women on the Move
            </h1>
            
            <p className="text-xl text-muted-foreground mb-10 max-w-2xl">
              Navigate confidently with real-time safety maps, community insights, and emergency assistance when you need it most.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                onClick={handleGetStartedClick}
                className="px-8 py-3 rounded-full bg-primary text-primary-foreground font-medium shadow-soft hover:shadow-medium transition-all"
              >
                Get Started Now
              </Button>
              
              <button
                onClick={scrollToFeatures}
                className="px-8 py-3 rounded-full bg-secondary text-secondary-foreground font-medium hover:bg-secondary/80 transition-colors"
              >
                Learn More
              </button>
            </div>
          </div>
          
          {/* Device Preview */}
          <div className="relative max-w-md mx-auto">
            <div className="relative z-10 rounded-[2.5rem] border-8 border-foreground/10 shadow-medium overflow-hidden">
              <div className="aspect-[9/19] bg-muted rounded-[2rem] overflow-hidden">
                <img 
                  src="https://placehold.co/1080x2340/f0f7ff/ffffff?text=App+Preview" 
                  alt="App Preview" 
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
            
            <div className="absolute top-1/2 left-0 -translate-y-1/2 -translate-x-2/3 w-48 h-48 rounded-full bg-safety-300 blur-xl opacity-30" />
            <div className="absolute bottom-1/4 right-0 translate-x-1/2 w-32 h-32 rounded-full bg-safety-500 blur-xl opacity-20" />
          </div>
        </div>
        
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <ChevronDown className="w-8 h-8 text-muted-foreground/50" />
        </div>
      </section>
      
      {/* Features Section */}
      <section ref={featuresRef} className="py-20 px-4 bg-white">
        <div className="container max-w-6xl mx-auto">
          <div className="flex flex-col items-center text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-semibold mb-6">Essential Safety Features</h2>
            <p className="text-lg text-muted-foreground max-w-2xl">
              Designed with input from safety experts and women worldwide, our platform offers comprehensive tools for urban navigation.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="glass-panel-hover p-6">
              <div className="w-12 h-12 rounded-xl bg-safety-100 text-safety-700 flex items-center justify-center mb-4">
                <Map className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-medium mb-2">Real-time Safety Maps</h3>
              <p className="text-muted-foreground">
                Navigate with confidence using maps that show well-lit paths, safe zones, and areas to avoid based on real-time data.
              </p>
              {isAuthenticated ? (
                <Link to="/map" className="inline-flex items-center mt-4 text-primary font-medium hover:underline">
                  <span>Open Safety Map</span>
                  <ArrowRight className="ml-1 w-4 h-4" />
                </Link>
              ) : (
                <button onClick={handleRegisterClick} className="inline-flex items-center mt-4 text-primary font-medium hover:underline">
                  <span>Sign Up to Access</span>
                  <ArrowRight className="ml-1 w-4 h-4" />
                </button>
              )}
            </div>
            
            {/* Feature 2 */}
            <div className="glass-panel-hover p-6">
              <div className="w-12 h-12 rounded-xl bg-safety-100 text-safety-700 flex items-center justify-center mb-4">
                <Bell className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-medium mb-2">Emergency SOS</h3>
              <p className="text-muted-foreground">
                One-tap emergency alert system that shares your location with trusted contacts and local authorities when needed.
              </p>
              {isAuthenticated ? (
                <button className="inline-flex items-center mt-4 text-primary font-medium hover:underline">
                  <span>Learn How It Works</span>
                  <ArrowRight className="ml-1 w-4 h-4" />
                </button>
              ) : (
                <button onClick={handleRegisterClick} className="inline-flex items-center mt-4 text-primary font-medium hover:underline">
                  <span>Sign Up to Access</span>
                  <ArrowRight className="ml-1 w-4 h-4" />
                </button>
              )}
            </div>
            
            {/* Feature 3 */}
            <div className="glass-panel-hover p-6">
              <div className="w-12 h-12 rounded-xl bg-safety-100 text-safety-700 flex items-center justify-center mb-4">
                <MessageSquare className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-medium mb-2">Community Safety Forum</h3>
              <p className="text-muted-foreground">
                Share and access community insights about neighborhoods, streets, and venues from other women.
              </p>
              {isAuthenticated ? (
                <Link to="/forum" className="inline-flex items-center mt-4 text-primary font-medium hover:underline">
                  <span>Join the Conversation</span>
                  <ArrowRight className="ml-1 w-4 h-4" />
                </Link>
              ) : (
                <button onClick={handleRegisterClick} className="inline-flex items-center mt-4 text-primary font-medium hover:underline">
                  <span>Sign Up to Access</span>
                  <ArrowRight className="ml-1 w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-b from-background to-safety-100">
        <div className="container max-w-5xl mx-auto">
          <div className="glass-panel p-8 md:p-12 text-center">
            <h2 className="text-3xl md:text-4xl font-semibold mb-6">Join Our Safety Network</h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              Connect with a community dedicated to creating safer environments for women everywhere. Your insights help make our cities safer.
            </p>
            {isAuthenticated ? (
              <Link
                to="/forum"
                className="inline-flex items-center px-8 py-3 rounded-full bg-primary text-primary-foreground font-medium shadow-soft hover:shadow-medium transition-all"
              >
                <MessageSquare className="mr-2 w-5 h-5" />
                <span>Join the Community</span>
              </Link>
            ) : (
              <Button
                onClick={handleRegisterClick}
                className="inline-flex items-center px-8 py-3 rounded-full bg-primary text-primary-foreground font-medium shadow-soft hover:shadow-medium transition-all"
              >
                <User className="mr-2 w-5 h-5" />
                <span>Sign Up Today</span>
              </Button>
            )}
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="py-12 px-4 bg-white border-t">
        <div className="container max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-6 md:mb-0">
              <Shield className="w-6 h-6 text-safety-600" />
              <span className="font-medium text-lg">SecurePathway</span>
            </div>
            
            <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-8 items-center text-muted-foreground">
              <a href="#" className="hover:text-foreground transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-foreground transition-colors">Terms of Service</a>
              <a href="#" className="hover:text-foreground transition-colors">Contact Us</a>
              <p className="text-sm">© 2023 SecurePathway. All rights reserved.</p>
            </div>
          </div>
        </div>
      </footer>
      
      {/* Auth Modal */}
      <AuthModal 
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        initialMode={authMode}
      />
    </div>
  );
};

export default Index;
