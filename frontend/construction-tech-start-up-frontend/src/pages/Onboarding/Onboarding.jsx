import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const Onboarding = () => {
  const { role } = useParams();
  const navigate = useNavigate();
  const user = useSelector(state => state.auth.user);
  const [currentStep, setCurrentStep] = useState(0);
  const [isCompleting, setIsCompleting] = useState(false);

  const roleConfig = {
    homeowner: {
      title: 'Welcome, Homeowner!',
      description: 'Let\'s get you set up to manage your construction projects effectively.',
      permissions: [
        'Post detailed project requirements',
        'Browse and compare contractor profiles',
        'Request and review project proposals',
        'Track project milestones and progress',
        'Manage payments and contracts',
        'Communicate directly with contractors',
        'Access project documentation and photos'
      ],
      steps: [
        {
          title: 'Project Management Hub',
          description: 'Your dashboard is your command center for all construction projects.',
          features: ['Project overview', 'Milestone tracking', 'Budget management', 'Document storage']
        },
        {
          title: 'Finding Contractors',
          description: 'Browse verified contractors and get competitive proposals.',
          features: ['Contractor profiles', 'Reviews and ratings', 'Proposal comparison', 'Direct messaging']
        },
        {
          title: 'Project Collaboration',
          description: 'Stay connected with your team throughout the project.',
          features: ['Real-time updates', 'Photo sharing', 'Progress reports', 'Issue tracking']
        }
      ]
    },
    contractor: {
      title: 'Welcome, Contractor!',
      description: 'Let\'s help you grow your business and manage projects efficiently.',
      permissions: [
        'Browse available project opportunities',
        'Submit detailed project proposals',
        'Showcase your portfolio and expertise',
        'Manage multiple client projects',
        'Track project timelines and deliverables',
        'Communicate with clients and team members',
        'Receive payments and manage invoicing'
      ],
      steps: [
        {
          title: 'Business Profile',
          description: 'Create a compelling profile to attract quality clients.',
          features: ['Portfolio showcase', 'Service listings', 'Certification display', 'Client testimonials']
        },
        {
          title: 'Project Opportunities',
          description: 'Find and bid on projects that match your expertise.',
          features: ['Project browsing', 'Proposal submission', 'Bid management', 'Client communication']
        },
        {
          title: 'Project Execution',
          description: 'Deliver exceptional results with our project management tools.',
          features: ['Timeline management', 'Progress tracking', 'Resource planning', 'Quality control']
        }
      ]
    },
    other: {
      title: 'Welcome, Professional!',
      description: 'Join our network of construction industry experts and specialists.',
      permissions: [
        'Offer specialized consulting services',
        'Collaborate on complex projects',
        'Share industry expertise and insights',
        'Network with other professionals',
        'Provide technical reviews and assessments',
        'Access industry resources and tools',
        'Participate in professional discussions'
      ],
      steps: [
        {
          title: 'Professional Network',
          description: 'Connect with industry peers and potential collaborators.',
          features: ['Professional directory', 'Expertise matching', 'Collaboration tools', 'Industry forums']
        },
        {
          title: 'Service Offerings',
          description: 'Showcase your specialized skills and services.',
          features: ['Service catalog', 'Expertise areas', 'Case studies', 'Professional credentials']
        },
        {
          title: 'Knowledge Sharing',
          description: 'Contribute to and benefit from collective industry knowledge.',
          features: ['Technical discussions', 'Best practices', 'Industry insights', 'Resource library']
        }
      ]
    }
  };

  const currentRole = roleConfig[role] || roleConfig.other;
  const totalSteps = currentRole.steps.length;

  const handleNext = () => {
    if (currentStep < totalSteps - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = async () => {
    setIsCompleting(true);
    
    // Simulate API call to mark onboarding as complete
    setTimeout(() => {
      navigate('/dashboard');
    }, 1500);
  };

  const handleSkip = () => {
    navigate('/dashboard');
  };

  if (!role || !currentRole) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900">Invalid onboarding link</h2>
          <button
            onClick={() => navigate('/dashboard')}
            className="mt-4 px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{currentRole.title}</h1>
              <p className="text-gray-600 mt-1">{currentRole.description}</p>
            </div>
            <button
              onClick={handleSkip}
              className="text-sm text-gray-500 hover:text-gray-700 font-medium"
            >
              Skip tour
            </button>
          </div>
          
          {/* Progress bar */}
          <div className="mt-6">
            <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
              <span>Step {currentStep + 1} of {totalSteps}</span>
              <span>{Math.round(((currentStep + 1) / totalSteps) * 100)}% complete</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-primary-600 h-2 rounded-full transition-all duration-300 ease-out"
                style={{ width: `${((currentStep + 1) / totalSteps) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main content */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm p-8">
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-primary-600">{currentStep + 1}</span>
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  {currentRole.steps[currentStep].title}
                </h2>
                <p className="text-gray-600">
                  {currentRole.steps[currentStep].description}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                {currentRole.steps[currentStep].features.map((feature, index) => (
                  <div key={index} className="flex items-center p-4 bg-gray-50 rounded-lg">
                    <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center mr-3">
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="text-gray-700 font-medium">{feature}</span>
                  </div>
                ))}
              </div>

              {/* Navigation buttons */}
              <div className="flex justify-between">
                <button
                  onClick={handlePrevious}
                  disabled={currentStep === 0}
                  className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                
                <button
                  onClick={handleNext}
                  disabled={isCompleting}
                  className="px-6 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isCompleting ? (
                    <span className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Setting up...
                    </span>
                  ) : currentStep === totalSteps - 1 ? (
                    'Get Started'
                  ) : (
                    'Next'
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Sidebar - Permissions */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Permissions</h3>
              <div className="space-y-3">
                {currentRole.permissions.map((permission, index) => (
                  <div key={index} className="flex items-start">
                    <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center mr-3 mt-0.5">
                      <svg className="w-3 h-3 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="text-sm text-gray-700">{permission}</span>
                  </div>
                ))}
              </div>
              
              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <h4 className="text-sm font-medium text-blue-900 mb-2">Need more access?</h4>
                <p className="text-xs text-blue-700">
                  You can add additional roles to your account later in your profile settings.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Onboarding;