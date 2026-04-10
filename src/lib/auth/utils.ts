/**
 * Auth utilities - Helper functions for authentication
 */

/**
 * Get Authorization header with Bearer token for authenticated requests
 */
export function getAuthHeader(token: string | null): HeadersInit {
  if (!token) {
    return {};
  }

  return {
    Authorization: `Bearer ${token}`,
  };
}

/**
 * Check if token is expired (simple check, doesn't validate signature)
 * JWT tokens have format: header.payload.signature
 */
export function isTokenExpired(token: string): boolean {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) {
      return true;
    }

    const payload = JSON.parse(atob(parts[1]));
    const expirationTime = payload.exp * 1000; // exp is in seconds
    return Date.now() >= expirationTime;
  } catch {
    return true;
  }
}

/**
 * Decode JWT token (without signature verification)
 * Only for accessing public claims, not for security verification
 */
export function decodeToken(token: string): Record<string, any> | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) {
      return null;
    }

    return JSON.parse(atob(parts[1]));
  } catch {
    return null;
  }
}
