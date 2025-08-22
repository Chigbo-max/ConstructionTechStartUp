import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

// Import slices
import authReducer from '../features/auth/authSlice';
import uiReducer from '../features/ui/uiSlice';

// Configure persist
const authPersistConfig = {
  key: 'auth',
  storage,
  whitelist: ['user', 'token', 'isAuthenticated', 'currentRole'],
  // Add blacklist for sensitive or frequently changing state that shouldn't be persisted
  blacklist: []
};

// Import APIs
import { authApi } from '../features/auth/authApi';
import { projectsApi } from '../features/projects/projectsApi';
import { jobsApi } from '../features/jobs/jobsApi';
import { notificationsApi } from '../features/notifications/notificationsApi';
import { milestonesApi } from '../features/milestones/milestonesApi';
import { contractorsApi } from '../features/contractors/contractorsApi';
import { bidsApi } from '../features/bids/bidsApi';

export const store = configureStore({
  reducer: {
    // Slices
    auth: persistReducer(authPersistConfig, authReducer),
    ui: uiReducer,
    
    // APIs
    [authApi.reducerPath]: authApi.reducer,
    [projectsApi.reducerPath]: projectsApi.reducer,
    [jobsApi.reducerPath]: jobsApi.reducer,
    [notificationsApi.reducerPath]: notificationsApi.reducer,
    [milestonesApi.reducerPath]: milestonesApi.reducer,
    [contractorsApi.reducerPath]: contractorsApi.reducer,
    [bidsApi.reducerPath]: bidsApi.reducer,
  },
  
  // Adding the api middleware enables caching, invalidation, polling,
  // and other useful features of `rtk-query`.
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types as they contain non-serializable values
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }).concat(
      authApi.middleware,
      projectsApi.middleware,
      jobsApi.middleware,
      notificationsApi.middleware,
      milestonesApi.middleware,
      contractorsApi.middleware,
      bidsApi.middleware
    ),
});

// Optional, but required for refetchOnFocus/refetchOnReconnect behaviors
// see `setupListeners` docs - takes an optional callback as the 2nd arg for customization
setupListeners(store.dispatch);

export const persistor = persistStore(store);

export default store;