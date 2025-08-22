import React from 'react';
import { Toaster } from 'react-hot-toast';
import ErrorBoundary from './pages/ErrorPages/ErrorBoundary';
import ForgotPasswordModal from './components/Auth/ForgotPasswordModal';
import ResetPasswordModal from './components/Auth/ResetPasswordModal';
import Notification from './components/UI/Notification';
import router from './routes/Routes';
import { RouterProvider } from 'react-router-dom';
import ServerDown from './pages/ErrorPages/ServerDown';
import NoInternet from './pages/ErrorPages/NoInternet';

function App() {
  const [hasServerError, setHasServerError] = React.useState(false);
  const [isOnline, setIsOnline] = React.useState(navigator.onLine);

  React.useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Global fetch error handler
  React.useEffect(() => {
    const origFetch = window.fetch;
    window.fetch = async (...args) => {
      try {
        const response = await origFetch(...args);
        if (!response.ok && response.status >= 500) {
          setHasServerError(true);
        }
        return response;
      } catch (err) {
        if (!navigator.onLine) {
          setIsOnline(false);
        } else {
          setHasServerError(true);
        }
        throw err;
      }
    };
    return () => {
      window.fetch = origFetch;
    };
  }, []); // This effect should only run once

  if (!isOnline) return <NoInternet />;
  if (hasServerError) return <ServerDown />;

  return (
    <ErrorBoundary>
          <Toaster position="top-center" richColors />
          <RouterProvider router={router} />
        
        <ForgotPasswordModal />
        <ResetPasswordModal />
        
        <Notification />
    </ErrorBoundary>


  );
}

export default App;

