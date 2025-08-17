import React from 'react';
import { useDispatch } from 'react-redux';
import { openModal } from '../../features/ui/uiSlice';

const Landing = () => {
  const dispatch = useDispatch();

  return (
    <div className="text-center py-12">
      <h1 className="text-4xl font-bold text-gray-900 mb-4">
        Build better with<span className ="text-primary-500"> Smart Constructiont</span> Management
      </h1>
      <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
        Connect with qualified contractors, manage your construction projects, 
        and track progress in real-time with our comprehensive platform for modern construction management.
      </p>
      <div className="flex justify-center space-x-4">
        <button 
          onClick={() => dispatch(openModal('register'))}
          className="bg-primary-500 hover:bg-primary-600 text-white px-8 py-3 rounded-lg font-medium text-lg transition-all duration-200 transform hover:scale-105 hover:shadow-lg cursor-pointer"
        >
          Get Started
        </button>
        <button className="border border-primary-500 text-primary-500 hover:bg-primary-50 px-8 py-3 rounded-lg font-medium text-lg transition-all duration-200 transform hover:scale-105 hover:shadow-lg cursor-pointer">
          Learn More
        </button>
      </div>
      <div className="flex justify-center space-x-35 mt-10">
      <div className="space-x-4">
        <h1 className="text-4xl font-bold">500+</h1>
        <p>Projects Completed</p>
      </div>
      <div className="space-x-4">
        <h1 className="text-4xl font-bold">100+</h1>
        <p>Contractors Registered</p>
      </div>
      <div className="space-x-4">
        <h1 className="text-4xl font-bold">98%</h1>
        <p>Success Rate</p>
      </div>
      </div>
    </div>
  );
};

export default Landing;
