import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useGetProjectsQuery, useCreateProjectMutation } from '../../features/projects/projectsApi';
import { selectCurrentRole } from '../../features/auth/authSlice';
import { openModal } from '../../features/ui/uiSlice';

const Projects = () => {
  const dispatch = useDispatch();
  const currentRole = useSelector(selectCurrentRole);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  
  const { data: projectsData, isLoading, error } = useGetProjectsQuery();
  const [createProject, { isLoading: isCreating }] = useCreateProjectMutation();

  const projects = Array.isArray(projectsData)
  ? projectsData
  : Array.isArray(projectsData?.projects)
  ? projectsData.projects
  : [];


  const filteredProjects = projects.filter(project => {
    const matchesFilter = filter === 'all' || project.status === filter;
    const matchesSearch = project.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.description?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'PENDING_BIDS': return 'bg-yellow-100 text-yellow-800';
      case 'IN_PROGRESS': return 'bg-blue-100 text-blue-800';
      case 'COMPLETED': return 'bg-green-100 text-green-800';
      case 'CANCELLED': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'PENDING_BIDS': return '⏳';
      case 'IN_PROGRESS': return '🏗️';
      case 'COMPLETED': return '✅';
      case 'CANCELLED': return '❌';
      default: return '📋';
    }
  };

  const handleCreateProject = () => {
    dispatch(openModal('createProject'));
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">😞</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Something went wrong</h2>
          <p className="text-gray-600">Failed to load projects. Please try again later.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Projects</h1>
              <p className="mt-2 text-gray-600">
                {currentRole === 'HOMEOWNER' 
                  ? 'Manage your construction projects and track progress'
                  : 'Browse available projects and submit your bids'
                }
              </p>
            </div>
            {currentRole === 'HOMEOWNER' && (
              <button
                onClick={handleCreateProject}
                className="mt-4 sm:mt-0 bg-primary-500 hover:bg-primary-600 text-white px-6 py-3 rounded-lg font-medium transition-all duration-200 transform hover:scale-105 hover:shadow-lg cursor-pointer"
              >
                + Create Project
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <input
                  type="text"
                  placeholder="Search projects..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
            </div>

            {/* Status Filter */}
            <div className="sm:w-48">
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md leading-5 bg-white focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500 cursor-pointer"
              >
                <option value="all">All Status</option>
                <option value="PENDING_BIDS">Pending Bids</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="COMPLETED">Completed</option>
                <option value="CANCELLED">Cancelled</option>
              </select>
            </div>
          </div>
        </div>

        {/* Projects Grid */}
        {filteredProjects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map((project) => (
              <div key={project.id} className="bg-white rounded-lg shadow-sm hover:shadow-lg transition-shadow duration-200 cursor-pointer transform hover:scale-105">
                <div className="p-6">
                  {/* Project Header */}
                  <div className="flex items-start justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">
                      {project.title}
                    </h3>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(project.status)}`}>
                      <span className="mr-1">{getStatusIcon(project.status)}</span>
                      {project.status.replace('_', ' ')}
                    </span>
                  </div>

                  {/* Project Description */}
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                    {project.description}
                  </p>

                  {/* Project Details */}
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-sm text-gray-500">
                      <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      {project.location || 'Location not specified'}
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {project.deadline ? new Date(project.deadline).toLocaleDateString() : 'No deadline set'}
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                      </svg>
                      Budget: ${project.budget ? project.budget.toLocaleString() : 'Not specified'}
                    </div>
                  </div>

                  {/* Project Actions */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                    <div className="text-xs text-gray-500">
                      Created {new Date(project.createdAt).toLocaleDateString()}
                    </div>
                    <div className="flex space-x-2">
                      {currentRole === 'CONTRACTOR' && project.status === 'PENDING_BIDS' && (
                        <button className="bg-primary-500 hover:bg-primary-600 text-white px-3 py-1 rounded text-sm font-medium transition-colors duration-200 cursor-pointer">
                          Submit Bid
                        </button>
                      )}
                      {currentRole === 'HOMEOWNER' && (
                        <button className="text-primary-600 hover:text-primary-700 text-sm font-medium transition-colors duration-200 cursor-pointer">
                          View Details
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No projects found</h3>
            <p className="text-gray-600">
              {searchTerm || filter !== 'all' 
                ? 'Try adjusting your search or filter criteria'
                : currentRole === 'HOMEOWNER'
                ? 'Create your first project to get started'
                : 'No projects are currently available'
              }
            </p>
            {currentRole === 'HOMEOWNER' && !searchTerm && filter === 'all' && (
              <button
                onClick={handleCreateProject}
                className="mt-4 bg-primary-500 hover:bg-primary-600 text-white px-6 py-3 rounded-lg font-medium transition-all duration-200 transform hover:scale-105 hover:shadow-lg cursor-pointer"
              >
                Create Your First Project
              </button>
            )}
          </div>
        )}

        {/* Pagination */}
        {filteredProjects.length > 0 && (
          <div className="mt-8 flex items-center justify-center">
            <nav className="flex items-center space-x-2">
              <button className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors duration-200 cursor-pointer">
                Previous
              </button>
              <span className="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md">
                Page 1 of 1
              </span>
              <button className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors duration-200 cursor-pointer">
                Next
              </button>
            </nav>
          </div>
        )}
      </div>
    </div>
  );
};

export default Projects;
