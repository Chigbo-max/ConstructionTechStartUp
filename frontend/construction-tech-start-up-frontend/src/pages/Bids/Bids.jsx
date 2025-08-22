import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { selectCurrentRole } from '../../features/auth/authSlice';
import { useGetAllBidsQuery } from '../../features/bids/bidsApi';

const Bids = () => {
  const currentRole = useSelector(selectCurrentRole);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredBids, setFilteredBids] = useState([]);
  
  const { data: bidsData, isLoading, error } = useGetAllBidsQuery();
  
  const bids = bidsData?.bids || [
    {
      id: 1,
      projectId: 101,
      projectTitle: 'Modern Residential Building',
      contractorId: 201,
      contractorName: 'John Builder',
      contractorCompany: 'Premier Construction',
      amount: 15000000,
      duration: '6 months',
      status: 'PENDING',
      createdAt: '2023-06-15T10:30:00Z',
      proposal: 'Comprehensive construction of a modern residential building with high-quality materials and energy-efficient design.',
      attachments: ['proposal.pdf', 'timeline.pdf']
    },
    {
      id: 2,
      projectId: 102,
      projectTitle: 'Office Renovation',
      contractorId: 202,
      contractorName: 'Sarah Mason',
      contractorCompany: 'Elite Builders',
      amount: 8500000,
      duration: '3 months',
      status: 'ACCEPTED',
      createdAt: '2023-06-10T14:45:00Z',
      proposal: 'Complete office renovation including modern workspace design, new electrical systems, and sustainable materials.',
      attachments: ['quote.pdf', 'materials.pdf']
    },
    {
      id: 3,
      projectId: 103,
      projectTitle: 'Kitchen Remodeling',
      contractorId: 203,
      contractorName: 'Michael Johnson',
      contractorCompany: 'Johnson & Sons',
      amount: 3200000,
      duration: '1 month',
      status: 'REJECTED',
      createdAt: '2023-06-05T09:15:00Z',
      proposal: 'Full kitchen remodeling with custom cabinetry, premium countertops, and modern appliance installation.',
      attachments: ['design.pdf']
    },
    {
      id: 4,
      projectId: 104,
      projectTitle: 'Commercial Building Construction',
      contractorId: 204,
      contractorName: 'Elizabeth Carpenter',
      contractorCompany: 'Modern Structures',
      amount: 45000000,
      duration: '12 months',
      status: 'PENDING',
      createdAt: '2023-06-18T11:20:00Z',
      proposal: 'Construction of a state-of-the-art commercial building with sustainable features and smart building technology.',
      attachments: ['proposal.pdf', 'budget.pdf', 'timeline.pdf']
    },
    {
      id: 5,
      projectId: 105,
      projectTitle: 'Roof Replacement',
      contractorId: 205,
      contractorName: 'David Okafor',
      contractorCompany: 'Okafor Construction',
      amount: 2800000,
      duration: '2 weeks',
      status: 'ACCEPTED',
      createdAt: '2023-06-08T13:10:00Z',
      proposal: 'Complete roof replacement with high-quality, weather-resistant materials and a 10-year warranty.',
      attachments: ['quote.pdf']
    },
    {
      id: 6,
      projectId: 106,
      projectTitle: 'Landscape Design and Implementation',
      contractorId: 206,
      contractorName: 'Amina Bello',
      contractorCompany: 'Bello & Associates',
      amount: 5500000,
      duration: '1 month',
      status: 'PENDING',
      createdAt: '2023-06-20T15:30:00Z',
      proposal: 'Comprehensive landscape design and implementation including hardscaping, planting, and irrigation systems.',
      attachments: ['design.pdf', 'plant_list.pdf']
    }
  ];

  // Filter bids based on search term and status filter
  useEffect(() => {
    if (bids) {
      let filtered = [...bids];
      
      // Apply status filter
      if (filter !== 'all') {
        filtered = filtered.filter(bid => bid.status === filter);
      }
      
      // Apply search filter
      if (searchTerm) {
        filtered = filtered.filter(bid => 
          bid.projectTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
          bid.contractorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          bid.contractorCompany.toLowerCase().includes(searchTerm.toLowerCase()) ||
          bid.proposal.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }
      
      setFilteredBids(filtered);
    }
  }, [bids, filter, searchTerm]);
  
  // Loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary-500 mb-4"></div>
          <p className="text-primary-500 font-medium">Loading bids...</p>
        </div>
      </div>
    );
  }
  
  // Error state
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Error Loading Bids</h2>
          <p className="text-gray-700 mb-4">{error.message || 'An unexpected error occurred'}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="bg-primary-500 hover:bg-primary-600 text-white font-medium py-2 px-4 rounded-md"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'PENDING': return 'bg-yellow-100 text-yellow-800';
      case 'ACCEPTED': return 'bg-green-100 text-green-800';
      case 'REJECTED': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'PENDING': return '⏳';
      case 'ACCEPTED': return '✅';
      case 'REJECTED': return '❌';
      default: return '📋';
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-NG', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Project Bids</h1>
              <p className="mt-2 text-gray-600">
                {currentRole === 'HOMEOWNER' 
                  ? 'Review and manage bids from contractors for your projects'
                  : 'Track your submitted bids and their statuses'
                }
              </p>
            </div>
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
                  placeholder="Search bids by project, contractor, or description..."
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
                <option value="all">All Statuses</option>
                <option value="PENDING">Pending</option>
                <option value="ACCEPTED">Accepted</option>
                <option value="REJECTED">Rejected</option>
              </select>
            </div>
          </div>
        </div>

        {/* Bids List */}
        {filteredBids.length > 0 ? (
          <div className="space-y-6">
            {filteredBids.map((bid) => (
              <div key={bid.id} className="bg-white rounded-lg shadow-sm overflow-hidden">
                <div className="p-6">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{bid.projectTitle}</h3>
                      <p className="text-primary-600">{bid.contractorCompany}</p>
                    </div>
                    <div className="mt-2 md:mt-0 flex items-center">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(bid.status)}`}>
                        <span className="mr-1">{getStatusIcon(bid.status)}</span>
                        {bid.status}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div>
                      <p className="text-sm text-gray-500">Bid Amount</p>
                      <p className="text-lg font-semibold text-gray-900">{formatCurrency(bid.amount)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Duration</p>
                      <p className="text-lg font-semibold text-gray-900">{bid.duration}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Submitted On</p>
                      <p className="text-lg font-semibold text-gray-900">{formatDate(bid.createdAt)}</p>
                    </div>
                  </div>

                  <div className="mb-4">
                    <p className="text-sm text-gray-500 mb-1">Proposal</p>
                    <p className="text-gray-700">{bid.proposal}</p>
                  </div>

                  {bid.attachments.length > 0 && (
                    <div className="mb-4">
                      <p className="text-sm text-gray-500 mb-2">Attachments</p>
                      <div className="flex flex-wrap gap-2">
                        {bid.attachments.map((attachment, index) => (
                          <a 
                            key={index} 
                            href="#"
                            className="inline-flex items-center px-3 py-1 rounded-md bg-gray-100 text-gray-700 text-sm hover:bg-gray-200 transition-colors duration-200"
                          >
                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                            </svg>
                            {attachment}
                          </a>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-gray-200">
                    <button className="px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-md text-sm font-medium transition-colors duration-200">
                      View Details
                    </button>
                    
                    {currentRole === 'HOMEOWNER' && bid.status === 'PENDING' && (
                      <>
                        <button className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-md text-sm font-medium transition-colors duration-200">
                          Accept Bid
                        </button>
                        <button className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-md text-sm font-medium transition-colors duration-200">
                          Reject Bid
                        </button>
                      </>
                    )}
                    
                    {currentRole === 'CONTRACTOR' && bid.status === 'PENDING' && (
                      <button className="px-4 py-2 border border-primary-500 text-primary-500 hover:bg-primary-50 rounded-md text-sm font-medium transition-colors duration-200">
                        Edit Bid
                      </button>
                    )}
                    
                    <button className="px-4 py-2 border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-md text-sm font-medium transition-colors duration-200">
                      Contact {currentRole === 'HOMEOWNER' ? 'Contractor' : 'Client'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📝</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No bids found</h3>
            <p className="text-gray-600">
              {searchTerm || filter !== 'all' 
                ? 'Try adjusting your search or filter criteria'
                : currentRole === 'HOMEOWNER'
                ? 'You have no bids on your projects yet'
                : 'You haven\'t submitted any bids yet'
              }
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Bids;