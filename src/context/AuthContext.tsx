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
      const storedToken = await AsyncStorage.getItem(STORAGE_KEYS.authToken);
      const storedRole = await AsyncStorage.getItem(STORAGE_KEYS.userRole);
      const storedProfile = await AsyncStorage.getItem(STORAGE_KEYS.userProfile);

      if (storedToken && storedProfile && storedRole) {
        const profile = JSON.parse(storedProfile);
        setUser(profile);
        setUserRole(storedRole as UserRole);
      }
    } catch (error) {
      console.warn('Failed to restore session:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const login = useCallback(async (email: string, password: string, role: UserRole) => {
    setIsLoading(true);
    try {
      // TODO: Call your API endpoint
      const response = await fetch('https://api.schoolbusapp.com/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password, role }),
      });

      if (!response.ok) {
        throw new Error('Login failed');
      }

      const { token, user: userData } = await response.json();

      await AsyncStorage.multiSet([
        [STORAGE_KEYS.authToken, token],
        [STORAGE_KEYS.userRole, role],
        [STORAGE_KEYS.userProfile, JSON.stringify(userData)],
      ]);

      setUser(userData);
      setUserRole(role);
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    setIsLoading(true);
    try {
      // TODO: Call your API endpoint to invalidate token
      await AsyncStorage.multiRemove([
        STORAGE_KEYS.authToken,
        STORAGE_KEYS.userRole,
        STORAGE_KEYS.userProfile,
      ]);

      setUser(null);
      setUserRole(null);
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const signup = useCallback(async (userData: Partial<AuthUser>, password: string) => {
    setIsLoading(true);
    try {
      // TODO: Call your API endpoint
      const response = await fetch('https://api.schoolbusapp.com/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...userData, password }),
      });

      if (!response.ok) {
        throw new Error('Signup failed');
      }

      const { token, user: newUser } = await response.json();

      await AsyncStorage.multiSet([
        [STORAGE_KEYS.authToken, token],
        [STORAGE_KEYS.userRole, userData.role || 'driver'],
        [STORAGE_KEYS.userProfile, JSON.stringify(newUser)],
      ]);

      setUser(newUser);
      setUserRole((userData.role as UserRole) || 'driver');
    } catch (error) {
      console.error('Signup error:', error);
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

      // TODO: Call your API endpoint
      const response = await fetch(`https://api.schoolbusapp.com/users/${user.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        throw new Error('Update failed');
      }

      const updatedUser = await response.json();

      await AsyncStorage.setItem(STORAGE_KEYS.userProfile, JSON.stringify(updatedUser));
      setUser(updatedUser);
    } catch (error) {
      console.error('Update profile error:', error);
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
