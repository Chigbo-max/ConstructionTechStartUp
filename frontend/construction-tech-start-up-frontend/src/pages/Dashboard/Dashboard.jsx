import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { selectCurrentUser, selectCurrentRole } from '../../features/auth/authSlice';
import { useGetProjectsQuery, useCreateProjectMutation } from '../../features/projects/projectsApi';
import { useGetJobsQuery } from '../../features/jobs/jobsApi';
import { useGetNotificationsQuery } from '../../features/notifications/notificationsApi';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { FiHome, FiTool, FiClipboard, FiCheckCircle, FiClock, FiBell, FiPlus, FiSearch, FiEdit, FiTrendingUp, FiEye, FiBriefcase, FiPhoneCall, FiBook } from 'react-icons/fi';
import { faNairaSign } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const Dashboard = () => {
  const currentUser = useSelector(selectCurrentUser);
  const currentRole = useSelector(selectCurrentRole);
  const navigate = useNavigate();
  
  const { data: projectsData, isLoading: projectsLoading } = useGetProjectsQuery();
  const { data: jobs = [], isLoading: jobsLoading } = useGetJobsQuery();
  const { data: notifications = [], isLoading: notificationsLoading } = useGetNotificationsQuery();
  const [createProject] = useCreateProjectMutation();


  const projects = Array.isArray(projectsData)
  ? projectsData
  : Array.isArray(projectsData?.projects)
  ? projectsData.projects
  : [];

  const activeProjects = projects.filter(p => p.status === 'IN_PROGRESS');
  const completedProjects = projects.filter(p => p.status === 'COMPLETED');
  const pendingBids = projects.filter(p => p.status === 'PENDING_BIDS');

  const getRoleSpecificStats = () => {
    switch (currentRole) {
      case 'HOMEOWNER':
        return [
          { title: 'Active Projects', value: activeProjects.length, color: 'bg-primary-500', icon: <FiHome className="w-6 h-6" /> },
          { title: 'Completed Projects', value: completedProjects.length, color: 'bg-green-500', icon: <FiCheckCircle className="w-6 h-6" /> },
          { title: 'Pending Bids', value: pendingBids.length, color: 'bg-yellow-500', icon: <FiClock className="w-6 h-6" /> },
          { title: 'Total Spent', value: '₦0', color: 'bg-blue-500', icon:<FontAwesomeIcon icon={faNairaSign} className="w-6 h-6" /> }

        ];
      case 'CONTRACTOR':
        return [
          { title: 'Active Jobs', value: activeProjects.length, color: 'bg-primary-500', icon: <FiTool className="w-6 h-6" /> },
          { title: 'Completed Jobs', value: completedProjects.length, color: 'bg-green-500', icon: <FiCheckCircle className="w-6 h-6" /> },
          { title: 'Pending Applications', value: pendingBids.length, color: 'bg-yellow-500', icon: <FiClipboard className="w-6 h-6" /> },
          { title: 'Total Earnings', value: '₦0', color: 'bg-blue-500', icon: <FontAwesomeIcon icon={faNairaSign} className="w-6 h-6" /> }

        ];
      default:
        return [
          { title: 'Active Projects', value: activeProjects.length, color: 'bg-primary-500', icon: <FiHome className="w-6 h-6" /> },
          { title: 'Completed Projects', value: completedProjects.length, color: 'bg-green-500', icon: <FiCheckCircle className="w-6 h-6" /> },
          { title: 'Total Projects', value: projects.length, color: 'bg-yellow-500', icon: <FiClipboard className="w-6 h-6" /> },
          { title: 'Notifications', value: notifications.length, color: 'bg-blue-500', icon: <FiBell className="w-6 h-6" /> }
        ];
    }
  };

  const handleQuickAction = (action) => {
    switch (action) {
      // Homeowner actions
      case 'createProject':
        navigate('/projects/new');
        break;
      case 'findContractors':
        navigate('/contractors');
        break;
      case 'viewBids':
        navigate('/bids');
        break;
      case 'trackProgress':
        navigate('/projects');
        break;
      
      // Contractor actions
      case 'browseProjects':
        navigate('/projects');
        break;
      case 'submitBids':
        navigate('/projects');
        break;
      case 'manageJobs':
        navigate('/jobs');
        break;
      case 'updateProfile':
        navigate('/profile');
        break;
      
      // Default actions
      case 'viewProjects':
        navigate('/projects');
        break;
      case 'browseJobs':
        navigate('/jobs');
        break;
      case 'contactSupport':
        navigate('/contactUs')
        break;
      case 'learnMore':
        navigate('/about');
        break;
      default:
        console.log(`Action not implemented: ${action}`);
    }
  };

  const getQuickActions = () => {
    switch (currentRole) {
      case 'HOMEOWNER':
        return [
          { title: 'Create New Project', action: 'createProject', icon: <FiPlus className="w-6 h-6" />, color: 'bg-primary-500 hover:bg-primary-600' },
          { title: 'Find Contractors', action: 'findContractors', icon: <FiSearch className="w-6 h-6" />, color: 'bg-green-500 hover:bg-green-600' },
          { title: 'View Bids', action: 'viewBids', icon: <FiClipboard className="w-6 h-6" />, color: 'bg-yellow-500 hover:bg-yellow-600' },
          { title: 'Track Progress', action: 'trackProgress', icon: <FiTrendingUp className="w-6 h-6" />, color: 'bg-blue-500 hover:bg-blue-600' }
        ];
      case 'CONTRACTOR':
        return [
          { title: 'Browse Projects', action: 'browseProjects', icon: <FiSearch className="w-6 h-6" />, color: 'bg-primary-500 hover:bg-primary-600' },
          { title: 'Submit Bids', action: 'submitBids', icon: <FiEdit className="w-6 h-6" />, color: 'bg-green-500 hover:bg-green-600' },
          { title: 'Manage Jobs', action: 'manageJobs', icon: <FiTool className="w-6 h-6" />, color: 'bg-yellow-500 hover:bg-yellow-600' },
          { title: 'Update Profile', action: 'updateProfile', icon: <FiEdit className="w-6 h-6" />, color: 'bg-blue-500 hover:bg-blue-600' }
        ];
      default:
        return [
          { title: 'View Projects', action: 'viewProjects', icon: <FiEye className="w-6 h-6" />, color: 'bg-primary-500 hover:bg-primary-600' },
          { title: 'Browse Jobs', action: 'browseJobs', icon: <FiBriefcase className="w-6 h-6" />, color: 'bg-green-500 hover:bg-green-600' },
          { title: 'Contact Support', action: 'contactSupport', icon: <FiPhoneCall className="w-6 h-6" />, color: 'bg-yellow-500 hover:bg-yellow-600' },
          { title: 'Learn More', action: 'learnMore', icon: <FiBook className="w-6 h-6" />, color: 'bg-blue-500 hover:bg-blue-600' }
        ];
    }
  };

  // Sample data for charts
  const [chartData, setChartData] = useState([]);
  const [pieData, setPieData] = useState([]);
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  useEffect(() => {
  if (projects.length > 0) {
    const activeProjects = projects.filter(p => p.status === 'IN_PROGRESS');
    const completedProjects = projects.filter(p => p.status === 'COMPLETED');
    const pendingBids = projects.filter(p => p.status === 'PENDING_BIDS');

    const monthlyData = [
      { name: 'Jan', value: projects.filter(p => new Date(p.createdAt).getMonth() === 0).length },
      { name: 'Feb', value: projects.filter(p => new Date(p.createdAt).getMonth() === 1).length },
        { name: 'Mar', value: projects.filter(p => new Date(p.createdAt).getMonth() === 2).length },
        { name: 'Apr', value: projects.filter(p => new Date(p.createdAt).getMonth() === 3).length },
        { name: 'May', value: projects.filter(p => new Date(p.createdAt).getMonth() === 4).length },
        { name: 'Jun', value: projects.filter(p => new Date(p.createdAt).getMonth() === 5).length },
        { name: 'Jul', value: projects.filter(p => new Date(p.createdAt).getMonth() === 6).length },
        { name: 'Aug', value: projects.filter(p => new Date(p.createdAt).getMonth() === 7).length },
        { name: 'Sep', value: projects.filter(p => new Date(p.createdAt).getMonth() === 8).length },
        { name: 'Oct', value: projects.filter(p => new Date(p.createdAt).getMonth() === 9).length },
        { name: 'Nov', value: projects.filter(p => new Date(p.createdAt).getMonth() === 10).length },
        { name: 'Dec', value: projects.filter(p => new Date(p.createdAt).getMonth() === 11).length },
      ];
      setChartData(monthlyData);

     const statusData = [
      { name: 'Active', value: activeProjects.length },
      { name: 'Completed', value: completedProjects.length },
      { name: 'Pending', value: pendingBids.length },
      { name: 'Other', value: projects.length - (activeProjects.length + completedProjects.length + pendingBids.length) },
    ];
    setPieData(statusData);
  }
}, [projects]);

  if (projectsLoading || jobsLoading || notificationsLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary-500 mb-4"></div>
          <p className="text-primary-500 font-medium">Loading your dashboard...</p>
        </div>
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
            <div key={index} className="bg-white rounded-lg shadow-md hover:shadow-xl p-6 transform hover:scale-105 transition-all duration-200 cursor-pointer border-t-4 border-t-transparent hover:border-t-4 hover:border-t-primary-500">
              <div className="flex items-center">
                <div className={`${stat.color} rounded-full p-3 text-white flex items-center justify-center`}>
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

        {/* Analytics Section */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Analytics Overview</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Bar Chart */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-700 mb-4">Monthly Activity</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="value" name="Projects" fill="#4F46E5" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
            {/* Pie Chart */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-700 mb-4">Project Status Distribution</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {getQuickActions().map((action, index) => (
              <button
                key={index}
                className={`${action.color} text-white p-4 rounded-lg font-medium transition-all duration-200 transform hover:scale-102 hover:shadow-lg flex flex-col items-center justify-center`}
                onClick={() => handleQuickAction(action.action)}
              >
                <div className="flex flex-col items-center justify-center">
                  <div className="mb-2">{action.icon}</div>
                  <div className="text-sm font-medium">{action.title}</div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Projects */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Recent Projects</h2>
              <button 
                className="text-primary-500 hover:text-primary-700 text-sm font-medium flex items-center"
                onClick={() => navigate('/projects')}
              >
                View All <FiEye className="ml-1" />
              </button>
            </div>
            {projects.length > 0 ? (
              <div className="space-y-4">
                {projects.slice(0, 5).map((project) => (
                  <div key={project.id} className="border-l-4 border-primary-500 pl-4 py-3 hover:bg-gray-50 transition-colors duration-200 cursor-pointer rounded-r-md shadow-sm hover:shadow">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium text-gray-900">{project.title}</h3>
                        <p className="text-sm text-gray-600 mt-1">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${project.status === 'IN_PROGRESS' ? 'bg-blue-100 text-blue-800' : project.status === 'COMPLETED' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                            {project.status.replace('_', ' ')}
                          </span>
                        </p>
                      </div>
                      <p className="text-xs text-gray-500">{new Date(project.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-10 bg-gray-50 rounded-lg">
                <FiClipboard className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">No projects</h3>
                <p className="mt-1 text-sm text-gray-500">Get started by creating your first project.</p>
                <div className="mt-6">
                  <button 
                    className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                    onClick={() => navigate('/projects/new')}
                  >
                    <FiPlus className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
                    New Project
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Recent Notifications */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Recent Notifications</h2>
              <button 
                className="text-primary-500 hover:text-primary-700 text-sm font-medium flex items-center"
                onClick={() => navigate('/notifications')}
              >
                View All <FiEye className="ml-1" />
              </button>
            </div>
            {notifications.length > 0 ? (
              <div className="space-y-4">
                {notifications.slice(0, 5).map((notification) => (
                  <div key={notification.id} className="border-l-4 border-yellow-500 pl-4 py-3 hover:bg-gray-50 transition-colors duration-200 cursor-pointer rounded-r-md shadow-sm hover:shadow">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium text-gray-900">{notification.title}</h3>
                        <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                      </div>
                      <p className="text-xs text-gray-500">{new Date(notification.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-10 bg-gray-50 rounded-lg">
                <FiBell className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">No notifications</h3>
                <p className="mt-1 text-sm text-gray-500">You're all caught up!</p>
              </div>
            )}
          </div>
        </div>

        {/* Call to Action */}
        <div className="bg-gradient-to-r from-primary-500 to-primary-600 rounded-lg shadow-xl p-8 mt-8 mb-8 text-center text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-black opacity-10 z-0"></div>
          <div className="relative z-10">
            <h2 className="text-3xl font-bold mb-4">Ready to get started?</h2>
            <p className="text-xl text-primary-100 mb-6">
              {currentRole === 'HOMEOWNER' 
                ? 'Create your first project and connect with qualified contractors'
                : currentRole === 'CONTRACTOR'
                ? 'Browse available projects and submit your bids'
                : 'Explore our platform and discover construction opportunities'
              }
            </p>
            <button 
              className="bg-white text-primary-600 px-8 py-3 rounded-lg font-medium text-lg hover:bg-gray-100 transition-all duration-200 cursor-pointer transform hover:scale-105 hover:shadow-lg flex items-center mx-auto"
              onClick={() => currentRole === 'HOMEOWNER' ? navigate('/projects/new') : navigate('/projects')}
            >
              {currentRole === 'HOMEOWNER' ? (
                <>
                  <FiPlus className="mr-2" />
                  Create Project
                </>
              ) : (
                <>
                  <FiSearch className="mr-2" />
                  Browse Projects
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
