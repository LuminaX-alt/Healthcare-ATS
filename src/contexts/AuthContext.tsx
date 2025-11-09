import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Patient, Doctor, Admin, Pharmacist } from '../types';
import api from '../api';

interface AuthContextType {
  user: User | null;
  userProfile: Patient | Doctor | Admin | Pharmacist | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string, role: string) => Promise<boolean>;
  loginWithOTP: (phoneNumber: string, otp: string) => Promise<boolean>;
  logout: () => void;
  updateProfile: (profile: any) => void;
  sendOTP: (phoneNumber: string) => Promise<boolean>;
  registerPatient: (name: string, email: string, phoneNumber: string, password: string) => Promise<void>;
  loginWithoutAuth: (demoUser: any) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<Patient | Doctor | Admin | Pharmacist | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const verifyAndSetAuthData = (token: string, userData: User, profileData: any) => {
    localStorage.setItem('authToken', token);
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('userProfile', JSON.stringify(profileData));
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    setUser(userData);
    setUserProfile(profileData);
    setIsAuthenticated(true);
  };

  const logout = React.useCallback(() => {
    try {
      console.log('=== LOGOUT INITIATED ===');
      setUser(null);
      setUserProfile(null);
      setIsAuthenticated(false);
      
      // Clear localStorage
      try {
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
        localStorage.removeItem('userProfile');
      } catch (storageError) {
        console.error('Error clearing localStorage:', storageError);
      }
      
      // Clear API auth header
      try {
        delete api.defaults.headers.common['Authorization'];
      } catch (apiError) {
        console.error('Error clearing API header:', apiError);
      }
      
      console.log('=== LOGOUT COMPLETE - Redirecting to home ===');
      
      // Force redirect to home page
      setTimeout(() => {
        window.location.href = '/';
      }, 100);
    } catch (error) {
      console.error('=== LOGOUT ERROR ===', error);
      // Even if there's an error, force redirect to home
      window.location.href = '/';
    }
  }, []);

  useEffect(() => {
    const loadUserFromToken = async () => {
      setIsLoading(true);
      try {
        const token = localStorage.getItem('authToken');
        const storedUser = localStorage.getItem('user');
        const storedProfile = localStorage.getItem('userProfile');
        
        if (token && storedUser && storedProfile) {
          // Load from localStorage for demo purposes
          const user = JSON.parse(storedUser);
          const profile = JSON.parse(storedProfile);
          
          api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          setUser(user);
          setUserProfile(profile);
          setIsAuthenticated(true);
        } else {
          throw new Error('No stored auth data found');
        }
      } catch (error) {
        console.error('Failed to load user:', error);
        // Don't call logout here to avoid loops
        setUser(null);
        setUserProfile(null);
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };

    loadUserFromToken();
  }, []);

  const login = async (email: string, password: string, role: string): Promise<boolean> => {
    setIsLoading(true);
    console.log('=== LOGIN ATTEMPT ===');
    console.log('Email:', email, 'Role:', role);
    
    try {
      const response = await api.post('/auth/login', { email, password, role });
      console.log('Login response:', response.data);
      
      const { token, user, profile } = response.data;

      if (!token || !user || !profile) {
        console.error('Missing data in response:', { token: !!token, user: !!user, profile: !!profile });
        throw new Error('Invalid response data');
      }

      console.log('Setting auth data:', { user, profile });
      // Store auth data with token
      verifyAndSetAuthData(token, user, profile);
      console.log('=== LOGIN SUCCESS ===');
      return true;
    } catch (error) {
      console.error("=== LOGIN FAILED ===", error);
      // Clear auth state on error
      setUser(null);
      setUserProfile(null);
      setIsAuthenticated(false);
      throw error; // Let components handle the error
    } finally {
      setIsLoading(false);
    }
  };

  const loginWithOTP = async (phoneNumber: string, otp: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      // Correct backend endpoint for OTP login
      const response = await api.post('/auth/verify-otp', { phone: phoneNumber, otp });
      const { token, user, profile } = response.data;
      if (token && user && profile) {
        verifyAndSetAuthData(token, user, profile);
        setIsLoading(false);
        return true;
      } else {
        throw new Error("OTP Login failed: Data not received");
      }
    } catch (error) {
      console.error("OTP Login failed", error);
      setIsLoading(false);
      return false;
    }
  };

  const sendOTP = async (phoneNumber: string): Promise<boolean> => {
    try {
      // Correct backend endpoint for sending OTP
      await api.post('/auth/send-otp', { phone: phoneNumber });
      return true;
    } catch (error) {
      console.error("Failed to send OTP", error);
      return false;
    }
  };

  const registerPatient = async (name: string, email: string, phoneNumber: string, password: string): Promise<void> => {
    setIsLoading(true);
    try {
      // Updated backend endpoint for patient registration
      const response = await api.post('/auth/register-patient', { name, email, phone: phoneNumber });
      const { user, patient } = response.data;
      if (user && patient) {
        // Optionally, you may want to log the user in after registration
        // For now, just show success or redirect
      } else {
        throw new Error("Registration failed: Data not received");
      }
    } catch (error) {
      console.error("Registration failed", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const updateProfile = async (profile: any) => {
    try {
        const response = await api.post('/update-profile', { profile });
        if (response.data.success) {
            setUserProfile(response.data.userProfile);
            localStorage.setItem('userProfile', JSON.stringify(response.data.userProfile));
        }
    } catch (error) {
        console.error("Failed to update profile", error);
    }
  };

  const loginWithoutAuth = async (demoUser: any) => {
    try {
      // Create a demo token
      const demoToken = 'demo-token-' + Math.random().toString(36).substring(7);
      
      // Set up demo user data that matches the User type
      // Ensure the role is one of the allowed values
      const role = demoUser.role as 'doctor' | 'admin' | 'pharmacist' | 'patient';
      
      const userData: User = {
        id: demoUser.id,
        email: demoUser.email,
        role,
        isVerified: true,
        createdAt: new Date().toISOString(),
        phoneNumber: demoUser.phoneNumber || null
      };

      // Set auth data without actual authentication
      verifyAndSetAuthData(demoToken, userData, demoUser);
      
      return Promise.resolve();
    } catch (error) {
      console.error('Demo login error:', error);
      return Promise.reject(error);
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      userProfile,
      isLoading,
      isAuthenticated,
      login,
      loginWithOTP,
      logout,
      updateProfile,
      sendOTP,
      registerPatient,
      loginWithoutAuth
    }}>
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
