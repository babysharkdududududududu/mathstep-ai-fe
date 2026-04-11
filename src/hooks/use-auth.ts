'use client';

import { useEffect, useState } from 'react';

/**
 * Custom hook for managing authentication state and JWT tokens
 * Handles: access_token, refresh_token, and "Keep me logged in" functionality
 * Supports transparent token refresh on 401 responses
 */
export function useAuth() {
  const [accessToken, setAccessTokenState] = useState<string | null>(null);
  const [refreshToken, setRefreshTokenState] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize tokens from localStorage on mount
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const storedAccessToken = localStorage.getItem('authToken');
    const storedRefreshToken = localStorage.getItem('refreshToken');
    
    console.log('[useAuth] Initialize:', { 
      hasAccessToken: !!storedAccessToken, 
      hasRefreshToken: !!storedRefreshToken 
    });

    setAccessTokenState(storedAccessToken);
    setRefreshTokenState(storedRefreshToken);
    setIsLoading(false);
  }, []);

  /**
   * Set access token and persist to localStorage
   */
  const setToken = (newToken: string | null) => {
    if (newToken) {
      localStorage.setItem('authToken', newToken);
      setAccessTokenState(newToken);
      console.log('[useAuth] Access token set');
    } else {
      localStorage.removeItem('authToken');
      setAccessTokenState(null);
      console.log('[useAuth] Access token cleared');
    }
  };

  /**
   * Set refresh token and persist to localStorage
   * Called when login/register has "Keep me logged in" = true
   */
  const setRefreshTokenValue = (newRefreshToken: string | null) => {
    if (newRefreshToken) {
      localStorage.setItem('refreshToken', newRefreshToken);
      setRefreshTokenState(newRefreshToken);
      console.log('[useAuth] Refresh token set (30-day "Keep me logged in")');
    } else {
      localStorage.removeItem('refreshToken');
      setRefreshTokenState(null);
      console.log('[useAuth] Refresh token cleared');
    }
  };

  /**
   * Set both tokens (called after login/register)
   */
  const setTokens = (accessToken: string, refreshToken?: string | null) => {
    setToken(accessToken);
    if (refreshToken) {
      setRefreshTokenValue(refreshToken);
    }
  };

  /**
   * Get current access token
   */
  const getToken = () => accessToken;

  /**
   * Get current refresh token
   */
  const getRefreshToken = () => refreshToken;

  /**
   * Check if user is authenticated
   */
  const isAuthenticated = () => !!accessToken;

  /**
   * Check if user has refresh token (for auto-refresh capability)
   */
  const hasRefreshToken = () => !!refreshToken;

  /**
   * Logout - clear both tokens and user data
   */
  const logout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('loggedIn');
    localStorage.removeItem('lastUser');
    setAccessTokenState(null);
    setRefreshTokenState(null);
    console.log('[useAuth] Logout complete - all tokens cleared');
  };

  return {
    // Access token (short-lived)
    token: accessToken,
    setToken,
    getToken,

    // Refresh token (30-day "Keep me logged in")
    refreshToken,
    setRefreshTokenValue,
    getRefreshToken,
    hasRefreshToken,

    // Combined setter
    setTokens,

    // State
    isAuthenticated,
    isLoading,
    logout,
  };
}
