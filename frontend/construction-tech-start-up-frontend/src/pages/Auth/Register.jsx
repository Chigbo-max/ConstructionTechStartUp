import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { useRegisterMutation } from '../../features/auth/authApi';
import { showNotification } from '../../features/ui/uiSlice';
import { setCredentials } from '../../features/auth/authSlice';

const Register = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [register, { isLoading }] = useRegisterMutation();
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    primaryRole: '',
    professionDescription: '',
  });

  const [errors, setErrors] = useState({});

  const roleDescriptions = {
    HOMEOWNER: {
      title: 'Homeowner',
      description: 'Perfect for property owners looking to manage construction projects, find contractors, and track progress.',
      permissions: ['Post project requirements', 'Browse and hire contractors', 'Track project milestones', 'Manage payments']
    },
    CONTRACTOR: {
      title: 'Contractor',
      description: 'Ideal for construction professionals providing services to clients and managing multiple projects.',
      permissions: ['Browse available projects', 'Submit proposals', 'Manage project timelines', 'Communicate with clients']
    },
    OTHER: {
      title: 'Other Professional',
      description: 'For architects, engineers, consultants, and other construction industry professionals.',
      permissions: ['Offer specialized services', 'Collaborate on projects', 'Provide expert consultation', 'Network with industry professionals']
    }
  };

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

  const handleRoleChange = (role) => {
    setFormData(prev => ({
      ...prev,
      primaryRole: role,
      professionDescription: role !== 'OTHER' ? '' : prev.professionDescription
    }));
    
    if (errors.primaryRole) {
      setErrors(prev => ({
        ...prev,
        primaryRole: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.email) newErrors.email = 'Email is required';
    if (!formData.password) newErrors.password = 'Password is required';
    if (!formData.firstName) newErrors.firstName = 'First name is required';
    if (!formData.lastName) newErrors.lastName = 'Last name is required';
    if (!formData.primaryRole) newErrors.primaryRole = 'Please select your primary role';
    
    if (formData.primaryRole === 'OTHER' && !formData.professionDescription) {
      newErrors.professionDescription = 'Please describe your profession';
    }
    
    if (formData.password && formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters long';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    try {
      const userData = {
        ...formData,
        roles: [formData.primaryRole]
      };
      
      delete userData.primaryRole;
      
      const result = await register(userData).unwrap();
      dispatch(setCredentials(result));
      
      dispatch(showNotification({ 
        message: 'Registration successful! Welcome aboard!', 
        type: 'success' 
      }));
      
      // Navigate to role-specific onboarding
      navigate(`/onboarding/${formData.primaryRole.toLowerCase()}`);
    } catch (error) {
      dispatch(showNotification({ 
        message: error.data?.message || 'Registration failed', 
        type: 'error' 
      }));
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <img
            className="h-12 w-auto"
            src="/src/assets/logo.png"
            alt="Construction Tech"
          />
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Create your account
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Already have an account?{' '}
          <Link
            to="/login"
            className="font-medium text-primary-600 hover:text-primary-500"
          >
            Sign in
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-2xl">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* Personal Information */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
                  First name
                </label>
                <div className="mt-1">
                  <input
                    id="firstName"
                    name="firstName"
                    type="text"
                    required
                    value={formData.firstName}
                    onChange={handleInputChange}
                    className={`appearance-none block w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm ${
                      errors.firstName ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Enter your first name"
                  />
                  {errors.firstName && (
                    <p className="mt-1 text-sm text-red-600">{errors.firstName}</p>
                  )}
                </div>
              </div>

              <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
                  Last name
                </label>
                <div className="mt-1">
                  <input
                    id="lastName"
                    name="lastName"
                    type="text"
                    required
                    value={formData.lastName}
                    onChange={handleInputChange}
                    className={`appearance-none block w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm ${
                      errors.lastName ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Enter your last name"
                  />
                  {errors.lastName && (
                    <p className="mt-1 text-sm text-red-600">{errors.lastName}</p>
                  )}
                </div>
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email address
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`appearance-none block w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm ${
                    errors.email ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter your email"
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                )}
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="mt-1">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  required
                  value={formData.password}
                  onChange={handleInputChange}
                  className={`appearance-none block w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm ${
                    errors.password ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Create a password"
                />
                {errors.password && (
                  <p className="mt-1 text-sm text-red-600">{errors.password}</p>
                )}
                <p className="mt-1 text-xs text-gray-500">Must be at least 8 characters long</p>
              </div>
            </div>

            {/* Role Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-4">
                Choose your primary role
              </label>
              <div className="space-y-4">
                {Object.entries(roleDescriptions).map(([role, info]) => (
                  <div key={role} className="relative">
                    <label className={`flex items-start p-4 border-2 rounded-lg cursor-pointer transition-all duration-200 ${
                      formData.primaryRole === role 
                        ? 'border-primary-500 bg-primary-50' 
                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                    }`}>
                      <input
                        type="radio"
                        name="primaryRole"
                        value={role}
                        checked={formData.primaryRole === role}
                        onChange={() => handleRoleChange(role)}
                        className="h-5 w-5 text-primary-600 focus:ring-primary-500 border-gray-300 mt-0.5"
                      />
                      <div className="ml-4 flex-1">
                        <div className="flex items-center justify-between">
                          <h3 className="text-lg font-medium text-gray-900">{info.title}</h3>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">{info.description}</p>
                        <div className="mt-2">
                          <p className="text-xs font-medium text-gray-700 mb-1">What you can do:</p>
                          <ul className="text-xs text-gray-600 space-y-0.5">
                            {info.permissions.map((permission, index) => (
                              <li key={index} className="flex items-center">
                                <span className="w-1 h-1 bg-primary-500 rounded-full mr-2"></span>
                                {permission}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </label>
                  </div>
                ))}
              </div>
              {errors.primaryRole && (
                <p className="mt-2 text-sm text-red-600">{errors.primaryRole}</p>
              )}
            </div>

            {/* Profession Description for OTHER role */}
            {formData.primaryRole === 'OTHER' && (
              <div>
                <label htmlFor="professionDescription" className="block text-sm font-medium text-gray-700">
                  Describe your profession
                </label>
                <div className="mt-1">
                  <textarea
                    id="professionDescription"
                    name="professionDescription"
                    rows={3}
                    value={formData.professionDescription}
                    onChange={handleInputChange}
                    className={`appearance-none block w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm ${
                      errors.professionDescription ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="e.g., Architect, Structural Engineer, Project Manager..."
                  />
                  {errors.professionDescription && (
                    <p className="mt-1 text-sm text-red-600">{errors.professionDescription}</p>
                  )}
                </div>
              </div>
            )}

            {/* Additional Roles Info */}
            <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-blue-800">
                    Need multiple roles?
                  </h3>
                  <div className="mt-2 text-sm text-blue-700">
                    <p>You can add additional roles later in your profile settings. Start with your primary role to get the most relevant experience.</p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Creating account...' : 'Create account'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;