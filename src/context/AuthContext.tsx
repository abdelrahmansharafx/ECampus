import React, { createContext, useCallback, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthUser, UserRole } from '../types';
import { STORAGE_KEYS } from '../constants';

interface AuthContextType {
  user: AuthUser | null;
  isLoading: boolean;
  isSignedIn: boolean;
  userRole: UserRole | null;
  login: (email: string, password: string, role: UserRole) => Promise<void>;
  logout: () => Promise<void>;
  signup: (userData: Partial<AuthUser>, password: string) => Promise<void>;
  updateProfile: (userData: Partial<AuthUser>) => Promise<void>;
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
  isSignedIn: false,
  userRole: null,
  login: async () => {},
  logout: async () => {},
  signup: async () => {},
  updateProfile: async () => {},
});

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Bootstrap async data
  useEffect(() => {
    bootstrapAsync();
  }, []);

  const bootstrapAsync = async () => {
    try {
      // Don't auto-login - always start on login screen
      // User must manually log in each time
      // Clear any stored auth data to ensure fresh start
      await AsyncStorage.multiRemove([
        STORAGE_KEYS.authToken,
        STORAGE_KEYS.userRole,
        STORAGE_KEYS.userProfile,
      ]);
    } catch (error) {
      // Silently handle errors
    } finally {
      setIsLoading(false);
    }
  };

  const login = useCallback(async (email: string, password: string, role: UserRole) => {
    setIsLoading(true);
    try {
      // TODO: Integrate with backend API
      // Example: const response = await fetch('YOUR_API_ENDPOINT/auth/login', { ... });
      // const { token, user: userData } = await response.json();

      // Mock user data for development
      const mockUser: AuthUser = {
        id: '1',
        name: role === 'driver' ? 'John Doe' : 'Parent User',
        email,
        phone: '+1234567890',
        role,
      };

      const mockToken = 'mock_token_' + Date.now();

      await AsyncStorage.multiSet([
        [STORAGE_KEYS.authToken, mockToken],
        [STORAGE_KEYS.userRole, role],
        [STORAGE_KEYS.userProfile, JSON.stringify(mockUser)],
      ]);

      setUser(mockUser);
      setUserRole(role);
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    setIsLoading(true);
    try {
      // TODO: Integrate with backend API to invalidate token
      // Example: await fetch('YOUR_API_ENDPOINT/auth/logout', { method: 'POST' });

      await AsyncStorage.multiRemove([
        STORAGE_KEYS.authToken,
        STORAGE_KEYS.userRole,
        STORAGE_KEYS.userProfile,
      ]);

      setUser(null);
      setUserRole(null);
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const signup = useCallback(async (userData: Partial<AuthUser>, password: string) => {
    setIsLoading(true);
    try {
      // TODO: Integrate with backend API
      // Example: const response = await fetch('YOUR_API_ENDPOINT/auth/register', { ... });
      // const { token, user: newUser } = await response.json();

      // Mock user data for development
      const mockUser: AuthUser = {
        id: Date.now().toString(),
        name: userData.name || 'New User',
        email: userData.email || '',
        phone: userData.phone || '',
        role: (userData.role as UserRole) || 'driver',
      };

      const mockToken = 'mock_token_' + Date.now();

      await AsyncStorage.multiSet([
        [STORAGE_KEYS.authToken, mockToken],
        [STORAGE_KEYS.userRole, mockUser.role],
        [STORAGE_KEYS.userProfile, JSON.stringify(mockUser)],
      ]);

      setUser(mockUser);
      setUserRole(mockUser.role);
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateProfile = useCallback(async (userData: Partial<AuthUser>) => {
    try {
      if (!user) {
        throw new Error('No user logged in');
      }

      // TODO: Integrate with backend API
      // Example: const response = await fetch(`YOUR_API_ENDPOINT/users/${user.id}`, { ... });
      // const updatedUser = await response.json();

      // Update locally for development
      const updatedUser = { ...user, ...userData };
      await AsyncStorage.setItem(STORAGE_KEYS.userProfile, JSON.stringify(updatedUser));
      setUser(updatedUser);
    } catch (error) {
      throw error;
    }
  }, [user]);

  const value = {
    user,
    isLoading,
    isSignedIn: !!user,
    userRole,
    login,
    logout,
    signup,
    updateProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;
