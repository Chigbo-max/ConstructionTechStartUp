import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { selectIsAuthenticated, selectCurrentUser, selectCurrentRole, logout } from '../../features/auth/authSlice';
import { openModal, toggleSidebar } from '../../features/ui/uiSlice';

const Header = () => {
  const dispatch = useDispatch();
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const currentUser = useSelector(selectCurrentUser);
  const currentRole = useSelector(selectCurrentRole);

  const handleLogout = () => {
    dispatch(logout());
  };

  const handleSidebarToggle = () => {
    dispatch(toggleSidebar());
  };

  const handleLogin = () => {
    dispatch(openModal('login'));
  };

  const handleRegister = () => {
    dispatch(openModal('register'));
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Sidebar Toggle */}
          <div className="flex items-center">
            {isAuthenticated && (
              <button
                onClick={handleSidebarToggle}
                className="mr-4 p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 transition-colors duration-200 cursor-pointer lg:hidden"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            )}
            <div className="flex-shrink-0">
              <h1 className="text-2xl font-bold text-primary-500">
                Construction Tech
              </h1>
            </div>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex space-x-8">
            <Link to="/projects" className="text-gray-700 hover:text-primary-500 px-3 py-2 rounded-md text-sm font-medium transition-colors cursor-pointer">
              Projects
            </Link>
            <Link to="/jobs" className="text-gray-700 hover:text-primary-500 px-3 py-2 rounded-md text-sm font-medium transition-colors cursor-pointer">
              Jobs
            </Link>
            <Link to="/contractors" className="text-gray-700 hover:text-primary-500 px-3 py-2 rounded-md text-sm font-medium transition-colors cursor-pointer">
              Contractors
            </Link>
            <Link to="/about" className="text-gray-700 hover:text-primary-500 px-3 py-2 rounded-md text-sm font-medium transition-colors cursor-pointer">
              About
            </Link>
          </nav>

          {/* User Actions */}
          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                <div className="text-sm text-gray-700">
                  <span className="font-medium">{currentUser?.name}</span>
                  <span className="ml-2 px-2 py-1 bg-primary-100 text-primary-700 rounded-full text-xs">
                    {currentRole}
                  </span>
                </div>
                <button
                  onClick={handleLogout}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <button
                  onClick={handleLogin}
                  className="text-primary-600 hover:text-primary-700 px-4 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Login
                </button>
                <button
                  onClick={handleRegister}
                  className="bg-primary-500 hover:bg-primary-600 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Get Started
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
