
import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Shield, ArrowRight, Map, MessageSquare, Bell, User, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

const Index = () => {
  const featuresRef = useRef<HTMLDivElement>(null);
  
  const scrollToFeatures = () => {
    featuresRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  return (
    <div className="min-h-screen">
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
              <Link
                to="/map"
                className="px-8 py-3 rounded-full bg-primary text-primary-foreground font-medium shadow-soft hover:shadow-medium transition-all"
              >
                Open Safety Map
              </Link>
              
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
              <Link to="/map" className="inline-flex items-center mt-4 text-primary font-medium hover:underline">
                <span>Open Safety Map</span>
                <ArrowRight className="ml-1 w-4 h-4" />
              </Link>
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
              <button className="inline-flex items-center mt-4 text-primary font-medium hover:underline">
                <span>Learn How It Works</span>
                <ArrowRight className="ml-1 w-4 h-4" />
              </button>
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
              <Link to="/forum" className="inline-flex items-center mt-4 text-primary font-medium hover:underline">
                <span>Join the Conversation</span>
                <ArrowRight className="ml-1 w-4 h-4" />
              </Link>
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
            <Link
              to="/profile"
              className="inline-flex items-center px-8 py-3 rounded-full bg-primary text-primary-foreground font-medium shadow-soft hover:shadow-medium transition-all"
            >
              <User className="mr-2 w-5 h-5" />
              <span>Create Your Profile</span>
            </Link>
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
    </div>
  );
};

export default Index;
