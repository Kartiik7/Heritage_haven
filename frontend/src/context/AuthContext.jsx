import React, { useState, useEffect } from 'react';
import { getUserProfile } from '../utils/api';
import { AuthContext } from './auth-context';

function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load user data from localStorage on component mount
  useEffect(() => {
    const loadUserData = async () => {
      try {
        const storedToken = localStorage.getItem('hh_token');
        const storedUser = localStorage.getItem('hh_user');

        if (storedToken && storedUser) {
          setToken(storedToken);
          setUser(JSON.parse(storedUser));
          
          // Verify token is still valid by fetching user profile
          try {
            const userData = await getUserProfile(storedToken);
            setUser(userData);
          } catch (tokenError) {
            // Token is invalid, clear stored data
            console.warn('Stored token is invalid, clearing auth data', tokenError);
            clearAuth();
          }
        }
      } catch (error) {
        console.error('Error loading user data:', error);
        clearAuth();
      } finally {
        setLoading(false);
      }
    };

    loadUserData();
  }, []);

  const login = (userData) => {
    setUser({
      _id: userData._id,
      username: userData.username,
      email: userData.email,
    });
    setToken(userData.token);
    
    // Store in localStorage
    localStorage.setItem('hh_token', userData.token);
    localStorage.setItem('hh_user', JSON.stringify({
      _id: userData._id,
      username: userData.username,
      email: userData.email,
    }));
  };

  const logout = () => {
    clearAuth();
  };

  const clearAuth = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('hh_token');
    localStorage.removeItem('hh_user');
    localStorage.removeItem('hh_userName'); // Clear legacy username storage
  };

  const value = {
    user,
    token,
    loading,
    login,
    logout,
    isAuthenticated: !!user && !!token,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export default AuthProvider;