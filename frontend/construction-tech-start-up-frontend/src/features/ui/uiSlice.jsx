import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  sidebarOpen: false,
  modals: {
    login: false,
    register: false,
    forgotPassword: false,
    resetPassword: false,
    createProject: false,
    createJob: false,
    createMilestone: false,
  },
  notifications: {
    show: false,
    message: '',
    type: 'info', // 'success', 'error', 'warning', 'info'
  },
  loading: {
    global: false,
    auth: false,
    projects: false,
    jobs: false,
  },
  theme: 'light',
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen;
    },
    setSidebarOpen: (state, action) => {
      state.sidebarOpen = action.payload;
    },
    openModal: (state, action) => {
      const modalName = action.payload;
      if (state.modals.hasOwnProperty(modalName)) {
        state.modals[modalName] = true;
      }
    },
    closeModal: (state, action) => {
      const modalName = action.payload;
      if (state.modals.hasOwnProperty(modalName)) {
        state.modals[modalName] = false;
      }
    },
    closeAllModals: (state) => {
      Object.keys(state.modals).forEach(key => {
        state.modals[key] = false;
      });
    },
    showNotification: (state, action) => {
      const { message, type = 'info' } = action.payload;
      state.notifications = {
        show: true,
        message,
        type,
      };
    },
    hideNotification: (state) => {
      state.notifications.show = false;
    },
    setLoading: (state, action) => {
      const { key, value } = action.payload;
      if (state.loading.hasOwnProperty(key)) {
        state.loading[key] = value;
      }
    },
    setGlobalLoading: (state, action) => {
      state.loading.global = action.payload;
    },
    toggleTheme: (state) => {
      state.theme = state.theme === 'light' ? 'dark' : 'light';
    },
    setTheme: (state, action) => {
      state.theme = action.payload;
    },
  },
});

export const {
  toggleSidebar,
  setSidebarOpen,
  openModal,
  closeModal,
  closeAllModals,
  showNotification,
  hideNotification,
  setLoading,
  setGlobalLoading,
  toggleTheme,
  setTheme,
} = uiSlice.actions;

export default uiSlice.reducer;

// Selectors
export const selectSidebarOpen = (state) => state.ui.sidebarOpen;
export const selectModals = (state) => state.ui.modals;
export const selectModalOpen = (state, modalName) => state.ui.modals[modalName];
export const selectNotifications = (state) => state.ui.notifications;
export const selectLoading = (state) => state.ui.loading;
export const selectGlobalLoading = (state) => state.ui.loading.global;
export const selectTheme = (state) => state.ui.theme;
