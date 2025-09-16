import { createContext, useContext, useState, useEffect } from 'react';
import type { User } from '@shared/schema';

interface UserContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  isLoggedIn: boolean;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Check localStorage for persisted user
    const savedUser = localStorage.getItem('wellnest-user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (error) {
        console.error('Failed to parse saved user:', error);
        localStorage.removeItem('wellnest-user');
      }
    }
  }, []);

  useEffect(() => {
    // Persist user to localStorage
    if (user) {
      localStorage.setItem('wellnest-user', JSON.stringify(user));
    } else {
      localStorage.removeItem('wellnest-user');
    }
  }, [user]);

  const isLoggedIn = !!user;

  return (
    <UserContext.Provider value={{user, setUser, isLoggedIn}}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}