import React from 'react';
import { useSelector } from 'react-redux';
import { selectCurrentUser, selectCurrentRole } from '../../features/auth/authSlice';
import { useGetProjectsQuery } from '../../features/projects/projectsApi';
import { useGetJobsQuery } from '../../features/jobs/jobsApi';
import { useGetNotificationsQuery } from '../../features/notifications/notificationsApi';

const Dashboard = () => {
  const currentUser = useSelector(selectCurrentUser);
  const currentRole = useSelector(selectCurrentRole);
  
  const { data: projectsData, isLoading: projectsLoading } = useGetProjectsQuery();
  const { data: jobs = [], isLoading: jobsLoading } = useGetJobsQuery();
  const { data: notifications = [], isLoading: notificationsLoading } = useGetNotificationsQuery();


  const projects = Array.isArray(projectsData)
  ? projectsData
  : Array.isArray(projectsData?.projects)
  ? projectsData.projects
  : [];

  const activeProjects = projects.filter(p => p.status === 'IN_PROGRESS');
  console.log("Active projects", activeProjects)
  const completedProjects = projects.filter(p => p.status === 'COMPLETED');
  const pendingBids = projects.filter(p => p.status === 'PENDING_BIDS');

  const getRoleSpecificStats = () => {
    switch (currentRole) {
      case 'HOMEOWNER':
        return [
          { title: 'Active Projects', value: activeProjects.length, color: 'bg-primary-500', icon: '🏗️' },
          { title: 'Completed Projects', value: completedProjects.length, color: 'bg-green-500', icon: '✅' },
          { title: 'Pending Bids', value: pendingBids.length, color: 'bg-yellow-500', icon: '⏳' },
          { title: 'Total Spent', value: '$0', color: 'bg-blue-500', icon: '💰' }
        ];
      case 'CONTRACTOR':
        return [
          { title: 'Active Jobs', value: activeProjects.length, color: 'bg-primary-500', icon: '🔨' },
          { title: 'Completed Jobs', value: completedProjects.length, color: 'bg-green-500', icon: '🎯' },
          { title: 'Pending Applications', value: pendingBids.length, color: 'bg-yellow-500', icon: '📝' },
          { title: 'Total Earnings', value: '$0', color: 'bg-blue-500', icon: '💵' }
        ];
      default:
        return [
          { title: 'Active Projects', value: activeProjects.length, color: 'bg-primary-500', icon: '🏗️' },
          { title: 'Completed Projects', value: completedProjects.length, color: 'bg-green-500', icon: '✅' },
          { title: 'Total Projects', value: projects.length, color: 'bg-yellow-500', icon: '📊' },
          { title: 'Notifications', value: notifications.length, color: 'bg-blue-500', icon: '🔔' }
        ];
    }
  };

  const getQuickActions = () => {
    switch (currentRole) {
      case 'HOMEOWNER':
        return [
          { title: 'Create New Project', action: 'createProject', icon: '➕', color: 'bg-primary-500 hover:bg-primary-600' },
          { title: 'Find Contractors', action: 'findContractors', icon: '👷', color: 'bg-green-500 hover:bg-green-600' },
          { title: 'View Bids', action: 'viewBids', icon: '📋', color: 'bg-yellow-500 hover:bg-yellow-600' },
          { title: 'Track Progress', action: 'trackProgress', icon: '📈', color: 'bg-blue-500 hover:bg-blue-600' }
        ];
      case 'CONTRACTOR':
        return [
          { title: 'Browse Projects', action: 'browseProjects', icon: '🔍', color: 'bg-primary-500 hover:bg-primary-600' },
          { title: 'Submit Bids', action: 'submitBids', icon: '📝', color: 'bg-green-500 hover:bg-green-600' },
          { title: 'Manage Jobs', action: 'manageJobs', icon: '⚙️', color: 'bg-yellow-500 hover:bg-yellow-600' },
          { title: 'Update Profile', action: 'updateProfile', icon: '👤', color: 'bg-blue-500 hover:bg-blue-600' }
        ];
      default:
        return [
          { title: 'View Projects', action: 'viewProjects', icon: '👀', color: 'bg-primary-500 hover:bg-primary-600' },
          { title: 'Browse Jobs', action: 'browseJobs', icon: '💼', color: 'bg-green-500 hover:bg-green-600' },
          { title: 'Contact Support', action: 'contactSupport', icon: '📞', color: 'bg-yellow-500 hover:bg-yellow-600' },
          { title: 'Learn More', action: 'learnMore', icon: '📚', color: 'bg-blue-500 hover:bg-blue-600' }
        ];
    }
  };

  if (projectsLoading || jobsLoading || notificationsLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">
              Welcome back, {currentUser?.name || 'User'}! 👋
            </h1>
            <p className="text-xl text-primary-100">
              Here's what's happening with your {currentRole?.toLowerCase()} activities today
            </p>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {getRoleSpecificStats().map((stat, index) => (
            <div key={index} className="bg-white rounded-lg shadow-lg p-6 transform hover:scale-105 transition-transform duration-200 cursor-pointer">
              <div className="flex items-center">
                <div className={`${stat.color} rounded-lg p-3 text-white text-2xl`}>
                  {stat.icon}
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {getQuickActions().map((action, index) => (
              <button
                key={index}
                className={`${action.color} text-white p-4 rounded-lg font-medium transition-all duration-200 transform hover:scale-105 hover:shadow-lg cursor-pointer`}
                onClick={() => console.log(`Action: ${action.action}`)}
              >
                <div className="text-center">
                  <div className="text-3xl mb-2">{action.icon}</div>
                  <div className="text-sm">{action.title}</div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Projects */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Recent Projects</h2>
            {projects.length > 0 ? (
              <div className="space-y-4">
                {projects.slice(0, 5).map((project) => (
                  <div key={project.id} className="border-l-4 border-primary-500 pl-4 py-2 hover:bg-gray-50 transition-colors duration-200 cursor-pointer">
                    <h3 className="font-medium text-gray-900">{project.title}</h3>
                    <p className="text-sm text-gray-600">{project.status}</p>
                    <p className="text-xs text-gray-500">{new Date(project.createdAt).toLocaleDateString()}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-8">No projects yet. Start by creating your first project!</p>
            )}
          </div>

          {/* Recent Notifications */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Recent Notifications</h2>
            {notifications.length > 0 ? (
              <div className="space-y-4">
                {notifications.slice(0, 5).map((notification) => (
                  <div key={notification.id} className="border-l-4 border-yellow-500 pl-4 py-2 hover:bg-gray-50 transition-colors duration-200 cursor-pointer">
                    <h3 className="font-medium text-gray-900">{notification.title}</h3>
                    <p className="text-sm text-gray-600">{notification.message}</p>
                    <p className="text-xs text-gray-500">{new Date(notification.createdAt).toLocaleDateString()}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-8">No notifications yet. You're all caught up!</p>
            )}
          </div>
        </div>

        {/* Call to Action */}
        <div className="bg-gradient-to-r from-primary-500 to-primary-600 rounded-lg shadow-lg p-8 mt-8 text-center text-white">
          <h2 className="text-3xl font-bold mb-4">Ready to get started?</h2>
          <p className="text-xl text-primary-100 mb-6">
            {currentRole === 'HOMEOWNER' 
              ? 'Create your first project and connect with qualified contractors'
              : currentRole === 'CONTRACTOR'
              ? 'Browse available projects and submit your bids'
              : 'Explore our platform and discover construction opportunities'
            }
          </p>
          <button className="bg-white text-primary-600 px-8 py-3 rounded-lg font-medium text-lg hover:bg-gray-100 transition-colors duration-200 cursor-pointer transform hover:scale-105">
            {currentRole === 'HOMEOWNER' ? 'Create Project' : 'Browse Projects'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
