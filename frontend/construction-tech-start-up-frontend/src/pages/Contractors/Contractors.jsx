import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { selectCurrentRole } from '../../features/auth/authSlice';
import { useGetContractorsQuery } from '../../features/contractors/contractorsApi';

const Contractors = () => {
  const currentRole = useSelector(selectCurrentRole);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');
  const [specialties, setSpecialties] = useState([]);
  const [filteredContractors, setFilteredContractors] = useState([]);
  
  const { data: contractorsData, isLoading, error } = useGetContractorsQuery();
  
  const contractors = contractorsData?.contractors || [
    {
      id: 1,
      name: 'John Builder',
      company: 'Premier Construction',
      specialty: ['Residential', 'Renovation'],
      rating: 4.8,
      reviews: 24,
      location: 'Lagos, Nigeria',
      image: 'https://randomuser.me/api/portraits/men/1.jpg',
      verified: true,
      description: 'Experienced contractor specializing in residential construction and renovations with over 15 years in the industry.'
    },
    {
      id: 2,
      name: 'Sarah Mason',
      company: 'Elite Builders',
      specialty: ['Commercial', 'Industrial'],
      rating: 4.6,
      reviews: 18,
      location: 'Abuja, Nigeria',
      image: 'https://randomuser.me/api/portraits/women/2.jpg',
      verified: true,
      description: 'Commercial construction expert with a focus on sustainable building practices and energy-efficient designs.'
    },
    {
      id: 3,
      name: 'Michael Johnson',
      company: 'Johnson & Sons',
      specialty: ['Residential', 'Plumbing'],
      rating: 4.9,
      reviews: 32,
      location: 'Port Harcourt, Nigeria',
      image: 'https://randomuser.me/api/portraits/men/3.jpg',
      verified: true,
      description: 'Family-owned construction business specializing in custom homes and comprehensive plumbing solutions.'
    },
    {
      id: 4,
      name: 'Elizabeth Carpenter',
      company: 'Modern Structures',
      specialty: ['Commercial', 'Electrical'],
      rating: 4.7,
      reviews: 15,
      location: 'Kano, Nigeria',
      image: 'https://randomuser.me/api/portraits/women/4.jpg',
      verified: false,
      description: 'Innovative contractor focusing on modern commercial buildings with advanced electrical systems.'
    },
    {
      id: 5,
      name: 'David Okafor',
      company: 'Okafor Construction',
      specialty: ['Residential', 'Roofing'],
      rating: 4.5,
      reviews: 21,
      location: 'Enugu, Nigeria',
      image: 'https://randomuser.me/api/portraits/men/5.jpg',
      verified: true,
      description: 'Residential construction specialist with expertise in durable, weather-resistant roofing solutions.'
    },
    {
      id: 6,
      name: 'Amina Bello',
      company: 'Bello & Associates',
      specialty: ['Commercial', 'Landscaping'],
      rating: 4.4,
      reviews: 12,
      location: 'Kaduna, Nigeria',
      image: 'https://randomuser.me/api/portraits/women/6.jpg',
      verified: true,
      description: 'Commercial contractor with a passion for integrating beautiful landscaping with functional building designs.'
    }
  ];

  // Available specialty filters
  const specialtyOptions = [
    { value: 'Residential', label: 'Residential' },
    { value: 'Commercial', label: 'Commercial' },
    { value: 'Industrial', label: 'Industrial' },
    { value: 'Renovation', label: 'Renovation' },
    { value: 'Plumbing', label: 'Plumbing' },
    { value: 'Electrical', label: 'Electrical' },
    { value: 'Roofing', label: 'Roofing' },
    { value: 'Landscaping', label: 'Landscaping' }
  ];

  // Filter contractors based on search term, verification status, and specialties
  useEffect(() => {
    if (contractors) {
      let filtered = [...contractors];
      
      // Apply search filter
      if (searchTerm) {
        filtered = filtered.filter(contractor => 
          contractor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          contractor.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
          contractor.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          contractor.location.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }
      
      // Apply verification filter
      if (filter !== 'all') {
        filtered = filtered.filter(contractor => 
          filter === 'verified' ? contractor.verified : !contractor.verified
        );
      }
      
      // Apply specialty filters
      if (specialties.length > 0) {
        filtered = filtered.filter(contractor => 
          specialties.some(specialty => contractor.specialty.includes(specialty))
        );
      }
      
      setFilteredContractors(filtered);
    }
  }, [contractors, searchTerm, filter, specialties]);
  
  // Loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary-500 mb-4"></div>
          <p className="text-primary-500 font-medium">Loading contractors...</p>
        </div>
      </div>
    );
  }
  
  // Error state
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Error Loading Contractors</h2>
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

  const handleSpecialtyChange = (specialty) => {
    if (specialties.includes(specialty)) {
      setSpecialties(specialties.filter(s => s !== specialty));
    } else {
      setSpecialties([...specialties, specialty]);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Find Contractors</h1>
              <p className="mt-2 text-gray-600">
                Browse qualified construction professionals for your projects
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex flex-col space-y-4">
            {/* Search */}
            <div className="w-full">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <input
                  type="text"
                  placeholder="Search contractors by name, company, or location..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
            </div>

            <div className="flex flex-col md:flex-row md:space-x-4 space-y-4 md:space-y-0">
              {/* Verification Filter */}
              <div className="md:w-48">
                <label className="block text-sm font-medium text-gray-700 mb-1">Verification</label>
                <select
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md leading-5 bg-white focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500 cursor-pointer"
                >
                  <option value="all">All Contractors</option>
                  <option value="verified">Verified Only</option>
                  <option value="unverified">Unverified</option>
                </select>
              </div>

              {/* Specialties Filter */}
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">Specialties</label>
                <div className="flex flex-wrap gap-2">
                  {specialtyOptions.map(option => (
                    <button
                      key={option.value}
                      onClick={() => handleSpecialtyChange(option.value)}
                      className={`px-3 py-1 rounded-full text-sm font-medium ${specialties.includes(option.value) ? 'bg-primary-100 text-primary-800 border-primary-300' : 'bg-gray-100 text-gray-800 border-gray-300'} border hover:bg-opacity-80 transition-colors duration-200`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Contractors Grid */}
        {filteredContractors.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredContractors.map((contractor) => (
              <div key={contractor.id} className="bg-white rounded-lg shadow-sm hover:shadow-lg transition-shadow duration-200 overflow-hidden">
                <div className="relative">
                  {/* Contractor Image */}
                  <div className="h-32 bg-gradient-to-r from-primary-500 to-primary-600"></div>
                  <div className="absolute bottom-0 transform translate-y-1/2 left-6">
                    <div className="w-20 h-20 rounded-full border-4 border-white overflow-hidden bg-white">
                      <img 
                        src={contractor.image} 
                        alt={contractor.name} 
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = 'https://via.placeholder.com/150?text=Contractor';
                        }}
                      />
                    </div>
                  </div>
                  {contractor.verified && (
                    <div className="absolute top-4 right-4 bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium flex items-center">
                      <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Verified
                    </div>
                  )}
                </div>
                
                <div className="p-6 pt-12">
                  {/* Contractor Info */}
                  <div className="mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">{contractor.name}</h3>
                    <p className="text-primary-600 font-medium">{contractor.company}</p>
                  </div>
                  
                  {/* Rating */}
                  <div className="flex items-center mb-4">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <svg 
                          key={i} 
                          className={`w-4 h-4 ${i < Math.floor(contractor.rating) ? 'text-yellow-400' : 'text-gray-300'}`} 
                          fill="currentColor" 
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                    <span className="text-sm text-gray-600 ml-2">{contractor.rating} ({contractor.reviews} reviews)</span>
                  </div>
                  
                  {/* Location */}
                  <div className="flex items-center text-sm text-gray-500 mb-4">
                    <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    {contractor.location}
                  </div>
                  
                  {/* Specialties */}
                  <div className="mb-4">
                    <div className="flex flex-wrap gap-2">
                      {contractor.specialty.map((spec, index) => (
                        <span key={index} className="px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded-full">
                          {spec}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  {/* Description */}
                  <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                    {contractor.description}
                  </p>
                  
                  {/* Actions */}
                  <div className="flex space-x-2 mt-4">
                    <button className="flex-1 bg-primary-500 hover:bg-primary-600 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200">
                      View Profile
                    </button>
                    <button className="flex-1 border border-primary-500 text-primary-500 hover:bg-primary-50 px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200">
                      Contact
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">👷</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No contractors found</h3>
            <p className="text-gray-600">
              Try adjusting your search or filter criteria
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Contractors;