import React from 'react';

const About = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-3xl font-bold text-gray-900">About Construction Tech</h1>
          <p className="mt-2 text-gray-600">Connecting homeowners with qualified construction professionals</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Mission Section */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Our Mission</h2>
            <p className="text-lg text-gray-600 mb-6">
              We're revolutionizing the construction industry by creating a seamless platform that connects 
              homeowners with qualified, vetted construction professionals. Our goal is to make construction 
              projects more accessible, transparent, and efficient for everyone involved.
            </p>
            <p className="text-gray-600">
              Whether you're a homeowner looking to renovate your space or a contractor seeking new opportunities, 
              Construction Tech provides the tools and connections you need to succeed.
            </p>
          </div>

          {/* Vision Section */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Our Vision</h2>
            <p className="text-lg text-gray-600 mb-6">
              To become the leading platform that transforms how construction projects are planned, 
              executed, and managed. We envision a future where finding the right contractor is as 
              simple as ordering food online.
            </p>
            <p className="text-gray-600">
              By leveraging technology and fostering trust between parties, we're building a community 
              that benefits both homeowners and construction professionals.
            </p>
          </div>
        </div>

        {/* Features Grid */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">Why Choose Construction Tech?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Trusted Professionals</h3>
              <p className="text-gray-600">
                All contractors are thoroughly vetted and reviewed by our community to ensure quality and reliability.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Fast & Efficient</h3>
              <p className="text-gray-600">
                Get multiple quotes quickly and efficiently, saving you time and helping you make informed decisions.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Secure Platform</h3>
              <p className="text-gray-600">
                Your project details and communications are protected with enterprise-grade security measures.
              </p>
            </div>
          </div>
        </div>

        {/* Contact Section */}
        <div className="mt-16 bg-white rounded-lg shadow-sm p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Get in Touch</h2>
          <p className="text-gray-600 text-center mb-8">
            Have questions or need support? Our team is here to help you succeed with your construction projects.
          </p>
          <div className="flex justify-center space-x-6">
            <button className="bg-primary-500 hover:bg-primary-600 text-white px-6 py-3 rounded-lg font-medium transition-all duration-200 transform hover:scale-105 hover:shadow-lg cursor-pointer">
              Contact Support
            </button>
            <button className="border border-primary-500 text-primary-500 hover:bg-primary-50 px-6 py-3 rounded-lg font-medium transition-all duration-200 transform hover:scale-105 hover:shadow-lg cursor-pointer">
              Learn More
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
