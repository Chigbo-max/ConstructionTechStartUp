import { createSlice } from '@reduxjs/toolkit';

const token = localStorage.getItem('token');
const user = JSON.parse(localStorage.getItem('user')); 

const initialState = {
  user: user || null,
  token: token || null,
  isAuthenticated: !!token, 
  currentRole: user?.roles?.[0] || null,
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      const { user, token } = action.payload;
      state.user = user;
      state.token = token;
      state.isAuthenticated = true;
      state.currentRole = user?.roles?.[0] || null;
      state.error = null;

      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
    },
    setCurrentRole: (state, action) => {
      state.currentRole = action.payload;
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.currentRole = null;
      state.error = null;
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
    clearError: (state) => {
      state.error = null;
    },
    updateUser: (state, action) => {
      state.user = { ...state.user, ...action.payload };
      localStorage.setItem('user', JSON.stringify(state.user)); 
    },
  },
});

export const {
  setCredentials,
  setCurrentRole,
  logout,
  setLoading,
  setError,
  clearError,
  updateUser,
} = authSlice.actions;

export default authSlice.reducer;

export const selectCurrentUser = (state) => state.auth.user;
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;
export const selectCurrentRole = (state) => state.auth.currentRole;
export const selectAuthToken = (state) => state.auth.token;
export const selectAuthLoading = (state) => state.auth.loading;
export const selectAuthError = (state) => state.auth.error;
export const selectUserRoles = (state) => state.auth.user?.roles || [];
