import { fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { logout } from '../features/auth/authSlice';

// Create a custom base query with token validation error handling
export const baseQueryWithReauth = (baseUrl) => {
  const baseQuery = fetchBaseQuery({
    baseUrl: baseUrl || import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
    prepareHeaders: (headers, { getState }) => {
      const token = getState().auth.token;
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      return headers;
    },
  });

  return async (args, api, extraOptions) => {
    // Store the current auth state before making the request
    const state = api.getState();
    const wasAuthenticated = state.auth.isAuthenticated;
    
    const result = await baseQuery(args, api, extraOptions);
    
    // Only dispatch logout if we were authenticated before and received a 403 error
    // with "Invalid or expired token" message
    // Also check if we're still authenticated to prevent multiple logout dispatches
    if (wasAuthenticated && result.error && result.error.status === 403 && 
        result.error.data?.message === 'Invalid or expired token' &&
        api.getState().auth.isAuthenticated) {
      // Automatically log the user out
      api.dispatch(logout());
    }
    
    return result;
  };
};