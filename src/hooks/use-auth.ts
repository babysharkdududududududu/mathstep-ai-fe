'use client';

import { useEffect, useState } from 'react';

/**
 * Custom hook for managing authentication state and JWT token
 * Handles localStorage persistence and token lifecycle
 */
export function useAuth() {
  const [token, setTokenState] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize token from localStorage on mount
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const storedToken = localStorage.getItem('authToken');
    setTokenState(storedToken);
    setIsLoading(false);
  }, []);

  /**
   * Set token and persist to localStorage
   */
  const setToken = (newToken: string | null) => {
    if (newToken) {
      localStorage.setItem('authToken', newToken);
      setTokenState(newToken);
    } else {
      localStorage.removeItem('authToken');
      setTokenState(null);
    }
  };

  /**
   * Get current token
   */
  const getToken = () => token;

  /**
   * Check if user is authenticated
   */
  const isAuthenticated = () => !!token;

  /**
   * Logout - clear token
   */
  const logout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('loggedIn');
    localStorage.removeItem('lastUser');
    setTokenState(null);
  };

  return {
    token,
    setToken,
    getToken,
    isAuthenticated,
    logout,
    isLoading,
  };
}
