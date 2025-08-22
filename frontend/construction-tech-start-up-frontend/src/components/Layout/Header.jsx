import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { selectIsAuthenticated, selectCurrentRole, logout } from "../../features/auth/authSlice";
import {toggleSidebar } from "../../features/ui/uiSlice";
import { useState } from "react";
import Logo from "../../assets/logo.png";
import {useNavigate} from 'react-router-dom';

const Header = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const currentRole = useSelector(selectCurrentRole);

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    dispatch(logout());
  };

  const handleSidebarToggle = () => {
    dispatch(toggleSidebar());
  };

  const handleLogin = () => {
    navigate('/login');
  };

  const handleRegister = () => {
navigate('/register')
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Left: Sidebar toggle (auth) + Logo */}
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
              <Link to="/" className="block">
                <img
                  src={Logo}
                  alt="Houzzify Logo"
                  className="w-32 sm:w-40 md:w-35 lg:w-44 p-2 h-auto mt-6"
                />
              </Link>
            </div>
          </div>

          {/* Desktop Nav (md and up) */}
          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                <div className="text-sm text-gray-700 flex items-center space-x-3">
                  <Link to="/dashboard" className="font-bold hover:text-primary-500 hover:underline">Dashboard</Link>
                  <Link to="/projects" className="font-bold hover:text-primary-500 hover:underline">Projects</Link>
                  <Link to="/jobs" className="font-bold hover:text-primary-500 hover:underline">Jobs</Link>
                  <Link to="/contractors" className="font-bold  hover:text-primary-500 hover:underline">Contractors</Link>
                  <Link to="/about" className="font-bold hover:text-primary-500 hover:underline">About</Link>
                  <span className="font-bold ml-2 px-2 py-1 bg-primary-100 text-primary-700 rounded-full text-xs">
                    {currentRole}
                  </span>
                </div>
                <button
                  onClick={handleLogout}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-bold transition-colors"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/about" className="hover:text-primary-500">About</Link>
                <Link to="/contactUs" className="hover:text-primary-500">Contact Us</Link>
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
              </>
            )}
          </div>

          {/* Mobile Toggle (ONLY if not authenticated) */}
          {!isAuthenticated && (
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 transition-colors duration-200"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* Mobile Dropdown (Not Authenticated) */}
      {!isAuthenticated && mobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200 shadow-lg absolute w-full z-50">
          <div className="px-4 py-3 space-y-2">
            <Link to="/about" className="block hover:text-primary-500">About</Link>
            <Link to="/contactUs" className="block hover:text-primary-500">Contact Us</Link>
            <button
              onClick={handleLogin}
              className="w-full text-left text-primary-600 hover:text-primary-700 px-4 py-2 rounded-md text-sm font-medium transition-colors"
            >
              Login
            </button>
            <button
              onClick={handleRegister}
              className="w-full text-left bg-primary-500 hover:bg-primary-600 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
            >
              Get Started
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
