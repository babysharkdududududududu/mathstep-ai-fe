/**
 * Auth Service - Handles all authentication API calls
 * Supports: Register, Login, Google OAuth, Token Refresh, Forgot Password, Reset Password
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

export interface RefreshTokenRequest {
  refresh_token: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  token: string;
  new_password: string;
}

export interface TokenResponse {
  access_token: string;
  refresh_token?: string;
  token_type: string;
  user_id?: string;
  email?: string;
  role?: string;
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
   * Helper: Parse error response from server
   * Handles cases where response is not JSON or contains unexpected format
   */
  private async parseErrorResponse(response: Response): Promise<string> {
    try {
      const data = await response.json();
      console.log('[Auth] Error response:', { status: response.status, data });
      
      // Backend returns error in 'detail' field
      if (data.detail) {
        return data.detail;
      }
      if (data.message) {
        return data.message;
      }
      return JSON.stringify(data);
    } catch {
      // Response is not JSON (true CORS error or network error)
      console.error('[Auth] Failed to parse error response:', response.statusText);
      return `HTTP ${response.status}: ${response.statusText}`;
    }
  }

  /**
   * Register a new user
   * Backend expects either 'name' OR 'firstName'+'lastName' (now both merged in frontend)
   */
  async register(data: RegisterRequest): Promise<TokenResponse> {
    const payload = {
      email: data.email,
      password: data.password,
      role: data.role || 'STUDENT',
      // Backend now accepts firstName/lastName separately
      firstName: data.firstName,
      lastName: data.lastName,
    };

    console.log('[Auth] Register request:', { ...payload, password: '***' });

    const response = await fetch(`${this.apiUrl}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    console.log('[Auth] Register response status:', response.status);

    if (!response.ok) {
      const errorMessage = await this.parseErrorResponse(response);
      throw new Error(errorMessage);
    }

    const data_response = await response.json();
    console.log('[Auth] Register success:', { user_id: data_response.user_id, email: data_response.email });
    return data_response;
  }

  /**
   * Login with email and password
   */
  async login(data: LoginRequest): Promise<TokenResponse> {
    const payload = {
      email: data.email,
      password: data.password,
    };

    console.log('[Auth] Login request:', { email: payload.email });

    const response = await fetch(`${this.apiUrl}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    console.log('[Auth] Login response status:', response.status);

    if (!response.ok) {
      const errorMessage = await this.parseErrorResponse(response);
      throw new Error(errorMessage);
    }

    const data_response = await response.json();
    console.log('[Auth] Login success:', { user_id: data_response.user_id, email: data_response.email, has_refresh_token: !!data_response.refresh_token });
    return data_response;
  }

  /**
   * Login with Google ID token
   */
  async googleLogin(data: GoogleLoginRequest): Promise<TokenResponse> {
    console.log('[Auth] Google login request');

    const response = await fetch(`${this.apiUrl}/auth/google/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        token: data.token,
      }),
    });

    console.log('[Auth] Google login response status:', response.status);

    if (!response.ok) {
      const errorMessage = await this.parseErrorResponse(response);
      throw new Error(errorMessage);
    }

    const data_response = await response.json();
    console.log('[Auth] Google login success:', { user_id: data_response.user_id, email: data_response.email });
    return data_response;
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
      const errorMessage = await this.parseErrorResponse(response);
      throw new Error(errorMessage);
    }

    return response.json();
  }

  /**
   * Refresh access token using refresh token
   * Backend returns new access_token + same refresh_token
   */
  async refreshToken(refreshToken: string): Promise<TokenResponse> {
    console.log('[Auth] Refresh token request');

    const response = await fetch(`${this.apiUrl}/auth/refresh-token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        refresh_token: refreshToken,
      }),
    });

    console.log('[Auth] Refresh token response status:', response.status);

    if (!response.ok) {
      const errorMessage = await this.parseErrorResponse(response);
      throw new Error(errorMessage);
    }

    const data_response = await response.json();
    console.log('[Auth] Refresh token success: new access_token generated');
    return data_response;
  }

  /**
   * Request password reset email
   */
  async forgotPassword(data: ForgotPasswordRequest): Promise<{ message: string }> {
    console.log('[Auth] Forgot password request:', { email: data.email });

    const response = await fetch(`${this.apiUrl}/auth/forgot-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: data.email,
      }),
    });

    console.log('[Auth] Forgot password response status:', response.status);

    if (!response.ok) {
      const errorMessage = await this.parseErrorResponse(response);
      throw new Error(errorMessage);
    }

    const data_response = await response.json();
    return data_response;
  }

  /**
   * Reset password with reset token
   */
  async resetPassword(data: ResetPasswordRequest): Promise<{ message: string }> {
    console.log('[Auth] Reset password request');

    const response = await fetch(`${this.apiUrl}/auth/reset-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        token: data.token,
        new_password: data.new_password,
      }),
    });

    console.log('[Auth] Reset password response status:', response.status);

    if (!response.ok) {
      const errorMessage = await this.parseErrorResponse(response);
      throw new Error(errorMessage);
    }

    const data_response = await response.json();
    console.log('[Auth] Reset password success');
    return data_response;
  }
}

export const AuthService = new AuthServiceClass();
