import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useResetPasswordMutation } from '../../features/auth/authApi';
import { closeModal, openModal, showNotification } from '../../features/ui/uiSlice';

const ResetPasswordModal = () => {
  const dispatch = useDispatch();
  const isOpen = useSelector(state => state.ui.modals.resetPassword);
  const [resetPassword, { isLoading }] = useResetPasswordMutation();
  
  const [formData, setFormData] = useState({
    token: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Get token from URL if available
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');
    if (token) {
      setFormData(prev => ({ ...prev, token }));
    }
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.token) newErrors.token = 'Reset token is required';
    if (!formData.newPassword) newErrors.newPassword = 'New password is required';
    if (!formData.confirmPassword) newErrors.confirmPassword = 'Please confirm your password';
    
    if (formData.newPassword && formData.newPassword.length < 8) {
      newErrors.newPassword = 'Password must be at least 8 characters long';
    }
    
    if (formData.newPassword && formData.confirmPassword && formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    try {
      await resetPassword({
        token: formData.token,
        newPassword: formData.newPassword
      }).unwrap();
      
      setIsSubmitted(true);
      dispatch(showNotification({ 
        message: 'Password reset successfully! You can now log in with your new password.', 
        type: 'success' 
      }));
    } catch (error) {
      dispatch(showNotification({ 
        message: error.data?.message || 'Failed to reset password. Please try again.', 
        type: 'error' 
      }));
    }
  };

  const handleClose = () => {
    dispatch(closeModal('resetPassword'));
    setFormData({ token: '', newPassword: '', confirmPassword: '' });
    setErrors({});
    setIsSubmitted(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 animate-fade-in">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Set New Password</h2>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {!isSubmitted ? (
          <>
            {/* Instructions */}
            <div className="p-6">
              <div className="text-center mb-6">
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-primary-100 mb-4">
                  <svg className="h-6 w-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Create New Password</h3>
                <p className="text-sm text-gray-600">
                  Enter your new password below. Make sure it's secure and easy to remember.
                </p>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="token" className="block text-sm font-medium text-gray-700 mb-2">
                    Reset Token
                  </label>
                  <input
                    type="text"
                    id="token"
                    name="token"
                    value={formData.token}
                    onChange={handleInputChange}
                    required
                    className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
                      errors.token ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Enter reset token"
                  />
                  {errors.token && (
                    <p className="mt-1 text-sm text-red-600">{errors.token}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-2">
                    New Password
                  </label>
                  <input
                    type="password"
                    id="newPassword"
                    name="newPassword"
                    value={formData.newPassword}
                    onChange={handleInputChange}
                    required
                    className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
                      errors.newPassword ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Enter new password"
                  />
                  {errors.newPassword && (
                    <p className="mt-1 text-sm text-red-600">{errors.newPassword}</p>
                  )}
                  <p className="mt-1 text-xs text-gray-500">Must be at least 8 characters long</p>
                </div>

                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    required
                    className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
                      errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Confirm new password"
                  />
                  {errors.confirmPassword && (
                    <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-primary-500 hover:bg-primary-600 disabled:bg-primary-300 text-white font-medium py-2 px-4 rounded-md transition-colors duration-200 cursor-pointer disabled:cursor-not-allowed"
                >
                  {isLoading ? 'Resetting...' : 'Reset Password'}
                </button>
              </form>

              {/* Back to Login */}
              <div className="text-center mt-4">
                <button
                  type="button"
                  onClick={() => {
                    dispatch(closeModal('resetPassword'));
                    dispatch(openModal('login'));
                  }}
                  className="text-primary-600 hover:text-primary-700 text-sm font-medium transition-colors duration-200 cursor-pointer"
                >
                  ← Back to Login
                </button>
              </div>
            </div>
          </>
        ) : (
          /* Success Message */
          <div className="p-6 text-center">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
              <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Password Reset Successfully!</h3>
            <p className="text-sm text-gray-600 mb-6">
              Your password has been updated. You can now log in to your account using your new password.
            </p>
            
            <button
              onClick={() => {
                dispatch(closeModal('resetPassword'));
                dispatch(openModal('login'));
              }}
              className="bg-primary-500 hover:bg-primary-600 text-white px-6 py-2 rounded-lg font-medium transition-all duration-200 transform hover:scale-105 hover:shadow-lg cursor-pointer"
            >
              Continue to Login
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResetPasswordModal;
