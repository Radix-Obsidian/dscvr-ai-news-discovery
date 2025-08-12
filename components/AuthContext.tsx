import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  preferences: {
    theme: 'dark' | 'light' | 'system';
    notifications: boolean;
    emailUpdates: boolean;
    interests: string[];
  };
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, name: string) => Promise<void>;
  signOut: () => Promise<void>;
  updateUser: (updates: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Mock authentication - in real app, this would connect to backend
  useEffect(() => {
    // Check for existing session
    const savedUser = localStorage.getItem('dscvr_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setIsLoading(false);
  }, []);

  const signIn = async (email: string, _password: string) => {
    // Mock authentication - in real app, this would validate credentials
    const mockUser: User = {
      id: "1",
      email,
      name: "Demo User",
      preferences: {
        theme: "dark",
        notifications: true,
        emailUpdates: false,
        interests: ["Technology", "Science", "Business"]
      }
    };
    
    setUser(mockUser);
    // setIsAuthenticated(true); // This line was removed from the new_code, so it's removed here.
  };

  const signUp = async (email: string, _password: string, name: string) => {
    // Mock registration - in real app, this would create a new user
    const mockUser: User = {
      id: "1",
      email,
      name,
      preferences: {
        theme: "dark",
        notifications: true,
        emailUpdates: false,
        interests: ["Technology", "Science", "Business"]
      }
    };
    
    setUser(mockUser);
    // setIsAuthenticated(true); // This line was removed from the new_code, so it's removed here.
  };

  const signOut = async () => {
    setUser(null);
    localStorage.removeItem('dscvr_user');
  };

  const updateUser = (updates: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...updates };
      setUser(updatedUser);
      localStorage.setItem('dscvr_user', JSON.stringify(updatedUser));
    }
  };

  const value = {
    user,
    isAuthenticated: !!user,
    isLoading,
    signIn,
    signUp,
    signOut,
    updateUser
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}