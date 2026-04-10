/**
 * Auth Service - Handles all authentication API calls
 */

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
  role?: 'STUDENT' | 'PARENT';
}

export interface GoogleLoginRequest {
  token: string;
}

export interface TokenResponse {
  access_token: string;
  token_type: string;
}

export interface UserResponse {
  id: string;
  email: string;
  name?: string;
  role?: string;
  created_at?: string;
}

class AuthServiceClass {
  private apiUrl = API_URL;

  /**
   * Register a new user
   */
  async register(data: RegisterRequest): Promise<TokenResponse> {
    const response = await fetch(`${this.apiUrl}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: data.email,
        password: data.password,
        role: data.role || 'STUDENT',
        // Backend may handle name differently, adjust if needed
        name: data.firstName && data.lastName ? `${data.firstName} ${data.lastName}` : undefined,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Registration failed');
    }

    return response.json();
  }

  /**
   * Login with email and password
   */
  async login(data: LoginRequest): Promise<TokenResponse> {
    const response = await fetch(`${this.apiUrl}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Login failed');
    }

    return response.json();
  }

  /**
   * Login with Google ID token
   */
  async googleLogin(data: GoogleLoginRequest): Promise<TokenResponse> {
    const response = await fetch(`${this.apiUrl}/auth/google/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        token: data.token,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Google login failed');
    }

    return response.json();
  }

  /**
   * Get current user info (requires auth token)
   */
  async getCurrentUser(token: string): Promise<UserResponse> {
    const response = await fetch(`${this.apiUrl}/auth/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch user');
    }

    return response.json();
  }
}

export const AuthService = new AuthServiceClass();
