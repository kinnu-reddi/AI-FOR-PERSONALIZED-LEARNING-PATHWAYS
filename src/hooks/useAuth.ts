import { useState, useEffect } from 'react';
import { User } from '../types';
import { dataService } from '../services/dataService';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const currentUser = dataService.getCurrentUser();
    setUser(currentUser);
    setLoading(false);
  }, []);

  const login = (userData: Omit<User, 'id' | 'progress'>) => {
    const newUser: User = {
      ...userData,
      id: `user-${Date.now()}`,
      progress: [],
    };
    
    dataService.saveUser(newUser);
    dataService.setCurrentUser(newUser);
    setUser(newUser);
  };

  const logout = () => {
    const data = JSON.parse(localStorage.getItem('learning-platform-data') || '{}');
    delete data.currentUser;
    localStorage.setItem('learning-platform-data', JSON.stringify(data));
    setUser(null);
  };

  const updateUser = (updates: Partial<User>) => {
    if (!user) return;
    
    const updatedUser = { ...user, ...updates };
    dataService.saveUser(updatedUser);
    dataService.setCurrentUser(updatedUser);
    setUser(updatedUser);
  };

  return {
    user,
    loading,
    login,
    logout,
    updateUser,
    isAuthenticated: !!user,
  };
};