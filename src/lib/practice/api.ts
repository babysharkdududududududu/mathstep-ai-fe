import type { UserProfileData } from './types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

function getAuthHeaders(): HeadersInit {
  const token = typeof window !== 'undefined' ? localStorage.getItem('authToken') : null;
  const headers: HeadersInit = { 'Content-Type': 'application/json' };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
}

export async function fetchUserProfile(): Promise<UserProfileData> {
  const res = await fetch(`${API_URL}/profile/me/dashboard-profile`, {
    headers: getAuthHeaders(),
  });
  console.log('fetchUserProfile response:', res);
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({ detail: res.statusText }));
    throw new Error(errorData.detail || `HTTP ${res.status}`);
  }
  return res.json();
}
