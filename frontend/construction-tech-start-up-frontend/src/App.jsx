import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Layout/Header';
import Sidebar from './components/Layout/Sidebar';
import LoginModal from './components/Auth/LoginModal';
import RegisterModal from './components/Auth/RegisterModal';
import ForgotPasswordModal from './components/Auth/ForgotPasswordModal';
import ResetPasswordModal from './components/Auth/ResetPasswordModal';
import Notification from './components/UI/Notification';
import Dashboard from './pages/Dashboard/Dashboard';
import Projects from './pages/Projects/Projects';
import Jobs from './pages/Jobs/Jobs';
import Profile from './pages/Profile/Profile';
import About from './pages/About/About';
import Landing from './components/Landing/Landing';
import { selectIsAuthenticated } from './features/auth/authSlice';

function App() {
  const dispatch = useDispatch();
  const isAuthenticated = useSelector(selectIsAuthenticated);

  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Header />
        
        <div className="flex">
          {/* Sidebar for authenticated users */}
          {isAuthenticated && <Sidebar />}
          
          {/* Main content */}
          <main className={`flex-1 ${isAuthenticated ? 'lg:ml-64' : ''}`}>
            {!isAuthenticated ? (
              <Routes>
                <Route path="/about" element={<About />} />
                <Route path="*" element={<Landing />} />
              </Routes>
            ) : (
              <Routes>
                <Route path="/" element={<Navigate to="/dashboard" replace />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/projects" element={<Projects />} />
                <Route path="/jobs" element={<Jobs />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/about" element={<About />} />
                <Route path="*" element={<Navigate to="/dashboard" replace />} />
              </Routes>
            )}
          </main>
        </div>

        {/* Modals */}
        <LoginModal />
        <RegisterModal />
        <ForgotPasswordModal />
        <ResetPasswordModal />
        
        {/* Notifications */}
        <Notification />
      </div>
    </Router>
  );
}

export default App;
