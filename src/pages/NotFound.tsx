
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Shield } from 'lucide-react';

const NotFound = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4">
      <div className="max-w-md w-full text-center">
        <div className="inline-flex items-center justify-center mb-8 p-4 rounded-2xl bg-safety-100">
          <Shield className="w-10 h-10 text-safety-600" />
        </div>
        
        <h1 className="text-4xl font-bold mb-4">Page Not Found</h1>
        
        <p className="text-xl text-muted-foreground mb-8">
          The page you're looking for doesn't exist or has been moved.
        </p>
        
        <Link 
          to="/" 
          className="inline-flex items-center px-6 py-3 rounded-full bg-primary text-primary-foreground shadow-soft hover:shadow-medium transition-all"
        >
          <ArrowLeft className="mr-2 w-5 h-5" />
          Back to Home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
