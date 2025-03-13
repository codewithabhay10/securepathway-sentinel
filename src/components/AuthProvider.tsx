
import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';

interface AuthContextType {
  isAuthenticated: boolean;
  userName: string | null;
  login: (name?: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userName, setUserName] = useState<string | null>(null);
  
  useEffect(() => {
    // Check if user is authenticated on mount
    const authStatus = localStorage.getItem('isAuthenticated') === 'true';
    const storedName = localStorage.getItem('userName');
    
    setIsAuthenticated(authStatus);
    setUserName(storedName);
  }, []);
  
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
  };
  
  return (
    <AuthContext.Provider value={{ isAuthenticated, userName, login, logout }}>
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
