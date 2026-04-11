/**
 * API Client with Automatic Token Refresh
 *
 * Features:
 * - Auto-refresh access_token when 401 received
 * - Retry original request after refresh
 * - Handle refresh token expiration (redirect to login)
 * - Transparent to components
 *
 * Usage:
 * ```ts
 * // In your main layout or _app
 * useEffect(() => {
 *   ApiClient.interceptResponse(getToken, getRefreshToken, setToken, logout, router);
 * }, []);
 *
 * // Then use normal fetch anywhere
 * // Api Client will auto-refresh on 401
 * ```
 */

import { AuthService } from "./service";

type TokenGetters = {
  getAccessToken: () => string | null;
  getRefreshToken: () => string | null;
};

type TokenSetters = {
  setAccessToken: (token: string) => void;
  clearTokens: () => void;
};

type Navigation = {
  push: (path: string) => void;
};

let isRefreshing = false;
let refreshSubscribers: ((token: string) => void)[] = [];

const onRefreshed = (token: string) => {
  refreshSubscribers.forEach((callback) => callback(token));
  refreshSubscribers = [];
};

/**
 * Setup automatic token refresh interceptor for all fetch calls
 * Call this once in your app root (e.g., in layout.tsx or _app.tsx)
 */
export function setupApiInterceptor(
  getters: TokenGetters,
  setters: TokenSetters,
  router: Navigation,
) {
  // Override global fetch to intercept 401 responses
  const originalFetch = window.fetch;

  window.fetch = async function (
    input: RequestInfo | URL,
    init?: RequestInit,
  ): Promise<Response> {
    const response = await originalFetch(input, init);

    // Check if we got a 401 Unauthorized
    if (response.status === 401) {
      console.log(
        "[API Interceptor] 401 Unauthorized - attempting token refresh",
      );

      const refreshToken = getters.getRefreshToken();

      if (!refreshToken) {
        // No refresh token available - redirect to login
        console.log(
          "[API Interceptor] No refresh token available - redirecting to login",
        );
        setters.clearTokens();
        router.push("/signin");
        return response;
      }

      // Prevent multiple simultaneous refresh attempts
      if (isRefreshing) {
        // Wait for refresh to complete, then retry request
        return new Promise((resolve) => {
          refreshSubscribers.push((newToken: string) => {
            // Clone the original request with new token
            const clonedInit = { ...init };
            if (!clonedInit.headers) {
              clonedInit.headers = {};
            }
            if (
              typeof clonedInit.headers === "object" &&
              clonedInit.headers !== null
            ) {
              const headers = new Headers(clonedInit.headers || {});
              headers.set("Authorization", `Bearer ${newToken}`);
              clonedInit.headers = headers;
            }
            resolve(originalFetch(input, clonedInit));
          });
        });
      }

      isRefreshing = true;

      try {
        // Attempt to refresh the token
        const refreshResponse = await AuthService.refreshToken(refreshToken);
        const newAccessToken = refreshResponse.access_token;

        console.log("[API Interceptor] Token refreshed successfully");

        // Update stored token
        setters.setAccessToken(newAccessToken);

        // Notify waiting requests
        onRefreshed(newAccessToken);
        isRefreshing = false;

        // Retry original request with new token
        const clonedInit = { ...init };
        if (!clonedInit.headers) {
          clonedInit.headers = {};
        }
        if (
          typeof clonedInit.headers === "object" &&
          clonedInit.headers !== null
        ) {
          const headers = new Headers(clonedInit.headers || {});
          headers.set("Authorization", `Bearer ${newAccessToken}`);
          clonedInit.headers = headers;
        }

        return originalFetch(input, clonedInit);
      } catch (error) {
        console.error("[API Interceptor] Token refresh failed:", error);

        isRefreshing = false;
        refreshSubscribers = [];

        // Refresh failed - clear tokens and redirect to login
        setters.clearTokens();
        router.push("/signin");

        return response;
      }
    }

    return response;
  };

  console.log("[API Interceptor] Configured");
}

/**
 * Add Authorization header to fetch request
 *
 * Usage:
 * ```ts
 * const response = await fetch(url, {
 *   ...init,
 *   ...getAuthHeader(token)
 * });
 * ```
 */
export function getAuthHeader(token: string | null) {
  if (!token) return {};

  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
}
