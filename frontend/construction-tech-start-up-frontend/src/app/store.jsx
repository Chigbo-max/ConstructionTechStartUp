import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';

// Import slices
import authReducer from '../features/auth/authSlice';
import uiReducer from '../features/ui/uiSlice';

// Import APIs
import { authApi } from '../features/auth/authApi';
import { projectsApi } from '../features/projects/projectsApi';
import { jobsApi } from '../features/jobs/jobsApi';
import { notificationsApi } from '../features/notifications/notificationsApi';
import { milestonesApi } from '../features/milestones/milestonesApi';

export const store = configureStore({
  reducer: {
    // Slices
    auth: authReducer,
    ui: uiReducer,
    
    // APIs
    [authApi.reducerPath]: authApi.reducer,
    [projectsApi.reducerPath]: projectsApi.reducer,
    [jobsApi.reducerPath]: jobsApi.reducer,
    [notificationsApi.reducerPath]: notificationsApi.reducer,
    [milestonesApi.reducerPath]: milestonesApi.reducer,
  },
  
  // Adding the api middleware enables caching, invalidation, polling,
  // and other useful features of `rtk-query`.
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      authApi.middleware,
      projectsApi.middleware,
      jobsApi.middleware,
      notificationsApi.middleware,
      milestonesApi.middleware
    ),
});

// Optional, but required for refetchOnFocus/refetchOnReconnect behaviors
// see `setupListeners` docs - takes an optional callback as the 2nd arg for customization
setupListeners(store.dispatch);

export default store;