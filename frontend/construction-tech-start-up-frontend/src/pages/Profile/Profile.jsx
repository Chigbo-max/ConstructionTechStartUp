import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { selectCurrentUser, selectCurrentRole, selectUserRoles, updateUser, setCurrentRole } from '../../features/auth/authSlice';
import { useSwitchRoleMutation } from '../../features/auth/authApi';
import { showNotification } from '../../features/ui/uiSlice';

const Profile = () => {
  const dispatch = useDispatch();
  const currentUser = useSelector(selectCurrentUser);
  const currentRole = useSelector(selectCurrentRole);
  const userRoles = useSelector(selectUserRoles);
  
  const [switchRole, { isLoading: isSwitching }] = useSwitchRoleMutation();
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    name: currentUser?.name || '',
    email: currentUser?.email || '',
    professionDescription: currentUser?.professionDescription || ''
  });

  const handleRoleSwitch = async (newRole) => {
    try {
      await switchRole(newRole).unwrap();
      dispatch(setCurrentRole(newRole));
      dispatch(showNotification({ 
        message: `Role switched to ${newRole}`, 
        type: 'success' 
      }));
    } catch (error) {
      dispatch(showNotification({ 
        message: 'Failed to switch role', 
        type: 'error' 
      }));
    }
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    dispatch(updateUser(editForm));
    setIsEditing(false);
    dispatch(showNotification({ 
      message: 'Profile updated successfully', 
      type: 'success' 
    }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const getRoleDescription = (role) => {
    switch (role) {
      case 'HOMEOWNER':
        return 'Create and manage construction projects, hire contractors, and track progress';
      case 'CONTRACTOR':
        return 'Browse projects, submit bids, and manage construction work';
      case 'OTHER':
        return 'Specialized professional with custom role description';
      default:
        return 'General user with basic access';
    }
  };

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🔒</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h2>
          <p className="text-gray-600">Please log in to view your profile.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-3xl font-bold text-gray-900">Profile & Settings</h1>
          <p className="mt-2 text-gray-600">Manage your account information and preferences</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Card */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Personal Information</h2>
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className="bg-primary-500 hover:bg-primary-600 text-white px-4 py-2 rounded-lg font-medium transition-all duration-200 transform hover:scale-105 hover:shadow-lg cursor-pointer"
                >
                  {isEditing ? 'Cancel' : 'Edit Profile'}
                </button>
              </div>

              {isEditing ? (
                <form onSubmit={handleEditSubmit} className="space-y-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={editForm.name}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={editForm.email}
                      onChange={handleInputChange}
                      disabled
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-50 text-gray-500 cursor-not-allowed"
                    />
                    <p className="mt-1 text-xs text-gray-500">Email cannot be changed</p>
                  </div>
                  {userRoles.includes('OTHER') && (
                    <div>
                      <label htmlFor="professionDescription" className="block text-sm font-medium text-gray-700 mb-2">
                        Profession Description
                      </label>
                      <textarea
                        id="professionDescription"
                        name="professionDescription"
                        value={editForm.professionDescription}
                        onChange={handleInputChange}
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      />
                    </div>
                  )}
                  <div className="flex space-x-3 pt-4">
                    <button
                      type="submit"
                      className="bg-primary-500 hover:bg-primary-600 text-white px-6 py-2 rounded-lg font-medium transition-all duration-200 transform hover:scale-105 hover:shadow-lg cursor-pointer"
                    >
                      Save Changes
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsEditing(false)}
                      className="bg-gray-300 hover:bg-gray-400 text-gray-700 px-6 py-2 rounded-lg font-medium transition-all duration-200 transform hover:scale-105 hover:shadow-lg cursor-pointer"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center py-3 border-b border-gray-200">
                    <span className="text-sm font-medium text-gray-500 w-32">Full Name:</span>
                    <span className="text-gray-900">{currentUser.name}</span>
                  </div>
                  <div className="flex items-center py-3 border-b border-gray-200">
                    <span className="text-sm font-medium text-gray-500 w-32">Email:</span>
                    <span className="text-gray-900">{currentUser.email}</span>
                  </div>
                  {currentUser.professionDescription && (
                    <div className="flex items-start py-3 border-b border-gray-200">
                      <span className="text-sm font-medium text-gray-500 w-32">Profession:</span>
                      <span className="text-gray-900">{currentUser.professionDescription}</span>
                    </div>
                  )}
                  <div className="flex items-center py-3 border-b border-gray-200">
                    <span className="text-sm font-medium text-gray-500 w-32">Member Since:</span>
                    <span className="text-gray-900">
                      {new Date(currentUser.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Role Management */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Role Management</h3>
              
              <div className="space-y-4">
                {userRoles.map((role) => (
                  <div key={role} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-900">{role}</span>
                      {currentRole === role && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
                          Current
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-600 mb-3">
                      {getRoleDescription(role)}
                    </p>
                    {currentRole !== role && (
                      <button
                        onClick={() => handleRoleSwitch(role)}
                        disabled={isSwitching}
                        className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-2 rounded text-sm font-medium transition-colors duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isSwitching ? 'Switching...' : 'Switch to this role'}
                      </button>
                    )}
                  </div>
                ))}
              </div>

              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <h4 className="text-sm font-medium text-blue-900 mb-2">💡 Tip</h4>
                <p className="text-xs text-blue-700">
                  You can switch between roles to access different features. Each role provides specific functionality tailored to your needs.
                </p>
              </div>
            </div>

            {/* Account Actions */}
            <div className="bg-white rounded-lg shadow-sm p-6 mt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Account Actions</h3>
              
              <div className="space-y-3">
                <button className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors duration-200 cursor-pointer">
                  <div className="flex items-center">
                    <svg className="h-5 w-5 mr-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                    </svg>
                    Change Password
                  </div>
                </button>
                
                <button className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors duration-200 cursor-pointer">
                  <div className="flex items-center">
                    <svg className="h-5 w-5 mr-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    Account Settings
                  </div>
                </button>
                
                <button className="w-full text-left px-4 py-3 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200 cursor-pointer">
                  <div className="flex items-center">
                    <svg className="h-5 w-5 mr-3 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    Delete Account
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
