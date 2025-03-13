
import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

interface AuthContextType {
  isAuthenticated: boolean;
  userName: string | null;
  login: (name?: string) => void;
  logout: () => void;
  requireAuth: () => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// List of routes that require authentication
const protectedRoutes = ['/map', '/forum', '/profile'];

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userName, setUserName] = useState<string | null>(null);
  const navigate = useNavigate();
  const location = useLocation();
  
  useEffect(() => {
    // Check if user is authenticated on mount
    const authStatus = localStorage.getItem('isAuthenticated') === 'true';
    const storedName = localStorage.getItem('userName');
    
    setIsAuthenticated(authStatus);
    setUserName(storedName);
  }, []);
  
  // Check if current route requires authentication and redirect if needed
  useEffect(() => {
    if (!isAuthenticated && protectedRoutes.includes(location.pathname)) {
      navigate('/', { replace: true });
    }
  }, [isAuthenticated, location.pathname, navigate]);
  
  const login = (name?: string) => {
    setIsAuthenticated(true);
    localStorage.setItem('isAuthenticated', 'true');
    
    if (name) {
      setUserName(name);
      localStorage.setItem('userName', name);
    }
  };
  
  const logout = () => {
    setIsAuthenticated(false);
    setUserName(null);
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('userName');
    navigate('/', { replace: true });
  };
  
  const requireAuth = (): boolean => {
    if (!isAuthenticated) {
      navigate('/', { replace: true });
      return false;
    }
    return true;
  };
  
  return (
    <AuthContext.Provider value={{ isAuthenticated, userName, login, logout, requireAuth }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
};
